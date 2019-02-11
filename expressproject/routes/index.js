var express = require('express');
var router = express.Router();
var app = express();

/*
var WebSocketServer = require('websocket').server;
var http = require('http');
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(5000, function() {
    console.log((new Date()) + ' Server is listening on port 5000');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: true
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', function(message) {
    	console.log('Mensaje');
    	connection.sendUTF('LLEGO PERRA');
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

/*
var expressWs = require('express-ws')(app);
app.ws('/',function(ws,req){
	ws.on('message',function (msg) {
		console.log(msg);
	});
	//console.log('socket',req.testing);
});

app.listen(5000);

*/

var net = require('net');


var HOST = '127.0.0.1'; // parameterize the IP of the Listen
var PORT = 5000; // TCP LISTEN port

//conexion con mongodb

/*
var MongoClient = require('mongodb').MongoClient;
var Servidor = require('mongodb').Server;
var mongoCliente = new MongoClient(new Servidor('localhost',27017));
*/

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


/*
const db_n = MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, 
		function(err, db) {
			if (err) {
				//throw err;
				return null;
			}else{
				return db;
				//db_n = db;
			}
		}
	);
*/


// Create an instance of the Server and waits for a conexão
net.createServer(function(sock) {

  // Receives a connection - a socket object is associated to the connection automatically
  //console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);


  // Add a 'data' - "event handler" in this socket instance
  sock.on('data', function(data) {
	  // data was received in the socket 
	  // Writes the received message back to the socket (echo)
	  
	  //TRATAMIENTO DE LA CADENA

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

	  	
		var coleccion = db.collection('TWITS');
		coleccion.insertOne(registro);		

/*
		var MongoClient = require('mongodb').MongoClient;

		MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, db) {
			if (err) {
				throw err;
			}else{

				const dbs = db.db('twitter');
				var coleccion = dbs.collection('TWITS');
				coleccion.insertOne(registro);

			}

			//console.log("-- USR => " + usuario + "\n : NOMBRE => " + nombre + "\n : TEXTO = " + texto + " : espacios => " + arr.length + " : categoria=> " + categoria + "\n");
		});
		*/
	  }else{
	  	//console.log("Mensaje incorrecto, la cadena enviada no es reconocida!!");
	  }



	  /*
		var MongoClient = require('mongodb').MongoClient;

		MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, db) {
		  if (err) {
		    throw err;
		  }

		  const dbs = db.db('twitter');

		  dbs.collection('TWITS').find().toArray(function(err, result) {
		    if (err) {
		      throw err;
		    }
		    console.log(result);
		  });

		});
		*/

	  //sock.write(data);
  });

  sock.on('message', function(msg){
  	console.log(msg);
  });

  // Add a 'close' - "event handler" in this socket instance
  sock.on('close', function(data) {
	  // closed connection
	  //console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
  });


}).listen(PORT, HOST);


console.log('Server listening on ' + HOST +':'+ PORT);

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'MiniTwitter', require : require });
  console.log("Inicio");
});

router.get('/kks', function(req,res) {
//res.render('index', { title : 'COSA', require : require});
	
	db.collection('TWITS').find().sort({$natural : -1}).limit(5).toArray(function(err, result) {
		      if (err) { throw err; }
		      else{
			    //console.log(result);
			    //res.statusCode = 200;
				//res.setHeader('Content-Type', 'text/plain');
    			res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(result));
		      }
		    });
/*
	var MongoClient = require('mongodb').MongoClient;
  	MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser : true},function(err, database) { 
		    if(err) throw err;
		    db = database.db('twitter');
		    db.collection('TWITS').find().sort({$natural : -1}).limit(5).toArray(function(err, result) {
		      if (err) { throw err; }
		      else{
			    //console.log(result);
			    //res.statusCode = 200;
				//res.setHeader('Content-Type', 'text/plain');
    			res.setHeader('Content-Type', 'application/json');
				res.send(JSON.stringify(result));
		      }
		    });
		}
   );
  	*/
});

router.get('/totales1', function(req,res){
	db.collection('TWITS').find().count(function(e,count){
		if(e){ throw e;}
		else{
			//console.log("VAMOS PARA TOTAL DE TWITS" + count);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({total_twits:count}));
		}
	});
});


router.get('/totales2', function(req,res){
	db.collection('TWITS').distinct('alias_usuario',function(err,docs){
		if(err){  console.log("error 2");throw err;}
		else{
			//console.log("VAMOS PARA TOTAL DE usuarios" + docs.length);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({total_usuarios:docs.length}));
		}

	});
});


router.get('/totales3', function(req,res){

	db.collection('TWITS').distinct('categoria_mensaje',function(err,docs){
		if(err){  console.log("error 3");throw err;}
		else{
			//console.log("VAMOS PARA TOTAL DE usuarios" + docs.length);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({total_categorias:docs.length}));
		}

	});
});

module.exports = router;