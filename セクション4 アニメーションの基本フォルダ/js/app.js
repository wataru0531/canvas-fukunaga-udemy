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


let ctx;
let canvas;
let lastTime;
let fps; // frame per second。 フレーム更新頻度
let interval; // ms。フレーム更新の間隔。

let animationId = null
let timerId = null; // リサイズ


// EventListener
window.addEventListener("resize", () => {
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    setup()
    animate(0)

  }, 500);
})

// 
window.addEventListener("click", () => {
  if(animationId){
    // console.log(animationId);

    cancelAnimationFrame(animationId);

    animationId = null;
  } else {
    animate(0)
  }
})

// Functions
function setup(){
  // getContext ... canvas要素に対して2Dの描画を行うためのコンテキストを取得。
  // この2Dコンテキストを通じて、線を引いたり、図形を描画したり、テキストを書いたりといった2Dグラフィックスの描画を行う
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.backgroundColor = "#222";

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  lastTime = 0;
  fps = 30;
  interval = 1000 / fps; 
}
setup()

// 矩形を描く
function draw(){}


// 変数の更新 数値など
function update(){}

function animate(timestamp){
  // timestamp ... JSランタイムでRAF発生してからの時間経過を取得
  // console.log(timestamp);
  
  if(timestamp - lastTime > interval){ 
    // canvas全体を削除
    // → canvasはスナップショットのように描画されているので、各フレームを描画する前に、前のフレームの残りを消しておく必要がある
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    draw();
    update()

    lastTime = timestamp;
  }

  animationId = requestAnimationFrame(animate);
}
// animate()