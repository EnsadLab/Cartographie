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

    d3.select("#svg").on("click", function() {
        //console.log("CLICK");
        if(state == State.DETAIL_VIEW || (state == State.OBJ_VIEW && !startingSTARTOBJ)){
            goingBack();
        }
    });
}


function startGeo(){
    if(state == State.GEO_VIEW) return; // TODO: TO ASK ALEX

    previousState = state;
    state = State.GEO_VIEW;
    if(state != previousState){
        initGeoMap(); // will show it as well
    }

    if(previousState == State.VIZ_VIEW){
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
    if(state == State.VIZ_VIEW) return; // TODO: TO ASK ALEX

    previousState = state;
    state = State.VIZ_VIEW;
    console.log("state",getName(state),getName(previousState));

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
    if(state == State.TIMELINE_VIEW) return; // TODO: TO ASK ALEX

    previousState = state;
    state = State.TIMELINE_VIEW;

    initTimeline();
    if(previousState == State.VIZ_VIEW){
        startTransitionVizTimeline();
    } else if(previousState == State.GEO_VIEW){
        startTransitionGeoTimeline();
    }else if(previousState == State.DETAIL_VIEW){
        showRevueDetail(false);
        showMenu(true);
        showRevueRectangles();
        morphDetailToRect(currentRevueId);
        hideObjectLinked(300);
    }else if(previousState == State.OBJ_VIEW){
        hideAndDeleteObjView(500);
        showRevueRectangles();
        showObjMenu(false);
        showMenu(true);
    }
}


function startObj(id){
    if(state == State.OBJ_VIEW) return;
    console.log("--> startObj",id);
    startingSTARTOBJ = true;
    previousState = state;
    state = State.OBJ_VIEW;

    // we know we come from VIZ_VIEW
    // hide ui elements
    showMenu(false);

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
  
    var uniqueLinks = getArrayWithUniqueElemAndKey(result);
    //console.log("result",result);
    //console.log("uniqueLinks",uniqueLinks);
    createDashBackgroundCircles();
    var nbLinks = uniqueLinks.length;
    var min = uniqueLinks.find( d => d.id == "DATA_MIN").nb;
    var max = uniqueLinks.find( d => d.id == "DATA_MAX").nb;
    var max2 = uniqueLinks.find( d => d.id == "DATA_SECOND_MAX").nb;
    var nbMaster0 = uniqueLinks.filter( d => d.parent == "master0").length;
    var nbMaster1 = uniqueLinks.filter( d => d.parent == "master1").length;
    var nbMaster2 = uniqueLinks.filter( d => d.parent == "master2").length;
    var countMaster0 = 0; var countMaster1 = 0; var countMaster2 = 0;
    //console.log("MIN/MAX",min,max,max2);
    uniqueLinks.forEach(function(d,i){
        if(d.id.startsWith("DATA")) return;
        var bb = d3.select("#"+d.id).node().getBoundingClientRect();
        var node = clone("#"+d.id + " g");
        node.selectAll("g").remove();
        document.getElementById("obj-nodes").appendChild(node.node());
        node.attr("transform","translate(" + (bb.x + bb.width*0.5) + "," + (bb.y + bb.height*0.5)+ ")");
        node.attr("id",d.id);

        var r = mapValue(d.nb,max,min,rMinObject,rMaxObject);
        //var r = mapValue(d.nb,max2,min,rMinObject,rMaxObject);
        //r = rMaxObject - Math.floor((d.nb-min)/4) * rMinObject;
        //console.log("!!!",d.nb,min,max,Math.floor((d.nb-min)/4),r);
        var angle;
        if(d.parent == "master0"){
            // angle = Math.random()*Math.PI*2.0/3.0 + 7.0*Math.PI/6.0;
            angle = (countMaster0/nbMaster0)*Math.PI*2.0/3.0 + 7.0*Math.PI/6.0;
            countMaster0++;
        }else if(d.parent == "master1"){
            angle = (countMaster1/nbMaster1)*Math.PI*2.0/3.0 + Math.PI/2.0;
            countMaster1++;
        }else if(d.parent == "master2"){
            angle = (countMaster2/nbMaster2)*Math.PI*2.0/3.0 - Math.PI/6.0;
            countMaster2++;
        }

        var x = (r) * Math.cos(angle);
        var y = (r) * Math.sin(angle);

        if(d.id == id){
            x=0; y=0;
        }

        node.on("mouseenter",function(d){
            console.log("### mouseenter");
            d3.select(this).style("cursor", "pointer");
            showLabelOnHover(true,this);
          })    
          .on("mouseleave",function(d){
            console.log("### mouseleave");
            d3.select(this).style("cursor", "default");
            showLabelOnHover(false,this);
          })
          .on("click",function(d){
            // DO NOTHING FOR NOW..
            //console.log("### mouseclick");
          });

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
                .attr("font-family","latoregular")
                .attr("text-anchor","start")
                .attr("x",function(){
                    if(d3.select(this).attr("font-size") == 8){ // trick for now
                        return 15;
                    }else{
                        return 20;
                    }
                })
                .style("alignment-baseline","middle")
                .attr("fill",function(){

                    if(d3.select(this).attr("fill") == "white"){
                        return "black";
                    }else {
                        if(d3.select(this).attr("font-size") == 8){ // trick for now
                            return "black";
                        } else
                            return d3.select(this).attr("fill");
                    }
                })
                .attr("opacity","0.0")
                .attr("font-size",function(){
                    if(d3.select(this).attr("font-size") == 8){ // trick for now
                        return 10;
                    }else{
                        return 12;
                    }
                });
                ;
    });

    d3.select("#svg").append("circle").transition().duration(1000).on("end",function(d){startingSTARTOBJ = false;});
 
    console.log("deleting viz");
    deleteVizNodes();

    // show ui elements
    loadObjMenu(id,revueConnectedToObj);
    showObjMenu(true);
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
        //d3.select("#morph" + revueId).attr("fill","black");
        updatePolyPos = false;
        popupObjectLinked(500,300);
        makeNodeDisappear(500);
        animAlpha.start(1.0,0.0,0.5);
    } else if(previousState == State.GEO_VIEW){
        morphTriGeoToPolyDetail(revueId,500,trans);
        d3.select("#detail-obj-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        popupObjectLinked(500,300);
        //hideAndDeleteMap(800);
        hideMap(800);
        fadeAndDeleteTriangles(800);
    } else if(previousState == State.TIMELINE_VIEW){
        morphRectToPolyDetail(revueId,500,trans);
        d3.select("#detail-obj-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        popupObjectLinked(500,300);
        hideTimeline();
    } else if(previousState == State.OBJ_VIEW){
        // TODO
        morphObjToDetail(currentRevueId,trans);
        //d3.select("#detail-obj-nodes").attr("transform","translate("+ trans[0] + "," + trans[1] + ")");
        //popupObjectLinked(500,300);
        hideAndDeleteObjView(500);
    }

    // show ui elements
    loadDetailRevue(revueId);
    showRevueDetail(true);
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
        var parent = document.getElementById("detail-obj-nodes");
        parent.appendChild(circle.node());
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
    d3.select("#detail-nodes").select("#detail-obj-nodes").append("circle")
            .attr("id",id)
            .attr("cx",coord[0])
            .attr("cy",coord[1])
            // .attr("opacity",0.3) // ME DEMDANDER SI TU VEUX Y TOUCHER
            .attr("opacity",0.0)
            .attr("fill","none")  
            .style("stroke",color)
            .style("stroke-width",7)
            .attr("r",10)
            ;
}

// TO CHECK: ALEX.. tu peux changer les radius et etc.. directement ici
function createKeyNode(id,coord,label,color){
    d3.select("#detail-nodes").select("#detail-obj-nodes").append("circle")
            .attr("id",id)
            .attr("cx",coord[0])
            .attr("cy",coord[1])
            // .attr("opacity",0.6) // ME DEMDANDER SI TU VEUX Y TOUCHER
            .attr("opacity",0.0)
            .attr("fill",color)  
            .attr("r",9)
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
        if(id.startsWith("sub"))
        {
            d3.select("#"+id).select("text").attr("opacity","1.0");
        } else {
            d3.select("#"+id).select("text").attr("fill","black");
            d3.select("#"+id).select("text").attr("opacity","1.0");
        }
    }else{
        if(id.startsWith("sub"))
        {
            d3.select("#"+id).select("text").attr("opacity","0.0");
        }else{
            d3.select("#"+id).select("text").attr("fill","none");
            d3.select("#"+id).select("text").attr("opacity","0.0");
        }
        
    }
}


function goingBack(){
    if(state == State.DETAIL_VIEW){
        if(previousState == State.VIZ_VIEW) startViz();
        else if(previousState == State.GEO_VIEW) startGeo();
        else if(previousState == State.TIMELINE_VIEW) startTimeline();
        else if(previousState == State.OBJ_VIEW) startViz();
    }else if(state == State.OBJ_VIEW){
        startViz();
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
                    .append("h3")
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

var hackerList = new List('menu', options);



function changeRadius(enter){
    if(enter) svg.select("#blup").attr("r",50);
    else svg.select("#blup").attr("r",20);

}
function changeColor(enter){
    if(enter) svg.select("#blup").attr("stroke-width","4px");
    else svg.select("#blup").attr("stroke-width","1px");
}
// Display Form

var addBTN = document.getElementById("add-journal")
var form =  document.getElementsByClassName("add-revue-form")[0];
var open = false


addBTN.addEventListener("click", function(){

	if(open === false){
		form.className = "add-revue-form active";	
		open = true;
	}else{
		form.className = "add-revue-form";	
		open = false;
	}
	
})


