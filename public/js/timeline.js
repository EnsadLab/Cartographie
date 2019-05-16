// script showing all revues in a timeline view


var startYear = 1950;
var endYear = 2019;
var middleYear = 1980;

var timelineWidth = 1200;
var timelineHeight = 700;
var w,h;

var svgViewport;
var innerSpace;
var xAxisScale;
var gX;

var timelineRevues;

var g;

function initTimeline(){

    var svgWidth = timelineWidth;
    var svgHeight = timelineHeight;
    
    var margin = {top: 30, right: 100, bottom: 50, left: 200};
    
    w = svgWidth - margin.left - margin.right;
    h = svgHeight - margin.top - margin.bottom;
    
    var originalCircle = {"cx" : -150 ,
                          "cy" : -15 ,
                          "r"  : 20};
    
    svgViewport = d3.select("#timeline")//d3.select("body")
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      ;
     // .style("background", "red");
    

    
    // create scale objects
    xAxisScale =d3.scaleLinear()
      //.domain([-200,-100])
      .domain([new Date(startYear), new Date(endYear)])
      .range([0,w]);

    
    var yAxisScale = d3.scaleLinear()
      .domain([-10,-20])
      .range([h,0]);
    
    // create axis objects
    var xAxis = d3.axisBottom(xAxisScale);
    var yAxis = d3.axisLeft(yAxisScale);

    xAxis.tickFormat(d3.format(""));

    // Zoom Function
    var zoom = d3.zoom()
        .on("zoom", zoomFunction);
    
    // Inner Drawing Space
    innerSpace = svgViewport.append("g")
        .attr("class", "inner_space")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);
    
    // append some dummy data
    /*
    var circles = innerSpace.append('circle')
        .attr("id","circles")
        .attr("cx", xAxisScale(1980))
        .attr("cy", yAxisScale(originalCircle.cy))
        .attr('r', originalCircle.r)
    */

    loadRevues();

    svgViewport.append("rect")
            .attr("x",0)
            .attr("y",margin.top)
            .attr("width",margin.left)
            .attr("height",h)
            .attr("fill","white")
            .attr("opacity",1.0)
            ;

    svgViewport.append("rect")
            .attr("x",w + margin.left)
            .attr("y",margin.top)
            .attr("width",margin.left)
            .attr("height",h)
            .attr("fill","white")
            .attr("opacity",1.0)
            ;
    
    // Draw Axis
    gX = innerSpace.append("g")
        .attr("class", "axis axis--x")
        .style("font-size",20)
        .style("font-family","latolight")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);
    
    /*
    var gY = innerSpace.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);
    */
    
    // append zoom area
    var view = innerSpace.append("rect")
      .attr("class", "zoom")
      .attr("width", w)
      .attr("height", h)
      .call(zoom)
    
    function zoomFunction(){
      // create new scale ojects based on event
      var new_xScale = d3.event.transform.rescaleX(xAxisScale)
      var new_yScale = d3.event.transform.rescaleY(yAxisScale)
      //console.log(d3.event.transform)

      // update rectangle revues
      var transform = d3.event.transform;
      var xNewScale = transform.rescaleX(xAxisScale);
      timelineRevues.attr("x", d => xNewScale(d.time[0]))
        .attr("width", d => xNewScale(d.time[1]) - xNewScale(d.time[0]))
        ;

      // update axes
      gX.call(xAxis.scale(new_xScale));
      //gY.call(yAxis.scale(new_yScale));
    
      // update circle
      //circles.attr("transform", d3.event.transform)
    
    };
    
}

function loadRevues(){
    console.log("datarevues loading.....");
    dataRevue.sort(sortRevueAccordingToStartTime);
    y = h -15;
    timelineRevues = innerSpace.selectAll("rect")
                    .data(dataRevue)
                    .enter()
                    .append("rect")
                    .attr("id",d => "timeline"+d.id)
                    .attr("class","timelineRect")
                    .attr("x",function(d){
                        return xAxisScale(d.time[0]);
                    })
                    .attr("y",function(d){
                        y -= stepBetweenBars + barHeight;
                        return y;
                    })
                    .attr("width",function(d){
                        return xAxisScale(d.time[1]) - xAxisScale(d.time[0]);
                    })
                    .attr("height",barHeight)
                    .attr("fill",barColor)
                    .attr("opacity",0.0)
                    ;

}

function showRevueRectangles(){
    timelineRevues.transition()
            .duration(10)
            .delay(function(d,i){
                //var d = i*10;
                var d = getRandomInt(0,50)*10;
                return d;
            })
            .on("end",function(d){
                d3.select(this).attr("opacity",1.0);
            })
            ;
}

function hideTimeline(){
    console.log("delete Timeline");
    //d3.select('#timeline').select("svg").remove();
    timelineRevues.transition()
            .duration(10)
            .delay(function(d,i){
                //var d = i*10;
                var d = getRandomInt(0,30)*10;
                return d;
            })
            .on("end",function(d){
                d3.select(this).attr("opacity",0.0);
            })
            ;
    gX.transition().duration(1000).attr("opacity",0.0)
        .on("end",function(d){
            d3.select('#timeline').select("svg").remove();
        });
}

function sortRevueAccordingToStartTime(a,b){
    if(a.time[0] > b.time[0]) return 1;
    else if(b.time[0] > a.time[0]) return -1;
    else return 0;
}

