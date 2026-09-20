/* Academic Pages scientific content, adapted for this site's bilingual theme.
 * Load the optional libraries only when their content is present. Keep the
 * classic navigation/image-lightbox bundle independent of these modules.
 */
const MATHJAX_URL = "https://cdn.jsdelivr.net/npm/mathjax@4.0.0/tex-mml-chtml.js";
const MERMAID_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.esm.min.mjs";
const PLOTLY_URL = "https://cdn.jsdelivr.net/npm/plotly.js-dist-min@4.0.0/plotly.min.js";

const content = document.querySelector("#main") || document.body;
const darkTheme = () => document.documentElement.dataset.theme === "dark";
const mathSetting = document.getElementById("academic-content").dataset.mathjax;

function loadScript(url, id) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.id = id;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Unable to load ${url}`));
    document.head.append(script);
  });
}

function codeBlocks(language) {
  return Array.from(content.querySelectorAll(
    `pre > code.language-${language}, .language-${language} pre > code`
  )).map(code => ({
    source: code.textContent,
    original: code.closest(".highlighter-rouge") || code.parentElement,
    chart: null,
    error: null
  }));
}

function chartContainer(block, kind) {
  if (!block.chart) {
    block.chart = document.createElement("div");
    block.chart.className = `academic-figure academic-${kind} tex2jax_ignore`;
    block.original.after(block.chart);
  }
  return block.chart;
}

function showChart(block) {
  block.original.classList.add("academic-source");
  block.original.hidden = true;
  if (block.error) {
    block.error.remove();
    block.error = null;
  }
}

function showError(block, error) {
  console.warn("Scientific content could not be rendered:", error);
  block.original.hidden = false;
  if (block.chart) {
    if (block.chart.classList.contains("academic-plot") && window.Plotly) window.Plotly.purge(block.chart);
    block.chart.remove();
    block.chart = null;
  }
  if (!block.error) {
    block.error = document.createElement("p");
    block.error.className = "academic-figure-error";
    block.error.setAttribute("role", "status");
    block.error.textContent = document.documentElement.lang.startsWith("zh")
      ? "图表暂时无法显示，原始内容保留如下。"
      : "The chart could not be displayed. Its source is shown below.";
    block.original.before(block.error);
  }
}

// Serialize renders: a theme click during a CDN request or SVG render must not
// race the initial chart. Reading the DOM theme also covers OS theme changes.
function followTheme(render) {
  let pending = Promise.resolve();
  const refresh = () => {
    pending = pending.then(render).catch(error => console.warn(error));
  };
  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });
  refresh();
}

function hasMath() {
  if (mathSetting === "true" || content.querySelector("math")) return true;
  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, {
    acceptNode: node => node.parentElement.closest("pre, code, script, style, textarea, .tex2jax_ignore")
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  });
  while (walker.nextNode()) {
    if (/\$\$|\\\(|\\\[|\\begin\s*\{/.test(walker.currentNode.textContent)) return true;
  }
  return false;
}

async function initializeMath(plots) {
  const plotMath = plots.some(block => /\$[^$]+\$/.test(block.source));
  if (mathSetting === "false" || !(hasMath() || plotMath)) return false;
  // Plotly 4 uses SVG for TeX labels, while the page keeps MathJax's CHTML.
  // See Plotly's index-mathjax4chtml.html integration example.
  window.MathJax = {
    loader: {
      paths: { "mathjax-newcm": "https://cdn.jsdelivr.net/npm/@mathjax/mathjax-newcm-font@4.0.0" },
      load: plots.length ? ["output/svg"] : []
    }
  };
  await loadScript(MATHJAX_URL, "MathJax-script");
  // MathJax 4 loads fonts asynchronously; wait for typesetting, not just onload.
  await window.MathJax.startup.promise;
  return true;
}

async function initializeMermaid(blocks) {
  if (!blocks.length) return;
  try {
    const { default: mermaid } = await import(MERMAID_URL);
    await document.fonts.ready;
    let sequence = 0;
    followTheme(async () => {
      mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: darkTheme() ? "dark" : "default" });
      for (const block of blocks) {
        try {
          // Validate before rendering so a bad diagram cannot leave a stray
          // Mermaid error SVG in the page or stop subsequent diagrams.
          await mermaid.parse(block.source);
          const container = chartContainer(block, "diagram");
          const { svg, bindFunctions } = await mermaid.render(`academic-mermaid-${++sequence}`, block.source);
          container.innerHTML = svg;
          if (bindFunctions) bindFunctions(container);
          showChart(block);
        } catch (error) {
          showError(block, error);
        }
      }
    });
  } catch (error) {
    blocks.forEach(block => showError(block, error));
  }
}

async function initializePlotly(blocks, mathReady) {
  if (!blocks.length) return;
  try {
    const [, themes] = await Promise.all([
      loadScript(PLOTLY_URL, "Plotly-script"),
      import("./theme.js")
    ]);
    followTheme(async () => {
      const theme = darkTheme() ? themes.plotlyDarkLayout : themes.plotlyLightLayout;
      await Promise.all(blocks.map(async block => {
        try {
          const spec = JSON.parse(block.source);
          if (!Array.isArray(spec.data)) throw new Error("Plotly requires a data array.");
          const needsMath = /\$[^$]+\$/.test(block.source) && (!spec.config || spec.config.typesetMath !== false);
          const mathAvailable = needsMath ? await mathReady : false;
          const layout = { autosize: true, uirevision: "academic-plot", ...spec.layout };
          const custom = layout.template;
          layout.template = typeof custom === "string" ? custom : {
            ...theme, ...custom, layout: { ...theme.layout, ...(custom && custom.layout) }
          };
          const chart = chartContainer(block, "plot");
          await window.Plotly.react(chart, spec.data, layout, {
            responsive: true, displaylogo: false, ...spec.config,
            typesetMath: mathAvailable && (!spec.config || spec.config.typesetMath !== false)
          });
          showChart(block);
        } catch (error) {
          showError(block, error);
        }
      }));
    });
  } catch (error) {
    blocks.forEach(block => showError(block, error));
  }
}

const plots = codeBlocks("plotly");
const mathReady = initializeMath(plots).catch(error => {
  console.warn("MathJax could not be loaded:", error);
  return false;
});
initializeMermaid(codeBlocks("mermaid"));
initializePlotly(plots, mathReady);
