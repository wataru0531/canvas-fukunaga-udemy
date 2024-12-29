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

let animationId = null // raf
let timerId = null; // st

let y = 0; // グラデーションの高さ

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
function draw(){
  // 背景グラデーション
  gradientBackGround();

  // 矩形グラデーション
  gradientRect();

  // 放射状のグラデーション
  gradientCircle();

  // 立体的な円
  sphere()
}


// 放射状のグラデーション
function gradientCircle(){
  ctx.save();
  
  // 円を描く
  // 半径80の円に半径20の円が乗っているイメージ
  const radialGradient = ctx.createRadialGradient(
    // 最初の円 ... 最初の円の中心座標と半径
    canvas.width / 2 - 50, 
    canvas.height / 5 - 50,
    20,
    // 2つ目の円　... 2番目の円の中心と半径
    canvas.width / 2 - 40,
    canvas.height / 5 - 40,
    80,
  )

  radialGradient.addColorStop(0, "#fff");
  radialGradient.addColorStop(.2, "#f00");
  radialGradient.addColorStop(.5, "#0f0");
  radialGradient.addColorStop(.8, "#00f");
  radialGradient.addColorStop(1, "#666");

  ctx.fillStyle = radialGradient;
  ctx.beginPath();
  // ここで大きさを設定し、fillで描画する
  ctx.arc(canvas.width/2, canvas.height/5, 80, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

// 球を描く 
// → 円を描く中心座標をうまくずらして立体的に見せている
function sphere(){
  ctx.save();

  // 影の付け方①
  // 球の下に、楕円を描画
  ctx.fillStyle = "rgba(0, 0, 0, .1)";
  ctx.beginPath();
  ctx.ellipse(
    canvas.width / 2 + 20,  // 中心のx座表
    canvas.height / 2 + 150, // 中心のy座表。150下に下げる
    100, // x軸方向の半径
    20,  // y軸方向の半径
    0,   // 楕円の回転角度
    0,   // 開始角度
    Math.PI * 2 // 終了角度
  );
  ctx.fill()

  // 影の付け方②
  // radialGradientの背景に影をつける
  // → その後の描画操作に対して影が適用される。ここでは、arc()している物体に適用
  // ctx.shadowColor = "rgba(0, 0, 0, .1)";
  // ctx.shadowOffsetX = 90; // 影の位置を現在の描画位置からどれだけずらすかを決定
  // ctx.shadowOffsetY = 90;
  // ctx.shadowBlur = 10; // ぼかし

  // 影の付け方③
  // ctx.filter = "drop-shadow(90px 90px 10px rgba(0, 0, 0, .1))"

  const radialGradient = ctx.createRadialGradient(
    canvas.width / 2 - 60,
    canvas.height / 2 - 60,
    25,
    canvas.width / 2 - 50,
    canvas.height / 2 - 50,
    120
  );

  radialGradient.addColorStop(0, "#fff");
  radialGradient.addColorStop(1, "#aaa");

  ctx.fillStyle = radialGradient;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}


// 線形グラデーションを描く関数
function gradientBackGround(){
  ctx.save();

  // グラデーションの方向と色の割合いを設定(ここでは左上 → 右下に向かう)
  // createLinearGradient(始点x軸, 始点y軸, 終点x軸, 終点y軸)
  const gradient = ctx.createLinearGradient(
    0, 
    0, 
    canvas.width, 
    canvas.height
  );
  gradient.addColorStop(0, "#e3879e");  // 始点
  gradient.addColorStop(.4, "#fec0ce");
  gradient.addColorStop(1, "#f1a66a");  // 終点
  // console.log(gradient) // CanvasGradient {}

  // gradientに保存されている線形グラデーションを背景の塗りつぶしスタイルとして設定
  ctx.fillStyle = gradient;
  ctx.beginPath();

  // fillRectはあくまでも大きさを設定
  ctx.fillRect(0, 0, canvas.width, canvas.height); // 描画 + 塗りつぶし

  ctx.restore();
}

// 矩形グラデーションを描画
function gradientRect(){
  ctx.save();

  // ぼかしをいれる
  // ctx.filter = "blur(5px)"

  // グラデーションの方向と、色の割合いを設定
  const gradient = ctx.createLinearGradient(
    0, // 開始点x
    0, // 開始点y
    0, // 終了点x
    canvas.height // 終了点y
  )
  gradient.addColorStop(0, "#f00");
  gradient.addColorStop(.2, "#faa");
  gradient.addColorStop(.4, "#0f0");
  gradient.addColorStop(.6, "#afa");
  gradient.addColorStop(.8, "#aaf");
  gradient.addColorStop(1, "#00f");

  ctx.fillStyle = gradient;
  ctx.beginPath();

  // fillRect ... 大きさを設定 + 描画
  // ①つめの図形
  ctx.fillRect(0, 0, canvas.width / 10, canvas.height);

  // ②つ目の図形
  ctx.fillRect(
    canvas.width / 10, // 開始点x
    y,                 // 開始点y
    canvas.width / 10, // 終了点y
    100                // 終了点y
  );

  ctx.restore();
}


// 変数の数値の更新など
function update(){
  y += 3;
}

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