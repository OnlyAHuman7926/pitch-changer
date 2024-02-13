'use strict';

function $(e) {
  return document.getElementById(e);
}

function trigger() {
  popUp.style.zIndex = cover.style.zIndex = '99';
  popUp.style.visibility = cover.style.visibility = 'visible';
  popUp.style.opacity = cover.style.opacity = 1;
  popUp.style.transform = "scale(1)";
}
function untrigger() {
  popUp.style.zIndex = cover.style.zIndex = '99';
  setTimeout(function() {
    popUp.style.visibility = cover.style.visibility = "hidden";
  }, 250)
  popUp.style.opacity = cover.style.opacity = 0;
  popUp.style.transform = "scale(0)";
}

function changeRateFunction(data) {
  data = data ?? {
    a: $('a').value,
    e: $('e').value,
    f: $('f').value,
    mode: $('mode').value,
    cf: $('rate-input').value
  }

  let cf;
  switch (data.mode) {
    case "sine":
      cf = `2 ** ((${data.a}) * Math.sin(2 * Math.PI * (${data.f}) * t) + (${data.e}))`;
      break;
    case "mod":
      cf = `2 ** ((t % (1 / (${data.f})) + (${data.e})) * (${data.f}) * (${data.a}))`;
      break;
    case "rand":
      cf = `2 ** (Math.random() * (${data.a}) + (${data.e}))`;
      break;
    default:
      cf = data.cf;
      break;
  }
  if (data.mode == "custom") {
    $("rate-input").disabled = false;
    $("f").disabled = true;
    $("a").disabled = true;
    $("e").disabled = true;
  } else {
    $("rate-input").disabled = true;
    $("f").disabled = false;
    $("a").disabled = false;
    $("e").disabled = false;
  }

  if (!cf) cf = 1;
  data.cf = changeFunction = rateInput.value = cf;
  localStorage.data = JSON.stringify(data);
  // 2 ** (Math.sin(1.5 * Math.PI * t) * 12 / 12)
}