let stop = {
    nr: 9,
    name: "Sandfly Bay",
    lat: -45.896031,
    lng: 170.647314,
    user: "Ronald Christian Tabernig",
    wikipedia: "https://en.m.wikipedia.org/wiki/Sandfly_Bay"
};
console.log(stop);
console.log(stop.name);
console.log(stop.lat);
console.log(stop.lng);
console.log(stop.wikipedia);
console.log("Hello World");
console.log(L);

const map = L.map("map", {
    center: [stop.lat,stop.lng],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

//Marker
let mrk = L.marker([stop.lat,stop.lng]).addTo(map);

// Pop-Up
mrk.bindPopup(`
    <h4> Stop ${stop.nr}:${stop.name}</h4>
    <p><i class ="fas fa-external-link-alt mr-3"></i><a href = "${stop.wikipedia}" >Read about stop in Wikipedia </a></p>
`).openPopup();

// WMTS - Services
//console.log(document.querySelector("#map"))

