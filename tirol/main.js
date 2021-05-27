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
let articelDrawn = {};

const drawWikipedia = (bounds) => {
    // console.log(bounds);
    let url = `https://secure.geonames.org/wikipediaBoundingBoxJSON?north=${bounds.getNorth()}&south=${bounds.getSouth()}&east=${bounds.getEast()}&west=${bounds.getWest()}&username=tabernig&lang=de`;
    // console.log(url)

               
    let icons = {
        adm1st: "wikipedia_administration.png",
        adm2nd: "wikipedia_administration.png",
        adm3rd: "wikipedia_administration.png",
        airport: "wikipedia_helicopter.png",
        city: "wikipedia_smallcity.png",
        glacier: "wikipedia_glacier-2.png",
        landmark: "wikipedia_landmark.png",
        railwaystation: "wikipedia_train.png",
        river: "wikipedia_river-2.png",
        mountain: "wikipedia_mountains.png",
        waterbody: "wikipedia_lake.png",
        default: "wikipedia_information.png",
};

    // Url bei geonames.org aufrufen und JSO Daten abholen
    fetch(url).then(
        response => response.json()
    ).then(jsonData => {
        // console.log(jsonData)

        // Artikel Marker erzeugen
        for (let article of jsonData.geonames) {
            // Überprüfen ob der Artikel schon gezeichnet wurde:
            if (articelDrawn[article.wikipediaUrl]) {
                // ja, nicht noch einmal zeichnen
                // console.log("schon gesehen", article.wikipediaUrl)
                continue;
            } else {
                // Artikel nur einmal zeichnen
                articelDrawn[article.wikipediaUrl] = true;
            };

            // Welches Icon soll verwendet werden?
            if (icons[article.feature]) {
                // ein Bekanntes
            } else {
                // ein generisches Info-Icon
                article.feature = "default";
            }

            let mrk = L.marker([article.lat,article.lng],{
                icon: L.icon({
                    iconUrl: `icons/${icons[article.feature]}`,
                    iconSize: [32,37],
                    iconAnchor: [16,37],
                    popupAnchor: [0,-37],
                })
            });
            mrk.addTo(overlays.wikipedia);

            // optionales Bild für Artikel definieren:
            let img = "";
            if (article.thumbnailImg) {
                img = `<img src="${article.thumbnailImg}" 
                alt = "thumbnail">`;
            }
            
            // Popup erzeugen
            mrk.bindPopup(`
                <small>${article.feature}</small>
                <h3>${article.title} (${article.elevation}m)</h3>
                ${img}
                <p>${article.summary}</p>
                <a target ="Wikipedia" href = "https://${article.wikipediaUrl}">Wikipedia Artikel</a>
            `);

        }
    });
};




const drawTrack = (nr) => {
    elevationConrol.clear();
    // 
    overlays.tracks.clearLayers();
    // 
    // console.log("Track Nr.:",nr);
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
        // console.log("loaded gpx.");
        map.fitBounds(gpxTrack.getBounds());
        overlays.tracks.bindPopup(`
        Etappe: ${gpxTrack.get_name()} 
        <hr>
        Streckenlänge: ${Math.round(gpxTrack.get_distance())/1000} km <br>
        Minimale Höhe: ${Math.round(gpxTrack.get_elevation_max())} m <br>
        Maximale Höhe: ${Math.round(gpxTrack.get_elevation_min())} m <br>
        `);
        
    });
    elevationConrol.load(`tracks/${nr}.gpx`)
};

const selectedTrack = 20;
drawTrack(selectedTrack);

// Ändere Texte
const updateTexts = (nr) => {
    // console.log(nr);
    for (let etappe of BIKETIROL) {
        // console.log(etappe)
        // ist es die aktuelle Etappe?
        if (etappe.nr == nr) {
            console.log("unsere Etappe",etappe);
            for (let key in etappe) {
                console.log(key,etappe[key])
            }
        }
    }
};



// console.log("BIKETIROL json", BIKETIROL);
let pulldown = document.querySelector("#pulldown");

// console.log("Pulldown: ", pulldown);
let selected = "";
for (let track of BIKETIROL) {
    if (selectedTrack == track.nr) {
        selected = "selected";
    } else {
        selected = "";
    }
    pulldown.innerHTML += `<option ${selected} value="${track.nr}">${track.nr}:${track.etappe}</option>`;
}

updateTexts(pulldown.value);

//  Eventhandler für Änderungen des Pulldowns
pulldown.onchange = () => {
    // console.log(pulldown.value);
    drawTrack(pulldown.value);

    // Metadaten der Etappe Updaten
    updateTexts(pulldown.value);
};


map.on("zoomend moveend", () => {
    //  Wikipedia Artikel zeichnen
    drawWikipedia(map.getBounds());
});



