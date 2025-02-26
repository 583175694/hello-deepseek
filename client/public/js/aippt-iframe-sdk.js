!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e =
        "undefined" != typeof globalThis ? globalThis : e || self).AipptIframe =
        t());
})(this, function () {
  "use strict";
  var e = Object.defineProperty,
    t = (t, r, n) => (
      ((t, r, n) => {
        r in t
          ? e(t, r, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: n,
            })
          : (t[r] = n);
      })(t, "symbol" != typeof r ? r + "" : r, n),
      n
    ),
    r =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : {};
  function n(e) {
    return e &&
      e.__esModule &&
      Object.prototype.hasOwnProperty.call(e, "default")
      ? e.default
      : e;
  }
  function i(e, t, r) {
    return (
      (t = y(t)),
      (function (e, t) {
        if (t && ("object" == typeof t || "function" == typeof t)) return t;
        if (void 0 !== t)
          throw new TypeError(
            "Derived constructors may only return object or undefined"
          );
        return (function (e) {
          if (void 0 === e)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return e;
        })(e);
      })(
        e,
        o() ? Reflect.construct(t, r || [], y(e).constructor) : t.apply(e, r)
      )
    );
  }
  function o() {
    try {
      var e = !Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {})
      );
    } catch (t) {}
    return (o = function () {
      return !!e;
    })();
  }
  function a(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(e);
      t &&
        (n = n.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, n);
    }
    return r;
  }
  function u(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? a(Object(r), !0).forEach(function (t) {
            g(e, t, r[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : a(Object(r)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
          });
    }
    return e;
  }
  function c() {
    c = function () {
      return t;
    };
    var e,
      t = {},
      r = Object.prototype,
      n = r.hasOwnProperty,
      i =
        Object.defineProperty ||
        function (e, t, r) {
          e[t] = r.value;
        },
      o = "function" == typeof Symbol ? Symbol : {},
      a = o.iterator || "@@iterator",
      u = o.asyncIterator || "@@asyncIterator",
      s = o.toStringTag || "@@toStringTag";
    function f(e, t, r) {
      return (
        Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        }),
        e[t]
      );
    }
    try {
      f({}, "");
    } catch (j) {
      f = function (e, t, r) {
        return (e[t] = r);
      };
    }
    function l(e, t, r, n) {
      var o = t && t.prototype instanceof m ? t : m,
        a = Object.create(o.prototype),
        u = new P(n || []);
      return i(a, "_invoke", { value: T(e, r, u) }), a;
    }
    function h(e, t, r) {
      try {
        return { type: "normal", arg: e.call(t, r) };
      } catch (n) {
        return { type: "throw", arg: n };
      }
    }
    t.wrap = l;
    var p = "suspendedStart",
      d = "suspendedYield",
      v = "executing",
      g = "completed",
      y = {};
    function m() {}
    function b() {}
    function w() {}
    var E = {};
    f(E, a, function () {
      return this;
    });
    var x = Object.getPrototypeOf,
      S = x && x(x(F([])));
    S && S !== r && n.call(S, a) && (E = S);
    var A = (w.prototype = m.prototype = Object.create(E));
    function O(e) {
      ["next", "throw", "return"].forEach(function (t) {
        f(e, t, function (e) {
          return this._invoke(t, e);
        });
      });
    }
    function k(e, t) {
      function r(i, o, a, u) {
        var c = h(e[i], e, o);
        if ("throw" !== c.type) {
          var s = c.arg,
            f = s.value;
          return f && "object" == typeof f && n.call(f, "__await")
            ? t.resolve(f.__await).then(
                function (e) {
                  r("next", e, a, u);
                },
                function (e) {
                  r("throw", e, a, u);
                }
              )
            : t.resolve(f).then(
                function (e) {
                  (s.value = e), a(s);
                },
                function (e) {
                  return r("throw", e, a, u);
                }
              );
        }
        u(c.arg);
      }
      var o;
      i(this, "_invoke", {
        value: function (e, n) {
          function i() {
            return new t(function (t, i) {
              r(e, n, t, i);
            });
          }
          return (o = o ? o.then(i, i) : i());
        },
      });
    }
    function T(t, r, n) {
      var i = p;
      return function (o, a) {
        if (i === v) throw Error("Generator is already running");
        if (i === g) {
          if ("throw" === o) throw a;
          return { value: e, done: !0 };
        }
        for (n.method = o, n.arg = a; ; ) {
          var u = n.delegate;
          if (u) {
            var c = R(u, n);
            if (c) {
              if (c === y) continue;
              return c;
            }
          }
          if ("next" === n.method) n.sent = n._sent = n.arg;
          else if ("throw" === n.method) {
            if (i === p) throw ((i = g), n.arg);
            n.dispatchException(n.arg);
          } else "return" === n.method && n.abrupt("return", n.arg);
          i = v;
          var s = h(t, r, n);
          if ("normal" === s.type) {
            if (((i = n.done ? g : d), s.arg === y)) continue;
            return { value: s.arg, done: n.done };
          }
          "throw" === s.type &&
            ((i = g), (n.method = "throw"), (n.arg = s.arg));
        }
      };
    }
    function R(t, r) {
      var n = r.method,
        i = t.iterator[n];
      if (i === e)
        return (
          (r.delegate = null),
          ("throw" === n &&
            t.iterator.return &&
            ((r.method = "return"),
            (r.arg = e),
            R(t, r),
            "throw" === r.method)) ||
            ("return" !== n &&
              ((r.method = "throw"),
              (r.arg = new TypeError(
                "The iterator does not provide a '" + n + "' method"
              )))),
          y
        );
      var o = h(i, t.iterator, r.arg);
      if ("throw" === o.type)
        return (r.method = "throw"), (r.arg = o.arg), (r.delegate = null), y;
      var a = o.arg;
      return a
        ? a.done
          ? ((r[t.resultName] = a.value),
            (r.next = t.nextLoc),
            "return" !== r.method && ((r.method = "next"), (r.arg = e)),
            (r.delegate = null),
            y)
          : a
        : ((r.method = "throw"),
          (r.arg = new TypeError("iterator result is not an object")),
          (r.delegate = null),
          y);
    }
    function I(e) {
      var t = { tryLoc: e[0] };
      1 in e && (t.catchLoc = e[1]),
        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
        this.tryEntries.push(t);
    }
    function _(e) {
      var t = e.completion || {};
      (t.type = "normal"), delete t.arg, (e.completion = t);
    }
    function P(e) {
      (this.tryEntries = [{ tryLoc: "root" }]),
        e.forEach(I, this),
        this.reset(!0);
    }
    function F(t) {
      if (t || "" === t) {
        var r = t[a];
        if (r) return r.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var i = -1,
            o = function r() {
              for (; ++i < t.length; )
                if (n.call(t, i)) return (r.value = t[i]), (r.done = !1), r;
              return (r.value = e), (r.done = !0), r;
            };
          return (o.next = o);
        }
      }
      throw new TypeError(typeof t + " is not iterable");
    }
    return (
      (b.prototype = w),
      i(A, "constructor", { value: w, configurable: !0 }),
      i(w, "constructor", { value: b, configurable: !0 }),
      (b.displayName = f(w, s, "GeneratorFunction")),
      (t.isGeneratorFunction = function (e) {
        var t = "function" == typeof e && e.constructor;
        return (
          !!t && (t === b || "GeneratorFunction" === (t.displayName || t.name))
        );
      }),
      (t.mark = function (e) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, w)
            : ((e.__proto__ = w), f(e, s, "GeneratorFunction")),
          (e.prototype = Object.create(A)),
          e
        );
      }),
      (t.awrap = function (e) {
        return { __await: e };
      }),
      O(k.prototype),
      f(k.prototype, u, function () {
        return this;
      }),
      (t.AsyncIterator = k),
      (t.async = function (e, r, n, i, o) {
        void 0 === o && (o = Promise);
        var a = new k(l(e, r, n, i), o);
        return t.isGeneratorFunction(r)
          ? a
          : a.next().then(function (e) {
              return e.done ? e.value : a.next();
            });
      }),
      O(A),
      f(A, s, "Generator"),
      f(A, a, function () {
        return this;
      }),
      f(A, "toString", function () {
        return "[object Generator]";
      }),
      (t.keys = function (e) {
        var t = Object(e),
          r = [];
        for (var n in t) r.push(n);
        return (
          r.reverse(),
          function e() {
            for (; r.length; ) {
              var n = r.pop();
              if (n in t) return (e.value = n), (e.done = !1), e;
            }
            return (e.done = !0), e;
          }
        );
      }),
      (t.values = F),
      (P.prototype = {
        constructor: P,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = e),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = e),
            this.tryEntries.forEach(_),
            !t)
          )
            for (var r in this)
              "t" === r.charAt(0) &&
                n.call(this, r) &&
                !isNaN(+r.slice(1)) &&
                (this[r] = e);
        },
        stop: function () {
          this.done = !0;
          var e = this.tryEntries[0].completion;
          if ("throw" === e.type) throw e.arg;
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) throw t;
          var r = this;
          function i(n, i) {
            return (
              (u.type = "throw"),
              (u.arg = t),
              (r.next = n),
              i && ((r.method = "next"), (r.arg = e)),
              !!i
            );
          }
          for (var o = this.tryEntries.length - 1; o >= 0; --o) {
            var a = this.tryEntries[o],
              u = a.completion;
            if ("root" === a.tryLoc) return i("end");
            if (a.tryLoc <= this.prev) {
              var c = n.call(a, "catchLoc"),
                s = n.call(a, "finallyLoc");
              if (c && s) {
                if (this.prev < a.catchLoc) return i(a.catchLoc, !0);
                if (this.prev < a.finallyLoc) return i(a.finallyLoc);
              } else if (c) {
                if (this.prev < a.catchLoc) return i(a.catchLoc, !0);
              } else {
                if (!s) throw Error("try statement without catch or finally");
                if (this.prev < a.finallyLoc) return i(a.finallyLoc);
              }
            }
          }
        },
        abrupt: function (e, t) {
          for (var r = this.tryEntries.length - 1; r >= 0; --r) {
            var i = this.tryEntries[r];
            if (
              i.tryLoc <= this.prev &&
              n.call(i, "finallyLoc") &&
              this.prev < i.finallyLoc
            ) {
              var o = i;
              break;
            }
          }
          o &&
            ("break" === e || "continue" === e) &&
            o.tryLoc <= t &&
            t <= o.finallyLoc &&
            (o = null);
          var a = o ? o.completion : {};
          return (
            (a.type = e),
            (a.arg = t),
            o
              ? ((this.method = "next"), (this.next = o.finallyLoc), y)
              : this.complete(a)
          );
        },
        complete: function (e, t) {
          if ("throw" === e.type) throw e.arg;
          return (
            "break" === e.type || "continue" === e.type
              ? (this.next = e.arg)
              : "return" === e.type
              ? ((this.rval = this.arg = e.arg),
                (this.method = "return"),
                (this.next = "end"))
              : "normal" === e.type && t && (this.next = t),
            y
          );
        },
        finish: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var r = this.tryEntries[t];
            if (r.finallyLoc === e)
              return this.complete(r.completion, r.afterLoc), _(r), y;
          }
        },
        catch: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var r = this.tryEntries[t];
            if (r.tryLoc === e) {
              var n = r.completion;
              if ("throw" === n.type) {
                var i = n.arg;
                _(r);
              }
              return i;
            }
          }
          throw Error("illegal catch attempt");
        },
        delegateYield: function (t, r, n) {
          return (
            (this.delegate = { iterator: F(t), resultName: r, nextLoc: n }),
            "next" === this.method && (this.arg = e),
            y
          );
        },
      }),
      t
    );
  }
  function s(e) {
    var t = (function (e, t) {
      if ("object" != typeof e || !e) return e;
      var r = e[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(e, t || "default");
        if ("object" != typeof n) return n;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === t ? String : Number)(e);
    })(e, "string");
    return "symbol" == typeof t ? t : t + "";
  }
  function f(e) {
    return (f =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              "function" == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? "symbol"
              : typeof e;
          })(e);
  }
  function l(e, t, r, n, i, o, a) {
    try {
      var u = e[o](a),
        c = u.value;
    } catch (s) {
      return void r(s);
    }
    u.done ? t(c) : Promise.resolve(c).then(n, i);
  }
  function h(e) {
    return function () {
      var t = this,
        r = arguments;
      return new Promise(function (n, i) {
        var o = e.apply(t, r);
        function a(e) {
          l(o, n, i, a, u, "next", e);
        }
        function u(e) {
          l(o, n, i, a, u, "throw", e);
        }
        a(void 0);
      });
    };
  }
  function p(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function d(e, t) {
    for (var r = 0; r < t.length; r++) {
      var n = t[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(e, s(n.key), n);
    }
  }
  function v(e, t, r) {
    return (
      t && d(e.prototype, t),
      r && d(e, r),
      Object.defineProperty(e, "prototype", { writable: !1 }),
      e
    );
  }
  function g(e, t, r) {
    return (
      (t = s(t)) in e
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  function y(e) {
    return (y = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (e) {
          return e.__proto__ || Object.getPrototypeOf(e);
        })(e);
  }
  function m(e, t) {
    return (m = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (e, t) {
          return (e.__proto__ = t), e;
        })(e, t);
  }
  function b(e) {
    var t = "function" == typeof Map ? new Map() : void 0;
    return (
      (b = function (e) {
        if (
          null === e ||
          !(function (e) {
            try {
              return -1 !== Function.toString.call(e).indexOf("[native code]");
            } catch (t) {
              return "function" == typeof e;
            }
          })(e)
        )
          return e;
        if ("function" != typeof e)
          throw new TypeError(
            "Super expression must either be null or a function"
          );
        if (void 0 !== t) {
          if (t.has(e)) return t.get(e);
          t.set(e, r);
        }
        function r() {
          return (function (e, t, r) {
            if (o()) return Reflect.construct.apply(null, arguments);
            var n = [null];
            n.push.apply(n, t);
            var i = new (e.bind.apply(e, n))();
            return r && m(i, r.prototype), i;
          })(e, arguments, y(this).constructor);
        }
        return (
          (r.prototype = Object.create(e.prototype, {
            constructor: {
              value: r,
              enumerable: !1,
              writable: !0,
              configurable: !0,
            },
          })),
          m(r, e)
        );
      }),
      b(e)
    );
  }
  function w(e, t) {
    return (
      S(e) ||
      (function (e, t) {
        var r =
          null == e
            ? null
            : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
              e["@@iterator"];
        if (null != r) {
          var n,
            i,
            o,
            a,
            u = [],
            c = !0,
            s = !1;
          try {
            if (((o = (r = r.call(e)).next), 0 === t)) {
              if (Object(r) !== r) return;
              c = !1;
            } else
              for (
                ;
                !(c = (n = o.call(r)).done) &&
                (u.push(n.value), u.length !== t);
                c = !0
              );
          } catch (f) {
            (s = !0), (i = f);
          } finally {
            try {
              if (!c && null != r.return && ((a = r.return()), Object(a) !== a))
                return;
            } finally {
              if (s) throw i;
            }
          }
          return u;
        }
      })(e, t) ||
      O(e, t) ||
      T()
    );
  }
  function E(e) {
    return S(e) || A(e) || O(e) || T();
  }
  function x(e) {
    return (
      (function (e) {
        if (Array.isArray(e)) return k(e);
      })(e) ||
      A(e) ||
      O(e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function S(e) {
    if (Array.isArray(e)) return e;
  }
  function A(e) {
    if (
      ("undefined" != typeof Symbol && null != e[Symbol.iterator]) ||
      null != e["@@iterator"]
    )
      return Array.from(e);
  }
  function O(e, t) {
    if (e) {
      if ("string" == typeof e) return k(e, t);
      var r = Object.prototype.toString.call(e).slice(8, -1);
      return (
        "Object" === r && e.constructor && (r = e.constructor.name),
        "Map" === r || "Set" === r
          ? Array.from(e)
          : "Arguments" === r ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)
          ? k(e, t)
          : void 0
      );
    }
  }
  function k(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, n = new Array(t); r < t; r++) n[r] = e[r];
    return n;
  }
  function T() {
    throw new TypeError(
      "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var R = function (e) {
      return e && e.Math === Math && e;
    },
    I =
      R(
        "object" ==
          ("undefined" == typeof globalThis ? "undefined" : f(globalThis)) &&
          globalThis
      ) ||
      R(
        "object" == ("undefined" == typeof window ? "undefined" : f(window)) &&
          window
      ) ||
      R(
        "object" == ("undefined" == typeof self ? "undefined" : f(self)) && self
      ) ||
      R("object" == f(r) && r) ||
      R("object" == f(r) && r) ||
      (function () {
        return this;
      })() ||
      Function("return this")(),
    _ = {},
    P = function (e) {
      try {
        return !!e();
      } catch (t) {
        return !0;
      }
    },
    F = !P(function () {
      return (
        7 !==
        Object.defineProperty({}, 1, {
          get: function () {
            return 7;
          },
        })[1]
      );
    }),
    j = !P(function () {
      var e = function () {}.bind();
      return "function" != typeof e || e.hasOwnProperty("prototype");
    }),
    C = j,
    L = Function.prototype.call,
    M = C
      ? L.bind(L)
      : function () {
          return L.apply(L, arguments);
        },
    D = {},
    N = {}.propertyIsEnumerable,
    U = Object.getOwnPropertyDescriptor,
    B = U && !N.call({ 1: 2 }, 1);
  D.f = B
    ? function (e) {
        var t = U(this, e);
        return !!t && t.enumerable;
      }
    : N;
  var z,
    H,
    W = function (e, t) {
      return {
        enumerable: !(1 & e),
        configurable: !(2 & e),
        writable: !(4 & e),
        value: t,
      };
    },
    q = j,
    V = Function.prototype,
    G = V.call,
    $ = q && V.bind.bind(G, G),
    Y = q
      ? $
      : function (e) {
          return function () {
            return G.apply(e, arguments);
          };
        },
    K = Y,
    J = K({}.toString),
    X = K("".slice),
    Q = function (e) {
      return X(J(e), 8, -1);
    },
    Z = P,
    ee = Q,
    te = Object,
    re = Y("".split),
    ne = Z(function () {
      return !te("z").propertyIsEnumerable(0);
    })
      ? function (e) {
          return "String" === ee(e) ? re(e, "") : te(e);
        }
      : te,
    ie = function (e) {
      return null == e;
    },
    oe = ie,
    ae = TypeError,
    ue = function (e) {
      if (oe(e)) throw new ae("Can't call method on " + e);
      return e;
    },
    ce = ne,
    se = ue,
    fe = function (e) {
      return ce(se(e));
    },
    le =
      "object" ==
        ("undefined" == typeof document ? "undefined" : f(document)) &&
      document.all,
    he =
      void 0 === le && void 0 !== le
        ? function (e) {
            return "function" == typeof e || e === le;
          }
        : function (e) {
            return "function" == typeof e;
          },
    pe = he,
    de = function (e) {
      return "object" == f(e) ? null !== e : pe(e);
    },
    ve = I,
    ge = he,
    ye = function (e, t) {
      return arguments.length < 2
        ? ((r = ve[e]), ge(r) ? r : void 0)
        : ve[e] && ve[e][t];
      var r;
    },
    me = Y({}.isPrototypeOf),
    be = I.navigator,
    we = be && be.userAgent,
    Ee = we ? String(we) : "",
    xe = I,
    Se = Ee,
    Ae = xe.process,
    Oe = xe.Deno,
    ke = (Ae && Ae.versions) || (Oe && Oe.version),
    Te = ke && ke.v8;
  Te && (H = (z = Te.split("."))[0] > 0 && z[0] < 4 ? 1 : +(z[0] + z[1])),
    !H &&
      Se &&
      (!(z = Se.match(/Edge\/(\d+)/)) || z[1] >= 74) &&
      (z = Se.match(/Chrome\/(\d+)/)) &&
      (H = +z[1]);
  var Re = H,
    Ie = Re,
    _e = P,
    Pe = I.String,
    Fe =
      !!Object.getOwnPropertySymbols &&
      !_e(function () {
        var e = Symbol("symbol detection");
        return (
          !Pe(e) ||
          !(Object(e) instanceof Symbol) ||
          (!Symbol.sham && Ie && Ie < 41)
        );
      }),
    je = Fe && !Symbol.sham && "symbol" == f(Symbol.iterator),
    Ce = ye,
    Le = he,
    Me = me,
    De = Object,
    Ne = je
      ? function (e) {
          return "symbol" == f(e);
        }
      : function (e) {
          var t = Ce("Symbol");
          return Le(t) && Me(t.prototype, De(e));
        },
    Ue = String,
    Be = function (e) {
      try {
        return Ue(e);
      } catch (t) {
        return "Object";
      }
    },
    ze = he,
    He = Be,
    We = TypeError,
    qe = function (e) {
      if (ze(e)) return e;
      throw new We(He(e) + " is not a function");
    },
    Ve = qe,
    Ge = ie,
    $e = function (e, t) {
      var r = e[t];
      return Ge(r) ? void 0 : Ve(r);
    },
    Ye = M,
    Ke = he,
    Je = de,
    Xe = TypeError,
    Qe = function (e, t) {
      var r, n;
      if ("string" === t && Ke((r = e.toString)) && !Je((n = Ye(r, e))))
        return n;
      if (Ke((r = e.valueOf)) && !Je((n = Ye(r, e)))) return n;
      if ("string" !== t && Ke((r = e.toString)) && !Je((n = Ye(r, e))))
        return n;
      throw new Xe("Can't convert object to primitive value");
    },
    Ze = { exports: {} },
    et = I,
    tt = Object.defineProperty,
    rt = function (e, t) {
      try {
        tt(et, e, { value: t, configurable: !0, writable: !0 });
      } catch (r) {
        et[e] = t;
      }
      return t;
    },
    nt = I,
    it = rt,
    ot = "__core-js_shared__",
    at = (Ze.exports = nt[ot] || it(ot, {}));
  (at.versions || (at.versions = [])).push({
    version: "3.40.0",
    mode: "global",
    copyright: "漏 2014-2025 Denis Pushkarev (zloirock.ru)",
    license: "https://github.com/zloirock/core-js/blob/v3.40.0/LICENSE",
    source: "https://github.com/zloirock/core-js",
  });
  var ut = Ze.exports,
    ct = ut,
    st = function (e, t) {
      return ct[e] || (ct[e] = t || {});
    },
    ft = ue,
    lt = Object,
    ht = function (e) {
      return lt(ft(e));
    },
    pt = ht,
    dt = Y({}.hasOwnProperty),
    vt =
      Object.hasOwn ||
      function (e, t) {
        return dt(pt(e), t);
      },
    gt = Y,
    yt = 0,
    mt = Math.random(),
    bt = gt((1).toString),
    wt = function (e) {
      return "Symbol(" + (void 0 === e ? "" : e) + ")_" + bt(++yt + mt, 36);
    },
    Et = st,
    xt = vt,
    St = wt,
    At = Fe,
    Ot = je,
    kt = I.Symbol,
    Tt = Et("wks"),
    Rt = Ot ? kt.for || kt : (kt && kt.withoutSetter) || St,
    It = function (e) {
      return (
        xt(Tt, e) || (Tt[e] = At && xt(kt, e) ? kt[e] : Rt("Symbol." + e)),
        Tt[e]
      );
    },
    _t = M,
    Pt = de,
    Ft = Ne,
    jt = $e,
    Ct = Qe,
    Lt = TypeError,
    Mt = It("toPrimitive"),
    Dt = function (e, t) {
      if (!Pt(e) || Ft(e)) return e;
      var r,
        n = jt(e, Mt);
      if (n) {
        if (
          (void 0 === t && (t = "default"), (r = _t(n, e, t)), !Pt(r) || Ft(r))
        )
          return r;
        throw new Lt("Can't convert object to primitive value");
      }
      return void 0 === t && (t = "number"), Ct(e, t);
    },
    Nt = Dt,
    Ut = Ne,
    Bt = function (e) {
      var t = Nt(e, "string");
      return Ut(t) ? t : t + "";
    },
    zt = de,
    Ht = I.document,
    Wt = zt(Ht) && zt(Ht.createElement),
    qt = function (e) {
      return Wt ? Ht.createElement(e) : {};
    },
    Vt = qt,
    Gt =
      !F &&
      !P(function () {
        return (
          7 !==
          Object.defineProperty(Vt("div"), "a", {
            get: function () {
              return 7;
            },
          }).a
        );
      }),
    $t = F,
    Yt = M,
    Kt = D,
    Jt = W,
    Xt = fe,
    Qt = Bt,
    Zt = vt,
    er = Gt,
    tr = Object.getOwnPropertyDescriptor;
  _.f = $t
    ? tr
    : function (e, t) {
        if (((e = Xt(e)), (t = Qt(t)), er))
          try {
            return tr(e, t);
          } catch (r) {}
        if (Zt(e, t)) return Jt(!Yt(Kt.f, e, t), e[t]);
      };
  var rr = {},
    nr =
      F &&
      P(function () {
        return (
          42 !==
          Object.defineProperty(function () {}, "prototype", {
            value: 42,
            writable: !1,
          }).prototype
        );
      }),
    ir = de,
    or = String,
    ar = TypeError,
    ur = function (e) {
      if (ir(e)) return e;
      throw new ar(or(e) + " is not an object");
    },
    cr = F,
    sr = Gt,
    fr = nr,
    lr = ur,
    hr = Bt,
    pr = TypeError,
    dr = Object.defineProperty,
    vr = Object.getOwnPropertyDescriptor,
    gr = "enumerable",
    yr = "configurable",
    mr = "writable";
  rr.f = cr
    ? fr
      ? function (e, t, r) {
          if (
            (lr(e),
            (t = hr(t)),
            lr(r),
            "function" == typeof e &&
              "prototype" === t &&
              "value" in r &&
              mr in r &&
              !r[mr])
          ) {
            var n = vr(e, t);
            n &&
              n[mr] &&
              ((e[t] = r.value),
              (r = {
                configurable: yr in r ? r[yr] : n[yr],
                enumerable: gr in r ? r[gr] : n[gr],
                writable: !1,
              }));
          }
          return dr(e, t, r);
        }
      : dr
    : function (e, t, r) {
        if ((lr(e), (t = hr(t)), lr(r), sr))
          try {
            return dr(e, t, r);
          } catch (n) {}
        if ("get" in r || "set" in r) throw new pr("Accessors not supported");
        return "value" in r && (e[t] = r.value), e;
      };
  var br = rr,
    wr = W,
    Er = F
      ? function (e, t, r) {
          return br.f(e, t, wr(1, r));
        }
      : function (e, t, r) {
          return (e[t] = r), e;
        },
    xr = { exports: {} },
    Sr = F,
    Ar = vt,
    Or = Function.prototype,
    kr = Sr && Object.getOwnPropertyDescriptor,
    Tr = Ar(Or, "name"),
    Rr = {
      EXISTS: Tr,
      PROPER: Tr && "something" === function () {}.name,
      CONFIGURABLE: Tr && (!Sr || (Sr && kr(Or, "name").configurable)),
    },
    Ir = he,
    _r = ut,
    Pr = Y(Function.toString);
  Ir(_r.inspectSource) ||
    (_r.inspectSource = function (e) {
      return Pr(e);
    });
  var Fr,
    jr,
    Cr,
    Lr = _r.inspectSource,
    Mr = he,
    Dr = I.WeakMap,
    Nr = Mr(Dr) && /native code/.test(String(Dr)),
    Ur = wt,
    Br = st("keys"),
    zr = function (e) {
      return Br[e] || (Br[e] = Ur(e));
    },
    Hr = {},
    Wr = Nr,
    qr = I,
    Vr = de,
    Gr = Er,
    $r = vt,
    Yr = ut,
    Kr = zr,
    Jr = Hr,
    Xr = "Object already initialized",
    Qr = qr.TypeError,
    Zr = qr.WeakMap;
  if (Wr || Yr.state) {
    var en = Yr.state || (Yr.state = new Zr());
    (en.get = en.get),
      (en.has = en.has),
      (en.set = en.set),
      (Fr = function (e, t) {
        if (en.has(e)) throw new Qr(Xr);
        return (t.facade = e), en.set(e, t), t;
      }),
      (jr = function (e) {
        return en.get(e) || {};
      }),
      (Cr = function (e) {
        return en.has(e);
      });
  } else {
    var tn = Kr("state");
    (Jr[tn] = !0),
      (Fr = function (e, t) {
        if ($r(e, tn)) throw new Qr(Xr);
        return (t.facade = e), Gr(e, tn, t), t;
      }),
      (jr = function (e) {
        return $r(e, tn) ? e[tn] : {};
      }),
      (Cr = function (e) {
        return $r(e, tn);
      });
  }
  var rn = {
      set: Fr,
      get: jr,
      has: Cr,
      enforce: function (e) {
        return Cr(e) ? jr(e) : Fr(e, {});
      },
      getterFor: function (e) {
        return function (t) {
          var r;
          if (!Vr(t) || (r = jr(t)).type !== e)
            throw new Qr("Incompatible receiver, " + e + " required");
          return r;
        };
      },
    },
    nn = Y,
    on = P,
    an = he,
    un = vt,
    cn = F,
    sn = Rr.CONFIGURABLE,
    fn = Lr,
    ln = rn.enforce,
    hn = rn.get,
    pn = String,
    dn = Object.defineProperty,
    vn = nn("".slice),
    gn = nn("".replace),
    yn = nn([].join),
    mn =
      cn &&
      !on(function () {
        return 8 !== dn(function () {}, "length", { value: 8 }).length;
      }),
    bn = String(String).split("String"),
    wn = (xr.exports = function (e, t, r) {
      "Symbol(" === vn(pn(t), 0, 7) &&
        (t = "[" + gn(pn(t), /^Symbol\(([^)]*)\).*$/, "$1") + "]"),
        r && r.getter && (t = "get " + t),
        r && r.setter && (t = "set " + t),
        (!un(e, "name") || (sn && e.name !== t)) &&
          (cn ? dn(e, "name", { value: t, configurable: !0 }) : (e.name = t)),
        mn &&
          r &&
          un(r, "arity") &&
          e.length !== r.arity &&
          dn(e, "length", { value: r.arity });
      try {
        r && un(r, "constructor") && r.constructor
          ? cn && dn(e, "prototype", { writable: !1 })
          : e.prototype && (e.prototype = void 0);
      } catch (i) {}
      var n = ln(e);
      return (
        un(n, "source") || (n.source = yn(bn, "string" == typeof t ? t : "")), e
      );
    });
  Function.prototype.toString = wn(function () {
    return (an(this) && hn(this).source) || fn(this);
  }, "toString");
  var En = xr.exports,
    xn = he,
    Sn = rr,
    An = En,
    On = rt,
    kn = function (e, t, r, n) {
      n || (n = {});
      var i = n.enumerable,
        o = void 0 !== n.name ? n.name : t;
      if ((xn(r) && An(r, o, n), n.global)) i ? (e[t] = r) : On(t, r);
      else {
        try {
          n.unsafe ? e[t] && (i = !0) : delete e[t];
        } catch (a) {}
        i
          ? (e[t] = r)
          : Sn.f(e, t, {
              value: r,
              enumerable: !1,
              configurable: !n.nonConfigurable,
              writable: !n.nonWritable,
            });
      }
      return e;
    },
    Tn = {},
    Rn = Math.ceil,
    In = Math.floor,
    _n =
      Math.trunc ||
      function (e) {
        var t = +e;
        return (t > 0 ? In : Rn)(t);
      },
    Pn = _n,
    Fn = function (e) {
      var t = +e;
      return t != t || 0 === t ? 0 : Pn(t);
    },
    jn = Fn,
    Cn = Math.max,
    Ln = Math.min,
    Mn = function (e, t) {
      var r = jn(e);
      return r < 0 ? Cn(r + t, 0) : Ln(r, t);
    },
    Dn = Fn,
    Nn = Math.min,
    Un = function (e) {
      var t = Dn(e);
      return t > 0 ? Nn(t, 9007199254740991) : 0;
    },
    Bn = Un,
    zn = function (e) {
      return Bn(e.length);
    },
    Hn = fe,
    Wn = Mn,
    qn = zn,
    Vn = function (e) {
      return function (t, r, n) {
        var i = Hn(t),
          o = qn(i);
        if (0 === o) return !e && -1;
        var a,
          u = Wn(n, o);
        if (e && r != r) {
          for (; o > u; ) if ((a = i[u++]) != a) return !0;
        } else
          for (; o > u; u++)
            if ((e || u in i) && i[u] === r) return e || u || 0;
        return !e && -1;
      };
    },
    Gn = { includes: Vn(!0), indexOf: Vn(!1) },
    $n = vt,
    Yn = fe,
    Kn = Gn.indexOf,
    Jn = Hr,
    Xn = Y([].push),
    Qn = function (e, t) {
      var r,
        n = Yn(e),
        i = 0,
        o = [];
      for (r in n) !$n(Jn, r) && $n(n, r) && Xn(o, r);
      for (; t.length > i; ) $n(n, (r = t[i++])) && (~Kn(o, r) || Xn(o, r));
      return o;
    },
    Zn = [
      "constructor",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "toLocaleString",
      "toString",
      "valueOf",
    ],
    ei = Qn,
    ti = Zn.concat("length", "prototype");
  Tn.f =
    Object.getOwnPropertyNames ||
    function (e) {
      return ei(e, ti);
    };
  var ri = {};
  ri.f = Object.getOwnPropertySymbols;
  var ni = ye,
    ii = Tn,
    oi = ri,
    ai = ur,
    ui = Y([].concat),
    ci =
      ni("Reflect", "ownKeys") ||
      function (e) {
        var t = ii.f(ai(e)),
          r = oi.f;
        return r ? ui(t, r(e)) : t;
      },
    si = vt,
    fi = ci,
    li = _,
    hi = rr,
    pi = function (e, t, r) {
      for (var n = fi(t), i = hi.f, o = li.f, a = 0; a < n.length; a++) {
        var u = n[a];
        si(e, u) || (r && si(r, u)) || i(e, u, o(t, u));
      }
    },
    di = P,
    vi = he,
    gi = /#|\.prototype\./,
    yi = function (e, t) {
      var r = bi[mi(e)];
      return r === Ei || (r !== wi && (vi(t) ? di(t) : !!t));
    },
    mi = (yi.normalize = function (e) {
      return String(e).replace(gi, ".").toLowerCase();
    }),
    bi = (yi.data = {}),
    wi = (yi.NATIVE = "N"),
    Ei = (yi.POLYFILL = "P"),
    xi = yi,
    Si = I,
    Ai = _.f,
    Oi = Er,
    ki = kn,
    Ti = rt,
    Ri = pi,
    Ii = xi,
    _i = function (e, t) {
      var r,
        n,
        i,
        o,
        a,
        u = e.target,
        c = e.global,
        s = e.stat;
      if ((r = c ? Si : s ? Si[u] || Ti(u, {}) : Si[u] && Si[u].prototype))
        for (n in t) {
          if (
            ((o = t[n]),
            (i = e.dontCallGetSet ? (a = Ai(r, n)) && a.value : r[n]),
            !Ii(c ? n : u + (s ? "." : "#") + n, e.forced) && void 0 !== i)
          ) {
            if (f(o) == f(i)) continue;
            Ri(o, i);
          }
          (e.sham || (i && i.sham)) && Oi(o, "sham", !0), ki(r, n, o, e);
        }
    },
    Pi = {};
  Pi[It("toStringTag")] = "z";
  var Fi = "[object z]" === String(Pi),
    ji = Fi,
    Ci = he,
    Li = Q,
    Mi = It("toStringTag"),
    Di = Object,
    Ni =
      "Arguments" ===
      Li(
        (function () {
          return arguments;
        })()
      ),
    Ui = ji
      ? Li
      : function (e) {
          var t, r, n;
          return void 0 === e
            ? "Undefined"
            : null === e
            ? "Null"
            : "string" ==
              typeof (r = (function (e, t) {
                try {
                  return e[t];
                } catch (r) {}
              })((t = Di(e)), Mi))
            ? r
            : Ni
            ? Li(t)
            : "Object" === (n = Li(t)) && Ci(t.callee)
            ? "Arguments"
            : n;
        },
    Bi = Ui,
    zi = String,
    Hi = function (e) {
      if ("Symbol" === Bi(e))
        throw new TypeError("Cannot convert a Symbol value to a string");
      return zi(e);
    },
    Wi = {},
    qi = Qn,
    Vi = Zn,
    Gi =
      Object.keys ||
      function (e) {
        return qi(e, Vi);
      },
    $i = F,
    Yi = nr,
    Ki = rr,
    Ji = ur,
    Xi = fe,
    Qi = Gi;
  Wi.f =
    $i && !Yi
      ? Object.defineProperties
      : function (e, t) {
          Ji(e);
          for (var r, n = Xi(t), i = Qi(t), o = i.length, a = 0; o > a; )
            Ki.f(e, (r = i[a++]), n[r]);
          return e;
        };
  var Zi,
    eo = ye("document", "documentElement"),
    to = ur,
    ro = Wi,
    no = Zn,
    io = Hr,
    oo = eo,
    ao = qt,
    uo = "prototype",
    co = "script",
    so = zr("IE_PROTO"),
    fo = function () {},
    lo = function (e) {
      return "<" + co + ">" + e + "</" + co + ">";
    },
    ho = function (e) {
      e.write(lo("")), e.close();
      var t = e.parentWindow.Object;
      return (e = null), t;
    },
    po = function () {
      try {
        Zi = new ActiveXObject("htmlfile");
      } catch (i) {}
      var e, t, r;
      po =
        "undefined" != typeof document
          ? document.domain && Zi
            ? ho(Zi)
            : ((t = ao("iframe")),
              (r = "java" + co + ":"),
              (t.style.display = "none"),
              oo.appendChild(t),
              (t.src = String(r)),
              (e = t.contentWindow.document).open(),
              e.write(lo("document.F=Object")),
              e.close(),
              e.F)
          : ho(Zi);
      for (var n = no.length; n--; ) delete po[uo][no[n]];
      return po();
    };
  io[so] = !0;
  var vo =
      Object.create ||
      function (e, t) {
        var r;
        return (
          null !== e
            ? ((fo[uo] = to(e)), (r = new fo()), (fo[uo] = null), (r[so] = e))
            : (r = po()),
          void 0 === t ? r : ro.f(r, t)
        );
      },
    go = {},
    yo = Y([].slice),
    mo = Q,
    bo = fe,
    wo = Tn.f,
    Eo = yo,
    xo =
      "object" == ("undefined" == typeof window ? "undefined" : f(window)) &&
      window &&
      Object.getOwnPropertyNames
        ? Object.getOwnPropertyNames(window)
        : [];
  go.f = function (e) {
    return xo && "Window" === mo(e)
      ? (function (e) {
          try {
            return wo(e);
          } catch (t) {
            return Eo(xo);
          }
        })(e)
      : wo(bo(e));
  };
  var So = En,
    Ao = rr,
    Oo = function (e, t, r) {
      return (
        r.get && So(r.get, t, { getter: !0 }),
        r.set && So(r.set, t, { setter: !0 }),
        Ao.f(e, t, r)
      );
    },
    ko = {},
    To = It;
  ko.f = To;
  var Ro = I,
    Io = Ro,
    _o = vt,
    Po = ko,
    Fo = rr.f,
    jo = function (e) {
      var t = Io.Symbol || (Io.Symbol = {});
      _o(t, e) || Fo(t, e, { value: Po.f(e) });
    },
    Co = M,
    Lo = ye,
    Mo = It,
    Do = kn,
    No = function () {
      var e = Lo("Symbol"),
        t = e && e.prototype,
        r = t && t.valueOf,
        n = Mo("toPrimitive");
      t &&
        !t[n] &&
        Do(
          t,
          n,
          function (e) {
            return Co(r, this);
          },
          { arity: 1 }
        );
    },
    Uo = rr.f,
    Bo = vt,
    zo = It("toStringTag"),
    Ho = function (e, t, r) {
      e && !r && (e = e.prototype),
        e && !Bo(e, zo) && Uo(e, zo, { configurable: !0, value: t });
    },
    Wo = Q,
    qo = Y,
    Vo = function (e) {
      if ("Function" === Wo(e)) return qo(e);
    },
    Go = qe,
    $o = j,
    Yo = Vo(Vo.bind),
    Ko = function (e, t) {
      return (
        Go(e),
        void 0 === t
          ? e
          : $o
          ? Yo(e, t)
          : function () {
              return e.apply(t, arguments);
            }
      );
    },
    Jo = Q,
    Xo =
      Array.isArray ||
      function (e) {
        return "Array" === Jo(e);
      },
    Qo = Y,
    Zo = P,
    ea = he,
    ta = Ui,
    ra = Lr,
    na = function () {},
    ia = ye("Reflect", "construct"),
    oa = /^\s*(?:class|function)\b/,
    aa = Qo(oa.exec),
    ua = !oa.test(na),
    ca = function (e) {
      if (!ea(e)) return !1;
      try {
        return ia(na, [], e), !0;
      } catch (t) {
        return !1;
      }
    },
    sa = function (e) {
      if (!ea(e)) return !1;
      switch (ta(e)) {
        case "AsyncFunction":
        case "GeneratorFunction":
        case "AsyncGeneratorFunction":
          return !1;
      }
      try {
        return ua || !!aa(oa, ra(e));
      } catch (t) {
        return !0;
      }
    };
  sa.sham = !0;
  var fa =
      !ia ||
      Zo(function () {
        var e;
        return (
          ca(ca.call) ||
          !ca(Object) ||
          !ca(function () {
            e = !0;
          }) ||
          e
        );
      })
        ? sa
        : ca,
    la = Xo,
    ha = fa,
    pa = de,
    da = It("species"),
    va = Array,
    ga = function (e) {
      var t;
      return (
        la(e) &&
          ((t = e.constructor),
          ((ha(t) && (t === va || la(t.prototype))) ||
            (pa(t) && null === (t = t[da]))) &&
            (t = void 0)),
        void 0 === t ? va : t
      );
    },
    ya = function (e, t) {
      return new (ga(e))(0 === t ? 0 : t);
    },
    ma = Ko,
    ba = ne,
    wa = ht,
    Ea = zn,
    xa = ya,
    Sa = Y([].push),
    Aa = function (e) {
      var t = 1 === e,
        r = 2 === e,
        n = 3 === e,
        i = 4 === e,
        o = 6 === e,
        a = 7 === e,
        u = 5 === e || o;
      return function (c, s, f, l) {
        for (
          var h,
            p,
            d = wa(c),
            v = ba(d),
            g = Ea(v),
            y = ma(s, f),
            m = 0,
            b = l || xa,
            w = t ? b(c, g) : r || a ? b(c, 0) : void 0;
          g > m;
          m++
        )
          if ((u || m in v) && ((p = y((h = v[m]), m, d)), e))
            if (t) w[m] = p;
            else if (p)
              switch (e) {
                case 3:
                  return !0;
                case 5:
                  return h;
                case 6:
                  return m;
                case 2:
                  Sa(w, h);
              }
            else
              switch (e) {
                case 4:
                  return !1;
                case 7:
                  Sa(w, h);
              }
        return o ? -1 : n || i ? i : w;
      };
    },
    Oa = {
      forEach: Aa(0),
      map: Aa(1),
      filter: Aa(2),
      some: Aa(3),
      every: Aa(4),
      find: Aa(5),
      findIndex: Aa(6),
      filterReject: Aa(7),
    },
    ka = _i,
    Ta = I,
    Ra = M,
    Ia = Y,
    _a = F,
    Pa = Fe,
    Fa = P,
    ja = vt,
    Ca = me,
    La = ur,
    Ma = fe,
    Da = Bt,
    Na = Hi,
    Ua = W,
    Ba = vo,
    za = Gi,
    Ha = Tn,
    Wa = go,
    qa = ri,
    Va = _,
    Ga = rr,
    $a = Wi,
    Ya = D,
    Ka = kn,
    Ja = Oo,
    Xa = st,
    Qa = Hr,
    Za = wt,
    eu = It,
    tu = ko,
    ru = jo,
    nu = No,
    iu = Ho,
    ou = rn,
    au = Oa.forEach,
    uu = zr("hidden"),
    cu = "Symbol",
    su = "prototype",
    fu = ou.set,
    lu = ou.getterFor(cu),
    hu = Object[su],
    pu = Ta.Symbol,
    du = pu && pu[su],
    vu = Ta.RangeError,
    gu = Ta.TypeError,
    yu = Ta.QObject,
    mu = Va.f,
    bu = Ga.f,
    wu = Wa.f,
    Eu = Ya.f,
    xu = Ia([].push),
    Su = Xa("symbols"),
    Au = Xa("op-symbols"),
    Ou = Xa("wks"),
    ku = !yu || !yu[su] || !yu[su].findChild,
    Tu = function (e, t, r) {
      var n = mu(hu, t);
      n && delete hu[t], bu(e, t, r), n && e !== hu && bu(hu, t, n);
    },
    Ru =
      _a &&
      Fa(function () {
        return (
          7 !==
          Ba(
            bu({}, "a", {
              get: function () {
                return bu(this, "a", { value: 7 }).a;
              },
            })
          ).a
        );
      })
        ? Tu
        : bu,
    Iu = function (e, t) {
      var r = (Su[e] = Ba(du));
      return (
        fu(r, { type: cu, tag: e, description: t }),
        _a || (r.description = t),
        r
      );
    },
    _u = function (e, t, r) {
      e === hu && _u(Au, t, r), La(e);
      var n = Da(t);
      return (
        La(r),
        ja(Su, n)
          ? (r.enumerable
              ? (ja(e, uu) && e[uu][n] && (e[uu][n] = !1),
                (r = Ba(r, { enumerable: Ua(0, !1) })))
              : (ja(e, uu) || bu(e, uu, Ua(1, Ba(null))), (e[uu][n] = !0)),
            Ru(e, n, r))
          : bu(e, n, r)
      );
    },
    Pu = function (e, t) {
      La(e);
      var r = Ma(t),
        n = za(r).concat(Lu(r));
      return (
        au(n, function (t) {
          (_a && !Ra(Fu, r, t)) || _u(e, t, r[t]);
        }),
        e
      );
    },
    Fu = function (e) {
      var t = Da(e),
        r = Ra(Eu, this, t);
      return (
        !(this === hu && ja(Su, t) && !ja(Au, t)) &&
        (!(r || !ja(this, t) || !ja(Su, t) || (ja(this, uu) && this[uu][t])) ||
          r)
      );
    },
    ju = function (e, t) {
      var r = Ma(e),
        n = Da(t);
      if (r !== hu || !ja(Su, n) || ja(Au, n)) {
        var i = mu(r, n);
        return (
          !i || !ja(Su, n) || (ja(r, uu) && r[uu][n]) || (i.enumerable = !0), i
        );
      }
    },
    Cu = function (e) {
      var t = wu(Ma(e)),
        r = [];
      return (
        au(t, function (e) {
          ja(Su, e) || ja(Qa, e) || xu(r, e);
        }),
        r
      );
    },
    Lu = function (e) {
      var t = e === hu,
        r = wu(t ? Au : Ma(e)),
        n = [];
      return (
        au(r, function (e) {
          !ja(Su, e) || (t && !ja(hu, e)) || xu(n, Su[e]);
        }),
        n
      );
    };
  Pa ||
    ((pu = function () {
      if (Ca(du, this)) throw new gu("Symbol is not a constructor");
      var e =
          arguments.length && void 0 !== arguments[0]
            ? Na(arguments[0])
            : void 0,
        t = Za(e),
        r = function (e) {
          var n = void 0 === this ? Ta : this;
          n === hu && Ra(r, Au, e),
            ja(n, uu) && ja(n[uu], t) && (n[uu][t] = !1);
          var i = Ua(1, e);
          try {
            Ru(n, t, i);
          } catch (o) {
            if (!(o instanceof vu)) throw o;
            Tu(n, t, i);
          }
        };
      return _a && ku && Ru(hu, t, { configurable: !0, set: r }), Iu(t, e);
    }),
    Ka((du = pu[su]), "toString", function () {
      return lu(this).tag;
    }),
    Ka(pu, "withoutSetter", function (e) {
      return Iu(Za(e), e);
    }),
    (Ya.f = Fu),
    (Ga.f = _u),
    ($a.f = Pu),
    (Va.f = ju),
    (Ha.f = Wa.f = Cu),
    (qa.f = Lu),
    (tu.f = function (e) {
      return Iu(eu(e), e);
    }),
    _a &&
      (Ja(du, "description", {
        configurable: !0,
        get: function () {
          return lu(this).description;
        },
      }),
      Ka(hu, "propertyIsEnumerable", Fu, { unsafe: !0 }))),
    ka(
      { global: !0, constructor: !0, wrap: !0, forced: !Pa, sham: !Pa },
      { Symbol: pu }
    ),
    au(za(Ou), function (e) {
      ru(e);
    }),
    ka(
      { target: cu, stat: !0, forced: !Pa },
      {
        useSetter: function () {
          ku = !0;
        },
        useSimple: function () {
          ku = !1;
        },
      }
    ),
    ka(
      { target: "Object", stat: !0, forced: !Pa, sham: !_a },
      {
        create: function (e, t) {
          return void 0 === t ? Ba(e) : Pu(Ba(e), t);
        },
        defineProperty: _u,
        defineProperties: Pu,
        getOwnPropertyDescriptor: ju,
      }
    ),
    ka(
      { target: "Object", stat: !0, forced: !Pa },
      { getOwnPropertyNames: Cu }
    ),
    nu(),
    iu(pu, cu),
    (Qa[uu] = !0);
  var Mu = Fe && !!Symbol.for && !!Symbol.keyFor,
    Du = _i,
    Nu = ye,
    Uu = vt,
    Bu = Hi,
    zu = st,
    Hu = Mu,
    Wu = zu("string-to-symbol-registry"),
    qu = zu("symbol-to-string-registry");
  Du(
    { target: "Symbol", stat: !0, forced: !Hu },
    {
      for: function (e) {
        var t = Bu(e);
        if (Uu(Wu, t)) return Wu[t];
        var r = Nu("Symbol")(t);
        return (Wu[t] = r), (qu[r] = t), r;
      },
    }
  );
  var Vu = _i,
    Gu = vt,
    $u = Ne,
    Yu = Be,
    Ku = Mu,
    Ju = st("symbol-to-string-registry");
  Vu(
    { target: "Symbol", stat: !0, forced: !Ku },
    {
      keyFor: function (e) {
        if (!$u(e)) throw new TypeError(Yu(e) + " is not a symbol");
        if (Gu(Ju, e)) return Ju[e];
      },
    }
  );
  var Xu = j,
    Qu = Function.prototype,
    Zu = Qu.apply,
    ec = Qu.call,
    tc =
      ("object" == ("undefined" == typeof Reflect ? "undefined" : f(Reflect)) &&
        Reflect.apply) ||
      (Xu
        ? ec.bind(Zu)
        : function () {
            return ec.apply(Zu, arguments);
          }),
    rc = Xo,
    nc = he,
    ic = Q,
    oc = Hi,
    ac = Y([].push),
    uc = _i,
    cc = ye,
    sc = tc,
    fc = M,
    lc = Y,
    hc = P,
    pc = he,
    dc = Ne,
    vc = yo,
    gc = function (e) {
      if (nc(e)) return e;
      if (rc(e)) {
        for (var t = e.length, r = [], n = 0; n < t; n++) {
          var i = e[n];
          "string" == typeof i
            ? ac(r, i)
            : ("number" != typeof i &&
                "Number" !== ic(i) &&
                "String" !== ic(i)) ||
              ac(r, oc(i));
        }
        var o = r.length,
          a = !0;
        return function (e, t) {
          if (a) return (a = !1), t;
          if (rc(this)) return t;
          for (var n = 0; n < o; n++) if (r[n] === e) return t;
        };
      }
    },
    yc = Fe,
    mc = String,
    bc = cc("JSON", "stringify"),
    wc = lc(/./.exec),
    Ec = lc("".charAt),
    xc = lc("".charCodeAt),
    Sc = lc("".replace),
    Ac = lc((1).toString),
    Oc = /[\uD800-\uDFFF]/g,
    kc = /^[\uD800-\uDBFF]$/,
    Tc = /^[\uDC00-\uDFFF]$/,
    Rc =
      !yc ||
      hc(function () {
        var e = cc("Symbol")("stringify detection");
        return (
          "[null]" !== bc([e]) ||
          "{}" !== bc({ a: e }) ||
          "{}" !== bc(Object(e))
        );
      }),
    Ic = hc(function () {
      return (
        '"\\udf06\\ud834"' !== bc("\udf06\ud834") ||
        '"\\udead"' !== bc("\udead")
      );
    }),
    _c = function (e, t) {
      var r = vc(arguments),
        n = gc(t);
      if (pc(n) || (void 0 !== e && !dc(e)))
        return (
          (r[1] = function (e, t) {
            if ((pc(n) && (t = fc(n, this, mc(e), t)), !dc(t))) return t;
          }),
          sc(bc, null, r)
        );
    },
    Pc = function (e, t, r) {
      var n = Ec(r, t - 1),
        i = Ec(r, t + 1);
      return (wc(kc, e) && !wc(Tc, i)) || (wc(Tc, e) && !wc(kc, n))
        ? "\\u" + Ac(xc(e, 0), 16)
        : e;
    };
  bc &&
    uc(
      { target: "JSON", stat: !0, arity: 3, forced: Rc || Ic },
      {
        stringify: function (e, t, r) {
          var n = vc(arguments),
            i = sc(Rc ? _c : bc, null, n);
          return Ic && "string" == typeof i ? Sc(i, Oc, Pc) : i;
        },
      }
    );
  var Fc = ri,
    jc = ht;
  _i(
    {
      target: "Object",
      stat: !0,
      forced:
        !Fe ||
        P(function () {
          Fc.f(1);
        }),
    },
    {
      getOwnPropertySymbols: function (e) {
        var t = Fc.f;
        return t ? t(jc(e)) : [];
      },
    }
  );
  var Cc = _i,
    Lc = F,
    Mc = Y,
    Dc = vt,
    Nc = he,
    Uc = me,
    Bc = Hi,
    zc = Oo,
    Hc = pi,
    Wc = I.Symbol,
    qc = Wc && Wc.prototype;
  if (Lc && Nc(Wc) && (!("description" in qc) || void 0 !== Wc().description)) {
    var Vc = {},
      Gc = function () {
        var e =
            arguments.length < 1 || void 0 === arguments[0]
              ? void 0
              : Bc(arguments[0]),
          t = Uc(qc, this) ? new Wc(e) : void 0 === e ? Wc() : Wc(e);
        return "" === e && (Vc[t] = !0), t;
      };
    Hc(Gc, Wc), (Gc.prototype = qc), (qc.constructor = Gc);
    var $c =
        "Symbol(description detection)" === String(Wc("description detection")),
      Yc = Mc(qc.valueOf),
      Kc = Mc(qc.toString),
      Jc = /^Symbol\((.*)\)[^)]+$/,
      Xc = Mc("".replace),
      Qc = Mc("".slice);
    zc(qc, "description", {
      configurable: !0,
      get: function () {
        var e = Yc(this);
        if (Dc(Vc, e)) return "";
        var t = Kc(e),
          r = $c ? Qc(t, 7, -1) : Xc(t, Jc, "$1");
        return "" === r ? void 0 : r;
      },
    }),
      Cc({ global: !0, constructor: !0, forced: !0 }, { Symbol: Gc });
  }
  jo("asyncIterator"),
    jo("hasInstance"),
    jo("isConcatSpreadable"),
    jo("iterator"),
    jo("match"),
    jo("matchAll"),
    jo("replace"),
    jo("search"),
    jo("species"),
    jo("split");
  var Zc = No;
  jo("toPrimitive"), Zc();
  var es = ye,
    ts = Ho;
  jo("toStringTag"), ts(es("Symbol"), "Symbol"), jo("unscopables");
  var rs = Y,
    ns = qe,
    is = function (e, t, r) {
      try {
        return rs(ns(Object.getOwnPropertyDescriptor(e, t)[r]));
      } catch (n) {}
    },
    os = de,
    as = function (e) {
      return os(e) || null === e;
    },
    us = as,
    cs = String,
    ss = TypeError,
    fs = function (e) {
      if (us(e)) return e;
      throw new ss("Can't set " + cs(e) + " as a prototype");
    },
    ls = is,
    hs = de,
    ps = ue,
    ds = fs,
    vs =
      Object.setPrototypeOf ||
      ("__proto__" in {}
        ? (function () {
            var e,
              t = !1,
              r = {};
            try {
              (e = ls(Object.prototype, "__proto__", "set"))(r, []),
                (t = r instanceof Array);
            } catch (n) {}
            return function (r, n) {
              return (
                ps(r), ds(n), hs(r) ? (t ? e(r, n) : (r.__proto__ = n), r) : r
              );
            };
          })()
        : void 0),
    gs = rr.f,
    ys = function (e, t, r) {
      r in e ||
        gs(e, r, {
          configurable: !0,
          get: function () {
            return t[r];
          },
          set: function (e) {
            t[r] = e;
          },
        });
    },
    ms = he,
    bs = de,
    ws = vs,
    Es = function (e, t, r) {
      var n, i;
      return (
        ws &&
          ms((n = t.constructor)) &&
          n !== r &&
          bs((i = n.prototype)) &&
          i !== r.prototype &&
          ws(e, i),
        e
      );
    },
    xs = Hi,
    Ss = function (e, t) {
      return void 0 === e ? (arguments.length < 2 ? "" : t) : xs(e);
    },
    As = de,
    Os = Er,
    ks = function (e, t) {
      As(t) && "cause" in t && Os(e, "cause", t.cause);
    },
    Ts = Error,
    Rs = Y("".replace),
    Is = String(new Ts("zxcasd").stack),
    _s = /\n\s*at [^:]*:[^\n]*/,
    Ps = _s.test(Is),
    Fs = function (e, t) {
      if (Ps && "string" == typeof e && !Ts.prepareStackTrace)
        for (; t--; ) e = Rs(e, _s, "");
      return e;
    },
    js = W,
    Cs = !P(function () {
      var e = new Error("a");
      return (
        !("stack" in e) ||
        (Object.defineProperty(e, "stack", js(1, 7)), 7 !== e.stack)
      );
    }),
    Ls = Er,
    Ms = Fs,
    Ds = Cs,
    Ns = Error.captureStackTrace,
    Us = function (e, t, r, n) {
      Ds && (Ns ? Ns(e, t) : Ls(e, "stack", Ms(r, n)));
    },
    Bs = ye,
    zs = vt,
    Hs = Er,
    Ws = me,
    qs = vs,
    Vs = pi,
    Gs = ys,
    $s = Es,
    Ys = Ss,
    Ks = ks,
    Js = Us,
    Xs = F,
    Qs = function (e, t, r, n) {
      var i = "stackTraceLimit",
        o = n ? 2 : 1,
        a = e.split("."),
        u = a[a.length - 1],
        c = Bs.apply(null, a);
      if (c) {
        var s = c.prototype;
        if ((zs(s, "cause") && delete s.cause, !r)) return c;
        var f = Bs("Error"),
          l = t(function (e, t) {
            var r = Ys(n ? t : e, void 0),
              i = n ? new c(e) : new c();
            return (
              void 0 !== r && Hs(i, "message", r),
              Js(i, l, i.stack, 2),
              this && Ws(s, this) && $s(i, this, l),
              arguments.length > o && Ks(i, arguments[o]),
              i
            );
          });
        (l.prototype = s),
          "Error" !== u
            ? qs
              ? qs(l, f)
              : Vs(l, f, { name: !0 })
            : Xs && i in c && (Gs(l, c, i), Gs(l, c, "prepareStackTrace")),
          Vs(l, c);
        try {
          s.name !== u && Hs(s, "name", u), (s.constructor = l);
        } catch (h) {}
        return l;
      }
    },
    Zs = _i,
    ef = tc,
    tf = Qs,
    rf = "WebAssembly",
    nf = I[rf],
    of = 7 !== new Error("e", { cause: 7 }).cause,
    af = function (e, t) {
      var r = {};
      (r[e] = tf(e, t, of)),
        Zs({ global: !0, constructor: !0, arity: 1, forced: of }, r);
    },
    uf = function (e, t) {
      if (nf && nf[e]) {
        var r = {};
        (r[e] = tf(rf + "." + e, t, of)),
          Zs(
            { target: rf, stat: !0, constructor: !0, arity: 1, forced: of },
            r
          );
      }
    };
  af("Error", function (e) {
    return function (t) {
      return ef(e, this, arguments);
    };
  }),
    af("EvalError", function (e) {
      return function (t) {
        return ef(e, this, arguments);
      };
    }),
    af("RangeError", function (e) {
      return function (t) {
        return ef(e, this, arguments);
      };
    }),
    af("ReferenceError", function (e) {
      return function (t) {
        return ef(e, this, arguments);
      };
    }),
    af("SyntaxError", function (e) {
      return function (t) {
        return ef(e, this, arguments);
      };
    }),
    af("TypeError", function (e) {
      return function (t) {
        return ef(e, this, arguments);
      };
    }),
    af("URIError", function (e) {
      return function (t) {
        return ef(e, this, arguments);
      };
    }),
    uf("CompileError", function (e) {
      return function (t) {
        return ef(e, this, arguments);
      };
    }),
    uf("LinkError", function (e) {
      return function (t) {
        return ef(e, this, arguments);
      };
    }),
    uf("RuntimeError", function (e) {
      return function (t) {
        return ef(e, this, arguments);
      };
    });
  var cf = F,
    sf = P,
    ff = ur,
    lf = Ss,
    hf = Error.prototype.toString,
    pf = sf(function () {
      if (cf) {
        var e = Object.create(
          Object.defineProperty({}, "name", {
            get: function () {
              return this === e;
            },
          })
        );
        if ("true" !== hf.call(e)) return !0;
      }
      return (
        "2: 1" !== hf.call({ message: 1, name: 2 }) || "Error" !== hf.call({})
      );
    })
      ? function () {
          var e = ff(this),
            t = lf(e.name, "Error"),
            r = lf(e.message);
          return t ? (r ? t + ": " + r : t) : r;
        }
      : hf,
    df = kn,
    vf = pf,
    gf = Error.prototype;
  gf.toString !== vf && df(gf, "toString", vf);
  var yf = !P(function () {
      function e() {}
      return (
        (e.prototype.constructor = null),
        Object.getPrototypeOf(new e()) !== e.prototype
      );
    }),
    mf = vt,
    bf = he,
    wf = ht,
    Ef = yf,
    xf = zr("IE_PROTO"),
    Sf = Object,
    Af = Sf.prototype,
    Of = Ef
      ? Sf.getPrototypeOf
      : function (e) {
          var t = wf(e);
          if (mf(t, xf)) return t[xf];
          var r = t.constructor;
          return bf(r) && t instanceof r
            ? r.prototype
            : t instanceof Sf
            ? Af
            : null;
        },
    kf = {},
    Tf = kf,
    Rf = It("iterator"),
    If = Array.prototype,
    _f = function (e) {
      return void 0 !== e && (Tf.Array === e || If[Rf] === e);
    },
    Pf = Ui,
    Ff = $e,
    jf = ie,
    Cf = kf,
    Lf = It("iterator"),
    Mf = function (e) {
      if (!jf(e)) return Ff(e, Lf) || Ff(e, "@@iterator") || Cf[Pf(e)];
    },
    Df = M,
    Nf = qe,
    Uf = ur,
    Bf = Be,
    zf = Mf,
    Hf = TypeError,
    Wf = function (e, t) {
      var r = arguments.length < 2 ? zf(e) : t;
      if (Nf(r)) return Uf(Df(r, e));
      throw new Hf(Bf(e) + " is not iterable");
    },
    qf = M,
    Vf = ur,
    Gf = $e,
    $f = function (e, t, r) {
      var n, i;
      Vf(e);
      try {
        if (!(n = Gf(e, "return"))) {
          if ("throw" === t) throw r;
          return r;
        }
        n = qf(n, e);
      } catch (o) {
        (i = !0), (n = o);
      }
      if ("throw" === t) throw r;
      if (i) throw n;
      return Vf(n), r;
    },
    Yf = Ko,
    Kf = M,
    Jf = ur,
    Xf = Be,
    Qf = _f,
    Zf = zn,
    el = me,
    tl = Wf,
    rl = Mf,
    nl = $f,
    il = TypeError,
    ol = function (e, t) {
      (this.stopped = e), (this.result = t);
    },
    al = ol.prototype,
    ul = function (e, t, r) {
      var n,
        i,
        o,
        a,
        u,
        c,
        s,
        l = r && r.that,
        h = !(!r || !r.AS_ENTRIES),
        p = !(!r || !r.IS_RECORD),
        d = !(!r || !r.IS_ITERATOR),
        v = !(!r || !r.INTERRUPTED),
        g = Yf(t, l),
        y = function (e) {
          return n && nl(n, "normal", e), new ol(!0, e);
        },
        m = function (e) {
          return h
            ? (Jf(e), v ? g(e[0], e[1], y) : g(e[0], e[1]))
            : v
            ? g(e, y)
            : g(e);
        };
      if (p) n = e.iterator;
      else if (d) n = e;
      else {
        if (!(i = rl(e))) throw new il(Xf(e) + " is not iterable");
        if (Qf(i)) {
          for (o = 0, a = Zf(e); a > o; o++)
            if ((u = m(e[o])) && el(al, u)) return u;
          return new ol(!1);
        }
        n = tl(e, i);
      }
      for (c = p ? e.next : n.next; !(s = Kf(c, n)).done; ) {
        try {
          u = m(s.value);
        } catch (b) {
          nl(n, "throw", b);
        }
        if ("object" == f(u) && u && el(al, u)) return u;
      }
      return new ol(!1);
    },
    cl = _i,
    sl = me,
    fl = Of,
    ll = vs,
    hl = pi,
    pl = vo,
    dl = Er,
    vl = W,
    gl = ks,
    yl = Us,
    ml = ul,
    bl = Ss,
    wl = It("toStringTag"),
    El = Error,
    xl = [].push,
    Sl = function (e, t) {
      var r,
        n = sl(Al, this);
      ll
        ? (r = ll(new El(), n ? fl(this) : Al))
        : ((r = n ? this : pl(Al)), dl(r, wl, "Error")),
        void 0 !== t && dl(r, "message", bl(t)),
        yl(r, Sl, r.stack, 1),
        arguments.length > 2 && gl(r, arguments[2]);
      var i = [];
      return ml(e, xl, { that: i }), dl(r, "errors", i), r;
    };
  ll ? ll(Sl, El) : hl(Sl, El, { name: !0 });
  var Al = (Sl.prototype = pl(El.prototype, {
    constructor: vl(1, Sl),
    message: vl(1, ""),
    name: vl(1, "AggregateError"),
  }));
  cl({ global: !0, constructor: !0, arity: 2 }, { AggregateError: Sl });
  var Ol = _i,
    kl = tc,
    Tl = P,
    Rl = Qs,
    Il = "AggregateError",
    _l = ye(Il),
    Pl =
      !Tl(function () {
        return 1 !== _l([1]).errors[0];
      }) &&
      Tl(function () {
        return 7 !== _l([1], Il, { cause: 7 }).cause;
      });
  Ol(
    { global: !0, constructor: !0, arity: 2, forced: Pl },
    {
      AggregateError: Rl(
        Il,
        function (e) {
          return function (t, r) {
            return kl(e, this, arguments);
          };
        },
        Pl,
        !0
      ),
    }
  );
  var Fl = It,
    jl = vo,
    Cl = rr.f,
    Ll = Fl("unscopables"),
    Ml = Array.prototype;
  void 0 === Ml[Ll] && Cl(Ml, Ll, { configurable: !0, value: jl(null) });
  var Dl = function (e) {
      Ml[Ll][e] = !0;
    },
    Nl = ht,
    Ul = zn,
    Bl = Fn,
    zl = Dl;
  _i(
    { target: "Array", proto: !0 },
    {
      at: function (e) {
        var t = Nl(this),
          r = Ul(t),
          n = Bl(e),
          i = n >= 0 ? n : r + n;
        return i < 0 || i >= r ? void 0 : t[i];
      },
    }
  ),
    zl("at");
  var Hl = TypeError,
    Wl = function (e) {
      if (e > 9007199254740991) throw Hl("Maximum allowed index exceeded");
      return e;
    },
    ql = F,
    Vl = rr,
    Gl = W,
    $l = function (e, t, r) {
      ql ? Vl.f(e, t, Gl(0, r)) : (e[t] = r);
    },
    Yl = P,
    Kl = Re,
    Jl = It("species"),
    Xl = function (e) {
      return (
        Kl >= 51 ||
        !Yl(function () {
          var t = [];
          return (
            ((t.constructor = {})[Jl] = function () {
              return { foo: 1 };
            }),
            1 !== t[e](Boolean).foo
          );
        })
      );
    },
    Ql = _i,
    Zl = P,
    eh = Xo,
    th = de,
    rh = ht,
    nh = zn,
    ih = Wl,
    oh = $l,
    ah = ya,
    uh = Xl,
    ch = Re,
    sh = It("isConcatSpreadable"),
    fh =
      ch >= 51 ||
      !Zl(function () {
        var e = [];
        return (e[sh] = !1), e.concat()[0] !== e;
      }),
    lh = function (e) {
      if (!th(e)) return !1;
      var t = e[sh];
      return void 0 !== t ? !!t : eh(e);
    };
  Ql(
    { target: "Array", proto: !0, arity: 1, forced: !fh || !uh("concat") },
    {
      concat: function (e) {
        var t,
          r,
          n,
          i,
          o,
          a = rh(this),
          u = ah(a, 0),
          c = 0;
        for (t = -1, n = arguments.length; t < n; t++)
          if (lh((o = -1 === t ? a : arguments[t])))
            for (i = nh(o), ih(c + i), r = 0; r < i; r++, c++)
              r in o && oh(u, c, o[r]);
          else ih(c + 1), oh(u, c++, o);
        return (u.length = c), u;
      },
    }
  );
  var hh = Be,
    ph = TypeError,
    dh = function (e, t) {
      if (!delete e[t])
        throw new ph("Cannot delete property " + hh(t) + " of " + hh(e));
    },
    vh = ht,
    gh = Mn,
    yh = zn,
    mh = dh,
    bh = Math.min,
    wh =
      [].copyWithin ||
      function (e, t) {
        var r = vh(this),
          n = yh(r),
          i = gh(e, n),
          o = gh(t, n),
          a = arguments.length > 2 ? arguments[2] : void 0,
          u = bh((void 0 === a ? n : gh(a, n)) - o, n - i),
          c = 1;
        for (
          o < i && i < o + u && ((c = -1), (o += u - 1), (i += u - 1));
          u-- > 0;

        )
          o in r ? (r[i] = r[o]) : mh(r, i), (i += c), (o += c);
        return r;
      },
    Eh = Dl;
  _i({ target: "Array", proto: !0 }, { copyWithin: wh }), Eh("copyWithin");
  var xh = P,
    Sh = function (e, t) {
      var r = [][e];
      return (
        !!r &&
        xh(function () {
          r.call(
            null,
            t ||
              function () {
                return 1;
              },
            1
          );
        })
      );
    },
    Ah = Oa.every;
  _i(
    { target: "Array", proto: !0, forced: !Sh("every") },
    {
      every: function (e) {
        return Ah(this, e, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  );
  var Oh = ht,
    kh = Mn,
    Th = zn,
    Rh = function (e) {
      for (
        var t = Oh(this),
          r = Th(t),
          n = arguments.length,
          i = kh(n > 1 ? arguments[1] : void 0, r),
          o = n > 2 ? arguments[2] : void 0,
          a = void 0 === o ? r : kh(o, r);
        a > i;

      )
        t[i++] = e;
      return t;
    },
    Ih = Dl;
  _i({ target: "Array", proto: !0 }, { fill: Rh }), Ih("fill");
  var _h = Oa.filter;
  _i(
    { target: "Array", proto: !0, forced: !Xl("filter") },
    {
      filter: function (e) {
        return _h(this, e, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  );
  var Ph = _i,
    Fh = Oa.find,
    jh = Dl,
    Ch = "find",
    Lh = !0;
  Ch in [] &&
    Array(1)[Ch](function () {
      Lh = !1;
    }),
    Ph(
      { target: "Array", proto: !0, forced: Lh },
      {
        find: function (e) {
          return Fh(this, e, arguments.length > 1 ? arguments[1] : void 0);
        },
      }
    ),
    jh(Ch);
  var Mh = _i,
    Dh = Oa.findIndex,
    Nh = Dl,
    Uh = "findIndex",
    Bh = !0;
  Uh in [] &&
    Array(1)[Uh](function () {
      Bh = !1;
    }),
    Mh(
      { target: "Array", proto: !0, forced: Bh },
      {
        findIndex: function (e) {
          return Dh(this, e, arguments.length > 1 ? arguments[1] : void 0);
        },
      }
    ),
    Nh(Uh);
  var zh = Ko,
    Hh = ne,
    Wh = ht,
    qh = zn,
    Vh = function (e) {
      var t = 1 === e;
      return function (r, n, i) {
        for (var o, a = Wh(r), u = Hh(a), c = qh(u), s = zh(n, i); c-- > 0; )
          if (s((o = u[c]), c, a))
            switch (e) {
              case 0:
                return o;
              case 1:
                return c;
            }
        return t ? -1 : void 0;
      };
    },
    Gh = { findLast: Vh(0), findLastIndex: Vh(1) },
    $h = Gh.findLast,
    Yh = Dl;
  _i(
    { target: "Array", proto: !0 },
    {
      findLast: function (e) {
        return $h(this, e, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  ),
    Yh("findLast");
  var Kh = Gh.findLastIndex,
    Jh = Dl;
  _i(
    { target: "Array", proto: !0 },
    {
      findLastIndex: function (e) {
        return Kh(this, e, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  ),
    Jh("findLastIndex");
  var Xh = Xo,
    Qh = zn,
    Zh = Wl,
    ep = Ko,
    tp = function (e, t, r, n, i, o, a, u) {
      for (var c, s, f = i, l = 0, h = !!a && ep(a, u); l < n; )
        l in r &&
          ((c = h ? h(r[l], l, t) : r[l]),
          o > 0 && Xh(c)
            ? ((s = Qh(c)), (f = tp(e, t, c, s, f, o - 1) - 1))
            : (Zh(f + 1), (e[f] = c)),
          f++),
          l++;
      return f;
    },
    rp = tp,
    np = rp,
    ip = ht,
    op = zn,
    ap = Fn,
    up = ya;
  _i(
    { target: "Array", proto: !0 },
    {
      flat: function () {
        var e = arguments.length ? arguments[0] : void 0,
          t = ip(this),
          r = op(t),
          n = up(t, 0);
        return (n.length = np(n, t, t, r, 0, void 0 === e ? 1 : ap(e))), n;
      },
    }
  );
  var cp = rp,
    sp = qe,
    fp = ht,
    lp = zn,
    hp = ya;
  _i(
    { target: "Array", proto: !0 },
    {
      flatMap: function (e) {
        var t,
          r = fp(this),
          n = lp(r);
        return (
          sp(e),
          ((t = hp(r, 0)).length = cp(
            t,
            r,
            r,
            n,
            0,
            1,
            e,
            arguments.length > 1 ? arguments[1] : void 0
          )),
          t
        );
      },
    }
  );
  var pp = Oa.forEach,
    dp = Sh("forEach")
      ? [].forEach
      : function (e) {
          return pp(this, e, arguments.length > 1 ? arguments[1] : void 0);
        };
  _i(
    { target: "Array", proto: !0, forced: [].forEach !== dp },
    { forEach: dp }
  );
  var vp = ur,
    gp = $f,
    yp = function (e, t, r, n) {
      try {
        return n ? t(vp(r)[0], r[1]) : t(r);
      } catch (i) {
        gp(e, "throw", i);
      }
    },
    mp = Ko,
    bp = M,
    wp = ht,
    Ep = yp,
    xp = _f,
    Sp = fa,
    Ap = zn,
    Op = $l,
    kp = Wf,
    Tp = Mf,
    Rp = Array,
    Ip = function (e) {
      var t = wp(e),
        r = Sp(this),
        n = arguments.length,
        i = n > 1 ? arguments[1] : void 0,
        o = void 0 !== i;
      o && (i = mp(i, n > 2 ? arguments[2] : void 0));
      var a,
        u,
        c,
        s,
        f,
        l,
        h = Tp(t),
        p = 0;
      if (!h || (this === Rp && xp(h)))
        for (a = Ap(t), u = r ? new this(a) : Rp(a); a > p; p++)
          (l = o ? i(t[p], p) : t[p]), Op(u, p, l);
      else
        for (
          u = r ? new this() : [], f = (s = kp(t, h)).next;
          !(c = bp(f, s)).done;
          p++
        )
          (l = o ? Ep(s, i, [c.value, p], !0) : c.value), Op(u, p, l);
      return (u.length = p), u;
    },
    _p = It("iterator"),
    Pp = !1;
  try {
    var Fp = 0,
      jp = {
        next: function () {
          return { done: !!Fp++ };
        },
        return: function () {
          Pp = !0;
        },
      };
    (jp[_p] = function () {
      return this;
    }),
      Array.from(jp, function () {
        throw 2;
      });
  } catch ($7) {}
  var Cp = function (e, t) {
      try {
        if (!t && !Pp) return !1;
      } catch ($7) {
        return !1;
      }
      var r = !1;
      try {
        var n = {};
        (n[_p] = function () {
          return {
            next: function () {
              return { done: (r = !0) };
            },
          };
        }),
          e(n);
      } catch ($7) {}
      return r;
    },
    Lp = Ip;
  _i(
    {
      target: "Array",
      stat: !0,
      forced: !Cp(function (e) {
        Array.from(e);
      }),
    },
    { from: Lp }
  );
  var Mp = Gn.includes,
    Dp = Dl;
  _i(
    {
      target: "Array",
      proto: !0,
      forced: P(function () {
        return !Array(1).includes();
      }),
    },
    {
      includes: function (e) {
        return Mp(this, e, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  ),
    Dp("includes");
  var Np = _i,
    Up = Gn.indexOf,
    Bp = Sh,
    zp = Vo([].indexOf),
    Hp = !!zp && 1 / zp([1], 1, -0) < 0;
  Np(
    { target: "Array", proto: !0, forced: Hp || !Bp("indexOf") },
    {
      indexOf: function (e) {
        var t = arguments.length > 1 ? arguments[1] : void 0;
        return Hp ? zp(this, e, t) || 0 : Up(this, e, t);
      },
    }
  ),
    _i({ target: "Array", stat: !0 }, { isArray: Xo });
  var Wp,
    qp,
    Vp,
    Gp = P,
    $p = he,
    Yp = de,
    Kp = Of,
    Jp = kn,
    Xp = It("iterator"),
    Qp = !1;
  [].keys &&
    ("next" in (Vp = [].keys())
      ? (qp = Kp(Kp(Vp))) !== Object.prototype && (Wp = qp)
      : (Qp = !0)),
    (!Yp(Wp) ||
      Gp(function () {
        var e = {};
        return Wp[Xp].call(e) !== e;
      })) &&
      (Wp = {}),
    $p(Wp[Xp]) ||
      Jp(Wp, Xp, function () {
        return this;
      });
  var Zp = { IteratorPrototype: Wp, BUGGY_SAFARI_ITERATORS: Qp },
    ed = Zp.IteratorPrototype,
    td = vo,
    rd = W,
    nd = Ho,
    id = kf,
    od = function () {
      return this;
    },
    ad = function (e, t, r, n) {
      var i = t + " Iterator";
      return (
        (e.prototype = td(ed, { next: rd(+!n, r) })),
        nd(e, i, !1),
        (id[i] = od),
        e
      );
    },
    ud = _i,
    cd = M,
    sd = he,
    fd = ad,
    ld = Of,
    hd = vs,
    pd = Ho,
    dd = Er,
    vd = kn,
    gd = kf,
    yd = Rr.PROPER,
    md = Rr.CONFIGURABLE,
    bd = Zp.IteratorPrototype,
    wd = Zp.BUGGY_SAFARI_ITERATORS,
    Ed = It("iterator"),
    xd = "keys",
    Sd = "values",
    Ad = "entries",
    Od = function () {
      return this;
    },
    kd = function (e, t, r, n, i, o, a) {
      fd(r, t, n);
      var u,
        c,
        s,
        f = function (e) {
          if (e === i && v) return v;
          if (!wd && e && e in p) return p[e];
          switch (e) {
            case xd:
            case Sd:
            case Ad:
              return function () {
                return new r(this, e);
              };
          }
          return function () {
            return new r(this);
          };
        },
        l = t + " Iterator",
        h = !1,
        p = e.prototype,
        d = p[Ed] || p["@@iterator"] || (i && p[i]),
        v = (!wd && d) || f(i),
        g = ("Array" === t && p.entries) || d;
      if (
        (g &&
          (u = ld(g.call(new e()))) !== Object.prototype &&
          u.next &&
          (ld(u) !== bd && (hd ? hd(u, bd) : sd(u[Ed]) || vd(u, Ed, Od)),
          pd(u, l, !0)),
        yd &&
          i === Sd &&
          d &&
          d.name !== Sd &&
          (md
            ? dd(p, "name", Sd)
            : ((h = !0),
              (v = function () {
                return cd(d, this);
              }))),
        i)
      )
        if (((c = { values: f(Sd), keys: o ? v : f(xd), entries: f(Ad) }), a))
          for (s in c) (wd || h || !(s in p)) && vd(p, s, c[s]);
        else ud({ target: t, proto: !0, forced: wd || h }, c);
      return p[Ed] !== v && vd(p, Ed, v, { name: i }), (gd[t] = v), c;
    },
    Td = function (e, t) {
      return { value: e, done: t };
    },
    Rd = fe,
    Id = Dl,
    _d = kf,
    Pd = rn,
    Fd = rr.f,
    jd = kd,
    Cd = Td,
    Ld = F,
    Md = "Array Iterator",
    Dd = Pd.set,
    Nd = Pd.getterFor(Md),
    Ud = jd(
      Array,
      "Array",
      function (e, t) {
        Dd(this, { type: Md, target: Rd(e), index: 0, kind: t });
      },
      function () {
        var e = Nd(this),
          t = e.target,
          r = e.index++;
        if (!t || r >= t.length) return (e.target = null), Cd(void 0, !0);
        switch (e.kind) {
          case "keys":
            return Cd(r, !1);
          case "values":
            return Cd(t[r], !1);
        }
        return Cd([r, t[r]], !1);
      },
      "values"
    ),
    Bd = (_d.Arguments = _d.Array);
  if ((Id("keys"), Id("values"), Id("entries"), Ld && "values" !== Bd.name))
    try {
      Fd(Bd, "name", { value: "values" });
    } catch ($7) {}
  var zd = _i,
    Hd = ne,
    Wd = fe,
    qd = Sh,
    Vd = Y([].join);
  zd(
    { target: "Array", proto: !0, forced: Hd !== Object || !qd("join", ",") },
    {
      join: function (e) {
        return Vd(Wd(this), void 0 === e ? "," : e);
      },
    }
  );
  var Gd = tc,
    $d = fe,
    Yd = Fn,
    Kd = zn,
    Jd = Sh,
    Xd = Math.min,
    Qd = [].lastIndexOf,
    Zd = !!Qd && 1 / [1].lastIndexOf(1, -0) < 0,
    ev = Jd("lastIndexOf"),
    tv =
      Zd || !ev
        ? function (e) {
            if (Zd) return Gd(Qd, this, arguments) || 0;
            var t = $d(this),
              r = Kd(t);
            if (0 === r) return -1;
            var n = r - 1;
            for (
              arguments.length > 1 && (n = Xd(n, Yd(arguments[1]))),
                n < 0 && (n = r + n);
              n >= 0;
              n--
            )
              if (n in t && t[n] === e) return n || 0;
            return -1;
          }
        : Qd;
  _i(
    { target: "Array", proto: !0, forced: tv !== [].lastIndexOf },
    { lastIndexOf: tv }
  );
  var rv = Oa.map;
  _i(
    { target: "Array", proto: !0, forced: !Xl("map") },
    {
      map: function (e) {
        return rv(this, e, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  );
  var nv = fa,
    iv = $l,
    ov = Array;
  _i(
    {
      target: "Array",
      stat: !0,
      forced: P(function () {
        function e() {}
        return !(ov.of.call(e) instanceof e);
      }),
    },
    {
      of: function () {
        for (
          var e = 0, t = arguments.length, r = new (nv(this) ? this : ov)(t);
          t > e;

        )
          iv(r, e, arguments[e++]);
        return (r.length = t), r;
      },
    }
  );
  var av = F,
    uv = Xo,
    cv = TypeError,
    sv = Object.getOwnPropertyDescriptor,
    fv =
      av &&
      !(function () {
        if (void 0 !== this) return !0;
        try {
          Object.defineProperty([], "length", { writable: !1 }).length = 1;
        } catch ($7) {
          return $7 instanceof TypeError;
        }
      })()
        ? function (e, t) {
            if (uv(e) && !sv(e, "length").writable)
              throw new cv("Cannot set read only .length");
            return (e.length = t);
          }
        : function (e, t) {
            return (e.length = t);
          },
    lv = ht,
    hv = zn,
    pv = fv,
    dv = Wl;
  _i(
    {
      target: "Array",
      proto: !0,
      arity: 1,
      forced:
        P(function () {
          return 4294967297 !== [].push.call({ length: 4294967296 }, 1);
        }) ||
        !(function () {
          try {
            Object.defineProperty([], "length", { writable: !1 }).push();
          } catch ($7) {
            return $7 instanceof TypeError;
          }
        })(),
    },
    {
      push: function (e) {
        var t = lv(this),
          r = hv(t),
          n = arguments.length;
        dv(r + n);
        for (var i = 0; i < n; i++) (t[r] = arguments[i]), r++;
        return pv(t, r), r;
      },
    }
  );
  var vv = qe,
    gv = ht,
    yv = ne,
    mv = zn,
    bv = TypeError,
    wv = "Reduce of empty array with no initial value",
    Ev = function (e) {
      return function (t, r, n, i) {
        var o = gv(t),
          a = yv(o),
          u = mv(o);
        if ((vv(r), 0 === u && n < 2)) throw new bv(wv);
        var c = e ? u - 1 : 0,
          s = e ? -1 : 1;
        if (n < 2)
          for (;;) {
            if (c in a) {
              (i = a[c]), (c += s);
              break;
            }
            if (((c += s), e ? c < 0 : u <= c)) throw new bv(wv);
          }
        for (; e ? c >= 0 : u > c; c += s) c in a && (i = r(i, a[c], c, o));
        return i;
      };
    },
    xv = { left: Ev(!1), right: Ev(!0) },
    Sv = I,
    Av = Ee,
    Ov = Q,
    kv = function (e) {
      return Av.slice(0, e.length) === e;
    },
    Tv = kv("Bun/")
      ? "BUN"
      : kv("Cloudflare-Workers")
      ? "CLOUDFLARE"
      : kv("Deno/")
      ? "DENO"
      : kv("Node.js/")
      ? "NODE"
      : Sv.Bun && "string" == typeof Bun.version
      ? "BUN"
      : Sv.Deno && "object" == f(Deno.version)
      ? "DENO"
      : "process" === Ov(Sv.process)
      ? "NODE"
      : Sv.window && Sv.document
      ? "BROWSER"
      : "REST",
    Rv = "NODE" === Tv,
    Iv = xv.left;
  _i(
    {
      target: "Array",
      proto: !0,
      forced: (!Rv && Re > 79 && Re < 83) || !Sh("reduce"),
    },
    {
      reduce: function (e) {
        var t = arguments.length;
        return Iv(this, e, t, t > 1 ? arguments[1] : void 0);
      },
    }
  );
  var _v = xv.right;
  _i(
    {
      target: "Array",
      proto: !0,
      forced: (!Rv && Re > 79 && Re < 83) || !Sh("reduceRight"),
    },
    {
      reduceRight: function (e) {
        return _v(
          this,
          e,
          arguments.length,
          arguments.length > 1 ? arguments[1] : void 0
        );
      },
    }
  );
  var Pv = _i,
    Fv = Xo,
    jv = Y([].reverse),
    Cv = [1, 2];
  Pv(
    { target: "Array", proto: !0, forced: String(Cv) === String(Cv.reverse()) },
    {
      reverse: function () {
        return Fv(this) && (this.length = this.length), jv(this);
      },
    }
  );
  var Lv = _i,
    Mv = Xo,
    Dv = fa,
    Nv = de,
    Uv = Mn,
    Bv = zn,
    zv = fe,
    Hv = $l,
    Wv = It,
    qv = yo,
    Vv = Xl("slice"),
    Gv = Wv("species"),
    $v = Array,
    Yv = Math.max;
  Lv(
    { target: "Array", proto: !0, forced: !Vv },
    {
      slice: function (e, t) {
        var r,
          n,
          i,
          o = zv(this),
          a = Bv(o),
          u = Uv(e, a),
          c = Uv(void 0 === t ? a : t, a);
        if (
          Mv(o) &&
          ((r = o.constructor),
          ((Dv(r) && (r === $v || Mv(r.prototype))) ||
            (Nv(r) && null === (r = r[Gv]))) &&
            (r = void 0),
          r === $v || void 0 === r)
        )
          return qv(o, u, c);
        for (
          n = new (void 0 === r ? $v : r)(Yv(c - u, 0)), i = 0;
          u < c;
          u++, i++
        )
          u in o && Hv(n, i, o[u]);
        return (n.length = i), n;
      },
    }
  );
  var Kv = Oa.some;
  _i(
    { target: "Array", proto: !0, forced: !Sh("some") },
    {
      some: function (e) {
        return Kv(this, e, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  );
  var Jv = yo,
    Xv = Math.floor,
    Qv = function (e, t) {
      var r = e.length;
      if (r < 8)
        for (var n, i, o = 1; o < r; ) {
          for (i = o, n = e[o]; i && t(e[i - 1], n) > 0; ) e[i] = e[--i];
          i !== o++ && (e[i] = n);
        }
      else
        for (
          var a = Xv(r / 2),
            u = Qv(Jv(e, 0, a), t),
            c = Qv(Jv(e, a), t),
            s = u.length,
            f = c.length,
            l = 0,
            h = 0;
          l < s || h < f;

        )
          e[l + h] =
            l < s && h < f
              ? t(u[l], c[h]) <= 0
                ? u[l++]
                : c[h++]
              : l < s
              ? u[l++]
              : c[h++];
      return e;
    },
    Zv = Qv,
    eg = Ee.match(/firefox\/(\d+)/i),
    tg = !!eg && +eg[1],
    rg = /MSIE|Trident/.test(Ee),
    ng = Ee.match(/AppleWebKit\/(\d+)\./),
    ig = !!ng && +ng[1],
    og = _i,
    ag = Y,
    ug = qe,
    cg = ht,
    sg = zn,
    fg = dh,
    lg = Hi,
    hg = P,
    pg = Zv,
    dg = Sh,
    vg = tg,
    gg = rg,
    yg = Re,
    mg = ig,
    bg = [],
    wg = ag(bg.sort),
    Eg = ag(bg.push),
    xg = hg(function () {
      bg.sort(void 0);
    }),
    Sg = hg(function () {
      bg.sort(null);
    }),
    Ag = dg("sort"),
    Og = !hg(function () {
      if (yg) return yg < 70;
      if (!(vg && vg > 3)) {
        if (gg) return !0;
        if (mg) return mg < 603;
        var e,
          t,
          r,
          n,
          i = "";
        for (e = 65; e < 76; e++) {
          switch (((t = String.fromCharCode(e)), e)) {
            case 66:
            case 69:
            case 70:
            case 72:
              r = 3;
              break;
            case 68:
            case 71:
              r = 4;
              break;
            default:
              r = 2;
          }
          for (n = 0; n < 47; n++) bg.push({ k: t + n, v: r });
        }
        for (
          bg.sort(function (e, t) {
            return t.v - e.v;
          }),
            n = 0;
          n < bg.length;
          n++
        )
          (t = bg[n].k.charAt(0)), i.charAt(i.length - 1) !== t && (i += t);
        return "DGBEFHACIJK" !== i;
      }
    });
  og(
    { target: "Array", proto: !0, forced: xg || !Sg || !Ag || !Og },
    {
      sort: function (e) {
        void 0 !== e && ug(e);
        var t = cg(this);
        if (Og) return void 0 === e ? wg(t) : wg(t, e);
        var r,
          n,
          i = [],
          o = sg(t);
        for (n = 0; n < o; n++) n in t && Eg(i, t[n]);
        for (
          pg(
            i,
            (function (e) {
              return function (t, r) {
                return void 0 === r
                  ? -1
                  : void 0 === t
                  ? 1
                  : void 0 !== e
                  ? +e(t, r) || 0
                  : lg(t) > lg(r)
                  ? 1
                  : -1;
              };
            })(e)
          ),
            r = sg(i),
            n = 0;
          n < r;

        )
          t[n] = i[n++];
        for (; n < o; ) fg(t, n++);
        return t;
      },
    }
  );
  var kg = ye,
    Tg = Oo,
    Rg = F,
    Ig = It("species"),
    _g = function (e) {
      var t = kg(e);
      Rg &&
        t &&
        !t[Ig] &&
        Tg(t, Ig, {
          configurable: !0,
          get: function () {
            return this;
          },
        });
    };
  _g("Array");
  var Pg = _i,
    Fg = ht,
    jg = Mn,
    Cg = Fn,
    Lg = zn,
    Mg = fv,
    Dg = Wl,
    Ng = ya,
    Ug = $l,
    Bg = dh,
    zg = Xl("splice"),
    Hg = Math.max,
    Wg = Math.min;
  Pg(
    { target: "Array", proto: !0, forced: !zg },
    {
      splice: function (e, t) {
        var r,
          n,
          i,
          o,
          a,
          u,
          c = Fg(this),
          s = Lg(c),
          f = jg(e, s),
          l = arguments.length;
        for (
          0 === l
            ? (r = n = 0)
            : 1 === l
            ? ((r = 0), (n = s - f))
            : ((r = l - 2), (n = Wg(Hg(Cg(t), 0), s - f))),
            Dg(s + r - n),
            i = Ng(c, n),
            o = 0;
          o < n;
          o++
        )
          (a = f + o) in c && Ug(i, o, c[a]);
        if (((i.length = n), r < n)) {
          for (o = f; o < s - n; o++)
            (u = o + r), (a = o + n) in c ? (c[u] = c[a]) : Bg(c, u);
          for (o = s; o > s - n + r; o--) Bg(c, o - 1);
        } else if (r > n)
          for (o = s - n; o > f; o--)
            (u = o + r - 1), (a = o + n - 1) in c ? (c[u] = c[a]) : Bg(c, u);
        for (o = 0; o < r; o++) c[o + f] = arguments[o + 2];
        return Mg(c, s - n + r), i;
      },
    }
  );
  var qg = zn,
    Vg = function (e, t) {
      for (var r = qg(e), n = new t(r), i = 0; i < r; i++) n[i] = e[r - i - 1];
      return n;
    },
    Gg = Vg,
    $g = fe,
    Yg = Dl,
    Kg = Array;
  _i(
    { target: "Array", proto: !0 },
    {
      toReversed: function () {
        return Gg($g(this), Kg);
      },
    }
  ),
    Yg("toReversed");
  var Jg = zn,
    Xg = function (e, t, r) {
      for (
        var n = 0, i = arguments.length > 2 ? r : Jg(t), o = new e(i);
        i > n;

      )
        o[n] = t[n++];
      return o;
    },
    Qg = I,
    Zg = _i,
    ey = qe,
    ty = fe,
    ry = Xg,
    ny = Dl,
    iy = Array,
    oy = Y(
      (function (e, t) {
        var r = Qg[e],
          n = r && r.prototype;
        return n && n[t];
      })("Array", "sort")
    );
  Zg(
    { target: "Array", proto: !0 },
    {
      toSorted: function (e) {
        void 0 !== e && ey(e);
        var t = ty(this),
          r = ry(iy, t);
        return oy(r, e);
      },
    }
  ),
    ny("toSorted");
  var ay = _i,
    uy = Dl,
    cy = Wl,
    sy = zn,
    fy = Mn,
    ly = fe,
    hy = Fn,
    py = Array,
    dy = Math.max,
    vy = Math.min;
  ay(
    { target: "Array", proto: !0 },
    {
      toSpliced: function (e, t) {
        var r,
          n,
          i,
          o,
          a = ly(this),
          u = sy(a),
          c = fy(e, u),
          s = arguments.length,
          f = 0;
        for (
          0 === s
            ? (r = n = 0)
            : 1 === s
            ? ((r = 0), (n = u - c))
            : ((r = s - 2), (n = vy(dy(hy(t), 0), u - c))),
            i = cy(u + r - n),
            o = py(i);
          f < c;
          f++
        )
          o[f] = a[f];
        for (; f < c + r; f++) o[f] = arguments[f - c + 2];
        for (; f < i; f++) o[f] = a[f + n - r];
        return o;
      },
    }
  ),
    uy("toSpliced"),
    Dl("flat"),
    Dl("flatMap");
  var gy = ht,
    yy = zn,
    my = fv,
    by = dh,
    wy = Wl;
  _i(
    {
      target: "Array",
      proto: !0,
      arity: 1,
      forced:
        1 !== [].unshift(0) ||
        !(function () {
          try {
            Object.defineProperty([], "length", { writable: !1 }).unshift();
          } catch ($7) {
            return $7 instanceof TypeError;
          }
        })(),
    },
    {
      unshift: function (e) {
        var t = gy(this),
          r = yy(t),
          n = arguments.length;
        if (n) {
          wy(r + n);
          for (var i = r; i--; ) {
            var o = i + n;
            i in t ? (t[o] = t[i]) : by(t, o);
          }
          for (var a = 0; a < n; a++) t[a] = arguments[a];
        }
        return my(t, r + n);
      },
    }
  );
  var Ey = zn,
    xy = Fn,
    Sy = RangeError,
    Ay = function (e, t, r, n) {
      var i = Ey(e),
        o = xy(r),
        a = o < 0 ? i + o : o;
      if (a >= i || a < 0) throw new Sy("Incorrect index");
      for (var u = new t(i), c = 0; c < i; c++) u[c] = c === a ? n : e[c];
      return u;
    },
    Oy = Ay,
    ky = fe,
    Ty = Array;
  _i(
    { target: "Array", proto: !0 },
    {
      with: function (e, t) {
        return Oy(ky(this), Ty, e, t);
      },
    }
  );
  var Ry = "undefined" != typeof ArrayBuffer && "undefined" != typeof DataView,
    Iy = kn,
    _y = function (e, t, r) {
      for (var n in t) Iy(e, n, t[n], r);
      return e;
    },
    Py = me,
    Fy = TypeError,
    jy = function (e, t) {
      if (Py(t, e)) return e;
      throw new Fy("Incorrect invocation");
    },
    Cy = Fn,
    Ly = Un,
    My = RangeError,
    Dy = function (e) {
      if (void 0 === e) return 0;
      var t = Cy(e),
        r = Ly(t);
      if (t !== r) throw new My("Wrong length or index");
      return r;
    },
    Ny =
      Math.sign ||
      function (e) {
        var t = +e;
        return 0 === t || t != t ? t : t < 0 ? -1 : 1;
      },
    Uy = 4503599627370496,
    By = Ny,
    zy = function (e) {
      return e + Uy - Uy;
    },
    Hy = Math.abs,
    Wy = function (e, t, r, n) {
      var i = +e,
        o = Hy(i),
        a = By(i);
      if (o < n) return a * zy(o / n / t) * n * t;
      var u = (1 + t / 2220446049250313e-31) * o,
        c = u - (u - o);
      return c > r || c != c ? a * (1 / 0) : a * c;
    },
    qy =
      Math.fround ||
      function (e) {
        return Wy(
          e,
          1.1920928955078125e-7,
          34028234663852886e22,
          11754943508222875e-54
        );
      },
    Vy = Array,
    Gy = Math.abs,
    $y = Math.pow,
    Yy = Math.floor,
    Ky = Math.log,
    Jy = Math.LN2,
    Xy = I,
    Qy = Y,
    Zy = F,
    em = Ry,
    tm = Er,
    rm = Oo,
    nm = _y,
    im = P,
    om = jy,
    am = Fn,
    um = Un,
    cm = Dy,
    sm = qy,
    fm = {
      pack: function (e, t, r) {
        var n,
          i,
          o,
          a = Vy(r),
          u = 8 * r - t - 1,
          c = (1 << u) - 1,
          s = c >> 1,
          f = 23 === t ? $y(2, -24) - $y(2, -77) : 0,
          l = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0,
          h = 0;
        for (
          (e = Gy(e)) != e || e === 1 / 0
            ? ((i = e != e ? 1 : 0), (n = c))
            : ((n = Yy(Ky(e) / Jy)),
              e * (o = $y(2, -n)) < 1 && (n--, (o *= 2)),
              (e += n + s >= 1 ? f / o : f * $y(2, 1 - s)) * o >= 2 &&
                (n++, (o /= 2)),
              n + s >= c
                ? ((i = 0), (n = c))
                : n + s >= 1
                ? ((i = (e * o - 1) * $y(2, t)), (n += s))
                : ((i = e * $y(2, s - 1) * $y(2, t)), (n = 0)));
          t >= 8;

        )
          (a[h++] = 255 & i), (i /= 256), (t -= 8);
        for (n = (n << t) | i, u += t; u > 0; )
          (a[h++] = 255 & n), (n /= 256), (u -= 8);
        return (a[h - 1] |= 128 * l), a;
      },
      unpack: function (e, t) {
        var r,
          n = e.length,
          i = 8 * n - t - 1,
          o = (1 << i) - 1,
          a = o >> 1,
          u = i - 7,
          c = n - 1,
          s = e[c--],
          f = 127 & s;
        for (s >>= 7; u > 0; ) (f = 256 * f + e[c--]), (u -= 8);
        for (r = f & ((1 << -u) - 1), f >>= -u, u += t; u > 0; )
          (r = 256 * r + e[c--]), (u -= 8);
        if (0 === f) f = 1 - a;
        else {
          if (f === o) return r ? NaN : s ? -1 / 0 : 1 / 0;
          (r += $y(2, t)), (f -= a);
        }
        return (s ? -1 : 1) * r * $y(2, f - t);
      },
    },
    lm = Of,
    hm = vs,
    pm = Rh,
    dm = yo,
    vm = Es,
    gm = pi,
    ym = Ho,
    mm = rn,
    bm = Rr.PROPER,
    wm = Rr.CONFIGURABLE,
    Em = "ArrayBuffer",
    xm = "DataView",
    Sm = "prototype",
    Am = "Wrong index",
    Om = mm.getterFor(Em),
    km = mm.getterFor(xm),
    Tm = mm.set,
    Rm = Xy[Em],
    Im = Rm,
    _m = Im && Im[Sm],
    Pm = Xy[xm],
    Fm = Pm && Pm[Sm],
    jm = Object.prototype,
    Cm = Xy.Array,
    Lm = Xy.RangeError,
    Mm = Qy(pm),
    Dm = Qy([].reverse),
    Nm = fm.pack,
    Um = fm.unpack,
    Bm = function (e) {
      return [255 & e];
    },
    zm = function (e) {
      return [255 & e, (e >> 8) & 255];
    },
    Hm = function (e) {
      return [255 & e, (e >> 8) & 255, (e >> 16) & 255, (e >> 24) & 255];
    },
    Wm = function (e) {
      return (e[3] << 24) | (e[2] << 16) | (e[1] << 8) | e[0];
    },
    qm = function (e) {
      return Nm(sm(e), 23, 4);
    },
    Vm = function (e) {
      return Nm(e, 52, 8);
    },
    Gm = function (e, t, r) {
      rm(e[Sm], t, {
        configurable: !0,
        get: function () {
          return r(this)[t];
        },
      });
    },
    $m = function (e, t, r, n) {
      var i = km(e),
        o = cm(r),
        a = !!n;
      if (o + t > i.byteLength) throw new Lm(Am);
      var u = i.bytes,
        c = o + i.byteOffset,
        s = dm(u, c, c + t);
      return a ? s : Dm(s);
    },
    Ym = function (e, t, r, n, i, o) {
      var a = km(e),
        u = cm(r),
        c = n(+i),
        s = !!o;
      if (u + t > a.byteLength) throw new Lm(Am);
      for (var f = a.bytes, l = u + a.byteOffset, h = 0; h < t; h++)
        f[l + h] = c[s ? h : t - h - 1];
    };
  if (em) {
    var Km = bm && Rm.name !== Em;
    im(function () {
      Rm(1);
    }) &&
    im(function () {
      new Rm(-1);
    }) &&
    !im(function () {
      return new Rm(), new Rm(1.5), new Rm(NaN), 1 !== Rm.length || (Km && !wm);
    })
      ? Km && wm && tm(Rm, "name", Em)
      : (((Im = function (e) {
          return om(this, _m), vm(new Rm(cm(e)), this, Im);
        })[Sm] = _m),
        (_m.constructor = Im),
        gm(Im, Rm)),
      hm && lm(Fm) !== jm && hm(Fm, jm);
    var Jm = new Pm(new Im(2)),
      Xm = Qy(Fm.setInt8);
    Jm.setInt8(0, 2147483648),
      Jm.setInt8(1, 2147483649),
      (!Jm.getInt8(0) && Jm.getInt8(1)) ||
        nm(
          Fm,
          {
            setInt8: function (e, t) {
              Xm(this, e, (t << 24) >> 24);
            },
            setUint8: function (e, t) {
              Xm(this, e, (t << 24) >> 24);
            },
          },
          { unsafe: !0 }
        );
  } else
    (_m = (Im = function (e) {
      om(this, _m);
      var t = cm(e);
      Tm(this, { type: Em, bytes: Mm(Cm(t), 0), byteLength: t }),
        Zy || ((this.byteLength = t), (this.detached = !1));
    })[Sm]),
      (Fm = (Pm = function (e, t, r) {
        om(this, Fm), om(e, _m);
        var n = Om(e),
          i = n.byteLength,
          o = am(t);
        if (o < 0 || o > i) throw new Lm("Wrong offset");
        if (o + (r = void 0 === r ? i - o : um(r)) > i)
          throw new Lm("Wrong length");
        Tm(this, {
          type: xm,
          buffer: e,
          byteLength: r,
          byteOffset: o,
          bytes: n.bytes,
        }),
          Zy ||
            ((this.buffer = e), (this.byteLength = r), (this.byteOffset = o));
      })[Sm]),
      Zy &&
        (Gm(Im, "byteLength", Om),
        Gm(Pm, "buffer", km),
        Gm(Pm, "byteLength", km),
        Gm(Pm, "byteOffset", km)),
      nm(Fm, {
        getInt8: function (e) {
          return ($m(this, 1, e)[0] << 24) >> 24;
        },
        getUint8: function (e) {
          return $m(this, 1, e)[0];
        },
        getInt16: function (e) {
          var t = $m(this, 2, e, arguments.length > 1 && arguments[1]);
          return (((t[1] << 8) | t[0]) << 16) >> 16;
        },
        getUint16: function (e) {
          var t = $m(this, 2, e, arguments.length > 1 && arguments[1]);
          return (t[1] << 8) | t[0];
        },
        getInt32: function (e) {
          return Wm($m(this, 4, e, arguments.length > 1 && arguments[1]));
        },
        getUint32: function (e) {
          return Wm($m(this, 4, e, arguments.length > 1 && arguments[1])) >>> 0;
        },
        getFloat32: function (e) {
          return Um($m(this, 4, e, arguments.length > 1 && arguments[1]), 23);
        },
        getFloat64: function (e) {
          return Um($m(this, 8, e, arguments.length > 1 && arguments[1]), 52);
        },
        setInt8: function (e, t) {
          Ym(this, 1, e, Bm, t);
        },
        setUint8: function (e, t) {
          Ym(this, 1, e, Bm, t);
        },
        setInt16: function (e, t) {
          Ym(this, 2, e, zm, t, arguments.length > 2 && arguments[2]);
        },
        setUint16: function (e, t) {
          Ym(this, 2, e, zm, t, arguments.length > 2 && arguments[2]);
        },
        setInt32: function (e, t) {
          Ym(this, 4, e, Hm, t, arguments.length > 2 && arguments[2]);
        },
        setUint32: function (e, t) {
          Ym(this, 4, e, Hm, t, arguments.length > 2 && arguments[2]);
        },
        setFloat32: function (e, t) {
          Ym(this, 4, e, qm, t, arguments.length > 2 && arguments[2]);
        },
        setFloat64: function (e, t) {
          Ym(this, 8, e, Vm, t, arguments.length > 2 && arguments[2]);
        },
      });
  ym(Im, Em), ym(Pm, xm);
  var Qm = { ArrayBuffer: Im, DataView: Pm },
    Zm = _g,
    eb = "ArrayBuffer",
    tb = Qm[eb];
  _i(
    { global: !0, constructor: !0, forced: I[eb] !== tb },
    { ArrayBuffer: tb }
  ),
    Zm(eb);
  var rb,
    nb,
    ib,
    ob = Ry,
    ab = F,
    ub = I,
    cb = he,
    sb = de,
    fb = vt,
    lb = Ui,
    hb = Be,
    pb = Er,
    db = kn,
    vb = Oo,
    gb = me,
    yb = Of,
    mb = vs,
    bb = It,
    wb = wt,
    Eb = rn.enforce,
    xb = rn.get,
    Sb = ub.Int8Array,
    Ab = Sb && Sb.prototype,
    Ob = ub.Uint8ClampedArray,
    kb = Ob && Ob.prototype,
    Tb = Sb && yb(Sb),
    Rb = Ab && yb(Ab),
    Ib = Object.prototype,
    _b = ub.TypeError,
    Pb = bb("toStringTag"),
    Fb = wb("TYPED_ARRAY_TAG"),
    jb = "TypedArrayConstructor",
    Cb = ob && !!mb && "Opera" !== lb(ub.opera),
    Lb = !1,
    Mb = {
      Int8Array: 1,
      Uint8Array: 1,
      Uint8ClampedArray: 1,
      Int16Array: 2,
      Uint16Array: 2,
      Int32Array: 4,
      Uint32Array: 4,
      Float32Array: 4,
      Float64Array: 8,
    },
    Db = { BigInt64Array: 8, BigUint64Array: 8 },
    Nb = function (e) {
      var t = yb(e);
      if (sb(t)) {
        var r = xb(t);
        return r && fb(r, jb) ? r[jb] : Nb(t);
      }
    },
    Ub = function (e) {
      if (!sb(e)) return !1;
      var t = lb(e);
      return fb(Mb, t) || fb(Db, t);
    };
  for (rb in Mb)
    (ib = (nb = ub[rb]) && nb.prototype) ? (Eb(ib)[jb] = nb) : (Cb = !1);
  for (rb in Db) (ib = (nb = ub[rb]) && nb.prototype) && (Eb(ib)[jb] = nb);
  if (
    (!Cb || !cb(Tb) || Tb === Function.prototype) &&
    ((Tb = function () {
      throw new _b("Incorrect invocation");
    }),
    Cb)
  )
    for (rb in Mb) ub[rb] && mb(ub[rb], Tb);
  if ((!Cb || !Rb || Rb === Ib) && ((Rb = Tb.prototype), Cb))
    for (rb in Mb) ub[rb] && mb(ub[rb].prototype, Rb);
  if ((Cb && yb(kb) !== Rb && mb(kb, Rb), ab && !fb(Rb, Pb)))
    for (rb in ((Lb = !0),
    vb(Rb, Pb, {
      configurable: !0,
      get: function () {
        return sb(this) ? this[Fb] : void 0;
      },
    }),
    Mb))
      ub[rb] && pb(ub[rb], Fb, rb);
  var Bb = {
    NATIVE_ARRAY_BUFFER_VIEWS: Cb,
    TYPED_ARRAY_TAG: Lb && Fb,
    aTypedArray: function (e) {
      if (Ub(e)) return e;
      throw new _b("Target is not a typed array");
    },
    aTypedArrayConstructor: function (e) {
      if (cb(e) && (!mb || gb(Tb, e))) return e;
      throw new _b(hb(e) + " is not a typed array constructor");
    },
    exportTypedArrayMethod: function (e, t, r, n) {
      if (ab) {
        if (r)
          for (var i in Mb) {
            var o = ub[i];
            if (o && fb(o.prototype, e))
              try {
                delete o.prototype[e];
              } catch ($7) {
                try {
                  o.prototype[e] = t;
                } catch (a) {}
              }
          }
        (Rb[e] && !r) || db(Rb, e, r ? t : (Cb && Ab[e]) || t, n);
      }
    },
    exportTypedArrayStaticMethod: function (e, t, r) {
      var n, i;
      if (ab) {
        if (mb) {
          if (r)
            for (n in Mb)
              if ((i = ub[n]) && fb(i, e))
                try {
                  delete i[e];
                } catch ($7) {}
          if (Tb[e] && !r) return;
          try {
            return db(Tb, e, r ? t : (Cb && Tb[e]) || t);
          } catch ($7) {}
        }
        for (n in Mb) !(i = ub[n]) || (i[e] && !r) || db(i, e, t);
      }
    },
    getTypedArrayConstructor: Nb,
    isView: function (e) {
      if (!sb(e)) return !1;
      var t = lb(e);
      return "DataView" === t || fb(Mb, t) || fb(Db, t);
    },
    isTypedArray: Ub,
    TypedArray: Tb,
    TypedArrayPrototype: Rb,
  };
  _i(
    { target: "ArrayBuffer", stat: !0, forced: !Bb.NATIVE_ARRAY_BUFFER_VIEWS },
    { isView: Bb.isView }
  );
  var zb = _i,
    Hb = Vo,
    Wb = P,
    qb = ur,
    Vb = Mn,
    Gb = Un,
    $b = Qm.ArrayBuffer,
    Yb = Qm.DataView,
    Kb = Yb.prototype,
    Jb = Hb($b.prototype.slice),
    Xb = Hb(Kb.getUint8),
    Qb = Hb(Kb.setUint8);
  zb(
    {
      target: "ArrayBuffer",
      proto: !0,
      unsafe: !0,
      forced: Wb(function () {
        return !new $b(2).slice(1, void 0).byteLength;
      }),
    },
    {
      slice: function (e, t) {
        if (Jb && void 0 === t) return Jb(qb(this), e);
        for (
          var r = qb(this).byteLength,
            n = Vb(e, r),
            i = Vb(void 0 === t ? r : t, r),
            o = new $b(Gb(i - n)),
            a = new Yb(this),
            u = new Yb(o),
            c = 0;
          n < i;

        )
          Qb(u, c++, Xb(a, n++));
        return o;
      },
    }
  ),
    _i({ global: !0, constructor: !0, forced: !Ry }, { DataView: Qm.DataView });
  var Zb = I,
    ew = is,
    tw = Q,
    rw = Zb.ArrayBuffer,
    nw = Zb.TypeError,
    iw =
      (rw && ew(rw.prototype, "byteLength", "get")) ||
      function (e) {
        if ("ArrayBuffer" !== tw(e)) throw new nw("ArrayBuffer expected");
        return e.byteLength;
      },
    ow = Ry,
    aw = iw,
    uw = I.DataView,
    cw = function (e) {
      if (!ow || 0 !== aw(e)) return !1;
      try {
        return new uw(e), !1;
      } catch ($7) {
        return !0;
      }
    },
    sw = F,
    fw = Oo,
    lw = cw,
    hw = ArrayBuffer.prototype;
  sw &&
    !("detached" in hw) &&
    fw(hw, "detached", {
      configurable: !0,
      get: function () {
        return lw(this);
      },
    });
  var pw,
    dw,
    vw,
    gw,
    yw = cw,
    mw = TypeError,
    bw = I,
    ww = Rv,
    Ew = function (e) {
      if (ww) {
        try {
          return bw.process.getBuiltinModule(e);
        } catch ($7) {}
        try {
          return Function('return require("' + e + '")')();
        } catch ($7) {}
      }
    },
    xw = P,
    Sw = Re,
    Aw = Tv,
    Ow = I.structuredClone,
    kw =
      !!Ow &&
      !xw(function () {
        if (
          ("DENO" === Aw && Sw > 92) ||
          ("NODE" === Aw && Sw > 94) ||
          ("BROWSER" === Aw && Sw > 97)
        )
          return !1;
        var e = new ArrayBuffer(8),
          t = Ow(e, { transfer: [e] });
        return 0 !== e.byteLength || 8 !== t.byteLength;
      }),
    Tw = I,
    Rw = Ew,
    Iw = kw,
    _w = Tw.structuredClone,
    Pw = Tw.ArrayBuffer,
    Fw = Tw.MessageChannel,
    jw = !1;
  if (Iw)
    jw = function (e) {
      _w(e, { transfer: [e] });
    };
  else if (Pw)
    try {
      Fw || ((pw = Rw("worker_threads")) && (Fw = pw.MessageChannel)),
        Fw &&
          ((dw = new Fw()),
          (vw = new Pw(2)),
          (gw = function (e) {
            dw.port1.postMessage(null, [e]);
          }),
          2 === vw.byteLength && (gw(vw), 0 === vw.byteLength && (jw = gw)));
    } catch ($7) {}
  var Cw = jw,
    Lw = I,
    Mw = Y,
    Dw = is,
    Nw = Dy,
    Uw = function (e) {
      if (yw(e)) throw new mw("ArrayBuffer is detached");
      return e;
    },
    Bw = iw,
    zw = Cw,
    Hw = kw,
    Ww = Lw.structuredClone,
    qw = Lw.ArrayBuffer,
    Vw = Lw.DataView,
    Gw = Math.min,
    $w = qw.prototype,
    Yw = Vw.prototype,
    Kw = Mw($w.slice),
    Jw = Dw($w, "resizable", "get"),
    Xw = Dw($w, "maxByteLength", "get"),
    Qw = Mw(Yw.getInt8),
    Zw = Mw(Yw.setInt8),
    eE =
      (Hw || zw) &&
      function (e, t, r) {
        var n,
          i = Bw(e),
          o = void 0 === t ? i : Nw(t),
          a = !Jw || !Jw(e);
        if (
          (Uw(e), Hw && ((e = Ww(e, { transfer: [e] })), i === o && (r || a)))
        )
          return e;
        if (i >= o && (!r || a)) n = Kw(e, 0, o);
        else {
          var u = r && !a && Xw ? { maxByteLength: Xw(e) } : void 0;
          n = new qw(o, u);
          for (
            var c = new Vw(e), s = new Vw(n), f = Gw(o, i), l = 0;
            l < f;
            l++
          )
            Zw(s, l, Qw(c, l));
        }
        return Hw || zw(e), n;
      },
    tE = eE;
  tE &&
    _i(
      { target: "ArrayBuffer", proto: !0 },
      {
        transfer: function () {
          return tE(this, arguments.length ? arguments[0] : void 0, !0);
        },
      }
    );
  var rE = eE;
  rE &&
    _i(
      { target: "ArrayBuffer", proto: !0 },
      {
        transferToFixedLength: function () {
          return rE(this, arguments.length ? arguments[0] : void 0, !1);
        },
      }
    );
  var nE = _i,
    iE = Y,
    oE = P(function () {
      return 120 !== new Date(16e11).getYear();
    }),
    aE = iE(Date.prototype.getFullYear);
  nE(
    { target: "Date", proto: !0, forced: oE },
    {
      getYear: function () {
        return aE(this) - 1900;
      },
    }
  );
  var uE = _i,
    cE = Date,
    sE = Y(cE.prototype.getTime);
  uE(
    { target: "Date", stat: !0 },
    {
      now: function () {
        return sE(new cE());
      },
    }
  );
  var fE = _i,
    lE = Y,
    hE = Fn,
    pE = Date.prototype,
    dE = lE(pE.getTime),
    vE = lE(pE.setFullYear);
  fE(
    { target: "Date", proto: !0 },
    {
      setYear: function (e) {
        dE(this);
        var t = hE(e);
        return vE(this, t >= 0 && t <= 99 ? t + 1900 : t);
      },
    }
  ),
    _i(
      { target: "Date", proto: !0 },
      { toGMTString: Date.prototype.toUTCString }
    );
  var gE = Fn,
    yE = Hi,
    mE = ue,
    bE = RangeError,
    wE = function (e) {
      var t = yE(mE(this)),
        r = "",
        n = gE(e);
      if (n < 0 || n === 1 / 0) throw new bE("Wrong number of repetitions");
      for (; n > 0; (n >>>= 1) && (t += t)) 1 & n && (r += t);
      return r;
    },
    EE = Y,
    xE = Un,
    SE = Hi,
    AE = ue,
    OE = EE(wE),
    kE = EE("".slice),
    TE = Math.ceil,
    RE = function (e) {
      return function (t, r, n) {
        var i,
          o,
          a = SE(AE(t)),
          u = xE(r),
          c = a.length,
          s = void 0 === n ? " " : SE(n);
        return u <= c || "" === s
          ? a
          : ((o = OE(s, TE((i = u - c) / s.length))).length > i &&
              (o = kE(o, 0, i)),
            e ? a + o : o + a);
      };
    },
    IE = { start: RE(!1), end: RE(!0) },
    _E = Y,
    PE = P,
    FE = IE.start,
    jE = RangeError,
    CE = isFinite,
    LE = Math.abs,
    ME = Date.prototype,
    DE = ME.toISOString,
    NE = _E(ME.getTime),
    UE = _E(ME.getUTCDate),
    BE = _E(ME.getUTCFullYear),
    zE = _E(ME.getUTCHours),
    HE = _E(ME.getUTCMilliseconds),
    WE = _E(ME.getUTCMinutes),
    qE = _E(ME.getUTCMonth),
    VE = _E(ME.getUTCSeconds),
    GE =
      PE(function () {
        return (
          "0385-07-25T07:06:39.999Z" !== DE.call(new Date(-50000000000001))
        );
      }) ||
      !PE(function () {
        DE.call(new Date(NaN));
      })
        ? function () {
            if (!CE(NE(this))) throw new jE("Invalid time value");
            var e = this,
              t = BE(e),
              r = HE(e),
              n = t < 0 ? "-" : t > 9999 ? "+" : "";
            return (
              n +
              FE(LE(t), n ? 6 : 4, 0) +
              "-" +
              FE(qE(e) + 1, 2, 0) +
              "-" +
              FE(UE(e), 2, 0) +
              "T" +
              FE(zE(e), 2, 0) +
              ":" +
              FE(WE(e), 2, 0) +
              ":" +
              FE(VE(e), 2, 0) +
              "." +
              FE(r, 3, 0) +
              "Z"
            );
          }
        : DE;
  _i(
    { target: "Date", proto: !0, forced: Date.prototype.toISOString !== GE },
    { toISOString: GE }
  );
  var $E = ht,
    YE = Dt;
  _i(
    {
      target: "Date",
      proto: !0,
      arity: 1,
      forced: P(function () {
        return (
          null !== new Date(NaN).toJSON() ||
          1 !==
            Date.prototype.toJSON.call({
              toISOString: function () {
                return 1;
              },
            })
        );
      }),
    },
    {
      toJSON: function (e) {
        var t = $E(this),
          r = YE(t, "number");
        return "number" != typeof r || isFinite(r) ? t.toISOString() : null;
      },
    }
  );
  var KE = ur,
    JE = Qe,
    XE = TypeError,
    QE = vt,
    ZE = kn,
    ex = function (e) {
      if ((KE(this), "string" === e || "default" === e)) e = "string";
      else if ("number" !== e) throw new XE("Incorrect hint");
      return JE(this, e);
    },
    tx = It("toPrimitive"),
    rx = Date.prototype;
  QE(rx, tx) || ZE(rx, tx, ex);
  var nx = Y,
    ix = kn,
    ox = Date.prototype,
    ax = "Invalid Date",
    ux = "toString",
    cx = nx(ox[ux]),
    sx = nx(ox.getTime);
  String(new Date(NaN)) !== ax &&
    ix(ox, ux, function () {
      var e = sx(this);
      return e == e ? cx(this) : ax;
    });
  var fx = _i,
    lx = Y,
    hx = Hi,
    px = lx("".charAt),
    dx = lx("".charCodeAt),
    vx = lx(/./.exec),
    gx = lx((1).toString),
    yx = lx("".toUpperCase),
    mx = /[\w*+\-./@]/,
    bx = function (e, t) {
      for (var r = gx(e, 16); r.length < t; ) r = "0" + r;
      return r;
    };
  fx(
    { global: !0 },
    {
      escape: function (e) {
        for (var t, r, n = hx(e), i = "", o = n.length, a = 0; a < o; )
          (t = px(n, a++)),
            vx(mx, t)
              ? (i += t)
              : (i +=
                  (r = dx(t, 0)) < 256 ? "%" + bx(r, 2) : "%u" + yx(bx(r, 4)));
        return i;
      },
    }
  );
  var wx = Y,
    Ex = qe,
    xx = de,
    Sx = vt,
    Ax = yo,
    Ox = j,
    kx = Function,
    Tx = wx([].concat),
    Rx = wx([].join),
    Ix = {},
    _x = Ox
      ? kx.bind
      : function (e) {
          var t = Ex(this),
            r = t.prototype,
            n = Ax(arguments, 1),
            i = function () {
              var r = Tx(n, Ax(arguments));
              return this instanceof i
                ? (function (e, t, r) {
                    if (!Sx(Ix, t)) {
                      for (var n = [], i = 0; i < t; i++) n[i] = "a[" + i + "]";
                      Ix[t] = kx("C,a", "return new C(" + Rx(n, ",") + ")");
                    }
                    return Ix[t](e, r);
                  })(t, r.length, r)
                : t.apply(e, r);
            };
          return xx(r) && (i.prototype = r), i;
        },
    Px = _x;
  _i(
    { target: "Function", proto: !0, forced: Function.bind !== Px },
    { bind: Px }
  );
  var Fx = he,
    jx = de,
    Cx = rr,
    Lx = me,
    Mx = En,
    Dx = It("hasInstance"),
    Nx = Function.prototype;
  Dx in Nx ||
    Cx.f(Nx, Dx, {
      value: Mx(function (e) {
        if (!Fx(this) || !jx(e)) return !1;
        var t = this.prototype;
        return jx(t) ? Lx(t, e) : e instanceof this;
      }, Dx),
    });
  var Ux = F,
    Bx = Rr.EXISTS,
    zx = Y,
    Hx = Oo,
    Wx = Function.prototype,
    qx = zx(Wx.toString),
    Vx = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/,
    Gx = zx(Vx.exec);
  Ux &&
    !Bx &&
    Hx(Wx, "name", {
      configurable: !0,
      get: function () {
        try {
          return Gx(Vx, qx(this))[1];
        } catch ($7) {
          return "";
        }
      },
    });
  var $x = I;
  _i({ global: !0, forced: $x.globalThis !== $x }, { globalThis: $x });
  var Yx = _i,
    Kx = I,
    Jx = jy,
    Xx = ur,
    Qx = he,
    Zx = Of,
    eS = Oo,
    tS = $l,
    rS = P,
    nS = vt,
    iS = Zp.IteratorPrototype,
    oS = F,
    aS = "constructor",
    uS = "Iterator",
    cS = It("toStringTag"),
    sS = TypeError,
    fS = Kx[uS],
    lS =
      !Qx(fS) ||
      fS.prototype !== iS ||
      !rS(function () {
        fS({});
      }),
    hS = function () {
      if ((Jx(this, iS), Zx(this) === iS))
        throw new sS("Abstract class Iterator not directly constructable");
    },
    pS = function (e, t) {
      oS
        ? eS(iS, e, {
            configurable: !0,
            get: function () {
              return t;
            },
            set: function (t) {
              if ((Xx(this), this === iS))
                throw new sS("You can't redefine this property");
              nS(this, e) ? (this[e] = t) : tS(this, e, t);
            },
          })
        : (iS[e] = t);
    };
  nS(iS, cS) || pS(cS, uS),
    (!lS && nS(iS, aS) && iS[aS] !== Object) || pS(aS, hS),
    (hS.prototype = iS),
    Yx({ global: !0, constructor: !0, forced: lS }, { Iterator: hS });
  var dS = function (e) {
      return { iterator: e, next: e.next, done: !1 };
    },
    vS = RangeError,
    gS = function (e) {
      if (e == e) return e;
      throw new vS("NaN is not allowed");
    },
    yS = Fn,
    mS = RangeError,
    bS = function (e) {
      var t = yS(e);
      if (t < 0) throw new mS("The argument can't be less than 0");
      return t;
    },
    wS = M,
    ES = vo,
    xS = Er,
    SS = _y,
    AS = rn,
    OS = $e,
    kS = Zp.IteratorPrototype,
    TS = Td,
    RS = $f,
    IS = It("toStringTag"),
    _S = "IteratorHelper",
    PS = "WrapForValidIterator",
    FS = AS.set,
    jS = function (e) {
      var t = AS.getterFor(e ? PS : _S);
      return SS(ES(kS), {
        next: function () {
          var r = t(this);
          if (e) return r.nextHandler();
          if (r.done) return TS(void 0, !0);
          try {
            var n = r.nextHandler();
            return r.returnHandlerResult ? n : TS(n, r.done);
          } catch ($7) {
            throw ((r.done = !0), $7);
          }
        },
        return: function () {
          var r = t(this),
            n = r.iterator;
          if (((r.done = !0), e)) {
            var i = OS(n, "return");
            return i ? wS(i, n) : TS(void 0, !0);
          }
          if (r.inner)
            try {
              RS(r.inner.iterator, "normal");
            } catch ($7) {
              return RS(n, "throw", $7);
            }
          return n && RS(n, "normal"), TS(void 0, !0);
        },
      });
    },
    CS = jS(!0),
    LS = jS(!1);
  xS(LS, IS, "Iterator Helper");
  var MS = function (e, t, r) {
      var n = function (n, i) {
        i ? ((i.iterator = n.iterator), (i.next = n.next)) : (i = n),
          (i.type = t ? PS : _S),
          (i.returnHandlerResult = !!r),
          (i.nextHandler = e),
          (i.counter = 0),
          (i.done = !1),
          FS(this, i);
      };
      return (n.prototype = t ? CS : LS), n;
    },
    DS = _i,
    NS = M,
    US = ur,
    BS = dS,
    zS = gS,
    HS = bS,
    WS = MS(function () {
      for (var e, t = this.iterator, r = this.next; this.remaining; )
        if ((this.remaining--, (e = US(NS(r, t))), (this.done = !!e.done)))
          return;
      if (((e = US(NS(r, t))), !(this.done = !!e.done))) return e.value;
    });
  DS(
    { target: "Iterator", proto: !0, real: !0, forced: false },
    {
      drop: function (e) {
        US(this);
        var t = HS(zS(+e));
        return new WS(BS(this), { remaining: t });
      },
    }
  );
  var qS = ul,
    VS = qe,
    GS = ur,
    $S = dS;
  _i(
    { target: "Iterator", proto: !0, real: !0 },
    {
      every: function (e) {
        GS(this), VS(e);
        var t = $S(this),
          r = 0;
        return !qS(
          t,
          function (t, n) {
            if (!e(t, r++)) return n();
          },
          { IS_RECORD: !0, INTERRUPTED: !0 }
        ).stopped;
      },
    }
  );
  var YS = _i,
    KS = M,
    JS = qe,
    XS = ur,
    QS = dS,
    ZS = yp,
    eA = MS(function () {
      for (var e, t, r = this.iterator, n = this.predicate, i = this.next; ; ) {
        if (((e = XS(KS(i, r))), (this.done = !!e.done))) return;
        if (((t = e.value), ZS(r, n, [t, this.counter++], !0))) return t;
      }
    });
  YS(
    { target: "Iterator", proto: !0, real: !0, forced: false },
    {
      filter: function (e) {
        return XS(this), JS(e), new eA(QS(this), { predicate: e });
      },
    }
  );
  var tA = ul,
    rA = qe,
    nA = ur,
    iA = dS;
  _i(
    { target: "Iterator", proto: !0, real: !0 },
    {
      find: function (e) {
        nA(this), rA(e);
        var t = iA(this),
          r = 0;
        return tA(
          t,
          function (t, n) {
            if (e(t, r++)) return n(t);
          },
          { IS_RECORD: !0, INTERRUPTED: !0 }
        ).result;
      },
    }
  );
  var oA = M,
    aA = ur,
    uA = dS,
    cA = Mf,
    sA = function (e, t) {
      (t && "string" == typeof e) || aA(e);
      var r = cA(e);
      return uA(aA(void 0 !== r ? oA(r, e) : e));
    },
    fA = _i,
    lA = M,
    hA = qe,
    pA = ur,
    dA = dS,
    vA = sA,
    gA = $f,
    yA = MS(function () {
      for (var e, t, r = this.iterator, n = this.mapper; ; ) {
        if ((t = this.inner))
          try {
            if (!(e = pA(lA(t.next, t.iterator))).done) return e.value;
            this.inner = null;
          } catch ($7) {
            gA(r, "throw", $7);
          }
        if (((e = pA(lA(this.next, r))), (this.done = !!e.done))) return;
        try {
          this.inner = vA(n(e.value, this.counter++), !1);
        } catch ($7) {
          gA(r, "throw", $7);
        }
      }
    });
  fA(
    { target: "Iterator", proto: !0, real: !0, forced: false },
    {
      flatMap: function (e) {
        return pA(this), hA(e), new yA(dA(this), { mapper: e, inner: null });
      },
    }
  );
  var mA = ul,
    bA = qe,
    wA = ur,
    EA = dS;
  _i(
    { target: "Iterator", proto: !0, real: !0 },
    {
      forEach: function (e) {
        wA(this), bA(e);
        var t = EA(this),
          r = 0;
        mA(
          t,
          function (t) {
            e(t, r++);
          },
          { IS_RECORD: !0 }
        );
      },
    }
  );
  var xA = _i,
    SA = M,
    AA = ht,
    OA = me,
    kA = Zp.IteratorPrototype,
    TA = sA,
    RA = MS(function () {
      return SA(this.next, this.iterator);
    }, !0);
  xA(
    { target: "Iterator", stat: !0, forced: false },
    {
      from: function (e) {
        var t = TA("string" == typeof e ? AA(e) : e, !0);
        return OA(kA, t.iterator) ? t.iterator : new RA(t);
      },
    }
  );
  var IA = M,
    _A = qe,
    PA = ur,
    FA = dS,
    jA = yp,
    CA = MS(function () {
      var e = this.iterator,
        t = PA(IA(this.next, e));
      if (!(this.done = !!t.done))
        return jA(e, this.mapper, [t.value, this.counter++], !0);
    });
  _i(
    { target: "Iterator", proto: !0, real: !0, forced: false },
    {
      map: function (e) {
        return PA(this), _A(e), new CA(FA(this), { mapper: e });
      },
    }
  );
  var LA = ul,
    MA = qe,
    DA = ur,
    NA = dS,
    UA = TypeError;
  _i(
    { target: "Iterator", proto: !0, real: !0 },
    {
      reduce: function (e) {
        DA(this), MA(e);
        var t = NA(this),
          r = arguments.length < 2,
          n = r ? void 0 : arguments[1],
          i = 0;
        if (
          (LA(
            t,
            function (t) {
              r ? ((r = !1), (n = t)) : (n = e(n, t, i)), i++;
            },
            { IS_RECORD: !0 }
          ),
          r)
        )
          throw new UA("Reduce of empty iterator with no initial value");
        return n;
      },
    }
  );
  var BA = ul,
    zA = qe,
    HA = ur,
    WA = dS;
  _i(
    { target: "Iterator", proto: !0, real: !0 },
    {
      some: function (e) {
        HA(this), zA(e);
        var t = WA(this),
          r = 0;
        return BA(
          t,
          function (t, n) {
            if (e(t, r++)) return n();
          },
          { IS_RECORD: !0, INTERRUPTED: !0 }
        ).stopped;
      },
    }
  );
  var qA = _i,
    VA = M,
    GA = ur,
    $A = dS,
    YA = gS,
    KA = bS,
    JA = $f,
    XA = MS(function () {
      var e = this.iterator;
      if (!this.remaining--) return (this.done = !0), JA(e, "normal", void 0);
      var t = GA(VA(this.next, e));
      return (this.done = !!t.done) ? void 0 : t.value;
    });
  qA(
    { target: "Iterator", proto: !0, real: !0, forced: false },
    {
      take: function (e) {
        GA(this);
        var t = KA(YA(+e));
        return new XA($A(this), { remaining: t });
      },
    }
  );
  var QA = ur,
    ZA = ul,
    eO = dS,
    tO = [].push;
  _i(
    { target: "Iterator", proto: !0, real: !0 },
    {
      toArray: function () {
        var e = [];
        return ZA(eO(QA(this)), tO, { that: e, IS_RECORD: !0 }), e;
      },
    }
  ),
    Ho(I.JSON, "JSON", !0);
  var rO = { exports: {} },
    nO = P(function () {
      if ("function" == typeof ArrayBuffer) {
        var e = new ArrayBuffer(8);
        Object.isExtensible(e) && Object.defineProperty(e, "a", { value: 8 });
      }
    }),
    iO = P,
    oO = de,
    aO = Q,
    uO = nO,
    cO = Object.isExtensible,
    sO =
      iO(function () {
        cO(1);
      }) || uO
        ? function (e) {
            return (
              !!oO(e) && (!uO || "ArrayBuffer" !== aO(e)) && (!cO || cO(e))
            );
          }
        : cO,
    fO = !P(function () {
      return Object.isExtensible(Object.preventExtensions({}));
    }),
    lO = _i,
    hO = Y,
    pO = Hr,
    dO = de,
    vO = vt,
    gO = rr.f,
    yO = Tn,
    mO = go,
    bO = sO,
    wO = fO,
    EO = !1,
    xO = wt("meta"),
    SO = 0,
    AO = function (e) {
      gO(e, xO, { value: { objectID: "O" + SO++, weakData: {} } });
    },
    OO = (rO.exports = {
      enable: function () {
        (OO.enable = function () {}), (EO = !0);
        var e = yO.f,
          t = hO([].splice),
          r = {};
        (r[xO] = 1),
          e(r).length &&
            ((yO.f = function (r) {
              for (var n = e(r), i = 0, o = n.length; i < o; i++)
                if (n[i] === xO) {
                  t(n, i, 1);
                  break;
                }
              return n;
            }),
            lO(
              { target: "Object", stat: !0, forced: !0 },
              { getOwnPropertyNames: mO.f }
            ));
      },
      fastKey: function (e, t) {
        if (!dO(e))
          return "symbol" == f(e) ? e : ("string" == typeof e ? "S" : "P") + e;
        if (!vO(e, xO)) {
          if (!bO(e)) return "F";
          if (!t) return "E";
          AO(e);
        }
        return e[xO].objectID;
      },
      getWeakData: function (e, t) {
        if (!vO(e, xO)) {
          if (!bO(e)) return !0;
          if (!t) return !1;
          AO(e);
        }
        return e[xO].weakData;
      },
      onFreeze: function (e) {
        return wO && EO && bO(e) && !vO(e, xO) && AO(e), e;
      },
    });
  pO[xO] = !0;
  var kO = rO.exports,
    TO = _i,
    RO = I,
    IO = Y,
    _O = xi,
    PO = kn,
    FO = kO,
    jO = ul,
    CO = jy,
    LO = he,
    MO = ie,
    DO = de,
    NO = P,
    UO = Cp,
    BO = Ho,
    zO = Es,
    HO = function (e, t, r) {
      var n = -1 !== e.indexOf("Map"),
        i = -1 !== e.indexOf("Weak"),
        o = n ? "set" : "add",
        a = RO[e],
        u = a && a.prototype,
        c = a,
        s = {},
        f = function (e) {
          var t = IO(u[e]);
          PO(
            u,
            e,
            "add" === e
              ? function (e) {
                  return t(this, 0 === e ? 0 : e), this;
                }
              : "delete" === e
              ? function (e) {
                  return !(i && !DO(e)) && t(this, 0 === e ? 0 : e);
                }
              : "get" === e
              ? function (e) {
                  return i && !DO(e) ? void 0 : t(this, 0 === e ? 0 : e);
                }
              : "has" === e
              ? function (e) {
                  return !(i && !DO(e)) && t(this, 0 === e ? 0 : e);
                }
              : function (e, r) {
                  return t(this, 0 === e ? 0 : e, r), this;
                }
          );
        };
      if (
        _O(
          e,
          !LO(a) ||
            !(
              i ||
              (u.forEach &&
                !NO(function () {
                  new a().entries().next();
                }))
            )
        )
      )
        (c = r.getConstructor(t, e, n, o)), FO.enable();
      else if (_O(e, !0)) {
        var l = new c(),
          h = l[o](i ? {} : -0, 1) !== l,
          p = NO(function () {
            l.has(1);
          }),
          d = UO(function (e) {
            new a(e);
          }),
          v =
            !i &&
            NO(function () {
              for (var e = new a(), t = 5; t--; ) e[o](t, t);
              return !e.has(-0);
            });
        d ||
          (((c = t(function (e, t) {
            CO(e, u);
            var r = zO(new a(), e, c);
            return MO(t) || jO(t, r[o], { that: r, AS_ENTRIES: n }), r;
          })).prototype = u),
          (u.constructor = c)),
          (p || v) && (f("delete"), f("has"), n && f("get")),
          (v || h) && f(o),
          i && u.clear && delete u.clear;
      }
      return (
        (s[e] = c),
        TO({ global: !0, constructor: !0, forced: c !== a }, s),
        BO(c, e),
        i || r.setStrong(c, e, n),
        c
      );
    },
    WO = vo,
    qO = Oo,
    VO = _y,
    GO = Ko,
    $O = jy,
    YO = ie,
    KO = ul,
    JO = kd,
    XO = Td,
    QO = _g,
    ZO = F,
    ek = kO.fastKey,
    tk = rn.set,
    rk = rn.getterFor,
    nk = {
      getConstructor: function (e, t, r, n) {
        var i = e(function (e, i) {
            $O(e, o),
              tk(e, {
                type: t,
                index: WO(null),
                first: null,
                last: null,
                size: 0,
              }),
              ZO || (e.size = 0),
              YO(i) || KO(i, e[n], { that: e, AS_ENTRIES: r });
          }),
          o = i.prototype,
          a = rk(t),
          u = function (e, t, r) {
            var n,
              i,
              o = a(e),
              u = c(e, t);
            return (
              u
                ? (u.value = r)
                : ((o.last = u =
                    {
                      index: (i = ek(t, !0)),
                      key: t,
                      value: r,
                      previous: (n = o.last),
                      next: null,
                      removed: !1,
                    }),
                  o.first || (o.first = u),
                  n && (n.next = u),
                  ZO ? o.size++ : e.size++,
                  "F" !== i && (o.index[i] = u)),
              e
            );
          },
          c = function (e, t) {
            var r,
              n = a(e),
              i = ek(t);
            if ("F" !== i) return n.index[i];
            for (r = n.first; r; r = r.next) if (r.key === t) return r;
          };
        return (
          VO(o, {
            clear: function () {
              for (var e = a(this), t = e.first; t; )
                (t.removed = !0),
                  t.previous && (t.previous = t.previous.next = null),
                  (t = t.next);
              (e.first = e.last = null),
                (e.index = WO(null)),
                ZO ? (e.size = 0) : (this.size = 0);
            },
            delete: function (e) {
              var t = this,
                r = a(t),
                n = c(t, e);
              if (n) {
                var i = n.next,
                  o = n.previous;
                delete r.index[n.index],
                  (n.removed = !0),
                  o && (o.next = i),
                  i && (i.previous = o),
                  r.first === n && (r.first = i),
                  r.last === n && (r.last = o),
                  ZO ? r.size-- : t.size--;
              }
              return !!n;
            },
            forEach: function (e) {
              for (
                var t,
                  r = a(this),
                  n = GO(e, arguments.length > 1 ? arguments[1] : void 0);
                (t = t ? t.next : r.first);

              )
                for (n(t.value, t.key, this); t && t.removed; ) t = t.previous;
            },
            has: function (e) {
              return !!c(this, e);
            },
          }),
          VO(
            o,
            r
              ? {
                  get: function (e) {
                    var t = c(this, e);
                    return t && t.value;
                  },
                  set: function (e, t) {
                    return u(this, 0 === e ? 0 : e, t);
                  },
                }
              : {
                  add: function (e) {
                    return u(this, (e = 0 === e ? 0 : e), e);
                  },
                }
          ),
          ZO &&
            qO(o, "size", {
              configurable: !0,
              get: function () {
                return a(this).size;
              },
            }),
          i
        );
      },
      setStrong: function (e, t, r) {
        var n = t + " Iterator",
          i = rk(t),
          o = rk(n);
        JO(
          e,
          t,
          function (e, t) {
            tk(this, { type: n, target: e, state: i(e), kind: t, last: null });
          },
          function () {
            for (var e = o(this), t = e.kind, r = e.last; r && r.removed; )
              r = r.previous;
            return e.target && (e.last = r = r ? r.next : e.state.first)
              ? XO(
                  "keys" === t
                    ? r.key
                    : "values" === t
                    ? r.value
                    : [r.key, r.value],
                  !1
                )
              : ((e.target = null), XO(void 0, !0));
          },
          r ? "entries" : "values",
          !r,
          !0
        ),
          QO(t);
      },
    };
  HO(
    "Map",
    function (e) {
      return function () {
        return e(this, arguments.length ? arguments[0] : void 0);
      };
    },
    nk
  );
  var ik = Y,
    ok = Map.prototype,
    ak = {
      Map: Map,
      set: ik(ok.set),
      get: ik(ok.get),
      has: ik(ok.has),
      remove: ik(ok.delete),
      proto: ok,
    },
    uk = _i,
    ck = qe,
    sk = ue,
    fk = ul,
    lk = P,
    hk = ak.Map,
    pk = ak.has,
    dk = ak.get,
    vk = ak.set,
    gk = Y([].push);
  uk(
    {
      target: "Map",
      stat: !0,
      forced: lk(function () {
        return (
          1 !==
          hk
            .groupBy("ab", function (e) {
              return e;
            })
            .get("a").length
        );
      }),
    },
    {
      groupBy: function (e, t) {
        sk(e), ck(t);
        var r = new hk(),
          n = 0;
        return (
          fk(e, function (e) {
            var i = t(e, n++);
            pk(r, i) ? gk(dk(r, i), e) : vk(r, i, [e]);
          }),
          r
        );
      },
    }
  );
  var yk = Math.log,
    mk =
      Math.log1p ||
      function (e) {
        var t = +e;
        return t > -1e-8 && t < 1e-8 ? t - (t * t) / 2 : yk(1 + t);
      },
    bk = _i,
    wk = mk,
    Ek = Math.acosh,
    xk = Math.log,
    Sk = Math.sqrt,
    Ak = Math.LN2;
  bk(
    {
      target: "Math",
      stat: !0,
      forced:
        !Ek || 710 !== Math.floor(Ek(Number.MAX_VALUE)) || Ek(1 / 0) !== 1 / 0,
    },
    {
      acosh: function (e) {
        var t = +e;
        return t < 1
          ? NaN
          : t > 94906265.62425156
          ? xk(t) + Ak
          : wk(t - 1 + Sk(t - 1) * Sk(t + 1));
      },
    }
  );
  var Ok = _i,
    kk = Math.asinh,
    Tk = Math.log,
    Rk = Math.sqrt;
  Ok(
    { target: "Math", stat: !0, forced: !(kk && 1 / kk(0) > 0) },
    {
      asinh: function e(t) {
        var r = +t;
        return isFinite(r) && 0 !== r
          ? r < 0
            ? -e(-r)
            : Tk(r + Rk(r * r + 1))
          : r;
      },
    }
  );
  var Ik = _i,
    _k = Math.atanh,
    Pk = Math.log;
  Ik(
    { target: "Math", stat: !0, forced: !(_k && 1 / _k(-0) < 0) },
    {
      atanh: function (e) {
        var t = +e;
        return 0 === t ? t : Pk((1 + t) / (1 - t)) / 2;
      },
    }
  );
  var Fk = _i,
    jk = Ny,
    Ck = Math.abs,
    Lk = Math.pow;
  Fk(
    { target: "Math", stat: !0 },
    {
      cbrt: function (e) {
        var t = +e;
        return jk(t) * Lk(Ck(t), 1 / 3);
      },
    }
  );
  var Mk = _i,
    Dk = Math.floor,
    Nk = Math.log,
    Uk = Math.LOG2E;
  Mk(
    { target: "Math", stat: !0 },
    {
      clz32: function (e) {
        var t = e >>> 0;
        return t ? 31 - Dk(Nk(t + 0.5) * Uk) : 32;
      },
    }
  );
  var Bk = Math.expm1,
    zk = Math.exp,
    Hk =
      !Bk ||
      Bk(10) > 22025.465794806718 ||
      Bk(10) < 22025.465794806718 ||
      -2e-17 !== Bk(-2e-17)
        ? function (e) {
            var t = +e;
            return 0 === t
              ? t
              : t > -1e-6 && t < 1e-6
              ? t + (t * t) / 2
              : zk(t) - 1;
          }
        : Bk,
    Wk = _i,
    qk = Hk,
    Vk = Math.cosh,
    Gk = Math.abs,
    $k = Math.E;
  Wk(
    { target: "Math", stat: !0, forced: !Vk || Vk(710) === 1 / 0 },
    {
      cosh: function (e) {
        var t = qk(Gk(e) - 1) + 1;
        return (t + 1 / (t * $k * $k)) * ($k / 2);
      },
    }
  );
  var Yk = Hk;
  _i({ target: "Math", stat: !0, forced: Yk !== Math.expm1 }, { expm1: Yk }),
    _i({ target: "Math", stat: !0 }, { fround: qy });
  var Kk = _i,
    Jk = Math.hypot,
    Xk = Math.abs,
    Qk = Math.sqrt;
  Kk(
    {
      target: "Math",
      stat: !0,
      arity: 2,
      forced: !!Jk && Jk(1 / 0, NaN) !== 1 / 0,
    },
    {
      hypot: function (e, t) {
        for (var r, n, i = 0, o = 0, a = arguments.length, u = 0; o < a; )
          u < (r = Xk(arguments[o++]))
            ? ((i = i * (n = u / r) * n + 1), (u = r))
            : (i += r > 0 ? (n = r / u) * n : r);
        return u === 1 / 0 ? 1 / 0 : u * Qk(i);
      },
    }
  );
  var Zk = _i,
    eT = P,
    tT = Math.imul;
  Zk(
    {
      target: "Math",
      stat: !0,
      forced: eT(function () {
        return -5 !== tT(4294967295, 5) || 2 !== tT.length;
      }),
    },
    {
      imul: function (e, t) {
        var r = 65535,
          n = +e,
          i = +t,
          o = r & n,
          a = r & i;
        return (
          0 |
          (o * a +
            ((((r & (n >>> 16)) * a + o * (r & (i >>> 16))) << 16) >>> 0))
        );
      },
    }
  );
  var rT = Math.log,
    nT = Math.LOG10E,
    iT =
      Math.log10 ||
      function (e) {
        return rT(e) * nT;
      };
  _i({ target: "Math", stat: !0 }, { log10: iT }),
    _i({ target: "Math", stat: !0 }, { log1p: mk });
  var oT = Math.log,
    aT = Math.LN2;
  _i(
    { target: "Math", stat: !0 },
    {
      log2:
        Math.log2 ||
        function (e) {
          return oT(e) / aT;
        },
    }
  ),
    _i({ target: "Math", stat: !0 }, { sign: Ny });
  var uT = _i,
    cT = P,
    sT = Hk,
    fT = Math.abs,
    lT = Math.exp,
    hT = Math.E;
  uT(
    {
      target: "Math",
      stat: !0,
      forced: cT(function () {
        return -2e-17 !== Math.sinh(-2e-17);
      }),
    },
    {
      sinh: function (e) {
        var t = +e;
        return fT(t) < 1
          ? (sT(t) - sT(-t)) / 2
          : (lT(t - 1) - lT(-t - 1)) * (hT / 2);
      },
    }
  );
  var pT = _i,
    dT = Hk,
    vT = Math.exp;
  pT(
    { target: "Math", stat: !0 },
    {
      tanh: function (e) {
        var t = +e,
          r = dT(t),
          n = dT(-t);
        return r === 1 / 0 ? 1 : n === 1 / 0 ? -1 : (r - n) / (vT(t) + vT(-t));
      },
    }
  ),
    Ho(Math, "Math", !0),
    _i({ target: "Math", stat: !0 }, { trunc: _n });
  var gT = Y((1).valueOf),
    yT =
      "\t\n\v\f\r 聽釟€鈥€鈥佲€傗€冣€勨€呪€嗏€団€堚€夆€娾€仧銆€\u2028\u2029\ufeff",
    mT = ue,
    bT = Hi,
    wT = yT,
    ET = Y("".replace),
    xT = RegExp("^[" + wT + "]+"),
    ST = RegExp("(^|[^" + wT + "])[" + wT + "]+$"),
    AT = function (e) {
      return function (t) {
        var r = bT(mT(t));
        return 1 & e && (r = ET(r, xT, "")), 2 & e && (r = ET(r, ST, "$1")), r;
      };
    },
    OT = { start: AT(1), end: AT(2), trim: AT(3) },
    kT = _i,
    TT = F,
    RT = I,
    IT = Ro,
    _T = Y,
    PT = xi,
    FT = vt,
    jT = Es,
    CT = me,
    LT = Ne,
    MT = Dt,
    DT = P,
    NT = Tn.f,
    UT = _.f,
    BT = rr.f,
    zT = gT,
    HT = OT.trim,
    WT = "Number",
    qT = RT[WT];
  IT[WT];
  var VT = qT.prototype,
    GT = RT.TypeError,
    $T = _T("".slice),
    YT = _T("".charCodeAt),
    KT = function (e) {
      var t,
        r,
        n,
        i,
        o,
        a,
        u,
        c,
        s = MT(e, "number");
      if (LT(s)) throw new GT("Cannot convert a Symbol value to a number");
      if ("string" == typeof s && s.length > 2)
        if (((s = HT(s)), 43 === (t = YT(s, 0)) || 45 === t)) {
          if (88 === (r = YT(s, 2)) || 120 === r) return NaN;
        } else if (48 === t) {
          switch (YT(s, 1)) {
            case 66:
            case 98:
              (n = 2), (i = 49);
              break;
            case 79:
            case 111:
              (n = 8), (i = 55);
              break;
            default:
              return +s;
          }
          for (a = (o = $T(s, 2)).length, u = 0; u < a; u++)
            if ((c = YT(o, u)) < 48 || c > i) return NaN;
          return parseInt(o, n);
        }
      return +s;
    },
    JT = PT(WT, !qT(" 0o1") || !qT("0b1") || qT("+0x1")),
    XT = function (e) {
      var t,
        r =
          arguments.length < 1
            ? 0
            : qT(
                (function (e) {
                  var t = MT(e, "number");
                  return "bigint" == typeof t ? t : KT(t);
                })(e)
              );
      return CT(VT, (t = this)) &&
        DT(function () {
          zT(t);
        })
        ? jT(Object(r), this, XT)
        : r;
    };
  (XT.prototype = VT),
    JT && (VT.constructor = XT),
    kT({ global: !0, constructor: !0, wrap: !0, forced: JT }, { Number: XT });
  JT &&
    (function (e, t) {
      for (
        var r,
          n = TT
            ? NT(t)
            : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,fromString,range".split(
                ","
              ),
          i = 0;
        n.length > i;
        i++
      )
        FT(t, (r = n[i])) && !FT(e, r) && BT(e, r, UT(t, r));
    })(IT[WT], qT),
    _i(
      { target: "Number", stat: !0, nonConfigurable: !0, nonWritable: !0 },
      { EPSILON: Math.pow(2, -52) }
    );
  var QT = I.isFinite;
  _i(
    { target: "Number", stat: !0 },
    {
      isFinite:
        Number.isFinite ||
        function (e) {
          return "number" == typeof e && QT(e);
        },
    }
  );
  var ZT = de,
    eR = Math.floor,
    tR =
      Number.isInteger ||
      function (e) {
        return !ZT(e) && isFinite(e) && eR(e) === e;
      };
  _i({ target: "Number", stat: !0 }, { isInteger: tR }),
    _i(
      { target: "Number", stat: !0 },
      {
        isNaN: function (e) {
          return e != e;
        },
      }
    );
  var rR = _i,
    nR = tR,
    iR = Math.abs;
  rR(
    { target: "Number", stat: !0 },
    {
      isSafeInteger: function (e) {
        return nR(e) && iR(e) <= 9007199254740991;
      },
    }
  ),
    _i(
      { target: "Number", stat: !0, nonConfigurable: !0, nonWritable: !0 },
      { MAX_SAFE_INTEGER: 9007199254740991 }
    ),
    _i(
      { target: "Number", stat: !0, nonConfigurable: !0, nonWritable: !0 },
      { MIN_SAFE_INTEGER: -9007199254740991 }
    );
  var oR = I,
    aR = P,
    uR = Hi,
    cR = OT.trim,
    sR = yT,
    fR = Y("".charAt),
    lR = oR.parseFloat,
    hR = oR.Symbol,
    pR = hR && hR.iterator,
    dR =
      1 / lR(sR + "-0") != -1 / 0 ||
      (pR &&
        !aR(function () {
          lR(Object(pR));
        }))
        ? function (e) {
            var t = cR(uR(e)),
              r = lR(t);
            return 0 === r && "-" === fR(t, 0) ? -0 : r;
          }
        : lR,
    vR = dR;
  _i(
    { target: "Number", stat: !0, forced: Number.parseFloat !== vR },
    { parseFloat: vR }
  );
  var gR = I,
    yR = P,
    mR = Y,
    bR = Hi,
    wR = OT.trim,
    ER = yT,
    xR = gR.parseInt,
    SR = gR.Symbol,
    AR = SR && SR.iterator,
    OR = /^[+-]?0x/i,
    kR = mR(OR.exec),
    TR =
      8 !== xR(ER + "08") ||
      22 !== xR(ER + "0x16") ||
      (AR &&
        !yR(function () {
          xR(Object(AR));
        }))
        ? function (e, t) {
            var r = wR(bR(e));
            return xR(r, t >>> 0 || (kR(OR, r) ? 16 : 10));
          }
        : xR,
    RR = TR;
  _i(
    { target: "Number", stat: !0, forced: Number.parseInt !== RR },
    { parseInt: RR }
  );
  var IR = _i,
    _R = Y,
    PR = Fn,
    FR = gT,
    jR = wE,
    CR = iT,
    LR = P,
    MR = RangeError,
    DR = String,
    NR = isFinite,
    UR = Math.abs,
    BR = Math.floor,
    zR = Math.pow,
    HR = Math.round,
    WR = _R((1).toExponential),
    qR = _R(jR),
    VR = _R("".slice),
    GR =
      "-6.9000e-11" === WR(-69e-12, 4) &&
      "1.25e+0" === WR(1.255, 2) &&
      "1.235e+4" === WR(12345, 3) &&
      "3e+1" === WR(25, 0);
  IR(
    {
      target: "Number",
      proto: !0,
      forced:
        !GR ||
        !(
          LR(function () {
            WR(1, 1 / 0);
          }) &&
          LR(function () {
            WR(1, -1 / 0);
          })
        ) ||
        !!LR(function () {
          WR(1 / 0, 1 / 0), WR(NaN, 1 / 0);
        }),
    },
    {
      toExponential: function (e) {
        var t = FR(this);
        if (void 0 === e) return WR(t);
        var r = PR(e);
        if (!NR(t)) return String(t);
        if (r < 0 || r > 20) throw new MR("Incorrect fraction digits");
        if (GR) return WR(t, r);
        var n,
          i,
          o,
          a,
          u = "";
        if ((t < 0 && ((u = "-"), (t = -t)), 0 === t))
          (i = 0), (n = qR("0", r + 1));
        else {
          var c = CR(t);
          i = BR(c);
          var s = zR(10, i - r),
            f = HR(t / s);
          2 * t >= (2 * f + 1) * s && (f += 1),
            f >= zR(10, r + 1) && ((f /= 10), (i += 1)),
            (n = DR(f));
        }
        return (
          0 !== r && (n = VR(n, 0, 1) + "." + VR(n, 1)),
          0 === i
            ? ((o = "+"), (a = "0"))
            : ((o = i > 0 ? "+" : "-"), (a = DR(UR(i)))),
          u + (n += "e" + o + a)
        );
      },
    }
  );
  var $R = _i,
    YR = Y,
    KR = Fn,
    JR = gT,
    XR = wE,
    QR = P,
    ZR = RangeError,
    eI = String,
    tI = Math.floor,
    rI = YR(XR),
    nI = YR("".slice),
    iI = YR((1).toFixed),
    oI = function (e, t, r) {
      return 0 === t
        ? r
        : t % 2 == 1
        ? oI(e, t - 1, r * e)
        : oI(e * e, t / 2, r);
    },
    aI = function (e, t, r) {
      for (var n = -1, i = r; ++n < 6; )
        (i += t * e[n]), (e[n] = i % 1e7), (i = tI(i / 1e7));
    },
    uI = function (e, t) {
      for (var r = 6, n = 0; --r >= 0; )
        (n += e[r]), (e[r] = tI(n / t)), (n = (n % t) * 1e7);
    },
    cI = function (e) {
      for (var t = 6, r = ""; --t >= 0; )
        if ("" !== r || 0 === t || 0 !== e[t]) {
          var n = eI(e[t]);
          r = "" === r ? n : r + rI("0", 7 - n.length) + n;
        }
      return r;
    };
  $R(
    {
      target: "Number",
      proto: !0,
      forced:
        QR(function () {
          return (
            "0.000" !== iI(8e-5, 3) ||
            "1" !== iI(0.9, 0) ||
            "1.25" !== iI(1.255, 2) ||
            "1000000000000000128" !== iI(0xde0b6b3a7640080, 0)
          );
        }) ||
        !QR(function () {
          iI({});
        }),
    },
    {
      toFixed: function (e) {
        var t,
          r,
          n,
          i,
          o = JR(this),
          a = KR(e),
          u = [0, 0, 0, 0, 0, 0],
          c = "",
          s = "0";
        if (a < 0 || a > 20) throw new ZR("Incorrect fraction digits");
        if (o != o) return "NaN";
        if (o <= -1e21 || o >= 1e21) return eI(o);
        if ((o < 0 && ((c = "-"), (o = -o)), o > 1e-21))
          if (
            ((r =
              (t =
                (function (e) {
                  for (var t = 0, r = e; r >= 4096; ) (t += 12), (r /= 4096);
                  for (; r >= 2; ) (t += 1), (r /= 2);
                  return t;
                })(o * oI(2, 69, 1)) - 69) < 0
                ? o * oI(2, -t, 1)
                : o / oI(2, t, 1)),
            (r *= 4503599627370496),
            (t = 52 - t) > 0)
          ) {
            for (aI(u, 0, r), n = a; n >= 7; ) aI(u, 1e7, 0), (n -= 7);
            for (aI(u, oI(10, n, 1), 0), n = t - 1; n >= 23; )
              uI(u, 1 << 23), (n -= 23);
            uI(u, 1 << n), aI(u, 1, 1), uI(u, 2), (s = cI(u));
          } else aI(u, 0, r), aI(u, 1 << -t, 0), (s = cI(u) + rI("0", a));
        return (s =
          a > 0
            ? c +
              ((i = s.length) <= a
                ? "0." + rI("0", a - i) + s
                : nI(s, 0, i - a) + "." + nI(s, i - a))
            : c + s);
      },
    }
  );
  var sI = _i,
    fI = P,
    lI = gT,
    hI = Y((1).toPrecision);
  sI(
    {
      target: "Number",
      proto: !0,
      forced:
        fI(function () {
          return "1" !== hI(1, void 0);
        }) ||
        !fI(function () {
          hI({});
        }),
    },
    {
      toPrecision: function (e) {
        return void 0 === e ? hI(lI(this)) : hI(lI(this), e);
      },
    }
  );
  var pI = F,
    dI = Y,
    vI = M,
    gI = P,
    yI = Gi,
    mI = ri,
    bI = D,
    wI = ht,
    EI = ne,
    xI = Object.assign,
    SI = Object.defineProperty,
    AI = dI([].concat),
    OI =
      !xI ||
      gI(function () {
        if (
          pI &&
          1 !==
            xI(
              { b: 1 },
              xI(
                SI({}, "a", {
                  enumerable: !0,
                  get: function () {
                    SI(this, "b", { value: 3, enumerable: !1 });
                  },
                }),
                { b: 2 }
              )
            ).b
        )
          return !0;
        var e = {},
          t = {},
          r = Symbol("assign detection"),
          n = "abcdefghijklmnopqrst";
        return (
          (e[r] = 7),
          n.split("").forEach(function (e) {
            t[e] = e;
          }),
          7 !== xI({}, e)[r] || yI(xI({}, t)).join("") !== n
        );
      })
        ? function (e, t) {
            for (
              var r = wI(e), n = arguments.length, i = 1, o = mI.f, a = bI.f;
              n > i;

            )
              for (
                var u,
                  c = EI(arguments[i++]),
                  s = o ? AI(yI(c), o(c)) : yI(c),
                  f = s.length,
                  l = 0;
                f > l;

              )
                (u = s[l++]), (pI && !vI(a, c, u)) || (r[u] = c[u]);
            return r;
          }
        : xI,
    kI = OI;
  _i(
    { target: "Object", stat: !0, arity: 2, forced: Object.assign !== kI },
    { assign: kI }
  ),
    _i({ target: "Object", stat: !0, sham: !F }, { create: vo });
  var TI = I,
    RI = ig,
    II = !P(function () {
      if (!(RI && RI < 535)) {
        var e = Math.random();
        __defineSetter__.call(null, e, function () {}), delete TI[e];
      }
    }),
    _I = qe,
    PI = ht,
    FI = rr;
  F &&
    _i(
      { target: "Object", proto: !0, forced: II },
      {
        __defineGetter__: function (e, t) {
          FI.f(PI(this), e, { get: _I(t), enumerable: !0, configurable: !0 });
        },
      }
    );
  var jI = _i,
    CI = F,
    LI = Wi.f;
  jI(
    {
      target: "Object",
      stat: !0,
      forced: Object.defineProperties !== LI,
      sham: !CI,
    },
    { defineProperties: LI }
  );
  var MI = _i,
    DI = F,
    NI = rr.f;
  MI(
    {
      target: "Object",
      stat: !0,
      forced: Object.defineProperty !== NI,
      sham: !DI,
    },
    { defineProperty: NI }
  );
  var UI = qe,
    BI = ht,
    zI = rr;
  F &&
    _i(
      { target: "Object", proto: !0, forced: II },
      {
        __defineSetter__: function (e, t) {
          zI.f(BI(this), e, { set: UI(t), enumerable: !0, configurable: !0 });
        },
      }
    );
  var HI = F,
    WI = P,
    qI = Y,
    VI = Of,
    GI = Gi,
    $I = fe,
    YI = qI(D.f),
    KI = qI([].push),
    JI =
      HI &&
      WI(function () {
        var e = Object.create(null);
        return (e[2] = 2), !YI(e, 2);
      }),
    XI = function (e) {
      return function (t) {
        for (
          var r,
            n = $I(t),
            i = GI(n),
            o = JI && null === VI(n),
            a = i.length,
            u = 0,
            c = [];
          a > u;

        )
          (r = i[u++]),
            (HI && !(o ? r in n : YI(n, r))) || KI(c, e ? [r, n[r]] : n[r]);
        return c;
      };
    },
    QI = { entries: XI(!0), values: XI(!1) },
    ZI = QI.entries;
  _i(
    { target: "Object", stat: !0 },
    {
      entries: function (e) {
        return ZI(e);
      },
    }
  );
  var e_ = _i,
    t_ = fO,
    r_ = P,
    n_ = de,
    i_ = kO.onFreeze,
    o_ = Object.freeze;
  e_(
    {
      target: "Object",
      stat: !0,
      forced: r_(function () {
        o_(1);
      }),
      sham: !t_,
    },
    {
      freeze: function (e) {
        return o_ && n_(e) ? o_(i_(e)) : e;
      },
    }
  );
  var a_ = ul,
    u_ = $l;
  _i(
    { target: "Object", stat: !0 },
    {
      fromEntries: function (e) {
        var t = {};
        return (
          a_(
            e,
            function (e, r) {
              u_(t, e, r);
            },
            { AS_ENTRIES: !0 }
          ),
          t
        );
      },
    }
  );
  var c_ = _i,
    s_ = P,
    f_ = fe,
    l_ = _.f,
    h_ = F;
  c_(
    {
      target: "Object",
      stat: !0,
      forced:
        !h_ ||
        s_(function () {
          l_(1);
        }),
      sham: !h_,
    },
    {
      getOwnPropertyDescriptor: function (e, t) {
        return l_(f_(e), t);
      },
    }
  );
  var p_ = ci,
    d_ = fe,
    v_ = _,
    g_ = $l;
  _i(
    { target: "Object", stat: !0, sham: !F },
    {
      getOwnPropertyDescriptors: function (e) {
        for (
          var t, r, n = d_(e), i = v_.f, o = p_(n), a = {}, u = 0;
          o.length > u;

        )
          void 0 !== (r = i(n, (t = o[u++]))) && g_(a, t, r);
        return a;
      },
    }
  );
  var y_ = _i,
    m_ = P,
    b_ = go.f;
  y_(
    {
      target: "Object",
      stat: !0,
      forced: m_(function () {
        return !Object.getOwnPropertyNames(1);
      }),
    },
    { getOwnPropertyNames: b_ }
  );
  var w_ = ht,
    E_ = Of,
    x_ = yf;
  _i(
    {
      target: "Object",
      stat: !0,
      forced: P(function () {
        E_(1);
      }),
      sham: !x_,
    },
    {
      getPrototypeOf: function (e) {
        return E_(w_(e));
      },
    }
  );
  var S_ = _i,
    A_ = ye,
    O_ = Y,
    k_ = qe,
    T_ = ue,
    R_ = Bt,
    I_ = ul,
    __ = P,
    P_ = Object.groupBy,
    F_ = A_("Object", "create"),
    j_ = O_([].push);
  S_(
    {
      target: "Object",
      stat: !0,
      forced:
        !P_ ||
        __(function () {
          return (
            1 !==
            P_("ab", function (e) {
              return e;
            }).a.length
          );
        }),
    },
    {
      groupBy: function (e, t) {
        T_(e), k_(t);
        var r = F_(null),
          n = 0;
        return (
          I_(e, function (e) {
            var i = R_(t(e, n++));
            i in r ? j_(r[i], e) : (r[i] = [e]);
          }),
          r
        );
      },
    }
  ),
    _i({ target: "Object", stat: !0 }, { hasOwn: vt });
  var C_ =
    Object.is ||
    function (e, t) {
      return e === t ? 0 !== e || 1 / e == 1 / t : e != e && t != t;
    };
  _i({ target: "Object", stat: !0 }, { is: C_ });
  var L_ = sO;
  _i(
    { target: "Object", stat: !0, forced: Object.isExtensible !== L_ },
    { isExtensible: L_ }
  );
  var M_ = _i,
    D_ = P,
    N_ = de,
    U_ = Q,
    B_ = nO,
    z_ = Object.isFrozen;
  M_(
    {
      target: "Object",
      stat: !0,
      forced:
        B_ ||
        D_(function () {
          z_(1);
        }),
    },
    {
      isFrozen: function (e) {
        return !N_(e) || !(!B_ || "ArrayBuffer" !== U_(e)) || (!!z_ && z_(e));
      },
    }
  );
  var H_ = _i,
    W_ = P,
    q_ = de,
    V_ = Q,
    G_ = nO,
    $_ = Object.isSealed;
  H_(
    {
      target: "Object",
      stat: !0,
      forced:
        G_ ||
        W_(function () {
          $_(1);
        }),
    },
    {
      isSealed: function (e) {
        return !q_(e) || !(!G_ || "ArrayBuffer" !== V_(e)) || (!!$_ && $_(e));
      },
    }
  );
  var Y_ = ht,
    K_ = Gi;
  _i(
    {
      target: "Object",
      stat: !0,
      forced: P(function () {
        K_(1);
      }),
    },
    {
      keys: function (e) {
        return K_(Y_(e));
      },
    }
  );
  var J_ = _i,
    X_ = F,
    Q_ = II,
    Z_ = ht,
    eP = Bt,
    tP = Of,
    rP = _.f;
  X_ &&
    J_(
      { target: "Object", proto: !0, forced: Q_ },
      {
        __lookupGetter__: function (e) {
          var t,
            r = Z_(this),
            n = eP(e);
          do {
            if ((t = rP(r, n))) return t.get;
          } while ((r = tP(r)));
        },
      }
    );
  var nP = _i,
    iP = F,
    oP = II,
    aP = ht,
    uP = Bt,
    cP = Of,
    sP = _.f;
  iP &&
    nP(
      { target: "Object", proto: !0, forced: oP },
      {
        __lookupSetter__: function (e) {
          var t,
            r = aP(this),
            n = uP(e);
          do {
            if ((t = sP(r, n))) return t.set;
          } while ((r = cP(r)));
        },
      }
    );
  var fP = _i,
    lP = de,
    hP = kO.onFreeze,
    pP = fO,
    dP = P,
    vP = Object.preventExtensions;
  fP(
    {
      target: "Object",
      stat: !0,
      forced: dP(function () {
        vP(1);
      }),
      sham: !pP,
    },
    {
      preventExtensions: function (e) {
        return vP && lP(e) ? vP(hP(e)) : e;
      },
    }
  );
  var gP = F,
    yP = Oo,
    mP = de,
    bP = as,
    wP = ht,
    EP = ue,
    xP = Object.getPrototypeOf,
    SP = Object.setPrototypeOf,
    AP = Object.prototype,
    OP = "__proto__";
  if (gP && xP && SP && !(OP in AP))
    try {
      yP(AP, OP, {
        configurable: !0,
        get: function () {
          return xP(wP(this));
        },
        set: function (e) {
          var t = EP(this);
          bP(e) && mP(t) && SP(t, e);
        },
      });
    } catch ($7) {}
  var kP = _i,
    TP = de,
    RP = kO.onFreeze,
    IP = fO,
    _P = P,
    PP = Object.seal;
  kP(
    {
      target: "Object",
      stat: !0,
      forced: _P(function () {
        PP(1);
      }),
      sham: !IP,
    },
    {
      seal: function (e) {
        return PP && TP(e) ? PP(RP(e)) : e;
      },
    }
  ),
    _i({ target: "Object", stat: !0 }, { setPrototypeOf: vs });
  var FP = Ui,
    jP = Fi
      ? {}.toString
      : function () {
          return "[object " + FP(this) + "]";
        };
  Fi || kn(Object.prototype, "toString", jP, { unsafe: !0 });
  var CP = QI.values;
  _i(
    { target: "Object", stat: !0 },
    {
      values: function (e) {
        return CP(e);
      },
    }
  );
  _i({ global: !0, forced: parseFloat !== dR }, { parseFloat: dR });
  _i({ global: !0, forced: parseInt !== TR }, { parseInt: TR });
  var LP,
    MP,
    DP,
    NP,
    UP = fa,
    BP = Be,
    zP = TypeError,
    HP = function (e) {
      if (UP(e)) return e;
      throw new zP(BP(e) + " is not a constructor");
    },
    WP = ur,
    qP = HP,
    VP = ie,
    GP = It("species"),
    $P = function (e, t) {
      var r,
        n = WP(e).constructor;
      return void 0 === n || VP((r = WP(n)[GP])) ? t : qP(r);
    },
    YP = TypeError,
    KP = function (e, t) {
      if (e < t) throw new YP("Not enough arguments");
      return e;
    },
    JP = /(?:ipad|iphone|ipod).*applewebkit/i.test(Ee),
    XP = I,
    QP = tc,
    ZP = Ko,
    eF = he,
    tF = vt,
    rF = P,
    nF = eo,
    iF = yo,
    oF = qt,
    aF = KP,
    uF = JP,
    cF = Rv,
    sF = XP.setImmediate,
    fF = XP.clearImmediate,
    lF = XP.process,
    hF = XP.Dispatch,
    pF = XP.Function,
    dF = XP.MessageChannel,
    vF = XP.String,
    gF = 0,
    yF = {},
    mF = "onreadystatechange";
  rF(function () {
    LP = XP.location;
  });
  var bF = function (e) {
      if (tF(yF, e)) {
        var t = yF[e];
        delete yF[e], t();
      }
    },
    wF = function (e) {
      return function () {
        bF(e);
      };
    },
    EF = function (e) {
      bF(e.data);
    },
    xF = function (e) {
      XP.postMessage(vF(e), LP.protocol + "//" + LP.host);
    };
  (sF && fF) ||
    ((sF = function (e) {
      aF(arguments.length, 1);
      var t = eF(e) ? e : pF(e),
        r = iF(arguments, 1);
      return (
        (yF[++gF] = function () {
          QP(t, void 0, r);
        }),
        MP(gF),
        gF
      );
    }),
    (fF = function (e) {
      delete yF[e];
    }),
    cF
      ? (MP = function (e) {
          lF.nextTick(wF(e));
        })
      : hF && hF.now
      ? (MP = function (e) {
          hF.now(wF(e));
        })
      : dF && !uF
      ? ((NP = (DP = new dF()).port2),
        (DP.port1.onmessage = EF),
        (MP = ZP(NP.postMessage, NP)))
      : XP.addEventListener &&
        eF(XP.postMessage) &&
        !XP.importScripts &&
        LP &&
        "file:" !== LP.protocol &&
        !rF(xF)
      ? ((MP = xF), XP.addEventListener("message", EF, !1))
      : (MP =
          mF in oF("script")
            ? function (e) {
                nF.appendChild(oF("script"))[mF] = function () {
                  nF.removeChild(this), bF(e);
                };
              }
            : function (e) {
                setTimeout(wF(e), 0);
              }));
  var SF = { set: sF, clear: fF },
    AF = I,
    OF = F,
    kF = Object.getOwnPropertyDescriptor,
    TF = function (e) {
      if (!OF) return AF[e];
      var t = kF(AF, e);
      return t && t.value;
    },
    RF = function () {
      (this.head = null), (this.tail = null);
    };
  RF.prototype = {
    add: function (e) {
      var t = { item: e, next: null },
        r = this.tail;
      r ? (r.next = t) : (this.head = t), (this.tail = t);
    },
    get: function () {
      var e = this.head;
      if (e) return null === (this.head = e.next) && (this.tail = null), e.item;
    },
  };
  var IF,
    _F,
    PF,
    FF,
    jF,
    CF = RF,
    LF = /ipad|iphone|ipod/i.test(Ee) && "undefined" != typeof Pebble,
    MF = /web0s(?!.*chrome)/i.test(Ee),
    DF = I,
    NF = TF,
    UF = Ko,
    BF = SF.set,
    zF = CF,
    HF = JP,
    WF = LF,
    qF = MF,
    VF = Rv,
    GF = DF.MutationObserver || DF.WebKitMutationObserver,
    $F = DF.document,
    YF = DF.process,
    KF = DF.Promise,
    JF = NF("queueMicrotask");
  if (!JF) {
    var XF = new zF(),
      QF = function () {
        var e, t;
        for (VF && (e = YF.domain) && e.exit(); (t = XF.get()); )
          try {
            t();
          } catch ($7) {
            throw (XF.head && IF(), $7);
          }
        e && e.enter();
      };
    HF || VF || qF || !GF || !$F
      ? !WF && KF && KF.resolve
        ? (((FF = KF.resolve(void 0)).constructor = KF),
          (jF = UF(FF.then, FF)),
          (IF = function () {
            jF(QF);
          }))
        : VF
        ? (IF = function () {
            YF.nextTick(QF);
          })
        : ((BF = UF(BF, DF)),
          (IF = function () {
            BF(QF);
          }))
      : ((_F = !0),
        (PF = $F.createTextNode("")),
        new GF(QF).observe(PF, { characterData: !0 }),
        (IF = function () {
          PF.data = _F = !_F;
        })),
      (JF = function (e) {
        XF.head || IF(), XF.add(e);
      });
  }
  var ZF = JF,
    ej = function (e) {
      try {
        return { error: !1, value: e() };
      } catch ($7) {
        return { error: !0, value: $7 };
      }
    },
    tj = I.Promise,
    rj = I,
    nj = tj,
    ij = he,
    oj = xi,
    aj = Lr,
    uj = It,
    cj = Tv,
    sj = Re;
  nj && nj.prototype;
  var fj = uj("species"),
    lj = !1,
    hj = ij(rj.PromiseRejectionEvent),
    pj = {
      CONSTRUCTOR: oj("Promise", function () {
        var e = aj(nj),
          t = e !== String(nj);
        if (!t && 66 === sj) return !0;
        if (!sj || sj < 51 || !/native code/.test(e)) {
          var r = new nj(function (e) {
              e(1);
            }),
            n = function (e) {
              e(
                function () {},
                function () {}
              );
            };
          if (
            (((r.constructor = {})[fj] = n),
            !(lj = r.then(function () {}) instanceof n))
          )
            return !0;
        }
        return !(t || ("BROWSER" !== cj && "DENO" !== cj) || hj);
      }),
      REJECTION_EVENT: hj,
      SUBCLASSING: lj,
    },
    dj = {},
    vj = qe,
    gj = TypeError,
    yj = function (e) {
      var t, r;
      (this.promise = new e(function (e, n) {
        if (void 0 !== t || void 0 !== r)
          throw new gj("Bad Promise constructor");
        (t = e), (r = n);
      })),
        (this.resolve = vj(t)),
        (this.reject = vj(r));
    };
  dj.f = function (e) {
    return new yj(e);
  };
  var mj,
    bj,
    wj,
    Ej = _i,
    xj = Rv,
    Sj = I,
    Aj = M,
    Oj = kn,
    kj = vs,
    Tj = Ho,
    Rj = _g,
    Ij = qe,
    _j = he,
    Pj = de,
    Fj = jy,
    jj = $P,
    Cj = SF.set,
    Lj = ZF,
    Mj = function (e, t) {
      try {
        1 === arguments.length ? console.error(e) : console.error(e, t);
      } catch ($7) {}
    },
    Dj = ej,
    Nj = CF,
    Uj = rn,
    Bj = tj,
    zj = dj,
    Hj = "Promise",
    Wj = pj.CONSTRUCTOR,
    qj = pj.REJECTION_EVENT,
    Vj = pj.SUBCLASSING,
    Gj = Uj.getterFor(Hj),
    $j = Uj.set,
    Yj = Bj && Bj.prototype,
    Kj = Bj,
    Jj = Yj,
    Xj = Sj.TypeError,
    Qj = Sj.document,
    Zj = Sj.process,
    eC = zj.f,
    tC = eC,
    rC = !!(Qj && Qj.createEvent && Sj.dispatchEvent),
    nC = "unhandledrejection",
    iC = function (e) {
      var t;
      return !(!Pj(e) || !_j((t = e.then))) && t;
    },
    oC = function (e, t) {
      var r,
        n,
        i,
        o = t.value,
        a = 1 === t.state,
        u = a ? e.ok : e.fail,
        c = e.resolve,
        s = e.reject,
        f = e.domain;
      try {
        u
          ? (a || (2 === t.rejection && fC(t), (t.rejection = 1)),
            !0 === u
              ? (r = o)
              : (f && f.enter(), (r = u(o)), f && (f.exit(), (i = !0))),
            r === e.promise
              ? s(new Xj("Promise-chain cycle"))
              : (n = iC(r))
              ? Aj(n, r, c, s)
              : c(r))
          : s(o);
      } catch ($7) {
        f && !i && f.exit(), s($7);
      }
    },
    aC = function (e, t) {
      e.notified ||
        ((e.notified = !0),
        Lj(function () {
          for (var r, n = e.reactions; (r = n.get()); ) oC(r, e);
          (e.notified = !1), t && !e.rejection && cC(e);
        }));
    },
    uC = function (e, t, r) {
      var n, i;
      rC
        ? (((n = Qj.createEvent("Event")).promise = t),
          (n.reason = r),
          n.initEvent(e, !1, !0),
          Sj.dispatchEvent(n))
        : (n = { promise: t, reason: r }),
        !qj && (i = Sj["on" + e])
          ? i(n)
          : e === nC && Mj("Unhandled promise rejection", r);
    },
    cC = function (e) {
      Aj(Cj, Sj, function () {
        var t,
          r = e.facade,
          n = e.value;
        if (
          sC(e) &&
          ((t = Dj(function () {
            xj ? Zj.emit("unhandledRejection", n, r) : uC(nC, r, n);
          })),
          (e.rejection = xj || sC(e) ? 2 : 1),
          t.error)
        )
          throw t.value;
      });
    },
    sC = function (e) {
      return 1 !== e.rejection && !e.parent;
    },
    fC = function (e) {
      Aj(Cj, Sj, function () {
        var t = e.facade;
        xj
          ? Zj.emit("rejectionHandled", t)
          : uC("rejectionhandled", t, e.value);
      });
    },
    lC = function (e, t, r) {
      return function (n) {
        e(t, n, r);
      };
    },
    hC = function (e, t, r) {
      e.done ||
        ((e.done = !0), r && (e = r), (e.value = t), (e.state = 2), aC(e, !0));
    },
    pC = function (e, t, r) {
      if (!e.done) {
        (e.done = !0), r && (e = r);
        try {
          if (e.facade === t) throw new Xj("Promise can't be resolved itself");
          var n = iC(t);
          n
            ? Lj(function () {
                var r = { done: !1 };
                try {
                  Aj(n, t, lC(pC, r, e), lC(hC, r, e));
                } catch ($7) {
                  hC(r, $7, e);
                }
              })
            : ((e.value = t), (e.state = 1), aC(e, !1));
        } catch ($7) {
          hC({ done: !1 }, $7, e);
        }
      }
    };
  if (
    Wj &&
    ((Jj = (Kj = function (e) {
      Fj(this, Jj), Ij(e), Aj(mj, this);
      var t = Gj(this);
      try {
        e(lC(pC, t), lC(hC, t));
      } catch ($7) {
        hC(t, $7);
      }
    }).prototype),
    ((mj = function (e) {
      $j(this, {
        type: Hj,
        done: !1,
        notified: !1,
        parent: !1,
        reactions: new Nj(),
        rejection: !1,
        state: 0,
        value: null,
      });
    }).prototype = Oj(Jj, "then", function (e, t) {
      var r = Gj(this),
        n = eC(jj(this, Kj));
      return (
        (r.parent = !0),
        (n.ok = !_j(e) || e),
        (n.fail = _j(t) && t),
        (n.domain = xj ? Zj.domain : void 0),
        0 === r.state
          ? r.reactions.add(n)
          : Lj(function () {
              oC(n, r);
            }),
        n.promise
      );
    })),
    (bj = function () {
      var e = new mj(),
        t = Gj(e);
      (this.promise = e), (this.resolve = lC(pC, t)), (this.reject = lC(hC, t));
    }),
    (zj.f = eC =
      function (e) {
        return e === Kj || undefined === e ? new bj(e) : tC(e);
      }),
    _j(Bj) && Yj !== Object.prototype)
  ) {
    (wj = Yj.then),
      Vj ||
        Oj(
          Yj,
          "then",
          function (e, t) {
            var r = this;
            return new Kj(function (e, t) {
              Aj(wj, r, e, t);
            }).then(e, t);
          },
          { unsafe: !0 }
        );
    try {
      delete Yj.constructor;
    } catch ($7) {}
    kj && kj(Yj, Jj);
  }
  Ej({ global: !0, constructor: !0, wrap: !0, forced: Wj }, { Promise: Kj }),
    Tj(Kj, Hj, !1),
    Rj(Hj);
  var dC = tj,
    vC =
      pj.CONSTRUCTOR ||
      !Cp(function (e) {
        dC.all(e).then(void 0, function () {});
      }),
    gC = M,
    yC = qe,
    mC = dj,
    bC = ej,
    wC = ul;
  _i(
    { target: "Promise", stat: !0, forced: vC },
    {
      all: function (e) {
        var t = this,
          r = mC.f(t),
          n = r.resolve,
          i = r.reject,
          o = bC(function () {
            var r = yC(t.resolve),
              o = [],
              a = 0,
              u = 1;
            wC(e, function (e) {
              var c = a++,
                s = !1;
              u++,
                gC(r, t, e).then(function (e) {
                  s || ((s = !0), (o[c] = e), --u || n(o));
                }, i);
            }),
              --u || n(o);
          });
        return o.error && i(o.value), r.promise;
      },
    }
  );
  var EC = _i,
    xC = pj.CONSTRUCTOR,
    SC = tj,
    AC = ye,
    OC = he,
    kC = kn,
    TC = SC && SC.prototype;
  if (
    (EC(
      { target: "Promise", proto: !0, forced: xC, real: !0 },
      {
        catch: function (e) {
          return this.then(void 0, e);
        },
      }
    ),
    OC(SC))
  ) {
    var RC = AC("Promise").prototype.catch;
    TC.catch !== RC && kC(TC, "catch", RC, { unsafe: !0 });
  }
  var IC = M,
    _C = qe,
    PC = dj,
    FC = ej,
    jC = ul;
  _i(
    { target: "Promise", stat: !0, forced: vC },
    {
      race: function (e) {
        var t = this,
          r = PC.f(t),
          n = r.reject,
          i = FC(function () {
            var i = _C(t.resolve);
            jC(e, function (e) {
              IC(i, t, e).then(r.resolve, n);
            });
          });
        return i.error && n(i.value), r.promise;
      },
    }
  );
  var CC = dj;
  _i(
    { target: "Promise", stat: !0, forced: pj.CONSTRUCTOR },
    {
      reject: function (e) {
        var t = CC.f(this);
        return (0, t.reject)(e), t.promise;
      },
    }
  );
  var LC = ur,
    MC = de,
    DC = dj,
    NC = function (e, t) {
      if ((LC(e), MC(t) && t.constructor === e)) return t;
      var r = DC.f(e);
      return (0, r.resolve)(t), r.promise;
    },
    UC = _i,
    BC = pj.CONSTRUCTOR,
    zC = NC;
  ye("Promise"),
    UC(
      { target: "Promise", stat: !0, forced: BC },
      {
        resolve: function (e) {
          return zC(this, e);
        },
      }
    );
  var HC = M,
    WC = qe,
    qC = dj,
    VC = ej,
    GC = ul;
  _i(
    { target: "Promise", stat: !0, forced: vC },
    {
      allSettled: function (e) {
        var t = this,
          r = qC.f(t),
          n = r.resolve,
          i = r.reject,
          o = VC(function () {
            var r = WC(t.resolve),
              i = [],
              o = 0,
              a = 1;
            GC(e, function (e) {
              var u = o++,
                c = !1;
              a++,
                HC(r, t, e).then(
                  function (e) {
                    c ||
                      ((c = !0),
                      (i[u] = { status: "fulfilled", value: e }),
                      --a || n(i));
                  },
                  function (e) {
                    c ||
                      ((c = !0),
                      (i[u] = { status: "rejected", reason: e }),
                      --a || n(i));
                  }
                );
            }),
              --a || n(i);
          });
        return o.error && i(o.value), r.promise;
      },
    }
  );
  var $C = M,
    YC = qe,
    KC = ye,
    JC = dj,
    XC = ej,
    QC = ul,
    ZC = "No one promise resolved";
  _i(
    { target: "Promise", stat: !0, forced: vC },
    {
      any: function (e) {
        var t = this,
          r = KC("AggregateError"),
          n = JC.f(t),
          i = n.resolve,
          o = n.reject,
          a = XC(function () {
            var n = YC(t.resolve),
              a = [],
              u = 0,
              c = 1,
              s = !1;
            QC(e, function (e) {
              var f = u++,
                l = !1;
              c++,
                $C(n, t, e).then(
                  function (e) {
                    l || s || ((s = !0), i(e));
                  },
                  function (e) {
                    l || s || ((l = !0), (a[f] = e), --c || o(new r(a, ZC)));
                  }
                );
            }),
              --c || o(new r(a, ZC));
          });
        return a.error && o(a.value), n.promise;
      },
    }
  );
  var eL = _i,
    tL = tj,
    rL = P,
    nL = ye,
    iL = he,
    oL = $P,
    aL = NC,
    uL = kn,
    cL = tL && tL.prototype;
  if (
    (eL(
      {
        target: "Promise",
        proto: !0,
        real: !0,
        forced:
          !!tL &&
          rL(function () {
            cL.finally.call({ then: function () {} }, function () {});
          }),
      },
      {
        finally: function (e) {
          var t = oL(this, nL("Promise")),
            r = iL(e);
          return this.then(
            r
              ? function (r) {
                  return aL(t, e()).then(function () {
                    return r;
                  });
                }
              : e,
            r
              ? function (r) {
                  return aL(t, e()).then(function () {
                    throw r;
                  });
                }
              : e
          );
        },
      }
    ),
    iL(tL))
  ) {
    var sL = nL("Promise").prototype.finally;
    cL.finally !== sL && uL(cL, "finally", sL, { unsafe: !0 });
  }
  var fL = _i,
    lL = tc,
    hL = yo,
    pL = dj,
    dL = qe,
    vL = ej,
    gL = I.Promise,
    yL = !1;
  fL(
    {
      target: "Promise",
      stat: !0,
      forced:
        !gL ||
        !gL.try ||
        vL(function () {
          gL.try(function (e) {
            yL = 8 === e;
          }, 8);
        }).error ||
        !yL,
    },
    {
      try: function (e) {
        var t = arguments.length > 1 ? hL(arguments, 1) : [],
          r = pL.f(this),
          n = vL(function () {
            return lL(dL(e), void 0, t);
          });
        return (n.error ? r.reject : r.resolve)(n.value), r.promise;
      },
    }
  );
  var mL = dj;
  _i(
    { target: "Promise", stat: !0 },
    {
      withResolvers: function () {
        var e = mL.f(this);
        return { promise: e.promise, resolve: e.resolve, reject: e.reject };
      },
    }
  );
  var bL = tc,
    wL = qe,
    EL = ur;
  _i(
    {
      target: "Reflect",
      stat: !0,
      forced: !P(function () {
        Reflect.apply(function () {});
      }),
    },
    {
      apply: function (e, t, r) {
        return bL(wL(e), t, EL(r));
      },
    }
  );
  var xL = _i,
    SL = tc,
    AL = _x,
    OL = HP,
    kL = ur,
    TL = de,
    RL = vo,
    IL = P,
    _L = ye("Reflect", "construct"),
    PL = Object.prototype,
    FL = [].push,
    jL = IL(function () {
      function e() {}
      return !(_L(function () {}, [], e) instanceof e);
    }),
    CL = !IL(function () {
      _L(function () {});
    }),
    LL = jL || CL;
  xL(
    { target: "Reflect", stat: !0, forced: LL, sham: LL },
    {
      construct: function (e, t) {
        OL(e), kL(t);
        var r = arguments.length < 3 ? e : OL(arguments[2]);
        if (CL && !jL) return _L(e, t, r);
        if (e === r) {
          switch (t.length) {
            case 0:
              return new e();
            case 1:
              return new e(t[0]);
            case 2:
              return new e(t[0], t[1]);
            case 3:
              return new e(t[0], t[1], t[2]);
            case 4:
              return new e(t[0], t[1], t[2], t[3]);
          }
          var n = [null];
          return SL(FL, n, t), new (SL(AL, e, n))();
        }
        var i = r.prototype,
          o = RL(TL(i) ? i : PL),
          a = SL(e, o, t);
        return TL(a) ? a : o;
      },
    }
  );
  var ML = F,
    DL = ur,
    NL = Bt,
    UL = rr;
  _i(
    {
      target: "Reflect",
      stat: !0,
      forced: P(function () {
        Reflect.defineProperty(UL.f({}, 1, { value: 1 }), 1, { value: 2 });
      }),
      sham: !ML,
    },
    {
      defineProperty: function (e, t, r) {
        DL(e);
        var n = NL(t);
        DL(r);
        try {
          return UL.f(e, n, r), !0;
        } catch ($7) {
          return !1;
        }
      },
    }
  );
  var BL = _i,
    zL = ur,
    HL = _.f;
  BL(
    { target: "Reflect", stat: !0 },
    {
      deleteProperty: function (e, t) {
        var r = HL(zL(e), t);
        return !(r && !r.configurable) && delete e[t];
      },
    }
  );
  var WL = vt,
    qL = function (e) {
      return void 0 !== e && (WL(e, "value") || WL(e, "writable"));
    },
    VL = M,
    GL = de,
    $L = ur,
    YL = qL,
    KL = _,
    JL = Of;
  _i(
    { target: "Reflect", stat: !0 },
    {
      get: function e(t, r) {
        var n,
          i,
          o = arguments.length < 3 ? t : arguments[2];
        return $L(t) === o
          ? t[r]
          : (n = KL.f(t, r))
          ? YL(n)
            ? n.value
            : void 0 === n.get
            ? void 0
            : VL(n.get, o)
          : GL((i = JL(t)))
          ? e(i, r, o)
          : void 0;
      },
    }
  );
  var XL = ur,
    QL = _;
  _i(
    { target: "Reflect", stat: !0, sham: !F },
    {
      getOwnPropertyDescriptor: function (e, t) {
        return QL.f(XL(e), t);
      },
    }
  );
  var ZL = ur,
    eM = Of;
  _i(
    { target: "Reflect", stat: !0, sham: !yf },
    {
      getPrototypeOf: function (e) {
        return eM(ZL(e));
      },
    }
  ),
    _i(
      { target: "Reflect", stat: !0 },
      {
        has: function (e, t) {
          return t in e;
        },
      }
    );
  var tM = ur,
    rM = sO;
  _i(
    { target: "Reflect", stat: !0 },
    {
      isExtensible: function (e) {
        return tM(e), rM(e);
      },
    }
  ),
    _i({ target: "Reflect", stat: !0 }, { ownKeys: ci });
  var nM = ye,
    iM = ur;
  _i(
    { target: "Reflect", stat: !0, sham: !fO },
    {
      preventExtensions: function (e) {
        iM(e);
        try {
          var t = nM("Object", "preventExtensions");
          return t && t(e), !0;
        } catch ($7) {
          return !1;
        }
      },
    }
  );
  var oM = M,
    aM = ur,
    uM = de,
    cM = qL,
    sM = rr,
    fM = _,
    lM = Of,
    hM = W;
  _i(
    {
      target: "Reflect",
      stat: !0,
      forced: P(function () {
        var e = function () {},
          t = sM.f(new e(), "a", { configurable: !0 });
        return !1 !== Reflect.set(e.prototype, "a", 1, t);
      }),
    },
    {
      set: function e(t, r, n) {
        var i,
          o,
          a,
          u = arguments.length < 4 ? t : arguments[3],
          c = fM.f(aM(t), r);
        if (!c) {
          if (uM((o = lM(t)))) return e(o, r, n, u);
          c = hM(0);
        }
        if (cM(c)) {
          if (!1 === c.writable || !uM(u)) return !1;
          if ((i = fM.f(u, r))) {
            if (i.get || i.set || !1 === i.writable) return !1;
            (i.value = n), sM.f(u, r, i);
          } else sM.f(u, r, hM(0, n));
        } else {
          if (void 0 === (a = c.set)) return !1;
          oM(a, u, n);
        }
        return !0;
      },
    }
  );
  var pM = ur,
    dM = fs,
    vM = vs;
  vM &&
    _i(
      { target: "Reflect", stat: !0 },
      {
        setPrototypeOf: function (e, t) {
          pM(e), dM(t);
          try {
            return vM(e, t), !0;
          } catch ($7) {
            return !1;
          }
        },
      }
    );
  var gM = I,
    yM = Ho;
  _i({ global: !0 }, { Reflect: {} }), yM(gM.Reflect, "Reflect", !0);
  var mM = de,
    bM = Q,
    wM = It("match"),
    EM = function (e) {
      var t;
      return mM(e) && (void 0 !== (t = e[wM]) ? !!t : "RegExp" === bM(e));
    },
    xM = ur,
    SM = function () {
      var e = xM(this),
        t = "";
      return (
        e.hasIndices && (t += "d"),
        e.global && (t += "g"),
        e.ignoreCase && (t += "i"),
        e.multiline && (t += "m"),
        e.dotAll && (t += "s"),
        e.unicode && (t += "u"),
        e.unicodeSets && (t += "v"),
        e.sticky && (t += "y"),
        t
      );
    },
    AM = M,
    OM = vt,
    kM = me,
    TM = SM,
    RM = RegExp.prototype,
    IM = function (e) {
      var t = e.flags;
      return void 0 !== t || "flags" in RM || OM(e, "flags") || !kM(RM, e)
        ? t
        : AM(TM, e);
    },
    _M = P,
    PM = I.RegExp,
    FM = _M(function () {
      var e = PM("a", "y");
      return (e.lastIndex = 2), null !== e.exec("abcd");
    }),
    jM =
      FM ||
      _M(function () {
        return !PM("a", "y").sticky;
      }),
    CM =
      FM ||
      _M(function () {
        var e = PM("^r", "gy");
        return (e.lastIndex = 2), null !== e.exec("str");
      }),
    LM = { BROKEN_CARET: CM, MISSED_STICKY: jM, UNSUPPORTED_Y: FM },
    MM = P,
    DM = I.RegExp,
    NM = MM(function () {
      var e = DM(".", "s");
      return !(e.dotAll && e.test("\n") && "s" === e.flags);
    }),
    UM = P,
    BM = I.RegExp,
    zM = UM(function () {
      var e = BM("(?<a>b)", "g");
      return "b" !== e.exec("b").groups.a || "bc" !== "b".replace(e, "$<a>c");
    }),
    HM = F,
    WM = I,
    qM = Y,
    VM = xi,
    GM = Es,
    $M = Er,
    YM = vo,
    KM = Tn.f,
    JM = me,
    XM = EM,
    QM = Hi,
    ZM = IM,
    eD = LM,
    tD = ys,
    rD = kn,
    nD = P,
    iD = vt,
    oD = rn.enforce,
    aD = _g,
    uD = NM,
    cD = zM,
    sD = It("match"),
    fD = WM.RegExp,
    lD = fD.prototype,
    hD = WM.SyntaxError,
    pD = qM(lD.exec),
    dD = qM("".charAt),
    vD = qM("".replace),
    gD = qM("".indexOf),
    yD = qM("".slice),
    mD = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/,
    bD = /a/g,
    wD = /a/g,
    ED = new fD(bD) !== bD,
    xD = eD.MISSED_STICKY,
    SD = eD.UNSUPPORTED_Y,
    AD =
      HM &&
      (!ED ||
        xD ||
        uD ||
        cD ||
        nD(function () {
          return (
            (wD[sD] = !1),
            fD(bD) !== bD || fD(wD) === wD || "/a/i" !== String(fD(bD, "i"))
          );
        }));
  if (VM("RegExp", AD)) {
    for (
      var OD = function (e, t) {
          var r,
            n,
            i,
            o,
            a,
            u,
            c = JM(lD, this),
            s = XM(e),
            f = void 0 === t,
            l = [],
            h = e;
          if (!c && s && f && e.constructor === OD) return e;
          if (
            ((s || JM(lD, e)) && ((e = e.source), f && (t = ZM(h))),
            (e = void 0 === e ? "" : QM(e)),
            (t = void 0 === t ? "" : QM(t)),
            (h = e),
            uD &&
              ("dotAll" in bD) &&
              (n = !!t && gD(t, "s") > -1) &&
              (t = vD(t, /s/g, "")),
            (r = t),
            xD &&
              ("sticky" in bD) &&
              (i = !!t && gD(t, "y") > -1) &&
              SD &&
              (t = vD(t, /y/g, "")),
            cD &&
              ((o = (function (e) {
                for (
                  var t,
                    r = e.length,
                    n = 0,
                    i = "",
                    o = [],
                    a = YM(null),
                    u = !1,
                    c = !1,
                    s = 0,
                    f = "";
                  n <= r;
                  n++
                ) {
                  if ("\\" === (t = dD(e, n))) t += dD(e, ++n);
                  else if ("]" === t) u = !1;
                  else if (!u)
                    switch (!0) {
                      case "[" === t:
                        u = !0;
                        break;
                      case "(" === t:
                        if (((i += t), "?:" === yD(e, n + 1, n + 3))) continue;
                        pD(mD, yD(e, n + 1)) && ((n += 2), (c = !0)), s++;
                        continue;
                      case ">" === t && c:
                        if ("" === f || iD(a, f))
                          throw new hD("Invalid capture group name");
                        (a[f] = !0), (o[o.length] = [f, s]), (c = !1), (f = "");
                        continue;
                    }
                  c ? (f += t) : (i += t);
                }
                return [i, o];
              })(e)),
              (e = o[0]),
              (l = o[1])),
            (a = GM(fD(e, t), c ? this : lD, OD)),
            (n || i || l.length) &&
              ((u = oD(a)),
              n &&
                ((u.dotAll = !0),
                (u.raw = OD(
                  (function (e) {
                    for (
                      var t, r = e.length, n = 0, i = "", o = !1;
                      n <= r;
                      n++
                    )
                      "\\" !== (t = dD(e, n))
                        ? o || "." !== t
                          ? ("[" === t ? (o = !0) : "]" === t && (o = !1),
                            (i += t))
                          : (i += "[\\s\\S]")
                        : (i += t + dD(e, ++n));
                    return i;
                  })(e),
                  r
                ))),
              i && (u.sticky = !0),
              l.length && (u.groups = l)),
            e !== h)
          )
            try {
              $M(a, "source", "" === h ? "(?:)" : h);
            } catch ($7) {}
          return a;
        },
        kD = KM(fD),
        TD = 0;
      kD.length > TD;

    )
      tD(OD, fD, kD[TD++]);
    (lD.constructor = OD),
      (OD.prototype = lD),
      rD(WM, "RegExp", OD, { constructor: !0 });
  }
  aD("RegExp");
  var RD = F,
    ID = NM,
    _D = Q,
    PD = Oo,
    FD = rn.get,
    jD = RegExp.prototype,
    CD = TypeError;
  RD &&
    ID &&
    PD(jD, "dotAll", {
      configurable: !0,
      get: function () {
        if (this !== jD) {
          if ("RegExp" === _D(this)) return !!FD(this).dotAll;
          throw new CD("Incompatible receiver, RegExp required");
        }
      },
    });
  var LD,
    MD,
    DD = M,
    ND = Y,
    UD = Hi,
    BD = SM,
    zD = LM,
    HD = vo,
    WD = rn.get,
    qD = NM,
    VD = zM,
    GD = st("native-string-replace", String.prototype.replace),
    $D = RegExp.prototype.exec,
    YD = $D,
    KD = ND("".charAt),
    JD = ND("".indexOf),
    XD = ND("".replace),
    QD = ND("".slice),
    ZD =
      ((MD = /b*/g),
      DD($D, (LD = /a/), "a"),
      DD($D, MD, "a"),
      0 !== LD.lastIndex || 0 !== MD.lastIndex),
    eN = zD.BROKEN_CARET,
    tN = void 0 !== /()??/.exec("")[1];
  (ZD || tN || eN || qD || VD) &&
    (YD = function (e) {
      var t,
        r,
        n,
        i,
        o,
        a,
        u,
        c = this,
        s = WD(c),
        f = UD(e),
        l = s.raw;
      if (l)
        return (
          (l.lastIndex = c.lastIndex),
          (t = DD(YD, l, f)),
          (c.lastIndex = l.lastIndex),
          t
        );
      var h = s.groups,
        p = eN && c.sticky,
        d = DD(BD, c),
        v = c.source,
        g = 0,
        y = f;
      if (
        (p &&
          ((d = XD(d, "y", "")),
          -1 === JD(d, "g") && (d += "g"),
          (y = QD(f, c.lastIndex)),
          c.lastIndex > 0 &&
            (!c.multiline ||
              (c.multiline && "\n" !== KD(f, c.lastIndex - 1))) &&
            ((v = "(?: " + v + ")"), (y = " " + y), g++),
          (r = new RegExp("^(?:" + v + ")", d))),
        tN && (r = new RegExp("^" + v + "$(?!\\s)", d)),
        ZD && (n = c.lastIndex),
        (i = DD($D, p ? r : c, y)),
        p
          ? i
            ? ((i.input = QD(i.input, g)),
              (i[0] = QD(i[0], g)),
              (i.index = c.lastIndex),
              (c.lastIndex += i[0].length))
            : (c.lastIndex = 0)
          : ZD && i && (c.lastIndex = c.global ? i.index + i[0].length : n),
        tN &&
          i &&
          i.length > 1 &&
          DD(GD, i[0], r, function () {
            for (o = 1; o < arguments.length - 2; o++)
              void 0 === arguments[o] && (i[o] = void 0);
          }),
        i && h)
      )
        for (i.groups = a = HD(null), o = 0; o < h.length; o++)
          a[(u = h[o])[0]] = i[u[1]];
      return i;
    });
  var rN = YD;
  _i({ target: "RegExp", proto: !0, forced: /./.exec !== rN }, { exec: rN });
  var nN = F,
    iN = Oo,
    oN = SM,
    aN = P,
    uN = I.RegExp,
    cN = uN.prototype;
  nN &&
    aN(function () {
      var e = !0;
      try {
        uN(".", "d");
      } catch ($7) {
        e = !1;
      }
      var t = {},
        r = "",
        n = e ? "dgimsy" : "gimsy",
        i = function (e, n) {
          Object.defineProperty(t, e, {
            get: function () {
              return (r += n), !0;
            },
          });
        },
        o = {
          dotAll: "s",
          global: "g",
          ignoreCase: "i",
          multiline: "m",
          sticky: "y",
        };
      for (var a in (e && (o.hasIndices = "d"), o)) i(a, o[a]);
      return (
        Object.getOwnPropertyDescriptor(cN, "flags").get.call(t) !== n ||
        r !== n
      );
    }) &&
    iN(cN, "flags", { configurable: !0, get: oN });
  var sN = F,
    fN = LM.MISSED_STICKY,
    lN = Q,
    hN = Oo,
    pN = rn.get,
    dN = RegExp.prototype,
    vN = TypeError;
  sN &&
    fN &&
    hN(dN, "sticky", {
      configurable: !0,
      get: function () {
        if (this !== dN) {
          if ("RegExp" === lN(this)) return !!pN(this).sticky;
          throw new vN("Incompatible receiver, RegExp required");
        }
      },
    });
  var gN,
    yN,
    mN = _i,
    bN = M,
    wN = he,
    EN = ur,
    xN = Hi,
    SN =
      ((gN = !1),
      ((yN = /[ac]/).exec = function () {
        return (gN = !0), /./.exec.apply(this, arguments);
      }),
      !0 === yN.test("abc") && gN),
    AN = /./.test;
  mN(
    { target: "RegExp", proto: !0, forced: !SN },
    {
      test: function (e) {
        var t = EN(this),
          r = xN(e),
          n = t.exec;
        if (!wN(n)) return bN(AN, t, r);
        var i = bN(n, t, r);
        return null !== i && (EN(i), !0);
      },
    }
  );
  var ON = Rr.PROPER,
    kN = kn,
    TN = ur,
    RN = Hi,
    IN = P,
    _N = IM,
    PN = "toString",
    FN = RegExp.prototype,
    jN = FN[PN],
    CN = IN(function () {
      return "/a/b" !== jN.call({ source: "a", flags: "b" });
    }),
    LN = ON && jN.name !== PN;
  (CN || LN) &&
    kN(
      FN,
      PN,
      function () {
        var e = TN(this);
        return "/" + RN(e.source) + "/" + RN(_N(e));
      },
      { unsafe: !0 }
    ),
    HO(
      "Set",
      function (e) {
        return function () {
          return e(this, arguments.length ? arguments[0] : void 0);
        };
      },
      nk
    );
  var MN = Y,
    DN = Set.prototype,
    NN = {
      Set: Set,
      add: MN(DN.add),
      has: MN(DN.has),
      remove: MN(DN.delete),
      proto: DN,
    },
    UN = NN.has,
    BN = function (e) {
      return UN(e), e;
    },
    zN = M,
    HN = function (e, t, r) {
      for (var n, i, o = r ? e : e.iterator, a = e.next; !(n = zN(a, o)).done; )
        if (void 0 !== (i = t(n.value))) return i;
    },
    WN = Y,
    qN = HN,
    VN = NN.Set,
    GN = NN.proto,
    $N = WN(GN.forEach),
    YN = WN(GN.keys),
    KN = YN(new VN()).next,
    JN = function (e, t, r) {
      return r ? qN({ iterator: YN(e), next: KN }, t) : $N(e, t);
    },
    XN = JN,
    QN = NN.Set,
    ZN = NN.add,
    eU = function (e) {
      var t = new QN();
      return (
        XN(e, function (e) {
          ZN(t, e);
        }),
        t
      );
    },
    tU =
      is(NN.proto, "size", "get") ||
      function (e) {
        return e.size;
      },
    rU = qe,
    nU = ur,
    iU = M,
    oU = Fn,
    aU = dS,
    uU = "Invalid size",
    cU = RangeError,
    sU = TypeError,
    fU = Math.max,
    lU = function (e, t) {
      (this.set = e),
        (this.size = fU(t, 0)),
        (this.has = rU(e.has)),
        (this.keys = rU(e.keys));
    };
  lU.prototype = {
    getIterator: function () {
      return aU(nU(iU(this.keys, this.set)));
    },
    includes: function (e) {
      return iU(this.has, this.set, e);
    },
  };
  var hU = function (e) {
      nU(e);
      var t = +e.size;
      if (t != t) throw new sU(uU);
      var r = oU(t);
      if (r < 0) throw new cU(uU);
      return new lU(e, r);
    },
    pU = BN,
    dU = eU,
    vU = tU,
    gU = hU,
    yU = JN,
    mU = HN,
    bU = NN.has,
    wU = NN.remove,
    EU = ye,
    xU = function (e) {
      return {
        size: e,
        has: function () {
          return !1;
        },
        keys: function () {
          return {
            next: function () {
              return { done: !0 };
            },
          };
        },
      };
    },
    SU = function (e) {
      return {
        size: e,
        has: function () {
          return !0;
        },
        keys: function () {
          throw new Error("e");
        },
      };
    },
    AU = function (e, t) {
      var r = EU("Set");
      try {
        new r()[e](xU(0));
        try {
          return new r()[e](xU(-1)), !1;
        } catch (i) {
          if (!t) return !0;
          try {
            return new r()[e](SU(-1 / 0)), !1;
          } catch ($7) {
            var n = new r();
            return n.add(1), n.add(2), t(n[e](SU(1 / 0)));
          }
        }
      } catch ($7) {
        return !1;
      }
    },
    OU = function (e) {
      var t = pU(this),
        r = gU(e),
        n = dU(t);
      return (
        vU(t) <= r.size
          ? yU(t, function (e) {
              r.includes(e) && wU(n, e);
            })
          : mU(r.getIterator(), function (e) {
              bU(t, e) && wU(n, e);
            }),
        n
      );
    };
  _i(
    {
      target: "Set",
      proto: !0,
      real: !0,
      forced: !AU("difference", function (e) {
        return 0 === e.size;
      }),
    },
    { difference: OU }
  );
  var kU = BN,
    TU = tU,
    RU = hU,
    IU = JN,
    _U = HN,
    PU = NN.Set,
    FU = NN.add,
    jU = NN.has,
    CU = P,
    LU = function (e) {
      var t = kU(this),
        r = RU(e),
        n = new PU();
      return (
        TU(t) > r.size
          ? _U(r.getIterator(), function (e) {
              jU(t, e) && FU(n, e);
            })
          : IU(t, function (e) {
              r.includes(e) && FU(n, e);
            }),
        n
      );
    };
  _i(
    {
      target: "Set",
      proto: !0,
      real: !0,
      forced:
        !AU("intersection", function (e) {
          return 2 === e.size && e.has(1) && e.has(2);
        }) ||
        CU(function () {
          return (
            "3,2" !==
            String(Array.from(new Set([1, 2, 3]).intersection(new Set([3, 2]))))
          );
        }),
    },
    { intersection: LU }
  );
  var MU = BN,
    DU = NN.has,
    NU = tU,
    UU = hU,
    BU = JN,
    zU = HN,
    HU = $f,
    WU = function (e) {
      var t = MU(this),
        r = UU(e);
      if (NU(t) <= r.size)
        return (
          !1 !==
          BU(
            t,
            function (e) {
              if (r.includes(e)) return !1;
            },
            !0
          )
        );
      var n = r.getIterator();
      return (
        !1 !==
        zU(n, function (e) {
          if (DU(t, e)) return HU(n, "normal", !1);
        })
      );
    };
  _i(
    {
      target: "Set",
      proto: !0,
      real: !0,
      forced: !AU("isDisjointFrom", function (e) {
        return !e;
      }),
    },
    { isDisjointFrom: WU }
  );
  var qU = BN,
    VU = tU,
    GU = JN,
    $U = hU,
    YU = function (e) {
      var t = qU(this),
        r = $U(e);
      return (
        !(VU(t) > r.size) &&
        !1 !==
          GU(
            t,
            function (e) {
              if (!r.includes(e)) return !1;
            },
            !0
          )
      );
    };
  _i(
    {
      target: "Set",
      proto: !0,
      real: !0,
      forced: !AU("isSubsetOf", function (e) {
        return e;
      }),
    },
    { isSubsetOf: YU }
  );
  var KU = BN,
    JU = NN.has,
    XU = tU,
    QU = hU,
    ZU = HN,
    eB = $f,
    tB = function (e) {
      var t = KU(this),
        r = QU(e);
      if (XU(t) < r.size) return !1;
      var n = r.getIterator();
      return (
        !1 !==
        ZU(n, function (e) {
          if (!JU(t, e)) return eB(n, "normal", !1);
        })
      );
    };
  _i(
    {
      target: "Set",
      proto: !0,
      real: !0,
      forced: !AU("isSupersetOf", function (e) {
        return !e;
      }),
    },
    { isSupersetOf: tB }
  );
  var rB = BN,
    nB = eU,
    iB = hU,
    oB = HN,
    aB = NN.add,
    uB = NN.has,
    cB = NN.remove,
    sB = function (e) {
      var t = rB(this),
        r = iB(e).getIterator(),
        n = nB(t);
      return (
        oB(r, function (e) {
          uB(t, e) ? cB(n, e) : aB(n, e);
        }),
        n
      );
    };
  _i(
    { target: "Set", proto: !0, real: !0, forced: !AU("symmetricDifference") },
    { symmetricDifference: sB }
  );
  var fB = BN,
    lB = NN.add,
    hB = eU,
    pB = hU,
    dB = HN,
    vB = function (e) {
      var t = fB(this),
        r = pB(e).getIterator(),
        n = hB(t);
      return (
        dB(r, function (e) {
          lB(n, e);
        }),
        n
      );
    };
  _i(
    { target: "Set", proto: !0, real: !0, forced: !AU("union") },
    { union: vB }
  );
  var gB = _i,
    yB = ue,
    mB = Fn,
    bB = Hi,
    wB = P,
    EB = Y("".charAt);
  gB(
    {
      target: "String",
      proto: !0,
      forced: wB(function () {
        return "\ud842" !== "馉".at(-2);
      }),
    },
    {
      at: function (e) {
        var t = bB(yB(this)),
          r = t.length,
          n = mB(e),
          i = n >= 0 ? n : r + n;
        return i < 0 || i >= r ? void 0 : EB(t, i);
      },
    }
  );
  var xB = Y,
    SB = Fn,
    AB = Hi,
    OB = ue,
    kB = xB("".charAt),
    TB = xB("".charCodeAt),
    RB = xB("".slice),
    IB = function (e) {
      return function (t, r) {
        var n,
          i,
          o = AB(OB(t)),
          a = SB(r),
          u = o.length;
        return a < 0 || a >= u
          ? e
            ? ""
            : void 0
          : (n = TB(o, a)) < 55296 ||
            n > 56319 ||
            a + 1 === u ||
            (i = TB(o, a + 1)) < 56320 ||
            i > 57343
          ? e
            ? kB(o, a)
            : n
          : e
          ? RB(o, a, a + 2)
          : i - 56320 + ((n - 55296) << 10) + 65536;
      };
    },
    _B = { codeAt: IB(!1), charAt: IB(!0) },
    PB = _B.codeAt;
  _i(
    { target: "String", proto: !0 },
    {
      codePointAt: function (e) {
        return PB(this, e);
      },
    }
  );
  var FB,
    jB = EM,
    CB = TypeError,
    LB = function (e) {
      if (jB(e)) throw new CB("The method doesn't accept regular expressions");
      return e;
    },
    MB = It("match"),
    DB = function (e) {
      var t = /./;
      try {
        "/./"[e](t);
      } catch (r) {
        try {
          return (t[MB] = !1), "/./"[e](t);
        } catch (n) {}
      }
      return !1;
    },
    NB = _i,
    UB = Vo,
    BB = _.f,
    zB = Un,
    HB = Hi,
    WB = LB,
    qB = ue,
    VB = DB,
    GB = UB("".slice),
    $B = Math.min,
    YB = VB("endsWith");
  NB(
    {
      target: "String",
      proto: !0,
      forced:
        !!(
          YB || ((FB = BB(String.prototype, "endsWith")), !FB || FB.writable)
        ) && !YB,
    },
    {
      endsWith: function (e) {
        var t = HB(qB(this));
        WB(e);
        var r = arguments.length > 1 ? arguments[1] : void 0,
          n = t.length,
          i = void 0 === r ? n : $B(zB(r), n),
          o = HB(e);
        return GB(t, i - o.length, i) === o;
      },
    }
  );
  var KB = _i,
    JB = Y,
    XB = Mn,
    QB = RangeError,
    ZB = String.fromCharCode,
    ez = String.fromCodePoint,
    tz = JB([].join);
  KB(
    { target: "String", stat: !0, arity: 1, forced: !!ez && 1 !== ez.length },
    {
      fromCodePoint: function (e) {
        for (var t, r = [], n = arguments.length, i = 0; n > i; ) {
          if (((t = +arguments[i++]), XB(t, 1114111) !== t))
            throw new QB(t + " is not a valid code point");
          r[i] =
            t < 65536
              ? ZB(t)
              : ZB(55296 + ((t -= 65536) >> 10), (t % 1024) + 56320);
        }
        return tz(r, "");
      },
    }
  );
  var rz = _i,
    nz = LB,
    iz = ue,
    oz = Hi,
    az = DB,
    uz = Y("".indexOf);
  rz(
    { target: "String", proto: !0, forced: !az("includes") },
    {
      includes: function (e) {
        return !!~uz(
          oz(iz(this)),
          oz(nz(e)),
          arguments.length > 1 ? arguments[1] : void 0
        );
      },
    }
  );
  var cz = _i,
    sz = ue,
    fz = Hi,
    lz = Y("".charCodeAt);
  cz(
    { target: "String", proto: !0 },
    {
      isWellFormed: function () {
        for (var e = fz(sz(this)), t = e.length, r = 0; r < t; r++) {
          var n = lz(e, r);
          if (
            55296 == (63488 & n) &&
            (n >= 56320 || ++r >= t || 56320 != (64512 & lz(e, r)))
          )
            return !1;
        }
        return !0;
      },
    }
  );
  var hz = _B.charAt,
    pz = Hi,
    dz = rn,
    vz = kd,
    gz = Td,
    yz = "String Iterator",
    mz = dz.set,
    bz = dz.getterFor(yz);
  vz(
    String,
    "String",
    function (e) {
      mz(this, { type: yz, string: pz(e), index: 0 });
    },
    function () {
      var e,
        t = bz(this),
        r = t.string,
        n = t.index;
      return n >= r.length
        ? gz(void 0, !0)
        : ((e = hz(r, n)), (t.index += e.length), gz(e, !1));
    }
  );
  var wz = M,
    Ez = kn,
    xz = rN,
    Sz = P,
    Az = It,
    Oz = Er,
    kz = Az("species"),
    Tz = RegExp.prototype,
    Rz = function (e, t, r, n) {
      var i = Az(e),
        o = !Sz(function () {
          var t = {};
          return (
            (t[i] = function () {
              return 7;
            }),
            7 !== ""[e](t)
          );
        }),
        a =
          o &&
          !Sz(function () {
            var t = !1,
              r = /a/;
            return (
              "split" === e &&
                (((r = {}).constructor = {}),
                (r.constructor[kz] = function () {
                  return r;
                }),
                (r.flags = ""),
                (r[i] = /./[i])),
              (r.exec = function () {
                return (t = !0), null;
              }),
              r[i](""),
              !t
            );
          });
      if (!o || !a || r) {
        var u = /./[i],
          c = t(i, ""[e], function (e, t, r, n, i) {
            var a = t.exec;
            return a === xz || a === Tz.exec
              ? o && !i
                ? { done: !0, value: wz(u, t, r, n) }
                : { done: !0, value: wz(e, r, t, n) }
              : { done: !1 };
          });
        Ez(String.prototype, e, c[0]), Ez(Tz, i, c[1]);
      }
      n && Oz(Tz[i], "sham", !0);
    },
    Iz = _B.charAt,
    _z = function (e, t, r) {
      return t + (r ? Iz(e, t).length : 1);
    },
    Pz = M,
    Fz = ur,
    jz = he,
    Cz = Q,
    Lz = rN,
    Mz = TypeError,
    Dz = function (e, t) {
      var r = e.exec;
      if (jz(r)) {
        var n = Pz(r, e, t);
        return null !== n && Fz(n), n;
      }
      if ("RegExp" === Cz(e)) return Pz(Lz, e, t);
      throw new Mz("RegExp#exec called on incompatible receiver");
    },
    Nz = M,
    Uz = ur,
    Bz = ie,
    zz = Un,
    Hz = Hi,
    Wz = ue,
    qz = $e,
    Vz = _z,
    Gz = Dz;
  Rz("match", function (e, t, r) {
    return [
      function (t) {
        var r = Wz(this),
          n = Bz(t) ? void 0 : qz(t, e);
        return n ? Nz(n, t, r) : new RegExp(t)[e](Hz(r));
      },
      function (e) {
        var n = Uz(this),
          i = Hz(e),
          o = r(t, n, i);
        if (o.done) return o.value;
        if (!n.global) return Gz(n, i);
        var a = n.unicode;
        n.lastIndex = 0;
        for (var u, c = [], s = 0; null !== (u = Gz(n, i)); ) {
          var f = Hz(u[0]);
          (c[s] = f),
            "" === f && (n.lastIndex = Vz(i, zz(n.lastIndex), a)),
            s++;
        }
        return 0 === s ? null : c;
      },
    ];
  });
  var $z = _i,
    Yz = M,
    Kz = Vo,
    Jz = ad,
    Xz = Td,
    Qz = ue,
    Zz = Un,
    eH = Hi,
    tH = ur,
    rH = ie,
    nH = EM,
    iH = IM,
    oH = $e,
    aH = kn,
    uH = P,
    cH = $P,
    sH = _z,
    fH = Dz,
    lH = rn,
    hH = It("matchAll"),
    pH = "RegExp String",
    dH = pH + " Iterator",
    vH = lH.set,
    gH = lH.getterFor(dH),
    yH = RegExp.prototype,
    mH = TypeError,
    bH = Kz("".indexOf),
    wH = Kz("".matchAll),
    EH =
      !!wH &&
      !uH(function () {
        wH("a", /./);
      }),
    xH = Jz(
      function (e, t, r, n) {
        vH(this, {
          type: dH,
          regexp: e,
          string: t,
          global: r,
          unicode: n,
          done: !1,
        });
      },
      pH,
      function () {
        var e = gH(this);
        if (e.done) return Xz(void 0, !0);
        var t = e.regexp,
          r = e.string,
          n = fH(t, r);
        return null === n
          ? ((e.done = !0), Xz(void 0, !0))
          : e.global
          ? ("" === eH(n[0]) &&
              (t.lastIndex = sH(r, Zz(t.lastIndex), e.unicode)),
            Xz(n, !1))
          : ((e.done = !0), Xz(n, !1));
      }
    ),
    SH = function (e) {
      var t,
        r,
        n,
        i = tH(this),
        o = eH(e),
        a = cH(i, RegExp),
        u = eH(iH(i));
      return (
        (t = new a(a === RegExp ? i.source : i, u)),
        (r = !!~bH(u, "g")),
        (n = !!~bH(u, "u")),
        (t.lastIndex = Zz(i.lastIndex)),
        new xH(t, o, r, n)
      );
    };
  $z(
    { target: "String", proto: !0, forced: EH },
    {
      matchAll: function (e) {
        var t,
          r,
          n,
          i = Qz(this);
        if (rH(e)) {
          if (EH) return wH(i, e);
        } else {
          if (nH(e) && ((t = eH(Qz(iH(e)))), !~bH(t, "g")))
            throw new mH("`.matchAll` does not allow non-global regexes");
          if (EH) return wH(i, e);
          if ((n = oH(e, hH))) return Yz(n, e, i);
        }
        return (r = eH(i)), new RegExp(e, "g")[hH](r);
      },
    }
  ),
    hH in yH || aH(yH, hH, SH);
  var AH =
      /Version\/10(?:\.\d+){1,2}(?: [\w./]+)?(?: Mobile\/\w+)? Safari\//.test(
        Ee
      ),
    OH = IE.end;
  _i(
    { target: "String", proto: !0, forced: AH },
    {
      padEnd: function (e) {
        return OH(this, e, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  );
  var kH = IE.start;
  _i(
    { target: "String", proto: !0, forced: AH },
    {
      padStart: function (e) {
        return kH(this, e, arguments.length > 1 ? arguments[1] : void 0);
      },
    }
  );
  var TH = _i,
    RH = Y,
    IH = fe,
    _H = ht,
    PH = Hi,
    FH = zn,
    jH = RH([].push),
    CH = RH([].join);
  TH(
    { target: "String", stat: !0 },
    {
      raw: function (e) {
        var t = IH(_H(e).raw),
          r = FH(t);
        if (!r) return "";
        for (var n = arguments.length, i = [], o = 0; ; ) {
          if ((jH(i, PH(t[o++])), o === r)) return CH(i, "");
          o < n && jH(i, PH(arguments[o]));
        }
      },
    }
  ),
    _i({ target: "String", proto: !0 }, { repeat: wE });
  var LH = Y,
    MH = ht,
    DH = Math.floor,
    NH = LH("".charAt),
    UH = LH("".replace),
    BH = LH("".slice),
    zH = /\$([$&'`]|\d{1,2}|<[^>]*>)/g,
    HH = /\$([$&'`]|\d{1,2})/g,
    WH = function (e, t, r, n, i, o) {
      var a = r + e.length,
        u = n.length,
        c = HH;
      return (
        void 0 !== i && ((i = MH(i)), (c = zH)),
        UH(o, c, function (o, c) {
          var s;
          switch (NH(c, 0)) {
            case "$":
              return "$";
            case "&":
              return e;
            case "`":
              return BH(t, 0, r);
            case "'":
              return BH(t, a);
            case "<":
              s = i[BH(c, 1, -1)];
              break;
            default:
              var f = +c;
              if (0 === f) return o;
              if (f > u) {
                var l = DH(f / 10);
                return 0 === l
                  ? o
                  : l <= u
                  ? void 0 === n[l - 1]
                    ? NH(c, 1)
                    : n[l - 1] + NH(c, 1)
                  : o;
              }
              s = n[f - 1];
          }
          return void 0 === s ? "" : s;
        })
      );
    },
    qH = tc,
    VH = M,
    GH = Y,
    $H = Rz,
    YH = P,
    KH = ur,
    JH = he,
    XH = ie,
    QH = Fn,
    ZH = Un,
    eW = Hi,
    tW = ue,
    rW = _z,
    nW = $e,
    iW = WH,
    oW = Dz,
    aW = It("replace"),
    uW = Math.max,
    cW = Math.min,
    sW = GH([].concat),
    fW = GH([].push),
    lW = GH("".indexOf),
    hW = GH("".slice),
    pW = "$0" === "a".replace(/./, "$0"),
    dW = !!/./[aW] && "" === /./[aW]("a", "$0"),
    vW = !YH(function () {
      var e = /./;
      return (
        (e.exec = function () {
          var e = [];
          return (e.groups = { a: "7" }), e;
        }),
        "7" !== "".replace(e, "$<a>")
      );
    });
  $H(
    "replace",
    function (e, t, r) {
      var n = dW ? "$" : "$0";
      return [
        function (e, r) {
          var n = tW(this),
            i = XH(e) ? void 0 : nW(e, aW);
          return i ? VH(i, e, n, r) : VH(t, eW(n), e, r);
        },
        function (e, i) {
          var o = KH(this),
            a = eW(e);
          if ("string" == typeof i && -1 === lW(i, n) && -1 === lW(i, "$<")) {
            var u = r(t, o, a, i);
            if (u.done) return u.value;
          }
          var c = JH(i);
          c || (i = eW(i));
          var s,
            f = o.global;
          f && ((s = o.unicode), (o.lastIndex = 0));
          for (var l, h = []; null !== (l = oW(o, a)) && (fW(h, l), f); ) {
            "" === eW(l[0]) && (o.lastIndex = rW(a, ZH(o.lastIndex), s));
          }
          for (var p, d = "", v = 0, g = 0; g < h.length; g++) {
            for (
              var y,
                m = eW((l = h[g])[0]),
                b = uW(cW(QH(l.index), a.length), 0),
                w = [],
                E = 1;
              E < l.length;
              E++
            )
              fW(w, void 0 === (p = l[E]) ? p : String(p));
            var x = l.groups;
            if (c) {
              var S = sW([m], w, b, a);
              void 0 !== x && fW(S, x), (y = eW(qH(i, void 0, S)));
            } else y = iW(m, a, b, w, x, i);
            b >= v && ((d += hW(a, v, b) + y), (v = b + m.length));
          }
          return d + hW(a, v);
        },
      ];
    },
    !vW || !pW || dW
  );
  var gW = _i,
    yW = M,
    mW = Y,
    bW = ue,
    wW = he,
    EW = ie,
    xW = EM,
    SW = Hi,
    AW = $e,
    OW = IM,
    kW = WH,
    TW = It("replace"),
    RW = TypeError,
    IW = mW("".indexOf);
  mW("".replace);
  var _W = mW("".slice),
    PW = Math.max;
  gW(
    { target: "String", proto: !0 },
    {
      replaceAll: function (e, t) {
        var r,
          n,
          i,
          o,
          a,
          u,
          c,
          s,
          f,
          l = bW(this),
          h = 0,
          p = "";
        if (!EW(e)) {
          if (xW(e) && ((r = SW(bW(OW(e)))), !~IW(r, "g")))
            throw new RW("`.replaceAll` does not allow non-global regexes");
          if ((n = AW(e, TW))) return yW(n, e, l, t);
        }
        for (
          i = SW(l),
            o = SW(e),
            (a = wW(t)) || (t = SW(t)),
            u = o.length,
            c = PW(1, u),
            s = IW(i, o);
          -1 !== s;

        )
          (f = a ? SW(t(o, s, i)) : kW(o, i, s, [], void 0, t)),
            (p += _W(i, h, s) + f),
            (h = s + u),
            (s = s + c > i.length ? -1 : IW(i, o, s + c));
        return h < i.length && (p += _W(i, h)), p;
      },
    }
  );
  var FW = M,
    jW = ur,
    CW = ie,
    LW = ue,
    MW = C_,
    DW = Hi,
    NW = $e,
    UW = Dz;
  Rz("search", function (e, t, r) {
    return [
      function (t) {
        var r = LW(this),
          n = CW(t) ? void 0 : NW(t, e);
        return n ? FW(n, t, r) : new RegExp(t)[e](DW(r));
      },
      function (e) {
        var n = jW(this),
          i = DW(e),
          o = r(t, n, i);
        if (o.done) return o.value;
        var a = n.lastIndex;
        MW(a, 0) || (n.lastIndex = 0);
        var u = UW(n, i);
        return (
          MW(n.lastIndex, a) || (n.lastIndex = a), null === u ? -1 : u.index
        );
      },
    ];
  });
  var BW = M,
    zW = Y,
    HW = Rz,
    WW = ur,
    qW = ie,
    VW = ue,
    GW = $P,
    $W = _z,
    YW = Un,
    KW = Hi,
    JW = $e,
    XW = Dz,
    QW = P,
    ZW = LM.UNSUPPORTED_Y,
    eq = Math.min,
    tq = zW([].push),
    rq = zW("".slice),
    nq = !QW(function () {
      var e = /(?:)/,
        t = e.exec;
      e.exec = function () {
        return t.apply(this, arguments);
      };
      var r = "ab".split(e);
      return 2 !== r.length || "a" !== r[0] || "b" !== r[1];
    }),
    iq =
      "c" === "abbc".split(/(b)*/)[1] ||
      4 !== "test".split(/(?:)/, -1).length ||
      2 !== "ab".split(/(?:ab)*/).length ||
      4 !== ".".split(/(.?)(.?)/).length ||
      ".".split(/()()/).length > 1 ||
      "".split(/.?/).length;
  HW(
    "split",
    function (e, t, r) {
      var n = "0".split(void 0, 0).length
        ? function (e, r) {
            return void 0 === e && 0 === r ? [] : BW(t, this, e, r);
          }
        : t;
      return [
        function (t, r) {
          var i = VW(this),
            o = qW(t) ? void 0 : JW(t, e);
          return o ? BW(o, t, i, r) : BW(n, KW(i), t, r);
        },
        function (e, i) {
          var o = WW(this),
            a = KW(e);
          if (!iq) {
            var u = r(n, o, a, i, n !== t);
            if (u.done) return u.value;
          }
          var c = GW(o, RegExp),
            s = o.unicode,
            f =
              (o.ignoreCase ? "i" : "") +
              (o.multiline ? "m" : "") +
              (o.unicode ? "u" : "") +
              (ZW ? "g" : "y"),
            l = new c(ZW ? "^(?:" + o.source + ")" : o, f),
            h = void 0 === i ? 4294967295 : i >>> 0;
          if (0 === h) return [];
          if (0 === a.length) return null === XW(l, a) ? [a] : [];
          for (var p = 0, d = 0, v = []; d < a.length; ) {
            l.lastIndex = ZW ? 0 : d;
            var g,
              y = XW(l, ZW ? rq(a, d) : a);
            if (
              null === y ||
              (g = eq(YW(l.lastIndex + (ZW ? d : 0)), a.length)) === p
            )
              d = $W(a, d, s);
            else {
              if ((tq(v, rq(a, p, d)), v.length === h)) return v;
              for (var m = 1; m <= y.length - 1; m++)
                if ((tq(v, y[m]), v.length === h)) return v;
              d = p = g;
            }
          }
          return tq(v, rq(a, p)), v;
        },
      ];
    },
    iq || !nq,
    ZW
  );
  var oq = _i,
    aq = Vo,
    uq = _.f,
    cq = Un,
    sq = Hi,
    fq = LB,
    lq = ue,
    hq = DB,
    pq = aq("".slice),
    dq = Math.min,
    vq = hq("startsWith"),
    gq =
      !vq &&
      !!(function () {
        var e = uq(String.prototype, "startsWith");
        return e && !e.writable;
      })();
  oq(
    { target: "String", proto: !0, forced: !gq && !vq },
    {
      startsWith: function (e) {
        var t = sq(lq(this));
        fq(e);
        var r = cq(dq(arguments.length > 1 ? arguments[1] : void 0, t.length)),
          n = sq(e);
        return pq(t, r, r + n.length) === n;
      },
    }
  );
  var yq = _i,
    mq = ue,
    bq = Fn,
    wq = Hi,
    Eq = Y("".slice),
    xq = Math.max,
    Sq = Math.min;
  yq(
    {
      target: "String",
      proto: !0,
      forced: !"".substr || "b" !== "ab".substr(-1),
    },
    {
      substr: function (e, t) {
        var r,
          n,
          i = wq(mq(this)),
          o = i.length,
          a = bq(e);
        return (
          a === 1 / 0 && (a = 0),
          a < 0 && (a = xq(o + a, 0)),
          (r = void 0 === t ? o : bq(t)) <= 0 ||
          r === 1 / 0 ||
          a >= (n = Sq(a + r, o))
            ? ""
            : Eq(i, a, n)
        );
      },
    }
  );
  var Aq = _i,
    Oq = M,
    kq = Y,
    Tq = ue,
    Rq = Hi,
    Iq = P,
    _q = Array,
    Pq = kq("".charAt),
    Fq = kq("".charCodeAt),
    jq = kq([].join),
    Cq = "".toWellFormed,
    Lq =
      Cq &&
      Iq(function () {
        return "1" !== Oq(Cq, 1);
      });
  Aq(
    { target: "String", proto: !0, forced: Lq },
    {
      toWellFormed: function () {
        var e = Rq(Tq(this));
        if (Lq) return Oq(Cq, e);
        for (var t = e.length, r = _q(t), n = 0; n < t; n++) {
          var i = Fq(e, n);
          55296 != (63488 & i)
            ? (r[n] = Pq(e, n))
            : i >= 56320 || n + 1 >= t || 56320 != (64512 & Fq(e, n + 1))
            ? (r[n] = "锟�")
            : ((r[n] = Pq(e, n)), (r[++n] = Pq(e, n)));
        }
        return jq(r, "");
      },
    }
  );
  var Mq = Rr.PROPER,
    Dq = P,
    Nq = yT,
    Uq = function (e) {
      return Dq(function () {
        return (
          !!Nq[e]() ||
          "鈥嬄呩爭" !== "鈥嬄呩爭"[e]() ||
          (Mq && Nq[e].name !== e)
        );
      });
    },
    Bq = OT.trim;
  _i(
    { target: "String", proto: !0, forced: Uq("trim") },
    {
      trim: function () {
        return Bq(this);
      },
    }
  );
  var zq = OT.end,
    Hq = Uq("trimEnd")
      ? function () {
          return zq(this);
        }
      : "".trimEnd;
  _i(
    {
      target: "String",
      proto: !0,
      name: "trimEnd",
      forced: "".trimRight !== Hq,
    },
    { trimRight: Hq }
  );
  _i(
    { target: "String", proto: !0, name: "trimEnd", forced: "".trimEnd !== Hq },
    { trimEnd: Hq }
  );
  var Wq = OT.start,
    qq = Uq("trimStart")
      ? function () {
          return Wq(this);
        }
      : "".trimStart;
  _i(
    {
      target: "String",
      proto: !0,
      name: "trimStart",
      forced: "".trimLeft !== qq,
    },
    { trimLeft: qq }
  );
  _i(
    {
      target: "String",
      proto: !0,
      name: "trimStart",
      forced: "".trimStart !== qq,
    },
    { trimStart: qq }
  );
  var Vq = ue,
    Gq = Hi,
    $q = /"/g,
    Yq = Y("".replace),
    Kq = function (e, t, r, n) {
      var i = Gq(Vq(e)),
        o = "<" + t;
      return (
        "" !== r && (o += " " + r + '="' + Yq(Gq(n), $q, "&quot;") + '"'),
        o + ">" + i + "</" + t + ">"
      );
    },
    Jq = P,
    Xq = function (e) {
      return Jq(function () {
        var t = ""[e]('"');
        return t !== t.toLowerCase() || t.split('"').length > 3;
      });
    },
    Qq = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("anchor") },
    {
      anchor: function (e) {
        return Qq(this, "a", "name", e);
      },
    }
  );
  var Zq = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("big") },
    {
      big: function () {
        return Zq(this, "big", "", "");
      },
    }
  );
  var eV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("blink") },
    {
      blink: function () {
        return eV(this, "blink", "", "");
      },
    }
  );
  var tV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("bold") },
    {
      bold: function () {
        return tV(this, "b", "", "");
      },
    }
  );
  var rV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("fixed") },
    {
      fixed: function () {
        return rV(this, "tt", "", "");
      },
    }
  );
  var nV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("fontcolor") },
    {
      fontcolor: function (e) {
        return nV(this, "font", "color", e);
      },
    }
  );
  var iV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("fontsize") },
    {
      fontsize: function (e) {
        return iV(this, "font", "size", e);
      },
    }
  );
  var oV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("italics") },
    {
      italics: function () {
        return oV(this, "i", "", "");
      },
    }
  );
  var aV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("link") },
    {
      link: function (e) {
        return aV(this, "a", "href", e);
      },
    }
  );
  var uV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("small") },
    {
      small: function () {
        return uV(this, "small", "", "");
      },
    }
  );
  var cV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("strike") },
    {
      strike: function () {
        return cV(this, "strike", "", "");
      },
    }
  );
  var sV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("sub") },
    {
      sub: function () {
        return sV(this, "sub", "", "");
      },
    }
  );
  var fV = Kq;
  _i(
    { target: "String", proto: !0, forced: Xq("sup") },
    {
      sup: function () {
        return fV(this, "sup", "", "");
      },
    }
  );
  var lV = { exports: {} },
    hV = I,
    pV = P,
    dV = Cp,
    vV = Bb.NATIVE_ARRAY_BUFFER_VIEWS,
    gV = hV.ArrayBuffer,
    yV = hV.Int8Array,
    mV =
      !vV ||
      !pV(function () {
        yV(1);
      }) ||
      !pV(function () {
        new yV(-1);
      }) ||
      !dV(function (e) {
        new yV(), new yV(null), new yV(1.5), new yV(e);
      }, !0) ||
      pV(function () {
        return 1 !== new yV(new gV(2), 1, void 0).length;
      }),
    bV = bS,
    wV = RangeError,
    EV = function (e, t) {
      var r = bV(e);
      if (r % t) throw new wV("Wrong offset");
      return r;
    },
    xV = Math.round,
    SV = Ui,
    AV = function (e) {
      var t = SV(e);
      return "BigInt64Array" === t || "BigUint64Array" === t;
    },
    OV = Dt,
    kV = TypeError,
    TV = function (e) {
      var t = OV(e, "number");
      if ("number" == typeof t) throw new kV("Can't convert number to bigint");
      return BigInt(t);
    },
    RV = Ko,
    IV = M,
    _V = HP,
    PV = ht,
    FV = zn,
    jV = Wf,
    CV = Mf,
    LV = _f,
    MV = AV,
    DV = Bb.aTypedArrayConstructor,
    NV = TV,
    UV = function (e) {
      var t,
        r,
        n,
        i,
        o,
        a,
        u,
        c,
        s = _V(this),
        f = PV(e),
        l = arguments.length,
        h = l > 1 ? arguments[1] : void 0,
        p = void 0 !== h,
        d = CV(f);
      if (d && !LV(d))
        for (c = (u = jV(f, d)).next, f = []; !(a = IV(c, u)).done; )
          f.push(a.value);
      for (
        p && l > 2 && (h = RV(h, arguments[2])),
          r = FV(f),
          n = new (DV(s))(r),
          i = MV(n),
          t = 0;
        r > t;
        t++
      )
        (o = p ? h(f[t], t) : f[t]), (n[t] = i ? NV(o) : +o);
      return n;
    },
    BV = _i,
    zV = I,
    HV = M,
    WV = F,
    qV = mV,
    VV = Bb,
    GV = Qm,
    $V = jy,
    YV = W,
    KV = Er,
    JV = tR,
    XV = Un,
    QV = Dy,
    ZV = EV,
    eG = function (e) {
      var t = xV(e);
      return t < 0 ? 0 : t > 255 ? 255 : 255 & t;
    },
    tG = Bt,
    rG = vt,
    nG = Ui,
    iG = de,
    oG = Ne,
    aG = vo,
    uG = me,
    cG = vs,
    sG = Tn.f,
    fG = UV,
    lG = Oa.forEach,
    hG = _g,
    pG = Oo,
    dG = rr,
    vG = _,
    gG = Xg,
    yG = Es,
    mG = rn.get,
    bG = rn.set,
    wG = rn.enforce,
    EG = dG.f,
    xG = vG.f,
    SG = zV.RangeError,
    AG = GV.ArrayBuffer,
    OG = AG.prototype,
    kG = GV.DataView,
    TG = VV.NATIVE_ARRAY_BUFFER_VIEWS,
    RG = VV.TYPED_ARRAY_TAG,
    IG = VV.TypedArray,
    _G = VV.TypedArrayPrototype,
    PG = VV.isTypedArray,
    FG = "BYTES_PER_ELEMENT",
    jG = "Wrong length",
    CG = function (e, t) {
      pG(e, t, {
        configurable: !0,
        get: function () {
          return mG(this)[t];
        },
      });
    },
    LG = function (e) {
      var t;
      return (
        uG(OG, e) || "ArrayBuffer" === (t = nG(e)) || "SharedArrayBuffer" === t
      );
    },
    MG = function (e, t) {
      return PG(e) && !oG(t) && t in e && JV(+t) && t >= 0;
    },
    DG = function (e, t) {
      return (t = tG(t)), MG(e, t) ? YV(2, e[t]) : xG(e, t);
    },
    NG = function (e, t, r) {
      return (
        (t = tG(t)),
        !(MG(e, t) && iG(r) && rG(r, "value")) ||
        rG(r, "get") ||
        rG(r, "set") ||
        r.configurable ||
        (rG(r, "writable") && !r.writable) ||
        (rG(r, "enumerable") && !r.enumerable)
          ? EG(e, t, r)
          : ((e[t] = r.value), e)
      );
    };
  WV
    ? (TG ||
        ((vG.f = DG),
        (dG.f = NG),
        CG(_G, "buffer"),
        CG(_G, "byteOffset"),
        CG(_G, "byteLength"),
        CG(_G, "length")),
      BV(
        { target: "Object", stat: !0, forced: !TG },
        { getOwnPropertyDescriptor: DG, defineProperty: NG }
      ),
      (lV.exports = function (e, t, r) {
        var n = e.match(/\d+/)[0] / 8,
          i = e + (r ? "Clamped" : "") + "Array",
          o = "get" + e,
          a = "set" + e,
          u = zV[i],
          c = u,
          s = c && c.prototype,
          f = {},
          l = function (e, t) {
            EG(e, t, {
              get: function () {
                return (function (e, t) {
                  var r = mG(e);
                  return r.view[o](t * n + r.byteOffset, !0);
                })(this, t);
              },
              set: function (e) {
                return (function (e, t, i) {
                  var o = mG(e);
                  o.view[a](t * n + o.byteOffset, r ? eG(i) : i, !0);
                })(this, t, e);
              },
              enumerable: !0,
            });
          };
        TG
          ? qV &&
            ((c = t(function (e, t, r, i) {
              return (
                $V(e, s),
                yG(
                  iG(t)
                    ? LG(t)
                      ? void 0 !== i
                        ? new u(t, ZV(r, n), i)
                        : void 0 !== r
                        ? new u(t, ZV(r, n))
                        : new u(t)
                      : PG(t)
                      ? gG(c, t)
                      : HV(fG, c, t)
                    : new u(QV(t)),
                  e,
                  c
                )
              );
            })),
            cG && cG(c, IG),
            lG(sG(u), function (e) {
              e in c || KV(c, e, u[e]);
            }),
            (c.prototype = s))
          : ((c = t(function (e, t, r, i) {
              $V(e, s);
              var o,
                a,
                u,
                f = 0,
                h = 0;
              if (iG(t)) {
                if (!LG(t)) return PG(t) ? gG(c, t) : HV(fG, c, t);
                (o = t), (h = ZV(r, n));
                var p = t.byteLength;
                if (void 0 === i) {
                  if (p % n) throw new SG(jG);
                  if ((a = p - h) < 0) throw new SG(jG);
                } else if ((a = XV(i) * n) + h > p) throw new SG(jG);
                u = a / n;
              } else (u = QV(t)), (o = new AG((a = u * n)));
              for (
                bG(e, {
                  buffer: o,
                  byteOffset: h,
                  byteLength: a,
                  length: u,
                  view: new kG(o),
                });
                f < u;

              )
                l(e, f++);
            })),
            cG && cG(c, IG),
            (s = c.prototype = aG(_G))),
          s.constructor !== c && KV(s, "constructor", c),
          (wG(s).TypedArrayConstructor = c),
          RG && KV(s, RG, i);
        var h = c !== u;
        (f[i] = c),
          BV({ global: !0, constructor: !0, forced: h, sham: !TG }, f),
          FG in c || KV(c, FG, n),
          FG in s || KV(s, FG, n),
          hG(i);
      }))
    : (lV.exports = function () {});
  var UG = lV.exports;
  UG("Float32", function (e) {
    return function (t, r, n) {
      return e(this, t, r, n);
    };
  }),
    UG("Float64", function (e) {
      return function (t, r, n) {
        return e(this, t, r, n);
      };
    }),
    UG("Int8", function (e) {
      return function (t, r, n) {
        return e(this, t, r, n);
      };
    }),
    UG("Int16", function (e) {
      return function (t, r, n) {
        return e(this, t, r, n);
      };
    }),
    UG("Int32", function (e) {
      return function (t, r, n) {
        return e(this, t, r, n);
      };
    }),
    UG("Uint8", function (e) {
      return function (t, r, n) {
        return e(this, t, r, n);
      };
    }),
    UG(
      "Uint8",
      function (e) {
        return function (t, r, n) {
          return e(this, t, r, n);
        };
      },
      !0
    ),
    UG("Uint16", function (e) {
      return function (t, r, n) {
        return e(this, t, r, n);
      };
    }),
    UG("Uint32", function (e) {
      return function (t, r, n) {
        return e(this, t, r, n);
      };
    });
  var BG = zn,
    zG = Fn,
    HG = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("at", function (e) {
    var t = HG(this),
      r = BG(t),
      n = zG(e),
      i = n >= 0 ? n : r + n;
    return i < 0 || i >= r ? void 0 : t[i];
  });
  var WG = Bb,
    qG = Y(wh),
    VG = WG.aTypedArray;
  (0, WG.exportTypedArrayMethod)("copyWithin", function (e, t) {
    return qG(VG(this), e, t, arguments.length > 2 ? arguments[2] : void 0);
  });
  var GG = Oa.every,
    $G = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("every", function (e) {
    return GG($G(this), e, arguments.length > 1 ? arguments[1] : void 0);
  });
  var YG = Rh,
    KG = TV,
    JG = Ui,
    XG = M,
    QG = P,
    ZG = Bb.aTypedArray,
    e$ = Bb.exportTypedArrayMethod,
    t$ = Y("".slice);
  e$(
    "fill",
    function (e) {
      var t = arguments.length;
      ZG(this);
      var r = "Big" === t$(JG(this), 0, 3) ? KG(e) : +e;
      return XG(
        YG,
        this,
        r,
        t > 1 ? arguments[1] : void 0,
        t > 2 ? arguments[2] : void 0
      );
    },
    QG(function () {
      var e = 0;
      return (
        new Int8Array(2).fill({
          valueOf: function () {
            return e++;
          },
        }),
        1 !== e
      );
    })
  );
  var r$ = Xg,
    n$ = Bb.getTypedArrayConstructor,
    i$ = Oa.filter,
    o$ = function (e, t) {
      return r$(n$(e), t);
    },
    a$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("filter", function (e) {
    var t = i$(a$(this), e, arguments.length > 1 ? arguments[1] : void 0);
    return o$(this, t);
  });
  var u$ = Oa.find,
    c$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("find", function (e) {
    return u$(c$(this), e, arguments.length > 1 ? arguments[1] : void 0);
  });
  var s$ = Oa.findIndex,
    f$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("findIndex", function (e) {
    return s$(f$(this), e, arguments.length > 1 ? arguments[1] : void 0);
  });
  var l$ = Gh.findLast,
    h$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("findLast", function (e) {
    return l$(h$(this), e, arguments.length > 1 ? arguments[1] : void 0);
  });
  var p$ = Gh.findLastIndex,
    d$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("findLastIndex", function (e) {
    return p$(d$(this), e, arguments.length > 1 ? arguments[1] : void 0);
  });
  var v$ = Oa.forEach,
    g$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("forEach", function (e) {
    v$(g$(this), e, arguments.length > 1 ? arguments[1] : void 0);
  }),
    (0, Bb.exportTypedArrayStaticMethod)("from", UV, mV);
  var y$ = Gn.includes,
    m$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("includes", function (e) {
    return y$(m$(this), e, arguments.length > 1 ? arguments[1] : void 0);
  });
  var b$ = Gn.indexOf,
    w$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("indexOf", function (e) {
    return b$(w$(this), e, arguments.length > 1 ? arguments[1] : void 0);
  });
  var E$ = I,
    x$ = P,
    S$ = Y,
    A$ = Bb,
    O$ = Ud,
    k$ = It("iterator"),
    T$ = E$.Uint8Array,
    R$ = S$(O$.values),
    I$ = S$(O$.keys),
    _$ = S$(O$.entries),
    P$ = A$.aTypedArray,
    F$ = A$.exportTypedArrayMethod,
    j$ = T$ && T$.prototype,
    C$ = !x$(function () {
      j$[k$].call([1]);
    }),
    L$ =
      !!j$ && j$.values && j$[k$] === j$.values && "values" === j$.values.name,
    M$ = function () {
      return R$(P$(this));
    };
  F$(
    "entries",
    function () {
      return _$(P$(this));
    },
    C$
  ),
    F$(
      "keys",
      function () {
        return I$(P$(this));
      },
      C$
    ),
    F$("values", M$, C$ || !L$, { name: "values" }),
    F$(k$, M$, C$ || !L$, { name: "values" });
  var D$ = Bb.aTypedArray,
    N$ = Bb.exportTypedArrayMethod,
    U$ = Y([].join);
  N$("join", function (e) {
    return U$(D$(this), e);
  });
  var B$ = tc,
    z$ = tv,
    H$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("lastIndexOf", function (e) {
    var t = arguments.length;
    return B$(z$, H$(this), t > 1 ? [e, arguments[1]] : [e]);
  });
  var W$ = Oa.map,
    q$ = Bb.aTypedArray,
    V$ = Bb.getTypedArrayConstructor;
  (0, Bb.exportTypedArrayMethod)("map", function (e) {
    return W$(
      q$(this),
      e,
      arguments.length > 1 ? arguments[1] : void 0,
      function (e, t) {
        return new (V$(e))(t);
      }
    );
  });
  var G$ = Bb.aTypedArrayConstructor;
  (0, Bb.exportTypedArrayStaticMethod)(
    "of",
    function () {
      for (var e = 0, t = arguments.length, r = new (G$(this))(t); t > e; )
        r[e] = arguments[e++];
      return r;
    },
    mV
  );
  var $$ = xv.left,
    Y$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("reduce", function (e) {
    var t = arguments.length;
    return $$(Y$(this), e, t, t > 1 ? arguments[1] : void 0);
  });
  var K$ = xv.right,
    J$ = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("reduceRight", function (e) {
    var t = arguments.length;
    return K$(J$(this), e, t, t > 1 ? arguments[1] : void 0);
  });
  var X$ = Bb.aTypedArray,
    Q$ = Bb.exportTypedArrayMethod,
    Z$ = Math.floor;
  Q$("reverse", function () {
    for (var e, t = this, r = X$(t).length, n = Z$(r / 2), i = 0; i < n; )
      (e = t[i]), (t[i++] = t[--r]), (t[r] = e);
    return t;
  });
  var eY = I,
    tY = M,
    rY = Bb,
    nY = zn,
    iY = EV,
    oY = ht,
    aY = P,
    uY = eY.RangeError,
    cY = eY.Int8Array,
    sY = cY && cY.prototype,
    fY = sY && sY.set,
    lY = rY.aTypedArray,
    hY = rY.exportTypedArrayMethod,
    pY = !aY(function () {
      var e = new Uint8ClampedArray(2);
      return tY(fY, e, { length: 1, 0: 3 }, 1), 3 !== e[1];
    }),
    dY =
      pY &&
      rY.NATIVE_ARRAY_BUFFER_VIEWS &&
      aY(function () {
        var e = new cY(2);
        return e.set(1), e.set("2", 1), 0 !== e[0] || 2 !== e[1];
      });
  hY(
    "set",
    function (e) {
      lY(this);
      var t = iY(arguments.length > 1 ? arguments[1] : void 0, 1),
        r = oY(e);
      if (pY) return tY(fY, this, r, t);
      var n = this.length,
        i = nY(r),
        o = 0;
      if (i + t > n) throw new uY("Wrong length");
      for (; o < i; ) this[t + o] = r[o++];
    },
    !pY || dY
  );
  var vY = yo,
    gY = Bb.aTypedArray,
    yY = Bb.getTypedArrayConstructor;
  (0, Bb.exportTypedArrayMethod)(
    "slice",
    function (e, t) {
      for (
        var r = vY(gY(this), e, t),
          n = yY(this),
          i = 0,
          o = r.length,
          a = new n(o);
        o > i;

      )
        a[i] = r[i++];
      return a;
    },
    P(function () {
      new Int8Array(1).slice();
    })
  );
  var mY = Oa.some,
    bY = Bb.aTypedArray;
  (0, Bb.exportTypedArrayMethod)("some", function (e) {
    return mY(bY(this), e, arguments.length > 1 ? arguments[1] : void 0);
  });
  var wY = Vo,
    EY = P,
    xY = qe,
    SY = Zv,
    AY = tg,
    OY = rg,
    kY = Re,
    TY = ig,
    RY = Bb.aTypedArray,
    IY = Bb.exportTypedArrayMethod,
    _Y = I.Uint16Array,
    PY = _Y && wY(_Y.prototype.sort),
    FY = !(
      !PY ||
      (EY(function () {
        PY(new _Y(2), null);
      }) &&
        EY(function () {
          PY(new _Y(2), {});
        }))
    ),
    jY =
      !!PY &&
      !EY(function () {
        if (kY) return kY < 74;
        if (AY) return AY < 67;
        if (OY) return !0;
        if (TY) return TY < 602;
        var e,
          t,
          r = new _Y(516),
          n = Array(516);
        for (e = 0; e < 516; e++)
          (t = e % 4), (r[e] = 515 - e), (n[e] = e - 2 * t + 3);
        for (
          PY(r, function (e, t) {
            return ((e / 4) | 0) - ((t / 4) | 0);
          }),
            e = 0;
          e < 516;
          e++
        )
          if (r[e] !== n[e]) return !0;
      });
  IY(
    "sort",
    function (e) {
      return (
        void 0 !== e && xY(e),
        jY
          ? PY(this, e)
          : SY(
              RY(this),
              (function (e) {
                return function (t, r) {
                  return void 0 !== e
                    ? +e(t, r) || 0
                    : r != r
                    ? -1
                    : t != t
                    ? 1
                    : 0 === t && 0 === r
                    ? 1 / t > 0 && 1 / r < 0
                      ? 1
                      : -1
                    : t > r;
                };
              })(e)
            )
      );
    },
    !jY || FY
  );
  var CY = Un,
    LY = Mn,
    MY = Bb.aTypedArray,
    DY = Bb.getTypedArrayConstructor;
  (0, Bb.exportTypedArrayMethod)("subarray", function (e, t) {
    var r = MY(this),
      n = r.length,
      i = LY(e, n);
    return new (DY(r))(
      r.buffer,
      r.byteOffset + i * r.BYTES_PER_ELEMENT,
      CY((void 0 === t ? n : LY(t, n)) - i)
    );
  });
  var NY = tc,
    UY = Bb,
    BY = P,
    zY = yo,
    HY = I.Int8Array,
    WY = UY.aTypedArray,
    qY = UY.exportTypedArrayMethod,
    VY = [].toLocaleString,
    GY =
      !!HY &&
      BY(function () {
        VY.call(new HY(1));
      });
  qY(
    "toLocaleString",
    function () {
      return NY(VY, GY ? zY(WY(this)) : WY(this), zY(arguments));
    },
    BY(function () {
      return [1, 2].toLocaleString() !== new HY([1, 2]).toLocaleString();
    }) ||
      !BY(function () {
        HY.prototype.toLocaleString.call([1, 2]);
      })
  );
  var $Y = Vg,
    YY = Bb.aTypedArray,
    KY = Bb.getTypedArrayConstructor;
  (0, Bb.exportTypedArrayMethod)("toReversed", function () {
    return $Y(YY(this), KY(this));
  });
  var JY = qe,
    XY = Xg,
    QY = Bb.aTypedArray,
    ZY = Bb.getTypedArrayConstructor,
    eK = Bb.exportTypedArrayMethod,
    tK = Y(Bb.TypedArrayPrototype.sort);
  eK("toSorted", function (e) {
    void 0 !== e && JY(e);
    var t = QY(this),
      r = XY(ZY(t), t);
    return tK(r, e);
  });
  var rK = Bb.exportTypedArrayMethod,
    nK = P,
    iK = Y,
    oK = I.Uint8Array,
    aK = (oK && oK.prototype) || {},
    uK = [].toString,
    cK = iK([].join);
  nK(function () {
    uK.call({});
  }) &&
    (uK = function () {
      return cK(this);
    });
  var sK = aK.toString !== uK;
  rK("toString", uK, sK);
  var fK = Ay,
    lK = AV,
    hK = Fn,
    pK = TV,
    dK = Bb.aTypedArray,
    vK = Bb.getTypedArrayConstructor,
    gK = Bb.exportTypedArrayMethod,
    yK = !!(function () {
      try {
        new Int8Array(1).with(2, {
          valueOf: function () {
            throw 8;
          },
        });
      } catch ($7) {
        return 8 === $7;
      }
    })();
  gK(
    "with",
    {
      with: function (e, t) {
        var r = dK(this),
          n = hK(e),
          i = lK(r) ? pK(t) : +t;
        return fK(r, vK(r), n, i);
      },
    }.with,
    !yK
  );
  var mK = _i,
    bK = Y,
    wK = Hi,
    EK = String.fromCharCode,
    xK = bK("".charAt),
    SK = bK(/./.exec),
    AK = bK("".slice),
    OK = /^[\da-f]{2}$/i,
    kK = /^[\da-f]{4}$/i;
  mK(
    { global: !0 },
    {
      unescape: function (e) {
        for (var t, r, n = wK(e), i = "", o = n.length, a = 0; a < o; ) {
          if ("%" === (t = xK(n, a++)))
            if ("u" === xK(n, a)) {
              if (((r = AK(n, a + 1, a + 5)), SK(kK, r))) {
                (i += EK(parseInt(r, 16))), (a += 5);
                continue;
              }
            } else if (((r = AK(n, a, a + 2)), SK(OK, r))) {
              (i += EK(parseInt(r, 16))), (a += 2);
              continue;
            }
          i += t;
        }
        return i;
      },
    }
  );
  var TK = Y,
    RK = _y,
    IK = kO.getWeakData,
    _K = jy,
    PK = ur,
    FK = ie,
    jK = de,
    CK = ul,
    LK = vt,
    MK = rn.set,
    DK = rn.getterFor,
    NK = Oa.find,
    UK = Oa.findIndex,
    BK = TK([].splice),
    zK = 0,
    HK = function (e) {
      return e.frozen || (e.frozen = new WK());
    },
    WK = function () {
      this.entries = [];
    },
    qK = function (e, t) {
      return NK(e.entries, function (e) {
        return e[0] === t;
      });
    };
  WK.prototype = {
    get: function (e) {
      var t = qK(this, e);
      if (t) return t[1];
    },
    has: function (e) {
      return !!qK(this, e);
    },
    set: function (e, t) {
      var r = qK(this, e);
      r ? (r[1] = t) : this.entries.push([e, t]);
    },
    delete: function (e) {
      var t = UK(this.entries, function (t) {
        return t[0] === e;
      });
      return ~t && BK(this.entries, t, 1), !!~t;
    },
  };
  var VK,
    GK = {
      getConstructor: function (e, t, r, n) {
        var i = e(function (e, i) {
            _K(e, o),
              MK(e, { type: t, id: zK++, frozen: null }),
              FK(i) || CK(i, e[n], { that: e, AS_ENTRIES: r });
          }),
          o = i.prototype,
          a = DK(t),
          u = function (e, t, r) {
            var n = a(e),
              i = IK(PK(t), !0);
            return !0 === i ? HK(n).set(t, r) : (i[n.id] = r), e;
          };
        return (
          RK(o, {
            delete: function (e) {
              var t = a(this);
              if (!jK(e)) return !1;
              var r = IK(e);
              return !0 === r
                ? HK(t).delete(e)
                : r && LK(r, t.id) && delete r[t.id];
            },
            has: function (e) {
              var t = a(this);
              if (!jK(e)) return !1;
              var r = IK(e);
              return !0 === r ? HK(t).has(e) : r && LK(r, t.id);
            },
          }),
          RK(
            o,
            r
              ? {
                  get: function (e) {
                    var t = a(this);
                    if (jK(e)) {
                      var r = IK(e);
                      if (!0 === r) return HK(t).get(e);
                      if (r) return r[t.id];
                    }
                  },
                  set: function (e, t) {
                    return u(this, e, t);
                  },
                }
              : {
                  add: function (e) {
                    return u(this, e, !0);
                  },
                }
          ),
          i
        );
      },
    },
    $K = fO,
    YK = I,
    KK = Y,
    JK = _y,
    XK = kO,
    QK = HO,
    ZK = GK,
    eJ = de,
    tJ = rn.enforce,
    rJ = P,
    nJ = Nr,
    iJ = Object,
    oJ = Array.isArray,
    aJ = iJ.isExtensible,
    uJ = iJ.isFrozen,
    cJ = iJ.isSealed,
    sJ = iJ.freeze,
    fJ = iJ.seal,
    lJ = !YK.ActiveXObject && "ActiveXObject" in YK,
    hJ = function (e) {
      return function () {
        return e(this, arguments.length ? arguments[0] : void 0);
      };
    },
    pJ = QK("WeakMap", hJ, ZK),
    dJ = pJ.prototype,
    vJ = KK(dJ.set);
  if (nJ)
    if (lJ) {
      (VK = ZK.getConstructor(hJ, "WeakMap", !0)), XK.enable();
      var gJ = KK(dJ.delete),
        yJ = KK(dJ.has),
        mJ = KK(dJ.get);
      JK(dJ, {
        delete: function (e) {
          if (eJ(e) && !aJ(e)) {
            var t = tJ(this);
            return (
              t.frozen || (t.frozen = new VK()),
              gJ(this, e) || t.frozen.delete(e)
            );
          }
          return gJ(this, e);
        },
        has: function (e) {
          if (eJ(e) && !aJ(e)) {
            var t = tJ(this);
            return (
              t.frozen || (t.frozen = new VK()), yJ(this, e) || t.frozen.has(e)
            );
          }
          return yJ(this, e);
        },
        get: function (e) {
          if (eJ(e) && !aJ(e)) {
            var t = tJ(this);
            return (
              t.frozen || (t.frozen = new VK()),
              yJ(this, e) ? mJ(this, e) : t.frozen.get(e)
            );
          }
          return mJ(this, e);
        },
        set: function (e, t) {
          if (eJ(e) && !aJ(e)) {
            var r = tJ(this);
            r.frozen || (r.frozen = new VK()),
              yJ(this, e) ? vJ(this, e, t) : r.frozen.set(e, t);
          } else vJ(this, e, t);
          return this;
        },
      });
    } else
      $K &&
        rJ(function () {
          var e = sJ([]);
          return vJ(new pJ(), e, 1), !uJ(e);
        }) &&
        JK(dJ, {
          set: function (e, t) {
            var r;
            return (
              oJ(e) && (uJ(e) ? (r = sJ) : cJ(e) && (r = fJ)),
              vJ(this, e, t),
              r && r(e),
              this
            );
          },
        });
  HO(
    "WeakSet",
    function (e) {
      return function () {
        return e(this, arguments.length ? arguments[0] : void 0);
      };
    },
    GK
  );
  var bJ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    wJ = bJ + "+/",
    EJ = bJ + "-_",
    xJ = function (e) {
      for (var t = {}, r = 0; r < 64; r++) t[e.charAt(r)] = r;
      return t;
    },
    SJ = { i2c: wJ, c2i: xJ(wJ), i2cUrl: EJ, c2iUrl: xJ(EJ) },
    AJ = _i,
    OJ = I,
    kJ = ye,
    TJ = Y,
    RJ = M,
    IJ = P,
    _J = Hi,
    PJ = KP,
    FJ = SJ.c2i,
    jJ = /[^\d+/a-z]/i,
    CJ = /[\t\n\f\r ]+/g,
    LJ = /[=]{1,2}$/,
    MJ = kJ("atob"),
    DJ = String.fromCharCode,
    NJ = TJ("".charAt),
    UJ = TJ("".replace),
    BJ = TJ(jJ.exec),
    zJ =
      !!MJ &&
      !IJ(function () {
        return "hi" !== MJ("aGk=");
      }),
    HJ =
      zJ &&
      IJ(function () {
        return "" !== MJ(" ");
      }),
    WJ =
      zJ &&
      !IJ(function () {
        MJ("a");
      }),
    qJ =
      zJ &&
      !IJ(function () {
        MJ();
      }),
    VJ = zJ && 1 !== MJ.length;
  AJ(
    {
      global: !0,
      bind: !0,
      enumerable: !0,
      forced: !zJ || HJ || WJ || qJ || VJ,
    },
    {
      atob: function (e) {
        if ((PJ(arguments.length, 1), zJ && !HJ && !WJ)) return RJ(MJ, OJ, e);
        var t,
          r,
          n,
          i = UJ(_J(e), CJ, ""),
          o = "",
          a = 0,
          u = 0;
        if (
          (i.length % 4 == 0 && (i = UJ(i, LJ, "")),
          (t = i.length) % 4 == 1 || BJ(jJ, i))
        )
          throw new (kJ("DOMException"))(
            "The string is not correctly encoded",
            "InvalidCharacterError"
          );
        for (; a < t; )
          (r = NJ(i, a++)),
            (n = u % 4 ? 64 * n + FJ[r] : FJ[r]),
            u++ % 4 && (o += DJ(255 & (n >> ((-2 * u) & 6))));
        return o;
      },
    }
  );
  var GJ = _i,
    $J = I,
    YJ = ye,
    KJ = Y,
    JJ = M,
    XJ = P,
    QJ = Hi,
    ZJ = KP,
    eX = SJ.i2c,
    tX = YJ("btoa"),
    rX = KJ("".charAt),
    nX = KJ("".charCodeAt),
    iX =
      !!tX &&
      !XJ(function () {
        return "aGk=" !== tX("hi");
      }),
    oX =
      iX &&
      !XJ(function () {
        tX();
      }),
    aX =
      iX &&
      XJ(function () {
        return "bnVsbA==" !== tX(null);
      }),
    uX = iX && 1 !== tX.length;
  GJ(
    { global: !0, bind: !0, enumerable: !0, forced: !iX || oX || aX || uX },
    {
      btoa: function (e) {
        if ((ZJ(arguments.length, 1), iX)) return JJ(tX, $J, QJ(e));
        for (
          var t, r, n = QJ(e), i = "", o = 0, a = eX;
          rX(n, o) || ((a = "="), o % 1);

        ) {
          if ((r = nX(n, (o += 3 / 4))) > 255)
            throw new (YJ("DOMException"))(
              "The string contains characters outside of the Latin1 range",
              "InvalidCharacterError"
            );
          i += rX(a, 63 & ((t = (t << 8) | r) >> (8 - (o % 1) * 8)));
        }
        return i;
      },
    }
  );
  var cX = {
      CSSRuleList: 0,
      CSSStyleDeclaration: 0,
      CSSValueList: 0,
      ClientRectList: 0,
      DOMRectList: 0,
      DOMStringList: 0,
      DOMTokenList: 1,
      DataTransferItemList: 0,
      FileList: 0,
      HTMLAllCollection: 0,
      HTMLCollection: 0,
      HTMLFormElement: 0,
      HTMLSelectElement: 0,
      MediaList: 0,
      MimeTypeArray: 0,
      NamedNodeMap: 0,
      NodeList: 1,
      PaintRequestList: 0,
      Plugin: 0,
      PluginArray: 0,
      SVGLengthList: 0,
      SVGNumberList: 0,
      SVGPathSegList: 0,
      SVGPointList: 0,
      SVGStringList: 0,
      SVGTransformList: 0,
      SourceBufferList: 0,
      StyleSheetList: 0,
      TextTrackCueList: 0,
      TextTrackList: 0,
      TouchList: 0,
    },
    sX = qt("span").classList,
    fX = sX && sX.constructor && sX.constructor.prototype,
    lX = fX === Object.prototype ? void 0 : fX,
    hX = I,
    pX = cX,
    dX = lX,
    vX = dp,
    gX = Er,
    yX = function (e) {
      if (e && e.forEach !== vX)
        try {
          gX(e, "forEach", vX);
        } catch ($7) {
          e.forEach = vX;
        }
    };
  for (var mX in pX) pX[mX] && yX(hX[mX] && hX[mX].prototype);
  yX(dX);
  var bX = I,
    wX = cX,
    EX = lX,
    xX = Ud,
    SX = Er,
    AX = Ho,
    OX = It("iterator"),
    kX = xX.values,
    TX = function (e, t) {
      if (e) {
        if (e[OX] !== kX)
          try {
            SX(e, OX, kX);
          } catch ($7) {
            e[OX] = kX;
          }
        if ((AX(e, t, !0), wX[t]))
          for (var r in xX)
            if (e[r] !== xX[r])
              try {
                SX(e, r, xX[r]);
              } catch ($7) {
                e[r] = xX[r];
              }
      }
    };
  for (var RX in wX) TX(bX[RX] && bX[RX].prototype, RX);
  TX(EX, "DOMTokenList");
  var IX = {
      IndexSizeError: { s: "INDEX_SIZE_ERR", c: 1, m: 1 },
      DOMStringSizeError: { s: "DOMSTRING_SIZE_ERR", c: 2, m: 0 },
      HierarchyRequestError: { s: "HIERARCHY_REQUEST_ERR", c: 3, m: 1 },
      WrongDocumentError: { s: "WRONG_DOCUMENT_ERR", c: 4, m: 1 },
      InvalidCharacterError: { s: "INVALID_CHARACTER_ERR", c: 5, m: 1 },
      NoDataAllowedError: { s: "NO_DATA_ALLOWED_ERR", c: 6, m: 0 },
      NoModificationAllowedError: {
        s: "NO_MODIFICATION_ALLOWED_ERR",
        c: 7,
        m: 1,
      },
      NotFoundError: { s: "NOT_FOUND_ERR", c: 8, m: 1 },
      NotSupportedError: { s: "NOT_SUPPORTED_ERR", c: 9, m: 1 },
      InUseAttributeError: { s: "INUSE_ATTRIBUTE_ERR", c: 10, m: 1 },
      InvalidStateError: { s: "INVALID_STATE_ERR", c: 11, m: 1 },
      SyntaxError: { s: "SYNTAX_ERR", c: 12, m: 1 },
      InvalidModificationError: { s: "INVALID_MODIFICATION_ERR", c: 13, m: 1 },
      NamespaceError: { s: "NAMESPACE_ERR", c: 14, m: 1 },
      InvalidAccessError: { s: "INVALID_ACCESS_ERR", c: 15, m: 1 },
      ValidationError: { s: "VALIDATION_ERR", c: 16, m: 0 },
      TypeMismatchError: { s: "TYPE_MISMATCH_ERR", c: 17, m: 1 },
      SecurityError: { s: "SECURITY_ERR", c: 18, m: 1 },
      NetworkError: { s: "NETWORK_ERR", c: 19, m: 1 },
      AbortError: { s: "ABORT_ERR", c: 20, m: 1 },
      URLMismatchError: { s: "URL_MISMATCH_ERR", c: 21, m: 1 },
      QuotaExceededError: { s: "QUOTA_EXCEEDED_ERR", c: 22, m: 1 },
      TimeoutError: { s: "TIMEOUT_ERR", c: 23, m: 1 },
      InvalidNodeTypeError: { s: "INVALID_NODE_TYPE_ERR", c: 24, m: 1 },
      DataCloneError: { s: "DATA_CLONE_ERR", c: 25, m: 1 },
    },
    _X = _i,
    PX = ye,
    FX = Ew,
    jX = P,
    CX = vo,
    LX = W,
    MX = rr.f,
    DX = kn,
    NX = Oo,
    UX = vt,
    BX = jy,
    zX = ur,
    HX = pf,
    WX = Ss,
    qX = IX,
    VX = Fs,
    GX = rn,
    $X = F,
    YX = "DOMException",
    KX = "DATA_CLONE_ERR",
    JX = PX("Error"),
    XX =
      PX(YX) ||
      (function () {
        try {
          new (PX("MessageChannel") ||
            FX("worker_threads").MessageChannel)().port1.postMessage(
            new WeakMap()
          );
        } catch ($7) {
          if ($7.name === KX && 25 === $7.code) return $7.constructor;
        }
      })(),
    QX = XX && XX.prototype,
    ZX = JX.prototype,
    eQ = GX.set,
    tQ = GX.getterFor(YX),
    rQ = "stack" in new JX(YX),
    nQ = function (e) {
      return UX(qX, e) && qX[e].m ? qX[e].c : 0;
    },
    iQ = function () {
      BX(this, oQ);
      var e = arguments.length,
        t = WX(e < 1 ? void 0 : arguments[0]),
        r = WX(e < 2 ? void 0 : arguments[1], "Error"),
        n = nQ(r);
      if (
        (eQ(this, { type: YX, name: r, message: t, code: n }),
        $X || ((this.name = r), (this.message = t), (this.code = n)),
        rQ)
      ) {
        var i = new JX(t);
        (i.name = YX), MX(this, "stack", LX(1, VX(i.stack, 1)));
      }
    },
    oQ = (iQ.prototype = CX(ZX)),
    aQ = function (e) {
      return { enumerable: !0, configurable: !0, get: e };
    },
    uQ = function (e) {
      return aQ(function () {
        return tQ(this)[e];
      });
    };
  $X &&
    (NX(oQ, "code", uQ("code")),
    NX(oQ, "message", uQ("message")),
    NX(oQ, "name", uQ("name"))),
    MX(oQ, "constructor", LX(1, iQ));
  var cQ = jX(function () {
      return !(new XX() instanceof JX);
    }),
    sQ =
      cQ ||
      jX(function () {
        return ZX.toString !== HX || "2: 1" !== String(new XX(1, 2));
      }),
    fQ =
      cQ ||
      jX(function () {
        return 25 !== new XX(1, "DataCloneError").code;
      });
  cQ || 25 !== XX[KX] || QX[KX];
  _X(
    { global: !0, constructor: !0, forced: cQ },
    { DOMException: cQ ? iQ : XX }
  );
  var lQ = PX(YX),
    hQ = lQ.prototype;
  for (var pQ in (sQ && XX === lQ && DX(hQ, "toString", HX),
  fQ &&
    $X &&
    XX === lQ &&
    NX(
      hQ,
      "code",
      aQ(function () {
        return nQ(zX(this).name);
      })
    ),
  qX))
    if (UX(qX, pQ)) {
      var dQ = qX[pQ],
        vQ = dQ.s,
        gQ = LX(6, dQ.c);
      UX(lQ, vQ) || MX(lQ, vQ, gQ), UX(hQ, vQ) || MX(hQ, vQ, gQ);
    }
  var yQ = _i,
    mQ = I,
    bQ = ye,
    wQ = W,
    EQ = rr.f,
    xQ = vt,
    SQ = jy,
    AQ = Es,
    OQ = Ss,
    kQ = IX,
    TQ = Fs,
    RQ = F,
    IQ = "DOMException",
    _Q = bQ("Error"),
    PQ = bQ(IQ),
    FQ = function () {
      SQ(this, jQ);
      var e = arguments.length,
        t = OQ(e < 1 ? void 0 : arguments[0]),
        r = OQ(e < 2 ? void 0 : arguments[1], "Error"),
        n = new PQ(t, r),
        i = new _Q(t);
      return (
        (i.name = IQ), EQ(n, "stack", wQ(1, TQ(i.stack, 1))), AQ(n, this, FQ), n
      );
    },
    jQ = (FQ.prototype = PQ.prototype),
    CQ = "stack" in new _Q(IQ),
    LQ = "stack" in new PQ(1, 2),
    MQ = PQ && RQ && Object.getOwnPropertyDescriptor(mQ, IQ),
    DQ = !(!MQ || (MQ.writable && MQ.configurable)),
    NQ = CQ && !DQ && !LQ;
  yQ(
    { global: !0, constructor: !0, forced: NQ },
    { DOMException: NQ ? FQ : PQ }
  );
  var UQ = bQ(IQ),
    BQ = UQ.prototype;
  if (BQ.constructor !== UQ)
    for (var zQ in (EQ(BQ, "constructor", wQ(1, UQ)), kQ))
      if (xQ(kQ, zQ)) {
        var HQ = kQ[zQ],
          WQ = HQ.s;
        xQ(UQ, WQ) || EQ(UQ, WQ, wQ(6, HQ.c));
      }
  var qQ = "DOMException";
  Ho(ye(qQ), qQ);
  var VQ = SF.clear;
  _i(
    { global: !0, bind: !0, enumerable: !0, forced: I.clearImmediate !== VQ },
    { clearImmediate: VQ }
  );
  var GQ,
    $Q = I,
    YQ = tc,
    KQ = he,
    JQ = Tv,
    XQ = Ee,
    QQ = yo,
    ZQ = KP,
    eZ = $Q.Function,
    tZ =
      /MSIE .\./.test(XQ) ||
      ("BUN" === JQ &&
        ((GQ = $Q.Bun.version.split(".")).length < 3 ||
          ("0" === GQ[0] && (GQ[1] < 3 || ("3" === GQ[1] && "0" === GQ[2]))))),
    rZ = function (e, t) {
      var r = t ? 2 : 1;
      return tZ
        ? function (n, i) {
            var o = ZQ(arguments.length, 1) > r,
              a = KQ(n) ? n : eZ(n),
              u = o ? QQ(arguments, r) : [],
              c = o
                ? function () {
                    YQ(a, this, u);
                  }
                : a;
            return t ? e(c, i) : e(c);
          }
        : e;
    },
    nZ = _i,
    iZ = I,
    oZ = SF.set,
    aZ = rZ,
    uZ = iZ.setImmediate ? aZ(oZ, !1) : oZ;
  nZ(
    { global: !0, bind: !0, enumerable: !0, forced: iZ.setImmediate !== uZ },
    { setImmediate: uZ }
  );
  var cZ = I,
    sZ = ZF,
    fZ = qe,
    lZ = KP,
    hZ = F;
  _i(
    {
      global: !0,
      enumerable: !0,
      dontCallGetSet: !0,
      forced: P(function () {
        return (
          hZ &&
          1 !==
            Object.getOwnPropertyDescriptor(cZ, "queueMicrotask").value.length
        );
      }),
    },
    {
      queueMicrotask: function (e) {
        lZ(arguments.length, 1), sZ(fZ(e));
      },
    }
  );
  var pZ = _i,
    dZ = I,
    vZ = Oo,
    gZ = F,
    yZ = TypeError,
    mZ = Object.defineProperty,
    bZ = dZ.self !== dZ;
  try {
    if (gZ) {
      var wZ = Object.getOwnPropertyDescriptor(dZ, "self");
      (!bZ && wZ && wZ.get && wZ.enumerable) ||
        vZ(dZ, "self", {
          get: function () {
            return dZ;
          },
          set: function (e) {
            if (this !== dZ) throw new yZ("Illegal invocation");
            mZ(dZ, "self", {
              value: e,
              writable: !0,
              configurable: !0,
              enumerable: !0,
            });
          },
          configurable: !0,
          enumerable: !0,
        });
    } else pZ({ global: !0, simple: !0, forced: bZ }, { self: dZ });
  } catch ($7) {}
  var EZ,
    xZ = _i,
    SZ = I,
    AZ = ye,
    OZ = Y,
    kZ = P,
    TZ = wt,
    RZ = he,
    IZ = fa,
    _Z = ie,
    PZ = de,
    FZ = Ne,
    jZ = ul,
    CZ = ur,
    LZ = Ui,
    MZ = vt,
    DZ = $l,
    NZ = Er,
    UZ = zn,
    BZ = KP,
    zZ = IM,
    HZ = ak,
    WZ = NN,
    qZ = JN,
    VZ = Cw,
    GZ = Cs,
    $Z = kw,
    YZ = SZ.Object,
    KZ = SZ.Array,
    JZ = SZ.Date,
    XZ = SZ.Error,
    QZ = SZ.TypeError,
    ZZ = SZ.PerformanceMark,
    e0 = AZ("DOMException"),
    t0 = HZ.Map,
    r0 = HZ.has,
    n0 = HZ.get,
    i0 = HZ.set,
    o0 = WZ.Set,
    a0 = WZ.add,
    u0 = WZ.has,
    c0 = AZ("Object", "keys"),
    s0 = OZ([].push),
    f0 = OZ((!0).valueOf),
    l0 = OZ((1).valueOf),
    h0 = OZ("".valueOf),
    p0 = OZ(JZ.prototype.getTime),
    d0 = TZ("structuredClone"),
    v0 = "DataCloneError",
    g0 = "Transferring",
    y0 = function (e) {
      return (
        !kZ(function () {
          var t = new SZ.Set([7]),
            r = e(t),
            n = e(YZ(7));
          return r === t || !r.has(7) || !PZ(n) || 7 != +n;
        }) && e
      );
    },
    m0 = function (e, t) {
      return !kZ(function () {
        var r = new t(),
          n = e({ a: r, b: r });
        return !(n && n.a === n.b && n.a instanceof t && n.a.stack === r.stack);
      });
    },
    b0 = SZ.structuredClone,
    w0 =
      !m0(b0, XZ) ||
      !m0(b0, e0) ||
      ((EZ = b0),
      !!kZ(function () {
        var e = EZ(new SZ.AggregateError([1], d0, { cause: 3 }));
        return (
          "AggregateError" !== e.name ||
          1 !== e.errors[0] ||
          e.message !== d0 ||
          3 !== e.cause
        );
      })),
    E0 =
      !b0 &&
      y0(function (e) {
        return new ZZ(d0, { detail: e }).detail;
      }),
    x0 = y0(b0) || E0,
    S0 = function (e) {
      throw new e0("Uncloneable type: " + e, v0);
    },
    A0 = function (e, t) {
      throw new e0(
        (t || "Cloning") +
          " of " +
          e +
          " cannot be properly polyfilled in this engine",
        v0
      );
    },
    O0 = function (e, t) {
      return x0 || A0(t), x0(e);
    },
    k0 = function (e, t, r) {
      if (r0(t, e)) return n0(t, e);
      var n, i, o, a, u, c;
      if ("SharedArrayBuffer" === (r || LZ(e))) n = x0 ? x0(e) : e;
      else {
        var s = SZ.DataView;
        s || RZ(e.slice) || A0("ArrayBuffer");
        try {
          if (RZ(e.slice) && !e.resizable) n = e.slice(0);
          else {
            (i = e.byteLength),
              (o =
                "maxByteLength" in e
                  ? { maxByteLength: e.maxByteLength }
                  : void 0),
              (n = new ArrayBuffer(i, o)),
              (a = new s(e)),
              (u = new s(n));
            for (c = 0; c < i; c++) u.setUint8(c, a.getUint8(c));
          }
        } catch ($7) {
          throw new e0("ArrayBuffer is detached", v0);
        }
      }
      return i0(t, e, n), n;
    },
    T0 = function (e, t) {
      if ((FZ(e) && S0("Symbol"), !PZ(e))) return e;
      if (t) {
        if (r0(t, e)) return n0(t, e);
      } else t = new t0();
      var r,
        n,
        i,
        o,
        a,
        u,
        c,
        s,
        f = LZ(e);
      switch (f) {
        case "Array":
          i = KZ(UZ(e));
          break;
        case "Object":
          i = {};
          break;
        case "Map":
          i = new t0();
          break;
        case "Set":
          i = new o0();
          break;
        case "RegExp":
          i = new RegExp(e.source, zZ(e));
          break;
        case "Error":
          switch ((n = e.name)) {
            case "AggregateError":
              i = new (AZ(n))([]);
              break;
            case "EvalError":
            case "RangeError":
            case "ReferenceError":
            case "SuppressedError":
            case "SyntaxError":
            case "TypeError":
            case "URIError":
              i = new (AZ(n))();
              break;
            case "CompileError":
            case "LinkError":
            case "RuntimeError":
              i = new (AZ("WebAssembly", n))();
              break;
            default:
              i = new XZ();
          }
          break;
        case "DOMException":
          i = new e0(e.message, e.name);
          break;
        case "ArrayBuffer":
        case "SharedArrayBuffer":
          i = k0(e, t, f);
          break;
        case "DataView":
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float16Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
          (u = "DataView" === f ? e.byteLength : e.length),
            (i = (function (e, t, r, n, i) {
              var o = SZ[t];
              return PZ(o) || A0(t), new o(k0(e.buffer, i), r, n);
            })(e, f, e.byteOffset, u, t));
          break;
        case "DOMQuad":
          try {
            i = new DOMQuad(T0(e.p1, t), T0(e.p2, t), T0(e.p3, t), T0(e.p4, t));
          } catch ($7) {
            i = O0(e, f);
          }
          break;
        case "File":
          if (x0)
            try {
              (i = x0(e)), LZ(i) !== f && (i = void 0);
            } catch ($7) {}
          if (!i)
            try {
              i = new File([e], e.name, e);
            } catch ($7) {}
          i || A0(f);
          break;
        case "FileList":
          if (
            (o = (function () {
              var e;
              try {
                e = new SZ.DataTransfer();
              } catch ($7) {
                try {
                  e = new SZ.ClipboardEvent("").clipboardData;
                } catch (t) {}
              }
              return e && e.items && e.files ? e : null;
            })())
          ) {
            for (a = 0, u = UZ(e); a < u; a++) o.items.add(T0(e[a], t));
            i = o.files;
          } else i = O0(e, f);
          break;
        case "ImageData":
          try {
            i = new ImageData(T0(e.data, t), e.width, e.height, {
              colorSpace: e.colorSpace,
            });
          } catch ($7) {
            i = O0(e, f);
          }
          break;
        default:
          if (x0) i = x0(e);
          else
            switch (f) {
              case "BigInt":
                i = YZ(e.valueOf());
                break;
              case "Boolean":
                i = YZ(f0(e));
                break;
              case "Number":
                i = YZ(l0(e));
                break;
              case "String":
                i = YZ(h0(e));
                break;
              case "Date":
                i = new JZ(p0(e));
                break;
              case "Blob":
                try {
                  i = e.slice(0, e.size, e.type);
                } catch ($7) {
                  A0(f);
                }
                break;
              case "DOMPoint":
              case "DOMPointReadOnly":
                r = SZ[f];
                try {
                  i = r.fromPoint ? r.fromPoint(e) : new r(e.x, e.y, e.z, e.w);
                } catch ($7) {
                  A0(f);
                }
                break;
              case "DOMRect":
              case "DOMRectReadOnly":
                r = SZ[f];
                try {
                  i = r.fromRect
                    ? r.fromRect(e)
                    : new r(e.x, e.y, e.width, e.height);
                } catch ($7) {
                  A0(f);
                }
                break;
              case "DOMMatrix":
              case "DOMMatrixReadOnly":
                r = SZ[f];
                try {
                  i = r.fromMatrix ? r.fromMatrix(e) : new r(e);
                } catch ($7) {
                  A0(f);
                }
                break;
              case "AudioData":
              case "VideoFrame":
                RZ(e.clone) || A0(f);
                try {
                  i = e.clone();
                } catch ($7) {
                  S0(f);
                }
                break;
              case "CropTarget":
              case "CryptoKey":
              case "FileSystemDirectoryHandle":
              case "FileSystemFileHandle":
              case "FileSystemHandle":
              case "GPUCompilationInfo":
              case "GPUCompilationMessage":
              case "ImageBitmap":
              case "RTCCertificate":
              case "WebAssembly.Module":
                A0(f);
              default:
                S0(f);
            }
      }
      switch ((i0(t, e, i), f)) {
        case "Array":
        case "Object":
          for (c = c0(e), a = 0, u = UZ(c); a < u; a++)
            (s = c[a]), DZ(i, s, T0(e[s], t));
          break;
        case "Map":
          e.forEach(function (e, r) {
            i0(i, T0(r, t), T0(e, t));
          });
          break;
        case "Set":
          e.forEach(function (e) {
            a0(i, T0(e, t));
          });
          break;
        case "Error":
          NZ(i, "message", T0(e.message, t)),
            MZ(e, "cause") && NZ(i, "cause", T0(e.cause, t)),
            "AggregateError" === n
              ? (i.errors = T0(e.errors, t))
              : "SuppressedError" === n &&
                ((i.error = T0(e.error, t)),
                (i.suppressed = T0(e.suppressed, t)));
        case "DOMException":
          GZ && NZ(i, "stack", T0(e.stack, t));
      }
      return i;
    };
  xZ(
    { global: !0, enumerable: !0, sham: !$Z, forced: w0 },
    {
      structuredClone: function (e) {
        var t,
          r,
          n =
            BZ(arguments.length, 1) > 1 && !_Z(arguments[1])
              ? CZ(arguments[1])
              : void 0,
          i = n ? n.transfer : void 0;
        void 0 !== i &&
          (r = (function (e, t) {
            if (!PZ(e))
              throw new QZ("Transfer option cannot be converted to a sequence");
            var r = [];
            jZ(e, function (e) {
              s0(r, CZ(e));
            });
            for (var n, i, o, a, u, c = 0, s = UZ(r), f = new o0(); c < s; ) {
              if (
                ((n = r[c++]),
                "ArrayBuffer" === (i = LZ(n)) ? u0(f, n) : r0(t, n))
              )
                throw new e0("Duplicate transferable", v0);
              if ("ArrayBuffer" !== i) {
                if ($Z) a = b0(n, { transfer: [n] });
                else
                  switch (i) {
                    case "ImageBitmap":
                      (o = SZ.OffscreenCanvas), IZ(o) || A0(i, g0);
                      try {
                        (u = new o(n.width, n.height))
                          .getContext("bitmaprenderer")
                          .transferFromImageBitmap(n),
                          (a = u.transferToImageBitmap());
                      } catch ($7) {}
                      break;
                    case "AudioData":
                    case "VideoFrame":
                      (RZ(n.clone) && RZ(n.close)) || A0(i, g0);
                      try {
                        (a = n.clone()), n.close();
                      } catch ($7) {}
                      break;
                    case "MediaSourceHandle":
                    case "MessagePort":
                    case "MIDIAccess":
                    case "OffscreenCanvas":
                    case "ReadableStream":
                    case "RTCDataChannel":
                    case "TransformStream":
                    case "WebTransportReceiveStream":
                    case "WebTransportSendStream":
                    case "WritableStream":
                      A0(i, g0);
                  }
                if (void 0 === a)
                  throw new e0("This object cannot be transferred: " + i, v0);
                i0(t, n, a);
              } else a0(f, n);
            }
            return f;
          })(i, (t = new t0())));
        var o = T0(e, t);
        return (
          r &&
            (function (e) {
              qZ(e, function (e) {
                $Z
                  ? x0(e, { transfer: [e] })
                  : RZ(e.transfer)
                  ? e.transfer()
                  : VZ
                  ? VZ(e)
                  : A0("ArrayBuffer", g0);
              });
            })(r),
          o
        );
      },
    }
  );
  var R0 = _i,
    I0 = I,
    _0 = rZ(I0.setInterval, !0);
  R0(
    { global: !0, bind: !0, forced: I0.setInterval !== _0 },
    { setInterval: _0 }
  );
  var P0 = _i,
    F0 = I,
    j0 = rZ(F0.setTimeout, !0);
  P0(
    { global: !0, bind: !0, forced: F0.setTimeout !== j0 },
    { setTimeout: j0 }
  );
  var C0 = P,
    L0 = F,
    M0 = It("iterator"),
    D0 = !C0(function () {
      var e = new URL("b?a=1&b=2&c=3", "https://a"),
        t = e.searchParams,
        r = new URLSearchParams("a=1&a=2&b=3"),
        n = "";
      return (
        (e.pathname = "c%20d"),
        t.forEach(function (e, r) {
          t.delete("b"), (n += r + e);
        }),
        r.delete("a", 2),
        r.delete("b", void 0),
        (!t.size && !L0) ||
          !t.sort ||
          "https://a/c%20d?a=1&c=3" !== e.href ||
          "3" !== t.get("c") ||
          "a=1" !== String(new URLSearchParams("?a=1")) ||
          !t[M0] ||
          "a" !== new URL("https://a@b").username ||
          "b" !== new URLSearchParams(new URLSearchParams("a=b")).get("a") ||
          "xn--e1aybc" !== new URL("https://褌械褋褌").host ||
          "#%D0%B1" !== new URL("https://a#斜").hash ||
          "a1c3" !== n ||
          "x" !== new URL("https://x", void 0).host
      );
    }),
    N0 = Y,
    U0 = 2147483647,
    B0 = /[^\0-\u007E]/,
    z0 = /[.\u3002\uFF0E\uFF61]/g,
    H0 = "Overflow: input needs wider integers to process",
    W0 = RangeError,
    q0 = N0(z0.exec),
    V0 = Math.floor,
    G0 = String.fromCharCode,
    $0 = N0("".charCodeAt),
    Y0 = N0([].join),
    K0 = N0([].push),
    J0 = N0("".replace),
    X0 = N0("".split),
    Q0 = N0("".toLowerCase),
    Z0 = function (e) {
      return e + 22 + 75 * (e < 26);
    },
    e1 = function (e, t, r) {
      var n = 0;
      for (e = r ? V0(e / 700) : e >> 1, e += V0(e / t); e > 455; )
        (e = V0(e / 35)), (n += 36);
      return V0(n + (36 * e) / (e + 38));
    },
    t1 = function (e) {
      var t = [];
      e = (function (e) {
        for (var t = [], r = 0, n = e.length; r < n; ) {
          var i = $0(e, r++);
          if (i >= 55296 && i <= 56319 && r < n) {
            var o = $0(e, r++);
            56320 == (64512 & o)
              ? K0(t, ((1023 & i) << 10) + (1023 & o) + 65536)
              : (K0(t, i), r--);
          } else K0(t, i);
        }
        return t;
      })(e);
      var r,
        n,
        i = e.length,
        o = 128,
        a = 0,
        u = 72;
      for (r = 0; r < e.length; r++) (n = e[r]) < 128 && K0(t, G0(n));
      var c = t.length,
        s = c;
      for (c && K0(t, "-"); s < i; ) {
        var f = U0;
        for (r = 0; r < e.length; r++) (n = e[r]) >= o && n < f && (f = n);
        var l = s + 1;
        if (f - o > V0((U0 - a) / l)) throw new W0(H0);
        for (a += (f - o) * l, o = f, r = 0; r < e.length; r++) {
          if ((n = e[r]) < o && ++a > U0) throw new W0(H0);
          if (n === o) {
            for (var h = a, p = 36; ; ) {
              var d = p <= u ? 1 : p >= u + 26 ? 26 : p - u;
              if (h < d) break;
              var v = h - d,
                g = 36 - d;
              K0(t, G0(Z0(d + (v % g)))), (h = V0(v / g)), (p += 36);
            }
            K0(t, G0(Z0(h))), (u = e1(a, l, s === c)), (a = 0), s++;
          }
        }
        a++, o++;
      }
      return Y0(t, "");
    },
    r1 = _i,
    n1 = I,
    i1 = TF,
    o1 = ye,
    a1 = M,
    u1 = Y,
    c1 = F,
    s1 = D0,
    f1 = kn,
    l1 = Oo,
    h1 = _y,
    p1 = Ho,
    d1 = ad,
    v1 = rn,
    g1 = jy,
    y1 = he,
    m1 = vt,
    b1 = Ko,
    w1 = Ui,
    E1 = ur,
    x1 = de,
    S1 = Hi,
    A1 = vo,
    O1 = W,
    k1 = Wf,
    T1 = Mf,
    R1 = Td,
    I1 = KP,
    _1 = Zv,
    P1 = It("iterator"),
    F1 = "URLSearchParams",
    j1 = F1 + "Iterator",
    C1 = v1.set,
    L1 = v1.getterFor(F1),
    M1 = v1.getterFor(j1),
    D1 = i1("fetch"),
    N1 = i1("Request"),
    U1 = i1("Headers"),
    B1 = N1 && N1.prototype,
    z1 = U1 && U1.prototype,
    H1 = n1.TypeError,
    W1 = n1.encodeURIComponent,
    q1 = String.fromCharCode,
    V1 = o1("String", "fromCodePoint"),
    G1 = parseInt,
    $1 = u1("".charAt),
    Y1 = u1([].join),
    K1 = u1([].push),
    J1 = u1("".replace),
    X1 = u1([].shift),
    Q1 = u1([].splice),
    Z1 = u1("".split),
    e2 = u1("".slice),
    t2 = u1(/./.exec),
    r2 = /\+/g,
    n2 = /^[0-9a-f]+$/i,
    i2 = function (e, t) {
      var r = e2(e, t, t + 2);
      return t2(n2, r) ? G1(r, 16) : NaN;
    },
    o2 = function (e) {
      for (var t = 0, r = 128; r > 0 && e & r; r >>= 1) t++;
      return t;
    },
    a2 = function (e) {
      var t = null;
      switch (e.length) {
        case 1:
          t = e[0];
          break;
        case 2:
          t = ((31 & e[0]) << 6) | (63 & e[1]);
          break;
        case 3:
          t = ((15 & e[0]) << 12) | ((63 & e[1]) << 6) | (63 & e[2]);
          break;
        case 4:
          t =
            ((7 & e[0]) << 18) |
            ((63 & e[1]) << 12) |
            ((63 & e[2]) << 6) |
            (63 & e[3]);
      }
      return t > 1114111 ? null : t;
    },
    u2 = function (e) {
      for (var t = (e = J1(e, r2, " ")).length, r = "", n = 0; n < t; ) {
        var i = $1(e, n);
        if ("%" === i) {
          if ("%" === $1(e, n + 1) || n + 3 > t) {
            (r += "%"), n++;
            continue;
          }
          var o = i2(e, n + 1);
          if (o != o) {
            (r += i), n++;
            continue;
          }
          n += 2;
          var a = o2(o);
          if (0 === a) i = q1(o);
          else {
            if (1 === a || a > 4) {
              (r += "锟�"), n++;
              continue;
            }
            for (
              var u = [o], c = 1;
              c < a && !(++n + 3 > t || "%" !== $1(e, n));

            ) {
              var s = i2(e, n + 1);
              if (s != s) {
                n += 3;
                break;
              }
              if (s > 191 || s < 128) break;
              K1(u, s), (n += 2), c++;
            }
            if (u.length !== a) {
              r += "锟�";
              continue;
            }
            var f = a2(u);
            null === f ? (r += "锟�") : (i = V1(f));
          }
        }
        (r += i), n++;
      }
      return r;
    },
    c2 = /[!'()~]|%20/g,
    s2 = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
    },
    f2 = function (e) {
      return s2[e];
    },
    l2 = function (e) {
      return J1(W1(e), c2, f2);
    },
    h2 = d1(
      function (e, t) {
        C1(this, { type: j1, target: L1(e).entries, index: 0, kind: t });
      },
      F1,
      function () {
        var e = M1(this),
          t = e.target,
          r = e.index++;
        if (!t || r >= t.length) return (e.target = null), R1(void 0, !0);
        var n = t[r];
        switch (e.kind) {
          case "keys":
            return R1(n.key, !1);
          case "values":
            return R1(n.value, !1);
        }
        return R1([n.key, n.value], !1);
      },
      !0
    ),
    p2 = function (e) {
      (this.entries = []),
        (this.url = null),
        void 0 !== e &&
          (x1(e)
            ? this.parseObject(e)
            : this.parseQuery(
                "string" == typeof e ? ("?" === $1(e, 0) ? e2(e, 1) : e) : S1(e)
              ));
    };
  p2.prototype = {
    type: F1,
    bindURL: function (e) {
      (this.url = e), this.update();
    },
    parseObject: function (e) {
      var t,
        r,
        n,
        i,
        o,
        a,
        u,
        c = this.entries,
        s = T1(e);
      if (s)
        for (r = (t = k1(e, s)).next; !(n = a1(r, t)).done; ) {
          if (
            ((o = (i = k1(E1(n.value))).next),
            (a = a1(o, i)).done || (u = a1(o, i)).done || !a1(o, i).done)
          )
            throw new H1("Expected sequence with length 2");
          K1(c, { key: S1(a.value), value: S1(u.value) });
        }
      else for (var f in e) m1(e, f) && K1(c, { key: f, value: S1(e[f]) });
    },
    parseQuery: function (e) {
      if (e)
        for (var t, r, n = this.entries, i = Z1(e, "&"), o = 0; o < i.length; )
          (t = i[o++]).length &&
            ((r = Z1(t, "=")),
            K1(n, { key: u2(X1(r)), value: u2(Y1(r, "=")) }));
    },
    serialize: function () {
      for (var e, t = this.entries, r = [], n = 0; n < t.length; )
        (e = t[n++]), K1(r, l2(e.key) + "=" + l2(e.value));
      return Y1(r, "&");
    },
    update: function () {
      (this.entries.length = 0), this.parseQuery(this.url.query);
    },
    updateURL: function () {
      this.url && this.url.update();
    },
  };
  var d2 = function () {
      g1(this, v2);
      var e = C1(this, new p2(arguments.length > 0 ? arguments[0] : void 0));
      c1 || (this.size = e.entries.length);
    },
    v2 = d2.prototype;
  if (
    (h1(
      v2,
      {
        append: function (e, t) {
          var r = L1(this);
          I1(arguments.length, 2),
            K1(r.entries, { key: S1(e), value: S1(t) }),
            c1 || this.length++,
            r.updateURL();
        },
        delete: function (e) {
          for (
            var t = L1(this),
              r = I1(arguments.length, 1),
              n = t.entries,
              i = S1(e),
              o = r < 2 ? void 0 : arguments[1],
              a = void 0 === o ? o : S1(o),
              u = 0;
            u < n.length;

          ) {
            var c = n[u];
            if (c.key !== i || (void 0 !== a && c.value !== a)) u++;
            else if ((Q1(n, u, 1), void 0 !== a)) break;
          }
          c1 || (this.size = n.length), t.updateURL();
        },
        get: function (e) {
          var t = L1(this).entries;
          I1(arguments.length, 1);
          for (var r = S1(e), n = 0; n < t.length; n++)
            if (t[n].key === r) return t[n].value;
          return null;
        },
        getAll: function (e) {
          var t = L1(this).entries;
          I1(arguments.length, 1);
          for (var r = S1(e), n = [], i = 0; i < t.length; i++)
            t[i].key === r && K1(n, t[i].value);
          return n;
        },
        has: function (e) {
          for (
            var t = L1(this).entries,
              r = I1(arguments.length, 1),
              n = S1(e),
              i = r < 2 ? void 0 : arguments[1],
              o = void 0 === i ? i : S1(i),
              a = 0;
            a < t.length;

          ) {
            var u = t[a++];
            if (u.key === n && (void 0 === o || u.value === o)) return !0;
          }
          return !1;
        },
        set: function (e, t) {
          var r = L1(this);
          I1(arguments.length, 1);
          for (
            var n, i = r.entries, o = !1, a = S1(e), u = S1(t), c = 0;
            c < i.length;
            c++
          )
            (n = i[c]).key === a &&
              (o ? Q1(i, c--, 1) : ((o = !0), (n.value = u)));
          o || K1(i, { key: a, value: u }),
            c1 || (this.size = i.length),
            r.updateURL();
        },
        sort: function () {
          var e = L1(this);
          _1(e.entries, function (e, t) {
            return e.key > t.key ? 1 : -1;
          }),
            e.updateURL();
        },
        forEach: function (e) {
          for (
            var t,
              r = L1(this).entries,
              n = b1(e, arguments.length > 1 ? arguments[1] : void 0),
              i = 0;
            i < r.length;

          )
            n((t = r[i++]).value, t.key, this);
        },
        keys: function () {
          return new h2(this, "keys");
        },
        values: function () {
          return new h2(this, "values");
        },
        entries: function () {
          return new h2(this, "entries");
        },
      },
      { enumerable: !0 }
    ),
    f1(v2, P1, v2.entries, { name: "entries" }),
    f1(
      v2,
      "toString",
      function () {
        return L1(this).serialize();
      },
      { enumerable: !0 }
    ),
    c1 &&
      l1(v2, "size", {
        get: function () {
          return L1(this).entries.length;
        },
        configurable: !0,
        enumerable: !0,
      }),
    p1(d2, F1),
    r1({ global: !0, constructor: !0, forced: !s1 }, { URLSearchParams: d2 }),
    !s1 && y1(U1))
  ) {
    var g2 = u1(z1.has),
      y2 = u1(z1.set),
      m2 = function (e) {
        if (x1(e)) {
          var t,
            r = e.body;
          if (w1(r) === F1)
            return (
              (t = e.headers ? new U1(e.headers) : new U1()),
              g2(t, "content-type") ||
                y2(
                  t,
                  "content-type",
                  "application/x-www-form-urlencoded;charset=UTF-8"
                ),
              A1(e, { body: O1(0, S1(r)), headers: O1(0, t) })
            );
        }
        return e;
      };
    if (
      (y1(D1) &&
        r1(
          { global: !0, enumerable: !0, dontCallGetSet: !0, forced: !0 },
          {
            fetch: function (e) {
              return D1(e, arguments.length > 1 ? m2(arguments[1]) : {});
            },
          }
        ),
      y1(N1))
    ) {
      var b2 = function (e) {
        return (
          g1(this, B1), new N1(e, arguments.length > 1 ? m2(arguments[1]) : {})
        );
      };
      (B1.constructor = b2),
        (b2.prototype = B1),
        r1(
          { global: !0, constructor: !0, dontCallGetSet: !0, forced: !0 },
          { Request: b2 }
        );
    }
  }
  var w2,
    E2 = _i,
    x2 = F,
    S2 = D0,
    A2 = I,
    O2 = Ko,
    k2 = Y,
    T2 = kn,
    R2 = Oo,
    I2 = jy,
    _2 = vt,
    P2 = OI,
    F2 = Ip,
    j2 = yo,
    C2 = _B.codeAt,
    L2 = function (e) {
      var t,
        r,
        n = [],
        i = X0(J0(Q0(e), z0, "."), ".");
      for (t = 0; t < i.length; t++)
        (r = i[t]), K0(n, q0(B0, r) ? "xn--" + t1(r) : r);
      return Y0(n, ".");
    },
    M2 = Hi,
    D2 = Ho,
    N2 = KP,
    U2 = { URLSearchParams: d2, getState: L1 },
    B2 = rn,
    z2 = B2.set,
    H2 = B2.getterFor("URL"),
    W2 = U2.URLSearchParams,
    q2 = U2.getState,
    V2 = A2.URL,
    G2 = A2.TypeError,
    $2 = A2.parseInt,
    Y2 = Math.floor,
    K2 = Math.pow,
    J2 = k2("".charAt),
    X2 = k2(/./.exec),
    Q2 = k2([].join),
    Z2 = k2((1).toString),
    e4 = k2([].pop),
    t4 = k2([].push),
    r4 = k2("".replace),
    n4 = k2([].shift),
    i4 = k2("".split),
    o4 = k2("".slice),
    a4 = k2("".toLowerCase),
    u4 = k2([].unshift),
    c4 = "Invalid scheme",
    s4 = "Invalid host",
    f4 = "Invalid port",
    l4 = /[a-z]/i,
    h4 = /[\d+-.a-z]/i,
    p4 = /\d/,
    d4 = /^0x/i,
    v4 = /^[0-7]+$/,
    g4 = /^\d+$/,
    y4 = /^[\da-f]+$/i,
    m4 = /[\0\t\n\r #%/:<>?@[\\\]^|]/,
    b4 = /[\0\t\n\r #/:<>?@[\\\]^|]/,
    w4 = /^[\u0000-\u0020]+/,
    E4 = /(^|[^\u0000-\u0020])[\u0000-\u0020]+$/,
    x4 = /[\t\n\r]/g,
    S4 = function (e) {
      var t, r, n, i;
      if ("number" == typeof e) {
        for (t = [], r = 0; r < 4; r++) u4(t, e % 256), (e = Y2(e / 256));
        return Q2(t, ".");
      }
      if ("object" == f(e)) {
        for (
          t = "",
            n = (function (e) {
              for (var t = null, r = 1, n = null, i = 0, o = 0; o < 8; o++)
                0 !== e[o]
                  ? (i > r && ((t = n), (r = i)), (n = null), (i = 0))
                  : (null === n && (n = o), ++i);
              return i > r ? n : t;
            })(e),
            r = 0;
          r < 8;
          r++
        )
          (i && 0 === e[r]) ||
            (i && (i = !1),
            n === r
              ? ((t += r ? ":" : "::"), (i = !0))
              : ((t += Z2(e[r], 16)), r < 7 && (t += ":")));
        return "[" + t + "]";
      }
      return e;
    },
    A4 = {},
    O4 = P2({}, A4, { " ": 1, '"': 1, "<": 1, ">": 1, "`": 1 }),
    k4 = P2({}, O4, { "#": 1, "?": 1, "{": 1, "}": 1 }),
    T4 = P2({}, k4, {
      "/": 1,
      ":": 1,
      ";": 1,
      "=": 1,
      "@": 1,
      "[": 1,
      "\\": 1,
      "]": 1,
      "^": 1,
      "|": 1,
    }),
    R4 = function (e, t) {
      var r = C2(e, 0);
      return r > 32 && r < 127 && !_2(t, e) ? e : encodeURIComponent(e);
    },
    I4 = { ftp: 21, file: null, http: 80, https: 443, ws: 80, wss: 443 },
    _4 = function (e, t) {
      var r;
      return (
        2 === e.length &&
        X2(l4, J2(e, 0)) &&
        (":" === (r = J2(e, 1)) || (!t && "|" === r))
      );
    },
    P4 = function (e) {
      var t;
      return (
        e.length > 1 &&
        _4(o4(e, 0, 2)) &&
        (2 === e.length ||
          "/" === (t = J2(e, 2)) ||
          "\\" === t ||
          "?" === t ||
          "#" === t)
      );
    },
    F4 = function (e) {
      return "." === e || "%2e" === a4(e);
    },
    j4 = {},
    C4 = {},
    L4 = {},
    M4 = {},
    D4 = {},
    N4 = {},
    U4 = {},
    B4 = {},
    z4 = {},
    H4 = {},
    W4 = {},
    q4 = {},
    V4 = {},
    G4 = {},
    $4 = {},
    Y4 = {},
    K4 = {},
    J4 = {},
    X4 = {},
    Q4 = {},
    Z4 = {},
    e6 = function (e, t, r) {
      var n,
        i,
        o,
        a = M2(e);
      if (t) {
        if ((i = this.parse(a))) throw new G2(i);
        this.searchParams = null;
      } else {
        if ((void 0 !== r && (n = new e6(r, !0)), (i = this.parse(a, null, n))))
          throw new G2(i);
        (o = q2(new W2())).bindURL(this), (this.searchParams = o);
      }
    };
  e6.prototype = {
    type: "URL",
    parse: function (e, t, r) {
      var n,
        i,
        o,
        a,
        u,
        c = this,
        s = t || j4,
        f = 0,
        l = "",
        h = !1,
        p = !1,
        d = !1;
      for (
        e = M2(e),
          t ||
            ((c.scheme = ""),
            (c.username = ""),
            (c.password = ""),
            (c.host = null),
            (c.port = null),
            (c.path = []),
            (c.query = null),
            (c.fragment = null),
            (c.cannotBeABaseURL = !1),
            (e = r4(e, w4, "")),
            (e = r4(e, E4, "$1"))),
          e = r4(e, x4, ""),
          n = F2(e);
        f <= n.length;

      ) {
        switch (((i = n[f]), s)) {
          case j4:
            if (!i || !X2(l4, i)) {
              if (t) return c4;
              s = L4;
              continue;
            }
            (l += a4(i)), (s = C4);
            break;
          case C4:
            if (i && (X2(h4, i) || "+" === i || "-" === i || "." === i))
              l += a4(i);
            else {
              if (":" !== i) {
                if (t) return c4;
                (l = ""), (s = L4), (f = 0);
                continue;
              }
              if (
                t &&
                (c.isSpecial() !== _2(I4, l) ||
                  ("file" === l &&
                    (c.includesCredentials() || null !== c.port)) ||
                  ("file" === c.scheme && !c.host))
              )
                return;
              if (((c.scheme = l), t))
                return void (
                  c.isSpecial() &&
                  I4[c.scheme] === c.port &&
                  (c.port = null)
                );
              (l = ""),
                "file" === c.scheme
                  ? (s = G4)
                  : c.isSpecial() && r && r.scheme === c.scheme
                  ? (s = M4)
                  : c.isSpecial()
                  ? (s = B4)
                  : "/" === n[f + 1]
                  ? ((s = D4), f++)
                  : ((c.cannotBeABaseURL = !0), t4(c.path, ""), (s = X4));
            }
            break;
          case L4:
            if (!r || (r.cannotBeABaseURL && "#" !== i)) return c4;
            if (r.cannotBeABaseURL && "#" === i) {
              (c.scheme = r.scheme),
                (c.path = j2(r.path)),
                (c.query = r.query),
                (c.fragment = ""),
                (c.cannotBeABaseURL = !0),
                (s = Z4);
              break;
            }
            s = "file" === r.scheme ? G4 : N4;
            continue;
          case M4:
            if ("/" !== i || "/" !== n[f + 1]) {
              s = N4;
              continue;
            }
            (s = z4), f++;
            break;
          case D4:
            if ("/" === i) {
              s = H4;
              break;
            }
            s = J4;
            continue;
          case N4:
            if (((c.scheme = r.scheme), i === w2))
              (c.username = r.username),
                (c.password = r.password),
                (c.host = r.host),
                (c.port = r.port),
                (c.path = j2(r.path)),
                (c.query = r.query);
            else if ("/" === i || ("\\" === i && c.isSpecial())) s = U4;
            else if ("?" === i)
              (c.username = r.username),
                (c.password = r.password),
                (c.host = r.host),
                (c.port = r.port),
                (c.path = j2(r.path)),
                (c.query = ""),
                (s = Q4);
            else {
              if ("#" !== i) {
                (c.username = r.username),
                  (c.password = r.password),
                  (c.host = r.host),
                  (c.port = r.port),
                  (c.path = j2(r.path)),
                  c.path.length--,
                  (s = J4);
                continue;
              }
              (c.username = r.username),
                (c.password = r.password),
                (c.host = r.host),
                (c.port = r.port),
                (c.path = j2(r.path)),
                (c.query = r.query),
                (c.fragment = ""),
                (s = Z4);
            }
            break;
          case U4:
            if (!c.isSpecial() || ("/" !== i && "\\" !== i)) {
              if ("/" !== i) {
                (c.username = r.username),
                  (c.password = r.password),
                  (c.host = r.host),
                  (c.port = r.port),
                  (s = J4);
                continue;
              }
              s = H4;
            } else s = z4;
            break;
          case B4:
            if (((s = z4), "/" !== i || "/" !== J2(l, f + 1))) continue;
            f++;
            break;
          case z4:
            if ("/" !== i && "\\" !== i) {
              s = H4;
              continue;
            }
            break;
          case H4:
            if ("@" === i) {
              h && (l = "%40" + l), (h = !0), (o = F2(l));
              for (var v = 0; v < o.length; v++) {
                var g = o[v];
                if (":" !== g || d) {
                  var y = R4(g, T4);
                  d ? (c.password += y) : (c.username += y);
                } else d = !0;
              }
              l = "";
            } else if (
              i === w2 ||
              "/" === i ||
              "?" === i ||
              "#" === i ||
              ("\\" === i && c.isSpecial())
            ) {
              if (h && "" === l) return "Invalid authority";
              (f -= F2(l).length + 1), (l = ""), (s = W4);
            } else l += i;
            break;
          case W4:
          case q4:
            if (t && "file" === c.scheme) {
              s = Y4;
              continue;
            }
            if (":" !== i || p) {
              if (
                i === w2 ||
                "/" === i ||
                "?" === i ||
                "#" === i ||
                ("\\" === i && c.isSpecial())
              ) {
                if (c.isSpecial() && "" === l) return s4;
                if (
                  t &&
                  "" === l &&
                  (c.includesCredentials() || null !== c.port)
                )
                  return;
                if ((a = c.parseHost(l))) return a;
                if (((l = ""), (s = K4), t)) return;
                continue;
              }
              "[" === i ? (p = !0) : "]" === i && (p = !1), (l += i);
            } else {
              if ("" === l) return s4;
              if ((a = c.parseHost(l))) return a;
              if (((l = ""), (s = V4), t === q4)) return;
            }
            break;
          case V4:
            if (!X2(p4, i)) {
              if (
                i === w2 ||
                "/" === i ||
                "?" === i ||
                "#" === i ||
                ("\\" === i && c.isSpecial()) ||
                t
              ) {
                if ("" !== l) {
                  var m = $2(l, 10);
                  if (m > 65535) return f4;
                  (c.port = c.isSpecial() && m === I4[c.scheme] ? null : m),
                    (l = "");
                }
                if (t) return;
                s = K4;
                continue;
              }
              return f4;
            }
            l += i;
            break;
          case G4:
            if (((c.scheme = "file"), "/" === i || "\\" === i)) s = $4;
            else {
              if (!r || "file" !== r.scheme) {
                s = J4;
                continue;
              }
              switch (i) {
                case w2:
                  (c.host = r.host), (c.path = j2(r.path)), (c.query = r.query);
                  break;
                case "?":
                  (c.host = r.host),
                    (c.path = j2(r.path)),
                    (c.query = ""),
                    (s = Q4);
                  break;
                case "#":
                  (c.host = r.host),
                    (c.path = j2(r.path)),
                    (c.query = r.query),
                    (c.fragment = ""),
                    (s = Z4);
                  break;
                default:
                  P4(Q2(j2(n, f), "")) ||
                    ((c.host = r.host), (c.path = j2(r.path)), c.shortenPath()),
                    (s = J4);
                  continue;
              }
            }
            break;
          case $4:
            if ("/" === i || "\\" === i) {
              s = Y4;
              break;
            }
            r &&
              "file" === r.scheme &&
              !P4(Q2(j2(n, f), "")) &&
              (_4(r.path[0], !0) ? t4(c.path, r.path[0]) : (c.host = r.host)),
              (s = J4);
            continue;
          case Y4:
            if (i === w2 || "/" === i || "\\" === i || "?" === i || "#" === i) {
              if (!t && _4(l)) s = J4;
              else if ("" === l) {
                if (((c.host = ""), t)) return;
                s = K4;
              } else {
                if ((a = c.parseHost(l))) return a;
                if (("localhost" === c.host && (c.host = ""), t)) return;
                (l = ""), (s = K4);
              }
              continue;
            }
            l += i;
            break;
          case K4:
            if (c.isSpecial()) {
              if (((s = J4), "/" !== i && "\\" !== i)) continue;
            } else if (t || "?" !== i)
              if (t || "#" !== i) {
                if (i !== w2 && ((s = J4), "/" !== i)) continue;
              } else (c.fragment = ""), (s = Z4);
            else (c.query = ""), (s = Q4);
            break;
          case J4:
            if (
              i === w2 ||
              "/" === i ||
              ("\\" === i && c.isSpecial()) ||
              (!t && ("?" === i || "#" === i))
            ) {
              if (
                (".." === (u = a4((u = l))) ||
                "%2e." === u ||
                ".%2e" === u ||
                "%2e%2e" === u
                  ? (c.shortenPath(),
                    "/" === i ||
                      ("\\" === i && c.isSpecial()) ||
                      t4(c.path, ""))
                  : F4(l)
                  ? "/" === i || ("\\" === i && c.isSpecial()) || t4(c.path, "")
                  : ("file" === c.scheme &&
                      !c.path.length &&
                      _4(l) &&
                      (c.host && (c.host = ""), (l = J2(l, 0) + ":")),
                    t4(c.path, l)),
                (l = ""),
                "file" === c.scheme && (i === w2 || "?" === i || "#" === i))
              )
                for (; c.path.length > 1 && "" === c.path[0]; ) n4(c.path);
              "?" === i
                ? ((c.query = ""), (s = Q4))
                : "#" === i && ((c.fragment = ""), (s = Z4));
            } else l += R4(i, k4);
            break;
          case X4:
            "?" === i
              ? ((c.query = ""), (s = Q4))
              : "#" === i
              ? ((c.fragment = ""), (s = Z4))
              : i !== w2 && (c.path[0] += R4(i, A4));
            break;
          case Q4:
            t || "#" !== i
              ? i !== w2 &&
                ("'" === i && c.isSpecial()
                  ? (c.query += "%27")
                  : (c.query += "#" === i ? "%23" : R4(i, A4)))
              : ((c.fragment = ""), (s = Z4));
            break;
          case Z4:
            i !== w2 && (c.fragment += R4(i, O4));
        }
        f++;
      }
    },
    parseHost: function (e) {
      var t, r, n;
      if ("[" === J2(e, 0)) {
        if ("]" !== J2(e, e.length - 1)) return s4;
        if (
          ((t = (function (e) {
            var t,
              r,
              n,
              i,
              o,
              a,
              u,
              c = [0, 0, 0, 0, 0, 0, 0, 0],
              s = 0,
              f = null,
              l = 0,
              h = function () {
                return J2(e, l);
              };
            if (":" === h()) {
              if (":" !== J2(e, 1)) return;
              (l += 2), (f = ++s);
            }
            for (; h(); ) {
              if (8 === s) return;
              if (":" !== h()) {
                for (t = r = 0; r < 4 && X2(y4, h()); )
                  (t = 16 * t + $2(h(), 16)), l++, r++;
                if ("." === h()) {
                  if (0 === r) return;
                  if (((l -= r), s > 6)) return;
                  for (n = 0; h(); ) {
                    if (((i = null), n > 0)) {
                      if (!("." === h() && n < 4)) return;
                      l++;
                    }
                    if (!X2(p4, h())) return;
                    for (; X2(p4, h()); ) {
                      if (((o = $2(h(), 10)), null === i)) i = o;
                      else {
                        if (0 === i) return;
                        i = 10 * i + o;
                      }
                      if (i > 255) return;
                      l++;
                    }
                    (c[s] = 256 * c[s] + i), (2 != ++n && 4 !== n) || s++;
                  }
                  if (4 !== n) return;
                  break;
                }
                if (":" === h()) {
                  if ((l++, !h())) return;
                } else if (h()) return;
                c[s++] = t;
              } else {
                if (null !== f) return;
                l++, (f = ++s);
              }
            }
            if (null !== f)
              for (a = s - f, s = 7; 0 !== s && a > 0; )
                (u = c[s]), (c[s--] = c[f + a - 1]), (c[f + --a] = u);
            else if (8 !== s) return;
            return c;
          })(o4(e, 1, -1))),
          !t)
        )
          return s4;
        this.host = t;
      } else if (this.isSpecial()) {
        if (((e = L2(e)), X2(m4, e))) return s4;
        if (
          ((t = (function (e) {
            var t,
              r,
              n,
              i,
              o,
              a,
              u,
              c = i4(e, ".");
            if (
              (c.length && "" === c[c.length - 1] && c.length--,
              (t = c.length) > 4)
            )
              return e;
            for (r = [], n = 0; n < t; n++) {
              if ("" === (i = c[n])) return e;
              if (
                ((o = 10),
                i.length > 1 &&
                  "0" === J2(i, 0) &&
                  ((o = X2(d4, i) ? 16 : 8), (i = o4(i, 8 === o ? 1 : 2))),
                "" === i)
              )
                a = 0;
              else {
                if (!X2(10 === o ? g4 : 8 === o ? v4 : y4, i)) return e;
                a = $2(i, o);
              }
              t4(r, a);
            }
            for (n = 0; n < t; n++)
              if (((a = r[n]), n === t - 1)) {
                if (a >= K2(256, 5 - t)) return null;
              } else if (a > 255) return null;
            for (u = e4(r), n = 0; n < r.length; n++)
              u += r[n] * K2(256, 3 - n);
            return u;
          })(e)),
          null === t)
        )
          return s4;
        this.host = t;
      } else {
        if (X2(b4, e)) return s4;
        for (t = "", r = F2(e), n = 0; n < r.length; n++) t += R4(r[n], A4);
        this.host = t;
      }
    },
    cannotHaveUsernamePasswordPort: function () {
      return !this.host || this.cannotBeABaseURL || "file" === this.scheme;
    },
    includesCredentials: function () {
      return "" !== this.username || "" !== this.password;
    },
    isSpecial: function () {
      return _2(I4, this.scheme);
    },
    shortenPath: function () {
      var e = this.path,
        t = e.length;
      !t || ("file" === this.scheme && 1 === t && _4(e[0], !0)) || e.length--;
    },
    serialize: function () {
      var e = this,
        t = e.scheme,
        r = e.username,
        n = e.password,
        i = e.host,
        o = e.port,
        a = e.path,
        u = e.query,
        c = e.fragment,
        s = t + ":";
      return (
        null !== i
          ? ((s += "//"),
            e.includesCredentials() && (s += r + (n ? ":" + n : "") + "@"),
            (s += S4(i)),
            null !== o && (s += ":" + o))
          : "file" === t && (s += "//"),
        (s += e.cannotBeABaseURL ? a[0] : a.length ? "/" + Q2(a, "/") : ""),
        null !== u && (s += "?" + u),
        null !== c && (s += "#" + c),
        s
      );
    },
    setHref: function (e) {
      var t = this.parse(e);
      if (t) throw new G2(t);
      this.searchParams.update();
    },
    getOrigin: function () {
      var e = this.scheme,
        t = this.port;
      if ("blob" === e)
        try {
          return new t6(e.path[0]).origin;
        } catch ($7) {
          return "null";
        }
      return "file" !== e && this.isSpecial()
        ? e + "://" + S4(this.host) + (null !== t ? ":" + t : "")
        : "null";
    },
    getProtocol: function () {
      return this.scheme + ":";
    },
    setProtocol: function (e) {
      this.parse(M2(e) + ":", j4);
    },
    getUsername: function () {
      return this.username;
    },
    setUsername: function (e) {
      var t = F2(M2(e));
      if (!this.cannotHaveUsernamePasswordPort()) {
        this.username = "";
        for (var r = 0; r < t.length; r++) this.username += R4(t[r], T4);
      }
    },
    getPassword: function () {
      return this.password;
    },
    setPassword: function (e) {
      var t = F2(M2(e));
      if (!this.cannotHaveUsernamePasswordPort()) {
        this.password = "";
        for (var r = 0; r < t.length; r++) this.password += R4(t[r], T4);
      }
    },
    getHost: function () {
      var e = this.host,
        t = this.port;
      return null === e ? "" : null === t ? S4(e) : S4(e) + ":" + t;
    },
    setHost: function (e) {
      this.cannotBeABaseURL || this.parse(e, W4);
    },
    getHostname: function () {
      var e = this.host;
      return null === e ? "" : S4(e);
    },
    setHostname: function (e) {
      this.cannotBeABaseURL || this.parse(e, q4);
    },
    getPort: function () {
      var e = this.port;
      return null === e ? "" : M2(e);
    },
    setPort: function (e) {
      this.cannotHaveUsernamePasswordPort() ||
        ("" === (e = M2(e)) ? (this.port = null) : this.parse(e, V4));
    },
    getPathname: function () {
      var e = this.path;
      return this.cannotBeABaseURL ? e[0] : e.length ? "/" + Q2(e, "/") : "";
    },
    setPathname: function (e) {
      this.cannotBeABaseURL || ((this.path = []), this.parse(e, K4));
    },
    getSearch: function () {
      var e = this.query;
      return e ? "?" + e : "";
    },
    setSearch: function (e) {
      "" === (e = M2(e))
        ? (this.query = null)
        : ("?" === J2(e, 0) && (e = o4(e, 1)),
          (this.query = ""),
          this.parse(e, Q4)),
        this.searchParams.update();
    },
    getSearchParams: function () {
      return this.searchParams.facade;
    },
    getHash: function () {
      var e = this.fragment;
      return e ? "#" + e : "";
    },
    setHash: function (e) {
      "" !== (e = M2(e))
        ? ("#" === J2(e, 0) && (e = o4(e, 1)),
          (this.fragment = ""),
          this.parse(e, Z4))
        : (this.fragment = null);
    },
    update: function () {
      this.query = this.searchParams.serialize() || null;
    },
  };
  var t6 = function (e) {
      var t = I2(this, r6),
        r = N2(arguments.length, 1) > 1 ? arguments[1] : void 0,
        n = z2(t, new e6(e, !1, r));
      x2 ||
        ((t.href = n.serialize()),
        (t.origin = n.getOrigin()),
        (t.protocol = n.getProtocol()),
        (t.username = n.getUsername()),
        (t.password = n.getPassword()),
        (t.host = n.getHost()),
        (t.hostname = n.getHostname()),
        (t.port = n.getPort()),
        (t.pathname = n.getPathname()),
        (t.search = n.getSearch()),
        (t.searchParams = n.getSearchParams()),
        (t.hash = n.getHash()));
    },
    r6 = t6.prototype,
    n6 = function (e, t) {
      return {
        get: function () {
          return H2(this)[e]();
        },
        set:
          t &&
          function (e) {
            return H2(this)[t](e);
          },
        configurable: !0,
        enumerable: !0,
      };
    };
  if (
    (x2 &&
      (R2(r6, "href", n6("serialize", "setHref")),
      R2(r6, "origin", n6("getOrigin")),
      R2(r6, "protocol", n6("getProtocol", "setProtocol")),
      R2(r6, "username", n6("getUsername", "setUsername")),
      R2(r6, "password", n6("getPassword", "setPassword")),
      R2(r6, "host", n6("getHost", "setHost")),
      R2(r6, "hostname", n6("getHostname", "setHostname")),
      R2(r6, "port", n6("getPort", "setPort")),
      R2(r6, "pathname", n6("getPathname", "setPathname")),
      R2(r6, "search", n6("getSearch", "setSearch")),
      R2(r6, "searchParams", n6("getSearchParams")),
      R2(r6, "hash", n6("getHash", "setHash"))),
    T2(
      r6,
      "toJSON",
      function () {
        return H2(this).serialize();
      },
      { enumerable: !0 }
    ),
    T2(
      r6,
      "toString",
      function () {
        return H2(this).serialize();
      },
      { enumerable: !0 }
    ),
    V2)
  ) {
    var i6 = V2.createObjectURL,
      o6 = V2.revokeObjectURL;
    i6 && T2(t6, "createObjectURL", O2(i6, V2)),
      o6 && T2(t6, "revokeObjectURL", O2(o6, V2));
  }
  D2(t6, "URL"),
    E2({ global: !0, constructor: !0, forced: !S2, sham: !x2 }, { URL: t6 });
  var a6 = _i,
    u6 = P,
    c6 = KP,
    s6 = Hi,
    f6 = D0,
    l6 = ye("URL"),
    h6 =
      f6 &&
      u6(function () {
        l6.canParse();
      }),
    p6 = u6(function () {
      return 1 !== l6.canParse.length;
    });
  a6(
    { target: "URL", stat: !0, forced: !h6 || p6 },
    {
      canParse: function (e) {
        var t = c6(arguments.length, 1),
          r = s6(e),
          n = t < 2 || void 0 === arguments[1] ? void 0 : s6(arguments[1]);
        try {
          return !!new l6(r, n);
        } catch ($7) {
          return !1;
        }
      },
    }
  );
  var d6 = _i,
    v6 = KP,
    g6 = Hi,
    y6 = D0,
    m6 = ye("URL");
  d6(
    { target: "URL", stat: !0, forced: !y6 },
    {
      parse: function (e) {
        var t = v6(arguments.length, 1),
          r = g6(e),
          n = t < 2 || void 0 === arguments[1] ? void 0 : g6(arguments[1]);
        try {
          return new m6(r, n);
        } catch ($7) {
          return null;
        }
      },
    }
  );
  var b6 = M;
  _i(
    { target: "URL", proto: !0, enumerable: !0 },
    {
      toJSON: function () {
        return b6(URL.prototype.toString, this);
      },
    }
  );
  var w6 = kn,
    E6 = Y,
    x6 = Hi,
    S6 = KP,
    A6 = URLSearchParams,
    O6 = A6.prototype,
    k6 = E6(O6.append),
    T6 = E6(O6.delete),
    R6 = E6(O6.forEach),
    I6 = E6([].push),
    _6 = new A6("a=1&a=2&b=3");
  _6.delete("a", 1),
    _6.delete("b", void 0),
    _6 + "" != "a=2" &&
      w6(
        O6,
        "delete",
        function (e) {
          var t = arguments.length,
            r = t < 2 ? void 0 : arguments[1];
          if (t && void 0 === r) return T6(this, e);
          var n = [];
          R6(this, function (e, t) {
            I6(n, { key: t, value: e });
          }),
            S6(t, 1);
          for (
            var i, o = x6(e), a = x6(r), u = 0, c = 0, s = !1, f = n.length;
            u < f;

          )
            (i = n[u++]), s || i.key === o ? ((s = !0), T6(this, i.key)) : c++;
          for (; c < f; )
            ((i = n[c++]).key === o && i.value === a) ||
              k6(this, i.key, i.value);
        },
        { enumerable: !0, unsafe: !0 }
      );
  var P6 = kn,
    F6 = Y,
    j6 = Hi,
    C6 = KP,
    L6 = URLSearchParams,
    M6 = L6.prototype,
    D6 = F6(M6.getAll),
    N6 = F6(M6.has),
    U6 = new L6("a=1");
  (!U6.has("a", 2) && U6.has("a", void 0)) ||
    P6(
      M6,
      "has",
      function (e) {
        var t = arguments.length,
          r = t < 2 ? void 0 : arguments[1];
        if (t && void 0 === r) return N6(this, e);
        var n = D6(this, e);
        C6(t, 1);
        for (var i = j6(r), o = 0; o < n.length; ) if (n[o++] === i) return !0;
        return !1;
      },
      { enumerable: !0, unsafe: !0 }
    );
  var B6 = F,
    z6 = Y,
    H6 = Oo,
    W6 = URLSearchParams.prototype,
    q6 = z6(W6.forEach);
  B6 &&
    !("size" in W6) &&
    H6(W6, "size", {
      get: function () {
        var e = 0;
        return (
          q6(this, function () {
            e++;
          }),
          e
        );
      },
      configurable: !0,
      enumerable: !0,
    });
  !(function (e) {
    var t = (function (e) {
      var t,
        r = Object.prototype,
        n = r.hasOwnProperty,
        i =
          Object.defineProperty ||
          function (e, t, r) {
            e[t] = r.value;
          },
        o = "function" == typeof Symbol ? Symbol : {},
        a = o.iterator || "@@iterator",
        u = o.asyncIterator || "@@asyncIterator",
        c = o.toStringTag || "@@toStringTag";
      function s(e, t, r) {
        return (
          Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          }),
          e[t]
        );
      }
      try {
        s({}, "");
      } catch (j) {
        s = function (e, t, r) {
          return (e[t] = r);
        };
      }
      function l(e, t, r, n) {
        var o = t && t.prototype instanceof m ? t : m,
          a = Object.create(o.prototype),
          u = new P(n || []);
        return i(a, "_invoke", { value: T(e, r, u) }), a;
      }
      function h(e, t, r) {
        try {
          return { type: "normal", arg: e.call(t, r) };
        } catch (j) {
          return { type: "throw", arg: j };
        }
      }
      e.wrap = l;
      var p = "suspendedStart",
        d = "suspendedYield",
        v = "executing",
        g = "completed",
        y = {};
      function m() {}
      function b() {}
      function w() {}
      var E = {};
      s(E, a, function () {
        return this;
      });
      var x = Object.getPrototypeOf,
        S = x && x(x(F([])));
      S && S !== r && n.call(S, a) && (E = S);
      var A = (w.prototype = m.prototype = Object.create(E));
      function O(e) {
        ["next", "throw", "return"].forEach(function (t) {
          s(e, t, function (e) {
            return this._invoke(t, e);
          });
        });
      }
      function k(e, t) {
        function r(i, o, a, u) {
          var c = h(e[i], e, o);
          if ("throw" !== c.type) {
            var s = c.arg,
              l = s.value;
            return l && "object" === f(l) && n.call(l, "__await")
              ? t.resolve(l.__await).then(
                  function (e) {
                    r("next", e, a, u);
                  },
                  function (e) {
                    r("throw", e, a, u);
                  }
                )
              : t.resolve(l).then(
                  function (e) {
                    (s.value = e), a(s);
                  },
                  function (e) {
                    return r("throw", e, a, u);
                  }
                );
          }
          u(c.arg);
        }
        var o;
        i(this, "_invoke", {
          value: function (e, n) {
            function i() {
              return new t(function (t, i) {
                r(e, n, t, i);
              });
            }
            return (o = o ? o.then(i, i) : i());
          },
        });
      }
      function T(e, r, n) {
        var i = p;
        return function (o, a) {
          if (i === v) throw new Error("Generator is already running");
          if (i === g) {
            if ("throw" === o) throw a;
            return { value: t, done: !0 };
          }
          for (n.method = o, n.arg = a; ; ) {
            var u = n.delegate;
            if (u) {
              var c = R(u, n);
              if (c) {
                if (c === y) continue;
                return c;
              }
            }
            if ("next" === n.method) n.sent = n._sent = n.arg;
            else if ("throw" === n.method) {
              if (i === p) throw ((i = g), n.arg);
              n.dispatchException(n.arg);
            } else "return" === n.method && n.abrupt("return", n.arg);
            i = v;
            var s = h(e, r, n);
            if ("normal" === s.type) {
              if (((i = n.done ? g : d), s.arg === y)) continue;
              return { value: s.arg, done: n.done };
            }
            "throw" === s.type &&
              ((i = g), (n.method = "throw"), (n.arg = s.arg));
          }
        };
      }
      function R(e, r) {
        var n = r.method,
          i = e.iterator[n];
        if (i === t)
          return (
            (r.delegate = null),
            ("throw" === n &&
              e.iterator.return &&
              ((r.method = "return"),
              (r.arg = t),
              R(e, r),
              "throw" === r.method)) ||
              ("return" !== n &&
                ((r.method = "throw"),
                (r.arg = new TypeError(
                  "The iterator does not provide a '" + n + "' method"
                )))),
            y
          );
        var o = h(i, e.iterator, r.arg);
        if ("throw" === o.type)
          return (r.method = "throw"), (r.arg = o.arg), (r.delegate = null), y;
        var a = o.arg;
        return a
          ? a.done
            ? ((r[e.resultName] = a.value),
              (r.next = e.nextLoc),
              "return" !== r.method && ((r.method = "next"), (r.arg = t)),
              (r.delegate = null),
              y)
            : a
          : ((r.method = "throw"),
            (r.arg = new TypeError("iterator result is not an object")),
            (r.delegate = null),
            y);
      }
      function I(e) {
        var t = { tryLoc: e[0] };
        1 in e && (t.catchLoc = e[1]),
          2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
          this.tryEntries.push(t);
      }
      function _(e) {
        var t = e.completion || {};
        (t.type = "normal"), delete t.arg, (e.completion = t);
      }
      function P(e) {
        (this.tryEntries = [{ tryLoc: "root" }]),
          e.forEach(I, this),
          this.reset(!0);
      }
      function F(e) {
        if (null != e) {
          var r = e[a];
          if (r) return r.call(e);
          if ("function" == typeof e.next) return e;
          if (!isNaN(e.length)) {
            var i = -1,
              o = function r() {
                for (; ++i < e.length; )
                  if (n.call(e, i)) return (r.value = e[i]), (r.done = !1), r;
                return (r.value = t), (r.done = !0), r;
              };
            return (o.next = o);
          }
        }
        throw new TypeError(f(e) + " is not iterable");
      }
      return (
        (b.prototype = w),
        i(A, "constructor", { value: w, configurable: !0 }),
        i(w, "constructor", { value: b, configurable: !0 }),
        (b.displayName = s(w, c, "GeneratorFunction")),
        (e.isGeneratorFunction = function (e) {
          var t = "function" == typeof e && e.constructor;
          return (
            !!t &&
            (t === b || "GeneratorFunction" === (t.displayName || t.name))
          );
        }),
        (e.mark = function (e) {
          return (
            Object.setPrototypeOf
              ? Object.setPrototypeOf(e, w)
              : ((e.__proto__ = w), s(e, c, "GeneratorFunction")),
            (e.prototype = Object.create(A)),
            e
          );
        }),
        (e.awrap = function (e) {
          return { __await: e };
        }),
        O(k.prototype),
        s(k.prototype, u, function () {
          return this;
        }),
        (e.AsyncIterator = k),
        (e.async = function (t, r, n, i, o) {
          void 0 === o && (o = Promise);
          var a = new k(l(t, r, n, i), o);
          return e.isGeneratorFunction(r)
            ? a
            : a.next().then(function (e) {
                return e.done ? e.value : a.next();
              });
        }),
        O(A),
        s(A, c, "Generator"),
        s(A, a, function () {
          return this;
        }),
        s(A, "toString", function () {
          return "[object Generator]";
        }),
        (e.keys = function (e) {
          var t = Object(e),
            r = [];
          for (var n in t) r.push(n);
          return (
            r.reverse(),
            function e() {
              for (; r.length; ) {
                var n = r.pop();
                if (n in t) return (e.value = n), (e.done = !1), e;
              }
              return (e.done = !0), e;
            }
          );
        }),
        (e.values = F),
        (P.prototype = {
          constructor: P,
          reset: function (e) {
            if (
              ((this.prev = 0),
              (this.next = 0),
              (this.sent = this._sent = t),
              (this.done = !1),
              (this.delegate = null),
              (this.method = "next"),
              (this.arg = t),
              this.tryEntries.forEach(_),
              !e)
            )
              for (var r in this)
                "t" === r.charAt(0) &&
                  n.call(this, r) &&
                  !isNaN(+r.slice(1)) &&
                  (this[r] = t);
          },
          stop: function () {
            this.done = !0;
            var e = this.tryEntries[0].completion;
            if ("throw" === e.type) throw e.arg;
            return this.rval;
          },
          dispatchException: function (e) {
            if (this.done) throw e;
            var r = this;
            function i(n, i) {
              return (
                (u.type = "throw"),
                (u.arg = e),
                (r.next = n),
                i && ((r.method = "next"), (r.arg = t)),
                !!i
              );
            }
            for (var o = this.tryEntries.length - 1; o >= 0; --o) {
              var a = this.tryEntries[o],
                u = a.completion;
              if ("root" === a.tryLoc) return i("end");
              if (a.tryLoc <= this.prev) {
                var c = n.call(a, "catchLoc"),
                  s = n.call(a, "finallyLoc");
                if (c && s) {
                  if (this.prev < a.catchLoc) return i(a.catchLoc, !0);
                  if (this.prev < a.finallyLoc) return i(a.finallyLoc);
                } else if (c) {
                  if (this.prev < a.catchLoc) return i(a.catchLoc, !0);
                } else {
                  if (!s)
                    throw new Error("try statement without catch or finally");
                  if (this.prev < a.finallyLoc) return i(a.finallyLoc);
                }
              }
            }
          },
          abrupt: function (e, t) {
            for (var r = this.tryEntries.length - 1; r >= 0; --r) {
              var i = this.tryEntries[r];
              if (
                i.tryLoc <= this.prev &&
                n.call(i, "finallyLoc") &&
                this.prev < i.finallyLoc
              ) {
                var o = i;
                break;
              }
            }
            o &&
              ("break" === e || "continue" === e) &&
              o.tryLoc <= t &&
              t <= o.finallyLoc &&
              (o = null);
            var a = o ? o.completion : {};
            return (
              (a.type = e),
              (a.arg = t),
              o
                ? ((this.method = "next"), (this.next = o.finallyLoc), y)
                : this.complete(a)
            );
          },
          complete: function (e, t) {
            if ("throw" === e.type) throw e.arg;
            return (
              "break" === e.type || "continue" === e.type
                ? (this.next = e.arg)
                : "return" === e.type
                ? ((this.rval = this.arg = e.arg),
                  (this.method = "return"),
                  (this.next = "end"))
                : "normal" === e.type && t && (this.next = t),
              y
            );
          },
          finish: function (e) {
            for (var t = this.tryEntries.length - 1; t >= 0; --t) {
              var r = this.tryEntries[t];
              if (r.finallyLoc === e)
                return this.complete(r.completion, r.afterLoc), _(r), y;
            }
          },
          catch: function (e) {
            for (var t = this.tryEntries.length - 1; t >= 0; --t) {
              var r = this.tryEntries[t];
              if (r.tryLoc === e) {
                var n = r.completion;
                if ("throw" === n.type) {
                  var i = n.arg;
                  _(r);
                }
                return i;
              }
            }
            throw new Error("illegal catch attempt");
          },
          delegateYield: function (e, r, n) {
            return (
              (this.delegate = { iterator: F(e), resultName: r, nextLoc: n }),
              "next" === this.method && (this.arg = t),
              y
            );
          },
        }),
        e
      );
    })(e.exports);
    try {
      regeneratorRuntime = t;
    } catch (r) {
      "object" ===
      ("undefined" == typeof globalThis ? "undefined" : f(globalThis))
        ? (globalThis.regeneratorRuntime = t)
        : Function("r", "regeneratorRuntime = r")(t);
    }
  })({ exports: {} });
  var V6 = ((e) => (
    (e[(e.INPUT_GENERATION = 1001)] = "INPUT_GENERATION"),
    (e[(e.PRE_SET_GENERATION = 1002)] = "PRE_SET_GENERATION"),
    (e[(e.UPLOAD_WORD = 1003)] = "UPLOAD_WORD"),
    (e[(e.UPLOAD_MIND = 1004)] = "UPLOAD_MIND"),
    (e[(e.UPLOAD_FREEMIND = 1005)] = "UPLOAD_FREEMIND"),
    (e[(e.UPLOAD_MARKDOWN = 1006)] = "UPLOAD_MARKDOWN"),
    (e[(e.CREATE_OUTLINE = 1007)] = "CREATE_OUTLINE"),
    (e[(e.UPLOAD_PDF = 1008)] = "UPLOAD_PDF"),
    (e[(e.UPLOAD_TXT = 1009)] = "UPLOAD_TXT"),
    (e[(e.FREE_INPUT = 1010)] = "FREE_INPUT"),
    (e[(e.UPLOAD_REFER = 1011)] = "UPLOAD_REFER"),
    (e[(e.TOGGLE_OUTLINE = 1021)] = "TOGGLE_OUTLINE"),
    (e[(e.DOWNLOAD_OUTLINE = 1022)] = "DOWNLOAD_OUTLINE"),
    (e[(e.DOWNLOAD_PNG = 1023)] = "DOWNLOAD_PNG"),
    (e[(e.SELECT_TEMPLATE = 1024)] = "SELECT_TEMPLATE"),
    (e[(e.GENERATE_PPT = 1025)] = "GENERATE_PPT"),
    (e[(e.GO_EDITOR = 1026)] = "GO_EDITOR"),
    (e[(e.DOWNLOAD = 1027)] = "DOWNLOAD"),
    (e[(e.DOWNLOAD_PPT = 1028)] = "DOWNLOAD_PPT"),
    (e[(e.DOWNLOAD_PUZZLE = 1029)] = "DOWNLOAD_PUZZLE"),
    e
  ))(V6 || {});
  function G6(e) {
    if (e) throw e;
  }
  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */ const $6 = n(function (e) {
    return (
      null != e &&
      null != e.constructor &&
      "function" == typeof e.constructor.isBuffer &&
      e.constructor.isBuffer(e)
    );
  });
  var Y6 = Object.prototype.hasOwnProperty,
    K6 = Object.prototype.toString,
    J6 = Object.defineProperty,
    X6 = Object.getOwnPropertyDescriptor,
    Q6 = function (e) {
      return "function" == typeof Array.isArray
        ? Array.isArray(e)
        : "[object Array]" === K6.call(e);
    },
    Z6 = function (e) {
      if (!e || "[object Object]" !== K6.call(e)) return !1;
      var t,
        r = Y6.call(e, "constructor"),
        n =
          e.constructor &&
          e.constructor.prototype &&
          Y6.call(e.constructor.prototype, "isPrototypeOf");
      if (e.constructor && !r && !n) return !1;
      for (t in e);
      return void 0 === t || Y6.call(e, t);
    },
    e5 = function (e, t) {
      J6 && "__proto__" === t.name
        ? J6(e, t.name, {
            enumerable: !0,
            configurable: !0,
            value: t.newValue,
            writable: !0,
          })
        : (e[t.name] = t.newValue);
    },
    t5 = function (e, t) {
      if ("__proto__" === t) {
        if (!Y6.call(e, t)) return;
        if (X6) return X6(e, t).value;
      }
      return e[t];
    },
    r5 = function e() {
      var t,
        r,
        n,
        i,
        o,
        a,
        u = arguments[0],
        c = 1,
        s = arguments.length,
        l = !1;
      for (
        "boolean" == typeof u && ((l = u), (u = arguments[1] || {}), (c = 2)),
          (null == u || ("object" !== f(u) && "function" != typeof u)) &&
            (u = {});
        c < s;
        ++c
      )
        if (null != (t = arguments[c]))
          for (r in t)
            (n = t5(u, r)),
              u !== (i = t5(t, r)) &&
                (l && i && (Z6(i) || (o = Q6(i)))
                  ? (o
                      ? ((o = !1), (a = n && Q6(n) ? n : []))
                      : (a = n && Z6(n) ? n : {}),
                    e5(u, { name: r, newValue: e(l, a, i) }))
                  : void 0 !== i && e5(u, { name: r, newValue: i }));
      return u;
    };
  const n5 = n(r5);
  function i5(e) {
    if ("object" !== f(e) || null === e) return !1;
    var t = Object.getPrototypeOf(e);
    return !(
      (null !== t &&
        t !== Object.prototype &&
        null !== Object.getPrototypeOf(t)) ||
      Symbol.toStringTag in e ||
      Symbol.iterator in e
    );
  }
  function o5() {
    var e = [],
      t = {
        run: function () {
          for (var t = arguments.length, r = new Array(t), n = 0; n < t; n++)
            r[n] = arguments[n];
          var i = -1,
            o = r.pop();
          if ("function" != typeof o)
            throw new TypeError("Expected function as last argument, not " + o);
          (function t(n) {
            var a = e[++i],
              u = -1;
            if (n) o(n);
            else {
              for (
                var c = arguments.length,
                  s = new Array(c > 1 ? c - 1 : 0),
                  f = 1;
                f < c;
                f++
              )
                s[f - 1] = arguments[f];
              for (; ++u < r.length; )
                (null !== s[u] && void 0 !== s[u]) || (s[u] = r[u]);
              (r = s),
                a
                  ? (function (e, t) {
                      var r;
                      return i;
                      function i() {
                        for (
                          var t = arguments.length, i = new Array(t), u = 0;
                          u < t;
                          u++
                        )
                          i[u] = arguments[u];
                        var c,
                          s = e.length > i.length;
                        s && i.push(o);
                        try {
                          c = e.apply(this, i);
                        } catch (n) {
                          if (s && r) throw n;
                          return o(n);
                        }
                        s ||
                          (c && c.then && "function" == typeof c.then
                            ? c.then(a, o)
                            : c instanceof Error
                            ? o(c)
                            : a(c));
                      }
                      function o(e) {
                        if (!r) {
                          r = !0;
                          for (
                            var n = arguments.length,
                              i = new Array(n > 1 ? n - 1 : 0),
                              o = 1;
                            o < n;
                            o++
                          )
                            i[o - 1] = arguments[o];
                          t.apply(void 0, [e].concat(i));
                        }
                      }
                      function a(e) {
                        o(null, e);
                      }
                    })(a, t).apply(void 0, s)
                  : o.apply(void 0, [null].concat(s));
            }
          }).apply(void 0, [null].concat(x(r)));
        },
        use: function (r) {
          if ("function" != typeof r)
            throw new TypeError(
              "Expected `middelware` to be a function, not " + r
            );
          return e.push(r), t;
        },
      };
    return t;
  }
  function a5(e) {
    return e && "object" === f(e)
      ? "position" in e || "type" in e
        ? c5(e.position)
        : "start" in e || "end" in e
        ? c5(e)
        : "line" in e || "column" in e
        ? u5(e)
        : ""
      : "";
  }
  function u5(e) {
    return s5(e && e.line) + ":" + s5(e && e.column);
  }
  function c5(e) {
    return u5(e && e.start) + "-" + u5(e && e.end);
  }
  function s5(e) {
    return e && "number" == typeof e ? e : 1;
  }
  var f5 = (function (e) {
    function t(e, r, n) {
      var o;
      p(this, t);
      var a = [null, null],
        u = {
          start: { line: null, column: null },
          end: { line: null, column: null },
        };
      if (
        ((o = i(this, t)),
        "string" == typeof r && ((n = r), (r = void 0)),
        "string" == typeof n)
      ) {
        var c = n.indexOf(":");
        -1 === c
          ? (a[1] = n)
          : ((a[0] = n.slice(0, c)), (a[1] = n.slice(c + 1)));
      }
      return (
        r &&
          ("type" in r || "position" in r
            ? r.position && (u = r.position)
            : "start" in r || "end" in r
            ? (u = r)
            : ("line" in r || "column" in r) && (u.start = r)),
        (o.name = a5(r) || "1:1"),
        (o.message = "object" === f(e) ? e.message : e),
        (o.stack = ""),
        "object" === f(e) && e.stack && (o.stack = e.stack),
        (o.reason = o.message),
        o.fatal,
        (o.line = u.start.line),
        (o.column = u.start.column),
        (o.position = u),
        (o.source = a[0]),
        (o.ruleId = a[1]),
        o.file,
        o.actual,
        o.expected,
        o.url,
        o.note,
        o
      );
    }
    return (
      (function (e, t) {
        if ("function" != typeof t && null !== t)
          throw new TypeError(
            "Super expression must either be null or a function"
          );
        (e.prototype = Object.create(t && t.prototype, {
          constructor: { value: e, writable: !0, configurable: !0 },
        })),
          Object.defineProperty(e, "prototype", { writable: !1 }),
          t && m(e, t);
      })(t, e),
      v(t)
    );
  })(b(Error));
  (f5.prototype.file = ""),
    (f5.prototype.name = ""),
    (f5.prototype.reason = ""),
    (f5.prototype.message = ""),
    (f5.prototype.stack = ""),
    (f5.prototype.fatal = null),
    (f5.prototype.column = null),
    (f5.prototype.line = null),
    (f5.prototype.source = null),
    (f5.prototype.ruleId = null),
    (f5.prototype.position = null);
  var l5 = {
    basename: function (e, t) {
      if (void 0 !== t && "string" != typeof t)
        throw new TypeError('"ext" argument must be a string');
      h5(e);
      var r,
        n = 0,
        i = -1,
        o = e.length;
      if (void 0 === t || 0 === t.length || t.length > e.length) {
        for (; o--; )
          if (47 === e.charCodeAt(o)) {
            if (r) {
              n = o + 1;
              break;
            }
          } else i < 0 && ((r = !0), (i = o + 1));
        return i < 0 ? "" : e.slice(n, i);
      }
      if (t === e) return "";
      var a = -1,
        u = t.length - 1;
      for (; o--; )
        if (47 === e.charCodeAt(o)) {
          if (r) {
            n = o + 1;
            break;
          }
        } else
          a < 0 && ((r = !0), (a = o + 1)),
            u > -1 &&
              (e.charCodeAt(o) === t.charCodeAt(u--)
                ? u < 0 && (i = o)
                : ((u = -1), (i = a)));
      n === i ? (i = a) : i < 0 && (i = e.length);
      return e.slice(n, i);
    },
    dirname: function (e) {
      if ((h5(e), 0 === e.length)) return ".";
      var t,
        r = -1,
        n = e.length;
      for (; --n; )
        if (47 === e.charCodeAt(n)) {
          if (t) {
            r = n;
            break;
          }
        } else t || (t = !0);
      return r < 0
        ? 47 === e.charCodeAt(0)
          ? "/"
          : "."
        : 1 === r && 47 === e.charCodeAt(0)
        ? "//"
        : e.slice(0, r);
    },
    extname: function (e) {
      h5(e);
      var t,
        r = e.length,
        n = -1,
        i = 0,
        o = -1,
        a = 0;
      for (; r--; ) {
        var u = e.charCodeAt(r);
        if (47 !== u)
          n < 0 && ((t = !0), (n = r + 1)),
            46 === u
              ? o < 0
                ? (o = r)
                : 1 !== a && (a = 1)
              : o > -1 && (a = -1);
        else if (t) {
          i = r + 1;
          break;
        }
      }
      if (o < 0 || n < 0 || 0 === a || (1 === a && o === n - 1 && o === i + 1))
        return "";
      return e.slice(o, n);
    },
    join: function () {
      for (
        var e, t = -1, r = arguments.length, n = new Array(r), i = 0;
        i < r;
        i++
      )
        n[i] = arguments[i];
      for (; ++t < n.length; )
        h5(n[t]), n[t] && (e = void 0 === e ? n[t] : e + "/" + n[t]);
      return void 0 === e
        ? "."
        : (function (e) {
            h5(e);
            var t = 47 === e.charCodeAt(0),
              r = (function (e, t) {
                var r,
                  n,
                  i = "",
                  o = 0,
                  a = -1,
                  u = 0,
                  c = -1;
                for (; ++c <= e.length; ) {
                  if (c < e.length) r = e.charCodeAt(c);
                  else {
                    if (47 === r) break;
                    r = 47;
                  }
                  if (47 === r) {
                    if (a === c - 1 || 1 === u);
                    else if (a !== c - 1 && 2 === u) {
                      if (
                        i.length < 2 ||
                        2 !== o ||
                        46 !== i.charCodeAt(i.length - 1) ||
                        46 !== i.charCodeAt(i.length - 2)
                      )
                        if (i.length > 2) {
                          if ((n = i.lastIndexOf("/")) !== i.length - 1) {
                            n < 0
                              ? ((i = ""), (o = 0))
                              : (o =
                                  (i = i.slice(0, n)).length -
                                  1 -
                                  i.lastIndexOf("/")),
                              (a = c),
                              (u = 0);
                            continue;
                          }
                        } else if (i.length > 0) {
                          (i = ""), (o = 0), (a = c), (u = 0);
                          continue;
                        }
                      t && ((i = i.length > 0 ? i + "/.." : ".."), (o = 2));
                    } else
                      i.length > 0
                        ? (i += "/" + e.slice(a + 1, c))
                        : (i = e.slice(a + 1, c)),
                        (o = c - a - 1);
                    (a = c), (u = 0);
                  } else 46 === r && u > -1 ? u++ : (u = -1);
                }
                return i;
              })(e, !t);
            0 !== r.length || t || (r = ".");
            r.length > 0 && 47 === e.charCodeAt(e.length - 1) && (r += "/");
            return t ? "/" + r : r;
          })(e);
    },
    sep: "/",
  };
  function h5(e) {
    if ("string" != typeof e)
      throw new TypeError(
        "Path must be a string. Received " + JSON.stringify(e)
      );
  }
  var p5 = {
    cwd: function () {
      return "/";
    },
  };
  function d5(e) {
    return null !== e && "object" === f(e) && e.href && e.origin;
  }
  function v5(e) {
    if ("string" == typeof e) e = new URL(e);
    else if (!d5(e)) {
      var t = new TypeError(
        'The "path" argument must be of type string or an instance of URL. Received `' +
          e +
          "`"
      );
      throw ((t.code = "ERR_INVALID_ARG_TYPE"), t);
    }
    if ("file:" !== e.protocol) {
      var r = new TypeError("The URL must be of scheme file");
      throw ((r.code = "ERR_INVALID_URL_SCHEME"), r);
    }
    return (function (e) {
      if ("" !== e.hostname) {
        var t = new TypeError(
          'File URL host must be "localhost" or empty on darwin'
        );
        throw ((t.code = "ERR_INVALID_FILE_URL_HOST"), t);
      }
      var r = e.pathname,
        n = -1;
      for (; ++n < r.length; )
        if (37 === r.charCodeAt(n) && 50 === r.charCodeAt(n + 1)) {
          var i = r.charCodeAt(n + 2);
          if (70 === i || 102 === i) {
            var o = new TypeError(
              "File URL path must not include encoded / characters"
            );
            throw ((o.code = "ERR_INVALID_FILE_URL_PATH"), o);
          }
        }
      return decodeURIComponent(r);
    })(e);
  }
  var g5 = ["history", "path", "basename", "stem", "extname", "dirname"],
    y5 = (function () {
      return v(
        function e(t) {
          var r;
          p(this, e),
            (r = t
              ? "string" == typeof t ||
                (function (e) {
                  return $6(e);
                })(t)
                ? { value: t }
                : d5(t)
                ? { path: t }
                : t
              : {}),
            (this.data = {}),
            (this.messages = []),
            (this.history = []),
            (this.cwd = p5.cwd()),
            this.value,
            this.stored,
            this.result,
            this.map;
          for (var n, i = -1; ++i < g5.length; ) {
            var o = g5[i];
            o in r &&
              void 0 !== r[o] &&
              null !== r[o] &&
              (this[o] = "history" === o ? x(r[o]) : r[o]);
          }
          for (n in r) g5.includes(n) || (this[n] = r[n]);
        },
        [
          {
            key: "path",
            get: function () {
              return this.history[this.history.length - 1];
            },
            set: function (e) {
              d5(e) && (e = v5(e)),
                b5(e, "path"),
                this.path !== e && this.history.push(e);
            },
          },
          {
            key: "dirname",
            get: function () {
              return "string" == typeof this.path
                ? l5.dirname(this.path)
                : void 0;
            },
            set: function (e) {
              w5(this.basename, "dirname"),
                (this.path = l5.join(e || "", this.basename));
            },
          },
          {
            key: "basename",
            get: function () {
              return "string" == typeof this.path
                ? l5.basename(this.path)
                : void 0;
            },
            set: function (e) {
              b5(e, "basename"),
                m5(e, "basename"),
                (this.path = l5.join(this.dirname || "", e));
            },
          },
          {
            key: "extname",
            get: function () {
              return "string" == typeof this.path
                ? l5.extname(this.path)
                : void 0;
            },
            set: function (e) {
              if ((m5(e, "extname"), w5(this.dirname, "extname"), e)) {
                if (46 !== e.charCodeAt(0))
                  throw new Error("`extname` must start with `.`");
                if (e.includes(".", 1))
                  throw new Error("`extname` cannot contain multiple dots");
              }
              this.path = l5.join(this.dirname, this.stem + (e || ""));
            },
          },
          {
            key: "stem",
            get: function () {
              return "string" == typeof this.path
                ? l5.basename(this.path, this.extname)
                : void 0;
            },
            set: function (e) {
              b5(e, "stem"),
                m5(e, "stem"),
                (this.path = l5.join(
                  this.dirname || "",
                  e + (this.extname || "")
                ));
            },
          },
          {
            key: "toString",
            value: function (e) {
              return (this.value || "").toString(e || void 0);
            },
          },
          {
            key: "message",
            value: function (e, t, r) {
              var n = new f5(e, t, r);
              return (
                this.path &&
                  ((n.name = this.path + ":" + n.name), (n.file = this.path)),
                (n.fatal = !1),
                this.messages.push(n),
                n
              );
            },
          },
          {
            key: "info",
            value: function (e, t, r) {
              var n = this.message(e, t, r);
              return (n.fatal = null), n;
            },
          },
          {
            key: "fail",
            value: function (e, t, r) {
              var n = this.message(e, t, r);
              throw ((n.fatal = !0), n);
            },
          },
        ]
      );
    })();
  function m5(e, t) {
    if (e && e.includes(l5.sep))
      throw new Error(
        "`" + t + "` cannot be a path: did not expect `" + l5.sep + "`"
      );
  }
  function b5(e, t) {
    if (!e) throw new Error("`" + t + "` cannot be empty");
  }
  function w5(e, t) {
    if (!e)
      throw new Error("Setting `" + t + "` requires `path` to be set too");
  }
  var E5 = (function e() {
      var t,
        r = o5(),
        n = [],
        i = {},
        o = -1;
      return (
        (a.data = function (e, r) {
          if ("string" == typeof e)
            return 2 === arguments.length
              ? (k5("data", t), (i[e] = r), a)
              : (x5.call(i, e) && i[e]) || null;
          if (e) return k5("data", t), (i = e), a;
          return i;
        }),
        (a.Parser = void 0),
        (a.Compiler = void 0),
        (a.freeze = function () {
          if (t) return a;
          for (; ++o < n.length; ) {
            var e = E(n[o]),
              i = e[0],
              u = e.slice(1);
            if (!1 !== u[0]) {
              !0 === u[0] && (u[0] = void 0);
              var c = i.call.apply(i, [a].concat(x(u)));
              "function" == typeof c && r.use(c);
            }
          }
          return (t = !0), (o = Number.POSITIVE_INFINITY), a;
        }),
        (a.attachers = n),
        (a.use = function (e) {
          for (
            var r = arguments.length, o = new Array(r > 1 ? r - 1 : 0), u = 1;
            u < r;
            u++
          )
            o[u - 1] = arguments[u];
          var c;
          if ((k5("use", t), null == e));
          else if ("function" == typeof e) p.apply(void 0, [e].concat(o));
          else {
            if ("object" !== f(e))
              throw new TypeError("Expected usable value, not `" + e + "`");
            Array.isArray(e) ? h(e) : l(e);
          }
          c && (i.settings = Object.assign(i.settings || {}, c));
          return a;
          function s(e) {
            if ("function" == typeof e) p(e);
            else {
              if ("object" !== f(e))
                throw new TypeError("Expected usable value, not `" + e + "`");
              if (Array.isArray(e)) {
                var t = E(e),
                  r = t[0],
                  n = t.slice(1);
                p.apply(void 0, [r].concat(x(n)));
              } else l(e);
            }
          }
          function l(e) {
            h(e.plugins),
              e.settings && (c = Object.assign(c || {}, e.settings));
          }
          function h(e) {
            var t = -1;
            if (null == e);
            else {
              if (!Array.isArray(e))
                throw new TypeError(
                  "Expected a list of plugins, not `" + e + "`"
                );
              for (; ++t < e.length; ) {
                s(e[t]);
              }
            }
          }
          function p(e, t) {
            for (var r, i = -1; ++i < n.length; )
              if (n[i][0] === e) {
                r = n[i];
                break;
              }
            r
              ? (i5(r[1]) && i5(t) && (t = n5(!0, r[1], t)), (r[1] = t))
              : n.push(Array.prototype.slice.call(arguments));
          }
        }),
        (a.parse = function (e) {
          a.freeze();
          var t = I5(e),
            r = a.Parser;
          if ((A5("parse", r), S5(r, "parse")))
            return new r(String(t), t).parse();
          return r(String(t), t);
        }),
        (a.stringify = function (e, t) {
          a.freeze();
          var r = I5(t),
            n = a.Compiler;
          if ((O5("stringify", n), T5(e), S5(n, "compile")))
            return new n(e, r).compile();
          return n(e, r);
        }),
        (a.run = function (e, t, n) {
          T5(e),
            a.freeze(),
            n || "function" != typeof t || ((n = t), (t = void 0));
          if (!n) return new Promise(i);
          function i(i, o) {
            function a(t, r, a) {
              (r = r || e), t ? o(t) : i ? i(r) : n(null, r, a);
            }
            r.run(e, I5(t), a);
          }
          i(null, n);
        }),
        (a.runSync = function (e, t) {
          var r, n;
          return a.run(e, t, i), R5("runSync", "run", n), r;
          function i(e, t) {
            G6(e), (r = t), (n = !0);
          }
        }),
        (a.process = function (e, t) {
          if (
            (a.freeze(), A5("process", a.Parser), O5("process", a.Compiler), !t)
          )
            return new Promise(r);
          function r(r, n) {
            var i = I5(e);
            function o(e, i) {
              e || !i ? n(e) : r ? r(i) : t(null, i);
            }
            a.run(a.parse(i), i, function (e, t, r) {
              if (!e && t && r) {
                var n = a.stringify(t, r);
                null == n ||
                  ("string" == typeof (i = n) || $6(i)
                    ? (r.value = n)
                    : (r.result = n)),
                  o(e, r);
              } else o(e);
              var i;
            });
          }
          r(null, t);
        }),
        (a.processSync = function (e) {
          var t;
          a.freeze(),
            A5("processSync", a.Parser),
            O5("processSync", a.Compiler);
          var r = I5(e);
          return a.process(r, n), R5("processSync", "process", t), r;
          function n(e) {
            (t = !0), G6(e);
          }
        }),
        a
      );
      function a() {
        for (var t = e(), r = -1; ++r < n.length; ) t.use.apply(t, x(n[r]));
        return t.data(n5(!0, {}, i)), t;
      }
    })().freeze(),
    x5 = {}.hasOwnProperty;
  function S5(e, t) {
    return (
      "function" == typeof e &&
      e.prototype &&
      ((function (e) {
        var t;
        for (t in e) if (x5.call(e, t)) return !0;
        return !1;
      })(e.prototype) ||
        t in e.prototype)
    );
  }
  function A5(e, t) {
    if ("function" != typeof t)
      throw new TypeError("Cannot `" + e + "` without `Parser`");
  }
  function O5(e, t) {
    if ("function" != typeof t)
      throw new TypeError("Cannot `" + e + "` without `Compiler`");
  }
  function k5(e, t) {
    if (t)
      throw new Error(
        "Cannot call `" +
          e +
          "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`."
      );
  }
  function T5(e) {
    if (!i5(e) || "string" != typeof e.type)
      throw new TypeError("Expected node, got `" + e + "`");
  }
  function R5(e, t, r) {
    if (!r)
      throw new Error("`" + e + "` finished async. Use `" + t + "` instead");
  }
  function I5(e) {
    return (function (e) {
      return Boolean(
        e && "object" === f(e) && "message" in e && "messages" in e
      );
    })(e)
      ? e
      : new y5(e);
  }
  var _5 = {};
  function P5(e, t, r) {
    if (
      (function (e) {
        return Boolean(e && "object" === f(e));
      })(e)
    ) {
      if ("value" in e) return "html" !== e.type || r ? e.value : "";
      if (t && "alt" in e && e.alt) return e.alt;
      if ("children" in e) return F5(e.children, t, r);
    }
    return Array.isArray(e) ? F5(e, t, r) : "";
  }
  function F5(e, t, r) {
    for (var n = [], i = -1; ++i < e.length; ) n[i] = P5(e[i], t, r);
    return n.join("");
  }
  function j5(e, t, r, n) {
    var i,
      o = e.length,
      a = 0;
    if (
      ((t = t < 0 ? (-t > o ? 0 : o + t) : t > o ? o : t),
      (r = r > 0 ? r : 0),
      n.length < 1e4)
    )
      (i = Array.from(n)).unshift(t, r), e.splice.apply(e, x(i));
    else
      for (r && e.splice(t, r); a < n.length; )
        (i = n.slice(a, a + 1e4)).unshift(t, 0),
          e.splice.apply(e, x(i)),
          (a += 1e4),
          (t += 1e4);
  }
  function C5(e, t) {
    return e.length > 0 ? (j5(e, e.length, 0, t), e) : t;
  }
  var L5 = {}.hasOwnProperty;
  function M5(e, t) {
    var r;
    for (r in t) {
      var n = (L5.call(e, r) ? e[r] : void 0) || (e[r] = {}),
        i = t[r],
        o = void 0;
      if (i)
        for (o in i) {
          L5.call(n, o) || (n[o] = []);
          var a = i[o];
          D5(n[o], Array.isArray(a) ? a : a ? [a] : []);
        }
    }
  }
  function D5(e, t) {
    for (var r = -1, n = []; ++r < t.length; )
      ("after" === t[r].add ? e : n).push(t[r]);
    j5(e, 0, 0, n);
  }
  var N5 = J5(/[A-Za-z]/),
    U5 = J5(/[\dA-Za-z]/),
    B5 = J5(/[#-'*+\--9=?A-Z^-~]/);
  function z5(e) {
    return null !== e && (e < 32 || 127 === e);
  }
  var H5 = J5(/\d/),
    W5 = J5(/[\dA-Fa-f]/),
    q5 = J5(/[!-/:-@[-`{-~]/);
  function V5(e) {
    return null !== e && e < -2;
  }
  function G5(e) {
    return null !== e && (e < 0 || 32 === e);
  }
  function $5(e) {
    return -2 === e || -1 === e || 32 === e;
  }
  var Y5 = J5(
      /[!-\/:-@\[-`\{-~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]/
    ),
    K5 = J5(/\s/);
  function J5(e) {
    return function (t) {
      return null !== t && e.test(String.fromCharCode(t));
    };
  }
  function X5(e, t, r, n) {
    var i = n ? n - 1 : Number.POSITIVE_INFINITY,
      o = 0;
    return function (n) {
      if ($5(n)) return e.enter(r), a(n);
      return t(n);
    };
    function a(n) {
      return $5(n) && o++ < i ? (e.consume(n), a) : (e.exit(r), t(n));
    }
  }
  var Q5 = {
    tokenize: function (e) {
      var t,
        r = e.attempt(
          this.parser.constructs.contentInitial,
          function (t) {
            if (null === t) return void e.consume(t);
            return (
              e.enter("lineEnding"),
              e.consume(t),
              e.exit("lineEnding"),
              X5(e, r, "linePrefix")
            );
          },
          function (t) {
            return e.enter("paragraph"), n(t);
          }
        );
      return r;
      function n(r) {
        var n = e.enter("chunkText", { contentType: "text", previous: t });
        return t && (t.next = n), (t = n), i(r);
      }
      function i(t) {
        return null === t
          ? (e.exit("chunkText"), e.exit("paragraph"), void e.consume(t))
          : V5(t)
          ? (e.consume(t), e.exit("chunkText"), n)
          : (e.consume(t), i);
      }
    },
  };
  var Z5 = {
      tokenize: function (e) {
        var t,
          r,
          n,
          i = this,
          o = [],
          a = 0;
        return u;
        function u(t) {
          if (a < o.length) {
            var r = o[a];
            return (
              (i.containerState = r[1]), e.attempt(r[0].continuation, c, s)(t)
            );
          }
          return s(t);
        }
        function c(e) {
          if ((a++, i.containerState._closeFlow)) {
            (i.containerState._closeFlow = void 0), t && m();
            for (var r, n = i.events.length, o = n; o--; )
              if (
                "exit" === i.events[o][0] &&
                "chunkFlow" === i.events[o][1].type
              ) {
                r = i.events[o][1].end;
                break;
              }
            y(a);
            for (var c = n; c < i.events.length; )
              (i.events[c][1].end = Object.assign({}, r)), c++;
            return (
              j5(i.events, o + 1, 0, i.events.slice(n)),
              (i.events.length = c),
              s(e)
            );
          }
          return u(e);
        }
        function s(r) {
          if (a === o.length) {
            if (!t) return h(r);
            if (t.currentConstruct && t.currentConstruct.concrete) return d(r);
            i.interrupt = Boolean(
              t.currentConstruct && !t._gfmTableDynamicInterruptHack
            );
          }
          return (i.containerState = {}), e.check(e3, f, l)(r);
        }
        function f(e) {
          return t && m(), y(a), h(e);
        }
        function l(e) {
          return (
            (i.parser.lazy[i.now().line] = a !== o.length),
            (n = i.now().offset),
            d(e)
          );
        }
        function h(t) {
          return (i.containerState = {}), e.attempt(e3, p, d)(t);
        }
        function p(e) {
          return a++, o.push([i.currentConstruct, i.containerState]), h(e);
        }
        function d(n) {
          return null === n
            ? (t && m(), y(0), void e.consume(n))
            : ((t = t || i.parser.flow(i.now())),
              e.enter("chunkFlow", {
                contentType: "flow",
                previous: r,
                _tokenizer: t,
              }),
              v(n));
        }
        function v(t) {
          return null === t
            ? (g(e.exit("chunkFlow"), !0), y(0), void e.consume(t))
            : V5(t)
            ? (e.consume(t),
              g(e.exit("chunkFlow")),
              (a = 0),
              (i.interrupt = void 0),
              u)
            : (e.consume(t), v);
        }
        function g(e, o) {
          var u = i.sliceStream(e);
          if (
            (o && u.push(null),
            (e.previous = r),
            r && (r.next = e),
            (r = e),
            t.defineSkip(e.start),
            t.write(u),
            i.parser.lazy[e.start.line])
          ) {
            for (var c = t.events.length; c--; )
              if (
                t.events[c][1].start.offset < n &&
                (!t.events[c][1].end || t.events[c][1].end.offset > n)
              )
                return;
            for (var s, f, l = i.events.length, h = l; h--; )
              if (
                "exit" === i.events[h][0] &&
                "chunkFlow" === i.events[h][1].type
              ) {
                if (s) {
                  f = i.events[h][1].end;
                  break;
                }
                s = !0;
              }
            for (y(a), c = l; c < i.events.length; )
              (i.events[c][1].end = Object.assign({}, f)), c++;
            j5(i.events, h + 1, 0, i.events.slice(l)), (i.events.length = c);
          }
        }
        function y(t) {
          for (var r = o.length; r-- > t; ) {
            var n = o[r];
            (i.containerState = n[1]), n[0].exit.call(i, e);
          }
          o.length = t;
        }
        function m() {
          t.write([null]),
            (r = void 0),
            (t = void 0),
            (i.containerState._closeFlow = void 0);
        }
      },
    },
    e3 = {
      tokenize: function (e, t, r) {
        return X5(
          e,
          e.attempt(this.parser.constructs.document, t, r),
          "linePrefix",
          this.parser.constructs.disable.null.includes("codeIndented")
            ? void 0
            : 4
        );
      },
    };
  function t3(e) {
    return null === e || G5(e) || K5(e) ? 1 : Y5(e) ? 2 : void 0;
  }
  function r3(e, t, r) {
    for (var n = [], i = -1; ++i < e.length; ) {
      var o = e[i].resolveAll;
      o && !n.includes(o) && ((t = o(t, r)), n.push(o));
    }
    return t;
  }
  var n3 = {
    name: "attention",
    tokenize: function (e, t) {
      var r,
        n = this.parser.constructs.attentionMarkers.null,
        i = this.previous,
        o = t3(i);
      return function (t) {
        return (r = t), e.enter("attentionSequence"), a(t);
      };
      function a(u) {
        if (u === r) return e.consume(u), a;
        var c = e.exit("attentionSequence"),
          s = t3(u),
          f = !s || (2 === s && o) || n.includes(u),
          l = !o || (2 === o && s) || n.includes(i);
        return (
          (c._open = Boolean(42 === r ? f : f && (o || !l))),
          (c._close = Boolean(42 === r ? l : l && (s || !f))),
          t(u)
        );
      }
    },
    resolveAll: function (e, t) {
      var r,
        n,
        i,
        o,
        a,
        u,
        c,
        s,
        f = -1;
      for (; ++f < e.length; )
        if (
          "enter" === e[f][0] &&
          "attentionSequence" === e[f][1].type &&
          e[f][1]._close
        )
          for (r = f; r--; )
            if (
              "exit" === e[r][0] &&
              "attentionSequence" === e[r][1].type &&
              e[r][1]._open &&
              t.sliceSerialize(e[r][1]).charCodeAt(0) ===
                t.sliceSerialize(e[f][1]).charCodeAt(0)
            ) {
              if (
                (e[r][1]._close || e[f][1]._open) &&
                (e[f][1].end.offset - e[f][1].start.offset) % 3 &&
                !(
                  (e[r][1].end.offset -
                    e[r][1].start.offset +
                    e[f][1].end.offset -
                    e[f][1].start.offset) %
                  3
                )
              )
                continue;
              u =
                e[r][1].end.offset - e[r][1].start.offset > 1 &&
                e[f][1].end.offset - e[f][1].start.offset > 1
                  ? 2
                  : 1;
              var l = Object.assign({}, e[r][1].end),
                h = Object.assign({}, e[f][1].start);
              i3(l, -u),
                i3(h, u),
                (o = {
                  type: u > 1 ? "strongSequence" : "emphasisSequence",
                  start: l,
                  end: Object.assign({}, e[r][1].end),
                }),
                (a = {
                  type: u > 1 ? "strongSequence" : "emphasisSequence",
                  start: Object.assign({}, e[f][1].start),
                  end: h,
                }),
                (i = {
                  type: u > 1 ? "strongText" : "emphasisText",
                  start: Object.assign({}, e[r][1].end),
                  end: Object.assign({}, e[f][1].start),
                }),
                (n = {
                  type: u > 1 ? "strong" : "emphasis",
                  start: Object.assign({}, o.start),
                  end: Object.assign({}, a.end),
                }),
                (e[r][1].end = Object.assign({}, o.start)),
                (e[f][1].start = Object.assign({}, a.end)),
                (c = []),
                e[r][1].end.offset - e[r][1].start.offset &&
                  (c = C5(c, [
                    ["enter", e[r][1], t],
                    ["exit", e[r][1], t],
                  ])),
                (c = C5(c, [
                  ["enter", n, t],
                  ["enter", o, t],
                  ["exit", o, t],
                  ["enter", i, t],
                ])),
                (c = C5(
                  c,
                  r3(t.parser.constructs.insideSpan.null, e.slice(r + 1, f), t)
                )),
                (c = C5(c, [
                  ["exit", i, t],
                  ["enter", a, t],
                  ["exit", a, t],
                  ["exit", n, t],
                ])),
                e[f][1].end.offset - e[f][1].start.offset
                  ? ((s = 2),
                    (c = C5(c, [
                      ["enter", e[f][1], t],
                      ["exit", e[f][1], t],
                    ])))
                  : (s = 0),
                j5(e, r - 1, f - r + 3, c),
                (f = r + c.length - s - 2);
              break;
            }
      f = -1;
      for (; ++f < e.length; )
        "attentionSequence" === e[f][1].type && (e[f][1].type = "data");
      return e;
    },
  };
  function i3(e, t) {
    (e.column += t), (e.offset += t), (e._bufferIndex += t);
  }
  var o3 = {
    name: "autolink",
    tokenize: function (e, t, r) {
      var n = 0;
      return function (t) {
        return (
          e.enter("autolink"),
          e.enter("autolinkMarker"),
          e.consume(t),
          e.exit("autolinkMarker"),
          e.enter("autolinkProtocol"),
          i
        );
      };
      function i(t) {
        return N5(t) ? (e.consume(t), o) : c(t);
      }
      function o(e) {
        return 43 === e || 45 === e || 46 === e || U5(e)
          ? ((n = 1), a(e))
          : c(e);
      }
      function a(t) {
        return 58 === t
          ? (e.consume(t), (n = 0), u)
          : (43 === t || 45 === t || 46 === t || U5(t)) && n++ < 32
          ? (e.consume(t), a)
          : ((n = 0), c(t));
      }
      function u(n) {
        return 62 === n
          ? (e.exit("autolinkProtocol"),
            e.enter("autolinkMarker"),
            e.consume(n),
            e.exit("autolinkMarker"),
            e.exit("autolink"),
            t)
          : null === n || 32 === n || 60 === n || z5(n)
          ? r(n)
          : (e.consume(n), u);
      }
      function c(t) {
        return 64 === t ? (e.consume(t), s) : B5(t) ? (e.consume(t), c) : r(t);
      }
      function s(e) {
        return U5(e) ? f(e) : r(e);
      }
      function f(r) {
        return 46 === r
          ? (e.consume(r), (n = 0), s)
          : 62 === r
          ? ((e.exit("autolinkProtocol").type = "autolinkEmail"),
            e.enter("autolinkMarker"),
            e.consume(r),
            e.exit("autolinkMarker"),
            e.exit("autolink"),
            t)
          : l(r);
      }
      function l(t) {
        if ((45 === t || U5(t)) && n++ < 63) {
          var i = 45 === t ? l : f;
          return e.consume(t), i;
        }
        return r(t);
      }
    },
  };
  var a3 = {
    tokenize: function (e, t, r) {
      return function (t) {
        return $5(t) ? X5(e, n, "linePrefix")(t) : n(t);
      };
      function n(e) {
        return null === e || V5(e) ? t(e) : r(e);
      }
    },
    partial: !0,
  };
  var u3 = {
    name: "blockQuote",
    tokenize: function (e, t, r) {
      var n = this;
      return function (t) {
        if (62 === t) {
          var o = n.containerState;
          return (
            o.open ||
              (e.enter("blockQuote", { _container: !0 }), (o.open = !0)),
            e.enter("blockQuotePrefix"),
            e.enter("blockQuoteMarker"),
            e.consume(t),
            e.exit("blockQuoteMarker"),
            i
          );
        }
        return r(t);
      };
      function i(r) {
        return $5(r)
          ? (e.enter("blockQuotePrefixWhitespace"),
            e.consume(r),
            e.exit("blockQuotePrefixWhitespace"),
            e.exit("blockQuotePrefix"),
            t)
          : (e.exit("blockQuotePrefix"), t(r));
      }
    },
    continuation: {
      tokenize: function (e, t, r) {
        var n = this;
        return function (t) {
          if ($5(t))
            return X5(
              e,
              i,
              "linePrefix",
              n.parser.constructs.disable.null.includes("codeIndented")
                ? void 0
                : 4
            )(t);
          return i(t);
        };
        function i(n) {
          return e.attempt(u3, t, r)(n);
        }
      },
    },
    exit: function (e) {
      e.exit("blockQuote");
    },
  };
  var c3 = {
    name: "characterEscape",
    tokenize: function (e, t, r) {
      return function (t) {
        return (
          e.enter("characterEscape"),
          e.enter("escapeMarker"),
          e.consume(t),
          e.exit("escapeMarker"),
          n
        );
      };
      function n(n) {
        return q5(n)
          ? (e.enter("characterEscapeValue"),
            e.consume(n),
            e.exit("characterEscapeValue"),
            e.exit("characterEscape"),
            t)
          : r(n);
      }
    },
  };
  var s3 = document.createElement("i");
  function f3(e) {
    var t = "&" + e + ";";
    s3.innerHTML = t;
    var r = s3.textContent;
    return (59 !== r.charCodeAt(r.length - 1) || "semi" === e) && r !== t && r;
  }
  var l3 = {
    name: "characterReference",
    tokenize: function (e, t, r) {
      var n,
        i,
        o = this,
        a = 0;
      return function (t) {
        return (
          e.enter("characterReference"),
          e.enter("characterReferenceMarker"),
          e.consume(t),
          e.exit("characterReferenceMarker"),
          u
        );
      };
      function u(t) {
        return 35 === t
          ? (e.enter("characterReferenceMarkerNumeric"),
            e.consume(t),
            e.exit("characterReferenceMarkerNumeric"),
            c)
          : (e.enter("characterReferenceValue"), (n = 31), (i = U5), s(t));
      }
      function c(t) {
        return 88 === t || 120 === t
          ? (e.enter("characterReferenceMarkerHexadecimal"),
            e.consume(t),
            e.exit("characterReferenceMarkerHexadecimal"),
            e.enter("characterReferenceValue"),
            (n = 6),
            (i = W5),
            s)
          : (e.enter("characterReferenceValue"), (n = 7), (i = H5), s(t));
      }
      function s(u) {
        if (59 === u && a) {
          var c = e.exit("characterReferenceValue");
          return i !== U5 || f3(o.sliceSerialize(c))
            ? (e.enter("characterReferenceMarker"),
              e.consume(u),
              e.exit("characterReferenceMarker"),
              e.exit("characterReference"),
              t)
            : r(u);
        }
        return i(u) && a++ < n ? (e.consume(u), s) : r(u);
      }
    },
  };
  var h3 = {
      tokenize: function (e, t, r) {
        var n = this;
        return function (t) {
          if (null === t) return r(t);
          return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), i;
        };
        function i(e) {
          return n.parser.lazy[n.now().line] ? r(e) : t(e);
        }
      },
      partial: !0,
    },
    p3 = {
      name: "codeFenced",
      tokenize: function (e, t, r) {
        var n,
          i = this,
          o = {
            tokenize: function (e, t, r) {
              var o = 0;
              return a;
              function a(t) {
                return (
                  e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), c
                );
              }
              function c(t) {
                return (
                  e.enter("codeFencedFence"),
                  $5(t)
                    ? X5(
                        e,
                        s,
                        "linePrefix",
                        i.parser.constructs.disable.null.includes(
                          "codeIndented"
                        )
                          ? void 0
                          : 4
                      )(t)
                    : s(t)
                );
              }
              function s(t) {
                return t === n
                  ? (e.enter("codeFencedFenceSequence"), f(t))
                  : r(t);
              }
              function f(t) {
                return t === n
                  ? (o++, e.consume(t), f)
                  : o >= u
                  ? (e.exit("codeFencedFenceSequence"),
                    $5(t) ? X5(e, l, "whitespace")(t) : l(t))
                  : r(t);
              }
              function l(n) {
                return null === n || V5(n)
                  ? (e.exit("codeFencedFence"), t(n))
                  : r(n);
              }
            },
            partial: !0,
          },
          a = 0,
          u = 0;
        return function (t) {
          return (function (t) {
            var r = i.events[i.events.length - 1];
            return (
              (a =
                r && "linePrefix" === r[1].type
                  ? r[2].sliceSerialize(r[1], !0).length
                  : 0),
              (n = t),
              e.enter("codeFenced"),
              e.enter("codeFencedFence"),
              e.enter("codeFencedFenceSequence"),
              c(t)
            );
          })(t);
        };
        function c(t) {
          return t === n
            ? (u++, e.consume(t), c)
            : u < 3
            ? r(t)
            : (e.exit("codeFencedFenceSequence"),
              $5(t) ? X5(e, s, "whitespace")(t) : s(t));
        }
        function s(r) {
          return null === r || V5(r)
            ? (e.exit("codeFencedFence"),
              i.interrupt ? t(r) : e.check(h3, p, m)(r))
            : (e.enter("codeFencedFenceInfo"),
              e.enter("chunkString", { contentType: "string" }),
              f(r));
        }
        function f(t) {
          return null === t || V5(t)
            ? (e.exit("chunkString"), e.exit("codeFencedFenceInfo"), s(t))
            : $5(t)
            ? (e.exit("chunkString"),
              e.exit("codeFencedFenceInfo"),
              X5(e, l, "whitespace")(t))
            : 96 === t && t === n
            ? r(t)
            : (e.consume(t), f);
        }
        function l(t) {
          return null === t || V5(t)
            ? s(t)
            : (e.enter("codeFencedFenceMeta"),
              e.enter("chunkString", { contentType: "string" }),
              h(t));
        }
        function h(t) {
          return null === t || V5(t)
            ? (e.exit("chunkString"), e.exit("codeFencedFenceMeta"), s(t))
            : 96 === t && t === n
            ? r(t)
            : (e.consume(t), h);
        }
        function p(t) {
          return e.attempt(o, m, d)(t);
        }
        function d(t) {
          return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), v;
        }
        function v(t) {
          return a > 0 && $5(t) ? X5(e, g, "linePrefix", a + 1)(t) : g(t);
        }
        function g(t) {
          return null === t || V5(t)
            ? e.check(h3, p, m)(t)
            : (e.enter("codeFlowValue"), y(t));
        }
        function y(t) {
          return null === t || V5(t)
            ? (e.exit("codeFlowValue"), g(t))
            : (e.consume(t), y);
        }
        function m(r) {
          return e.exit("codeFenced"), t(r);
        }
      },
      concrete: !0,
    };
  var d3 = {
      name: "codeIndented",
      tokenize: function (e, t, r) {
        var n = this;
        return function (t) {
          return e.enter("codeIndented"), X5(e, i, "linePrefix", 5)(t);
        };
        function i(e) {
          var t = n.events[n.events.length - 1];
          return t &&
            "linePrefix" === t[1].type &&
            t[2].sliceSerialize(t[1], !0).length >= 4
            ? o(e)
            : r(e);
        }
        function o(t) {
          return null === t
            ? u(t)
            : V5(t)
            ? e.attempt(v3, o, u)(t)
            : (e.enter("codeFlowValue"), a(t));
        }
        function a(t) {
          return null === t || V5(t)
            ? (e.exit("codeFlowValue"), o(t))
            : (e.consume(t), a);
        }
        function u(r) {
          return e.exit("codeIndented"), t(r);
        }
      },
    },
    v3 = {
      tokenize: function (e, t, r) {
        var n = this;
        return i;
        function i(t) {
          return n.parser.lazy[n.now().line]
            ? r(t)
            : V5(t)
            ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), i)
            : X5(e, o, "linePrefix", 5)(t);
        }
        function o(e) {
          var o = n.events[n.events.length - 1];
          return o &&
            "linePrefix" === o[1].type &&
            o[2].sliceSerialize(o[1], !0).length >= 4
            ? t(e)
            : V5(e)
            ? i(e)
            : r(e);
        }
      },
      partial: !0,
    };
  var g3 = {
    name: "codeText",
    tokenize: function (e, t, r) {
      var n,
        i,
        o = 0;
      return function (t) {
        return e.enter("codeText"), e.enter("codeTextSequence"), a(t);
      };
      function a(t) {
        return 96 === t
          ? (e.consume(t), o++, a)
          : (e.exit("codeTextSequence"), u(t));
      }
      function u(t) {
        return null === t
          ? r(t)
          : 32 === t
          ? (e.enter("space"), e.consume(t), e.exit("space"), u)
          : 96 === t
          ? ((i = e.enter("codeTextSequence")), (n = 0), s(t))
          : V5(t)
          ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), u)
          : (e.enter("codeTextData"), c(t));
      }
      function c(t) {
        return null === t || 32 === t || 96 === t || V5(t)
          ? (e.exit("codeTextData"), u(t))
          : (e.consume(t), c);
      }
      function s(r) {
        return 96 === r
          ? (e.consume(r), n++, s)
          : n === o
          ? (e.exit("codeTextSequence"), e.exit("codeText"), t(r))
          : ((i.type = "codeTextData"), c(r));
      }
    },
    resolve: function (e) {
      var t,
        r,
        n = e.length - 4,
        i = 3;
      if (
        !(
          ("lineEnding" !== e[i][1].type && "space" !== e[i][1].type) ||
          ("lineEnding" !== e[n][1].type && "space" !== e[n][1].type)
        )
      )
        for (t = i; ++t < n; )
          if ("codeTextData" === e[t][1].type) {
            (e[i][1].type = "codeTextPadding"),
              (e[n][1].type = "codeTextPadding"),
              (i += 2),
              (n -= 2);
            break;
          }
      (t = i - 1), n++;
      for (; ++t <= n; )
        void 0 === r
          ? t !== n && "lineEnding" !== e[t][1].type && (r = t)
          : (t !== n && "lineEnding" !== e[t][1].type) ||
            ((e[r][1].type = "codeTextData"),
            t !== r + 2 &&
              ((e[r][1].end = e[t - 1][1].end),
              e.splice(r + 2, t - r - 2),
              (n -= t - r - 2),
              (t = r + 2)),
            (r = void 0));
      return e;
    },
    previous: function (e) {
      return (
        96 !== e ||
        "characterEscape" === this.events[this.events.length - 1][1].type
      );
    },
  };
  function y3(e) {
    for (var t, r, n, i, o, a, u, c = {}, s = -1; ++s < e.length; ) {
      for (; s in c; ) s = c[s];
      if (
        ((t = e[s]),
        s &&
          "chunkFlow" === t[1].type &&
          "listItemPrefix" === e[s - 1][1].type &&
          ((n = 0) < (a = t[1]._tokenizer.events).length &&
            "lineEndingBlank" === a[n][1].type &&
            (n += 2),
          n < a.length && "content" === a[n][1].type))
      )
        for (; ++n < a.length && "content" !== a[n][1].type; )
          "chunkText" === a[n][1].type &&
            ((a[n][1]._isInFirstContentOfListItem = !0), n++);
      if ("enter" === t[0])
        t[1].contentType && (Object.assign(c, m3(e, s)), (s = c[s]), (u = !0));
      else if (t[1]._container) {
        for (
          n = s, r = void 0;
          n-- &&
          ("lineEnding" === (i = e[n])[1].type ||
            "lineEndingBlank" === i[1].type);

        )
          "enter" === i[0] &&
            (r && (e[r][1].type = "lineEndingBlank"),
            (i[1].type = "lineEnding"),
            (r = n));
        r &&
          ((t[1].end = Object.assign({}, e[r][1].start)),
          (o = e.slice(r, s)).unshift(t),
          j5(e, r, s - r + 1, o));
      }
    }
    return !u;
  }
  function m3(e, t) {
    for (
      var r,
        n,
        i = e[t][1],
        o = e[t][2],
        a = t - 1,
        u = [],
        c = i._tokenizer || o.parser[i.contentType](i.start),
        s = c.events,
        f = [],
        l = {},
        h = -1,
        p = i,
        d = 0,
        v = 0,
        g = [v];
      p;

    ) {
      for (; e[++a][1] !== p; );
      u.push(a),
        p._tokenizer ||
          ((r = o.sliceStream(p)),
          p.next || r.push(null),
          n && c.defineSkip(p.start),
          p._isInFirstContentOfListItem &&
            (c._gfmTasklistFirstContentOfListItem = !0),
          c.write(r),
          p._isInFirstContentOfListItem &&
            (c._gfmTasklistFirstContentOfListItem = void 0)),
        (n = p),
        (p = p.next);
    }
    for (p = i; ++h < s.length; )
      "exit" === s[h][0] &&
        "enter" === s[h - 1][0] &&
        s[h][1].type === s[h - 1][1].type &&
        s[h][1].start.line !== s[h][1].end.line &&
        ((v = h + 1),
        g.push(v),
        (p._tokenizer = void 0),
        (p.previous = void 0),
        (p = p.next));
    for (
      c.events = [],
        p ? ((p._tokenizer = void 0), (p.previous = void 0)) : g.pop(),
        h = g.length;
      h--;

    ) {
      var y = s.slice(g[h], g[h + 1]),
        m = u.pop();
      f.unshift([m, m + y.length - 1]), j5(e, m, 2, y);
    }
    for (h = -1; ++h < f.length; )
      (l[d + f[h][0]] = d + f[h][1]), (d += f[h][1] - f[h][0] - 1);
    return l;
  }
  var b3 = {
      tokenize: function (e, t) {
        var r;
        return function (t) {
          return (
            e.enter("content"),
            (r = e.enter("chunkContent", { contentType: "content" })),
            n(t)
          );
        };
        function n(t) {
          return null === t
            ? i(t)
            : V5(t)
            ? e.check(w3, o, i)(t)
            : (e.consume(t), n);
        }
        function i(r) {
          return e.exit("chunkContent"), e.exit("content"), t(r);
        }
        function o(t) {
          return (
            e.consume(t),
            e.exit("chunkContent"),
            (r.next = e.enter("chunkContent", {
              contentType: "content",
              previous: r,
            })),
            (r = r.next),
            n
          );
        }
      },
      resolve: function (e) {
        return y3(e), e;
      },
    },
    w3 = {
      tokenize: function (e, t, r) {
        var n = this;
        return function (t) {
          return (
            e.exit("chunkContent"),
            e.enter("lineEnding"),
            e.consume(t),
            e.exit("lineEnding"),
            X5(e, i, "linePrefix")
          );
        };
        function i(i) {
          if (null === i || V5(i)) return r(i);
          var o = n.events[n.events.length - 1];
          return !n.parser.constructs.disable.null.includes("codeIndented") &&
            o &&
            "linePrefix" === o[1].type &&
            o[2].sliceSerialize(o[1], !0).length >= 4
            ? t(i)
            : e.interrupt(n.parser.constructs.flow, r, t)(i);
        }
      },
      partial: !0,
    };
  function E3(e, t, r, n, i, o, a, u, c) {
    var s = c || Number.POSITIVE_INFINITY,
      f = 0;
    return function (t) {
      if (60 === t)
        return e.enter(n), e.enter(i), e.enter(o), e.consume(t), e.exit(o), l;
      if (null === t || 32 === t || 41 === t || z5(t)) return r(t);
      return (
        e.enter(n),
        e.enter(a),
        e.enter(u),
        e.enter("chunkString", { contentType: "string" }),
        d(t)
      );
    };
    function l(r) {
      return 62 === r
        ? (e.enter(o), e.consume(r), e.exit(o), e.exit(i), e.exit(n), t)
        : (e.enter(u), e.enter("chunkString", { contentType: "string" }), h(r));
    }
    function h(t) {
      return 62 === t
        ? (e.exit("chunkString"), e.exit(u), l(t))
        : null === t || 60 === t || V5(t)
        ? r(t)
        : (e.consume(t), 92 === t ? p : h);
    }
    function p(t) {
      return 60 === t || 62 === t || 92 === t ? (e.consume(t), h) : h(t);
    }
    function d(i) {
      return f || (null !== i && 41 !== i && !G5(i))
        ? f < s && 40 === i
          ? (e.consume(i), f++, d)
          : 41 === i
          ? (e.consume(i), f--, d)
          : null === i || 32 === i || 40 === i || z5(i)
          ? r(i)
          : (e.consume(i), 92 === i ? v : d)
        : (e.exit("chunkString"), e.exit(u), e.exit(a), e.exit(n), t(i));
    }
    function v(t) {
      return 40 === t || 41 === t || 92 === t ? (e.consume(t), d) : d(t);
    }
  }
  function x3(e, t, r, n, i, o) {
    var a,
      u = this,
      c = 0;
    return function (t) {
      return e.enter(n), e.enter(i), e.consume(t), e.exit(i), e.enter(o), s;
    };
    function s(l) {
      return c > 999 ||
        null === l ||
        91 === l ||
        (93 === l && !a) ||
        (94 === l && !c && "_hiddenFootnoteSupport" in u.parser.constructs)
        ? r(l)
        : 93 === l
        ? (e.exit(o), e.enter(i), e.consume(l), e.exit(i), e.exit(n), t)
        : V5(l)
        ? (e.enter("lineEnding"), e.consume(l), e.exit("lineEnding"), s)
        : (e.enter("chunkString", { contentType: "string" }), f(l));
    }
    function f(t) {
      return null === t || 91 === t || 93 === t || V5(t) || c++ > 999
        ? (e.exit("chunkString"), s(t))
        : (e.consume(t), a || (a = !$5(t)), 92 === t ? l : f);
    }
    function l(t) {
      return 91 === t || 92 === t || 93 === t ? (e.consume(t), c++, f) : f(t);
    }
  }
  function S3(e, t, r, n, i, o) {
    var a;
    return function (t) {
      if (34 === t || 39 === t || 40 === t)
        return (
          e.enter(n),
          e.enter(i),
          e.consume(t),
          e.exit(i),
          (a = 40 === t ? 41 : t),
          u
        );
      return r(t);
    };
    function u(r) {
      return r === a
        ? (e.enter(i), e.consume(r), e.exit(i), e.exit(n), t)
        : (e.enter(o), c(r));
    }
    function c(t) {
      return t === a
        ? (e.exit(o), u(a))
        : null === t
        ? r(t)
        : V5(t)
        ? (e.enter("lineEnding"),
          e.consume(t),
          e.exit("lineEnding"),
          X5(e, c, "linePrefix"))
        : (e.enter("chunkString", { contentType: "string" }), s(t));
    }
    function s(t) {
      return t === a || null === t || V5(t)
        ? (e.exit("chunkString"), c(t))
        : (e.consume(t), 92 === t ? f : s);
    }
    function f(t) {
      return t === a || 92 === t ? (e.consume(t), s) : s(t);
    }
  }
  function A3(e, t) {
    var r;
    return function n(i) {
      if (V5(i))
        return (
          e.enter("lineEnding"), e.consume(i), e.exit("lineEnding"), (r = !0), n
        );
      if ($5(i)) return X5(e, n, r ? "linePrefix" : "lineSuffix")(i);
      return t(i);
    };
  }
  function O3(e) {
    return e
      .replace(/[\t\n\r ]+/g, " ")
      .replace(/^ | $/g, "")
      .toLowerCase()
      .toUpperCase();
  }
  var k3 = {
      name: "definition",
      tokenize: function (e, t, r) {
        var n,
          i = this;
        return function (t) {
          return (
            e.enter("definition"),
            (function (t) {
              return x3.call(
                i,
                e,
                o,
                r,
                "definitionLabel",
                "definitionLabelMarker",
                "definitionLabelString"
              )(t);
            })(t)
          );
        };
        function o(t) {
          return (
            (n = O3(
              i.sliceSerialize(i.events[i.events.length - 1][1]).slice(1, -1)
            )),
            58 === t
              ? (e.enter("definitionMarker"),
                e.consume(t),
                e.exit("definitionMarker"),
                a)
              : r(t)
          );
        }
        function a(t) {
          return G5(t) ? A3(e, u)(t) : u(t);
        }
        function u(t) {
          return E3(
            e,
            c,
            r,
            "definitionDestination",
            "definitionDestinationLiteral",
            "definitionDestinationLiteralMarker",
            "definitionDestinationRaw",
            "definitionDestinationString"
          )(t);
        }
        function c(t) {
          return e.attempt(T3, s, s)(t);
        }
        function s(t) {
          return $5(t) ? X5(e, f, "whitespace")(t) : f(t);
        }
        function f(o) {
          return null === o || V5(o)
            ? (e.exit("definition"), i.parser.defined.push(n), t(o))
            : r(o);
        }
      },
    },
    T3 = {
      tokenize: function (e, t, r) {
        return function (t) {
          return G5(t) ? A3(e, n)(t) : r(t);
        };
        function n(t) {
          return S3(
            e,
            i,
            r,
            "definitionTitle",
            "definitionTitleMarker",
            "definitionTitleString"
          )(t);
        }
        function i(t) {
          return $5(t) ? X5(e, o, "whitespace")(t) : o(t);
        }
        function o(e) {
          return null === e || V5(e) ? t(e) : r(e);
        }
      },
      partial: !0,
    };
  var R3 = {
    name: "hardBreakEscape",
    tokenize: function (e, t, r) {
      return function (t) {
        return e.enter("hardBreakEscape"), e.consume(t), n;
      };
      function n(n) {
        return V5(n) ? (e.exit("hardBreakEscape"), t(n)) : r(n);
      }
    },
  };
  var I3 = {
    name: "headingAtx",
    tokenize: function (e, t, r) {
      var n = 0;
      return function (t) {
        return (
          e.enter("atxHeading"),
          (function (t) {
            return e.enter("atxHeadingSequence"), i(t);
          })(t)
        );
      };
      function i(t) {
        return 35 === t && n++ < 6
          ? (e.consume(t), i)
          : null === t || G5(t)
          ? (e.exit("atxHeadingSequence"), o(t))
          : r(t);
      }
      function o(r) {
        return 35 === r
          ? (e.enter("atxHeadingSequence"), a(r))
          : null === r || V5(r)
          ? (e.exit("atxHeading"), t(r))
          : $5(r)
          ? X5(e, o, "whitespace")(r)
          : (e.enter("atxHeadingText"), u(r));
      }
      function a(t) {
        return 35 === t
          ? (e.consume(t), a)
          : (e.exit("atxHeadingSequence"), o(t));
      }
      function u(t) {
        return null === t || 35 === t || G5(t)
          ? (e.exit("atxHeadingText"), o(t))
          : (e.consume(t), u);
      }
    },
    resolve: function (e, t) {
      var r,
        n,
        i = e.length - 2,
        o = 3;
      "whitespace" === e[o][1].type && (o += 2);
      i - 2 > o && "whitespace" === e[i][1].type && (i -= 2);
      "atxHeadingSequence" === e[i][1].type &&
        (o === i - 1 || (i - 4 > o && "whitespace" === e[i - 2][1].type)) &&
        (i -= o + 1 === i ? 2 : 4);
      i > o &&
        j5(e, o, i - o + 1, [
          [
            "enter",
            (r = {
              type: "atxHeadingText",
              start: e[o][1].start,
              end: e[i][1].end,
            }),
            t,
          ],
          [
            "enter",
            (n = {
              type: "chunkText",
              start: e[o][1].start,
              end: e[i][1].end,
              contentType: "text",
            }),
            t,
          ],
          ["exit", n, t],
          ["exit", r, t],
        ]);
      return e;
    },
  };
  var _3 = [
      "address",
      "article",
      "aside",
      "base",
      "basefont",
      "blockquote",
      "body",
      "caption",
      "center",
      "col",
      "colgroup",
      "dd",
      "details",
      "dialog",
      "dir",
      "div",
      "dl",
      "dt",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "frame",
      "frameset",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hr",
      "html",
      "iframe",
      "legend",
      "li",
      "link",
      "main",
      "menu",
      "menuitem",
      "nav",
      "noframes",
      "ol",
      "optgroup",
      "option",
      "p",
      "param",
      "search",
      "section",
      "summary",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "title",
      "tr",
      "track",
      "ul",
    ],
    P3 = ["pre", "script", "style", "textarea"],
    F3 = {
      name: "htmlFlow",
      tokenize: function (e, t, r) {
        var n,
          i,
          o,
          a,
          u,
          c = this;
        return function (t) {
          return (function (t) {
            return (
              e.enter("htmlFlow"), e.enter("htmlFlowData"), e.consume(t), s
            );
          })(t);
        };
        function s(a) {
          return 33 === a
            ? (e.consume(a), f)
            : 47 === a
            ? (e.consume(a), (i = !0), p)
            : 63 === a
            ? (e.consume(a), (n = 3), c.interrupt ? t : C)
            : N5(a)
            ? (e.consume(a), (o = String.fromCharCode(a)), d)
            : r(a);
        }
        function f(i) {
          return 45 === i
            ? (e.consume(i), (n = 2), l)
            : 91 === i
            ? (e.consume(i), (n = 5), (a = 0), h)
            : N5(i)
            ? (e.consume(i), (n = 4), c.interrupt ? t : C)
            : r(i);
        }
        function l(n) {
          return 45 === n ? (e.consume(n), c.interrupt ? t : C) : r(n);
        }
        function h(n) {
          var i = "CDATA[";
          return n === i.charCodeAt(a++)
            ? (e.consume(n), 6 === a ? (c.interrupt ? t : k) : h)
            : r(n);
        }
        function p(t) {
          return N5(t) ? (e.consume(t), (o = String.fromCharCode(t)), d) : r(t);
        }
        function d(a) {
          if (null === a || 47 === a || 62 === a || G5(a)) {
            var u = 47 === a,
              s = o.toLowerCase();
            return u || i || !P3.includes(s)
              ? _3.includes(o.toLowerCase())
                ? ((n = 6), u ? (e.consume(a), v) : c.interrupt ? t(a) : k(a))
                : ((n = 7),
                  c.interrupt && !c.parser.lazy[c.now().line]
                    ? r(a)
                    : i
                    ? g(a)
                    : y(a))
              : ((n = 1), c.interrupt ? t(a) : k(a));
          }
          return 45 === a || U5(a)
            ? (e.consume(a), (o += String.fromCharCode(a)), d)
            : r(a);
        }
        function v(n) {
          return 62 === n ? (e.consume(n), c.interrupt ? t : k) : r(n);
        }
        function g(t) {
          return $5(t) ? (e.consume(t), g) : A(t);
        }
        function y(t) {
          return 47 === t
            ? (e.consume(t), A)
            : 58 === t || 95 === t || N5(t)
            ? (e.consume(t), m)
            : $5(t)
            ? (e.consume(t), y)
            : A(t);
        }
        function m(t) {
          return 45 === t || 46 === t || 58 === t || 95 === t || U5(t)
            ? (e.consume(t), m)
            : b(t);
        }
        function b(t) {
          return 61 === t
            ? (e.consume(t), w)
            : $5(t)
            ? (e.consume(t), b)
            : y(t);
        }
        function w(t) {
          return null === t || 60 === t || 61 === t || 62 === t || 96 === t
            ? r(t)
            : 34 === t || 39 === t
            ? (e.consume(t), (u = t), E)
            : $5(t)
            ? (e.consume(t), w)
            : x(t);
        }
        function E(t) {
          return t === u
            ? (e.consume(t), (u = null), S)
            : null === t || V5(t)
            ? r(t)
            : (e.consume(t), E);
        }
        function x(t) {
          return null === t ||
            34 === t ||
            39 === t ||
            47 === t ||
            60 === t ||
            61 === t ||
            62 === t ||
            96 === t ||
            G5(t)
            ? b(t)
            : (e.consume(t), x);
        }
        function S(e) {
          return 47 === e || 62 === e || $5(e) ? y(e) : r(e);
        }
        function A(t) {
          return 62 === t ? (e.consume(t), O) : r(t);
        }
        function O(t) {
          return null === t || V5(t) ? k(t) : $5(t) ? (e.consume(t), O) : r(t);
        }
        function k(t) {
          return 45 === t && 2 === n
            ? (e.consume(t), _)
            : 60 === t && 1 === n
            ? (e.consume(t), P)
            : 62 === t && 4 === n
            ? (e.consume(t), L)
            : 63 === t && 3 === n
            ? (e.consume(t), C)
            : 93 === t && 5 === n
            ? (e.consume(t), j)
            : !V5(t) || (6 !== n && 7 !== n)
            ? null === t || V5(t)
              ? (e.exit("htmlFlowData"), T(t))
              : (e.consume(t), k)
            : (e.exit("htmlFlowData"), e.check(j3, M, T)(t));
        }
        function T(t) {
          return e.check(C3, R, M)(t);
        }
        function R(t) {
          return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), I;
        }
        function I(t) {
          return null === t || V5(t) ? T(t) : (e.enter("htmlFlowData"), k(t));
        }
        function _(t) {
          return 45 === t ? (e.consume(t), C) : k(t);
        }
        function P(t) {
          return 47 === t ? (e.consume(t), (o = ""), F) : k(t);
        }
        function F(t) {
          if (62 === t) {
            var r = o.toLowerCase();
            return P3.includes(r) ? (e.consume(t), L) : k(t);
          }
          return N5(t) && o.length < 8
            ? (e.consume(t), (o += String.fromCharCode(t)), F)
            : k(t);
        }
        function j(t) {
          return 93 === t ? (e.consume(t), C) : k(t);
        }
        function C(t) {
          return 62 === t
            ? (e.consume(t), L)
            : 45 === t && 2 === n
            ? (e.consume(t), C)
            : k(t);
        }
        function L(t) {
          return null === t || V5(t)
            ? (e.exit("htmlFlowData"), M(t))
            : (e.consume(t), L);
        }
        function M(r) {
          return e.exit("htmlFlow"), t(r);
        }
      },
      resolveTo: function (e) {
        var t = e.length;
        for (; t-- && ("enter" !== e[t][0] || "htmlFlow" !== e[t][1].type); );
        t > 1 &&
          "linePrefix" === e[t - 2][1].type &&
          ((e[t][1].start = e[t - 2][1].start),
          (e[t + 1][1].start = e[t - 2][1].start),
          e.splice(t - 2, 2));
        return e;
      },
      concrete: !0,
    },
    j3 = {
      tokenize: function (e, t, r) {
        return function (n) {
          return (
            e.enter("lineEnding"),
            e.consume(n),
            e.exit("lineEnding"),
            e.attempt(a3, t, r)
          );
        };
      },
      partial: !0,
    },
    C3 = {
      tokenize: function (e, t, r) {
        var n = this;
        return function (t) {
          if (V5(t))
            return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), i;
          return r(t);
        };
        function i(e) {
          return n.parser.lazy[n.now().line] ? r(e) : t(e);
        }
      },
      partial: !0,
    };
  var L3 = {
    name: "htmlText",
    tokenize: function (e, t, r) {
      var n,
        i,
        o,
        a = this;
      return function (t) {
        return e.enter("htmlText"), e.enter("htmlTextData"), e.consume(t), u;
      };
      function u(t) {
        return 33 === t
          ? (e.consume(t), c)
          : 47 === t
          ? (e.consume(t), w)
          : 63 === t
          ? (e.consume(t), m)
          : N5(t)
          ? (e.consume(t), S)
          : r(t);
      }
      function c(t) {
        return 45 === t
          ? (e.consume(t), s)
          : 91 === t
          ? (e.consume(t), (i = 0), p)
          : N5(t)
          ? (e.consume(t), y)
          : r(t);
      }
      function s(t) {
        return 45 === t ? (e.consume(t), h) : r(t);
      }
      function f(t) {
        return null === t
          ? r(t)
          : 45 === t
          ? (e.consume(t), l)
          : V5(t)
          ? ((o = f), F(t))
          : (e.consume(t), f);
      }
      function l(t) {
        return 45 === t ? (e.consume(t), h) : f(t);
      }
      function h(e) {
        return 62 === e ? P(e) : 45 === e ? l(e) : f(e);
      }
      function p(t) {
        var n = "CDATA[";
        return t === n.charCodeAt(i++) ? (e.consume(t), 6 === i ? d : p) : r(t);
      }
      function d(t) {
        return null === t
          ? r(t)
          : 93 === t
          ? (e.consume(t), v)
          : V5(t)
          ? ((o = d), F(t))
          : (e.consume(t), d);
      }
      function v(t) {
        return 93 === t ? (e.consume(t), g) : d(t);
      }
      function g(t) {
        return 62 === t ? P(t) : 93 === t ? (e.consume(t), g) : d(t);
      }
      function y(t) {
        return null === t || 62 === t
          ? P(t)
          : V5(t)
          ? ((o = y), F(t))
          : (e.consume(t), y);
      }
      function m(t) {
        return null === t
          ? r(t)
          : 63 === t
          ? (e.consume(t), b)
          : V5(t)
          ? ((o = m), F(t))
          : (e.consume(t), m);
      }
      function b(e) {
        return 62 === e ? P(e) : m(e);
      }
      function w(t) {
        return N5(t) ? (e.consume(t), E) : r(t);
      }
      function E(t) {
        return 45 === t || U5(t) ? (e.consume(t), E) : x(t);
      }
      function x(t) {
        return V5(t) ? ((o = x), F(t)) : $5(t) ? (e.consume(t), x) : P(t);
      }
      function S(t) {
        return 45 === t || U5(t)
          ? (e.consume(t), S)
          : 47 === t || 62 === t || G5(t)
          ? A(t)
          : r(t);
      }
      function A(t) {
        return 47 === t
          ? (e.consume(t), P)
          : 58 === t || 95 === t || N5(t)
          ? (e.consume(t), O)
          : V5(t)
          ? ((o = A), F(t))
          : $5(t)
          ? (e.consume(t), A)
          : P(t);
      }
      function O(t) {
        return 45 === t || 46 === t || 58 === t || 95 === t || U5(t)
          ? (e.consume(t), O)
          : k(t);
      }
      function k(t) {
        return 61 === t
          ? (e.consume(t), T)
          : V5(t)
          ? ((o = k), F(t))
          : $5(t)
          ? (e.consume(t), k)
          : A(t);
      }
      function T(t) {
        return null === t || 60 === t || 61 === t || 62 === t || 96 === t
          ? r(t)
          : 34 === t || 39 === t
          ? (e.consume(t), (n = t), R)
          : V5(t)
          ? ((o = T), F(t))
          : $5(t)
          ? (e.consume(t), T)
          : (e.consume(t), I);
      }
      function R(t) {
        return t === n
          ? (e.consume(t), (n = void 0), _)
          : null === t
          ? r(t)
          : V5(t)
          ? ((o = R), F(t))
          : (e.consume(t), R);
      }
      function I(t) {
        return null === t ||
          34 === t ||
          39 === t ||
          60 === t ||
          61 === t ||
          96 === t
          ? r(t)
          : 47 === t || 62 === t || G5(t)
          ? A(t)
          : (e.consume(t), I);
      }
      function _(e) {
        return 47 === e || 62 === e || G5(e) ? A(e) : r(e);
      }
      function P(n) {
        return 62 === n
          ? (e.consume(n), e.exit("htmlTextData"), e.exit("htmlText"), t)
          : r(n);
      }
      function F(t) {
        return (
          e.exit("htmlTextData"),
          e.enter("lineEnding"),
          e.consume(t),
          e.exit("lineEnding"),
          j
        );
      }
      function j(t) {
        return $5(t)
          ? X5(
              e,
              C,
              "linePrefix",
              a.parser.constructs.disable.null.includes("codeIndented")
                ? void 0
                : 4
            )(t)
          : C(t);
      }
      function C(t) {
        return e.enter("htmlTextData"), o(t);
      }
    },
  };
  var M3 = {
      name: "labelEnd",
      tokenize: function (e, t, r) {
        var n,
          i,
          o = this,
          a = o.events.length;
        for (; a--; )
          if (
            ("labelImage" === o.events[a][1].type ||
              "labelLink" === o.events[a][1].type) &&
            !o.events[a][1]._balanced
          ) {
            n = o.events[a][1];
            break;
          }
        return function (t) {
          if (!n) return r(t);
          if (n._inactive) return f(t);
          return (
            (i = o.parser.defined.includes(
              O3(o.sliceSerialize({ start: n.end, end: o.now() }))
            )),
            e.enter("labelEnd"),
            e.enter("labelMarker"),
            e.consume(t),
            e.exit("labelMarker"),
            e.exit("labelEnd"),
            u
          );
        };
        function u(t) {
          return 40 === t
            ? e.attempt(D3, s, i ? s : f)(t)
            : 91 === t
            ? e.attempt(N3, s, i ? c : f)(t)
            : i
            ? s(t)
            : f(t);
        }
        function c(t) {
          return e.attempt(U3, s, f)(t);
        }
        function s(e) {
          return t(e);
        }
        function f(e) {
          return (n._balanced = !0), r(e);
        }
      },
      resolveTo: function (e, t) {
        var r,
          n,
          i,
          o,
          a = e.length,
          u = 0;
        for (; a--; )
          if (((r = e[a][1]), n)) {
            if ("link" === r.type || ("labelLink" === r.type && r._inactive))
              break;
            "enter" === e[a][0] && "labelLink" === r.type && (r._inactive = !0);
          } else if (i) {
            if (
              "enter" === e[a][0] &&
              ("labelImage" === r.type || "labelLink" === r.type) &&
              !r._balanced &&
              ((n = a), "labelLink" !== r.type)
            ) {
              u = 2;
              break;
            }
          } else "labelEnd" === r.type && (i = a);
        var c = {
            type: "labelLink" === e[n][1].type ? "link" : "image",
            start: Object.assign({}, e[n][1].start),
            end: Object.assign({}, e[e.length - 1][1].end),
          },
          s = {
            type: "label",
            start: Object.assign({}, e[n][1].start),
            end: Object.assign({}, e[i][1].end),
          },
          f = {
            type: "labelText",
            start: Object.assign({}, e[n + u + 2][1].end),
            end: Object.assign({}, e[i - 2][1].start),
          };
        return (
          (o = C5(
            (o = [
              ["enter", c, t],
              ["enter", s, t],
            ]),
            e.slice(n + 1, n + u + 3)
          )),
          (o = C5(o, [["enter", f, t]])),
          (o = C5(
            o,
            r3(
              t.parser.constructs.insideSpan.null,
              e.slice(n + u + 4, i - 3),
              t
            )
          )),
          (o = C5(o, [["exit", f, t], e[i - 2], e[i - 1], ["exit", s, t]])),
          (o = C5(o, e.slice(i + 1))),
          (o = C5(o, [["exit", c, t]])),
          j5(e, n, e.length, o),
          e
        );
      },
      resolveAll: function (e) {
        var t = -1;
        for (; ++t < e.length; ) {
          var r = e[t][1];
          ("labelImage" !== r.type &&
            "labelLink" !== r.type &&
            "labelEnd" !== r.type) ||
            (e.splice(t + 1, "labelImage" === r.type ? 4 : 2),
            (r.type = "data"),
            t++);
        }
        return e;
      },
    },
    D3 = {
      tokenize: function (e, t, r) {
        return function (t) {
          return (
            e.enter("resource"),
            e.enter("resourceMarker"),
            e.consume(t),
            e.exit("resourceMarker"),
            n
          );
        };
        function n(t) {
          return G5(t) ? A3(e, i)(t) : i(t);
        }
        function i(t) {
          return 41 === t
            ? s(t)
            : E3(
                e,
                o,
                a,
                "resourceDestination",
                "resourceDestinationLiteral",
                "resourceDestinationLiteralMarker",
                "resourceDestinationRaw",
                "resourceDestinationString",
                32
              )(t);
        }
        function o(t) {
          return G5(t) ? A3(e, u)(t) : s(t);
        }
        function a(e) {
          return r(e);
        }
        function u(t) {
          return 34 === t || 39 === t || 40 === t
            ? S3(
                e,
                c,
                r,
                "resourceTitle",
                "resourceTitleMarker",
                "resourceTitleString"
              )(t)
            : s(t);
        }
        function c(t) {
          return G5(t) ? A3(e, s)(t) : s(t);
        }
        function s(n) {
          return 41 === n
            ? (e.enter("resourceMarker"),
              e.consume(n),
              e.exit("resourceMarker"),
              e.exit("resource"),
              t)
            : r(n);
        }
      },
    },
    N3 = {
      tokenize: function (e, t, r) {
        var n = this;
        return function (t) {
          return x3.call(
            n,
            e,
            i,
            o,
            "reference",
            "referenceMarker",
            "referenceString"
          )(t);
        };
        function i(e) {
          return n.parser.defined.includes(
            O3(n.sliceSerialize(n.events[n.events.length - 1][1]).slice(1, -1))
          )
            ? t(e)
            : r(e);
        }
        function o(e) {
          return r(e);
        }
      },
    },
    U3 = {
      tokenize: function (e, t, r) {
        return function (t) {
          return (
            e.enter("reference"),
            e.enter("referenceMarker"),
            e.consume(t),
            e.exit("referenceMarker"),
            n
          );
        };
        function n(n) {
          return 93 === n
            ? (e.enter("referenceMarker"),
              e.consume(n),
              e.exit("referenceMarker"),
              e.exit("reference"),
              t)
            : r(n);
        }
      },
    };
  var B3 = {
    name: "labelStartImage",
    tokenize: function (e, t, r) {
      var n = this;
      return function (t) {
        return (
          e.enter("labelImage"),
          e.enter("labelImageMarker"),
          e.consume(t),
          e.exit("labelImageMarker"),
          i
        );
      };
      function i(t) {
        return 91 === t
          ? (e.enter("labelMarker"),
            e.consume(t),
            e.exit("labelMarker"),
            e.exit("labelImage"),
            o)
          : r(t);
      }
      function o(e) {
        return 94 === e && "_hiddenFootnoteSupport" in n.parser.constructs
          ? r(e)
          : t(e);
      }
    },
    resolveAll: M3.resolveAll,
  };
  var z3 = {
    name: "labelStartLink",
    tokenize: function (e, t, r) {
      var n = this;
      return function (t) {
        return (
          e.enter("labelLink"),
          e.enter("labelMarker"),
          e.consume(t),
          e.exit("labelMarker"),
          e.exit("labelLink"),
          i
        );
      };
      function i(e) {
        return 94 === e && "_hiddenFootnoteSupport" in n.parser.constructs
          ? r(e)
          : t(e);
      }
    },
    resolveAll: M3.resolveAll,
  };
  var H3 = {
    name: "lineEnding",
    tokenize: function (e, t) {
      return function (r) {
        return (
          e.enter("lineEnding"),
          e.consume(r),
          e.exit("lineEnding"),
          X5(e, t, "linePrefix")
        );
      };
    },
  };
  var W3 = {
    name: "thematicBreak",
    tokenize: function (e, t, r) {
      var n,
        i = 0;
      return function (t) {
        return (
          e.enter("thematicBreak"),
          (function (e) {
            return (n = e), o(e);
          })(t)
        );
      };
      function o(o) {
        return o === n
          ? (e.enter("thematicBreakSequence"), a(o))
          : i >= 3 && (null === o || V5(o))
          ? (e.exit("thematicBreak"), t(o))
          : r(o);
      }
      function a(t) {
        return t === n
          ? (e.consume(t), i++, a)
          : (e.exit("thematicBreakSequence"),
            $5(t) ? X5(e, o, "whitespace")(t) : o(t));
      }
    },
  };
  var q3 = {
      name: "list",
      tokenize: function (e, t, r) {
        var n = this,
          i = n.events[n.events.length - 1],
          o =
            i && "linePrefix" === i[1].type
              ? i[2].sliceSerialize(i[1], !0).length
              : 0,
          a = 0;
        return function (t) {
          var i =
            n.containerState.type ||
            (42 === t || 43 === t || 45 === t
              ? "listUnordered"
              : "listOrdered");
          if (
            "listUnordered" === i
              ? !n.containerState.marker || t === n.containerState.marker
              : H5(t)
          ) {
            if (
              (n.containerState.type ||
                ((n.containerState.type = i), e.enter(i, { _container: !0 })),
              "listUnordered" === i)
            )
              return (
                e.enter("listItemPrefix"),
                42 === t || 45 === t ? e.check(W3, r, c)(t) : c(t)
              );
            if (!n.interrupt || 49 === t)
              return e.enter("listItemPrefix"), e.enter("listItemValue"), u(t);
          }
          return r(t);
        };
        function u(t) {
          return H5(t) && ++a < 10
            ? (e.consume(t), u)
            : (!n.interrupt || a < 2) &&
              (n.containerState.marker
                ? t === n.containerState.marker
                : 41 === t || 46 === t)
            ? (e.exit("listItemValue"), c(t))
            : r(t);
        }
        function c(t) {
          return (
            e.enter("listItemMarker"),
            e.consume(t),
            e.exit("listItemMarker"),
            (n.containerState.marker = n.containerState.marker || t),
            e.check(a3, n.interrupt ? r : s, e.attempt(V3, l, f))
          );
        }
        function s(e) {
          return (n.containerState.initialBlankLine = !0), o++, l(e);
        }
        function f(t) {
          return $5(t)
            ? (e.enter("listItemPrefixWhitespace"),
              e.consume(t),
              e.exit("listItemPrefixWhitespace"),
              l)
            : r(t);
        }
        function l(r) {
          return (
            (n.containerState.size =
              o + n.sliceSerialize(e.exit("listItemPrefix"), !0).length),
            t(r)
          );
        }
      },
      continuation: {
        tokenize: function (e, t, r) {
          var n = this;
          return (
            (n.containerState._closeFlow = void 0),
            e.check(
              a3,
              function (r) {
                return (
                  (n.containerState.furtherBlankLines =
                    n.containerState.furtherBlankLines ||
                    n.containerState.initialBlankLine),
                  X5(e, t, "listItemIndent", n.containerState.size + 1)(r)
                );
              },
              function (r) {
                if (n.containerState.furtherBlankLines || !$5(r))
                  return (
                    (n.containerState.furtherBlankLines = void 0),
                    (n.containerState.initialBlankLine = void 0),
                    i(r)
                  );
                return (
                  (n.containerState.furtherBlankLines = void 0),
                  (n.containerState.initialBlankLine = void 0),
                  e.attempt(G3, t, i)(r)
                );
              }
            )
          );
          function i(i) {
            return (
              (n.containerState._closeFlow = !0),
              (n.interrupt = void 0),
              X5(
                e,
                e.attempt(q3, t, r),
                "linePrefix",
                n.parser.constructs.disable.null.includes("codeIndented")
                  ? void 0
                  : 4
              )(i)
            );
          }
        },
      },
      exit: function (e) {
        e.exit(this.containerState.type);
      },
    },
    V3 = {
      tokenize: function (e, t, r) {
        var n = this;
        return X5(
          e,
          function (e) {
            var i = n.events[n.events.length - 1];
            return !$5(e) && i && "listItemPrefixWhitespace" === i[1].type
              ? t(e)
              : r(e);
          },
          "listItemPrefixWhitespace",
          n.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 5
        );
      },
      partial: !0,
    },
    G3 = {
      tokenize: function (e, t, r) {
        var n = this;
        return X5(
          e,
          function (e) {
            var i = n.events[n.events.length - 1];
            return i &&
              "listItemIndent" === i[1].type &&
              i[2].sliceSerialize(i[1], !0).length === n.containerState.size
              ? t(e)
              : r(e);
          },
          "listItemIndent",
          n.containerState.size + 1
        );
      },
      partial: !0,
    };
  var $3 = {
    name: "setextUnderline",
    tokenize: function (e, t, r) {
      var n,
        i = this;
      return function (t) {
        var a,
          u = i.events.length;
        for (; u--; )
          if (
            "lineEnding" !== i.events[u][1].type &&
            "linePrefix" !== i.events[u][1].type &&
            "content" !== i.events[u][1].type
          ) {
            a = "paragraph" === i.events[u][1].type;
            break;
          }
        if (!i.parser.lazy[i.now().line] && (i.interrupt || a))
          return (
            e.enter("setextHeadingLine"),
            (n = t),
            (function (t) {
              return e.enter("setextHeadingLineSequence"), o(t);
            })(t)
          );
        return r(t);
      };
      function o(t) {
        return t === n
          ? (e.consume(t), o)
          : (e.exit("setextHeadingLineSequence"),
            $5(t) ? X5(e, a, "lineSuffix")(t) : a(t));
      }
      function a(n) {
        return null === n || V5(n) ? (e.exit("setextHeadingLine"), t(n)) : r(n);
      }
    },
    resolveTo: function (e, t) {
      var r,
        n,
        i,
        o = e.length;
      for (; o--; )
        if ("enter" === e[o][0]) {
          if ("content" === e[o][1].type) {
            r = o;
            break;
          }
          "paragraph" === e[o][1].type && (n = o);
        } else
          "content" === e[o][1].type && e.splice(o, 1),
            i || "definition" !== e[o][1].type || (i = o);
      var a = {
        type: "setextHeading",
        start: Object.assign({}, e[n][1].start),
        end: Object.assign({}, e[e.length - 1][1].end),
      };
      (e[n][1].type = "setextHeadingText"),
        i
          ? (e.splice(n, 0, ["enter", a, t]),
            e.splice(i + 1, 0, ["exit", e[r][1], t]),
            (e[r][1].end = Object.assign({}, e[i][1].end)))
          : (e[r][1] = a);
      return e.push(["exit", a, t]), e;
    },
  };
  var Y3 = {
    tokenize: function (e) {
      var t = this,
        r = e.attempt(
          a3,
          function (n) {
            if (null === n) return void e.consume(n);
            return (
              e.enter("lineEndingBlank"),
              e.consume(n),
              e.exit("lineEndingBlank"),
              (t.currentConstruct = void 0),
              r
            );
          },
          e.attempt(
            this.parser.constructs.flowInitial,
            n,
            X5(
              e,
              e.attempt(this.parser.constructs.flow, n, e.attempt(b3, n)),
              "linePrefix"
            )
          )
        );
      return r;
      function n(n) {
        if (null !== n)
          return (
            e.enter("lineEnding"),
            e.consume(n),
            e.exit("lineEnding"),
            (t.currentConstruct = void 0),
            r
          );
        e.consume(n);
      }
    },
  };
  var K3,
    J3,
    X3 = { resolveAll: t8() },
    Q3 = e8("string"),
    Z3 = e8("text");
  function e8(e) {
    return {
      tokenize: function (t) {
        var r = this,
          n = this.parser.constructs[e],
          i = t.attempt(n, o, a);
        return o;
        function o(e) {
          return c(e) ? i(e) : a(e);
        }
        function a(e) {
          if (null !== e) return t.enter("data"), t.consume(e), u;
          t.consume(e);
        }
        function u(e) {
          return c(e) ? (t.exit("data"), i(e)) : (t.consume(e), u);
        }
        function c(e) {
          if (null === e) return !0;
          var t = n[e],
            i = -1;
          if (t)
            for (; ++i < t.length; ) {
              var o = t[i];
              if (!o.previous || o.previous.call(r, r.previous)) return !0;
            }
          return !1;
        }
      },
      resolveAll: t8("text" === e ? r8 : void 0),
    };
  }
  function t8(e) {
    return function (t, r) {
      var n,
        i = -1;
      for (; ++i <= t.length; )
        void 0 === n
          ? t[i] && "data" === t[i][1].type && ((n = i), i++)
          : (t[i] && "data" === t[i][1].type) ||
            (i !== n + 2 &&
              ((t[n][1].end = t[i - 1][1].end),
              t.splice(n + 2, i - n - 2),
              (i = n + 2)),
            (n = void 0));
      return e ? e(t, r) : t;
    };
  }
  function r8(e, t) {
    for (var r = 0; ++r <= e.length; )
      if (
        (r === e.length || "lineEnding" === e[r][1].type) &&
        "data" === e[r - 1][1].type
      ) {
        for (
          var n = e[r - 1][1],
            i = t.sliceStream(n),
            o = i.length,
            a = -1,
            u = 0,
            c = void 0;
          o--;

        ) {
          var s = i[o];
          if ("string" == typeof s) {
            for (a = s.length; 32 === s.charCodeAt(a - 1); ) u++, a--;
            if (a) break;
            a = -1;
          } else if (-2 === s) (c = !0), u++;
          else if (-1 !== s) {
            o++;
            break;
          }
        }
        if (u) {
          var f = {
            type:
              r === e.length || c || u < 2 ? "lineSuffix" : "hardBreakTrailing",
            start: {
              line: n.end.line,
              column: n.end.column - u,
              offset: n.end.offset - u,
              _index: n.start._index + o,
              _bufferIndex: o ? a : n.start._bufferIndex + a,
            },
            end: Object.assign({}, n.end),
          };
          (n.end = Object.assign({}, f.start)),
            n.start.offset === n.end.offset
              ? Object.assign(n, f)
              : (e.splice(r, 0, ["enter", f, t], ["exit", f, t]), (r += 2));
        }
        r++;
      }
    return e;
  }
  function n8(e, t, r) {
    var n = Object.assign(
        r ? Object.assign({}, r) : { line: 1, column: 1, offset: 0 },
        { _index: 0, _bufferIndex: -1 }
      ),
      i = {},
      o = [],
      a = [],
      u = [],
      c = {
        consume: function (e) {
          V5(e)
            ? (n.line++, (n.column = 1), (n.offset += -3 === e ? 2 : 1), m())
            : -1 !== e && (n.column++, n.offset++);
          n._bufferIndex < 0
            ? n._index++
            : (n._bufferIndex++,
              n._bufferIndex === a[n._index].length &&
                ((n._bufferIndex = -1), n._index++));
          s.previous = e;
        },
        enter: function (e, t) {
          var r = t || {};
          return (
            (r.type = e),
            (r.start = h()),
            s.events.push(["enter", r, s]),
            u.push(r),
            r
          );
        },
        exit: function (e) {
          var t = u.pop();
          return (t.end = h()), s.events.push(["exit", t, s]), t;
        },
        attempt: g(function (e, t) {
          y(e, t.from);
        }),
        check: g(v),
        interrupt: g(v, { interrupt: !0 }),
      },
      s = {
        previous: null,
        code: null,
        containerState: {},
        events: [],
        parser: e,
        sliceStream: l,
        sliceSerialize: function (e, t) {
          return (function (e, t) {
            var r,
              n = -1,
              i = [];
            for (; ++n < e.length; ) {
              var o = e[n],
                a = void 0;
              if ("string" == typeof o) a = o;
              else
                switch (o) {
                  case -5:
                    a = "\r";
                    break;
                  case -4:
                    a = "\n";
                    break;
                  case -3:
                    a = "\r\n";
                    break;
                  case -2:
                    a = t ? " " : "\t";
                    break;
                  case -1:
                    if (!t && r) continue;
                    a = " ";
                    break;
                  default:
                    a = String.fromCharCode(o);
                }
              (r = -2 === o), i.push(a);
            }
            return i.join("");
          })(l(e), t);
        },
        now: h,
        defineSkip: function (e) {
          (i[e.line] = e.column), m();
        },
        write: function (e) {
          if (((a = C5(a, e)), p(), null !== a[a.length - 1])) return [];
          return y(t, 0), (s.events = r3(o, s.events, s)), s.events;
        },
      },
      f = t.tokenize.call(s, c);
    return t.resolveAll && o.push(t), s;
    function l(e) {
      return (function (e, t) {
        var r,
          n = t.start._index,
          i = t.start._bufferIndex,
          o = t.end._index,
          a = t.end._bufferIndex;
        if (n === o) r = [e[n].slice(i, a)];
        else {
          if (((r = e.slice(n, o)), i > -1)) {
            var u = r[0];
            "string" == typeof u ? (r[0] = u.slice(i)) : r.shift();
          }
          a > 0 && r.push(e[o].slice(0, a));
        }
        return r;
      })(a, e);
    }
    function h() {
      var e = n;
      return {
        line: e.line,
        column: e.column,
        offset: e.offset,
        _index: e._index,
        _bufferIndex: e._bufferIndex,
      };
    }
    function p() {
      for (var e; n._index < a.length; ) {
        var t = a[n._index];
        if ("string" == typeof t)
          for (
            e = n._index, n._bufferIndex < 0 && (n._bufferIndex = 0);
            n._index === e && n._bufferIndex < t.length;

          )
            d(t.charCodeAt(n._bufferIndex));
        else d(t);
      }
    }
    function d(e) {
      f = f(e);
    }
    function v(e, t) {
      t.restore();
    }
    function g(e, t) {
      return function (r, i, o) {
        var a, f, l, p;
        return Array.isArray(r)
          ? d(r)
          : "tokenize" in r
          ? d([r])
          : (function (e) {
              return t;
              function t(t) {
                var r = null !== t && e[t],
                  n = null !== t && e.null;
                return d(
                  [].concat(
                    x(Array.isArray(r) ? r : r ? [r] : []),
                    x(Array.isArray(n) ? n : n ? [n] : [])
                  )
                )(t);
              }
            })(r);
        function d(e) {
          return (a = e), (f = 0), 0 === e.length ? o : v(e[f]);
        }
        function v(e) {
          return function (r) {
            (p = (function () {
              var e = h(),
                t = s.previous,
                r = s.currentConstruct,
                i = s.events.length,
                o = Array.from(u);
              return { restore: a, from: i };
              function a() {
                (n = e),
                  (s.previous = t),
                  (s.currentConstruct = r),
                  (s.events.length = i),
                  (u = o),
                  m();
              }
            })()),
              (l = e),
              e.partial || (s.currentConstruct = e);
            if (e.name && s.parser.constructs.disable.null.includes(e.name))
              return y();
            return e.tokenize.call(
              t ? Object.assign(Object.create(s), t) : s,
              c,
              g,
              y
            )(r);
          };
        }
        function g(t) {
          return e(l, p), i;
        }
        function y(e) {
          return p.restore(), ++f < a.length ? v(a[f]) : o;
        }
      };
    }
    function y(e, t) {
      e.resolveAll && !o.includes(e) && o.push(e),
        e.resolve &&
          j5(s.events, t, s.events.length - t, e.resolve(s.events.slice(t), s)),
        e.resolveTo && (s.events = e.resolveTo(s.events, s));
    }
    function m() {
      n.line in i &&
        n.column < 2 &&
        ((n.column = i[n.line]), (n.offset += i[n.line] - 1));
    }
  }
  var i8 =
      (g(
        g(
          g(
            g(
              g(
                g(
                  g(g(g(g((K3 = {}), 42, q3), 43, q3), 45, q3), 48, q3),
                  49,
                  q3
                ),
                50,
                q3
              ),
              51,
              q3
            ),
            52,
            q3
          ),
          53,
          q3
        ),
        54,
        q3
      ),
      g(g(g(g(K3, 55, q3), 56, q3), 57, q3), 62, u3)),
    o8 = g({}, 91, k3),
    a8 = g(g(g({}, -2, d3), -1, d3), 32, d3),
    u8 = g(
      g(
        g(
          g(g(g(g(g({}, 35, I3), 42, W3), 45, [$3, W3]), 60, F3), 61, $3),
          95,
          W3
        ),
        96,
        p3
      ),
      126,
      p3
    ),
    c8 = g(g({}, 38, l3), 92, c3),
    s8 =
      (g(
        g(
          g(
            g(
              g(
                g(
                  g(g(g(g((J3 = {}), -5, H3), -4, H3), -3, H3), 33, B3),
                  38,
                  l3
                ),
                42,
                n3
              ),
              60,
              [o3, L3]
            ),
            91,
            z3
          ),
          92,
          [R3, c3]
        ),
        93,
        M3
      ),
      g(g(J3, 95, n3), 96, g3)),
    f8 = { null: [n3, X3] };
  const l8 = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        attentionMarkers: { null: [42, 95] },
        contentInitial: o8,
        disable: { null: [] },
        document: i8,
        flow: u8,
        flowInitial: a8,
        insideSpan: f8,
        string: c8,
        text: s8,
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  );
  function h8(e) {
    var t = {
      defined: [],
      lazy: {},
      constructs: (function (e) {
        for (var t = {}, r = -1; ++r < e.length; ) M5(t, e[r]);
        return t;
      })([l8].concat(x((e || {}).extensions || []))),
      content: r(Q5),
      document: r(Z5),
      flow: r(Y3),
      string: r(Q3),
      text: r(Z3),
    };
    return t;
    function r(e) {
      return function (r) {
        return n8(t, e, r);
      };
    }
  }
  var p8 = /[\0\t\n\r]/g;
  function d8(e, t) {
    var r = Number.parseInt(e, t);
    return r < 9 ||
      11 === r ||
      (r > 13 && r < 32) ||
      (r > 126 && r < 160) ||
      (r > 55295 && r < 57344) ||
      (r > 64975 && r < 65008) ||
      !(65535 & ~r) ||
      65534 == (65535 & r) ||
      r > 1114111
      ? "锟�"
      : String.fromCharCode(r);
  }
  var v8 = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
  function g8(e, t, r) {
    if (t) return t;
    if (35 === r.charCodeAt(0)) {
      var n = r.charCodeAt(1),
        i = 120 === n || 88 === n;
      return d8(r.slice(i ? 2 : 1), i ? 16 : 10);
    }
    return f3(r) || e;
  }
  var y8 = {}.hasOwnProperty,
    m8 = function (e, t, r) {
      return (
        "string" != typeof t && ((r = t), (t = void 0)),
        (function (e) {
          var t = {
            transforms: [],
            canContainEols: [
              "emphasis",
              "fragment",
              "heading",
              "paragraph",
              "strong",
            ],
            enter: {
              autolink: u(re),
              autolinkProtocol: T,
              autolinkEmail: T,
              atxHeading: u(Q),
              blockQuote: u($),
              characterEscape: T,
              characterReference: T,
              codeFenced: u(Y),
              codeFencedFenceInfo: c,
              codeFencedFenceMeta: c,
              codeIndented: u(Y, c),
              codeText: u(K, c),
              codeTextData: T,
              data: T,
              codeFlowValue: T,
              definition: u(J),
              definitionDestinationString: c,
              definitionLabelString: c,
              definitionTitleString: c,
              emphasis: u(X),
              hardBreakEscape: u(Z),
              hardBreakTrailing: u(Z),
              htmlFlow: u(ee, c),
              htmlFlowData: T,
              htmlText: u(ee, c),
              htmlTextData: T,
              image: u(te),
              label: c,
              link: u(re),
              listItem: u(ie),
              listItemValue: d,
              listOrdered: u(ne, p),
              listUnordered: u(ne),
              paragraph: u(oe),
              reference: z,
              referenceString: c,
              resourceDestinationString: c,
              resourceTitleString: c,
              setextHeading: u(Q),
              strong: u(ae),
              thematicBreak: u(ce),
            },
            exit: {
              atxHeading: f(),
              atxHeadingSequence: S,
              autolink: f(),
              autolinkEmail: G,
              autolinkProtocol: V,
              blockQuote: f(),
              characterEscapeValue: R,
              characterReferenceMarkerHexadecimal: W,
              characterReferenceMarkerNumeric: W,
              characterReferenceValue: q,
              codeFenced: f(m),
              codeFencedFence: y,
              codeFencedFenceInfo: v,
              codeFencedFenceMeta: g,
              codeFlowValue: R,
              codeIndented: f(b),
              codeText: f(j),
              codeTextData: R,
              data: R,
              definition: f(),
              definitionDestinationString: x,
              definitionLabelString: w,
              definitionTitleString: E,
              emphasis: f(),
              hardBreakEscape: f(_),
              hardBreakTrailing: f(_),
              htmlFlow: f(P),
              htmlFlowData: R,
              htmlText: f(F),
              htmlTextData: R,
              image: f(L),
              label: D,
              labelText: M,
              lineEnding: I,
              link: f(C),
              listItem: f(),
              listOrdered: f(),
              listUnordered: f(),
              paragraph: f(),
              referenceString: H,
              resourceDestinationString: N,
              resourceTitleString: U,
              resource: B,
              setextHeading: f(k),
              setextHeadingLineSequence: O,
              setextHeadingText: A,
              strong: f(),
              thematicBreak: f(),
            },
          };
          w8(t, (e || {}).mdastExtensions || []);
          var r = {};
          return n;
          function n(e) {
            for (
              var r = { type: "root", children: [] },
                n = {
                  stack: [r],
                  tokenStack: [],
                  config: t,
                  enter: s,
                  exit: l,
                  buffer: c,
                  resume: h,
                  setData: o,
                  getData: a,
                },
                u = [],
                f = -1;
              ++f < e.length;

            ) {
              if (
                "listOrdered" === e[f][1].type ||
                "listUnordered" === e[f][1].type
              )
                if ("enter" === e[f][0]) u.push(f);
                else f = i(e, u.pop(), f);
            }
            for (f = -1; ++f < e.length; ) {
              var p = t[e[f][0]];
              y8.call(p, e[f][1].type) &&
                p[e[f][1].type].call(
                  Object.assign({ sliceSerialize: e[f][2].sliceSerialize }, n),
                  e[f][1]
                );
            }
            if (n.tokenStack.length > 0) {
              var d = n.tokenStack[n.tokenStack.length - 1];
              (d[1] || x8).call(n, void 0, d[0]);
            }
            for (
              r.position = {
                start: b8(
                  e.length > 0
                    ? e[0][1].start
                    : { line: 1, column: 1, offset: 0 }
                ),
                end: b8(
                  e.length > 0
                    ? e[e.length - 2][1].end
                    : { line: 1, column: 1, offset: 0 }
                ),
              },
                f = -1;
              ++f < t.transforms.length;

            )
              r = t.transforms[f](r) || r;
            return r;
          }
          function i(e, t, r) {
            for (var n, i, o, a, u = t - 1, c = -1, s = !1; ++u <= r; ) {
              var f = e[u];
              if (
                ("listUnordered" === f[1].type ||
                "listOrdered" === f[1].type ||
                "blockQuote" === f[1].type
                  ? ("enter" === f[0] ? c++ : c--, (a = void 0))
                  : "lineEndingBlank" === f[1].type
                  ? "enter" === f[0] &&
                    (!n || a || c || o || (o = u), (a = void 0))
                  : "linePrefix" === f[1].type ||
                    "listItemValue" === f[1].type ||
                    "listItemMarker" === f[1].type ||
                    "listItemPrefix" === f[1].type ||
                    "listItemPrefixWhitespace" === f[1].type ||
                    (a = void 0),
                (!c && "enter" === f[0] && "listItemPrefix" === f[1].type) ||
                  (-1 === c &&
                    "exit" === f[0] &&
                    ("listUnordered" === f[1].type ||
                      "listOrdered" === f[1].type)))
              ) {
                if (n) {
                  var l = u;
                  for (i = void 0; l--; ) {
                    var h = e[l];
                    if (
                      "lineEnding" === h[1].type ||
                      "lineEndingBlank" === h[1].type
                    ) {
                      if ("exit" === h[0]) continue;
                      i && ((e[i][1].type = "lineEndingBlank"), (s = !0)),
                        (h[1].type = "lineEnding"),
                        (i = l);
                    } else if (
                      "linePrefix" !== h[1].type &&
                      "blockQuotePrefix" !== h[1].type &&
                      "blockQuotePrefixWhitespace" !== h[1].type &&
                      "blockQuoteMarker" !== h[1].type &&
                      "listItemIndent" !== h[1].type
                    )
                      break;
                  }
                  o && (!i || o < i) && (n._spread = !0),
                    (n.end = Object.assign({}, i ? e[i][1].start : f[1].end)),
                    e.splice(i || u, 0, ["exit", n, f[2]]),
                    u++,
                    r++;
                }
                "listItemPrefix" === f[1].type &&
                  ((n = {
                    type: "listItem",
                    _spread: !1,
                    start: Object.assign({}, f[1].start),
                    end: void 0,
                  }),
                  e.splice(u, 0, ["enter", n, f[2]]),
                  u++,
                  r++,
                  (o = void 0),
                  (a = !0));
              }
            }
            return (e[t][1]._spread = s), r;
          }
          function o(e, t) {
            r[e] = t;
          }
          function a(e) {
            return r[e];
          }
          function u(e, t) {
            return r;
            function r(r) {
              s.call(this, e(r), r), t && t.call(this, r);
            }
          }
          function c() {
            this.stack.push({ type: "fragment", children: [] });
          }
          function s(e, t, r) {
            return (
              this.stack[this.stack.length - 1].children.push(e),
              this.stack.push(e),
              this.tokenStack.push([t, r]),
              (e.position = { start: b8(t.start) }),
              e
            );
          }
          function f(e) {
            return t;
            function t(t) {
              e && e.call(this, t), l.call(this, t);
            }
          }
          function l(e, t) {
            var r = this.stack.pop(),
              n = this.tokenStack.pop();
            if (!n)
              throw new Error(
                "Cannot close `" +
                  e.type +
                  "` (" +
                  a5({ start: e.start, end: e.end }) +
                  "): it鈥檚 not open"
              );
            return (
              n[0].type !== e.type &&
                (t ? t.call(this, e, n[0]) : (n[1] || x8).call(this, e, n[0])),
              (r.position.end = b8(e.end)),
              r
            );
          }
          function h() {
            return (function (e, t) {
              var r = t || _5;
              return P5(
                e,
                "boolean" != typeof r.includeImageAlt || r.includeImageAlt,
                "boolean" != typeof r.includeHtml || r.includeHtml
              );
            })(this.stack.pop());
          }
          function p() {
            o("expectingFirstListItemValue", !0);
          }
          function d(e) {
            a("expectingFirstListItemValue") &&
              ((this.stack[this.stack.length - 2].start = Number.parseInt(
                this.sliceSerialize(e),
                10
              )),
              o("expectingFirstListItemValue"));
          }
          function v() {
            var e = this.resume();
            this.stack[this.stack.length - 1].lang = e;
          }
          function g() {
            var e = this.resume();
            this.stack[this.stack.length - 1].meta = e;
          }
          function y() {
            a("flowCodeInside") || (this.buffer(), o("flowCodeInside", !0));
          }
          function m() {
            var e = this.resume();
            (this.stack[this.stack.length - 1].value = e.replace(
              /^(\r?\n|\r)|(\r?\n|\r)$/g,
              ""
            )),
              o("flowCodeInside");
          }
          function b() {
            var e = this.resume();
            this.stack[this.stack.length - 1].value = e.replace(
              /(\r?\n|\r)$/g,
              ""
            );
          }
          function w(e) {
            var t = this.resume(),
              r = this.stack[this.stack.length - 1];
            (r.label = t),
              (r.identifier = O3(this.sliceSerialize(e)).toLowerCase());
          }
          function E() {
            var e = this.resume();
            this.stack[this.stack.length - 1].title = e;
          }
          function x() {
            var e = this.resume();
            this.stack[this.stack.length - 1].url = e;
          }
          function S(e) {
            var t = this.stack[this.stack.length - 1];
            if (!t.depth) {
              var r = this.sliceSerialize(e).length;
              t.depth = r;
            }
          }
          function A() {
            o("setextHeadingSlurpLineEnding", !0);
          }
          function O(e) {
            this.stack[this.stack.length - 1].depth =
              61 === this.sliceSerialize(e).charCodeAt(0) ? 1 : 2;
          }
          function k() {
            o("setextHeadingSlurpLineEnding");
          }
          function T(e) {
            var t = this.stack[this.stack.length - 1],
              r = t.children[t.children.length - 1];
            (r && "text" === r.type) ||
              (((r = ue()).position = { start: b8(e.start) }),
              t.children.push(r)),
              this.stack.push(r);
          }
          function R(e) {
            var t = this.stack.pop();
            (t.value += this.sliceSerialize(e)), (t.position.end = b8(e.end));
          }
          function I(e) {
            var r = this.stack[this.stack.length - 1];
            if (a("atHardBreak"))
              return (
                (r.children[r.children.length - 1].position.end = b8(e.end)),
                void o("atHardBreak")
              );
            !a("setextHeadingSlurpLineEnding") &&
              t.canContainEols.includes(r.type) &&
              (T.call(this, e), R.call(this, e));
          }
          function _() {
            o("atHardBreak", !0);
          }
          function P() {
            var e = this.resume();
            this.stack[this.stack.length - 1].value = e;
          }
          function F() {
            var e = this.resume();
            this.stack[this.stack.length - 1].value = e;
          }
          function j() {
            var e = this.resume();
            this.stack[this.stack.length - 1].value = e;
          }
          function C() {
            var e = this.stack[this.stack.length - 1];
            if (a("inReference")) {
              var t = a("referenceType") || "shortcut";
              (e.type += "Reference"),
                (e.referenceType = t),
                delete e.url,
                delete e.title;
            } else delete e.identifier, delete e.label;
            o("referenceType");
          }
          function L() {
            var e = this.stack[this.stack.length - 1];
            if (a("inReference")) {
              var t = a("referenceType") || "shortcut";
              (e.type += "Reference"),
                (e.referenceType = t),
                delete e.url,
                delete e.title;
            } else delete e.identifier, delete e.label;
            o("referenceType");
          }
          function M(e) {
            var t = this.sliceSerialize(e),
              r = this.stack[this.stack.length - 2];
            (r.label = (function (e) {
              return e.replace(v8, g8);
            })(t)),
              (r.identifier = O3(t).toLowerCase());
          }
          function D() {
            var e = this.stack[this.stack.length - 1],
              t = this.resume(),
              r = this.stack[this.stack.length - 1];
            if ((o("inReference", !0), "link" === r.type)) {
              var n = e.children;
              r.children = n;
            } else r.alt = t;
          }
          function N() {
            var e = this.resume();
            this.stack[this.stack.length - 1].url = e;
          }
          function U() {
            var e = this.resume();
            this.stack[this.stack.length - 1].title = e;
          }
          function B() {
            o("inReference");
          }
          function z() {
            o("referenceType", "collapsed");
          }
          function H(e) {
            var t = this.resume(),
              r = this.stack[this.stack.length - 1];
            (r.label = t),
              (r.identifier = O3(this.sliceSerialize(e)).toLowerCase()),
              o("referenceType", "full");
          }
          function W(e) {
            o("characterReferenceType", e.type);
          }
          function q(e) {
            var t,
              r = this.sliceSerialize(e),
              n = a("characterReferenceType");
            n
              ? ((t = d8(r, "characterReferenceMarkerNumeric" === n ? 10 : 16)),
                o("characterReferenceType"))
              : (t = f3(r));
            var i = this.stack.pop();
            (i.value += t), (i.position.end = b8(e.end));
          }
          function V(e) {
            R.call(this, e),
              (this.stack[this.stack.length - 1].url = this.sliceSerialize(e));
          }
          function G(e) {
            R.call(this, e),
              (this.stack[this.stack.length - 1].url =
                "mailto:" + this.sliceSerialize(e));
          }
          function $() {
            return { type: "blockquote", children: [] };
          }
          function Y() {
            return { type: "code", lang: null, meta: null, value: "" };
          }
          function K() {
            return { type: "inlineCode", value: "" };
          }
          function J() {
            return {
              type: "definition",
              identifier: "",
              label: null,
              title: null,
              url: "",
            };
          }
          function X() {
            return { type: "emphasis", children: [] };
          }
          function Q() {
            return { type: "heading", depth: void 0, children: [] };
          }
          function Z() {
            return { type: "break" };
          }
          function ee() {
            return { type: "html", value: "" };
          }
          function te() {
            return { type: "image", title: null, url: "", alt: null };
          }
          function re() {
            return { type: "link", title: null, url: "", children: [] };
          }
          function ne(e) {
            return {
              type: "list",
              ordered: "listOrdered" === e.type,
              start: null,
              spread: e._spread,
              children: [],
            };
          }
          function ie(e) {
            return {
              type: "listItem",
              spread: e._spread,
              checked: null,
              children: [],
            };
          }
          function oe() {
            return { type: "paragraph", children: [] };
          }
          function ae() {
            return { type: "strong", children: [] };
          }
          function ue() {
            return { type: "text", value: "" };
          }
          function ce() {
            return { type: "thematicBreak" };
          }
        })(r)(
          (function (e) {
            for (; !y3(e); );
            return e;
          })(
            h8(r)
              .document()
              .write(
                ((i = 1),
                (o = ""),
                (a = !0),
                function (e, t, r) {
                  var u,
                    c,
                    s,
                    f,
                    l,
                    h = [];
                  for (
                    e = o + e.toString(t),
                      s = 0,
                      o = "",
                      a && (65279 === e.charCodeAt(0) && s++, (a = void 0));
                    s < e.length;

                  ) {
                    if (
                      ((p8.lastIndex = s),
                      (f =
                        (u = p8.exec(e)) && void 0 !== u.index
                          ? u.index
                          : e.length),
                      (l = e.charCodeAt(f)),
                      !u)
                    ) {
                      o = e.slice(s);
                      break;
                    }
                    if (10 === l && s === f && n) h.push(-3), (n = void 0);
                    else
                      switch (
                        (n && (h.push(-5), (n = void 0)),
                        s < f && (h.push(e.slice(s, f)), (i += f - s)),
                        l)
                      ) {
                        case 0:
                          h.push(65533), i++;
                          break;
                        case 9:
                          for (c = 4 * Math.ceil(i / 4), h.push(-2); i++ < c; )
                            h.push(-1);
                          break;
                        case 10:
                          h.push(-4), (i = 1);
                          break;
                        default:
                          (n = !0), (i = 1);
                      }
                    s = f + 1;
                  }
                  return (
                    r && (n && h.push(-5), o && h.push(o), h.push(null)), h
                  );
                })(e, t, !0)
              )
          )
        )
      );
      var n, i, o, a;
    };
  function b8(e) {
    return { line: e.line, column: e.column, offset: e.offset };
  }
  function w8(e, t) {
    for (var r = -1; ++r < t.length; ) {
      var n = t[r];
      Array.isArray(n) ? w8(e, n) : E8(e, n);
    }
  }
  function E8(e, t) {
    var r;
    for (r in t)
      if (y8.call(t, r))
        if ("canContainEols" === r) {
          var n,
            i = t[r];
          if (i) (n = e[r]).push.apply(n, x(i));
        } else if ("transforms" === r) {
          var o,
            a = t[r];
          if (a) (o = e[r]).push.apply(o, x(a));
        } else if ("enter" === r || "exit" === r) {
          var u = t[r];
          u && Object.assign(e[r], u);
        }
  }
  function x8(e, t) {
    throw e
      ? new Error(
          "Cannot close `" +
            e.type +
            "` (" +
            a5({ start: e.start, end: e.end }) +
            "): a different token (`" +
            t.type +
            "`, " +
            a5({ start: t.start, end: t.end }) +
            ") is open"
        )
      : new Error(
          "Cannot close document, a token (`" +
            t.type +
            "`, " +
            a5({ start: t.start, end: t.end }) +
            ") is still open"
        );
  }
  function S8(e) {
    var t = this;
    Object.assign(this, {
      Parser: function (r) {
        var n = t.data("settings");
        return m8(
          r,
          Object.assign({}, n, e, {
            extensions: t.data("micromarkExtensions") || [],
            mdastExtensions: t.data("fromMarkdownExtensions") || [],
          })
        );
      },
    });
  }
  function A8(e, t = e[0], r = 0, n = 0, i = 0, o = 0) {
    r++;
    for (let a = 0; a < e.length; a++) {
      const u = e[a];
      if (
        (n++,
        (u.depth = r),
        (u.sort = a),
        (u.parent = t),
        (u.direction = 1),
        (u.expanded = !0),
        (u.id = n),
        (u.showTip = !1),
        (u.parentId = i),
        (u.value = O8(u.value)),
        r < 4 && "catalog" != u.parent.type && (o++, (u.pageIndex = o)),
        "catalog" != u.type &&
          "ending" != u.type &&
          (u.depth < 5 ? (u.type = "title") : (u.type = "text")),
        u.children && u.children.length)
      ) {
        const { id: e, pageIndex: t } = A8(u.children, u, r, n, u.id, o);
        (n = e), (o = t);
      } else u.children = [];
    }
    return { id: n, pageIndex: o };
  }
  function O8(e) {
    if (null != e && "" != e) {
      return e.replace(/\v/g, "");
    }
    return "";
  }
  const k8 = /\n?(#\s+.*)/,
    T8 = /(#[^#].*)|(-\S)/g;
  function R8(e) {
    return (function (e) {
      var t, r;
      const n = e.filter(
          (e) =>
            "heading" == e.type || "paragraph" == e.type || "list" == e.type
        ),
        i = [];
      let o = 0;
      for (let u = 0; u < n.length; u++) {
        const e = n[u];
        e.id = u + 1;
        const a = {
          type: "",
          depth: 0,
          id: e.id,
          parentId: 0,
          value: "",
          children: [],
          index: 0,
        };
        if ("heading" == e.type) {
          if (1 == e.depth) {
            if (o > 0) continue;
            o++;
          }
          (a.type = "title"),
            (a.depth = e.depth),
            (a.value = null == (t = e.children[0]) ? void 0 : t.value),
            (a.parentId = (null == (r = I8(i, e.depth)) ? void 0 : r.id) || 0);
        } else {
          const t = i.filter((e) => "title" == e.type),
            r = t[t.length - 1];
          if (2 == a.id) {
            r.value += e.children[0].value;
            continue;
          }
          (a.depth = r.depth + 1),
            (a.parentId = r.id),
            (a.type = e.type),
            (a.depth = r.depth + 1);
          const n = P8([e], [], a.depth);
          a.children = n;
        }
        i.push(a);
      }
      const a = (function (e) {
        if (!Array.isArray(e) || !e.length) return;
        const t = {};
        e.forEach((e) => (t[e.id] = e));
        const r = [];
        return (
          e.forEach((e) => {
            0 == e.id && (e.root = !0);
            const n = t[e.parentId];
            n
              ? "paragraph" == e.type || "list" == e.type
                ? (n.children || (n.children = [])).push(...e.children)
                : (n.children || (n.children = [])).push(e)
              : "paragraph" == e.type || "list" == e.type
              ? r.push(...e.children)
              : r.push(e);
          }),
          r
        );
      })(i);
      return (
        F8(a),
        A8(a),
        j8(a),
        (function (e, t = "zh") {
          const r = e[0].children,
            n = r.findIndex((e) => "catalog" == e.type);
          n > -1 && r.splice(n, 1);
          const i = r.findIndex((e) => "ending" == e.type);
          i > -1 && r.splice(i, 1);
          const o = {
              zh: { catalog: "鐩綍", ending: "缁撹" },
              en: { catalog: "catalog", ending: "ending" },
            },
            a = {
              type: "catalog",
              value: o[t].catalog,
              depth: 2,
              children: [],
            },
            u = { type: "ending", value: o[t].ending, depth: 2, children: [] };
          for (const c of r)
            a.children.push({
              type: "title",
              value: c.value,
              depth: 3,
              children: [],
              parentId: 1,
              id: 100,
            });
          r.unshift(a), r.push(u);
        })(a),
        A8(a),
        a
      );
    })(E5().use(S8).parse(e).children);
  }
  function I8(e, t) {
    const r = e.filter((e) => e.depth == t - 1);
    return r.length > 0 ? r[r.length - 1] : null;
  }
  function _8(e, t = []) {
    for (const r of e)
      r.value
        ? t.push(r.value)
        : r.children &&
          r.children.length > 0 &&
          t.push(...r.children.map((e) => e.value));
    return t.join("");
  }
  function P8(e, t = [], r) {
    for (const n of e)
      if (
        ("paragraph" == n.type &&
          t.push({
            type: 5 == r ? "text" : "title",
            value: _8(n.children),
            originType: "paragraph",
          }),
        "list" == n.type)
      ) {
        const e = [];
        for (const t of n.children) {
          let n = P8(t.children, [], r + 1);
          (n = n.map((e) => ({ ...e, originType: "list" }))), e.push(...n);
        }
        if (t.length > 0) {
          t[t.length - 1].children = e;
        } else t.push(...e);
      }
    return t;
  }
  function F8(e) {
    for (const t of e)
      "title" != t.type || (t.children && 0 != t.children.length)
        ? t.children && t.children.length > 0 && F8(t.children)
        : (t.lastLevel = !0);
  }
  function j8(e) {
    for (let t = e.length - 1; t >= 0; t--) {
      const r = e[t];
      r.del && e.splice(t, 1),
        r.children && r.children.length > 0 && j8(r.children);
    }
  }
  function C8(e) {
    return R8(
      (function (e) {
        let t = (e || "")
          .trim()
          .replace(/\xa0/g, " ")
          .replace("```", "")
          .replace("\nn", "\n");
        const r = t.match(k8);
        if (null != r && null != r[1]) {
          const e = t.indexOf(r[1]);
          t = t.slice(e);
        }
        return (t = t.replace(T8, (e) => e.slice(0, 1) + " " + e.slice(1))), t;
      })(e)
    );
  }
  var L8,
    M8 = "function" == typeof Buffer,
    D8 =
      ("function" == typeof TextDecoder && new TextDecoder(),
      "function" == typeof TextEncoder ? new TextEncoder() : void 0),
    N8 = Array.prototype.slice.call(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    ),
    U8 =
      ((L8 = {}),
      N8.forEach(function (e, t) {
        return (L8[e] = t);
      }),
      L8),
    B8 =
      /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,
    z8 = String.fromCharCode.bind(String),
    H8 =
      ("function" == typeof Uint8Array.from && Uint8Array.from.bind(Uint8Array),
      function (e) {
        return e.replace(/=/g, "").replace(/[+\/]/g, function (e) {
          return "+" == e ? "-" : "_";
        });
      }),
    W8 = function (e) {
      return e.replace(/[^A-Za-z0-9\+\/]/g, "");
    },
    q8 = function (e) {
      for (var t, r, n, i, o = "", a = e.length % 3, u = 0; u < e.length; ) {
        if (
          (r = e.charCodeAt(u++)) > 255 ||
          (n = e.charCodeAt(u++)) > 255 ||
          (i = e.charCodeAt(u++)) > 255
        )
          throw new TypeError("invalid character found");
        o +=
          N8[((t = (r << 16) | (n << 8) | i) >> 18) & 63] +
          N8[(t >> 12) & 63] +
          N8[(t >> 6) & 63] +
          N8[63 & t];
      }
      return a ? o.slice(0, a - 3) + "===".substring(a) : o;
    },
    V8 =
      "function" == typeof btoa
        ? function (e) {
            return btoa(e);
          }
        : M8
        ? function (e) {
            return Buffer.from(e, "binary").toString("base64");
          }
        : q8,
    G8 = M8
      ? function (e) {
          return Buffer.from(e).toString("base64");
        }
      : function (e) {
          for (var t = [], r = 0, n = e.length; r < n; r += 4096)
            t.push(z8.apply(null, e.subarray(r, r + 4096)));
          return V8(t.join(""));
        },
    $8 = function (e) {
      if (e.length < 2)
        return (t = e.charCodeAt(0)) < 128
          ? e
          : t < 2048
          ? z8(192 | (t >>> 6)) + z8(128 | (63 & t))
          : z8(224 | ((t >>> 12) & 15)) +
            z8(128 | ((t >>> 6) & 63)) +
            z8(128 | (63 & t));
      var t =
        65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
      return (
        z8(240 | ((t >>> 18) & 7)) +
        z8(128 | ((t >>> 12) & 63)) +
        z8(128 | ((t >>> 6) & 63)) +
        z8(128 | (63 & t))
      );
    },
    Y8 = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
    K8 = function (e) {
      return e.replace(Y8, $8);
    },
    J8 = M8
      ? function (e) {
          return Buffer.from(e, "utf8").toString("base64");
        }
      : D8
      ? function (e) {
          return G8(D8.encode(e));
        }
      : function (e) {
          return V8(K8(e));
        },
    X8 = function (e) {
      return arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
        ? H8(J8(e))
        : J8(e);
    },
    Q8 = function (e) {
      if (((e = e.replace(/\s+/g, "")), !B8.test(e)))
        throw new TypeError("malformed base64.");
      e += "==".slice(2 - (3 & e.length));
      for (var t, r, n, i = "", o = 0; o < e.length; )
        (t =
          (U8[e.charAt(o++)] << 18) |
          (U8[e.charAt(o++)] << 12) |
          ((r = U8[e.charAt(o++)]) << 6) |
          (n = U8[e.charAt(o++)])),
          (i +=
            64 === r
              ? z8((t >> 16) & 255)
              : 64 === n
              ? z8((t >> 16) & 255, (t >> 8) & 255)
              : z8((t >> 16) & 255, (t >> 8) & 255, 255 & t));
      return i;
    },
    Z8 = X8;
  function e9(e, t) {
    return function () {
      return e.apply(t, arguments);
    };
  }
  var t9,
    r9 = Object.prototype.toString,
    n9 = Object.getPrototypeOf,
    i9 =
      ((t9 = Object.create(null)),
      function (e) {
        var t = r9.call(e);
        return t9[t] || (t9[t] = t.slice(8, -1).toLowerCase());
      }),
    o9 = function (e) {
      return (
        (e = e.toLowerCase()),
        function (t) {
          return i9(t) === e;
        }
      );
    },
    a9 = function (e) {
      return function (t) {
        return f(t) === e;
      };
    },
    u9 = Array.isArray,
    c9 = a9("undefined");
  var s9 = o9("ArrayBuffer");
  var f9 = a9("string"),
    l9 = a9("function"),
    h9 = a9("number"),
    p9 = function (e) {
      return null !== e && "object" === f(e);
    },
    d9 = function (e) {
      if ("object" !== i9(e)) return !1;
      var t = n9(e);
      return !(
        (null !== t &&
          t !== Object.prototype &&
          null !== Object.getPrototypeOf(t)) ||
        Symbol.toStringTag in e ||
        Symbol.iterator in e
      );
    },
    v9 = o9("Date"),
    g9 = o9("File"),
    y9 = o9("Blob"),
    m9 = o9("FileList"),
    b9 = o9("URLSearchParams");
  function w9(e, t) {
    var r,
      n,
      i = (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {})
        .allOwnKeys,
      o = void 0 !== i && i;
    if (null != e)
      if (("object" !== f(e) && (e = [e]), u9(e)))
        for (r = 0, n = e.length; r < n; r++) t.call(null, e[r], r, e);
      else {
        var a,
          u = o ? Object.getOwnPropertyNames(e) : Object.keys(e),
          c = u.length;
        for (r = 0; r < c; r++) (a = u[r]), t.call(null, e[a], a, e);
      }
  }
  function E9(e, t) {
    t = t.toLowerCase();
    for (var r, n = Object.keys(e), i = n.length; i-- > 0; )
      if (t === (r = n[i]).toLowerCase()) return r;
    return null;
  }
  var x9 =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof self
        ? self
        : "undefined" != typeof window
        ? window
        : global,
    S9 = function (e) {
      return !c9(e) && e !== x9;
    };
  var A9,
    O9,
    k9 =
      ((A9 = "undefined" != typeof Uint8Array && n9(Uint8Array)),
      function (e) {
        return A9 && e instanceof A9;
      }),
    T9 = o9("HTMLFormElement"),
    R9 =
      ((O9 = Object.prototype.hasOwnProperty),
      function (e, t) {
        return O9.call(e, t);
      }),
    I9 = o9("RegExp"),
    _9 = function (e, t) {
      var r = Object.getOwnPropertyDescriptors(e),
        n = {};
      w9(r, function (r, i) {
        var o;
        !1 !== (o = t(r, i, e)) && (n[i] = o || r);
      }),
        Object.defineProperties(e, n);
    },
    P9 = "abcdefghijklmnopqrstuvwxyz",
    F9 = "0123456789",
    j9 = { DIGIT: F9, ALPHA: P9, ALPHA_DIGIT: P9 + P9.toUpperCase() + F9 };
  var C9 = o9("AsyncFunction");
  const L9 = {
    isArray: u9,
    isArrayBuffer: s9,
    isBuffer: function (e) {
      return (
        null !== e &&
        !c9(e) &&
        null !== e.constructor &&
        !c9(e.constructor) &&
        l9(e.constructor.isBuffer) &&
        e.constructor.isBuffer(e)
      );
    },
    isFormData: function (e) {
      var t;
      return (
        e &&
        (("function" == typeof FormData && e instanceof FormData) ||
          (l9(e.append) &&
            ("formdata" === (t = i9(e)) ||
              ("object" === t &&
                l9(e.toString) &&
                "[object FormData]" === e.toString()))))
      );
    },
    isArrayBufferView: function (e) {
      return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
        ? ArrayBuffer.isView(e)
        : e && e.buffer && s9(e.buffer);
    },
    isString: f9,
    isNumber: h9,
    isBoolean: function (e) {
      return !0 === e || !1 === e;
    },
    isObject: p9,
    isPlainObject: d9,
    isUndefined: c9,
    isDate: v9,
    isFile: g9,
    isBlob: y9,
    isRegExp: I9,
    isFunction: l9,
    isStream: function (e) {
      return p9(e) && l9(e.pipe);
    },
    isURLSearchParams: b9,
    isTypedArray: k9,
    isFileList: m9,
    forEach: w9,
    merge: function e() {
      for (
        var t = ((S9(this) && this) || {}).caseless,
          r = {},
          n = function (n, i) {
            var o = (t && E9(r, i)) || i;
            d9(r[o]) && d9(n)
              ? (r[o] = e(r[o], n))
              : d9(n)
              ? (r[o] = e({}, n))
              : u9(n)
              ? (r[o] = n.slice())
              : (r[o] = n);
          },
          i = 0,
          o = arguments.length;
        i < o;
        i++
      )
        arguments[i] && w9(arguments[i], n);
      return r;
    },
    extend: function (e, t, r) {
      return (
        w9(
          t,
          function (t, n) {
            r && l9(t) ? (e[n] = e9(t, r)) : (e[n] = t);
          },
          {
            allOwnKeys: (arguments.length > 3 && void 0 !== arguments[3]
              ? arguments[3]
              : {}
            ).allOwnKeys,
          }
        ),
        e
      );
    },
    trim: function (e) {
      return e.trim
        ? e.trim()
        : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    },
    stripBOM: function (e) {
      return 65279 === e.charCodeAt(0) && (e = e.slice(1)), e;
    },
    inherits: function (e, t, r, n) {
      (e.prototype = Object.create(t.prototype, n)),
        (e.prototype.constructor = e),
        Object.defineProperty(e, "super", { value: t.prototype }),
        r && Object.assign(e.prototype, r);
    },
    toFlatObject: function (e, t, r, n) {
      var i,
        o,
        a,
        u = {};
      if (((t = t || {}), null == e)) return t;
      do {
        for (o = (i = Object.getOwnPropertyNames(e)).length; o-- > 0; )
          (a = i[o]),
            (n && !n(a, e, t)) || u[a] || ((t[a] = e[a]), (u[a] = !0));
        e = !1 !== r && n9(e);
      } while (e && (!r || r(e, t)) && e !== Object.prototype);
      return t;
    },
    kindOf: i9,
    kindOfTest: o9,
    endsWith: function (e, t, r) {
      (e = String(e)),
        (void 0 === r || r > e.length) && (r = e.length),
        (r -= t.length);
      var n = e.indexOf(t, r);
      return -1 !== n && n === r;
    },
    toArray: function (e) {
      if (!e) return null;
      if (u9(e)) return e;
      var t = e.length;
      if (!h9(t)) return null;
      for (var r = new Array(t); t-- > 0; ) r[t] = e[t];
      return r;
    },
    forEachEntry: function (e, t) {
      for (
        var r, n = (e && e[Symbol.iterator]).call(e);
        (r = n.next()) && !r.done;

      ) {
        var i = r.value;
        t.call(e, i[0], i[1]);
      }
    },
    matchAll: function (e, t) {
      for (var r, n = []; null !== (r = e.exec(t)); ) n.push(r);
      return n;
    },
    isHTMLForm: T9,
    hasOwnProperty: R9,
    hasOwnProp: R9,
    reduceDescriptors: _9,
    freezeMethods: function (e) {
      _9(e, function (t, r) {
        if (l9(e) && -1 !== ["arguments", "caller", "callee"].indexOf(r))
          return !1;
        var n = e[r];
        l9(n) &&
          ((t.enumerable = !1),
          "writable" in t
            ? (t.writable = !1)
            : t.set ||
              (t.set = function () {
                throw Error("Can not rewrite read-only method '" + r + "'");
              }));
      });
    },
    toObjectSet: function (e, t) {
      var r = {},
        n = function (e) {
          e.forEach(function (e) {
            r[e] = !0;
          });
        };
      return u9(e) ? n(e) : n(String(e).split(t)), r;
    },
    toCamelCase: function (e) {
      return e
        .toLowerCase()
        .replace(/[-_\s]([a-z\d])(\w*)/g, function (e, t, r) {
          return t.toUpperCase() + r;
        });
    },
    noop: function () {},
    toFiniteNumber: function (e, t) {
      return (e = +e), Number.isFinite(e) ? e : t;
    },
    findKey: E9,
    global: x9,
    isContextDefined: S9,
    ALPHABET: j9,
    generateString: function () {
      for (
        var e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 16,
          t =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : j9.ALPHA_DIGIT,
          r = "",
          n = t.length;
        e--;

      )
        r += t[(Math.random() * n) | 0];
      return r;
    },
    isSpecCompliantForm: function (e) {
      return !!(
        e &&
        l9(e.append) &&
        "FormData" === e[Symbol.toStringTag] &&
        e[Symbol.iterator]
      );
    },
    toJSONObject: function (e) {
      var t = new Array(10),
        r = function (e, n) {
          if (p9(e)) {
            if (t.indexOf(e) >= 0) return;
            if (!("toJSON" in e)) {
              t[n] = e;
              var i = u9(e) ? [] : {};
              return (
                w9(e, function (e, t) {
                  var o = r(e, n + 1);
                  !c9(o) && (i[t] = o);
                }),
                (t[n] = void 0),
                i
              );
            }
          }
          return e;
        };
      return r(e, 0);
    },
    isAsyncFn: C9,
    isThenable: function (e) {
      return e && (p9(e) || l9(e)) && l9(e.then) && l9(e.catch);
    },
  };
  function M9(e, t, r, n, i) {
    Error.call(this),
      Error.captureStackTrace
        ? Error.captureStackTrace(this, this.constructor)
        : (this.stack = new Error().stack),
      (this.message = e),
      (this.name = "AxiosError"),
      t && (this.code = t),
      r && (this.config = r),
      n && (this.request = n),
      i && (this.response = i);
  }
  L9.inherits(M9, Error, {
    toJSON: function () {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: L9.toJSONObject(this.config),
        code: this.code,
        status:
          this.response && this.response.status ? this.response.status : null,
      };
    },
  });
  var D9 = M9.prototype,
    N9 = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL",
  ].forEach(function (e) {
    N9[e] = { value: e };
  }),
    Object.defineProperties(M9, N9),
    Object.defineProperty(D9, "isAxiosError", { value: !0 }),
    (M9.from = function (e, t, r, n, i, o) {
      var a = Object.create(D9);
      return (
        L9.toFlatObject(
          e,
          a,
          function (e) {
            return e !== Error.prototype;
          },
          function (e) {
            return "isAxiosError" !== e;
          }
        ),
        M9.call(a, e.message, t, r, n, i),
        (a.cause = e),
        (a.name = e.name),
        o && Object.assign(a, o),
        a
      );
    });
  function U9(e) {
    return L9.isPlainObject(e) || L9.isArray(e);
  }
  function B9(e) {
    return L9.endsWith(e, "[]") ? e.slice(0, -2) : e;
  }
  function z9(e, t, r) {
    return e
      ? e
          .concat(t)
          .map(function (e, t) {
            return (e = B9(e)), !r && t ? "[" + e + "]" : e;
          })
          .join(r ? "." : "")
      : t;
  }
  var H9 = L9.toFlatObject(L9, {}, null, function (e) {
    return /^is[A-Z]/.test(e);
  });
  function W9(e, t, r) {
    if (!L9.isObject(e)) throw new TypeError("target must be an object");
    t = t || new FormData();
    var n = (r = L9.toFlatObject(
        r,
        { metaTokens: !0, dots: !1, indexes: !1 },
        !1,
        function (e, t) {
          return !L9.isUndefined(t[e]);
        }
      )).metaTokens,
      i = r.visitor || s,
      o = r.dots,
      a = r.indexes,
      u =
        (r.Blob || ("undefined" != typeof Blob && Blob)) &&
        L9.isSpecCompliantForm(t);
    if (!L9.isFunction(i)) throw new TypeError("visitor must be a function");
    function c(e) {
      if (null === e) return "";
      if (L9.isDate(e)) return e.toISOString();
      if (!u && L9.isBlob(e))
        throw new M9("Blob is not supported. Use a Buffer instead.");
      return L9.isArrayBuffer(e) || L9.isTypedArray(e)
        ? u && "function" == typeof Blob
          ? new Blob([e])
          : Buffer.from(e)
        : e;
    }
    function s(e, r, i) {
      var u = e;
      if (e && !i && "object" === f(e))
        if (L9.endsWith(r, "{}"))
          (r = n ? r : r.slice(0, -2)), (e = JSON.stringify(e));
        else if (
          (L9.isArray(e) &&
            (function (e) {
              return L9.isArray(e) && !e.some(U9);
            })(e)) ||
          ((L9.isFileList(e) || L9.endsWith(r, "[]")) && (u = L9.toArray(e)))
        )
          return (
            (r = B9(r)),
            u.forEach(function (e, n) {
              !L9.isUndefined(e) &&
                null !== e &&
                t.append(
                  !0 === a ? z9([r], n, o) : null === a ? r : r + "[]",
                  c(e)
                );
            }),
            !1
          );
      return !!U9(e) || (t.append(z9(i, r, o), c(e)), !1);
    }
    var l = [],
      h = Object.assign(H9, {
        defaultVisitor: s,
        convertValue: c,
        isVisitable: U9,
      });
    if (!L9.isObject(e)) throw new TypeError("data must be an object");
    return (
      (function e(r, n) {
        if (!L9.isUndefined(r)) {
          if (-1 !== l.indexOf(r))
            throw Error("Circular reference detected in " + n.join("."));
          l.push(r),
            L9.forEach(r, function (r, o) {
              !0 ===
                (!(L9.isUndefined(r) || null === r) &&
                  i.call(t, r, L9.isString(o) ? o.trim() : o, n, h)) &&
                e(r, n ? n.concat(o) : [o]);
            }),
            l.pop();
        }
      })(e),
      t
    );
  }
  function q9(e) {
    var t = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0",
    };
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (e) {
      return t[e];
    });
  }
  function V9(e, t) {
    (this._pairs = []), e && W9(e, this, t);
  }
  var G9 = V9.prototype;
  function $9(e) {
    return encodeURIComponent(e)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+")
      .replace(/%5B/gi, "[")
      .replace(/%5D/gi, "]");
  }
  function Y9(e, t, r) {
    if (!t) return e;
    var n,
      i = (r && r.encode) || $9,
      o = r && r.serialize;
    if (
      (n = o
        ? o(t, r)
        : L9.isURLSearchParams(t)
        ? t.toString()
        : new V9(t, r).toString(i))
    ) {
      var a = e.indexOf("#");
      -1 !== a && (e = e.slice(0, a)),
        (e += (-1 === e.indexOf("?") ? "?" : "&") + n);
    }
    return e;
  }
  (G9.append = function (e, t) {
    this._pairs.push([e, t]);
  }),
    (G9.toString = function (e) {
      var t = e
        ? function (t) {
            return e.call(this, t, q9);
          }
        : q9;
      return this._pairs
        .map(function (e) {
          return t(e[0]) + "=" + t(e[1]);
        }, "")
        .join("&");
    });
  const K9 = (function () {
      return v(
        function e() {
          p(this, e), (this.handlers = []);
        },
        [
          {
            key: "use",
            value: function (e, t, r) {
              return (
                this.handlers.push({
                  fulfilled: e,
                  rejected: t,
                  synchronous: !!r && r.synchronous,
                  runWhen: r ? r.runWhen : null,
                }),
                this.handlers.length - 1
              );
            },
          },
          {
            key: "eject",
            value: function (e) {
              this.handlers[e] && (this.handlers[e] = null);
            },
          },
          {
            key: "clear",
            value: function () {
              this.handlers && (this.handlers = []);
            },
          },
          {
            key: "forEach",
            value: function (e) {
              L9.forEach(this.handlers, function (t) {
                null !== t && e(t);
              });
            },
          },
        ]
      );
    })(),
    J9 = {
      silentJSONParsing: !0,
      forcedJSONParsing: !0,
      clarifyTimeoutError: !1,
    },
    X9 = {
      isBrowser: !0,
      classes: {
        URLSearchParams:
          "undefined" != typeof URLSearchParams ? URLSearchParams : V9,
        FormData: "undefined" != typeof FormData ? FormData : null,
        Blob: "undefined" != typeof Blob ? Blob : null,
      },
      protocols: ["http", "https", "file", "blob", "url", "data"],
    };
  var Q9,
    Z9 = "undefined" != typeof window && "undefined" != typeof document,
    e7 =
      ((Q9 = "undefined" != typeof navigator && navigator.product),
      Z9 && ["ReactNative", "NativeScript", "NS"].indexOf(Q9) < 0),
    t7 =
      "undefined" != typeof WorkerGlobalScope &&
      self instanceof WorkerGlobalScope &&
      "function" == typeof self.importScripts;
  const r7 = u(
    u(
      {},
      Object.freeze(
        Object.defineProperty(
          {
            __proto__: null,
            hasBrowserEnv: Z9,
            hasStandardBrowserEnv: e7,
            hasStandardBrowserWebWorkerEnv: t7,
          },
          Symbol.toStringTag,
          { value: "Module" }
        )
      )
    ),
    X9
  );
  function n7(e) {
    function t(e, r, n, i) {
      var o = e[i++];
      if ("__proto__" === o) return !0;
      var a = Number.isFinite(+o),
        u = i >= e.length;
      return (
        (o = !o && L9.isArray(n) ? n.length : o),
        u
          ? (L9.hasOwnProp(n, o) ? (n[o] = [n[o], r]) : (n[o] = r), !a)
          : ((n[o] && L9.isObject(n[o])) || (n[o] = []),
            t(e, r, n[o], i) &&
              L9.isArray(n[o]) &&
              (n[o] = (function (e) {
                var t,
                  r,
                  n = {},
                  i = Object.keys(e),
                  o = i.length;
                for (t = 0; t < o; t++) n[(r = i[t])] = e[r];
                return n;
              })(n[o])),
            !a)
      );
    }
    if (L9.isFormData(e) && L9.isFunction(e.entries)) {
      var r = {};
      return (
        L9.forEachEntry(e, function (e, n) {
          t(
            (function (e) {
              return L9.matchAll(/\w+|\[(\w*)]/g, e).map(function (e) {
                return "[]" === e[0] ? "" : e[1] || e[0];
              });
            })(e),
            n,
            r,
            0
          );
        }),
        r
      );
    }
    return null;
  }
  var i7 = {
    transitional: J9,
    adapter: ["xhr", "http"],
    transformRequest: [
      function (e, t) {
        var r,
          n = t.getContentType() || "",
          i = n.indexOf("application/json") > -1,
          o = L9.isObject(e);
        if ((o && L9.isHTMLForm(e) && (e = new FormData(e)), L9.isFormData(e)))
          return i ? JSON.stringify(n7(e)) : e;
        if (
          L9.isArrayBuffer(e) ||
          L9.isBuffer(e) ||
          L9.isStream(e) ||
          L9.isFile(e) ||
          L9.isBlob(e)
        )
          return e;
        if (L9.isArrayBufferView(e)) return e.buffer;
        if (L9.isURLSearchParams(e))
          return (
            t.setContentType(
              "application/x-www-form-urlencoded;charset=utf-8",
              !1
            ),
            e.toString()
          );
        if (o) {
          if (n.indexOf("application/x-www-form-urlencoded") > -1)
            return (function (e, t) {
              return W9(
                e,
                new r7.classes.URLSearchParams(),
                Object.assign(
                  {
                    visitor: function (e, t, r, n) {
                      return r7.isNode && L9.isBuffer(e)
                        ? (this.append(t, e.toString("base64")), !1)
                        : n.defaultVisitor.apply(this, arguments);
                    },
                  },
                  t
                )
              );
            })(e, this.formSerializer).toString();
          if ((r = L9.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
            var a = this.env && this.env.FormData;
            return W9(
              r ? { "files[]": e } : e,
              a && new a(),
              this.formSerializer
            );
          }
        }
        return o || i
          ? (t.setContentType("application/json", !1),
            (function (e, t, r) {
              if (L9.isString(e))
                try {
                  return (t || JSON.parse)(e), L9.trim(e);
                } catch (n) {
                  if ("SyntaxError" !== n.name) throw n;
                }
              return (r || JSON.stringify)(e);
            })(e))
          : e;
      },
    ],
    transformResponse: [
      function (e) {
        var t = this.transitional || i7.transitional,
          r = t && t.forcedJSONParsing,
          n = "json" === this.responseType;
        if (e && L9.isString(e) && ((r && !this.responseType) || n)) {
          var i = !(t && t.silentJSONParsing) && n;
          try {
            return JSON.parse(e);
          } catch (o) {
            if (i) {
              if ("SyntaxError" === o.name)
                throw M9.from(
                  o,
                  M9.ERR_BAD_RESPONSE,
                  this,
                  null,
                  this.response
                );
              throw o;
            }
          }
        }
        return e;
      },
    ],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: { FormData: r7.classes.FormData, Blob: r7.classes.Blob },
    validateStatus: function (e) {
      return e >= 200 && e < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": void 0,
      },
    },
  };
  L9.forEach(["delete", "get", "head", "post", "put", "patch"], function (e) {
    i7.headers[e] = {};
  });
  const o7 = i7;
  var a7 = L9.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent",
  ]);
  var u7 = Symbol("internals");
  function c7(e) {
    return e && String(e).trim().toLowerCase();
  }
  function s7(e) {
    return !1 === e || null == e ? e : L9.isArray(e) ? e.map(s7) : String(e);
  }
  function f7(e, t, r, n, i) {
    return L9.isFunction(n)
      ? n.call(this, t, r)
      : (i && (t = r),
        L9.isString(t)
          ? L9.isString(n)
            ? -1 !== t.indexOf(n)
            : L9.isRegExp(n)
            ? n.test(t)
            : void 0
          : void 0);
  }
  var l7 = (function () {
    return v(
      function e(t) {
        p(this, e), t && this.set(t);
      },
      [
        {
          key: "set",
          value: function (e, t, r) {
            var n = this;
            function i(e, t, r) {
              var i = c7(t);
              if (!i) throw new Error("header name must be a non-empty string");
              var o = L9.findKey(n, i);
              (!o ||
                void 0 === n[o] ||
                !0 === r ||
                (void 0 === r && !1 !== n[o])) &&
                (n[o || t] = s7(e));
            }
            var o,
              a,
              u,
              c,
              s,
              f = function (e, t) {
                return L9.forEach(e, function (e, r) {
                  return i(e, r, t);
                });
              };
            return (
              L9.isPlainObject(e) || e instanceof this.constructor
                ? f(e, t)
                : L9.isString(e) &&
                  (e = e.trim()) &&
                  !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())
                ? f(
                    ((s = {}),
                    (o = e) &&
                      o.split("\n").forEach(function (e) {
                        (c = e.indexOf(":")),
                          (a = e.substring(0, c).trim().toLowerCase()),
                          (u = e.substring(c + 1).trim()),
                          !a ||
                            (s[a] && a7[a]) ||
                            ("set-cookie" === a
                              ? s[a]
                                ? s[a].push(u)
                                : (s[a] = [u])
                              : (s[a] = s[a] ? s[a] + ", " + u : u));
                      }),
                    s),
                    t
                  )
                : null != e && i(t, e, r),
              this
            );
          },
        },
        {
          key: "get",
          value: function (e, t) {
            if ((e = c7(e))) {
              var r = L9.findKey(this, e);
              if (r) {
                var n = this[r];
                if (!t) return n;
                if (!0 === t)
                  return (function (e) {
                    for (
                      var t,
                        r = Object.create(null),
                        n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
                      (t = n.exec(e));

                    )
                      r[t[1]] = t[2];
                    return r;
                  })(n);
                if (L9.isFunction(t)) return t.call(this, n, r);
                if (L9.isRegExp(t)) return t.exec(n);
                throw new TypeError("parser must be boolean|regexp|function");
              }
            }
          },
        },
        {
          key: "has",
          value: function (e, t) {
            if ((e = c7(e))) {
              var r = L9.findKey(this, e);
              return !(
                !r ||
                void 0 === this[r] ||
                (t && !f7(0, this[r], r, t))
              );
            }
            return !1;
          },
        },
        {
          key: "delete",
          value: function (e, t) {
            var r = this,
              n = !1;
            function i(e) {
              if ((e = c7(e))) {
                var i = L9.findKey(r, e);
                !i || (t && !f7(0, r[i], i, t)) || (delete r[i], (n = !0));
              }
            }
            return L9.isArray(e) ? e.forEach(i) : i(e), n;
          },
        },
        {
          key: "clear",
          value: function (e) {
            for (var t = Object.keys(this), r = t.length, n = !1; r--; ) {
              var i = t[r];
              (e && !f7(0, this[i], i, e, !0)) || (delete this[i], (n = !0));
            }
            return n;
          },
        },
        {
          key: "normalize",
          value: function (e) {
            var t = this,
              r = {};
            return (
              L9.forEach(this, function (n, i) {
                var o = L9.findKey(r, i);
                if (o) return (t[o] = s7(n)), void delete t[i];
                var a = e
                  ? (function (e) {
                      return e
                        .trim()
                        .toLowerCase()
                        .replace(/([a-z\d])(\w*)/g, function (e, t, r) {
                          return t.toUpperCase() + r;
                        });
                    })(i)
                  : String(i).trim();
                a !== i && delete t[i], (t[a] = s7(n)), (r[a] = !0);
              }),
              this
            );
          },
        },
        {
          key: "concat",
          value: function () {
            for (
              var e, t = arguments.length, r = new Array(t), n = 0;
              n < t;
              n++
            )
              r[n] = arguments[n];
            return (e = this.constructor).concat.apply(e, [this].concat(r));
          },
        },
        {
          key: "toJSON",
          value: function (e) {
            var t = Object.create(null);
            return (
              L9.forEach(this, function (r, n) {
                null != r &&
                  !1 !== r &&
                  (t[n] = e && L9.isArray(r) ? r.join(", ") : r);
              }),
              t
            );
          },
        },
        {
          key: Symbol.iterator,
          value: function () {
            return Object.entries(this.toJSON())[Symbol.iterator]();
          },
        },
        {
          key: "toString",
          value: function () {
            return Object.entries(this.toJSON())
              .map(function (e) {
                var t = w(e, 2);
                return t[0] + ": " + t[1];
              })
              .join("\n");
          },
        },
        {
          key: Symbol.toStringTag,
          get: function () {
            return "AxiosHeaders";
          },
        },
      ],
      [
        {
          key: "from",
          value: function (e) {
            return e instanceof this ? e : new this(e);
          },
        },
        {
          key: "concat",
          value: function (e) {
            for (
              var t = new this(e),
                r = arguments.length,
                n = new Array(r > 1 ? r - 1 : 0),
                i = 1;
              i < r;
              i++
            )
              n[i - 1] = arguments[i];
            return (
              n.forEach(function (e) {
                return t.set(e);
              }),
              t
            );
          },
        },
        {
          key: "accessor",
          value: function (e) {
            var t = (this[u7] = this[u7] = { accessors: {} }).accessors,
              r = this.prototype;
            function n(e) {
              var n = c7(e);
              t[n] ||
                (!(function (e, t) {
                  var r = L9.toCamelCase(" " + t);
                  ["get", "set", "has"].forEach(function (n) {
                    Object.defineProperty(e, n + r, {
                      value: function (e, r, i) {
                        return this[n].call(this, t, e, r, i);
                      },
                      configurable: !0,
                    });
                  });
                })(r, e),
                (t[n] = !0));
            }
            return L9.isArray(e) ? e.forEach(n) : n(e), this;
          },
        },
      ]
    );
  })();
  l7.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization",
  ]),
    L9.reduceDescriptors(l7.prototype, function (e, t) {
      var r = e.value,
        n = t[0].toUpperCase() + t.slice(1);
      return {
        get: function () {
          return r;
        },
        set: function (e) {
          this[n] = e;
        },
      };
    }),
    L9.freezeMethods(l7);
  const h7 = l7;
  function p7(e, t) {
    var r = this || o7,
      n = t || r,
      i = h7.from(n.headers),
      o = n.data;
    return (
      L9.forEach(e, function (e) {
        o = e.call(r, o, i.normalize(), t ? t.status : void 0);
      }),
      i.normalize(),
      o
    );
  }
  function d7(e) {
    return !(!e || !e.__CANCEL__);
  }
  function v7(e, t, r) {
    M9.call(this, null == e ? "canceled" : e, M9.ERR_CANCELED, t, r),
      (this.name = "CanceledError");
  }
  L9.inherits(v7, M9, { __CANCEL__: !0 });
  const g7 = r7.hasStandardBrowserEnv
    ? {
        write: function (e, t, r, n, i, o) {
          var a = [e + "=" + encodeURIComponent(t)];
          L9.isNumber(r) && a.push("expires=" + new Date(r).toGMTString()),
            L9.isString(n) && a.push("path=" + n),
            L9.isString(i) && a.push("domain=" + i),
            !0 === o && a.push("secure"),
            (document.cookie = a.join("; "));
        },
        read: function (e) {
          var t = document.cookie.match(
            new RegExp("(^|;\\s*)(" + e + ")=([^;]*)")
          );
          return t ? decodeURIComponent(t[3]) : null;
        },
        remove: function (e) {
          this.write(e, "", Date.now() - 864e5);
        },
      }
    : {
        write: function () {},
        read: function () {
          return null;
        },
        remove: function () {},
      };
  function y7(e, t) {
    return e && !/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t)
      ? (function (e, t) {
          return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
        })(e, t)
      : t;
  }
  const m7 = r7.hasStandardBrowserEnv
    ? (function () {
        var e,
          t = /(msie|trident)/i.test(navigator.userAgent),
          r = document.createElement("a");
        function n(e) {
          var n = e;
          return (
            t && (r.setAttribute("href", n), (n = r.href)),
            r.setAttribute("href", n),
            {
              href: r.href,
              protocol: r.protocol ? r.protocol.replace(/:$/, "") : "",
              host: r.host,
              search: r.search ? r.search.replace(/^\?/, "") : "",
              hash: r.hash ? r.hash.replace(/^#/, "") : "",
              hostname: r.hostname,
              port: r.port,
              pathname:
                "/" === r.pathname.charAt(0) ? r.pathname : "/" + r.pathname,
            }
          );
        }
        return (
          (e = n(window.location.href)),
          function (t) {
            var r = L9.isString(t) ? n(t) : t;
            return r.protocol === e.protocol && r.host === e.host;
          }
        );
      })()
    : function () {
        return !0;
      };
  function b7(e, t) {
    var r = 0,
      n = (function (e, t) {
        e = e || 10;
        var r,
          n = new Array(e),
          i = new Array(e),
          o = 0,
          a = 0;
        return (
          (t = void 0 !== t ? t : 1e3),
          function (u) {
            var c = Date.now(),
              s = i[a];
            r || (r = c), (n[o] = u), (i[o] = c);
            for (var f = a, l = 0; f !== o; ) (l += n[f++]), (f %= e);
            if (((o = (o + 1) % e) === a && (a = (a + 1) % e), !(c - r < t))) {
              var h = s && c - s;
              return h ? Math.round((1e3 * l) / h) : void 0;
            }
          }
        );
      })(50, 250);
    return function (i) {
      var o = i.loaded,
        a = i.lengthComputable ? i.total : void 0,
        u = o - r,
        c = n(u);
      r = o;
      var s = {
        loaded: o,
        total: a,
        progress: a ? o / a : void 0,
        bytes: u,
        rate: c || void 0,
        estimated: c && a && o <= a ? (a - o) / c : void 0,
        event: i,
      };
      (s[t ? "download" : "upload"] = !0), e(s);
    };
  }
  var w7 = {
    http: null,
    xhr:
      "undefined" != typeof XMLHttpRequest &&
      function (e) {
        return new Promise(function (t, r) {
          var n,
            i,
            o = e.data,
            a = h7.from(e.headers).normalize(),
            u = e.responseType,
            c = e.withXSRFToken;
          function s() {
            e.cancelToken && e.cancelToken.unsubscribe(n),
              e.signal && e.signal.removeEventListener("abort", n);
          }
          if (L9.isFormData(o))
            if (r7.hasStandardBrowserEnv || r7.hasStandardBrowserWebWorkerEnv)
              a.setContentType(!1);
            else if (!1 !== (i = a.getContentType())) {
              var f = E(
                  i
                    ? i
                        .split(";")
                        .map(function (e) {
                          return e.trim();
                        })
                        .filter(Boolean)
                    : []
                ),
                l = f[0],
                h = f.slice(1);
              a.setContentType(
                [l || "multipart/form-data"].concat(x(h)).join("; ")
              );
            }
          var p = new XMLHttpRequest();
          if (e.auth) {
            var d = e.auth.username || "",
              v = e.auth.password
                ? unescape(encodeURIComponent(e.auth.password))
                : "";
            a.set("Authorization", "Basic " + btoa(d + ":" + v));
          }
          var g = y7(e.baseURL, e.url);
          function y() {
            if (p) {
              var n = h7.from(
                "getAllResponseHeaders" in p && p.getAllResponseHeaders()
              );
              !(function (e, t, r) {
                var n = r.config.validateStatus;
                r.status && n && !n(r.status)
                  ? t(
                      new M9(
                        "Request failed with status code " + r.status,
                        [M9.ERR_BAD_REQUEST, M9.ERR_BAD_RESPONSE][
                          Math.floor(r.status / 100) - 4
                        ],
                        r.config,
                        r.request,
                        r
                      )
                    )
                  : e(r);
              })(
                function (e) {
                  t(e), s();
                },
                function (e) {
                  r(e), s();
                },
                {
                  data:
                    u && "text" !== u && "json" !== u
                      ? p.response
                      : p.responseText,
                  status: p.status,
                  statusText: p.statusText,
                  headers: n,
                  config: e,
                  request: p,
                }
              ),
                (p = null);
            }
          }
          if (
            (p.open(
              e.method.toUpperCase(),
              Y9(g, e.params, e.paramsSerializer),
              !0
            ),
            (p.timeout = e.timeout),
            "onloadend" in p
              ? (p.onloadend = y)
              : (p.onreadystatechange = function () {
                  p &&
                    4 === p.readyState &&
                    (0 !== p.status ||
                      (p.responseURL &&
                        0 === p.responseURL.indexOf("file:"))) &&
                    setTimeout(y);
                }),
            (p.onabort = function () {
              p &&
                (r(new M9("Request aborted", M9.ECONNABORTED, e, p)),
                (p = null));
            }),
            (p.onerror = function () {
              r(new M9("Network Error", M9.ERR_NETWORK, e, p)), (p = null);
            }),
            (p.ontimeout = function () {
              var t = e.timeout
                  ? "timeout of " + e.timeout + "ms exceeded"
                  : "timeout exceeded",
                n = e.transitional || J9;
              e.timeoutErrorMessage && (t = e.timeoutErrorMessage),
                r(
                  new M9(
                    t,
                    n.clarifyTimeoutError ? M9.ETIMEDOUT : M9.ECONNABORTED,
                    e,
                    p
                  )
                ),
                (p = null);
            }),
            r7.hasStandardBrowserEnv &&
              (c && L9.isFunction(c) && (c = c(e)), c || (!1 !== c && m7(g))))
          ) {
            var m =
              e.xsrfHeaderName && e.xsrfCookieName && g7.read(e.xsrfCookieName);
            m && a.set(e.xsrfHeaderName, m);
          }
          void 0 === o && a.setContentType(null),
            "setRequestHeader" in p &&
              L9.forEach(a.toJSON(), function (e, t) {
                p.setRequestHeader(t, e);
              }),
            L9.isUndefined(e.withCredentials) ||
              (p.withCredentials = !!e.withCredentials),
            u && "json" !== u && (p.responseType = e.responseType),
            "function" == typeof e.onDownloadProgress &&
              p.addEventListener("progress", b7(e.onDownloadProgress, !0)),
            "function" == typeof e.onUploadProgress &&
              p.upload &&
              p.upload.addEventListener("progress", b7(e.onUploadProgress)),
            (e.cancelToken || e.signal) &&
              ((n = function (t) {
                p &&
                  (r(!t || t.type ? new v7(null, e, p) : t),
                  p.abort(),
                  (p = null));
              }),
              e.cancelToken && e.cancelToken.subscribe(n),
              e.signal &&
                (e.signal.aborted
                  ? n()
                  : e.signal.addEventListener("abort", n)));
          var b,
            w = ((b = /^([-+\w]{1,25})(:?\/\/|:)/.exec(g)) && b[1]) || "";
          w && -1 === r7.protocols.indexOf(w)
            ? r(
                new M9("Unsupported protocol " + w + ":", M9.ERR_BAD_REQUEST, e)
              )
            : p.send(o || null);
        });
      },
  };
  L9.forEach(w7, function (e, t) {
    if (e) {
      try {
        Object.defineProperty(e, "name", { value: t });
      } catch (r) {}
      Object.defineProperty(e, "adapterName", { value: t });
    }
  });
  var E7 = function (e) {
      return "- ".concat(e);
    },
    x7 = function (e) {
      return L9.isFunction(e) || null === e || !1 === e;
    };
  const S7 = function (e) {
    for (
      var t, r, n = (e = L9.isArray(e) ? e : [e]).length, i = {}, o = 0;
      o < n;
      o++
    ) {
      var a = void 0;
      if (
        ((r = t = e[o]),
        !x7(t) && void 0 === (r = w7[(a = String(t)).toLowerCase()]))
      )
        throw new M9("Unknown adapter '".concat(a, "'"));
      if (r) break;
      i[a || "#" + o] = r;
    }
    if (!r) {
      var u = Object.entries(i).map(function (e) {
        var t = w(e, 2),
          r = t[0],
          n = t[1];
        return (
          "adapter ".concat(r, " ") +
          (!1 === n
            ? "is not supported by the environment"
            : "is not available in the build")
        );
      });
      throw new M9(
        "There is no suitable adapter to dispatch the request " +
          (n
            ? u.length > 1
              ? "since :\n" + u.map(E7).join("\n")
              : " " + E7(u[0])
            : "as no adapter specified"),
        "ERR_NOT_SUPPORT"
      );
    }
    return r;
  };
  function A7(e) {
    if (
      (e.cancelToken && e.cancelToken.throwIfRequested(),
      e.signal && e.signal.aborted)
    )
      throw new v7(null, e);
  }
  function O7(e) {
    return (
      A7(e),
      (e.headers = h7.from(e.headers)),
      (e.data = p7.call(e, e.transformRequest)),
      -1 !== ["post", "put", "patch"].indexOf(e.method) &&
        e.headers.setContentType("application/x-www-form-urlencoded", !1),
      S7(e.adapter || o7.adapter)(e).then(
        function (t) {
          return (
            A7(e),
            (t.data = p7.call(e, e.transformResponse, t)),
            (t.headers = h7.from(t.headers)),
            t
          );
        },
        function (t) {
          return (
            d7(t) ||
              (A7(e),
              t &&
                t.response &&
                ((t.response.data = p7.call(
                  e,
                  e.transformResponse,
                  t.response
                )),
                (t.response.headers = h7.from(t.response.headers)))),
            Promise.reject(t)
          );
        }
      )
    );
  }
  var k7 = function (e) {
    return e instanceof h7 ? u({}, e) : e;
  };
  function T7(e, t) {
    t = t || {};
    var r = {};
    function n(e, t, r) {
      return L9.isPlainObject(e) && L9.isPlainObject(t)
        ? L9.merge.call({ caseless: r }, e, t)
        : L9.isPlainObject(t)
        ? L9.merge({}, t)
        : L9.isArray(t)
        ? t.slice()
        : t;
    }
    function i(e, t, r) {
      return L9.isUndefined(t)
        ? L9.isUndefined(e)
          ? void 0
          : n(void 0, e, r)
        : n(e, t, r);
    }
    function o(e, t) {
      if (!L9.isUndefined(t)) return n(void 0, t);
    }
    function a(e, t) {
      return L9.isUndefined(t)
        ? L9.isUndefined(e)
          ? void 0
          : n(void 0, e)
        : n(void 0, t);
    }
    function u(r, i, o) {
      return o in t ? n(r, i) : o in e ? n(void 0, r) : void 0;
    }
    var c = {
      url: o,
      method: o,
      data: o,
      baseURL: a,
      transformRequest: a,
      transformResponse: a,
      paramsSerializer: a,
      timeout: a,
      timeoutMessage: a,
      withCredentials: a,
      withXSRFToken: a,
      adapter: a,
      responseType: a,
      xsrfCookieName: a,
      xsrfHeaderName: a,
      onUploadProgress: a,
      onDownloadProgress: a,
      decompress: a,
      maxContentLength: a,
      maxBodyLength: a,
      beforeRedirect: a,
      transport: a,
      httpAgent: a,
      httpsAgent: a,
      cancelToken: a,
      socketPath: a,
      responseEncoding: a,
      validateStatus: u,
      headers: function (e, t) {
        return i(k7(e), k7(t), !0);
      },
    };
    return (
      L9.forEach(Object.keys(Object.assign({}, e, t)), function (n) {
        var o = c[n] || i,
          a = o(e[n], t[n], n);
        (L9.isUndefined(a) && o !== u) || (r[n] = a);
      }),
      r
    );
  }
  var R7 = "1.6.8",
    I7 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(
    function (e, t) {
      I7[e] = function (r) {
        return f(r) === e || "a" + (t < 1 ? "n " : " ") + e;
      };
    }
  );
  var _7 = {};
  I7.transitional = function (e, t, r) {
    function n(e, t) {
      return (
        "[Axios v1.6.8] Transitional option '" +
        e +
        "'" +
        t +
        (r ? ". " + r : "")
      );
    }
    return function (r, i, o) {
      if (!1 === e)
        throw new M9(
          n(i, " has been removed" + (t ? " in " + t : "")),
          M9.ERR_DEPRECATED
        );
      return (
        t &&
          !_7[i] &&
          ((_7[i] = !0),
          console.warn(
            n(
              i,
              " has been deprecated since v" +
                t +
                " and will be removed in the near future"
            )
          )),
        !e || e(r, i, o)
      );
    };
  };
  const P7 = {
    assertOptions: function (e, t, r) {
      if ("object" !== f(e))
        throw new M9("options must be an object", M9.ERR_BAD_OPTION_VALUE);
      for (var n = Object.keys(e), i = n.length; i-- > 0; ) {
        var o = n[i],
          a = t[o];
        if (a) {
          var u = e[o],
            c = void 0 === u || a(u, o, e);
          if (!0 !== c)
            throw new M9(
              "option " + o + " must be " + c,
              M9.ERR_BAD_OPTION_VALUE
            );
        } else if (!0 !== r)
          throw new M9("Unknown option " + o, M9.ERR_BAD_OPTION);
      }
    },
    validators: I7,
  };
  var F7 = P7.validators,
    j7 = (function () {
      return v(
        function e(t) {
          p(this, e),
            (this.defaults = t),
            (this.interceptors = { request: new K9(), response: new K9() });
        },
        [
          {
            key: "request",
            value:
              ((e = h(
                c().mark(function e(t, r) {
                  var n, i;
                  return c().wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (e.prev = 0), (e.next = 3), this._request(t, r)
                            );
                          case 3:
                            return e.abrupt("return", e.sent);
                          case 6:
                            throw (
                              ((e.prev = 6),
                              (e.t0 = e.catch(0)),
                              e.t0 instanceof Error &&
                                (Error.captureStackTrace
                                  ? Error.captureStackTrace((n = {}))
                                  : (n = new Error()),
                                (i = n.stack
                                  ? n.stack.replace(/^.+\n/, "")
                                  : ""),
                                e.t0.stack
                                  ? i &&
                                    !String(e.t0.stack).endsWith(
                                      i.replace(/^.+\n.+\n/, "")
                                    ) &&
                                    (e.t0.stack += "\n" + i)
                                  : (e.t0.stack = i)),
                              e.t0)
                            );
                          case 10:
                          case "end":
                            return e.stop();
                        }
                    },
                    e,
                    this,
                    [[0, 6]]
                  );
                })
              )),
              function (t, r) {
                return e.apply(this, arguments);
              }),
          },
          {
            key: "_request",
            value: function (e, t) {
              "string" == typeof e ? ((t = t || {}).url = e) : (t = e || {});
              var r = (t = T7(this.defaults, t)),
                n = r.transitional,
                i = r.paramsSerializer,
                o = r.headers;
              void 0 !== n &&
                P7.assertOptions(
                  n,
                  {
                    silentJSONParsing: F7.transitional(F7.boolean),
                    forcedJSONParsing: F7.transitional(F7.boolean),
                    clarifyTimeoutError: F7.transitional(F7.boolean),
                  },
                  !1
                ),
                null != i &&
                  (L9.isFunction(i)
                    ? (t.paramsSerializer = { serialize: i })
                    : P7.assertOptions(
                        i,
                        { encode: F7.function, serialize: F7.function },
                        !0
                      )),
                (t.method = (
                  t.method ||
                  this.defaults.method ||
                  "get"
                ).toLowerCase());
              var a = o && L9.merge(o.common, o[t.method]);
              o &&
                L9.forEach(
                  ["delete", "get", "head", "post", "put", "patch", "common"],
                  function (e) {
                    delete o[e];
                  }
                ),
                (t.headers = h7.concat(a, o));
              var u = [],
                c = !0;
              this.interceptors.request.forEach(function (e) {
                ("function" == typeof e.runWhen && !1 === e.runWhen(t)) ||
                  ((c = c && e.synchronous),
                  u.unshift(e.fulfilled, e.rejected));
              });
              var s,
                f = [];
              this.interceptors.response.forEach(function (e) {
                f.push(e.fulfilled, e.rejected);
              });
              var l,
                h = 0;
              if (!c) {
                var p = [O7.bind(this), void 0];
                for (
                  p.unshift.apply(p, u),
                    p.push.apply(p, f),
                    l = p.length,
                    s = Promise.resolve(t);
                  h < l;

                )
                  s = s.then(p[h++], p[h++]);
                return s;
              }
              l = u.length;
              var d = t;
              for (h = 0; h < l; ) {
                var v = u[h++],
                  g = u[h++];
                try {
                  d = v(d);
                } catch ($7) {
                  g.call(this, $7);
                  break;
                }
              }
              try {
                s = O7.call(this, d);
              } catch ($7) {
                return Promise.reject($7);
              }
              for (h = 0, l = f.length; h < l; ) s = s.then(f[h++], f[h++]);
              return s;
            },
          },
          {
            key: "getUri",
            value: function (e) {
              return Y9(
                y7((e = T7(this.defaults, e)).baseURL, e.url),
                e.params,
                e.paramsSerializer
              );
            },
          },
        ]
      );
      var e;
    })();
  L9.forEach(["delete", "get", "head", "options"], function (e) {
    j7.prototype[e] = function (t, r) {
      return this.request(
        T7(r || {}, { method: e, url: t, data: (r || {}).data })
      );
    };
  }),
    L9.forEach(["post", "put", "patch"], function (e) {
      function t(t) {
        return function (r, n, i) {
          return this.request(
            T7(i || {}, {
              method: e,
              headers: t ? { "Content-Type": "multipart/form-data" } : {},
              url: r,
              data: n,
            })
          );
        };
      }
      (j7.prototype[e] = t()), (j7.prototype[e + "Form"] = t(!0));
    });
  const C7 = j7;
  const L7 = (function () {
    function e(t) {
      if ((p(this, e), "function" != typeof t))
        throw new TypeError("executor must be a function.");
      var r;
      this.promise = new Promise(function (e) {
        r = e;
      });
      var n = this;
      this.promise.then(function (e) {
        if (n._listeners) {
          for (var t = n._listeners.length; t-- > 0; ) n._listeners[t](e);
          n._listeners = null;
        }
      }),
        (this.promise.then = function (e) {
          var t,
            r = new Promise(function (e) {
              n.subscribe(e), (t = e);
            }).then(e);
          return (
            (r.cancel = function () {
              n.unsubscribe(t);
            }),
            r
          );
        }),
        t(function (e, t, i) {
          n.reason || ((n.reason = new v7(e, t, i)), r(n.reason));
        });
    }
    return v(
      e,
      [
        {
          key: "throwIfRequested",
          value: function () {
            if (this.reason) throw this.reason;
          },
        },
        {
          key: "subscribe",
          value: function (e) {
            this.reason
              ? e(this.reason)
              : this._listeners
              ? this._listeners.push(e)
              : (this._listeners = [e]);
          },
        },
        {
          key: "unsubscribe",
          value: function (e) {
            if (this._listeners) {
              var t = this._listeners.indexOf(e);
              -1 !== t && this._listeners.splice(t, 1);
            }
          },
        },
      ],
      [
        {
          key: "source",
          value: function () {
            var t;
            return {
              token: new e(function (e) {
                t = e;
              }),
              cancel: t,
            };
          },
        },
      ]
    );
  })();
  var M7 = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
  };
  Object.entries(M7).forEach(function (e) {
    var t = w(e, 2),
      r = t[0],
      n = t[1];
    M7[n] = r;
  });
  const D7 = M7;
  var N7 = (function e(t) {
    var r = new C7(t),
      n = e9(C7.prototype.request, r);
    return (
      L9.extend(n, C7.prototype, r, { allOwnKeys: !0 }),
      L9.extend(n, r, null, { allOwnKeys: !0 }),
      (n.create = function (r) {
        return e(T7(t, r));
      }),
      n
    );
  })(o7);
  (N7.Axios = C7),
    (N7.CanceledError = v7),
    (N7.CancelToken = L7),
    (N7.isCancel = d7),
    (N7.VERSION = R7),
    (N7.toFormData = W9),
    (N7.AxiosError = M9),
    (N7.Cancel = N7.CanceledError),
    (N7.all = function (e) {
      return Promise.all(e);
    }),
    (N7.spread = function (e) {
      return function (t) {
        return e.apply(null, t);
      };
    }),
    (N7.isAxiosError = function (e) {
      return L9.isObject(e) && !0 === e.isAxiosError;
    }),
    (N7.mergeConfig = T7),
    (N7.AxiosHeaders = h7),
    (N7.formToJSON = function (e) {
      return n7(L9.isHTMLForm(e) ? new FormData(e) : e);
    }),
    (N7.getAdapter = S7),
    (N7.HttpStatusCode = D7),
    (N7.default = N7);
  const U7 = N7;
  U7.Axios,
    U7.AxiosError,
    U7.CanceledError,
    U7.isCancel,
    U7.CancelToken,
    U7.VERSION,
    U7.all,
    U7.Cancel,
    U7.isAxiosError,
    U7.spread,
    U7.toFormData,
    U7.AxiosHeaders,
    U7.HttpStatusCode,
    U7.formToJSON,
    U7.getAdapter,
    U7.mergeConfig;
  var B7 = Object.defineProperty,
    z7 = function (e, t, r) {
      return (
        (function (e, t, r) {
          t in e
            ? B7(e, t, {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: r,
              })
            : (e[t] = r);
        })(e, "symbol" != f(t) ? t + "" : t, r),
        r
      );
    },
    H7 = v(function e() {
      p(this, e),
        z7(this, "event_name", ""),
        z7(this, "project", "cn"),
        z7(this, "event_time", 0),
        z7(this, "account"),
        z7(this, "user", { code: "", uid: "", id: 0, channel: "" }),
        z7(this, "language", ""),
        z7(this, "attributes", {
          path: "",
          path_params: "",
          referer: "",
          width: 0,
          height: 0,
          page_params: "",
        }),
        z7(this, "data", ""),
        (this.attributes.path = window.location.href);
    });
  u(u({}, { SUCCESS: 1, ERROR: 2 }), {}, { FILTER: 3 });
  var W7 = (function () {
      return v(
        function e() {
          var t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : "",
            r = arguments.length > 1 ? arguments[1] : void 0,
            n = arguments.length > 2 ? arguments[2] : void 0,
            i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
          p(this, e),
            z7(this, "env", "dev"),
            z7(this, "project", "cn"),
            z7(this, "baseData"),
            z7(this, "printLog"),
            z7(this, "options", {
              account: { id: 0, name: "", api_key: "" },
              user: { code: "", uid: "", channel: "", id: 0 },
              attributes: {
                path: "",
                page_params: "",
                referer: "",
                width: 0,
                height: 0,
              },
              language: "",
            }),
            z7(this, "BASE_URL"),
            (this.env = r),
            (this.BASE_URL = t);
          var o = n.user,
            a = n.account,
            u = n.attributes,
            c = n.language,
            s = n.project;
          (this.printLog = i),
            a && (this.options.account = a),
            o && (this.options.user = Object.assign(o, this.options.user)),
            u && (this.options.attributes = u),
            s && (this.project = s),
            (this.options.language = c),
            (this.baseData = JSON.parse(JSON.stringify(new H7())));
        },
        [
          {
            key: "reportEvent",
            value:
              ((e = h(
                c().mark(function e(t, r) {
                  var n, i, o, a, u;
                  return c().wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              (this.baseData.event_time = new Date().getTime()),
                              (n = this.options),
                              (i = n.account),
                              (o = n.user),
                              (a = n.attributes),
                              (this.baseData.account = i || {}),
                              (this.baseData.user = o || {}),
                              (this.baseData.attributes = a || {}),
                              (this.baseData.language = this.options.language),
                              (this.baseData.project = this.project),
                              (this.baseData.event_name = t),
                              (this.baseData.data = JSON.stringify(r)),
                              this.printLog &&
                                console.log(
                                  "%c[鍩嬬偣涓婃姤-"
                                    .concat(this.env, "]%c ")
                                    .concat(t),
                                  "border-radius:4px;padding:2px;background:#02bb00;color:#fff",
                                  "font-size:14px;color:red;",
                                  JSON.parse(JSON.stringify(this.baseData))
                                ),
                              (u = Z8(JSON.stringify(this.baseData))),
                              (e.prev = 4),
                              (e.next = 7),
                              U7.post("".concat(this.BASE_URL, "/api/track"), {
                                data: u,
                                event_name: t,
                              })
                            );
                          case 7:
                            e.next = 12;
                            break;
                          case 9:
                            return (
                              (e.prev = 9),
                              (e.t0 = e.catch(4)),
                              e.abrupt("return", Promise.reject(e.t0))
                            );
                          case 12:
                          case "end":
                            return e.stop();
                        }
                    },
                    e,
                    this,
                    [[4, 9]]
                  );
                })
              )),
              function (t, r) {
                return e.apply(this, arguments);
              }),
          },
          {
            key: "deviceId",
            get: function () {
              return this.baseData.device_id;
            },
          },
        ]
      );
      var e;
    })(),
    q7 = (function (e) {
      return (
        (e[(e.AI = 1)] = "AI"),
        (e[(e.RESET = 2)] = "RESET"),
        (e[(e.WORD_IMPORT = 3)] = "WORD_IMPORT"),
        (e[(e.XMIND_IMPORT = 4)] = "XMIND_IMPORT"),
        (e[(e.FREE_MIND_IMPORT = 5)] = "FREE_MIND_IMPORT"),
        (e[(e.MARKDOWN_IMPORT = 6)] = "MARKDOWN_IMPORT"),
        (e[(e.MARKDOWN_COPY = 7)] = "MARKDOWN_COPY"),
        (e[(e.PRESET = 8)] = "PRESET"),
        (e[(e.PDF_IMPORT = 9)] = "PDF_IMPORT"),
        (e[(e.TXT_IMPORT = 10)] = "TXT_IMPORT"),
        (e[(e.FREE_INPUT = 11)] = "FREE_INPUT"),
        (e[(e.PPTX_IMPORT = 12)] = "PPTX_IMPORT"),
        (e[(e.LINK_INPUT = 13)] = "LINK_INPUT"),
        (e[(e.REFERENCE_DOCUMENT = 17)] = "REFERENCE_DOCUMENT"),
        e
      );
    })(q7 || {});
  q7.AI,
    q7.REFERENCE_DOCUMENT,
    q7.WORD_IMPORT,
    q7.XMIND_IMPORT,
    q7.FREE_MIND_IMPORT,
    q7.MARKDOWN_IMPORT,
    q7.MARKDOWN_COPY,
    q7.PDF_IMPORT,
    q7.TXT_IMPORT,
    q7.FREE_INPUT;
  const V7 = "aippt-iframe",
    G7 = class e {
      constructor() {}
      static async show(t) {
        null === e.instance && (e.instance = new e());
        const {
          appkey: r,
          channel: n,
          code: i,
          editorModel: o,
          routerOptions: a,
          isMobile: u = !1,
        } = t;
        (e.opt = t),
          e.setSceneValue((t.options && t.options.scene_auth) || !1),
          e.setFcPlateSwitch((t.options && t.options.fc_plate) || !1),
          (e.isMobile = u),
          (e.IFRAME_HREF = u ? "https://m-co.aippt.cn" : "https://co.aippt.cn");
        const c = await e.validate();
        if (1 !== c.code) return Promise.reject(c);
        if (
          a &&
          a.list &&
          a.list.length &&
          !a.list.includes("generate") &&
          !a.list.includes("workspace")
        )
          return Promise.reject({
            code: -1,
            type: "routerOptions",
            msg: "宸ヤ綔鍙板拰鐢熸垚椤靛繀椤诲瓨鍦ㄤ竴涓�",
          });
        const s = {
            appkey: r,
            channel: n || "",
            code: i,
            "x-editor-mode": o ? "" : "view",
          },
          f = {
            account: { id: 0, name: "", api_key: "" },
            user: { code: "", uid: "", channel: "", id: 0 },
            attributes: {
              path: "",
              page_params: "",
              referer: "",
              width: 0,
              height: 0,
            },
            language: "zh",
          };
        try {
          const r = {
            "x-api-key": s.appkey,
            "x-channel": s.channel,
            "x-code": s.code,
            "x-platform": "",
          };
          u && (r["x-platform"] = "mobile"),
            (f.attributes = {
              path: window.location.href,
              page_params: window.location.search,
              referer: document.referrer,
              width: 0,
              height: 0,
            }),
            (e.Tracker = new W7(e.IFRAME_HREF, "prod", f, !1));
          const n = await U7.get(`${e.IFRAME_HREF}/jsapi/user/info`, {
            headers: r,
          });
          if (
            ((f.user = { code: s.code, uid: "", channel: s.channel, id: 0 }),
            (f.account.api_key = s.appkey),
            0 !== n.data.code)
          )
            return (
              e.Tracker.reportEvent("SDK_INIT", {
                data: { type: 2, status: !1, showOptions: t, env: "prod" },
              }),
              Promise.reject(n.data)
            );
          {
            const r = n.data.data;
            return (
              r &&
                ((f.user = Object.assign({}, f.user, {
                  uid: r.uid || "",
                  id: r.id || 0,
                })),
                r.account &&
                  (f.account = Object.assign({}, f.account, {
                    id: r.account.id,
                    name: r.account.name,
                  }))),
              e.Tracker.reportEvent("SDK_INIT", {
                type: 1,
                status: !0,
                options: t,
                env: "prod",
              }),
              e.create(t),
              e.instance
            );
          }
        } catch ($7) {
          const n = $7 && $7.code && "ERR_NETWORK" === $7.code ? 43105 : 43106;
          return (
            43105 !== n &&
              e.Tracker.reportEvent("SDK_INIT", {
                data: {
                  type: 3,
                  status: !1,
                  data: JSON.stringify($7),
                  options: t,
                  env: "prod",
                },
              }),
            Promise.reject({
              code: n,
              data: JSON.stringify($7),
              msg:
                43105 === n
                  ? "鏁版嵁璇锋眰寮傚父锛岃绋嶅悗閲嶈瘯"
                  : "鏁版嵁鍔犺浇寮傚父锛岃绋嶅悗閲嶈瘯",
            })
          );
        }
      }
      static create(t) {
        var r, n, i, o, a;
        const {
            container: u,
            options: c,
            iframeOptions: s,
            routerOptions: f,
            editorModel: l,
            isMobile: h = !1,
          } = t,
          p = null == c ? void 0 : c.custom_generate;
        let d = e.IFRAME_HREF;
        p && (d = `${d}/generate`);
        let v = !1;
        void 0 !== f &&
          (f.list && f.list.length
            ? f.list.length &&
              (f.list.includes("editor") || (f.generate && f.generate.step)) &&
              (v = !0)
            : (v = !0)),
          v &&
            f &&
            ((null == (r = f.editor) ? void 0 : r.id)
              ? (d = `${d}/${l ? "editor" : "view"}?id=${f.editor.id}`)
              : 2 === (null == (n = f.generate) ? void 0 : n.step)
              ? (d = `${d}/generate?step=${
                  null == (i = f.generate) ? void 0 : i.step
                }`)
              : h &&
                3 === (null == (o = f.generate) ? void 0 : o.step) &&
                (d = `${d}/generate?step=${
                  null == (a = f.generate) ? void 0 : a.step
                }`));
        const g = (function (e) {
          let t = e.url;
          e.query && (t = `${t}?${new URLSearchParams(e.query).toString()}`);
          const r = document.createElement("iframe");
          return (
            (r.src = t),
            (r.style.width = e.width ? e.width + "px" : "100%"),
            (r.style.height = "100%"),
            (r.style.border = "none"),
            (r.allowFullscreen = !0),
            e.id && (r.id = e.id),
            r
          );
        })({ url: d, id: V7, width: (s && s.width) || "" });
        if (u)
          !(function (e) {
            if (e && e instanceof HTMLElement)
              for (; e.firstChild; ) e.removeChild(e.firstChild);
          })(u),
            u.appendChild(g),
            g.addEventListener("load", () => {
              e.initInfo();
            });
        else {
          const {
            modal: t,
            container: r,
            style: n,
          } = (function (e, t) {
            const r = document.createElement("style");
            r.innerHTML = `\n#${e}-modal {position: fixed;width:100vw;height:100vh;top:0;left:0;background:rgba(0,0,0,.3);overflow:hidden;display:flex;flex-direction:column;}\n#${e}-top {height:36px;display: flex;justify-content: space-between;align-items: center;padding: 0 20px;color: #eee;font-size: 16px;}\n#${e}-top p {background:rgba(0,0,0,.8);padding:0 4px;}\n#${e}-wrap {flex:1;background:#fff;}\n#${e}-btn {cursor:pointer;color:#fff;}\n#${e}-btn:hover {color:blue;}\n`;
            const n = document.createElement("div");
            n.id = `${e}-modal`;
            const i = document.createElement("div");
            i.id = `${e}-top`;
            const o = document.createElement("div");
            (o.id = `${e}-btn`), (o.innerHTML = "鍏抽棴");
            const a = document.createElement("p");
            (a.innerText = ""), i.appendChild(a), i.appendChild(o);
            const u = document.createElement("div");
            return (
              (u.id = `${e}-wrap`),
              n.appendChild(i),
              n.appendChild(u),
              n.appendChild(r),
              o.addEventListener("click", t),
              { modal: n, container: u, style: r }
            );
          })(V7, () => {
            t.remove(), n.remove();
          });
          r.appendChild(g),
            g.addEventListener("load", () => {
              setTimeout(() => {
                e.initInfo();
              }, 50);
            }),
            document.head.appendChild(n),
            document.body.appendChild(t);
        }
        "function" == typeof t.onMessage && e.initEventListener(t.onMessage),
          e.setIframe(g.src);
      }
      static initEventListener(e) {
        const t = window.document.getElementById(V7).contentWindow;
        window.addEventListener("message", (r) => {
          if (r.source === t) {
            let t = null;
            r.data && r.data.data && (t = JSON.parse(r.data.data)),
              "INIT" === r.data.type || (e && e(r.data.type, t));
          }
        });
      }
      static setMessage(t) {
        document.getElementById(V7).contentWindow.postMessage(t, e.IFRAME_HREF);
      }
      static asyncSetMessage(t) {
        document.getElementById(V7).contentWindow.postMessage(t, e.IFRAME_HREF);
      }
      static initInfo() {
        var t, r, n, i, o;
        let a = 2;
        const { options: u } = e.opt;
        u &&
          void 0 !== u.download_mode &&
          [0, 1, 2].includes(u.download_mode) &&
          (a = u.download_mode),
          console.log("start AiPPT before");
        const c = {
          type: "INIT",
          origin: window.location.origin,
          appkey: e.opt.appkey,
          channel: e.opt.channel || "",
          code: e.opt.code,
          "x-editor-mode": e.opt.editorModel ? "" : "view",
          downloadMode: a,
          sceneAuth: e.scene_auth,
          fcPlateList: e.fc_plate,
          routerOptions: e.opt.routerOptions,
          source: e.opt.source,
          sourceOptions: e.opt.sourceOptions,
        };
        (c.downloadVip = (null == u ? void 0 : u.downloadVip) || null),
          (null == u ? void 0 : u.custom_generate) &&
            ((null == u ? void 0 : u.custom_generate.taskId)
              ? ((c.generate = {
                  taskId: null == u ? void 0 : u.custom_generate.taskId,
                  step: (null == u ? void 0 : u.custom_generate.step) || 1,
                }),
                e.opt.isMobile &&
                  ((c.generate.templateId =
                    Number(null == u ? void 0 : u.custom_generate.templateId) ||
                    ""),
                  (c.generate.isEnterprise =
                    (null == u ? void 0 : u.custom_generate.isEnterprise) ||
                    !1)))
              : (null == u ? void 0 : u.custom_generate.type) &&
                (null == u ? void 0 : u.custom_generate.content) &&
                (c.generate = {
                  type:
                    null == (t = null == u ? void 0 : u.custom_generate)
                      ? void 0
                      : t.type,
                  content:
                    null == (r = null == u ? void 0 : u.custom_generate)
                      ? void 0
                      : r.content,
                  step: (null == u ? void 0 : u.custom_generate.step) || 1,
                  referList:
                    null == (n = null == u ? void 0 : u.custom_generate)
                      ? void 0
                      : n.referList,
                  subType:
                    (null == (i = null == u ? void 0 : u.custom_generate)
                      ? void 0
                      : i.sub_type) || 1,
                  seniorOptions:
                    (null == (o = null == u ? void 0 : u.custom_generate)
                      ? void 0
                      : o.seniorOptions) || {},
                })),
          console.log("start AiPPT end"),
          e.Tracker.reportEvent("SDK_INIT_AFTER", { data: c }),
          e.setMessage(c);
      }
      static setIframe(t) {
        e.iframeSrc = t;
      }
      static getIframe() {
        return e.iframeSrc;
      }
      static sceneAuthContinue(t) {
        e.setMessage({ type: "SCENE_AUTH", isNext: t });
      }
      static setSceneValue(t) {
        if ("boolean" == typeof t)
          if (!0 === t) {
            const t = Object.values(V6).filter((e) => "number" == typeof e);
            e.scene_auth = t;
          } else e.scene_auth = [];
        else if ("string" == typeof t) {
          const r = t.split(",");
          e.scene_auth = r
            .map((e) => Number(e))
            .filter((e) => !Number.isNaN(e));
        } else
          Array.isArray(t) &&
            (e.scene_auth = t
              .map((e) => Number(e))
              .filter((e) => !Number.isNaN(e)));
      }
      static setFcPlateSwitch(t) {
        var r, n;
        const i =
          null == (n = null == (r = e.opt) ? void 0 : r.options)
            ? void 0
            : n.hasOwnProperty("fc_plate");
        if ("boolean" == typeof t) e.fc_plate = !0 === t || !i || [];
        else if ("string" == typeof t) {
          const r = t.split(",");
          e.fc_plate = r.map((e) => Number(e)).filter((e) => !Number.isNaN(e));
        } else
          Array.isArray(t) &&
            (e.fc_plate = t
              .map((e) => Number(e))
              .filter((e) => !Number.isNaN(e)));
      }
      static async validate() {
        const { options: t } = e.opt,
          r = null == t ? void 0 : t.custom_generate;
        if (r) {
          if (r.taskId)
            return 3 !== r.step || r.templateId
              ? Promise.resolve({ code: 1 })
              : {
                  code: -1,
                  message: "娴佺▼閿欒锛岀己灏戞ā鏉縄D",
                  type: "custom_generate",
                };
          {
            const { type: t, content: i, referList: o } = r;
            if (e.isMobile && 17 === t)
              return {
                code: -1,
                message: "绉诲姩绔殏涓嶆敮鎸佸弬鑰冩枃妗ｅ姛鑳�",
                type: "custom_generate",
              };
            if ([1, 3, 4, 5, 6, 7, 9, 10, 11, 17].includes(t)) {
              if (1 === t || 7 === t || 11 === t) {
                const e = i.trim().length;
                if (1 === t) {
                  if (e > 100 || !e)
                    return {
                      code: -1,
                      message: "AI鏍囬涓嶇鍚堣姹�",
                      type: "custom_generate",
                    };
                } else if (7 === t) {
                  if (!e)
                    return {
                      type: "custom_generate",
                      code: -1,
                      message: "markdown鏂囨湰鍐呭涓嶇鍚堣姹�",
                    };
                  try {
                    const e = C8(i.trim());
                    if (e[0] && e[0].children.length < 3)
                      return {
                        type: "custom_generate",
                        code: -1,
                        message: "markdown鏂囨湰鍐呭涓嶇鍚堣姹�",
                      };
                  } catch (n) {
                    return {
                      type: "custom_generate",
                      code: -1,
                      message: "markdown鏂囨湰鍐呭涓嶇鍚堣姹�",
                    };
                  }
                } else if (!e)
                  return {
                    type: "custom_generate",
                    code: -1,
                    message: "鏂囨湰鍐呭涓嶅厑璁镐负绌�",
                  };
              } else if ([3, 4, 5, 6].includes(t)) {
                const e = i.name.split(".").pop() || "";
                if (
                  (3 === t && !["doc", "docx"].includes(e)) ||
                  (4 === t && "xmind" !== e) ||
                  (5 === t && "mm" !== e) ||
                  (6 === t && "md" !== e)
                )
                  return {
                    code: -1,
                    message: "涓婁紶鏂囦欢涓嶇鍚堣姹�",
                    type: "custom_generate",
                  };
                if (i.size > 5242880)
                  return {
                    code: -1,
                    message: "鏂囦欢澶у皬涓嶈兘瓒呰繃5M",
                    type: "custom_generate",
                  };
              } else if (17 === t) {
                const e = ["pdf", "docx", "doc", "txt"],
                  t = i.trim().length;
                if (
                  !o.some((t) => {
                    const r = t.name.split(".").pop() || "";
                    return e.includes(r);
                  })
                )
                  return {
                    code: -1,
                    message: "涓婁紶鏂囦欢涓嶇鍚堝弬鑰冩枃妗ｈ姹�",
                    type: "custom_generate",
                  };
                if (t > 100 || !t)
                  return {
                    code: -1,
                    message: "鏍囬涓嶇鍚堝弬鑰冩枃妗ｈ姹�",
                    type: "custom_generate",
                  };
              }
              return Promise.resolve({ code: 1 });
            }
            return {
              code: -1,
              message: "鑷畾涔夌敓鎴愭暟鎹被鍨嬮敊璇�",
              type: "custom_generate",
            };
          }
        }
        return Promise.resolve({ code: 1 });
      }
      static deleteIframe() {
        const t = document.getElementById(V7);
        t && (e.setIframe(""), t.parentNode.removeChild(t));
      }
    };
  return (
    t(G7, "instance", null),
    t(G7, "iframeSrc"),
    t(G7, "IFRAME_HREF"),
    t(G7, "isMobile"),
    t(G7, "Tracker"),
    t(G7, "scene_auth"),
    t(G7, "fc_plate"),
    t(G7, "opt"),
    G7
  );
});
