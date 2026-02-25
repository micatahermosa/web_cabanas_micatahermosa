module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer')({ remove: false }),
    require('cssnano')({ preset: 'default' })
  ]
};
