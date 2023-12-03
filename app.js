

//iniciar el servidor de express
const express = require('express');
const app = express();
//para usar rutas del directorio
const path = require('path');

// Configurar el motor de vistas EJS
app.set('views', path.join(__dirname, './src/vistas'));
//saber que motor de vistas uso en este caso ejs
app.set('view engine', 'ejs');

//inicializar webpack
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');

//usar los middleware
app.use(webpackDevMiddleware(webpack(webpackConfig)));

// Servir archivos estáticos desde la carpeta 'paginas'
app.use(express.static(path.join(__dirname, './src')));


//entender los formatos json
app.use(express.json());

//petición a la ruta principal
app.get('/', (req, res)=>{
    res.render('index', {titulo:'Asentamientos informales'})
})

app.get('/nosotros', (req, res)=>{
    res.render('nosotros',  {titulo:'Nosotros'})
});

app.get('/graficos', (req, res)=>{
    res.render('graficos',  {titulo:'Mapas', script: 'mapa.bundle.js', h1: 'Asentamientos Humanos '})
});

app.get('/seguimiento', (req, res)=>{
    res.render('graficos',  {titulo:'Mapas', script: 'mapa2.bundle.js', h1: 'Ocupaciones ilegales'})
});

app.listen(3000, ()=>{
    console.log("servidor en el puerto 3000")
});