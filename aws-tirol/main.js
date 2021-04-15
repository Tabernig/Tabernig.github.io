//https://leaflet-extras.github.io/leaflet-providers/preview/

let basemapGrey = L.tileLayer.provider("BasemapAT.grau");

let map = L.map("map", {
    center: [47,11],
    zoom: 9,
    layers: [
        basemapGrey
    ],

});

let layerControl = L.control.layers({
    "BasemapAt.grau":basemapGrey,
    "BasemapAt.orthofoto":L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAt.highD":L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAt.overlay":L.tileLayer.provider("BasemapAT.overlay"),
    "BasemapAT.overlay+ortho":L.layerGroup([
        L.tileLayer("BasemapAT.orthofoto"),
        L.tileLayer("BasemapAT.overlay"),
    ]),
    "BasemapAt.EsriNatGeo":L.tileLayer.provider("Esri.NatGeoWorldMap"),
    "BasemapAt.ESRIworldImagery":L.tileLayer.provider("Esri.WorldImagery"),
}).addTo(map);

let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";
fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log("Daten konvertiert: ", response.json);
        for (station of json.features) {
            console.log("Station: ", station);
            let marker = L.marker(
                [station.geometry.coordinates[1],
                station.geometry.coordinates[0]]);
            marker.addTo(map);
        }
});