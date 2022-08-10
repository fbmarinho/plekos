class Pleko {
  constructor(id, x, y, r, vx=0, vy=0, playable=false, color){
    this.id = id;
    this.color = color || `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
    this.x = x;
    this.y = y;
    this.r = r;
    this.m = 3*r^2;
    this.vx = vx;
    this.vy = vy;
    this.ctx = {};
    this.coliders = [];
    this.sinks = [];
    this.walls = [];
    this.restitution = 0.991;
    this.ax = 1;
    this.ay = 1;
    this.playable = playable;
    this.clicked = false;
    this.mousePosition = {x:0,y:0};
    this.willRelease = false;
    this.active = true;
    this.getRectBounds = ()=>{
      return {
        left:   this.x - this.r,
        right:  this.x + this.r,
        top:    this.y - this.r,
        bottom: this.y + this.r
      }
    }
  }
  setContext(ctx) {
    this.ctx = ctx;
  }
  setColiders(coliders) {
    this.coliders = coliders;
  }
  setSinks(sinks) {
    this.sinks = sinks;
  }
  setWalls(walls) {
    this.walls = walls;
  }
  draw() {
    
    this.ctx.drawCircle(this.x, this.y, this.r, this.color);
    this.ctx.drawCircle(this.x, this.y, this.r/2, "#fff");
    
    this.ctx.beginPath();
    this.ctx.fillStyle = "#000";
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.id, this.x, this.y+4);
    this.ctx.fill();

    
    if(this.clicked && this.playable){
      this.ctx.drawLine(this.x, this.y, this.mousePosition.x, this.mousePosition.y);
    }
    
  }
  update(){
    this.vx *= this.restitution;
    this.vy *= this.restitution;
    this.x += this.vx;
    this.y += this.vy;
    if(this.playable) this.mouseAction();
    this.boundary();
    this.colide();
    this.wall();
    this.sink();
  }
  mouseAction(){
    //console.log("mouse:", this.clicked ? "down" : "up");
    if(this.willRelease){
      var mdx = this.mousePosition.x - this.x
      var mdy = this.mousePosition.y - this.y
      var d = Math.floor(Math.sqrt(mdx*mdx + mdy*mdy));
      //console.log("Dx from mouse:",d);
      var adjust = 10;
      this.ax = 1;
      this.ay = 1;
      this.vx = Math.floor(-mdx/adjust);
      this.vy = Math.floor(-mdy/adjust);
      this.willRelease = false;
    }
  }
  colide(){
    this.coliders.filter(c=>c.id!==this.id && c.active).forEach((c)=>{
      var a = this.r + c.r;
      var dx = c.x - this.x;
      var dy = c.y - this.y;
      var d = Math.sqrt((dx*dx) + (dy*dy));
      
      if(d<a){
        playNote("80", "sine", 0.05);
        var vCollisionNorm = {x: dx/d, y: dy/d};

        let vRelativeVelocity = {x: this.vx - c.vx, y: this.vy - c.vy};
        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

        speed *= Math.min(this.restitution, c.restitution);

        if (speed < 0){
          return;
        }
        let impulse = 2 * speed / (this.m + c.m);
        this.vx -= (impulse * c.m * vCollisionNorm.x);
        this.vy -= (impulse * c.m * vCollisionNorm.y);
        c.vx += (impulse * this.m * vCollisionNorm.x);
        c.vy += (impulse * this.m * vCollisionNorm.y);
      }
    })  
  }
  sink(){
    var margin = 0.6;
    this.sinks.forEach((sink)=>{
      if(this.x - this.r*margin > sink.x && this.y - this.r*margin > sink.y && this.x + this.r*margin < sink.x + sink.w && this.y + this.r*margin < sink.y + sink.h) {
        this.r *= 0.9;
        this.vx *= 0.5;
        this.vy *= 0.5;
        console.log("caiu");
        if(this.r < 10){
          playNote("1000", "sine", 1);
          this.active = false;
        }
      }
    })
  }
  wall(){
    
    this.walls.forEach((wall)=>{
      // temporary variables to set edges for testing
      var testX = this.x;
      var testY = this.y;
    
      // which edge is closest?
      if (this.x < wall.x)              testX = wall.x;      // test left edge
      else if (this.x > wall.x+wall.w)  testX = wall.x+wall.w;   // right edge
      if (this.y < wall.y)              testY = wall.y;      // top edge
      else if (this.y > wall.y+wall.h)  testY = wall.y+wall.h;   // bottom edge
    
      // get distance from closest edges
      var distX = testX-this.x;
      var distY = testY-this.y;
     
      var distance = Math.sqrt( (distX*distX) + (distY*distY) );
      
      // if the distance is less than the radius, collision!
      if (distance <= this.r) {
        
        var vCollisionNorm = {x: distX/distance, y: distY/distance};

        let vRelativeVelocity = {x: this.vx - 0, y: this.vy - 0};
        let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

        speed *= Math.min(this.restitution, wall.restitution);

        if (speed < 0){
          return;
        }
        let impulse = 2 * speed / (this.m + wall.m);
        this.vx -= (impulse * wall.m * vCollisionNorm.x);
        this.vy -= (impulse * wall.m * vCollisionNorm.y);
      }
    });
  }
  boundary(){
    const hitSound = () => playNote("10", "sine", 0.3);

    if(this.x < this.r){
      hitSound();
      this.x = this.r;
      this.vx = Math.abs(this.vx) * this.restitution;
      
    } else if(this.x > this.ctx.canvas.width - this.r) {
      hitSound();
      this.vx = -Math.abs(this.vx) * this.restitution;
      this.x = this.ctx.canvas.width - this.r;
    }

    if(this.y < this.r){
      hitSound();
      this.vy = Math.abs(this.vy) * this.restitution;
      this.y = this.r;
    } else if(this.y > this.ctx.canvas.height - this.r) {
      hitSound();
      this.vy = -Math.abs(this.vy) * this.restitution;
      this.y = this.ctx.canvas.height - this.r;
    }

  };
  circleRect(cx, cy, radius, rx, ry, rw, rh) {

    // temporary variables to set edges for testing
    var testX = cx;
    var testY = cy;
  
    // which edge is closest?
    if (cx < rx)         testX = rx;      // test left edge
    else if (cx > rx+rw) testX = rx+rw;   // right edge
    if (cy < ry)         testY = ry;      // top edge
    else if (cy > ry+rh) testY = ry+rh;   // bottom edge
  
    // get distance from closest edges
    var distX = cx-testX;
    var distY = cy-testY;
    var distance = Math.sqrt( (distX*distX) + (distY*distY) );
  
    // if the distance is less than the radius, collision!
    if (distance <= radius) {
      return true;
    }
    return false;
  }
}