
// gameに関するクラス
// → game自身を管理

// import { Controller } from "./controller.js";

import { Area } from "./area.js";

export class Game{
  constructor(canvas, ctx, controller){
    this.canvas = canvas;
    this.ctx = ctx;
    this.clickAcceptable = true;

    // controllerはこのクラス内で使う
    this.controller = controller;

    this.menuMap = [
      { name: "Three Disks", numOfDisks: 3 }, 
      { name: "Four Disks", numOfDisks: 4 }, 
      { name: "Five Disks", numOfDisks: 5 }
    ];
    // → menu-0, menu-1 ... これらにあたる画面を作る必要がある
    this.menuIndex = 0;
    this.gameover = false;

    this.areas = null; // ボードとポールが1セットの配列
    this.numOfDisks = null; // メニュー選択時のタイミングで確定

    this.areaFrom = null; // 移す前
    this.areaTo = null;   // 移す先

    this.originalDisks = null; // 最初に生成したdisks配列のコピー
    this.startTime = null;     // ゲームがスタートした時間
    this.currentTime = null;   // 現在の時間

    this.completed = false;
  }

  draw(){
    this.canvas.style.backgroundColor = "#381d2a";

    if(this.areas){
      this.areas.forEach(area => {
        area.draw();

        // 選択したエリアに半透明のレイヤーを出現させる
        if(area === this.areaFrom){
          this.ctx.save();
          this.ctx.fillStyle = "rgba(200, 200, 200, .1)";
          this.ctx.beginPath();
          this.ctx.fillRect(area.x, area.y, area.areaSize, area.areaSize);
          this.ctx.restore();
        }
      })
    }

    this.showTime();
  }

  update(){

    // 表示されたディスクを監視し、動かす処理。フレームごとに更新
    // → areaFrom、areaToに該当するものがあるかどうかを監視する
    // 　mouseupが行われれば、areaのmoveDiskToが発火する
    if(this.areas){ 
      this.areas.forEach(area => {
        // console.log(area); // area → 3つのディスクなら3つのAreaオブジェクトが。

        // console.log(this.areaFrom)
        this.selectAreaFrom(area);
        this.selectAreaTo(area);
        this.moveDisk();
      })
    }

    // 
    this.checkCompletion();

    // clickAcceptable の使用例
    // マウスがrectの内側 かつ "mousedown"を含む かつ クリック可 
    // if(this.controller.isMouseInsideRect(sx, sy, w, h) 
    //   && this.controller.keys.includes("mousedown") 
    //   && this.clickAcceptable
    // ){
    //   this.count++;

    //   this.clickAcceptable = false;
    // }
    // // "mousedown"を含んでいない場合は再クリック可
    // if(!this.controller.keys.includes("mousedown")) this.clickAcceptable = true;

  }

  init(){ // 各プロパティを初期値に戻す
    this.menuIndex = 0;
    this.gameover = false;
    this.clickAcceptable = false;
    this.areas = null;
    this.completed = false;
  }

  createAreas(){ // エリアを生成
    const areas = [];
    for(let i = 0; i < 3; i++){
      const area = new Area(this.canvas, this.ctx, this.numOfDisks);

      // i番目ずつボードの幅分をずらして生成
      area.x = this.canvas.width/8 + area.areaSize * i;
      area.y = (this.canvas.height - area.areaSize) / 2;
      // iが0 ...　左のエリア
      area.disks = i === 0 ? this.createInitialDisks() : [];
      // console.log(area.disks)

      areas.push(area);
    }
    
    this.originalDisks = [...areas[0].disks]; // originalDisksを作成

    return areas;
  }

  createInitialDisks(){ // 0, 1, 2, 3と数値を格納していく関数
    const disks = [];
    for(let i = 0; i < this.numOfDisks; i++){
      disks.push(i);
    }

    return disks;
  }

  // 移す前のエリアを決定する処理
  selectAreaFrom(area){
    if(
      // areaFromにオブジェクトが割り当てられていない、マウスがそのエリア内にあり、mousedownした時
      !this.areaFrom &&
      this.controller.isMouseInsideRect(area.x, area.y, area.areaSize, area.areaSize) &&
      this.controller.keys.includes("mousedown")
    ){
      this.areaFrom = area;
    }
  }

  // 移す先を選択する処理
  selectAreaTo(area){
    if(
      // areaFromにオブジェクトが存在している状態、マウスがそのエリア内にあり、mousedownした時
      this.areaFrom &&
      this.controller.isMouseInsideRect(area.x, area.y, area.areaSize, area.areaSize) &&
      this.controller.keys.includes("mousedown")
    ){
      this.areaTo = area;
    }
  }

  // moveDiskToを実行させる処理。ディスクを移動させる処理
  moveDisk(){
    if(
      this.areaFrom &&  // 移動元が決定している
      this.areaTo &&    // 移動先が決定している
      !this.controller.keys.includes("mousedown") // → mouseupされた時
    ){
      this.areaFrom.moveDiskTo(this.areaTo);

      this.areaFrom = null;
      this.areaTo = null;
    }
  }

  // 時間を表示する関数　
  showTime(){
    // 
    if(!this.completed) this.currentTime = new Date();
    this.ctx.save();
    this.ctx.fillStyle = "rgba(200, 200, 200, .5)";
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "top";
    this.ctx.font = `${this.canvas.width/18}px monospace`;
    this.ctx.beginPath();
    this.ctx.fillText(
      // startTomeはメニュー選択時に設定
      `Time: ${((this.currentTime - this.startTime) / 1000).toFixed(2)}`,
      this.canvas.width * 19 / 20, // x軸
      this.canvas.height / 20      // y軸
    );
    this.ctx.restore();
  }

  // ディスクが他のポールに完全に移った時にゲームオーバーをtrueにする関数
  checkCompletion(){
    if( 
      // JSON.stringify ... JSON文字列化。parse ... jsonからオブジェクトに
      // → JSON化して比較しているのはただ配列の中身を比べたいだけ。
      //   オブジェクトのまま比べたら参照先を比べてしまうので必ずfalseとなってしまう
      JSON.stringify(this.areas[1].disks) === JSON.stringify(this.originalDisks) ||
      JSON.stringify(this.areas[2].disks) === JSON.stringify(this.originalDisks)
    ){
      this.gameover = true;
      this.completed = true;
    }
  }

}

