
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

        //console.log("masternodes",masterNodes);
            
        dataRevue.forEach(function(d,i){
            var s_coords = "";
            var coords = [];
            
            d.links.forEach( function(l,i){
        
                //console.log("link",l);
                //var node = d3.select("#nodes").select("#" + l).select("g").select("circle").node();
                var res = allNodes_flat.find( function(data) { return data.id == l; });
               // console.log("id",l);
               // console.log("res",res);
                //console.log("r",res.r);
                var bb_x  = res.x;//node.attr("x");
                var bb_y = res.y;//node.attr("y");
                //var bb_width = res.r*2.0;//node.attr("width");
                //var bb_height = 100;//node.attr("height");
                //var node = d3.select("#nodes").select("#" + l).select("g").select("circle").node();
                //var bb = node.getBoundingClientRect();
                //var bb = {x: 346.63800048828125, y: 477.41363525390625, width: 11.959564208984375, height: 11.9595947265625};
                //console.log("bb",bb);
                //var x = bb.x + bb.width*0.5;
                //var y = bb.y + bb.height*0.5;
                //var x = bb_x + bb_width*0.5;
                //var y = bb_y + bb_width*0.5;
                //coords.push([x,y]);
                coords.push([bb_x,bb_y]);
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
    svg = d3.select("#svg")
    .attr("width",width)
    .attr("height",height)
    // .style("border", "1px solid black")
    .style("border", "none")
    ;

}

function initDivStructure(){
    createDefs(); // done in visualisation
    
    svg.append("g").attr("id","obj-nodes");
    svg.append("g").attr("id","nodes");
    svg.append("g").attr("id","map");
    svg.append("g").attr("id","map-nodes");
    svg.append("g").attr("id","timeline");
    svg.append("g").attr("id","poly");
    svg.append("g").attr("id","detail-nodes");
    
}

function init(){
    console.log("-> init");

    // initialisation
    initDB();
    initSVG();
    initCanvas();
    initDivStructure();

    // init our controller 
    initController();
    //blup();

    //initTimeline();

    //testMorphing60();
    //testMorphing();
    //testMorphingToRect();
    
    // start our internal update loop
    var fps = 60; //30
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

