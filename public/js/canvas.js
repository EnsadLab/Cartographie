/*

// TO CHECK: ALEX... a remettre dans l'index.ejs
<!-- <% include ./partials/menu %> -->
<!-- <% include ./partials/journal %> -->
<!-- <% include ./partials/objects %> -->
<% include ./partials/form %>

*/


var svg;
var context;


var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

var initCanvasDone = false;

function startUpdateLoop(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    update();
}

// the animation loop calculates time elapsed since the last loop
// and only draws if your specified fps interval is achieved
function update() {

    // request another frame
    requestAnimationFrame(update);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);
        drawFrame();
    }
}


function drawFrame(){
    //console.log("draw frame");
    drawViz();
    drawCanvas();
    updateUI();
}


var animAlpha = new AnimAlpha(0,0,0);

function drawCanvas(){
    if(!initCanvasDone) return;
    context.clearRect(0, 0, width, height); // Clear the canvas.

    /*
    context.fillStyle = "red";
    context.font = "30px Open Sans";
    context.textAlign = "start"
    context.textBaseline = "hanging"
    context.fillText("Text",100,100);
    */

    if(state == State.VIZ_VIEW && vizdataLoaded){
        context.lineWidth = 0.04;
        context.globalAlpha = animAlpha.update();
        //dataRevueFake.forEach(function(d,i){
        dataRevue.forEach(function(d,i){
            var s_coords = "";
            var coords = [];
            d.links.forEach( function(l,i){
        
            //console.log("link",l);
            var bb = d3.select("#nodes").select("#" + l).select("g").select("circle").node().getBoundingClientRect();
            var x = bb.x + bb.width*0.5;
            var y = bb.y + bb.height*0.5;
            coords.push([x,y]);
            //s_coords += x + "," + y + " ";
            });
            var p = "M" + coords.join("L") + "Z";
            var path = new Path2D(p);
            context.stroke(path);
        });
    }

}


function initCanvas(){
    var canvas = d3.select("#canvas")
        .attr('width', width)
        .attr('height', height);
    context = canvas.node().getContext('2d');
    initCanvasDone = true;
}


function initSVG(){
    // TO CHECK: ALEX - si ça t'ennuies trop, mets le border du svg à 0.
    svg = d3.select("#svg")
    .attr("width",width)
    .attr("height",height)
    // .style("border", "1px solid black")
    .style("border", "none")
    ;

}

function init(){
    console.log("-> init");

    // initialisation
    initDB();
    initSVG();
    initCanvas();

    loadVisualisation();

    // init our controller 
    initController();
    //blup();

    //initTimeline();

    //testMorphing60();
    //testMorphing();
    //testMorphingToRect();
    
    // start our internal update loop
    var fps = 30;
    startUpdateLoop(fps);
    
}


window.requestAnimationFrame(function(/* time */ time){
    // time ~= +new Date // the unix time
    //console.log("time",time);
});


document.addEventListener("DOMContentLoaded", function(event) { 
    console.log("-> document has been loaded");
    init();
});

