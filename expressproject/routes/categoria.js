var express = require('express');
var router = express.Router();
var app = express();

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

/* GET home page. */
router.get('/a_cat/:cat', function(req,res){
	console.log("categorias !!!!!!!!!!!" + req.params.cat);
  	res.render('categoria', { title: 'MiniTwitter', require : require, categoria: req.params.cat });
});

router.get('/cats_user', function(req,res){

    //console.log("ESTOY AQUI" + req.query.categoria);
    var id_categoria = req.query.categoria;

    db.collection('TWITS').find({ categoria_mensaje : id_categoria }).sort({$natural : -1}).limit(3).toArray(function(e,result){
    	if (e) { throw e; }
		else{
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(result));
		}
    });
});

router.get('/cats_tamanio', function(req,res){

    var id_categoria = req.query.categoria;

    db.collection('TWITS').find({ categoria_mensaje : id_categoria }).toArray(function(e,result){
    	if (e) { throw e; }
		else{
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({tamanio: result.length}));
		}
    }); 
});

module.exports = router;