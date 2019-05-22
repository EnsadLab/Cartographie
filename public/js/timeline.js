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
var zoom;
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
    
    // create scale objects
    xAxisScale =d3.scaleLinear()
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
    zoom = d3.zoom()
        .on("zoom", zoomFunction);

    console.log("zoom",zoom);
    
    // Inner Drawing Space
    innerSpace = svgViewport.append("g")
        .attr("class", "inner_space")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);
    
    loadRevues();
    
    // Draw Axis
    gX = innerSpace.append("g")
        .attr("id","xaxis")
        .attr("class", "axis axis--x")
        .style("font-size",20)
        .style("font-family","latolight")
        .attr("transform", "translate(0," + h + ")")
        .attr("opacity",0.0)
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
    
    };
    
}

function transformTimeline() {
    return d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(8)
        .translate(-100, -100);
  }

function dezoomTimeline(){
    // innerSpace.call(zoom.transform, d3.zoomIdentity);
    //innerSpace.transition().duration(1000).call(zoom.transform, d3.zoomIdentity);
    //innerSpace.transition().duration(1000).call(zoom.transform, d3.zoomIdentity);
    innerSpace.transition().duration(1000).call(zoom.transform, transformTimeline);
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

function makeTimelineDisappear(delay,reload){
    console.log("delete Timeline");
    //d3.select('#timeline').select("svg").remove();
    timelineRevues.transition()
            .duration(10)
            .delay(function(d,i){
                //var d = i*10;
                var d = delay + getRandomInt(0,30)*10;
                return d;
            })
            .on("end",function(d){
                d3.select(this).attr("opacity",0.0);
            })
            ;
    gX.transition().duration(500).attr("opacity",0.0)
        .on("end",function(d){
            console.log("NO ANIMATION???");
            d3.select('#timeline').select("svg").remove();
            if(reload){
                state = State.LOAD;
                startTimeline();
            }
        });
}

function makeAxisDisappear(duration){
    gX.transition().duration(duration).attr("opacity",0.0);
}

function makeAxisAppear(duration,delay){
    gX.transition().duration(duration).delay(delay).attr("opacity",1.0);
}

function sortRevueAccordingToStartTime(a,b){
    if(a.time[0] > b.time[0]) return 1;
    else if(b.time[0] > a.time[0]) return -1;
    else return 0;
}

