const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = "mongodb://localhost:27017";
const express = require('express');
const app = express();
const request = require('request');
const iconv = require('iconv-lite');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(function(req,res,next){
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers','*');
	next();
});

MongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true},(err,client) => {
	let db = client.db("MOTS");
	let termes = [];
	db.collection("termes").find().toArray((err, documents) => {
		documents.forEach(element => {
			termes.push(decodeURI(element["t"]));
		});
		termes = stringArraySort(termes);
		console.log("Termes chargés.")
	});

	app.get("/autocomplete/:terme", (req,res) => {
		let terme = decodeURIComponent(req.params.terme);
		let result = termes.filter(function(element) {
			return element.startsWith(terme);
		}).slice(0,5);

		res.end(JSON.stringify(result));
	});

	app.get("/rezo-dump/:terme", (req, res) => {
		let terme = decodeURIComponent(req.params.terme);
		request({encoding: null, uri: "http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel="+terme+"&rel="}, 
			function(error, response, source_code) {
				if (source_code) {
					let utf8 = iconv.decode(new Buffer(source_code), "ISO-8859-1");
					res.end(JSON.stringify({'text': utf8}));
				}
				else {
					res.end(JSON.stringify([]));
				}
			}
			);
	});

	app.get('/rezo-dump/:terme/:typeRelation', (req,res) => {
		let terme = req.params.terme;
		let typeRelation = req.params.typeRelation;
		request({encoding: null, uri: "http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel="+terme+"&rel="+typeRelation+"&relin=norelin"}, 
			function(error, response, source_code) {
				if (source_code) {
					let utf8 = iconv.decode(new Buffer(source_code), "ISO-8859-1");
					res.end(JSON.stringify({'text': utf8}));
				}
				else {
					res.end(JSON.stringify([]));
				}
			}
			);
	});

});

app.listen(8888);

function stringArraySort(array) {
	let arraySorted, arrayTemp;
	arraySorted = [];
	arrayTemp = [];

	array.forEach(element => {
		let element_split = element.split(" ").length;
		let tab_element = nbSpaces(arrayTemp, element_split)[0];
		if (tab_element == undefined) {
			arrayTemp.push({"n": element_split, "t": [element]});
		}
		else {
			tab_element["t"].push(element);
		}
	});
	arrayTemp = arrayTemp.sort(function(a,b) {
		return a['n'] - b['n'];
	});
	arrayTemp.forEach(element => {
		element["t"].sort(function(a,b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		});
		arraySorted = arraySorted.concat(element["t"]);
	});
	return arraySorted;
}

function nbSpaces(array, nbSpaces) {
	let result = array.filter(function(element) {
		return element['n'] == nbSpaces;
	});
	return result;
}