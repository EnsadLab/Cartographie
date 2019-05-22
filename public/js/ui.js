// script that contains all necessary javascript code for all gui elements
// navigation bar, magazine menu on the right, detailed magazine view and etc..

/*
d3.select("#geoView").on("click", function(){ startGeo();})
d3.select("#vizView").on("click", function(){ startViz();})
d3.select("#timelineView").on("click", function(){ startTimeline();}) 
d3.select("#DEBUGView").on("click", goingBack ) // A ENELEVER A LA FIN
*/

d3.select("#geoView").on("click", function(){ 
    startGeo();
    document.getElementById("vizView").className = "";
    document.getElementById("timelineView").className = "";
    document.getElementById("geoView").className = "active";
})


d3.select("#vizView").on("click", function(){ 
    startViz();
    document.getElementById("vizView").className = "active";
    document.getElementById("timelineView").className = "";
    document.getElementById("geoView").className = "";

})

d3.select("#timelineView").on("click", function(){ 
    startTimeline();
    document.getElementById("vizView").className = "";
    document.getElementById("timelineView").className = "active";
    document.getElementById("geoView").className = "";

})


var updatePolyPos = false;
var startingSTARTOBJ = false;
var comingFromViz = false;

var currentRevueId;
var currentNBLinks;


const State = {
    LOAD: 0,
    OBJ_VIEW: 1,
    VIZ_VIEW: 2,
    GEO_VIEW: 3,
    TIMELINE_VIEW: 4,
    DETAIL_VIEW: 5,
  };

var state = State.LOAD;
var previousState = State.LOAD;
function getName(state){switch(state){  case 0: return "LOAD"; 
                                        case 1: return "OBJ_VIEW";
                                        case 2: return "VIZ_VIEW";
                                        case 3: return "GEO_VIEW";
                                        case 4: return "TIMELINE_VIEW";
                                        case 5: return "DETAIL_VIEW";
                                    }}

var vizdataLoaded = false;
  

function blup(){
    previousState = State.LOAD;
    state = State.TIMELINE_VIEW;
    createMenu();
    showMenu(true);
    showRevueDetail(false);
    showObjMenu(false);
    showFormular(false);
}

function initController(){
    console.log("---> initController");
    previousState = State.LOAD;
    state = State.LOAD;
    createMenu();
    // hide all ui elements
    showMenu(false);
    showRevueDetail(false);
    showObjMenu(false);
    showFormular(false);
    // start visualisation
    startViz();

    // if(state == State.DETAIL_VIEW){

    // }
    

    d3.select("#svg").on("click", function() {
        //console.log("CLICK");
        if(state == State.DETAIL_VIEW || (state == State.OBJ_VIEW && !startingSTARTOBJ)){
            goingBack();
        }
    });
}


function toggleControllerDetails(show){
    if(show){
         d3.select("#svg").on("mouseover", function() {
            d3.selectAll(".back-btn").style("opacity",1);
            d3.select(this).style("cursor", "pointer");
        });

        d3.select("#svg").on("mouseout", function() {
            d3.selectAll(".back-btn").style("opacity",0);
            d3.select(this).style("cursor", "default");
        });
    }else{// removeLitener
        d3.select("#svg").on("mouseover", null);
        d3.select("#svg").on("mouseover", function(){
            d3.select(this).style("cursor", "default");
        });

        d3.select("#svg").on("mouseout", null);
        d3.select("#svg").on("mouseout", function(){});
    }

    console.log(show);
   
}


function startGeo(){

    previousState = state;
    state = State.GEO_VIEW;

    
    if(previousState == State.GEO_VIEW){
        //recenter();
        //return;
        showMenu(false);
        hideAndDeleteMap(500,true);
        fadeAndDeleteTriangles(500);
        return;
    }

    initGeoMap(); // will show it as well
    if(previousState == State.LOAD){
        createGeoTriPath();
        showMenu(true);
    }else if(previousState == State.VIZ_VIEW){
        startTransitionVizGeo();
    }else if(previousState == State.TIMELINE_VIEW){
        startTransitionTimelineGeo();
    }else if(previousState == State.DETAIL_VIEW){
        createGeoTriPath(currentRevueId);
        morphPolyDetailToTriGeo(currentRevueId);
        showRevueDetail(false);
        showMenu(true);
        hideObjectLinked(300);
    }else if(previousState == State.OBJ_VIEW){
        createGeoTriPath();
        hideAndDeleteObjView(500);
        showObjMenu(false);
        showMenu(true);
    }
}

function startViz(){

    previousState = state;
    state = State.VIZ_VIEW;
    console.log("state",getName(state),getName(previousState));

    if(previousState == State.VIZ_VIEW){
        showMenu(false);
        makeNodeDisappear(200,true);
        return;
    }

    vizdataLoaded = false;
    initVisualisation();
    showMenu(true);

    if(previousState == State.LOAD){
        vizdataLoaded = true;
        startAnimNodes();
        animAlpha.start(0,1.0,0.5,0);
    } else if(previousState == State.GEO_VIEW){
        dezoomMap();
        startTransitionGeoViz();
        animAlpha.start(0,1.0,0.5,0);
        vizdataLoaded = true;
    } else if(previousState == State.OBJ_VIEW){
        showObjMenu(false);
        showMenu(true);
        hideAndDeleteObjView(800);
        startAnimNodes();
        animAlpha.start(0,1.0,0.5,0.0);
        vizdataLoaded = true;
    } else if(previousState == State.DETAIL_VIEW){
        showRevueDetail(false);
        showMenu(true);
        hideObjectLinked(300);
        morphDetailToViz(currentRevueId);
        animAlpha.start(0,1.0,0.5,0.0);
        vizdataLoaded = true;
    } else if(previousState == State.TIMELINE_VIEW){
        startTransitionTimelineViz();
    }
    
}


function startTimeline(){
    //if(state == State.TIMELINE_VIEW) return; // TODO: TO ASK ALEX

    previousState = state;
    state = State.TIMELINE_VIEW;

    if(previousState == State.TIMELINE_VIEW){
        //dezoomTimeline();
        //return;
        showMenu(false);
        makeTimelineDisappear(500,true);
        return;
    }

    initTimeline();
    makeAxisAppear(1000,600);
    if(previousState == State.LOAD){
        showMenu(true);
        showRevueRectangles();
    } else if(previousState == State.VIZ_VIEW){
        startTransitionVizTimeline();
    } else if(previousState == State.GEO_VIEW){
        startTransitionGeoTimeline();
    } else if(previousState == State.DETAIL_VIEW){
        showRevueDetail(false);
        showMenu(true);
        showRevueRectangles();
        morphDetailToRect(currentRevueId);
        hideObjectLinked(300);
    } else if(previousState == State.OBJ_VIEW){
        hideAndDeleteObjView(500);
        showRevueRectangles();
        showObjMenu(false);
        showMenu(true);
    }
}


function startObj(id){
    //if(state == State.OBJ_VIEW) return;
    console.log("--> startObj",id);
    startingSTARTOBJ = true;
    previousState = state;
    state = State.OBJ_VIEW;

    // we know we come from VIZ_VIEW
    // hide ui elements
    if(previousState == State.VIZ_VIEW){
        showMenu(false);
    }else if(previousState == State.OBJ_VIEW){
        showObjMenu(false);
    }

    // graphic elements

    // grab all links from all revues
    var revueConnectedToObj = [];
    var result = [];
    for(var i=0; i<dataRevue.length; i++){
        if(dataRevue[i].links.includes(id)) {
            result = result.concat(dataRevue[i].links);
            revueConnectedToObj.push(dataRevue[i]);
        }
    }
  
    
    //console.log("result",result);
    //console.log("uniqueLinks",uniqueLinks);
    if(previousState == State.VIZ_VIEW){
        createDashBackgroundCircles();
    }


    var uniqueLinks = getArrayWithUniqueElemAndKey(result);
    console.log("uniqueLinks",uniqueLinks);
    var nbLinks = uniqueLinks.length;
    var min = uniqueLinks.find( d => d.id == "DATA_MIN").nb;
    var max = uniqueLinks.find( d => d.id == "DATA_MAX").nb;
    var max2 = uniqueLinks.find( d => d.id == "DATA_SECOND_MAX").nb;
    var nbMaster0 = uniqueLinks.filter( d => d.parent == "master0").length;
    var nbMaster1 = uniqueLinks.filter( d => d.parent == "master1").length;
    var nbMaster2 = uniqueLinks.filter( d => d.parent == "master2").length;
    var countMaster0 = 0; var countMaster1 = 0; var countMaster2 = 0;
    console.log("nbmasters",d.parent,nbMaster0,nbMaster1,nbMaster2);

    
    if(previousState == State.OBJ_VIEW){
        d3.select("#obj-nodes").selectAll(".g-objects").each(function(d,i){
            var node = d3.select(this);
            var id = node.attr("id");
            var r = uniqueLinks.find( data => data.id == id);
            //console.log("r",r);
            if(r == undefined){
                var n = dataLinks.find(data => data.id == id).name;
                //console.log("removing obj",id,n);
                //console.log("?",d3.select(this).node());
                //d3.select(this).select("circle").attr("r",25);
                //d3.select(this).remove();
                //d3.select(this).attr("class","toberemoved");
                
                node.select("circle").transition()
                        .duration(1000)
                        .attr("opacity",0.0)
                        .attr("stroke-opacity",0.0)
                        .attr("stroke-opacity",0.0)
                        .on("end",function(d){
                            //console.log("should remove");
                            node.remove();
                        })
            }
        })
    }

    //console.log("MIN/MAX",min,max,max2);
    uniqueLinks.forEach(function(d,i){
        if(d.id.startsWith("DATA")) return;

        var master = masterNodes.filter( function(data) { return data.id == d.parent; })[0];

        // radius
        var r = mapValue(d.nb,max,min,rMinObject,rMaxObject);
        //var r = mapValue(d.nb,max2,min,rMinObject,rMaxObject);
        //r = rMaxObject - Math.floor((d.nb-min)/4) * rMinObject;
        console.log("!!!",d.nb,max,min,rMinObject,rMaxObject);
        var angle;
        if(d.parent == "master0"){
            /*if(nbMaster0 == 0) angle = 0;
            else*/ angle = (countMaster0/nbMaster0)*Math.PI*2.0/3.0 + 7.0*Math.PI/6.0;
            countMaster0++;
        }else if(d.parent == "master1"){
            /*if(nbMaster1 == 0) angle = 0;
            else*/ angle = (countMaster1/nbMaster1)*Math.PI*2.0/3.0 + Math.PI/2.0;
            countMaster1++;
        }else if(d.parent == "master2"){
            /*if(nbMaster2 == 0) angle = 0;
            else*/ angle = (countMaster2/nbMaster2)*Math.PI*2.0/3.0 - Math.PI/6.0;
            countMaster2++;
        }
        // position
        var x = (r) * Math.cos(angle);
        var y = (r) * Math.sin(angle);
        if(d.id == id){ x=0; y=0;}
        console.log("x,y",x,y,r,angle);

        var node;
        if(previousState == State.VIZ_VIEW){
            var bb = d3.select("#"+d.id).node().getBoundingClientRect();
            node = clone("#"+d.id + " g");
            node.selectAll("g").remove();
            document.getElementById("obj-nodes").appendChild(node.node());
            node.attr("transform","translate(" + (bb.x + bb.width*0.5) + "," + (bb.y + bb.height*0.5)+ ")");
            node.attr("id",d.id);
            node.attr("class","g-objects")
        } else if(previousState == State.OBJ_VIEW){
            // if node is already here.. do nothing..
            node = d3.select("#obj-nodes").select("#"+d.id);
            if(node.node() == null){ 
                console.log("not found")
                node = d3.select("#obj-nodes").append("g").attr("id",d.id);
                var circle = node.append("circle").attr("r",radiusObject).attr("fill",master.color).attr("opacity",defaultObjectOpacity);
                if(d.id.startsWith("key")) {

                }else if(d.id.startsWith("sub")) {
                    circle.attr("fill","none")  
                    .style("stroke",master.color)
                    .style("stroke-width",7);
                }else{
                    circle.attr("fill", function(d, i) { return "url(#grad" + i + ")"; });
                }
                
                node.append("text");
                node.attr("transform",'translate('+ (xCenterObjView+x) + ',' + (yCenterObjView+y) + ')');
            }
        }

        

        node.on("mouseenter",function(d){
            //console.log("### mouseenter");
            d3.select(this).style("cursor", "pointer");
            showLabelOnHover(true,this);
          })    
          .on("mouseleave",function(d){
            //console.log("### mouseleave");
            d3.select(this).style("cursor", "default");
            showLabelOnHover(false,this);
          })
          .on("click",function(d){
             startingSTARTOBJ = true;
             console.log("### mouseclick: reorganise objects... of id ",d3.select(this).attr("id"));
             startObj(d3.select(this).attr("id"));
          });

        var fontSize,xText,textLength,lineHeight,c;
        
        
        if(d.id.startsWith("key")) {
            fontSize = keywordFontSizeOBJ; 
            xText = 15 * scale; 
            textLength = keywordsTextLengthOBJ; 
            lineHeight = keywordsLineHeightOBJ;
            c = "black";
        }else if(d.id.startsWith("sub")) {
            fontSize = subFontSizeOBJ; 
            xText = 20 * scale; 
            textLength = subTextLengthOBJ; 
            lineHeight = subLineHeightOBJ;
            c = master.color;
        }else {
            fontSize = masterFontSizeOBJ; 
            xText = 20 * scale; 
            textLength = masterTextLengthOBJ; 
            lineHeight = masterLineHeightOBJ;
            c = master.color;
        }
        
        var t = dataLinks.find( function(data) { return data.id == d.id; }).name;

        node.transition()
                .duration(1000)     
                .attr("transform",'translate('+ (xCenterObjView+x) + ',' + (yCenterObjView+y) + ')');
                ;
        node.select("circle")
                .transition()
                .duration(1000)
                .attr("opacity",defaultObjectOpacity)
                .attr("r",radiusObject)
                ;
        node.select("text")
                .text(t)
                .attr("font-family","latoregular")
                .attr("text-anchor","start")
                .attr("x",xText)
                .attr("y",0)
                .style("alignment-baseline","middle")
                .attr("fill",c)
                .attr("opacity","0.0")
                .attr("font-size",fontSize)
               // .call(wrap,textLength,lineHeight)
                ;
    });

    d3.select("#svg").append("circle").attr("id","TODELETE").transition().duration(1000)
                     .on("end",function(d){
                         startingSTARTOBJ = false;
                         d3.select(this).remove();
                    });
 
    console.log("deleting viz");
    if(previousState == State.VIZ_VIEW){
        deleteVizNodes();
    }

    // show ui elements
    loadObjMenu(id,revueConnectedToObj);
    showObjMenu(true);
    toggleControllerDetails(true);
}

function createDashBackgroundCircles(){

    d3.select("#obj-nodes").append("circle")
        .attr("cx",xCenterObjView)
        .attr("cy",yCenterObjView)
        .attr("r",firstRadius)
        .attr("fill","none")
        .attr("stroke","black")
        .attr("opacity",radiusOpacity)
        .attr("stroke-dasharray",dasharrayNB)
        ;
    d3.select("#obj-nodes").append("circle")
        .attr("cx",xCenterObjView)
        .attr("cy",yCenterObjView)
        .attr("r",secondRadius)
        .attr("fill","none")
        .attr("stroke","black")
        .attr("opacity",radiusOpacity)
        .attr("stroke-dasharray",dasharrayNB)
        ;
    d3.select("#obj-nodes").append("circle")
        .attr("cx",xCenterObjView)
        .attr("cy",yCenterObjView)
        .attr("r",thirdRadius)
        .attr("fill","none")
        .attr("stroke","black")
        .attr("opacity",radiusOpacity)
        .attr("stroke-dasharray",dasharrayNB)
        ;

}






function startDetail(revueId){
    console.log("--> startDetail",revueId);
    if(state == State.DETAIL_VIEW) return;

    currentRevueId = revueId;

    previousState = state;
    state = State.DETAIL_VIEW;

    if(previousState == State.VIZ_VIEW){
        loadAllRevuePoly();

    }

    // hide ui elements
    if(previousState == State.OBJ_VIEW){
        showObjMenu(false);
    }else{
        showMenu(false);
    }

    // show/hide/morph graphic elements
    var revue = allRevuePoly.filter( function(d) { return d.id == ("poly" + revueId); })[0];
    var box = getBox(revue.coords);
    var trans = [xCenterDetailView-box.cx,yCenterDetailView-box.cy];

    if(previousState == State.OBJ_VIEW){
        cloneObjectLinkedToDetail(revueId,trans);
    } else {
        createObjectLinkedToDetail(revueId);
    }

    if(previousState == State.VIZ_VIEW){
        morphPolyToPolyDetail(revueId,500,trans);
        d3.select("#detail-obj-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        d3.select("#text-detail-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        //d3.select("#morph" + revueId).attr("fill","black");
        updatePolyPos = false;
        popupObjectLinked(500,300);
        makeNodeDisappear(500);
        animAlpha.start(1.0,0.0,0.5);
        d3.selectAll(".back-btn").html("Fields");

    } else if(previousState == State.GEO_VIEW){
        morphTriGeoToPolyDetail(revueId,500,trans);
        d3.select("#detail-obj-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        d3.select("#text-detail-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        popupObjectLinked(500,300);
        hideAndDeleteMap(800);
        //hideMap(800);
        fadeAndDeleteTriangles(800);
        d3.selectAll(".back-btn").html("Geographic");

    } else if(previousState == State.TIMELINE_VIEW){
        morphRectToPolyDetail(revueId,500,trans);
        d3.select("#detail-obj-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        d3.select("#text-detail-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        popupObjectLinked(500,300);
        makeTimelineDisappear(0);
        d3.selectAll(".back-btn").html("Chronologic");
    } else if(previousState == State.OBJ_VIEW){
        // TODO
        morphObjToDetail(currentRevueId,trans);
        //d3.select("#detail-obj-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        //popupObjectLinked(500,300);
        hideAndDeleteObjView(500);
        d3.selectAll(".back-btn").html("Fields");

    }

    // show ui elements
    loadDetailRevue(revueId);
    showRevueDetail(true);

    toggleControllerDetails(true);

}

function cloneObjectLinkedToDetail(revueId,trans){
    var revue = dataRevue.find(d => d.id == revueId);
    var poly = allRevuePoly.find(data => data.id == "poly" + revueId);
    //console.log("revue",revue);
    d3.select("#detail-nodes").append("g").attr("id","detail-obj-nodes");
    revue.links.forEach(function(d,i){
        var node = clone("#"+d);
        var circle = node.select("circle");
        var bb = circle.node().getBoundingClientRect();
        circle.attr("id",d);
        circle.attr("cx",bb.x+bb.width*0.5);
        circle.attr("cy",bb.y+bb.height*0.5);
        var text = node.select("text");
        text.attr("opacity",1.0);
        //var g = d3.select("#detail-obj-nodes").append("g").attr("id","detail-obj-" + d);
        //var parent = document.getElementById("detail-obj-"+d);
        var parent = document.getElementById("detail-obj-nodes");
        parent.appendChild(circle.node());
        //parent.appendChild(text.node());
    })

    for(var i=0; i<revue.links.length; i++){
        var id = revue.links[i];
        var coord = poly.coords.find(data => data.link == id).coord;
        var node = d3.select("#detail-obj-nodes").select("#"+id);
        node.transition()
            .duration(800)
            .attr("cx",coord[0]+trans[0])
            .attr("cy",coord[1]+trans[1])
            .on("end",function(d){
                var poly = d3.select("#morph"+revueId);
                poly.attr("fill","black");
                poly.attr("opacity",1.0);
            })
            ;
    }

}


function createObjectLinkedToDetail(revueId){
    var revue = dataRevue.find(d => d.id == revueId);
    //console.log("searching for " + "poly" + revueId);
    var poly = allRevuePoly.find(data => data.id == "poly" + revueId);
    //console.log("poly",poly);
    d3.select("#detail-nodes").append("g").attr("id","detail-obj-nodes");
    poly.coords.forEach(function(d,i){
        var label = dataLinks.find(data => data.id == d.link).name;
        var parent = dataLinks.find(data => data.id == d.link).parent;
        var color = masterNodes.find(data => data.id == parent).color;
        //console.log("LABEL/parent",label,parent,color);
        if(d.link.startsWith("master")){
            //console.log("create master node at ",d.coord);
            createMasterNode(d.link,d.coord,label,color);
        }else if(d.link.startsWith("sub")){
            //console.log("create sub node at ",d.coord);
            createSubNode(d.link,d.coord,label,color);
        }else if(d.link.startsWith("key")){
            //console.log("create key node at ",d.coord);
            createKeyNode(d.link,d.coord,label,color);
        }
    });
}

function popupObjectLinked(duration,delay){
    d3.selectAll("#detail-obj-nodes").selectAll("circle")
            .transition()
            .delay(function(d,i){
                var d = delay + i*100;
                return d;
            })
            .duration(duration)
            .on("start",function(d){
                d3.select(this).attr("opacity",0.0);
            })
            .attr("opacity",1.0)
            ;
}

function hideObjectLinked(duration){
    console.log("hideOjbectlinked");
    d3.selectAll("#detail-obj-nodes").selectAll("circle")
            .transition()
            .duration(duration)
            .attr("opacity",0.0)
            .on("end",function(d){
                d3.selectAll("#detail-obj-nodes").remove();
            })
            ;
}

// ********** OBJ that are drawned on the detail revue view *******************
// TO CHECK: ALEX.. tu peux changer les radius et etc.. directement ici
function createMasterNode(id,coord,label,color){
    var i = id.substring(id.length-2,id.length-1);
    d3.select("#detail-nodes").select("#detail-obj-nodes").append("circle")
            .attr("id",id)
            .attr("cx",coord[0])
            .attr("cy",coord[1])
            // .attr("opacity",1.0) // ME DEMDANDER SI TU VEUX Y TOUCHER
            .attr("opacity",0.0)
            .attr("fill", function(d, i) { return "url(#grad" + i + ")"; })
            .attr("r",30)
            ;
}

// TO CHECK: ALEX.. tu peux changer les radius et etc.. directement ici
function createSubNode(id,coord,label,color){
    var g = d3.select("#detail-nodes").select("#detail-obj-nodes").append("g").attr("id",id);
    g.attr("transform",'translate('+ coord[0] + ',' + coord[1] + ')');
    g.append("circle")
        .attr("opacity",0.0)
        .attr("fill","none")  
        .style("stroke",color)
        .style("stroke-width",7)
        .attr("r",10)
        ;
    
    d3.select("#text-detail-nodes")
        .append("text")
        .text(label)
        .attr("id","detail-obj-text"+id)
        .attr("font-family","latohairline")
        .style("fill",color)
        .attr("text-anchor","middle")
        .attr("x",coord[0])
        .attr("y",coord[1]-20)
        ;
}

// TO CHECK: ALEX.. tu peux changer les radius et etc.. directement ici
function createKeyNode(id,coord,label,color){
    var g = d3.select("#detail-nodes").select("#detail-obj-nodes").append("g").attr("id",id);
    g.attr("transform",'translate('+ coord[0] + ',' + coord[1] + ')');
    g.append("circle")
            .attr("id",id)
            .attr("opacity",0.0)
            .attr("fill",color)  
            .attr("r",9)
            ;
    /*
    g.append("text")
            .text(label)
            .attr("font-family","latohairline")
            .style("color","gray")
            .attr("text-anchor","middle")
            .attr("x",0)
            .attr("y",-18)
            ;*/
    d3.select("#text-detail-nodes")
            .append("text")
            .text(label)
            .attr("id","detail-obj-text"+id)
            .attr("font-family","latohairline")
            .style("fill","white")
            .attr("text-anchor","middle")
            .attr("x",coord[0])
            .attr("y",coord[1]-18)
            ;
}

function hideAndDeleteObjView(duration){    
    d3.select("#obj-nodes").selectAll("circle")
            .transition()
            .duration(duration)
            .attr("opacity",0.0)
            .on("end",function(d){
               d3.select("#obj-nodes").selectAll("*").remove();
            })

}

function showMenu(show){
    if(show){
        d3.select("#menu").style("visibility", "visible");
    }else{
        d3.select("#menu").style("visibility", "hidden");
    }
}

function showRevueDetail(show){
    if(show){
        d3.select("#menudetail").style("visibility", "visible");
    }else{
        d3.select("#menudetail").style("visibility", "hidden");
    }
}

function showObjMenu(show){
    if(show){
        d3.select("#objview").style("visibility", "visible");
    }else{
        d3.select("#objview").style("visibility", "hidden");
    }
}

function showFormular(show){

}


// TODO: to check if when using fill=none -> performance get better or not.. little trick for now.
function showLabelOnHover(show,obj){
    var id = d3.select(obj).attr("id");
    showLabel(show,id);
}

function showLabel(show,id){
    if(show){
        if(id.startsWith("key"))
        {
            d3.select("#"+id).select("text").attr("fill","black");
            d3.select("#"+id).select("text").attr("opacity","1.0");
        } else {
            d3.select("#"+id).select("text").attr("opacity","1.0");
        }
    }else{
        if(id.startsWith("key"))
        {
            d3.select("#"+id).select("text").attr("fill","none");
            d3.select("#"+id).select("text").attr("opacity","0.0");
            
        }else{
            d3.select("#"+id).select("text").attr("opacity","0.0");
        } 
    }
}


function goingBack(){
    if(state == State.DETAIL_VIEW){
        toggleControllerDetails(false);
        if(previousState == State.VIZ_VIEW) {
            startViz(); 
        }
        else if(previousState == State.GEO_VIEW) {
            startGeo(); 
        }
        else if(previousState == State.TIMELINE_VIEW) {
            startTimeline(); 
        }
        else if(previousState == State.OBJ_VIEW) {
            startViz(); 
        }
    }else if(state == State.OBJ_VIEW){
        {
            startViz(); 
            toggleControllerDetails(false);

        }
    }


}


function morphDetailToViz(revueId){
    loadAllRevuePoly();
    var revuePoly = allRevuePoly.find(data => data.id == "poly" + revueId);
    var mPath = d3.select("#morph" + revueId);
    
    mPath.transition()
        .duration(800)
        .attr("transform","translate("+ 0 + "," + 0 + ")")
        .attr("d",revuePoly.data)
        .attr("stroke-opacity",0.1)
        .on("start",function(d){
            d3.select(this).attr("fill","none");
            d3.select(this).attr("stroke","black");
            d3.select(this).attr("stroke-opacity",0.5);
        })
        .on("end",function(d){
            //d3.select(this).attr("fill","none");
            //d3.select(this).attr("stroke-opacity",0.0);
            d3.selectAll(".morphopolyDETAIL").remove();
            startAnimNodes();
        })
        ;
}

function morphPolyToPolyDetail(revueId,duration,trans){
    var mPath = d3.select("#showPoly" + revueId)
                  .attr("id","morph" + revueId)
                  .attr("class","morphopolyDETAIL");
    mPath.transition()
        .duration(duration)
        .attr("fill","black")
        .attr("opacity",1.0)
        .attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        ;
}

function morphTriGeoToPolyDetail(revueId,duration,trans){
    var revue = allRevuePoly.filter( function(d) { return d.id == ("poly" + revueId); })[0];
    //console.log("revue",revue);
    var mPath = d3.select("#morph" + revueId).attr("class","morphopolyDETAIL");
    //console.log("id","morph"+id);
    mPath.transition()
        .duration(duration)
        .attr("fill","black")
        .attr("opacity",1.0)
        .attr("d",revue.data)
        .attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        ;
}

function morphRectToPolyDetail(revueId,duration,trans){

    var revue = allRevuePoly.filter( function(d) { return d.id == ("poly" + revueId); })[0];
    console.log("revue",revue);

    // get Rectangle
    var revueRect = d3.select("#timeline" + revueId); 
    if(revueRect.node() == null){
        console.log("DEBUG: revuerect with ID #timeline" + revueId + " could not be FOUND");
        return;
    }

    var bb = revueRect.node().getBoundingClientRect();
    var x = bb.x + bb.width*0.5;
    var y = bb.y + bb.height*0.5;
    var offset = [bb.x,bb.y];
    var revuePoly = allRevuePoly.find(data => data.id == "poly" + revueId);
    var dRect = getRectanglePath(revuePoly.nb,bb.width,barHeight,offset);

    // create path
    var mPath = d3.select("#timeline").append("path")
        .attr("id","morph"+revueId)
        .attr("class","morphopolyDETAIL")
        .attr("fill","none")
        .attr("stroke","black")
        .attr("stroke-opacity",0.4) //0.03
        .attr("d",dRect)
        .attr('pointer-events', 'visibleStroke')
        .style("z-index",10)
        ;

    // start MORPHING
    mPath.transition()
        .duration(duration)
        .attr("fill","black")
        .attr("opacity",1.0)
        .attr("d",revue.data)
        .attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        ;

}

function morphObjToDetail(revueId,trans){
    var revuePoly = allRevuePoly.find(data => data.id == "poly" + revueId);

    // create polygone
    var revue = dataRevue.filter( function(d) { return d.id == revueId; })[0];

    var mPath = svg.append("path")
        .attr("id","morph"+revueId)   
        .attr("class","morphopolyDETAIL")
        .attr("fill","none")
        .attr("opacity",0.0)
        .attr("d",revuePoly.data)
        .attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        ;

}

function morphDetailToRect(revueId){

    var mPath = d3.select(".morphopolyDETAIL");

    var revuePoly = allRevuePoly.find(data => data.id == "poly" + revueId);

    // get Rectangle
    var revueRect = d3.select("#timeline" + revueId); 
    if(revueRect.node() == null){
        console.log("DEBUG: revuerect with ID #timeline" + revueId + " could not be FOUND");
        return;
    }
    var bb = revueRect.node().getBoundingClientRect();
    var x = bb.x + bb.width*0.5;
    var y = bb.y + bb.height*0.5;
    var offset = [bb.x,bb.y];
    var dRect = getRectanglePath(revuePoly.nb,bb.width,barHeight,offset);

    // MORPHING
    mPath.transition()
        .duration(800)
        .attr("d",dRect)
        .ease(d3.easeQuad)
        .on("start",function(){
            d3.select(this).attr("stroke","none");
        })
        .attr("fill",barColor)
        //.attr("fill","black")
        .attr("transform","translate("+ 0 + "," + 0 + ")")
        .on("end",function(){
            d3.select(this).remove();
        })
        ;

}


function morphPolyDetailToTriGeo(revueId){


    var p = d3.select(".morphopolyDETAIL");
    p.attr("fill","none").attr("stroke-opacity",0.0);
    var mPath = d3.selectAll("#morph" + revueId + ".morphPolyDetailToTriGeo");
    var dTri = mPath.attr("d");
    mPath.attr("d",p.attr("d"))
        .attr("transform",p.attr("transform"))
        .attr("opacity",1.0)
        .attr("fill","black")
        ;

        
    mPath.transition()
        .duration(500)
        .attr("transform","translate("+ 0 + "," + 0 + ")")
        .attr("d",dTri)
        .on("end",function(d){
            d3.select(this).attr("class","morphopoly");
            d3.selectAll(".morphopolyDETAIL").remove();
        })
        ;      

}

function deleteVizNodes(){
    d3.select("#nodes").selectAll("*").remove();
}

function createMenu(){
    // order revues according to letter - or we do that in DB sql
    var previousLetter = "Z";
    dataRevue.sort(function (a,b) {return d3.ascending(a.name, b.name);});
    dataRevue.forEach(function(d,i){
        var letter = d.name.charAt(0).toUpperCase();
        if(letter != previousLetter){
            d3.select("#menulist")
                    .append("li")
                    // .append("h3")
                    .attr("class","letter")
                    .html(letter);
        }
        d3.select("#menulist")
                .append("li")
                //.on("mouseover",function(){console.log("mouseover",d.id);showRevue(true,d.id);})
                .on("mouseenter",function(){/*console.log("### mouseenter",d.id);*/showRevueOnMap(true,d.id);})
                //.on("mouseout",function(){console.log("mouseout",d.id);showRevue(false,d.id);})
                .on("mouseleave",function(){/*console.log("### mouseleave",d.id);*/showRevueOnMap(false,d.id);})
                .on("click",function(){/*console.log("### mouseclick",d.id);*/startDetail(d.id);})
                .append("h3")
                .attr("class","revue-title")
                .html(d.name);
        previousLetter = letter;
    });

    // Search engine
    var hackerList = new List('menu', options);
}

/*
<div class="polygone"></div>
<div class="col-right">
    <h3>Titre de la revue</h3>
    <div class="keywords">
        <a href="#">Keyword, </a>
        <a href="#">Keyword, </a>
    </div>	
</div>
*/
function loadObjMenu(id,revueConnectedToObj){

   // console.log("--> loadObjMenu",revueConnectedToObj);

    var div = d3.select("#objview");
    var idName = dataLinks.filter(function(d){return d.id == id})[0].name;
    div.select("#objname").html(idName);
    div.select("ul").remove();
    var li = div.append("ul").selectAll("li")
            // .data(fakeObjLinks)
            .data(revueConnectedToObj)
            .enter()
            .append("li")
            .attr("id",d => "thumbnail"+d.id)
            .on("mouseenter",function(d){/*console.log("### mouseenter",d);*/showObjOnMap(true,d.id);})
            .on("mouseleave",function(d){/*console.log("### mouseleave",d);*/showObjOnMap(false,d.id);})
            .on("click",function(d){/*console.log("### mouseclick",d);*/startDetail(d.id);})
            ;

     //console.log("COUCOU rrevueConnectedToObjec",revueConnectedToObj);
     for(var i=0; i<revueConnectedToObj.length;i++){
        var revueId = revueConnectedToObj[i].id;
        //console.log("revue",revueConnectedToObj[i]);
        var revuePoly = allRevuePoly.find(data => data.id == "poly" + revueId);
        //console.log("revuePoly",revuePoly);
        var coords = revuePoly.coords;
        var newCoords = scaleCoords(coords,75);
        var data = "M" + newCoords.join("L") + "Z";
        var svgPoly = d3.select("#thumbnail" + revueId)
                        .append("div").attr("class","polygone")
                        .append("svg")
                        .attr("width",75)
                        .attr("height",75)
                        .attr("x",0)
                        .attr("y",0);
        svgPoly.append("rect")
            .attr("width",75)
            .attr("height",75)
            .attr("fill","none")
            ;
        svgPoly.append("path")
                .attr("d",data)
                .attr("fill","black")
                ;
     }
    
    var div = li.append("div").attr("class","col-right");            
    div.append("h3").html(d => d.name);
  
}


function showObjOnMap(show,id){
    //console.log("--> showObjOnMap",show,id);
    var revue = dataRevue.filter( function(d) { return d.id == id; })[0];
    //console.log("found revue",revue);

    if(show){
        var allObjs = d3.selectAll("#obj-nodes g");
        allObjs.select("circle").attr("opacity",minObjectOpacity);
    }

    var uniqueLinks = getArrayWithUniqueElem(revue.links);
    uniqueLinks.forEach(function(d,i){
        //console.log("getting obj with",d,d3.select("#"+d).node());
        if(show){

            d3.select("#"+d).select("circle")
                            .attr("opacity",maxObjectOpacity)
                            ;
            d3.select("#"+d).select("text")
                            .attr("opacity",1.0)
                            ;
        } else {
            d3.select("#"+d).select("circle")
                            .attr("opacity",defaultObjectOpacity)  // Fait à double. Mais on laisse pour l'instant. 
                            ;
            d3.select("#"+d).select("text")
                            .attr("opacity",0.0)
                            ;
        }
    });

    if(!show){
        var allObjs = d3.selectAll("#obj-nodes g");
        allObjs.select("circle").attr("opacity",defaultObjectOpacity);
    }
}

function showRevueOnMap(show,id){
    //console.log("--> showRevueOnMap",show,id);
    var revue = dataRevue.filter( function(d) { return d.id == id; })[0];
    currentRevueId = revue.id;
    currentNBLinks = revue.links.length;
    if(show){
        //console.log("--> showRevueOnMap",id);
        if(state == State.VIZ_VIEW){
            updatePolyPos = true;
        } else if(state == State.GEO_VIEW){
            // get triangle
            var triPath = d3.select("#morph" + id);
            var revuePoly = allRevuePoly.find(data => data.id == "poly" + revue.id);
            //console.log("revuePoly",revuePoly);
            var offset = projection(revue.locationCoords);
            var dTri = getTrianglePath(revuePoly.nb,triangleHightlighted,offset);
            var parent = document.getElementById("morph" + id).parentElement
            var node = clone("#morph"+id);
            node.attr("fill","white")
                    .attr("d",dTri)
                    .attr("opacity",1.0);
            d3.select("#morph" + id).remove();
            parent.appendChild(node.node());
        } else if(state == State.TIMELINE_VIEW){
            var node = d3.select("#timeline" + id)
                        .attr("fill","black")
                        ;
        }
    } else {
        //console.log("--> hideRevueOnMap",id);
        if(state == State.VIZ_VIEW){
            updatePolyPos = false;
            d3.select("#showPoly"+id).remove();
        } else if(state == State.GEO_VIEW){
            var triPath = d3.select("#morph" + id);
            var offset = projection(revue.locationCoords);
            var revuePoly = allRevuePoly.find(data => data.id == "poly" + revue.id);
            var dTri = getTrianglePath(revuePoly.nb,triangleEdgeLength,offset);
            triPath.attr("d",dTri)
                    .attr("fill","black")
                    .attr("opacity",triangleDefaultOpacity)
                    ;
        } else if(state == State.TIMELINE_VIEW){
            var node = d3.select("#timeline" + id)
                .attr("fill",barColor)
                ;
            ;
        }
    }
}



function loadDetailRevue(id){

    updatePolyPos = false;

    var revue = dataRevue.filter( function(d) { return d.id == id; })[0];
    var sel = d3.select("#menudetail");
    sel.style("visibility", "visible");
    sel.select("#menudetail-title").html(revue.name);
    sel.select("#menudetail-location").html("nouveau location");
    sel.select("#menudetail-date").html("nouveau date");
    sel.select("#menudetail-texte").html(fakeText);
    
    // TODO: bug.. does not work..
    var keys = sel.select("menudetail-keywords").remove();
    //console.log("keys",keys);
    /*
    sel.select("menudetail-keywords").selectAll("a")
                    .data(revue.links)
                    .enter()
                    .append("a")//.remove();
                    .html(function(d){return d;})
                    ;*/

}

function updateUI(){
    if(updatePolyPos){
        d3.select("#showPoly"+currentRevueId).remove();
        var revue = dataRevue.filter( function(d) { return d.id == currentRevueId; })[0];
        var coords = [];
        revue.links.forEach( function(l,i){
            //console.log("link",l);
            var bb = d3.select("#" + l).select("g").select("circle").node().getBoundingClientRect();
            var x = bb.x + bb.width*0.5;
            var y = bb.y + bb.height*0.5;
            coords.push([x,y]);
        });
        var dPoly = "M" + coords.join("L") + "Z";
        var p = svg.append("path")
            .attr("id","showPoly"+currentRevueId)   
            .attr("class","showPoly")
            .attr("fill","none")
            .attr("stroke","black")
            .attr("fill","black")
            .attr("opacity",1.0)
            .attr("d",dPoly)
            ;
    }
}


// Search input
var options = {
    valueNames: [ 'revue-title' ]
};





function changeRadius(enter){
    if(enter) svg.select("#blup").attr("r",50);
    else svg.select("#blup").attr("r",20);

}
function changeColor(enter){
    if(enter) svg.select("#blup").attr("stroke-width","4px");
    else svg.select("#blup").attr("stroke-width","1px");
}
// Display Form

var addBTN = document.getElementById("add-journal");
var layerClose = document.getElementsByClassName("layer-close")[0];
var form =  document.getElementsByClassName("add-revue-form")[0];
var open = false;

layerClose.addEventListener("click", function(){
    showFormRevue(false);
});

addBTN.addEventListener("click", function(){

    if(open){
        showFormRevue(false); 
    }else{
        showFormRevue(true);

    }
	
});




function showFormRevue(show){
    if(show){
        form.className = "add-revue-form active"; 
        layerClose.className = "layer-close active"; 
        open = true;
    }else{
        form.className = "add-revue-form";  
        layerClose.className = "layer-close";
        open = false;
    }
}


