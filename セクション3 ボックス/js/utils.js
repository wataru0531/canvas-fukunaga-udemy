
// 線形補間 t...補完係数
function lerp(start, end, t, limit = .001) {
  let current = start * (1 - t) + end * t;

  // end と currentの中間値の値が.001未満になれば、endを返す(要調整)
  if (Math.abs(end - current) < limit) current = end;

  return current;
}
// console.log(lerp(10, 15, 0.9991));


// transformを付与。_elはDOM
function setTransform(_el, _transform) {
  _el.style.transform = _transform;
}

// 与えた秒数、処理を遅らせる。ms
function delay(time){
  return new Promise(resolve => setTimeout(resolve, time))
}

// 文字をspanでラップする関数
function reduceText(_textArray){
  return _textArray.reduce((accu, curr) => {
    // console.log(accu, curr)
    curr = curr.replace(/\s+/, "&nbsp;")

    // return accu + curr
    return `${accu}<span class="char">${curr}</span>`
  }, "")
}


// ランダムな整数値を取得
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// ランダムな色を取得(randomと併用)
function randomColor() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}


// モバイルデバイスかタブレットだったらtrueを返す。PCだったらfalseを返す
function isDevice() {
  const ua = window.navigator.userAgent;
  // console.log(ua) // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
  
  // 検索対象の文字列や配列の中で、特定のサブ文字列や要素が最初に現れる位置を返す。見つからなかった場合は-1を返す。
  // console.log(ua.indexOf("iPhone")) // -1
  // if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
  //   return 'mobile';
  // }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
  //   return 'tablet';
  // }else{
  //   return 'desktop';
  // }

  const isMobile = (ua.indexOf('iPhone') > -1 || ua.indexOf('iPod') > -1 || ua.indexOf('Android') > -1 && ua.indexOf('Mobile') > -1);
  const isTablet = (ua.indexOf('iPad') > -1 || ua.indexOf('Android') > -1);
  if(isMobile || isTablet) return true;

  return false;
}


export {
  lerp,
  setTransform,
  delay,
  reduceText,
  random,
  randomColor,
  isDevice,
}