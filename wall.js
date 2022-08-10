class Wall {
  constructor(x, y, w, h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.m = 1000;
    this.restitution = 0.991;
    this.color = color || "#009";
    this.ctx = {};
    this.active = true;
    this.getRectBounds = ()=>{
      return {
        left:this.x,
        right:this.x + this.w,
        top:this.y,
        bottom:this.y + this.h
      }
    }
  }
  draw(){
    this.ctx.drawRect(this.x, this.y, this.w, this.h, this.color);
  }
  setContext(ctx) {
    this.ctx = ctx;
  }
  update(){
    
  }
}