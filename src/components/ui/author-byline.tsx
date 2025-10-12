import Image from "next/image";
import Link from "next/link";

interface AuthorBylineProps {
  showImage?: boolean;
  showCredentials?: boolean;
  showDate?: boolean;
  lastUpdated?: string;
}

export function AuthorByline({
  showImage = true,
  showCredentials = true,
  showDate = false,
  lastUpdated
}: AuthorBylineProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
      {showImage && (
        <Link href="/about" className="flex-shrink-0">
          <Image
            src="/optimized/profile-Rob.webp"
            alt="Rob Spain, BCBA"
            width={60}
            height={60}
            className="rounded-full"
          />
        </Link>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/about"
            className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
          >
            Rob Spain
          </Link>
          {showCredentials && (
            <span className="text-sm text-slate-600">
              M.S., BCBA, IBA
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Board Certified Behavior Analyst • 14+ years experience • President, CalABA Education SIG
        </p>
        {showDate && lastUpdated && (
          <p className="text-xs text-slate-500 mt-1">
            Last updated: {lastUpdated}
          </p>
        )}
      </div>
    </div>
  );
}
