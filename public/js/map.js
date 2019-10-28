// script showing all revues on a geographical map
var projection;
var path;

var initX;
var mouseClicked = false;
var s = 1;
var t;
var rotated = -10;

//need to store this because on zoom end, using mousewheel, mouse position is NAN
var mouse;
var zoomGeo;

var g;
var gRevues;

var mapwidth = 1010; // a ne surtout pas changer (valeur interne)
var mapheight = 798; // a ne surtout pas changer (valeur interne)

function createProjection(){

    var initScale = 150*width/942;  

    projection = d3.geoMercator()
      .scale(initScale) // 150: default scale
      //.scale(150)
      .translate([width/2,height/1.4])
      .rotate([rotated,0,0]) //center on USA
      ;

    path = d3.geoPath().projection(projection);

    s = 1;
    initX = 0;

    /*svgViewport = d3.select("#timeline")
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    ;*/

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

    //rotateMap(1040);

}

function loadMap(duration){
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
        //.attr("stroke-width",mapStrokeWidth)
        //.attr("stroke",mapStrokeColor)
        .attr("fill",mapBackground)
        .attr("opacity","0.0")
        ;
    
    showMap(duration);

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
          startGeo(true);
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
     // .translate(width / 2, height / 1.4)
     // .scale(1.5)
      .translate(500, 0)
      ;
}

function recenterRevue(revueId){
  if(s<=1.0) return;
  var coord = dataRevue.find(function(data){ return data.id == revueId}).locationCoords;
  //var name = dataRevue.find(data => data.id == revueId).name;
  var offset = projection(coord);
  var translateDiffX = -offset[0]*s + (mapwidth*0.5);
  var translateDiffY = -offset[1]*s + (mapheight*0.5);
  //console.log("NEW TRANS:",translateDiffX,translateDiffY);
  
  
  // TO CHECK: ALEX - solution A fait des zoom/dezoom trop violent je pense
  // *** solution A ***
  
  var duration = 1000;
  svg.transition().duration(duration).call(zoomGeo.transform,
      d3.zoomIdentity.translate(translateDiffX,translateDiffY).scale(s))
  ;
  // *****************
  
    
  // *** solution B ***
  /*
  t = [translateDiffX,translateDiffY];
  var duration = 1200;
  g.transition().duration(duration).attr("transform", "translate(" + t + ")scale(" + s + ")");
  d3.selectAll(".boundary").selectAll("path").transition().duration(duration).style("stroke-width", mapStrokeWidth / s);
  d3.select("#map").selectAll(".morphopoly").transition().duration(duration).attr("transform", "translate(" + t + ")scale(" + s + ")");
  */
  // *****************
  
}


function dezoomMap(duration){
  console.log("a");
    sMap_saved = s;
    s = 1.0;
    var t =[0,0];
    d3.selectAll(".map-path").transition()
      .duration(duration)
      .attr("opacity",0.0)
      ;
    g.transition()
      .duration(duration)
      .attr("transform", "translate(" + t + ")scale(" + s + ")")
      .on("end",function(){
        deleteMap();
        svg.call(zoomGeo.transform,d3.zoomIdentity.translate(0,0).scale(s));
        
      })
      ;
}

// dezoom/fade everything and delete all objects at end
// when reload is true, will restart the map -> see startGeo()
var sMap_saved = s;
function dezoomMapAndTriangles(duration,reload){
  console.log("dezoomMapAndTriangles");
  sMap_saved = s;
  s = 1.0;
  var t =[0,0];
  d3.selectAll(".map-path").transition()
    .duration(duration)
    .attr("opacity",0.0)
    ;
  g.transition()
    .duration(duration)
    .attr("transform", "translate(" + t + ")scale(" + s + ")")
    .on("end",function(){
      


      t = [0.0,0.0];
      s = 1.0;
      /*var duration = 1200;
      g.transition().duration(duration).attr("transform", "translate(" + t + ")scale(" + s + ")");
      d3.selectAll(".boundary").selectAll("path").transition().duration(duration).style("stroke-width", mapStrokeWidth / s);
      d3.select("#map").selectAll(".morphopoly").transition().duration(duration).attr("transform", "translate(" + t + ")scale(" + s + ")");
      */


      deleteMap();
      svg.call(zoomGeo.transform,d3.zoomIdentity.translate(0.0,0.0).scale(s));
      if(reload){
        state = State.LOAD;
        startGeo(true);
      }    
    })
    ;
  d3.select("#map").selectAll(".morphopoly")
    .transition()
    .duration(duration)
    .attr("opacity",0.0)
    .attr("transform", "translate(" + t + ")scale(" + s + ")")
    .on("end",function(){
      d3.select(this).remove();
    })
    ;
}

// to be tested
function reset(){
  svg.transition()
    .duration(1000)
    .call(zoomGeo.transform,d3.zoomIdentity)
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
  //rotated = rotated + ((mouse[0] - initX) * 360 / (s * width));
  mouseClicked = false;
}  

function zoomed() {
    //console.log("BEFORE t",t);
    t = [d3.event.transform.x,d3.event.transform.y];
    //console.log("AFTER t",t);
    s = d3.event.transform.k;
    //var scale = d3.scaleLinear().domain([1.0,10.0]).range([1.0,30.0]); 
    //s = 2.0; // pour fixer le scale à double

    var h = 0;
    t[0] = Math.min(
        (width/height)  * (s - 1),
        Math.max( width * (1 - s), t[0] )
    );

    t[1] = Math.min(
        h * (s - 1) + h * s, 
        Math.max(height  * (1 - s) - h * s, t[1])
    );

    //console.log("current scale and translate",s,t);
    g.attr("transform", "translate(" + t + ")scale(" + s + ")");

    //adjust the stroke width based on zoom level
    d3.selectAll(".boundary").selectAll("path").style("stroke-width", mapStrokeWidth / s);

    //adjust the triangle sizes
    d3.select("#map").selectAll(".morphopoly").attr("stroke-width",triangleStrokeWidth / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    
    mouse = d3.mouse(this); 

    // in case we want to rotate the map when zoomed out
    if(s === 1 && mouseClicked) {
        //console.log("??",d3.mouse(this)[0],mouse[0]);
        //rotateMap(d3.mouse(this)[0]);
        //rotateMap(mouse[0]);
        return;
    }

}

function initGeoMap(duration){

  console.log("bla");
  createProjection();
  
  loadMap(duration);
  console.log("bla B");

}

