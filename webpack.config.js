const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = env => ({
  entry: {
    "popup/popup": "./src/popup/popup.ts",
    "manage/manage": "./src/manage/manage.ts",
    "find/find": "./src/find/find.ts",
    "background/background": "./src/background/background.ts"
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
        use: [
          { loader: MiniCssExtractPlugin.loader, options: { sourceMap: true } },
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } }
        ]
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
    new MiniCssExtractPlugin()
  ]
});
