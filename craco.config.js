module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Désactiver Terser (minification) qui cause les bugs TDZ
      if (webpackConfig.optimization) {
        webpackConfig.optimization.minimize = false;
      }
      return webpackConfig;
    },
  },
};
