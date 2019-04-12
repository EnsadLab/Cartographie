var svg;

function init(){
    console.log("-> init");
    svg = d3.select("body").append("svg")
    .attr("width",totalWidth)
    .attr("height",totalHeight)
    .style("border", "1px solid black");
    
    //initGeoMap();
    //initVisualisation();
}

function applyTest2(){
    console.log("TEST button 2");
    if(USE_DB){
        socket.emit('getMagazines','HELLOHELLO');
    }
}

function applyTest3(){
    console.log("TEST button 3");
}

document.addEventListener("DOMContentLoaded", function(event) { 
    console.log("-> document has been loaded");
    init();
});

