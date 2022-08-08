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
  var cols = 5;
  var rows = 6;
  for (i=0; i<cols; i++){
    for (j=0; j<rows; j++){
      var id = ((i*rows)+j)+1;
      var r = 28;
      var x = 800 + i*3*r;
      var y = 120 + j*3*r;
  
      let vx = 0;
      let vy = 0;
      balls.push(new Pleko(id, x, y, r, vx, vy, false));
    }

  }

  var player = new Pleko("Player", 200, ctx.canvas.height/2, 30, 0, 0, true, '#fff');

  var reg1 = new Region(0,0,56,56);
  var reg2 = new Region(0,ctx.canvas.height-56,56,56);
  var reg3 = new Region(ctx.canvas.width-56,0,56,56);
  var reg4 = new Region(ctx.canvas.width-56,ctx.canvas.height-56,56,56);
  
  var objs = [...balls, player, ];
  var regions = [reg1, reg2, reg3, reg4];

  ctx.attach([...objs, ...regions]);
  objs.forEach((o)=>{
    o.setColiders(objs);
    o.setRegions(regions);
    document.addEventListener("mousedown",(e) => handleMouseDown(e, o));
    document.addEventListener("mouseup",(e) => handleMouseUp(e, o));
    document.addEventListener("mousemove",(e) => handleMousemove(e, o));
  })
  

  function loop() {
    // LOOP
    ctx.cls();
    regions.forEach(r=>r.draw());
    objs.filter(a=>a.active).forEach(o=>{
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