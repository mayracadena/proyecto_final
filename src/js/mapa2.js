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
import KML from 'ol/format/KML';
import { Zoom, ZoomSlider, ZoomToExtent, ScaleLine, Fullscreen } from 'ol/control'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js'

import GeoJSON from 'ol/format/GeoJSON.js';
//importamos la capa de ocupaciones ilegales y poligono de monitoreo
/*const kmlOcupacion = new VectorLayer({
    source: new VectorSource({
        url: '/datos/ocupacion-ilegal.kml', // Ruta a tu archivo GeoJSON
        format: new KML()
    })
});
*/


const kmlMonitoreo = new VectorLayer({
    source: new VectorSource({
        url: '/datos/poligono-de-monitoreo.kml', // Ruta a tu archivo GeoJSON
        format: new KML({
            extractStyles: false,
            showPointNames: true
        })
    }),
    style: new Style({
        fill: new Fill({
            color: 'red',
        })
    })
});

//agregamos funcion que donde este el mouse aparezca la coordenada
const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position',
    target: document.getElementById('mouse-position'),
});



//agregamos el mapa 
const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })

    ],
    view: new View({
        center: fromLonLat([-74, 4.6]),
        zoom: 10,

    }),
    controls: defaults().extend([mousePositionControl]),
    zoom: true,
    attribution: false,
    rotate: true

});
//map.addLayer(kmlOcupacion)
map.addControl(new ZoomSlider())
map.addControl(new ScaleLine())
map.addLayer(kmlMonitoreo)

//agregar pop up (tambien conocido como tooltip)
//se obtiene el div que se usara 
const info = document.getElementById('info');
info.style.pointerEvents = 'none';
//configuracion del pop up de boostrap
const tooltip = new bootstrap.Tooltip(info, {
    animation: false,
    customClass: 'pe-none',
    offset: [0, 5],
    title: 'Nombre Poligono',
    trigger: 'manual',
});
//prender o apagar el pop up y en caso tomar el valor de nombre poligono para mostrar
let currentFeature;
const displayFeatureInfo = function (pixel, target) {
    const feature = target.closest('.ol-control')
        ? undefined
        : map.forEachFeatureAtPixel(pixel, function (feature) {
            return feature;
        });
    if (feature) {
        info.style.left = pixel[0] + 'px';
        info.style.top = pixel[5] + 'px';
        if (feature !== currentFeature) {
            tooltip.setContent({ '.tooltip-inner': feature.get('nombre_pol') });
        }
        if (currentFeature) {
            tooltip.update();
        } else {
            tooltip.show();
        }
    } else {
        tooltip.update();
    }
    currentFeature = feature;
};
//ocultar pop up
map.on('pointermove', function (evt) {
    if (evt.dragging) {
        tooltip.hide();
        currentFeature = undefined;
        return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel, evt.originalEvent.target);
});

map.on('click', function (evt) {
    displayFeatureInfo(evt.pixel, evt.originalEvent.target);
});

map.getTargetElement().addEventListener('pointerleave', function () {
    tooltip.hide();
    currentFeature = undefined;
});

