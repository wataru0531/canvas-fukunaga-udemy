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

import { Lint } from "./lint.js";


let ctx, canvas, lints;

// EventListener
// リサイズ
let timerId = null;

window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done!!")

    setup()
    draw()

  }, 500);
});

window.addEventListener("click", (e) => {
  // console.log(e) // PointerEvent {isTrusted: true, pointerId: 1, width: 1, height: 1, pressure: 0, …}isTrusted: truealtKey: falsealtitudeAngle: 1.5707963267948966azimuthAngle: 0bubbles: truebutton: 0buttons: 0cancelBubble: falsecancelable: trueclientX: 575clientY: 914composed: truectrlKey: falsecurrentTarget: nulldefaultPrevented: falsedetail: 1eventPhase: 0fromElement: nullheight: 1isPrimary: falselayerX: 575layerY: 914metaKey: falsemovementX: 0movementY: 0offsetX: 575offsetY: 914pageX: 575pageY: 914pointerId: 1pointerType: "mouse"pressure: 0relatedTarget: nullreturnValue: truescreenX: 575screenY: 1026shiftKey: falsesourceCapabilities: InputDeviceCapabilities {firesTouchEvents: false}srcElement: canvas#canvastangentialPressure: 0target: canvas#canvastiltX: 0tiltY: 0timeStamp: 2095.199999988079toElement: nulltwist: 0type: "click"view: Window {window: Window, self: Window, document: document, name: '', location: Location, …}which: 1width: 1x: 575y: 914[[Prototype]]: PointerEvent
  // console.log(e.clientX, e.clientY)

  // 指定した範囲を削除する
  erase(e.clientX, e.clientY);

  // 
  lints.forEach((lint, index) => {
    // console.log(lint.x, lint.y) // 描画の開始位置
    // console.log(e.clientX, e.clientY) // クリックした位置

  
    // クリック地点のx, yから、lintの開始地点x, yを引いて2点間の距離を取得
    // Math.sqrt() ... 与えられた数値の平方根を返す。スクエアルート
    // 平方根 ... ある数値aがあり、ある数値を2乗したときに、その数値aになる値のこと
    // const dist = Math.sqrt((e.clientX - lint.x)**2 + (e.clientY - lint.y)**2);
    // console.log(dist)
    // const dist = distance(lint.x, lint.y, e.clientX, e.clientY)
    // console.log("distance関数", dist)

    // 2点間の距離が50を下回る線を削除(近い線を削除)
    // if(dist < 50){
    //   lints.splice(index, 1); // 指定したインデックスから1つ作所
    //   console.log(lints)
    // }

    // クリックした地点と、線の開始座標の距離が50を下回るインスタンスのthis.Erasedをtrueに変える
    lint.update(e.clientX, e.clientY);
    // console.log(lint.isErased)

    // isErasedがfalseのままのインスタンスのみを取得
    lints = lints.filter(lint => {
      // console.log(!lint.isErased)

      return !lint.isErased; // falseの要素を返す。
    });
    // console.log(lints)

  })

})


// 2点間の距離を取得
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Math.sqrt() ... 与えられた数値の平方根を返す。スクエアルート
  return Math.sqrt(dx * dx + dy * dy);
}

// console.log(distance(0, 0, 3, 4)); // 5 (3-4-5の三角形)


// Functions
async function setup(){
  // getContext ... canvas要素に対して2Dの描画を行うためのコンテキストを取得。
  // この2Dコンテキストを通じて、線を引いたり、図形を描画したり、テキストを書いたりといった2Dグラフィックスの描画を行う
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.style.backgroundColor = "#161616"
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 線を描画するクラスを初期化
  lints = createLints(10);

  // await new Promise(resolve => setTimeout(() => resolve, 100));

  // console.log(lints) // Lint {canvas: canvas#canvas, ctx: CanvasRenderingContext2D, x: 175.60528262906502, y: 119.54056207418091, l: 14.476309509114396, …}
}
setup()

// _n個のlintsインスタンスを生成する
function createLints(_n){
  const lints = [];

  for(let i = 0; i < _n; i++){
    const lint = new Lint(canvas, ctx);
    // console.log(lint); // Lint {canvas: canvas#canvas, ctx: CanvasRenderingContext2D, x: 134.97933096772582, y: 298.7360882551515, l: 12.640162193231554, …}

    lints.push(lint)
  }

  return lints;
}

// 矩形を描く
function draw(){
  // console.log("draw running!!")
  lints.forEach(lint => lint.draw());
  
}
draw()


// 一定範囲の描画をクリアする
function erase(x, y){
  // clearRect(x軸の位置, y軸の位置, 幅, 高さ);
  ctx.clearRect(x, y, 50, 50);

}