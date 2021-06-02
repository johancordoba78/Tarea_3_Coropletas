// Mapa Leaflet
var mapa = L.map('mapid').setView([12.7828,-83.7054], 6);


// Definición de capas base
var capas_base = {
	
  // Capa base agregada mediante L.tileLayer
  "OSM": L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
    {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ),


 // Capa base agregada mediante L.tileLayer
  "OSM": L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
    {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ),

  // Capa base agregada mediante L.tileLayer y leaflet-providers
  "Stamen.Watercolor": L.tileLayer.provider('Stamen.Watercolor'),	
  
  // capa extra 1
  
  "Esri_NatGeoWorldMap": L.tileLayer.provider('Esri.NatGeoWorldMap'),
  
 // capa extra 2
  "CartoDB.DarkMatter":L.tileLayer.provider('CartoDB.DarkMatter'),
  
// capa extra 3
    "USGS.USImagery":L.tileLayer.provider('USGS.USImagery'),

  
}


// Se agregan todas las capas base al mapa
control_capas = L.control.layers(capas_base).addTo(mapa);

// Se activa una capa base del control
capas_base['Esri_NatGeoWorldMap'].addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);


// Capa vectorial de Paises en formato GeoJSON
$.getJSON("https://johancordoba78.github.io/datos/AC_corr.geojson", function(geodata) {
  var paises = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#CB4335", 'weight': 1.5, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Países</strong>: " + feature.properties.NAME_01+ "<br>" + "<strong>País</strong>: " + feature.properties.NAME_01;
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(paises, 'América Central');
});  

// Capa vectorial capitales en formato GeoJSON
$.getJSON("https://johancordoba78.github.io/datos/Capitales.geojson" , function(geodata) {
  var capitales = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#212F3D ", 'weight': 2.5, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Capital</strong>: " + feature.properties.CIUDAD + "<br>";
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(capitales, 'Capitales');
 });   

// Capa vectorial de líneas ferreas en formato GeoJSON
$.getJSON("https://johancordoba78.github.io/datos/L_Tren.geojson" , function(geodata) {
  var TREN = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "#A04000 ", 'weight': 2.5, 'fillOpacity': 0.0}
    },
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Línea ferrea</strong>: " + feature.properties.F_CODE_D_6 + "<br>";
      layer.bindPopup(popupText);
    }			
  }).addTo(mapa);

  control_capas.addOverlay(TREN, 'Línea Ferrocarril');


});

// Agregar capa WMS
var capa_carencia_hogares = L.tileLayer.wms('http://mapassociales.inec.cr/geopc', {
  layers: 'Inec:total_de_hogares_con_carencia_de_albergue_digno__2017_01_12_12_01_19__Distritos_Mapas_Sociales__472_2017_01_11',
  format: 'image/png',
  transparent: true
}).addTo(mapa);

control_capas.addOverlay(capa_carencia_hogares, 'Carencia_hogares_WMS');


// Agregar capa WMS_2
var wms2 = L.tileLayer.wms('http://mapassociales.inec.cr/geopc', {
  layers: 'Inec:prioritarios_de_ninez__2017_01_30_03_01_41__Distritos_Mapas_Sociales__472_2017_01_16',
  format: 'image/png',
  transparent: true
}).addTo(mapa);

control_capas.addOverlay(wms2, 'Prioritarios niñez Costa Rica');



// Agregar capa WMS_3
var wms3 = L.tileLayer.wms('https://tiles.maps.eox.at/wms?', {
  layers: 'blackmarble_3857',
  format: 'image/png',
  transparent: true
}).addTo(mapa);

control_capas.addOverlay(wms3, 'América Central de Noche');

// capa_raster_overlay
var radiasola = L.imageOverlay ("https://johancordoba78.github.io/datos/radia_solar1_CUT.png",
	[[19.5284392320000002, -92.5375000001834707], 
	[4.304894101000002, -76.9624999998165151]], 
	{opacity:0.5}
).addTo(mapa);


control_capas.addOverlay(radiasola, 'Radiación Solar');


function updateOpacityradia() {
  document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
  radiasola.setOpacity(document.getElementById("sld-opacity").value);
}



// Capa de coropletas de % personas vacunadas en América Central"
$.getJSON('https://johancordoba78.github.io/datos/AC_corr.geojson', function (geojson) {
  var capa_vacuna_ca = L.choropleth(geojson, {
	  valueProperty: '%_Rec_Vacunas/poblacion',
	  scale: ['#90ee90', '#006400'],
	  steps: 5,
	  mode: 'q',
	  style: {
	    color: '#fff',
	    weight: 2,
	    fillOpacity: 0.7
	  },
	  onEachFeature: function (feature, layer) {
	    layer.bindPopup('Personas vacunadas:' + feature.properties.Perso_vacun + '<br>'  )
	  }
  }).addTo(mapa);
  control_capas.addOverlay(capa_vacuna_ca, '% de personas vacunadas por país');	

  

 // Leyenda de la capa de coropletas
 var leyenda = L.control({ position: 'bottomleft' })
  leyenda.onAdd = function (mapa) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = capa_vacuna_ca.options.limits
    var colors = capa_vacuna_ca.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  leyenda.addTo(mapa)
});
