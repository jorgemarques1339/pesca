
const lat = 38.7;
const lon = -9.4;
const query = `[out:json];(nwr["shop"~"fishing|tackle|fishing_tackle"](around:20000,${lat},${lon});nwr["shop"~"sports|outdoors|wholesale"]["name"~"pesca",i](around:20000,${lat},${lon}););out center;`;
const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

console.log("URL:", url);

fetch(url, { headers: { 'User-Agent': 'PescaApp/1.0 (contact: info@pesca.pt)' } })
  .then(res => res.json())
  .then(data => {
    console.log("Found:", data.elements.length);
    if (data.elements.length > 0) {
        console.log("First:", data.elements[0].tags.name);
    }
  })
  .catch(err => console.error("Error:", err));
