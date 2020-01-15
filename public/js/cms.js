

// connect to database --- check in client.js
// retrieve json file --- check in client.js

// generate formular

// <% include ./partials/cms_form %>

var isCreateNew = false;
var isWaiting = false;

/////////////////////////////////////////////////////////////////
//////////////////////    POUR ALEX     /////////////////////////
/////////////////////////////////////////////////////////////////
// a mettre a true si j'ai oublié.... pour simuler la DB chez toi.
var isSimulateDB = false;
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// careful... ideally, we should retrieve these values from the database.. same in server.js
var nbM = 3;
var nbS = 25;
var nbK = 53;


d3.select("#cms_newRevue").on("click", function(){ 
    createNewRevue();
});

d3.select("#cms_buttonCancel").on("click", function(){
    hideFormular();
});

d3.select("#cms_buttonDelete").on("click", function(){});

d3.select("#cms_buttonSaveWaiting").on("click", function(){
    console.log("cms_buttoonSaveWaiting button  has been clicked");
    checkCmsParameters();
});

d3.select("#cms_buttonSave").on("click", function(){

    console.log("cms_buttonSave button has been clicked");
    checkCmsParameters();

}); // POST BUTTON


// FORMULAR ADD_JOURNAL
var values_ok = false;
document.getElementById("add_jounal_submit").addEventListener("click", function(event){
    event.preventDefault();
    console.log("add_jounal_submit button has been clicked");

    checkFormParameters();

    if(!values_ok){ return; }
    console.log("All required datas were entered");

    var div = d3.select("#form_add_journals");

    var msg = "name=" + div.select("#name").property("value");
    msg += "&link=" + div.select("#link").property("value"); 
    msg += "&year_start=" + div.select("#year_start").property("value");
    msg += "&year_end=" + div.select("#year_end").property("value");
    msg += "&ongoing=" + div.select("#ongoing").property("checked"); 
    msg += "&frequency=" + div.select("#frequency").property("value");
    msg += "&publisher=" + div.select("#publisher").property("value");
    msg += "&city=" + div.select("#city").property("value");
    msg += "&language=" + div.select("#language").property("value");
    msg += "&access=" + div.select("#access").property("value");
    msg += "&medium=" + div.select("#medium").property("value");
    msg += "&about=" + div.select("#about").property("value");
    msg += "&pr_yes=" + div.select("#peer_review_yes").property("checked"); 
    msg += "&pr_no=" + div.select("#peer_review_no").property("checked"); 
    msg += "&note=" + div.select("#note").property("value");
    msg += "&user_name=" + div.select("#user_name").property("value");
    msg += "&user_email=" + div.select("#user_email").property("value");
    msg += "&keywords=";

    var keywords = "";
    var d = div.select("#keywords_selection");
    for(var i=0; i<nbM; i++){
        var keyM = "master" + i;
        var r = d.select("#"+keyM).property("checked");
        if(r){
            var n = d.select("#"+keyM).property("name");
            //var name = dataNodesFromDB.find(function(i){ return i.nameID == n}).name;
            //name = name.replace(/\s/g,"_");
            //console.log("name",name);
            keywords += n + "_";
        }
    }
    for(var i=0;i<nbS; i++){
        var keyS = "sub" + i;
        var r = d.select("#"+keyS).property("checked");
        if(r){
            var n = d.select("#"+keyS).property("name");
            //var name = dataNodesFromDB.find(function(i){ return i.nameID == n}).name;
            //name = name.replace(/\s/g,"_");
            //console.log("name",name);
            keywords += n + "_";
        }
    }
    for(var i=0;i<nbK; i++){
        var keyK = "key" + i;
        var r = d.select("#"+keyK).property("checked");
        if(r){
            var n = d.select("#"+keyK).property("name");
            //var name = dataNodesFromDB.find(function(i){ return i.nameID == n}).name;
            //name = name.replace(/\s/g,"_");
            //console.log("name",name);
            keywords += n + "_";
        }
    }

    msg += keywords;

   showFormRevue(false);

   d3.request("/submit")
   .header("X-Requested-With", "XMLHttpRequest")
   .header("Content-Type", "application/x-www-form-urlencoded")
   .post(msg, sendEmailBack);

 
});


function sendEmailBack(){
    console.log("-> sendEmailBack");
}

function testSend(){

    var obj= {'msg': [
        {
        "username": "testuser1",
        "firstName": "test",
        "lastName": "user1",
        "password": "password1"
        },
        {
        "username": "testuser2",
        "firstName": "test",
        "lastName": "user2",
        "password": "password2"
        }
    ]};
    
    request.post({
        url: 'your website.com',
        body: obj,
        json: true
        }, function(error, response, body){
        console.log(body);
    });

}



d3.select("#cms_test3").on("click", function(){
    console.log("yeep");
    d3.request("/cms/revue")
        .header("X-Requested-With", "XMLHttpRequest")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post("revueID=revue1&type=online", dataReturned);
});


function dataReturned(data){
    console.log("dataReturned",data,data.response);
}


function testStuff(){
    console.log("-> testStuff()");
    
    //sendJsonRevuesToDatabase();
    //sendJsonNodesToDatabase();
    //sendJsonLinksToDatabase();
}


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
            // BACK socket.emit("writeIntoTableOnline", d);
        }
    });
}

function sendJsonNodesToDatabase(){
    console.log("dataLinks",dataLinks);
    dataLinks.forEach(function(d,i){
        console.log("sending new data NODE",d);
        // BACK socket.emit("writeIntoNodes",d);
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
        //socket.emit("getAllRevuesWaiting");  
        addCmsRevues("waiting",true,dataRevueWaitingFromDB);
        var filteredRevue = [];
        dataRevueOnlineFromDB.forEach(function(d,i){
            var found = dataRevueWaitingFromDB.find(function(e,j){ return e.revueID == d.revueID});
            if(found == undefined) filteredRevue.push(d);
        });
        console.log("filtered",filteredRevue);
        addCmsRevues("online",false,filteredRevue); 
       // addKeywordsToFormular(nodes);
        addKeywordsToFormular(nodes);
    }

    hideFormular();

    testStuff();

    var hackerList = new List('menu', options);

}

// Search input

var options_cms = {
    valueNames: [ 'revue-title-cms' ]
};



function createCmsMenu(){

    addCmsRevues("waitings",true,dataRevue);
    addCmsRevues("online",false,dataRevue);

    // Search engine
    //var hackerList = new List('menu', options);
}

function addCmsRevues(divName,isWaiting,data){
    var menu = d3.select("#cms_menulist");
    var div = menu.append("div").attr("class",divName);
    if(isWaiting) div.append("h4").html("Drafts");
    else div.append("h4").html("Online");
    console.log("??",data);
    var previousLetter = "Z";

    data.sort(function (a,b) {return d3.ascending(a.name.toUpperCase(), b.name.toUpperCase());});
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
                .attr("class","revue-title-cms")
                .html(d.name);
        previousLetter = letter;
    });

}

function addKeywordsToFormular(nodes){
    console.log("-> addKeywordsToFormular()");
    //console.log("************** CMS ******************");
    //console.log("nodes",nodes);
    //console.log("************** CMS ******************");
    var div = d3.select("#cms").select("#keywords_selection");
    var nodesM = nodes.filter(function(d,i){ return d.parentNameID == ''});

    nodesM.forEach(function(dM,i){
        div.select("#" + dM.nameID).html(dM.name);
        var nodesS = nodes.filter(function(d){ return d.parentNameID == dM.nameID; });
        var div_li_subs = div.select("#" + dM.nameID + "_li");
        var div_ul_S = div_li_subs.append("ul");
        //console.log("nodesS",nodesS);

        nodesS.forEach(function(dS,j){
            var div_li = div_ul_S.append("li");
            div_li.append("input").attr("type","checkbox").attr("name",dS.nameID).attr("id",dS.nameID);
            div_li.append("label").attr("for",dS.name).html(dS.name);
            var nodesK = nodes.filter(function(d){ return d.parentNameID == dS.nameID; });
            var div_ul_K = div_li.append("ul");
            nodesK.forEach(function(dK,k){
                div_li = div_ul_K.append("li");
                div_li.append("input").attr("type","checkbox").attr("name",dK.nameID).attr("id",dK.nameID);
                div_li.append("label").attr("for",dK.nameID).html(dK.name);
            });
            //<input type="checkbox" name ="" value="" id="Fine">
            //<label for="Fine">Fine Arts</label>            
        })
    });
}

function addKeywordsRevueToFormular(keywords){
    var div = d3.select("#cms").select("#keywords_selection");

    // empty first all the checkboxes
    for(var i=0; i<nbM; i++){
        var keyM = "master" + i;
        div.select("#"+keyM).property("checked",false);
    }
    for(var i=0;i<nbS; i++){
        var keyS = "sub" + i;
        div.select("#"+keyS).property("checked",false);
    }
    for(var i=0;i<nbK; i++){
        var keyK = "key" + i;
        div.select("#"+keyK).property("checked",false);
    }

    // select the wanted keywords
    keywords.forEach(function(d,i){
        console.log("keyword",d.linkID);
        div.select("#"+d.linkID).property("checked",true);
    });
}

function createNewRevue(){
    console.log("create new revue");

    isCreateNew = true;
    isWaiting = true;
    
    storeHiddenVariablesInFormular("revue" + dataRevueOnlineFromDB.length);
    emptyFormular();
    showFormular();
}

function showWaitingRevue(revueID){
    console.log("-> showWaitingRevue",revueID);
    isWaiting = true;
    storeHiddenVariablesInFormular(revueID);
    if(isSimulateDB) showRevue(undefined,revueID);
    else{
        // BACK socket.emit("getWaitingRevue",revueID);
        // BAK socket.emit("getWaitingLinks",revueID);
        var revue = dataRevueWaitingFromDB.find(function(d){return d.revueID == revueID; });
        d3.request("/cms/revue")
        .header("X-Requested-With", "XMLHttpRequest")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post("revueID="+revueID+"&type=waiting", dataReturned);
        
        showRevue(revue);
    }
}

function showOnlineRevue(revueID){
    console.log("-> showOnlineRevue");
    isWaiting = false;
    storeHiddenVariablesInFormular(revueID);
    if(isSimulateDB) showRevue(undefined,revueID);
    else{
        // BACK socket.emit("getOnlineRevue",revueID);
        // BAK socket.emit("getOnlineLinks",revueID);
        console.log("show online revue",revueID);
        var revue = dataRevueOnlineFromDB.find(function(d){return d.revueID == revueID; });
        d3.request("/cms/revue")
        .header("X-Requested-With", "XMLHttpRequest")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .post("revueID="+revueID+"&type=online", dataReturned);
        
        showRevue(revue);
    }
}

function dataReturned(data){
    console.log("dataReturned",data,data.response);
    var keywords = JSON.parse(data.response);
    addKeywordsRevueToFormular(keywords);
}

function showRevue(revue,revueID){
    //var revue = dataRevue.find( function(d) { return d.id == revueID; });
    //var revue = databaseRevue.find(function(d) { return d.id == 0; }); 
    //var revue = databaseRevue.find(function(d) { return d.revueID == 1; }); 
    if(isSimulateDB) revue = dataRevuesFakedDB.find(function(d) { return d.revueID == revueID; }); 
    // TODO: sends to server a GET request... in order to retrieve final database DATAS
    
    emptyFormular();
    
    console.log("revue",revue);
    var cms = d3.select("#cms");
    cms.select("#name").property("value",revue.name);
    cms.select("#link").property("value",revue.link);
    cms.select("#year_start").property("value",revue.year_start); 
    cms.select("#year_end").property("value",revue.year_end);
    if(revue.ongoing == 0) cms.select("#ongoing").property("checked",false);
    else cms.select("#ongoing").property("checked",true);
    cms.select("#frequency").property("value",revue.frequency); 
    cms.select("#publisher").property("value",revue.publisher); 
    cms.select("#city").property("value",revue.city); 
    cms.select("#lat").property("value",revue.long);
    cms.select("#long").property("value",revue.lat); 
  //  console.log("lan??",revue.language);
    cms.select("#language").property("value",revue.language); 
    cms.select("#access").property("value",revue.access); 
    cms.select("#medium").property("value",revue.medium); 
    cms.select("#about").property("value",revue.about); 
   // console.log("peer_review ???",revue.peer_review);
    //if(revue.peer_review == 0) cms.select("#peer_review").property("value","yes");  // TODO: check boolean -> ask ALEX
    if(revue.peer_review == 1) cms.select("#peer_review_yes").property("checked",true);  // TODO: check boolean -> ask ALEX
    else cms.select("#peer_review_no").property("checked",true);
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


function emptyFormular(){
    var cms = d3.select("#cms");
    cms.select("#name").property("value","");
    cms.select("#link").property("value","");
    cms.select("#year_start").property("value",""); 
    cms.select("#year_end").property("value","");
    cms.select("#ongoing").property("checked",false); 
    cms.select("#frequency").property("value",""); 
    cms.select("#publisher").property("value",""); 
    cms.select("#city").property("value",""); 
    cms.select("#lat").property("value","");
    cms.select("#long").property("value",""); 
    cms.select("#language").property("value",""); 
    cms.select("#access").property("value",""); 
    cms.select("#medium").property("value",""); 
    cms.select("#about").property("value",""); 
    cms.select("#peer_review_yes").property("checked",false);
    cms.select("#peer_review_no").property("checked",false);
    cms.select("#note").property("value",""); 

    var div = cms.select("#keywords_selection");
    for(var i=0; i<nbM; i++){
        var keyM = "master" + i;
        div.select("#"+keyM).property("checked",false);
    }
    for(var i=0;i<nbS; i++){
        var keyS = "sub" + i;
        div.select("#"+keyS).property("checked",false);
    }
    for(var i=0;i<nbK; i++){
        var keyK = "key" + i;
        div.select("#"+keyK).property("checked",false);
    }
}


function emptyAddJournalFormular(){
    console.log("emptyAddJournalFormular");
    var div = d3.select("#form_add_journals");
    
    div.select("#name").property("value","");
    div.select("#link").property("value","");
    div.select("#year_start").property("value",""); 
    div.select("#year_end").property("value","");
    div.select("#ongoing").property("checked",false); 
    
    div.select("#frequency").property("value",""); 
    div.select("#publisher").property("value",""); 
    div.select("#city").property("value",""); 
    div.select("#language").property("value",""); 
    div.select("#access").property("value",""); 
    div.select("#medium").property("value",""); 
    
    div.select("#about").property("value",""); 
    div.select("#peer_review_yes").property("checked",false);
    div.select("#peer_review_no").property("checked",false);
    div.select("#note").property("value",""); 
    div.select("#user_name").property("value",""); 
    div.select("#user_email").property("value",""); 
    

    var d = div.select("#keywords_selection");
    for(var i=0; i<nbM; i++){
        var keyM = "master" + i;
        d.select("#"+keyM).property("checked",false);
    }
    for(var i=0;i<nbS; i++){
        var keyS = "sub" + i;
        d.select("#"+keyS).property("checked",false);
    }
    for(var i=0;i<nbK; i++){
        var keyK = "key" + i;
        d.select("#"+keyK).property("checked",false);
    }
}



// function called from the add journal formular
function generateKeywordsForForm(nodes){
    console.log("-> addKeywordsToFormular() !!!");
    //console.log("************** CMS ******************");
    //console.log("nodes",nodes);
    //console.log("************** CMS ******************");
    var div = d3.select("#form_add_journals").select("#keywords_selection");
    var nodesM = nodes.filter(function(d,i){ return d.parentNameID == ''});

    nodesM.forEach(function(dM,i){
        div.select("#" + dM.nameID).html(dM.name);
        var nodesS = nodes.filter(function(d){ return d.parentNameID == dM.nameID; });
        var div_li_subs = div.select("#" + dM.nameID + "_li");
        var div_ul_S = div_li_subs.append("ul");
        //console.log("nodesS",nodesS);

        nodesS.forEach(function(dS,j){
            var div_li = div_ul_S.append("li");
            div_li.append("input").attr("type","checkbox").attr("name",dS.nameID).attr("id",dS.nameID).attr("class","keyword_input");
            div_li.append("label").attr("for","Fine").html(dS.name);
            var nodesK = nodes.filter(function(d){ return d.parentNameID == dS.nameID; });
            var div_ul_K = div_li.append("ul");
            nodesK.forEach(function(dK,k){
                div_li = div_ul_K.append("li");
                div_li.append("input").attr("type","checkbox").attr("name",dK.nameID).attr("id",dK.nameID).attr("class","keyword_input");
                div_li.append("label").attr("for","Fine").html(dK.name);
            });
            //<input type="checkbox" name ="" value="" id="Fine">
            //<label for="Fine">Fine Arts</label>            
        })
    });
}


// Alex functions

// Alex functions
if(is_cms){
    
	var deleteBTN = document.getElementsByClassName("delete")[0];

	deleteBTN.addEventListener("click", function(){
		if (confirm("Are you sure to delete this journal ?")) {
		    console.log("deleted");
		} else {
		    console.log("canceled");
		}
	})
}

function checkFormParameters(){
    // check number of keywords

    var div = d3.select("#form_add_journals");
    var m = div.select("#name").property("value");
    if(m == ""){
        values_ok = false;
        alert("Please insert the journal's name.");
        return;
    }
    m = div.select("#year_start").property("value");
    if(m == ""){
        values_ok = false;
        alert("Please insert the starting year of the publication.");
        return;
    }
    m = div.select("#city").property("value");
    if(m == ""){
        values_ok = false;
        alert("Please insert the city.");
        return;
    }
    m = div.select("#about").property("value");
    if(m == ""){
        values_ok = false;
        alert("Please insert the 'About' section.");
        return;
    }
    m = div.select("#user_email").property("value");
    if(m == ""){
        values_ok = false;
        alert("Please insert your e-mail.");
        return;
    }

    var checked = 0;
    for(var i=0; i<nbM; i++){
        var keyM = "master" + i;
        var c = div.select("#"+keyM).property("checked");
        if(c == true) checked++;
    }
    for(var i=0;i<nbS; i++){
        var keyS = "sub" + i;
        var c = div.select("#"+keyS).property("checked");
        if(c == true) checked++;
    }
    for(var i=0;i<nbK; i++){
        var keyK = "key" + i;
        var c = div.select("#"+keyK).property("checked");
        if(c == true) checked++;
    }
    console.log("nb checked",checked);
    if(checked < 3){
        values_ok = false;
        alert("You need to choose 3 keywords at least");
    }else{
        values_ok = true;
    }
}

function checkCmsParameters(){
    var cms = d3.select("#cms");
    var year_start = cms.select("#year_start").property("value"); 
    var year_end = cms.select("#year_end").property("value");
    var ongoing = cms.select("#ongoing").property("checked"); 
    console.log("tests",year_start,year_end,ongoing);
    if(year_end < year_start && ongoing == false){
        alert("Something is wrong with the years");
    }
    if(year_end == undefined && ongoing == false){
        alert("you haven't decided between an ongoing publication or an end date of publication.");
    }
    // check number of keywords
    var checked = 0;
    var div = cms.select("#keywords_selection");
    for(var i=0; i<nbM; i++){
        var keyM = "master" + i;
        var c = div.select("#"+keyM).property("checked");
        if(c == true) checked++;
    }
    for(var i=0;i<nbS; i++){
        var keyS = "sub" + i;
        var c = div.select("#"+keyS).property("checked");
        if(c == true) checked++;
    }
    for(var i=0;i<nbK; i++){
        var keyK = "key" + i;
        var c = div.select("#"+keyK).property("checked");
        if(c == true) checked++;
    }
    console.log("nb checked",checked);
    if(checked < 3){
        alert("You need to choose 3 keywords at least");
    }
}


function checkKeywords(){

}

