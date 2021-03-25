console.log("Hello World");
console.log(L);

const map = L.map("map", {
    center: [-45.896031, 170.647314],
    zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});
// WMTS - Services
console.log(document.querySelector("#map"))

