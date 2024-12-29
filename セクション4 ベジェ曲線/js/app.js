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

import { Utils } from "./utils.js";

const utils = new Utils();
// console.log(utils)

let ctx;
let canvas;
let lastTime;
let fps; // frame per second。 フレーム更新頻度
let interval; // ms。フレーム更新の間隔。

let animationId = null
let timerId = null; // リサイズ

// ベジェ曲線の点
// p ... 開始点と終了点。ポイント
// cp ... 制御点。コントロールポイント
let p0;
let p1;
let cp0;
let cp1;

let r; // 点の半径
let points; // 開始点を制御点の配列

let unit; // 線形補間の補完係数
let limit; // for文で線を描く時のリミット
let growth;

let mouse;
let draggablePoint;

// EventListener
window.addEventListener("resize", () => {
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    setup()
    animate(0)

  }, 500);
})

window.addEventListener("mousedown", mouseDown);
window.addEventListener("mousemove", mouseMove);
window.addEventListener("mouseup", mouseUp);


// 
window.addEventListener("click", () => {
  if(animationId){
    // console.log(animationId);

    cancelAnimationFrame(animationId);

    animationId = null; // 一度初期化したやる。
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
  fps = 60;
  interval = 1000 / fps; 

  // 3次ベジェ曲線
  // 曲線の始点と終点
  p0 = { x: canvas.width / 10, y: canvas.height / 10 }; // 始点
  p1 = { x: canvas.width * 2 / 10, y: canvas.height * 8 / 10 }; // 終点

  // 制御点
  // コントロールポイント1つ目 と // コントロールポイント2つ目
  cp0 = { x: canvas.width * 8 / 10, y: canvas.height / 10 }; // // コントロールポイント1つ目
  cp1 = { x: canvas.width * 6 / 10, y: canvas.height * 9 / 10 }; // // コントロールポイント2つ目

  r = 5; // 各点の半径
  points = [p0, p1, cp0, cp1]; // ベジェ曲線の始点と制御点

  mouse = { x: null, y: null }
  draggablePoint = null;

  unit = .01; // for文の増加値
  limit = 0; // for文の限界値
  growth = unit; // 線の増加数
  // → bジェ曲線がp2に到達した後は、limitを -unit分ずつ減少させて、
  //   p1に戻ったら、再び+unitづつ増加させていく
}
setup()


// マウスダウン
function mouseDown(e){
  // console.log("mousedown")
  mouse = { x: e.clientX, y: e.clientY }

  // points = [p0, p1, cp0, cp1]; // 始点、終点、始点に近い位置、終点に近い位置
  // console.log(points) 
  // (4) [{x: 65.5, y: 93.8}, {x: 131, y: 750.4}, {x: 524, y: 93.8}, {x: 393, y: 844.2}]
  points.forEach((p) => {
    // クリックした場所 と 点の場所の距離が、点の半径より小さい場合にtrueを返す。
    // → 点の上をクリックした場合にtrue
    const mouseOnPoint = Math.sqrt((p.x - mouse.x)**2 + (p.y - mouse.y)** 2) < r;
    // console.log(mouseOnPoint)

    if(mouseOnPoint){
      // クリックした点の座標の参照を保持→draggableを変更すると元の座標も変更となる
      draggablePoint = p; 
      // console.log(draggablePoint);
    }
  })
}

// マウスムーブ
// クリックした点のみをmousemoveしてを動かす
function mouseMove(e){
  // console.log(e.clientX, e.clientY);

  if(draggablePoint){
    // draggablePointは、pのオブジェクトへの参照を持つのでpのオブジェクトの中の座標も変更される
    draggablePoint.x = e.clientX;
    draggablePoint.y = e.clientY;
  }
}

// マウスアップ 選択解除
function mouseUp(){
  draggablePoint = null;
}

// lerp(p0, p1, t){
//   const x = (1 - t) * p0.x + t * p1.x;
//   const y = (1 - t) * p0.y + t * p1.y;

//   return { x: x, y: y }
// }

// p0: 始点、p1: 終点、cp0: 制御点1つ目、cp1: 制御点2つ目
// フォルダに参考図形
function bezier(p0, p1, cp0, cp1){
  let from = p0; // ベジェ曲線の始点

  // Math.floor((t + unit)*10000)/10000
  // → 一度10000倍にすることで、小数点4位までの数字以外を切り捨て。
  //   次に10000で割ることで、小数点４位まで確保できる
  // → 精度の制御、パフォーマンスの改善
  for(let t = 0; t < limit; t = Math.floor((t+unit)*10000)/10000){ // ベジェ曲線を10の曲線で描く。
    // console.log(Math.floor((t+unit)*10000)/10000)

    // それぞれの点から点までの.1から.9までの値を持つ中間点のオブジェクトを取得
    let q0 = utils.lerp(p0, cp0, t);  // p0 - cp0 までの値
    let q1 = utils.lerp(cp0, cp1, t); // 
    let q2 = utils.lerp(cp1, p1, t);
    let qA = utils.lerp(q0, q1, t);
    let qB = utils.lerp(q1, q2, t);
    let q =  utils.lerp(qA, qB, t);
  
    // q0, q1, q2 を線で結ぶ
    ctx.save();
    ctx.strokeStyle =  `hsl(${360 * t}, 100%, 50%)`
    ctx.setLineDash([2, 2]); // 点線を描く。[実線、空白]
    ctx.beginPath()
    ctx.moveTo(q0.x, q0.y); // 始点
    ctx.lineTo(q1.x, q1.y);
    ctx.lineTo(q2.x, q2.y);
    ctx.stroke();
    ctx.restore();

    // qA から qB にラインを結ぶ
    ctx.save();
    ctx.strokeStyle =  `hsl(${360 * t}, 100%, 50%)`
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(qA.x, qA.y);
    ctx.lineTo(qB.x, qB.y);
    ctx.stroke();
    ctx.restore();

    // 曲線状のqを結ぶ
    ctx.save();
    ctx.strokeStyle = "#ff0000"; // 赤
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y); // ベジェ曲線の始点
    // ループが繰り返されると、視点はlineTo(x, y)を始点とするqに置き換える必要がある
    // ので、ループの初めにfrom変数を生成
    ctx.lineTo(q.x, q.y); // 向かう先
    ctx.restore();

    from =  q;
  }
}


// 3次ベジェ曲線の描画
function draw(){
  ctx.save()
  ctx.lineWidth = 1;

  // 3次ベジェ曲線の描画
  // → 始点、制御点、終点から成り立つ曲線
  // 3次多項式を使って計算されるためこの3次時ベジェ曲線
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y); // 始点

  // 3次ベジェ曲線の 制御点(コントロールポイント)と終点 を描画
  // 制御点は曲線がどのように湾曲するかを決定
  // 基本的に始点は、moveToで決定しておく。
  ctx.bezierCurveTo( 
    cp0.x,  // 制御点1つ目
    cp0.y,  
    cp1.x,  // 制御点2つ目
    cp1.y, 

    p1.x,   // 終点
    p1.y
  );
  // ctx.stroke()
  ctx.restore()

  // 点を描く
  // points = [p0, p1, cp0, cp1]; // 始点、終点、始点に近い位置、終点に近い位置
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, r, 0, Math.PI * 2);
    // ctx.stroke();
    ctx.fill() // 塗りつぶした丸
  })

  // ベジェ曲線を描く
  bezier(p0, p1, cp0, cp1)
}


// 何かの変数 の値を更新していくときに使用
function update(){
  // リミットが0以下 もしくは 1以上に達した場合
  // growthのプラス、マイナスを逆転させる
  if(limit < 0 || 1 <= limit) {
    // console.log("limit reversed!!");

    growth *= -1;
  }

  // limit += growth;
  // Math.floor((limit + growth)*10000)/10000
  // → 小数点4位までの数値を使い、浮動小数点の制御、、パフォーマンスの改善。
  limit = Math.floor((limit + growth)*10000)/10000;
}


function animate(timestamp){
  // timestamp ... JSランタイムでrafが発生してからの時間経過を取得
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


