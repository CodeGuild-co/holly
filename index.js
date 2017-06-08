//import express module and create an express application
var express = require('express');
var fs=require('fs'); //import file system module
var app = express();

//sets the port for the server
app.set('port', (process.env.PORT || 5000));

//serving files in 'public' directory
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//defines a route for the path of '/' relative to the site route
app.get('/', function(request, response) {
    var dir='views/posts/'; //directory is the posts folder
    var posts=[];
	var counter = 0; //starts with no posts
	fs.readdir(dir, function(err, files) { //reads files from directory
    	if (err) throw err; //error handling
    	files.forEach(function(file) {
			if (file.indexOf('.ejs', file.length - 4) === -1) { //if not an .ejs file
				return;
			}
			if (file === "template.ejs") { //if it is a template file
				return;
			}
			if (file === "hello_world.ejs") {
				return;			
			}
			counter++; //increase posts count
        	fs.readFile(dir + file, 'utf-8', function(err, html) { //for each file
            	if (err) throw err; //handle errors
				file = "/posts/" + file + "/"; //file path
				var lines = html.split('\n');
				var heading = lines[0].slice(4); //take off first 4 characters (<h3>)
				var a = heading.length;
				heading = heading.slice(0, a-5); //take off last 5 chars (</h3>)
				html = lines[1];
				var i = 2;	
				if (lines[i].length > 2){			
					while (lines[i].slice(4) == "") { //if line is not a html tag
						i = i + 1;
						html = lines[i]; }
				}
				if (html.length > 200){ //cut string to 200 chars
					html = html.slice(0, 200); }			
				html = html + "...";
           	 	posts.push({title: heading, content: html, link: file}); //add the blog post to the array of posts
				counter--;
				if (counter === 0) { //when gone through all posts, render the posts using the index.ejs template
					response.render('pages/index', {posts: posts}); //creates homepage
				}
        	});	
    	});
	});
	$("ul li").on("click", function() {
    		$("li").removeClass("active");
    		$(this).addClass("active");
  	});
});

//creates a route handler for the blog pages
app.get('/posts/:post/', function(request, response) {
	var path = 'views/posts/' + request.params.post; //path is the path of the post in the parameter
	fs.readFile(path, 'utf-8', function(err, data) {
		if (err) throw err;	
    	response.render('posts/template', {data: data}); //render (create) the post using the template
	});
});

//starts up server on a certain port
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




