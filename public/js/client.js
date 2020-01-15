var USE_DB = false;
var dataRevueFake;

// faking database for now
var db_weightMin = 0.2;
var db_weightMax = 1.0;
var counterSub_ID = 0;
var counterKey_ID = 0;
var nbSubNodes = 0;
var nbKeyNodes = 0;

var subNodesMaster0;
var subNodesMaster1;
var subNodesMaster2;

var minYear = Number.MAX_SAFE_INTEGER;

var mcount = 0;
var scount = 0;
var kcount = 0;
var dataLinks = [];
var allNodes_flat = [];
function genDatas(){
    masterNodes.forEach(function(dM,i){
        if(isSimulateDB) dM.id = "master"+mcount;
        dM.absX = 0;
        dM.absY = 0;
        dataLinks.push({id:dM.id,name:dM.name,parent:dM.id});
        allNodes_flat.push({id:dM.id,x:0,y:0,xRel:0,yRel:0,xStart:0,yStart:0,r:0});
        mcount++;
        dM.subCategory.forEach(function(d,i){
            if(isSimulateDB) d.id = "sub"+scount;
            d.absX = 0;
            d.absY = 0;
            dataLinks.push({id:d.id,name:d.name,parent:dM.id});
            allNodes_flat.push({id:d.id,x:0,y:0,xRel:0,yRel:0,xStart:0,yStart:0,r:0});
            scount++;
            d.keywords.forEach(function(d,i){
                if(isSimulateDB) d.id = "key"+kcount;
                d.absX = 0;
                d.absY = 0;
                dataLinks.push({id:d.id,name:d.name,parent:dM.id});
                allNodes_flat.push({id:d.id,x:0,y:0,xRel:0,yRel:0,xStart:0,yStart:0,r:0});
                kcount++;
            })
        })
    });
    //console.log("dataLinks",dataLinks);
    //console.log("masterNodes",masterNodes);
    //console.log("allNodes_flat",allNodes_flat);
    getWeight();

    getMinYear();

    nbSubNodes = scount;
    nbKeyNodes = kcount;
}

function getMinYear(){
    dataRevue.forEach(function(d,i){
        if(d.time != undefined && d.time[0] < minYear){
            minYear = d.time[0];
        }
    });
    console.log("[DATAS]: minyear is",minYear);
}

var fakeLocations = [[2, 48],[-73, 40],[6,46],[-47,-15],[151,-33],[-123,42],[121,31],[37,55],[90,30]];

var rcount = 0;
var mweight_min = Number.MAX_SAFE_INTEGER;
var mweight_max = 0;
var sweight_min = Number.MAX_SAFE_INTEGER;
var sweight_max = 0;
var kweight_min = Number.MAX_SAFE_INTEGER;
var kweight_max = 0;
function getWeight(){
    var allLinks = [];
    //console.log("dataLinks",dataLinks);
    var nbFakeLocations = 0;
    var nbFakeTimes = 0;
    if(isSimulateDB){
        dataRevue.forEach(function(d,i){
        //dataFiveRevues.forEach(function(d,i){
            d.id = "revue"+rcount;
            d.links = [];
            d.keywords.forEach(function(k,i){
                var r = dataLinks.find( function(key) { 
                    //if(d.id == "revue20"){ console.log("testing",key.name,"/",k);}
                    return key.name == k; 
                });
                if(r != undefined){
                    d.links.push(r.id);
                    //if(d.id == "revue20") console.log("FOUND!!");
                }else {console.log("[BUG]: undefined",k,"for revue",d.name,"with id",d.id);}
            });
            if(d.links.length < 3){
                console.log("[DATAS]: revue",d.name,"has less than 3 links");
                console.log("[TODO]: consider revues when links are less than 3!",d.links.length);
                d.links.push(d.links[d.links.length-1]);
            }
            allLinks = allLinks.concat(d.links);
            rcount++;

            // FAKING LOCATIONS
            var fakeIndex = getRandomInt(0,8);
            //fakeIndex = 8; // 2:italie, 3:am du sud 8 asie
            //d.locationCoords = [fakeLocations[fakeIndex][0] + getRandomInt(0,40)-20,fakeLocations[fakeIndex][1] + getRandomInt(0,20)-10 ];
            //d.locationCoords = fakeLocations[fakeIndex];
            if(!is_cms && d.locationCoords == undefined) {
                d.locationCoords = fakeLocations[fakeIndex];
                nbFakeLocations++;
                console.log("[DATAS]: faking location for revue",d.name,"with id",d.id);
            }

            if( !is_cms && !(d.locationCoords[0] >= -180 && d.locationCoords[0] <= 180)){
                console.log("[BUG]: longitude should be between -180 and 180",d.name);
            }
            if(!is_cms && !(d.locationCoords[1] >= -90 && d.locationCoords[1] <= 90)){
                console.log("[BUG]: latitude should be between -90 and 90",d.name);
            }

            
            // FAKING STARTING AND END DATE
            if(!is_cms && d.time == undefined){
                var xStart = getRandomInt(1950,2000);
                var xEnd = getRandomInt(30,50) + xStart;
                xEnd = 2020;
                d.time = [xStart,xEnd];
                console.log("[DATAS]: faking time datas for revue",d.name,"with id",d.id);
                nbFakeTimes++;
            }
        });
    }else{
        dataRevue.forEach(function(d,i){
            allLinks = allLinks.concat(d.links);
        });
    }
    //console.log("data",dataRevue);
    allLinks.sort();
    //console.log("allLinks",allLinks);
    if(!is_cms){
        console.log("[DATAS]:",nbFakeLocations,"revues have no locations");
        console.log("[DATAS]:",nbFakeTimes,"revues have no time datas");
    }
    
    masterNodes.forEach(function(d,i){
        var nbCountMaster = 0;
        d.subCategory.forEach(function(d,i){
            var nbCountSub = allLinks.filter( function(key) { return key == d.id; }).length;
            var nbCountKey = 0;
            d.keywords.forEach(function(d,i){
                var nb = allLinks.filter( function(key) { 
                    return key == d.id; 
                }).length;
                d.w = nb;
                nbCountKey += nb;
                if(nb < kweight_min) kweight_min = nb;
                if(nb > kweight_max) kweight_max = nb;
                
            })
            nbCountSub += nbCountKey;
            d.keywords.sort( compareWeight );
            if(nbCountSub < sweight_min) sweight_min = nbCountSub;
            if(nbCountSub > sweight_max) sweight_max = nbCountSub;
            //console.log("---> for sub node",d.id," occurences",nbCountSub);
            d.w = nbCountSub;
            nbCountMaster += nbCountSub;
        })
        // order subcategory according to its weight
        d.subCategory.sort( compareWeight );
        if(nbCountMaster < mweight_min) mweight_min = nbCountMaster;
        if(nbCountMaster > mweight_max) mweight_max = nbCountMaster;
        d.w = nbCountMaster;
        d.angleOffset = 0;
    });
    //console.log("MASTER MIN MAX",mweight_min,mweight_max);
    //console.log("SUB MIN MAX",sweight_min,sweight_max);
    //console.log("KEY MIN MAX",kweight_min,kweight_max);
    //console.log("MASTER NODES",masterNodes);
}

function compareWeight(a,b){
    if(a.w > b.w) return -1;
    else if(b.w > a.w) return 1;
    else return 0;
}

function getDataRevueFake(){
	return d3.range(80).map(function(d,i) {
		return {name: "name" + i,id: "revue" + i, links: d3.range(getRandomInt(3,9)).map(function(d,i){
                var t = getRandomInt(0,12);
                var link;
                if(t >= 8){link = "key" + getRandomInt(0,nbKeyNodes);}
                else if(t >= 1) {link = "sub" + getRandomInt(0,nbSubNodes);}
				else {link = "master" + getRandomInt(0,3);}
				return link;
		}) }
	});
}


function getFakeSubCategory(masterNodeId){
    var nbFakeSub;
    if(masterNodeId == "master0") nbFakeSub = 5;
    else if(nbFakeSub == "master1") nbFakeSub = 10;
    else nbFakeSub = 8;

    nbSubNodes += nbFakeSub;
  
    var w = db_weightMax;
    var wStep = (db_weightMax-db_weightMin)/(nbFakeSub-1.0);
    
    var fakeSub = d3.range(nbFakeSub).map(function(d,i) {
      var subWeight = w;
      w -= wStep;
      var nbFakeKey = getRandomInt(2,6);
      nbKeyNodes += nbFakeKey;
      var keywords = d3.range(nbFakeKey).map(function(d,i){
        return {id: "key"+(counterKey_ID + i),name:"name"+i}
      });
      counterKey_ID += nbFakeKey;
      return {id: "sub" + (counterSub_ID + i),name: "lorem ipsum", w: subWeight,keywords: keywords }
    });
    counterSub_ID += nbFakeSub;
    return fakeSub;
  }

function initDB(){
    console.log("-> initDB()");
    if(isSimulateDB){
        genDatas();
    } else{
        //genJsonFromDB();
        nodesFromDB.forEach(function(d,i){
            //console.log("bef",d.name);
            d.name = d.name.replace(/\&amp;/g,'&');
            //str= str.replace(/\&lt;/g,'<');
            //console.log("aft",d.name);
        })
        dataRevueFromDB.forEach(function(d,i){
            //console.log(d);
            d.name = d.name.replace(/\&amp;/g,'&');
            d.link = d.link.replace(/\&amp;/g,'&');
            d.publisher = d.publisher.replace(/\&amp;/g,'&');
            d.about = d.about.replace(/\&amp;/g,'&');
            d.about = d.about.replace(/\&#39;/g,"'");
            if(d.note) d.note = d.note.replace(/\&amp;/g,'&');
        })
        convertDBNodesToJson(nodesFromDB);
        generateKeywordsForForm(nodesFromDB);
        convertDBRevueToJson(dataRevueFromDB);
        addDBLinksToJsonRevues(linksFromDB);
    }
  
}

function genJsonFromDB(){
    console.log("******** genJsonFromDB *******");
    // BACK socket.emit('getAllNodes');
    
}

var dataNodesFromDB;
function convertDBNodesToJson(datas){
    masterNodes = [];

    //console.log("datas",datas);
    dataNodesFromDB = datas;

    var masters = datas.filter(function(d){ return d.parentNameID == ''});
    masters.forEach(function(dM,i){
        var master_node = new Object();
        master_node.id = dM.nameID;
        master_node.name = dM.name;
        master_node.subCategory = new Array();
        if(master_node.id == "master0") {master_node.x = 0.5; master_node.y = 0.28; master_node.color = "#565CC4"; master_node.angle = Math.PI/2.0;}
        else if(master_node.id == "master1") {master_node.x = 0.3; master_node.y = 0.7; master_node.color = "#E8606C"; master_node.angle = -Math.PI/6.0;}
        else if(master_node.id == "master2") {master_node.x = 0.75; master_node.y = 0.6; master_node.color = "#1B6C47"; master_node.angle = 7.0*Math.PI/6.0;}

        var sub = datas.filter(function(d){ return d.parentNameID == dM.nameID});
        //console.log("MASTER",dM.nameID,"sub",sub);
        sub.forEach(function(dS,j){
            var sub_node = new Object();
            sub_node.id = dS.nameID;
            sub_node.name = dS.name;
            sub_node.keywords = new Array();

            var keys = datas.filter(function(d){ return d.parentNameID == dS.nameID});
            //console.log("SUB",dS.nameID,"keys:",keys);
            keys.forEach(function(dk,k){
                //console.log("keyword name:",dk.nameID);
                var key_node = new Object();
                key_node.id = dk.nameID;
                key_node.name = dk.name;
                sub_node.keywords.push(key_node);
            });
            master_node.subCategory.push(sub_node);
        });

        masterNodes.push(master_node);
    });
    //console.log("masterNODES",masterNodes);

    //var nbMaster0 = uniqueLinks.filter( function(d){ return d.parent == "master0"}).length;

    // BACK socket.emit('getAllRevuesOnline');
}

function convertDBRevueToJson(datas){
    dataRevue = [];
    datas.forEach(function(d,i){
        var dd = new Object();
        dd.id = i;
        dd.revueID = d.revueID;
        dd.name = d.name;
        dd.link = d.link;
        dd.time = new Array(2);
        dd.time[0] = d.year_start;
        dd.time[1] = d.year_end;
        //console.log("d",d);
        //console.log("time",dd.time,d.year_start,d.year_end,d.ongoing,currentMaxYear);
        if(d.ongoing == 1) dd.time[1] = currentMaxYear;
        dd.publisher = d.publisher;
        dd.city = d.city;
        dd.locationCoords = new Array(2);
        dd.locationCoords[0] = d.lat;
        dd.locationCoords[1] = d.long;
        dd.about = d.about;
        dataRevue.push(dd);
    });
    // BACK socket.emit("getAllLinks");
}

function addDBLinksToJsonRevues(links){
    dataRevue.forEach(function(d,i){
        d.links = [];
        d.keywords = [];
        var revueLinks = links.filter(function(l,j){ return l.revueID == d.revueID});
        //console.log("revue !!!!",d.name,d.id,d.revueID,revueLinks);
        revueLinks.forEach(function(k,j){
            d.links.push(k.linkID);
            var node = dataNodesFromDB.find(function(m,n){ return m.nameID == k.linkID});
            d.keywords.push(node.name);
        });
    });
    //console.log("###############");
    //console.log("dataRevue",dataRevue);
    //console.log("###############");
    genDatas();
    databaseLoaded();
}
        
function genJsonDatasForDatabase(){
    console.log("******** DATABASE *********");
    dataRevue.forEach(function(d,i){
       // if(i<5){
            console.log(d);
            var data = new Object();
            data.id = i;
            data.revueID = d.id;
            data.name = d.name;
            data.link = d.link;
            data.yearStart = d.time[0];
            data.yearEnd = d.time[1];
            data.ongoing = false;
            data.frequency = "";
            data.publisher = d.publisher;
            data.city = d.city;
            data.country = d.country;
            data.lat = d.locationCoords[0]; // OR INVERSE ??? - 85 to +85
            data.long = d.locationCoords[1]; // -180 to +180
            data.language_val = "";
            data.language = "";
            data.access_val = "";
            data.access = "";
            data.medium_val = "";
            data.medium = "";
            data.about = d.about;
            data.note = "";
            databaseRevueGen.push(data);
       // }
    });
    console.log("databaseRevueGen",databaseRevueGen);
    d3.select("body").html("<p style='font-size:5px;'>" + JSON.stringify(databaseRevueGen) + "</p>");

}


var fakeText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae quidem ab ducimus molestias deleniti ipsa ullam necessitatibus, voluptatem earum dicta consequatur deserunt veniam eius praesentium maxime et architecto corrupti eos nihil, quibusdam autem nulla? Ut earum quam deserunt aspernatur, molestiae iste, delectus magni. Vero pariatur commodi, in ipsa culpa exercitationem.";

var fakePath = "M850.5839233398438,226.09156799316406L850.5839233398438,226.09156799316406L620.8020629882812,249.03993225097656L687.34375,305.41448974609375L1032.129150390625,402.3718566894531L452.2999572753906,436.69818115234375Z";