const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const location = {
    build: './assets/javascript/build',

    style: './assets/javascript/src/pages/style'
};

const output = {
    style: location.style
};

const conf = {
    entry: output,
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, location.build)
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(sass|scss|css)$/,
                use: [{
                    // creates style nodes from JS strings
                    loader: "style-loader",
                    options: {}
                },
                    MiniCssExtractPlugin.loader,
                    {
                        /*translates CSS into CommonJS*/
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')
                            ]
                        }
                    },
                    {
                        /*compiles Sass to CSS, using Node Sass by default*/
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                outputStyle: 'compressed',
                            },
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        })
    ],
    devServer: {
        port: 8080
    },
}

module.exports = (env, options) => {
    conf.devtool = options.mode === "production" ?
        false :
        "cheap-module-eval-source-map";

    return conf;
};