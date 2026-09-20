/* Site-owned interactions independent of the vendor/lightbox bundle. */
(function () {
  "use strict";
  const zh = document.documentElement.lang === "zh";
  const themeSelect = document.getElementById("theme-preference");
  if (themeSelect) {
    themeSelect.disabled = false;
    themeSelect.addEventListener("change", () => window.SiteTheme.set(themeSelect.value));
  }
  window.SiteTheme.subscribe((theme, preference) => {
    if (themeSelect) {
      themeSelect.value = preference;
      themeSelect.parentElement.title = themeSelect.selectedOptions[0].textContent;
    }
    const icon = document.getElementById("theme-icon");
    if (icon) icon.className = `fa-solid fa-${preference === "system" ? "desktop" : theme === "dark" ? "moon" : "sun"}`;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color").trim();
  });

  const comments = document.querySelector(".giscus[data-repo]");
  if (comments) {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    Object.assign(script.dataset, comments.dataset, { theme: window.SiteTheme.get() });
    script.async = true;
    script.crossOrigin = "anonymous";
    const syncComments = () => {
      const frame = comments.querySelector("iframe.giscus-frame");
      if (frame && frame.src.startsWith("https://giscus.app/")) {
        frame.contentWindow.postMessage({ giscus: { setConfig: { theme: window.SiteTheme.get() } } }, "https://giscus.app");
      }
    };
    // Giscus may create its lazy iframe after a user has already changed theme.
    new MutationObserver(() => {
      const frame = comments.querySelector("iframe.giscus-frame");
      if (frame && !frame.dataset.themeListener) {
        frame.dataset.themeListener = "true";
        frame.addEventListener("load", syncComments);
        syncComments();
      }
    }).observe(comments, { childList: true, subtree: true });
    window.SiteTheme.subscribe(syncComments);
    comments.append(script);
  }

  // HTML already contains the TOC. JavaScript only enhances its initial state.
  document.querySelectorAll("[data-static-toc]").forEach(toc => {
    toc.open = window.matchMedia("(min-width: 768px)").matches;
  });

  // Preserve non-16:9 dimensions when upgrading traditional video embeds.
  document.querySelectorAll('iframe[src*="youtube.com/embed/"], iframe[src*="youtube-nocookie.com/embed/"], iframe[src*="player.vimeo.com/video/"], iframe.responsive-video').forEach(frame => {
    const width = Number(frame.getAttribute("width"));
    const height = Number(frame.getAttribute("height"));
    if (width > 0 && height > 0 && !frame.style.getPropertyValue("--video-aspect")) {
      frame.style.setProperty("--video-aspect", `${width} / ${height}`);
    }
  });

  document.querySelectorAll("button[data-copy-citation]").forEach(button => {
    button.addEventListener("click", async () => {
      const panel = button.closest(".publication-resources");
      const source = panel.querySelector(".citation-bibtex");
      const status = panel.querySelector(".citation-status");
      try {
        await navigator.clipboard.writeText(source.textContent.trim());
        status.textContent = zh ? "BibTeX 已复制" : "BibTeX copied";
      } catch (_) {
        panel.querySelector("details").open = true;
        status.textContent = zh ? "请从展开的引用中复制。" : "Copy the citation from the expanded text below.";
      }
    });
  });
}());
