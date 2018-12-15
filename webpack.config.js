const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackWebExt = require("webpack-webext-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = env => ({
  entry: {
    "popup/popup": "./src/popup/popup.ts"
  },
  devtool: env.prod ? "" : "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "**/*",
        context: "src",
        ignore: ["*.ts", "*.scss"]
      }
    ]),
    new MiniCssExtractPlugin(),
    env.prod
      ? () => {}
      : new WebpackWebExt({
          runOnce: true,
          maxRetries: 1,
          argv: ["run", "-s", "dist/"]
        })
  ]
});
