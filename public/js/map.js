// script showing all revues on a geographical map
var projection;
var path;

var initX;
var mouseClicked = false;
var s = 1;
var rotated = 90;

//need to store this because on zoom end, using mousewheel, mouse position is NAN
var mouse;

var g;
var gRevues;

function createProjection(){
  projection = d3.geoMercator()
  .scale(153)
  .translate([totalWidth/2,totalHeight/1.5])
  .rotate([rotated,0,0]); //center on USA

  path = d3.geoPath().projection(projection);

  var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed)
    .on("end", zoomended);
  
  svg.on("wheel", function() {
      //zoomend needs mouse coords
      initX = d3.mouse(this)[0];
  })
  .on("mousedown", function() {
      //only if scale === 1
      if(s !== 1) return;
      initX = d3.mouse(this)[0];
      mouseClicked = true;
  })
  .call(zoom);

  g = svg.append("g");
  gRevues = svg.append("g");

  rotateMap(760);

}

function loadMap(){
  d3.json("maps/countries.topo.json", function(error, world) {
    if(error) return console.error(error);

    g.append("g")
        .attr("class", "boundary")
        .attr("id","map-g")
        .selectAll("boundary")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class","map-path")
        .attr("stroke-width","0.3px")
        .attr("stroke","black")
        .attr("fill","#FAFAFA")
        .attr("opacity","0.0")
        ;
    
    animateMap();

      
    // TO CHECK: ALEX - .... les labels des pays?? oui/non.. 
    /*
    g.selectAll(".country-label")
        .data(topojson.feature(world, world.objects.countries).features)
        .enter().append("text")
        .attr("class", function(d) { return "country-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("font-size","2px")
        .text(function(d) { return d.properties.name.toUpperCase();});
    */

  });
}

function animateMap() {
  d3.selectAll(".map-path").transition()
    .duration(1000)
    .attr("opacity",1.0)
    ;
}

function deleteMap() {
  d3.selectAll(".map-path").transition()
  .duration(800)
  .attr("opacity",0.0)
  .on("end",function(){
    g.selectAll("*").remove();
  })
  ;
}

function rotateMap(endX) {
  projection.rotate([rotated + (endX - initX) * 360 / (s * totalWidth),0,0]);
  g.selectAll('path').attr('d', path);
  gRevues.selectAll('path').attr('d', path);
}

function zoomended(){
  if(s !== 1) return;
  rotated = rotated + ((d3.mouse(this)[0] - initX) * 360 / (s * totalWidth));
  rotated = rotated + ((mouse[0] - initX) * 360 / (s * totalWidth));
  mouseClicked = false;
}  

function zoomed() {
  var t = [d3.event.transform.x,d3.event.transform.y];
  // s = Math.pow(d3.event.transform.k,0.1);
  s = d3.event.transform.k;
  var scale = d3.scaleLinear().domain([1.0,10.0]).range([1.0,30.0]);
  //s = scale(d3.event.transform.k);
  //console.log("s",d3.event.transform.k,s);
  var h = 0;

  t[0] = Math.min(
      (totalWidth/totalHeight)  * (s - 1), 
      Math.max( totalWidth * (1 - s), t[0] )
  );

  t[1] = Math.min(
      h * (s - 1) + h * s, 
      Math.max(totalHeight  * (1 - s) - h * s, t[1])
  );

  g.attr("transform", "translate(" + t + ")scale(" + s + ")");
  gRevues.attr("transform", "translate(" + t + ")scale(" + s + ")");
  //g.attr("transform", "translate(" + [0,0] + ")scale(" + s + ")");

  //adjust the stroke width based on zoom level
  d3.selectAll(".boundary").style("stroke-width", 0.3 / s);

  // adjust the triangle sizes!! TODO

  mouse = d3.mouse(this); 
  
  // in case we want to rotate the map when zoomed out
  if(s === 1 && mouseClicked) {
      //console.log("??",d3.mouse(this)[0],mouse[0]);
      rotateMap(d3.mouse(this)[0]);
      rotateMap(mouse[0]);
      return;
  }

}

function initGeoMap(){


  createProjection();
  loadMap();

  animateMap();
  //cleanSVG();
  startTransitionVizGeo();
  //cleanSVG();

  //var jsonData = d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json", drawMap);    
  //var jsonData = d3.json("maps/worldcountries.json",drawMap);
  //var jsonData = d3.json("maps/countries.topo.json",drawMap);


}

