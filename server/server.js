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

app.listen(8888);