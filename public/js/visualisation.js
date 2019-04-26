//import { strict } from "assert";

// script showing all master, sub categories and keywords

var masterNodes = [
  { "id": "master0", "name":"Art & Design", "x": 0.5, "y": 0.25, "r": 0.15, "color" : "#00A3F5FF", "angle": Math.PI/2.0,
    "subCategory" : 
    [ 
      {"id":"sub0", "name":"Education", "keywords": [ {"name":"key1"}, {"name":"key2"} ] },  
      {"id":"sub1", "name":"Education2", "keywords": [ {"name":"key1"}, {"name":"key2"} ] },
      {"id":"sub3", "name":"Education2", "keywords": [ {"name":"key1"}, {"name":"key2"} ] }
    ]
    //"subCategory" : [  {"Filmmaking"}, "Fine Arts",  "Design", "Literature", "Craft",  ]
  },
  { "id": "master1", "name":"Sciences Social & Humanities", "x": 0.3, "y": 0.6, "r": 0.15, "color" : "#674890FF", "angle": -Math.PI/6.0,
    "subCategory" : 
    [ 
      {"id":"sub0", "name":"Education", "keywords": [ {"name":"key1"}, {"name":"key2"} ] },  
      /*{"name":"Education2", "x":0.5, "keywords": [ {"name":"key1"}, {"name":"key2"} ] }*/
    ]
   // "subCategory" : ["social and behavioral", "Education", "Religion and Theology", "Languages",   "Archeology", "Journalism and Information", "Business and Admin", "Law", "History", "Philosophy"]
  },

  { "id": "master2", "name":"Science", "x": 0.7, "y": 0.6, "r": 0.15, "color" : "#F8405EFF", "angle": 7.0*Math.PI/6.0,
    "subCategory" : 
    [ 
      {"id":"sub0", "name":"Education", "keywords": [ {"name":"key1"}, {"name":"key2"} ] },  
      {"id":"sub1", "name":"Education2", "keywords": [ {"name":"key1"}, {"name":"key2"} ] }
    ]
     // "subCategory" : [   "Agriculture, forestry and fishery", "Veterinary", "Manufacturing and processing", "Mathematics and statistics",  "Engineering, Manufacturing and Construction", "Computer Science", "Life Sciences", "Health", "Physical Sciences",  "Social services"]
  }
  ];

var subNodes = [
  {"id": "sub0", "name":"Filmmaking"},
  {"id": "sub1", "name":"ine Arts"},
  {"id": "sub2", "name":"Literature"},
  {"id": "sub3", "name":"Craft"},
  {"id": "sub4", "name":"Design"}
  ];


d3.select("#testbutton").on("click", applyTest1 )


function applyTest1(){
    console.log("TEST button");
    //drawMasterCircles();
    drawMasterNodes();
}


function drawMasterNodes(){
  //const root = d3.pack(masterNodes); // check pack, layout and etc...

  // MASTER nodes
  const node = svg.selectAll("g")
      .data(masterNodes)
      .enter()
      .append("g") // check diff with join!!
      .attr("id", d => d.id )
      .attr("transform", d => `translate(${d.x * totalWidth},${d.y * totalHeight})`)
      ;
  var div_g = node.append("g");
  div_g.append("circle")
      //.attr("cx", function (d) { console.log(d.x);return d.x; })
      .attr("r", d => d.r * totalWidth)
      .attr("opacity",0.8)
      .attr("fill", function(d, i) { return "url(#grad" + i + ")"; })
      .attr("filter","url(#blur)")
      ;
  // TO CHECK: ALEX typo des master nodes... ptêt utilisé le css.. je sais pas encore ce qui est le plus pratique.
  // donc, pas encore fini.. mais tu peux déjà changer les valeurs si tu veux...
  div_g.append("text")
      .text(d => d.name.toUpperCase())
      .attr("font-family","Lato")
      .attr("family","Lato")
      .attr("text-anchor","middle")
      .attr("fill","white")
      .attr("font-size","20")
      .attr("font-weight","100")
      ; 

  // SUB nodes
  div_g.each( function(d,i) {
    drawSubNodes(d3.select(this), d3.select(this.parentNode).attr("id"));
    //animateGroup(d3.select(this), d3.select(this.parentNode).attr("id"));
    animateMasterGroup(d3.select(this), d3.select(this.parentNode).attr("id"));
  });

}


// faking database for now
var db_weightMin = 0.2;
var db_weightMax = 1.0;
var counterSub_ID = 0;
var counterKey_ID = 0;

function getFakeSubCategory(){

  var nbFakeSub = getRandomInt(4,9);

  var w = db_weightMax;
  var wStep = (db_weightMax-db_weightMin)/(nbFakeSub-1.0);
  
  var fakeSub = d3.range(nbFakeSub).map(function(d,i) {
    var subWeight = w;
    w -= wStep;
    var nbFakeKey = getRandomInt(3,6);
    nbFakeKey = 5;
    var keywords = d3.range(nbFakeKey).map(function(d,i){
      //console.log("KEYWORD id","key"+(counterKey_ID + i));
      return {id: "key"+(counterKey_ID + i),name:"name"+i}
    });
    counterKey_ID += nbFakeKey;
    // return {id: "sub"+i,name: "test", w: subWeight,keywords: [ {"name":"key1"}, {"name":"key2"} ,{"name":"key3"} ,{"name":"key4"} ,{"name":"key5"} ,{"name":"key6"} ,{"name":"key7"} ] }
    //console.log("SUB id","sub" + (counterSub_ID + i));
    return {id: "sub" + (counterSub_ID + i),name: "test", w: subWeight,keywords: keywords }
  });
  counterSub_ID += nbFakeSub;
  return fakeSub;
}


function drawSubNodes(node,masterNodeId){ 

  var result = masterNodes.filter( function(d) { return d.id == masterNodeId; })[0];
  var c = result.color;
  var angleOffset = result.angle;
  var nbSubnode = result.subCategory.length;

  // faking for now...
  var fakeSubCategory = getFakeSubCategory();
  nbSubnode = fakeSubCategory.length;
//  nbKeynode = fakeSubCategory.keywords.length;
  //console.log("nb sub",nbSubnode);
  //console.log("drawSubnode");
  const subnode = node.selectAll("g")
      //.data(d => d.subCategory)
      .data(fakeSubCategory) // on part du principe qu'ils sont dans le bon ordre selon le poids w
      .enter()
      .append("g")
      .attr("id",d => d.id)
      .attr("transform", (d,i) => {
        //var angle = (i / nbSubnode) * Math.PI * 2.0;
        //console.log("weight",d.w);
        var index = Math.ceil(i/2.0);
        if(i % 2 == 0 && i != 0) index = nbSubnode - index;
        //console.log("index",index)
        var angle = angleOffset + (index / nbSubnode) * Math.PI * 2.0;
        var x = rmaster_sub * Math.cos(angle);
        var y = rmaster_sub * Math.sin(angle);
        return `translate(${x},${y})`
      })
      ;

  //console.log("node length",node.size(),subnode.size());

  // not sure if it is the right way... but at least we don't have to store the parent g translation
  var div_g = subnode.append("g");

  div_g.append("circle")
      .attr("r",function(d){
        //var r = getRandomInt(rsub_min,rsub_max);
        var r = mapValue(d.w,db_weightMin, db_weightMax,rsub_min,rsub_max);
        d.r = r;
        return r;
      })
      .style("stroke",c)
      .style("stroke-width",function(d){
        return mapValue(d.r,rsub_min,rsub_max,sub_strokeWidthMin,sub_strokeWidthMax);
      })
      .attr("opacity",function(d){
        var t = mapValue(d.r,rsub_min,rsub_max,sub_maxTrans,sub_minTrans);
        return t;
      })
      .attr("fill","none")
      ;
  
  // KEYWORDS nodes 
  div_g.each( function() {
    //console.log("youhou",d3.select(this), d3.select(this.parentNode).attr("id"));
    drawKeywords(d3.select(this),masterNodeId,d3.select(this.parentNode).attr("id"));
    animateGroup(d3.select(this),"sub");
    var int = getRandomInt(0,3);
    //animateMasterGroup(d3.select(this),"master" + int);
  });


}

function drawKeywords(subnode, masterNodeId, subNodeId){


  var result = masterNodes.filter( function(d) { return d.id == masterNodeId; })[0];
  var c = result.color;
  //var nbKeywords = result.subCategory.filter( function(d) { return d.id == subNodeId; })[0].keywords.length;
  var nbKeywords = 5;

  const keyword = subnode.selectAll("g")
      .data(d => d.keywords)
      .enter()
      .append("g")
      .attr("transform", (d,i) => {
        //var angle = (i / nbKeywords) * Math.PI * 2.0;
        var angle = (i / nbKeywords) * Math.PI * 2.0;
        var x = (rsub_keyword+10) * Math.cos(angle);
        var y = (rsub_keyword+10) * Math.sin(angle);
        return `translate(${x},${y})`
      })
      ;

  var div_g = keyword.append("g");

  div_g.append("circle")
      .attr("id",d => "keyword" + d.id)
      .attr("r", function(d){
        d.r = getRandomInt(rkey_min,rkey_max);
        return d.r
      })
      .attr("opacity",function(d){
        return mapValue(d.r,rkey_min,rkey_max,key_maxTrans,key_minTrans);
      })
      .attr("fill", d => c)
      ;

      
  div_g.each( function() {
    animateGroup(d3.select(this),"keyword");
    var int = getRandomInt(0,3);
    //animateMasterGroup(d3.select(this),"master"+int);
  });
  
}




function animateGroup(node,nodeType){

  // new postion
  var x,y,duration;
  if(nodeType == "sub"){
    x = (Math.random()-0.5) * 30;
    y = (Math.random()-0.5) * 30;
    duration = (Math.random()) * 3000 + 3000;
  } else {
    x = (Math.random()-0.5) * 15;
    y = (Math.random()-0.5) * 15;
    duration = (Math.random()) * 3000 + 2000;
  }

  node.transition()
      .ease(d3.easeQuad)
      .duration(duration)
      .delay(getRandomInt(10,30)*100)
      .attr("transform",'translate('+ x + ',' + y + ')')
      .on("end",function() {
          animateGroup(d3.select(this),nodeType);
        });
      ;
}

function animateMasterGroup(node,id){

  //var id = node.attr("id");
  //console.log("id",id);

  node.transition()
        .ease(d3.easeLinear)
        .duration(durationMasterAnim)
        .tween("pathTween", function(){return pathTween(eval("path_"+id),d3.select(this))})
        .on("end", function(){
          console.log("end");
          animateMasterGroup(d3.select(this),id);
        })
        ;
}

function pathTween(path,node){
  var length = path.node().getTotalLength(); // Get the length of the path
  var r = d3.interpolate(0, length); //Set up interpolation from 0 to the path length
  return function(t){
      var point = path.node().getPointAtLength(r(t)); // Get the next point along the path
      //d3.select(this) // Select the circle ----- NOT WORKING IN version 4 => WHY ?????
      //d3.select("#"+id)
      node.attr("transform",'translate('+ point.x + ',' + point.y + ')')
  }
}

function drawRevuePolygon(){

  var revue = dataRevue[0];
  console.log("revue",revue);
  var poly = [{"x":100, "y":50},
  {"x":200,"y":200},
  {"x":300,"y":350},
  {"x":400,"y":600}];
  var polygons = svg//.selectAll("polygon")
  //.data(poly)
   // .enter()
    .append("polygon")
    .attr("points",function(d) { 
       return "200,10 250,190 160,210";})
        //return [d.x,d.y].join(",")})
    .attr("fill","none")
    .attr("stroke","black")
    .attr("stroke-width",1)
    .attr("opacity",0.1)
    ;
}

var path_master0;
var path_master1;
var path_master2;

function generateMasterPaths(path_master){

  var s = distMasterAnim * 2.0;

  var pathMasterNodes = d3.range(numMasterPathNodes).map(function(d,i) {
    return {x:Math.random() * s - s*0.5, y:Math.random()*s -s *0.5}
  })
  //console.log("nodes gen",pathMasterNodes);

  var lineFunction = d3.line()
                      .x(function(d) { return d.x; })
                      .y(function(d) { return d.y; })
                      .curve(d3.curveBasisClosed);


  return svg.append("path")
                      .attr("d", lineFunction(pathMasterNodes))
                      .attr("stroke", "blue")
                      .attr("stroke-width", 2)
                      .attr("fill", "none")
                      .style("opacity",0.0);

}

// TO CHECK: ALEX - master nodes grads and filter
function createDefs(){

  var defs = svg.append("defs");
  var grads = defs.selectAll("radialGradient")
                          .data(masterNodes)
                          .enter()
                          .append("radialGradient")
                          .attr("gradientUnits", "objectBoundingBox")
                          .attr("r", "50%") // default is 50%
                          .attr("id", function(d, i) { return "grad" + i; })
                          ;

  grads.append("stop").attr("offset", "0%").style("stop-color",  function(d) { return d.color;/*d.color;*/ });
  grads.append("stop").attr("offset", "100%").style("stop-color", function(d) { return "RGBA(255,255,255,0)";/*"RGBA(103,72,144,0)";/*d3.color(d.color.r,d.color.g,d.color.b,0);*/});
  
  var filterBlur = defs.append("filter")
                       .attr("id","blur")
                       .append("feGaussianBlur")
                       .attr("stdDeviation", 5)
                       ;

}





function initVisualisation(pathMasterNodes1){

  d3.selectAll("path").interrupt();
  cleanSVG();

  createDefs();
  path_master0 = generateMasterPaths(path_master0);
  path_master1 = generateMasterPaths(path_master1);
  path_master2 = generateMasterPaths(path_master2);

  drawMasterNodes();
  //drawRevuePolygon();

}