//Store our API endpoint.
const url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// Generate markers, ideally markers with size magnitude and color depth.
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}

// Define a function to run for all features in the features array. Give each feature a pop-up that describes the incident time and location.
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
}

// Use D3 to retrieve the JSON. 
d3.json(url).then(function (earthquakeData) {
    // Create a GeoJSON layer that contains the features array on the earthquakeData object. Run the onEachFeature function for all data in the array.
    const quakes = L.geoJSON(earthquakeData.features, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    // Create the base layer. Do NOT forget the attribution.
    const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Generate the map.
    const quakeMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, quakes]
    });

    // Create the baseMaps and overlayMaps variables to add the road grid and earthquake incidents.
    const baseMaps = {
        "Street Map": street
    };

    const overlayMaps = {
        "Earthquakes": quakes
    };

    // Create a control, pass in baseMaps and overlayMap, and add the control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(quakeMap);

    // Create, define, and position a legend for the data, then add it to the map.
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [-10, 10, 30, 50, 70, 90];

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(quakeMap);
});

// Have the markers adjust for size based on magnitude.
function markerSize(magnitude) {
    return magnitude * 5;
}

// Have the markers change color based on depth.
function markerColor(depth) {
    return depth > 90 ? '#490101' :
        depth > 70 ? '#fb3e10' :
            depth > 50 ? '#ffb202' :
                depth > 30 ? '#e5ef4c' :
                    depth > 10 ? '#8cf661' :
                        '#00982e';
}
// Run the index.html file to confirm the data matches BasicMap.png, then customize markers to your preference.