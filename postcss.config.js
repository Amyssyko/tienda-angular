// Tailwind v4 moved the PostCSS plugin to the separate package '@tailwindcss/postcss'.
// Use the new plugin here so Angular's PostCSS integration works with Tailwind v4+.
module.exports = {
  // Export plugins as an array of [name, options] so Angular's loader can iterate
  // and require each plugin correctly.
  plugins: [
    ["@tailwindcss/postcss", {}],
    ["autoprefixer", {}],
  ],
};
