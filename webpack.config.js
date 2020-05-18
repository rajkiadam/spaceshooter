/* eslint-disable indent */
const path = require('path')

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
