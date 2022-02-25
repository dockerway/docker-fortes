const {IgnorePlugin} = require("webpack")

module.exports = {
    devServer: {
        // open: process.platform === 'darwin',
        // host: '0.0.0.0',
        port: 9090,
        // https: false,
        //  hotOnly: false,
    },
    "transpileDependencies": [
        "vuetify"
    ],
    configureWebpack: {
        plugins: [
            new IgnorePlugin({
                resourceRegExp: /moment$/,
            })
        ]
    },
    chainWebpack: (config) => {
        config.module
            .rule('gql')
            .test(/\.(graphql|gql)$/)
            .use('graphql-tag/loader')
            .loader('graphql-tag/loader')
            .end();
    },

}
