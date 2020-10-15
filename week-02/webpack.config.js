const path = require("path");

module.exports = {
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    port: 8000,
    host: "0.0.0.0",
  },
  mode: "development",
  entry: {
    main: "./main.js",
  },
  optimization: {
    minimize: false,
  },
};
