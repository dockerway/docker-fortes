const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async (config, { configType }) => {

    //GRAPHQL
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      use: ['graphql-tag/loader'],
      //include: path.resolve(__dirname, '../'),
    });

    //SASS
    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });


    // Return the altered config
    return config;
  }
};
