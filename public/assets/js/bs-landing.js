(() => {
  try {
    const supportsScroll = "scrollBehavior" in document.documentElement.style;
    if (!supportsScroll) return;
    const links = Array.from(document.querySelectorAll('a[href^="#"]'));
    for (const link of links) {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href) return;
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      });
    }
  } catch {}
})();