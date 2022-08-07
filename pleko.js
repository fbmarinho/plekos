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
    this.restitution = 0.991;
    this.ax = 1;
    this.ay = 1;
    this.playable = playable;
    this.clicked = false;
    this.mousePosition = {x:0,y:0};
    this.willRelease = false;
  }
  setContext(ctx) {
    this.ctx = ctx;
  }
  setColiders(coliders) {
    this.coliders = coliders;
  }
  draw() {
    this.ctx.drawCircle(this.x, this.y, this.r, this.color);
    
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
    this.coliders.filter(c=>c.id!==this.id).forEach((c)=>{
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
  boundary(){
    const hitSound = () => playNote("10", "sine", 0.3);

    if(this.x < this.r){
      hitSound();
      this.vx = Math.abs(this.vx) * this.restitution;
      this.x = this.r;
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
}