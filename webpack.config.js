// webpack.config.js
const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "webpack/index.html",
  filename: "index.html",
  inject: "body"
});

const config = {
  context: path.resolve(__dirname, "src"),
  entry: "./app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["latest"]]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: (() => {
    const devPlugins = [
      HtmlWebpackPluginConfig,
    ];
    const prodPlugins = [
      new MinifyPlugin({}),
      new webpack.optimize.UglifyJsPlugin({
        sourcemap: false,
        compress: {
          // drop_console: true,
          keep_fargs: true, // if issues, disable
          passes: 2,
          unsafe: false, // todo:
          unsafe_math: false, // can cause improper floats
        },
        mangle: {
          eval: true,
          reserved: [], // dont mangle these names
          toplevel: true,
        },
        output: {
          quote_style: 0,
        },
      }),
    ];

    const out = devPlugins;
    if (process.env.NODE_ENV === 'production') out.concat(prodPlugins)
    return out;
  })(),
};

module.exports = config;
