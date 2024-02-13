let currentAudio;
let source;
let inter;
let text = ["Play", "Stop"];

function $(e) {
  return document.getElementById(e);
}

function playAudio(audio) {
  // audio is an array buffer
  let context = new AudioContext();
  audio = context.decodeAudioData(audio)
    .then(audio => {
      source = context.createBufferSource();
      source.buffer = audio;
      source.connect(context.destination);
      source.start(0);

      const rateChange = 2 ** (1 / 120);    // 120 steps in an octave for Scratch
      let rate = 0;
      let up = true;
      inter = setInterval(() => {
        /*rate += (Math.random() * 10 - 5);
        if (rate > 50) {
          rate -= 2 * (rate - 50);
        } else if (rate < -50) {
          rate -= 2 * (rate + 50);
        }*/
        rate += (Math.random() * 2.5 + 0.5) * (-1) ** (up - 1);
        if (rate > 50) {
          rate -= 2 * (rate - 50);
          up = !up;
        } else if (rate < -50) {
          rate -= 2 * (rate + 50);
          up = !up;
        }
        if (Math.random() > 0.99) up = !up;
        
        $("rate").innerHTML = Math.round(rate);
        source.playbackRate.value = rateChange ** rate;
      })
    })

  // return [source, context];
}

function stopAudio(source) {
  clearInterval(inter);
  source.stop();
  //source.disconnect(context.destination);
}

$("input").oninput = () => {
  currentAudio = $("input").files[0];
}

function a () {
  let f = new FileReader();
  f.readAsArrayBuffer(currentAudio);
  f.onload = () => {
    playAudio(f.result);
$('play').onclick = b;
    $('play').innerHTML = text[1];

  }
}
function b () {
  stopAudio(source);
  $('play').onclick = a;
$('play').innerHTML = text[0];
}
$('play').onclick = a;


console.log(navigator.language == "zh-CN");
console.log(~window.location.href.indexOf("zh"));
if (navigator.language == "zh-CN" && !~window.location.href.indexOf("zh")) {
  window.location.href = "/zh.html";
}

if (~window.location.href.indexOf("zh.html")) {
  text = ["播放", '停止'];
}