// OGD-Wien Beispiel

// Kartenhintergründe der basemap.at definieren
let baselayers = {
    standard: L.tileLayer.provider("BasemapAT.basemap"),
    grau: L.tileLayer.provider("BasemapAT.grau"),
    terrain: L.tileLayer.provider("BasemapAT.terrain"),
    surface: L.tileLayer.provider("BasemapAT.surface"),
    highdpi: L.tileLayer.provider("BasemapAT.highdpi"),
    ortho_overlay: L.layerGroup([
        L.tileLayer.provider("BasemapAT.orthofoto"),
        L.tileLayer.provider("BasemapAT.overlay")
    ]),
    minimap: L.tileLayer.provider("OpenRailwayMap",{minZoom: 0, maxZoom: 13})
};

// Overlays für die Themen zum Ein- und Ausschalten definieren
let overlays = {
    busLines: L.featureGroup(),
    busStops: L.markerClusterGroup(),
    pedAreas: L.featureGroup(),
    sights: L.featureGroup()
};

// Karte initialisieren und auf Wiens Wikipedia Koordinate blicken
let map = L.map("map", {
    fullscreenControl: true,
    center: [48.208333, 16.373056],
    zoom: 13,
    layers: [
        baselayers.grau
    ]
});

// Kartenhintergründe und Overlays zur Layer-Control hinzufügen
let layerControl = L.control.layers({
    "basemap.at Standard": baselayers.standard,
    "basemap.at grau": baselayers.grau,
    "basemap.at Relief": baselayers.terrain,
    "basemap.at Oberfläche": baselayers.surface,
    "basemap.at hochauflösend": baselayers.highdpi,
    "basemap.at Orthofoto beschriftet": baselayers.ortho_overlay
}, {
    "Liniennetz Vienna Sightseeing": overlays.busLines,
    "Haltestellen Vienna Sightseeing": overlays.busStops,
    "Fußgängerzonen": overlays.pedAreas,
    "Sehenswürdigkeiten": overlays.sights
}).addTo(map);



// alle Overlays nach dem Laden anzeigen
overlays.busLines.addTo(map);
overlays.busStops.addTo(map);
overlays.pedAreas.addTo(map);
overlays.sights.addTo(map);


let drawBusStop = (geoJsonData) => {
    L.geoJson(geoJsonData, {
        onEachFeature: (feature, layer) => { //Stellt bei jedem Marker ein Pop-up mit Namen dar
            layer.bindPopup(`<strong>${feature.properties.LINE_NAME}</strong>
            <hr>
            Station: ${feature.properties.STAT_NAME}`)
        },
        pointToLayer: (geoJsonPoint, latlng) => { //Veraendert Marker Symbol
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/busstop.png",
                    iconSize: [20, 20],
                })
            })
        },
        attribution: "<a href='https://data.wien.gv.at'>Stadt Wien</a>"
    }).addTo(overlays.busStops); //alternativ map wenn nicht optional sein soll
}
let drawSights = (geoJsonData) => {
    L.geoJson(geoJsonData, {
        onEachFeature: (feature, layer) => { //Stellt bei jedem Marker ein Pop-up mit Namen dar
            layer.bindPopup(`<strong>${feature.properties.NAME}</strong>
            <hr>
            Adresse: ${feature.properties.ADRESSE}`)
        },
        pointToLayer: (geoJsonPoint, latlng) => { //Veraendert Marker Symbol
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/sehenswuerdigogd.png",
                    iconSize: [20, 20],
                })
            })
        },
        attribution: "<a href='https://data.wien.gv.at'>Stadt Wien</a>"
    }).addTo(overlays.sights); //alternativ map wenn nicht optional sein soll
}


let drawBusLines = (geoJsonData) => {
    L.geoJson(geoJsonData, {
        style: (feature) => {
            let col =  COLORS.buslines["Red Line"];
            col = COLORS.buslines[feature.properties.LINE_NAME]
            return {
                color: col 
            }
        },
        onEachFeature: (feature, layer) => { //Stellt bei jedem Marker ein Pop-up mit Namen dar
            layer.bindPopup(`<strong>${feature.properties.LINE_NAME}</strong>
            <hr>
            von: ${feature.properties.FROM_NAME}<br>
            nach: ${feature.properties.TO_NAME}`)
        },
        attribution: "<a href='https://data.wien.gv.at'>Stadt Wien</a>"
    }).addTo(overlays.busLines); //alternativ map wenn nicht optional sein soll
}
let drawPedZone = (geoJsonData) => {
    L.geoJson(geoJsonData, {
        style: (feature) => {
            return {
                stroke: true,
                color: "silver",
                fillColor: "yellow",
                fillOpacity: 0.3
            }
        },
        onEachFeature: (feature, layer) => { //Stellt bei jedem Marker ein Pop-up mit Namen dar
            layer.bindPopup(`<strong>Fussgängerzone: ${feature.properties.ADRESSE}</strong>
            <hr>
            ${feature.properties.ZEITRAUM || ""} <br>
            ${feature.properties.AUS_TEXT || ""}  `)
        },
        attribution: "<a href='https://data.wien.gv.at'>Stadt Wien</a>"
    }).addTo(overlays.pedAreas); //alternativ map wenn nicht optional sein soll
}

for (let config of OGDWIEN) {
    //console.log("Config: ", config.data)
    fetch(config.data)
        .then(response => response.json())
        .then(geoJsonData => {
            //console.log("Data: ", geoJsonData);
            if (config.title == "Haltestellen Vienna Sightseeing") {
                drawBusStop(geoJsonData);
            }
            if (config.title == "Liniennetz Vienna Sightseeing") {
                drawBusLines(geoJsonData);
            }
            if (config.title == "Fußgängerzonen") {
                drawPedZone(geoJsonData);
            }
            if (config.title == "Sehenswürdigkeiten") {
                drawSights(geoJsonData);
            }
        })
}

// Leaflet hash
L.hash(map);

// Minimap
var miniMap = new L.Control.MiniMap(
    baselayers.minimap, {
    toggleDisplay: true,
    minimized: false,
    }
).addTo(map);

// Reachability Plugin

let styleIntervals = (feature) => {
    let color = "";
    let range = feature.properties.Range;
    if (feature.properties.Measure === "time") {
        color = COLORS.minutes[range];
    } else if (feature.properties.Measure === "distance") {
        color = COLORS.kilometers[range];
    } else {
        color = "black";

    }
    return {
        color: color,
        opacity: 0.5,
        fillOpacity: 0.2
    };
}


// 5b3ce3597851110001cf6248cecdb0498c1043eb9a52a444304918f6
// Initialise the reachability plugin
L.control.reachability({
    // add settings/options here
    apiKey: '5b3ce3597851110001cf6248cecdb0498c1043eb9a52a444304918f6',
    styleFn: styleIntervals,
    drawButtonContent: '',
    drawButtonStyleClass: 'fa fa-pencil-alt fa-2x',
    deleteButtonContent: '',
    deleteButtonStyleClass: 'fa fa-trash fa-2x',
    distanceButtonContent: '',
    distanceButtonStyleClass: 'fa fa-road fa-2x',
    timeButtonContent: '',
    timeButtonStyleClass: 'fa fa-clock fa-2x',
    travelModeButton1Content: '',
    travelModeButton1StyleClass: 'fa fa-car fa-2x',
    travelModeButton2Content: '',
    travelModeButton2StyleClass: 'fa fa-bicycle fa-2x',
    travelModeButton3Content: '',
    travelModeButton3StyleClass: 'fa fa-male fa-2x',
    travelModeButton4Content: '',
    travelModeButton4StyleClass: 'fa fa-wheelchair fa-2x',
}).addTo(map);