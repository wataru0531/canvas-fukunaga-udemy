
// Managerクラス
// → スタート画面、終了画面、ゲームの描画、更新、操作を担う

import { Controller } from "./controller.js";
import { Game } from "./game.js";

export class Manager {
  constructor(canvas, ctx){
    this.canvas = canvas;
    this.ctx = ctx;

    this.controller = new Controller();
    this.game = new Game(this.canvas, this.ctx, this.controller);

    this.states = ["START", "PLAY", "GAMEOVER"];
    this.state = this.states[0];

    this.rows = this.createRows(); // 行の中心座標の配列
    this.menuWidth = this.canvas.width / 5;    // メニュー1行の幅
    this.menuHeight = this.canvas.height / 15; // メニュー1行の高さ
    // console.log(this.menuWidth, this.menuHeight)
    // console.log(this.rows)

    this.backToStartWidth = this.canvas.width   / 3;
    this.backToStartHeight = this.canvas.height / 15;
  }

  // スタート画面、プレイ画面をなどの状態管理を行い各画面を描画
  draw(){
    if(this.state === this.states[0]){ // スタート画面
      this.showStartPage();
    } else if(this.state === this.states[1]){ // ゲーム実行中
      this.game.draw();
      // this.showMessage();
    } else if(this.state === this.states[2]){ // ゲーム終了
      this.showGameOverPage();
    }
  }

  update(){ // 状態の更新
    if(this.state === this.states[0]){
      // スタートページの時
      for(let i = 3; i < 6; i++){ // iには3, 4, 5。ゲームの表示数により変更
        this.selectAndPlay(this.rows[i].cx, this.rows[i].cy, i);
      }
    } else if(this.state === this.states[1]){
      // プレイページの時
      this.game.update();

      // gameoverになった時
      if(this.game.gameover){
        setTimeout(() => {
          this.state = this.states[2]
        }, 1500);
      }
    } else if(this.state === this.states[2]){
      // ゲームオーバーページの時
      this.backToStart(this.rows[6].cx, this.rows[6].cy); // スタート画面に戻る
    }
  }

  showStartPage(){ // スタートページ(紺色背景)
    this.ctx.save();
    this.canvas.style.backgroundColor = "#0d1b2a";
    this.ctx.lineWidth = 8;
    this.ctx.lineJoin = "round"; // ラインの上を丸く
    // frame 外の白の枠線
    this.ctx.strokeStyle = "#e0e1dd";
    this.ctx.beginPath();
    this.ctx.rect(
      this.canvas.width / 6, 
      this.canvas.height / 6, 
      this.canvas.width * 4 / 6, 
      this.canvas.height * 4 / 6
    ); 
    this.ctx.stroke();
    // title
    this.ctx.fillStyle = "#f8c537";
    this.ctx.font = `${this.canvas.width/18}px Inter`;
    this.ctx.fillText("Tower Of Hanoi", this.rows[1].cx, this.rows[1].cy);
    // description
    this.ctx.fillStyle = "#ffdda1";
    this.ctx.font = `italic ${this.canvas.width/45}px Inter`;
    this.ctx.fillText("move disks from one pole to another", this.rows[2].cx, this.rows[2].cy);
    // menuの設置
    // menuの数はgameごとに異なるのでmenuはgameクラスで管理
    this.ctx.font = `${this.canvas.width / 25}px Inter`;
    for(let i = 0; i < this.game.menuMap.length; i++){
      this.ctx.fillStyle = "#e0e1dd";
      this.ctx.fillText(this.game.menuMap[i].name, this.rows[3 + i].cx, this.rows[3 + i].cy);
    }

    // ゲームの開始方法
    this.ctx.fillStyle = "#ffdda1";
    this.ctx.font = `italic ${this.canvas.width / 35} Inter`;
    this.ctx.fillText("Click Menu to Start", this.rows[7].cx, this.rows[7].cy);

    this.ctx.restore();
  }

  showGameOverPage(){ // ゲームオーバーページ
    this.ctx.save();  
    this.canvas.style.backgroundColor = "#37323e";
    this.ctx.fillStyle = "#f24333";
    this.ctx.strokeStyle = "#bfbfc1"
    this.ctx.lineWidth = 8;
    this.ctx.lineJoin = "round";
    // frame 枠線
    this.ctx.beginPath();
    this.ctx.rect(
      this.canvas.width / 6, 
      this.canvas.height / 6, 
      this.canvas.width * 4 / 6,
      this.canvas.height * 4 / 6,
    );
    this.ctx.stroke();
    // GAME OVER画面
    this.ctx.font = `${this.canvas.width / 15}px Inter`;
    this.ctx.fillText("Congratulations!!", this.rows[2].cx, this.rows[2].cy);
    // time
    this.ctx.font = `${this.canvas.width/25}px Inter`;
    this.ctx.fillText(
      `Your Time : ${((this.game.currentTime - this.game.startTime)/1000).toFixed(2)}[s]`, 
      this.rows[4].cx, 
      this.rows[4].cy
    );


    // back to start
    this.ctx.font = `italic ${this.canvas.width/30}px Inter`;
    this.ctx.fillText("Click here to Request", this.rows[6].cx, this.rows[6].cy)
    this.ctx.restore();
  }

  // メニュー選択。 ホバー、適した画面に移行
  selectAndPlay(cx, cy, i){ // cxとcyはrectの中心点
    // rectの中にあればホバーエフェクトを追加
    if(this.controller.isMouseInsideRect(
      // 左上の座標を取得するためにそれぞれマイナスする
      cx - this.menuWidth/2,  // 開始のx座表
      cy - this.menuHeight/2, // 開始のy座表
      this.menuWidth, 
      this.menuHeight,
    )){
      // マウスホバー時
      this.ctx.save();
      this.ctx.lineWidth = 3;
      this.ctx.lineJoin = "round";
      this.ctx.strokeStyle = "#51e5ff";
      this.ctx.beginPath();
      this.ctx.rect(cx - this.menuWidth/2, cy - this.menuHeight/2, this.menuWidth, this.menuHeight);
      this.ctx.stroke();
      this.ctx.restore();

      if(this.controller.keys.includes("mousedown")){
        this.game.menuIndex = i - 3; // iには3, 4, 5

        // menuMapのmenuIndexに見合うnumOfDisksを取得
        this.game.numOfDisks = this.game.menuMap[this.game.menuIndex].numOfDisks;

        // areaを渡すことで、draw()が走るようになり、描画される。
        this.game.areas = this.game.createAreas();
        // console.log(this.game.areas); // (3) [Area, Area, Area]

        setTimeout(() => {
          this.state = this.states[1];      // ゲーム画面に移行
          this.game.startTime = new Date(); // スタートタイム
        }, 800);
      }
    }
  }

  // スタート画面に戻る
  backToStart(cx, cy){ // cxとcyはrectの中心点
    if(this.controller.isMouseInsideRect( // マウスが下記の範囲の中にあればtrue
      cx - this.backToStartWidth/2,  // 開始のx座表。左上の座標を取得するためにそれぞれマイナスする
      cy - this.backToStartHeight/2, // 開始のy座表
      this.backToStartWidth,
      this.backToStartHeight,
    )){
      // マウスホバー時
      this.ctx.save();
      this.ctx.lineWidth = 3;
      this.ctx.lineJoin = "round";
      this.ctx.strokeStyle = "#e3e36a";
      this.ctx.beginPath();
      this.ctx.rect(
        cx - this.backToStartWidth/2, 
        cy - this.backToStartHeight/2, 
        this.backToStartWidth, 
        this.backToStartHeight
      );
      this.ctx.stroke();
      this.ctx.restore();

      if(this.controller.keys.includes("mousedown")){

        setTimeout(() => {
          this.game.init(); // スタート画面に戻ってきた時に数値などを初期化

          this.state = this.states[0]; // スタート画面に移動
        }, 800);
      }
    }
  }

  // 枠線内の行の中心座標を返す
  createRows(){
    const rows = [];
    const h = this.canvas.height * 4/6 / 8; // 1行の高さ
    for(let i = 0; i < 8; i++){
      const row = { // row ... 各行の中心点の座標
        cx: this.canvas.width/2, 
        cy: this.canvas.height/6 + h * i + h/2, 
        // → canvasの上からの高さ + 1行の高さ * 0 + 半行の高さ
      };
      rows.push(row);
    }

    return rows;
  }

  // 一時停止を伝える
  // showMessage(){
  //   this.ctx.save();
  //   this.ctx.fillStyle = "rgba(100, 100, 100, .5)";
  //   this.ctx.textAlign = "left";   // 中央に左を持ってくる 
  //   this.ctx.textBaseline = "top"; // ベースラインに下に上端をつける
  //   this.ctx.font = `${this.canvas.width/45}px Inter`;
  //   this.ctx.fillText("Press 'p' pause", 20, 20);
  //   this.ctx.restore();
  // }

}
