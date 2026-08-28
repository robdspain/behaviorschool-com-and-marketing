import { Bell, ClipboardCheck, Lock, UsersRound } from "lucide-react";

type InviteOnlyProductPreviewProps = {
  product: "pro" | "supervision";
  className?: string;
};

export function InviteOnlyProductPreview({
  product,
  className = "",
}: InviteOnlyProductPreviewProps) {
  const isPro = product === "pro";
  const Icon = isPro ? ClipboardCheck : UsersRound;
  const title = isPro ? "BehaviorSchool Pro" : "Supervision Workspace";
  const description = isPro
    ? "Invite-only FBA/BIP workspace in development. Public account creation is not available."
    : "Invite-only supervision workspace in development. Public account creation is not available.";

  return (
    <div
      className={`overflow-hidden border border-white/15 bg-[#0a2019]/90 ${className}`}
      aria-label={`${title} invite-only preview`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2 text-white/75">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-white/70">
          <Bell className="h-3 w-3" aria-hidden="true" /> Invite only
        </span>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-2 text-[11px] leading-5 text-white/60">{description}</p>
        <div className="mt-3 rounded-md border border-white/10 bg-white/5 p-2.5 text-[10px] text-white/55">
          Concept preview only. Not available for public signup today.
        </div>
      </div>
    </div>
  );
}
