var http = require('http');
var fs = require('fs');
var path= require('path');

http.createServer(function (request, response) {
    console.log(request.url);
      var filePath = '.' + request.url;
      if (filePath == './')
	        filePath = './index.html';
	         
	    var extname = path.extname(filePath);
	    var contentType = 'text/html';
	    switch (extname) {
	        case '.js':
	            contentType = 'text/javascript';
	            break;
	        case '.css':
	            contentType = 'text/css';
	            break;
	    }
      fs.readFile(filePath, function(error, content){
        if(error){
          response.writeHead(404);
          response.end();
        } else {
          response.writeHead(200, {'Content-Type' : contentType});
          response.end(content);
        }
      });
}).listen(3030);
