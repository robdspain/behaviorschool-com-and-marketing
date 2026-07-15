export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { api, getConvexClient } from '@/lib/convex';
import type { MasterclassResource } from '@/lib/masterclass/admin-types';

// GET all resources
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await getConvexClient().query(api.masterclassAdmin.listResources, {});
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Unexpected error fetching resources:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST a new resource
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const newResource: Omit<MasterclassResource, 'id' | 'created_at' | 'updated_at'> = await request.json();
    const data = await getConvexClient().mutation(api.masterclassAdmin.createResource, {
      sectionId: newResource.section_id ? String(newResource.section_id) : undefined,
      name: newResource.name,
      url: newResource.url,
      fileType: newResource.file_type || 'link',
      orderIndex: newResource.order_index,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Unexpected error creating resource:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT to update order or fields for multiple resources
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Reorder payload: { idsInOrder: string[] }
    if (Array.isArray(body?.idsInOrder)) {
      await getConvexClient().mutation(api.masterclassAdmin.reorderResources, {
        idsInOrder: body.idsInOrder,
      });
      return NextResponse.json({ success: true });
    }

    // Single resource update: { id, ...fields }
    if (typeof body?.id === 'string') {
      const { id, ...fields } = body as Partial<MasterclassResource> & { id: string };
      const data = await getConvexClient().mutation(api.masterclassAdmin.updateResource, {
        id,
        sectionId: fields.section_id ? String(fields.section_id) : undefined,
        name: fields.name,
        url: fields.url,
        fileType: fields.file_type,
        orderIndex: fields.order_index,
      });
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    console.error('Unexpected error updating resources:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a resource by id (expects ?id=123)
export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }

    await getConvexClient().mutation(api.masterclassAdmin.deleteResource, { id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error deleting resource:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
