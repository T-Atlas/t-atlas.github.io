/* Site-owned interactions independent of the vendor/lightbox bundle. */
(function () {
  "use strict";
  const zh = document.documentElement.lang === "zh";
  const themeButton = document.querySelector("#theme-toggle button");
  if (themeButton) themeButton.addEventListener("click", window.SiteTheme.toggle);
  window.SiteTheme.subscribe(theme => {
    if (themeButton) themeButton.setAttribute("aria-pressed", String(theme === "dark"));
    const icon = document.getElementById("theme-icon");
    if (icon) icon.className = `fa-solid fa-${theme === "dark" ? "moon" : "sun"}`;
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

  document.querySelectorAll("[data-auto-toc]").forEach(toc => {
    const links = toc.querySelector("ol");
    const headings = document.querySelectorAll(".page__content h2[id], .page__content h3[id]");
    headings.forEach(heading => {
      const item = document.createElement("li");
      item.className = heading.tagName === "H3" ? "toc-subheading" : "toc-heading";
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      item.append(link);
      links.append(item);
    });
    if (!headings.length) toc.hidden = true;
    else toc.open = window.matchMedia("(min-width: 768px)").matches;
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
