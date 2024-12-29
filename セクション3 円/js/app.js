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

import { Ripple } from "./ripple.js";

let ctx, canvas, ripples;

// EventListener
// リサイズ
let timerId = null;

window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done!!")

    setup();
    draw();

  }, 500);
})

// Functions
function setup(){
  // getContext ... canvas要素に対して2Dの描画を行うためのコンテキストを取得。
  // この2Dコンテキストを通じて、線を引いたり、図形を描画したり、テキストを書いたりといった2Dグラフィックスの描画を行う
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.style.backgroundColor = "#222"
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // リップルの生成
  ripples = createRipples(8);
  // console.log(ripples);

}
setup()

function draw(){
  ripples.forEach(ripple => ripple.draw());
}

function createRipples(_n){
  const ripples = [];

  for(let i = 0; i < _n; i++){
    const ripple = new Ripple(canvas, ctx);
    ripples.push(ripple)
  }

  return ripples;
}

let intervalId = null;
// 2000ms毎にコールバックを呼ぶ
intervalId = setInterval(() => {
  setup();
  draw();

}, 2000);

// clearInterval(intervalId, )
