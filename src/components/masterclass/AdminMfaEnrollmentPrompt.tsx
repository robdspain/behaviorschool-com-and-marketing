"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, Loader2, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

interface AdminMfaEnrollmentPromptProps {
  email: string;
  onComplete: () => void;
}

interface TwoFactorSetupResponse {
  totpURI?: string;
  backupCodes?: string[];
  message?: string;
}

function parseTotpUri(totpURI: string | null) {
  if (!totpURI) {
    return {
      accountLabel: "",
      issuer: "Behavior School",
      secret: "",
    };
  }

  try {
    const url = new URL(totpURI);
    const accountLabel = decodeURIComponent(url.pathname.replace(/^\//, ""));

    return {
      accountLabel,
      issuer: url.searchParams.get("issuer") ?? "Behavior School",
      secret: url.searchParams.get("secret") ?? "",
    };
  } catch {
    return {
      accountLabel: "",
      issuer: "Behavior School",
      secret: "",
    };
  }
}

export function AdminMfaEnrollmentPrompt({ email, onComplete }: AdminMfaEnrollmentPromptProps) {
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [totpURI, setTotpURI] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<"secret" | "codes" | null>(null);

  const isSetupStarted = Boolean(totpURI);
  const { issuer, secret, accountLabel } = useMemo(() => parseTotpUri(totpURI), [totpURI]);

  const copyValue = async (value: string, field: "secret" | "codes") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setError("Could not copy to clipboard. Please copy it manually.");
    }
  };

  const handleStartSetup = async () => {
    if (!password.trim()) {
      setError("Enter your account password to start MFA setup.");
      return;
    }

    setIsSubmittingPassword(true);
    setError(null);

    try {
      const { data, error: authError } = await authClient.twoFactor.enable({
        password,
        issuer: "Behavior School Admin",
      });

      if (authError || !data?.totpURI) {
        setError(authError?.message ?? "Could not start MFA setup. Check your password and try again.");
        return;
      }

      setTotpURI(data.totpURI);
      setBackupCodes(data.backupCodes ?? []);
    } catch {
      setError("Could not start MFA setup. Please try again.");
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleVerifyCode = async () => {
    const normalizedCode = verificationCode.replace(/\s+/g, "");

    if (!normalizedCode) {
      setError("Enter the 6-digit code from your authenticator app.");
      return;
    }

    setIsVerifyingCode(true);
    setError(null);

    try {
      const { error: authError } = await authClient.twoFactor.verifyTotp({
        code: normalizedCode,
      });

      if (authError) {
        setError(authError.message ?? "The verification code was not accepted. Try the latest code.");
        return;
      }

      onComplete();
    } catch {
      setError("Could not verify your MFA code. Please try again.");
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Set up MFA for your admin account</h2>
            <p className="mt-1 text-sm text-slate-600">
              FERPA A3 now requires TOTP MFA for admin access. Complete enrollment for <span className="font-semibold text-slate-900">{email}</span> before continuing.
            </p>
          </div>
        </div>

        {!isSetupStarted ? (
          <div className="space-y-5">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>First-time enrollment required</AlertTitle>
              <AlertDescription>
                This prompt appears until MFA is enabled. Future sign-ins will require a TOTP code automatically through Better Auth.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="admin-mfa-password">Account password</Label>
              <Input
                id="admin-mfa-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your Better Auth password"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex justify-end">
              <Button onClick={handleStartSetup} disabled={isSubmittingPassword}>
                {isSubmittingPassword ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Generate authenticator setup
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Add this account to your authenticator app</AlertTitle>
              <AlertDescription>
                Use the secret below in Google Authenticator, 1Password, Authy, or another TOTP app, then enter the current 6-digit code.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Issuer</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{issuer}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account</p>
                <p className="mt-1 break-all text-sm font-medium text-slate-900">{accountLabel || email}</p>
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Manual setup secret</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => copyValue(secret, "secret")}>
                    <Copy className="mr-2 h-4 w-4" />
                    {copiedField === "secret" ? "Copied" : "Copy secret"}
                  </Button>
                </div>
                <div className="mt-2 break-all rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm text-slate-900">
                  {secret || "Secret unavailable"}
                </div>
              </div>
            </div>

            {backupCodes.length ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-amber-900">Save your backup codes now</p>
                    <p className="mt-1 text-sm text-amber-800">Store these in your password manager. Each code works once if you lose access to your authenticator app.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => copyValue(backupCodes.join("\n"), "codes")}>
                    <Copy className="mr-2 h-4 w-4" />
                    {copiedField === "codes" ? "Copied" : "Copy codes"}
                  </Button>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {backupCodes.map((code) => (
                    <div key={code} className="rounded-lg border border-amber-200 bg-white px-3 py-2 font-mono text-sm text-slate-900">
                      {code}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="admin-mfa-code">Verification code</Label>
              <Input
                id="admin-mfa-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="123456"
              />
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex justify-end">
              <Button onClick={handleVerifyCode} disabled={isVerifyingCode}>
                {isVerifyingCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Verify and enable MFA
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
