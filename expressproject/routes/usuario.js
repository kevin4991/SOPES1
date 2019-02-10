var express = require('express');
var router = express.Router();
var app = express();

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db;

MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser : true},
	function(err, database) {
		if(err) throw err;
		db = database.db('twitter');
  		// Start the application after the database connection is ready
	}
);

/* GET home page. */
router.get('/a_us/:us', function(req,res){
	console.log("usuarios !!!!!!!!!!!" + req.params.us);
  	res.render('usuario', { title: 'MiniTwitter', require : require , usuario : req.params.us });
});

router.get('/us_cantidad', function(req,res){
	var id_usuario = req.query.usuario;

	db.collection('TWITS').find({ alias_usuario : id_usuario }).sort({$natural : -1}).toArray(function(e,result){
    	if (e) { throw e; }
		else{
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({tamanio : result.length}));
		}
    });	

});

router.get('/us_usuario', function(req,res){
	var id_usuario = req.query.usuario;
	db.collection('TWITS').find({ alias_usuario : id_usuario }).sort({$natural : -1}).limit(1).toArray(function(e,result){
		
    	if (e) { throw e; }
		else{
			if(result.length == 1){
				var valor = result[0]['nombre_usuario'];
				res.setHeader('Content-Type', 'application/json');	
				res.send(JSON.stringify({alias : valor}));	
			}
		}
    });	
});

router.get('/us_twits', function(req, res){
	var id_usuario = req.query.usuario;

	//console.log("PROBANDO: " + id_usuario);

	db.collection('TWITS').find({ alias_usuario : id_usuario }).sort({$natural : -1}).limit(3).toArray(function(e,result){
    	if (e) { throw e; }
		else{
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(result));
		}
    });
});


module.exports = router;