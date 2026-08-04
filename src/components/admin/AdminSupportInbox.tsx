'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Bug,
  CheckCircle2,
  Clock,
  ExternalLink,
  Inbox,
  Mail,
  RefreshCw,
  Save,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type SupportStatus =
  | 'new'
  | 'triaged'
  | 'waiting_on_support'
  | 'waiting_on_customer'
  | 'bug_logged'
  | 'resolved'
  | 'closed'
  | 'spam';
type SupportPriority = 'low' | 'normal' | 'high' | 'urgent';

interface SupportTicket {
  id: string;
  ticket_number: string;
  source: string;
  status: SupportStatus;
  priority: SupportPriority;
  category: string;
  product_area: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  page_url: string | null;
  platform: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  internal_notes: string;
  first_response_at: string | null;
  last_response_at: string | null;
  last_customer_message_at: string | null;
  resolved_at: string | null;
  created_at: string;
}

interface SupportTicketEvent {
  id: string;
  actor_type: 'customer' | 'admin' | 'system';
  actor_email: string | null;
  event_type: string;
  body: string | null;
  created_at: string;
}

const statuses: SupportStatus[] = [
  'new',
  'triaged',
  'waiting_on_support',
  'waiting_on_customer',
  'bug_logged',
  'resolved',
  'closed',
  'spam',
];
const priorities: SupportPriority[] = ['low', 'normal', 'high', 'urgent'];
const statusLabels: Record<SupportStatus, string> = {
  new: 'New',
  triaged: 'Triaged',
  waiting_on_support: 'Waiting on support',
  waiting_on_customer: 'Waiting on customer',
  bug_logged: 'Bug logged',
  resolved: 'Resolved',
  closed: 'Closed',
  spam: 'Spam',
};

function formatDate(value: string | null) {
  if (!value) return 'Not set';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function ageInHours(value: string) {
  return Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 36e5));
}

function needsAttention(ticket: SupportTicket) {
  return ['new', 'triaged', 'waiting_on_support', 'bug_logged'].includes(ticket.status);
}

function metadataText(ticket: SupportTicket, key: string) {
  const value = ticket.metadata?.[key];
  return typeof value === 'string' && value.trim() ? value : null;
}

async function readError(response: Response) {
  try {
    const body = await response.json();
    return body.error || 'The support request failed';
  } catch {
    return 'The support request failed';
  }
}

export function AdminSupportInbox() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'open' | SupportStatus | 'all'>('open');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [draftNotes, setDraftNotes] = useState('');
  const [ticketEvents, setTicketEvents] = useState<SupportTicketEvent[]>([]);

  const loadTickets = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/support', { cache: 'no-store' });
      if (!response.ok) throw new Error(await readError(response));
      const data = await response.json();
      const rows = (data.tickets || []) as SupportTicket[];
      setTickets(rows);
      setSelectedId((current) => current || rows[0]?.id || null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadTicketEvents = async (ticketId: string) => {
    try {
      const response = await fetch('/api/admin/support?ticketId=' + encodeURIComponent(ticketId), { cache: 'no-store' });
      if (!response.ok) throw new Error(await readError(response));
      const data = await response.json();
      setTicketEvents((data.events || []) as SupportTicketEvent[]);
    } catch (error) {
      setTicketEvents([]);
      setNotice(error instanceof Error ? error.message : 'Unable to load ticket history');
    }
  };

  useEffect(() => {
    void loadTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'open'
          ? !['resolved', 'closed', 'spam'].includes(ticket.status)
          : ticket.status === statusFilter);
      if (!statusMatch) return false;
      if (!normalizedQuery) return true;
      return [
        ticket.ticket_number,
        ticket.name,
        ticket.email,
        ticket.subject,
        ticket.message,
        ticket.category,
        ticket.product_area || '',
        (ticket.tags || []).join(' '),
        JSON.stringify(ticket.metadata || {}),
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [tickets, statusFilter, query]);

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId) || filteredTickets[0] || null;

  useEffect(() => {
    setDraftNotes(selectedTicket?.internal_notes || '');
    if (selectedTicket?.id) void loadTicketEvents(selectedTicket.id);
    else setTicketEvents([]);
  }, [selectedTicket?.id, selectedTicket?.internal_notes]);

  const updateTicket = async (
    ticketId: string,
    patch: Partial<Pick<SupportTicket, 'status' | 'priority' | 'product_area' | 'internal_notes' | 'last_response_at'>>,
    eventType?: string,
  ) => {
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, patch, eventType }),
      });
      if (!response.ok) throw new Error(await readError(response));
      const data = await response.json();
      setTickets((current) => current.map((ticket) => (ticket.id === ticketId ? data.ticket : ticket)));
      if (eventType) await loadTicketEvents(ticketId);
      setNotice('Support ticket updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to update support ticket');
    } finally {
      setSaving(false);
    }
  };

  const openCount = tickets.filter(needsAttention).length;
  const unresolvedBugCount = tickets.filter(
    (ticket) => ticket.category === 'bug' && !['resolved', 'closed', 'spam'].includes(ticket.status),
  ).length;
  const highPriorityCount = tickets.filter(
    (ticket) => ['high', 'urgent'].includes(ticket.priority) && !['resolved', 'closed', 'spam'].includes(ticket.status),
  ).length;
  const waitingOnSupportCount = tickets.filter((ticket) => ticket.status === 'waiting_on_support' || ticket.status === 'new').length;

  return (
    <div className="space-y-6">
      {notice && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{notice}</div>}

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-lg border-slate-200">
          <CardContent className="flex items-center gap-3 pt-6"><Inbox className="h-5 w-5 text-emerald-700" /><div><p className="text-2xl font-semibold">{openCount}</p><p className="text-sm text-slate-500">Open tickets</p></div></CardContent>
        </Card>
        <Card className="rounded-lg border-slate-200">
          <CardContent className="flex items-center gap-3 pt-6"><Clock className="h-5 w-5 text-amber-700" /><div><p className="text-2xl font-semibold">{waitingOnSupportCount}</p><p className="text-sm text-slate-500">Need response</p></div></CardContent>
        </Card>
        <Card className="rounded-lg border-slate-200">
          <CardContent className="flex items-center gap-3 pt-6"><AlertCircle className="h-5 w-5 text-red-600" /><div><p className="text-2xl font-semibold">{highPriorityCount}</p><p className="text-sm text-slate-500">High priority</p></div></CardContent>
        </Card>
        <Card className="rounded-lg border-slate-200">
          <CardContent className="flex items-center gap-3 pt-6"><Bug className="h-5 w-5 text-emerald-700" /><div><p className="text-2xl font-semibold">{unresolvedBugCount}</p><p className="text-sm text-slate-500">Open bug reports</p></div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card className="rounded-lg border-slate-200">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between gap-3"><CardTitle className="text-lg">Support Queue</CardTitle><Button variant="outline" size="sm" onClick={() => void loadTickets()} disabled={loading}><RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} /> Refresh</Button></div>
            <div className="relative"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tickets" className="pl-9" /></div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
              <option value="open">Open tickets</option><option value="all">All tickets</option>{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
            </select>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {loading && <p className="py-8 text-center text-sm text-slate-500">Loading support tickets...</p>}
              {!loading && filteredTickets.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No support tickets match this view.</p>}
              {filteredTickets.map((ticket) => (
                <button key={ticket.id} onClick={() => setSelectedId(ticket.id)} className={cn('w-full rounded-lg border p-3 text-left transition-colors', selectedTicket?.id === ticket.id ? 'border-emerald-700 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50')}>
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{ticket.subject}</p><p className="mt-1 truncate text-xs text-slate-500">{ticket.name} - {ticket.email}</p></div><Badge variant={ticket.priority === 'urgent' || ticket.priority === 'high' ? 'destructive' : 'secondary'}>{ticket.priority}</Badge></div>
                  <div className="mt-3 flex flex-wrap items-center gap-2"><Badge variant="outline">{ticket.ticket_number}</Badge><Badge variant="outline">{statusLabels[ticket.status]}</Badge>{(ticket.tags || []).includes('nurture-feedback') && <Badge variant="secondary">Nurture feedback</Badge>}<span className="text-xs text-slate-500">{ageInHours(ticket.last_customer_message_at || ticket.created_at)}h since customer</span></div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-slate-200">
          {selectedTicket ? (
            <>
              <CardHeader>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div><div className="mb-2 flex flex-wrap gap-2"><Badge variant="outline">{selectedTicket.ticket_number}</Badge><Badge variant="secondary">{selectedTicket.category.replace(/_/g, ' ')}</Badge><Badge variant={selectedTicket.priority === 'urgent' || selectedTicket.priority === 'high' ? 'destructive' : 'outline'}>{selectedTicket.priority}</Badge></div><CardTitle className="text-xl text-slate-900">{selectedTicket.subject}</CardTitle><p className="mt-2 text-sm text-slate-500">From {selectedTicket.name} at {selectedTicket.email} - {formatDate(selectedTicket.created_at)}</p></div>
                  <a href={'mailto:' + selectedTicket.email + '?subject=' + encodeURIComponent('Re: ' + selectedTicket.subject + ' [' + selectedTicket.ticket_number + ']')} className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-medium text-slate-900 hover:bg-emerald-50" onClick={() => void updateTicket(selectedTicket.id, { status: 'waiting_on_customer', last_response_at: new Date().toISOString() }, 'reply_logged')}><Mail className="mr-2 h-4 w-4" /> Reply by email</a>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4"><p className="whitespace-pre-wrap text-sm leading-6 text-slate-800">{selectedTicket.message}</p></div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2"><Label>Status</Label><select value={selectedTicket.status} onChange={(event) => void updateTicket(selectedTicket.id, { status: event.target.value as SupportStatus }, 'status_changed')} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">{statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></div>
                  <div className="space-y-2"><Label>Priority</Label><select value={selectedTicket.priority} onChange={(event) => void updateTicket(selectedTicket.id, { priority: event.target.value as SupportPriority }, 'priority_changed')} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">{priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select></div>
                  <div className="space-y-2"><Label>Product area</Label><Input value={selectedTicket.product_area || ''} onChange={(event) => setTickets((current) => current.map((ticket) => ticket.id === selectedTicket.id ? { ...ticket, product_area: event.target.value } : ticket))} onBlur={(event) => void updateTicket(selectedTicket.id, { product_area: event.target.value })} placeholder="Quiz, billing, onboarding" /></div>
                </div>
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div><p className="font-medium text-slate-900">Response tracking</p><p className="mt-1 text-slate-500">First response: {formatDate(selectedTicket.first_response_at)}</p><p className="text-slate-500">Last response: {formatDate(selectedTicket.last_response_at)}</p><p className="text-slate-500">Last customer message: {formatDate(selectedTicket.last_customer_message_at)}</p><p className="text-slate-500">Resolved: {formatDate(selectedTicket.resolved_at)}</p></div>
                  <div><p className="font-medium text-slate-900">Context</p><p className="mt-1 text-slate-500">Source: {selectedTicket.source}</p><p className="text-slate-500">Platform: {selectedTicket.platform || 'unknown'}</p>{metadataText(selectedTicket, 'campaignStep') && <p className="text-slate-500">Campaign: {metadataText(selectedTicket, 'campaignStep')}</p>}{metadataText(selectedTicket, 'feedbackReason') && <p className="text-slate-500">Feedback reason: {metadataText(selectedTicket, 'feedbackReason')?.replace(/_/g, ' ')}</p>}{(selectedTicket.tags || []).length > 0 && <p className="text-slate-500">Tags: {selectedTicket.tags.join(', ')}</p>}{selectedTicket.page_url && <a className="inline-flex items-center gap-1 text-emerald-800 underline" href={selectedTicket.page_url} target="_blank" rel="noreferrer">Open submitted page <ExternalLink className="h-3 w-3" /></a>}</div>
                </div>
                <div className="space-y-3"><div className="flex items-center justify-between gap-3"><p className="font-medium text-slate-900">Ticket history</p><Button variant="ghost" size="sm" onClick={() => void loadTicketEvents(selectedTicket.id)}><RefreshCw className="mr-2 h-4 w-4" /> Refresh history</Button></div>{ticketEvents.length === 0 && <p className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500">No ticket history has been recorded yet.</p>}{ticketEvents.map((event) => <div key={event.id} className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex flex-wrap items-center gap-2 text-sm"><Badge variant={event.actor_type === 'customer' ? 'secondary' : 'outline'}>{event.event_type.replace(/_/g, ' ')}</Badge><span className="text-slate-500">{formatDate(event.created_at)}</span>{event.actor_email && <span className="text-slate-500">from {event.actor_email}</span>}</div>{event.body && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-800">{event.body}</p>}</div>)}</div>
                <div className="space-y-2"><Label htmlFor="central-support-internal-notes">Internal notes</Label><Textarea id="central-support-internal-notes" value={draftNotes} onChange={(event) => setDraftNotes(event.target.value)} rows={6} placeholder="Summarize the fix, customer response, bug link, or next action." /><div className="flex flex-wrap gap-2"><Button onClick={() => void updateTicket(selectedTicket.id, { internal_notes: draftNotes }, 'note_added')} disabled={saving} className="bg-emerald-800 hover:bg-emerald-900"><Save className="mr-2 h-4 w-4" /> Save notes</Button><Button variant="outline" onClick={() => void updateTicket(selectedTicket.id, { status: 'resolved', last_response_at: new Date().toISOString() }, 'status_changed')} disabled={saving}><CheckCircle2 className="mr-2 h-4 w-4" /> Mark resolved</Button><Button variant="outline" onClick={() => void updateTicket(selectedTicket.id, { status: 'bug_logged' }, 'bug_linked')} disabled={saving}><Bug className="mr-2 h-4 w-4" /> Mark bug logged</Button></div></div>
              </CardContent>
            </>
          ) : <CardContent className="py-16 text-center text-sm text-slate-500">Select a support ticket to review.</CardContent>}
        </Card>
      </div>
    </div>
  );
}
