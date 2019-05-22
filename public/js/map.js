// script showing all revues on a geographical map
var projection;
var path;

var initX;
var mouseClicked = false;
var s = 1;
var rotated = 90;

//need to store this because on zoom end, using mousewheel, mouse position is NAN
var mouse;
var zoomGeo;

var g;
var gRevues;

function createProjection(){

    projection = d3.geoMercator()
      .scale(153)
      .translate([width/2,height/1.5])
      .rotate([rotated,0,0]); //center on USA

    path = d3.geoPath().projection(projection);

    s = 1;
    initX = 0;

    zoomGeo = d3.zoom()
      .scaleExtent([1, 10])
      .on("zoom", zoomed)
      .on("end", zoomended);

    g = d3.select("#map").append("g");
    //g = d3.select("#map").append("svg");

    svg.on("wheel", function() {
    //g.on("wheel", function() {
    //d3.select("#map").on("wheel", function() {
        //zoomend needs mouse coords
        initX = d3.mouse(this)[0];
    })
    .on("mousedown", function() {
        //only if scale === 1
        if(s !== 1) return;
        initX = d3.mouse(this)[0];
        mouseClicked = true;
    })
    .call(zoomGeo);

    
    //gRevues = svg.append("g");

    rotateMap(1040);

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
        .attr("stroke-width",mapStrokeWidth)
        .attr("stroke",strokeColor)
        .attr("fill",mapBackground)
        .attr("opacity","0.0")
        ;
    
    showMap(800);

  });
}

function showMap(d) {
  d3.selectAll(".map-path").transition()
    .duration(d)
    .attr("opacity",1.0)
    ;
}

function hideAndDeleteMap(d,reload) {
  d3.selectAll(".map-path").transition()
      .duration(d)
      .attr("opacity",0.0)
  ;
  svg.append("circle")
      .attr("id","TODELETEMAP")
      .transition()
      .duration(d)
      .on("end",function(){
        deleteMap();
        if(reload){
          state = State.LOAD;
          startGeo();
        }
        d3.select(this).remove();
      })
      ;
}

function hideMap(d){
  d3.selectAll(".map-path").transition()
    .duration(d)
    .attr("opacity",0.0)
  ;
}

function deleteMap(){
  d3.select("#map").select("g").remove();
  d3.selectAll(".boundary").remove();
}

function fadeAndDeleteTriangles(d){
  d3.selectAll(".morphopoly").transition()
    .duration(d)
    .attr("opacity",0.0)
    .on("end",function(){
      d3.select(this).remove();
    })
  ;
}

function transformMap() {
  return d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(2)
      .translate(-100, -100);
}

function recenter(){
  // innerSpace.call(zoom.transform, d3.zoomIdentity);
  //innerSpace.transition().duration(1000).call(zoom.transform, d3.zoomIdentity);
  //innerSpace.transition().duration(1000).call(zoom.transform, d3.zoomIdentity);
  svg.transition().duration(1000).call(zoomGeo.transform, transformTimeline);
}

function dezoomMap(){
    s = 1.0;
    var t =[0,0];
    g.transition()
      .duration(500)
      .attr("transform", "translate(" + t + ")scale(" + s + ")")
      ;
    d3.select("#map").selectAll(".morphopoly")
      .transition()
      .duration(500)
      .attr("transform", "translate(" + t + ")scale(" + s + ")")
      ;
}

function rotateMap(endX) {
  projection.rotate([rotated + (endX - initX) * 360 / (s * width),0,0]);
  g.selectAll('path').attr('d', path);
  //gRevues.selectAll('path').attr('d', path);
}

function zoomended(){
  if(s !== 1) return;
  rotated = rotated + ((d3.mouse(this)[0] - initX) * 360 / (s * width));
  rotated = rotated + ((mouse[0] - initX) * 360 / (s * width));
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
        (width/height)  * (s - 1), 
        Math.max( width * (1 - s), t[0] )
    );

    t[1] = Math.min(
        h * (s - 1) + h * s, 
        Math.max(height  * (1 - s) - h * s, t[1])
    );

    g.attr("transform", "translate(" + t + ")scale(" + s + ")");

    //adjust the stroke width based on zoom level
    d3.selectAll(".boundary").selectAll("path").style("stroke-width", mapStrokeWidth / s);

    //adjust the triangle sizes
    d3.select("#map").selectAll(".morphopoly").attr("transform", "translate(" + t + ")scale(" + s + ")");
    //d3.select("#map").selectAll(".morphopoly").attr("transform", "translate(" + t + ")");

    /* hmmmmm....
    d3.select("#map").selectAll(".morphopoly")
                .attr("d",function(d){
                  var id_string = d3.select(this).attr("id");
                  var id = id_string.substr(5,id_string.length);
                  //console.log("id",id);
                  var coords = dataRevue.find(data => data.id == id).locationCoords;
                  var nb = allRevuePoly.find(data => data.id == "poly" + id).nb;
                  // get triangle
                  var offset = projection(coords);
                  if(id == "revue0") console.log("coords",coords,offset);
                  var dTri = getTrianglePath(nb,triangleEdgeLength,offset);
                  return dTri;
                })
                ;*/

    mouse = d3.mouse(this); 

    // in case we want to rotate the map when zoomed out
    if(s === 1 && mouseClicked) {
        //console.log("??",d3.mouse(this)[0],mouse[0]);
        //rotateMap(d3.mouse(this)[0]);
        //rotateMap(mouse[0]);
        return;
    }

}

function initGeoMap(){

  createProjection();
  loadMap();

}

