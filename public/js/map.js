// script showing all revues on a geographical map


const projection = d3.geoMercator();
const path = d3.geoPath().projection(projection);
//const graticule = d3.geoGraticule();

function drawMap(err, world) {
    if (err) throw err

    svg.append("path")
      .attr("class", "foreground")
      .attr("d", path);

      
    svg.append("g")
      .selectAll("path")
      .data(topojson.feature(world, world.objects.countries).features)
      .enter().append("path")
      .attr("d", path);
}


function initGeoMap(){
    var jsonData = d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json", drawMap);    

}

