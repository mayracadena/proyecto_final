
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat, transform } from 'ol/proj';
import { defaults } from 'ol/control/defaults'
import { createStringXY } from 'ol/coordinate.js';
import MousePosition from 'ol/control/MousePosition.js';
import { Icon, Style } from 'ol/style';
import Feature from 'ol/Feature.js';

import GeoJSON from 'ol/format/GeoJSON.js';
//importamos la capa de asentamientos humanos
const gjAcentamimieto = new VectorLayer({
    source: new VectorSource({
        url: '/datos/AsentamientosHumanos.geojson', // Ruta a tu archivo GeoJSON
        format: new GeoJSON()
    })
});

//agregamos funcion que donde este el mouse aparezca la coordenada
const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
});

//cambiamos el icono por defecto  
const iconStyle = new Style({
    image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: '/datos/iconos/house-exclamation-fill.svg',
    }),
});
gjAcentamimieto.setStyle(iconStyle);

//agregamos el mapa 
const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })

    ],
    view: new View({
        center: fromLonLat([-73, 8.5]),
        zoom: 8,

    }),
    controls: defaults().extend([mousePositionControl]),
    zoom: true,
    attribution: false,
    rotate: true

});
map.addLayer(gjAcentamimieto)

//mostrar tabla de atributos
var oculto = document.getElementById("oculto");
oculto.style.visibility = 'visible';

//cambiar cabeceros de la tabla
document.getElementById('th1').innerHTML ='Codigo'
document.getElementById('th2').innerHTML= 'Nombre unidad'
document.getElementById('th3').innerHTML='Tipo unidad'
document.getElementById('th4').innerHTML = 'municipio'


var features = gjAcentamimieto.getSource().on('change', env => {
    var source = env.target
    if (source.getState() === 'ready') {
        var numFeatures = source.getFeatures().length;

        var features = source.getFeatures()

        var tabla = document.getElementById("tabla-atributos");

        source.forEachFeature(feature => {
            // Crear una fila para cada feature

            // Obtiene las propiedades/atributos de la feature
            var properties = feature.getProperties();
            var col1, col2, col3, col4;
            // Itera sobre las propiedades y accede a los atributos y valores
            for (var key in properties) {

                //se saca los atributos necesarios
                var row = tabla.insertRow();
                var nUnidad = properties['nombre_uni'];
                var tUnidad = properties['tipo_unida'];
                var municipio = properties['nombre_mun'];
                var codigo_uni = properties['codigo_uni'];
                // se crea los td de la tabla


                var col1 = row.insertCell(0);
                var col2 = row.insertCell(1);
                var col3 = row.insertCell(2);
                var col4 = row.insertCell(3);

                col1.textContent = codigo_uni;
                col2.textContent = nUnidad;
                col3.textContent = tUnidad;
                col4.textContent = municipio;

            }



        })


    }
})
