import { createRequire } from "module";
const require = createRequire(import.meta.url);
const lucideStatic = require("lucide-static");
const icons = lucideStatic;
import { marked } from "marked";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

// Create a DOM window for DOMPurify
const window = new JSDOM("").window;
const DOMPurifyServer = DOMPurify(window);

export default {
  eq: (a, b) => a === b,
  ne: (a, b) => a !== b,
  gt: (a, b) => a > b,
  lt: (a, b) => a < b,
  and: (a, b) => a && b,
  or: (a, b) => a || b,
  not: (a) => !a,

  // HTMX helpers
  "hx-get": (url) => `hx-get="${url}"`,
  "hx-post": (url) => `hx-post="${url}"`,
  "hx-target": (target) => `hx-target="${target}"`,
  "hx-swap": (swap) => `hx-swap="${swap}"`,

  // Conditional classes
  "class-if": (condition, className) => (condition ? className : ""),

  // JSON helper
  json: (context) => JSON.stringify(context),

  // Array helper
  array: (...args) => args.slice(0, -1),

  // Conditional helper
  cond: (condition, trueVal, falseVal) => (condition ? trueVal : falseVal),

  // Concat helper
  concat: (...args) => args.slice(0, -1).join(""),

  // Date formatting
  formatDate: (date, format = "short") => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  icon: function (name, options) {
    if (!name || typeof name !== "string") return "";
    const capitalizedName =
      name.charAt(0).toUpperCase() +
      name.slice(1).replace(/-./g, (match) => match[1].toUpperCase());
    let svg = icons[capitalizedName];
    if (!svg) {
      console.log(`Icon not found: ${capitalizedName} (original: ${name})`);
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-off-icon lucide-circle-off"><path d="m2 2 20 20"/><path d="M8.35 2.69A10 10 0 0 1 21.3 15.65"/><path d="M19.08 19.08A10 10 0 1 1 4.92 4.92"/></svg>`;
    }
    const attrs = options.hash || {};
    const className = attrs.class || "";
    const size = attrs.size || 24;
    const fill = attrs.fill;
    const stroke = attrs.stroke;
    // Replace width and height
    svg = svg.replace(/width="[^"]*"/, `width="${size}"`);
    svg = svg.replace(/height="[^"]*"/, `height="${size}"`);
    // Add or append class
    if (className) {
      if (svg.includes('class="')) {
        svg = svg.replace(/(class="[^"]*)"/, `$1 ${className}"`);
      } else {
        svg = svg.replace("<svg ", `<svg class="${className}" `);
      }
    }
    // Replace fill and stroke if provided
    if (fill !== undefined) {
      svg = svg.replace(/fill="[^"]*"/, `fill="${fill}"`);
    }
    if (stroke !== undefined) {
      svg = svg.replace(/stroke="[^"]*"/, `stroke="${stroke}"`);
    }
    return svg;
  },

  // Markdown helper with sanitization
  markdown: (text) => {
    if (!text) return "";
    const html = marked.parse(text);
    return DOMPurifyServer.sanitize(html);
  },
};
