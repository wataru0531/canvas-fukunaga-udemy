
// gameに関するクラス
// → game自身を管理

// import { Controller } from "./controller.js";

export class Game{
  constructor(canvas, ctx, controller){
    this.canvas = canvas;
    this.ctx = ctx;
    this.count = 0;
    this.clickAcceptable = true;

    // controllerはこのクラス内で使う
    this.controller = controller;

    this.menus = ["menu-0", "menu-1", "menu-2"];
    // → menu-0, menu-1 ... これらにあたる画面を作る必要がある
    this.menuIndex = 0;
    this.menu = this.menus[this.menuIndex];
    this.gameover = false;
  }

  draw(){
    this.canvas.style.backgroundColor = "#CDDDDD";

    this.ctx.save();
    this.ctx.fillStyle = "#2F2F2F";
    this.ctx.font = `${this.canvas.width/30}px Inter`;
    // fillText(挿入したい文字列r, x軸の位置, y軸の位置)
    this.ctx.fillText(`Click! COUNT : ${this.count}`, this.canvas.width/2, this.canvas.height/3);
    this.ctx.fillStyle = "#5aa2f5"; // 水色

    const sx = this.canvas.width * 4 / 9;  // 開始のx座表
    const sy = this.canvas.height * 4 / 9; // 開始のy座表
    const w = this.canvas.width * 1 / 9;   // 幅 
    const h = this.canvas.height * 1 / 9;  // 高さ

    this.ctx.beginPath();
    this.ctx.rect(sx, sy, w, h);
    this.ctx.fill();

    this.ctx.restore();
  }

  update(){
    const sx = this.canvas.width * 4 / 9;  // 開始のx座表
    const sy = this.canvas.height * 4 / 9; // 開始のy座表
    const w = this.canvas.width * 1 / 9;   // 幅 
    const h = this.canvas.height * 1 / 9;  // 高さ

    // マウスがrectの内側 かつ "mousedown"を含む かつ クリック可 
    if(this.controller.isMouseInsideRect(sx, sy, w, h) 
      && this.controller.keys.includes("mousedown") 
      && this.clickAcceptable
    ){
      this.count++;

      this.clickAcceptable = false;
    }
    // "mousedown"を含んでいない場合は再クリック可
    if(!this.controller.keys.includes("mousedown")) this.clickAcceptable = true;

    // メニュー0の時は、カウントが2でゲームオーバー
    if(this.menu === this.menus[0] && 2 <= this.count){
      this.gameover = true;
      this.clickAcceptable = false;
    }

    // 
    if(this.menu === this.menus[1] && 4 <= this.count){
      this.gameover = true;
      this.clickAcceptable = false;
    }

    //
    if(this.menu === this.menus[2] && 6 <= this.count){
      this.gameover = true;
      this.clickAcceptable = false;
    }
  }

  init(){ // 各プロパティを初期値に戻す
    this.menuIndex = 0;
    this.gameover = false;
    this.count = 0;
    this.menu = this.menus[this.menuIndex];
    this.clickAcceptable = false;
  }
}

