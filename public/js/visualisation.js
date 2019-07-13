

// script showing all master, sub categories and keywords


var masterAnims = [];
var subAnims = [];
var keyAnims = [];

var durationFadeAnim = 800;
function createMasterNodes(){

  //console.log("master nodes",masterNodes);

  // MASTER nodes
  const node = svg.select("#nodes").selectAll("g")
      .data(masterNodes)
      .enter()
      .append("g") // check diff with join!!
      .attr("id", d => d.id )
      .attr("class","masternodes")
      //.attr("transform", d => `translate(${d.x * width},${d.y * height})`)
      .attr("transform", function(d){
        d.absX = d.x * width;
        d.absY = d.y * height;
        return `translate(${d.x * width},${d.y * height})`;
      })
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
        // update our json array
        //var res = masterNodes.find( function(data) { return data.id == d.id; });
        var res = allNodes_flat.find( function(data) { return data.id == d.id; });
        res.r = d.r;
        //console.log("master node",res);
        return d.r;
      })
      .transition()
      .duration(durationFadeAnim)
      //.on("end",function(){animDone = true;})
      .attr("fill","none")
      .attr("opacity",function(d){
        return 1.0;
        //return 0.1;
      })
     // .attr("fill", function(d, i) { return "url(#grad" + i + ")"; })
    //  .attr("filter","url(#blur)")
      ;
  // TO CHECK: ALEX typo des master nodes
  div_g.append("text")
      .text(d => d.name.toUpperCase())
      // .text(d => d.name)
      .attr("font-family","latoheavy")
      .attr("text-anchor","middle")
      .style("alignment-baseline","middle")
      // .attr("fill","white")
      .attr("fill", d => d.color)
      .attr("opacity",0.0)
      .attr("y",0.0)
      .attr("font-size",masterFontSize)
      .on("mouseenter",function(d){
        d3.select(this).style("cursor", "pointer");
      })    
      .on("mouseleave",function(d){
        d3.select(this).style("cursor", "default");
      })
      .on("click",function(d){
        //console.log("### mouseclick !!!!!!",d.id);
        startObj(d.id);
      })
      .transition()
      .duration(durationFadeAnim)
      .attr("opacity",1.0)
      // .call(wrap,subTextLength,subLineHeight) //TO CHECK
      ; 

  // SUB nodes
  div_g.each( function(d,i) {
    createSubNodes(d3.select(this), d3.select(this.parentNode).attr("id"));
  });

  // change order of master nodes
  d3.select("#master2").moveToBack();
  d3.select("#master1").moveToBack();

  console.log("master nodes",masterNodes);

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
      .attr("class","subnodes")
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
        d.absX = x;
        d.absY = y;
        return `translate(${x},${y})`
      })
      ;


  var div_g = subnode.append("g")
            .on("mouseenter",function(d){
              /*console.log("### mouseenter",d.id);*/
              //if(d.id == "sub10") console.log("### mouseenter",d.id);
              d3.select(this).style("cursor", "pointer");
              if(!subnodeTextShow) showLabel(true,d.id);
            })    
            .on("mouseleave",function(d){
              /*console.log("### mouseleave",d.id);*/
              //if(d.id == "sub10") console.log("### mouseout",d.id);
              d3.select(this).style("cursor", "default");
              if(!subnodeTextShow) showLabel(false,d.id);
            })
            .on("click",function(d){
              console.log("### mouseclick",d.id);
              startObj(d.id);
            });


  div_g.append("circle")
      .attr("opacity",0.0)
      .attr("fill","none")
      .attr("r",function(d){
        var r = mapValue(d.w,sweight_min, sweight_max,rsub_min,rsub_max);
        d.r = r;
        var res = allNodes_flat.find( function(data) { return data.id == d.id; });
        res.r = r;
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
      ;
     
  // TO CHECK: ALEX typo des sub nodes
  div_g.append("text")
      .text(d => d.name)
      .attr("font-family","latoregular")
      .attr("x",0)
      .attr("y",d => -d.r)
      .attr("fill",function(){
        d.color = c;
        return c;
      })
      .attr("opacity",0.0)
      .attr("font-size",subFontSize)
      //.call(wrapSub,subTextLength,subLineHeight)
      .attr("text-anchor","middle")
      .style("alignment-baseline","ideographic")
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
      .attr("class","keywordnodes")
      .attr("transform", (d,i) => {
        var index = Math.ceil(i/2.0);
        if(i % 2 == 0 && i != 0) index = nbKeyNodes - index;
        var angle = resultSub.angleOffset + (index / nbKeyNodes) * Math.PI * 2.0;
        var x = (rsub_keyword+10) * Math.cos(angle);
        var y = (rsub_keyword+10) * Math.sin(angle);
        d.absX = d.x;
        d.absY = d.y;
        return `translate(${x},${y})`
      })
      ;

  var div_g = keyword.append("g")
      .on("mouseenter",function(d){
        /*console.log("### mouseenter",d.id);*/
        d3.select(this).style("cursor", "pointer");
        showLabel(true,d.id,true);
      })    
      .on("mouseleave",function(d){
        /*console.log("### mouseleave",d.id);*/
        d3.select(this).style("cursor", "default");
        showLabel(false,d.id,true);
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
        var res = allNodes_flat.find( function(data) { return data.id == d.id; });
        res.r = d.r;
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

  // TO CHECK: ALEX typo des keyword nodes
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
var allNodes = [];
function startAnimNodes(){
  nodeAnims = [];
  allNodes = [];
  masterNodes.forEach(function(dM,i){
    var anim = new Anim("#"+dM.id,dM.id,60,5,10,dM.absX,dM.absY);
    anim.start();
    //nodeAnims.push(anim);
    //allNodes.push({id:dM.id,x:0,y:0,r:0,subs:[]});
    allNodes.push({a:anim,subs:[]});
    dM.subCategory.forEach(function(dS,j){
        var anim = new Anim("#"+dS.id,dS.id,30,5,8,dS.absX,dS.absY);
        anim.start();
        allNodes[i].subs.push({a:anim,keywords:[]});
        dS.keywords.forEach(function(dK,k){
            var anim = new Anim("#"+dK.id,dK.id,10,2,4,dK.absX,dK.absY);
            anim.start();
            //nodeAnims[i][j].push(anim);
            allNodes[i].subs[j].keywords.push({a:anim});
        })
    })
  });
  animVizRunning = true;
  console.log("node anims",allNodes);
}

/*
function startAnimNodes(){

  //console.log("start anim");
  masterAnims = [];
  subAnims = [];
  keyAnims = [];

  nodeAnims = [][1][1];

  for(var i=0; i<3; i++){
    var anim = new Anim("#master"+i,"master"+i,60,5,10);
    anim.start();
    masterAnims.push(anim);
    nodeAnims.push(anim);
  }

  for(var i=0; i<nbSubNodes;i++){
    var anim = new Anim("#sub"+i,"sub"+i,30,5,8);
    anim.start();
    subAnims.push(anim);
  }

  for(var i=0; i<nbKeyNodes;i++){
    var anim = new Anim("#key"+i,"key"+i,10,2,4);
    anim.start();
    keyAnims.push(anim);
  }
  animVizRunning = true;

}
*/

function drawViz(){
  if(animVizRunning){
    //console.log("###############")
    for(var i=0; i<allNodes.length;i++){
      var animMaster = allNodes[i].a;
      var masterPos = animMaster.update(0,0,true);
      //console.log("?",allNodes[i].subs.length);
      //console.log("masterPos",masterPos);
      for(var j=0; j<allNodes[i].subs.length;j++){
        var animSub = allNodes[i].subs[j].a;
        var subPos = animSub.update(masterPos[0],masterPos[1],true);
        for(var k=0; k<allNodes[i].subs[j].keywords.length; k++){
          allNodes[i].subs[j].keywords[k].a.update(subPos[0],subPos[1]);
        }
      }
    }
  }
}

/*
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
*/


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

var zoomViz;
var sViz = 1.0;
var tViz = [0,0];
function initVisualisation(){

  if(!vizdataLoaded){
    animVizRunning = false;
    createMasterNodes();
    loadAllRevuePoly();
    zoomViz = d3.zoom()
      //.scaleExtent([1, 10])
      .scaleExtent([1, 5]) // TO CHECK: ALEX le max est réglable...
      .on("zoom", zoomedViz)
      .on("end", zoomendedViz);
    tViz = [0,0];
    sViz = 1.0;
    svg.call(zoomViz);
    //console.log("finished init visualisation");
  }

}

function recenterRevueOnViz(revueId){
  var duration = 3000;
  //var offset = projection(coord);
  //var revueId = "revue7";
  var poly = d3.select("#showPoly"+revueId);
  var bb = poly.node().getBoundingClientRect();
  var x = bb.x + bb.width*0.5;
  var y = bb.y + bb.height*0.5;
  //console.log("center",x,y);
  var offset = [x,y];
  var translateDiffX = -offset[0]*s + (mapwidth*0.5);
  var translateDiffY = -offset[1]*s + (mapheight*0.5);
  svg.transition().duration(duration).call(zoomViz.transform,
      d3.zoomIdentity.translate(translateDiffX,translateDiffY).scale(s))
  ;
}

function dezoomViz(){
  tViz = [0,0];
  sViz = 1.0;
  d3.selectAll("#nodes").attr("transform", "translate(" + tViz + ")scale(" + sViz + ")");
  svg.call(zoomViz.transform,d3.zoomIdentity.translate(0,0).scale(sViz));
  //d3.selectAll("#nodes").transition().duration(1000).attr("transform", "translate(" + t + ")scale(" + s + ")");
}

var subnodeTextShow = false;
function zoomedViz() {
  //console.log("BEFORE t",tViz);
  //console.log("BEFORE s",sViz);
  tViz = [d3.event.transform.x,d3.event.transform.y];
  sViz = d3.event.transform.k;
  //console.log("AFTER t",tViz);
  //console.log("AFTER s",sViz);
  //s = 2.0; // pour fixer le scale à double

  var h = 0;
  tViz[0] = Math.min(
      (width/height)  * (sViz - 1),
      Math.max( width * (1 - sViz), tViz[0] )
  );

  tViz[1] = Math.min(
      h * (sViz - 1) + h * sViz, 
      Math.max(height  * (1 - sViz) - h * sViz, tViz[1])
  );
  //console.log("tViz",tViz);
  /*
  var revueId = "revue7";
  var poly = d3.select("#showPoly"+revueId);
  var bb = poly.node().getBoundingClientRect();
  var x = bb.x + bb.width*0.5;
  var y = bb.y + bb.height*0.5;
  console.log("center",x,y);*/

  // TO CHECK: ALEX ici tu peux changer la valeur de zoom pour l'affichage des labels des subnodes
  if(sViz > 1.4){
    //console.log("showlabels",sViz);
    subnodeTextShow = true;
    d3.select("#nodes").selectAll(".subnodes").select("text").attr("opacity",1.0);
  }else{
    if(subnodeTextShow){
      subnodeTextShow = false;
      d3.select("#nodes").selectAll(".subnodes").select("text").attr("opacity",0.0);
    }
  }

  //console.log("current scale and translate",s,t);
  //d3.selectAll("#nodes").selectAll("g").attr("transform", "translate(" + t + ")scale(" + s + ")");
  d3.selectAll("#nodes").attr("transform", "translate(" + tViz + ")scale(" + sViz + ")");

}

function zoomendedViz(){
  if(sViz !== 1) return;
  // ...
} 