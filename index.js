var express = require('express');
var fs=require('fs');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    var dir='views/posts/';
    var posts=[];
	var counter = 0;
	fs.readdir(dir, function(err, files) {
    	if (err) throw err;
    	files.forEach(function(file) {
			if (file.indexOf('.ejs', file.length - 4) === -1) {
				return;
			}
			if (file === "template.ejs") {
				return;
			}
			if (file === "hello_world.ejs") {
				return;			
			}
			counter++;
        	fs.readFile(dir + file, 'utf-8', function(err, html) {
            	if (err) throw err;
				file = "/posts/" + file + "/";
				var lines = html.split('\n');
				var heading = lines[0].slice(4);
				var a = heading.length;
				heading = heading.slice(0, a-5);
				html = lines[1];
				var i = 2;	
				if (lines[i].length > 2){			
					while (lines[i].slice(4) == "") {
						i = i + 1;
						html = lines[i]; }
				}
				if (html.length > 200){
					html = html.slice(0, 200); }			
				html = html + "...";
           	 	posts.push({title: file, content: html, link: heading});
				counter--;
				if (counter === 0) {
					response.render('pages/index', {posts: posts});
				}
        	});	
    	});
	});
});

app.get('/posts/:post/', function(request, response) {
	var path = 'views/posts/' + request.params.post;
	fs.readFile(path, 'utf-8', function(err, data) {
		if (err) throw err;	
    	response.render('posts/template', {data: data});
	});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




