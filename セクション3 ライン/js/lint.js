
// lint 糸くずという意味


class Lint {
  constructor(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * this.canvas.width; // 描画の開始位置
    this.y = Math.random() * this.canvas.height;
    this.l = Math.random() * 20 + 10; // 長さ。最小でも10の長さを持つ
    // 繰り返し数(線が折れ曲がる回数。最低でも1回は確保)
    this.rep = Math.floor(Math.random() * 10 + 1); // floor: 少数以下切り捨て。ceil:少数以下切り上げ
    this.ctx.strokeStyle = "#fff";
    this.isErased = false; // 削除されているかどうか
  }

  draw(){
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y); // 描画の開始位置
    
    // rep数だけ描画されて折れ曲がったが描画される。
    for(let i = 0; i < this.rep; i++){
      // Math.random()* 2 - 1 ... -1 〜 1 の範囲
      // x、yを、this.x - l < x < this.x + l の範囲にする
      const x = this.x + this.l * (Math.random() * 2 - 1); 
      const y = this.y + this.l * (Math.random() * 2 - 1);

      this.ctx.lineTo(x, y); // 開始点からx, yの位置まで描く
    }

    this.ctx.stroke();
  }

  // クリックされた座標とインスタンスの座表の距離が50より小さい場合、this.erasedをtrueにする
  update(_x, _y){
    // _x, _y ... クリックされた座表
    // this.x, this.y ... 線の開始座表

    // クリック地点のx, yから、lintの開始地点x, yを引いて2点間の距離を取得
    // Math.sqrt() ... 与えられた数値の平方根を返す。スクエアルート
    // 平方根 ... ある数値aがあり、ある数値を2乗したときに、その数値aになる値のこと
    const dist = Math.sqrt((_x - this.x)**2 + (_y - this.y)** 2)
  
    if(dist < 50){ // 2点間の距離が50を下回る線を削除
      this.isErased = true;
    }
  }

}

export {
  Lint,

}