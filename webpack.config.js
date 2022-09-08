const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: './client/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'bundleFolder'),
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'bundleFolder'),
      //publicPath: '/bundleFolder'
    },
    proxy: {
      '/api' : 'http://localhost:3000',
      '/board' : 'http://localhost:3000',
      '/user' : 'http://localhost:3000',
      '/favorites' : 'http://localhost:3000'
    },
    compress: false,
    host: 'localhost',
    port: 8080,
    hot: true,
  },

    plugins: [new HTMLWebpackPlugin({
        template: './client/index.html'
        })
    ],
  
    module: {
    rules: [
        {
            test: /\.js|jsx$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                },
            }
        },
        {
            test: /\.css$/i,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader'],
      },
        {
        test: /\.(png|jpg)$/, 
        use: ['file-loader', 'url-loader?limit=8192'],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}

  




