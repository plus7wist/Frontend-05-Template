const babelPlugins = [
  babelJsx(),
  // babelRuntime(),
];

module.exports = {
  mode: "development",
  entry: {
    index: "./index.js",
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [babelRule()],
  },
};

function babelRule() {
  const test = /\.js$/;

  const options = {
    presets: ["@babel/preset-env"],
    plugins: babelPlugins,
  };

  return {
    test: test,
    use: {
      loader: "babel-loader",
      options: options,
    },
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
