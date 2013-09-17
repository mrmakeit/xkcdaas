var canvas = require('canvas')
var express = require('express')
var fs = require('fs')

var Image = canvas.Image

var languages = {
  "perl":{file:'perl.png'},
  "node":{file:'perl.png'},
  "python":{file:'perl.png'},
  "ruby":{file:'perl.png'}
}

function loadLanguages(){
  for(language in languages){
    console.log(language)
    console.log(languages);
    image = fs.readFileSync(__dirname + '/'+language+'.png')
    languages[language].Image = new Image;
    languages[language].Image.src = image;
  }
}

loadLanguages();

var server = express();
server.listen(8000);
server.get('/image/:verb/:what/:lang', function(req,res){
  res.contentType('image/png');
  var ctx = new canvas(619,442).getContext('2d');
  fs.readFile(__dirname + '/template.png', function(err, template){
    if (err) throw err;
    temp = new Image;
    temp.src = template;
    ctx.drawImage(temp, 0, 0, temp.width, temp.height);
    ctx.font = "normal 11pt Calibri";
    ctx.fillText('know',460,56);
    var fontSize = 11
    while(ctx.measureText(req.params.what).width>120){
     fontSize--;
     var fontArgs = ctx.font.split(' ');
     console.log(fontArgs)
     var newSize = fontSize+'px';
     ctx.font = newSize + ' ' + fontArgs[fontArgs.length - 1]; /// using the last part
    }
    var whatWidth = ctx.measureText(req.params.what)
    ctx.fillText(req.params.what,465-(whatWidth.width/2),69,100.0);
    if(languages[req.params.lang]){
      ctx.drawImage(languages[req.params.lang].Image,0,0);
    }else{
      ctx.drawImage(languages.node.Image,0,0)
    }
    var stream = ctx.canvas.createPNGStream();
    stream.on('data', function(chunk){
      res.write(chunk);
    });
    stream.on('end', function(chunk){
      res.end();
    });
  }); 
});

server.get('/', function(req,res){
  res.send('<img src="/image"></img>');
});