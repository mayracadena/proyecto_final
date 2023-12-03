const path = require('path');

module.exports = {
  entry: {
    mapa: './src/js/mapa.js',
    mapa2: './src/js/mapa2.js',
  
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'src/public')
  },
  mode: 'development'
};
