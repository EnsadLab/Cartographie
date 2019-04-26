
function countKeyWordChart(){
    var keywords = [];
    var allKeywords = [];
    var counts = {};

    $("circle").attr('r', 2);

    for (i in data) {
      var key = data[i].keywords;
      for(j in key){
        allKeywords.push(key[j]);
        if(keywords.includes(key[j])){
        }else{
          keywords.push(key[j]);
        }
      }
    }

    var counts = {};

    for (var i = 0; i < allKeywords.length; i++) {
      var num = allKeywords[i];
      counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    keywords.sort();

    for (var i = 0; i < keywords.length; i++) {
      // console.log(keywords[i]+" : "+counts[keywords[i]]);
      var txt = keywords[i];
      var nb = counts[keywords[i]];
      // console.log(txt, nb); 
      var txt = txt.replace(/[.*+?^${}()|& :/,[\]\\]/g, '');
      txt = txt.toLowerCase();  
      var element = $("#text_"+txt);
      // element.attr("font-size", (nb*fontScale)+5);
      var pY = element.attr("y");
      var pX = element.attr("dx");
      // element.attr("y", pY - (nb*fontScale)/2 );
      // element.attr("dx", pX - nb/2 );
      
      var circleElement = $("#"+txt);
      circleElement.attr("r", (nb*2)+2);
      circleElement.attr("stroke-width", nb+2);
      circleElement.attr("opacity", 10/(nb*2));
      // circleElement.attr("opacity", 0.4);
      // console.log( 10/(nb*10));
      parentsValues(txt, nb);
      // element.font({family:'Lato', size:nb*2 , anchor:'middle'});
      // console.log(element);
      // var text = draw.text(function(add) {
      // add.tspan(name).newLine().id("text_"+id).fill('#000').attr('y', y - (r/2)).dx(x - (r/2)).font({family:'Lato', size:10 , anchor:'middle'})
      // })

      // var div = document.createElement("div");
      // div.style.height = nb*10 + "px";
      // div.style.width = (80/keywords.length) + "%";
      // // div.style.fontSize = nb + "px";
      // div.className = "blob";
      // $("body").append(div);
      // $(".blob").eq(i).html("<p>"+txt+" = "+ nb+"</p>");
    }
  }


   // COUNT PARENTS VALUES
  var ArtDesign_val = 0;
  var Sciences_val = 0;
  var SciencesHumanities_val = 0;

  function parentsValues(word, nb){

    for (i in dataMAP) {    
      // MASTER CATEGORIES
      var MasterName = dataMAP[i].MasterCategory.name;
      // SUB CATEGORIES
      var subCategoryList = dataMAP[i].MasterCategory.subCategory;
      for (j in subCategoryList){
        var keywordsList = dataMAP[i].MasterCategory[subCategoryList[j]].AllKeywords;
        for (k in keywordsList){
            var txt = keywordsList[k].replace(/[.*+?^${}()|& :/,[\]\\]/g, '');
            txt = txt.toLowerCase();  
            if(word === txt){
              // console.log(word, txt);
              // console.log(MasterName);
              if(MasterName === "Art & Design"){
                  ArtDesign_val = ArtDesign_val + nb;
                  var circleElement = $("#artdesign");
                  circleElement.attr("r", (ArtDesign_val*4)+2);
                  // circleElement.attr("stroke-width", ArtDesign_val*4+2);
                  circleElement.attr("opacity", 0.5);
                  circleElement.attr("filter","url(#blur)");
              }

              if(MasterName === "Science"){
                  Sciences_val = Sciences_val + nb;
                  var circleElement = $("#science");
                  circleElement.attr("r", (Sciences_val*4)+2);
                  circleElement.attr("opacity", 0.5);
                  circleElement.attr("filter","url(#blur)");
                  // circleElement.attr("stroke-width", Sciences_val*4+2);
              }

              if(MasterName === "Sciences Social & Humanities"){
                  SciencesHumanities_val = SciencesHumanities_val +nb;
                  var circleElement = $("#sciencessocialhumanities");
                  circleElement.attr("r", (SciencesHumanities_val*4)+2);
                  circleElement.attr("opacity", 0.5);
                  circleElement.attr("filter","url(#blur)");
                  // circleElement.attr("stroke-width", SciencesHumanities_val*5+2);
              }
            }
        }
      }
    }
    // console.log(ArtDesign_val, Sciences_val, SciencesHumanities_val);
  }
  

  ////////////////////////////
  //////////////
  // MAP
  //////////////
  ////////////////////////////
  var draw;
  var scale = 2;
  var polygonOpacity = 1;
  var totalWidth = 1920 * scale;
  var totalHeight = 1080 * scale;

  var radius = 150 * scale;
  var radius_subCat = radius/2;
  var radius_key = radius/10;
  
  var width = (radius * 2);
  var height = (radius * 2);

  var positionMasterX = [50, 30, 70];
  var positionMasterY = [25, 60, 60];

  var fontScale = 2;

  var zoom;
  var svg;
  var locked;

  var ArtDesign_Color = "#00A3F5";

  var SS_Color = "#674890";
  var Science_Color = "#F8405E";


  function zoomed() {

      // var nx = d3.event.translate[0]*d3.event.scale;
      // var ny = d3.event.translate[1]*d3.event.scale;
      scale = d3.event.scale;
      var tx = Math.min(0, Math.max(d3.event.translate[0], totalWidth - totalWidth * scale));
      var ty = Math.min(0, Math.max(d3.event.translate[1] - totalHeight * scale));
      draw.attr("transform", "translate(" + d3.event.translate + ")scale(" + scale + ")");
      // draw.attr("transform", "translate("+tx+", "+ty+") scale(" + scale + ")");
    if(locked == true){

    }else{
        initOpacity();
    }
  }


  function init(){

    draw = SVG('drawing').size(totalWidth, totalHeight);
    $('#drawing').pep();
    var svg = d3.select("svg");
     zoom = d3.behavior.zoom()
    .translate([0,0])
       .scale(1)
    .scaleExtent([0.3, 8])
    .on("zoom", zoomed);

      svg.style("pointer-events", "all")
      .attr("width",  totalWidth)
    .attr("height", totalHeight)
    .call(zoom)
    .on("mousedown.zoom", null)
      .on("touchstart.zoom", null)
      .on("touchmove.zoom", null)
      .on("touchend.zoom", null);

      /*
    for (i in dataMAP) {
      // MASTER CATEGORIES
      var MasterName = dataMAP[i].MasterCategory.name;
      var MasterId = MasterName.replace(/[.*+?^${}()|& :/,[\]\\]/g, '');
      MasterId = MasterId.toLowerCase();  
      // console.log("• "+MasterName);
      var posX = (totalWidth*positionMasterX[i])/100;
      var posY = (totalHeight*positionMasterY[i])/100;
      // console.log(MasterName);

      if(MasterName === "Art & Design"){
        color = ArtDesign_Color;
        var gradient = draw.gradient('radial', function(stop) {
          stop.at(0, '#00A3F5')
          stop.at(1, 'RGBA(0, 163, 245, 0)')
        })
        color_sub = "#006393";
        color_key = "#003750";
      }

      if(MasterName === "Sciences Social & Humanities"){
        color = SS_Color;
        var gradient = draw.gradient('radial', function(stop) {
          stop.at(0, '#674890')
          stop.at(1, 'RGBA(103, 72, 144, 0)')
        })
        color_sub = "#48347F";
        color_key = "#26123C";
      }

      if(MasterName === "Science"){
        color = Science_Color;
        var gradient = draw.gradient('radial', function(stop) {
          stop.at(0, '#F8405E')
          stop.at(1, 'RGBA(248, 64, 94, 0)')
        })

        color_sub = "#BF405E";
        color_key = "#6F2739";
      }

      masterCatBuilder(MasterName, MasterId, posX, posY, width, gradient);

      // SUB CATEGORIES
      var subCategoryList = dataMAP[i].MasterCategory.subCategory;

      for (j in subCategoryList){

        var subCategory = subCategoryList[j];
        var subCatId = subCategory.replace(/[.*+?^${}()|& :/,[\]\\]/g, '');
        subCatId = subCatId.toLowerCase();
        // console.log("--"+subCategory);
        // Calculate the angle at which the element will be placed.
        // For a semicircle, we would use (i / numNodes) * Math.PI.
        angle = (j / (subCategoryList.length/2)) * Math.PI; 
        // Calculate the x position of the element.
        subCatX =  (radius * Math.cos(angle)) + (posX + radius/2 - radius_subCat/2);  
        // Calculate the y position of the element. 
        subCatY =  (radius * Math.sin(angle)) + (posY + radius/2 - radius_subCat/2);

        subCatBuilder(subCategory, MasterId, subCatId, subCatX, subCatY, radius_subCat, color,  color_sub);

        var keywordsList = dataMAP[i].MasterCategory[subCategoryList[j]].AllKeywords;

        for (k in keywordsList){
          var keyword = keywordsList[k];
          var keyId = keyword.replace(/[.*+?^${}()|& :/,[\]\\]/g, '');
          keyId = keyId.toLowerCase();
          angleKey = (k / (keywordsList.length/2)) * Math.PI; 
          keyX =  (radius_subCat/2 * Math.cos(angleKey)) + (subCatX + radius_subCat/10 - radius_subCat/2);
          keyY =  (radius_subCat/2 * Math.sin(angleKey)) + (subCatY + radius_subCat/10 - radius_subCat/2);
          // console.log("-----"+keyword);
          keywordBuilder(keywordsList[k], subCatId, keyId, keyX, keyY, radius_key, color, color_key);
        }
      }
    }*/
    drawRevue();
  }

  

  init();

  function countWord(s){
    s.replace(/(^\s*)|(\s*$)/gi,"");
    s = s.replace(/[ ]{2,}/gi," ");
    s = s.replace(/\n /,"\n");
    s = s.split(' ').length;
    return s;
  }



  function masterCatBuilder(name, id, x, y, r, color){
    // r= 300;
    // var rect = draw.circle(0).id(id).stroke(color).fill('none').move(x - (r/2), y - (r/2));
    var rect = draw.circle(0).id(id).stroke('none').fill(color).move(x, y);
    // rect.attr("stroke-dasharray", 5);
    var text = draw.text(function(add) {
    color= "white";
      add.tspan(name).newLine().id("text_"+id).fill(color).attr('y', y).dx(x).font({family:'Lato', size:35 , anchor:'middle', weight:100 })
    })

  }

  function subCatBuilder(name, masterID, id, x, y, r, color, color_t){
    var rect = draw.circle(0).id(id).stroke(color).fill('none').move(x - (r/2), y - (r/2));
    //var rect = draw.circle(0).id(id).stroke(color).fill('red').move(x - (r/2), y - (r/2));
    var text = draw.text(function(add) {
        // color= "black";
      add.tspan(name).newLine().id("text_"+id).fill(color_t).attr('y', y - (r/2)).dx(x - (r/2)).font({family:'Lato', size:20 , anchor:'middle', weight:300 })
    })
  }

  function keywordBuilder(name, catID, id, x, y, r, color, color_t){
    var rect = draw.circle(0).id(id).fill(color).move(x - (r/2), y - (r/2));
    var text = draw.text(function(add) {
        // color= "black";
      add.tspan(name).newLine().id("text_"+id).fill(color_t).attr('y', y - (r/2)).dx(x - (r/2)).font({family:'Lato', size:10 , anchor:'middle', weight:700 })
    })
  }

  function buildIndex(name){
    var div = document.createElement("div");
    div.className = "Revue";
    div.innerHTML = name;
    document.getElementById("menu").append(div);
  }

  function buildLetterIndex(lettre){
    var div = document.createElement("div");
    div.className = "Lettrine";
    div.innerHTML = lettre;
    document.getElementById("menu").append(div);
  }

  function drawRevue(){

    var FirstLetter;

    for (i in data) {
      var name = data[i].name; 
      var key = data[i].keywords;
      var coord = [];
      var coordStr = "";
      var currentID = name.replace(/[.*+?^${}()|& :/,[\]\\]/g, '');
      currentID = currentID.toLowerCase();
      console.log("name revue: ",name);
      // console.log(currentID);
      if(FirstLetter === name[0]){    
        buildIndex(name);
        $(".Revue").eq(i).attr("data-target", currentID);
        var keyList = "";
        for(j in key){
            var target = key[j];
            target = target.replace(/[.*+?^${}()|& :/,[\]\\]/g, '');
            target = target.toLowerCase();
            // console.log("target == " +target);
            var element = SVG.get(target);
            coord.push(element.attr('cx')+","+element.attr('cy'));
            // element.fill('#f06')
            keyList = keyList + target + ",";
            // console.log(keyList);
            $(".Revue").eq(i).attr("data-keylist", keyList);
          }

          // coord.sort();
          for(p in coord){
            // console.log(coord[p]);
            coordStr = coordStr +" "+coord[p];
          }

          var polygon = draw.polygon(coordStr).id("revue_"+currentID).opacity(1).fill('rgba(255,255,255,0)').stroke({ width: polygonOpacity, opacity:0.1 })
      
      }else{

        /*
          buildLetterIndex(name[0]);
          buildIndex(name);

          $(".Revue").eq(i).attr("data-target", currentID);
          
          var keyList = "";

          for(j in key){
            var target = key[j];
            target = target.replace(/[.*+?^${}()|& :/,[\]\\]/g, '');
            target = target.toLowerCase();
            // console.log("target == " +target);
            var element = SVG.get(target);
            coord.push(element.attr('cx')+","+element.attr('cy'));
            // element.fill('#f06')
            keyList = keyList + target + ",";
            // console.log(keyList);
            $(".Revue").eq(i).attr("data-keylist", keyList);
          }

          // coord.sort();

          for(p in coord){
            // console.log(coord[p]);
            coordStr = coordStr +" "+coord[p];
          }

          var polygon = draw.polygon(coordStr).id("revue_"+currentID).opacity(1).fill('rgba(255,255,255,0)').stroke({ width: polygonOpacity, opacity:0.1 })
          // polygon.before('circle');
          // console.log(name[0]);
          */
      }

      //FirstLetter = name[0];
      // Nom des revue placé sur la carte
      // var revueTitle = draw.text(function(add) {
      // 	add.tspan(name).newLine().id("revueTitle_"+currentID).addClass("titreRevue").fill('cyan').attr('y', polygon.cy()).dx(polygon.cx()).font({family:'Lato', size:24 , anchor:'left'})
      // })
    }

  }

  // EVENTS
  $(".Revue").bind("mouseover", revealRevue);

  function revealRevue(event){
    var target = $(this).attr("data-target");
    var key = $(this).attr("data-keylist").split(',');
    key = key.slice(0, -1);;
    // console.log(target);
    initOpacity(0.1);
    $("circle").css("display", "none");
    // $("polygon").css("opacity", 0.3);
    $("tspan").css("display", "none");

    for(i in key){
      $("#"+key[i]).css("display", "block");
      $("#text_"+key[i]).css("display", "block");
    }

    $("#revue_"+target).css("opacity", 1);
    $("#revueTitle_"+target).css("opacity", 1);

    console.log("#revue_"+target);

    var element = SVG.get("revue_"+target);
    element.fill('rgba(0,0,0,0.8)').stroke({ width: 1 });
    $(".Revue").bind("mouseout", unrevealRevue);
    $(".Revue").bind("click", lockRevue);

  }

  function lockRevue(){
      $(".Revue").unbind("mouseout", unrevealRevue);
      $(this).addClass('active');
      locked = true;
  }

  function unrevealRevue(){
    var target = $(this).attr("data-target");
    var element = SVG.get("revue_"+target);
    element.fill('rgba(255,255,255,0)').stroke({ width: polygonOpacity })
    locked = false;
    $(this).removeClass('active');
    initOpacity();
  }

  // $("svg").bind("mouseover",initOpacity);
  
  $(document).ready(function($) {
     //initOpacity(1);
     //countKeyWordChart();
  });
  

  function initOpacity(val){
    if(val == null){
    }else{
        scale = val;
    }

    $("circle").css("display", "block");
    // $("circle").css("opacity", 0.5);
    $("polygon").css("opacity", 0.3);
    $("tspan").css("display", "block");
    // var fontOpacity = 36/(scale*100);
    for (var i = 0; i < $("tspan").length; i++) {
        var fz = $("tspan").eq(i).attr('font-size');
        var fy = $("tspan").eq(i).attr('y');            
        var newZ = fz/scale;
        // console.log($("tspan").eq(10).attr('y'));
        var newO = 2/scale;
        // console.log(newO);
        // $("tspan").eq(i).css("font-size", newZ);
        // $("tspan").eq(i).css("opacity", newO);
        $("tspan").eq(i).attr("dy", 5);
    }


    if(scale<=1){
        var limitFS = 35;
        for (var i = 0; i < limitFS; i++) {
            $("tspan[font-size='"+i+"']").css("display", "none");
        }
    }else if(scale<1.5 && scale>1){
      var limitFS = 20;
      for (var i = 0; i < limitFS; i++) {
        $("tspan[font-size='"+i+"']").css("display", "none");
      }
    }else if(scale<=2.5 && scale>2){
      var limitFS = 10;
      for (var i = 0; i < limitFS; i++) {
        $("tspan[font-size='"+i+"']").css("display", "block");
      }
    }
    $(".titreRevue").css("opacity", 0);
  }




