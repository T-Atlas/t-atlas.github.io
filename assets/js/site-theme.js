/* One theme preference and computed color scheme for the entire site. */
(function () {
  "use strict";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const normalize = value => value === "light" || value === "dark" ? value : "system";
  const readPreference = () => {
    try { return normalize(localStorage.getItem("theme")); } catch (_) { return "system"; }
  };
  let preference = readPreference();
  const current = () => root.dataset.theme === "dark" ? "dark" : "light";
  function apply() {
    const theme = preference === "system" ? media.matches ? "dark" : "light" : preference;
    if (theme === "dark") root.dataset.theme = "dark";
    else root.removeAttribute("data-theme");
    root.style.colorScheme = theme;
    document.dispatchEvent(new CustomEvent("site:theme-change", { detail: { theme, preference } }));
  }
  function set(value) {
    preference = normalize(value);
    try {
      if (preference === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", preference);
    } catch (_) { /* Retain this session's choice even when storage is blocked. */ }
    apply();
  }
  window.SiteTheme = {
    get: current,
    getPreference: () => preference,
    set,
    toggle: () => set(current() === "dark" ? "light" : "dark"),
    subscribe(callback) {
      const listener = event => callback(event.detail.theme, event.detail.preference);
      document.addEventListener("site:theme-change", listener);
      callback(current(), preference);
      return () => document.removeEventListener("site:theme-change", listener);
    }
  };
  apply();
  media.addEventListener("change", () => { if (preference === "system") apply(); });
  window.addEventListener("storage", event => {
    if (event.key === "theme" || event.key === null) {
      preference = readPreference();
      apply();
    }
  });
}());
