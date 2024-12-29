
// gameに関するクラス
// → game自身を管理

// import { Controller } from "./controller.js";

export class Game{
  constructor(canvas, ctx, controller){
    this.canvas = canvas;
    this.ctx = ctx;
    this.clickAcceptable = true;

    // controllerはこのクラス内で使う
    this.controller = controller;

    this.menuMap = [
      { name: "menu-0", level: 0 }, 
      { name: "menu-1", level: 1 }, 
      { name: "menu-2", level: 2 }
    ];
    // → menu-0, menu-1 ... これらにあたる画面を作る必要がある
    this.menuIndex = 0;
    this.gameover = false;
  }

  draw(){
    this.canvas.style.backgroundColor = "#CDDDDD";

    this.ctx.save();
    
    this.ctx.restore();
  }

  update(){

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

    // 

  }

  init(){ // 各プロパティを初期値に戻す
    this.menuIndex = 0;
    this.gameover = false;
    this.clickAcceptable = false;
  }
}

