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
  for (i=1; i<=4; i++){
    let r = 40;
    let x = 1100;
    let y = 10+(i*90);

    let vx = 0;
    let vy = 0;
    balls.push(new Pleko("Bola "+i,x,y,r,vx,vy));
  }

  var player = new Pleko("Player", 200, 300, 100, 0, 0, true, '#fff');
  
  var objs = [...balls, player];

  ctx.attach(objs);
  objs.forEach((o)=>{
    o.setColiders(objs);
    document.addEventListener("mousedown",(e) => handleMouseDown(e, o));
    document.addEventListener("mouseup",(e) => handleMouseUp(e, o));
    document.addEventListener("mousemove",(e) => handleMousemove(e, o));
  })
  

  function loop() {
    // LOOP
    ctx.cls();
    objs.forEach(o=>{
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