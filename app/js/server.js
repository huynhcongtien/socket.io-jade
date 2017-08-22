var express = require("express"),
    app     = express(),
    port    = 3700,
    baseUrl = __dirname + '/../..';

app.set('views', baseUrl + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});

app.use(express.static(baseUrl + '/public'));
app.use(express.static(baseUrl + '/app'));
app.use(express.static(baseUrl + '/build'));

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function (socket) {

    socket.emit('message', {message: 'welcome to the chat'});

    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });

    socket.on('hello', function (msg) {
        socket.emit('message', {message: msg});
    });
});

console.log("Listening on port " + port);
