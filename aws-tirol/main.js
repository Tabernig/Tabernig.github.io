
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
}).addTo(map);