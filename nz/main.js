let stop = {
    nr: 9,
    name: "Sandfly Bay",
    lat: -45.896031,
    lng: 170.647314,
    user: "Ronald Christian Tabernig",
    wikipedia: "https://en.m.wikipedia.org/wiki/Sandfly_Bay"
};

const map = L.map("map", {
    // center: [stop.lat,stop.lng],
    // zoom: 13,
    layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png")
    ]
});

let nav = document.querySelector("#navigation");

ROUTE.sort((stop1, stop2) => {
    return stop1.nr > stop2.nr
});

for (let entry of ROUTE) {
    //console.log(entry);
    //Marker
    nav.innerHTML += `
        <option value="${entry.user}">Stop ${entry.nr} ${entry.name}</option>
    `;


    let mrk = L.marker([entry.lat,entry.lng]).addTo(map);

    // Pop-Up
    mrk.bindPopup(`
    <h4> Stop ${entry.nr}:${entry.name}</h4>
    <p><i class ="fas fa-external-link-alt mr-3"></i><a href = "${entry.wikipedia}" >Read about this Stop in Wikipedia </a></p>
`);
    if (entry.nr == 9) {
        map.setView([entry.lat,entry.lng],13)
        mrk.openPopup();
    }
}

nav.options.selectedIndex = 9-1;
nav.onchange = (evt) => {
    let selected = evt.target.selectedIndex;
    let options = evt.target.options;
    let username = options[selected].value;
    let link = `https://${username}.github.io/nz/index.html`
    console.log(link);
    //Verlinkt auf die jeweilige Seite.
    window.location.href = link;
};


//<option value="tabernig">Sandfly Bay</option>

// //Marker
// let mrk = L.marker([stop.lat,stop.lng]).addTo(map);

// // Pop-Up
// mrk.bindPopup(`
//     <h4> Stop ${stop.nr}:${stop.name}</h4>
//     <p><i class ="fas fa-external-link-alt mr-3"></i><a href = "${stop.wikipedia}" >Read about stop in Wikipedia </a></p>
// `).openPopup();

// WMTS - Services
//console.log(document.querySelector("#map"))

// console.log(stop);
// console.log(stop.name);
// console.log(stop.lat);
// console.log(stop.lng);
// console.log(stop.wikipedia);
// console.log("Hello World");
// console.log(L);
// console.log(ROUTE);
