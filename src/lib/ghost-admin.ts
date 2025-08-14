/*
  Ghost Admin API helpers for member management
  - Handles newsletter subscriptions
  - Creates and manages members
  - Uses JWT authentication with Admin API
*/

import jwt from 'jsonwebtoken';

export interface GhostMember {
  id?: string;
  email: string;
  name?: string;
  note?: string;
  subscribed?: boolean;
  labels?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface GhostNewsletter {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sender_name?: string;
  sender_email?: string;
  sender_reply_to?: string;
  status: 'active' | 'archived';
  visibility: 'members' | 'paid';
  subscribe_on_signup: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export class GhostAdminAPI {
  private adminUrl: string;
  private adminKey: string;
  private version = 'v5.0';

  constructor() {
    const url = process.env.GHOST_ADMIN_URL || process.env.GHOST_CONTENT_URL;
    const key = process.env.GHOST_ADMIN_KEY;

    if (!url) {
      throw new Error('GHOST_ADMIN_URL is not configured');
    }
    if (!key) {
      throw new Error('GHOST_ADMIN_KEY is not configured');
    }

    this.adminUrl = url.replace(/\/$/, '');
    this.adminKey = key;
  }

  private generateToken(): string {
    // Ghost Admin API key format: {id}:{secret}
    const [id, secret] = this.adminKey.split(':');
    
    if (!id || !secret) {
      throw new Error('Invalid GHOST_ADMIN_KEY format. Expected format: id:secret');
    }

    const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
      keyid: id,
      algorithm: 'HS256',
      expiresIn: '5m',
      audience: `/admin/`
    });

    return token;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.generateToken();
    const url = `${this.adminUrl}/ghost/api/admin/${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Ghost ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Accept-Version': this.version,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `Ghost Admin API error: ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody.errors && errorBody.errors.length > 0) {
          errorMessage = errorBody.errors[0].message || errorMessage;
        }
      } catch {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getNewsletters(): Promise<{ newsletters: GhostNewsletter[] }> {
    return this.makeRequest<{ newsletters: GhostNewsletter[] }>('newsletters/');
  }

  async createMember(member: {
    email: string;
    name?: string;
    note?: string;
    labels?: string[];
    newsletters?: { id: string }[];
  }): Promise<{ members: GhostMember[] }> {
    // If newsletters not specified, subscribe to all default newsletters
    let newslettersToSubscribe = member.newsletters;
    
    if (!newslettersToSubscribe) {
      const { newsletters } = await this.getNewsletters();
      newslettersToSubscribe = newsletters
        .filter(n => n.status === 'active' && n.subscribe_on_signup)
        .map(n => ({ id: n.id }));
    }

    return this.makeRequest<{ members: GhostMember[] }>('members/', {
      method: 'POST',
      body: JSON.stringify({
        members: [{
          email: member.email,
          name: member.name,
          note: member.note,
          labels: member.labels,
          newsletters: newslettersToSubscribe,
        }]
      }),
    });
  }

  async getMemberByEmail(email: string): Promise<GhostMember | null> {
    try {
      const response = await this.makeRequest<{ members: GhostMember[] }>(
        `members/?filter=email:${encodeURIComponent(email)}`
      );
      return response.members.length > 0 ? response.members[0] : null;
    } catch {
      return null;
    }
  }

  async updateMember(id: string, updates: Partial<GhostMember>): Promise<{ members: GhostMember[] }> {
    return this.makeRequest<{ members: GhostMember[] }>(`members/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        members: [updates]
      }),
    });
  }

  async subscribeMember(email: string, name?: string, source?: string): Promise<GhostMember> {
    // Check if member already exists
    const existingMember = await this.getMemberByEmail(email);
    
    if (existingMember) {
      // Update existing member to ensure they're subscribed
      const { members } = await this.updateMember(existingMember.id!, {
        subscribed: true,
        name: name || existingMember.name,
      });
      return members[0];
    }

    // Create new member
    const labels = source ? [source] : [];
    const { members } = await this.createMember({
      email,
      name,
      labels,
      note: source ? `Subscribed via ${source}` : undefined,
    });
    
    return members[0];
  }
}

// Singleton instance
let ghostAdminInstance: GhostAdminAPI | null = null;

export function getGhostAdminAPI(): GhostAdminAPI {
  if (!ghostAdminInstance) {
    ghostAdminInstance = new GhostAdminAPI();
  }
  return ghostAdminInstance;
}