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
    "BasemapAT.overlay+ortho": L.layerGroup([
        L.tileLayer.provider('BasemapAT.orthofoto'),
        L.tileLayer.provider('BasemapAT.overlay')
    ]),
    "BasemapAt.EsriNatGeo":L.tileLayer.provider("Esri.NatGeoWorldMap"),
    "BasemapAt.ESRIworldImagery":L.tileLayer.provider("Esri.WorldImagery"),
}).addTo(map);

let awsUrl = "https://wiski.tirol.gv.at/lawine/produkte/ogd.geojson";

let awsLayer = L.featureGroup();
layerControl.addOverlay(awsLayer,"Wetterstationen Tirol");
//awsLayer.addTo(map);
let snowLayer = L.featureGroup();
layerControl.addOverlay(snowLayer,"Schneehöhen");
//snowLayer.addTo(map);

let windLayer = L.featureGroup();
layerControl.addOverlay(windLayer,"Windgeschwindigkeit");
//windLayer.addTo(map);

let airTLayer = L.featureGroup();
layerControl.addOverlay(airTLayer,"Lufttemperatur");
airTLayer.addTo(map);


fetch(awsUrl)
    .then(response => response.json())
    .then(json => {
        console.log("Daten konvertiert: ", json);
        for (station of json.features) {
            console.log("Station: ", station);
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
            marker.addTo(awsLayer);
            if (station.properties.HS) {
                let highlightClass = "";
                if (station.properties.HS > 100) {
                    highlightClass = "snow-100";
                }
                if (station.properties.HS > 200) {
                    highlightClass = "snow-200";
                }
                let snowIcon = L.divIcon({
                    html:`<div class="snow-label ${highlightClass}">${station.properties.HS}</div>`
                })

                let snowMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ],{
                    icon: snowIcon
                });
                snowMarker.addTo(snowLayer);
            }
            if (station.properties.WG) {
                let windhighlightClass = "";
                if (station.properties.WG > 10) {
                    windhighlightClass = "wind-10";
                }
                if (station.properties.WG > 20) {
                    windhighlightClass = "wind-20";
                }
                let windIcon = L.divIcon({
                    html:`<div class="wind-label ${windhighlightClass}">${station.properties.WG}</div>`
                })

                let windMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ],{
                    icon: windIcon
                });
                windMarker.addTo(windLayer);
            }
            if (station.properties.LT) {
                let airThighlightClass = "";
                if (station.properties.LT > 10) {
                    airThighlightClass = "airT-10";
                }
                if (station.properties.LT > 20) {
                    airThighlightClass = "airT-20";
                }
                let airTIcon = L.divIcon({
                    html:`<div class="wind-label ${airThighlightClass}">${station.properties.LT}</div>`
                })

                let airTMarker = L.marker([
                    station.geometry.coordinates[1],
                    station.geometry.coordinates[0]
                ],{
                    icon: airTIcon
                });
                airTMarker.addTo(airTLayer);
            }
        map.fitBounds(awsLayer.getBounds());
        }

});