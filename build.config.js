const path = require('path');

module.exports = {
  // Source paths
  src: {
    scss: 'src/scss',
    main: 'src/scss/main.scss',
  },

  // Output paths
  dist: {
    css: 'dist/css',
    main: 'dist/css/style.css',
    minified: 'dist/css/style.min.css',
  },

  // Sass options
  sass: {
    outputStyle: 'expanded',
    sourceMap: true,
    sourceMapContents: true,
    precision: 6,
    includePaths: ['src/scss', 'node_modules'],
    quietDeps: true,
  },

  // PostCSS options
  postcss: {
    autoprefixer: {
      browsers: ['> 1%', 'last 2 versions', 'not dead'],
    },
    cssnano: {
      preset: [
        'default',
        {
          discardComments: { removeAll: true },
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

  // Watch options
  watch: {
    files: ['src/scss/**/*.scss'],
    options: {
      ignoreInitial: false,
      ignored: ['node_modules/**/*'],
    },
  },

  // Server options
  server: {
    port: 3000,
    host: 'localhost',
    open: false,
    cors: true,
  },
};
