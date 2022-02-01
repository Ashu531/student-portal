const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const addBaseConfig = require("./webpack-base.config");

const configs = addBaseConfig({
  mode: "development",
  output: {
    filename: "js/[name].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|otf|svg|gif|css)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets",
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      // REACT_APP_ENCRYPTION_KEY: JSON.stringify(
      //   "U2FsdGVkX19p7zIuVPh8mW1fp9PdMxR0aGHzQ0IbJuw="
      // ),
      // LOGIN_API_URL: JSON.stringify("http://localhost:7777"),
      API_URL: JSON.stringify("http://3.110.187.135"),
    }),
    // new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: "React Cards",
      filename: "index.html",
      template: "./index.html",
      // favicon: "src/assets/invoid-logo.svg",
    }),
  ],
  devServer: {
    host: "0.0.0.0",
    // disableHostCheck: true,
    allowedHosts: "all",
    port: 4444,
    historyApiFallback: true,
    hot: true,
    static: {
      watch: {
        aggregateTimeout: 300,
        poll: 1000,
      },
    },
  },
});

module.exports = configs;
