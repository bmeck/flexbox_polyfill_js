var http = require('http');
var fs = require('fs');
http.createServer(function (request, response) {
    console.log(request.url);
    if( request.url == '/'){
        fs.readFile('index.html', function(error, content) {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(content, 'utf-8');
        });
    } else if( request.url == '/flexbox_polyfill.js' ){
        fs.readFile('./flexbox_polyfill.js', function(error, content) {
                response.writeHead(200, { 'Content-Type': 'text/javascript' });
                response.end(content, 'utf-8');
        });
    } else if( request.url == '/style.css'){
        fs.readFile('./style.css', function(error, content){
           response.writeHead(200, { 'Content-Type' : 'text/css'});
           response.end(content, 'utf-8');
        });
    }
    else {
        response.writeHead(404);
        response.end();
    }
}).listen(3030);
