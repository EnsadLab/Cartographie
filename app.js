//var db_files = require('./app_DB.js');
var http = require('http');
var fs = require('fs');
var express = require('express');

var app = express();
var server = require('http').createServer(app); 
var io = require('socket.io').listen(server);
var mysql = require('mysql');

var USE_DB = false;
    
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

if(USE_DB){
    var db = mysql.createConnection({
        host: "localhost",
        user: "cecile",
        password: "abcd1234",
        database: "magazines"
    });

    db.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
}


app.get('/test', function(req, res){  
    res.json({a:1});
});


app.get('/', function (req, res) {
    res.render(__dirname + '/public/views/index.ejs',{vartest: "variable"});
});


io.on('connection', function(client,pseudo) {  

    client.on('getMagazines', function (message) {
        console.log("Client wants to get all magazines");
        if(USE_DB){
            db.query("SELECT name FROM magazine", function (err, result,fields) {
                if (err) throw err;
                console.log(result);
                client.emit('magazines',JSON.stringify(result));
            });
        }
    }); 

});


app.get('/publications', function(req, res) {
    /* 
    client side -> ejs
    <% for(let i = 0; i < publications.length; i++) { %>
    <article>
        <h2><%= publications[i].title %></h1>
        <p><%= publications[i].body %></p>
    </article>
    <% } %>
    */

    //res.setHeader('Content-Type', 'text/plain');
    //res.send('blablablab!');
    //res.render(__dirname + '/public/views/index.ejs',{publications: publications});
});


app.post('/todo/ajouter/', function(req, res) {

})


server.listen(8080);