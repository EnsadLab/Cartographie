var http = require('http');
var fs = require('fs');
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app); 

var auth = require('basic-auth')
var compare = require('tsscmp')


// Basic function to validate credentials for example
function check (name, pass) {
    var valid = true
   
    // Simple method to prevent short-circut and use timing-safe compare
    valid = compare(name, 'personne') && valid
    valid = compare(pass, 'sisi') && valid
   
    return valid
}


var io = require('socket.io').listen(server);
var mysql = require('mysql');

var USE_DB = true;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.urlencoded({ extended: false }));

if(USE_DB){
    var db = mysql.createConnection({
        host: "localhost",
        user: "cecile",
        password: "abcd1234",
        database: "magazines"
    });

    db.connect(function(err) {
        if (err) throw err;
        console.log("DB Connected!");
    });
}

io.on('connection', function(client,pseudo) {  

    client.on('test', function(message){
        console.log("client sends test message");
    });
    client.on('writeIntoTableWaiting', function(message){
        console.log("-> client sends writeIntoTableWaiting message");//,message);
        insertRow("waiting_revues",message.id,undefined,message);
    });
    client.on('writeIntoTableOnline', function(message){
        console.log("-> client sends writeIntoTableOnline message");//,message);
        insertRow("online_revues",message.id,undefined,message);
    });
    client.on('writeIntoNodes',function(message){
        console.log("-> client sends writeIntoNodes message", message);
        insertRowNode(message);
    });
    client.on('writeIntoLinks',function(revueID,linkID){
        console.log("-> client sends writeIntoLinks message",revueID,linkID);
        insertRowLinks(revueID,linkID);
    });
    client.on('getAllRevuesWaiting',function(message){
        console.log("-> client sends getAllRevuesWaiting message");
        var db_query =  "SELECT * FROM waiting_revues";
        
        db.query(db_query, function(err,result,fields){
            if(err)throw err;
            else {
                //console.log("result",result);
                client.emit("allRevuesWaiting",result);
            };
        });
    });
    client.on('getAllRevuesOnline',function(message){
        console.log("-> client sends getAllRevuesOnline message");
        var db_query =  "SELECT * FROM online_revues";
        
        db.query(db_query, function(err,result,fields){
            if(err)throw err;
            else {
                //console.log("result",result);
                client.emit("allRevuesOnline",result);
            };
        });
    });
    client.on('getAllNodes',function(message){
        console.log("-> client sends getAllNodes message");
        var db_query = "SELECT * FROM nodes";
        db.query(db_query, function(err,result,fields){
            if(err)throw err;
            else {
                //console.log("result",result);
                client.emit("allNodes",result);
            };
        });
    });
    client.on('getAllLinks',function(message){
        console.log("-> client sends getAllLinks message");
        var db_query = "SELECT * from links";
        db.query(db_query, function(err,result,fields){
            if(err)throw err;
            else {
                console.log("result",result);
                client.emit("allLinks",result);
            };
        });
    });
    client.on('getWaitingRevue',function(message){
        console.log("-> client sends getRevue message",message);
        var db_query =  "SELECT * FROM waiting_revues WHERE revueID = '" + message + "'";
        db.query(db_query, function(err,result,fields){
            if(err)throw err;
            else {
                client.emit("revueWaiting",result[0]);
            };
        });
    });
    client.on('getOnlineRevue',function(message){
        console.log("-> client sends getRevue message",message);
        var db_query =  "SELECT * FROM online_revues WHERE revueID = '" + message + "'";
        db.query(db_query, function(err,result,fields){
            if(err)throw err;
            else {
                client.emit("revueOnline",result[0]);
            };
        });
    });


});


app.get('/test', function(req, res){  
    console.log("/test");
    res.json({a:1});
});


app.get('/', function (req, res){
    console.log("/");
    //res.render(__dirname + '/public/views/index.ejs',{vartest: "variable"});
    var credentials = auth(req);
    // Check credentials
    // The "check" function will typically be against your user store
    if (!credentials || !check(credentials.name, credentials.pass)) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="pas de chance."')
        res.end('<html><body></body></html>')
    } else {
        if(USE_DB){
            db.query("SELECT * FROM magazine", function (err, result,fields) {
                if (err) throw err;
                //console.log(result);
                //console.log(JSON.stringify(result));
                //client.emit('magazines',JSON.stringify(result));
            });
        }
        res.render(__dirname + '/public/views/index.ejs',{vartest: "variable"});
        // TODO debug: every "get" is called twice... check this...
        // next();
    }
    
})

// CMS
var isCreateNew = false;
var isWaiting = false;
var revueID = 0;
// if we want to test some stuff
app.get('/cms/', function(req, res) {
    console.log("/cms");
    var credentials = auth(req);
    // Check credentials
    // The "check" function will typically be against your user store
    if (!credentials || !check(credentials.name, credentials.pass)) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="pas de chance."')
        res.end('<html><body></body></html>')
    } else {
        if(USE_DB){

            /*
            db.query("INSERT INTO magazine VALUES ()", function(err,result,fields){
                if(err) throw err;

            });
            */

            //insertRow_waiting(0,undefined);
           // deleteTable_waiting();
            //deleteRow_waiting();
            //insertFromJsonToDB();

            db.query("SELECT * FROM magazine", function (err, result,fields) {
                if (err) throw err;
                //console.log(result);
                //console.log(JSON.stringify(result));
                //client.emit('magazines',JSON.stringify(result));
            });
        }
        res.render(__dirname + '/public/views/cms.ejs',{vartest: "variable"});
    }

   
    /*const postBody = req.body;
    console.log(postBody);
    console.log(postBody.name);
    res.render(__dirname + '/public/views/cms.ejs',{vartest: "variable"});
    */
})

// 
app.post('/cms/cancel', function(req, res) {
    console.log("/cms/cancel");
    //const postBody = req.body;
    //console.log(postBody);
    //console.log("name",postBody.name);
})

app.post('/cms/delete', function(req, res) {
    console.log("/cms/delete");
    const postBody = req.body;

    retrieveHiddenVariables(postBody);
    //var revueID = 0;
    if(isWaiting){ // delete row in table WAITING and ONLINE
        deleteRow_waiting(revueID,true,req,res);
        //deleteRow_online(revueID,true,req,res);
    }
    else { // delete row in table ONLINE
        deleteRow_online(revueID,true,req,res);
    }
})

// SAVE without POST
app.post('/cms/savewaiting', function(req, res) {
    
    console.log("/cms/savewaiting");

    const postBody = req.body;
    retrieveHiddenVariables(postBody);

    // TODO NOW CECILE
    insertRowFromForm('waiting_revues',revueID,postBody,true,req,res);
    // if not yet in the database, should we add it to the menu automatically => @Alex? -> client side ...

})


// POST button
app.post('/cms/save', function(req, res) {

    console.log("/cms/save");

    const postBody = req.body;
    retrieveHiddenVariables(postBody);

    if(isWaiting && !isCreateNew){
        console.log("should delete row!!");
        deleteRow_waiting(revueID,false);
    }
    // TODO NOW CECILE
    insertRowFromForm("online_revues",revueID,postBody,true,req,res);
})

function retrieveHiddenVariables(postBody){
    isCreateNew = postBody.isCreateNew;
    isWaiting = postBody.isWaiting;
    revueID = postBody.revueID;
    console.log("Variable isCreateNew:",isCreateNew);
    console.log("Variable isWaiting:",isWaiting);
}

// function used when called from internal json file
function insertRow(tableName,revueID,postBody,d){
    var year_start = 0; var year_end = 0;
    var lat = 0; var long = 0;
   // d.name = "Alliage";
    if(d.time != undefined) {year_start = d.time[0]; year_end = d.time[1];}
    if(d.locationCoords != undefined) {lat = d.locationCoords[0]; long = d.locationCoords[1];}
    // revueID is a UNIQUE index in the DB
    var db_query = "REPLACE INTO " + tableName +  
            " (`revueID`, `name`,`link`,`year_start`, `year_end`,`ongoing`, `frequency`, `publisher`,`city`,`country`,`lat`,`long`,`about`)" + //,`city`,`country`,`about`) " + 
            "VALUES ('"+revueID+"', '" + d.name + "', '" + d.link + "','" + year_start + "','" + year_end + "','0','','"+ d.publisher + "','" + d.city + "','" + d.country + "','" + lat + "','" + long + "','" + "ABOUT" + "' )"; 

    console.log("DBQUERY: ",db_query);

    db.query(db_query, function(err,result,fields){
        if(err) {console.log("could not insert",d.name);throw err};
        //else console.log("db query succeeded!",result);
    });
}

// function used when called from using the cms formular
function insertRowFromForm(tableName,revueID,d,reload,req,res){

    console.log("postBody",d);
    
    var db_query = "REPLACE INTO " + tableName +  
    " (`revueID`, `name`,`link`,`year_start`, `year_end`,`ongoing`, `frequency`, `publisher`,`city`,`country`,`lat`,`long`,`about`)" + //,`city`,`country`,`about`) " + 
    "VALUES ('"+revueID+"', '" + d.name + "', '" + "www.ll.at" + "','" + d.year_start + "','" + d.year_end + "','0','','','" + d.city + "','" + d.country + "','" + d.lat + "','" + d.long + "','" + "ABOUT" + "' )"; 

    console.log("DBQUERY: ",db_query);
    

    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("db query succeeded!",result);
        if(reload){
            res.redirect(req.get('referer'));
        }
    });
}


function insertRow_online(revueID,postBody){
    // UPDATE or CREATE row in TABLE ONLINE_REVUES ... with revueID and elements of postBody
}

function deleteRow_waiting(revueID,reload,req,res){
    // DELETE ROW from table WAITING_REVUES .... with revueID
    var db_query = "DELETE FROM waiting_revues WHERE `revueID` = '" + revueID + "'";
    console.log("DB QUERY: ",db_query);
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("DB: deleteRow_waiting() query succeeded!");
        if(reload){
            //res.render(__dirname + '/public/views/index.ejs',{vartest: "variable"});
            res.redirect(req.get('referer'));
        }
    });
}


function deleteRow_online(revueID,reload,req,res){
    // DELETE ROW from table ONLINE_REVUES .... with revueID
    var db_query = "DELETE FROM online_revues WHERE `revueID` = '" + revueID + "'";
    console.log("DB QUERY: ",db_query);
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("DB: deleteRow_online() query succeeded!");
        if(reload){
            res.render(__dirname + '/public/views/cms.ejs',{vartest: "variable"});
            res.redirect(req.get('referer'));
        }
    });
}

function deleteTable_waiting(){
    var db_query = "DELETE FROM waiting_revues";
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("DB: deleteTable_waiting() query succeeded!");
    });
}

function deleteTable_online(){
    var db_query = "DELETE FROM online_revues";
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("DB: deleteTable_online() query succeeded!");
    });
}

function insertRowNode(d){
    var db_query = "REPLACE INTO `nodes` (`parentNameID`, `nameID`, `name`) VALUES ('" + d.parent + "', '" + d.id + "', '" + d.name + "')";
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("DB: insertRowNode() query succeeded!");
    });
}

function insertRowLinks(revueID,linkID){
    var db_query = "REPLACE INTO `links` (`revueID`, `linkID`) VALUES ('" + revueID + "', '" + linkID + "')";
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("DB: insertRowLinks() query succeeded!");
    });
}




function createTables(){

    /*
    CREATE TABLE `magazines`.`waiting_revues` (`ID` INT NOT NULL,PRIMARY KEY (`ID`));
    
    ALTER TABLE `magazines`.`waiting_revues` 
    CHANGE COLUMN `ID` `ID` INT(11) NOT NULL AUTO_INCREMENT ;

    ALTER TABLE `magazines`.`waiting_revues` 
    ADD UNIQUE INDEX `revueID_UNIQUE` (`revueID` ASC) VISIBLE;
    ;

    
    */

    /*
    ALTER TABLE `magazines`.`online_revues` 
    ADD COLUMN `revueID` VARCHAR(45) NULL AFTER `ID`,
    ADD COLUMN `name` VARCHAR(45) NULL AFTER `revueID`,
    ADD COLUMN `link` VARCHAR(45) NULL AFTER `name`,
    ADD COLUMN `year_start` INT NULL AFTER `link`,
    ADD COLUMN `year_end` VARCHAR(45) NULL AFTER `year_start`,
    ADD COLUMN `ongoing` INT NULL AFTER `year_end`,
    ADD COLUMN `frequency` VARCHAR(45) NULL AFTER `ongoing`,
    ADD COLUMN `publisher` VARCHAR(45) NULL AFTER `frequency`,
    ADD COLUMN `city` VARCHAR(45) NULL AFTER `publisher`,
    ADD COLUMN `country` VARCHAR(45) NULL AFTER `city`,
    ADD COLUMN `lat` INT NULL AFTER `country`,
    ADD COLUMN `long` INT NULL AFTER `lat`,
    ADD COLUMN `language` VARCHAR(45) NULL AFTER `long`,
    ADD COLUMN `access` VARCHAR(45) NULL AFTER `language`,
    ADD COLUMN `medium` VARCHAR(45) NULL AFTER `access`,
    ADD COLUMN `about` VARCHAR(45) NULL AFTER `medium`,
    ADD COLUMN `peer_review` VARCHAR(45) NULL AFTER `about`,
    ADD COLUMN `note` VARCHAR(45) NULL AFTER `peer_review`;
    */

    /*
    CREATE TABLE `magazines`.`nodes` (
        `ID` INT NOT NULL AUTO_INCREMENT,
        `parentNameID` VARCHAR(100) NULL,
        `nameID` VARCHAR(100) NULL,
        `name` VARCHAR(300) NULL,
        `x` INT NULL,
        `y` INT NULL,
        `c` VARCHAR(45) NULL,
        `angle` INT NULL,
        PRIMARY KEY (`ID`),
        UNIQUE INDEX `nameID_UNIQUE` (`nameID` ASC) VISIBLE);


    INSERT INTO `magazines`.`nodes` (`parentNameID`, `nameID`) VALUES ('masterTest0', 'subTest1');

    */

    /*

    CREATE TABLE `magazines`.`links` (
        `ID` INT NOT NULL AUTO_INCREMENT,
        `revueID` VARCHAR(45) NULL,
        `linkID` VARCHAR(45) NULL,
            PRIMARY KEY (`ID`));
    */

}

server.listen(8080);

/*


function insertRow_waiting(revueID,postBody){
    // UPDATE or CREATE row in TABLE WAITING_REVUES ... with revueID and elements of postBody
    // INSERT INTO `magazines`.`magazine` 
    //        (`idmagazine`, `name`, `link`, `year_start`, `year_end`, `lat`) 
    //        VALUES ('3', 'revueTest', 'www.test.com', '1980', '1988', '45');
    console.log("INSERT INTO ROW -> insertRow_waiting()");
    var db_query = "INSERT INTO magazine" + 
                    " (`idmagazine`, `name`, `link`, `year_start`, `year_end`, `lat`, `long`) " + 
                    " VALUES ('4', 'revueTest2', 'www.test2.com', '1981', '1989', '46', `89`); ";
    
    //db_query = "INSERT IGNORE INTO magazine" + 
    db_query = "REPLACE INTO magazine" + 
                    " (`idmagazine`,`name`,`link`, `year_start`, `year_end`, `lat`, `long`) " + 
                    " VALUES ('11','test','www.f.com','1980','1982','45','66'); ";
    
    db_query = "REPLACE INTO magazine" + 
                    " (`idmagazine`,`name`,`link`, `year_start`, `year_end`, `lat`, `long`) " + 
                    " VALUES ('11','test','www.f.com','1980','1982','45','66'); ";


db_query = "INSERT INTO waiting_revues " + 
            "(`revueID`) " + 
            
            "VALUES ('revue1')";
/*
            "(`revueID`, `name`, `link`, " + 
            "`year_start`, `year_end`, `ongoing`, `frequency`, `publisher`, "+
            "`city`, `country`, `lat`, `long`, `language`, " +
            "`access`, `medium`, `about`, `peer_review`, `note`) " + 

            "VALUES ('revue0', 'atest', 'ww', " +
            "'1980', '1981', '0', 'bla', 'pub', " +
            "'genf', 'CH', '88', '99', 'FR', " +
            "'print', 'onlin', 'bb', '1', 'notenot')";*/
/*
            db.query(db_query, function(err,result,fields){
                if(err) throw err;
                else console.log("db query succeeded!");
            });
        }
*/