// script that contains all necessary javascript code for all gui elements
// navigation bar, magazine menu on the right, detailed magazine view and etc..


d3.select("#geoView").on("click", function(){ startGeo();})
d3.select("#vizView").on("click", function(){ startViz();})
d3.select("#timelineView").on("click", function(){ startTimeline();}) 
d3.select("#DEBUGView").on("click", goingBack ) // A ENELEVER A LA FIN

var updatePolyPos = false;

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
    }
}

function startViz(){
    if(state == State.VIZ_VIEW) return;

    previousState = state;
    state = State.VIZ_VIEW;
    //console.log("state",state,previousState);

    vizdataLoaded = false;
    initVisualisation();
    
    showMenu(true);
    
    if(previousState == State.LOAD){
        vizdataLoaded = true;
        startAnimNodes();
        animAlpha.start(0,1.0,0.5);
    }
    else if(previousState == State.GEO_VIEW){
        startTransitionGeoViz();
        animAlpha.start(0,1.0,0.5);
        vizdataLoaded = true;
    } else if(previousState == State.OBJ_VIEW){
        // TODO
    } else if(previousState == State.DETAIL_VIEW){
        // TODO
    }
    
}

// TODO
function startTimeline(){
    if(state == State.TIMELINE_VIEW) return;

    previousState = state;
    state = State.TIMELINE_VIEW;

    initTimeline();
    if(previousState == State.VIZ_VIEW){
        startTransitionVizTimeline();
    }
}


function startObj(id){
    if(state == State.OBJ_VIEW) return;
    console.log("--> startObj",id);
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
    console.log("uniqueLinks",uniqueLinks);
    createDashBackgroundCircles();
    var nbLinks = uniqueLinks.length;
    var min = uniqueLinks.find( d => d.id == "DATA_MIN").nb;
    var max = uniqueLinks.find( d => d.id == "DATA_MAX").nb;
    var max2 = uniqueLinks.find( d => d.id == "DATA_SECOND_MAX").nb;
    var nbMaster0 = uniqueLinks.filter( d => d.parent == "master0").length;
    var nbMaster1 = uniqueLinks.filter( d => d.parent == "master1").length;
    var nbMaster2 = uniqueLinks.filter( d => d.parent == "master2").length;
    var countMaster0 = 0; var countMaster1 = 0; var countMaster2 = 0;
    console.log("MIN/MAX",min,max,max2);
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

    // hide ui elements
    if(previousState == State.OBJ_VIEW){
        showObjMenu(false);
    }else{
        showMenu(false);
    }

    // show/hide/morph graphic elements
    if(previousState == State.VIZ_VIEW){
        d3.select("#morph" + revueId)
                .attr("fill","black");
        //deleteVizNodes();
        makeNodeDisappear(500);
        animAlpha.start(1.0,0.0,0.5);
    } else if(previousState == State.GEO_VIEW){
        morphTriGeoToPolyDetail(revueId);
    }

    // show ui elements
    loadDetailRevue(revueId);
    showRevueDetail(true);
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

    if(!(state == State.DETAIL_VIEW || state == State.OBJ_VIEW)) return;

    if(previousState == State.VIZ_VIEW) vizdataLoaded = false;
    if(state == State.OBJ_VIEW && previousState == State.DETAIL_VIEW){
        previousState = state;
        state = State.VIZ_VIEW;
    }else{
        var temp = state;
        state = previousState;
        previousState = temp;
    }
    console.log("--> goingBack: coming from",getName(previousState),"and going to",getName(state));

    // hide ui elements
    if(previousState == State.DETAIL_VIEW){
        showRevueDetail(false);
    } else if(previousState == State.OBJ_VIEW){
        showObjMenu(false);
    }

    // show graphic elements
    if(state == State.VIZ_VIEW){

        vizdataLoaded = false;
        initVisualisation();

        if(previousState == State.DETAIL_VIEW){ // coming from detail view
            d3.select(".showPoly").remove();
            startAnimNodes();
        } else if(previousState == State.OBJ_VIEW){ // coming from obj view
            // for now, delete objects
            d3.select("#obj-nodes").selectAll("g").remove();
            startAnimNodes();
        }

        animAlpha.start(0,1.0,0.8);
        vizdataLoaded = true;
    } else if(state == State.GEO_VIEW){
        morphPolyDetailToTriGeo(currentRevueId);
    } else if(state == State.OBJ_VIEW){
        // TODO...
        // morph from detail view to obj menu view
    }

    // show ui elements
    if(state == State.VIZ_VIEW || state == State.GEO_VIEW){
        showMenu(true);
    }else if(state == State.OBJ_VIEW){
        showObjMenu(true);
    }

}

function morphTriGeoToPolyDetail(revueId){
    var revue = allRevuePoly.filter( function(d) { return d.id == ("poly" + revueId); })[0];
    //console.log("revue",revue);
    var mPath = d3.select("#morph" + revueId);
    //console.log("id","morph"+id);
    mPath.transition()
        .duration(500)
        .attr("fill","black")
        .attr("opacity",1.0)
        .attr("d",revue.data)
        ;
}


function morphPolyDetailToTriGeo(revueId){
    var revue = dataRevue.filter( function(d) { return d.id == revueId; })[0];
    var d = 10; // edge lenth du triangle
    var offset = [getRandomInt(200,1200),getRandomInt(200,600)]; // offset du triangle
    var dTri = getTrianglePath(revue.links.length,d,offset);

    var p = d3.select("#morph" + revueId);
    p.transition()
        .duration(300)
        .attr("d",dTri)
        .on("start",function(){
            //d3.select(this).attr("opacity","0.05");
        })
        //.attr("opacity",1.0)
        .on("end",function(){
            //  d3.select(this).attr("fill","black");
        })
        ;
}

function deleteVizNodes(){
    d3.select("#nodes").selectAll("*").remove();
   // d3.select("#master0").remove();
   // d3.select("#master1").remove();
   // d3.select("#master2").remove();
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
            .on("mouseenter",function(d){/*console.log("### mouseenter",d);*/showObjOnMap(true,d.id);})
            .on("mouseleave",function(d){/*console.log("### mouseleave",d);*/showObjOnMap(false,d.id);})
            .on("click",function(d){/*console.log("### mouseclick",d);*/startDetail(d.id);})
            ;

    //var divPoly = li.append("div").attr("class","polygone");
    var svgPoly = li.append("div").attr("class","polygone").append("svg")
        .attr("width",75)
        .attr("height",75)
        .attr("x",0)
        .attr("y",0)
        ;
        svgPoly.append("rect")
        .attr("width",150)
        .attr("height",150)
        .attr("fill","white")
        ;
    
    var div = li.append("div").attr("class","col-right");            
    div.append("h3").html(d => d.name);
  
}


function showObjOnMap(show,id){
    console.log("--> showObjOnMap",show,id);
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
            d3.select("#morph" + id)
                .attr("fill","none");
           // var node = clone("#morph"+d.id);
                //node.selectAll("g").remove();
           // document.getElementById("map-nodes").appendChild(node.node());
            //d3.select("#map-nodes #morph" + d.id).attr("fill","pink");
            var node = d3.select("#morph" + id);
            var newNode = d3.select("#map-nodes").append("circle")
                        .attr("cx",300)
                        .attr("cy",400)
                        .attr("id",node.attr("id"))
                        .attr("stroke","black")
                        .attr("fill","white")
                        .attr("r",20)
                        ;
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
            d3.select("#morph" + id)
                .attr("fill","black");
        } else if(state == State.TIMELINE_VIEW){
            var node = d3.select("#timeline" + id)
                .attr("fill",barColor)
                ;
            ;
        }
    }
}



function loadDetailRevue(id){
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



// TESTS
/*
  var g = svg.append("g")
    //.on("mouseover",function(){console.log("### mouseenter g",d.id);})
    //.on("mouseout",function(){console.log("### mouseout g",d.id);})
    //.on("click",function(){console.log("### mouseclick g",d.id);})
    .attr("stroke","red")
    .attr("stroke-width","2px")
    ;


    var circle = g.append("circle")
        .attr("cx",200)
        .attr("cy",200)
        .attr("r",20)
        .attr("id","blup")
        .attr("fill","none")
        .style("z-index","20")
        .on("mouseover",function(){console.log("### mouseover C");changeRadius(true);})
        .on("mouseenter",function(){console.log("??? mouseenter C");changeColor(true);})
        .on("mouseout",function(){console.log("### mouseout C");changeRadius(false);})
        .on("mouseleave",function(){console.log("??? mouseleave C");changeColor(false);})
        .on("click",function(){console.log("### mouseclick C");})
            ;
           
*/
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
