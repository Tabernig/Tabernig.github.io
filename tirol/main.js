/* global L */
// Bike Trail Tirol Beispiel

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
};

// Overlays für die Themen zum Ein- und Ausschalten definieren
let overlays = {
    tracks: L.featureGroup(),
    wikipedia: L.featureGroup()
};

// Karte initialisieren und auf Innsbrucks Wikipedia Koordinate blicken
let map = L.map("map", {
    fullscreenControl: true,
    center: [47.267222, 11.392778],
    zoom: 9,
    layers: [
        baselayers.grau
    ]
})
// Kartenhintergründe und Overlays zur Layer-Control hinzufügen
let layerControl = L.control.layers({
    "basemap.at Standard": baselayers.standard,
    "basemap.at grau": baselayers.grau,
    "basemap.at Relief": baselayers.terrain,
    "basemap.at Oberfläche": baselayers.surface,
    "basemap.at hochauflösend": baselayers.highdpi,
    "basemap.at Orthofoto beschriftet": baselayers.ortho_overlay
}, {
    "GPX-Tracks": overlays.tracks,
    "Wikipedia-Artikel": overlays.wikipedia
}).addTo(map);

// Overlay mit GPX-Track anzeigen
overlays.tracks.addTo(map);
overlays.wikipedia.addTo(map);

const elevationConrol = L.control.elevation({
    elevationDiv: "#profile",
    followMarker: false,
    theme: "silver-theme",
}).addTo(map);


// Wikipedia Artikel Zeichnen
const drawWikipedia = (bounds) => {
    console.log(bounds);
    let url = `https://secure.geonames.org/wikipediaBoundingBoxJSON?north=${bounds.getNorth()}&south=${bounds.getSouth()}&east=${bounds.getEast()}&west=${bounds.getWest()}&username=tabernig&lang=de`;
    console.log(url)

    // Url bei geonames.org aufrufen und JSO Daten abholen
    fetch(url).then(
        response => response.json()
    ).then(jsonData => {
        console.log(jsonData)
        // Artikel Marker erzeugen
        for (let article of jsonData.geonames) {
            let mrk = L.marker([article.lat,article.lng]);
            mrk.addTo(overlays.wikipedia)
        }
    });
};




const drawTrack = (nr) => {
    elevationConrol.clear();
    // 
    overlays.tracks.clearLayers();
    // 
    console.log("Track Nr.:",nr);
    let gpxTrack = new L.GPX(`tracks/${nr}.gpx`, {
        async: true,
        marker_options: {
            startIconUrl: `icons/number_${nr}.png`,
            endIconUrl: 'icons/finish.png',
            shadowUrl: null,
        },
        polyline_options: {
            color: 'black',
            dashArray: [2,5],
            opacity: 0.5,
            weight: 3,
            lineCap: 'round'
          },
    }).addTo(overlays.tracks);
    gpxTrack.on("loaded", () => {
        console.log("loaded gpx.");
        map.fitBounds(gpxTrack.getBounds());
        overlays.tracks.bindPopup(`
        Etappe: ${gpxTrack.get_name()} 
        <hr>
        Streckenlänge: ${Math.round(gpxTrack.get_distance())/1000} km <br>
        Minimale Höhe: ${Math.round(gpxTrack.get_elevation_max())} m <br>
        Maximale Höhe: ${Math.round(gpxTrack.get_elevation_min())} m <br>
        `);
        //  Wikipedia Artikel zeichnen
        drawWikipedia(gpxTrack.getBounds());
    });
    elevationConrol.load(`tracks/${nr}.gpx`)
};

const selectedTrack = 20;
drawTrack(selectedTrack);



console.log("BIKETIROL json", BIKETIROL);
let pulldown = document.querySelector("#pulldown");
console.log("Pulldown: ", pulldown);
let selected = "";
for (let track of BIKETIROL) {
    if (selectedTrack == track.nr) {
        selected = "selected";
    } else {
        selected = "";
    }
    pulldown.innerHTML += `<option ${selected} value="${track.nr}">${track.nr}:${track.etappe}</option>`;
}

pulldown.onchange = () => {
    console.log(pulldown.value);
    drawTrack(pulldown.value);
}

