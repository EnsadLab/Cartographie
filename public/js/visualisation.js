

// script showing all master, sub categories and keywords


var masterAnims = [];
var subAnims = [];
var keyAnims = [];

var durationFadeAnim = 800;
function createMasterNodes(){

  // MASTER nodes
  const node = svg.select("#nodes").selectAll("g")
      .data(masterNodes)
      .enter()
      .append("g") // check diff with join!!
      .attr("id", d => d.id )
      .attr("transform", d => `translate(${d.x * width},${d.y * height})`)
      ;
  var div_g = node.append("g")
  /*
      .on("mouseenter",function(d){
        d3.select(this).style("cursor", "pointer");
      })    
      .on("mouseleave",function(d){
        d3.select(this).style("cursor", "default");
      })
      .on("click",function(d){console.log("### mouseclick",d.id);startObj(d.id);})
  */
      ;

  div_g.append("circle")
      .attr("class","master-circle")
      .attr("r", function(d){
        d.r = mapValue(d.w,mweight_min, mweight_max,rmaster_min,rmaster_max);
        return d.r;
      })
      .transition()
      .duration(durationFadeAnim)
      //.on("end",function(){animDone = true;})
      .attr("opacity",function(d){
        return 0.8;
      })
      .attr("fill", function(d, i) { return "url(#grad" + i + ")"; })
      .attr("filter","url(#blur)")
      ;
  // TO CHECK: ALEX typo des master nodes... ptêt utilisé le css.. je sais pas encore ce qui est le plus pratique.
  // donc, pas encore fini.. mais tu peux déjà changer les valeurs si tu veux...
  div_g.append("text")
      .text(d => d.name.toUpperCase())
      .attr("font-family","latohairline")
      .attr("text-anchor","middle")
      .style("alignment-baseline","middle")
      .attr("fill","white")
      .attr("font-size",masterFontSize)
      .on("mouseenter",function(d){
        d3.select(this).style("cursor", "pointer");
      })    
      .on("mouseleave",function(d){
        d3.select(this).style("cursor", "default");
      })
      .on("click",function(d){
        console.log("### mouseclick !!!!!!",d.id);
        startObj(d.id);
      })
      ; 

  // SUB nodes
  div_g.each( function(d,i) {
    createSubNodes(d3.select(this), d3.select(this.parentNode).attr("id"));
  });


}


function createSubNodes(node,masterNodeId){ 

  var result = masterNodes.filter( function(d) { return d.id == masterNodeId; })[0];
  var c = result.color;
  var angleOffset = result.angle;
  var nbSubnode = result.subCategory.length;

  // faking for now...
  //((var fakeSubCategory = getFakeSubCategory(masterNodeId);
  var fakeSubCategory;
  if(masterNodeId == "master0") fakeSubCategory = subNodesMaster0;
  if(masterNodeId == "master1") fakeSubCategory = subNodesMaster1;
  if(masterNodeId == "master2") fakeSubCategory = subNodesMaster2;
  //nbSubnode = fakeSubCategory.length;
  //nbKeynode = fakeSubCategory.keywords.length;
  //console.log("nb sub",nbSubnode);

  const subnode = node.selectAll("g")
      .data(d => d.subCategory)
      //.data(fakeSubCategory) // on part du principe qu'ils sont dans le bon ordre selon le poids w
      .enter()
      .append("g")
      .attr("id",d => d.id)
      .attr("transform", (d,i) => {
        //var angle = (i / nbSubnode) * Math.PI * 2.0;
        //console.log("weight",d.w);
        var index = Math.ceil(i/2.0);
        if(i % 2 == 0 && i != 0) index = nbSubnode - index;
        //console.log("index",index)
        var sub = result.subCategory.filter( function(data) { return data.id == d.id; })[0];
        var angle = angleOffset + (index / nbSubnode) * Math.PI * 2.0;
        sub.angleOffset = angle;
        var x = rmaster_sub * Math.cos(angle);
        var y = rmaster_sub * Math.sin(angle);
        return `translate(${x},${y})`
      })
      ;


  var div_g = subnode.append("g")
            .on("mouseenter",function(d){
              /*console.log("### mouseenter",d.id);*/
              d3.select(this).style("cursor", "pointer");
              showLabel(true,d.id);
            })    
            .on("mouseleave",function(d){
              /*console.log("### mouseleave",d.id);*/
              d3.select(this).style("cursor", "default");
              showLabel(false,d.id);
            })
            .on("click",function(d){
              console.log("### mouseclick",d.id);
              startObj(d.id);
            });

  div_g.append("circle")
      .attr("r",function(d){
        var r = mapValue(d.w,sweight_min, sweight_max,rsub_min,rsub_max);
        d.r = r;
        return r;
      })
      .style("stroke",c)
      .style("stroke-width",function(d){
        return mapValue(d.r,rsub_min,rsub_max,sub_strokeWidthMin,sub_strokeWidthMax);
      })
      .transition()
      .duration(durationFadeAnim)
      .attr("opacity",function(d){
        var t = mapValue(d.r,rsub_min,rsub_max,sub_maxTrans,sub_minTrans);
        return t;
      })
      .attr("fill","none")        
      ;

  div_g.append("text")
      .text(d => d.name)
      .attr("font-family","latohairline")
      .attr("x",0)
      .attr("y",0)
      .attr("fill",function(){
        d.color = c;
        return c;
      })
      .attr("opacity",0.0)
      .attr("font-size",subFontSize)
      .call(wrap,subTextLength,subLineHeight)
      .attr("text-anchor","middle")
      .style("alignment-baseline","middle")
      ; 
  
  // KEYWORDS nodes 
  div_g.each( function() {
    createKeywordNodes(d3.select(this),masterNodeId,d3.select(this.parentNode).attr("id"));
  });

}

function createKeywordNodes(subnode, masterNodeId, subNodeId){

  var result = masterNodes.filter( function(d) { return d.id == masterNodeId; })[0];
  var c = result.color;
  var resultSub = result.subCategory.filter( function(d) { return d.id == subNodeId; })[0];
  var nbKeyNodes = resultSub.keywords.length;

  const keyword = subnode.selectAll("g")
      .data(d => d.keywords)
      .enter()
      .append("g")
      .attr("id",d => d.id)
      .attr("transform", (d,i) => {
        var index = Math.ceil(i/2.0);
        if(i % 2 == 0 && i != 0) index = nbKeyNodes - index;
        var angle = resultSub.angleOffset + (index / nbKeyNodes) * Math.PI * 2.0;
        var x = (rsub_keyword+10) * Math.cos(angle);
        var y = (rsub_keyword+10) * Math.sin(angle);
        return `translate(${x},${y})`
      })
      ;

  var div_g = keyword.append("g")
      .on("mouseenter",function(d){
        /*console.log("### mouseenter",d.id);*/
        d3.select(this).style("cursor", "pointer");
        showLabel(true,d.id);
      })    
      .on("mouseleave",function(d){
        /*console.log("### mouseleave",d.id);*/
        d3.select(this).style("cursor", "default");
        showLabel(false,d.id);
      })
      .on("click",function(d){
        console.log("### mouseclick",d.id);
        startObj(d.id);
      });

  div_g.append("circle")
      .attr("id",d => "keyword" + d.id)
      .attr("r", function(d){
        //d.r = getRandomInt(rkey_min,rkey_max);
        d.r = mapValue(d.w,kweight_min, kweight_max,rkey_min,rkey_max);
        return d.r
        //return 10;
      })
      .transition()
      .duration(durationFadeAnim)
      .attr("opacity",function(d){
        return mapValue(d.r,rkey_min,rkey_max,key_maxTrans,key_minTrans);
      })
      .attr("fill", d => c)
      //.attr("fill", "none")
      ;

  div_g.append("text")
      .text(d => d.name)
      .attr("font-family","latoregular")
      .attr("x",d => d.r*1.5)
      .attr("y",0) 
      .attr("text-anchor","start")
      .style("alignment-baseline","middle")
      .attr("fill",function(){
        d.color = c;
        return "none";
      })
      .attr("opacity","1.0")
      .attr("font-size",keyFontSize)
      .call(wrap,keywordsTextLength,keywordsLineHeight)
      .style("alignment-baseline","middle")
      .selectAll("tspan").style("alignment-baseline","middle")
      ; 

  
}

var animVizRunning = false;

function startAnimNodes(){

  //console.log("start anim");
  masterAnims = [];
  subAnims = [];
  keyAnims = [];

  for(var i=0; i<3; i++){
    var anim = new Anim("#master"+i,60,5,10);
    anim.start();
    masterAnims.push(anim);
  }

  for(var i=0; i<nbSubNodes;i++){
    var anim = new Anim("#sub"+i,30,5,8);
    anim.start();
    subAnims.push(anim);
  }

  for(var i=0; i<nbKeyNodes;i++){
    var anim = new Anim("#key"+i,10,2,4);
    anim.start();
    keyAnims.push(anim);
  }
  animVizRunning = true;

}



function drawViz(){
   //console.log("drawviz");
  if(animVizRunning){
    //console.log("###############")
    for(var i=0; i<masterAnims.length;i++){
      masterAnims[i].update();
    }

    for(var i=0; i<subAnims.length;i++){
      subAnims[i].update();
    }

    for(var i=0; i<keyAnims.length;i++){
      keyAnims[i].update();
    }
  }

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


function initVisualisation(){

  if(!vizdataLoaded){
    animVizRunning = false;
    createMasterNodes();
    loadAllRevuePoly();
    console.log("finished init visualisation");
  }

}