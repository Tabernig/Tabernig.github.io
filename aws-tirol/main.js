//https://leaflet-extras.github.io/leaflet-providers/preview/

//https://leafletjs.com/reference-1.7.1.html#tilelayer
let basemapGrey = L.tileLayer.provider("BasemapAT.grau");

//https://leafletjs.com/reference-1.7.1.html#map
let map = L.map("map", {
    center: [47, 11],
    zoom: 9,
    layers: [
        basemapGrey
    ],
});

let overlays = {
    stations: L.featureGroup(),
    temperatur: L.featureGroup(),
    snowhight: L.featureGroup(),
    windspeed: L.featureGroup(),
    winddirection: L.featureGroup(),
};
console.log(overlays.stations);


//https://leafletjs.com/reference-1.7.1.html#control
let layerControl = L.control.layers({
    "BasemapAt.grau": basemapGrey,
    //https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAt.orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    //https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAt.highD": L.tileLayer.provider("BasemapAT.highdpi"),
    //https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAt.overlay": L.tileLayer.provider("BasemapAT.overlay"),
    //https://leafletjs.com/reference-1.7.1.html#layergroup
    "BasemapAT.overlay+ortho": L.layerGroup([
        //https://leafletjs.com/reference-1.7.1.html#tilelayer
        L.tileLayer.provider('BasemapAT.orthofoto'),
        //https://leafletjs.com/reference-1.7.1.html#tilelayer
        L.tileLayer.provider('BasemapAT.overlay')
    ]),
    //https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAt.EsriNatGeo": L.tileLayer.provider("Esri.NatGeoWorldMap"),
    //https://leafletjs.com/reference-1.7.1.html#tilelayer
    "BasemapAt.ESRIworldImagery": L.tileLayer.provider("Esri.WorldImagery"),
}, {
    "Wetterstationen Tirol":overlays.stations,
    "Temperatur (°C)":overlays.temperatur,
    "Schneehöhe (cm)":overlays.snowhight,
    "Windgeschwindigkeit (km/h)":overlays.windspeed,
    "Windrichtung":overlays.winddirection,
    },{
        collapsed : false,
    }).addTo(map);
overlays.temperatur.addTo(map);

//Maßstab einbauen

L.control.scale({
    imperial:false,
    maxWidth: 400,
    position: "bottomright",
}).addTo(map);


//let hood = L.point()



let newLabel = (coords, options) => {
    let label = L.divIcon({
        html:`<div>${options.value}</div>`,
        className: "text-label"
    })
    // console.log("Koordinaten: ", coords);
    // console.log("Optionsobjekt: ", options);
    let marker = L.marker([coords[1],coords[0]], {
        icon: label
    });
    //console.log("Marker: ", marker);
    return marker;
    //Label erstellen
    //den Label zurückgeben
};



let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";
fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log("Daten konvertiert: ", json);
        for (station of json.features) {
            console.log("Station: ", station);
            //https://leafletjs.com/reference-1.7.1.html#marker
            let marker = L.marker([
                station.geometry.coordinates[1],
                station.geometry.coordinates[0]
            ]);
            let formattedDate = new Date(station.properties.date);
            marker.bindPopup(`
            <h3>${station.properties.name}</h3>
            <ul> 
                <li>Seehöhe: ${station.geometry.coordinates[2] || "?"} m</li>
                <li>Datum: ${formattedDate.toLocaleString("de") || "?"}</li>
                <li>Temperatur: ${station.properties.LT || "?"}° C </li>
                <li>Luftfeuchtigkeit: ${station.properties.RH || "?"} % </li>
                <li>Windgeschwindigkeit: ${station.properties.WG || "?"} km/h </li>
                <li>Windrichtung: ${station.properties.WR || "?"} ° </li>
                <li>Schneehöhe: ${station.properties.HS || "?"} cm </li>
            </ul>
            <a target="_blank" href="https://wiski.tirol.gv.at/lawine/grafiken/1100/standard/tag/${station.properties.plot}.png">Grafik</a>
            `);
            marker.addTo(overlays.stations);
            if (typeof station.properties.HS == "number") {
                let highlightClass = "";
                if (station.properties.HS > 100) {
                    highlightClass = "snow-100";
                }
                if (station.properties.HS > 200) {
                    highlightClass = "snow-200";
                }
                //https://leafletjs.com/reference-1.7.1.html#divicon
                let snowIcon = L.divIcon({
                    html: `<div class="snow-label ${highlightClass}">${station.properties.HS}</div>`
                })
                //https://leafletjs.com/reference-1.7.1.html#marker
                let snowMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: snowIcon
                });
                snowMarker.addTo(overlays.snowhight);
            }
            if (typeof station.properties.WG == "number") {
                let windhighlightClass = "";
                if (station.properties.WG > 10) {
                    windhighlightClass = "wind-10";
                }
                if (station.properties.WG > 20) {
                    windhighlightClass = "wind-20";
                }
                //https://leafletjs.com/reference-1.7.1.html#divicon
                let windIcon = L.divIcon({
                    html: `<div class="wind-label ${windhighlightClass}">${station.properties.WG}</div>`
                })
                //https://leafletjs.com/reference-1.7.1.html#marker
                let windMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ], {
                    icon: windIcon
                });
                windMarker.addTo(overlays.windspeed);
            }
            if (typeof(station.properties.LT) == "number") {
                let marker = newLabel(station.geometry.coordinates,{
                    value: station.properties.LT,
                });
                marker.addTo(overlays.temperatur);
            }
            map.fitBounds(overlays.stations.getBounds());
        }

    });
    
    






















