const sass = require("sass");

module.exports = {
  implementation: sass,
  sassOptions: {
    outputStyle: "expanded",
    sourceMap: true,
    sourceMapContents: true,
    precision: 6,
    includePaths: ["src/scss", "node_modules"],
    quietDeps: true,
  },
  additionalData: `
    @use "src/scss/abstracts" as *;
  `,
};
