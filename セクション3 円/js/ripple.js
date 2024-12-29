
// ripple 波紋

class Ripple {
  constructor(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.r = Math.random() * this.canvas.width / 4; // 半径
  }

  draw(){
    this.ctx.strokeStyle = "rgba(50, 255, 255, .1)";
    this.ctx.beginPath();
    this.ctx.arc( // ①つ目
      this.x, // x軸の位置
      this.y, 
      this.r,
      0,  // 開始のラジアン
      Math.PI * 2, // 終了のラジアン
    );
    this.ctx.stroke();

    // this.ctx.save();
    this.ctx.beginPath(); // ②つ目
    this.ctx.strokeStyle = "rgba(50, 255, 255, .5";
    this.ctx.arc(this.x, this.y, this.r / 3, 0, Math.PI * 2); 
    this.ctx.stroke();
    // this.ctx.restore();

    // this.ctx.save();
    this.ctx.beginPath(); // ③つ目
    this.ctx.strokeStyle = ` rgba(50, 255, 255, 1)`;
    this.ctx.arc(this.x, this.y, this.r / 4, 0, Math.PI * 2); // ③つ目
    this.ctx.stroke();
    // this.ctx.restore();


  }


}


export {
  Ripple,

}