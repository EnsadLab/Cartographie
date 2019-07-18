
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
    //console.log("draw frame");
    drawViz();
    drawCanvas();
    //drawWebGL();
    updateUI();
}


var animAlpha = new AnimAlpha(0,0,0);

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
//imgSSH.src = 'https://www.tutorialspoint.com/images/seaborn-4.jpg?v=2';
imgSSH.src = 'http://localhost:8080/imgs/SSh_500.png';
imgScience.src = 'http://localhost:8080/imgs/Science_500.png';
imgArt.src = 'http://localhost:8080/imgs/Art_500.png';

var imgLoaded = false;
var doubleBuffer;
var nbFrames = 0;
function drawCanvas(){
    if(!initCanvasDone) return;


    if(state == State.VIZ_VIEW && vizdataLoaded){

        /* 
        // Double buffering
        ctxOffscreen.clearRect(0, 0, width, height); // Clear the canvas.
        ctxOffscreen.strokeRect(0, 0, 10, 10);
        ctxOffscreen.lineWidth = 0.04;
        ctxOffscreen.globalAlpha = animAlpha.update();
        ctxOffscreen.beginPath();
        dataRevue.forEach(function(d,i){
            var x = 0; var y = 0;
            d.links.forEach( function(l,i){
                var res = allNodes_flat.find( function(data) { return data.id == l; });
                if(res.x < 100) console.log(l,res.x,res.y);
                if(i == 0) {
                    ctxOffscreen.moveTo(res.x,res.y);
                    x = res.x;
                    y = res.y;
                }
                else if(i == d.links.length-1){
                    ctxOffscreen.lineTo(res.x,res.y);
                    ctxOffscreen.lineTo(x,y);
                }
                else {
                    ctxOffscreen.lineTo(res.x,res.y);
                }
            });       
        });
        ctxOffscreen.stroke();

        if(imgLoaded) {
            var res = allNodes_flat.find( function(data) { return data.id == "master0"; });
            ctxOffscreen.globalAlpha = 0.8; var f = 0.8; var r = res.r*f;
            ctxOffscreen.drawImage(imgArt, res.x-r, res.y-r,r*2.0,r*2.0);
            res = allNodes_flat.find( function(data) { return data.id == "master1"; }); r = res.r*f;
            ctxOffscreen.drawImage(imgSSH, res.x-r, res.y-r,r*2.0,r*2.0);
            res = allNodes_flat.find( function(data) { return data.id == "master2"; }); r = res.r*f;
            ctxOffscreen.drawImage(imgScience, res.x-r, res.y-r,r*2.0,r*2.0);
        }

        context.clearRect(0, 0, width, height); // Clear the canvas.
        context.drawImage(offscreenCanvas,0,0);
        */

        // one buffer
        context.lineWidth = 0.04;
        context.globalAlpha = animAlpha.update();
        context.clearRect(0, 0, width, height); // Clear the canvas.
        context.beginPath();
        dataRevue.forEach(function(d,i){
            var x = 0; var y = 0;
            d.links.forEach( function(l,i){
                var res = allNodes_flat.find( function(data) { return data.id == l; });
                if(i == 0) {
                    context.moveTo(res.x,res.y);
                    x = res.x;
                    y = res.y;
                }
                else if(i == d.links.length-1){
                    context.lineTo(res.x,res.y);
                    context.lineTo(x,y);
                }
                else {
                    context.lineTo(res.x,res.y);
                }
            });       
        });
        context.stroke();
    
        //imgLoaded = false;
        if(imgLoaded) {
            var res = allNodes_flat.find( function(data) { return data.id == "master0"; });
            context.globalAlpha = 0.8; var f = 0.8; var r = res.r*f;
            context.drawImage(imgArt, res.x-r, res.y-r,r*2.0,r*2.0);
            res = allNodes_flat.find( function(data) { return data.id == "master1"; }); r = res.r*f;
            context.drawImage(imgSSH, res.x-r, res.y-r,r*2.0,r*2.0);
            res = allNodes_flat.find( function(data) { return data.id == "master2"; }); r = res.r*f;
            context.drawImage(imgScience, res.x-r, res.y-r,r*2.0,r*2.0);
        }
        
    }
}

function drawWebGL(){
    /*======= Defining and storing the geometry ======*/
    /*
    var vertices = [
        -0.7,-0.1,0,
        -0.3,0.6,0,
        -0.3,-0.3,0,
        0.2,0.6,0,
        0.3,-0.3,0,
        0.7,0.6,0 
    ]
    */
    var vertices = [];
    //var nbVertices = 10;
    /*
    for(var i=0; i<nbVertices;i++){
        vertices.push(Math.random()*2.0-1.0);
        vertices.push(Math.random()*2.0-1.0);
        vertices.push(0);
    }*/

    if(state == State.VIZ_VIEW && vizdataLoaded){
        //context.lineWidth = 0.04;
        //context.globalAlpha = animAlpha.update();
        dataRevue.forEach(function(d,i){
           // if(i==0){
                var s_coords = "";
                var coords = [];
                d.links.forEach( function(l,i){
                    
                    var res = allNodes_flat.find( function(data) { return data.id == l; });
                    var bb_x  = 2.0*(parseFloat(res.x)/parseFloat(width)) -1.0;
                    if(bb_x > 1.0) bb_x = 1.0;
                    else if(bb_x < -1.0) bb_x = -1.0;
                    var bb_y = 2.0*(parseFloat(res.y)/parseFloat(height)) -1.0;
                    if(bb_y > 1.0) bb_y = 1.0;
                    else if(bb_y < -1.0) bb_y = -1.0;
                    //console.log("id",l,2.0*(res.x/width)-1.0,res.y, width,height);
                    coords.push([bb_x,bb_y]);
                    //console.log(bb_x,bb_y,0);
                    vertices.push(bb_x);
                    vertices.push(bb_y);
                    vertices.push(0.0);
                    
                });       
                var p = "M" + coords.join("L") + "Z";
                //console.log("vertices",vertices);
                var path = new Path2D(p);
                //context.stroke(path);
           // }

        });
    }
    var nbVertices = vertices.length/3;

    // Create an empty buffer object
    var vertex_buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*=================== Shaders ====================*/
    // Vertex shader source code
    var vertCode =
        'attribute vec3 coordinates;' +
        'void main(void) {' +
        ' gl_Position = vec4(coordinates, 1.0);' +
        '}';

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);
    // Fragment shader source code
    var fragCode =
        'void main(void) {' +
        'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.8);' +
        '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode);
    // Compile the fragmentt shader
    gl.compileShader(fragShader);
    // Create a shader program object to store
    // the combined shader program
    var shaderProgram = gl.createProgram();
    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);
    // Link both the programs
    gl.linkProgram(shaderProgram);
    // Use the combined shader program object
    gl.useProgram(shaderProgram);

    /*======= Associating shaders to buffer objects ======*/
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============ Drawing the triangle =============*/

    // Clear the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    // Clear the color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);
    // Draw the triangle
    //gl.drawArrays(gl.LINES, 0, 6);
    gl.drawArrays(gl.LINE_LOOP, 0, nbVertices);

    // POINTS, LINE_STRIP, LINE_LOOP, LINES,
    // TRIANGLE_STRIP,TRIANGLE_FAN, TRIANGLES
}


function initCanvas(){
    canvas = d3.select("#canvas")
        .attr('width', width)
        .attr('height', height);
    context = canvas.node().getContext('2d');
    
    /*
    // double buffering
    offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    ctxOffscreen = offscreenCanvas.getContext('2d');
    */
    
    initCanvasDone = true;
}

var gl;
function initCanvasWebGL(){
    var canvas = d3.select("#canvas")
        .attr('width', width)
        .attr('height', height);
    gl = canvas.node().getContext('experimental-webgl');
    gl.clearColor(1.0,1.0,1.0,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    //context = canvas.node().getContext('2d');
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
    //initCanvasWebGL();
    initDivStructure();

    // init our controller 
    initController();
    //blup();

    //initTimeline();

    //testMorphing60();
    //testMorphing();
    //testMorphingToRect();
    
    // start our internal update loop
    var fps = 30; //30
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


/* version 1
function drawCanvas(){
    if(!initCanvasDone) return;
    context.clearRect(0, 0, width, height); // Clear the canvas.

    if(state == State.VIZ_VIEW && vizdataLoaded){
        context.lineWidth = 0.04;
        context.globalAlpha = animAlpha.update();
        dataRevue.forEach(function(d,i){
            var s_coords = "";
            var coords = [];
            d.links.forEach( function(l,i){
                //console.log("link",l);
                var node = d3.select("#nodes").select("#" + l).select("g").select("circle").node();
                var bb = node.getBoundingClientRect();
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
}*/

/* version 2
function drawCanvas(){
    if(!initCanvasDone) return;
    context.clearRect(0, 0, width, height); // Clear the canvas.

    if(state == State.VIZ_VIEW && vizdataLoaded){
        context.lineWidth = 0.04;
        context.globalAlpha = animAlpha.update();
        context.beginPath();
        dataRevue.forEach(function(d,i){
           // if(i == 0){
                //var s_coords = "";
                //var coords = [];
                d.links.forEach( function(l,i){
                    var res = allNodes_flat.find( function(data) { return data.id == l; });
                    //var bb_x  = res.x;
                    //var bb_y = res.y;
                    //console.log("id",l,res.x,res.y);
                    //coords.push([bb_x,bb_y]);
                    if(i == 0) context.moveTo(res.x,res.y);
                    else context.lineTo(res.x,res.y);
                });       
                //var p = "M" + coords.join("L") + "Z";
                //var path = new Path2D(p);
                //context.stroke(path);
           // }
        });
        context.stroke();
    }

    if(imgLoaded) {
        var res = allNodes_flat.find( function(data) { return data.id == "master0"; });
        context.globalAlpha = 0.8;
        var f = 0.8;
        var r = res.r*f;
        context.drawImage(imgArt, res.x-r, res.y-r,r*2.0,r*2.0);
        res = allNodes_flat.find( function(data) { return data.id == "master1"; });
        r = res.r*f;
        context.drawImage(imgSSH, res.x-r, res.y-r,r*2.0,r*2.0);
        res = allNodes_flat.find( function(data) { return data.id == "master2"; });
        r = res.r*f;
        context.drawImage(imgScience, res.x-r, res.y-r,r*2.0,r*2.0);
        context.globalAlpha = 1.0;
    }
}
*/
