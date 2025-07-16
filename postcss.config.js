module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ["> 1%", "last 2 versions", "not dead"],
    },
    cssnano: {
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          mergeRules: true,
          mergeLonghand: true,
          minifySelectors: true,
          minifyParams: true,
          minifyFontValues: true,
          normalizeTimingFunctions: true,
          normalizeRepeatStyle: true,
          normalizePositions: true,
          normalizeString: true,
          normalizeUnicode: true,
          normalizeUrl: true,
          sortMediaQueries: true,
        },
      ],
    },
  },
};
