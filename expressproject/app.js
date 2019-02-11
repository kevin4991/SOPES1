var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriaRouter = require('./routes/categoria');
var usuarioRouter = require('./routes/usuario');

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
