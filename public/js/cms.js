

// connect to database --- check in client.js
// retrieve json file --- check in client.js

// generate formular

// <% include ./partials/cms_form %>

var isCreateNew = false;
var isWaiting = false;
var toto = "blupToto";

/////////////////////////////////////////////////////////////////
//////////////////////    POUR ALEX     /////////////////////////
/////////////////////////////////////////////////////////////////
// a mettre a true si j'ai oublié.... pour simuler la DB chez toi.
var isSimulateDB = false;
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var dataRevueWaitingFromDB;
var dataRevueOnlineFromDB;


d3.select("#cms_newRevue").on("click", function(){ 
    createNewRevue();
});

d3.select("#cms_buttonCancel").on("click", function(){
    hideFormular();
});

d3.select("#cms_buttonDelete").on("click", function(){

});

d3.select("#cms_buttonSaveWaiting").on("click", function(){

});


// POST BUTTON
d3.select("#cms_buttonSave").on("click", function(){

});

function testStuff(){
    console.log("-> testStuff()");
    
    //sendJsonRevuesToDatabase();
    //sendJsonNodesToDatabase();
    //sendJsonLinksToDatabase();
}

socket.on('allRevuesWaiting',function(revues){
    console.log("client receives all revues waiting",revues);
    dataRevueWaitingFromDB = revues;
    addCmsRevues("waitings",true,revues);
    socket.emit("getAllRevuesOnline");
});

socket.on('allRevuesOnline',function(revues){
    console.log("client receives all revues online",revues);
    if(is_cms){
        dataRevueOnlineFromDB = revues;
        var filteredRevue = [];
        dataRevueOnlineFromDB.forEach(function(d,i){
            var found = dataRevueWaitingFromDB.find(function(e,j){ return e.revueID == d.revueID});
            if(found == undefined) filteredRevue.push(d);
        });
        addCmsRevues("online",false,filteredRevue);
        socket.emit("getAllNodes");
    } else { // not very logical to have this case here... should be moved in an upper layer...
        convertDBRevueToJson(revues);
    }
});

// not very logical to have this case here... 
socket.on('allNodes',function(nodes){
    if(is_cms){
        addKeywordsToFormular(nodes);
    }else{
        convertDBNodesToJson(nodes); 
    }
});

// not very logical to have this case here... 
socket.on('allLinks',function(links){
    console.log("client receives all links",links);
    addDBLinksToJsonRevues(links);
});

socket.on('revueWaiting',function(revue){
    console.log("client receives infos from revueWaiting",revue);
    showRevue(revue);
});

socket.on('revueOnline',function(revue){
    console.log("client receives infos from revueWaiting",revue);
    showRevue(revue);
});


function sendJsonRevuesToDatabase(){
    dataRevue.sort(function (a,b) {return d3.ascending(a.name, b.name);});
    dataRevue.forEach(function(d,i){
        //console.log("dd:",d);
        if(i < 10){
            console.log("d:",d);
            //d.name = d.name.replace("&","AND");
            //d.name = "Name_" + d.id;
            console.log("d.name",d.name);
            //d.name = "balbal_" + d.id;
            socket.emit("writeIntoTableOnline", d);
        }
    });
}

function sendJsonNodesToDatabase(){
    console.log("dataLinks",dataLinks);
    dataLinks.forEach(function(d,i){
        console.log("sending new data NODE",d);
        socket.emit("writeIntoNodes",d);
    });
}

function sendJsonLinksToDatabase(){
    dataRevue.forEach(function(d,i){
        //console.log("dd:",d);
        if(i < 10){
            console.log("d:",d);

            console.log("revueID:", d.id);
            console.log("links:", d.links);
            var links = d.links;
            links.forEach(function(k,i){
                console.log("revue has",k);
                socket.emit("writeIntoLinks",d.id,k);
            });
            //console.log("d.name",d.name);
            //socket.emit("writeIntoTableOnline", d);
        }
    });
}

function showCms(){

    //sendJsonToDatabase();

    d3.select("#cms").style("visibility", "visible");

    //initCms_form(); // alex stuff
    if(isSimulateDB) createCmsMenu();
    else {
        socket.emit("getAllRevuesWaiting");   
    }

    hideFormular();

    testStuff();

}

function createCmsMenu(){

    addCmsRevues("waitings",true,dataRevue);
    addCmsRevues("online",false,dataRevue);

    // Search engine
    var hackerList = new List('menu', options);
}

// ATTENTION: pour les revues online, check before whether it is already in the WAITING LIST.
function addCmsRevues(divName,isWaiting,data){
    var menu = d3.select("#cms_menulist");
    var div = menu.append("div").attr("class",divName);
    if(isWaiting) div.append("h4").html("Waiting");
    else div.append("h4").html("Online");

    var previousLetter = "Z";
    data.sort(function (a,b) {return d3.ascending(a.name, b.name);});
    data.forEach(function(d,i){
        var letter = d.name.charAt(0).toUpperCase();
        if(letter != previousLetter && !isWaiting){ // we only want the letter for the ONLINE menu revues
            // we add the LETTER li
            div.append("li")
                    .attr("class","letter")
                    .html(letter);
        }
        // we add the revue on the menu
        div.append("li")
                .on("click",function(){
                    console.log("### mouseclick",d.ID, d.revueID);
                    var id = d.revueID;
                    if(isSimulateDB) id = d.id;
                    if(isWaiting){
                        showWaitingRevue(id);
                    }else{
                        showOnlineRevue(id);
                    }
                })
                .append("h3")
                .attr("class","revue-title")
                .html(d.name);
        previousLetter = letter;
    });

}

function addKeywordsToFormular(nodes){
    console.log("-> addKeywordsToFormular()");
    //console.log("************** CMS ******************");
    //console.log("nodes",nodes);
    //console.log("************** CMS ******************");
}

function createNewRevue(){
    console.log("create new revue");

    isCreateNew = true;
    isWaiting = true;
    
    storeHiddenVariablesInFormular();

    var cms = d3.select("#cms");
    cms.select("#name").property("value","");
    cms.select("#link").property("value","");
    cms.select("#year_start").property("value",""); 
    cms.select("#year_end").property("value","");
    cms.select("#ongoing").property("checked",false); 
    cms.select("#frequency").property("value",""); 
    cms.select("#publisher").property("value",""); 
    cms.select("#country").property("value",""); // TODO: check city versus country with Alex
    cms.select("#lat").property("value","");
    cms.select("#long").property("value",""); 
    cms.select("#language").property("value",""); 
    cms.select("#access").property("value",""); 
    cms.select("#medium").property("value",""); 
    cms.select("#about").property("value",""); 
    //cms.select("#peer_review").property("value","yes");  // TODO: check boolean -> ask ALEX
    cms.select("#note").property("value",""); 

    showFormular();

}

function showWaitingRevue(revueID){
    console.log("-> showWaitingRevue",revueID);
    isWaiting = true;
    storeHiddenVariablesInFormular(revueID);
    if(isSimulateDB) showRevue(undefined,revueID);
    else{
        socket.emit("getWaitingRevue",revueID);
    }
}

function showOnlineRevue(revueID){
    console.log("-> showOnlineRevue");
    isWaiting = false;
    storeHiddenVariablesInFormular(revueID);
    if(isSimulateDB) showRevue(undefined,revueID);
    else{
        socket.emit("getOnlineRevue",revueID);
    }
}

function showRevue(revue,revueID){
    //var revue = dataRevue.find( function(d) { return d.id == revueID; });
    //var revue = databaseRevue.find(function(d) { return d.id == 0; }); 
    //var revue = databaseRevue.find(function(d) { return d.revueID == 1; }); 
    if(isSimulateDB) revue = dataRevuesFakedDB.find(function(d) { return d.revueID == revueID; }); 
    // TODO: sends to server a GET request... in order to retrieve final database DATAS
    console.log("revue",revue);
    var cms = d3.select("#cms");
    cms.select("#name").property("value",revue.name);
    cms.select("#link").property("value",revue.link);
    cms.select("#year_start").property("value",revue.year_start); 
    cms.select("#year_end").property("value",revue.year_end);
    cms.select("#ongoing").property("checked",revue.ongoing); 
    cms.select("#frequency").property("value",revue.frequency); 
    cms.select("#publisher").property("value",revue.publisher); 
    cms.select("#country").property("value",revue.city); // TODO: check city versus country with Alex
    cms.select("#lat").property("value",revue.lat);
    cms.select("#long").property("value",revue.long); 
    cms.select("#language").property("value",revue.language_val); 
    cms.select("#access").property("value",revue.access_val); 
    cms.select("#medium").property("value",revue.medium_val); 
    cms.select("#about").property("value",revue.about); 
    cms.select("#peer_review").property("value","yes");  // TODO: check boolean -> ask ALEX
    cms.select("#note").property("value",revue.note); 

    showFormular();
}

function storeHiddenVariablesInFormular(revueID){
    d3.select("#hidden_isCreateNew").property("value",isCreateNew);
    d3.select("#hidden_isWaiting").property("value",isWaiting);
    d3.select("#hidden_revueID").property("value",revueID);
}


function hideFormular(){
    // hide the formular
    d3.select("#cms_formular").style("visibility", "hidden");
}

function showFormular(){
    console.log("-> show formular");
    d3.select("#cms_formular").style("visibility", "visible");
}


// Alex functions

function initCms_form(){
    /*
	var deleteBTN = document.getElementsByClassName("delete")[0];

	deleteBTN.addEventListener("click", function(){
		if (confirm("Are you sure to delete this journal ?")) {
		    console.log("deleted");
		} else {
		    console.log("canceled");
		}
	})*/
}

//ACTION

/*
$(".ctrl button").bind("click", function(){

    console.log(checkKeywords());
    if(checkKeywords()){
        //POST
    }else{
        alert("You need to choose 3 keywords at least");
    }
})


$(".ctrl input").bind("click", function(){

    console.log(checkKeywords());
    if(checkKeywords()){
        //POST
    }else{
        alert("You need to choose 3 keywords at least");
    }
})*/


function checkKeywords(){

    /*
    var keywords = $(".form-keywords input");
    var checked = 0;

    for (var i = 0; i < keywords.length; i++) {
        
        if(keywords.eq(i).is(':checked')){
            checked = checked + 1;
        }

    }

    if(checked>=3){
        return true;
    }else{
        return false;
    }

    return false;
    */
}