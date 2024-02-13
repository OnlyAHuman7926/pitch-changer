"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
resize();

function resize() {
  let cw = canvas.offsetWidth;
  let ch = canvas.offsetHeight;
  //canvas.style.width = cw + "px";
  //canvas.style.height = ch + "px";
  canvas.height = ch * window.devicePixelRatio;
  canvas.width = cw * window.devicePixelRatio;
  //canvas.height = ch;
  //canvas.width = cw;
  ctx.strokeStyle = "#003500";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.stroke();
}

let rates = [];
// queue<pair<int, int>> rates;

function draw(rate, t) {
  //let start = new Date();
  let w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = "#003500";
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  ctx.strokeStyle = "#43EAA0";
  ctx.beginPath();
  let showTime = 5000;
  //ctx.moveTo(w / showTime * (showTime - rates.length), h - (Math.log2(rates[0] ?? 1) + 1) * h / 2);
  rates.push([rate, t]);
  if (rates.length > showTime) rates.shift();
  /*for (let i = 0; i < rates.length; i++) {
    ctx.lineTo(w / showTime * (showTime - rates.length + i), h / -2 * Math.log2(rates[i]) + h / 2);
  }*/
  while (true) {
    let first = rates[0];
    if (first[1] < t - showTime) rates.shift();
    else break;
  }
  for (let rate of rates) {
    ctx.lineTo(w / showTime * (showTime + rate[1] - t), h / -2 * Math.log2(rate[0]) + h / 2);
  }
  ctx.stroke();
  //let end = new Date();
  //console.log("This tick took " + (end - start) + " seconds");
}

window.addEventListener("resize", resize); //this will just make the line thinner when resizing
