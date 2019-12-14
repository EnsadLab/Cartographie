
var svg;
var context;
var context2;
var canvas;
var canvas2;
var offscreenCanvas;
var ctxOffscreen;

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
    drawViz();
    drawCanvas();
    updateUI();
}


var animAlpha = new AnimAlpha(0,0,0);
var animAlphaMasterNodes = new AnimAlpha(0,0,0);

// old version

var imgSSH = new Image();
var imgScience = new Image();
var imgArt = new Image();
var nbImgLoaded = 0;
imgSSH.onload = function() {
    nbImgLoaded++;
    if(nbImgLoaded == 3) imgLoaded = true;
};
imgScience.onload = function() {
    nbImgLoaded++;
    if(nbImgLoaded == 3) imgLoaded = true;
};
imgArt.onload = function() {
    nbImgLoaded++;
    if(nbImgLoaded == 3) imgLoaded = true;
};


var imgs = [imgArt,imgSSH,imgScience];

var imgLoaded = false;
var doubleBuffer;
var nbFrames = 0;


function loadImages(){
    console.log("load images");
    imgSSH.src = '../imgs/SSh_500_DEBUG.png';
    imgScience.src = '../imgs/Science_500_DEBUG.png';
    imgArt.src = '../imgs/Art_500_DEBUG.png';
}


function drawCanvas(){

    if(!initCanvasDone) return;
    if(!imgLoaded) return;

    if(state == State.VIZ_VIEW && vizdataLoaded){

        // one buffer
        context.lineWidth = 0.04;
        context.globalAlpha = animAlpha.update();
        context.clearRect(0, 0, width, height); // Clear the canvas.
        context.beginPath();
        dataRevue.forEach(function(d,i){
            var xBeginPath = 0; var yBeginPath = 0;
            d.links.forEach( function(l,i){
                var res = allNodes_flat.find( function(data) { return data.id == l; });
                var x = 0; var y = 0;
                if(animVizRunning){
                    x = res.x;
                    y = res.y;
                }else{
                    x = res.xStart;
                    y = res.yStart;
                }

                x *= sViz;
                y *= sViz;
                x += tViz[0];
                y += tViz[1];
                if(i == 0) {
                    context.moveTo(x,y);
                    xBeginPath = x;
                    yBeginPath = y;
                }
                else if(i == d.links.length-1){
                    context.lineTo(x,y);
                    context.lineTo(xBeginPath,yBeginPath);
                }
                else {
                    context.lineTo(x,y);
                }
            });       
        });
        context.stroke();
    
        if(imgLoaded) {
            var f = 0.8;
            for(var index=0; index<3; index++){
                var x = 0; var y = 0;
                var res = allNodes_flat.find( function(data) { return data.id == "master"+index; });
                if(animVizRunning){
                    x = res.x;
                    y = res.y;
                }else{
                    x = res.xStart;
                    y = res.yStart;
                }

                
                
                x *= sViz;
                y *= sViz;
                x += tViz[0];
                y += tViz[1];
                var r = res.r*f*sViz;
                context.drawImage(imgs[index], x-r, y-r,r*2.0,r*2.0);
            }
        }
    }
}


function clearCanvas(){
    context.clearRect(0, 0, width, height); // Clear the canvas.
}

function initCanvas(){
    canvas = d3.select("#canvas")
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
    initSVG();
    initCanvas();
    initDivStructure();
    initDB();

    loadImages();

    if(isSimulateDB){
        databaseLoaded();
    }

}

function databaseLoaded(){
    // init our controller 
    initController();

    // start our internal update loop
    start();
}

function initCms(){
    nodes.forEach(function(d,i){
        //console.log("bef",d.name);
        d.name = d.name.replace(/\&amp;/g,'&');
        //str= str.replace(/\&lt;/g,'<');
        //console.log("aft",d.name);
    });
    dataRevueOnlineFromDB.forEach(function(d,i){
        d.name = d.name.replace(/\&amp;/g,'&');
        d.link = d.link.replace(/\&amp;/g,'&');
        d.publisher = d.publisher.replace(/\&amp;/g,'&');
        d.about = d.about.replace(/\&amp;/g,'&');
        d.about = d.about.replace(/\&#39;/g,"'");
        d.note = d.note.replace(/\&amp;/g,'&');
        d.note = d.note.replace(/\&#39;/g,"'");
    });
    dataRevueWaitingFromDB.forEach(function(d,i){
        d.name = d.name.replace(/\&amp;/g,'&');
        d.link = d.link.replace(/\&amp;/g,'&');
        d.publisher = d.publisher.replace(/\&amp;/g,'&');
        d.about = d.about.replace(/\&amp;/g,'&');
        d.about = d.about.replace(/\&#39;/g,"'");
        d.note = d.note.replace(/\&amp;/g,'&');
        d.note = d.note.replace(/\&#39;/g,"'");
    });
    genDatas();
    showCms();
}

function start(){
    var fps = 30; //30
    startUpdateLoop(fps);
}


window.requestAnimationFrame(function(/* time */ time){
    // time ~= +new Date // the unix time
    //console.log("time",time);
});


document.addEventListener("DOMContentLoaded", function(event) { 
    console.log("-> document has been loaded: is_cms",is_cms);
    if(is_cms){
        initCms();
    }else{
        init();
    }
});

