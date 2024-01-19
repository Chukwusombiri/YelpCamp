mapboxgl.accessToken = mapToken;
const campMap = camp; 
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v12',
center: campMap.geometry.coordinates,
zoom: 9,
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker()
.setLngLat(campMap.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${campMap.title}</h3>`
    )
)
.addTo(map);