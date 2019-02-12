var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriaRouter = require('./routes/categoria');
var usuarioRouter = require('./routes/usuario');

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response){
});



var ip = require('ip');

//var HOST = '127.0.0.1'; // parameterize the IP of the Listen
var HOST = ip.address(); // parameterize the IP of the Listen
var PORT = 5000; // TCP LISTEN port


server.listen(PORT,"0.0.0.0");

var wsServer = new WebSocketServer({
  console.log("VIENDO QUE PEDO:" + server.hostname);
  httpServer :server
});


var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db;


MongoClient.connect("mongodb://172.17.0.1:27017", {useNewUrlParser : true},
  function(err, database) {
    if(err) throw err;
    db = database.db('twitter');
      // Start the application after the database connection is ready
  }
);

wsServer.on('request', function(request){

  var connection = request.accept(null , request.origin);

  connection.on('message',function(message){

    var data = message.utf8Data;
    //console.log("llego el mensaje que esperaba");
      var arr = String(data).split("&");
      //console.log("RECIBIDO" + data + ": espacios => " + arr.length);

      if(arr.length == 3){
        var usuario = (arr[0]).split("=")[1];
        var nombre = arr[1].split("=")[1];
        var texto = arr[2].split("=")[1].trim();
        var categoria = texto.split("#")[1].split(" ")[0].trim();

        var registro =  { "alias_usuario" : usuario
                , "nombre_usuario" : nombre
                , "txt_mensaje" : texto
                , "categoria_mensaje" : categoria  
                };

        
        console.log("--->INSERTANDO UN NUEVO REGISTRO DE TWITS!!!");

      var coleccion = db.collection('TWITS');
      coleccion.insertOne(registro);    
    }else{

    }


    //console.log("MENSAJE RECIBIDO" + message.utf8Data);
  });

  connection.on('close', function(connection){

  });

});


var app = express();
/*
var expressWs = require('express-ws');

const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 5000 });
 
server.on('connection', socket => {

	console.log('Conectado!!');

  socket.on('message', message => {
    console.log('received from a client: ${message}');
  });
    socket.send('Hello world!');
});

*/

/*
expressWs(app);

app.ws('/echo', (ws,req) =>{
	ws.on('connection', function(connection){
		console.log("Encendido");
	})

	ws.on('message',function(msg){
		console.log(msg);
	})

	ws.on('close',function(){

	})
});

app.use(express.static('public'));
app.listen(5000, function(){
	console.log("Esperando el puerto 5000");
});
*/
//var expressWs = require('express-ws')(app);
/*
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3030 });
 
server.on('connection', function(socket){
  socket.on('message', function(message) {
    console.log('received from a client: ${message}');
  });
});
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Headers","Accept, Accept-Language, Content-Language, Content-Type");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/',categoriaRouter);
app.use('/',usuarioRouter);

app.use('/kk',function () { console.log("COSA"); });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*
app.post('/a_usuarios', express.bodyParser(), function(req,res){
  res.redirect('/us');
});


app.post('/a_categorias', express.bodyParser(), function(req,res){
  res.redirect('/cat');
});
*/
module.exports = app;
