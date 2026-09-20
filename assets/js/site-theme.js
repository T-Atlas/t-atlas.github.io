/* One theme state for navigation, articles, diagrams and comments. Loaded before CSS. */
(function () {
  "use strict";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const readPreference = () => {
    try { return localStorage.getItem("theme"); } catch (_) { return null; }
  };
  const current = () => root.dataset.theme === "dark" ? "dark" : "light";
  function apply(theme) {
    if (theme === "dark") root.dataset.theme = "dark";
    else root.removeAttribute("data-theme");
    root.style.colorScheme = theme;
    document.dispatchEvent(new CustomEvent("site:theme-change", { detail: { theme } }));
  }
  function set(preference) {
    try {
      if (preference === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", preference);
    } catch (_) { /* Theme still works when storage is unavailable. */ }
    apply(preference === "dark" || preference === "light" ? preference : media.matches ? "dark" : "light");
  }
  window.SiteTheme = {
    get: current,
    set,
    toggle: () => set(current() === "dark" ? "light" : "dark"),
    subscribe(callback) {
      const listener = event => callback(event.detail.theme);
      document.addEventListener("site:theme-change", listener);
      callback(current());
      return () => document.removeEventListener("site:theme-change", listener);
    }
  };
  const saved = readPreference();
  apply(saved === "dark" || saved === "light" ? saved : media.matches ? "dark" : "light");
  media.addEventListener("change", () => {
    const preference = readPreference();
    if (preference !== "dark" && preference !== "light") apply(media.matches ? "dark" : "light");
  });
  window.addEventListener("storage", event => {
    if (event.key === "theme" || event.key === null) {
      const preference = readPreference();
      apply(preference === "dark" || preference === "light" ? preference : media.matches ? "dark" : "light");
    }
  });
}());
