/**************************************************************

JavaScriptとCanvasでアニメーションとゲーム制作！～描き、動かし、操作する～animation&game～https://www.youtube.com/watch?v=2YbpKIMpujU&t=549s
https://www.udemy.com/course/javascriptcanvas/learn/lecture/32387952#overview
gsap easings  https://gsap.com/docs/v3/Eases/

***************************************************************/
// "数値" 指定時間後にトゥイーン。タイムラインの先頭からの時間（秒）で開始
// "+=1"  直前のトゥイーンの終了後に何秒だけ離すか delay: 1 と同じ
// "-=1"  直前のトゥイーンの終了に何秒だけ重ねるか delay: -1　と同じ

// ">"    直前のトゥイーンの終了時
// ">3"   直前のトゥイーンの終了後に何秒だけ離すか。3秒後にトゥイーンする
// "<"    直前のトゥイーンの開始時
// "<4"   直前のトゥイーンの開始時の何秒後か。4秒後にトゥイーン

// "ラベル名"  指定したラベルと同じタイミングでトゥイーン
// "ラベル名 += 数値"
// "ラベル名 -= 数値"

import { Manager } from "./manager.js";
import { Game } from "./game.js";

let ctx;
let canvas;
let lastTime;
let fps; // frame per second。 フレーム更新頻度
let interval; // ms。フレーム更新の間隔。
let animationId;

let manager;

// Functions
function setup(){
  // getContext ... canvas要素に対して2Dの描画を行うためのコンテキストを取得。
  // この2Dコンテキストを通じて、線を引いたり、図形を描画したり、テキストを書いたりといった2Dグラフィックスの描画を行う
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 全体に適用させる
  // ctx.fillStyle = "#fff";
  // ctx.strokeStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
    
  lastTime = 0;
  fps = 30;
  interval = 1000 / fps; 
  
  // Managerクラス
  manager = new Manager(canvas, ctx);
  // console.log(manager)
  manager.controller.getMousePosition(); 
  manager.controller.addMousedown();
  manager.controller.clearKeys();
  manager.controller.addKeys();
}
setup();

function draw(){
  manager.draw();
}

function update(){
  manager.update();
  // console.log(controller.mouse)
}

// animateの実行を制御
function pauseControl(){
  if(manager.state === manager.states[1]){
    // p を保持していたらtrue → 停止  かつ pauseがfalseの時にのみ
    if(manager.controller.keys.includes("p") && !manager.controller.pause){
      manager.controller.pause = true;

      // 停止した時の処理
      ctx.save();
      ctx.fillStyle ="rgba(100, 0, 100, .5)";
      ctx.font = `italic ${canvas.width/15}px Inter`;
      ctx.fillText("PAUSE", canvas.width/2, canvas.height/2);

      ctx.font = `italic ${canvas.width/20}px Inter`
      ctx.fillText("Press 'o' to Resume", canvas.width/2, canvas.height * 2/3);
      ctx.restore();
    }

    // o を保持していたらfalse → 実行
    if(manager.controller.keys.includes("o")){
      manager.controller.pause = false;
    }
  }
}

function animate(timestamp){
  // console.log(timestamp);
  // timestamp ... JSランタイムでRAFが発生してからの時間経過を測定、取得
  // console.log(timestamp);

  pauseControl()

  // コントローラーで実行を制御
  if(!manager.controller.pause){ // pauseがtrueなら実行停止
    if(timestamp - lastTime > interval){ 
      // canvas全体を削除 → canvasはスナップショットのように描画されているので、各フレームを描画する前に、前のフレームの残りを消しておく必要がある
      ctx.clearRect(0, 0, canvas.width, canvas.height)
  
      draw();
      update()
  
      lastTime = timestamp;
    }
  }
  
  animationId = requestAnimationFrame(animate);
  // console.log(animationId)
}
animate();



// リサイズ
let timerId = null; 
window.addEventListener("resize", () => {
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    setup();
    animate(0);

  }, 500);
})

