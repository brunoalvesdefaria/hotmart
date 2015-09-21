var express = require('express');

var app = express();

app.use(express.static('./public', {maxAge: 2592000000}));

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

var server = app.listen(3000, function() {
	console.log('Webapp server listening on port ' + server.address().port);
});

module.exports = app;
