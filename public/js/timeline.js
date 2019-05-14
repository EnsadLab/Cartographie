// script showing all revues in a timeline view


var startYear = 1950;
var endYear = 2019;
var middleYear = 1980;

var xScale;
var timeline;

// Data
var dataPoints = [1955, 1970, 1985, 2010];
var circles;
var rectangles;

function initTimeline(){

    var dims = {
        width: 1250,
        height: 800,
        svg_dx: 100,
        svg_dy: 100
    };

    // Zoom
    var zoom = d3.zoom()
        .extent([[dims.svg_dx, dims.svg_dy], [dims.width-(dims.svg_dx*2), dims.height-dims.svg_dy]])
        .scaleExtent([1, 10])
        .translateExtent([[dims.svg_dx, dims.svg_dy], [dims.width-(dims.svg_dx*2), dims.height-dims.svg_dy]])
        .on('zoom', zoomed);

    // Scale
    xScale = d3.scaleLinear()
        //.domain([0, 5000])
        .domain([new Date(startYear), new Date(endYear)])
        .range([dims.svg_dx, dims.width-(dims.svg_dx*2)]);

    // Axis
    var xAxis = d3.axisBottom(xScale);

    // Main svg
    timeline = d3.select('#timeline') // euh.. on construit un svg ds un autre.. un peu bof, non?
        .append("svg")
        .attr("width", dims.width)
        .attr("height", dims.height)
        .append("g")
        .attr("fill","orange")
        .attr("transform", "translate(100, 700)");

    
    var rect = timeline
        .append("rect")
        .attr("x", 0)
        .attr("y", -550)//-25)
        .attr("width", dims.width)
        .attr("height", 550)
        //.style("fill", "pink")
        .style("fill", "none")
        .call(zoom);


    //loadDatas();
    loadRevues();


    // axis
    var axis = timeline.append("g").attr("id","axis-x");

    d3.select("#axis-x").style("font-size",20)
                        .style("font-family","latolight")
                        ;


    // Jump to position when loading.... 
    startTransition(startYear,endYear);


    function zoomed() {
        var transform = d3.event.transform;

        // Zoom the circles
        var xNewScale = transform.rescaleX(xScale);

        /*
        circles.attr("cx", function (d) {return xNewScale(d);})
            //.attr("cy",300)
            ;
        rectangles.attr("x", xNewScale(1980))
            .attr("width",xNewScale(2000)-xNewScale(1980))
            ;
        */
       timelineRevues.attr("x", d => xNewScale(d.time[0]))
                    .attr("width", d => xNewScale(d.time[1]) - xNewScale(d.time[0]))
                    ;

        // Zoom the axis
        xAxis.scale(xNewScale);
        // axis.call(xAxis.tickFormat(d3.format("")).ticks(d3.timeYear));
        axis.call(xAxis.tickFormat(d3.format("")));
    }

    function startTransition(s,e) {
        // Position to (500, 1500) at start
        // to jump to [500,1500] we need to calculate a new scale factor (k)...
        var k = (xScale(endYear) - xScale(startYear)) / (xScale(e) - xScale(s));

        // ...and then a translate to [500, 0]
        var tx = dims.svg_dx - (k * xScale(s));

        var t = d3.zoomIdentity.translate(tx, 0).scale(k);

        // Rescale the axis
        xAxis.scale(t.rescaleX(xScale));
        axis.attr("transform", "translate(0,-20)")
            .call(xAxis);

        // Rescale the circles
        rect.call(zoom.transform, t);
    }
}
var timelineRevues;

function sortRevueAccordingToStartTime(a,b){
    if(a.time[0] > b.time[0]) return 1;
    else if(b.time[0] > a.time[0]) return -1;
    else return 0;
}

function loadRevues(){
    console.log("datarevues loading.....");
    dataRevue.sort(sortRevueAccordingToStartTime);
    y = -30;
    timelineRevues = timeline.selectAll("rect")
                    .data(dataRevue)
                    .enter()
                    .append("rect")
                    .attr("id",d => "timeline"+d.id)
                    .attr("x",function(d){
                        return xScale(d.time[0]);
                    })
                    .attr("y",function(d){
                        y -= stepBetweenBars + barHeight;
                        return y;
                    })
                    .attr("width",function(d){
                        return xScale(d.time[1]) - xScale(d.time[0]);
                    })
                    .attr("height",barHeight)
                    .attr("fill",barColor)
                    .attr("opacity",1.0)
                    ;

}

function loadDatas(){
    circles = timeline.selectAll('circle')
        .data(dataPoints)
        .enter()
        .append('circle')
        .attr("cy",-100)
        .attr('r', 7)
        .attr('cx', function (d) {
            return xScale(d);
        });
    var y = -50;  
   // for(var i=0; i<100; i++){
        var xStart = getRandomInt(1950,2020);
        xStart = 1980;
        var xEnd = getRandomInt(30,50) + xStart;
        xEnd = 2000;
        rectangles = timeline
            .append("rect")
            .attr("x",xScale(xStart))
            .attr("y",y)
            .attr("width",xScale(xEnd)-xScale(xStart))
            .attr("height",barHeight)
            .attr("fill",barColor)
            ;
        y -= 8;
  //  }
}