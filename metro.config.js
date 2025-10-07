const path = require('path');
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    // Add watchFolders to watch your local modules
    watchFolders: [
      path.resolve(__dirname, '../../goose/satochip-react-native'),
      path.resolve(__dirname, '../../goose/cktap-protocol-react-native'),
    ],

    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },

    resolver: {
      extraNodeModules: {
        // Add all the polyfills needed
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("react-native-crypto"),
        fs: require.resolve("react-native-level-fs"),
        path: require.resolve("path-browserify"),
        process: require.resolve("process/browser"),
        dgram: require.resolve("react-native-udp"),
        console: require.resolve("console-browserify"),
      },
      assetExts: assetExts.filter(ext => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],

      // Add node_modules paths to help resolve modules
      nodeModulesPaths: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, '../../goose/satochip-react-native/node_modules'),
        path.resolve(__dirname, '../../goose/cktap-protocol-react-native/node_modules'),
      ],
    },
  };
})();