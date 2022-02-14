const path = require("path");

var ROOT_PATH = path.resolve(__dirname, "../");
var SRC_PATH = path.resolve(ROOT_PATH, "src");
var PUBLISH_PATH = path.resolve(ROOT_PATH, "publish");

const pkg = require(path.resolve(ROOT_PATH, "config/config.json"));

console.log(process.env);

var config = {
  context: ROOT_PATH,

  mode: "production",

  entry: {
    test_page: "./src/test/index.js",
  },

  devtool: "source-map",

  output: {
    filename: `[name].js`,
    path: PUBLISH_PATH,
  },

  resolve: {
    extensions: [".js", ".css"],
    modules: ["node_modules"],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [SRC_PATH],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["es2015"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: path.resolve(__dirname, "node_modules"),
      },
    ],
  },
};

config.plugins.push(
  new webpack.DefinePlugin({
    APP_NAME: `"${appName}"`,
    APP_VERSION: `${pkg.version || "0.0.0"}`,
    NODE_ENV: `"${ENV}"`,
  })
);
module.exports = config;
