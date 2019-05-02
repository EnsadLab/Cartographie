// script containing all necessary functions to make the transitions between the different views

var allRevuePoly = [];

function startTransitionVizGeo(){

    console.log("--> startTransitionVizGeo");

    // get all polygons
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
        var edgeLength = 15; // edge lenth du triangle
        var offset = projection(d.locationCoords);
        var dTri = getTrianglePath(coords.length,edgeLength,offset);

        var p = svg.append("path")
            .attr("id","morph"+id)
            .attr("class","morphpoly")
            .attr("fill","none")
            .attr("stroke","black")
            .attr("opacity",0.05)
            .attr("d",dPoly)
            .attr('pointer-events', 'visibleStroke')
            .style("z-index",10)
            //.on("mouseover",function(){console.log("### mouseenter",d.id);showRevueOnMenu(true,d.id);})
            //.on("mouseleave",function(){console.log("### mouseleave",d.id);showRevueOnMenu(false,d.id);})
            //.on("click",function(){console.log("### mouseclick",d.id);startDetail(d.id);})
            ;

        // POLY TO TRIANGLE MORPHING
        p.transition()
            //.duration(800)
            .duration(getRandomInt(200,500))
            .attr("d",dTri)
            .ease(d3.easeQuad)
            .delay(getRandomInt(0,600))
            .on("start",function(){
                d3.select(this).attr("opacity","0.05");
                //d3.select(this).attr("opacity","1.0");
            })
            .attr("opacity",1.0)
            .on("end",function(){
                d3.select(this).attr("fill","black");
            })
            ;

    });


    // make nodes disappear
    var d = 1000;
    for(var i=0; i<3; i++){
        var selg = d3.select("#master"+i);
        selg.transition()
           // .attr("transform",'translate('+ width*0.5 + ',' + height*0.5 + ')')
            .duration(d)
            ;
        var selCircle = selg.select("g").select("circle");
        selCircle.transition()
           // .attr("r",0)
            .attr("opacity",0.0)
            .duration(d)
            ;
        var selText = selg.select("g").select("text");
        //console.log("seltext",selText);
        selText.transition()
            .attr("opacity",0.0)
            //.attr("fill","black")
            .duration(d)
            ;
    }

    d = 500;
    for(var i=0; i<nbSubNodes;i++){
        var selg = d3.select("#sub"+i);
            selg.transition()
           // .attr("transform",'translate('+ 0 + ',' + 0 + ')')
            .duration(d)
            ;
        var selCircle = selg.select("g").select("circle");
        selCircle.transition()
           // .attr("r",0)
            .attr("opacity",0.0)
            .duration(d)
            ;
        var selText = selg.select("g").select("text");
            selText.transition()
            //.attr("r",300)
            .attr("opacity",0.0)
            .attr("fill","black")
            .duration(d)
            ;
    }
    
    d = 500;
    for(var i=0; i<nbKeyNodes;i++){
        var selg = d3.select("#key"+i);
            selg.transition()
            //.attr("transform",'translate('+ 0 + ',' + 0 + ')')
            .duration(d)
            ;
        var selCircle = selg.select("g").select("circle");
        selCircle.transition()
          //  .attr("r",0)
            .attr("opacity",0.0)
            .duration(d)
            ;
        var selText = selg.select("g").select("text");
        selText.transition()
            //.attr("r",300)
            .on("start",function(){d3.select(this).attr("opacity","0.0");}) // devrait pas etre nécessaire.... ou est le bug?
            .duration(d)
            .attr("opacity",0.0)
            ;
    }


    var circle = svg.append("circle")
                .attr("id","TODELETEVIZ")
                .transition()
                .duration(1000)
                .on("end",function(){
                    console.log("DELETE OBJECTS END StartTransitionVizGeo");
                    d3.select("#master0").remove();
                    d3.select("#master1").remove();
                    d3.select("#master2").remove();
                })
                ;

    console.log("----> END StartTransitionVizGeo");

}


function startTransitionGeoViz(){

    console.log("startTransitionGeoViz");
    deleteMap();

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

    var circle = svg.append("circle")
            .attr("id","TODELETELINES")
            .transition()
            .duration(1000)
            .on("end",function(){
                console.log("DELETE OBJECTS END StartTransitionGeoViz");
                restartAnimNodes();
                vizdataLoaded = true;
                d3.selectAll(".morphpoly").remove();
            })
            ;


    console.log("----> END StartTransitionGeoViz");
}

function makeNodeDisappear(d){
    for(var i=0; i<3; i++){
        var selg = d3.select("#master"+i);
        var selCircle = selg.select("g").select("circle");
        selCircle.transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
    }
    for(var i=0; i<nbSubNodes;i++){
        var selg = d3.select("#sub"+i);
        var selCircle = selg.select("g").select("circle");
        selCircle.transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
    }
    for(var i=0; i<nbKeyNodes;i++){
        var selg = d3.select("#key"+i);
        var selCircle = selg.select("g").select("circle");
        selCircle.transition()
            .attr("opacity",0.0)
            .duration(d)
            ;
    }
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

  