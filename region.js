class Region {
  constructor(x, y, w, h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color || "#222";
    this.ctx = {};
    this.coliders = [];
    this.active = true;
  }
  draw(){
    this.ctx.drawRect(this.x, this.y, this.w, this.h, this.color);
  }
  setContext(ctx) {
    this.ctx = ctx;
  }
  setColiders(coliders) {
    this.coliders = coliders;
  }
  update(){
    this.colide();
  }
}