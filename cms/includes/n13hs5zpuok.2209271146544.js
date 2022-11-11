(function () {
  function o(n, t, i) {
    var f, r, u, e, o;
    if (
      (typeof i == "string" &&
        ((f = i),
        (i = function (n) {
          n.classList.add(f);
        })),
      typeof IntersectionObserver == "undefined")
    ) {
      i(n);
      return;
    }
    t < 0 ? ((r = -t * 200 + "px"), (u = 0)) : ((r = "0px"), (u = t || 0));
    e = { root: null, rootMargin: r, threshold: u };
    o = new IntersectionObserver(function (t, r) {
      var u = t.find(function (n) {
        return n.isIntersecting;
      });
      u && (i(n), r.unobserve(n), r.disconnect());
    }, e);
    o.observe(n);
  }
  function u() {
    for (
      var n,
        r = [],
        i = document.querySelectorAll(
          "img[data-src],img[data-bg],video[data-src],source[data-src]"
        ),
        t = 0;
      t < i.length;
      t++
    ) {
      if (((n = i[t]), n.parentNode.nodeName.toLowerCase() === "picture"))
        if (((n = n.parentNode), r.indexOf(n) >= 0)) continue;
        else r.push(n);
      o(n, -0.5, a);
    }
  }
  function a(n) {
    var t,
      r,
      i = n.getAttribute("data-src"),
      e = n.getAttribute("data-bg"),
      o = (n.nodeName || "").toLowerCase(),
      u;
    switch (o) {
      case "img":
        e
          ? (n.style.backgroundImage = "url('" + e + "')")
          : i && (n.setAttribute("src", i), (t = n));
        n.removeAttribute("data-src");
        n.removeAttribute("data-bg");
        break;
      case "video":
        i && n.setAttribute("poster", i);
        n.removeAttribute("data-src");
        break;
      case "picture":
        for (u = 0; u < n.children.length; u++)
          (r = n.children[u]),
            (i = r.getAttribute("data-src")),
            r.removeAttribute("data-src"),
            (r.nodeName || "").toLowerCase() == "img"
              ? ((t = r),
                i &&
                  (l
                    ? t.setAttribute("src", i)
                    : ((t.style.backgroundImage = "url('" + i + "')"),
                      (t = null))))
              : i && r.setAttribute("srcset", i);
    }
    if (t) {
      if (t.$loading) return;
    } else
      (t = document.createElement("img")),
        (t.style.position = "absolute"),
        (t.style.opacity = 0),
        (t.style.pointerEvents = "none"),
        (t.style.left = "-100%"),
        (t.style.top = "-100%"),
        (t.$placeholder = !0),
        document.body.appendChild(t),
        t.setAttribute("src", e || i || c);
    t.$loading = n;
    t.complete
      ? f.call(t)
      : (n.classList.add("loading"), t.addEventListener("load", f));
  }
  function f() {
    var n = this.$loading;
    n
      ? (delete this.$loading, n.classList.remove("loading"))
      : this.classList.remove("loading");
    this.removeEventListener("load", f);
    this.$placeholder &&
      (delete this.$placeholder,
      this.parentNode && this.parentNode.removeChild(this));
  }
  var s = document.documentElement.getAttribute("data-anim") !== "0",
    h = document.documentElement.getAttribute("data-prlx") !== "0",
    c =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    l = "objectFit" in document.body.style,
    n,
    e,
    t,
    i,
    r;
  if (document && document.querySelectorAll) {
    for (
      n = document.querySelectorAll("[data-onvisible]"),
        e = n && n.length,
        t = 0;
      t < e;
      t++
    )
      ((i = n[t]), (r = i.getAttribute("data-onvisible")), r) &&
        (s ? o(i, 0.33, r) : i.classList.add(r));
    h &&
      window.matchMedia("(prefers-reduced-motion)").matches === !1 &&
      ((n = document.querySelectorAll("[data-parallax]")),
      n &&
        n.length > 0 &&
        require2("usc/p/passive-parallax", function () {
          USC.parallax(n);
        }));
  }
  window.LazyLoad = u;
  u();
  setTimeout(u, 1e3);
})();
(function (n) {
  function u(n) {
    for (var t = n; t && t.parentNode; ) {
      if (t.nodeName === "svg" || t.nodeName === "SVG") return t;
      t = t.parentNode;
    }
    return null;
  }
  function f(n) {
    n.readyState === 4
      ? i.call(n)
      : n.onreadystatechange ||
        ((n.onreadystatechange = function () {
          n.readyState === 4 && i.call(n);
        }),
        n.onreadystatechange());
  }
  function i() {
    var n,
      t = this._document,
      i;
    for (
      t ||
      ((this._document = t = document.implementation.createHTMLDocument("")),
      (t.body.innerHTML = this.responseText),
      (this._target = {}));
      (n = this._embeds.pop());

    )
      (i = this._target[n.id]),
        i || (this._target[n.id] = i = t.getElementById(n.id)),
        r(n.use, n.parent, n.svg, i);
  }
  function r(n, t, i, r) {
    var u, f, e;
    if (r && n.parentNode === t) {
      for (
        t.removeChild(n),
          u = document.createDocumentFragment(),
          f = !i.hasAttribute("viewBox") && r.getAttribute("viewBox"),
          f && i.setAttribute("viewBox", f),
          e = r.cloneNode(!0);
        e.childNodes.length;

      )
        u.appendChild(e.firstChild);
      t.appendChild(u);
    }
  }
  var t = {};
  n.USE = {
    Replace: function (n) {
      var y, s, i, a, h, v, p, c, l, w, o, e;
      if (
        ((n && n.getElementsByTagName) || (n = document),
        n.nodeName === "USE" || n.nodeName === "use")
      )
        s = [n];
      else
        for (
          y = n.getElementsByTagName("use"), s = new Array(y.length), e = 0;
          e < s.length;
          e++
        )
          s[e] = y[e];
      for (e = 0; e < s.length; e++) {
        if (((i = s[e]), i._replacing)) continue;
        else i._replacing = 1;
        ((a = i.parentNode),
        (h = u(a)),
        (v =
          h &&
          (i.getAttribute("data-href") ||
            i.getAttribute("xlink:href") ||
            i.getAttribute("href"))),
        v) &&
          ((p = v.split("#")),
          (c = p[0]),
          (l = p[1]),
          !l && (w = /icon_(\w+)\./.exec(c)) && (l = w[1]),
          c
            ? ((o = t[c]),
              o ||
                ((t[c] = o = new XMLHttpRequest()),
                o.open("GET", c),
                o.send(),
                (o._embeds = [])),
              h.attributes["data-use"] || h.setAttribute("data-use", v),
              o._embeds.push({ use: i, parent: a, svg: h, id: l }),
              f(o))
            : r(i, a, h, document.getElementById(l)));
      }
    },
  };
  (n.requestAnimationFrame || n.setTimeout)(USE.Replace, 0);
  window.register && window.register("svg");
})(window);
(function () {
  Element.prototype.scrollParent ||
    (Element.prototype.scrollParent = function () {
      for (
        var n = this.parentNode, t = this.ownerDocument, i = t && t.defaultView;
        i && n;

      ) {
        if (
          n.parentNode &&
          n.parentNode !== t.body &&
          n.parentNode !== t.documentElement &&
          n.parentNode !== t &&
          n.parentNode !== t.defaultView
        ) {
          if (i.getComputedStyle(n).getPropertyValue("overflow") !== "visible")
            return n;
        } else return null;
        n = n.parentNode;
      }
      return null;
    });
  Element.prototype.scrollTo ||
    (Element.prototype.scrollTo = function (n, t) {
      this.scrollLeft = n;
      this.scrollTop = t;
    });
  Element.prototype.scrolling ||
    (Element.prototype.scrolling = function (n, t, i, r, u) {
      var e, f, s;
      if (!n && !t) {
        if (r)
          try {
            r.call(this);
          } catch (l) {}
        return;
      }
      if (
        ((e = this.cancelAnimationFrame
          ? this
          : this.ownerDocument.defaultView),
        e)
      ) {
        if (
          this.$scrolling &&
          this.$scrolling.frame &&
          (e.cancelAnimationFrame(this.$scrolling.frame), u)
        ) {
          var o = this.$scrolling,
            h =
              o.diffX - ((this.pageXOffset || this.scrollLeft || 0) - o.startX),
            c =
              o.diffY - ((this.pageYOffset || this.scrollTop || 0) - o.startY);
          h && (n += h);
          c && (t += c);
        }
        if (
          (delete this.$scrolling,
          (f = {
            startX: this.pageXOffset || this.scrollLeft || 0,
            startY: this.pageYOffset || this.scrollTop || 0,
            diffX: n,
            diffY: t,
            dur: i || Math.min(500, Math.max(250, Math.abs(t / 4))),
            frame: 0,
            style:
              this.constructor === Window
                ? e.document.documentElement.style
                : this.style,
          }),
          r && typeof r == "function" && (f.callback = r),
          f.diffY < 0 && f.startY === 0 && (f.diffY = 0),
          f.diffX < 0 && f.startX === 0 && (f.diffX = 0),
          !f.diffY && !f.diffX)
        ) {
          if (f.callback)
            try {
              f.callback.call(this);
            } catch (l) {}
          f = null;
          return;
        }
        if (f.dur < 0) {
          n = f.diffX + f.startX;
          t = f.diffY + f.startY;
          this.scrollTo(n, t);
          return;
        }
        this.$scrolling = f;
        s = function (n) {
          var r,
            i,
            u,
            f,
            t = this.$scrolling;
          if (t.begin) {
            if (
              ((r = n - t.begin),
              (i = Math.min(1, r / t.dur)),
              (i = 0.5 - Math.cos(i * Math.PI) / 2),
              (u = i * t.diffX + t.startX),
              (f = i * t.diffY + t.startY),
              this.scrollTo(u, f),
              i === 1)
            ) {
              if (
                (t.style &&
                  (t.style.removeProperty("scroll-behavior"), delete t.style),
                t.callback)
              )
                try {
                  t.callback.call(this);
                } catch (o) {}
              delete this.$scrolling;
              return;
            }
          } else
            (t.begin = n),
              t.style && t.style.setProperty("scroll-behavior", "auto");
          this.$scrolling.frame = e.requestAnimationFrame(s);
        }.bind(this);
        this.$scrolling.frame = e.requestAnimationFrame(s);
      }
    });
  Window.prototype.scrolling ||
    (Window.prototype.scrolling = Element.prototype.scrolling);
  Document.prototype.getFixedElements ||
    (Document.prototype.getFixedElements = function () {
      for (
        var n,
          r,
          t,
          u = this.querySelectorAll("aside,div,header,nav,ul"),
          f = [],
          i = 0;
        i < u.length;
        i++
      )
        (n = u[i]),
          (r = getComputedStyle(n)),
          (t = r.getPropertyValue("position")),
          (t === "fixed" || t === "sticky") && f.push(n);
      return f;
    });
  Document.prototype.fixedOffset ||
    (Document.prototype.fixedOffset = function () {
      for (
        var n,
          u = this.documentElement.clientWidth / 2,
          r = this.getFixedElements(),
          t = 0,
          i = 0;
        i < r.length;
        i++
      )
        (n = r[i].getBoundingClientRect()),
          n.top === 0 &&
            n.left === 0 &&
            n.width > u &&
            n.height > t &&
            (t = n.height);
      return t;
    });
  Element.prototype.scrollIntoViewport ||
    (Element.prototype.scrollIntoViewport = function (n) {
      var o = this.getBoundingClientRect(),
        i = {
          top: o.top,
          right: o.right,
          bottom: o.bottom,
          left: o.left,
          width: o.width,
          height: o.height,
        },
        f,
        e,
        r,
        t,
        l,
        s,
        u,
        h,
        c,
        a,
        v;
      if (
        (n &&
          n.height &&
          ((i.height = n.height), (i.bottom = i.top + i.height)),
        i.height === 0 && i.top === 0)
      ) {
        if (
          ((f =
            this.previousElementSibling &&
            this.previousElementSibling.getBoundingClientRect()),
          f && f.height
            ? (i = {
                top: f.bottom + 1,
                right: f.right,
                bottom: f.bottom + 2,
                left: f.left,
                width: f.width,
                height: 1,
              })
            : (e =
                this.nextElementSibling &&
                this.nextElementSibling.getBoundingClientRect()),
          e && e.height)
        )
          i = {
            top: e.top - 2,
            right: e.right,
            bottom: e.top - 1,
            left: e.left,
            width: e.width,
            height: 1,
          };
        else if (
          !i &&
          ((i = this.parentNode.getBoundingClientRect()), !i.height)
        )
          return;
      } else if (
        i.height === 0 &&
        this.nodeName === "INPUT" &&
        ((i = this.parentNode.getBoundingClientRect()), !i.height)
      )
        return;
      if (((r = n && n.container), r !== !1))
        if (r)
          if (r.ownerDocument) {
            if (!r.contains(this)) {
              console.error("Element not found in container", this, r);
              return;
            }
          } else {
            console.error("Invalid container", r);
            return;
          }
        else if (((r = this.scrollParent()), !r)) return;
      if (((t = {}), r)) {
        if (((t.height = r.clientHeight), !t.height)) return;
        t.width = r.clientWidth;
        l = r.getBoundingClientRect();
        t.top = l.top;
        t.left = l.left;
        t.topOffset = 0;
      } else {
        if (((s = this.ownerDocument), !s || !s.documentElement)) return;
        t.height = s.documentElement.clientHeight;
        t.width = s.documentElement.clientWidth;
        t.top = 0;
        t.left = 0;
        t.topOffset = n && n.fixed ? s.fixedOffset() : 0;
      }
      u = (n && n.margin) || 0;
      h = 0;
      n && n.top
        ? (h = i.top - t.topOffset - t.top - u)
        : i.top > t.top + t.height
        ? (h =
            i.height > t.height - 1
              ? i.top - t.topOffset - t.top - u
              : i.bottom - t.top - t.height + u)
        : i.bottom < t.top + t.topOffset + u &&
          (h =
            i.height > t.height - 1
              ? i.bottom - t.top - t.height + u
              : i.top - t.topOffset - t.top - u);
      c = 0;
      i.left > t.left + t.width
        ? (c =
            i.width > t.width - 1
              ? i.left - t.left - u
              : i.right - t.left - t.width + u)
        : i.right < t.left + u &&
          (c =
            i.width > t.width - 1
              ? i.right - t.left - t.width + u
              : i.left - t.left - u);
      a = n && n.instant ? -1 : n && n.duration;
      v = n && n.callback;
      (r || this.ownerDocument.defaultView).scrolling(c, h, a, v);
    });
  window.register && window.register("usc/p/scroll");
})();
("use strict");
(function () {
  function h(n) {
    return decodeURIComponent(n.replace(/\+/g, "%20"));
  }
  function t(n) {
    return encodeURIComponent(String(n)).replace(/['"\(\)]/g, function (n) {
      switch (n) {
        case "'":
          return "%27";
        case '"':
          return "%22";
        case "(":
          return "%28";
        case ")":
          return "%29";
        default:
          return n;
      }
    });
  }
  function n(n, i, r) {
    var o, c, e, s;
    if (!u)
      for (
        u = {}, o = document.cookie ? document.cookie.split("; ") : [], e = 0;
        e < o.length;
        e++
      ) {
        var l = o[e].split("="),
          c = h(l.shift()),
          f = l.join("=");
        switch (f[0]) {
          case "#":
            f = +f.substring(1);
            break;
          case ":":
            f = new Date(+f.substring(1));
            break;
          case "!":
            f = f === "!!";
            break;
          case "'":
            f = h(f.substring(1));
            break;
          default:
            f = h(f);
        }
        u[c] = f;
      }
    if (((c = String(n)), i === undefined)) return u[c];
    if (i === null) {
      document.cookie = n + "=; path=/; expires=" + new Date(0).toUTCString();
      delete u[c];
      return;
    }
    if (typeof i == "number") i = "#" + i;
    else if (typeof i == "boolean") i = i ? "!!" : "!";
    else if (i)
      if (i.constructor === Date) i = ":" + i.getTime();
      else if (nt(i))
        if (i.length)
          if (typeof i[0] == "number") {
            for (o = new Array(i.length), e = 0; e < i.length; e++)
              if (((o[e] = parseFloat(i[e])), isNaN(o[e]))) {
                o = null;
                break;
              }
            i = o ? JSON.stringify(o) : t(String(i));
          } else i = encode(String(i));
        else i = "[]";
      else
        i =
          typeof i == "string"
            ? t(i)
            : typeof i == "object"
            ? JSON.stringify(i)
            : String(i);
    else i = "";
    r
      ? r.constructor === Date ||
        ((s = new Date()),
        typeof r == "number"
          ? s.setDate(s.getDate() + r)
          : s.setDate(s.getDate() + 30))
      : (s = null);
    u[c] = i;
    document.cookie = [
      c + "=" + i,
      "; path=/",
      s ? "; expires = " + s.toUTCString() : "",
      y ? "; domain=" + y : "",
    ].join("");
  }
  function tt(n) {
    var i, t;
    if (!o)
      for (
        o = {}, i = window.location.search.substr(1).split("&"), t = 0;
        t < i.length;
        t++
      ) {
        var r = i[t++].split("="),
          u = r.shift().toLowerCase(),
          f = r.join("=");
        o[u] = h(f);
      }
    return o[String(n).toLowerCase()];
  }
  function c(n) {
    if (window.navigator.sendBeacon) {
      window.navigator.sendBeacon(n);
      return;
    }
    var t = document.createElement("img");
    t.style.display = "none";
    t.src = "about:blank";
    document.body.appendChild(t);
    t.src = n;
  }
  function f(t, i, r) {
    if (t === undefined) {
      var u = n("_sa");
      return +(u || 0);
    }
    n("_sa", t);
    l(i);
    rt(t, r);
  }
  function l(n) {
    if (typeof localStorage == "undefined") return null;
    if (n === undefined) {
      var t = +localStorage._vid_;
      return isNaN(t) && (t = 0), t;
    }
    n > 0 && (localStorage._vid_ = n);
  }
  function it() {
    var n = new Date(),
      t = new Date(n.getFullYear(), 0, 1),
      i = new Date(n.getFullYear(), 6, 1);
    return Math.max(t.getTimezoneOffset(), i.getTimezoneOffset()) / 60;
  }
  function a() {
    var n, t, r, i;
    if (document.getElementsByTagName) n = document.getElementsByTagName("a");
    else if (window.$) n = $("a");
    else return "";
    for (t = 0, r = n.length; t < r; t++) {
      var u = n[t],
        f = u && u.getAttribute("href"),
        e = f && /^tel:(.+)$/.exec(f);
      if (e && ((i = e[1].replace(/\D+/g, "")), i && i.length >= 10)) return i;
    }
    return "";
  }
  function et() {
    var n;
    if (window.Process && window.Process.Phones)
      try {
        n = window.Process.Phones();
      } catch (t) {}
    return n || "";
  }
  function p() {
    var i, f, r, u, n;
    if (document.getElementsByClassName)
      i = document.getElementsByClassName("ui-track-version");
    else if (window.$) i = $(".ui-track-version");
    else return "";
    for (f = {}, r = [], u = 0; u < i.length; u++)
      (n = i[u].getAttribute("id")), n && !f[n] && ((f[n] = !0), r.push(n));
    return r.length ? t(r.join("|")) : "";
  }
  function ot(u, f) {
    var e = document.createElement("script"),
      o =
        window.innerWidth ||
        document.documentElement.offsetWidth ||
        document.body.offsetWidth ||
        0,
      s =
        window.innerHeight ||
        document.documentElement.offsetHeight ||
        document.body.offsetHeight ||
        0;
    e.type = "text/javascript";
    e.async = !0;
    e.src =
      i +
      "/sa4.js?" +
      r +
      "," +
      u +
      "," +
      l() +
      "," +
      f +
      "," +
      o +
      "x" +
      s +
      "," +
      it() +
      "," +
      a() +
      "," +
      t(window.location.href) +
      "," +
      (n("L") || "0") +
      "," +
      (p() || "0") +
      "," +
      (n("SEOD") || "");
    document.head.appendChild(e);
  }
  function st(t, r, u, e, o, s, h, l, v, y, p, w, b, k) {
    var nt, rt, ut, tt, d, g, it, ft, et;
    if (t && r) {
      for (
        f(t, r, u),
          nt = {
            SPPC: u,
            PPCAD: e,
            PPCEX: o,
            PPCCMP: s,
            SEOD: h,
            SEOK: l,
            PPCP1: v,
            PPCP2: y,
            PPCTR: p,
            L: w,
          },
          rt = !!document.body.getAttribute("data-location"),
          !rt &&
            w > 0 &&
            ((ut = n("L")),
            w != ut &&
              window.location.replace(window.location.pathname + "?L_=" + w)),
          tt = Object.keys(nt),
          d = 0;
        d < tt.length;
        d++
      )
        (g = tt[d]), (it = nt[g]), it ? n(g, it, k || !0) : n(g, null);
      if (window.Process) {
        try {
          window.Process.Delayed();
        } catch (ot) {}
        ft = a();
        ft != b &&
          ((et = i + "/sa6.js?" + __said + "," + t + "," + b + "," + v), c(et));
      }
    }
  }
  function rt(t, i) {
    if (t) {
      if (d) return;
      if (location.search && /&(?:testmode|scid|noshrt)=/.test(location.search))
        return;
      i === undefined && (i = n("SPPC") || tt("SPPC") || "");
    } else return;
    if (i) {
      var r = "#~" + ut(parseInt(t));
      window.location.hash != r &&
        (window.history && window.history.replaceState
          ? (window.location.search &&
              window.location.search.indexOf("SPPC=") > 0 &&
              (r = window.location.pathname + r),
            window.history.replaceState(undefined, undefined, r))
          : window.location.replace && window.location.replace(r));
    }
  }
  function ut(n) {
    var t,
      u,
      i = !1,
      r = 1,
      e,
      o,
      s,
      f;
    if (typeof n == "number") {
      if (isNaN(n)) return undefined;
      for (t = n, e = []; t > 0; )
        (u = i ? r * 62 : r * 10),
          (i = !i),
          (o = t % u),
          (s = ht(o / r)),
          e.push(s),
          (t -= o),
          (r = u);
      return e.join("");
    }
    if (typeof n == "string") {
      if (!n) return 0;
      for (t = 0, f = 0; f < n.length; f++)
        (u = ct(n, f)), (t += u * r), (r *= i ? 62 : 10), (i = !i);
      return t;
    }
    return undefined;
  }
  function ht(n) {
    return n < 10
      ? String.fromCharCode(n + 48)
      : n < 36
      ? String.fromCharCode(n + 55)
      : String.fromCharCode(n + 61);
  }
  function ct(n, t) {
    var i = n.charCodeAt(t);
    return i < 58 ? i - 48 : i < 91 ? i - 55 : i - 61;
  }
  function w(n, t) {
    var i, r;
    if (n && n.closest) return n.closest(t);
    for (
      i = n;
      i &&
      i.parentNode &&
      i !== document.body &&
      i !== document.documentElement;

    ) {
      if (((r = i.nodeName), r && r.toLowerCase() === t)) return i;
      i = i.parentNode;
    }
    return null;
  }
  function lt(n) {
    var t = n && (n.offsetWidth || n.offsetHeight || n.getClientRects().length);
    return !!t;
  }
  function at(n) {
    var r, i, t;
    if (n && n.getElementsByTagName)
      for (r = n.getElementsByTagName("input"), i = 0; i < r.length; i++)
        if (((t = r[i]), t && t.getAttribute("type") === "text" && lt(t)))
          return t.value;
    return null;
  }
  function vt(n) {
    var t = (n.getAttribute("class") || "").trim();
    return t
      ? t.replace(/(\s+)|([^\w\-])/g, function (n, t, i) {
          return t ? "." : i ? "\\" + i : "";
        })
      : "";
  }
  function yt(n) {
    for (
      var i = [], t = n, r, u, f;
      t &&
      t.parentNode &&
      t !== document.body &&
      t !== document.documentElement;

    )
      (r = t.getAttribute("id")),
        r && i.push({ id: r, el: t }),
        (u = vt(t)),
        (f = (t.nodeName || "").toLowerCase()),
        (u || f === "li" || !i.length) && i.push({ cls: u, node: f, el: t }),
        (t = t.parentNode);
    return i;
  }
  function pt(n) {
    for (
      var t, i, e, o, s = yt(n), r = [], u = document, f = 0;
      f < s.length;
      f++
    ) {
      if (((t = s[f]), t.id)) {
        r.unshift("#" + t.id);
        u = t.el;
        break;
      } else i = t.cls ? t.node + "." + t.cls : t.node;
      e = u.querySelectorAll(i);
      e.length > 1 &&
        ((o = Array.prototype.indexOf.call(e, t.el)),
        o > -1 && (i += ":nth-child(" + (o + 1) + ")"));
      r.unshift(i);
      u = t.el;
    }
    return r;
  }
  function wt(n) {
    var i = w(n.target, "a"),
      e = i && i.getAttribute("href"),
      u = w(n.target, "button"),
      t = w(u, "form"),
      o = t && t.getAttribute("action"),
      c = t && t.getAttribute("method") === "post",
      r,
      f,
      h;
    if (i) r = i;
    else if (u) (r = u), (e = o);
    else if (n.target) r = n.target;
    else return;
    if (s)
      try {
        f = s(n);
      } catch (l) {}
    else f = o && t.getAttribute("data-search") && at(t);
    return (
      (h = pt(r)),
      {
        selector: h.join(" "),
        href: e || "",
        post: c ? "1" : "",
        search: f || "",
      }
    );
  }
  function bt(n, t, i) {
    var u = window.jwplayer,
      r = n && document.getElementById(n);
    r && r.nodeName && /video/i.test(r.nodeName)
      ? (player = r)
      : u && (player = u(n));
    player &&
      t &&
      i &&
      (player.sa || (player.sa = {}),
      (player.sa.vvid = t),
      (player.sa.vpid = i));
  }
  function kt() {
    var u = document.createElement("script"),
      f =
        window.innerWidth ||
        document.documentElement.offsetWidth ||
        document.body.offsetWidth ||
        0,
      e =
        window.innerHeight ||
        document.documentElement.offsetHeight ||
        document.body.offsetHeight ||
        0;
    u.type = "text/javascript";
    u.async = !0;
    u.src =
      i +
      "/sa.js?" +
      r +
      "," +
      ft +
      "," +
      (n("SPPC") || "") +
      "," +
      (n("SEOD") || "") +
      "," +
      t(n("SEOK") || "") +
      "," +
      f +
      "x" +
      e +
      "," +
      it() +
      "," +
      a() +
      "," +
      t(window.location.href) +
      "," +
      l() +
      "," +
      (n("PPCAD") || "") +
      "," +
      (n("PPCEX") || "") +
      "," +
      (n("PPCCMP") || "") +
      "," +
      (n("L") || "0") +
      "," +
      (p() || "0") +
      "," +
      (et() || "0");
    document.head.appendChild(u);
  }
  function dt(u) {
    var f =
      i +
      "/sa2.js?" +
      r +
      "," +
      u +
      "," +
      a() +
      "," +
      t(window.location.href) +
      "," +
      (n("L") || "0") +
      "," +
      (p() || "0");
    c(f);
  }
  function gt(u) {
    var o = f(),
      e,
      s;
    o &&
      ((e = wt(u)),
      (s =
        i +
        "/sa3.js?" +
        r +
        "," +
        o +
        "," +
        t(e.selector) +
        "," +
        (window.innerWidth ||
          document.documentElement.offsetWidth ||
          document.body.offsetWidth ||
          0) +
        "," +
        (window.innerHeight ||
          document.documentElement.offsetHeight ||
          document.body.offsetHeight ||
          0) +
        "," +
        Math.max(document.documentElement.scrollTop, document.body.scrollTop) +
        "," +
        (u.pageX || u.clientX || 0) +
        "," +
        (u.pageY || u.clientY || 0) +
        "," +
        t(e.href) +
        "," +
        t(e.post) +
        "," +
        t(e.search) +
        "," +
        (n("L") || "0")),
      c(s));
  }
  function ni(u, e, o, s, h, c) {
    var a = f(),
      l;
    a &&
      ((l = document.createElement("script")),
      (l.type = "text/javascript"),
      (l.async = !0),
      (l.src =
        i +
        "/va.js?" +
        r +
        "," +
        a +
        "," +
        u +
        "," +
        t(o || "") +
        s +
        "," +
        h +
        "," +
        e +
        "," +
        c +
        "," +
        (n("L") || "0")),
      document.head.appendChild(l));
  }
  function ti(t, r, u, f) {
    var e =
      i + "/va2.js?" + t + "," + r + "," + u + "," + f + "," + (n("L") || "0");
    c(e);
  }
  var r, d, nt, s, y, e, v, b, k;
  if (
    !(document.cookie.indexOf("COOK=NO!") > -1) &&
    ((r = document.documentElement.getAttribute("data-sa")),
    (d = !!document.documentElement.getAttribute("data-sd")),
    r &&
      !/google|bing|yahoo|spider|crawl|monitor|site24|bots\b|bot\b/i.test(
        window.navigator.userAgent || ""
      ))
  ) {
    var u = null,
      o = null,
      ft = "https:" === window.location.protocol ? "1" : "",
      g = document.body.getAttribute("data-api") || "api",
      i;
    i =
      g === "api"
        ? "https://sa.scorpion.co"
        : "https://" + g + ".scorpion.co/platform/analytics";
    nt =
      Array.isArray ||
      function (n) {
        return n && n.constructor === Array;
      };
    s = null;
    window.location.host &&
      window.location.host.indexOf("www.") === 0 &&
      (y = window.location.host.substr(3));
    window.SA = { Cookie: n, Query: tt };
    window._said_ = f;
    window._vaid_ = l;
    window._raid_ = st;
    window._vvid_ = bt;
    window._sa_videoStart = ni;
    window._sa_videoPlay = ti;
    window._sa_overrideSearch = function (n) {
      s = n;
    };
    e = f();
    v = n("SPPC");
    !v &&
      window.location.hash &&
      ((k = window.location.hash), k[1] === "~" && (b = ut(k.substr(2))));
    b
      ? (n("SPPC", "true"), ot(e, b))
      : e
      ? (dt(e), v && rt(e, v), window.Process && window.Process.Delayed())
      : (kt(), window.Process && window.Process.Delayed());
    window.navigator.sendBeacon &&
      document.addEventListener &&
      document.addEventListener("click", gt, !0);
  }
})();
window.USC || (window.USC = {});
rrequire("usc/p/poly", function () {
  function r(n) {
    var r;
    if (n === "true") return !0;
    if (n === "false") return !1;
    if (n === "null") return null;
    if (isNaN((r = +n)) || n !== String(r)) {
      if (i.test(n))
        try {
          return t(n);
        } catch (u) {}
    } else return r;
    return n;
  }
  var t = function (n, t) {
      return (window.JSON2 || JSON).parse(n, t);
    },
    i = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    n;
  USC.parseJson = t;
  USC.elementData = function (n) {
    var i, t, u, f, e;
    if (!n || !n.attributes) return undefined;
    for (i = {}, t = 0; t < n.attributes.length; t++)
      (u = n.attributes[t]),
        (f = String(u.name)),
        f.indexOf("data-") === 0 &&
          ((e = f.substring(5).replace(/\-([a-z])/g, function (n, t) {
            return t.toUpperCase();
          })),
          (i[e] = r(u.value)));
    return i;
  };
  USC.linkData = function (n) {
    var e = n && n.target,
      t = e && e.closest("a,button"),
      u = t && t.getAttribute("href"),
      i = u && /^javascript:(\w+)(?:\('([^']+)')?(?:\s*,\s*(\d+?)\))?/i.exec(u),
      o = i && i[1],
      r = o === "void" ? i[2] : undefined,
      f;
    return (
      (r && r !== "0") || (r = t && t.getAttribute("data-action")),
      r &&
        (i && i[3]
          ? (f = +i[3])
          : t.getAttribute("data-id") && (f = +t.getAttribute("data-id"))),
      { link: t, href: u, fn: o, action: r, id: f }
    );
  };
  USC.setAttributes = function (n, t) {
    var i, r;
    for (i in t)
      t.hasOwnProperty(i) &&
        ((r = t[i]), typeof r != "undefined" && n.setAttribute(i, r));
  };
  USC.onVisible = function (n, t, i, r) {
    var u, f, e, o;
    typeof IntersectionObserver != "undefined" &&
      (t < 0 ? ((u = -t + "px"), (f = 0)) : ((u = "0px"), (f = t)),
      (e = { root: null, rootMargin: u, threshold: f }),
      (o = new IntersectionObserver(function (t, u) {
        var f = t.find(function (n) {
          return n.isIntersecting;
        });
        if (!r) {
          f && (i(n), u.unobserve(n), u.disconnect());
          return;
        }
        f ? i(n) : r(n);
      }, e)),
      o.observe(n));
  };
  USC.docReady = function (t) {
    if (t) {
      if (!n)
        switch (document.readyState) {
          case "complete":
          case "loaded":
          case "interactive":
            n = !0;
            return;
        }
      if (n) t();
      else {
        var i = function () {
          n = !0;
          window.removeEventListener("DOMContentLoaded", i);
          t();
        };
        window.addEventListener("DOMContentLoaded", i);
      }
    }
  };
  USC.uuid = function () {
    var n = performance.now();
    return "_xxxxxxxxxxxxxxxx".replace(/x/g, function () {
      var t = (n + Math.random() * 16) % 16 | 0;
      return (n = Math.floor(n / 16)), t.toString(16);
    });
  };
  USC.guid = function () {
    var n = performance.now();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (t) {
        var i = (n + Math.random() * 16) % 16 | 0;
        return (
          (n = Math.floor(n / 16)), (t == "x" ? i : (i & 3) | 8).toString(16)
        );
      }
    );
  };
  USC.urlfriendly = function (n) {
    return n
      ? ("" + n)
          .replace(/([a-z])(?:'s|s')\b/gi, "$1s")
          .replace(/\W+/gi, "-")
          .toLowerCase()
      : "";
  };
  USC.logError = function (n, t) {
    if (n && n.stack && (console.error(n.stack), t))
      try {
        console.error(JSON.stringify(Array.prototype.slice.call(t)));
      } catch (n) {}
  };
  USC.getKey = function (n) {
    var i = n.code && n.code.replace(/Key|Digit/, ""),
      r = n.ctrlKey,
      u = n.altKey,
      f = n.shiftKey,
      t;
    switch (i) {
      case "AltLeft":
      case "AltRight":
        u = !1;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        f = !1;
      case "ControlLeft":
      case "ControlRight":
        r = !1;
    }
    return (
      (t = ""),
      r && (t += "CTRL-"),
      u && (t += "ALT-"),
      f && (t += "SHIFT-"),
      t + i.toUpperCase()
    );
  };
  USC.Encode = {};
  USC.Encode.JS = USC.Encode.Uri = function (n) {
    return n
      ? encodeURIComponent("" + n).replace(/['"\(\)]/g, function (n) {
          switch (n) {
            case "'":
              return "%27";
            case '"':
              return "%22";
            case "(":
              return "%28";
            case ")":
              return "%29";
            default:
              return n;
          }
        })
      : "";
  };
  USC.Decode = {};
  USC.Decode.JS = USC.Decode.Uri = function (n) {
    return n ? decodeURIComponent(("" + n).replace(/\+/g, "%20")) : "";
  };
  USC.getElementsCollectionByDataAttribute = function (n, t, i) {
    var r, f, s, o, e, u, h;
    if (!n) return null;
    if (
      ((r = {}),
      (f = Array.from((t || document).querySelectorAll(n))),
      i && f.push(t),
      !f.length)
    )
      return r;
    for (s = n.replace(/[\[\]]/g, ""), o = 0; o < f.length; o++)
      (e = f[o]),
        (u = e.getAttribute(s)),
        r[u]
          ? r[u] && !Array.isArray(r[u])
            ? ((h = r[u]), (r[u] = []), r[u].push(h), r[u].push(e))
            : r[u].push(e)
          : (r[u] = e);
    return r;
  };
  window.register && window.register("usc/p/utils");
});
window.USC || (window.USC = {}),
  (function () {
    function n(n) {
      var t = getComputedStyle(n);
      return {
        paddingTop: parseFloat(t.paddingTop),
        paddingBottom: parseFloat(t.paddingBottom),
        marginTop: parseFloat(t.marginTop),
        marginBottom: parseFloat(t.marginBottom),
        height: t.height === "auto" ? 0 : parseFloat(t.height),
      };
    }
    function t(t, i) {
      t.style.cssText = "";
      t.style.transition = "none";
      t.style.display = "block";
      t.style.height = "auto";
      var r = n(t);
      return (
        t.style.removeProperty("display"),
        t.style.removeProperty("height"),
        t.style.removeProperty("transition"),
        (t.style.cssText = i),
        t.offsetHeight,
        r
      );
    }
    function i(n) {
      n.style.cssText = "";
      n.removeAttribute("animating");
    }
    function r(n, t, r, u) {
      var f =
          "overflow: hidden; display: block; visibility: visible; padding-top: 0; padding-bottom: 0; margin-top: 0; margin-bottom: 0; height:" +
          (n.dataset.start ? n.dataset.start : "0"),
        e;
      n.style.cssText = u ? u : f;
      n.offsetHeight;
      t
        ? ((e =
            "overflow: hidden; display: block; visibility: visible; padding-top: " +
            r.paddingTop +
            "px; padding-bottom: " +
            r.paddingBottom +
            "px; margin-top: " +
            r.marginTop +
            "px; margin-bottom: " +
            r.marginBottom +
            "px; height: " +
            r.height +
            "px;"),
          (n.style.cssText = e),
          n.classList.add("sld-opn"))
        : ((n.style.cssText = f), n.classList.remove("sld-opn"));
      n.setAttribute("animating", !0);
      n.hasAttribute("bound") ||
        (n.setAttribute("bound", !0),
        n.addEventListener("transitionend", i.bind(null, n)));
    }
    USC.slideToggle = function (i, u) {
      var f, e;
      i &&
        ((f = u && !i.getAttribute("animating") ? !1 : n(i)),
        f &&
          (f =
            "overflow: hidden; display: block; visibility: visible; padding-top: " +
            f.paddingTop +
            "px; padding-bottom: " +
            f.paddingBottom +
            "px; margin-top: " +
            f.marginTop +
            "px; margin-bottom: " +
            f.marginBottom +
            "px; height: " +
            f.height +
            "px;"),
        u && (e = t(i, f)),
        r(i, u, e, f));
    };
    window.register && window.register("usc/p/slide-toggle");
  })();
window.USC || (window.USC = {});
require2(["usc/p/utils", "usc/p/slide-toggle"], function () {
  function t(t) {
    var e = t.closest("[data-showhide]") || t,
      o;
    ((this.els = {
      box: e,
      btns: Array.from(e.querySelectorAll('[data-role="btn"]')),
      panel: e.querySelector('[data-role="panel"]'),
    }),
    this.els.btns && this.els.panel) &&
      ((o = USC.elementData(this.els.box)),
      (this.options = Object.assign({}, n, o)),
      (this.els.lastFocus = Array.from(
        this.els.panel.querySelectorAll(
          'a, button, input, select, [tabindex="0"], video'
        )
      ).pop()),
      this.els.lastFocus || (this.els.lastFocus = this.els.panel),
      (this.active = !1),
      (this.handleAria = i.bind(this)),
      (this.handleClick = r.bind(this)),
      (this.handleKeyDown = u.bind(this)),
      (this.toggleActive = f.bind(this)),
      this.handleAria(),
      (this.els.returnSpot = this.els.returnSpot
        ? this.els.returnSpot
        : this.els.btns[0]),
      this.els.box.addEventListener("keydown", this.handleKeyDown),
      this.els.box.addEventListener("click", this.handleClick));
  }
  function i() {
    this.els.box.setAttribute("role", "dialog");
    USC.setAttributes(this.els.panel, { "aria-hidden": !0, tabindex: 0 });
    for (var n = 0; n < this.els.btns.length; n++)
      USC.setAttributes(this.els.btns[n], {
        role: "button",
        tabindex: 0,
        "aria-pressed": !1,
        "aria-haspopup": !1,
      }),
        this.els.returnSpot ||
          this.els.btns[n].getAttribute("data-type") !== "open" ||
          (this.els.returnSpot = this.els.btns[n]);
  }
  function r(n) {
    n.target.closest('[data-role="btn"]') && this.toggleActive();
  }
  function u(n) {
    var t;
    n.keyCode === 27 && this.active && (t = !0);
    n.keyCode === 13 && this.els.btns.includes(n.target) && (t = !0);
    n.keyCode === 9 &&
      this.els.panel.contains(n.target) &&
      (n.shiftKey && this.els.panel == n.target
        ? ((t = !0), n.preventDefault())
        : n.shiftKey ||
          this.els.lastFocus != n.target ||
          ((t = !0), (this.els.lastFocus = this.els.panel)));
    t === !0 && this.toggleActive();
  }
  function f() {
    var n, t;
    if (
      (this.options.slider === !0 &&
        USC.slideToggle(this.els.panel, !this.active),
      (n = this.els.panel.querySelectorAll("video")),
      this.active)
    )
      n.forEach(function (n) {
        try {
          n.pause();
        } catch (t) {}
      });
    else
      try {
        n[0].readyState >= 1 && n[0].play();
      } catch (i) {}
    for (
      this.els.box.classList.toggle(this.options.className),
        this.els.panel.setAttribute("aria-hidden", this.active),
        t = 0;
      t < this.els.btns.length;
      t++
    )
      this.els.btns[t].setAttribute("aria-pressed", this.active ? !1 : !0);
    this.options.htmlClass &&
      document.querySelector("html").classList.toggle(this.options.className);
    this.active ? this.els.returnSpot.focus() : this.els.panel.focus();
    this.active = this.active ? !1 : !0;
  }
  var n = { className: "show", htmlClass: !1, slider: !1 };
  window.USC.showHide = function (n) {
    if (n instanceof HTMLElement) {
      if (n.$showHide) {
        console.log("showHide already initialized.");
        return;
      }
      n.$showHide = new t(n);
    } else throw new Error("Need an HTMLElement to initialize a showHide.");
  };
  window.register && window.register("usc/p/show-hide");
});
window.USC || (window.USC = {}),
  (function () {
    function t() {
      for (var i = document.cookie.split(";"), t = 0; t < i.length; t++)
        i[t].indexOf("AO=") > 0 &&
          ((this.cookieData = n(i[t].match(/[\{].+[}]/g))),
          this.cookieData.contrast &&
            document.documentElement.classList.add("high-contrast"),
          this.cookieData.text &&
            (this.cookieData.text == 1
              ? document.documentElement.classList.add("x1")
              : this.cookieData.text == 2 &&
                document.documentElement.classList.add("x2")));
    }
    function i() {
      var n = new Date();
      n.setTime(n.getTime() + 2592e6);
      document.cookie =
        "AO=" + JSON.stringify(this.cookieData) + "; expires=" + n + ";path=/";
    }
    function r() {
      document.documentElement.classList.contains("x2")
        ? (document.documentElement.classList.remove("x2"),
          (this.cookieData.text = !1))
        : document.documentElement.classList.contains("x1")
        ? (document.documentElement.classList.remove("x1"),
          document.documentElement.classList.add("x2"),
          (this.cookieData.text = 2))
        : (document.documentElement.classList.add("x1"),
          (this.cookieData.text = 1));
      window.dispatchEvent(new CustomEvent("scroll"));
    }
    function u() {
      this.content.setAttribute("tabindex", 0);
      this.content.focus();
    }
    function f(n) {
      var t = n.target.closest("[data-action]");
      if (t && (n.type !== "keydown" || n.keyCode === 13)) {
        switch (t.getAttribute("data-action")) {
          case "content":
            this.skipToContent();
            break;
          case "highContrast":
            document.documentElement.classList.toggle("high-contrast");
            this.cookieData.contrast =
              document.documentElement.classList.contains("high-contrast")
                ? !0
                : !1;
            break;
          case "largeText":
            this.textSize();
            break;
          case "clear":
            document.documentElement.classList.remove(
              "high-contrast",
              "x1",
              "x2"
            );
            this.cookieData.contrast = !1;
            this.cookieData.text = !1;
        }
        this.setCookie();
      }
    }
    var n = function (n, t) {
      return (window.JSON2 || JSON).parse(n, t);
    };
    USC.accessMenu = function (n) {
      this.content = document.querySelector('[data-content="true"]');
      this.content || n.querySelector('[data-action="content"]').remove();
      this.cookieData = { contrast: !1, text: !1 };
      this.handleClick = f.bind(this);
      this.cookieFinder = t.bind(this);
      this.skipToContent = u.bind(this);
      this.textSize = r.bind(this);
      this.setCookie = i.bind(this);
      this.cookieFinder();
      n.addEventListener("click", this.handleClick);
      n.addEventListener("keydown", this.handleClick);
    };
    window.register && window.register("usc/p/accessibility-menu");
  })();
require2(["usc/p/show-hide", "usc/p/accessibility-menu"], function () {
  var n = document.getElementById("AccessibilityOptionsV1Alt"),
    t = n.querySelector(".acc-mnu");
  n && (USC.showHide(n), USC.accessMenu(t));
});
window.USC || (window.USC = {});
require2(["usc/p/utils"], function () {
  function t(n) {
    for (
      var t = n.closest("[data-header]") || n, r, u, f, i;
      t && t !== document.body;

    ) {
      if (
        ((f = getComputedStyle(t)),
        (i = f.getPropertyValue("position")),
        i === "fixed" ||
          i === "sticky" ||
          i === "absolute" ||
          t.matches("header"))
      ) {
        r = t;
        (i === "fixed" || i === "absolute") &&
          (u =
            document.querySelector("main>form:first-child>section") ||
            document.querySelector("main>section:first-child") ||
            document.querySelector("main"));
        break;
      }
      t = t.parentNode;
    }
    return { header: r, padding: u };
  }
  function i(n) {
    this.element = n;
    this.els = t(n);
    this.state = {
      over: !1,
      rtimer: 0,
      stimer: 0,
      htimer: 0,
      h_height: 0,
      wn_height: 0,
      wn_width: 0,
      scroll: 0,
      collapsed: !1,
    };
    this.evt = {
      measure: function () {
        this.measure();
      }.bind(this),
      scroll: function () {
        clearTimeout(this.state.stimer);
        clearTimeout(this.state.htimer);
        this.state.stimer = setTimeout(this.adjust, 100);
      }.bind(this),
    };
    this.hide = c.bind(this);
    this.measure = l.bind(this);
    this.adjust = v.bind(this);
    this.element.addEventListener("focusin", r.bind(this));
    this.element.addEventListener("mouseover", u.bind(this));
    this.element.addEventListener("mouseleave", f.bind(this));
    this.element.addEventListener("click", e.bind(this));
    this.els.header &&
      (this.measure(),
      this.adjust(),
      this.els.header.addEventListener("mouseenter", o.bind(this)),
      this.els.header.addEventListener("mouseleave", s.bind(this)),
      window.addEventListener("resize", h.bind(this)),
      window.addEventListener("scroll", a.bind(this), { passive: !0 }));
  }
  function r(t) {
    var r = t.target.closest("li"),
      i;
    if (r && !r.classList.contains("active"))
      for (
        this.element.querySelectorAll("li.active").forEach(n),
          r.classList.add("active"),
          i = r.parentNode;
        i && i !== this.element;

      )
        i.nodeName === "LI" && i.classList.add("active"), (i = i.parentNode);
  }
  function u(n) {
    var t = n.target.closest("a");
    t && t.focus();
  }
  function f() {
    this.element.querySelectorAll("li.active").forEach(n);
    var t = document.activeElement;
    t && this.element.contains(t) && t.blur();
  }
  function e(n) {
    var t = USC.linkData(n),
      i,
      r;
    if (
      t.href &&
      t.href[0] === "#" &&
      (i = t.href.substring(1)) &&
      ((r = document.querySelector("a[name='" + i + "']")), r)
    )
      throw new Error("Need to implement the simple show/hide.");
  }
  function o() {
    this.state.over = !0;
  }
  function s() {
    this.state.over = !1;
    this.state.htimer &&
      (clearTimeout(this.state.htimer),
      (this.state.htimer = setTimeout(this.hide, 4e3)));
  }
  function h() {
    clearTimeout(this.state.rtimer);
    this.state.rtimer = setTimeout(this.measure, 250);
  }
  function c() {
    this.state.over ||
      (clearTimeout(this.state.htimer),
      (this.state.htimer = 0),
      this.adjust(!0));
  }
  function l() {
    if (this.els.header) {
      var n = this.els.header.getBoundingClientRect();
      this.state.h_height = n.height;
      this.state.wn_height = window.innerHeight;
      this.state.wn_width = window.innerWidth;
      this.state.scroll = window.scrollY;
      this.els.padding &&
        (this.els.padding.style.paddingTop = this.state.h_height + "px");
    }
  }
  function a() {
    clearTimeout(this.state.stimer);
    clearTimeout(this.state.htimer);
    this.state.stimer = setTimeout(this.adjust, 100);
  }
  function v(n) {
    var r, u, i, t;
    this.els.header &&
      ((r = window.scrollY),
      (u = r - this.state.scroll),
      clearTimeout(this.state.htimer),
      r < this.state.h_height
        ? (i = !1)
        : n === !0
        ? (i = !0)
        : u < this.state.wn_height / -3
        ? ((i = !1), (this.state.htimer = setTimeout(this.evt.hide, 4e3)))
        : (i = !0),
      (this.state.scroll = r),
      (t = document.documentElement),
      i
        ? (t.classList.remove("header-show"), t.classList.add("header-hide"))
        : r
        ? (t.classList.remove("header-hide"), t.classList.add("header-show"))
        : (t.classList.remove("header-hide"),
          t.classList.remove("header-show")),
      (this.state.collapsed = i));
  }
  var n = function (n) {
    n.classList.remove("active");
  };
  window.USC.siteHeader = function (n) {
    if (n instanceof HTMLElement) {
      if (n.$siteHeader) {
        console.log("SiteHeader already initialized.");
        return;
      }
      n.$siteHeader = new i(n);
    } else throw new Error("Need an HTMLElement to initialize a SiteHeader.");
  };
  window.register && window.register("usc/p/site-header");
});
require2("usc/p/site-header", function () {
  USC.siteHeader(document.getElementById("HeaderV5TopNav"));
});
window.USC || (window.USC = {});
require2(["usc/p/utils", "usc/p/slide-toggle"], function () {
  function e(t) {
    var i, w, e, b;
    if (
      ((this.element = t),
      (i = t.closest(".el-tab-box") || t),
      (this.els = {
        tabBox: i,
        tabs: Array.from(i.querySelectorAll(".el-tab")),
        panels: Array.from(i.querySelectorAll(".el-panel")),
        secTabs: Array.from(i.querySelectorAll(".el-sec-tab")),
        tabbable: [],
      }),
      !this.els.panels.length || !this.els.tabs.length) ||
      ((w = USC.elementData(t)),
      (this.options = Object.assign({}, u, w)),
      (this.handleAria = s.bind(this)),
      (this.getTabbable = h.bind(this)),
      (this.handleSubs = o.bind(this)),
      (this.tabState = y.bind(this)),
      (this.firstActive = a.bind(this)),
      (this.toggleActive = p.bind(this)),
      (this.checkValidity = l.bind(this)),
      (this.handleClick = n.bind(this)),
      (e = Array.from(this.els.tabBox.querySelectorAll(".el-tab-box"))),
      e.length && this.handleSubs(e),
      !this.els.panels.length || !this.els.tabs.length) ||
      (this.els.secTabs.length && (this.options.secTabs = !0),
      (b = v(this.els.panels)),
      !b)
    )
      return !1;
    this.options.nextPrev &&
      ((this.els.next = i.querySelector(".el-next-btn")),
      (this.els.prev = i.querySelector(".el-prev-btn")));
    this.handleAria();
    this.options.firstActive === !0 && this.firstActive();
    this.getTabbable();
    this.els.tabBox.addEventListener("keydown", c.bind(this));
    this.els.tabBox.addEventListener("click", n.bind(this));
    this.options.hovers &&
      (f.matches ||
        (this.els.tabBox.addEventListener("mouseover", n.bind(this)),
        this.els.tabBox.addEventListener("focusin", n.bind(this))),
      this.options.hoverStay ||
        (this.els.tabBox.addEventListener("mouseleave", r.bind(this)),
        this.els.tabBox.addEventListener("focusout", r.bind(this))));
  }
  function t(n, t, i, r) {
    for (var u = 0; u < n.length; u++)
      if (n[u].contains(t) && t != n[u]) {
        i.splice(r, 1);
        break;
      }
  }
  function o(n) {
    for (
      var i,
        r,
        f,
        e = this.els.tabs.slice(0),
        o = this.els.panels.slice(0),
        s = this.els.secTabs.slice(0),
        u = this.els.tabs.length - 1;
      u >= 0;
      u--
    )
      t(n, this.els.tabs[u], e, u);
    for (this.els.tabs = e, i = this.els.panels.length - 1; i >= 0; i--)
      t(n, this.els.panels[i], o, i);
    for (this.els.panels = o, r = this.els.secTabs.length - 1; r >= 0; r--)
      t(n, this.els.secTabs[r], s, r);
    for (this.els.secTabs = s, f = 0; f < n.length; f++)
      new window.USC.tabbable(n[f]);
  }
  function i(n, t) {
    for (var i = 0; i < n.length; i++)
      if (n[i].getAttribute("aria-controls") === t) return n[i];
  }
  function s() {
    var o = this.els.tabs[0],
      s = this.els.panels[0],
      h = o && o.closest("ul"),
      r,
      u,
      c,
      f,
      n,
      t,
      e;
    if ((h && h.setAttribute("role", "tablist"), this.options.siblings === !1))
      for (r = 0; r < this.els.panels.length; r++)
        this.els.panels[r].setAttribute("tabindex", 0);
    else
      s &&
        getComputedStyle(s).position !== "absolute" &&
        this.options.hovers === !1 &&
        (this.options.slider = !0);
    if (
      ((this.els.panelIds =
        s && this.els.panels[0].getAttribute("id") ? !0 : !1),
      (this.els.tabControls =
        o && this.els.tabs[0].getAttribute("aria-controls") ? !0 : !1),
      !h && this.els.panelIds && this.els.tabControls)
    ) {
      for (u = [], c = [], k = 0; k < this.els.panels.length; k++)
        u.push(i(this.els.tabs, this.els.panels[k].getAttribute("id"))),
          this.options.secTabs &&
            u.push(i(this.els.secTabs, this.els.panels[k].getAttribute("id")));
      this.els.tabs = u;
      this.options.secTabs && (this.els.secTabs = c);
    }
    for (f = 0; f < this.els.panels; f++)
      if (this.els.panels[f].contains(this.els.tabs[0])) {
        this.els.tabsInPanels = !0;
        break;
      }
    for (n = 0; n < this.els.tabs.length; n++) {
      if (!this.els.tabs[n].classList) {
        console.warn(
          "This node does not support the classList property",
          this.els.tabs[n]
        );
        continue;
      }
      if (!this.els.panels[n]) {
        console.warn("No panel found for this tab", this.els.tabs[n]);
        continue;
      }
      t = this.els.tabs[n].classList.contains("active") ? !0 : !1;
      e = this.els.panelIds
        ? this.els.panels[n].getAttribute("id")
        : this.element.getAttribute("id")
        ? this.element.getAttribute("id")
        : Math.floor(Math.random() * 100) + "Panel" + n;
      USC.setAttributes(this.els.tabs[n], {
        role: "tab",
        tabindex: 0,
        "aria-selected": t,
        "aria-expanded": t,
        "aria-controls": e,
        index: n,
      });
      this.options.secTabs &&
        USC.setAttributes(this.els.secTabs[n], {
          role: "tab",
          tabindex: 0,
          "aria-selected": t,
          "aria-expanded": t,
          "aria-controls": e,
          index: n,
        });
      USC.setAttributes(this.els.panels[n], {
        role: "tabpanel",
        "aria-hidden": t ? !1 : !0,
        id: e,
      });
    }
    this.els.next &&
      USC.setAttributes(this.els.next, {
        role: "button",
        title: "View the Next Panel",
      });
    this.els.prev &&
      USC.setAttributes(this.els.prev, {
        role: "button",
        title: "View the Previous Panel",
      });
  }
  function h() {
    for (
      var i = Array.from(
          this.els.tabBox.querySelectorAll("a,button,input,select,[tabindex]")
        ),
        n,
        u,
        r,
        t;
      i.length;

    )
      if (
        ((n = i.shift()),
        this.els.tabbable.push(n),
        (u = this.els.tabs.indexOf(n)),
        !(u < 0)) &&
        ((r = this.els.panels[u]), r)
      )
        for (t = 0; t < i.length; t++)
          (n = i[t]),
            (r === n || r.contains(n)) &&
              (this.els.tabbable.push(n), i.splice(t, 1), t--);
  }
  function n(n) {
    var t = n.target.closest(".el-tab"),
      i = n.target.closest(".el-sec-tab"),
      e = n.target.closest(".el-next-btn"),
      o = n.target.closest(".el-prev-btn"),
      s = n.target.closest(".ui-novalidate"),
      u,
      f,
      r;
    if (e) {
      if (this.activeIndex + 1 <= this.els.panels.length - 1) {
        if (this.options.stepForm && !s && ((r = this.checkValidity()), !r))
          return;
        this.tabState(this.activeIndex + 1);
      }
    } else if (o)
      this.activeIndex - 1 >= 0 && this.tabState(this.activeIndex - 1);
    else if (t || i) {
      if (
        ((u = i && this.els.secTabs.indexOf(i)),
        i && u > -1 && (t = this.els.tabs[parseInt(i.getAttribute("index"))]),
        (f = this.els.tabs.indexOf(t)),
        f < 0)
      )
        return;
      if (this.options.stepForm && ((r = this.checkValidity()), !r)) return;
      if (t.classList.contains("active"))
        if (this.options.closing) this.tabState(-1);
        else return;
      else this.tabState(this.els.tabs.indexOf(t));
    } else {
      this.options.hover && !this.options.hoverStay && this.tabState(-1);
      return;
    }
  }
  function c(n) {
    var e, u, i, f, t, r;
    if (n.keyCode === 13) {
      if (n.shiftKey && n.ctrlKey && n.altKey) return;
      if (
        (e = n.target.closest(".el-tab")) ||
        (e = n.target.closest(".el-sec-tab"))
      ) {
        this.handleClick(n);
        return;
      }
      return;
    }
    if (
      n.keyCode === 9 &&
      ((u = this.els.tabbable.indexOf(n.target)), !(u < 0)) &&
      !this.els.tabsInPanels
    ) {
      for (
        t = u + (n.shiftKey ? -1 : 1);
        t < this.els.tabbable.length && t >= 0;
        n.shiftKey ? t-- : t++
      )
        if (
          ((i = this.els.tabbable[t]),
          (f = i.getBoundingClientRect()),
          f.width && f.height)
        )
          break;
        else {
          i = undefined;
          continue;
        }
      i
        ? (i.focus(), n.preventDefault())
        : n.shiftKey ||
          ((r = document.createElement("span")),
          r.setAttribute("tabindex", 0),
          this.els.tabBox.appendChild(r),
          r.focus(),
          r.remove());
    }
  }
  function r() {
    this.tabState(-1);
  }
  function l() {
    for (var t, i, r, n = 0; n < this.els.panels.length; n++)
      if (this.els.panels[n].classList.contains("active")) {
        r = this.els.panels[n];
        continue;
      }
    if (((t = Array.from(r.querySelectorAll("input, select, textarea"))), t))
      for (i = 0; i < t.length; i++) if (!t[i].trigger("invalid")) return !1;
    return !0;
  }
  function a() {
    for (var r, i, t = 0, n = 0; n < this.els.tabs.length; n++)
      if (
        ((r = this.els.tabs[n]),
        (i = r.getBoundingClientRect()),
        i.width || i.height)
      ) {
        t = parseInt(n);
        break;
      }
    this.activeIndex = t;
    this.tabState(t);
  }
  function v(n) {
    for (var i, r, t = 0; t < n.length; t++)
      if (
        ((i = n[t]), !i.classList.contains("active")) &&
        ((r = i.getBoundingClientRect()), r.width || r.height)
      )
        return !1;
    return !0;
  }
  function y(n) {
    for (var i, r, t = 0; t < this.els.tabs.length; t++)
      (i = this.els.tabs[t]),
        (r = this.els.panels[t]),
        this.toggleActive(i, r, t === n),
        t === n && (this.activeIndex = n);
    this.activeIndex === 0
      ? (this.els.tabBox.classList.add("tab-start"),
        this.els.tabBox.classList.remove("tab-end"))
      : this.activeIndex === this.els.panels.length - 1
      ? (this.els.tabBox.classList.remove("tab-start"),
        this.els.tabBox.classList.add("tab-end"))
      : this.els.tabBox.classList.remove("tab-start", "tab-end");
  }
  function p(n, t, i) {
    (i && n.classList.contains("active")) ||
      ((i || n.classList.contains("active")) &&
        (this.options.slider === !0 && USC.slideToggle(t, i),
        n.classList.toggle("active"),
        t.classList.toggle("active"),
        USC.setAttributes(n, { "aria-selected": i, "aria-expanded": i }),
        t.setAttribute("aria-hidden", i ? !1 : !0),
        this.options.secTabs &&
          ((secTab = this.els.secTabs[n.getAttribute("index")]),
          secTab.classList.toggle("active"),
          USC.setAttributes(secTab, { "aria-selected": i, "aria-expanded": i }),
          i || n.focus()),
        i && this.els.tabsInPanels && t.focus(),
        i && t.dispatchEvent(new Event("resize")),
        this.options.lazy === !0 &&
          i &&
          t.querySelector(
            "img[data-src],img[data-bg],video[data-src],source[data-src]"
          ).length > 0 &&
          window.dispatchEvent(new Event("resize")),
        this.options.video !== !0 ||
          i ||
          t.querySelectorAll("video").forEach(function (n) {
            try {
              n.pause();
            } catch (t) {}
          })));
  }
  var u = {
      slider: !1,
      speed: 500,
      siblings: !0,
      closing: !1,
      hovers: !1,
      hoverStay: !0,
      video: !1,
      lazy: !1,
      firstActive: !1,
      stepForm: !1,
      nextPrev: !1,
    },
    f = window.matchMedia("(hover:none)");
  window.USC.tabbable = function (n) {
    if (n instanceof HTMLElement) {
      if (n.$tabbable) {
        console.log("Tabbable already initialized.");
        return;
      }
      n.$tabbable = new e(n);
    } else throw new Error("Need an HTMLElement to initialize a Tabbable.");
  };
  window.USC.setTabbableActive = function (n) {
    var i = n.closest(".el-panel"),
      r,
      t,
      u;
    if (i && !i.offsetHeight) {
      for (t = n; t; )
        if (t.$tabbable) {
          r = t.$tabbable;
          break;
        } else if (t === i) break;
        else if (t.parentNode) t = t.parentNode;
        else break;
      r && ((u = r.els.panels.indexOf(i)), u !== -1 && r.tabState(u));
    }
  };
  window.register && window.register("usc/p/tabbable");
});
require2("usc/p/tabbable", function () {
  USC.tabbable(document.getElementById("HeaderV5TopNav"));
});
require2("usc/p/show-hide", function () {
  USC.showHide(document.getElementById("HeaderV5TopNav"));
});
window.USC || (window.USC = {}),
  (function () {
    function n() {
      if (this.value && r.test(this.value)) {
        if (((this.value = t(this.value)), this.value.length <= 6)) {
          var n = this.value.indexOf(")");
          this.setSelectionRange(n, n);
        }
      } else this.value = "";
    }
    function t(n) {
      return (n || "")
        .replace(u, "")
        .replace(f, "")
        .replace(e, "($1) $2-$3")
        .replace(o, "")
        .substring(0, 14);
    }
    function i() {
      for (
        var t, r = document.querySelectorAll(".phone-mask"), i = 0;
        i < r.length;
        i++
      )
        (t = r[i]),
          t.$phoneFormat ||
            (t.addEventListener("input", n), (t.$phoneFormat = !0)),
          n.call(t);
    }
    var r = /\d+/,
      u = /\D/g,
      f = /^1/g,
      e = /(\d{0,3})(\d{0,3})(\d{0,4})/,
      o = /-+$/;
    i();
    window.USC.phoneFormat = n;
    window.USC.formatPhoneInputs = i;
    window.USC.formatPhoneNumber = t;
    window.register && window.register("usc/p/phone-format");
  })();
window.registerLoading && registerLoading("form"),
  (function (n) {
    typeof rrequire == "function"
      ? rrequire(
          [
            "j/jquery",
            "j/jquery.ui",
            "j/ui.touch",
            "m/date",
            "extensions",
            "c/loading",
            "behaviors",
            "m/masked",
          ],
          n
        )
      : n(jQuery);
  })(function (n) {
    var f = function (n, t) {
        return (window.JSON2 || JSON).parse(n, t);
      },
      e = {
        badInput: !1,
        compareMismatch: !1,
        customError: !1,
        notUnique: !1,
        patternMismatch: !1,
        rangeOverflow: !1,
        rangeUnderflow: !1,
        stepMismatch: !1,
        tooLong: !1,
        tooShort: !1,
        typeMismatch: !1,
        valid: !0,
        valueMissing: !1,
      },
      r = function (n) {
        var t = new Date().parse(n);
        return n &&
          typeof n == "string" &&
          t &&
          ((t = t.getFullYear()), t > 1753 && t < 9999)
          ? [n]
          : null;
      },
      o = function (n) {
        var i, r, u, t;
        if (n && /[x\-]{10,16}\d{3,6}/.exec(n) == n) return !0;
        if (((n = (n || "").replace(/\D+/g, "")), n.length < 15 || n.le > 16))
          return null;
        for (
          i = n.length,
            r = 0,
            u = [
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              [0, 2, 4, 6, 8, 1, 3, 5, 7, 9],
            ],
            t = 0;
          i--;

        )
          (t += u[r][parseInt(n.charAt(i), 10)]), (r ^= 1);
        return t && t % 10 == 0;
      },
      u = {
        email:
          /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i,
        url: /^(((ht|f)tp(s?))\:\/\/)?(www.|[a-zA-Z0-9].)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$/i,
        number: /\d+/,
        date: { exec: r },
        datetime: { exec: r },
        "datetime-local": { exec: r },
        time: { exec: r },
      },
      i = {
        get: function (t) {
          var i,
            r,
            u = t.getAttribute("id");
          return u
            ? ((i = n(t)
                .find("input[id^='" + u + "_']")
                .filter(":checkbox,:radio")),
              !i.length)
              ? undefined
              : ((r = []),
                i.filter(":checked").each(function () {
                  r.push(n(this).val());
                }),
                r.join(","))
            : undefined;
        },
        set: function (t, i) {
          var r = t.getAttribute("id"),
            u = !1;
          if (r)
            return (
              (i = Make.Array(i)),
              n(t)
                .find("input[id^='" + r + "_']")
                .filter(":checkbox,:radio")
                .each(function () {
                  var t = n(this);
                  i.indexOf(t.val()) >= 0 && (t.is(":checkbox") || !u)
                    ? (t.prop("checked", !0), (u = !0))
                    : t.prop("checked", !1);
                }),
              i
            );
        },
      },
      t = { shiftKey: !1, altKey: !1, ctrlKey: !1 };
    document.addEventListener &&
      (document.addEventListener(
        "keydown",
        function (n) {
          t.shiftKey = n.shiftKey;
          t.altKey = n.altKey;
          t.ctrlKey = n.ctrlKey;
        },
        !0
      ),
      document.addEventListener(
        "keyup",
        function (n) {
          t.shiftKey = n.shiftKey;
          t.altKey = n.altKey;
          t.ctrlKey = n.ctrlKey;
        },
        !0
      ));
    n.valHooks.div = i;
    n.valHooks.ul = i;
    n.valHooks.ol = i;
    n.valHooks.dl = i;
    n.valHooks.table = i;
    n.valHooks.input = {
      set: function (n, t) {
        switch (n.getAttribute("type")) {
          case "date":
          case "time":
          case "datetime":
          case "datetime-local":
            return Date.setInputValue(n, t), t;
        }
      },
    };
    n.html5form = {
      validate: function (t, i, r) {
        var l,
          h,
          d,
          w,
          g,
          b = Modernizr.input.required
            ? t.prop("required")
            : !!t.attr("required"),
          v = t.data("conditional"),
          nt = t.data("conditionalValue"),
          tt = t.data("conditionalNotValue"),
          a = t.prop("pattern") || t.attr("pattern"),
          it = t.prop("min") || Make.Int(t.attr("min")),
          rt = t.prop("max") || Make.Int(t.attr("max")),
          st = t.prop("step") || Make.Int(t.attr("step")),
          o = t.val(),
          ft = t.attr("placeholder"),
          k = t.data("compare"),
          et = t.data("unique"),
          ot = k && n("#" + k).val(),
          ut = t.data("customValidator"),
          y =
            t.closest("li").length > 0
              ? t.closest("li")
              : t.closest(
                  ".input-text, .input-select, .input-mark, .input-html"
                ),
          c =
            t.attr("name") &&
            t
              .attr("name")
              .split("$")
              .pop()
              .replace(/([a-z])([A-Z])/g, "$1 $2"),
          s = t.data("alert"),
          f = n.extend({}, e),
          p;
        if (!t.is(".ui-novalidate"))
          if (
            (t.is(":checkbox,:radio") &&
              ((l = i.find("input[name='" + t.attr("name") + "']")),
              l.length > 1 &&
                (y = l.not(t).parentsUntil(i).filter("li").has(t).first()),
              t.is(":checked")
                ? !o && t.is(":checkbox") && (o = "on")
                : (o = null)),
            v &&
              ((v = i.find("#" + v).is(":checkbox")
                ? i.find("#" + v).prop("checked")
                : i.find("#" + v).val()),
              nt
                ? (h = Behaviors.Conditional.Match(v, nt))
                : tt && (h = !Behaviors.Conditional.Match(v, tt)),
              h
                ? (Modernizr.input.required && (l || t).prop("required", !0),
                  (l || t).attr("required", "required"),
                  (b = !0))
                : (Modernizr.input.required && (l || t).prop("required", !1),
                  (l || t).removeAttr("required"),
                  (b = !1))),
            b && (!o || o === ft)
              ? (t.is(":checkbox,:radio") && l.filter(":checked").length) ||
                ((f.valid = !1),
                (f.valueMissing = !0),
                s || (s = c + " is required"))
              : a && !n.html5form._pattern(t, a, o)
              ? ((f.valid = !1),
                (f.patternMismatch = !0),
                s || (s = c + " is not valid"))
              : k && o != ot
              ? ((f.valid = !1),
                (f.compareMismatch = !0),
                s || (s = c + " does not match"))
              : (et && !1) ||
                (ut && !n.html5form._custom(t, ut, o)
                  ? ((f.valid = !1),
                    (f.customError = !0),
                    s || (s = c + " has an invalid value."))
                  : Modernizr.formvalidation
                  ? ((a = u[t.attr("type")]),
                    t.length && t[0].checkValidity && !t[0].checkValidity()
                      ? (n.extend(f, t[0].validity),
                        s || (s = c + " is not valid"))
                      : t.length &&
                        o &&
                        a &&
                        ((h = a.exec(o)),
                        (h && h.length && h[0] === o) ||
                          ((f.valid = !1), (f.typeMismatch = !0))))
                  : it && Make.Float(o) < Make.Float(it)
                  ? ((f.valid = !1),
                    (f.rangeUnderflow = !0),
                    s || (s = c + " is too low"))
                  : rt && Make.Float(o) > Make.Float(rt)
                  ? ((f.valid = !1),
                    (f.rangeOverflow = !0),
                    s || (s = c + " is too high"))
                  : ((a = u[t.attr("type")]),
                    o &&
                      a &&
                      ((h = a.exec(o)),
                      (h && h.length && h[0] === o) ||
                        ((f.valid = !1), (f.typeMismatch = !0))))),
            (c = (t.attr("name") || "").replace(/\$/g, "_") || t.attr("id")),
            (d = y.find(".validation[for='" + c + "']").hide()),
            f.valid)
          ) {
            if (
              (y.removeClass("invalid"),
              o && y.addClass("valid"),
              (t = i.find("input[data-compare='" + t.attr("id") + "']")),
              t.val())
            )
              return n.html5form.validate(t, i, r);
          } else {
            y.removeClass("valid").addClass("invalid");
            for (p in f)
              if (p != "valid" && f.hasOwnProperty(p) && f[p] === !0) {
                if (
                  !r &&
                  p === "valueMissing" &&
                  ((w = i.find("li.invalid")),
                  (g = w.index(y)),
                  (w = w.slice(0, g)),
                  w.find(".validation:visible").length)
                )
                  break;
                d.filter("[data-type='" + p + "']").show();
                break;
              }
            return { error: t, alert: s };
          }
      },
      validateGroup: function (t, i, r) {
        var s,
          h,
          f,
          e,
          l,
          c,
          a = [],
          v = {},
          u = null,
          o,
          y;
        if (
          t &&
          t[0] &&
          t[0].getAttribute("data-html5") === "1" &&
          window.$8 &&
          $8.FORM &&
          $8.FORM.Init
        )
          return t[0].reportValidity();
        for (
          i ||
            (i = t.find(
              ":input:not(.ui-dialog-titlebar-close,.ui-novalidate,button)"
            )),
            o = 0,
            y = i.length;
          o < y;
          o++
        ) {
          if (((s = i.eq(o)), (h = s.attr("name")), v[h])) continue;
          else v[h] = !0;
          f = n.html5form.validate(s, t, !0);
          f && f.error && ((u = u || f.error), f.alert && a.push(f.alert));
        }
        if (u) {
          !u.is(":visible") &&
            (e = u.closest(".ui-tab-panel")).length &&
            !e.is(".active") &&
            (l = e.data("tab")) &&
            e
              .closest(".ui-tabs")
              .find(".ui-tab[data-tab='" + l + "']:not(.active)")
              .eq(0)
              .click();
          r &&
            !Modernizr.formvalidation &&
            alert("The form is incomplete.\n" + a.join("\n"));
          u.scrollIntoView(1200);
          try {
            u.focus();
          } catch (p) {}
          return !1;
        }
        if (((c = t.data("customValidation")), n.isFunction(c)))
          return c.apply(this, arguments);
      },
      _pattern: function (n, t, i) {
        var u, r;
        try {
          u = new RegExp(t);
        } catch (f) {
          return console.log('Illegal RegExp - "' + t + '"'), !0;
        }
        return i ? ((r = u.exec(i)), r && r[0] == i) : !0;
      },
      _custom: function (t, i, r) {
        return (
          typeof i == "string" && (i = n.html5form.customValidators[i]),
          i && n.isFunction(i) ? !!i(t, r) : void 0
        );
      },
      customValidators: {
        ssn: function (n, t) {
          return (
            t &&
            /^(?!000)([0-6]\d{2}|7([0-6]\d|7[012]))([ -]?)(?!00)\d\d\3(?!0000)\d{4}$/.exec(
              t
            ) === t
          );
        },
        creditcard: function (n, t) {
          return t && o(t);
        },
      },
    };
    n.fn.html5form = function (i) {
      return this.filter(function () {
        return n(this).data("html5form") === undefined;
      }).each(function () {
        var h;
        if (
          this.getAttribute("data-html5") === "1" &&
          window.$8 &&
          $8.FORM &&
          $8.FORM.Init
        ) {
          $8.FORM.Init(this);
          return;
        }
        var c =
            "button[type='submit'],input[type='image'],input[type='submit']",
          r = n(this).data("html5form", !0),
          f = r.closest("form"),
          e = r.find(
            ":input:not(.ui-dialog-titlebar-close,.ui-novalidate,button)"
          ),
          o = null,
          u = !1,
          s = !1,
          a = function () {
            return (s = !0), n.html5form.validateGroup(f, e, u);
          },
          v = function () {
            if (!Modernizr.touch)
              switch (this.getAttribute("type")) {
                case "date":
                case "datetime":
                case "datetime-local":
                  n.cms.date.choose(this);
              }
          },
          y = function (t) {
            var r,
              e,
              h,
              l,
              y,
              i = n(t.target);
            switch (t.type) {
              case "focusin":
                if (
                  ((r =
                    i.closest("li").length > 0 ? i.closest("li") : i.parent()),
                  r.is(".readonly"))
                )
                  return StopAll(t);
                r.addClass("focused");
                Modernizr.placeholder ||
                  i.val() !== i.attr("placeholder") ||
                  i.val("");
                v.call(t.target, arguments);
                break;
              case "focusout":
                r = i.closest("li").length > 0 ? i.closest("li") : i.parent();
                r.removeClass("focused");
                i.val() ? r.addClass("filled") : r.removeClass("filled");
                Modernizr.placeholder ||
                  i.val() ||
                  !(placeholder = i.attr("placeholder")) ||
                  i.val(placeholder);
                n.html5form.validate(i, f, s);
                break;
              case "click":
                o = null;
                e = Get.LinkData(t);
                switch (e.action) {
                  case "Expand":
                    n(e.link).closest("li").toggleClass("expand");
                    return;
                }
                if (
                  (e.link
                    ? (i = n(e.link))
                    : ((i = n(t.target)),
                      (h = i.closest("button")),
                      h.length && (i = h)),
                  i.is(":disabled"))
                )
                  return console.log("disabled"), StopAll(t);
                if (i.closest("li").is(".readonly")) return StopAll(t);
                if (((l = i.data("confirm")), l))
                  if (i.data("confirmed")) i.data("confirmed", !1);
                  else
                    return (
                      $confirm(l, function () {
                        i.data("confirmed", !0);
                        i.click();
                      }),
                      StopAll(t)
                    );
                if (i.is(c)) {
                  if (
                    ((o = i),
                    i.prop("formnovalidate") === undefined &&
                      i.attr("formnovalidate") === undefined &&
                      a() === !1)
                  )
                    return u
                      ? Modernizr.formvalidation
                        ? void 0
                        : !1
                      : StopAll(t);
                } else if (i.is("div"))
                  return ((i = i.children(
                    "input:visible:first, textarea:visible:first"
                  )),
                  !i.length)
                    ? void 0
                    : ((y = n.cms.date.isOpen()),
                      i.focus(),
                      y
                        ? n.cms.date.picker.close()
                        : i.is("input[type='time']") && n.cms.date.choose(i[0]),
                      !1);
                break;
              case "change":
                return n(t.target).closest("li").is(".readonly")
                  ? StopAll(t)
                  : n.html5form.validate(i, f, s);
            }
          },
          l = function (t) {
            var u, i;
            if (
              (t &&
                t.type === "reload" &&
                (e = r.find(":input:not(.ui-dialog-titlebar-close,button)")),
              r.find(".cms-combobox").combobox(),
              r.find(".cms-uploader").uploader(),
              (u = r.find(".cms-slide-captcha").slideCaptcha()),
              !u.length)
            ) {
              r.find("input:hidden[id$='_FFD6']").val(new Date().getTime());
              r.find(c).on("mousedown", function () {
                r.find("input:hidden[id$='_FFD6']").val(new Date().getTime());
              });
            }
            r.find(":input[data-masking]").masked();
            r.find("textarea[data-editor='ckeditor']")
              .ckeditor()
              .closest("li")
              .find("a.expand")
              .on("click", function () {
                n(this).closest("li").find(".input-html").toggleClass("expand");
              });
            r.find("textarea[data-editor='ace']").ace();
            r.find("textarea[data-editor='ck']").ck();
            i = r.find("[data-ga-search]");
            i &&
              i.length &&
              rrequire("m/google-address-lookup", function () {
                r.GoogleAddressLookup();
              });
          };
        i && i.useNative !== undefined
          ? (u = !!i.useNative)
          : (r.find("li :input").length && r.find("li .validation").length) ||
            (u = !0);
        Modernizr.placeholder ||
          r.find("input[placeholder]").each(function () {
            var t = n(this);
            t.val(t.attr("placeholder"));
          });
        h = {};
        e.filter("input:checkbox[required]").each(function () {
          var t = n(this).attr("name");
          if (h[t])
            return (
              f.attr("novalidate", "novalidate").prop("novalidate", !0),
              (u = !1),
              !1
            );
          h[t] = 1;
        });
        r.on("focusin focusout change click", y);
        if (!u) e.on("invalid", !1);
        r.on("reload", l);
        r.closest("form").on("submit", function () {
          if (document.activeElement)
            try {
              document.activeElement.blur();
            } catch (i) {}
          (o && o.data("noloading")) ||
            t.ctrlKey ||
            this.getAttribute("data-search") ||
            n(document.body).loading();
        });
        Modernizr.inputtypes.date ||
          r.find("input[type]").each(function () {
            var n,
              t,
              i = this.getAttribute("type");
            switch (i) {
              case "date":
                n = "M/d/yyyy";
                break;
              case "time":
                break;
              case "datetime":
              case "datetime-local":
                n = "M/d/yyyy h:mm tt";
                break;
              default:
                return;
            }
            Modernizr.inputtypes[i] ||
              ((t = Date.parse(this.value)),
              isNaN(t) || (this.value = new Date(t).formatted(n)));
          });
        l();
        Behaviors.On();
      });
    };
    n.widget("cms.uploader", {
      options: {},
      _create: function () {
        var n = this;
        rrequire("c/uploadable", function () {
          n._setup();
        });
      },
      _setup: function () {
        var t = this.element.data("filetype") || CMS.Files.IMAGE,
          r = this.element.find("input:hidden"),
          n = r.val(),
          f = n && "." + n.split(".").pop(),
          u = /^http/.test(n) ? n : CMS.Files.getThumbnail("", n, f),
          i = this.element.find("[data-role='thumbnail']"),
          e = !!this.element.data("s3");
        typeof t == "string" &&
          (t = CMS.Files[t.toUpperCase()] || CMS.Files.IMAGE);
        this.element.uploadable({
          filetype: t,
          folder: this.element.data("folder"),
          input: r,
          thumbnail: i,
          dialog: !this.element.data("nodialog"),
          maxFiles: this.element.data("maxFiles") || 0,
          drop: this.element.find("[data-role='drop']"),
          browse: this.element.find("[data-role='browse']"),
          media: this.element.find("[data-role='media']"),
          cancel: this.element.find("[data-role='cancel']"),
          s3: e,
        });
        i &&
          i.length &&
          u &&
          (i.attr("src", u).addClass("show"),
          this.element.addClass("uploaded"));
        this._trigger("uploader");
      },
    });
    n.widget("cms.slideCaptcha", {
      options: { enabledAt: 0.7 },
      _create: function () {
        this.submit = this.element
          .closest("form")
          .find("button[type='submit'],button[type='image']")
          .prop("disabled", !0);
        this.input = this.element.find("input:hidden");
        this.message = this.element.find("[data-role='message']");
        this.options.message = this.message.html();
        this.handle = this.element
          .find("[data-role='handle']")
          .draggable({
            start: n.proxy(this._start, this),
            drag: n.proxy(this._drag, this),
            stop: n.proxy(this._stop, this),
          });
        this._enabled = !1;
      },
      _start: function (n, t) {
        t.helper.w = this.handle.parent().outerWidth() - this.handle.width();
      },
      _drag: function (n, t) {
        var i = t.helper.w,
          r = Math.limit(t.position.left, 0, i),
          u = i ? r / i : 0;
        t.position.top = 0;
        t.position.left = r;
        u > this.options.enabledAt && !this._enabled
          ? this.enable()
          : u <= this.options.enabledAt && this._enabled && this.disable();
      },
      _stop: function (n, t) {
        var i = t.helper.w,
          u = Math.limit(t.position.left, 0, i),
          r = i ? u / i : 0;
        r > this.options.enabledAt && r < 1
          ? t.helper.animate({ left: i }, 150)
          : r > 0 &&
            r <= this.options.enabledAt &&
            t.helper.animate({ left: 0 }, 250);
      },
      enable: function () {
        this._enabled = !0;
        this.element.addClass("enabled");
        this.submit.prop("disabled", !1);
        this.input.val(new Date().getTime());
        this.message.length &&
          this.message.html(
            this.message.data("enabled") || this.options.message
          );
      },
      disable: function () {
        this._enabled = !1;
        this.element.removeClass("enabled");
        this.submit.prop("disabled", !0);
        this.input.val("");
        this.message.length && this.message.html(this.options.message);
      },
    });
    n.widget("cms.ace", {
      _create: function () {
        var t = this.element.val(),
          i;
        t && t.indexOf("<") >= 0 && this.element.val(Encode.HTML(t));
        i = function () {
          this.element.onvisible(this._setup.bind(this));
          setTimeout(function () {
            n(window).trigger("resize");
          }, 250);
        }.bind(this);
        rrequire(["ace"], i);
      },
      _setup: function () {
        var i = Compute.UUID(),
          t = this.element.data("ace");
        n.isPlainObject(t) || (t = {});
        this.state = { ctimer: 0, ptimer: 0 };
        this.element.css({ visibity: "hidden", opacity: 0 });
        this.div = n("<div></div>").insertAfter(this.element);
        this.div
          .attr("id", i)
          .css({
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          });
        this.code = ace.edit(i);
        this.code.setTheme("ace/theme/dreamweaver");
        this.code.getSession().setMode(t.mode || "ace/mode/html");
        this.code.setSelectionStyle("text");
        this.code.setHighlightActiveLine(!0);
        this.code.setShowInvisibles(!1);
        this.code.setDisplayIndentGuides(!1);
        this.code.renderer.setShowGutter(!0);
        this.code.setPrintMarginColumn(!1);
        this.code.setHighlightSelectedWord(!0);
        this.code.renderer.setHScrollBarAlwaysVisible(!1);
        this.code.renderer.setVScrollBarAlwaysVisible(!0);
        this.code.setAnimatedScroll(!1);
        this.code.session.setUseSoftTabs(!1);
        this.code.setBehavioursEnabled(!0);
        this.code.setFadeFoldWidgets(!1);
        this.code.setReadOnly(!1);
        this.code.setOption("scrollPastEnd", !1);
        this.code.$blockScrolling = Infinity;
        this.code.on(
          "focus",
          function () {
            this.dirty = !1;
          }.bind(this)
        );
        this.code.on(
          "change",
          function (n, t) {
            var i;
            t.silent ||
              ((i = t.getValue()),
              this.element.val(Encode.HTML(i || "")),
              (this.dirty = !0),
              this.element.trigger("input"));
          }.bind(this)
        );
        this.code.on(
          "blur",
          function () {
            this.dirty && (this.element.trigger("change"), (this.dirty = !1));
            this.dirty = !1;
          }.bind(this)
        );
        this.update = function () {
          var n = Decode.HTML(this.element.val() || "");
          this.code.silent = !0;
          this.code.setValue(n || "", -1);
          this.code.focus();
          this.code.silent = !1;
        }.bind(this);
        this.element.on("update", this.update);
        this.update();
        this.element[0].getValue = this.code.getValue.bind(this.code);
      },
      _destroy: function () {
        var n = this.element.attr("id");
        this.code.edit(n).destroy();
      },
    });
    n.widget("cms.ckeditor", {
      options: {
        properties: !1,
        toolbar: [
          { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
          { name: "lists", items: ["NumberedList", "BulletedList"] },
          { name: "links", items: ["Links", "Media"] },
          { name: "spell", items: ["SpellChecker"] },
          { name: "format", items: ["Format"] },
          { name: "styles", items: ["Styles"] },
          {
            name: "blocks",
            items: [
              "JustifyLeft",
              "JustifyCenter",
              "JustifyRight",
              "JustifyBlock",
              "Indent",
              "Outdent",
            ],
          },
          { name: "special", items: ["ShowBlocks"] },
          { name: "clip", items: ["Undo", "Redo"] },
          { name: "maximize", items: ["Maximize"] },
        ],
        toolbarHTML: [
          { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
          { name: "lists", items: ["NumberedList", "BulletedList"] },
          { name: "links", items: ["Links", "Media"] },
          {
            name: "blocks",
            items: [
              "JustifyLeft",
              "JustifyCenter",
              "JustifyRight",
              "JustifyBlock",
              "Indent",
              "Outdent",
            ],
          },
          { name: "spell", items: ["SpellChecker"] },
          { name: "format", items: ["Format"] },
          { name: "styles", items: ["Styles"] },
          { name: "special", items: ["ShowBlocks"] },
          { name: "clip", items: ["Undo", "Redo", "SourceEdit"] },
          { name: "maximize", items: ["Maximize"] },
        ],
        toolbarSimple: [
          { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
          { name: "lists", items: ["NumberedList", "BulletedList"] },
          { name: "links", items: ["Links"] },
          { name: "format", items: ["Format"] },
          { name: "styles", items: ["Styles"] },
          { name: "clip", items: ["Undo", "Redo"] },
          { name: "maximize", items: ["Maximize"] },
        ],
        simpleHTML: [
          { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
          { name: "lists", items: ["NumberedList", "BulletedList"] },
          { name: "links", items: ["Links"] },
          { name: "format", items: ["Format"] },
          { name: "clip", items: ["Undo", "Redo", "SourceEdit"] },
          { name: "maximize", items: ["Maximize"] },
        ],
      },
      _create: function () {
        var t = this.element.val(),
          i;
        t && t.indexOf("<") >= 0 && this.element.val(Encode.HTML(t));
        i = function () {
          this.element.onvisible(this._setup.bind(this));
          setTimeout(function () {
            n(window).trigger("resize");
          }, 250);
        }.bind(this);
        rrequire(
          ["ckeditor", "html"],
          ["opensans", "cms-form", "cms-tools", "cms-wizards"],
          i
        );
      },
      val: function (n) {
        if (n === undefined)
          return this.editor ? this.editor.getData() : this.value;
        this.value = n ? new HTML.Page(n).render() : "";
        this.editor
          ? (this.editor.setData(n), this.editor.updateElement())
          : this.element.val(Encode.HTML(this.value));
      },
      _destroy: function () {
        this.editor &&
          this.editor.destroy &&
          (this.editor.destroy(), (this.editor = null));
      },
      _setup: function () {
        var e,
          r,
          o = this,
          t = this.element,
          i = t.data(),
          u = t.attr("id"),
          s = t.is("[required]"),
          h = t.val(),
          f = undefined;
        if (((this.state = { last: null, ctimer: 0 }), !this.initialized)) {
          this.initialized = !0;
          this.value = t.val() || "";
          this.value &&
            ((this.value = new HTML.Page(Decode.HTML(this.value)).render()),
            t.val(this.value));
          e =
            i.fullPage === !0 ||
            (this.value && this.value.indexOf("</head>") >= 0);
          u || ((u = Compute.UUID()), t.attr("id", u));
          this.element.addClass("ui-ckeditor");
          i && i.simple && i.html
            ? ((r = this.options.simpleHTML), (f = "properties"))
            : i && i.simple
            ? ((r = this.options.toolbarSimple), (f = "properties,acesource"))
            : i && i.html
            ? (r = this.options.toolbarHTML)
            : ((r = this.options.toolbar), (f = "acesource"));
          this.options.properties && (f = undefined);
          this.editor = CKEDITOR.replace(u, {
            htmlEncodeOutput: !0,
            fullPage: e,
            toolbar: r,
            removePlugins: f,
            on: {
              instanceReady: function () {
                var n,
                  i = window.navigator.userAgent;
                s && t.attr("required", "required");
                o.ready = !0;
                t.trigger("ready");
                i &&
                  /MSIE 10\.0/.test(i) &&
                  /NT 6\.1/.test(i) &&
                  (console.log("IE10 on Windows 7 detected."),
                  console.log(
                    "Warning! There are browser rendering bugs with this version that may affect CKEDITOR."
                  ),
                  console.log(
                    "If the CKEDITOR tools cannot be seen, F5 to refresh the page."
                  ));
                n = CKEDITOR.instances[u];
                n && n.updateElement();
                window.USE && USE.Replace && USE.Replace();
              },
            },
          });
          this.options.properties &&
            this.options.properties.nodeType === 1 &&
            (this.editor.propertiesPane = this.options.properties);
          this.editor.on("focus", function () {
            t.closest("li").addClass("focused");
          });
          this.editor.on("blur", function (n) {
            t.closest("li").removeClass("focused");
            n.editor.sourceCode || n.editor.updateElement();
          });
          switch (this.element.data("autosave")) {
            case "form":
              this.checkAutosave();
              this.editor.on("change", n.proxy(this.autosave, this));
              this.element.closest("form").on("submit", function () {
                var n = "autosave:" + window.location.pathname;
                localStorage.removeItem(n);
              });
              break;
            case "input":
              this.onchange = function () {
                clearTimeout(this.state.ctimer);
                this.state.ctimer = setTimeout(this.change, 250);
              }.bind(this);
              this.change = function () {
                var n;
                if (!this.editor.sourceCode) {
                  if (
                    (this.editor.updateElement(),
                    (n = t.val()),
                    (this.value && !n) || (!this.value && n))
                  ) {
                    t.trigger("input");
                    return;
                  }
                  n = new HTML.Page(Decode.HTML(n)).render();
                  this.value != n && ((this.value = n), t.trigger("input"));
                }
              }.bind(this);
              this.editor.on("change", this.onchange);
          }
          this._on(this.element, {
            update: function () {
              this.editor.updateElement();
            },
          });
        }
      },
      autosave: function () {
        this._atimeout && clearTimeout(this._atimeout);
        this._atimeout = setTimeout(n.proxy(this._autosave, this), 2e3);
      },
      _autosave: function () {
        var r,
          i,
          u = "autosave:" + window.location.pathname,
          t = {};
        (this.editor && this.editor.sourceCode) ||
          (this.element
            .closest("form")
            .find("[name]")
            .each(function () {
              var e,
                u = n(this),
                f = u.attr("name").split("$").pop(),
                r = u.val();
              if (r) {
                if (u.is(":radio") && !u.prop("checked")) return;
                if (u.is(":checkbox"))
                  if (u.prop("checked"))
                    (e = t[f] || []), e.push(r), (t[f] = e);
                  else return;
                else
                  u.is("textarea")
                    ? ((i = CKEDITOR.instances[u.attr("id")]),
                      i &&
                        ((r = i.getData()),
                        r &&
                          /^\s*<p\b[^>]*>\s*<\/p>\s*$/.test(r) &&
                          (r = null)),
                      r && (t[f] = r))
                    : (t[f] = r);
              } else return;
            }),
          n.isEmptyObject(t)) ||
          ((t[this.element.attr("name").split("$").pop()] =
            this.editor.getData()),
          (t.AutoSaved = new Date()),
          (r = JSON.stringify(t)),
          localStorage.setItem(u, r),
          this.editor.updateElement(),
          this.element.trigger("autosave"));
      },
      checkAutosave: function () {
        var r = this,
          t = "autosave:" + window.location.pathname,
          i = localStorage.getItem(t),
          n = i && f(i);
        n &&
          n.AutoSaved &&
          $confirm(
            "<h2>Restore Content</h2>You have content auto-saved on <strong>" +
              n.AutoSaved.formatted("MMMM d, yyyy h:mmtt") +
              "</strong>.<br>Would you like to continue with this edit?",
            function () {
              r._restoreAutosave(n);
            },
            function () {
              localStorage.removeItem(t);
            }
          );
      },
      _restoreAutosave: function (t) {
        this.element
          .closest("form")
          .find("[name]")
          .each(function () {
            var u,
              i = n(this),
              r = i.attr("name").split("$").pop(),
              f = i.val();
            i.is(":radio")
              ? t[r] && i.prop("checked")
              : i.is(":checkbox")
              ? ((u = t[r]), u && u.indexOf(f) >= 0 && i.prop("checked", !0))
              : i.is("textarea")
              ? ((ck = CKEDITOR.instances[i.attr("id")]),
                ck ? ck.setData(t[r] || "") : i.val(t[r] || ""))
              : i.val(t[r] || "");
          });
      },
    });
    n.widget("cms.ck", n.cms.ckeditor, {
      _create: function () {
        var t = this.element.val(),
          i;
        t && t.indexOf("<") >= 0 && this.element.val(Encode.HTML(t));
        i = function () {
          this.element.onvisible(this._setup.bind(this));
          setTimeout(function () {
            n(window).trigger("resize");
          }, 250);
        }.bind(this);
        window.location.href.includes("_admin") ||
          rrequire(["ck", "html"], [], i);
      },
    });
    n.widget("cms.combobox", {
      options: { insert: !1, fields: null, searchTimer: 100 },
      _create: function () {
        var t, i;
        if (
          ((this.id = this.element.attr("id")),
          (this.panel = this.element.find("[data-role='select']")),
          this.panel.length)
        ) {
          i = this.element.addClass("ui-noselect");
          rrequire("c/scrollbar", function () {
            i.find(".ui-scroll").scrollbar().captureScroll();
          });
          this.element.data("allowinsert") && (this.options.insert = !0);
          (t = this.element.data("fields")) != null &&
            (this.options.fields = t);
          this.element.on("focusin.combobox", n.proxy(this._onFocus, this));
          this.element.onidle(
            "input.combobox",
            n.proxy(this._handleSearch, this),
            this.options.searchTimer
          );
          this.element.on("change.combobox", n.proxy(this._handleChange, this));
          this.element.on("click.combobox", n.proxy(this._handleClick, this));
          this.element.on(
            "mouseover.combobox mouseleave.combobox",
            n.proxy(this._hover, this)
          );
          this.element.on("keydown.combobox", n.proxy(this._navigate, this));
        }
      },
      _destroy: function () {
        this.element.off(".combobox");
      },
      getLabel: function (t) {
        var i = null;
        return (
          this.element.find("label[for='" + t + "']").each(function () {
            var t = n(this).text();
            (!i || t.length > i.length) && (i = t);
          }),
          i || ""
        );
      },
      _onFocus: function (t) {
        var i = n(t.target).data("role");
        i == "search" && this.activate();
      },
      _handleSearch: function (t) {
        var r,
          o,
          s,
          i,
          f,
          e,
          h = !1,
          u = n(t.target),
          c = u.data("role");
        if (c == "search") {
          if (
            ((term = u.val() || ""),
            (r = term.toLowerCase()),
            (e = this.element.find("input:checkbox,input:radio")),
            !r)
          ) {
            e.closest("li").show();
            this.element.find(".ui-select-add, .no-results").hide();
            this.panel.removeClass("adding");
            return;
          }
          for (s = 0, o = e.length; o--; ) {
            if (
              ((f = !1),
              (u = e.eq(o)),
              this.options.fields && this.options.fields.length)
            ) {
              for (fIndex = this.options.fields.length; fIndex--; )
                if (
                  ((i = u.data(this.options.fields[fIndex]).toLowerCase()),
                  i && i.indexOf(r) >= 0)
                ) {
                  f = !0;
                  i == r && (h = !0);
                  break;
                }
            } else
              (i = this.getLabel(u.attr("id")).toLowerCase()),
                (f = i && i.indexOf(r) >= 0),
                i == r && (h = !0);
            f ? (s++, u.closest("li").show()) : u.closest("li").hide();
            h &&
              (this.element.find(".ui-select-add").hide(),
              this.panel.removeClass("adding"));
          }
          s
            ? this.element.find(".no-results").hide()
            : (this.element.find(".no-results").show(),
              this.element
                .find(".ui-select-add")
                .html('Add "' + term + '" as a category')
                .show(),
              this.panel.addClass("adding"));
          this._trigger("search", { value: r });
        }
      },
      _addNew: function (t) {
        var u,
          i,
          f = this.element.find("div[data-role='select']"),
          o = this.element.data("uniqueid"),
          s = this.element.data("insertfield"),
          h = this.element.find("ul[data-role='items']"),
          e = this.element.attr("id"),
          r = "0|" + t;
        u = n(
          '<li><input type="checkbox" class="cms">\t                    <label class="cms-replace"></label>\t                    <label class="cms"></label>                    </li>'
        )
          .find("input:checkbox")
          .attr({ name: o, id: e + r, value: r })
          .prop("checked", "checked")
          .data(s, t)
          .end()
          .find("label")
          .attr("for", e + r)
          .end()
          .find("label.cms")
          .text(t)
          .end();
        f.children("ul").append(u);
        f.removeClass("adding").find(".ui-select-add, .no-results").hide();
        i = n("<li></li>").addClass("button").appendTo(h);
        i.data("value", r);
        i.text(t);
        i.append('<a href="javascript:void(\'Remove\');" class="cancel"></a>');
      },
      _handleChange: function (t) {
        var u,
          f,
          e,
          o,
          i = n(t.target),
          r,
          s;
        if (i.is("input:checkbox,input:radio")) {
          if (((u = this.element.find("ul[data-role='items']")), u.length))
            u.empty();
          else return;
          for (
            f = this.element.find("input:checkbox,input:radio"),
              o = [],
              r = 0,
              s = f.length;
            r < s;
            r++
          )
            ((i = f.eq(r)), i.prop("checked")) &&
              (o.push(f[r]),
              (e = n("<li></li>").addClass("button").appendTo(u)),
              e.data("value", i.attr("value")),
              e.text(this.getLabel(i.attr("id"))),
              e.append(
                '<a href="javascript:void(\'Remove\');" class="cancel"></a>'
              ));
          this._trigger("change", { selected: n(o) });
        }
      },
      _handleClick: function (t) {
        var r,
          u,
          f = Get.LinkData(t),
          i;
        switch (f.action) {
          case "Remove":
            r = n(f.link).closest("li");
            i = r.data("value");
            r.remove();
            this.element
              .find("input:checkbox,input:radio")
              .filter("[value='" + i + "']")
              .prop("checked", !1);
            break;
          case "Add":
          case "AddNew":
            i = this.element.find("[data-role=search]").val();
            this._addNew(i);
            break;
          default:
            u = n(t.target);
            u.is("li") &&
              u.find("input:checkbox,input:radio,label").eq(0).click();
        }
      },
      _hover: function (t) {
        var i;
        if (t.type === "mouseleave") {
          this.over = !1;
          return;
        }
        this.over = !0;
        i = n(t.target).closest("li");
        i.length && n.contains(this.panel[0], i[0]) && this.focused(i);
      },
      _navigate: function (t) {
        if (!t.shiftKey && !t.ctrlKey) {
          switch (t.which) {
            case n.ui.keyCode.ESCAPE:
              this.deactivate();
              n(t.target).blur();
              break;
            case n.ui.keyCode.DOWN:
              this.navigate(1);
              break;
            case n.ui.keyCode.UP:
              this.navigate(-1);
              break;
            case n.ui.keyCode.PAGE_DOWN:
              this.navigate(10);
              break;
            case n.ui.keyCode.PAGE_UP:
              this.navigate(-10);
              break;
            case n.ui.keyCode.HOME:
              this.focused(this.panel.find("li:first"));
              break;
            case n.ui.keyCode.END:
              this.focused(this.panel.find("li:last"));
              break;
            case n.ui.keyCode.ENTER:
              this.toggle(this.panel.find(".focused:first"));
              break;
            default:
              return;
          }
          return StopAll(t);
        }
      },
      navigate: function (n) {
        var t = this.panel.find("li:visible"),
          i = t.filter(".focused"),
          r = Math.limit(t.index(i) + n, 0, t.length - 1);
        this.focused(t.eq(r));
      },
      toggle: function (n) {
        var t;
        if (n && n.length)
          if (((t = n.find("input:checkbox,input:radio")), t.length))
            switch (t.attr("type")) {
              case "checkbox":
                t.prop("checked", !t.prop("checked")).trigger("change");
                break;
              case "radio":
                t.prop("checked") || t[0].click();
            }
          else return;
      },
      focused: function (n) {
        n.is(".focused") ||
          (this.panel.find(".focused").removeClass("focused"),
          n.addClass("focused").scrollIntoView(),
          this._trigger("focused", { item: n }));
      },
      activate: function () {
        var t;
        if (!this.panel.is(".active")) {
          this.panel
            .addClass("active")
            .trigger("update")
            .find(".ui-scroll")
            .trigger("update");
          this._documentClick ||
            ((t = this),
            (this._documentClick = function () {
              t.over || t.deactivate();
            }));
          n(document).on("click.combobox", this._documentClick);
          this._documentFocus ||
            ((t = this),
            (this._documentFocus = function (i) {
              n.contains(t.element[0], i.target) ||
                n(i.target).is(".ui-dialog") ||
                t.deactivate();
            }));
          n(document).on("focusin.combobox", this._documentFocus);
          this._trigger("activate", { panel: this.panel });
        }
      },
      deactivate: function () {
        this.panel.is(".active") &&
          (this.panel.removeClass("active"),
          n(document).off("click.combobox", this._documentClick),
          n(document).off("focusin.combobox", this._documentFocus),
          this._trigger("deactivate", { panel: this.panel }));
      },
    });
    window.register && window.register("form");
  });
var select1 = document.querySelector(".frm-typ"),
  option1 = document.querySelector(".invstmnt-lvl option:first-of-type"),
  textarea1 = document.querySelector(".tll-abt-yu");
select1.addEventListener("change", function () {
  this.value === "Franchising Information"
    ? (option1.setAttribute("value", ""), (textarea1.innerHTML = ""))
    : (option1.setAttribute("value", "NA"), (textarea1.innerHTML = "NA"));
});
(function () {
  var n, t, i, r;
  if (typeof CustomEvent != "function") {
    function n(n, t) {
      t = t || {};
      var i = document.createEvent("CustomEvent");
      return (
        i.initCustomEvent(
          n,
          t.bubbles || !1,
          t.cancelable || !1,
          t.detail || undefined
        ),
        i
      );
    }
    n.prototype = window.Event.prototype;
    window.CustomEvent = n;
  }
  if (
    (Function.isFunction ||
      (Function.isFunction = function (n) {
        return Object.prototype.toString.call(n) === "[object Function]";
      }),
    Object.isPlainObject ||
      (function () {
        var r = Object.getPrototypeOf,
          n = {},
          u = n.toString,
          t = n.hasOwnProperty,
          i = t.toString,
          f = i.call(Object);
        Object.isPlainObject = function (n) {
          var e, o;
          return !n || u.call(n) !== "[object Object]"
            ? !1
            : ((e = r(n)), !e)
            ? !0
            : ((o = t.call(e, "constructor") && e.constructor),
              typeof o == "function" && i.call(o) === f);
        };
      })(),
    Object.isEmptyObject ||
      (Object.isEmptyObject = function (n) {
        if (!Object.isPlainObject(n)) return !1;
        for (var t in n) {
          if (n.hasOwnProperty(t)) return !1;
          continue;
        }
        return !0;
      }),
    !Object.extend)
  ) {
    function n(t) {
      var r, i;
      if (t === undefined || t === null) return t;
      switch (typeof t) {
        case "boolean":
        case "number":
        case "string":
          return t;
      }
      if (t.constructor === Date) return new Date(t.getTime());
      if (Array.isArray(t)) {
        for (r = new Array(t.length), i = 0; i < t.length; i++)
          r[i] = n(t[i], !0);
        return r;
      }
      return Object.isPlainObject(t) ? Object.extend({}, t) : t;
    }
    Object.extend = function () {
      var u,
        t,
        f,
        e = Array.from(arguments),
        o,
        i,
        r;
      for (u = e.shift() || {}, o = e.length, i = 0; i < o; i++)
        if (((t = e[i]), Object.isPlainObject(t)))
          for (r in t)
            t.hasOwnProperty(r) &&
              ((f = n(t[r])), f !== undefined && (u[r] = f));
      return u;
    };
    Object.merge = function () {
      var r,
        t,
        f,
        e = Array.from(arguments),
        o,
        u,
        i;
      for (r = e.shift() || {}, o = e.length, u = 0; u < o; u++)
        if (((t = e[u]), Object.isPlainObject(t)))
          for (i in t)
            t.hasOwnProperty(i) &&
              ((f = Object.isPlainObject(t[i])
                ? Object.merge({}, r[i], t[i])
                : n(t[i])),
              f !== undefined && (r[i] = f));
      return r;
    };
    Object.clone = function (t) {
      return n(t);
    };
  }
  if (
    (typeof Object.assign != "function" &&
      Object.defineProperty(Object, "assign", {
        value: function (n) {
          "use strict";
          var u, i, t, r;
          if (n === null || n === undefined)
            throw new TypeError("Cannot convert undefined or null to object");
          for (u = Object(n), i = 1; i < arguments.length; i++)
            if (((t = arguments[i]), t !== null && t !== undefined))
              for (r in t)
                Object.prototype.hasOwnProperty.call(t, r) && (u[r] = t[r]);
          return u;
        },
        writable: !0,
        configurable: !0,
      }),
    Array.isArray ||
      (Array.isArray = function (n) {
        return Object.prototype.toString.call(n) === "[object Array]";
      }),
    Array.from ||
      (Array.from = (function () {
        var t = Object.prototype.toString,
          n = function (n) {
            return typeof n == "function" || t.call(n) === "[object Function]";
          },
          i = function (n) {
            var t = Number(n);
            return isNaN(t)
              ? 0
              : t === 0 || !isFinite(t)
              ? t
              : (t > 0 ? 1 : -1) * Math.floor(Math.abs(t));
          },
          r = Math.pow(2, 53) - 1,
          u = function (n) {
            var t = i(n);
            return Math.min(Math.max(t, 0), r);
          };
        return function (t) {
          var h = this,
            c = Object(t),
            i,
            o;
          if (t == null)
            throw new TypeError(
              "Array.from requires an array-like object - not null or undefined"
            );
          if (
            ((i = arguments.length > 1 ? arguments[1] : void undefined),
            typeof i != "undefined")
          ) {
            if (!n(i))
              throw new TypeError(
                "Array.from: when provided, the second argument must be a function"
              );
            arguments.length > 2 && (o = arguments[2]);
          }
          for (
            var f = u(c.length),
              s = n(h) ? Object(new h(f)) : new Array(f),
              r = 0,
              e;
            r < f;

          )
            (e = c[r]),
              (s[r] = i
                ? typeof o == "undefined"
                  ? i(e, r)
                  : i.call(o, e, r)
                : e),
              (r += 1);
          return (s.length = f), s;
        };
      })()),
    Array.prototype.find ||
      Object.defineProperty(Array.prototype, "find", {
        value: function (n) {
          var i, u, f, t, r;
          if (this == null) throw TypeError('"this" is null or not defined');
          if (
            ((i = Object(this)), (u = i.length >>> 0), typeof n != "function")
          )
            throw TypeError("predicate must be a function");
          for (f = arguments[1], t = 0; t < u; ) {
            if (((r = i[t]), n.call(f, r, t, i))) return r;
            t++;
          }
          return undefined;
        },
        configurable: !0,
        writable: !0,
      }),
    Array.quickSort ||
      ((n = {
        swap: function (n, t, i) {
          var r = n[t];
          n[t] = n[i];
          n[i] = r;
        },
        partition: function (t, i, r, u, f) {
          var s = t[u],
            o,
            e;
          for (n.swap(t, u, r - 1), o = i, e = i; e < r - 1; ++e)
            (f ? f(t[e], s) <= 0 : t[e] <= s) && (n.swap(t, o, e), ++o);
          return n.swap(t, r - 1, o), o;
        },
        quick: function (t, i, r, u) {
          if (r - 1 > i) {
            var f = i + Math.floor(Math.random() * (r - i));
            f = n.partition(t, i, r, f, u);
            n.quick(t, i, f, u);
            n.quick(t, f + 1, r, u);
          }
        },
      }),
      (Array.quickSort = function (t, i) {
        n.quick(t, 0, t.length, i);
      })),
    String.prototype.padStart ||
      Object.defineProperty(String.prototype, "padStart", {
        configurable: !0,
        writable: !0,
        value: function (n, t) {
          return (
            (n = n >> 0),
            (t = String(typeof t != "undefined" ? t : " ")),
            this.length > n
              ? String(this)
              : ((n = n - this.length),
                n > t.length && (t += t.repeat(n / t.length)),
                t.slice(0, n) + String(this))
          );
        },
      }),
    (t = [
      /^\d{4}\-\d{2}\-\d{2}T\d\d\:\d\d/,
      /^(\d{4})\-(\d{2})\-(\d{2})(?:\s+|$)/,
      /(^.+ |^\s*)(\d+):(\d+)(:\d+)? ?(?:(am)|(pm))\s*$/i,
      /(^.+ |^\s*)(\d+):(\d+)(?:(\d+)(\.\d+)?)?\s*$/,
    ]),
    Date.parse2 ||
      (Date.parse2 = function (n) {
        var i, u, r, f;
        if (n) {
          if (n instanceof Date) return n;
        } else return null;
        if (typeof n != "string") i = new Date(n);
        else {
          for (u = 0; u < t.length; u++)
            if (((r = t[u].exec(n)), r)) {
              if (u === 0) break;
              else if (u === 1) i = new Date(+r[1], +r[2] - 1, +r[3]);
              else if (u === 2) {
                if (((i = new Date(r[1] || new Date())), isNaN(i))) return null;
                f = +r[2];
                r[5] && f === 12
                  ? i.setHours(0)
                  : r[6] && f < 12
                  ? i.setHours(f + 12)
                  : i.setHours(f);
                i.setMinutes(+r[3]);
                r[4] ? i.setSeconds(+r[4].substr(1)) : i.setSeconds(0);
                i.setMilliseconds(0);
              } else if (u === 3) {
                if (((i = new Date(r[1] || new Date())), isNaN(i))) return null;
                i.setHours(+r[2]);
                i.setMinutes(+r[3]);
                i.setSeconds(+r[4] || 0);
                i.setMilliseconds((+r[5] || 0) * 1e3);
              }
            } else continue;
          i || (i = new Date(Date.parse(n)));
        }
        return i && !isNaN(i) ? i : null;
      }),
    (i = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]),
    (r = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]),
    (Date.prototype.formatted = function (n) {
      var e = new Date(this);
      e.setMinutes(e.getMinutes() - e.getTimezoneOffset());
      var o,
        t = e.toJSON(),
        l = t.slice(0, 4),
        s = t.slice(5, 7),
        h = t.slice(8, 10),
        u = t.slice(11, 13),
        f = +u,
        a = t.slice(14, 16),
        v = t.slice(17, 19),
        c = t.slice(20, 23),
        y = this.getDay();
      return (n || "M/d/yyyy").replace(
        /\\.|y{2,4}|M{1,4}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|t{1,2}|T{1,2}|f{1,3}|rr|RR|ZZZ/g,
        function (n) {
          switch (n) {
            case "yy":
              return l.slice(2, 4);
            case "yyyy":
              return l;
            case "M":
              return +s;
            case "MM":
              return s;
            case "MMM":
              return r[+s - 1].slice(0, 3);
            case "MMMM":
              return r[+s - 1];
            case "d":
              return +h;
            case "dd":
              return h;
            case "ddd":
              return i[y].slice(0, 3);
            case "dddd":
              return i[y];
            case "H":
              return +u;
            case "HH":
              return u;
            case "h":
              return f === 0 ? 12 : f > 12 ? f - 12 : f;
            case "hh":
              return f < 10 ? "0" + f : f;
            case "m":
              return +a;
            case "mm":
              return a;
            case "s":
              return +v;
            case "ss":
              return v;
            case "t":
              return u > 11 ? "p" : "a";
            case "tt":
              return u > 11 ? "pm" : "am";
            case "T":
              return u > 11 ? "P" : "A";
            case "TT":
              return u > 11 ? "PM" : "AM";
            case "f":
              return c.slice(0, 1);
            case "ff":
              return c.slice(0, 2);
            case "fff":
              return c;
            case "rr":
            case "RR":
              o = n === "RR";
              switch (h) {
                case 1:
                case 21:
                case 31:
                  return o ? "ST" : "st";
                case 2:
                case 22:
                  return o ? "ND" : "nd";
                case 3:
                case 23:
                  return o ? "RD" : "rd";
                default:
                  return o ? "TH" : "th";
              }
              break;
            case "ZZZ":
              return Date.timeZoneAbbreviation
                ? Date.timeZoneAbbreviation(e)
                : "";
            default:
              return n[0] === "\\" ? n[1] : n;
          }
        }
      );
    }),
    (Date.timeZoneAbbreviation = function (n) {
      var u = jstz.date_is_dst(n),
        t = u ? "DT" : "ST",
        i = /_tz=([^;]+);/.exec(String(document.cookie)),
        r = i && decodeURIComponent(i[1]),
        f = r && jstz.olson.friendly[r];
      switch (f) {
        case "Hawaiian Standard Time":
          return "H" + t;
        case "Alaskan Standard Time":
          return "A" + t;
        case "Pacific Standard Time":
          return "P" + t;
        case "Mountain Standard Time":
          return "M" + t;
        case "Central Standard Time":
          return "C" + t;
        case "Eastern Standard Time":
          return "E" + t;
        case "W. Australia Standard Time":
          return "AW" + t;
        case "Cen. Australia Standard Time":
        case "AUS Central Standard Time":
          return "AC" + t;
        case "AUS Eastern Standard Time":
        case "E. Australia Standard Time":
          return "AE" + t;
        case "Central Pacific Standard Time":
          return "CP" + t;
        case "New Zealand Standard Time":
          return "NZ" + t;
        case "GMT Standard Time":
          return "GMT";
        case "Central Europe Standard Time":
          return t == "DT" ? "CEST" : "CET";
        default:
          return "";
      }
    }),
    window.NodeList &&
      !NodeList.prototype.forEach &&
      (NodeList.prototype.forEach = function (n, t) {
        t = t || window;
        for (var i = 0; i < this.length; i++) n.call(t, this[i], i, this);
      }),
    window.HTMLCollection &&
      !HTMLCollection.prototype.forEach &&
      (HTMLCollection.prototype.forEach = function (n, t) {
        t = t || window;
        for (var i = 0; i < this.length; i++) n.call(t, this[i], i, this);
      }),
    window.NodeList &&
      !NodeList.prototype.contains &&
      (NodeList.prototype.contains = function (n) {
        return Array.prototype.indexOf.call(this, n) >= 0;
      }),
    window.HTMLCollection &&
      !HTMLCollection.prototype.contains &&
      (HTMLCollection.prototype.contains = function (n) {
        return Array.prototype.indexOf.call(this, n) >= 0;
      }),
    (function (n) {
      n.forEach(function (n) {
        n.hasOwnProperty("remove") ||
          Object.defineProperty(n, "remove", {
            configurable: !0,
            enumerable: !0,
            writable: !0,
            value: function () {
              this.parentNode !== null && this.parentNode.removeChild(this);
            },
          });
      });
    })([Element.prototype, CharacterData.prototype, DocumentType.prototype]),
    Element.prototype.trigger ||
      (Element.prototype.trigger = function (n, t) {
        var i = { bubbles: !0, cancelable: !0 };
        return (
          t && (i.detail = t), this.dispatchEvent(new window.CustomEvent(n, i))
        );
      }),
    Window.prototype.trigger ||
      (Window.prototype.trigger = function (n, t) {
        var i = {};
        return (
          t && (i.detail = t), this.dispatchEvent(new window.CustomEvent(n, i))
        );
      }),
    Element.prototype.closest ||
      (Element.prototype.closest = function (n) {
        var t = this,
          i = t.ownerDocument || document;
        if (!i.documentElement.contains(t)) return null;
        do {
          if (t.matches) {
            if (t.matches(n)) return t;
          } else return null;
          t = t.parentElement || t.parentNode;
        } while (t);
        return null;
      }),
    Element.prototype.nextUntil ||
      (Element.prototype.nextUntil = function (n) {
        var t = this,
          r = t.ownerDocument || document,
          i = [];
        if (!r.documentElement.contains(t)) return null;
        t = t.nextElementSibling;
        do {
          if (t.matches) {
            if (t.matches(n)) break;
          } else return null;
          i.push(t);
          t = t.nextElementSibling;
        } while (t);
        return i;
      }),
    Element.prototype.index ||
      (Element.prototype.index = function () {
        var n = this,
          t = n.ownerDocument || document;
        return t.documentElement.contains(n)
          ? Array.from(n.parentElement.children).indexOf(n)
          : null;
      }),
    !window.JSON2)
  ) {
    const i = /^\d{4}\-\d{2}\-\d{2}T\d\d\:\d\d/,
      n = window.JSON.parse;
    function t(n, t) {
      if (i.test(t)) {
        const n = new Date(t);
        return isNaN(n) ? t : n;
      }
      return t;
    }
    window.JSON2 = {
      parse: function (i, r) {
        return n(i, r || t);
      },
      tryparse: function (i, r) {
        try {
          return n(i, r || t);
        } catch (u) {
          return null;
        }
      },
    };
  }
  JSON2.parse || (JSON2.parse = JSON.parse);
  JSON2.tryparse ||
    (JSON2.tryparse = function (n) {
      try {
        return JSON2.parse(n);
      } catch (t) {
        return null;
      }
    });
  !HTMLElement.prototype.matches &&
    HTMLElement.prototype.msMatchesSelector &&
    (HTMLElement.prototype.matches = HTMLElement.prototype.msMatchesSelector);
  Date &&
    (Date.prototype.addMinutes ||
      (Date.prototype.addMinutes = function (n) {
        return !n || isNaN((n = +n)) ? this : new Date(+this + 6e4 * n);
      }),
    Date.prototype.roundTime ||
      (Date.prototype.roundTime = function (n) {
        if (!n || isNaN((n = +n))) return this;
        let i = this.getHours(),
          r = this.getMinutes(),
          u = i * 60 + r,
          t = Math.floor(u / n) * n;
        return (
          this.setHours(Math.floor(t / 60)),
          this.setMinutes(t % 60),
          this.setSeconds(0),
          this
        );
      }));
  window.register && window.register("usc/p/poly");
})();
(function () {
  function s(n) {
    for (
      var r,
        f,
        e,
        u,
        o = {},
        i = n.querySelectorAll("input[type='checkbox'][data-required]"),
        t = 0;
      t < i.length;
      t++
    )
      (r = i[t].getAttribute("name")), (o[r] = 1);
    for (f = [], e = Object.keys(o), t = 0; t < e.length; t++) {
      var r = e[t],
        i = n.querySelectorAll(
          "input[type='checkbox'][data-required][name='" + r + "']"
        ),
        s = !1;
      for (u = 0; u < i.length; u++)
        if (i[u].checked) {
          s = !0;
          break;
        }
      f.push({ name: r, inputs: i, checked: s });
    }
    return f;
  }
  function c(n) {
    var t;
    if (n === "true") return !0;
    if (n === "false") return !1;
    if (n === "null") return null;
    if (isNaN((t = +n)) || n !== String(t)) {
      if (f.test(n))
        try {
          return o(n);
        } catch (i) {}
    } else return t;
    return n;
  }
  function e(n, t) {
    var i = !1,
      r;
    if (((t = c(t)), t === "*")) i = !!n;
    else if (typeof t == "boolean") {
      if (n) {
        if (typeof n != "boolean")
          switch (("" + n).toUpperCase()) {
            case "1":
            case "YES":
            case "ON":
            case "TRUE":
            case "SUCCESS":
              n = !0;
              break;
            default:
              n = !1;
          }
      } else n = !1;
      i = t === n;
    } else if (typeof t == "number") i = t === +n;
    else if (t)
      if (Array.isArray(t)) {
        for (r = 0; r < t.length; r++)
          if (t[r] == n) {
            i = !0;
            break;
          }
      } else i = t == n;
    else i = !n;
    return i;
  }
  var o = function (n, t) {
      return (window.JSON2 || JSON).parse(n, t);
    },
    i,
    r,
    f,
    t,
    n;
  if (
    (Element.prototype.getValue ||
      (Element.prototype.getValue = function () {
        var n,
          i,
          r = this.getAttribute("type"),
          t;
        if (r === "checkbox" || r === "radio")
          return this.checked ? this.value : null;
        if (this.value === undefined || this.matches("li")) {
          if (
            ((n = this.querySelectorAll(
              "input[type='checkbox'],input[type='radio']"
            )),
            n.length === 0)
          )
            return undefined;
          for (i = [], t = 0; t < n.length; t++)
            n[t].checked && i.push(n[t].value);
          return i.join(",");
        }
        return this.value;
      }),
    Element.prototype.setValue ||
      (Element.prototype.setValue = function (n) {
        var t,
          f,
          i,
          e,
          o,
          h,
          s,
          c = this.getAttribute("type"),
          r,
          u;
        switch (c) {
          case "checkbox":
          case "radio":
            this.checked = !!n;
            return;
          case "date":
            t = "yyyy-MM-dd";
            break;
          case "time":
            t = "HH:mm";
            break;
          case "datetime":
            t = "o";
            break;
          case "datetime-local":
            t = "yyyy-MM-dd\\THH:mm";
        }
        if (t)
          (f = Date.parse2(n)), (this.value = f ? f.formatted(t) : n || "");
        else if (this.value === undefined || this.matches("li")) {
          if (
            ((i = this.querySelectorAll(
              "input[type='checkbox'],input[type='radio']"
            )),
            i.length)
          )
            e = Array.isArray(n)
              ? n
              : typeof n == "string"
              ? n.split(",")
              : [n];
          else return;
          for (r = 0; r < i.length; r++) {
            for (o = i[r], h = o.value, s = !1, u = 0; u < e.length; u++)
              if (h == e[u]) {
                s = !0;
                break;
              }
            o.checked = s;
          }
        } else this.value = n || "";
      }),
    ValidityState.prototype.getType ||
      (ValidityState.prototype.getType = function () {
        if (this.valid) return "valid";
        if (this.valueMissing) return "valueMissing";
        for (var n in this) if (this[n] === !0) return n;
      }),
    HTMLInputElement.prototype.getLabel ||
      (HTMLInputElement.prototype.getLabel = function () {
        var n,
          r,
          t = this.getAttribute("data-label"),
          i;
        if (!t)
          for (
            n = this.labels,
              (n && n.length) ||
                ((r = this.closest("form") || this.ownerDocument),
                (n = r.querySelectorAll(
                  "label[for='" + this.getAttribute("id") + "']"
                ))),
              i = 0;
            i < n.length;
            i++
          )
            if (((t = (n[i].textContent || "").trim()), t)) break;
        return t;
      }),
    HTMLFormElement.prototype._checkValidity ||
      ((HTMLFormElement.prototype._checkValidity =
        HTMLFormElement.prototype.checkValidity),
      (HTMLFormElement.prototype.checkValidity = function (n) {
        for (var u, f, i, r, e, o = s(this), t = 0; t < o.length; t++)
          for (u = o[t], f = 0; f < u.inputs.length; f++)
            (i = u.inputs[f]),
              i.checked || !u.checked
                ? ((i.required = !0), i.setAttribute("required", "required"))
                : ((i.required = !1), i.removeAttribute("required"));
        for (
          r = this.querySelectorAll("input,select,textarea"),
            e = !0,
            n && (n.inputs = r),
            t = 0;
          t < r.length;
          t++
        )
          r[t].checkValidity() || (n && !n.first && (n.first = r[t]), (e = !1));
        return (
          this._checkValidity && this._checkValidity.apply(this, arguments), e
        );
      })),
    HTMLFormElement.prototype._reportValidity ||
      ((HTMLFormElement.prototype._reportValidity =
        HTMLFormElement.prototype.reportValidity),
      (HTMLFormElement.prototype.reportValidity = function () {
        var n = {},
          i = this.checkValidity(n);
        if (i) return i;
        if (n && n.first && window.USC && window.USC.setTabs) {
          var t = n.first.closest(".ui-tab-panel[data-tab]"),
            r = t && t.getAttribute("data-tab"),
            u = r && t.parentElement.closest(".ui-tabs");
          u && !t.offsetHeight && USC.setTabs(u, r);
        }
        if (
          (n &&
            n.first &&
            window.USC &&
            window.USC.setTabbableActive &&
            USC.setTabbableActive(n.first),
          this._reportValidity && this._reportValidity.apply(this, arguments),
          n && n.first)
        ) {
          var f = n.first.validity.getType(),
            e = n.first.closest("[data-validity]") || n.first.closest("li"),
            o =
              e &&
              e.querySelector(
                "[data-validity='" + f + "'],[data-type='" + f + "']"
              );
          if (o)
            try {
              n.first.focus();
            } catch (s) {}
        }
        return i;
      })),
    HTMLFormElement.prototype._reset ||
      ((HTMLFormElement.prototype._reset = HTMLFormElement.prototype.reset),
      (HTMLFormElement.prototype.reset = function () {
        for (
          var n,
            i = this.querySelectorAll(".invalid,.valid,li[data-validity]"),
            t = 0;
          t < i.length;
          t++
        )
          (n = i[t]),
            n.classList.remove("invalid"),
            n.classList.remove("valid"),
            n.getAttribute("data-validity") &&
              n.setAttribute("data-validity", "");
        this._reset && this._reset();
      })),
    (i =
      "button,input[type='submit'],input[type='button'],input[type='image']"),
    typeof SubmitEvent == "undefined" &&
      ((r = null),
      document.addEventListener(
        "click",
        function (n) {
          n.target.closest && (r = n.target.closest(i));
        },
        !0
      ),
      document.addEventListener(
        "submit",
        function (n) {
          var f, u, t;
          if (!n.submitter) {
            for (f = [document.activeElement, r], u = 0; u < f.length; u++)
              if (((t = f[u]), t) && t.form && t.matches(i)) {
                n.submitter = t;
                return;
              }
            n.submitter = n.target.querySelector(i);
          }
        },
        !0
      )),
    !HTMLFormElement.prototype.requestSubmit)
  ) {
    if (typeof HTMLFormElement.prototype.requestSubmit == "function") return;
    HTMLFormElement.prototype.requestSubmit = function (n) {
      n
        ? (h(n, this), n.click())
        : ((n = document.createElement("input")),
          (n.type = "submit"),
          (n.hidden = !0),
          this.appendChild(n),
          n.click(),
          this.removeChild(n));
    };
    function h(n, t) {
      n instanceof HTMLElement ||
        u(TypeError, "parameter 1 is not of type 'HTMLElement'");
      n.type == "submit" ||
        u(TypeError, "The specified element is not a submit button");
      n.form == t ||
        u(
          DOMException,
          "The specified element is not owned by this form element",
          "NotFoundError"
        );
    }
    function u(n, t, i) {
      throw new n(
        "Failed to execute 'requestSubmit' on 'HTMLFormElement': " + t + ".",
        i
      );
    }
  }
  for (
    f = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      t = [
        HTMLInputElement.prototype,
        HTMLSelectElement.prototype,
        HTMLTextAreaElement.prototype,
      ],
      n = 0;
    n < t.length;
    n++
  )
    t[n]._checkValidity ||
      ((t[n]._checkValidity = t[n].checkValidity),
      (t[n].checkValidity = function () {
        var n = this.getAttribute("data-conditional"),
          t;
        if (n) {
          try {
            n = this.ownerDocument.getElementById(n);
          } catch (f) {
            n = null;
          }
          if (n) {
            var i = n.getValue(),
              r = this.getAttribute("data-conditional-value"),
              u = this.getAttribute("data-conditional-not-value");
            r !== null && e(i, r)
              ? (this.setAttribute("required", "required"),
                (this.required = !0))
              : u === null || e(i, u)
              ? (this.removeAttribute("required"), (this.required = !1))
              : (this.setAttribute("required", "required"),
                (this.required = !0));
          }
        }
        if (!this.validity.valueMissing) {
          t = this.getAttribute("data-compare");
          try {
            t = this.ownerDocument.getElementById(t);
          } catch (f) {
            t = null;
          }
          t &&
            this.value != t.value &&
            this.setCustomValidity("Value doesn't match.");
        }
        return this._checkValidity.apply(this, arguments);
      }));
  window.register && window.register("usc/p/form-proto");
})();
window.USC || (window.USC = {}),
  (function () {
    var n = function (n, t) {
      return (window.JSON2 || JSON).parse(n, t);
    };
    USC.setTabs = function (n, t) {
      var i, f;
      if (n && n.querySelectorAll) {
        !t &&
          n.classList.contains("ui-tab") &&
          ((t = n.getAttribute("data-tab")), (n = n.closest(".ui-tabs")));
        t &&
          t.getAttribute &&
          ((i = t), (t = i.getAttribute("data-tab") || ""));
        var u = Array.from(n.querySelectorAll(".ui-tab")),
          h = u.find(function (n) {
            return (
              n.getAttribute("data-tab") === t && n.matches(".ui-toggle.active")
            );
          }),
          e = Array.from(n.querySelectorAll(".ui-tab-panel")),
          o = Array.from(n.querySelectorAll(".ui-tabs")),
          r = !h,
          c = function (n) {
            for (var i, t = 0; t < o.length; t++)
              if (((i = o[t]), i === n)) continue;
              else if (i.contains(n)) return !0;
          },
          s = function (n) {
            if (!c(n)) {
              var u;
              i && n === i
                ? (u = r)
                : t && n.getAttribute("data-tab") === t
                ? ((u = r), (i = n))
                : t === "*" &&
                  n.classList.contains("ui-tab-panel") &&
                  ((u = r), (i = ""));
              n.classList[u ? "add" : "remove"]("active");
            }
          };
        return (
          u.forEach(s),
          e.forEach(s),
          r
            ? n.setAttribute("data-activetab", t || "")
            : n.removeAttribute("data-activetab"),
          (f = { name: t, tabs: u, panels: e }),
          n.trigger && n.trigger("tabbed", f),
          window.trigger("resize"),
          f
        );
      }
    };
    USC.setConditionals = function (n) {
      var t, u, i, r, f;
      if (n && n.querySelectorAll && ((t = USC.getConditionalPanels(n)), t)) {
        for (u = USC.getConditionalValue(n), i = 0; i < t.length; i++)
          (r = t[i]),
            (f = USC.checkConditionalPanel(r, u)),
            f ? r.classList.add("active") : r.classList.remove("active");
        return window.trigger("resize"), { name: name, input: n, panels: t };
      }
    };
    USC.getConditionalValue = function (n) {
      return n.getValue();
    };
    USC.getConditionalPanels = function (n) {
      var i = n.closest(".ui-conditionals"),
        r = n.getAttribute("data-name"),
        t;
      if (i) {
        if (!r) {
          console.warn("Missing data-name attribute for ui-conditionals.", n);
          return;
        }
      } else {
        console.warn("Missing ui-conditionals scope.", n);
        return;
      }
      return (
        (t = i.querySelectorAll(
          ".ui-conditional-panel[data-name='" + r + "']"
        )),
        t.length > 0 ? t : null
      );
    };
    USC.checkConditionalPanel = function (n, t) {
      var r = n.getAttribute("data-value"),
        u = n.getAttribute("data-notvalue"),
        f = n.getAttribute("data-hasvalue"),
        i;
      if (f !== null) {
        if (!t) return !1;
        t = t.split(",");
        i = t && t.indexOf(f) > -1;
      } else
        u !== null
          ? (i = !USC.matching(t, u))
          : r !== null && (i = USC.matching(t, r));
      return i;
    };
    USC.matching = function (t, i) {
      if (i === "*") return !!t;
      if (t === "*") return !0;
      if (i) {
        if (i.charAt(0) === "[" && i.charAt(i.length - 1) === "]") {
          i = n(i);
          for (var r = 0; r < i.length; r++) if (i[r] == t) return !0;
          return !1;
        }
        return i == t;
      }
      return !t;
    };
    window.register && window.register("usc/p/behaviors");
  })();
window.USC || (window.USC = {});
require2(
  ["usc/p/poly", "usc/p/form-proto", "usc/p/behaviors", "usc/p/utils"],
  function () {
    function i(n) {
      var i, u, f;
      if (
        (n.target.classList.contains("ui-conditional") &&
          (USC.setConditionals(n.target), n.stopPropagation()),
        n.detail && n.detail.originalEvent && (n = n.detail.originalEvent),
        n.target && n.target.validity)
      )
        n.target.validity.customError && n.target.setCustomValidity("");
      else return;
      if (n.target.matches("input[type='checkbox'][data-required]")) {
        var o = n.target.getAttribute("name"),
          r = this.form.querySelectorAll(
            "input[type='checkbox'][data-required][name='" + o + "']"
          ),
          e = !1;
        for (i = 0; i < r.length; i++)
          if (r[i].checked) {
            e = !0;
            break;
          }
        for (i = 0; i < r.length; i++)
          (u = r[i]),
            !e || u.checked
              ? ((u.required = !0), u.setAttribute("required", "required"))
              : ((u.required = !1), u.removeAttribute("required"));
      }
      f = t(n.target);
      n.target.value ? f.classList.add("filled") : f.classList.remove("filled");
      n.target.checkValidity &&
        n.target.checkValidity() &&
        (r && r.length
          ? r.forEach(function (n) {
              n.trigger("invalid");
            })
          : n.target.trigger("invalid"));
    }
    function r(n) {
      var r, i, u;
      if (n.target !== this.form && ((r = n.target.validity), r)) {
        if (((i = t(n.target)), r.valid)) {
          i.classList.remove("invalid");
          i.getAttribute("data-validity") !== null &&
            (i.classList.add("valid"),
            i.setAttribute("data-validity", "valid"));
          return;
        }
        return (
          (u = r.getType()),
          i.classList.remove("valid"),
          i.classList.add("invalid"),
          i.setAttribute("data-validity", u || ""),
          i.querySelector(
            "[data-validity='" + u + "'],.validation[data-type='" + u + "']"
          )
            ? (n.preventDefault(), !1)
            : void 0
        );
      }
    }
    function u(n) {
      if (
        this.$last &&
        !this.$last.attributes.formnovalidate &&
        !this.form.checkValidity()
      )
        return this.form.reportValidity(), n.preventDefault(), !1;
      if (!this.$last || !this.$last.attributes["data-noloading"]) {
        this.form.classList.add("loading");
        var t = this.form.querySelectorAll(USC.BUTTONS_SELECTOR);
        setTimeout(function () {
          for (var i, n = 0; n < t.length; n++)
            (i = t[n]),
              i.setAttribute("disabled", "disabled"),
              (i.disabled = !0);
        }, 1);
      }
    }
    function f(n) {
      this.$last = n.target.closest(USC.BUTTONS_SELECTOR);
      this.$last && this.$ffd6 && (this.$ffd6.value = new Date().getTime());
      !this.$last ||
        this.$last.attributes.formnovalidate ||
        this.form.reportValidity() ||
        n.preventDefault();
    }
    function n(n) {
      if (n.target && n.target.matches("input, label, textarea, select")) {
        var t =
          n.target.closest("li") || n.target.closest(".input-text") || n.target;
        n.type === "focusin"
          ? t.classList.add("focused")
          : t.classList.remove("focused");
      }
    }
    function t(n) {
      var t = n.closest(".input-suggest");
      return t && (n = t), n.closest("[data-validity]") || n.closest("li") || n;
    }
    function e(t) {
      this.form = t;
      t.addEventListener("change", i.bind(this));
      t.addEventListener("invalid", r.bind(this), !0);
      t.addEventListener("submit", u.bind(this));
      t.addEventListener("click", f.bind(this));
      t.addEventListener("focusin", n.bind(this));
      t.addEventListener("focusout", n.bind(this));
      var e = t.querySelector("input[id$='_FFD6']");
      e && ((e.value = new Date().getTime()), (this.$ffd6 = e));
    }
    USC.BUTTONS_SELECTOR =
      "button[type='submit'],input[type='submit'],input[type='image']";
    window.USC.form = function (n) {
      if (n instanceof HTMLFormElement) {
        if (n.$form) {
          console.warn("FormControl already initialized.");
          return;
        }
        n.$form = new e(n);
      } else
        throw new Error("Need an HTMLFormElement to initialize a FormControl.");
    };
    window.register && window.register("usc/p/form");
  }
);
require2("usc/p/form", function () {
  USC.form(document.getElementById("Form_ContactSystemV1"));
});

