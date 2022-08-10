// Canvas stage creation
function createStage() {
  var {width, height} = document.body.getBoundingClientRect();
  var canvas = document.createElement("canvas");
  canvas.id = "stage";
  canvas.width = width;
  canvas.height = height;
  canvas.middle = {x: width/2, y:height/2};
  document.body.appendChild(canvas);
  return canvas.getContext("2d");
}

function drawLine(xi, yi, xf, yf, width=0, color="#000") {
  this.beginPath();
  this.moveTo(xi, yi);
  this.lineTo(xf, yf);
  this.lineWidth = width;
  this.strokeStyle = color;
  this.stroke();
}

function drawCircle(x, y, r, color="#fff"){
  this.beginPath();
  this.arc(x, y, r, 0, 2 * Math.PI);
  this.fillStyle = color;
  this.fill();
}

function drawRect(x, y, w, h, color="#222"){
  this.beginPath();
  this.rect(x, y, w, h);
  this.fillStyle = color;
  this.fill();
}

function cls(){
  this.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

function attach(obj){
    obj.forEach(o=>o.setContext(this));
}

function main(){
  //SETUP
  var ctx = createStage();

  var balls = [];
  var n = 15;
  var colors = ["#FB0","#009","#900","#606","#F50","#099","#630","#222"];
  var xpos = ctx.canvas.width - 400;
  var ypos = ctx.canvas.height/2;
  var r = 25;
  var cn = 0;
  for (i=0; i<n; i++){
      var col=0;
      if(cn>=colors.length) cn=0;
      if(i>0 && i<=2) col=1;
      if(i>2 && i<=5) col=2;
      if(i>5 && i<=9) col=3;
      if(i>9)         col=4;
      var x = xpos + col*(1.8*r);
      var y = ypos + - (col+2)*col*r + i*(2*r) ;
      balls.push(new Pleko(i+1, x, y, r, 0, 0, false, colors[cn]));
      cn++
  }

  var players = [];
  var player1 = new Pleko("Player 1", 200, ctx.canvas.height/2, 30, 0, 0, true, '#fff');
  players.push(player1);


  var sinks = [];
  var size = 80;
  var sink1 = new Sink(0,0,size,size);
  var sink2 = new Sink(0,ctx.canvas.height-size,size,size);
  var sink3 = new Sink(ctx.canvas.width-size,0,size,size);
  var sink4 = new Sink(ctx.canvas.width-size,ctx.canvas.height-size,size,size);
  var sink5 = new Sink(ctx.canvas.width/2-size/2,0,size,size);
  var sink6 = new Sink(ctx.canvas.width/2-size/2,ctx.canvas.height-size,size,size);
  sinks.push(sink1, sink2, sink3, sink4, sink5, sink6)

  var walls = [];
  var hwall = (ctx.canvas.width - 3*size)/2;
  var vwall = (ctx.canvas.height - 2*size);
  var wall1 = new Wall(size,0,hwall,size/3);
  var wall2 = new Wall(2*size+hwall,0,hwall,size/3);
  var wall3 = new Wall(size,ctx.canvas.height-size/3,hwall,size/3);
  var wall4 = new Wall(2*size+hwall,ctx.canvas.height-size/3,hwall,size/3);
  var wall5 = new Wall(0,size,size/3,vwall);
  var wall6 = new Wall(ctx.canvas.width-size/3,size,size/3,vwall);
  walls.push(wall1, wall2, wall3, wall4, wall5, wall6);
  
  var coliders = [...balls, ...players];

  ctx.attach([...balls, ...players, ...sinks, ...walls]);

  coliders.forEach((o)=>{
    o.setColiders(coliders);
    o.setWalls(walls);
    o.setSinks(sinks);
    document.addEventListener("mousedown",(e) => handleMouseDown(e, o));
    document.addEventListener("mouseup",(e) => handleMouseUp(e, o));
    document.addEventListener("mousemove",(e) => handleMousemove(e, o));
  })
  

  function loop() {
    // LOOP
    ctx.cls();
    sinks.filter(a=>a.active).forEach(r=>r.draw());
    walls.filter(a=>a.active).forEach(r=>r.draw());
    coliders.filter(a=>a.active).forEach(o=>{
      o.draw();
      o.update();
    });
    
    requestAnimationFrame(loop);
  }

  loop();
}

CanvasRenderingContext2D.prototype.cls = cls;
CanvasRenderingContext2D.prototype.attach = attach;
CanvasRenderingContext2D.prototype.drawLine = drawLine;
CanvasRenderingContext2D.prototype.drawCircle = drawCircle;
CanvasRenderingContext2D.prototype.drawRect = drawRect;

document.addEventListener("DOMContentLoaded",main)

function handleMouseDown(e, player) {
  var evt = e ? e : window.event;
  var point = {x: evt.clientX, y: evt.clientY};
  player.clicked = clickedInside(point, player);
}

function handleMouseUp(e, player) {
  var evt = e ? e : window.event;
  if(player.clicked){
    player.willRelease = true;
    player.clicked = false;
  }
}

function handleMousemove(e, player) {
  var evt = e ? e : window.event;
  player.mousePosition = {x:evt.clientX, y:evt.clientY}
}

function clickedInside(point, player){
  var dx = player.x - point.x;
  var dy = player.y - point.y;
  return (dx*dx + dy*dy <= player.r*player.r)
}