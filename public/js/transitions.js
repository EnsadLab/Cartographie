// script containing all necessary functions to make the transitions between the different views

var allRevuePoly = [];

function startTransitionVizGeo(){

    console.log("----> START TransitionVizGeo");
    morphVizToGeo();
    makeNodeDisappear(1000);
    console.log("----> END TransitionVizGeo");

}


function startTransitionGeoViz(){

    console.log("----> START TransitionGeoViz");
    var duration = 800;
    var delayRandom = 500;
    morphGeoToViz(duration,delayRandom);

    svg.append("circle")
            .attr("id","TODELETELINES")
            .transition()
            .duration(1000)
            .on("end",function(){
                console.log("DELETE OBJECTS END StartTransitionGeoViz");
                startAnimNodes();
                vizdataLoaded = true;
                d3.select(this).remove();
            })
            ;

    console.log("----> END TransitionGeoViz");
}

function startTransitionVizTimeline(){
    console.log("----> START TransitionVizTimeline");
    morphAllVizToTimeline();
    makeNodeDisappear(1000);
    svg.append("circle")
            .attr("id","TODELETELINES")
            .transition()
            .duration(1200)
            .on("end",function(){
                console.log("DELETE OBJECTS END StartTransitionVizTimeline");
                d3.selectAll(".morphopoly").remove();
                d3.selectAll(".timelineRect").attr("opacity",1.0);
                d3.select(this).remove();
            })
            ;
    console.log("----> END TransitionVizTimeline");
}

function startTransitionTimelineViz(){
    console.log("----> START TransitionTimelineViz");

    var delay_axis = 200; // delay because axis disappears first.. we do not use it for now..

    morphTimelineToViz(delay_axis); // do not morph anymore.. just create the path.. change name later

    d3.selectAll(".timelineRect")
                .transition()
                .duration(100)
                .delay(function(d){
                    //var delay = delay_axis + getRandomInt(0,500);
                    var delay = getRandomInt(0,600);
                    return delay;
                })
                .on("start",function(d){
                    d3.select(this).attr("opacity",0.0);
                    var idTimeline = d3.select(this).attr("id");
                    var id = idTimeline.substring("timeline".length);
                    //console.log("id??",id);
                    // get poly
                    var revuePoly = allRevuePoly.find(data => data.id == "poly" + id);
                    
                    var p = d3.select("#morph"+id);
                    p.transition()
                        //.delay(delay_axis + getRandomInt(0,500))
                        .duration(getRandomInt(300,600))
                        .attr("fill","none")
                        .on("start",function(){
                            d3.select(this).attr("opacity",1.0);
                            d3.select(this).attr("stroke-opacity",0.2);
                        })
                        //.attr("opacity",0.03)//0.03
                        .attr("stroke-opacity",0.05) // 0.08
                        .attr("d",revuePoly.data)
                        .on("end",function(){
                            d3.select(this).remove();
                        })
                        ;
                })
                ;

    svg.append("circle")
            .attr("id","dummy")
            .transition()
            .duration(500)
            .on("end",function(d){
                animAlpha.start(0,1.0,0.5,0.0);
                vizdataLoaded = true;
                startAnimNodes();
                d3.select(this).remove();
            })
            ;

    console.log("----> END TransitionTimelineViz");
}

function startTransitionGeoTimeline(){
    console.log("----> START TransitionGeoTimeline");

    morphGeoToTimeline();
    svg.append("circle")
            .attr("id","TODELETELINES")
            .transition()
            .duration(1200)
            .on("end",function(){
                console.log("DELETE OBJECTS END StartTransitionVizTimeline");
                d3.selectAll(".morphopoly").remove();
                d3.selectAll(".timelineRect").attr("opacity",1.0);
                deleteMap();
                d3.select(this).remove();
            })
            ;
    console.log("----> END TransitionGeoTimeline");
}


function startTransitionTimelineGeo(){
    console.log("----> START TransitionTimelineGeo");

    var delay_axis = 300; // delay because axis disappears first

    morphTimelineToGeo(delay_axis); // change name.. morphing not done there
    console.log(dataRevue);
    d3.selectAll(".timelineRect")
                .transition()
                .duration(800)
                .delay(function(d){
                    //var delay = delay_axis + getRandomInt(0,600);
                    var delay = getRandomInt(0,600);
                    return delay;
                })
                .on("start",function(d){
                    d3.select(this).attr("opacity",0.0);
                    var idTimeline = d3.select(this).attr("id");
                    var id = idTimeline.substring("timeline".length);
                    // get poly
                    var revuePoly = allRevuePoly.find(data => data.id == "poly" + id);
                    var d = dataRevue.find(data => data.id == id);
                    // get triangle
                    var offset = projection(d.locationCoords);
                    var dTri = getTrianglePath(revuePoly.nb,triangleEdgeLength,offset);
                    
                    var p = d3.select("#morph"+id);
                    p.transition()
                        .duration(getRandomInt(300,600))
                        .attr("d",dTri)
                        .ease(d3.easeQuad)
                        .on("start",function(){
                            d3.select(this).attr("opacity","0.05");
                            //d3.select(this).attr("opacity","1.0");
                            d3.select(this).attr("stroke-opacity",0.4);
                        })
                        .attr("stroke","black")
                        .attr("opacity",1.0)
                        .on("end",function(){
                            d3.select(this).attr("fill","#31373F");
                            d3.select(this).attr("opacity",triangleDefaultOpacity);
                        })
                        ;
                })
                ;

    console.log("----> END TransitionTimelineGeo");
}


function createGeoTriPath(expectRevueId){

    dataRevue.forEach(function(d,i){

        // get poly
        var revuePoly = allRevuePoly.find(data => data.id == "poly" + d.id);

        // get triangle
        var offset = projection(d.locationCoords);
        var dTri = getTrianglePath(revuePoly.nb,triangleEdgeLength,offset);

        // create path
        var p = d3.select("#map").append("path")
            .attr("id","morph"+d.id)
            .attr("class",function(data){
                if((d.id) == expectRevueId){
                    return "morphPolyDetailToTriGeo";
                }else{
                    return "morphopoly";
                }
            })
            .attr("fill","#31373F")
            .attr("opacity",0.0)
            .attr("stroke","#31373F")
            .attr("stroke-opacity",0.0)
            .attr("d",dTri)
            ;
    });

    
    d3.selectAll(".morphopoly").transition()
            .duration(1000)
            .delay(function(d,i){
                var d = i*100;
                //return d;
                return 100;
            })
            .attr("stroke-opacity",1.0)
            .attr("opacity",triangleDefaultOpacity)
            //.attr("fill","orange")
            ;

}


function morphVizToGeo(){


    loadAllCurrentRevuePoly();
    dataRevue.forEach(function(d,i){

        // get poly
        var revuePoly = allRevuePoly.find(data => data.id == "poly" + d.id);

        // create path
        var p = d3.select("#map").append("path")
            .attr("id","morph"+d.id)
            .attr("class","morphopoly")
            .attr("fill","none")
            .attr("stroke","black")
            .attr("stroke-width",triangleStrokeWidth)
            .attr("opacity",0.05)
            .attr("d",revuePoly.data)
            .attr('pointer-events', 'visibleStroke')
            ;

        // get triangle
        //console.log("revue",d.name);
        //console.log("LOCATION",d.locationCoords);
        var offset = projection(d.locationCoords);
        //console.log("OFFSET",offset);
        if(isNaN(offset[0])) console.log("[BUG]: offset[0] is NAN!!!",d.name,d.locationCoords,offset);
        if(isNaN(offset[1])) console.log("[BUG]: offset[1] is NAN!!!",d.name,d.locationCoords,offset);
        //if(d.id == "revue0") console.log("coords",d.locationCoords,offset);
        var dTri = getTrianglePath(revuePoly.nb,triangleEdgeLength,offset);
        //console.log("path",dTri);

        /* DEBUG - to show the coordinates
        d3.select("#map").append("circle")
                    .attr("cx",offset[0])
                    .attr("cy",offset[1])
                    .attr("r",20)
                    .attr("fill","orange")
                    .attr("opacity",0.1)
                    ;
        */

        // POLY TO TRIANGLE MORPHING
        p.transition()
            .duration(getRandomInt(200,500))
            .attr("d",dTri)
            .ease(d3.easeQuad)
            .delay(getRandomInt(0,600))
            .on("start",function(){
                d3.select(this).attr("opacity","0.05");
                //d3.select(this).attr("opacity","1.0");
            })
            .attr("stroke","black")
            .attr("opacity",1.0)
            .on("end",function(){
                d3.select(this).attr("fill","#31373F");
                d3.select(this).attr("opacity",triangleDefaultOpacity);
            })
            ;
    });

}

function morphAllVizToTimeline(){
    
    // get all polygons
    loadAllCurrentRevuePoly();

    dataRevue.forEach(function(d,i){
        // get poly
        var revuePoly = allRevuePoly.find(data => data.id == "poly" + d.id);


        // create path
        var p = d3.select("#timeline").append("path")
            .attr("id","morph"+d.id)
            .attr("class","morphopoly")
            .attr("fill","none")
            .attr("stroke","black")
            .attr("opacity",0.05)
            //.attr("opacity",1.0)
            .attr("d",revuePoly.data)
            .attr('pointer-events', 'visibleStroke')
            ;

        // get Rectangle
        var revueRect = d3.select("#timeline" + d.id); 
        if(revueRect.node() == null){
            console.log("DEBUG: revuerect with ID #timeline" + d.id + " could not be FOUND");
            return;
        }
        var bb = revueRect.node().getBoundingClientRect();
        var x = bb.x + bb.width*0.5;
        var y = bb.y + bb.height*0.5;
        var offset = [bb.x,bb.y];
        var dRect = getRectanglePath(revuePoly.nb,bb.width,barHeight,offset);

        // POLY TO RECTANGLE MORPHING
        p.transition()
            .duration(getRandomInt(200,500))
            .attr("d",dRect)
            .ease(d3.easeQuad)
            .delay(getRandomInt(0,600))
            .on("start",function(){
                d3.select(this).attr("opacity","0.08");
                //d3.select(this).attr("opacity","1.0");
            })
            .attr("stroke","black")
            .attr("opacity","0.2")
            .on("end",function(){
                d3.select(this).attr("fill",barColor);
                d3.select(this).attr("opacity",1.0);
                d3.select(this).attr("stroke","none")
            })
            ;
    });
}

function morphGeoToTimeline(){
    dataRevue.forEach(function(d,i){

        // get poly - no need to reload the allRevuePoly datas
        var revuePoly = allRevuePoly.find(data => data.id == "poly" + d.id);

        // get exisiting poly TRIANGLE path
        var mPath = d3.select("#morph" + d.id);

        // get Rectangle
        var revueRect = d3.select("#timeline" + d.id); 
        if(revueRect.node() == null){
            console.log("DEBUG: revuerect with ID #timeline" + d.id + " could not be FOUND");
            return;
        }
        var bb = revueRect.node().getBoundingClientRect();
        var x = bb.x + bb.width*0.5;
        var y = bb.y + bb.height*0.5;
        var offset = [bb.x,bb.y];
        var dRect = getRectanglePath(revuePoly.nb,bb.width,barHeight,offset);


        // Start MORPHING from triangle TO rect 
        mPath.transition()
            .duration(getRandomInt(400,700))
            .attr("d",dRect)
            .ease(d3.easeQuad)
            .attr("transform","translate(" + [0,0] + ")scale(" + 1.0 + ")")
            .delay(getRandomInt(0,600))
            .on("start",function(){
                d3.select(this).attr("fill","none");
                d3.select(this).attr("opacity","0.5");
            })
            .attr("stroke","black")
            .on("end",function(){
                d3.select(this).attr("fill",barColor);
                d3.select(this).attr("opacity",1.0);
                d3.select(this).attr("stroke","none")
            })
            ;

    });
}

function morphTimelineToGeo(delay_axis){
    dataRevue.forEach(function(d,i){

        // get poly - no need to reload the allRevuePoly datas
        var revuePoly = allRevuePoly.find(data => data.id == "poly" + d.id);

        // get Rectangle
        var revueRect = d3.select("#timeline" + d.id); 
        if(revueRect.node() == null){
            console.log("DEBUG: revuerect with ID #timeline" + d.id + " could not be FOUND");
            return;
        }
        var bb = revueRect.node().getBoundingClientRect();
        var x = bb.x + bb.width*0.5;
        var y = bb.y + bb.height*0.5;
        var offset = [bb.x,bb.y];
        var dRect = getRectanglePath(revuePoly.nb,bb.width,barHeight,offset);

         // create path
         var p = d3.select("#map").append("path")
            .attr("id","morph"+d.id)
            .attr("class","morphopoly")
            .attr("fill","none")
            .attr("stroke","black")
            .attr("stroke-opacity",0.0) //0.03
            .attr("d",dRect)
            .attr('pointer-events', 'visibleStroke')
            ;
    });
}

function morphGeoToViz(duration,delayRandom){

    // get all polygons
    loadAllCurrentRevuePoly();
    console.log("---> morphGeoToViz()");
    dataRevue.forEach(function(d,i){
        // get poly
        var revuePoly = allRevuePoly.find(data => data.id == "poly" + d.id);

        // get exisiting poly TRIANGLE path
        //var mPath = d3.select("#morph" + d.id);
        var mPath = d3.select("#morph" + d.id);

        // start MORPHING triangle to poly
        var strokeWidthMorphing = 0.2;
        var endOpacity = 0.04+(0.01*sMap_saved);
        mPath.transition()
        //poly.transition()
            //.delay(getRandomInt(0,delayRandom)) // 500
            .duration(getRandomInt(200,1000)) // 800
            .attr("fill","none")
            .on("start",function(){
                d3.select(this).attr("opacity",0.5);
                d3.select(this).attr("stroke-width",strokeWidthMorphing/sMap_saved);
            })
            .attr("transform","translate(" + [0,0] + ")scale(" + 1.0 + ")")
            .attr("opacity",endOpacity)//0.0
            .attr("stroke-width",strokeWidthMorphing)
            .attr("d",revuePoly.data)
            .on("end",function(d){
                d3.select(this).remove();
            })
            ;
    });

}

function morphTimelineToViz(delay_axis){
    // get all polygons
    loadAllCurrentRevuePoly();

    dataRevue.forEach(function(d,i){
        // get poly
        var revuePoly = allRevuePoly.find(data => data.id == "poly" + d.id);

        // get Rectangle
        var revueRect = d3.select("#timeline" + d.id); 
        if(revueRect.node() == null){
            console.log("DEBUG: revuerect with ID #timeline" + d.id + " could not be FOUND");
            return;
        }
        var bb = revueRect.node().getBoundingClientRect();
        var x = bb.x + bb.width*0.5;
        var y = bb.y + bb.height*0.5;
        var offset = [bb.x,bb.y];
        var dRect = getRectanglePath(revuePoly.nb,bb.width,barHeight,offset);

         // create path
         var p = d3.select("#timeline").append("path")
            .attr("id","morph"+d.id)
            .attr("class","morphopoly")
            .attr("fill","none")
            .attr("stroke","black")
            .attr("stroke-opacity",0.03)
            .attr("d",dRect)
            .attr('pointer-events', 'visibleStroke')
            ;
    });
}

function loadAllRevuePoly(){
    allRevuePoly = [];
    dataRevue.forEach(function(d,i){

        //console.log("ID???",d.id);
        var id = d.id;

        // get polygon
        var s_coords = "";
        var coords = [];
        var coordsDetail = [];
        var coordsData = [];
        var coordsDataDetail = [];
        d.links.forEach( function(l,i){
            //console.log("link",l);
            var bb = d3.select("#nodes").select("#" + l).select("g").select("circle").node().getBoundingClientRect();
            var x = bb.x + bb.width*0.5;
            var y = bb.y + bb.height*0.5;
            //if(d.id == "revue3"){ console.log("x",x,"y",y);}
            coords.push([x,y]);
            coordsData.push({coord:[x,y],link:l});
            coordsDetail.push([x,y]);
            coordsDataDetail.push({coord:[x,y],link:l});
        });

        if(coords.length < 4){
            var nbMin = 4;
            var index = coords.length;
            if(coords.length >= 1){
                while(index < nbMin){
                    coords.push(coords[coords.length-1]);
                    coordsData.push(coordsData[coordsData.length-1]);
                    coordsDetail.push(coordsDetail[coordsDetail.length-1]);
                    coordsDataDetail.push(coordsDataDetail[coordsDataDetail.length-1]);
                    index++;
                }
                /*
                if(d.id == "revue3"){
                    console.log("coords",coords);
                    console.log("coordsData",coordsData);
                    console.log("coordsDataDetail",coordsDataDetail);
                }*/
            }else {
                console.log("[BUG]:----> coords == 0 ???")
            }   
        }

        var box = getBoxFromArray(coords);
        var trans = [xCenterDetailView-box.cx,yCenterDetailView-box.cy];
        /*
        if(d.id == "revue3"){
            console.log("TEST name",d.name);
            console.log("BEFORE");
            //console.log("coordsDataDetail",coordsDataDetail);
            console.log("coordsDetail",coordsDetail);
        }*/
        //var testcoords = [];
        coordsDetail.forEach(function(data,i){
            var newX = data[0]+trans[0];
            var newY = data[1]+trans[1];
            data = [newX,newY]; 
            coordsDetail[i] = [newX,newY];
            coordsDataDetail[i].coord = [newX,newY];
            /*
            if(d.id == "revue3"){
                console.log("--> coord",data);
                console.log("--> new coords",newX,newY);
            }*/
        });
        /*
        if(d.id == "revue3"){
            console.log("AFTER");
            console.log("coordsDataDetail",coordsDataDetail);
            console.log("coordsDetail",coordsDetail);
            //console.log("testcoords",testcoords);
        }*/

        var dPoly = "M" + coords.join("L") + "Z";
        var dPolyDetail = "M" + coordsDetail.join("L") + "Z";
        allRevuePoly.push({id:"poly" + id, data: dPoly, nb: coords.length, coords: coordsData,
                                            dataDetail: dPolyDetail,coordsDetail: coordsDataDetail,transDetail: trans
                                            });
    });
}

function loadAllCurrentRevuePoly(){

    //return;
    //allRevuePoly = [];
    dataRevue.forEach(function(d,i){

        //console.log("ID???",d.id);
        var id = d.id;

        // get polygon
        var s_coords = "";
        var coords = [];
        var coordsData = [];
        d.links.forEach( function(l,i){
            //console.log("link",l);
            var bb = d3.select("#nodes").select("#" + l).select("g").select("circle").node().getBoundingClientRect();
            var x = bb.x + bb.width*0.5;
            var y = bb.y + bb.height*0.5;
            coords.push([x,y]);
            coordsData.push({coord:[x,y],link:l});
            //s_coords += x + "," + y + " ";
        });
        
        if(coords.length < 4){
            var nbMin = 4;
            var index = coords.length;
            if(coords.length >= 1){
                while(index < nbMin){
                    coords.push(coords[0]);
                    coordsData.push(coordsData[0]);
                    index++;
                }
                //console.log(coords);
                //console.log(coordsData);
            }else {
                console.log("DEBUG:---- coords == 0 ???")
            }
            
        }
        var dPoly = "M" + coords.join("L") + "Z";
        var r = allRevuePoly.find(data => data.id == "poly"+id);
       // console.log("r before",r);
        r.data = dPoly;
        r.nb = coords.length;
        r.coords = coordsData;
        r = allRevuePoly.find(data => data.id == "poly"+id);
     //   console.log("r after",r);
        //allRevuePoly.push({id:"poly" + id, data: dPoly, nb: coords.length, coords: coordsData});
    });
}

function makeNodeDisappear(d,reload){
    console.log("--> make node disappear: variable reload is",reload);
    tViz = [0,0];
    sViz = 1.0;
    d3.selectAll("#nodes").transition().duration(d).attr("transform", "translate(" + tViz + ")scale(" + sViz + ")");
    // MASTER NODES
    for(var i=0; i<3; i++){
        var selg = d3.select("#nodes").select("#master"+i);
        selg.select("g").select("circle")
            .transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
        selg.select("g").select("text")
            .transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
    }
    // SUB NODES
    for(var i=0; i<nbSubNodes;i++){
        var selg = d3.select("#nodes").select("#sub"+i);
        selg.select("g").select("circle")
            .transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
        selg.select("g").select("text")
            .transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
    }
    // KEY NODES
    for(var i=0; i<nbKeyNodes;i++){
        var selg = d3.select("#nodes").select("#key"+i);
        selg.select("g").select("circle")
            .transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
        selg.select("g").select("text")
            .transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
    }
    // create dummy anim to delete OBJECTS
    var circle = svg.append("circle")
                .attr("id","TODELETEVIZ")
                .transition()
                .duration(d)
                .on("end",function(){
                    console.log("DELETING NODE OBJECTS");
                    dezoomViz();
                    loadAllCurrentRevuePoly();
                    d3.select("#nodes").select("#master0").remove();
                    d3.select("#nodes").select("#master1").remove();
                    d3.select("#nodes").select("#master2").remove();
                    d3.select(this).remove();
                    animVizRunning = false;
                    if(reload){
                        console.log("RELOADING NODE OBJECTS");
                        state = State.LOAD;
                        startViz();
                    }
                })
                ;

}



function testMorphing60(){
    cleanSVG();
    var yMin = 20;
    var xMin = 0; 
    for(var i=0; i<200;i++){
        if(i==15 || i == 105) {yMin = 0; xMin = 150;}
        if(i == 30 || i == 120) {yMin = 0; xMin = 300;}
        if(i == 45 || i == 135) {yMin = 0; xMin = 450;}
        if(i == 60 || i == 150) {yMin = 0; xMin = 550;}
        if(i == 75 || i == 165) {yMin = 0; xMin = 650;}
        if(i == 90 || i == 180) {yMin = 0; xMin = 800;}
        var xMax = xMin + 200; var yMax = yMin + 50;
        var randomPoly = d3.range(getRandomInt(15,15)).map(function(d,i){
                return [getRandomInt(xMin,xMax),getRandomInt(yMin,yMax)];
              });    
        var dPoly = "M" + randomPoly.join("L") + "Z"; 

         // dessine le poly en orange pour debugging
        svg.append("path")
            //.attr("stroke","black")
            .attr("fill","none")
            .attr("stroke","orange") // "orange"
            .attr("d",dPoly)
            ;

        var d = 50; // edge lenth du triangle
        var offset = [1100 + xMin/10.0,yMin]; // offset du triangle
        var dTri = getTrianglePath(randomPoly.length,d,offset);

        svg.append("path")
            //.attr("stroke","black")
            .attr("fill","none")
            .attr("stroke","orange") // "orange"
            .attr("d",dTri)
            ;

        // démarre l'animation
        svg.append("path")
            .attr("stroke",function() {
                return "hsl(" + Math.random() * 360 + ",100%,50%)";
                })
            .attr("fill","none")
            .attr("d",dPoly)
            .transition()
            .duration(5000)
            .attr("d",dTri)
           // .on("end",function(){testMorphing();})
            ;

        yMin += 40;

    }
}

function testMorphingToRect(){
    cleanSVG();
  
    // où le poly est placé
    var xMin = 50; var xMax = 200; var yMin = 200; var yMax = 400;
    var randomPoly = d3.range(getRandomInt(4,15)).map(function(d,i){
            return [getRandomInt(xMin,xMax),getRandomInt(yMin,yMax)];
          });    
    var dPoly = "M" + randomPoly.join("L") + "Z";   

    // dessine le poly en orange pour debugging
    svg.append("path")
    .attr("stroke","black")
    .attr("fill","orange") // "orange"
    .attr("d",dPoly)
    ;

    var wRect = 300;
    var hRect = 40;

    var offset = [450,300]; // offset du rectangle
    var dRect = getRectanglePath(randomPoly.length,wRect,hRect,offset);

    // dessine le rectangle en orange pour debugging
    svg.append("path")
        .attr("stroke","black")
        .attr("fill","orange") // "orange"
        .attr("d",dRect)
        ;

    // démarre l'animation
    svg.append("path")
      .attr("stroke","black")
      .attr("fill","none")
      .attr("d",dPoly)
      .transition()
      .duration(1000)
      .attr("d",dRect)
      .on("end",function(){testMorphingToRect();})
      ;

}

function testMorphingToRectDEBUG(){

    cleanSVG();
  
    // où le poly est placé
    var xMin = 50; var xMax = 200; var yMin = 200; var yMax = 400;
    var randomPoly = d3.range(getRandomInt(4,15)).map(function(d,i){
            return [getRandomInt(xMin,xMax),getRandomInt(yMin,yMax)];
          });    
    var dPoly = "M" + randomPoly.join("L") + "Z";   
    
     // dessine le poly en orange pour debugging
     svg.append("path")
        .attr("stroke","black")
        .attr("fill","orange") // "orange"
        .attr("d",dPoly)
        ;

    // points
    /* bug when adding also dots on rectangles..
    svg.selectAll("circle")
        .data(randomPoly)
        .enter()
        .append("circle")
        .attr("cx",d => d[0])
        .attr("cy",d => d[1])
        .attr("r",3)
        .attr("fill","black")
        .attr("opacity",1.0)
        ;*/

    var wRect = 300;
    var hRect = 40;

    var offset = [450,300]; // offset du rectangle
    //var dRect = getRectanglePath(4,wRect,hRect,offset);
    var dRect = getRectangleArray(randomPoly.length,wRect,hRect);
    console.log("drect",dRect);
    var datas = dRect.map(function(pt) {pt[0] += offset[0]; pt[1] += offset[1]; return pt; });
    var d = "M" + datas.join("L") + "Z";
    console.log("datas",datas,datas.length);

    // dessine le rectangle en orange pour debugging
    svg.append("path")
        .attr("stroke","black")
        .attr("fill","orange") // "orange"
        .attr("d",d)
        ;

    // points
    svg.selectAll("circle")
        .data(datas)
        .enter()
        .append("circle")
        .attr("cx",d => d[0])
        .attr("cy",d => d[1])
        .attr("r",5)
        .attr("fill","black")
        .attr("opacity",1.0)
        ;

    // index label
    svg.selectAll("text")
        .data(datas)
        .enter()
        .append("text")
        .attr("x",d => d[0])
        .attr("y",d => d[1])
        .text(function(d,i){ return i;})
        ;

    // démarre l'animation
    svg.append("path")
        .attr("stroke","black")
        .attr("fill","none")
        .attr("d",dPoly)
        .transition()
        .duration(1000)
        .attr("d",d)
        .on("end",function(){testMorphingToRect();})
        ;
}

function testMorphing(){

    cleanSVG();
  
    // où le poly est placé
    var xMin = 100; var xMax = 400; var yMin = 200; var yMax = 400;
    var randomPoly = d3.range(getRandomInt(3,15)).map(function(d,i){
            return [getRandomInt(xMin,xMax),getRandomInt(yMin,yMax)];
          });    
    var dPoly = "M" + randomPoly.join("L") + "Z";       
  
  
    // dessine le poly en orange pour debugging
    svg.append("path")
        //.attr("stroke","black")
        .attr("fill","none") // "orange"
        .attr("d",dPoly)
        ;
  
    var d = 50; // edge lenth du triangle
    var offset = [700,300]; // offset du triangle
    var dTri = getTrianglePath(randomPoly.length,d,offset);
  
    // dessine le triangle en orange pour debugging
    svg.append("path")
      //.attr("stroke","black")
      .attr("fill","none") // "orange"
      .attr("d",dTri)
      ;

    
    
    // démarre l'animation
    svg.append("path")
        .attr("stroke","black")
        .attr("fill","none")
        .attr("d",dPoly)
        .transition()
        .duration(5000)
        .attr("d",dTri)
        .on("end",function(){testMorphing();})
        ;
  
  }


var d="M512.60595703125,544.325439453125L444.83013916015625,427.455322265625L293.12628173828125,607.3168334960938L1168.2962646484375,492.7416687011719L293.12628173828125,607.3168334960938L1111.2930908203125,551.6676940917969L1137.9453735351562,306.6532440185547Z";

  