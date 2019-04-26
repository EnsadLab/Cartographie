
// COLORS
/* pas utilisé, car dans DB. Je les laisse encore là car c'est pratique d'avoir les couleurs vite sous la main pour tester
var ArtDesign_Color = "#00A3F5";
var SS_Color = "#674890";
var Science_Color = "#F8405E";
*/

//var debug_mode = false;

// SIZES
var totalWidth = 950;
var totalHeight = 750;

// TO CHECK: ALEX

// RADIUS min and max values
var rmaster_min = 100;
var rmaster_max = 120;
var rsub_min = 5;
var rsub_max = 15;
var rkey_min = 3;
var rkey_max = 5;

// Radius distance where sub categories are drawn respect to their master node
var rmaster_sub = 120;
// Radius distance where keywords are drawn respect to their sub category
var rsub_keyword = 20;

// BUBBLES look
// subcategories
var sub_strokeWidthMin = 6;
var sub_strokeWidthMax = 10;
var sub_minTrans = 0.2;
var sub_maxTrans = 0.6;
// keywords
var key_minTrans = 0.3;
var key_maxTrans = 1.0;


// ANIMATION of the master nodes
var distMasterAnim = 50; // rayon d'animation 
var numMasterPathNodes = 10; // le nombre de points utilisé pour créé le path
var durationMasterAnim = 50000; // la durée.. par la suite--> durée plus petite et path plus simple




// useful general functions
function cleanSVG(){
    d3.selectAll("svg > *").remove();
}

function getRandomInt(min,max) {
    return Math.floor(Math.random() * Math.floor(max-min) + min);
  
}

// we could use scale.linear instead....
function mapValue(v,min,max,newMin,newMax) {
    // console.log("map value:",v,min,max,newMin,newMax);
    // convert to float +v blabla...
    return ((v - min)*(newMax-newMin))/(max-min) + newMin;
}

// returns a data PATH string of an array of nb coordinates with edge length d
// useful when interpolating between an arbitrary shape of nb coordinates to a triangle
function getTrianglePath(nb,d,offset){
    var datas = getTriangleArray(nb,d);
    datas = datas.map(function(pt) {pt[0] += offset[0]; pt[1] += offset[1]; return pt; });
    var d = "M" + datas.join("L") + "Z";
    return d;
}

// returns an array of nb coordinates with edge length d
// useful when interpolating between an arbitrary shape of nb coordinates to a triangle
function getTriangleArray(nb,d){
    var data = [nb];
    //var d = 100; // TODO.. do it properly...
    var y = Math.sqrt((d*d)-((d*0.5)*(d*0.5)));
    if(nb < 3){console.log("TODO!!!!! nb < 3");}
    var p0_index = 0; 
    var p1_index = Math.ceil(nb/3.0); 
    var p2_index = p1_index + p1_index; 
    if(((nb-1)%3) == 0) p2_index -= 1;
    data[p0_index] = [0,y]; data[p1_index] = [d*0.5,0]; data[p2_index] = [d,y];
    for(var i=p0_index+1; i<p1_index; i++){
      var p = (i-p0_index) * (1.0 / (p1_index-p0_index));
      data[i] = getCoordP0P1(p,d,y);
    }
    for(var i=p1_index+1; i<p2_index; i++){
      var p = (i-p1_index) * (1.0 / (p2_index-p1_index));
      data[i] = getCoordP1P2(p,d,y);
    }
    for(var i=p2_index+1; i<nb; i++){
      var p = (i-p2_index) * (1.0 / (nb-p2_index));
      data[i] = getCoordP2P3(p,d,y);
    }
    return data;
}

function getCoordP0P1(percent,d,h){
    var x = percent * d * 0.5;
    var y = h - Math.sqrt((percent*d)*(percent*d) - x*x);
    return [x,y];
}

function getCoordP1P2(percent,d,h){
    var dx = percent * d * 0.5;
    var x = d*0.5 + percent * d * 0.5;
    var y = Math.sqrt((percent*d)*(percent*d) - dx*dx);
    return [x,y];
}

function getCoordP2P3(percent,d,h){
    var x = d - d*percent;
    var y = h;
    return [x,y];
}

function testTriangle(){

    // wil draw a triangle with 11 coords with edge length of 200 and with an offset of (500,500)
    var triangleArray = getTriangleArray(11,200);
    var off = 500;
    triangleArray = test.map(function(pt) {pt[0] += off; pt[1] += off; return pt; });
    //console.log("Generated triangle",triangleArray);

    // triangle
    svg.append("path")
        .attr("stroke","black")
        .attr("fill","orange")
        .attr("d",d)
        ;
    // points
    svg.selectAll("circle")
        .data(test)
        .enter()
        .append("circle")
        .attr("cx",d => d[0])
        .attr("cy",d => d[1])
        .attr("r",3)
        .attr("fill","black")
        ;
    // index label
    svg.selectAll("text")
        .data(test)
        .enter()
        .append("text")
        .attr("x",d => d[0])
        .attr("y",d => d[1])
        .text(function(d,i){ return i;})
        ;
    
}
