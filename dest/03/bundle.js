"use strict";

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault2(_typeof2);

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
            }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];return s(n ? n : e);
            }, l, l.exports, e, t, n, r);
        }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
        s(r[o]);
    }return s;
})({ 1: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _regenerator = require('babel-runtime/regenerator');

        var _regenerator2 = _interopRequireDefault(_regenerator);

        var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

        var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

        var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

        var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

        var _createClass2 = require('babel-runtime/helpers/createClass');

        var _createClass3 = _interopRequireDefault(_createClass2);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }

        var TimeStacker = function () {
            function TimeStacker() {
                (0, _classCallCheck3.default)(this, TimeStacker);

                this.times = [];
            }

            (0, _createClass3.default)(TimeStacker, [{
                key: 'loadCurrentTime',
                value: function () {
                    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                        var time;
                        return _regenerator2.default.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        _context.next = 2;
                                        return this.fetchTime();

                                    case 2:
                                        time = _context.sent;

                                        if (!this.times.length || this.times[this.times.length - 1] !== time) {
                                            this.times.push(time);
                                        }

                                    case 4:
                                    case 'end':
                                        return _context.stop();
                                }
                            }
                        }, _callee, this);
                    }));

                    function loadCurrentTime() {
                        return _ref.apply(this, arguments);
                    }

                    return loadCurrentTime;
                }()
            }, {
                key: 'getHtml',
                value: function getHtml() {
                    if (!this.times.length) {
                        return '';
                    }
                    var list = this.times.map(function (time) {
                        return '<li>' + time + '</li>';
                    }).join('');
                    return '<ul>' + list + '</ul>';
                }
            }, {
                key: 'fetchTime',
                value: function fetchTime() {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            var date = new Date();
                            var hours = (date.getHours() + '').padStart(2, '0');
                            var minutes = (date.getMinutes() + '').padStart(2, '0');
                            var seconds = (date.getSeconds() + '').padStart(2, '0');
                            var time = hours + ':' + minutes + ':' + seconds;
                            resolve(time);
                        }, 500);
                    });
                }
            }]);
            return TimeStacker;
        }();

        exports.default = TimeStacker;
    }, { "babel-runtime/helpers/asyncToGenerator": 6, "babel-runtime/helpers/classCallCheck": 7, "babel-runtime/helpers/createClass": 8, "babel-runtime/regenerator": 9 }], 2: [function (require, module, exports) {
        'use strict';

        var _events = require('events');

        var _TimeStacker = require('./TimeStacker');

        var _TimeStacker2 = _interopRequireDefault(_TimeStacker);

        var _zoneSettings = require('./zoneSettings');

        var _zoneSettings2 = _interopRequireDefault(_zoneSettings);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }

        // 何故か import だと Promise.then がスケジュールされないので、requireで読み込む
        // import 'zone.js';
        require('zone.js');
        // require('zone.js/dist/long-stack-trace-zone.js');

        Zone.current.fork(_zoneSettings2.default).run(function () {

            var emitter = Zone.current.get('emitter');

            var timeStacker = new _TimeStacker2.default();

            var lastHtml = '';

            // モデルが変更されたかもよイベントを受け取ったら...
            emitter.on('checkDataChanged', function () {

                // 変更されていたたら...
                var html = timeStacker.getHtml();
                if (lastHtml !== html) {

                    // ビューを書き換える
                    document.querySelector('.data').innerHTML = html;
                    lastHtml = html;
                    console.log('----------draw');
                }
            });

            document.querySelector('.start').addEventListener('click', function () {

                // 今の時分秒をモデルにロードする
                timeStacker.loadCurrentTime();
            }, false);
        });
    }, { "./TimeStacker": 1, "./zoneSettings": 3, "events": 76, "zone.js": 80 }], 3: [function (require, module, exports) {
        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _events = require('events');

        exports.default = {
            properties: {
                state: {
                    changedPossibility: false
                },
                emitter: new _events.EventEmitter()
            },
            onHasTask: function onHasTask(parent, current, target, hasTask) {
                var state = Zone.current.get('state');
                var emitter = Zone.current.get('emitter');
                state.changedPossibility = !hasTask.macroTask && !hasTask.microTask;
                if (state.changedPossibility) {
                    emitter.emit('checkDataChanged');
                }
            },
            onScheduleTask: function onScheduleTask(parentZoneDelegate, currentZone, targetZone, task) {
                console.log('onScheduleTask ' + task.source);
                parentZoneDelegate.scheduleTask(targetZone, task);
            },
            onInvokeTask: function onInvokeTask(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
                console.log('onInvokeTask ' + task.source);
                var state = Zone.current.get('state');
                var emitter = Zone.current.get('emitter');
                emitter.emit('checkDataChanged');
                parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
            }
        };
    }, { "events": 76 }], 4: [function (require, module, exports) {
        module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
    }, { "core-js/library/fn/object/define-property": 10 }], 5: [function (require, module, exports) {
        module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
    }, { "core-js/library/fn/promise": 11 }], 6: [function (require, module, exports) {
        "use strict";

        exports.__esModule = true;

        var _promise = require("../core-js/promise");

        var _promise2 = _interopRequireDefault(_promise);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }

        exports.default = function (fn) {
            return function () {
                var gen = fn.apply(this, arguments);
                return new _promise2.default(function (resolve, reject) {
                    function step(key, arg) {
                        try {
                            var info = gen[key](arg);
                            var value = info.value;
                        } catch (error) {
                            reject(error);
                            return;
                        }

                        if (info.done) {
                            resolve(value);
                        } else {
                            return _promise2.default.resolve(value).then(function (value) {
                                step("next", value);
                            }, function (err) {
                                step("throw", err);
                            });
                        }
                    }

                    return step("next");
                });
            };
        };
    }, { "../core-js/promise": 5 }], 7: [function (require, module, exports) {
        "use strict";

        exports.__esModule = true;

        exports.default = function (instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        };
    }, {}], 8: [function (require, module, exports) {
        "use strict";

        exports.__esModule = true;

        var _defineProperty = require("../core-js/object/define-property");

        var _defineProperty2 = _interopRequireDefault(_defineProperty);

        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : { default: obj };
        }

        exports.default = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    (0, _defineProperty2.default)(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();
    }, { "../core-js/object/define-property": 4 }], 9: [function (require, module, exports) {
        module.exports = require("regenerator-runtime");
    }, { "regenerator-runtime": 78 }], 10: [function (require, module, exports) {
        require('../../modules/es6.object.define-property');
        var $Object = require('../../modules/_core').Object;
        module.exports = function defineProperty(it, key, desc) {
            return $Object.defineProperty(it, key, desc);
        };
    }, { "../../modules/_core": 19, "../../modules/es6.object.define-property": 71 }], 11: [function (require, module, exports) {
        require('../modules/es6.object.to-string');
        require('../modules/es6.string.iterator');
        require('../modules/web.dom.iterable');
        require('../modules/es6.promise');
        module.exports = require('../modules/_core').Promise;
    }, { "../modules/_core": 19, "../modules/es6.object.to-string": 72, "../modules/es6.promise": 73, "../modules/es6.string.iterator": 74, "../modules/web.dom.iterable": 75 }], 12: [function (require, module, exports) {
        module.exports = function (it) {
            if (typeof it != 'function') throw TypeError(it + ' is not a function!');
            return it;
        };
    }, {}], 13: [function (require, module, exports) {
        module.exports = function () {/* empty */};
    }, {}], 14: [function (require, module, exports) {
        module.exports = function (it, Constructor, name, forbiddenField) {
            if (!(it instanceof Constructor) || forbiddenField !== undefined && forbiddenField in it) {
                throw TypeError(name + ': incorrect invocation!');
            }return it;
        };
    }, {}], 15: [function (require, module, exports) {
        var isObject = require('./_is-object');
        module.exports = function (it) {
            if (!isObject(it)) throw TypeError(it + ' is not an object!');
            return it;
        };
    }, { "./_is-object": 36 }], 16: [function (require, module, exports) {
        // false -> Array#indexOf
        // true  -> Array#includes
        var toIObject = require('./_to-iobject'),
            toLength = require('./_to-length'),
            toIndex = require('./_to-index');
        module.exports = function (IS_INCLUDES) {
            return function ($this, el, fromIndex) {
                var O = toIObject($this),
                    length = toLength(O.length),
                    index = toIndex(fromIndex, length),
                    value;
                // Array#includes uses SameValueZero equality algorithm
                if (IS_INCLUDES && el != el) while (length > index) {
                    value = O[index++];
                    if (value != value) return true;
                    // Array#toIndex ignores holes, Array#includes - not
                } else for (; length > index; index++) {
                    if (IS_INCLUDES || index in O) {
                        if (O[index] === el) return IS_INCLUDES || index || 0;
                    }
                }return !IS_INCLUDES && -1;
            };
        };
    }, { "./_to-index": 61, "./_to-iobject": 63, "./_to-length": 64 }], 17: [function (require, module, exports) {
        // getting tag from 19.1.3.6 Object.prototype.toString()
        var cof = require('./_cof'),
            TAG = require('./_wks')('toStringTag')
        // ES3 wrong here
        ,
            ARG = cof(function () {
            return arguments;
        }()) == 'Arguments';

        // fallback for IE11 Script Access Denied error
        var tryGet = function tryGet(it, key) {
            try {
                return it[key];
            } catch (e) {/* empty */}
        };

        module.exports = function (it) {
            var O, T, B;
            return it === undefined ? 'Undefined' : it === null ? 'Null'
            // @@toStringTag case
            : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
            // builtinTag case
            : ARG ? cof(O)
            // ES3 arguments fallback
            : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
        };
    }, { "./_cof": 18, "./_wks": 68 }], 18: [function (require, module, exports) {
        var toString = {}.toString;

        module.exports = function (it) {
            return toString.call(it).slice(8, -1);
        };
    }, {}], 19: [function (require, module, exports) {
        var core = module.exports = { version: '2.4.0' };
        if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
    }, {}], 20: [function (require, module, exports) {
        // optional / simple context binding
        var aFunction = require('./_a-function');
        module.exports = function (fn, that, length) {
            aFunction(fn);
            if (that === undefined) return fn;
            switch (length) {
                case 1:
                    return function (a) {
                        return fn.call(that, a);
                    };
                case 2:
                    return function (a, b) {
                        return fn.call(that, a, b);
                    };
                case 3:
                    return function (a, b, c) {
                        return fn.call(that, a, b, c);
                    };
            }
            return function () /* ...args */{
                return fn.apply(that, arguments);
            };
        };
    }, { "./_a-function": 12 }], 21: [function (require, module, exports) {
        // 7.2.1 RequireObjectCoercible(argument)
        module.exports = function (it) {
            if (it == undefined) throw TypeError("Can't call method on  " + it);
            return it;
        };
    }, {}], 22: [function (require, module, exports) {
        // Thank's IE8 for his funny defineProperty
        module.exports = !require('./_fails')(function () {
            return Object.defineProperty({}, 'a', { get: function get() {
                    return 7;
                } }).a != 7;
        });
    }, { "./_fails": 26 }], 23: [function (require, module, exports) {
        var isObject = require('./_is-object'),
            document = require('./_global').document
        // in old IE typeof document.createElement is 'object'
        ,
            is = isObject(document) && isObject(document.createElement);
        module.exports = function (it) {
            return is ? document.createElement(it) : {};
        };
    }, { "./_global": 28, "./_is-object": 36 }], 24: [function (require, module, exports) {
        // IE 8- don't enum bug keys
        module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');
    }, {}], 25: [function (require, module, exports) {
        var global = require('./_global'),
            core = require('./_core'),
            ctx = require('./_ctx'),
            hide = require('./_hide'),
            PROTOTYPE = 'prototype';

        var $export = function $export(type, name, source) {
            var IS_FORCED = type & $export.F,
                IS_GLOBAL = type & $export.G,
                IS_STATIC = type & $export.S,
                IS_PROTO = type & $export.P,
                IS_BIND = type & $export.B,
                IS_WRAP = type & $export.W,
                exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
                expProto = exports[PROTOTYPE],
                target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
                key,
                own,
                out;
            if (IS_GLOBAL) source = name;
            for (key in source) {
                // contains in native
                own = !IS_FORCED && target && target[key] !== undefined;
                if (own && key in exports) continue;
                // export native or passed
                out = own ? target[key] : source[key];
                // prevent global pollution for namespaces
                exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
                // bind timers to global for call from export context
                : IS_BIND && own ? ctx(out, global)
                // wrap global constructors for prevent change them in library
                : IS_WRAP && target[key] == out ? function (C) {
                    var F = function F(a, b, c) {
                        if (this instanceof C) {
                            switch (arguments.length) {
                                case 0:
                                    return new C();
                                case 1:
                                    return new C(a);
                                case 2:
                                    return new C(a, b);
                            }return new C(a, b, c);
                        }return C.apply(this, arguments);
                    };
                    F[PROTOTYPE] = C[PROTOTYPE];
                    return F;
                    // make static versions for prototype methods
                }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
                // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
                if (IS_PROTO) {
                    (exports.virtual || (exports.virtual = {}))[key] = out;
                    // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
                    if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
                }
            }
        };
        // type bitmap
        $export.F = 1; // forced
        $export.G = 2; // global
        $export.S = 4; // static
        $export.P = 8; // proto
        $export.B = 16; // bind
        $export.W = 32; // wrap
        $export.U = 64; // safe
        $export.R = 128; // real proto method for `library` 
        module.exports = $export;
    }, { "./_core": 19, "./_ctx": 20, "./_global": 28, "./_hide": 30 }], 26: [function (require, module, exports) {
        module.exports = function (exec) {
            try {
                return !!exec();
            } catch (e) {
                return true;
            }
        };
    }, {}], 27: [function (require, module, exports) {
        var ctx = require('./_ctx'),
            call = require('./_iter-call'),
            isArrayIter = require('./_is-array-iter'),
            anObject = require('./_an-object'),
            toLength = require('./_to-length'),
            getIterFn = require('./core.get-iterator-method'),
            BREAK = {},
            RETURN = {};
        var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
            var iterFn = ITERATOR ? function () {
                return iterable;
            } : getIterFn(iterable),
                f = ctx(fn, that, entries ? 2 : 1),
                index = 0,
                length,
                step,
                iterator,
                result;
            if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
            // fast case for arrays with default iterator
            if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
                result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
                if (result === BREAK || result === RETURN) return result;
            } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
                result = call(iterator, f, step.value, entries);
                if (result === BREAK || result === RETURN) return result;
            }
        };
        exports.BREAK = BREAK;
        exports.RETURN = RETURN;
    }, { "./_an-object": 15, "./_ctx": 20, "./_is-array-iter": 35, "./_iter-call": 37, "./_to-length": 64, "./core.get-iterator-method": 69 }], 28: [function (require, module, exports) {
        // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
        var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
        if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
    }, {}], 29: [function (require, module, exports) {
        var hasOwnProperty = {}.hasOwnProperty;
        module.exports = function (it, key) {
            return hasOwnProperty.call(it, key);
        };
    }, {}], 30: [function (require, module, exports) {
        var dP = require('./_object-dp'),
            createDesc = require('./_property-desc');
        module.exports = require('./_descriptors') ? function (object, key, value) {
            return dP.f(object, key, createDesc(1, value));
        } : function (object, key, value) {
            object[key] = value;
            return object;
        };
    }, { "./_descriptors": 22, "./_object-dp": 46, "./_property-desc": 51 }], 31: [function (require, module, exports) {
        module.exports = require('./_global').document && document.documentElement;
    }, { "./_global": 28 }], 32: [function (require, module, exports) {
        module.exports = !require('./_descriptors') && !require('./_fails')(function () {
            return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function get() {
                    return 7;
                } }).a != 7;
        });
    }, { "./_descriptors": 22, "./_dom-create": 23, "./_fails": 26 }], 33: [function (require, module, exports) {
        // fast apply, http://jsperf.lnkit.com/fast-apply/5
        module.exports = function (fn, args, that) {
            var un = that === undefined;
            switch (args.length) {
                case 0:
                    return un ? fn() : fn.call(that);
                case 1:
                    return un ? fn(args[0]) : fn.call(that, args[0]);
                case 2:
                    return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                case 3:
                    return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                case 4:
                    return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
            }return fn.apply(that, args);
        };
    }, {}], 34: [function (require, module, exports) {
        // fallback for non-array-like ES3 and non-enumerable old V8 strings
        var cof = require('./_cof');
        module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
            return cof(it) == 'String' ? it.split('') : Object(it);
        };
    }, { "./_cof": 18 }], 35: [function (require, module, exports) {
        // check on default Array iterator
        var Iterators = require('./_iterators'),
            ITERATOR = require('./_wks')('iterator'),
            ArrayProto = Array.prototype;

        module.exports = function (it) {
            return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
        };
    }, { "./_iterators": 42, "./_wks": 68 }], 36: [function (require, module, exports) {
        module.exports = function (it) {
            return (typeof it === "undefined" ? "undefined" : (0, _typeof3.default)(it)) === 'object' ? it !== null : typeof it === 'function';
        };
    }, {}], 37: [function (require, module, exports) {
        // call something on iterator step with safe closing on error
        var anObject = require('./_an-object');
        module.exports = function (iterator, fn, value, entries) {
            try {
                return entries ? fn(anObject(value)[0], value[1]) : fn(value);
                // 7.4.6 IteratorClose(iterator, completion)
            } catch (e) {
                var ret = iterator['return'];
                if (ret !== undefined) anObject(ret.call(iterator));
                throw e;
            }
        };
    }, { "./_an-object": 15 }], 38: [function (require, module, exports) {
        'use strict';

        var create = require('./_object-create'),
            descriptor = require('./_property-desc'),
            setToStringTag = require('./_set-to-string-tag'),
            IteratorPrototype = {};

        // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
        require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () {
            return this;
        });

        module.exports = function (Constructor, NAME, next) {
            Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
            setToStringTag(Constructor, NAME + ' Iterator');
        };
    }, { "./_hide": 30, "./_object-create": 45, "./_property-desc": 51, "./_set-to-string-tag": 55, "./_wks": 68 }], 39: [function (require, module, exports) {
        'use strict';

        var LIBRARY = require('./_library'),
            $export = require('./_export'),
            redefine = require('./_redefine'),
            hide = require('./_hide'),
            has = require('./_has'),
            Iterators = require('./_iterators'),
            $iterCreate = require('./_iter-create'),
            setToStringTag = require('./_set-to-string-tag'),
            getPrototypeOf = require('./_object-gpo'),
            ITERATOR = require('./_wks')('iterator'),
            BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
        ,
            FF_ITERATOR = '@@iterator',
            KEYS = 'keys',
            VALUES = 'values';

        var returnThis = function returnThis() {
            return this;
        };

        module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
            $iterCreate(Constructor, NAME, next);
            var getMethod = function getMethod(kind) {
                if (!BUGGY && kind in proto) return proto[kind];
                switch (kind) {
                    case KEYS:
                        return function keys() {
                            return new Constructor(this, kind);
                        };
                    case VALUES:
                        return function values() {
                            return new Constructor(this, kind);
                        };
                }return function entries() {
                    return new Constructor(this, kind);
                };
            };
            var TAG = NAME + ' Iterator',
                DEF_VALUES = DEFAULT == VALUES,
                VALUES_BUG = false,
                proto = Base.prototype,
                $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
                $default = $native || getMethod(DEFAULT),
                $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
                $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
                methods,
                key,
                IteratorPrototype;
            // Fix native
            if ($anyNative) {
                IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
                if (IteratorPrototype !== Object.prototype) {
                    // Set @@toStringTag to native iterators
                    setToStringTag(IteratorPrototype, TAG, true);
                    // fix for some old engines
                    if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
                }
            }
            // fix Array#{values, @@iterator}.name in V8 / FF
            if (DEF_VALUES && $native && $native.name !== VALUES) {
                VALUES_BUG = true;
                $default = function values() {
                    return $native.call(this);
                };
            }
            // Define iterator
            if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
                hide(proto, ITERATOR, $default);
            }
            // Plug for library
            Iterators[NAME] = $default;
            Iterators[TAG] = returnThis;
            if (DEFAULT) {
                methods = {
                    values: DEF_VALUES ? $default : getMethod(VALUES),
                    keys: IS_SET ? $default : getMethod(KEYS),
                    entries: $entries
                };
                if (FORCED) for (key in methods) {
                    if (!(key in proto)) redefine(proto, key, methods[key]);
                } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
            }
            return methods;
        };
    }, { "./_export": 25, "./_has": 29, "./_hide": 30, "./_iter-create": 38, "./_iterators": 42, "./_library": 43, "./_object-gpo": 48, "./_redefine": 53, "./_set-to-string-tag": 55, "./_wks": 68 }], 40: [function (require, module, exports) {
        var ITERATOR = require('./_wks')('iterator'),
            SAFE_CLOSING = false;

        try {
            var riter = [7][ITERATOR]();
            riter['return'] = function () {
                SAFE_CLOSING = true;
            };
            Array.from(riter, function () {
                throw 2;
            });
        } catch (e) {/* empty */}

        module.exports = function (exec, skipClosing) {
            if (!skipClosing && !SAFE_CLOSING) return false;
            var safe = false;
            try {
                var arr = [7],
                    iter = arr[ITERATOR]();
                iter.next = function () {
                    return { done: safe = true };
                };
                arr[ITERATOR] = function () {
                    return iter;
                };
                exec(arr);
            } catch (e) {/* empty */}
            return safe;
        };
    }, { "./_wks": 68 }], 41: [function (require, module, exports) {
        module.exports = function (done, value) {
            return { value: value, done: !!done };
        };
    }, {}], 42: [function (require, module, exports) {
        module.exports = {};
    }, {}], 43: [function (require, module, exports) {
        module.exports = true;
    }, {}], 44: [function (require, module, exports) {
        var global = require('./_global'),
            macrotask = require('./_task').set,
            Observer = global.MutationObserver || global.WebKitMutationObserver,
            process = global.process,
            Promise = global.Promise,
            isNode = require('./_cof')(process) == 'process';

        module.exports = function () {
            var head, last, notify;

            var flush = function flush() {
                var parent, fn;
                if (isNode && (parent = process.domain)) parent.exit();
                while (head) {
                    fn = head.fn;
                    head = head.next;
                    try {
                        fn();
                    } catch (e) {
                        if (head) notify();else last = undefined;
                        throw e;
                    }
                }last = undefined;
                if (parent) parent.enter();
            };

            // Node.js
            if (isNode) {
                notify = function notify() {
                    process.nextTick(flush);
                };
                // browsers with MutationObserver
            } else if (Observer) {
                var toggle = true,
                    node = document.createTextNode('');
                new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
                notify = function notify() {
                    node.data = toggle = !toggle;
                };
                // environments with maybe non-completely correct, but existent Promise
            } else if (Promise && Promise.resolve) {
                var promise = Promise.resolve();
                notify = function notify() {
                    promise.then(flush);
                };
                // for other environments - macrotask based on:
                // - setImmediate
                // - MessageChannel
                // - window.postMessag
                // - onreadystatechange
                // - setTimeout
            } else {
                notify = function notify() {
                    // strange IE + webpack dev server bug - use .call(global)
                    macrotask.call(global, flush);
                };
            }

            return function (fn) {
                var task = { fn: fn, next: undefined };
                if (last) last.next = task;
                if (!head) {
                    head = task;
                    notify();
                }last = task;
            };
        };
    }, { "./_cof": 18, "./_global": 28, "./_task": 60 }], 45: [function (require, module, exports) {
        // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
        var anObject = require('./_an-object'),
            dPs = require('./_object-dps'),
            enumBugKeys = require('./_enum-bug-keys'),
            IE_PROTO = require('./_shared-key')('IE_PROTO'),
            Empty = function Empty() {/* empty */},
            PROTOTYPE = 'prototype';

        // Create object with fake `null` prototype: use iframe Object with cleared prototype
        var _createDict = function createDict() {
            // Thrash, waste and sodomy: IE GC bug
            var iframe = require('./_dom-create')('iframe'),
                i = enumBugKeys.length,
                lt = '<',
                gt = '>',
                iframeDocument;
            iframe.style.display = 'none';
            require('./_html').appendChild(iframe);
            iframe.src = 'javascript:'; // eslint-disable-line no-script-url
            // createDict = iframe.contentWindow.Object;
            // html.removeChild(iframe);
            iframeDocument = iframe.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
            iframeDocument.close();
            _createDict = iframeDocument.F;
            while (i--) {
                delete _createDict[PROTOTYPE][enumBugKeys[i]];
            }return _createDict();
        };

        module.exports = Object.create || function create(O, Properties) {
            var result;
            if (O !== null) {
                Empty[PROTOTYPE] = anObject(O);
                result = new Empty();
                Empty[PROTOTYPE] = null;
                // add "__proto__" for Object.getPrototypeOf polyfill
                result[IE_PROTO] = O;
            } else result = _createDict();
            return Properties === undefined ? result : dPs(result, Properties);
        };
    }, { "./_an-object": 15, "./_dom-create": 23, "./_enum-bug-keys": 24, "./_html": 31, "./_object-dps": 47, "./_shared-key": 56 }], 46: [function (require, module, exports) {
        var anObject = require('./_an-object'),
            IE8_DOM_DEFINE = require('./_ie8-dom-define'),
            toPrimitive = require('./_to-primitive'),
            dP = Object.defineProperty;

        exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPrimitive(P, true);
            anObject(Attributes);
            if (IE8_DOM_DEFINE) try {
                return dP(O, P, Attributes);
            } catch (e) {/* empty */}
            if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
            if ('value' in Attributes) O[P] = Attributes.value;
            return O;
        };
    }, { "./_an-object": 15, "./_descriptors": 22, "./_ie8-dom-define": 32, "./_to-primitive": 66 }], 47: [function (require, module, exports) {
        var dP = require('./_object-dp'),
            anObject = require('./_an-object'),
            getKeys = require('./_object-keys');

        module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
            anObject(O);
            var keys = getKeys(Properties),
                length = keys.length,
                i = 0,
                P;
            while (length > i) {
                dP.f(O, P = keys[i++], Properties[P]);
            }return O;
        };
    }, { "./_an-object": 15, "./_descriptors": 22, "./_object-dp": 46, "./_object-keys": 50 }], 48: [function (require, module, exports) {
        // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
        var has = require('./_has'),
            toObject = require('./_to-object'),
            IE_PROTO = require('./_shared-key')('IE_PROTO'),
            ObjectProto = Object.prototype;

        module.exports = Object.getPrototypeOf || function (O) {
            O = toObject(O);
            if (has(O, IE_PROTO)) return O[IE_PROTO];
            if (typeof O.constructor == 'function' && O instanceof O.constructor) {
                return O.constructor.prototype;
            }return O instanceof Object ? ObjectProto : null;
        };
    }, { "./_has": 29, "./_shared-key": 56, "./_to-object": 65 }], 49: [function (require, module, exports) {
        var has = require('./_has'),
            toIObject = require('./_to-iobject'),
            arrayIndexOf = require('./_array-includes')(false),
            IE_PROTO = require('./_shared-key')('IE_PROTO');

        module.exports = function (object, names) {
            var O = toIObject(object),
                i = 0,
                result = [],
                key;
            for (key in O) {
                if (key != IE_PROTO) has(O, key) && result.push(key);
            } // Don't enum bug & hidden keys
            while (names.length > i) {
                if (has(O, key = names[i++])) {
                    ~arrayIndexOf(result, key) || result.push(key);
                }
            }return result;
        };
    }, { "./_array-includes": 16, "./_has": 29, "./_shared-key": 56, "./_to-iobject": 63 }], 50: [function (require, module, exports) {
        // 19.1.2.14 / 15.2.3.14 Object.keys(O)
        var $keys = require('./_object-keys-internal'),
            enumBugKeys = require('./_enum-bug-keys');

        module.exports = Object.keys || function keys(O) {
            return $keys(O, enumBugKeys);
        };
    }, { "./_enum-bug-keys": 24, "./_object-keys-internal": 49 }], 51: [function (require, module, exports) {
        module.exports = function (bitmap, value) {
            return {
                enumerable: !(bitmap & 1),
                configurable: !(bitmap & 2),
                writable: !(bitmap & 4),
                value: value
            };
        };
    }, {}], 52: [function (require, module, exports) {
        var hide = require('./_hide');
        module.exports = function (target, src, safe) {
            for (var key in src) {
                if (safe && target[key]) target[key] = src[key];else hide(target, key, src[key]);
            }return target;
        };
    }, { "./_hide": 30 }], 53: [function (require, module, exports) {
        module.exports = require('./_hide');
    }, { "./_hide": 30 }], 54: [function (require, module, exports) {
        'use strict';

        var global = require('./_global'),
            core = require('./_core'),
            dP = require('./_object-dp'),
            DESCRIPTORS = require('./_descriptors'),
            SPECIES = require('./_wks')('species');

        module.exports = function (KEY) {
            var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
            if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
                configurable: true,
                get: function get() {
                    return this;
                }
            });
        };
    }, { "./_core": 19, "./_descriptors": 22, "./_global": 28, "./_object-dp": 46, "./_wks": 68 }], 55: [function (require, module, exports) {
        var def = require('./_object-dp').f,
            has = require('./_has'),
            TAG = require('./_wks')('toStringTag');

        module.exports = function (it, tag, stat) {
            if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
        };
    }, { "./_has": 29, "./_object-dp": 46, "./_wks": 68 }], 56: [function (require, module, exports) {
        var shared = require('./_shared')('keys'),
            uid = require('./_uid');
        module.exports = function (key) {
            return shared[key] || (shared[key] = uid(key));
        };
    }, { "./_shared": 57, "./_uid": 67 }], 57: [function (require, module, exports) {
        var global = require('./_global'),
            SHARED = '__core-js_shared__',
            store = global[SHARED] || (global[SHARED] = {});
        module.exports = function (key) {
            return store[key] || (store[key] = {});
        };
    }, { "./_global": 28 }], 58: [function (require, module, exports) {
        // 7.3.20 SpeciesConstructor(O, defaultConstructor)
        var anObject = require('./_an-object'),
            aFunction = require('./_a-function'),
            SPECIES = require('./_wks')('species');
        module.exports = function (O, D) {
            var C = anObject(O).constructor,
                S;
            return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
        };
    }, { "./_a-function": 12, "./_an-object": 15, "./_wks": 68 }], 59: [function (require, module, exports) {
        var toInteger = require('./_to-integer'),
            defined = require('./_defined');
        // true  -> String#at
        // false -> String#codePointAt
        module.exports = function (TO_STRING) {
            return function (that, pos) {
                var s = String(defined(that)),
                    i = toInteger(pos),
                    l = s.length,
                    a,
                    b;
                if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
                a = s.charCodeAt(i);
                return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
            };
        };
    }, { "./_defined": 21, "./_to-integer": 62 }], 60: [function (require, module, exports) {
        var ctx = require('./_ctx'),
            invoke = require('./_invoke'),
            html = require('./_html'),
            cel = require('./_dom-create'),
            global = require('./_global'),
            process = global.process,
            setTask = global.setImmediate,
            clearTask = global.clearImmediate,
            MessageChannel = global.MessageChannel,
            counter = 0,
            queue = {},
            ONREADYSTATECHANGE = 'onreadystatechange',
            defer,
            channel,
            port;
        var run = function run() {
            var id = +this;
            if (queue.hasOwnProperty(id)) {
                var fn = queue[id];
                delete queue[id];
                fn();
            }
        };
        var listener = function listener(event) {
            run.call(event.data);
        };
        // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
        if (!setTask || !clearTask) {
            setTask = function setImmediate(fn) {
                var args = [],
                    i = 1;
                while (arguments.length > i) {
                    args.push(arguments[i++]);
                }queue[++counter] = function () {
                    invoke(typeof fn == 'function' ? fn : Function(fn), args);
                };
                defer(counter);
                return counter;
            };
            clearTask = function clearImmediate(id) {
                delete queue[id];
            };
            // Node.js 0.8-
            if (require('./_cof')(process) == 'process') {
                defer = function defer(id) {
                    process.nextTick(ctx(run, id, 1));
                };
                // Browsers with MessageChannel, includes WebWorkers
            } else if (MessageChannel) {
                channel = new MessageChannel();
                port = channel.port2;
                channel.port1.onmessage = listener;
                defer = ctx(port.postMessage, port, 1);
                // Browsers with postMessage, skip WebWorkers
                // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
            } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
                defer = function defer(id) {
                    global.postMessage(id + '', '*');
                };
                global.addEventListener('message', listener, false);
                // IE8-
            } else if (ONREADYSTATECHANGE in cel('script')) {
                defer = function defer(id) {
                    html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
                        html.removeChild(this);
                        run.call(id);
                    };
                };
                // Rest old browsers
            } else {
                defer = function defer(id) {
                    setTimeout(ctx(run, id, 1), 0);
                };
            }
        }
        module.exports = {
            set: setTask,
            clear: clearTask
        };
    }, { "./_cof": 18, "./_ctx": 20, "./_dom-create": 23, "./_global": 28, "./_html": 31, "./_invoke": 33 }], 61: [function (require, module, exports) {
        var toInteger = require('./_to-integer'),
            max = Math.max,
            min = Math.min;
        module.exports = function (index, length) {
            index = toInteger(index);
            return index < 0 ? max(index + length, 0) : min(index, length);
        };
    }, { "./_to-integer": 62 }], 62: [function (require, module, exports) {
        // 7.1.4 ToInteger
        var ceil = Math.ceil,
            floor = Math.floor;
        module.exports = function (it) {
            return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
        };
    }, {}], 63: [function (require, module, exports) {
        // to indexed object, toObject with fallback for non-array-like ES3 strings
        var IObject = require('./_iobject'),
            defined = require('./_defined');
        module.exports = function (it) {
            return IObject(defined(it));
        };
    }, { "./_defined": 21, "./_iobject": 34 }], 64: [function (require, module, exports) {
        // 7.1.15 ToLength
        var toInteger = require('./_to-integer'),
            min = Math.min;
        module.exports = function (it) {
            return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
        };
    }, { "./_to-integer": 62 }], 65: [function (require, module, exports) {
        // 7.1.13 ToObject(argument)
        var defined = require('./_defined');
        module.exports = function (it) {
            return Object(defined(it));
        };
    }, { "./_defined": 21 }], 66: [function (require, module, exports) {
        // 7.1.1 ToPrimitive(input [, PreferredType])
        var isObject = require('./_is-object');
        // instead of the ES6 spec version, we didn't implement @@toPrimitive case
        // and the second argument - flag - preferred type is a string
        module.exports = function (it, S) {
            if (!isObject(it)) return it;
            var fn, val;
            if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
            if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
            if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
            throw TypeError("Can't convert object to primitive value");
        };
    }, { "./_is-object": 36 }], 67: [function (require, module, exports) {
        var id = 0,
            px = Math.random();
        module.exports = function (key) {
            return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
        };
    }, {}], 68: [function (require, module, exports) {
        var store = require('./_shared')('wks'),
            uid = require('./_uid'),
            _Symbol = require('./_global').Symbol,
            USE_SYMBOL = typeof _Symbol == 'function';

        var $exports = module.exports = function (name) {
            return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
        };

        $exports.store = store;
    }, { "./_global": 28, "./_shared": 57, "./_uid": 67 }], 69: [function (require, module, exports) {
        var classof = require('./_classof'),
            ITERATOR = require('./_wks')('iterator'),
            Iterators = require('./_iterators');
        module.exports = require('./_core').getIteratorMethod = function (it) {
            if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
        };
    }, { "./_classof": 17, "./_core": 19, "./_iterators": 42, "./_wks": 68 }], 70: [function (require, module, exports) {
        'use strict';

        var addToUnscopables = require('./_add-to-unscopables'),
            step = require('./_iter-step'),
            Iterators = require('./_iterators'),
            toIObject = require('./_to-iobject');

        // 22.1.3.4 Array.prototype.entries()
        // 22.1.3.13 Array.prototype.keys()
        // 22.1.3.29 Array.prototype.values()
        // 22.1.3.30 Array.prototype[@@iterator]()
        module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
            this._t = toIObject(iterated); // target
            this._i = 0; // next index
            this._k = kind; // kind
            // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
        }, function () {
            var O = this._t,
                kind = this._k,
                index = this._i++;
            if (!O || index >= O.length) {
                this._t = undefined;
                return step(1);
            }
            if (kind == 'keys') return step(0, index);
            if (kind == 'values') return step(0, O[index]);
            return step(0, [index, O[index]]);
        }, 'values');

        // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
        Iterators.Arguments = Iterators.Array;

        addToUnscopables('keys');
        addToUnscopables('values');
        addToUnscopables('entries');
    }, { "./_add-to-unscopables": 13, "./_iter-define": 39, "./_iter-step": 41, "./_iterators": 42, "./_to-iobject": 63 }], 71: [function (require, module, exports) {
        var $export = require('./_export');
        // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
        $export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });
    }, { "./_descriptors": 22, "./_export": 25, "./_object-dp": 46 }], 72: [function (require, module, exports) {}, {}], 73: [function (require, module, exports) {
        'use strict';

        var LIBRARY = require('./_library'),
            global = require('./_global'),
            ctx = require('./_ctx'),
            classof = require('./_classof'),
            $export = require('./_export'),
            isObject = require('./_is-object'),
            aFunction = require('./_a-function'),
            anInstance = require('./_an-instance'),
            forOf = require('./_for-of'),
            speciesConstructor = require('./_species-constructor'),
            task = require('./_task').set,
            microtask = require('./_microtask')(),
            PROMISE = 'Promise',
            TypeError = global.TypeError,
            process = global.process,
            $Promise = global[PROMISE],
            process = global.process,
            isNode = classof(process) == 'process',
            empty = function empty() {/* empty */},
            Internal,
            GenericPromiseCapability,
            Wrapper;

        var USE_NATIVE = !!function () {
            try {
                // correct subclassing with @@species support
                var promise = $Promise.resolve(1),
                    FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
                    exec(empty, empty);
                };
                // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
                return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
            } catch (e) {/* empty */}
        }();

        // helpers
        var sameConstructor = function sameConstructor(a, b) {
            // with library wrapper special case
            return a === b || a === $Promise && b === Wrapper;
        };
        var isThenable = function isThenable(it) {
            var then;
            return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
        };
        var newPromiseCapability = function newPromiseCapability(C) {
            return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
        };
        var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
            var resolve, reject;
            this.promise = new C(function ($$resolve, $$reject) {
                if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
                resolve = $$resolve;
                reject = $$reject;
            });
            this.resolve = aFunction(resolve);
            this.reject = aFunction(reject);
        };
        var perform = function perform(exec) {
            try {
                exec();
            } catch (e) {
                return { error: e };
            }
        };
        var notify = function notify(promise, isReject) {
            if (promise._n) return;
            promise._n = true;
            var chain = promise._c;
            microtask(function () {
                var value = promise._v,
                    ok = promise._s == 1,
                    i = 0;
                var run = function run(reaction) {
                    var handler = ok ? reaction.ok : reaction.fail,
                        resolve = reaction.resolve,
                        reject = reaction.reject,
                        domain = reaction.domain,
                        result,
                        then;
                    try {
                        if (handler) {
                            if (!ok) {
                                if (promise._h == 2) onHandleUnhandled(promise);
                                promise._h = 1;
                            }
                            if (handler === true) result = value;else {
                                if (domain) domain.enter();
                                result = handler(value);
                                if (domain) domain.exit();
                            }
                            if (result === reaction.promise) {
                                reject(TypeError('Promise-chain cycle'));
                            } else if (then = isThenable(result)) {
                                then.call(result, resolve, reject);
                            } else resolve(result);
                        } else reject(value);
                    } catch (e) {
                        reject(e);
                    }
                };
                while (chain.length > i) {
                    run(chain[i++]);
                } // variable length - can't use forEach
                promise._c = [];
                promise._n = false;
                if (isReject && !promise._h) onUnhandled(promise);
            });
        };
        var onUnhandled = function onUnhandled(promise) {
            task.call(global, function () {
                var value = promise._v,
                    abrupt,
                    handler,
                    console;
                if (isUnhandled(promise)) {
                    abrupt = perform(function () {
                        if (isNode) {
                            process.emit('unhandledRejection', value, promise);
                        } else if (handler = global.onunhandledrejection) {
                            handler({ promise: promise, reason: value });
                        } else if ((console = global.console) && console.error) {
                            console.error('Unhandled promise rejection', value);
                        }
                    });
                    // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
                    promise._h = isNode || isUnhandled(promise) ? 2 : 1;
                }promise._a = undefined;
                if (abrupt) throw abrupt.error;
            });
        };
        var isUnhandled = function isUnhandled(promise) {
            if (promise._h == 1) return false;
            var chain = promise._a || promise._c,
                i = 0,
                reaction;
            while (chain.length > i) {
                reaction = chain[i++];
                if (reaction.fail || !isUnhandled(reaction.promise)) return false;
            }return true;
        };
        var onHandleUnhandled = function onHandleUnhandled(promise) {
            task.call(global, function () {
                var handler;
                if (isNode) {
                    process.emit('rejectionHandled', promise);
                } else if (handler = global.onrejectionhandled) {
                    handler({ promise: promise, reason: promise._v });
                }
            });
        };
        var $reject = function $reject(value) {
            var promise = this;
            if (promise._d) return;
            promise._d = true;
            promise = promise._w || promise; // unwrap
            promise._v = value;
            promise._s = 2;
            if (!promise._a) promise._a = promise._c.slice();
            notify(promise, true);
        };
        var $resolve = function $resolve(value) {
            var promise = this,
                then;
            if (promise._d) return;
            promise._d = true;
            promise = promise._w || promise; // unwrap
            try {
                if (promise === value) throw TypeError("Promise can't be resolved itself");
                if (then = isThenable(value)) {
                    microtask(function () {
                        var wrapper = { _w: promise, _d: false }; // wrap
                        try {
                            then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
                        } catch (e) {
                            $reject.call(wrapper, e);
                        }
                    });
                } else {
                    promise._v = value;
                    promise._s = 1;
                    notify(promise, false);
                }
            } catch (e) {
                $reject.call({ _w: promise, _d: false }, e); // wrap
            }
        };

        // constructor polyfill
        if (!USE_NATIVE) {
            // 25.4.3.1 Promise(executor)
            $Promise = function Promise(executor) {
                anInstance(this, $Promise, PROMISE, '_h');
                aFunction(executor);
                Internal.call(this);
                try {
                    executor(ctx($resolve, this, 1), ctx($reject, this, 1));
                } catch (err) {
                    $reject.call(this, err);
                }
            };
            Internal = function Promise(executor) {
                this._c = []; // <- awaiting reactions
                this._a = undefined; // <- checked in isUnhandled reactions
                this._s = 0; // <- state
                this._d = false; // <- done
                this._v = undefined; // <- value
                this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
                this._n = false; // <- notify
            };
            Internal.prototype = require('./_redefine-all')($Promise.prototype, {
                // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
                then: function then(onFulfilled, onRejected) {
                    var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
                    reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
                    reaction.fail = typeof onRejected == 'function' && onRejected;
                    reaction.domain = isNode ? process.domain : undefined;
                    this._c.push(reaction);
                    if (this._a) this._a.push(reaction);
                    if (this._s) notify(this, false);
                    return reaction.promise;
                },
                // 25.4.5.1 Promise.prototype.catch(onRejected)
                'catch': function _catch(onRejected) {
                    return this.then(undefined, onRejected);
                }
            });
            PromiseCapability = function PromiseCapability() {
                var promise = new Internal();
                this.promise = promise;
                this.resolve = ctx($resolve, promise, 1);
                this.reject = ctx($reject, promise, 1);
            };
        }

        $export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
        require('./_set-to-string-tag')($Promise, PROMISE);
        require('./_set-species')(PROMISE);
        Wrapper = require('./_core')[PROMISE];

        // statics
        $export($export.S + $export.F * !USE_NATIVE, PROMISE, {
            // 25.4.4.5 Promise.reject(r)
            reject: function reject(r) {
                var capability = newPromiseCapability(this),
                    $$reject = capability.reject;
                $$reject(r);
                return capability.promise;
            }
        });
        $export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
            // 25.4.4.6 Promise.resolve(x)
            resolve: function resolve(x) {
                // instanceof instead of internal slot check because we should fix it without replacement native Promise core
                if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
                var capability = newPromiseCapability(this),
                    $$resolve = capability.resolve;
                $$resolve(x);
                return capability.promise;
            }
        });
        $export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
            $Promise.all(iter)['catch'](empty);
        })), PROMISE, {
            // 25.4.4.1 Promise.all(iterable)
            all: function all(iterable) {
                var C = this,
                    capability = newPromiseCapability(C),
                    resolve = capability.resolve,
                    reject = capability.reject;
                var abrupt = perform(function () {
                    var values = [],
                        index = 0,
                        remaining = 1;
                    forOf(iterable, false, function (promise) {
                        var $index = index++,
                            alreadyCalled = false;
                        values.push(undefined);
                        remaining++;
                        C.resolve(promise).then(function (value) {
                            if (alreadyCalled) return;
                            alreadyCalled = true;
                            values[$index] = value;
                            --remaining || resolve(values);
                        }, reject);
                    });
                    --remaining || resolve(values);
                });
                if (abrupt) reject(abrupt.error);
                return capability.promise;
            },
            // 25.4.4.4 Promise.race(iterable)
            race: function race(iterable) {
                var C = this,
                    capability = newPromiseCapability(C),
                    reject = capability.reject;
                var abrupt = perform(function () {
                    forOf(iterable, false, function (promise) {
                        C.resolve(promise).then(capability.resolve, reject);
                    });
                });
                if (abrupt) reject(abrupt.error);
                return capability.promise;
            }
        });
    }, { "./_a-function": 12, "./_an-instance": 14, "./_classof": 17, "./_core": 19, "./_ctx": 20, "./_export": 25, "./_for-of": 27, "./_global": 28, "./_is-object": 36, "./_iter-detect": 40, "./_library": 43, "./_microtask": 44, "./_redefine-all": 52, "./_set-species": 54, "./_set-to-string-tag": 55, "./_species-constructor": 58, "./_task": 60, "./_wks": 68 }], 74: [function (require, module, exports) {
        'use strict';

        var $at = require('./_string-at')(true);

        // 21.1.3.27 String.prototype[@@iterator]()
        require('./_iter-define')(String, 'String', function (iterated) {
            this._t = String(iterated); // target
            this._i = 0; // next index
            // 21.1.5.2.1 %StringIteratorPrototype%.next()
        }, function () {
            var O = this._t,
                index = this._i,
                point;
            if (index >= O.length) return { value: undefined, done: true };
            point = $at(O, index);
            this._i += point.length;
            return { value: point, done: false };
        });
    }, { "./_iter-define": 39, "./_string-at": 59 }], 75: [function (require, module, exports) {
        require('./es6.array.iterator');
        var global = require('./_global'),
            hide = require('./_hide'),
            Iterators = require('./_iterators'),
            TO_STRING_TAG = require('./_wks')('toStringTag');

        for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
            var NAME = collections[i],
                Collection = global[NAME],
                proto = Collection && Collection.prototype;
            if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
            Iterators[NAME] = Iterators.Array;
        }
    }, { "./_global": 28, "./_hide": 30, "./_iterators": 42, "./_wks": 68, "./es6.array.iterator": 70 }], 76: [function (require, module, exports) {
        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        function EventEmitter() {
            this._events = this._events || {};
            this._maxListeners = this._maxListeners || undefined;
        }
        module.exports = EventEmitter;

        // Backwards-compat with node 0.10.x
        EventEmitter.EventEmitter = EventEmitter;

        EventEmitter.prototype._events = undefined;
        EventEmitter.prototype._maxListeners = undefined;

        // By default EventEmitters will print a warning if more than 10 listeners are
        // added to it. This is a useful default which helps finding memory leaks.
        EventEmitter.defaultMaxListeners = 10;

        // Obviously not all Emitters should be limited to 10. This function allows
        // that to be increased. Set to zero for unlimited.
        EventEmitter.prototype.setMaxListeners = function (n) {
            if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError('n must be a positive number');
            this._maxListeners = n;
            return this;
        };

        EventEmitter.prototype.emit = function (type) {
            var er, handler, len, args, i, listeners;

            if (!this._events) this._events = {};

            // If there is no 'error' event listener then throw.
            if (type === 'error') {
                if (!this._events.error || isObject(this._events.error) && !this._events.error.length) {
                    er = arguments[1];
                    if (er instanceof Error) {
                        throw er; // Unhandled 'error' event
                    } else {
                        // At least give some kind of context to the user
                        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
                        err.context = er;
                        throw err;
                    }
                }
            }

            handler = this._events[type];

            if (isUndefined(handler)) return false;

            if (isFunction(handler)) {
                switch (arguments.length) {
                    // fast cases
                    case 1:
                        handler.call(this);
                        break;
                    case 2:
                        handler.call(this, arguments[1]);
                        break;
                    case 3:
                        handler.call(this, arguments[1], arguments[2]);
                        break;
                    // slower
                    default:
                        args = Array.prototype.slice.call(arguments, 1);
                        handler.apply(this, args);
                }
            } else if (isObject(handler)) {
                args = Array.prototype.slice.call(arguments, 1);
                listeners = handler.slice();
                len = listeners.length;
                for (i = 0; i < len; i++) {
                    listeners[i].apply(this, args);
                }
            }

            return true;
        };

        EventEmitter.prototype.addListener = function (type, listener) {
            var m;

            if (!isFunction(listener)) throw TypeError('listener must be a function');

            if (!this._events) this._events = {};

            // To avoid recursion in the case that type === "newListener"! Before
            // adding it to the listeners, first emit "newListener".
            if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);

            if (!this._events[type])
                // Optimize the case of one listener. Don't need the extra array object.
                this._events[type] = listener;else if (isObject(this._events[type]))
                // If we've already got an array, just append.
                this._events[type].push(listener);else
                // Adding the second element, need to change to array.
                this._events[type] = [this._events[type], listener];

            // Check for listener leak
            if (isObject(this._events[type]) && !this._events[type].warned) {
                if (!isUndefined(this._maxListeners)) {
                    m = this._maxListeners;
                } else {
                    m = EventEmitter.defaultMaxListeners;
                }

                if (m && m > 0 && this._events[type].length > m) {
                    this._events[type].warned = true;
                    console.error('(node) warning: possible EventEmitter memory ' + 'leak detected. %d listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.', this._events[type].length);
                    if (typeof console.trace === 'function') {
                        // not supported in IE 10
                        console.trace();
                    }
                }
            }

            return this;
        };

        EventEmitter.prototype.on = EventEmitter.prototype.addListener;

        EventEmitter.prototype.once = function (type, listener) {
            if (!isFunction(listener)) throw TypeError('listener must be a function');

            var fired = false;

            function g() {
                this.removeListener(type, g);

                if (!fired) {
                    fired = true;
                    listener.apply(this, arguments);
                }
            }

            g.listener = listener;
            this.on(type, g);

            return this;
        };

        // emits a 'removeListener' event iff the listener was removed
        EventEmitter.prototype.removeListener = function (type, listener) {
            var list, position, length, i;

            if (!isFunction(listener)) throw TypeError('listener must be a function');

            if (!this._events || !this._events[type]) return this;

            list = this._events[type];
            length = list.length;
            position = -1;

            if (list === listener || isFunction(list.listener) && list.listener === listener) {
                delete this._events[type];
                if (this._events.removeListener) this.emit('removeListener', type, listener);
            } else if (isObject(list)) {
                for (i = length; i-- > 0;) {
                    if (list[i] === listener || list[i].listener && list[i].listener === listener) {
                        position = i;
                        break;
                    }
                }

                if (position < 0) return this;

                if (list.length === 1) {
                    list.length = 0;
                    delete this._events[type];
                } else {
                    list.splice(position, 1);
                }

                if (this._events.removeListener) this.emit('removeListener', type, listener);
            }

            return this;
        };

        EventEmitter.prototype.removeAllListeners = function (type) {
            var key, listeners;

            if (!this._events) return this;

            // not listening for removeListener, no need to emit
            if (!this._events.removeListener) {
                if (arguments.length === 0) this._events = {};else if (this._events[type]) delete this._events[type];
                return this;
            }

            // emit removeListener for all listeners on all events
            if (arguments.length === 0) {
                for (key in this._events) {
                    if (key === 'removeListener') continue;
                    this.removeAllListeners(key);
                }
                this.removeAllListeners('removeListener');
                this._events = {};
                return this;
            }

            listeners = this._events[type];

            if (isFunction(listeners)) {
                this.removeListener(type, listeners);
            } else if (listeners) {
                // LIFO order
                while (listeners.length) {
                    this.removeListener(type, listeners[listeners.length - 1]);
                }
            }
            delete this._events[type];

            return this;
        };

        EventEmitter.prototype.listeners = function (type) {
            var ret;
            if (!this._events || !this._events[type]) ret = [];else if (isFunction(this._events[type])) ret = [this._events[type]];else ret = this._events[type].slice();
            return ret;
        };

        EventEmitter.prototype.listenerCount = function (type) {
            if (this._events) {
                var evlistener = this._events[type];

                if (isFunction(evlistener)) return 1;else if (evlistener) return evlistener.length;
            }
            return 0;
        };

        EventEmitter.listenerCount = function (emitter, type) {
            return emitter.listenerCount(type);
        };

        function isFunction(arg) {
            return typeof arg === 'function';
        }

        function isNumber(arg) {
            return typeof arg === 'number';
        }

        function isObject(arg) {
            return (typeof arg === "undefined" ? "undefined" : (0, _typeof3.default)(arg)) === 'object' && arg !== null;
        }

        function isUndefined(arg) {
            return arg === void 0;
        }
    }, {}], 77: [function (require, module, exports) {
        // shim for using process in browser
        var process = module.exports = {};

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }
        function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
        }
        (function () {
            try {
                if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        })();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }

        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }

        process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function () {
            this.fun.apply(null, this.array);
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues
        process.versions = {};

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function (name) {
            return [];
        };

        process.binding = function (name) {
            throw new Error('process.binding is not supported');
        };

        process.cwd = function () {
            return '/';
        };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function () {
            return 0;
        };
    }, {}], 78: [function (require, module, exports) {
        (function (global) {
            // This method of obtaining a reference to the global object needs to be
            // kept identical to the way it is obtained in runtime.js
            var g = (typeof global === "undefined" ? "undefined" : (0, _typeof3.default)(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : (0, _typeof3.default)(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : (0, _typeof3.default)(self)) === "object" ? self : this;

            // Use `getOwnPropertyNames` because not all browsers support calling
            // `hasOwnProperty` on the global `self` object in a worker. See #183.
            var hadRuntime = g.regeneratorRuntime && Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

            // Save the old regeneratorRuntime in case it needs to be restored later.
            var oldRuntime = hadRuntime && g.regeneratorRuntime;

            // Force reevalutation of runtime.js.
            g.regeneratorRuntime = undefined;

            module.exports = require("./runtime");

            if (hadRuntime) {
                // Restore the original runtime.
                g.regeneratorRuntime = oldRuntime;
            } else {
                // Remove the global property added by runtime.js.
                try {
                    delete g.regeneratorRuntime;
                } catch (e) {
                    g.regeneratorRuntime = undefined;
                }
            }
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "./runtime": 79 }], 79: [function (require, module, exports) {
        (function (global) {
            /**
             * Copyright (c) 2014, Facebook, Inc.
             * All rights reserved.
             *
             * This source code is licensed under the BSD-style license found in the
             * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
             * additional grant of patent rights can be found in the PATENTS file in
             * the same directory.
             */

            !function (global) {
                "use strict";

                var Op = Object.prototype;
                var hasOwn = Op.hasOwnProperty;
                var undefined; // More compressible than void 0.
                var $Symbol = typeof Symbol === "function" ? Symbol : {};
                var iteratorSymbol = $Symbol.iterator || "@@iterator";
                var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
                var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

                var inModule = (typeof module === "undefined" ? "undefined" : (0, _typeof3.default)(module)) === "object";
                var runtime = global.regeneratorRuntime;
                if (runtime) {
                    if (inModule) {
                        // If regeneratorRuntime is defined globally and we're in a module,
                        // make the exports object identical to regeneratorRuntime.
                        module.exports = runtime;
                    }
                    // Don't bother evaluating the rest of this file if the runtime was
                    // already defined globally.
                    return;
                }

                // Define the runtime globally (as expected by generated code) as either
                // module.exports (if we're in a module) or a new, empty object.
                runtime = global.regeneratorRuntime = inModule ? module.exports : {};

                function wrap(innerFn, outerFn, self, tryLocsList) {
                    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
                    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
                    var generator = Object.create(protoGenerator.prototype);
                    var context = new Context(tryLocsList || []);

                    // The ._invoke method unifies the implementations of the .next,
                    // .throw, and .return methods.
                    generator._invoke = makeInvokeMethod(innerFn, self, context);

                    return generator;
                }
                runtime.wrap = wrap;

                // Try/catch helper to minimize deoptimizations. Returns a completion
                // record like context.tryEntries[i].completion. This interface could
                // have been (and was previously) designed to take a closure to be
                // invoked without arguments, but in all the cases we care about we
                // already have an existing method we want to call, so there's no need
                // to create a new function object. We can even get away with assuming
                // the method takes exactly one argument, since that happens to be true
                // in every case, so we don't have to touch the arguments object. The
                // only additional allocation required is the completion record, which
                // has a stable shape and so hopefully should be cheap to allocate.
                function tryCatch(fn, obj, arg) {
                    try {
                        return { type: "normal", arg: fn.call(obj, arg) };
                    } catch (err) {
                        return { type: "throw", arg: err };
                    }
                }

                var GenStateSuspendedStart = "suspendedStart";
                var GenStateSuspendedYield = "suspendedYield";
                var GenStateExecuting = "executing";
                var GenStateCompleted = "completed";

                // Returning this object from the innerFn has the same effect as
                // breaking out of the dispatch switch statement.
                var ContinueSentinel = {};

                // Dummy constructor functions that we use as the .constructor and
                // .constructor.prototype properties for functions that return Generator
                // objects. For full spec compliance, you may wish to configure your
                // minifier not to mangle the names of these two functions.
                function Generator() {}
                function GeneratorFunction() {}
                function GeneratorFunctionPrototype() {}

                // This is a polyfill for %IteratorPrototype% for environments that
                // don't natively support it.
                var IteratorPrototype = {};
                IteratorPrototype[iteratorSymbol] = function () {
                    return this;
                };

                var getProto = Object.getPrototypeOf;
                var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
                if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
                    // This environment has a native %IteratorPrototype%; use it instead
                    // of the polyfill.
                    IteratorPrototype = NativeIteratorPrototype;
                }

                var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
                GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
                GeneratorFunctionPrototype.constructor = GeneratorFunction;
                GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";

                // Helper for defining the .next, .throw, and .return methods of the
                // Iterator interface in terms of a single ._invoke method.
                function defineIteratorMethods(prototype) {
                    ["next", "throw", "return"].forEach(function (method) {
                        prototype[method] = function (arg) {
                            return this._invoke(method, arg);
                        };
                    });
                }

                runtime.isGeneratorFunction = function (genFun) {
                    var ctor = typeof genFun === "function" && genFun.constructor;
                    return ctor ? ctor === GeneratorFunction ||
                    // For the native GeneratorFunction constructor, the best we can
                    // do is to check its .name property.
                    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
                };

                runtime.mark = function (genFun) {
                    if (Object.setPrototypeOf) {
                        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
                    } else {
                        genFun.__proto__ = GeneratorFunctionPrototype;
                        if (!(toStringTagSymbol in genFun)) {
                            genFun[toStringTagSymbol] = "GeneratorFunction";
                        }
                    }
                    genFun.prototype = Object.create(Gp);
                    return genFun;
                };

                // Within the body of any async function, `await x` is transformed to
                // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
                // `hasOwn.call(value, "__await")` to determine if the yielded value is
                // meant to be awaited.
                runtime.awrap = function (arg) {
                    return { __await: arg };
                };

                function AsyncIterator(generator) {
                    function invoke(method, arg, resolve, reject) {
                        var record = tryCatch(generator[method], generator, arg);
                        if (record.type === "throw") {
                            reject(record.arg);
                        } else {
                            var result = record.arg;
                            var value = result.value;
                            if (value && (typeof value === "undefined" ? "undefined" : (0, _typeof3.default)(value)) === "object" && hasOwn.call(value, "__await")) {
                                return Promise.resolve(value.__await).then(function (value) {
                                    invoke("next", value, resolve, reject);
                                }, function (err) {
                                    invoke("throw", err, resolve, reject);
                                });
                            }

                            return Promise.resolve(value).then(function (unwrapped) {
                                // When a yielded Promise is resolved, its final value becomes
                                // the .value of the Promise<{value,done}> result for the
                                // current iteration. If the Promise is rejected, however, the
                                // result for this iteration will be rejected with the same
                                // reason. Note that rejections of yielded Promises are not
                                // thrown back into the generator function, as is the case
                                // when an awaited Promise is rejected. This difference in
                                // behavior between yield and await is important, because it
                                // allows the consumer to decide what to do with the yielded
                                // rejection (swallow it and continue, manually .throw it back
                                // into the generator, abandon iteration, whatever). With
                                // await, by contrast, there is no opportunity to examine the
                                // rejection reason outside the generator function, so the
                                // only option is to throw it from the await expression, and
                                // let the generator function handle the exception.
                                result.value = unwrapped;
                                resolve(result);
                            }, reject);
                        }
                    }

                    if ((0, _typeof3.default)(global.process) === "object" && global.process.domain) {
                        invoke = global.process.domain.bind(invoke);
                    }

                    var previousPromise;

                    function enqueue(method, arg) {
                        function callInvokeWithMethodAndArg() {
                            return new Promise(function (resolve, reject) {
                                invoke(method, arg, resolve, reject);
                            });
                        }

                        return previousPromise =
                        // If enqueue has been called before, then we want to wait until
                        // all previous Promises have been resolved before calling invoke,
                        // so that results are always delivered in the correct order. If
                        // enqueue has not been called before, then it is important to
                        // call invoke immediately, without waiting on a callback to fire,
                        // so that the async generator function has the opportunity to do
                        // any necessary setup in a predictable way. This predictability
                        // is why the Promise constructor synchronously invokes its
                        // executor callback, and why async functions synchronously
                        // execute code before the first await. Since we implement simple
                        // async functions in terms of async generators, it is especially
                        // important to get this right, even though it requires care.
                        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg,
                        // Avoid propagating failures to Promises returned by later
                        // invocations of the iterator.
                        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
                    }

                    // Define the unified helper method that is used to implement .next,
                    // .throw, and .return (see defineIteratorMethods).
                    this._invoke = enqueue;
                }

                defineIteratorMethods(AsyncIterator.prototype);
                AsyncIterator.prototype[asyncIteratorSymbol] = function () {
                    return this;
                };
                runtime.AsyncIterator = AsyncIterator;

                // Note that simple async functions are implemented on top of
                // AsyncIterator objects; they just return a Promise for the value of
                // the final result produced by the iterator.
                runtime.async = function (innerFn, outerFn, self, tryLocsList) {
                    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));

                    return runtime.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
                    : iter.next().then(function (result) {
                        return result.done ? result.value : iter.next();
                    });
                };

                function makeInvokeMethod(innerFn, self, context) {
                    var state = GenStateSuspendedStart;

                    return function invoke(method, arg) {
                        if (state === GenStateExecuting) {
                            throw new Error("Generator is already running");
                        }

                        if (state === GenStateCompleted) {
                            if (method === "throw") {
                                throw arg;
                            }

                            // Be forgiving, per 25.3.3.3.3 of the spec:
                            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
                            return doneResult();
                        }

                        context.method = method;
                        context.arg = arg;

                        while (true) {
                            var delegate = context.delegate;
                            if (delegate) {
                                var delegateResult = maybeInvokeDelegate(delegate, context);
                                if (delegateResult) {
                                    if (delegateResult === ContinueSentinel) continue;
                                    return delegateResult;
                                }
                            }

                            if (context.method === "next") {
                                // Setting context._sent for legacy support of Babel's
                                // function.sent implementation.
                                context.sent = context._sent = context.arg;
                            } else if (context.method === "throw") {
                                if (state === GenStateSuspendedStart) {
                                    state = GenStateCompleted;
                                    throw context.arg;
                                }

                                context.dispatchException(context.arg);
                            } else if (context.method === "return") {
                                context.abrupt("return", context.arg);
                            }

                            state = GenStateExecuting;

                            var record = tryCatch(innerFn, self, context);
                            if (record.type === "normal") {
                                // If an exception is thrown from innerFn, we leave state ===
                                // GenStateExecuting and loop back for another invocation.
                                state = context.done ? GenStateCompleted : GenStateSuspendedYield;

                                if (record.arg === ContinueSentinel) {
                                    continue;
                                }

                                return {
                                    value: record.arg,
                                    done: context.done
                                };
                            } else if (record.type === "throw") {
                                state = GenStateCompleted;
                                // Dispatch the exception by looping back around to the
                                // context.dispatchException(context.arg) call above.
                                context.method = "throw";
                                context.arg = record.arg;
                            }
                        }
                    };
                }

                // Call delegate.iterator[context.method](context.arg) and handle the
                // result, either by returning a { value, done } result from the
                // delegate iterator, or by modifying context.method and context.arg,
                // setting context.delegate to null, and returning the ContinueSentinel.
                function maybeInvokeDelegate(delegate, context) {
                    var method = delegate.iterator[context.method];
                    if (method === undefined) {
                        // A .throw or .return when the delegate iterator has no .throw
                        // method always terminates the yield* loop.
                        context.delegate = null;

                        if (context.method === "throw") {
                            if (delegate.iterator.return) {
                                // If the delegate iterator has a return method, give it a
                                // chance to clean up.
                                context.method = "return";
                                context.arg = undefined;
                                maybeInvokeDelegate(delegate, context);

                                if (context.method === "throw") {
                                    // If maybeInvokeDelegate(context) changed context.method from
                                    // "return" to "throw", let that override the TypeError below.
                                    return ContinueSentinel;
                                }
                            }

                            context.method = "throw";
                            context.arg = new TypeError("The iterator does not provide a 'throw' method");
                        }

                        return ContinueSentinel;
                    }

                    var record = tryCatch(method, delegate.iterator, context.arg);

                    if (record.type === "throw") {
                        context.method = "throw";
                        context.arg = record.arg;
                        context.delegate = null;
                        return ContinueSentinel;
                    }

                    var info = record.arg;

                    if (!info) {
                        context.method = "throw";
                        context.arg = new TypeError("iterator result is not an object");
                        context.delegate = null;
                        return ContinueSentinel;
                    }

                    if (info.done) {
                        // Assign the result of the finished delegate to the temporary
                        // variable specified by delegate.resultName (see delegateYield).
                        context[delegate.resultName] = info.value;

                        // Resume execution at the desired location (see delegateYield).
                        context.next = delegate.nextLoc;

                        // If context.method was "throw" but the delegate handled the
                        // exception, let the outer generator proceed normally. If
                        // context.method was "next", forget context.arg since it has been
                        // "consumed" by the delegate iterator. If context.method was
                        // "return", allow the original .return call to continue in the
                        // outer generator.
                        if (context.method !== "return") {
                            context.method = "next";
                            context.arg = undefined;
                        }
                    } else {
                        // Re-yield the result returned by the delegate method.
                        return info;
                    }

                    // The delegate iterator is finished, so forget it and continue with
                    // the outer generator.
                    context.delegate = null;
                    return ContinueSentinel;
                }

                // Define Generator.prototype.{next,throw,return} in terms of the
                // unified ._invoke helper method.
                defineIteratorMethods(Gp);

                Gp[toStringTagSymbol] = "Generator";

                // A Generator should always return itself as the iterator object when the
                // @@iterator function is called on it. Some browsers' implementations of the
                // iterator prototype chain incorrectly implement this, causing the Generator
                // object to not be returned from this call. This ensures that doesn't happen.
                // See https://github.com/facebook/regenerator/issues/274 for more details.
                Gp[iteratorSymbol] = function () {
                    return this;
                };

                Gp.toString = function () {
                    return "[object Generator]";
                };

                function pushTryEntry(locs) {
                    var entry = { tryLoc: locs[0] };

                    if (1 in locs) {
                        entry.catchLoc = locs[1];
                    }

                    if (2 in locs) {
                        entry.finallyLoc = locs[2];
                        entry.afterLoc = locs[3];
                    }

                    this.tryEntries.push(entry);
                }

                function resetTryEntry(entry) {
                    var record = entry.completion || {};
                    record.type = "normal";
                    delete record.arg;
                    entry.completion = record;
                }

                function Context(tryLocsList) {
                    // The root entry object (effectively a try statement without a catch
                    // or a finally block) gives us a place to store values thrown from
                    // locations where there is no enclosing try statement.
                    this.tryEntries = [{ tryLoc: "root" }];
                    tryLocsList.forEach(pushTryEntry, this);
                    this.reset(true);
                }

                runtime.keys = function (object) {
                    var keys = [];
                    for (var key in object) {
                        keys.push(key);
                    }
                    keys.reverse();

                    // Rather than returning an object with a next method, we keep
                    // things simple and return the next function itself.
                    return function next() {
                        while (keys.length) {
                            var key = keys.pop();
                            if (key in object) {
                                next.value = key;
                                next.done = false;
                                return next;
                            }
                        }

                        // To avoid creating an additional object, we just hang the .value
                        // and .done properties off the next function object itself. This
                        // also ensures that the minifier will not anonymize the function.
                        next.done = true;
                        return next;
                    };
                };

                function values(iterable) {
                    if (iterable) {
                        var iteratorMethod = iterable[iteratorSymbol];
                        if (iteratorMethod) {
                            return iteratorMethod.call(iterable);
                        }

                        if (typeof iterable.next === "function") {
                            return iterable;
                        }

                        if (!isNaN(iterable.length)) {
                            var i = -1,
                                next = function next() {
                                while (++i < iterable.length) {
                                    if (hasOwn.call(iterable, i)) {
                                        next.value = iterable[i];
                                        next.done = false;
                                        return next;
                                    }
                                }

                                next.value = undefined;
                                next.done = true;

                                return next;
                            };

                            return next.next = next;
                        }
                    }

                    // Return an iterator with no values.
                    return { next: doneResult };
                }
                runtime.values = values;

                function doneResult() {
                    return { value: undefined, done: true };
                }

                Context.prototype = {
                    constructor: Context,

                    reset: function reset(skipTempReset) {
                        this.prev = 0;
                        this.next = 0;
                        // Resetting context._sent for legacy support of Babel's
                        // function.sent implementation.
                        this.sent = this._sent = undefined;
                        this.done = false;
                        this.delegate = null;

                        this.method = "next";
                        this.arg = undefined;

                        this.tryEntries.forEach(resetTryEntry);

                        if (!skipTempReset) {
                            for (var name in this) {
                                // Not sure about the optimal order of these conditions:
                                if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                                    this[name] = undefined;
                                }
                            }
                        }
                    },

                    stop: function stop() {
                        this.done = true;

                        var rootEntry = this.tryEntries[0];
                        var rootRecord = rootEntry.completion;
                        if (rootRecord.type === "throw") {
                            throw rootRecord.arg;
                        }

                        return this.rval;
                    },

                    dispatchException: function dispatchException(exception) {
                        if (this.done) {
                            throw exception;
                        }

                        var context = this;
                        function handle(loc, caught) {
                            record.type = "throw";
                            record.arg = exception;
                            context.next = loc;

                            if (caught) {
                                // If the dispatched exception was caught by a catch block,
                                // then let that catch block handle the exception normally.
                                context.method = "next";
                                context.arg = undefined;
                            }

                            return !!caught;
                        }

                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            var record = entry.completion;

                            if (entry.tryLoc === "root") {
                                // Exception thrown outside of any try block that could handle
                                // it, so set the completion value of the entire function to
                                // throw the exception.
                                return handle("end");
                            }

                            if (entry.tryLoc <= this.prev) {
                                var hasCatch = hasOwn.call(entry, "catchLoc");
                                var hasFinally = hasOwn.call(entry, "finallyLoc");

                                if (hasCatch && hasFinally) {
                                    if (this.prev < entry.catchLoc) {
                                        return handle(entry.catchLoc, true);
                                    } else if (this.prev < entry.finallyLoc) {
                                        return handle(entry.finallyLoc);
                                    }
                                } else if (hasCatch) {
                                    if (this.prev < entry.catchLoc) {
                                        return handle(entry.catchLoc, true);
                                    }
                                } else if (hasFinally) {
                                    if (this.prev < entry.finallyLoc) {
                                        return handle(entry.finallyLoc);
                                    }
                                } else {
                                    throw new Error("try statement without catch or finally");
                                }
                            }
                        }
                    },

                    abrupt: function abrupt(type, arg) {
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                                var finallyEntry = entry;
                                break;
                            }
                        }

                        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
                            // Ignore the finally entry if control is not jumping to a
                            // location outside the try/catch block.
                            finallyEntry = null;
                        }

                        var record = finallyEntry ? finallyEntry.completion : {};
                        record.type = type;
                        record.arg = arg;

                        if (finallyEntry) {
                            this.method = "next";
                            this.next = finallyEntry.finallyLoc;
                            return ContinueSentinel;
                        }

                        return this.complete(record);
                    },

                    complete: function complete(record, afterLoc) {
                        if (record.type === "throw") {
                            throw record.arg;
                        }

                        if (record.type === "break" || record.type === "continue") {
                            this.next = record.arg;
                        } else if (record.type === "return") {
                            this.rval = this.arg = record.arg;
                            this.method = "return";
                            this.next = "end";
                        } else if (record.type === "normal" && afterLoc) {
                            this.next = afterLoc;
                        }

                        return ContinueSentinel;
                    },

                    finish: function finish(finallyLoc) {
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            if (entry.finallyLoc === finallyLoc) {
                                this.complete(entry.completion, entry.afterLoc);
                                resetTryEntry(entry);
                                return ContinueSentinel;
                            }
                        }
                    },

                    "catch": function _catch(tryLoc) {
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var entry = this.tryEntries[i];
                            if (entry.tryLoc === tryLoc) {
                                var record = entry.completion;
                                if (record.type === "throw") {
                                    var thrown = record.arg;
                                    resetTryEntry(entry);
                                }
                                return thrown;
                            }
                        }

                        // The context.catch method must only be called with a location
                        // argument that corresponds to a known catch block.
                        throw new Error("illegal catch attempt");
                    },

                    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
                        this.delegate = {
                            iterator: values(iterable),
                            resultName: resultName,
                            nextLoc: nextLoc
                        };

                        if (this.method === "next") {
                            // Deliberately forget the last sent value so that we don't
                            // accidentally pass it on to the delegate.
                            this.arg = undefined;
                        }

                        return ContinueSentinel;
                    }
                };
            }(
            // Among the various tricks for obtaining a reference to the global
            // object, this seems to be the most reliable technique that does not
            // use indirect eval (which violates Content Security Policy).
            (typeof global === "undefined" ? "undefined" : (0, _typeof3.default)(global)) === "object" ? global : (typeof window === "undefined" ? "undefined" : (0, _typeof3.default)(window)) === "object" ? window : (typeof self === "undefined" ? "undefined" : (0, _typeof3.default)(self)) === "object" ? self : this);
        }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}], 80: [function (require, module, exports) {
        (function (process, global) {
            /**
            * @license
            * Copyright Google Inc. All Rights Reserved.
            *
            * Use of this source code is governed by an MIT-style license that can be
            * found in the LICENSE file at https://angular.io/license
            */
            (function (global, factory) {
                (typeof exports === "undefined" ? "undefined" : (0, _typeof3.default)(exports)) === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : factory();
            })(this, function () {
                'use strict';

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */

                var Zone$1 = function (global) {
                    if (global['Zone']) {
                        throw new Error('Zone already loaded.');
                    }
                    var NO_ZONE = { name: 'NO ZONE' };
                    var notScheduled = 'notScheduled',
                        scheduling = 'scheduling',
                        scheduled = 'scheduled',
                        running = 'running',
                        canceling = 'canceling',
                        unknown = 'unknown';
                    var microTask = 'microTask',
                        macroTask = 'macroTask',
                        eventTask = 'eventTask';
                    var Zone = function () {
                        function Zone(parent, zoneSpec) {
                            this._properties = null;
                            this._parent = parent;
                            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
                            this._properties = zoneSpec && zoneSpec.properties || {};
                            this._zoneDelegate = new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
                        }
                        Zone.assertZonePatched = function () {
                            if (global.Promise !== ZoneAwarePromise) {
                                throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' + 'has been overwritten.\n' + 'Most likely cause is that a Promise polyfill has been loaded ' + 'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' + 'If you must load one, do so before loading zone.js.)');
                            }
                        };
                        Object.defineProperty(Zone, "root", {
                            get: function get() {
                                var zone = Zone.current;
                                while (zone.parent) {
                                    zone = zone.parent;
                                }
                                return zone;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        Object.defineProperty(Zone, "current", {
                            get: function get() {
                                return _currentZoneFrame.zone;
                            },
                            enumerable: true,
                            configurable: true
                        });

                        Object.defineProperty(Zone, "currentTask", {
                            get: function get() {
                                return _currentTask;
                            },
                            enumerable: true,
                            configurable: true
                        });

                        Object.defineProperty(Zone.prototype, "parent", {
                            get: function get() {
                                return this._parent;
                            },
                            enumerable: true,
                            configurable: true
                        });

                        Object.defineProperty(Zone.prototype, "name", {
                            get: function get() {
                                return this._name;
                            },
                            enumerable: true,
                            configurable: true
                        });

                        Zone.prototype.get = function (key) {
                            var zone = this.getZoneWith(key);
                            if (zone) return zone._properties[key];
                        };
                        Zone.prototype.getZoneWith = function (key) {
                            var current = this;
                            while (current) {
                                if (current._properties.hasOwnProperty(key)) {
                                    return current;
                                }
                                current = current._parent;
                            }
                            return null;
                        };
                        Zone.prototype.fork = function (zoneSpec) {
                            if (!zoneSpec) throw new Error('ZoneSpec required!');
                            return this._zoneDelegate.fork(this, zoneSpec);
                        };
                        Zone.prototype.wrap = function (callback, source) {
                            if (typeof callback !== 'function') {
                                throw new Error('Expecting function got: ' + callback);
                            }
                            var _callback = this._zoneDelegate.intercept(this, callback, source);
                            var zone = this;
                            return function () {
                                return zone.runGuarded(_callback, this, arguments, source);
                            };
                        };
                        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
                            if (applyThis === void 0) {
                                applyThis = undefined;
                            }
                            if (applyArgs === void 0) {
                                applyArgs = null;
                            }
                            if (source === void 0) {
                                source = null;
                            }
                            _currentZoneFrame = new ZoneFrame(_currentZoneFrame, this);
                            try {
                                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                            } finally {
                                _currentZoneFrame = _currentZoneFrame.parent;
                            }
                        };
                        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
                            if (applyThis === void 0) {
                                applyThis = null;
                            }
                            if (applyArgs === void 0) {
                                applyArgs = null;
                            }
                            if (source === void 0) {
                                source = null;
                            }
                            _currentZoneFrame = new ZoneFrame(_currentZoneFrame, this);
                            try {
                                try {
                                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                                } catch (error) {
                                    if (this._zoneDelegate.handleError(this, error)) {
                                        throw error;
                                    }
                                }
                            } finally {
                                _currentZoneFrame = _currentZoneFrame.parent;
                            }
                        };
                        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
                            if (task.zone != this) throw new Error('A task can only be run in the zone of creation! (Creation: ' + (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
                            var reEntryGuard = task.state != running;
                            reEntryGuard && task._transitionTo(running, scheduled);
                            task.runCount++;
                            var previousTask = _currentTask;
                            _currentTask = task;
                            _currentZoneFrame = new ZoneFrame(_currentZoneFrame, this);
                            try {
                                if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                                    task.cancelFn = null;
                                }
                                try {
                                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                                } catch (error) {
                                    if (this._zoneDelegate.handleError(this, error)) {
                                        throw error;
                                    }
                                }
                            } finally {
                                // if the task's state is notScheduled or unknown, then it has already been cancelled
                                // we should not reset the state to scheduled
                                if (task.state !== notScheduled && task.state !== unknown) {
                                    if (task.type == eventTask || task.data && task.data.isPeriodic) {
                                        reEntryGuard && task._transitionTo(scheduled, running);
                                    } else {
                                        task.runCount = 0;
                                        this._updateTaskCount(task, -1);
                                        reEntryGuard && task._transitionTo(notScheduled, running, notScheduled);
                                    }
                                }
                                _currentZoneFrame = _currentZoneFrame.parent;
                                _currentTask = previousTask;
                            }
                        };
                        Zone.prototype.scheduleTask = function (task) {
                            if (task.zone && task.zone !== this) {
                                // check if the task was rescheduled, the newZone
                                // should not be the children of the original zone
                                var newZone = this;
                                while (newZone) {
                                    if (newZone === task.zone) {
                                        throw Error("can not reschedule task to " + this.name + " which is descendants of the original zone " + task.zone.name);
                                    }
                                    newZone = newZone.parent;
                                }
                            }
                            task._transitionTo(scheduling, notScheduled);
                            var zoneDelegates = [];
                            task._zoneDelegates = zoneDelegates;
                            task._zone = this;
                            try {
                                task = this._zoneDelegate.scheduleTask(this, task);
                            } catch (err) {
                                // should set task's state to unknown when scheduleTask throw error
                                // because the err may from reschedule, so the fromState maybe notScheduled
                                task._transitionTo(unknown, scheduling, notScheduled);
                                // TODO: @JiaLiPassion, should we check the result from handleError?
                                this._zoneDelegate.handleError(this, err);
                                throw err;
                            }
                            if (task._zoneDelegates === zoneDelegates) {
                                // we have to check because internally the delegate can reschedule the task.
                                this._updateTaskCount(task, 1);
                            }
                            if (task.state == scheduling) {
                                task._transitionTo(scheduled, scheduling);
                            }
                            return task;
                        };
                        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
                            return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, null));
                        };
                        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
                            return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
                        };
                        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
                            return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
                        };
                        Zone.prototype.cancelTask = function (task) {
                            if (task.zone != this) throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' + (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
                            task._transitionTo(canceling, scheduled, running);
                            try {
                                this._zoneDelegate.cancelTask(this, task);
                            } catch (err) {
                                // if error occurs when cancelTask, transit the state to unknown
                                task._transitionTo(unknown, canceling);
                                this._zoneDelegate.handleError(this, err);
                                throw err;
                            }
                            this._updateTaskCount(task, -1);
                            task._transitionTo(notScheduled, canceling);
                            task.runCount = 0;
                            return task;
                        };
                        Zone.prototype._updateTaskCount = function (task, count) {
                            var zoneDelegates = task._zoneDelegates;
                            if (count == -1) {
                                task._zoneDelegates = null;
                            }
                            for (var i = 0; i < zoneDelegates.length; i++) {
                                zoneDelegates[i]._updateTaskCount(task.type, count);
                            }
                        };
                        return Zone;
                    }();
                    Zone.__symbol__ = __symbol__;
                    var DELEGATE_ZS = {
                        name: '',
                        onHasTask: function onHasTask(delegate, _, target, hasTaskState) {
                            return delegate.hasTask(target, hasTaskState);
                        },
                        onScheduleTask: function onScheduleTask(delegate, _, target, task) {
                            return delegate.scheduleTask(target, task);
                        },
                        onInvokeTask: function onInvokeTask(delegate, _, target, task, applyThis, applyArgs) {
                            return delegate.invokeTask(target, task, applyThis, applyArgs);
                        },
                        onCancelTask: function onCancelTask(delegate, _, target, task) {
                            return delegate.cancelTask(target, task);
                        }
                    };
                    var ZoneDelegate = function () {
                        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
                            this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
                            this.zone = zone;
                            this._parentDelegate = parentDelegate;
                            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
                            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
                            this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
                            this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
                            this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
                            this._interceptCurrZone = zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
                            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
                            this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
                            this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
                            this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
                            this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
                            this._handleErrorCurrZone = zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
                            this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
                            this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
                            this._scheduleTaskCurrZone = zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
                            this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
                            this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
                            this._invokeTaskCurrZone = zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
                            this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
                            this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
                            this._cancelTaskCurrZone = zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
                            this._hasTaskZS = null;
                            this._hasTaskDlgt = null;
                            this._hasTaskDlgtOwner = null;
                            this._hasTaskCurrZone = null;
                            var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
                            var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
                            if (zoneSpecHasTask || parentHasTask) {
                                // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                                // a case all task related interceptors must go through this ZD. We can't short circuit it.
                                this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                                this._hasTaskDlgt = parentDelegate;
                                this._hasTaskDlgtOwner = this;
                                this._hasTaskCurrZone = zone;
                                if (!zoneSpec.onScheduleTask) {
                                    this._scheduleTaskZS = DELEGATE_ZS;
                                    this._scheduleTaskDlgt = parentDelegate;
                                    this._scheduleTaskCurrZone = this.zone;
                                }
                                if (!zoneSpec.onInvokeTask) {
                                    this._invokeTaskZS = DELEGATE_ZS;
                                    this._invokeTaskDlgt = parentDelegate;
                                    this._invokeTaskCurrZone = this.zone;
                                }
                                if (!zoneSpec.onCancelTask) {
                                    this._cancelTaskZS = DELEGATE_ZS;
                                    this._cancelTaskDlgt = parentDelegate;
                                    this._cancelTaskCurrZone = this.zone;
                                }
                            }
                        }
                        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
                            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new Zone(targetZone, zoneSpec);
                        };
                        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
                            return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) : callback;
                        };
                        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
                            return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) : callback.apply(applyThis, applyArgs);
                        };
                        ZoneDelegate.prototype.handleError = function (targetZone, error) {
                            return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) : true;
                        };
                        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
                            var returnTask = task;
                            if (this._scheduleTaskZS) {
                                if (this._hasTaskZS) {
                                    returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                                }
                                returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                                if (!returnTask) returnTask = task;
                            } else {
                                if (task.scheduleFn) {
                                    task.scheduleFn(task);
                                } else if (task.type == microTask) {
                                    scheduleMicroTask(task);
                                } else {
                                    throw new Error('Task is missing scheduleFn.');
                                }
                            }
                            return returnTask;
                        };
                        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
                            return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
                        };
                        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
                            var value;
                            if (this._cancelTaskZS) {
                                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
                            } else {
                                if (!task.cancelFn) {
                                    throw Error('Task is not cancelable');
                                }
                                value = task.cancelFn(task);
                            }
                            return value;
                        };
                        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
                            // hasTask should not throw error so other ZoneDelegate
                            // can still trigger hasTask callback
                            try {
                                return this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
                            } catch (err) {
                                this.handleError(targetZone, err);
                            }
                        };
                        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
                            var counts = this._taskCounts;
                            var prev = counts[type];
                            var next = counts[type] = prev + count;
                            if (next < 0) {
                                throw new Error('More tasks executed then were scheduled.');
                            }
                            if (prev == 0 || next == 0) {
                                var isEmpty = {
                                    microTask: counts.microTask > 0,
                                    macroTask: counts.macroTask > 0,
                                    eventTask: counts.eventTask > 0,
                                    change: type
                                };
                                this.hasTask(this.zone, isEmpty);
                            }
                        };
                        return ZoneDelegate;
                    }();
                    var ZoneTask = function () {
                        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
                            this._zone = null;
                            this.runCount = 0;
                            this._zoneDelegates = null;
                            this._state = 'notScheduled';
                            this.type = type;
                            this.source = source;
                            this.data = options;
                            this.scheduleFn = scheduleFn;
                            this.cancelFn = cancelFn;
                            this.callback = callback;
                            var self = this;
                            this.invoke = function () {
                                _numberOfNestedTaskFrames++;
                                try {
                                    self.runCount++;
                                    return self.zone.runTask(self, this, arguments);
                                } finally {
                                    if (_numberOfNestedTaskFrames == 1) {
                                        drainMicroTaskQueue();
                                    }
                                    _numberOfNestedTaskFrames--;
                                }
                            };
                        }
                        Object.defineProperty(ZoneTask.prototype, "zone", {
                            get: function get() {
                                return this._zone;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        Object.defineProperty(ZoneTask.prototype, "state", {
                            get: function get() {
                                return this._state;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        ZoneTask.prototype.cancelScheduleRequest = function () {
                            this._transitionTo(notScheduled, scheduling);
                        };
                        ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
                            if (this._state === fromState1 || this._state === fromState2) {
                                this._state = toState;
                                if (toState == notScheduled) {
                                    this._zoneDelegates = null;
                                }
                            } else {
                                throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ? ' or \'' + fromState2 + '\'' : '') + ", was '" + this._state + "'.");
                            }
                        };
                        ZoneTask.prototype.toString = function () {
                            if (this.data && typeof this.data.handleId !== 'undefined') {
                                return this.data.handleId;
                            } else {
                                return Object.prototype.toString.call(this);
                            }
                        };
                        // add toJSON method to prevent cyclic error when
                        // call JSON.stringify(zoneTask)
                        ZoneTask.prototype.toJSON = function () {
                            return {
                                type: this.type,
                                state: this.state,
                                source: this.source,
                                zone: this.zone.name,
                                invoke: this.invoke,
                                scheduleFn: this.scheduleFn,
                                cancelFn: this.cancelFn,
                                runCount: this.runCount,
                                callback: this.callback
                            };
                        };
                        return ZoneTask;
                    }();
                    var ZoneFrame = function () {
                        function ZoneFrame(parent, zone) {
                            this.parent = parent;
                            this.zone = zone;
                        }
                        return ZoneFrame;
                    }();
                    function __symbol__(name) {
                        return '__zone_symbol__' + name;
                    }
                    var symbolSetTimeout = __symbol__('setTimeout');
                    var symbolPromise = __symbol__('Promise');
                    var symbolThen = __symbol__('then');
                    var _currentZoneFrame = new ZoneFrame(null, new Zone(null, null));
                    var _currentTask = null;
                    var _microTaskQueue = [];
                    var _isDrainingMicrotaskQueue = false;
                    var _uncaughtPromiseErrors = [];
                    var _numberOfNestedTaskFrames = 0;
                    function scheduleQueueDrain() {
                        // if we are not running in any task, and there has not been anything scheduled
                        // we must bootstrap the initial task creation by manually scheduling the drain
                        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
                            // We are not running in Task, so we need to kickstart the microtask queue.
                            if (global[symbolPromise]) {
                                global[symbolPromise].resolve(0)[symbolThen](drainMicroTaskQueue);
                            } else {
                                global[symbolSetTimeout](drainMicroTaskQueue, 0);
                            }
                        }
                    }
                    function scheduleMicroTask(task) {
                        scheduleQueueDrain();
                        _microTaskQueue.push(task);
                    }
                    function consoleError(e) {
                        if (Zone[__symbol__('ignoreConsoleErrorUncaughtError')]) {
                            return;
                        }
                        var rejection = e && e.rejection;
                        if (rejection) {
                            console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
                        }
                        console.error(e);
                    }
                    function handleUnhandledRejection(e) {
                        consoleError(e);
                        try {
                            var handler = Zone[__symbol__('unhandledPromiseRejectionHandler')];
                            if (handler && typeof handler === 'function') {
                                handler.apply(this, [e]);
                            }
                        } catch (err) {}
                    }
                    function drainMicroTaskQueue() {
                        if (!_isDrainingMicrotaskQueue) {
                            _isDrainingMicrotaskQueue = true;
                            while (_microTaskQueue.length) {
                                var queue = _microTaskQueue;
                                _microTaskQueue = [];
                                for (var i = 0; i < queue.length; i++) {
                                    var task = queue[i];
                                    try {
                                        task.zone.runTask(task, null, null);
                                    } catch (error) {
                                        consoleError(error);
                                    }
                                }
                            }
                            while (_uncaughtPromiseErrors.length) {
                                var _loop_1 = function _loop_1() {
                                    var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                                    try {
                                        uncaughtPromiseError.zone.runGuarded(function () {
                                            throw uncaughtPromiseError;
                                        });
                                    } catch (error) {
                                        handleUnhandledRejection(error);
                                    }
                                };
                                while (_uncaughtPromiseErrors.length) {
                                    _loop_1();
                                }
                            }
                            _isDrainingMicrotaskQueue = false;
                        }
                    }
                    function isThenable(value) {
                        return value && value.then;
                    }
                    function forwardResolution(value) {
                        return value;
                    }
                    function forwardRejection(rejection) {
                        return ZoneAwarePromise.reject(rejection);
                    }
                    var symbolState = __symbol__('state');
                    var symbolValue = __symbol__('value');
                    var source = 'Promise.then';
                    var UNRESOLVED = null;
                    var RESOLVED = true;
                    var REJECTED = false;
                    var REJECTED_NO_CATCH = 0;
                    function makeResolver(promise, state) {
                        return function (v) {
                            try {
                                resolvePromise(promise, state, v);
                            } catch (err) {
                                resolvePromise(promise, false, err);
                            }
                            // Do not return value or you will break the Promise spec.
                        };
                    }
                    var once = function once() {
                        var wasCalled = false;
                        return function wrapper(wrappedFunction) {
                            return function () {
                                if (wasCalled) {
                                    return;
                                }
                                wasCalled = true;
                                wrappedFunction.apply(null, arguments);
                            };
                        };
                    };
                    // Promise Resolution
                    function resolvePromise(promise, state, value) {
                        var onceWrapper = once();
                        if (promise === value) {
                            throw new TypeError('Promise resolved with itself');
                        }
                        if (promise[symbolState] === UNRESOLVED) {
                            // should only get value.then once based on promise spec.
                            var then = null;
                            try {
                                if ((typeof value === "undefined" ? "undefined" : (0, _typeof3.default)(value)) === 'object' || typeof value === 'function') {
                                    then = value && value.then;
                                }
                            } catch (err) {
                                onceWrapper(function () {
                                    resolvePromise(promise, false, err);
                                })();
                                return promise;
                            }
                            // if (value instanceof ZoneAwarePromise) {
                            if (state !== REJECTED && value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
                                clearRejectedNoCatch(value);
                                resolvePromise(promise, value[symbolState], value[symbolValue]);
                            } else if (state !== REJECTED && typeof then === 'function') {
                                try {
                                    then.apply(value, [onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false))]);
                                } catch (err) {
                                    onceWrapper(function () {
                                        resolvePromise(promise, false, err);
                                    })();
                                }
                            } else {
                                promise[symbolState] = state;
                                var queue = promise[symbolValue];
                                promise[symbolValue] = value;
                                // record task information in value when error occurs, so we can
                                // do some additional work such as render longStackTrace
                                if (state === REJECTED && value instanceof Error) {
                                    value[__symbol__('currentTask')] = Zone.currentTask;
                                }
                                for (var i = 0; i < queue.length;) {
                                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                                }
                                if (queue.length == 0 && state == REJECTED) {
                                    promise[symbolState] = REJECTED_NO_CATCH;
                                    try {
                                        throw new Error('Uncaught (in promise): ' + value + (value && value.stack ? '\n' + value.stack : ''));
                                    } catch (err) {
                                        var error_1 = err;
                                        error_1.rejection = value;
                                        error_1.promise = promise;
                                        error_1.zone = Zone.current;
                                        error_1.task = Zone.currentTask;
                                        _uncaughtPromiseErrors.push(error_1);
                                        scheduleQueueDrain();
                                    }
                                }
                            }
                        }
                        // Resolving an already resolved promise is a noop.
                        return promise;
                    }
                    function clearRejectedNoCatch(promise) {
                        if (promise[symbolState] === REJECTED_NO_CATCH) {
                            // if the promise is rejected no catch status
                            // and queue.length > 0, means there is a error handler
                            // here to handle the rejected promise, we should trigger
                            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
                            // eventHandler
                            try {
                                var handler = Zone[__symbol__('rejectionHandledHandler')];
                                if (handler && typeof handler === 'function') {
                                    handler.apply(this, [{ rejection: promise[symbolValue], promise: promise }]);
                                }
                            } catch (err) {}
                            promise[symbolState] = REJECTED;
                            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                                if (promise === _uncaughtPromiseErrors[i].promise) {
                                    _uncaughtPromiseErrors.splice(i, 1);
                                }
                            }
                        }
                    }
                    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
                        clearRejectedNoCatch(promise);
                        var delegate = promise[symbolState] ? typeof onFulfilled === 'function' ? onFulfilled : forwardResolution : typeof onRejected === 'function' ? onRejected : forwardRejection;
                        zone.scheduleMicroTask(source, function () {
                            try {
                                resolvePromise(chainPromise, true, zone.run(delegate, undefined, [promise[symbolValue]]));
                            } catch (error) {
                                resolvePromise(chainPromise, false, error);
                            }
                        });
                    }
                    var ZoneAwarePromise = function () {
                        function ZoneAwarePromise(executor) {
                            var promise = this;
                            if (!(promise instanceof ZoneAwarePromise)) {
                                throw new Error('Must be an instanceof Promise.');
                            }
                            promise[symbolState] = UNRESOLVED;
                            promise[symbolValue] = []; // queue;
                            try {
                                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
                            } catch (error) {
                                resolvePromise(promise, false, error);
                            }
                        }
                        ZoneAwarePromise.toString = function () {
                            return 'function ZoneAwarePromise() { [native code] }';
                        };
                        ZoneAwarePromise.resolve = function (value) {
                            return resolvePromise(new this(null), RESOLVED, value);
                        };
                        ZoneAwarePromise.reject = function (error) {
                            return resolvePromise(new this(null), REJECTED, error);
                        };
                        ZoneAwarePromise.race = function (values) {
                            var resolve;
                            var reject;
                            var promise = new this(function (res, rej) {
                                _a = [res, rej], resolve = _a[0], reject = _a[1];
                                var _a;
                            });
                            function onResolve(value) {
                                promise && (promise = null || resolve(value));
                            }
                            function onReject(error) {
                                promise && (promise = null || reject(error));
                            }
                            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                                var value = values_1[_i];
                                if (!isThenable(value)) {
                                    value = this.resolve(value);
                                }
                                value.then(onResolve, onReject);
                            }
                            return promise;
                        };
                        ZoneAwarePromise.all = function (values) {
                            var resolve;
                            var reject;
                            var promise = new this(function (res, rej) {
                                resolve = res;
                                reject = rej;
                            });
                            var count = 0;
                            var resolvedValues = [];
                            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                                var value = values_2[_i];
                                if (!isThenable(value)) {
                                    value = this.resolve(value);
                                }
                                value.then(function (index) {
                                    return function (value) {
                                        resolvedValues[index] = value;
                                        count--;
                                        if (!count) {
                                            resolve(resolvedValues);
                                        }
                                    };
                                }(count), reject);
                                count++;
                            }
                            if (!count) resolve(resolvedValues);
                            return promise;
                        };
                        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
                            var chainPromise = new this.constructor(null);
                            var zone = Zone.current;
                            if (this[symbolState] == UNRESOLVED) {
                                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
                            } else {
                                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
                            }
                            return chainPromise;
                        };
                        ZoneAwarePromise.prototype.catch = function (onRejected) {
                            return this.then(null, onRejected);
                        };
                        return ZoneAwarePromise;
                    }();
                    // Protect against aggressive optimizers dropping seemingly unused properties.
                    // E.g. Closure Compiler in advanced mode.
                    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
                    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
                    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
                    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
                    var NativePromise = global[symbolPromise] = global['Promise'];
                    global['Promise'] = ZoneAwarePromise;
                    var symbolThenPatched = __symbol__('thenPatched');
                    function patchThen(Ctor) {
                        var proto = Ctor.prototype;
                        var originalThen = proto.then;
                        // Keep a reference to the original method.
                        proto[symbolThen] = originalThen;
                        Ctor.prototype.then = function (onResolve, onReject) {
                            var _this = this;
                            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                                originalThen.call(_this, resolve, reject);
                            });
                            return wrapped.then(onResolve, onReject);
                        };
                        Ctor[symbolThenPatched] = true;
                    }
                    function zoneify(fn) {
                        return function () {
                            var resultPromise = fn.apply(this, arguments);
                            if (resultPromise instanceof ZoneAwarePromise) {
                                return resultPromise;
                            }
                            var ctor = resultPromise.constructor;
                            if (!ctor[symbolThenPatched]) {
                                patchThen(ctor);
                            }
                            return resultPromise;
                        };
                    }
                    if (NativePromise) {
                        patchThen(NativePromise);
                        var fetch_1 = global['fetch'];
                        if (typeof fetch_1 == 'function') {
                            global['fetch'] = zoneify(fetch_1);
                        }
                    }
                    // This is not part of public API, but it is useful for tests, so we expose it.
                    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
                    var blacklistedStackFramesSymbol = Zone.__symbol__('blacklistedStackFrames');
                    var NativeError = global[__symbol__('Error')] = global.Error;
                    // Store the frames which should be removed from the stack frames
                    var blackListedStackFrames = {};
                    // We must find the frame where Error was created, otherwise we assume we don't understand stack
                    var zoneAwareFrame1;
                    var zoneAwareFrame2;
                    global.Error = ZoneAwareError;
                    var stackRewrite = 'stackRewrite';
                    /**
                     * This is ZoneAwareError which processes the stack frame and cleans up extra frames as well as
                     * adds zone information to it.
                     */
                    function ZoneAwareError() {
                        var _this = this;
                        // We always have to return native error otherwise the browser console will not work.
                        var error = NativeError.apply(this, arguments);
                        // Save original stack trace
                        var originalStack = error['originalStack'] = error.stack;
                        // Process the stack trace and rewrite the frames.
                        if (ZoneAwareError[stackRewrite] && originalStack) {
                            var frames_1 = originalStack.split('\n');
                            var zoneFrame = _currentZoneFrame;
                            var i = 0;
                            // Find the first frame
                            while (!(frames_1[i] === zoneAwareFrame1 || frames_1[i] === zoneAwareFrame2) && i < frames_1.length) {
                                i++;
                            }
                            for (; i < frames_1.length && zoneFrame; i++) {
                                var frame = frames_1[i];
                                if (frame.trim()) {
                                    switch (blackListedStackFrames[frame]) {
                                        case 0 /* blackList */:
                                            frames_1.splice(i, 1);
                                            i--;
                                            break;
                                        case 1 /* transition */:
                                            if (zoneFrame.parent) {
                                                // This is the special frame where zone changed. Print and process it accordingly
                                                zoneFrame = zoneFrame.parent;
                                            } else {
                                                zoneFrame = null;
                                            }
                                            frames_1.splice(i, 1);
                                            i--;
                                            break;
                                        default:
                                            frames_1[i] += " [" + zoneFrame.zone.name + "]";
                                    }
                                }
                            }
                            try {
                                error.stack = error.zoneAwareStack = frames_1.join('\n');
                            } catch (e) {
                                // ignore as some browsers don't allow overriding of stack
                            }
                        }
                        if (this instanceof NativeError && this.constructor != NativeError) {
                            // We got called with a `new` operator AND we are subclass of ZoneAwareError
                            // in that case we have to copy all of our properties to `this`.
                            Object.keys(error).concat('stack', 'message').forEach(function (key) {
                                if (error[key] !== undefined) {
                                    try {
                                        _this[key] = error[key];
                                    } catch (e) {
                                        // ignore the assignment in case it is a setter and it throws.
                                    }
                                }
                            });
                            return this;
                        }
                        return error;
                    }
                    // Copy the prototype so that instanceof operator works as expected
                    ZoneAwareError.prototype = NativeError.prototype;
                    ZoneAwareError[blacklistedStackFramesSymbol] = blackListedStackFrames;
                    ZoneAwareError[stackRewrite] = false;
                    // those properties need special handling
                    var specialPropertyNames = ['stackTraceLimit', 'captureStackTrace', 'prepareStackTrace'];
                    // those properties of NativeError should be set to ZoneAwareError
                    var nativeErrorProperties = Object.keys(NativeError);
                    if (nativeErrorProperties) {
                        nativeErrorProperties.forEach(function (prop) {
                            if (specialPropertyNames.filter(function (sp) {
                                return sp === prop;
                            }).length === 0) {
                                Object.defineProperty(ZoneAwareError, prop, {
                                    get: function get() {
                                        return NativeError[prop];
                                    },
                                    set: function set(value) {
                                        NativeError[prop] = value;
                                    }
                                });
                            }
                        });
                    }
                    if (NativeError.hasOwnProperty('stackTraceLimit')) {
                        // Extend default stack limit as we will be removing few frames.
                        NativeError.stackTraceLimit = Math.max(NativeError.stackTraceLimit, 15);
                        // make sure that ZoneAwareError has the same property which forwards to NativeError.
                        Object.defineProperty(ZoneAwareError, 'stackTraceLimit', {
                            get: function get() {
                                return NativeError.stackTraceLimit;
                            },
                            set: function set(value) {
                                return NativeError.stackTraceLimit = value;
                            }
                        });
                    }
                    if (NativeError.hasOwnProperty('captureStackTrace')) {
                        Object.defineProperty(ZoneAwareError, 'captureStackTrace', {
                            // add named function here because we need to remove this
                            // stack frame when prepareStackTrace below
                            value: function zoneCaptureStackTrace(targetObject, constructorOpt) {
                                NativeError.captureStackTrace(targetObject, constructorOpt);
                            }
                        });
                    }
                    Object.defineProperty(ZoneAwareError, 'prepareStackTrace', {
                        get: function get() {
                            return NativeError.prepareStackTrace;
                        },
                        set: function set(value) {
                            if (!value || typeof value !== 'function') {
                                return NativeError.prepareStackTrace = value;
                            }
                            return NativeError.prepareStackTrace = function (error, structuredStackTrace) {
                                // remove additional stack information from ZoneAwareError.captureStackTrace
                                if (structuredStackTrace) {
                                    for (var i = 0; i < structuredStackTrace.length; i++) {
                                        var st = structuredStackTrace[i];
                                        // remove the first function which name is zoneCaptureStackTrace
                                        if (st.getFunctionName() === 'zoneCaptureStackTrace') {
                                            structuredStackTrace.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                                return value.apply(this, [error, structuredStackTrace]);
                            };
                        }
                    });
                    // Now we need to populate the `blacklistedStackFrames` as well as find the
                    // run/runGuarded/runTask frames. This is done by creating a detect zone and then threading
                    // the execution through all of the above methods so that we can look at the stack trace and
                    // find the frames of interest.
                    var detectZone = Zone.current.fork({
                        name: 'detect',
                        onHandleError: function onHandleError(parentZD, current, target, error) {
                            if (error.originalStack && Error === ZoneAwareError) {
                                var frames_2 = error.originalStack.split(/\n/);
                                var runFrame = false,
                                    runGuardedFrame = false,
                                    runTaskFrame = false;
                                while (frames_2.length) {
                                    var frame = frames_2.shift();
                                    // On safari it is possible to have stack frame with no line number.
                                    // This check makes sure that we don't filter frames on name only (must have
                                    // linenumber)
                                    if (/:\d+:\d+/.test(frame)) {
                                        // Get rid of the path so that we don't accidentally find function name in path.
                                        // In chrome the separator is `(` and `@` in FF and safari
                                        // Chrome: at Zone.run (zone.js:100)
                                        // Chrome: at Zone.run (http://localhost:9876/base/build/lib/zone.js:100:24)
                                        // FireFox: Zone.prototype.run@http://localhost:9876/base/build/lib/zone.js:101:24
                                        // Safari: run@http://localhost:9876/base/build/lib/zone.js:101:24
                                        var fnName = frame.split('(')[0].split('@')[0];
                                        var frameType = 1;
                                        if (fnName.indexOf('ZoneAwareError') !== -1) {
                                            zoneAwareFrame1 = frame;
                                            zoneAwareFrame2 = frame.replace('Error.', '');
                                            blackListedStackFrames[zoneAwareFrame2] = 0 /* blackList */;
                                        }
                                        if (fnName.indexOf('runGuarded') !== -1) {
                                            runGuardedFrame = true;
                                        } else if (fnName.indexOf('runTask') !== -1) {
                                            runTaskFrame = true;
                                        } else if (fnName.indexOf('run') !== -1) {
                                            runFrame = true;
                                        } else {
                                            frameType = 0 /* blackList */;
                                        }
                                        blackListedStackFrames[frame] = frameType;
                                        // Once we find all of the frames we can stop looking.
                                        if (runFrame && runGuardedFrame && runTaskFrame) {
                                            ZoneAwareError[stackRewrite] = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            return false;
                        }
                    });
                    // carefully constructor a stack frame which contains all of the frames of interest which
                    // need to be detected and blacklisted.
                    var childDetectZone = detectZone.fork({
                        name: 'child',
                        onScheduleTask: function onScheduleTask(delegate, curr, target, task) {
                            return delegate.scheduleTask(target, task);
                        },
                        onInvokeTask: function onInvokeTask(delegate, curr, target, task, applyThis, applyArgs) {
                            return delegate.invokeTask(target, task, applyThis, applyArgs);
                        },
                        onCancelTask: function onCancelTask(delegate, curr, target, task) {
                            return delegate.cancelTask(target, task);
                        },
                        onInvoke: function onInvoke(delegate, curr, target, callback, applyThis, applyArgs, source) {
                            return delegate.invoke(target, callback, applyThis, applyArgs, source);
                        }
                    });
                    // we need to detect all zone related frames, it will
                    // exceed default stackTraceLimit, so we set it to
                    // larger number here, and restore it after detect finish.
                    var originalStackTraceLimit = Error.stackTraceLimit;
                    Error.stackTraceLimit = 100;
                    // we schedule event/micro/macro task, and invoke them
                    // when onSchedule, so we can get all stack traces for
                    // all kinds of tasks with one error thrown.
                    childDetectZone.run(function () {
                        childDetectZone.runGuarded(function () {
                            var fakeTransitionTo = function fakeTransitionTo(toState, fromState1, fromState2) {};
                            childDetectZone.scheduleEventTask(blacklistedStackFramesSymbol, function () {
                                childDetectZone.scheduleMacroTask(blacklistedStackFramesSymbol, function () {
                                    childDetectZone.scheduleMicroTask(blacklistedStackFramesSymbol, function () {
                                        throw new ZoneAwareError(ZoneAwareError, NativeError);
                                    }, null, function (t) {
                                        t._transitionTo = fakeTransitionTo;
                                        t.invoke();
                                    });
                                }, null, function (t) {
                                    t._transitionTo = fakeTransitionTo;
                                    t.invoke();
                                }, function () {});
                            }, null, function (t) {
                                t._transitionTo = fakeTransitionTo;
                                t.invoke();
                            }, function () {});
                        });
                    });
                    Error.stackTraceLimit = originalStackTraceLimit;
                    return global['Zone'] = Zone;
                }(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
                /**
                 * Suppress closure compiler errors about unknown 'Zone' variable
                 * @fileoverview
                 * @suppress {undefinedVars,globalThis}
                 */
                var zoneSymbol = function zoneSymbol(n) {
                    return "__zone_symbol__" + n;
                };
                var _global$1 = (typeof window === "undefined" ? "undefined" : (0, _typeof3.default)(window)) === 'object' && window || (typeof self === "undefined" ? "undefined" : (0, _typeof3.default)(self)) === 'object' && self || global;
                function bindArguments(args, source) {
                    for (var i = args.length - 1; i >= 0; i--) {
                        if (typeof args[i] === 'function') {
                            args[i] = Zone.current.wrap(args[i], source + '_' + i);
                        }
                    }
                    return args;
                }
                function patchPrototype(prototype, fnNames) {
                    var source = prototype.constructor['name'];
                    var _loop_1 = function _loop_1(i) {
                        var name_1 = fnNames[i];
                        var delegate = prototype[name_1];
                        if (delegate) {
                            prototype[name_1] = function (delegate) {
                                var patched = function patched() {
                                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                                };
                                attachOriginToPatched(patched, delegate);
                                return patched;
                            }(delegate);
                        }
                    };
                    for (var i = 0; i < fnNames.length; i++) {
                        _loop_1(i);
                    }
                }
                var isWebWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
                var isNode = !('nw' in _global$1) && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';
                var isBrowser = !isNode && !isWebWorker && !!(typeof window !== 'undefined' && window['HTMLElement']);
                // we are in electron of nw, so we are both browser and nodejs
                var isMix = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' && !isWebWorker && !!(typeof window !== 'undefined' && window['HTMLElement']);
                function patchProperty(obj, prop) {
                    var desc = Object.getOwnPropertyDescriptor(obj, prop) || { enumerable: true, configurable: true };
                    // if the descriptor is not configurable
                    // just return
                    if (!desc.configurable) {
                        return;
                    }
                    // A property descriptor cannot have getter/setter and be writable
                    // deleting the writable and value properties avoids this error:
                    //
                    // TypeError: property descriptors must not specify a value or be writable when a
                    // getter or setter has been specified
                    delete desc.writable;
                    delete desc.value;
                    var originalDescGet = desc.get;
                    // substr(2) cuz 'onclick' -> 'click', etc
                    var eventName = prop.substr(2);
                    var _prop = zoneSymbol('_' + prop);
                    desc.set = function (newValue) {
                        // in some of windows's onproperty callback, this is undefined
                        // so we need to check it
                        var target = this;
                        if (!target && obj === _global$1) {
                            target = _global$1;
                        }
                        if (!target) {
                            return;
                        }
                        var previousValue = target[_prop];
                        if (previousValue) {
                            target.removeEventListener(eventName, previousValue);
                        }
                        if (typeof newValue === 'function') {
                            var wrapFn = function wrapFn(event) {
                                var result = newValue.apply(this, arguments);
                                if (result != undefined && !result) {
                                    event.preventDefault();
                                }
                                return result;
                            };
                            target[_prop] = wrapFn;
                            target.addEventListener(eventName, wrapFn, false);
                        } else {
                            target[_prop] = null;
                        }
                    };
                    // The getter would return undefined for unassigned properties but the default value of an
                    // unassigned property is null
                    desc.get = function () {
                        // in some of windows's onproperty callback, this is undefined
                        // so we need to check it
                        var target = this;
                        if (!target && obj === _global$1) {
                            target = _global$1;
                        }
                        if (!target) {
                            return null;
                        }
                        if (target.hasOwnProperty(_prop)) {
                            return target[_prop];
                        } else if (originalDescGet) {
                            // result will be null when use inline event attribute,
                            // such as <button onclick="func();">OK</button>
                            // because the onclick function is internal raw uncompiled handler
                            // the onclick will be evaluated when first time event was triggered or
                            // the property is accessed, https://github.com/angular/zone.js/issues/525
                            // so we should use original native get to retrieve the handler
                            var value = originalDescGet.apply(this);
                            if (value) {
                                desc.set.apply(this, [value]);
                                if (typeof target['removeAttribute'] === 'function') {
                                    target.removeAttribute(prop);
                                }
                                return value;
                            }
                        }
                        return null;
                    };
                    Object.defineProperty(obj, prop, desc);
                }
                function patchOnProperties(obj, properties) {
                    if (properties) {
                        for (var i = 0; i < properties.length; i++) {
                            patchProperty(obj, 'on' + properties[i]);
                        }
                    } else {
                        var onProperties = [];
                        for (var prop in obj) {
                            if (prop.substr(0, 2) == 'on') {
                                onProperties.push(prop);
                            }
                        }
                        for (var j = 0; j < onProperties.length; j++) {
                            patchProperty(obj, onProperties[j]);
                        }
                    }
                }
                var EVENT_TASKS = zoneSymbol('eventTasks');
                // For EventTarget
                var ADD_EVENT_LISTENER = 'addEventListener';
                var REMOVE_EVENT_LISTENER = 'removeEventListener';
                // compare the EventListenerOptionsOrCapture
                // 1. if the options is usCapture: boolean, compare the useCpature values directly
                // 2. if the options is EventListerOptions, only compare the capture
                function compareEventListenerOptions(left, right) {
                    var leftCapture = typeof left === 'boolean' ? left : (typeof left === "undefined" ? "undefined" : (0, _typeof3.default)(left)) === 'object' ? left && left.capture : false;
                    var rightCapture = typeof right === 'boolean' ? right : (typeof right === "undefined" ? "undefined" : (0, _typeof3.default)(right)) === 'object' ? right && right.capture : false;
                    return !!leftCapture === !!rightCapture;
                }
                function findExistingRegisteredTask(target, handler, name, options, remove) {
                    var eventTasks = target[EVENT_TASKS];
                    if (eventTasks) {
                        for (var i = 0; i < eventTasks.length; i++) {
                            var eventTask = eventTasks[i];
                            var data = eventTask.data;
                            var listener = data.handler;
                            if ((data.handler === handler || listener.listener === handler) && compareEventListenerOptions(data.options, options) && data.eventName === name) {
                                if (remove) {
                                    eventTasks.splice(i, 1);
                                }
                                return eventTask;
                            }
                        }
                    }
                    return null;
                }
                function attachRegisteredEvent(target, eventTask, isPrepend) {
                    var eventTasks = target[EVENT_TASKS];
                    if (!eventTasks) {
                        eventTasks = target[EVENT_TASKS] = [];
                    }
                    if (isPrepend) {
                        eventTasks.unshift(eventTask);
                    } else {
                        eventTasks.push(eventTask);
                    }
                }
                var defaultListenerMetaCreator = function defaultListenerMetaCreator(self, args) {
                    return {
                        options: args[2],
                        eventName: args[0],
                        handler: args[1],
                        target: self || _global$1,
                        name: args[0],
                        crossContext: false,
                        invokeAddFunc: function invokeAddFunc(addFnSymbol, delegate) {
                            // check if the data is cross site context, if it is, fallback to
                            // remove the delegate directly and try catch error
                            if (!this.crossContext) {
                                if (delegate && delegate.invoke) {
                                    return this.target[addFnSymbol](this.eventName, delegate.invoke, this.options);
                                } else {
                                    return this.target[addFnSymbol](this.eventName, delegate, this.options);
                                }
                            } else {
                                // add a if/else branch here for performance concern, for most times
                                // cross site context is false, so we don't need to try/catch
                                try {
                                    return this.target[addFnSymbol](this.eventName, delegate, this.options);
                                } catch (err) {
                                    // do nothing here is fine, because objects in a cross-site context are unusable
                                }
                            }
                        },
                        invokeRemoveFunc: function invokeRemoveFunc(removeFnSymbol, delegate) {
                            // check if the data is cross site context, if it is, fallback to
                            // remove the delegate directly and try catch error
                            if (!this.crossContext) {
                                if (delegate && delegate.invoke) {
                                    return this.target[removeFnSymbol](this.eventName, delegate.invoke, this.options);
                                } else {
                                    return this.target[removeFnSymbol](this.eventName, delegate, this.options);
                                }
                            } else {
                                // add a if/else branch here for performance concern, for most times
                                // cross site context is false, so we don't need to try/catch
                                try {
                                    return this.target[removeFnSymbol](this.eventName, delegate, this.options);
                                } catch (err) {
                                    // do nothing here is fine, because objects in a cross-site context are unusable
                                }
                            }
                        }
                    };
                };
                function makeZoneAwareAddListener(addFnName, removeFnName, useCapturingParam, allowDuplicates, isPrepend, metaCreator) {
                    if (useCapturingParam === void 0) {
                        useCapturingParam = true;
                    }
                    if (allowDuplicates === void 0) {
                        allowDuplicates = false;
                    }
                    if (isPrepend === void 0) {
                        isPrepend = false;
                    }
                    if (metaCreator === void 0) {
                        metaCreator = defaultListenerMetaCreator;
                    }
                    var addFnSymbol = zoneSymbol(addFnName);
                    var removeFnSymbol = zoneSymbol(removeFnName);
                    var defaultUseCapturing = useCapturingParam ? false : undefined;
                    function scheduleEventListener(eventTask) {
                        var meta = eventTask.data;
                        attachRegisteredEvent(meta.target, eventTask, isPrepend);
                        return meta.invokeAddFunc(addFnSymbol, eventTask);
                    }
                    function cancelEventListener(eventTask) {
                        var meta = eventTask.data;
                        findExistingRegisteredTask(meta.target, eventTask.invoke, meta.eventName, meta.options, true);
                        return meta.invokeRemoveFunc(removeFnSymbol, eventTask);
                    }
                    return function zoneAwareAddListener(self, args) {
                        var data = metaCreator(self, args);
                        data.options = data.options || defaultUseCapturing;
                        // - Inside a Web Worker, `this` is undefined, the context is `global`
                        // - When `addEventListener` is called on the global context in strict mode, `this` is undefined
                        // see https://github.com/angular/zone.js/issues/190
                        var delegate = null;
                        if (typeof data.handler == 'function') {
                            delegate = data.handler;
                        } else if (data.handler && data.handler.handleEvent) {
                            delegate = function delegate(event) {
                                return data.handler.handleEvent(event);
                            };
                        }
                        var validZoneHandler = false;
                        try {
                            // In cross site contexts (such as WebDriver frameworks like Selenium),
                            // accessing the handler object here will cause an exception to be thrown which
                            // will fail tests prematurely.
                            validZoneHandler = data.handler && data.handler.toString() === '[object FunctionWrapper]';
                        } catch (error) {
                            // we can still try to add the data.handler even we are in cross site context
                            data.crossContext = true;
                            return data.invokeAddFunc(addFnSymbol, data.handler);
                        }
                        // Ignore special listeners of IE11 & Edge dev tools, see
                        // https://github.com/angular/zone.js/issues/150
                        if (!delegate || validZoneHandler) {
                            return data.invokeAddFunc(addFnSymbol, data.handler);
                        }
                        if (!allowDuplicates) {
                            var eventTask = findExistingRegisteredTask(data.target, data.handler, data.eventName, data.options, false);
                            if (eventTask) {
                                // we already registered, so this will have noop.
                                return data.invokeAddFunc(addFnSymbol, eventTask);
                            }
                        }
                        var zone = Zone.current;
                        var source = data.target.constructor['name'] + '.' + addFnName + ':' + data.eventName;
                        zone.scheduleEventTask(source, delegate, data, scheduleEventListener, cancelEventListener);
                    };
                }
                function makeZoneAwareRemoveListener(fnName, useCapturingParam, metaCreator) {
                    if (useCapturingParam === void 0) {
                        useCapturingParam = true;
                    }
                    if (metaCreator === void 0) {
                        metaCreator = defaultListenerMetaCreator;
                    }
                    var symbol = zoneSymbol(fnName);
                    var defaultUseCapturing = useCapturingParam ? false : undefined;
                    return function zoneAwareRemoveListener(self, args) {
                        var data = metaCreator(self, args);
                        data.options = data.options || defaultUseCapturing;
                        // - Inside a Web Worker, `this` is undefined, the context is `global`
                        // - When `addEventListener` is called on the global context in strict mode, `this` is undefined
                        // see https://github.com/angular/zone.js/issues/190
                        var delegate = null;
                        if (typeof data.handler == 'function') {
                            delegate = data.handler;
                        } else if (data.handler && data.handler.handleEvent) {
                            delegate = function delegate(event) {
                                return data.handler.handleEvent(event);
                            };
                        }
                        var validZoneHandler = false;
                        try {
                            // In cross site contexts (such as WebDriver frameworks like Selenium),
                            // accessing the handler object here will cause an exception to be thrown which
                            // will fail tests prematurely.
                            validZoneHandler = data.handler && data.handler.toString() === '[object FunctionWrapper]';
                        } catch (error) {
                            data.crossContext = true;
                            return data.invokeRemoveFunc(symbol, data.handler);
                        }
                        // Ignore special listeners of IE11 & Edge dev tools, see
                        // https://github.com/angular/zone.js/issues/150
                        if (!delegate || validZoneHandler) {
                            return data.invokeRemoveFunc(symbol, data.handler);
                        }
                        var eventTask = findExistingRegisteredTask(data.target, data.handler, data.eventName, data.options, true);
                        if (eventTask) {
                            eventTask.zone.cancelTask(eventTask);
                        } else {
                            data.invokeRemoveFunc(symbol, data.handler);
                        }
                    };
                }

                function patchEventTargetMethods(obj, addFnName, removeFnName, metaCreator) {
                    if (addFnName === void 0) {
                        addFnName = ADD_EVENT_LISTENER;
                    }
                    if (removeFnName === void 0) {
                        removeFnName = REMOVE_EVENT_LISTENER;
                    }
                    if (metaCreator === void 0) {
                        metaCreator = defaultListenerMetaCreator;
                    }
                    if (obj && obj[addFnName]) {
                        patchMethod(obj, addFnName, function () {
                            return makeZoneAwareAddListener(addFnName, removeFnName, true, false, false, metaCreator);
                        });
                        patchMethod(obj, removeFnName, function () {
                            return makeZoneAwareRemoveListener(removeFnName, true, metaCreator);
                        });
                        return true;
                    } else {
                        return false;
                    }
                }
                var originalInstanceKey = zoneSymbol('originalInstance');
                // wrap some native API on `window`
                function patchClass(className) {
                    var OriginalClass = _global$1[className];
                    if (!OriginalClass) return;
                    // keep original class in global
                    _global$1[zoneSymbol(className)] = OriginalClass;
                    _global$1[className] = function () {
                        var a = bindArguments(arguments, className);
                        switch (a.length) {
                            case 0:
                                this[originalInstanceKey] = new OriginalClass();
                                break;
                            case 1:
                                this[originalInstanceKey] = new OriginalClass(a[0]);
                                break;
                            case 2:
                                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                                break;
                            case 3:
                                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                                break;
                            case 4:
                                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                                break;
                            default:
                                throw new Error('Arg list too long.');
                        }
                    };
                    // attach original delegate to patched function
                    attachOriginToPatched(_global$1[className], OriginalClass);
                    var instance = new OriginalClass(function () {});
                    var prop;
                    for (prop in instance) {
                        // https://bugs.webkit.org/show_bug.cgi?id=44721
                        if (className === 'XMLHttpRequest' && prop === 'responseBlob') continue;
                        (function (prop) {
                            if (typeof instance[prop] === 'function') {
                                _global$1[className].prototype[prop] = function () {
                                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                                };
                            } else {
                                Object.defineProperty(_global$1[className].prototype, prop, {
                                    set: function set(fn) {
                                        if (typeof fn === 'function') {
                                            this[originalInstanceKey][prop] = Zone.current.wrap(fn, className + '.' + prop);
                                            // keep callback in wrapped function so we can
                                            // use it in Function.prototype.toString to return
                                            // the native one.
                                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                                        } else {
                                            this[originalInstanceKey][prop] = fn;
                                        }
                                    },
                                    get: function get() {
                                        return this[originalInstanceKey][prop];
                                    }
                                });
                            }
                        })(prop);
                    }
                    for (prop in OriginalClass) {
                        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
                            _global$1[className][prop] = OriginalClass[prop];
                        }
                    }
                }
                function createNamedFn(name, delegate) {
                    try {
                        return Function('f', "return function " + name + "(){return f(this, arguments)}")(delegate);
                    } catch (error) {
                        // if we fail, we must be CSP, just return delegate.
                        return function () {
                            return delegate(this, arguments);
                        };
                    }
                }
                function patchMethod(target, name, patchFn) {
                    var proto = target;
                    while (proto && Object.getOwnPropertyNames(proto).indexOf(name) === -1) {
                        proto = Object.getPrototypeOf(proto);
                    }
                    if (!proto && target[name]) {
                        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
                        proto = target;
                    }
                    var delegateName = zoneSymbol(name);
                    var delegate;
                    if (proto && !(delegate = proto[delegateName])) {
                        delegate = proto[delegateName] = proto[name];
                        proto[name] = createNamedFn(name, patchFn(delegate, delegateName, name));
                        attachOriginToPatched(proto[name], delegate);
                    }
                    return delegate;
                }
                // TODO: @JiaLiPassion, support cancel task later if necessary


                function findEventTask(target, evtName) {
                    var eventTasks = target[zoneSymbol('eventTasks')];
                    var result = [];
                    if (eventTasks) {
                        for (var i = 0; i < eventTasks.length; i++) {
                            var eventTask = eventTasks[i];
                            var data = eventTask.data;
                            var eventName = data && data.eventName;
                            if (eventName === evtName) {
                                result.push(eventTask);
                            }
                        }
                    }
                    return result;
                }
                function attachOriginToPatched(patched, original) {
                    patched[zoneSymbol('OriginalDelegate')] = original;
                }
                Zone[zoneSymbol('patchEventTargetMethods')] = patchEventTargetMethods;
                Zone[zoneSymbol('patchOnProperties')] = patchOnProperties;

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
                function patchTimer(window, setName, cancelName, nameSuffix) {
                    var setNative = null;
                    var clearNative = null;
                    setName += nameSuffix;
                    cancelName += nameSuffix;
                    var tasksByHandleId = {};
                    function scheduleTask(task) {
                        var data = task.data;
                        function timer() {
                            try {
                                task.invoke.apply(this, arguments);
                            } finally {
                                delete tasksByHandleId[data.handleId];
                            }
                        }
                        data.args[0] = timer;
                        data.handleId = setNative.apply(window, data.args);
                        tasksByHandleId[data.handleId] = task;
                        return task;
                    }
                    function clearTask(task) {
                        delete tasksByHandleId[task.data.handleId];
                        return clearNative(task.data.handleId);
                    }
                    setNative = patchMethod(window, setName, function (delegate) {
                        return function (self, args) {
                            if (typeof args[0] === 'function') {
                                var zone = Zone.current;
                                var options = {
                                    handleId: null,
                                    isPeriodic: nameSuffix === 'Interval',
                                    delay: nameSuffix === 'Timeout' || nameSuffix === 'Interval' ? args[1] || 0 : null,
                                    args: args
                                };
                                var task = zone.scheduleMacroTask(setName, args[0], options, scheduleTask, clearTask);
                                if (!task) {
                                    return task;
                                }
                                // Node.js must additionally support the ref and unref functions.
                                var handle = task.data.handleId;
                                // check whether handle is null, because some polyfill or browser
                                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                                if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' && typeof handle.unref === 'function') {
                                    task.ref = handle.ref.bind(handle);
                                    task.unref = handle.unref.bind(handle);
                                }
                                return task;
                            } else {
                                // cause an error by calling it directly.
                                return delegate.apply(window, args);
                            }
                        };
                    });
                    clearNative = patchMethod(window, cancelName, function (delegate) {
                        return function (self, args) {
                            var task = typeof args[0] === 'number' ? tasksByHandleId[args[0]] : args[0];
                            if (task && typeof task.type === 'string') {
                                if (task.state !== 'notScheduled' && (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                                    // Do not cancel already canceled functions
                                    task.zone.cancelTask(task);
                                }
                            } else {
                                // cause an error by calling it directly.
                                delegate.apply(window, args);
                            }
                        };
                    });
                }

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
                // override Function.prototype.toString to make zone.js patched function
                // look like native function
                function patchFuncToString() {
                    var originalFunctionToString = Function.prototype.toString;
                    var g = typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global;
                    Function.prototype.toString = function () {
                        if (typeof this === 'function') {
                            if (this[zoneSymbol('OriginalDelegate')]) {
                                return originalFunctionToString.apply(this[zoneSymbol('OriginalDelegate')], arguments);
                            }
                            if (this === Promise) {
                                var nativePromise = g[zoneSymbol('Promise')];
                                if (nativePromise) {
                                    return originalFunctionToString.apply(nativePromise, arguments);
                                }
                            }
                            if (this === Error) {
                                var nativeError = g[zoneSymbol('Error')];
                                if (nativeError) {
                                    return originalFunctionToString.apply(nativeError, arguments);
                                }
                            }
                        }
                        return originalFunctionToString.apply(this, arguments);
                    };
                }
                function patchObjectToString() {
                    var originalObjectToString = Object.prototype.toString;
                    Object.prototype.toString = function () {
                        if (this instanceof Promise) {
                            return '[object Promise]';
                        }
                        return originalObjectToString.apply(this, arguments);
                    };
                }

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
                /*
                 * This is necessary for Chrome and Chrome mobile, to enable
                 * things like redefining `createdCallback` on an element.
                 */
                var _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
                var _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] = Object.getOwnPropertyDescriptor;
                var _create = Object.create;
                var unconfigurablesKey = zoneSymbol('unconfigurables');
                function propertyPatch() {
                    Object.defineProperty = function (obj, prop, desc) {
                        if (isUnconfigurable(obj, prop)) {
                            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
                        }
                        var originalConfigurableFlag = desc.configurable;
                        if (prop !== 'prototype') {
                            desc = rewriteDescriptor(obj, prop, desc);
                        }
                        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
                    };
                    Object.defineProperties = function (obj, props) {
                        Object.keys(props).forEach(function (prop) {
                            Object.defineProperty(obj, prop, props[prop]);
                        });
                        return obj;
                    };
                    Object.create = function (obj, proto) {
                        if ((typeof proto === "undefined" ? "undefined" : (0, _typeof3.default)(proto)) === 'object' && !Object.isFrozen(proto)) {
                            Object.keys(proto).forEach(function (prop) {
                                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
                            });
                        }
                        return _create(obj, proto);
                    };
                    Object.getOwnPropertyDescriptor = function (obj, prop) {
                        var desc = _getOwnPropertyDescriptor(obj, prop);
                        if (isUnconfigurable(obj, prop)) {
                            desc.configurable = false;
                        }
                        return desc;
                    };
                }
                function _redefineProperty(obj, prop, desc) {
                    var originalConfigurableFlag = desc.configurable;
                    desc = rewriteDescriptor(obj, prop, desc);
                    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
                }
                function isUnconfigurable(obj, prop) {
                    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
                }
                function rewriteDescriptor(obj, prop, desc) {
                    desc.configurable = true;
                    if (!desc.configurable) {
                        if (!obj[unconfigurablesKey]) {
                            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
                        }
                        obj[unconfigurablesKey][prop] = true;
                    }
                    return desc;
                }
                function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
                    try {
                        return _defineProperty(obj, prop, desc);
                    } catch (error) {
                        if (desc.configurable) {
                            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
                            // retry with the original flag value
                            if (typeof originalConfigurableFlag == 'undefined') {
                                delete desc.configurable;
                            } else {
                                desc.configurable = originalConfigurableFlag;
                            }
                            try {
                                return _defineProperty(obj, prop, desc);
                            } catch (error) {
                                var descJson = null;
                                try {
                                    descJson = JSON.stringify(desc);
                                } catch (error) {
                                    descJson = descJson.toString();
                                }
                                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
                            }
                        } else {
                            throw error;
                        }
                    }
                }

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
                var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
                var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'.split(',');
                var EVENT_TARGET = 'EventTarget';
                function eventTargetPatch(_global) {
                    var apis = [];
                    var isWtf = _global['wtf'];
                    if (isWtf) {
                        // Workaround for: https://github.com/google/tracing-framework/issues/555
                        apis = WTF_ISSUE_555.split(',').map(function (v) {
                            return 'HTML' + v + 'Element';
                        }).concat(NO_EVENT_TARGET);
                    } else if (_global[EVENT_TARGET]) {
                        apis.push(EVENT_TARGET);
                    } else {
                        // Note: EventTarget is not available in all browsers,
                        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
                        apis = NO_EVENT_TARGET;
                    }
                    for (var i = 0; i < apis.length; i++) {
                        var type = _global[apis[i]];
                        patchEventTargetMethods(type && type.prototype);
                    }
                }

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
                // we have to patch the instance since the proto is non-configurable
                function apply(_global) {
                    var WS = _global.WebSocket;
                    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
                    // On older Chrome, no need since EventTarget was already patched
                    if (!_global.EventTarget) {
                        patchEventTargetMethods(WS.prototype);
                    }
                    _global.WebSocket = function (a, b) {
                        var socket = arguments.length > 1 ? new WS(a, b) : new WS(a);
                        var proxySocket;
                        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
                        var onmessageDesc = Object.getOwnPropertyDescriptor(socket, 'onmessage');
                        if (onmessageDesc && onmessageDesc.configurable === false) {
                            proxySocket = Object.create(socket);
                            ['addEventListener', 'removeEventListener', 'send', 'close'].forEach(function (propName) {
                                proxySocket[propName] = function () {
                                    return socket[propName].apply(socket, arguments);
                                };
                            });
                        } else {
                            // we can patch the real socket
                            proxySocket = socket;
                        }
                        patchOnProperties(proxySocket, ['close', 'error', 'message', 'open']);
                        return proxySocket;
                    };
                    for (var prop in WS) {
                        _global.WebSocket[prop] = WS[prop];
                    }
                }

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
                var eventNames = 'copy cut paste abort blur focus canplay canplaythrough change click contextmenu dblclick drag dragend dragenter dragleave dragover dragstart drop durationchange emptied ended input invalid keydown keypress keyup load loadeddata loadedmetadata loadstart message mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup pause play playing progress ratechange reset scroll seeked seeking select show stalled submit suspend timeupdate volumechange waiting mozfullscreenchange mozfullscreenerror mozpointerlockchange mozpointerlockerror error webglcontextrestored webglcontextlost webglcontextcreationerror'.split(' ');
                function propertyDescriptorPatch(_global) {
                    if (isNode && !isMix) {
                        return;
                    }
                    var supportsWebSocket = typeof WebSocket !== 'undefined';
                    if (canPatchViaPropertyDescriptor()) {
                        // for browsers that we can patch the descriptor:  Chrome & Firefox
                        if (isBrowser) {
                            patchOnProperties(window, eventNames.concat(['resize']));
                            patchOnProperties(Document.prototype, eventNames);
                            if (typeof window['SVGElement'] !== 'undefined') {
                                patchOnProperties(window['SVGElement'].prototype, eventNames);
                            }
                            patchOnProperties(HTMLElement.prototype, eventNames);
                        }
                        patchOnProperties(XMLHttpRequest.prototype, null);
                        if (typeof IDBIndex !== 'undefined') {
                            patchOnProperties(IDBIndex.prototype, null);
                            patchOnProperties(IDBRequest.prototype, null);
                            patchOnProperties(IDBOpenDBRequest.prototype, null);
                            patchOnProperties(IDBDatabase.prototype, null);
                            patchOnProperties(IDBTransaction.prototype, null);
                            patchOnProperties(IDBCursor.prototype, null);
                        }
                        if (supportsWebSocket) {
                            patchOnProperties(WebSocket.prototype, null);
                        }
                    } else {
                        // Safari, Android browsers (Jelly Bean)
                        patchViaCapturingAllTheEvents();
                        patchClass('XMLHttpRequest');
                        if (supportsWebSocket) {
                            apply(_global);
                        }
                    }
                }
                function canPatchViaPropertyDescriptor() {
                    if ((isBrowser || isMix) && !Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') && typeof Element !== 'undefined') {
                        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
                        // IDL interface attributes are not configurable
                        var desc = Object.getOwnPropertyDescriptor(Element.prototype, 'onclick');
                        if (desc && !desc.configurable) return false;
                    }
                    var xhrDesc = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'onreadystatechange');
                    // add enumerable and configurable here because in opera
                    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
                    // without adding enumerable and configurable will cause onreadystatechange
                    // non-configurable
                    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
                    // we should set a real desc instead a fake one
                    if (xhrDesc) {
                        Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
                            enumerable: true,
                            configurable: true,
                            get: function get() {
                                return true;
                            }
                        });
                        var req = new XMLHttpRequest();
                        var result = !!req.onreadystatechange;
                        // restore original desc
                        Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', xhrDesc || {});
                        return result;
                    } else {
                        Object.defineProperty(XMLHttpRequest.prototype, 'onreadystatechange', {
                            enumerable: true,
                            configurable: true,
                            get: function get() {
                                return this[zoneSymbol('fakeonreadystatechange')];
                            },
                            set: function set(value) {
                                this[zoneSymbol('fakeonreadystatechange')] = value;
                            }
                        });
                        var req = new XMLHttpRequest();
                        var detectFunc = function detectFunc() {};
                        req.onreadystatechange = detectFunc;
                        var result = req[zoneSymbol('fakeonreadystatechange')] === detectFunc;
                        req.onreadystatechange = null;
                        return result;
                    }
                }

                var unboundKey = zoneSymbol('unbound');
                // Whenever any eventListener fires, we check the eventListener target and all parents
                // for `onwhatever` properties and replace them with zone-bound functions
                // - Chrome (for now)
                function patchViaCapturingAllTheEvents() {
                    var _loop_1 = function _loop_1(i) {
                        var property = eventNames[i];
                        var onproperty = 'on' + property;
                        self.addEventListener(property, function (event) {
                            var elt = event.target,
                                bound,
                                source;
                            if (elt) {
                                source = elt.constructor['name'] + '.' + onproperty;
                            } else {
                                source = 'unknown.' + onproperty;
                            }
                            while (elt) {
                                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                                    bound = Zone.current.wrap(elt[onproperty], source);
                                    bound[unboundKey] = elt[onproperty];
                                    elt[onproperty] = bound;
                                }
                                elt = elt.parentElement;
                            }
                        }, true);
                    };
                    for (var i = 0; i < eventNames.length; i++) {
                        _loop_1(i);
                    }
                }

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
                function registerElementPatch(_global) {
                    if (!isBrowser && !isMix || !('registerElement' in _global.document)) {
                        return;
                    }
                    var _registerElement = document.registerElement;
                    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
                    document.registerElement = function (name, opts) {
                        if (opts && opts.prototype) {
                            callbacks.forEach(function (callback) {
                                var source = 'Document.registerElement::' + callback;
                                if (opts.prototype.hasOwnProperty(callback)) {
                                    var descriptor = Object.getOwnPropertyDescriptor(opts.prototype, callback);
                                    if (descriptor && descriptor.value) {
                                        descriptor.value = Zone.current.wrap(descriptor.value, source);
                                        _redefineProperty(opts.prototype, callback, descriptor);
                                    } else {
                                        opts.prototype[callback] = Zone.current.wrap(opts.prototype[callback], source);
                                    }
                                } else if (opts.prototype[callback]) {
                                    opts.prototype[callback] = Zone.current.wrap(opts.prototype[callback], source);
                                }
                            });
                        }
                        return _registerElement.apply(document, [name, opts]);
                    };
                    attachOriginToPatched(document.registerElement, _registerElement);
                }

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
                var set = 'set';
                var clear = 'clear';
                var blockingMethods = ['alert', 'prompt', 'confirm'];
                var _global = typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global;
                patchTimer(_global, set, clear, 'Timeout');
                patchTimer(_global, set, clear, 'Interval');
                patchTimer(_global, set, clear, 'Immediate');
                patchTimer(_global, 'request', 'cancel', 'AnimationFrame');
                patchTimer(_global, 'mozRequest', 'mozCancel', 'AnimationFrame');
                patchTimer(_global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
                for (var i = 0; i < blockingMethods.length; i++) {
                    var name_1 = blockingMethods[i];
                    patchMethod(_global, name_1, function (delegate, symbol, name) {
                        return function (s, args) {
                            return Zone.current.run(delegate, _global, args, name);
                        };
                    });
                }
                eventTargetPatch(_global);
                // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
                var XMLHttpRequestEventTarget = _global['XMLHttpRequestEventTarget'];
                if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
                    patchEventTargetMethods(XMLHttpRequestEventTarget.prototype);
                }
                propertyDescriptorPatch(_global);
                patchClass('MutationObserver');
                patchClass('WebKitMutationObserver');
                patchClass('FileReader');
                propertyPatch();
                registerElementPatch(_global);
                // Treat XMLHTTPRequest as a macrotask.
                patchXHR(_global);
                var XHR_TASK = zoneSymbol('xhrTask');
                var XHR_SYNC = zoneSymbol('xhrSync');
                var XHR_LISTENER = zoneSymbol('xhrListener');
                var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
                function patchXHR(window) {
                    function findPendingTask(target) {
                        var pendingTask = target[XHR_TASK];
                        return pendingTask;
                    }
                    function scheduleTask(task) {
                        XMLHttpRequest[XHR_SCHEDULED] = false;
                        var data = task.data;
                        // remove existing event listener
                        var listener = data.target[XHR_LISTENER];
                        if (listener) {
                            data.target.removeEventListener('readystatechange', listener);
                        }
                        var newListener = data.target[XHR_LISTENER] = function () {
                            if (data.target.readyState === data.target.DONE) {
                                // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                                // readyState=4 multiple times, so we need to check task state here
                                if (!data.aborted && XMLHttpRequest[XHR_SCHEDULED] && task.state === 'scheduled') {
                                    task.invoke();
                                }
                            }
                        };
                        data.target.addEventListener('readystatechange', newListener);
                        var storedTask = data.target[XHR_TASK];
                        if (!storedTask) {
                            data.target[XHR_TASK] = task;
                        }
                        sendNative.apply(data.target, data.args);
                        XMLHttpRequest[XHR_SCHEDULED] = true;
                        return task;
                    }
                    function placeholderCallback() {}
                    function clearTask(task) {
                        var data = task.data;
                        // Note - ideally, we would call data.target.removeEventListener here, but it's too late
                        // to prevent it from firing. So instead, we store info for the event listener.
                        data.aborted = true;
                        return abortNative.apply(data.target, data.args);
                    }
                    var openNative = patchMethod(window.XMLHttpRequest.prototype, 'open', function () {
                        return function (self, args) {
                            self[XHR_SYNC] = args[2] == false;
                            return openNative.apply(self, args);
                        };
                    });
                    var sendNative = patchMethod(window.XMLHttpRequest.prototype, 'send', function () {
                        return function (self, args) {
                            var zone = Zone.current;
                            if (self[XHR_SYNC]) {
                                // if the XHR is sync there is no task to schedule, just execute the code.
                                return sendNative.apply(self, args);
                            } else {
                                var options = { target: self, isPeriodic: false, delay: null, args: args, aborted: false };
                                return zone.scheduleMacroTask('XMLHttpRequest.send', placeholderCallback, options, scheduleTask, clearTask);
                            }
                        };
                    });
                    var abortNative = patchMethod(window.XMLHttpRequest.prototype, 'abort', function (delegate) {
                        return function (self, args) {
                            var task = findPendingTask(self);
                            if (task && typeof task.type == 'string') {
                                // If the XHR has already completed, do nothing.
                                // If the XHR has already been aborted, do nothing.
                                // Fix #569, call abort multiple times before done will cause
                                // macroTask task count be negative number
                                if (task.cancelFn == null || task.data && task.data.aborted) {
                                    return;
                                }
                                task.zone.cancelTask(task);
                            }
                            // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no task
                            // to cancel. Do nothing.
                        };
                    });
                }
                /// GEO_LOCATION
                if (_global['navigator'] && _global['navigator'].geolocation) {
                    patchPrototype(_global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
                }
                // patch Func.prototype.toString to let them look like native
                patchFuncToString();
                // patch Object.prototype.toString to let them look like native
                patchObjectToString();
                // handle unhandled promise rejection
                function findPromiseRejectionHandler(evtName) {
                    return function (e) {
                        var eventTasks = findEventTask(_global, evtName);
                        eventTasks.forEach(function (eventTask) {
                            // windows has added unhandledrejection event listener
                            // trigger the event listener
                            var PromiseRejectionEvent = _global['PromiseRejectionEvent'];
                            if (PromiseRejectionEvent) {
                                var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                                eventTask.invoke(evt);
                            }
                        });
                    };
                }
                if (_global['PromiseRejectionEvent']) {
                    Zone[zoneSymbol('unhandledPromiseRejectionHandler')] = findPromiseRejectionHandler('unhandledrejection');
                    Zone[zoneSymbol('rejectionHandledHandler')] = findPromiseRejectionHandler('rejectionhandled');
                }

                /**
                 * @license
                 * Copyright Google Inc. All Rights Reserved.
                 *
                 * Use of this source code is governed by an MIT-style license that can be
                 * found in the LICENSE file at https://angular.io/license
                 */
            });
        }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, { "_process": 77 }] }, {}, [2]);