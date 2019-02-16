const http  = require('http');
const url   = require("url");
const fs    = require('fs');
const path  = require('path');

"use strict";

// Reading the file that has to be displayed
fs.readFile('./index.html', function(err, data) {
    if (err){
        throw err;
    }
    htmlFile = data;
});

fs.readFile('./style.css', function(err, data) {
    if (err){
        throw err;
    }
    cssFile = data;
});

fs.readFile('./bundle.js', function(err, data) {
    if (err){
        throw err;
    }
    javascriptFile = data;
});

/*
fs.readFile('./favicon.ico', function(err, data) {
  if (err){
      throw err;
  }
  faviconFile = data;
});
*/

// Server creation
var server = http.createServer(function(req, res) {
  var page = url.parse(req.url).pathname;

  var urlToRedirect;
  // GET method -> User wants something (html, css, etc..)
  if(req.method === "GET") {
    // Serves different pages depending on what whants the client
    switch (req.url) {
        case "/bundle.js" :
            //console.log('case js');
            res.writeHead(200, {"Content-Type": "application/js"});
            res.write(javascriptFile);
            res.end();
            break;
        case "/style.css" :
            //console.log('case css');
            res.writeHead(200, {"Content-Type": "text/css"});
            res.write(cssFile);
            res.end();
            break;
        /*
        case "/favicon.ico" :
            res.writeHead(200, {"Content-Type": "text/css"});
            res.write(faviconFile);
            res.end();
            break;
        */
        case "/" :
            //console.log('case html');
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(htmlFile);
            res.end();
            break;
        default :
            break;
    }
    // POST METHOD when user want to send something
  } else if(req.method === "POST") {
    // CHECK IF USER WANTS TO ADD URLS
    if (req.url === "/addURL") {
      var reqBody = '';
      
      req.on('data', function(data) {
        console.log('gathering data..');
        reqBody += data; // Gathering data
        if(reqBody.length > 1e5) {
          res.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/html'});
          res.end('<!doctype html><html><head><title>413</title></head><body>413: Request Entity Too Large</body></html>');
        }
      });
      /* When finished */
      req.on('end', function() {
        let urlToStore_JSON = JSON.parse(reqBody);
        console.log(urlToStore_JSON);
        // CHECK IF LINK DOES NOT ALREADY EXIST
        if(isInDB(urlToStore_JSON.shortURL) == -1){
          // STORE IT
          store(urlToStore_JSON);
        }
      });
    } else {
      res.writeHead(404, 'Resource Not Found', {'Content-Type': 'text/html'});
      res.end('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
    }
  } else {
    res.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/html'});
    return res.end('<!doctype html><html><head><title>405</title></head><body>405: Method Not Supported</body></html>');
  }
  res.end();
});
server.listen(8081);

console.log('Server running at http://localhost:8081/');

function protype(variable){
    var smtg = "";
    variable += 1;

    return variable;
}

