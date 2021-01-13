const { plugins } = require("./webpack.config")

module.exports = {
    plugins: [
        require('postcss-preset-env'),
        require('css-mqpacker'),
        require('cssnano')({
            preset: [
                'default',{
                    discardComments: {
                        removeAll: true,
                    }
                }
            ]
        })
    ],
}