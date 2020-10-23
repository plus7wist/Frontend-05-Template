const babelPlugins = [babelJsx()];

module.exports = {
  mode: "development",
  entry: {
    index: "./index.js",
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".mjs", ".js"],
  },
  module: {
    rules: [babelRule()],
  },
};

function babelRule() {
  const options = {
    presets: ["@babel/preset-env"],
    plugins: babelPlugins,
  };

  return {
    test: /\.m?js$/,
    use: {
      loader: "babel-loader",
      options: options,
    },
    exclude: /node_modules/,
  };
}

function babelRuntime() {
  return ["@babel/plugin-transform-runtime", {}];
}

function babelJsx() {
  const options = {
    pragma: "noReactCreateElement",
  };

  return ["@babel/plugin-transform-react-jsx", options];
}
