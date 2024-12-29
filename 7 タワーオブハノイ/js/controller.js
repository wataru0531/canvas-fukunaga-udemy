
// Controller
// マウスの位置、キーボード入力などgameの操作を管理

export class Controller{
  constructor(){
    this.keys = [];
    this.mouse = { x: null, y: null };
    this.availableKeys = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", " ", "Enter", "p", "o"]
    this.pause = false;
  }

  getMousePosition(){
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      // console.log(this.mouse);
    })
  }

  // マウスがある範囲の中にあるかどうかを判定
  isMouseInsideRect(sx, sy, w, h){
    // sx: 開始のx座表、sy: 開始のy座表、w: 幅、h: 高さ
    if(sx < this.mouse.x && this.mouse.x < sx + w && sy < this.mouse.y && this.mouse.y < sy + h){
      return true;
    }

    return false;
  }

  // キーボード操作
  addKeys(){
    window.addEventListener("keydown", e => {
      // 登録しているキーのみtrueブロックに入る
      if(this.availableKeys.includes(e.key)){ // 矢印キーなど

        // this.keysにe.keyが含まれていない場合だけ、this.keysに格納
        if(!this.keys.includes(e.key)) {
          // console.log(e.key)
          // console.log(`controller: availableKay "${e.key}"`);
          // console.log("this.keys:", this.keys);
          this.keys.push(e.key);

        }
      }
    })
  }

  addMousedown(){ // "mousedown"を配列に加える
    // マウスダウン
    window.addEventListener("mousedown", () => {
      if(!this.keys.includes("mousedown")){
        this.keys.push("mousedown");
        // console.log("mousedown", this.keys)
      }
    })
  }

  clearKeys(){
    // マウスアップ
    window.addEventListener("mouseup", () => {
      // console.log("clear", this.keys);
      this.keys.length = 0; // 配列を空
    });

    // キーアップ
    window.addEventListener("keyup", e => { 
      // console.log(e.key)
      this.keys.length = 0;
    })
  }

}
