module.exports = {
  // ... other config
  module: {
    rules: [
      // ... other rules
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
};
