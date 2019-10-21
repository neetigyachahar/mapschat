const spwan = require('child_process').spawn;
const https = require('http');
const url = require('url');
const fs = require('fs');
var express = require('express');
var app = express();
var mysql = require('mysql');
var que;


var con_data = {
    host : "remotemysql.com",
    user : "IHXn51U10d",
    password: "ZZ7sxXwnkE",
    database: "IHXn51U10d",
    "port" : "3306"
};



function handleDisconnect() {
    con = mysql.createConnection(con_data); // Recreate the connection, since
                                                    // the old one cannot be reused.

    con.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }  
                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    con.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }

  handleDisconnect();

que = `create table if not exists chats(sender text, message text, sent_time DATETIME DEFAULT (CONVERT_TZ(NOW(), '+0:00', '+05:30' )));`;
con.query(que, function(err, result){
    if (err) throw err;
    console.log(result);
});
var  relate = {};
var edges = [];  



var appn = https.createServer(function (req, res){
    var q = url.parse(req.url, true);
    var urlobj = q.query;
    console.log(q.pathname);
    if(q.pathname == "/predict"){
        console.log('aa gya');

        var dates = [];
        var area = [];
        var relation = {};
        que = `select dates, area from machine_learning;`;
        con.query(que, function(err, result){
            if (err) throw err;
            var i = 0;
            for ( i in result){
                dates.push(result[i].dates);
                area.push(result[i].area);
            }
            var que = `select * from locations`;
            con.query(que, function(err, result){
                if (err) throw err;
                console.log('iamin');
                var i = 0;
                for (i in result){
                    relation[result[i].id] = result[i].name;
                }
                console.log(relation);
            const pythonProcess1 = spwan('python', ["ml.py", JSON.stringify(dates), JSON.stringify(area)]);
            pythonProcess1.stdout.on('data', (data)=>{
            // var arr = JSON.parse(data);
            // console.log(String(data));
            res.write(`According to past, tomorrow you should go to ${relation[String(data).trim()]}.`);
            res.end();
            dates = [];
            area = [];
            relate = {};  
            });
        });
        });
        return;
    }
    console.log(urlobj.id);
    if(JSON.stringify(urlobj) == "{}"){
        var sor = req.url.slice(1);
        console.log(urlobj.auth);
        if(sor == ''){
            sor = "home.html";
       }
           try{var daat = fs.readFileSync(sor);}
           catch(error) {
               console.log(error);
               var daat = fs.readFileSync('error.html');}
           res.writeHead(200);
           res.write(daat);
           res.end();
       }
       else{
    switch(urlobj.id){
        case '1': {
                console.log("aaya");
                que = `select * from coords;`;
                con.query(que, function(err, result){
                    if (err) throw err;
                    var x;
                    for( x in result){
                        relate[result[x].id] = [parseFloat(result[x].x), parseFloat(result[x].y)];
                    }
                    que = `select x, y, edge from edges;`;
                    con.query(que, function(err, result){
                        var i = 0;
                        for( i in result){
                            edges.push([result[i].x, result[i].y, parseFloat(result[i].edge) ]);
                        }
                        const pythonProcess = spwan('python', ["dijkstra.py", urlobj.src,urlobj.dest, JSON.stringify(relate), JSON.stringify(edges)]);
                        pythonProcess.stdout.on('data', (data)=>{
                        var arr = JSON.parse(data);
                        // console.log(String(data));
                        res.write(data);
                        res.end();
                        relate = {};
                        edges = [];  
                        });
                    });

                });
        }
    }
}
}).listen(process.env.PORT ||8080);





var io = require('socket.io')(appn);
const sjt = io.of('/sjt');
const tt = io.of('/tt');
const smv = io.of('/smv');
const online = io.of('/online');


online.on('connection', function(socket){

    socket.on('getOnline', ()=>{
        console.log("Online -> a : ");
        var data = io.of('/online').sockets;
        data = Object.keys(data).length;
        var sjt = io.of('/sjt').sockets;
        sjt = Object.keys(sjt).length;
        var tt = io.of('/tt').sockets;
        tt = Object.keys(tt).length;
        var smv = io.of('/smv').sockets;
        smv = Object.keys(smv).length;

        var data = {
            online: data,
            sjt: sjt,
            tt: tt,
            smv: smv
        };
        console.log("Online -> a : "+JSON.stringify(data));
        socket.emit('onlineData', JSON.stringify(data));
        socket.broadcast.emit('onlineData', JSON.stringify(data));
    });


    socket.on('disconnect', function(){
        var data = io.of('/online').sockets;
        data = Object.keys(data).length;

        var sjt = io.of('/sjt').sockets;
        sjt = Object.keys(sjt).length;
        var tt = io.of('/tt').sockets;
        tt = Object.keys(tt).length;
        var smv = io.of('/smv').sockets;
        smv = Object.keys(smv).length;

        var data = {
            online: data,
            sjt: sjt,
            tt: tt,
            smv: smv
        };

        // socket.emit('onlineData', JSON.stringify(data));
        socket.broadcast.emit('onlineData', JSON.stringify(data));
        console.log("disconnectioned");
    });
});

sjt.on('connection', function(socket){

    socket.on('b', text=>{
        console.log("SJT -> b : ");
        console.log(text);
        socket.emit('bb');
    });



    socket.on('disconnect', function(){

        console.log("disconnectioned");
    });
});

tt.on('connection', function(socket){
    console.log("TT connected!!");

    socket.on('b', text=>{
        console.log("TT -> b : "+ text);
        socket.emit('bb');
    });



    socket.on('disconnect', function(){

        console.log("disconnectioned");
    });
});

smv.on('connection', function(socket){
    console.log("SMV connected!!");

    socket.on('b', text=>{
        console.log("SMV -> b : "+ text);
        socket.emit('bb');
    });



    socket.on('disconnect', function(){

        console.log("disconnectioned");
    });
});