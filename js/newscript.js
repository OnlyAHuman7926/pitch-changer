let optOpen = false;
let blurred = false;
let playingBeforeBlur = false;
let editing = false;
let context;
let source;
let repeat = localStorage.repeat == "true" ?? false;
document.getElementById("repeat").checked = repeat;
//let changeFunction = localStorage.cf || "2 ** (Math.sin(1.5 * Math.PI * t) * 12 / 12)";
let changeFunction;
let t = 0,
  dt = 0,
  //start = new Date(),
  r = 1;
const fileInput = document.getElementById("file");
const rateInput = document.getElementById("rate-input");
const toggleOpt = document.getElementById("toggle-opt");
const pp = document.getElementsByClassName("ctrlbar")[0];
const sr = 0;    // sample rate

// Math object functions
const sin = Math.sin,
  cos = Math.cos,
  tan = Math.tan,
  floor = Math.floor,
  ceil = Math.ceil,
  abs = Math.abs,
  sqrt = Math.sqrt,
  PI = Math.PI;

document.getElementById("close").ondragstart = function() { return false };

fileInput.addEventListener("input", () => {
  if (!fileInput.files[0]) return;
  filename.innerHTML = "Loading file..."
  let f = new FileReader();
  f.readAsArrayBuffer(fileInput.files[0]);
  f.onload = () => {
    stopAudio();
    playAudio(f.result);
  }
})

function f() {
  if (context.state != "suspended") {
    //let now = new Date();
    //dt = t - now / 1000;
    //t = (now - start) / 1000;
    t = context.currentTime;
    try {
      r = eval(changeFunction);
    } catch {
      r = 1;
    }
    source.playbackRate.value = r;
    let octives = Math.log2(r).toFixed(3);
    if (octives >= 0) octives = "+" + octives;
    document.getElementById("rate").innerHTML = `Time: ${t.toFixed(3)}s Speed: x${r.toFixed(3)} Octaves: ${octives}`;
    draw(r, t * 1000);
    setTimeout(f, sr);
    //requestIdleCallback(f,{timeout:1000});
    //requestAnimationFrame(f);
  }
}

function playAudio(audio) {
  // audio is an array buffer
  context = new AudioContext();
  audio = context.decodeAudioData(audio)
    .then(audio => {
      source = context.createBufferSource();
      source.buffer = audio;
      source.loop = repeat;
      source.connect(context.destination);
      source.start(0);
      source.onended = () => {
        if (!repeat) pause();
      }
      filename.innerHTML = fileInput.files[0].name;
      context.suspend();
      pp.click();
    })
    .catch(() => {
      filename.innerHTML = "Error loading file";
    })
}
function stopAudio() {
  if (!source) return;
  source.stop();
  source.disconnect(context.destination);
  rates = [];
}
function pause() {
  if (!blurred) playingBeforeBlur = false;
  context.suspend();
  pp.style.backgroundColor = "rgb(0,120,215)";
  for (let i = 0; i < 4; i++) {
    if (i % 2 == 0) pp.children[i].classList.remove("inactive");
    else pp.children[i].classList.add("inactive");
  }
}
function play() {
  if (!blurred) playingBeforeBlur = true;
  context.resume().then(() => setTimeout(f, sr));
  pp.style.backgroundColor = "rgba(0,120,215,.5)";
  for (let i = 0; i < 4; i++) {
    if (i % 2 == 0) pp.children[i].classList.add("inactive");
    else pp.children[i].classList.remove("inactive");
  }
}
pp.onclick = () => {
  if (!(context || fileInput.files[0])) return;
  if (context.state != 'suspended') {
    pause();
  } else {
    if (blurred) {
      if (playingBeforeBlur) play();
    } else {
      play();
    }
  }
};

let data = JSON.parse(localStorage.data ?? JSON.stringify({
  a: 1,
  e: 0,
  f: 1,
  mode: "sine"
}))
changeRateFunction(data);
$('a').value = data.a;
$('e').value = data.e;
$('f').value = data.f;
$('mode').value = data.mode;
document.addEventListener("keydown", (e) => {
  if (!editing) e.preventDefault();
  if (e.key == " " && !e.repeat && !editing) {
    pp.click();
  }
})

/*window.onblur = () => {
  blurred = true;
  if (context && context.state != 'suspended') {
    pp.click();
  }
}
window.onfocus = () => {
  if (context && context.state == 'suspended') {
    pp.click();
  }
  blurred = false;
}*/

Array.from(document.querySelectorAll(".inputBox")).forEach(e => {
  e.onfocus = () => editing = true;
  e.onblur = () => editing = false;
  e.addEventListener("input", () => changeRateFunction());
})
$("mode").addEventListener("change", () => {
  console.log(0); changeRateFunction()
});

document.getElementById("repeat").addEventListener("change", () => {
  repeat = document.getElementById("repeat").checked;
  localStorage.repeat = source.loop = repeat;
})
