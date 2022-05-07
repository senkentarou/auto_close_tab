const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    app: path.join(__dirname, 'src', 'App.tsx'),
    popup: path.join(__dirname, 'src', 'Popup.tsx'),
    background: path.join(__dirname, 'src', 'background', 'background.ts')
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json')
          }
        },
        exclude: /node_module/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      "components*": path.resolve(__dirname, "src/components*")
    }
  },
  output: {
    path: path.join(__dirname, 'ChromeExtensionFile'),
    filename: "[name].js"
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
    }),
    new HtmlWebPackPlugin({
      template: path.join(__dirname, 'src', 'popup.html'),
      filename: 'popup.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: "./manifest.json", to: "./" }
      ]
    })
  ],
  target: ["web", "es5"]
};
