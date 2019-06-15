
 // bring in the JSON
 var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson" 

// adjust background color based upon magnitude
function fillColor(magnitude) {
  var color;
  if (magnitude < 1) {
    color = "#00FF00"; // green
  }
  else if (magnitude < 2) {
    color = "#7FFF00"
  }
  else if (magnitude < 3) {
    color = "#FFFF00"
  }
  else if (magnitude < 4) {
    color = "#FFF000"
  }
  else if (magnitude < 5) {
    color = "#FF5700"
  }
  else {
    color = "#FF0000" // red
  }
  return [color]
}



 d3.json(queryUrl, function(data) {
  //send the data.features object to the createFeatures function
 
    createFeatures(data.features);
  });
  function markerSize(mag) {
    return mag * 40;
  }
  // var mag = [];
  function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place + " " + feature.properties.mag +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      //  console.log(typeof feature.properties.mag)
        // mag = 30;
        // mag.push(feature.properties.mag * 150000);

      }

      
      
      function pointToLayer(feature, latlng) {
        var geojsonMarkerOptions = {
            radius: (feature.properties.mag) * 5,
            fillColor: fillColor(feature.properties.mag),
            color: "LightGray",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
      // console.log(feature)
      return L.circleMarker(latlng, geojsonMarkerOptions);
  }
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer
    });
  
    // Sending the earthquakes layer to the createMap function
    createMap(earthquakes);
  }
  
  function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // baseMaps object to hold the base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    //  overlay object to hold the overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create the map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map-id", {
      center: [
        40, -115
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
      // add legend
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Magnitude</strong>'],
      magnitudes = ['0-1', '1-2', '2-3', '3-4', '4-5', '5+'];
  
    div.innerHTML +=
      labels.push(
        '<i class="square" style="background:' + "red" + '"></i> ' +
        '<p style="background-color:#00FF00;">' + magnitudes[0] + '</p>' +
        '<p style="background-color:#7FFF00;">' + magnitudes[1] + '</p>' +
        '<p style="background-color:#FFFF00;">' + magnitudes[2] + '</p>' +
        '<p style="background-color:#FFF000;">' + magnitudes[3] + '</p>' +
        '<p style="background-color:#FF5700;">' + magnitudes[4] + '</p>' +
        '<p style="background-color:#FF0000;">' + magnitudes[5] + '</p>');
  
    div.innerHTML = labels.join('<br>');
    return div;
  };
  legend.addTo(myMap);
  }
  
  