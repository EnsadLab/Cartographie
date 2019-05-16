// here we listen to the server responses

var socket = io.connect('http://localhost:8080');

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


var mcount = 0;
var scount = 0;
var kcount = 0;
var dataLinks = [];
function genDatas(){
    masterNodes.forEach(function(dM,i){
        dM.id = "master"+mcount;
        dataLinks.push({id:dM.id,name:dM.name,parent:dM.id});
        mcount++;
        dM.subCategory.forEach(function(d,i){
            d.id = "sub"+scount;
            dataLinks.push({id:d.id,name:d.name,parent:dM.id});
            scount++;
            d.keywords.forEach(function(d,i){
                d.id = "key"+kcount;
                dataLinks.push({id:d.id,name:d.name,parent:dM.id});
                kcount++;
            })
        })
    });
    //console.log("dataLinks",dataLinks);
    //console.log("masterNodes",masterNodes);
    getWeight();

    nbSubNodes = scount;
    nbKeyNodes = kcount;
}

var fakeLocations = [[2, 48],[-73, 40],[6,46],[-47,-15],[151,-33],[-123,42],[121,31],[37,55]];

var rcount = 0;
var mweight_min = Number.MAX_SAFE_INTEGER;
var mweight_max = 0;
var sweight_min = Number.MAX_SAFE_INTEGER;
var sweight_max = 0;
var kweight_min = Number.MAX_SAFE_INTEGER;
var kweight_max = 0;
function getWeight(){
    var allLinks = [];
    dataRevue.forEach(function(d,i){
        d.id = "revue"+rcount;
        d.links = [];
        d.keywords.forEach(function(k,i){
            var r = dataLinks.filter( function(key) { /*console.log("test",key.name,k);*/return key.name == k; })[0];
            if(r != undefined){
                d.links.push(r.id);
            }else {console.log("-----> undefined",k);}
        });
        if(d.links.length < 3){
            console.log("TODO: consider revues when links are less than 3!",d.links.length);
            d.links.push(d.links[d.links.length-1]);
        }
        allLinks = allLinks.concat(d.links);
        rcount++;

        // FAKING LOCATIONS
        var fakeIndex = getRandomInt(0,8);
        //d.locationCoords = [fakeLocations[fakeIndex][0] + getRandomInt(0,40)-20,fakeLocations[fakeIndex][1] + getRandomInt(0,20)-10 ];
        d.locationCoords = fakeLocations[fakeIndex];

        // FAKING STARTING AND END DATE
        var xStart = getRandomInt(1950,2000);
        var xEnd = getRandomInt(30,50) + xStart;
        xEnd = 2019;
        d.time = [xStart,xEnd];
    });
    //console.log("data",dataRevue);
    allLinks.sort();
    //console.log("allLinks",allLinks);

    
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

    genDatas();
  
    /*
    subNodesMaster0 = getFakeSubCategory("master0");
    subNodesMaster1 = getFakeSubCategory("master1");
    subNodesMaster2 = getFakeSubCategory("master2");
    */
    //dataRevueFake = getDataRevueFake();
}


socket.on('magazines', function(message) {
    console.log('=> server - on magazines: ' + message);
})

var fakeText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae quidem ab ducimus molestias deleniti ipsa ullam necessitatibus, voluptatem earum dicta consequatur deserunt veniam eius praesentium maxime et architecto corrupti eos nihil, quibusdam autem nulla? Ut earum quam deserunt aspernatur, molestiae iste, delectus magni. Vero pariatur commodi, in ipsa culpa exercitationem.";

var fakePath = "M850.5839233398438,226.09156799316406L850.5839233398438,226.09156799316406L620.8020629882812,249.03993225097656L687.34375,305.41448974609375L1032.129150390625,402.3718566894531L452.2999572753906,436.69818115234375Z";