/**************************************************************

基本の形の確認ファイル

***************************************************************/


let ctx;
let canvas;
let timerId = null; // リサイズ


// EventListener

window.addEventListener("resize", () => {
  clearTimeout(timerId);

  timerId = setTimeout(() => {
    // console.log("resize done!!")

    setup()
    draw()

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
}
setup()

// 矩形を描く
function draw(){

  //////////////////////////
  /// 矩形(四角形)
  //////////////////////////
  // beginPath 
  // それまでに定義されていたパスをクリアし、新しいパスを作成し、
  // 以前のパスとは無関係に、新たな図形や線を描画することが可能となる。
  // → 1つの図形に1つつけるのが基本となる
  ctx.beginPath(); 
  ctx.rect( // rect(x座表, y座表, 幅, 高さ)
    100, // x座表の開始位置
    100, // y座表の開始位置
    100, // 幅
    100  // 高さ
  ); 
  ctx.strokeStyle = "#fff"; // 線の色。先に設定
  ctx.stroke(); // rectを線で描く
  
  ctx.beginPath(); // ここから新しい描画処理を始める
  ctx.rect(250, 100, 100, 100);
  ctx.strokeStyle =  "yellow";
  ctx.stroke();

  ctx.beginPath();
  // ctx.rect(400, 400, 100, 100);
  ctx.fillStyle = "green"; // 塗りつぶしのスタイル
  // ctx.fill(); // 塗りつぶす
  ctx.fillRect(400, 100, 100, 100); // 省略形(図形を描く、塗り潰し)


  //////////////////////////////////
  // 円、楕円形
  //////////////////////////////////
  // 円
  ctx.beginPath();
  // arc(x座表, y座表, 半径, 円弧の開始角度, 終了角度, 円弧を描く方向(デフォルトはfalseで、時計回り))
  // 円弧の開始角度, 終了角度 
  // → あくまでも位置のことでどこからどこまで描くかを設定
  // ここでは、0ラジアンの位置から2πラジアンの位置まで時計回りに弧を描く
  ctx.arc(150, 350, 50, 0, Math.PI / 2, false); // 弧度法(円周の長さを角度とする)
  ctx.strokeStyle = "red";
  ctx.stroke();

  // 塗りつぶし
  ctx.beginPath();
  // Math.PIの位置から半時計周りに-Math.PI/2の位置までを描く
  ctx.arc(300, 350, 50, Math.PI, -Math.PI / 2, true); 
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.strokeStyle = "yellow";
  ctx.stroke();

  // 中央に円３つ
  // ①
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2, // x軸の位置
    canvas.height / 2,
    25,
    0,
    Math.PI * 2, // 2π。360°
    false, // 時計回り
  )
  // ctx.strokeStyle = "blue";
  ctx.stroke();

  // ②
  // saveとrestoreのブロックを作り状態(strokeStyle、fillStyle、lineWidthなどの状態)を他に影響を与えなくする。
  // save ... ctxの内部ではこれまでの描画コンテキストの状態がスタックに、
  //          スナップショットのように保存される。
  //          スタック構造のために、複数回ctx.saveで追加でき、restoreで復元可能。
  // 
  // restore ... 保存されたスナップショットの状態に復元。
  //             saveとrestoreの間の記述で状態が変わった部分はcanvasには反映されるが、
  //             restoreによりsaveされたスナップショットの状態に復元されるので、restore以降の処理には反映されない。

  // 注意 ... CanvasRenderingContext2Dでは基本的に一つの状態しか維持できない仕様。
  // strokeStyle、lineWidthなどはコンテキスト全体に影響を与えるので注意が必要
  ctx.save()
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    50,
    0,
    Math.PI * 2, // 2π。360°
    false,
  )
  ctx.strokeStyle = "green";
  ctx.lineWidth = 5; // ラインの太さ。3つ目にも影響がでてしまう。
  ctx.stroke();
  ctx.restore();

  // ③
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    75,
    0,
    Math.PI * 2, // 2π。360°
    false,
  )
  // ctx.strokeStyle = "blue";
  ctx.stroke();


  // 楕円
  ctx.beginPath();
  // ellipse(x軸, y軸, x軸方向の長さ, y軸方向への長さ, 回転の角度, 円弧の開始角度, 終了角度)
  ctx.ellipse(500, 350, 100, 40, -Math.PI/3, 0, Math.PI * 2);
  ctx.strokeStyle = "pink";
  ctx.stroke();

  
  // 線を描く
  // save()
  ctx.strokeStyle = "#fff";
  ctx.fillStyle = "blue"
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, 550); // 描画の開始位置
  ctx.lineTo(300,550); // 開始店から、x:500、y:700の位置まで描く
  ctx.lineTo(100, 600); 
  ctx.closePath(); // 視点と終点を結ぶ
  ctx.fill();
  ctx.stroke();
  // restore();
  
  // テキストの描画
  // → beginPath()、stroke()、fill()などが不要
  // font-family 参考URL https://www.tutorialbrain.com/css_tutorial/-css_font_family_list
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  ctx.fillStyle = "green";
  ctx.font = "20px Candara"
  ctx.strokeText("strokeText", 50, 650); // x, y。輪郭を縁取って書く
  ctx.fillText("fillText", 50, 700); // 塗りつぶして書く
  
  // 十字ライン
  // ①
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(20, 720); // 開始位置
  ctx.lineTo(550, 720);
  ctx.stroke();
  // ②
  ctx.beginPath();
  ctx.moveTo(275, 750);
  ctx.lineTo(275, 650);
  ctx.stroke()

  // テキスト
  // → 十字の下線に沿うように配置
  ctx.fillStyle = "#0fa";
  ctx.font = "20px Inter";
  // ctx.textAlign = "center"; // 中央揃え。指定したx座標に揃う動作
  // ctx.textAlign = "right"; // テキストの右端がx座表に揃う
  ctx.textAlign = "left";  // ..      左端がx..
  // ctx.textBaseline = "middle"; // 指定したx座表の中央に揃う
  ctx.textBaseline = "top" // テキストの上端がbaselineに揃う
  ctx.fillText("FillText", 275, 720)

}


draw()

