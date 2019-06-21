// script showing all revues in a timeline view


var startYear = 1920;
var endYear = 2019;
var middleYear = 1980;

var w,h;

var svgViewport;
var innerSpace;
var xAxisScale;
var xAxis;
var zoom;
var gX;

var timelineRevues;


function initTimeline(){    

    var svgWidth = windowWidth; 
    var svgHeight = windowHeight;
    
    var margin = {top: 30, right: 0, bottom: 80, left: 0};
    //var margin = {top: 0, right: 0, bottom: 0, left: 0};
    
    w = svgWidth - margin.left - margin.right;
    h = svgHeight - margin.top - margin.bottom;
    
    svgViewport = d3.select("#timeline")
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      ;

    startYear = minYear - 40;//minYear%50;
    endYear = 2060;
    
    // create scale objects
    xAxisScale =d3.scaleLinear()
      .domain([new Date(startYear), new Date(endYear)])
      //.domain(d3.extent([startYear,endYear]))
      .range([0,w]);
    
    
    // create axis objects
    xAxis = d3.axisBottom(xAxisScale);

    xAxis.tickFormat(d3.format(""));

    // Zoom Function
    zoom = d3.zoom()
        .scaleExtent([1,6])
        .translateExtent([[margin.left,0],[w,0]])
        .on("zoom", zoomFunction);

    //console.log("zoom",zoom);
    
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
    
    // append zoom area
    var view = innerSpace.append("rect")
      .attr("class", "zoom")
      .attr("width", w)
      .attr("height", h)
      .call(zoom)
    
    function zoomFunction(){
        // create new scale ojects based on event
        //console.log("scale",d3.event.transform.k);
        var transform = d3.event.transform;
        var xNewScale = transform.rescaleX(xAxisScale);

        // update rectangle revues
        timelineRevues.attr("x", d => xNewScale(d.time[0]))
            .attr("width", d => xNewScale(d.time[1]) - xNewScale(d.time[0]))
            ;

        // update axes
        gX.call(xAxis.scale(xNewScale));
    };
    
}

function transformTimeline() {
    return d3.zoomIdentity
        //.translate(width / 2, height / 2)
        .scale(1)
        //.translate(0, 0)
        ;
  }

function dezoomTimeline(duration){
    //s = 1.0;
    //var t =[0,0];
    // update rectangle revues and x axis
    console.log("dezoom timeline");
    //d3.event.transform = d3.zoomIdentity;
    var transform = d3.zoomIdentity;
    var xNewScale = transform.rescaleX(xAxisScale);
    timelineRevues.transition().duration(duration).attr("x", d => xNewScale(d.time[0]))
        .attr("width", d => xNewScale(d.time[1]) - xNewScale(d.time[0]))
        ;
    gX.transition().duration(duration).call(xAxis.scale(xNewScale))
        /*.on("end",function(){
            svg.transition().duration(duration).call(zoom.transform,d3.zoomIdentity.translate(0,0).scale(1.0));
        });*/
    
}

function dezoomAndDeleteTimeline(duration){
    console.log("dezoomAndDeleteTimeline");
    //s = 1.0;
    //var t =[0,0];
    // update rectangle revues and x axis
    //console.log("dezoom timeline")
    var transform = d3.zoomIdentity;
    var xNewScale = transform.rescaleX(xAxisScale);
    timelineRevues.transition().duration(duration).attr("x", d => xNewScale(d.time[0]))
        .attr("width", d => xNewScale(d.time[1]) - xNewScale(d.time[0]))
        ;
    gX.transition().duration(duration).attr("opacity",0.0).call(xAxis.scale(xNewScale))
        .on("end",function(d){
            d3.select('#timeline').select("svg").remove();
        });
}

// will also hide the rectangles
function dezoomAndDeleteTimeline2(duration,reload){
    console.log("dezoomAndDeleteTimeline2");
    //s = 1.0;
    //var t =[0,0];
    // update rectangle revues and x axis
    var transform = d3.zoomIdentity;
    var xNewScale = transform.rescaleX(xAxisScale);
    timelineRevues.transition().duration(duration).attr("x", d => xNewScale(d.time[0]))
        .attr("width", d => xNewScale(d.time[1]) - xNewScale(d.time[0]))
        ;
    
    timelineRevues.transition()
        .duration(10)
        .delay(function(d,i){
            //var d = i*10;
            var d = 100 + getRandomInt(0,30)*10;
            return d;   
        })
        .on("end",function(d){
            d3.select(this).attr("opacity",0.0);
        })
        ;
    gX.transition().duration(duration).attr("opacity",0.0).call(xAxis.scale(xNewScale))
        .on("end",function(d){
            d3.select('#timeline').select("svg").remove();
            if(reload){
                state = State.LOAD;
                startTimeline();
            }
        });
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

