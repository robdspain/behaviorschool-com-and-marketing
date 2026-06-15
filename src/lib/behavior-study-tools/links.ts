const STUDY_APP_ORIGIN = "https://study.behaviorschool.com";

export function behaviorStudyToolsAppHref(
  path = "/onboarding/bcba",
  params: Record<string, string> = {}
) {
  const url = new URL(path, STUDY_APP_ORIGIN);
  const defaults: Record<string, string> = {
    utm_source: "behaviorstudytools",
    utm_medium: "owned_marketing",
    utm_campaign: "bst_web_growth",
  };

  Object.entries({ ...defaults, ...params }).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  return url.toString();
}
