document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");
  const mask = document.getElementById("mask");
  const text_mode = document.getElementById("text_mode");
  const pointer_mode = document.getElementById("pointer_mode");
  const toolbarEle = document.getElementById("toolbar");
  const font_size = document.getElementById("font_size");
  const copy = document.getElementById("copy");
  const mask_svg = document.getElementById("mask-svg");
  const tooltip = document.getElementById("tooltip");
  let mode = "text";

  mask_svg.style.fill = "gold";
  function calculateB(px) {
    // 계수 정의
    const a = 0.5667;
    const b = -0.4;

    // B 값 계산
    const B = a * px + b;

    return B;
  }

  const datas = [];

  copy.addEventListener("click", () => {
    const boxes = document.querySelectorAll(".edit-box");
    boxes.forEach((box) => {
      datas.push({
        innerText: box.dataset.origin,
        fontSize: Number(box.style.fontSize.slice(0, -2)),
        left: Number(box.parentElement.style.left.slice(0, -2)),
        top: Number(box.parentElement.style.top.slice(0, -2)),
      });
    });

    copyUrlWithQueryString("r", JSON.stringify(datas));
  });

  let selectedBox = null;
  let isEditing = false;
  let isMasking = true;

  const currentUrl = new URL(window.location.href);
  console.log("hit it?");
  if (currentUrl.searchParams.has("r")) {
    const init = JSON.parse(
      decodeURIComponent(currentUrl.searchParams.get("r"))
    );

    tooltip.style.visibility = `visible`;

    init?.map((v) => {
      createEditBox(v.left, v.top, v.innerText, v.fontSize, false);
    });

    setTimeout(() => {
      tooltip.style.visibility = `hidden`;
    }, 3000);
  }

  font_size.addEventListener("change", (e) => {
    selectedBox.style.fontSize = `${e.target.value}px`;
  });

  text_mode.addEventListener("click", () => {
    text_mode.classList.add("hidden");
    pointer_mode.classList.remove("hidden");
    mode = "pointer";

    const boxes = document.querySelectorAll(".edit-box");
    boxes.forEach((box) => {
      box.contentEditable = false;
    });
    toolbarEle.style.left = `-999px`;
    toolbarEle.classList.add("hidden");
  });

  pointer_mode.addEventListener("click", () => {
    pointer_mode.classList.add("hidden");
    text_mode.classList.remove("hidden");
    const boxes = document.querySelectorAll(".edit-box");
    mode = "text";
    boxes.forEach((box) => {
      box.contentEditable = true;
    });
    toolbarEle.classList.remove("hidden");
  });

  toolbarEle.style.opacity = 1;
  toolbarEle.style.visibility = "visible";

  mask.addEventListener("click", () => {
    if (mask.classList.contains("mask")) {
      const boxes = document.querySelectorAll(".edit-box");
      boxes.forEach((box) => {
        box.innerText = box.dataset.origin;

        box.style.letterSpacing = `${1}px`;
        const prevFontSize = box.style.fontSize;

        box.style.fontSize = `${prevFontSize / 2}px`;
      });
      mask.classList.remove("mask");
      isMasking = false;
      mask_svg.style.fill = "darkgoldenrod";
    } else {
      isMasking = masking(mask, isMasking, isAlphabet, calculateB);
      mask_svg.style.fill = "gold";
    }
  });

  editor.addEventListener("click", (event) => {
    if (!isEditing && mode === "text") {
      createEditBox(event.pageX, event.pageY, "", font_size.value);
    }
  });

  function createEditBox(x, y, v, s, tt = true) {
    const container = document.createElement("div");
    const box = document.createElement("div");

    container.classList.add("edit-container");
    box.classList.add("edit-box");

    if (v) box.innerText = v;

    if (s) box.style.fontSize = `${s}px`;
    else box.style.fontSize = `24px`;

    box.contentEditable = true;

    container.style.left = `${x}px`;
    container.style.top = `${y}px`;

    if (tt) {
      toolbarEle.style.left = `${x}px`;
      toolbarEle.style.top = `${y - 54}px`;
    }

    box.addEventListener("click", (event) => {
      event.stopPropagation();
      selectBox(box);
    });

    box.addEventListener("focusout", (event) => {
      if (!event.target.innerText) {
        editor.removeChild(event.target.parentElement);
      }
    });

    box.addEventListener("input", (event) => {
      if (isMasking) {
        event.target.dataset.origin = event.target.innerText;

        // 입력된 길이만큼 *로 대체
        // const maskedValue = originalValue.replace(/\S/g, "*");
        // event.target.innerText = maskedValue;
      }
    });

    container.appendChild(box);
    editor.appendChild(container);
    box.focus();
    selectBox(box, tt);
  }

  function selectBox(box, tt) {
    if (selectedBox) {
      selectedBox.classList.remove("selected");
    }
    selectedBox = box;

    selectedBox.classList.add("selected");
    isEditing = true;

    const x = box.parentElement.style.left;
    const y = box.parentElement.style.top;

    if (tt) {
      toolbarEle.style.left = `${x}`;
      toolbarEle.style.top = `${Number(y.slice(0, -2)) - 54}px`;
    }
  }

  document.addEventListener("click", (event) => {
    if (isEditing && !event.target.closest(".edit-box")) {
      if (selectedBox) {
        selectedBox.classList.remove("selected");
        // selectedBox = null;
      }
      isEditing = false;
    }
  });

  editor.addEventListener("mousedown", (event) => {
    let box = event.target.parentElement;

    if (!box.classList.contains("edit-container")) return;

    let offsetX = event.clientX - box.getBoundingClientRect().left;
    let offsetY = event.clientY - box.getBoundingClientRect().top;

    function onMouseMove(event) {
      box.style.left = `${event.clientX - offsetX}px`;
      box.style.top = `${event.clientY - offsetY}px`;

      toolbarEle.style.left = `${event.clientX - offsetX}px`;
      toolbarEle.style.top = `${event.clientY - offsetY - 54}px`;
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  editor.addEventListener("touchstart", (event) => {
    let box = event.target.parentElement;
    if (!box.classList.contains("edit-container")) return;

    console.log("box::", box);
    const touch = event.touches[0];
    let offsetX = touch.clientX - box.getBoundingClientRect().left;
    let offsetY = touch.clientY - box.getBoundingClientRect().top;
    box.style.cursor = "grabbing";

    function onMouseMove(event) {
      if (!event.touches[0].target.classList.contains("edit-box")) return;

      const touch = event.touches[0];
      touch.target.parentElement.style.left = `${touch.clientX - offsetX}px`;
      touch.target.parentElement.style.top = `${touch.clientY - offsetY}px`;

      toolbarEle.style.left = `${touch.clientX - offsetX}px`;
      toolbarEle.style.top = `${touch.clientY - offsetY - 54}px`;
    }

    const onTouchEnd = () => {
      console.log("touch_end");

      box.style.cursor = "grab";
    };

    document.addEventListener("touchmove", onMouseMove);
    document.addEventListener("touchend", onTouchEnd);
  });

  function copyUrlWithQueryString(key, value) {
    // 현재 URL 가져오기
    const currentUrl = new URL(window.location.href);

    // 쿼리 스트링 추가 (예: ?key=value)
    currentUrl.searchParams.set(key, value);

    // 수정된 URL 문자열
    const newUrl = currentUrl.toString();

    // 클립보드에 복사
    navigator.clipboard
      .writeText(newUrl)
      .then(() => {
        alert("URL이 클립보드에 복사되었습니다: " + newUrl);
      })
      .catch((err) => {
        console.error("클립보드 복사 실패: ", err);
      });
  }

  // Shooting Star logic
  //   var entities = [];

  //   function createShootingStarLogic() {
  //     function ShootingStar() {
  //       this.reset();
  //     }

  //     ShootingStar.prototype.reset = function () {
  //       this.x = Math.random() * width;
  //       this.y = 0;
  //       this.len = Math.random() * 80 + 10;
  //       this.speed = Math.random() + 2;
  //       this.size = Math.random() * 1 + 0.01;
  //       // this is used so the shooting stars arent constant
  //       this.waitTime = new Date().getTime() + Math.random() * 3000 + 500;
  //       this.active = false;
  //     };

  //     ShootingStar.prototype.update = function () {
  //       if (this.active) {
  //         this.x -= this.speed;
  //         this.y += this.speed;
  //         if (this.x < 0 || this.y >= height) {
  //           this.reset();
  //         } else {
  //           bgCtx.lineWidth = this.size;
  //           bgCtx.beginPath();
  //           bgCtx.moveTo(this.x, this.y);
  //           bgCtx.lineTo(this.x + this.len, this.y - this.len);
  //           bgCtx.stroke();
  //         }
  //       } else {
  //         if (this.waitTime < new Date().getTime()) {
  //           this.active = true;
  //         }
  //       }
  //     };

  //     return ShootingStar;
  //   }

  //   var ShootingStar = createShootingStarLogic();

  //   // Add 2 shooting stars that just cycle.
  //   entities.push(new ShootingStar());
  //   entities.push(new ShootingStar());

  //   function animate() {
  //     var gradient = bgCtx.createLinearGradient(0, 0, 0, height);
  //     gradient.addColorStop(0, "rgba(36, 25, 111, 1)");
  //     gradient.addColorStop(1, "rgba(0, 0, 0, 1)");

  //     // Set the fill style to the gradient
  //     bgCtx.fillStyle = gradient;

  //     bgCtx.fillRect(0, 0, width, height);
  //     bgCtx.strokeStyle = "#ffffff";

  //     var entLen = entities.length;

  //     while (entLen--) {
  //       entities[entLen].update();
  //     }

  //     requestAnimationFrame(animate);
  //   }
  //   animate();
  isMasking = masking(mask, isMasking, isAlphabet, calculateB);

  function isAlphabet(char) {
    // 알파벳 대소문자를 확인하는 정규식
    const alphabetRegex = /^[A-Za-z]$/;

    // 정규식으로 검사
    return alphabetRegex.test(char);
  }

  function masking(mask, isMasking, isAlphabet, calculateB) {
    mask.classList.add("mask");
    isMasking = true;
    const boxes = document.querySelectorAll(".edit-box");
    boxes.forEach((box) => {
      box.dataset.origin = box.innerText;

      if (!isAlphabet(box.dataset.origin[0])) {
        box.style.letterSpacing = `${calculateB(
          box.style.fontSize.replace("px", "")
        )}px`;
      } else {
        box.style.letterSpacing = `${
          Number(box.style.letterSpacing.replace("px", "")) * 2
        }px`;
      }

      const prevFontSize = box.style.fontSize;
      box.style.fontSize = `${prevFontSize * 2}px`;
      box.innerText = box.innerText.replace(/\S/g, "*");
    });
    return isMasking;
  }
});
