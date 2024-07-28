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
      API_URL: JSON.stringify("http://ec2-51-20-121-202.eu-north-1.compute.amazonaws.com:8000"),
      PAPERCUPS_TOKEN: JSON.stringify('56c70349-6e9c-4af4-9523-214be28e4f63'),
      PAPERCUPS_INBOX: JSON.stringify('50015cd0-ebc1-4726-bbc8-0728e7851f93')
    }),
    // new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: "React Cards",
      filename: "index.html",
      template: "./index.html",
      favicon: "src/assets/credenc-logo.svg",
    }),
  ],
  devServer: {
    host: "0.0.0.0",
    // disableHostCheck: true,
    allowedHosts: "all",
    port: 4000,
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
