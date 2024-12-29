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
let n = 0;

let lastTime;
let fps; // frame per second。 フレーム更新頻度
let interval; // ms。フレーム更新の間隔。

let numOfCols; // 棒グラフの数
let barWidth; // 棒の太さ
let marginX; // 
let values; // 各棒グラフの値を格納する配列

let animationId = null
let timerId = null; // リサイズ


// EventListener
window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    setup()
    animate()

  }, 500);
})

// 
window.addEventListener("click", () => {
  if(animationId){
    // console.log(animationId);

    cancelAnimationFrame(animationId);

    // 一度cancelAnimationFrameでidを無効にしたらそのidではcancelできない。一度idをnullに初期化してやる必要がある
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
  ctx.strokeStyle = "#fff"

  // 変数の初期化
  lastTime = 0;
  fps = 30; // frame per second。 フレーム更新頻度
  interval = 1000 / fps; // ms。フレーム更新の間隔。

  numOfCols = 300; // 棒グラフの数
  barWidth = Math.floor(canvas.width / numOfCols); // 棒の幅
  // console.log(canvas.width / numOfCols) // 1.71
  marginX = canvas.width - barWidth * numOfCols; // gapの総幅数。小数をなくすので生成できる
  // console.log(marginX)
  values = new Array(numOfCols).fill(0); // 棒グラフの値を格納する配列。初期値は0。
  // console.log(values) // (300) [空 × 300]
}
setup();


// 
function draw(){
  drawBar();
}

//
function update(){
  updateValues(100)
}


// 棒を描く処理
// updateValuesでvalues[i]]の数値が増加していくので連動していく。
// → この関数内の高さがy軸マイナス方向に伸びていく
function drawBar(){
  for(let i = 0; i < numOfCols; i++){
    const barHeight = values[i];
    
    ctx.beginPath();
    ctx.fillRect(
      marginX / 2 + barWidth * i,  // x軸の開始位置。
      canvas.height, // y軸の開始位置 ... 画面下
      barWidth, // 幅
      - barHeight, // 高さ。上に伸びるのでマイナス
    )

  }
}


// 299までのランダムな値を取得し、棒グラフの値を1づつプラス
function updateValues(_n){
  // const index = pickUpIndex();
  // values[index] += 1;

  // updateValuesが1度呼ばれると、_n個のカラムに対して数値の更新が呼ばれる
  for(let i = 0; i < _n; i++){
    const index = pickUpIndex(10);

    values[index] += 1;
  }
}

// 0から299までのランダムな値を取得
// → _repの数が上がれば中央の150が返される可能性が上がる。
function pickUpIndex(_rep){
  let total = 0;
  // const value1 = Math.random();
  // const value2  = Math.random();
  // total = value1 + value2;

  for(let i = 0; i < _rep; i++){
    total += Math.random();
  }

  // この平均値は計算が多ければ多いほど、.5が返される確率が上がる
  const average = total / _rep;

  const index = Math.floor(average * numOfCols);
  // console.log(index)

  return index;
}
// pickUpIndex()


// 再帰関数
function animate(timestamp){
  // intervalを大きくする = フレーム更新の間隔を大きくする = fpxを小さくすることで描画速度を調整
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