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

/**************************************************************

長方形の中に

***************************************************************/

let ctx;
let canvas;
let num;      // 1列、1行の中にあるセルの数
let cellSize; // １つのセル(正方形)の幅、高さ
let gapX;
let gapY;
let topLeftX; // ビューポート右端からの距離
let topLeftY; // ビューポート上端からの距離
let innerGap;


// EventListener
// リサイズ
let timerId = null;

window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done!!")

    setup()
    draw() // 矩形を描く

  }, 500);
})

// Functions
function setup(){
  // getContext ... canvas要素に対して2Dの描画を行うためのコンテキストを取得。
// この2Dコンテキストを通じて、線を引いたり、図形を描画したり、テキストを書いたりといった2Dグラフィックスの描画を行う
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.style.backgroundColor = "#222"
  ctx.strokeStyle = "#fff";
  num = 8; // 1列、1行の中にあるセルの数

  // セルの幅と高さを取得
  // SPの時はcanvasの幅を、PCの時はcanvasの高さを軸にしてセルの幅と高さを算出?
  // gapを考慮して2を足す
  if(canvas.height < canvas.width){ // パソコン版 高さ < 幅
    cellSize = canvas.height * 8/10 / (num + 2);
    gapY = (canvas.height * 8/10 - cellSize * num) / (num - 1);

    gapX = gapY;

    topLeftY = canvas.height / 10;
    topLeftX = (canvas.width - canvas.height * 8/10) / 2;

  } else { // スマホ版 高さ > 幅
    cellSize = canvas.width * 8/10 / (num + 2);
    // console.log(cellSize) // 48

    // gapの幅と高さを取得
    // gapは狭い方を選択する → 高さを基準
    gapX = (canvas.width * 8/10 - cellSize * num) / (num - 1);
    gapY = gapX; // gapXをgapYに等しくさせる
    // console.log(gapX, gapY) // 13.714285714285714 13.714285714285714

    // ビューポート右からの距離
    topLeftX = canvas.width / 10;

    // ビューポート上からの距離
    topLeftY = (canvas.height - canvas.width * 8/10) / 2;
  }

  // セルの中のgap
  innerGap = cellSize / 8;
}
setup()

// 矩形を描く
function draw(){
  // 外枠
  // ctx.beginPath();
  // ctx.rect(
  //   canvas.width / 10,  // x
  //   canvas.height / 10, // y
  //   canvas.width * 8 / 10, // 幅。widthの80%
  //   canvas.height * 8 / 10, // 高さ
  // )
  // ctx.stroke()

  // セルを配置
  // → yの処理1回に対してxの処理がnum回の反復
  for(let y = 0; y < num; y++){ // num = 8
    for(let x = 0; x < num; x++){
      // ①つ目
      ctx.save();
      ctx.beginPath();
      if(Math.random() < .5) ctx.lineWidth = 3;
      
      ctx.rect( // 矩形
        topLeftX + (cellSize + gapX) * x, // x軸の位置
        topLeftY + (cellSize + gapY) * y, // y軸の位置
        cellSize, // 幅
        cellSize, // 高さ
      )
      ctx.stroke();
      ctx.restore();

      if(Math.random() < .5){ // ランダムに表示
        // ②つ目。セルの中にさらにセルを生成
        // hsl 色相(0〜360°)、彩度(黒←→色。鮮やかさ)、輝度(黒←→白)。参考 https://hslpicker.com/#30c5b4
        ctx.save(); // 影響範囲を２つ目まで。コンテキスを保存。
        ctx.strokeStyle = `hsl(${Math.random()*360}, 100%, 50%)`;
        ctx.beginPath();
        ctx.rect( // 矩形
          topLeftX + innerGap + (cellSize + gapX) * x,
          topLeftY + innerGap + (cellSize + gapY) * y,
          cellSize - innerGap * 2, // 内側のgap分小さくする
          cellSize - innerGap * 2, 
        )
        ctx.stroke();
        ctx.restore();
      }

      if(Math.random() < .5){
        // ③つめ
        ctx.save();
        ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
        ctx.beginPath();
        ctx.rect(
          topLeftX + innerGap * 2 + (cellSize + gapX) * x,
          topLeftY + innerGap * 2 + (cellSize + gapY) * y,
          cellSize - innerGap * 4,
          cellSize - innerGap * 4,
        )
        ctx.fill();
        ctx.restore();
      }

    }
  }

}


draw()

