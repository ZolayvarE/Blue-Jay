var server = require('./config/socket-config.js');

var port = process.env.PORT || 8443;

server.listen(port);
console.log('Listening on port: ' + port);



var app = require('express')();

app.get('*', function (req, res) {
  res.redirect('https://localhost:8443' + req.url);
});

app.listen(8080);







