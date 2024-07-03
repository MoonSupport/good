!(function () {
  "use strict";
  const e = (e) =>
      new Promise((t) => {
        const n = new Image();
        (n.src = e),
          (n.onload = () => {
            t(n);
          });
      }),
    t = async (t, n, o) => {
      const a = [];
      for (let i = t; i <= n; i++) {
        const t = await e(o(i.toString()));
        a.push(t);
      }
      return a;
    },
    n = (e) => {
      const t = document.querySelector(e),
        n = t.getContext("2d");
      return { canvas: t, context: n };
    },
    o = (e) => {
      const { context: t, images: n, canvas: o } = e;
      if (!t) throw new Error("You should load canvas");
      return t.drawImage(n[0], 0, 0, o.width, o.height), (t) => t(e);
    },
    a = (e) =>
      new Promise((t) => {
        setTimeout(() => {
          t(null);
        }, e);
      }),
    i =
      (e, t = !0) =>
      (n) => {
        const { context: o, canvas: a, images: i } = n;
        let s,
          c = () => {};
        return {
          promise: new Promise((n) => {
            let l = 0;
            (s = setInterval(() => {
              t && n(s),
                l++,
                l >= i.length && (t ? (l = 0) : (clearInterval(s), n(s))),
                o &&
                  i[l] &&
                  (o.clearRect(0, 0, a.width, a.height),
                  o.drawImage(i[l], 0, 0, a.width, a.height));
            }, e)),
              (c = () => {
                l = i.length;
              });
          }),
          cancle: c,
          getId: () => s,
        };
      };
  const s =
    (e, t = !0) =>
    (n) => {
      const { context: o, canvas: a, images: i } = n;
      let s = i.length;
      const c = setInterval(() => {
        s--,
          s <= 0
            ? t
              ? (s = i.length - 1)
              : clearInterval(c)
            : o &&
              (o.clearRect(0, 0, a.width, a.height),
              o.drawImage(i[s], 0, 0, a.width, a.height));
      }, e);
    };
  const c = (...e) => {
    document.body.style.height = `${((e, t, n) =>
      e * t * n + window.innerHeight)(...e)}px`;
  };
  ({
    interval: async () => {
      const e = await t(0, 20, (e) => `./imgs/coke/${e}.gif`),
        { context: a, canvas: s } = n("#interval");
      o({ canvas: s, context: a, images: e })(i(100, !1));
    },
    interval_reverse: async () => {
      const e = await t(0, 14, (e) => `./imgs/min/${e}.gif`),
        { context: a, canvas: i } = n("#interval_reverse");
      o({ canvas: i, context: a, images: e })(s(50, !1));
    },
    minheejin: async () => {
      const e = await t(0, 14, (e) => `./imgs/min/${e}.gif`),
        { context: a, canvas: c } = n("#container");
      o({ canvas: c, context: a, images: e })(
        ({ context: e, canvas: t, images: n }) => {
          const o = document.querySelector("#hive"),
            a = document.querySelector("#newjenas");
          let c = "";
          o?.addEventListener("mouseover", (o) => {
            "hive" !== c && i(30, !1)({ canvas: t, context: e, images: n }),
              (c = "hive");
          }),
            a?.addEventListener("mouseover", (o) => {
              "newjeans" !== c &&
                s(30, !1)({ canvas: t, context: e, images: n }),
                (c = "newjeans");
            });
        }
      );
    },
    scroll: async () => {
      const e = await t(0, 179, (e) => `./imgs/nakha/${e}.jpg`);
      e.reverse();
      const { context: a, canvas: i } = n("#container"),
        s = window.innerWidth / i.width,
        l = window.innerHeight / i.height;
      let r;
      (r = s <= l ? l : s),
        console.log("canvasScaleRatio::", r),
        (i.style.transform = `translate3d(-50%, -50%, 0) scale(${r})`),
        o({ canvas: i, context: a, images: e })(({ canvas: e, images: t }) => {
          const n = 0.1,
            o = 240;
          c(t.length, o, n),
            window.addEventListener("orientationchange", () => {
              c(t.length, o, n);
            }),
            window.addEventListener("resize", () => {
              c(t.length, o, n);
            }),
            document.addEventListener("scroll", () => {
              requestAnimationFrame(() => {
                const n = Math.floor(window.pageYOffset / 24);
                a &&
                  t[n] &&
                  (a.clearRect(0, 0, e.width, e.height),
                  a.drawImage(t[n], 0, 0, e.width, e.height));
              });
            });
        });
    },
    multi_interval: async () => {
      const e = await t(0, 10, (e) => `./imgs/coke/${e}.gif`),
        a = await t(11, 20, (e) => `./imgs/coke/${e}.gif`),
        { context: s, canvas: c } = n("#container");
      o({ canvas: c, context: s, images: e })(
        ({ canvas: e, context: t, images: n }) => {
          const o = i(100, !0),
            { getId: s } = o({ canvas: e, context: t, images: n });
          document
            .querySelector("#drag")
            ?.addEventListener("touchstart", async () => {
              const n = s();
              clearInterval(n),
                await i(100, !1)({ canvas: e, context: t, images: a });
            });
        }
      );
    },
    acne: async () => {
      let a = 0;
      const s = await t(0, 20, (e) => `./imgs/acne/${e}.gif`),
        c = await e("./imgs/acne/1.gif"),
        { context: l, canvas: r } = n("#container"),
        d = document.querySelector(".firefly");
      o({ canvas: r, context: l, images: s })(
        ({ canvas: e, context: t, images: n }) => {
          const o = i(100, !1);
          document.body.addEventListener("click", async () => {
            if ((a++, 0 === a));
            else if (1 === a)
              t?.clearRect(0, 0, c.width, c.height),
                t?.drawImage(c, 0, 0, c.width, c.height);
            else if (2 === a) {
              d.style.opacity = "0";
              const { promise: a } = o({ canvas: e, context: t, images: n });
              await a;
              document.querySelector("h1").style.visibility = "initial";
            }
          });
        }
      );
      const m = Math.random() * window.innerWidth,
        g = Math.random() * window.innerHeight;
      (d.style.transform = `translate(${m}px, ${g}px)`),
        setInterval(() => {
          const e = Math.random() * window.innerWidth,
            t = Math.random() * window.innerHeight;
          d.style.transform = `translate(${e}px, ${t}px)`;
        }, 1e3);
    },
    pizza: async () => {
      const e = await t(0, 6, (e) => `./imgs/pizza_noshot/${e}.gif`),
        s = await t(0, 25, (e) => `./imgs/pizza_shot/${e}.gif`),
        { context: c, canvas: l } = n("#container");
      o({ canvas: l, context: c, images: e })(
        async ({ context: e, canvas: t, images: n }) => {
          const o = document.querySelector("#shot");
          document.querySelector("body");
          const c = document.querySelector("#container_container"),
            l = await i(100, !0)({ canvas: t, context: e, images: n });
          o.onclick = async () => {
            clearInterval(l),
              (o.style.backgroundColor = "darkgray"),
              (o.disabled = !0),
              e && e.clearRect(0, 0, t.width, t.height),
              (c.style.backgroundColor = "yellow"),
              await a(100),
              (c.style.backgroundColor = "white"),
              await i(100, !1)({ canvas: t, context: e, images: s }),
              await i(100, !1)({ canvas: t, context: e, images: s }),
              (o.disabled = !1),
              (o.style.backgroundColor = "firebrick");
          };
        }
      );
    },
    cats: async () => {
      let e = () => {};
      const s = await t(0, 4, (e) => `./imgs/cats/${e}.png`),
        c = document.querySelector("#tower"),
        { context: l, canvas: r } = n("#container"),
        d = o({ canvas: r, context: l, images: s });
      r.addEventListener("mousedown", async function (t) {
        const n = d(i(100, !1));
        (e = n.cancle),
          (r.style.cursor = "grabbing"),
          (r.style.position = "absolute");
        const o = t.clientX - r.getBoundingClientRect().left,
          m = t.clientY - r.getBoundingClientRect().top;
        function g(e) {
          (r.style.left = e.clientX - o + "px"),
            (r.style.top = e.clientY - m + "px");
        }
        document.addEventListener("mousemove", g),
          document.addEventListener("mouseup", async function t(n) {
            document.removeEventListener("mousemove", g),
              document.removeEventListener("mouseup", t),
              (r.style.cursor = "grab"),
              e(),
              (r.style.left = "0px"),
              (r.style.top = "calc(100vh - 200px)"),
              l?.clearRect(0, 0, r.width, r.height),
              l?.drawImage(s[0], 0, 0, r.width, r.height);
            const o = c.getBoundingClientRect();
            if (
              n.clientX > o.left &&
              n.clientX < o.right &&
              n.clientY > o.top &&
              n.clientY < o.bottom
            ) {
              const e = document.querySelector("#heartcat");
              (r.style.visibility = "hidden"), (e.style.visibility = "initial");
              const t = document.querySelectorAll("#message p");
              for (const e of t) await a(700), e.classList.add("fade-in");
            }
          });
      }),
        (r.ondragstart = function () {
          return !1;
        }),
        r.addEventListener("touchstart", function (t) {
          const n = d(i(100, !1));
          (e = n.cancle), t.preventDefault();
          const o = t.touches[0],
            m = o.clientX - r.getBoundingClientRect().left,
            g = o.clientY - r.getBoundingClientRect().top;
          function y(e) {
            const t = e.touches[0];
            !(function (e, t, n, o) {
              (r.style.left = e - n + "px"), (r.style.top = t - o + "px");
            })(t.clientX, t.clientY, m, g);
          }
          document.addEventListener("touchmove", y),
            document.addEventListener("touchend", async function t(n) {
              document.removeEventListener("touchmove", y),
                document.removeEventListener("touchend", t);
              const o = c.getBoundingClientRect();
              if (
                n.changedTouches[0].clientX > o.left &&
                n.changedTouches[0].clientX < o.right &&
                n.changedTouches[0].clientY > o.top &&
                n.changedTouches[0].clientY < o.bottom
              ) {
                const e = document.querySelector("#heartcat");
                (r.style.visibility = "hidden"),
                  (e.style.visibility = "initial");
                const t = document.querySelectorAll("#message p");
                for (const e of t) await a(700), e.classList.add("fade-in");
              }
              e(),
                (r.style.left = "0px"),
                (r.style.top = "calc(100vh - 200px)"),
                l?.clearRect(0, 0, r.width, r.height),
                l?.drawImage(s[0], 0, 0, r.width, r.height);
            });
        }),
        (r.ondragstart = function () {
          return !1;
        });
      document.querySelector(".heart").addEventListener("click", function () {
        const e = document.querySelector(".empty"),
          t = document.querySelector(".filled");
        "none" === t.style.display
          ? ((t.style.display = "block"), (e.style.display = "none"))
          : ((t.style.display = "none"), (e.style.display = "block"));
      });
      let m;
      document
        .getElementById("darkmode")
        .addEventListener("click", async function () {
          this.classList.toggle("light"),
            document.body.classList.toggle("dark-bg");
          const e = this.querySelector("svg"),
            { context: t, canvas: o } = n("#container"),
            a = document.querySelector("#darkcat");
          this.classList.contains("light")
            ? ((e.style.fill = "yellow"),
              (a.style.display = "block"),
              (o.style.display = "none"),
              (m = setInterval(g(a), 1e3)))
            : (clearInterval(m),
              (e.style.fill = ""),
              (a.style.display = "none"),
              (o.style.display = "block"));
        });
      const g = (e) => () => {
        const t = Math.floor(Math.random() * (window.innerWidth - e.width)),
          n = Math.floor(Math.random() * (window.innerHeight - e.height));
        (e.style.left = t + "px"), (e.style.bottom = n + "px");
        const o = 360 * Math.random(),
          a = document.createElement("div");
        (a.innerHTML =
          '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.954 11c3.33 0 7.057 6.123 7.632 8.716.575 2.594-.996 4.729-3.484 4.112-1.092-.271-3.252-1.307-4.102-1.291-.925.016-2.379.836-3.587 1.252-2.657.916-4.717-1.283-4.01-4.073.774-3.051 4.48-8.716 7.551-8.716zm10.793-4.39c1.188.539 1.629 2.82.894 5.27-.704 2.341-2.33 3.806-4.556 2.796-1.931-.877-2.158-3.178-.894-5.27 1.274-2.107 3.367-3.336 4.556-2.796zm-21.968.706c-1.044.729-1.06 2.996.082 5.215 1.092 2.12 2.913 3.236 4.868 1.87 1.696-1.185 1.504-3.433-.082-5.215-1.596-1.793-3.824-2.599-4.868-1.87zm15.643-7.292c1.323.251 2.321 2.428 2.182 5.062-.134 2.517-1.405 4.382-3.882 3.912-2.149-.407-2.938-2.657-2.181-5.061.761-2.421 2.559-4.164 3.881-3.913zm-10.295.058c-1.268.451-1.92 2.756-1.377 5.337.519 2.467 2.062 4.114 4.437 3.269 2.06-.732 2.494-3.077 1.377-5.336-1.125-2.276-3.169-3.721-4.437-3.27z"/></svg>'),
          (a.style.position = "absolute"),
          (a.style.left = t + "px"),
          (a.style.bottom = n + "px"),
          (a.style.transform = `rotate(${o}deg)`),
          document.body.appendChild(a),
          (e.style.transform = `rotate(${o}deg)`);
      };
    },
    dog: async () => {
      const e = document.getElementById("password"),
        t = document.getElementById("dog"),
        n = document.getElementById("dog2"),
        o = document.getElementById("bg"),
        a = document.getElementById("hands"),
        i = document.getElementById("right-hand"),
        s = document.getElementById("paw");
      let c = !1;
      e.addEventListener("focus", () => {
        e.value || (t.style.transform = "translateY(-50px)");
      }),
        e.addEventListener("blur", () => {
          e.value || (t.style.transform = "translateY(0)");
        }),
        e.addEventListener("input", (n) => {
          console.log("password.value", e.value),
            e.value
              ? ((a.style.transform = "translateY(-50px)"),
                (t.src = "./imgs/dog/2.gif"))
              : ((a.style.transform = "translateY(0)"),
                (t.src = "./imgs/dog/1.gif"));
        }),
        s.addEventListener("click", () => {
          "password" === e.type
            ? ((e.type = "text"),
              (e.readOnly = !0),
              (s.style.fill = "pink"),
              (i.style.transform = "translateY(20px)"),
              (t.style.visibility = "hidden"),
              (n.style.visibility = "initial"),
              (o.style.opacity = "1"),
              c || ((c = !0), setTimeout(l, 2e3), setInterval(l, 5e3)))
            : ((e.type = "password"),
              (e.readOnly = !1),
              (s.style.fill = "black"),
              (i.style.transform = "translateY(0px)"),
              (t.style.visibility = "initial"),
              (n.style.visibility = "hidden"));
        });
      const l = () => {
        const e = document.createElement("div");
        e.classList.add("cloud");
        const t = Math.random() * window.innerHeight;
        (e.style.top = `${t}px`),
          (e.innerHTML =
            '\n<svg viewBox="0 3 24 17.319" width="48" height="34" xmlns="http://www.w3.org/2000/svg">\n  <path d="M 19.479 9.824 C 19.267 6.022 16.006 3 12 3 C 7.994 3 4.733 6.022 4.521 9.824 C 1.951 10.269 0 12.427 0 15.027 C 0 17.949 2.463 20.319 5.5 20.319 L 11.933 18.729 L 18.5 20.319 C 21.537 20.319 24 17.949 24 15.027 C 24 12.427 22.049 10.269 19.479 9.824" style="fill: rgb(255, 255, 255); stroke: rgb(11, 11, 11);" transform="matrix(1, 0, 0, 1, 7.105427357601002e-15, 0)"/>\n</svg>'),
          document.body.append(e);
        (e.style.animationDuration = "20s"),
          setTimeout(() => {
            e.remove();
          }, 24e3);
      };
    },
    love_wins_all: async () => {
      const e = document.getElementById("go_bottom"),
        i = document.getElementById("dummy"),
        s = document.getElementById("container"),
        c = document.getElementById("dress_loop"),
        l = document.getElementById("poster");
      (e.onclick = function () {
        const e = document.body.scrollHeight,
          t = window.scrollY,
          n = e - t;
        let o = 0;
        requestAnimationFrame(function e(a) {
          o || (o = a);
          const i = a - o,
            s = Math.min(i / 2e3, 1),
            c = t + n * s;
          window.scrollTo(0, c), s < 1 && requestAnimationFrame(e);
        });
      }),
        (c.style.top = 3 * window.innerHeight + "px"),
        (i.style.top = 3 * window.innerHeight + "px");
      const r = await t(0, 15, (e) => `./imgs/love_wins_all/${e}.gif`),
        { context: d, canvas: m } = n("#container");
      o({ canvas: m, context: d, images: r })(({ canvas: e, images: t }) => {
        document.addEventListener("scroll", () => {
          requestAnimationFrame(() => {
            const n = Math.floor(window.pageYOffset / 76) % 15;
            d &&
              t[n] &&
              (d.clearRect(0, 0, e.width, e.height),
              d.drawImage(t[n], 0, 0, e.width, e.height));
          });
        }),
          document.addEventListener("scroll", async () => {
            if (
              (console.log("window.pageYOffset::", window.pageYOffset),
              console.log(
                "document.body.scrollHeight::",
                document.body.scrollHeight
              ),
              window.pageYOffset >= document.body.scrollHeight)
            ) {
              (c.style.visibility = "initial"),
                (s.style.visibility = "hidden"),
                (c.style.transform = `translateY(${
                  window.innerHeight / 2 - 224
                }px)`),
                await a(2e3);
              const e = c.querySelector("img");
              e && (e.src = "./imgs/love_wins_all/off.gif"),
                await a(4e3),
                (l.style.opacity = "1");
            }
          });
      });
    },
  })[window.document.title]();
})();
