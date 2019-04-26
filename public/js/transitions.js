// script containing all necessary functions to make the transitions between the different views

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
        .duration(1000)
        .attr("d",dTri)
        .on("end",function(){testMorphing();})
        ;
  
  }
  