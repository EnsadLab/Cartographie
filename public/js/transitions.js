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
    hideAndDeleteMap(800);
    morphGeoToViz();

    svg.append("circle")
            .attr("id","TODELETELINES")
            .transition()
            .duration(1000)
            .on("end",function(){
                console.log("DELETE OBJECTS END StartTransitionGeoViz");
                startAnimNodes();
                vizdataLoaded = true;
                d3.selectAll(".morphpoly").remove();
            })
            ;

    console.log("----> END TransitionGeoViz");
}

function startTransitionVizTimeline(){
    console.log("----> START TransitionVizTimeline");
    morphVizToTimeline();
    makeNodeDisappear(1000);
    console.log("----> END TransitionVizTimeline");
}

function startTransitionTimelineViz(){
    
}

function startTransitionTimelineGeo(){

}

function startTransitionGeoTimeline(){
    
}



function morphVizToGeo(){


    loadAllRevuePoly();
    dataRevue.forEach(function(d,i){

        // get poly
        var dPoly = allRevuePoly.find(data => data.id == "poly" + d.id).data;

        // create path
        var p = d3.select("#map").append("path")
            .attr("id","morph"+d.id)
            .attr("class","morphpoly")
            .attr("fill","none")
            .attr("stroke","black")
            .attr("opacity",0.05)
            .attr("d",dPoly)
            .attr('pointer-events', 'visibleStroke')
            .style("z-index",10)
            ;

        // get triangle
        var offset = projection(d.locationCoords);
        var dTri = getTrianglePath(dPoly.length,triangleEdgeLength,offset);

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
                d3.select(this).attr("fill","black");
                d3.select(this).attr("opacity",triangleDefaultOpacity);
            })
            ;
    });

}

function morphVizToTimeline(){
    // get all polygons

    loadAllRevuePoly();
    dataRevue.forEach(function(d,i){
        // get triangle
        var offset = projection(d.locationCoords);
        var dTri = getTrianglePath(coords.length,triangleEdgeLength,offset);
    });


    dataRevue.forEach(function(d,i){

        //console.log("ID???",d.id);
        var id = d.id;

        // get polygon
        var s_coords = "";
        var coords = [];
        d.links.forEach( function(l,i){
            //console.log("link",l);
            var bb = d3.select("#" + l).select("g").select("circle").node().getBoundingClientRect();
            var x = bb.x + bb.width*0.5;
            var y = bb.y + bb.height*0.5;
            coords.push([x,y]);
            //s_coords += x + "," + y + " ";
        });
        var dPoly = "M" + coords.join("L") + "Z";
        allRevuePoly.push({id:"poly" + id, data: dPoly});

        // get triangle
        var offset = projection(d.locationCoords);
        var dTri = getTrianglePath(coords.length,triangleEdgeLength,offset);

        //var p = svg.append("path")
        var p = d3.select("#map").append("path")
            .attr("id","morph"+id)
            .attr("class","morphpoly")
            .attr("fill","none")
            .attr("stroke","black")
            .attr("opacity",0.05)
            .attr("d",dPoly)
            .attr('pointer-events', 'visibleStroke')
            .style("z-index",10)
            ;

        // POLY TO TRIANGLE MORPHING
        p.transition()
            //.duration(1000)
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
                d3.select(this).attr("fill","black");
                d3.select(this).attr("opacity",triangleDefaultOpacity);
            })
            ;
    });
}

function morphGeoToViz(){
     // get all polygons
     dataRevue.forEach(function(d,i){

        var id = d.id;

        // get polygon
        var s_coords = "";
        var coords = [];
        d.links.forEach( function(l,i){
            //console.log("link",l);
            var bb = d3.select("#" + l).select("g").select("circle").node().getBoundingClientRect();
            var x = bb.x + bb.width*0.5;
            var y = bb.y + bb.height*0.5;
            coords.push([x,y]);
            //s_coords += x + "," + y + " ";
        });
        var dPoly = "M" + coords.join("L") + "Z";

        //console.log("dpoly",dPoly);

        var mPath = d3.select("#morph" + id);
        //console.log("id","morph"+id);
        mPath.transition()
            .delay(getRandomInt(0,500))
            .duration(800)
            .attr("fill","none")
            .on("start",function(){
                d3.select(this).attr("opacity",0.5);
            })
            //.on("end",function(){})
            .attr("opacity",0.0)//0.03
            .attr("d",dPoly)
            ;

    });
}

function loadAllRevuePoly(){
    dataRevue.forEach(function(d,i){

        //console.log("ID???",d.id);
        var id = d.id;

        // get polygon
        var s_coords = "";
        var coords = [];
        d.links.forEach( function(l,i){
            //console.log("link",l);
            var bb = d3.select("#" + l).select("g").select("circle").node().getBoundingClientRect();
            var x = bb.x + bb.width*0.5;
            var y = bb.y + bb.height*0.5;
            coords.push([x,y]);
            //s_coords += x + "," + y + " ";
        });
        var dPoly = "M" + coords.join("L") + "Z";
        allRevuePoly.push({id:"poly" + id, data: dPoly});
    });
}

function makeNodeDisappear(d){

    // MASTER NODES
    for(var i=0; i<3; i++){
        var selg = d3.select("#master"+i);
        selg.select("g").select("circle")
            .transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
    }
    // SUB NODES
    for(var i=0; i<nbSubNodes;i++){
        var selg = d3.select("#sub"+i);
        selg.select("g").select("circle")
            .transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
    }
    // KEY NODES
    for(var i=0; i<nbKeyNodes;i++){
        var selg = d3.select("#key"+i);
        selg.select("g").select("circle")
            .transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
    }
    // TRICK FOR NOW.. in order to delete svg objects
    var circle = svg.append("circle")
                .attr("id","TODELETEVIZ")
                .transition()
                .duration(d)
                .on("end",function(){
                    console.log("DELETE OBJECTS END");
                    d3.select("#master0").remove();
                    d3.select("#master1").remove();
                    d3.select("#master2").remove();
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

  