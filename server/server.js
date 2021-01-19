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

	app.get("/autocomplete/:terme", (req,res) => {
		let terme = encodeURIComponent(req.params.terme);
		db.collection("termes").find({"t": new RegExp("^"+terme,'i')}).limit(5).toArray((err, documents) => {
			res.end(JSON.stringify(documents));
		});
	});

	app.get("/raffinements/:terme", (req, res) => {
		let terme = decodeURIComponent(req.params.terme);
		let result;
		result = termes.filter(function(element) {
			return element.startsWith(terme+">") && !(element.includes(encodeURIComponent(":")));
		}).map(function(element) {
			return element.split(terme+">")[1]
		}).sort();
		res.end(JSON.stringify(result));
	});

	app.get("/rezo-dump/:terme", (req, res) => {
		let terme = decodeURIComponent(req.params.terme);
		request({encoding: null, uri: "http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel="+terme+"&rel="},
			function(error, response, source_code) {
				if (source_code) {
					let utf8 = iconv.decode(new Buffer.from(source_code), "ISO-8859-1");
					res.end(JSON.stringify({'text': utf8, 'cache': false}));
				}
				else {
					res.end(JSON.stringify([]));
				}
			}
			);
	});

	app.get('/cache', (req, res) => {
		db.collection("cacheRelations").find().toArray((err, documents) => {
			res.end(JSON.stringify(documents));
		});
	});

	app.get('/rezo-dump/:terme/:typeRelation', (req,res) => {
		let terme = req.params.terme;
		let typeRelation = req.params.typeRelation;
		db.collection("cacheRelations").find({"t": terme}).toArray((err, documents) => {
			// Des relations du mot sont stockees en cache
			if (documents.length > 0) {
				let relations = documents[0];
				// La relation du mot est stockee en cache
				if (relations[typeRelation] != undefined) {
					res.end(JSON.stringify({'text': null, 'cache': JSON.stringify(relations)}));
				}
				// La relation du mot n'est pas stockee en cache
				else {
					request({encoding: null, uri: "http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel="+terme+"&rel="+typeRelation+"&relin=norelin"},
						function(error, response, sourceCode) {
							if (sourceCode) {
								let sourceCodeEncoded = iconv.decode(new Buffer.from(sourceCode), "ISO-8859-1");
								res.end(JSON.stringify({'text': sourceCodeEncoded, 'cache': JSON.stringify(relations)}));
							}
							else {
								res.end(JSON.stringify({'text': null, 'cache': JSON.stringify(relations)}));
							}
						});
				}
			}
			else {
				request({encoding: null, uri: "http://www.jeuxdemots.org/rezo-dump.php?gotermsubmit=Chercher&gotermrel="+terme+"&rel="+typeRelation+"&relin=norelin"},
					function(error, response, sourceCode) {
						if (sourceCode) {
							let sourceCodeEncoded = iconv.decode(new Buffer.from(sourceCode), "ISO-8859-1");
							res.end(JSON.stringify({'text': sourceCodeEncoded, 'cache': null}));
						}
						else {
							res.end(JSON.stringify([]));
						}
					}
				);
			}
		});
	});

	app.post("/save", (req, res) => {
		let terme = req.body.terme;
		let typeRelation = req.body.typeRelation;
		let relations = req.body.relations;
		db.collection('cacheRelations').find({"t": terme}).toArray((err, documents) => {
			if (documents.length > 0) {
				let realtionsStorage = documents[0];
				let update = {"$set": {"d": Date.now()}}
				update["$set"][typeRelation] = relations;
				db.collection('cacheRelations').updateOne(
					{"t": terme},
					{
						"$set": {
							"d": Date.now(),
							typeRelation
						}
					}
				);
			}
			else {
				let new_relations = {"t": terme, "d": Date.now()};
				new_relations[typeRelation] = JSON.stringify(relations);
				db.collection('cacheRelations').insert(new_relations);
			}
		});
	});

});

app.listen(8888);
console.log("Serveur prêt.")

/*********************** LEXICAL SORT ***********************/
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
