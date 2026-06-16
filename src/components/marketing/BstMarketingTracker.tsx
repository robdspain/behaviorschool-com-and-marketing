"use client";

import { useEffect } from "react";

type BstMarketingTrackerProps = {
  source?: string;
};

const visitorStorageKey = "bst_visitor_id";
const sessionStorageKey = "bst_session_id";

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function getStoredId(storage: Storage, key: string, prefix: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const next = makeId(prefix);
  storage.setItem(key, next);
  return next;
}

function attributionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    referrer: document.referrer || "",
  };
}

function sendMarketingEvent(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  const endpoint = "/api/behavior-study-tools/marketing-events";

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon(endpoint, blob)) return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Marketing events must never block navigation.
  });
}

function studyPathFromDestination(destination: string) {
  if (destination.includes("/onboarding/rbt")) return "rbt";
  if (destination.includes("/onboarding/bcba")) return "bcba";
  if (destination.toLowerCase().includes("rbt")) return "rbt";
  return "bcba";
}

function appendJourneyIds(destination: string, visitorId: string, sessionId: string) {
  try {
    const url = new URL(destination);
    if (url.hostname !== "study.behaviorschool.com") return destination;
    url.searchParams.set("bst_visitor", visitorId);
    url.searchParams.set("bst_session", sessionId);
    return url.toString();
  } catch {
    return destination;
  }
}

export function BstMarketingTracker({ source = "behaviorstudytools.com" }: BstMarketingTrackerProps) {
  useEffect(() => {
    const visitorId = getStoredId(window.localStorage, visitorStorageKey, "bstv");
    const sessionId = getStoredId(window.sessionStorage, sessionStorageKey, "bsts");
    const basePayload = {
      source,
      visitorId,
      sessionId,
      pagePath: window.location.pathname,
      url: window.location.href,
      title: document.title,
      attribution: attributionFromUrl(),
    };

    sendMarketingEvent({
      ...basePayload,
      event: "page_view",
    });

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest<HTMLAnchorElement>("a[data-bst-cta]");
      if (!link) return;

      const destination = appendJourneyIds(link.href, visitorId, sessionId);
      if (destination !== link.href) {
        link.href = destination;
      }

      sendMarketingEvent({
        ...basePayload,
        event: "cta_click",
        location: link.dataset.bstLocation || "unknown_cta",
        intent: link.dataset.bstIntent || "start_practice",
        destination,
        studyPath: link.dataset.bstStudyPath || studyPathFromDestination(destination),
        ctaText: link.textContent?.replace(/\s+/g, " ").trim().slice(0, 160) || "",
      });
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [source]);

  return null;
}
