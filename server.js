var http = require('http');
var fs = require('fs');
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app); 

var auth = require('basic-auth')
var compare = require('tsscmp')

const nodemailer = require('nodemailer');

var winston = require('winston');

const logConfiguration = {
    'transports' : [
        new winston.transports.File({
            filename: 'winston_log.log',
            level: 'debug'
        })
    ]
}

const logger = winston.createLogger(logConfiguration);


// Basic function to validate credentials for example
function check (name, pass) {
    var valid = true
   
    // Simple method to prevent short-circut and use timing-safe compare
    valid = compare(name, 'personne') && valid
    valid = compare(pass, 'sisi') && valid
   
    return valid;
}


//var io = require('socket.io').listen(server);
var mysql = require('mysql');

var USE_DB = true;
var USE_LOCAL = true;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.urlencoded({ extended: false }));

if(USE_DB){
    if(USE_LOCAL){
        db = mysql.createConnection({
            host: "localhost",
            user: "cecile",
            password: "abcd1234",
            database: "magazines",
            multipleStatements: true,
        });
    }else{
       db = mysql.createConnection({
            host: database__connection__host,
            user: database__connection__user,
            password: database__connection__password,
            database: database__connection__database,
            multipleStatements: true,
        });
    }
    var db_connected = false;
    if(!db_connected){
        db.connect(function(err) {
            if (err) throw err;
            else {
                logger.info("DB connected!");
                console.log("DB Connected!");
                db_connected = true;
            }
        })
    }
}


app.get('/test', function(req, res){  
    console.log("/test");
    logger.info("/test");
    var sql = "SELECT * FROM online_revues; SELECT * FROM waiting_revues; SELECT * FROM nodes";

    db.query(sql, function(error, results, fields) {
        if (error) {
            throw error;
        }
        //console.log(results[0]);
        //console.log(results[1]);
        //console.log(results[2]);
        logger.info("database OK");
        res.render(__dirname + '/public/views/cms.ejs',{data_online: results[0], data_waiting: results[1], nodes: results[2]});
    });
    // res.json({a:1});
});


app.get('/', function (req, res){
    console.log("/");
    logger.info("/");
    if(USE_DB){
        var sql = "SELECT * FROM nodes; SELECT * FROM online_revues; SELECT * FROM online_links";
        db.query(sql, function(error, results, fields) {
            if (error) {
                throw error;
            }
            //console.log(results[0]);
            //console.log(results[1]);
            //console.log(results[2]);
            logger.info("database OK");
            res.render(__dirname + '/public/views/index.ejs',{data_node: results[0], data_revue: results[1], data_links: results[2]});
        });
    }
    //res.render(__dirname + '/public/views/index.ejs',{vartest: "variable"});
})

// CMS
var isCreateNew = false;
var isWaiting = false;
var revueID = 0;

app.get('/cms/', function(req, res) {
    console.log("/cms");
    logger.info("/cms");
    var credentials = auth(req);
    // Check credentials
    // The "check" function will typically be against your user store
    if (!credentials || !check(credentials.name, credentials.pass)) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="pas de chance."')
        res.end('<html><body></body></html>')
    } else {
        if(USE_DB){
            var sql = "SELECT * FROM online_revues; SELECT * FROM waiting_revues; SELECT * FROM nodes";
            db.query(sql, function(error, results, fields) {
                if (error) {
                    throw error;
                }
                //console.log(results[0]);
                //console.log(results[1]);
                //console.log(results[2]);
                logger.info("DB cms datas have been received");
                res.render(__dirname + '/public/views/cms.ejs',{data_online: results[0], data_waiting: results[1], nodes: results[2]});
            });
        }
    }
})


// get revue
app.post('/cms/revue', function(req, res) {
    console.log("client wants to get infos about revue");
    const postBody = req.body;
    console.log("revueID",postBody.revueID,postBody.type);
    var db_query;
    if(postBody.type == "online"){
        db_query = "SELECT * from online_links WHERE revueID = '" + postBody.revueID + "'";
    }else{
        db_query = "SELECT * from waiting_links WHERE revueID = '" + postBody.revueID + "'";
    }
    db.query(db_query, function(err,result,fields){
        if(err)throw err;
        else {
            //client.emit("revueKeywordsOnline",result);
            console.log("response",result);
            logger.info("DB selected revue datas has been received");
            res.send(result);
        };
    });
})

// cancel
app.post('/cms/cancel', function(req, res) {
    console.log("/cms/cancel");
    logger.info("/cms/cancel");
    if(!USE_DB) res.redirect(req.get('referer'));
    //const postBody = req.body;
    //console.log(postBody);
    //console.log("name",postBody.name);
    res.redirect(req.get('referer'));
})

app.post('/cms/delete', function(req, res) {
    console.log("/cms/delete");
    logger.info("/cms/delete");
    if(!USE_DB) res.redirect(req.get('referer'));
    console.log("/cms/delete");
    const postBody = req.body;

    retrieveHiddenVariables(postBody);
    if(isWaiting){ // delete row in table WAITING and ONLINE
        deleteRow('waiting_revues','waiting_links',revueID,true,req,res);
    }
    else { // delete row in table ONLINE
        deleteRow_online('online_revues','online_links',revueID,true,req,res);
    }
})

// SAVE without POST
app.post('/cms/savewaiting', function(req, res) {
    
    console.log("/cms/savewaiting");
    logger.info("/cms/savewaiting");
    if(!USE_DB) res.redirect(req.get('referer'));
    
    console.log("/cms/savewaiting");

    const postBody = req.body;
    retrieveHiddenVariables(postBody);

    // TODO NOW CECILE
    insertRowFromForm('waiting_revues','waiting_links',revueID,postBody,true,req,res);

})


// POST button
app.post('/cms/save', function(req, res) {

    console.log("/cms/save");
    logger.info("/cms/save");
    if(!USE_DB) res.redirect(req.get('referer'));

    console.log("/cms/save");

    const postBody = req.body;
    retrieveHiddenVariables(postBody);

    //console.log("blup???",isWaiting,isCreateNew);
    //if(isWaiting && !isCreateNew){
    //if(isCreateNew && isWaiting){
    // BUG........ ???
    //if(isWaiting){ console.log("1A")} else console.log("1B");
    //if(isCreateNew){console.log("2A");} else console.log("2B");
    //if(!isCreateNew && isWaiting) console.log("blup 1");
    //if(isWaiting && !isCreateNew) console.log("blup 2");
    //if(isWaiting && !isCreateNew){
    if(isWaiting){
        console.log("should delete row!!");
        deleteRow('waiting_revues','waiting_links',revueID,false);
    }
    // TODO NOW CECILE
    insertRowFromForm("online_revues","online_links",revueID,postBody,true,req,res);

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

    d.about = d.about.replace("'","\'");
    // revueID is a UNIQUE index in the DB
    var db_query = "REPLACE INTO " + tableName +  
            " (`revueID`, `name`,`link`,`year_start`, `year_end`,`ongoing`, `frequency`, `publisher`,`city`,`country`,`lat`,`long`,`about`)" + //,`city`,`country`,`about`) " + 
            "VALUES ('"+revueID+"', '" + (d.name) + "', '" + (d.link) + "','" + year_start + "','" + year_end + "','0','','"+ d.publisher + "','" + d.city + "','" + d.country + "','" + lat + "','" + long + "','" + d.about + "' )"; 

    console.log("DBQUERY: ",db_query);

    db.query(db_query, function(err,result,fields){
        if(err) {console.log("could not insert",d.name);throw err};
        //else console.log("db query succeeded!",result);
    });
}

// function used when called from using the cms formular
function insertRowFromForm(tableNameRevue,tableNameLink,revueID,pB,reload,req,res){

    console.log("postBody",pB);


    if(pB.year_end == '') pB.year_end = 0;
    if(pB.ongoing) {pB.ongoing = 1;}else {pB.ongoing = 0;};
    if(pB.pr == "yes") pB.pr = 1; else pB.pr = 0;
    console.log("ABOUT",pB.about);
    pB.about = pB.about.replace(/'/g,"\\'");
    console.log("ABOUT",pB.about);
    pB.note = pB.note.replace(/'/g,"\\'");
    pB.name = pB.name.replace(/'/g,"\\'");
    pB.link = pB.link.replace(/'/g,"\\'");
    //var test = mysql.escape(pB.about);
    //console.log("ABOUT TEST",test);
    // TODO... write into table tableName - waiting_revues or online_revues
    // revueID is a UNIQUE index in the DB
    // lat and long are inversed!!! -> "normal...."
    var db_query = "REPLACE INTO " + tableNameRevue +  
            " (`revueID`, `name`,`link`,`year_start`, `year_end`,`ongoing`, `frequency`, `publisher`,`city`,`country`,`lat`,`long`,`language`,`access`,`medium`,`peer_review`,`about`,`note`)" + //,`city`,`country`,`about`) " + 
            "VALUES ('"+revueID+"', '" + pB.name + "', '" + pB.link + "','" + pB.year_start + "','" + pB.year_end + 
            "','" + pB.ongoing + "','" + pB.frequency + "','"+ pB.publisher + "','" + pB.city + "','" + pB.country + 
            "','" + pB.long + "','" + pB.lat + "','"  + pB.language + "','" + pB.access + "','" + pB.medium + 
            "','" + pB.pr + "','" + pB.about + "','" + pB.note + "' )"; 

    console.log("DBQUERY: ",db_query);

    db.query(db_query, function(err,result,fields){
        if(err) {console.log("could not insert",pB.name);throw err}
        else console.log("db query succeeded!");
    });

    // retrieve keywords from revue
    var keywords = [];
    // careful... ideally, we should retrieve these values from the database.. same in cms.js
    var nbM = 3;
    var nbS = 25;
    var nbK = 53;
    for(var i=0; i<nbM; i++){
        var keyM = "master" + i;
        if(pB[keyM]){ keywords.push(keyM);}
    }
    for(var i=0;i<nbS; i++){
        var keyS = "sub" + i;
        if(pB[keyS]){ keywords.push(keyS); }
    }
    for(var i=0;i<nbK; i++){
        var keyK = "key" + i;
        if(pB[keyK]){ keywords.push(keyK); }
    }
    console.log(revueID,keywords);

    var db_query = "SET SQL_SAFE_UPDATES=0;";
    db_query += "DELETE FROM " + tableNameLink + " WHERE `revueID` = '" + revueID + "';";
    keywords.forEach(function(d,i){
       db_query += "INSERT INTO " + tableNameLink + " (`revueID`, `linkID`) VALUES ('" + revueID + "','" + d + "');";
    });
    db_query += "SET SQL_SAFE_UPDATES=1;";

    console.log("db_query",db_query);
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("db query succeeded!"); 
    });

    res.redirect(req.get('referer'));

}


function deleteRow(tableNameRevue, tableNameLink, revueID,reload,req,res){
    // DELETE ROW from table WAITING_REVUES .... with revueID
    var db_query = "DELETE FROM " + tableNameRevue + " WHERE `revueID` = '" + revueID + "'";
    console.log("DB QUERY: ",db_query);
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("DB: deleteRow query succeeded!");
        if(reload){
            res.redirect(req.get('referer'));
        }
    });

    db_query = "SET SQL_SAFE_UPDATES=0;";
    db_query += "DELETE FROM " + tableNameLink + " WHERE `revueID` = '" + revueID + "';";
    db_query += "SET SQL_SAFE_UPDATES=1;";

    console.log("db_query",db_query);
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("db query succeeded!"); 
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

function insertRowLinks(tableName, revueID,linkID){
    var db_query = "REPLACE INTO `" + tableName + "` (`revueID`, `linkID`) VALUES ('" + revueID + "', '" + linkID + "')";
    db.query(db_query, function(err,result,fields){
        if(err) throw err;
        else console.log("DB: insertRowLinks() query succeeded!");
    });
}

// ******************** FORMULAIRE ****************************
// journal submit
app.post('/submit',function(req,res){
    console.log("submit journals!");
    logger.info("/submit");
    const postBody = req.body;
    console.log(postBody);
    //console.log("name",postBody.name);
    var bodyEmail = parseFormular(postBody);
    console.log("Email:");
    console.log(bodyEmail);
    console.log("=> To be sent to:",postBody.user_name,postBody.user_email);
    logger.info("=> To be sent to:",postBody.user_name,postBody.user_email); // check.. not sure if works
    sendEmail(postBody.user_email,bodyEmail);
    res.redirect(req.get('referer'));
});

function sendEmail(email,text){
    console.log("--> sending email ");
    logger.info("--> sending email ");
    let transport = nodemailer.createTransport({
        host: 'art-design-sciences-journals.org',
        port: 2525,
        auth: {
           user: 'cms@art-design-sciences-journals.org',
           pass: '***'
        }
    });
    const message = {
        from: 'cms@art-design-sciences-journals.org', // Sender address
        to: '',         // List of recipients
        subject: 'Design Your Model S | Tesla', // Subject line
        text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
    };
    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}

function parseFormular(pB){


    if(!pB.ongoing) pB.ongoing = "no"; else pB.ongoing = "yes"; 
    if(!pB.pr) pB.pr = "no";

    var message = "Hello!\n\n";

    message += "Journal's name:" + pB.name + "\n";
    message += "Journal's source (link):" + pB.link + "\n";
    message += "Publication since " + pB.year_start + " to " + pB.year_end + "\n";
    message += "Ongoing: " + pB.ongoing + "\n";
    message += "Frequency: " + pB.frequency + "\n";
    message += "Publisher: " + pB.publisher + "\n";
    message += "City: " + pB.city + "\n";
    message += "Language: " + pB.language + "\n";
    message += "Access: " + pB.access + "\n";
    message += "Medium: " + pB.medium + "\n";
    message += "About: " + pB.about + "\n";
    message += "Peer review: " + pB.pr + "\n";
    message += "Note: " + pB.note + "\n\n";
    message += "KEYWORDS:\n";
    // retrieve keywords from revue
    var keywords = [];
    // careful... ideally, we should retrieve these values(nbM,nbS,nbK) from the database.. same in cms.js
    var nbM = 3;
    var nbS = 25;
    var nbK = 53;
    for(var i=0; i<nbM; i++){
        var keyM = "master" + i;
        if(pB[keyM]){ keywords.push(keyM);}
    }
    for(var i=0;i<nbS; i++){
        var keyS = "sub" + i;
        if(pB[keyS]){ keywords.push(keyS); }
    }
    for(var i=0;i<nbK; i++){
        var keyK = "key" + i;
        if(pB[keyK]){ keywords.push(keyK); }
    }
    console.log(revueID,keywords);
    keywords.forEach(function(d,i){
        var name = db_nodes.find(function(k,j){ return k.nameID == d}).name;
        message += name + " (ID = "+ d + ")\n";
    });
    message += "\n";
    message += "Bye.";
    return message;

}

server.listen(8080);

