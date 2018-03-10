var app = require('../app');

var port = 3000;
var server = app.listen(port);
var addr = server.address();
var bind = typeof addr === 'string'
   ? 'pipe ' + addr
   : 'port ' + addr.port;
console.log('Listening on ' + bind);