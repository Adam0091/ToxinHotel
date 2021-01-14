const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TenserWebpackPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const autoprefixer = require('autoprefixer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const optimization = () =>{
    const configObj = {
        splitChunks:{
            chunks: 'all'
        }
    }

    if(isProd){
        configObj.minimizer = [
            new OptimizeCssWebpackPlugin(),
            new TenserWebpackPlugin()
        ];
    }

    return configObj;
};

const plugins = () =>{
    const basePlugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './source/pages/registration/index.pug'),
            filename: 'registration/index.html',
            chunks: ["registration"],
            inject: true,
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './source/pages/sign_in/index.pug'),
            filename: 'sign_in/index.html',
            chunks: ["sign_in"],
            inject: true,
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './source/pages/room_details/index.pug'),
            filename: 'room_details/index.html',
            chunks: ["room_details"],
            inject: true,
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`,
        }),
    ];

    if (isProd){
        basePlugins.push(
            new ImageminPlugin({
                bail: false,
                cache: true,
                imageminOptions: {
                  plugins: [
                    ["gifsicle", { interlaced: true }],
                    ["jpegtran", { progressive: true }],
                    ["optipng", { optimizationLevel: 5 }],
                    [
                      "svgo",
                      {
                        plugins: [
                          {
                            removeViewBox: false
                          }
                        ]
                      }
                    ]
                  ]
                }
            })
        )
    }
    return basePlugins;
}

module.exports = {
    context: path.resolve(__dirname, ""),
    mode: 'development',
    entry: {
        registration: './source/js/main.js',
        sign_in: './source/js/sign_in.js',
        room_details: './source/js/room_details.js'
    },
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'app'),
    },
    devServer:{
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'app'),
        open: true,
        hot: true,
        compress: true,
        port: 3000
    },
    optimization: optimization(),
    plugins: plugins(),
    devtool: isProd ? false : 'source-map',
    module: {
        rules: 
        [
            {
                test: /\.pug$/,
                loader: 'pug-loader',
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, 
                        options:{
                            publicPath: (resourcePath, context) =>{
                                return path.relative(path.dirname(resourcePath), context) + '/';
                            }
                        }
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(?:|gif|png|jpg|jpeg|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options:{
                        name: `./img/[name].[ext]`,
                    }
                }]
            },
            {
                test: /\.(?:|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options:{
                        name: `./fonts/${filename('[ext]')}`,
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            //{test: /\.css$/,use: [MiniCssExtractPlugin.loader, 'css-loader'],},
        ]
    }
}; 