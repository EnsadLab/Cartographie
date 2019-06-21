
// COLORS
/* Pratique d'avoir les couleurs vite sous la main pour tester
var ArtDesign_Color = "#00A3F5";
var SS_Color = "#674890";
var Science_Color = "#F8405E";
*/


// SIZES
var sf = 1.0; // a changer a notre guise...
var width = 1440; 
var height = 900; 

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var scale = windowWidth/width;

width = windowWidth;
height = windowHeight;

console.log("WINDOW SIZES",window.innerWidth,window.innerHeight);

// RADIUS min and max values
var rmaster_min = 100 * scale * sf;//80
var rmaster_max = 400 * scale * sf;//300
var rsub_min = 5 * scale * sf;//4
var rsub_max = 40 * scale * sf;//30
var rkey_min = 2 * scale * sf;//3
var rkey_max = 20 * scale * sf;//10

// Radius distance where sub categories are drawn respect to their master node
var rmaster_sub = 160 * scale * sf;//120
// Radius distance where keywords are drawn respect to their sub category
var rsub_keyword = 30 * scale * sf;//20

// BUBBLES look
// subcategories
var sub_strokeWidthMin = 4 * scale * sf;
var sub_strokeWidthMax = 15 * scale * sf;
var sub_minTrans = 0.1;
var sub_maxTrans = 0.6;//0.4
// keywords
var key_minTrans = 0.2;
var key_maxTrans = 1.0;


// TEXT SIZES
var masterFontSize = 20*scale * sf;
var subFontSize = 14*scale * sf;
var keyFontSize = 8*scale * sf;

// TEXT LENGTH and LINE HEIGHT - keywords and sub labels
var keywordsTextLength = 70*scale * sf;
var keywordsLineHeight = 7*scale * sf; 
var subTextLength = 50*scale * sf;
var subLineHeight = 15*scale * sf;

// OBJ VIEW
var defaultObjectOpacity = 0.7;
var minObjectOpacity = 0.1;
var maxObjectOpacity = 1.0;
var xCenterObjView = width/3.0;
var yCenterObjView = height/2.0;
// OBJ DASH CIRCLES
var firstRadius = 100*scale * sf;
var secondRadius = 200*scale * sf;
var thirdRadius = 300*scale * sf;
var radiusOpacity = 0.2;
var dasharrayNB = 6;
var radiusObject = 12*scale * sf; 
var rMinObject = firstRadius;
var rMaxObject = thirdRadius;

// OBJ FONT SIZES
var keywordFontSizeOBJ = 10*scale * sf; // label on ob view
var subFontSizeOBJ = 14*scale * sf;
var masterFontSizeOBJ = 20*scale * sf;
var keywordsTextLengthOBJ = 100*scale * sf; // length of label on obj view
var keywordsLineHeightOBJ = 12*scale * sf; 
var subTextLengthOBJ = 100*scale * sf;
var subLineHeightOBJ = 15*scale * sf;
var masterTextLengthOBJ = 100*scale * sf;
var masterLineHeightOBJ = 15*scale * sf;

// OBJ SUB stroke width
var strokeWidthSubNodeOBJ = 6 * scale * sf;

// MAP
var triangleDefaultOpacity = 0.1;
var triangleEdgeLength = 5*scale*sf; // edge lenth du triangle
var triangleHightlighted = 20*scale*sf;
var mapBackground = "#E5F6FE";
var mapStrokeWidth = 0; // be sure stroke is uncommented in loadMap()
var mapStrokeColor = "white"; // be sure stroke is uncommented in loadMap()
var triangleStrokeWidth = 1.0;

// TIMELINE
var barColor = "#DADADA";
var barHeight = 5; // TO CHECK ASK ALEX: depending on scale as well?
var stepBetweenBars = 2; // TO CHECK ASK ALEX: depending on scale as well?

// DETAIL VIEW
var xCenterDetailView = width/3.0;
var yCenterDetailView = height/2.0;
var masterRadiusDetail = 60 * scale * sf;
var subRadiusDetail = 10 * scale * sf;
var keywordRadiusDetail = 6 * scale * sf;
var offsetYMasterDetail = -25 * scale * sf;
var offsetYSubDetail = -20 * scale * sf;
var offsetYKeywordDetail = -18 * scale * sf;
var fontTypeDetail = "latoregular";
var fontSizeDetail = 14 * scale * sf;
var strokeWidthSubNode = 7 * scale * sf;


// useful general functions
function cleanSVG(){
    d3.selectAll("svg > *").remove();
}

function getRandomInt(min,max) {
    return Math.floor(Math.random() * Math.floor(max-min) + min);
  
}

function getArrayWithUniqueElem(a){
    var result = [];
    a.forEach(function(item) {
         if(result.indexOf(item) < 0) {
             result.push(item);
         }
    });
    return result;
}

function getArrayWithUniqueElemAndKey(a){
    var result = [];
    var nb_min = Number.MAX_SAFE_INTEGER;
    var nb_max = 0;
    var nb_second_max = 0;
    a.forEach(function(item) {
        var d = result.filter(function(d){ return d.id == item});
        // if the item with the id is not already in our result array yet
        if(d.length == 0){
            var r = a.filter(function(d){return d == item}).length;
            var parent = dataLinks.find( data => data.id == item).parent;
            result.push({id: item, nb: r, parent: parent});
            if(r > nb_max) {nb_second_max = nb_max; nb_max = r;}
            if(r > nb_second_max && r < nb_max) nb_second_max = r;
            if(r < nb_min) nb_min = r;
        }
    });

    if(nb_max == 1) nb_max = 2;

    result.push({id:"DATA_MIN",nb:nb_min});
    result.push({id:"DATA_MAX",nb:nb_max});
    result.push({id:"DATA_SECOND_MAX",nb:nb_second_max});
    return result;
}

function scaleCoordsOnCenter(coords,scale){

    var box = getBox(coords);
    coords.forEach(function(d,i){
        var coord = d.coord;
        var diffX = coord[0]-box.cx;
        var diffY = coord[1]-box.cy;
        var newX = box.cx + diffX*scale;
        var newY = box.cy + diffY*scale;
        d.coord = [newX,newY];
        
    });
    return coords;
}

// not tested.. no use anymore. leave it in case
function moveCoordsOnCenter(coords,trans){
    var box = getBox(coords);
    var transX = trans[0]-box.cx;
    var transY = trans[1]-box.cy;
    coords.forEach(function(d,i){
        var coord = d.coord;
        var newX = coord[0]+transX;
        var newY = coord[1]+transY;
        d.coord = [newX,newY];
    });
    return coords;
}

function getBox(coords){
    var x=Number.MAX_SAFE_INTEGER;y=Number.MAX_SAFE_INTEGER;xMax=0;yMax=0; w=0,h=0;
    coords.forEach(function(d,i){
        var coord = d.coord;
        if(coord[0] < x) x = coord[0];
        if(coord[1] < y) y = coord[1];
        if(coord[0] > xMax) xMax = coord[0];
        if(coord[1] > yMax) yMax = coord[1];
    })
    w = xMax-x;
    h = yMax-y;
    return {x:x,y:y,xMax:xMax,yMax:yMax,w:w,h:h,cx:x+w*0.5,cy:y+h*0.5};
}

function getBoxFromArray(coords){
    var x=Number.MAX_SAFE_INTEGER;y=Number.MAX_SAFE_INTEGER;xMax=0;yMax=0; w=0,h=0;
    coords.forEach(function(d,i){
        if(d[0] < x) x = d[0];
        if(d[1] < y) y = d[1];
        if(d[0] > xMax) xMax = d[0];
        if(d[1] > yMax) yMax = d[1];
    })
    w = xMax-x;
    h = yMax-y;
    return {x:x,y:y,xMax:xMax,yMax:yMax,w:w,h:h,cx:x+w*0.5,cy:y+h*0.5};
}

// we could use scale.linear instead....
function mapValue(v,min,max,newMin,newMax) {
    // console.log("map value:",v,min,max,newMin,newMax);
    // convert to float +v blabla...
    // TODO: careful:: MAX-MIN COULD EQUAL ZERO
    return ((v - min)*(newMax-newMin))/(max-min) + newMin;
}

function clone(selector) {
    var node = d3.select(selector).node();
    return d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling));
}

function scaleCoords(coords,d){
    var box = getBox(coords);
    var scaleCoords = [];
    var newH,newW,r,offsetX,offsetY;
    if(box.w > box.h){
        newH = d*box.h/box.w;
        newW = d;
        r = d/box.w;
        offsetX = -box.x*r;
        offsetY = -box.y*r + (d - newH)*0.5;
    } else if(box.h > box.w){
        newW = d*box.w/box.h;
        newH = d;
        r = d/box.h;
        offsetY = -box.y*r;
        offsetX = -box.x*r + (d-newW)*0.5;
    }
    for(var i=0; i<coords.length; i++){
        var c = coords[i].coord;
        //console.log("c",c,r);
        var newMinx = box.x*r;
        var newMiny = box.y*r;
        //scaleCoords.push([c[0]*r - newMinx,c[1]*r - newMiny]);
        scaleCoords.push([c[0]*r + offsetX,c[1]*r + offsetY]);
    }
    //console.log("return coords",scaleCoords);
    return scaleCoords;
}


// to test wrapping function
function testWrap(){

    svg.append("text")
      .text("Peace and Conflict studies / Human rights Peace and Conflict studies / Human rights")
      .attr("font-family","latoregular")
      .attr("text-anchor","start")
      .attr("x",100)
      .attr("y",35)
      .style("alignment-baseline","middle")
      .attr("fill",function(){
        return "pink";
      })
      .attr("opacity","1.0")
      .attr("font-size","8")
      .call(wrap,15,5)
      ; 
    svg.append("text")
      .text("SOCIAL AND BEHAVORIAL")
      .attr("font-family","latohairline")
      .attr("x",100)
      .attr("y",100)
      //.attr("text-anchor","middle")
      //.style("alignment-baseline","middle")
      .attr("fill",function(){
        return "orange";
      })
      .attr("opacity",1.0)
      .attr("font-size","15")
      .call(wrap,subTextLength,subLineHeight)
      ; 

}

// TO CHECK
function wrap(text, width, lineHeight) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0, 
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0;

            d3.select(this).selectAll("tspan").remove();
            
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy);
                        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy)
                            .text(word);
            }
        }
        var yCentered = +y - ((lineNumber) * lineHeight) * 0.5;
        d3.select(this).attr("y",yCentered)
            .selectAll("tspan")
            .attr("y",yCentered)
        ;
    });
    
}


function wrapSub(text, width, lineHeight) {
    var debug = false;
    console.log("coucou");
    console.log("t",text.text());
    if(text.text().startsWith("Religion")) debug = true;
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0, 
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0;

            d3.select(this).selectAll("tspan").remove();
            
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy);
                        
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy)
                            .text(word);
            }
        }
        if(debug)console.log("ladjlfsjfl",lineNumber,lineHeight,lineNumber*lineHeight,y);
        d3.select(this).attr("y",y - (lineNumber*lineHeight) );
        console.log("test");
        /*
        var yCentered = +y - ((lineNumber) * lineHeight) * 0.5;
        d3.select(this).attr("y",yCentered)
            //.style("alignment-baseline","ideographic")
            .selectAll("tspan")
            .attr("y",yCentered)
        ;*/
    });
    
}

// returns a data PATH string of an array of nb coordinates with w and h sizes
// useful when interpolating between an arbitrary shape of nb coordinates to a rectangle
function getRectanglePath(nb,w,h,offset){
    var datas = getRectangleArray(nb,w,h);
    datas = datas.map(function(pt) {pt[0] += offset[0]; pt[1] += offset[1]; return pt; });
    var d = "M" + datas.join("L") + "Z";
    return d;
}

// returns an array of nb coordinates with w and h sizes
// useful when interpolating between an arbitrary shape of nb coordinates to a rectangle
function getRectangleArray(nb,w,h){
    var datas = [nb];
    if(nb < 4){console.log("TODO!!!!! nb < 4");}
    datas[0] = [0,0]; // top left
    var index_topRight = Math.floor(nb/2.0)-1;
    datas[index_topRight] = [w,0]; // top right

    var index_bottomRight = Math.floor(nb/2.0);
    datas[index_bottomRight] = [w,h]; // bottom right
    datas[nb-1] = [0,h]; // botttom left

    // datas in between
    var index = 0;
    for(var i=1; i<index_topRight; i++){
        var wi = (index+1) * (w/(index_topRight));
        datas[i] = [wi,0];
        index++;
    }
    var index = 0;
    for(var i=index_bottomRight+1; i<nb-1; i++){
        var wi = w - (index+1) * (w/(nb-1-index_bottomRight));
        datas[i] = [wi,h];
        index++;
    }
    return datas;
}

// returns a data PATH string of an array of nb coordinates with edge length d
// useful when interpolating between an arbitrary shape of nb coordinates to a triangle
function getTrianglePath(nb,d,offset){
    var datas = getTriangleArray(nb,d);
    //console.log("datas",datas);
    //console.log("OFFSET",offset);
    datas = datas.map(function(pt) {pt[0] += offset[0]-d*0.5; pt[1] += offset[1] - d*0.5; return pt; });
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
      //console.log("data i",data[i]);
    }
    for(var i=p1_index+1; i<p2_index; i++){
      var p = (i-p1_index) * (1.0 / (p2_index-p1_index));
      data[i] = getCoordP1P2(p,d,y);
      //console.log("data i",data[i]);
    }
    for(var i=p2_index+1; i<nb; i++){
      var p = (i-p2_index) * (1.0 / (nb-p2_index));
      data[i] = getCoordP2P3(p,d,y);
      //console.log("data i",data[i]);
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

    // will draw a triangle with 11 coords with edge length of 200 and with an offset of (500,500)
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

d3.selection.prototype.moveToFront = function() {  
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };

d3.selection.prototype.moveToBack = function() {  
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    });
};
