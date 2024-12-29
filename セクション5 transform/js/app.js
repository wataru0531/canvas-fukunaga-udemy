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
// 初期化処理
function setup(){
  // getContext ... canvas要素に対して2Dの描画を行うためのコンテキストを取得。
  // この2Dコンテキストを通じて、線を引いたり、図形を描画したり、テキストを書いたりといった2Dグラフィックスの描画を行う
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.backgroundColor = "#161616";

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";

  lastTime = 0;
  fps = 30;
  interval = 1000 / fps; 
}
setup()

function animate(timestamp){
  // timestamp ... JSランタイムでRAF発生してからの時間経過を取得
  // console.log(timestamp);
  
  if(timestamp - lastTime > interval){ 
    // canvas全体を削除
    // → canvasはスナップショットのように描画されているので、各フレームを描画する前に、前のフレームの残りを消しておく必要がある
    // ctx.clearRect(0, 0, canvas.width, canvas.height)

    // canvasの原点の座標を削除していた場合は、クリアする範囲を変える
    ctx.clearRect(- canvas.width/2, - canvas.height/2, canvas.width, canvas.height)

    draw();
    update()

    lastTime = timestamp;
  }

  animationId = requestAnimationFrame(animate);
}
// animate()

// 矩形を描く
function draw(){
  // 矢印、線を描く
  // drawArrow(); 
  // translateSample() 

  // 回転
  rotateSample()

  // 拡大・縮小
  // scaleSample();

}

// 変数の更新 数値など
function update(){
  angle += .05;
}

// 矢印、線を描く
function drawArrow(){
  // save、restoreは必須
  // → これらがないと、drawの中で繰り返し実行されてしまう
  // ctx.save();

  // translate
  // → ctxの描画コンテキスト内の座標をずらす。
  // なのでsave、restoreを使って影響範囲を限定させる
  // ctx.translate(100, 100); 

  // 矢印の描画
  ctx.textAlign = "left"; // 左端がx座表に揃う
  ctx.textBaseline = "middle"; // x座表の中央に揃う。top
  ctx.font = "120px monospace";
  ctx.fillText("→", 300, 0); // strokeなど不要。strokeText

  // 線を描画
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(300, 0);
  ctx.stroke();

  // ctx.restore();
}

// 矢印を描く
function translateSample(){
  // translate
  // → ctxの描画コンテキスト内の原点の座標をずらす。
  //   なのでsave、restoreを使って影響範囲を限定させる
  ctx.save();

  ctx.translate(100, 100); // ここで原点をずらす
  drawArrow();

  ctx.translate(200, 200); // さらに原点をずらす
  drawArrow();

  ctx.restore();

  // ②回目 
  // ... save、restoreされて状態がリセットされている
  //     ので原点の座表がcanvasの左上の座標に戻る
  ctx.save();
  ctx.fillStyle = "#0fa"

  ctx.translate(200, 200); // 原点の座標をずらす
  drawArrow();

  ctx.restore();
}

// 回転
// → translateと同様に、ctxの状態に保存されるので、save、restoreを使わない場合は
//   ずれていくので注意
function rotateSample(){
  ctx.save();

  // 原点の座表をcanvasの中央に配置
  ctx.translate(canvas.width / 2, canvas.height / 2);
  drawArrow(); // ①回目

  // 原点の座標を30°ずらす
  // rotate 
  // → 座表の原点を中心に回す
  ctx.rotate(Math.PI / 6); // 30°。時計回り
  drawArrow() // ②回目

  // さらに30°ずらす
  ctx.rotate(Math.PI / 6);
  drawArrow(); // ③回目

  // 座表自体が回転しているので、描かれる場所が左上あたりになっているので注意
  ctx.arc(-300, 0, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 拡大・縮小
function scaleSample(){
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  drawArrow();
  ctx.rotate(Math.PI); // 180°

  ctx.scale(1.5, 5); // x軸方向に2倍、y軸方向に2倍

  drawArrow();

  ctx.restore();
}
