import type { MutationCtx } from "./_generated/server";

export type AuditLogEntry = {
  timestamp?: number;
  category: "auth" | "student_data" | "admin_action";
  actionType: string;
  resource: string;
  status: "success" | "failure";
  actorUserId?: string;
  actorEmail?: string;
  resourceId?: string;
  method?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: unknown;
};

export async function writeAuditLog(ctx: MutationCtx, entry: AuditLogEntry) {
  await ctx.db.insert("auditLogs", {
    timestamp: entry.timestamp ?? Date.now(),
    category: entry.category,
    actionType: entry.actionType,
    resource: entry.resource,
    status: entry.status,
    actorUserId: entry.actorUserId,
    actorEmail: entry.actorEmail,
    resourceId: entry.resourceId,
    method: entry.method,
    ipAddress: entry.ipAddress,
    userAgent: entry.userAgent,
    metadata: entry.metadata,
  });
}
