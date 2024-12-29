
// エリアのボールとポールを描く

export class Area{
  constructor(canvas, ctx, numOfDisks){ // numOfDisks ... メニュー選択時に決定される
    this.canvas = canvas;
    this.ctx = ctx;
    this.areaSize = Math.floor(this.canvas.width/4); // 1つのボードの幅
    this.x = null;
    this.y = null;
    this.numOfDisks = numOfDisks;
    this.boardWidth = this.areaSize; // 1つのボードの幅
    this.boardHeight = this.areaSize / 10;
    this.poleWidth = this.boardHeight * 2/3;
    this.poleHeight = this.areaSize * 9/10;
  
    this.disks = null; // ディスクの枚数。 数値の配列。3なら、0 1 2
    this.diskHeight = Math.floor(this.poleHeight * 8/10 / this.numOfDisks);
    this.maxDiskWidth = this.boardWidth * 9/10; // ディスクの最大幅
    this.minDiskWidth = this.boardWidth * 3/10; // ディスクの最小幅
    this.difDiskWidth = this.boardWidth * 6/10 / this.numOfDisks; // 隣り合うディスクの幅の差
    
  }

  draw(){
    this.drawBoardAndPole();
    this.drawDisks(); // ディスクを描画
  }

  // 1セットのボードとポールを生成する関数
  drawBoardAndPole(){
    // ボード
    this.ctx.save();
    this.ctx.fillStyle = "#a63c06";
    this.ctx.beginPath();
    this.ctx.fillRect(
      this.x, 
      this.y + this.poleHeight,
      this.boardWidth,
      this.boardHeight,
    );
    this.ctx.restore();
    // ポール
    this.ctx.save();
    this.ctx.fillStyle = "#c36f09";
    this.ctx.beginPath();
    this.ctx.fillRect(
      this.x + this.boardWidth/2 - this.poleWidth/2, 
      this.y,
      this.poleWidth,
      this.poleHeight,
    );
    this.ctx.restore();
  }

  // ディスクを描画する処理 game.jsで発火
  drawDisks(){
    if(this.disks){ // disks ... 数値の配列
      this.disks.forEach((disk, index) => {
        // console.log(disk); // 0 1 2  ... 多分0番目が1番幅が大きい
        const w = this.maxDiskWidth - this.difDiskWidth * disk;
        const x = this.x + (this.areaSize - w) / 2;
        const y = this.y + this.poleHeight - this.diskHeight * index;
        const h = - this.diskHeight; // 左下から右上にrectを描画する

        this.ctx.save();
        // ディスクの色 ... ディスクの大きさに応じて設定
        this.ctx.fillStyle = `hsl(${360/this.numOfDisks * disk}, 100%, 75%)`;
        this.ctx.beginPath();
        this.ctx.fillRect(x, y, w, h);
        this.ctx.restore();
      })
    }
  }

  // ディスクを動かす処理
  moveDiskTo(anotherArea){
    // console.log(anotherArea)
    if(this.disks){
      // ・移動先にディスクが1枚もない場合
      // ・移動先のdisks配列の最後の値が、移す元の最後の値よりも小さい場合
      if(anotherArea.disks.length === 0 || 
        anotherArea.disks[anotherArea.disks.length - 1] < this.disks[this.disks.length - 1]
      ){
        // 移す元の配列の最後を削除、取得して、移動先に渡す
        const disk = this.disks.pop(); // pop() 配列の最後の要素を削除し、その要素を返す
        // console.log(disk)
        anotherArea.disks.push(disk);
      }
    }
  }

  // 

}

