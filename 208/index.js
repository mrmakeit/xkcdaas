var canvas = require('canvas')
var fs = require('fs')

var Image = canvas.Image

var template = new Image;

module.exports.init = function(){
  template.src = fs.readFileSync(__dirname + '/template.png')
  console.log(__dirname + '/template.png')
}

var xkcdFont = new canvas.Font('xkcd','xkcd.ttf')

module.exports.render = function(params){
  var ctx = new canvas(template.width,template.height).getContext('2d');
  ctx.addFont(xkcdFont)
  ctx.font = "13px xkcd"
  ctx.drawImage(template,0,0);
  setFontSize(14,ctx);
  ctx.fillText('know',460,56);
  shrinkToFit(params.what,120,11,ctx);
  var whatWidth = ctx.measureText(params.what);
  ctx.fillText(params.what,465-(whatWidth.width/2),69);
  setFontSize(20,ctx);
  ctx.translate(241,347);
  ctx.rotate(-35*Math.PI/180)
  ctx.scale((ctx.measureText(params.lang).width>38)?(38/ctx.measureText(params.lang).width):1,.60);
  ctx.fillText(params.lang,0,0);
  var stream = ctx.canvas.createPNGStream();
  return stream;
}

function setFontSize(size,ctx){
  var fontArgs = ctx.font.split(' ');
  var newSize = size+'px';
  ctx.font =  newSize + ' ' + fontArgs[fontArgs.length - 1]; /// using the last part
}

function shrinkToFit(text,size,init,ctx){
  ctx.font = setFontSize(init,ctx);
  var currentSize = init;
  while(ctx.measureText(text).width>size){
    currentSize--
    setFontSize(currentSize,ctx)
  }
}
