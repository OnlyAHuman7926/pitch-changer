/*!* Waves v0.2.1
 * https://publicis-indonesia.github.io/Waves
 *
 * Copyright 2014 Publicis Metro Indonesia, PT. and other contributors
 * Released under the BSD license
 * https://github.com/publicis-indonesia/Waves/blob/master/LICENSE*/
(function(window) {
  "use strict";
  function Waves() {
    let $$ = document.querySelectorAll.bind(document);
    function position(obj) {
      let left = 0;
      let top = 0;
      if (obj.offsetParent) {
        do {
          left += obj.offsetLeft;
          top += obj.offsetTop;
        } while ((obj = obj.offsetParent));
      }
      return { top: top, left: left };
    }
    let Effect = {
      action: function(e) {
        e = e || window.event;
        let el = this;
        if (e.which !== 1) {
          return false;
        }
        if (el.className.indexOf("waves-button") !== -1) {
          let child = el.childNodes[1];
          let tag = child.tagName.toLowerCase();
          if (tag === "a") {
            if (!child.href.length) {
              return false;
            }
            if (child.target === "_blank") {
              let win = window.open(child.href, "_blank");
              return win.focus();
            }
            return (window.location.href = child.href);
          }
          if (tag === "button" || tag === "input") {
            if (child.submit) {
              return child.submit();
            }
            return child.click();
          }
        }
      },
      show: function(e) {
        let el = this;
        let ripple = document.createElement("div");
        ripple.className = ripple.className + "waves-ripple";
        el.appendChild(ripple);
        let pos = position(el);
        let relativeY = e.pageY - pos.top;
        let relativeX = e.pageX - pos.left;
        let width = el.clientWidth;
        ripple.setAttribute("data-hold", Date.now());
        ripple.setAttribute("data-x", relativeX);
        ripple.setAttribute("data-y", relativeY);
        let positionStyle = "top:" + relativeY + "px;left:" + relativeX + "px;";
        let flowStyle =
          "border-width:" +
          width +
          "px;margin-top:-" +
          width +
          "px;margin-left:-" +
          width +
          "px;opacity:1;";
        ripple.className = ripple.className + " waves-notransition";
        ripple.setAttribute("style", positionStyle);
        ripple.offsetHeight;
        ripple.className = ripple.className.replace("waves-notransition", "");
        ripple.setAttribute("style", positionStyle + flowStyle);
      },
      hide: function(e) {
        let el = this;
        let width = el.clientWidth;
        let ripple = null;
        for (let a = 0; a < el.children.length; a++) {
          if (el.children[a].classList.contains("waves-ripple")) {
            ripple = el.children[a];
            continue;
          }
        }

        if (!ripple) {
          return false;
        }
        let relativeX = ripple.getAttribute("data-x");
        let relativeY = ripple.getAttribute("data-y");
        let diff = Date.now() - Number(ripple.getAttribute("data-hold"));
        let delay = 500 - diff;
        if (delay < 0) {
          delay = 0;
        }
        setTimeout(function() {
          let style =
            "top:" +
            relativeY +
            "px;left:" +
            relativeX +
            "px;border-width:" +
            width +
            "px;margin-top:-" +
            width +
            "px;margin-left:-" +
            width +
            "px;opacity:0;";
          ripple.setAttribute("style", style);
          setTimeout(function() {
            try {
              el.removeChild(ripple);
            } catch (e) {
              return false;
            }
          }, 300);
        }, delay);
      }
    };
    return {
      displayEffect: function() {
        Array.prototype.forEach.call($$(".waves-effect"), function(i) {
          i.addEventListener("pointerdown", Effect.show, false);
          i.addEventListener("pointerup", Effect.hide, false);
          i.addEventListener("pointerleave", Effect.hide, false);
          i.addEventListener("pointerup", Effect.action, false);
        });
      }
    };
  }
  window.Waves = Waves;
})(window);
new Waves().displayEffect();