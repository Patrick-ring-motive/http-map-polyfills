
(() => {
  const objDoProp = function (obj, prop, def, enm, mut) {
    return Object.defineProperty(obj, prop, {
      value: def,
      writable: mut,
      enumerable: enm,
      configurable: mut,
    });
  };
  const objDefProp = (obj, prop, def) => objDoProp(obj, prop, def, false, true);
  const isNullish = (x) => x === null || x === undefined;
  const objFillProp = (obj, prop, value) =>{
    if (isNullish(obj[prop])) {
      return objDefProp(obj, prop, value);
    }
    return obj[prop];
  };
  const instanceOf = function instanceOf(x, y) {
    try {
      return x instanceof y;
    } catch {
      return false;
    }
  };
  const eq = (x, y) => {
    return x === y || (x !== x && y !== y);
  };
  const TypedArray = Uint8Array?.__proto__;
  const isFunction = (x) => typeof x === "function" || x instanceof Function;
  const isString = (x) => typeof x === "string" || x instanceof String;
  const isArray = (x) =>
    Array.isArray(x) || x instanceof Array || instanceOf(x, TypedArray);
  const apply = ($this, fn, args) => $this[fn].apply($this, args);
  const enact = (fn, args) => fn.apply(undefined, args);
  const arr = (x) => Array.from(x);
  const anew = (fn,args) => Reflect.construct(fn,args);
  const pureProxy = (item) => {
    const funcMap = new Map();
    return new Proxy(item, {
      get(target, prop) {
        const val = target[prop];
        if (typeof val === "function") {
          if (
            !funcMap.has(prop) ||
            funcMap.get(prop)[`&${String(prop)}`] !== val
          ) {
            const boundFunc = val.bind(target);
            boundFunc[`&${String(prop)}`] = val;
            funcMap.set(prop, boundFunc);
          }
          return funcMap.get(prop);
        }
        return val;
      },
      set(target, prop, val) {
        if (typeof val === "function") {
          const boundFunc = val.bind(target);
          boundFunc[`&${String(prop)}`] = val;
          funcMap.set(prop, boundFunc);
        } else {
          funcMap.delete(prop);
        }
        target[prop] = val;
        return true;
      },
      defineProperty(target, prop, desc) {
        const val = desc?.value;
        if (typeof val === "function") {
          const boundFunc = val.bind(target);
          boundFunc[`&${String(prop)}`] = val;
          funcMap.set(prop, boundFunc);
        } else {
          funcMap.delete(prop);
        }
        return Reflect.defineProperty(target, prop, desc);
      },
      deleteProperty(target, prop) {
        funcMap.delete(prop);
        return Reflect.deleteProperty(target, prop);
      },
    });
  };

  //undefined
  const Undefined = function () {
    if (!new.target) return undefined;
  };
  Undefined.__proto__ = null;
  Undefined.prototype.__proto__ = null;
  Undefined.prototype.toString = () => undefined;
  Undefined.prototype.toLocaleString = () => undefined;
  Undefined.prototype[Symbol.toStringTag] = () => undefined;
  Undefined.prototype.valueOf = () => undefined;
  Undefined.prototype[Symbol.toPrimitive] = () => undefined;

  Object.defineProperty(Undefined, "length", {
    value: undefined,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Undefined, "name", {
    value: undefined,
    writable: true,
    enumerable: false,
    configureable: true,
  });

  const Null = function () {
    if (!new.target) return null;
  };
  Null.__proto__ = null;
  Null.prototype.__proto__ = null;
  Null.prototype.toString = () => null;
  Null.prototype.toLocaleString = () => null;
  Null.prototype[Symbol.toStringTag] = () => null;
  Null.prototype.valueOf = () => null;
  Null.prototype[Symbol.toPrimitive] = () => null;

  Object.defineProperty(Null, "length", {
    value: undefined,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Null.prototype, "__proto__", {
    value: null,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Null, "__proto__", {
    value: null,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Null, "name", {
    value: null,
    writable: true,
    enumerable: false,
    configureable: true,
  });

  function Obj(value) {
    if (value === null) return new Null();
    if (value === undefined) return new Undefined();
    const x = Object(value.valueOf());
    if (x !== value) return x;
    return pureProxy(value);
  }

  //map
  (() => {
    objFillProp(Map.prototype,'append',function append(key, value) {
      if (!this.has(key)) return this.set(key, value);
      return this.set(Obj(key), value);
    });
    objFillProp(Map.prototype,'getAll', function getAll(key) {
      return [...this.entries()]
        .filter(([k, v]) => k?.valueOf() == key?.valueOf())
        .map(([k, v]) => v);
    });
    objFillProp(Map,'from',function from(obj) {
      try {
        return new Map(obj);
      } catch {
        return new Map(Object.entries(obj));
      }
    });
  })();

  //headers
  (() => {
    if (!globalThis.Headers) return;
    objFillProp(Headers.prototype,'clear',function clear() {
      for (const [key, _] of this) {
        this.delete(key);
      }
    });
    (() => {
      const $set = Headers.prototype.set;
      objDefProp(Headers.prototype,'set', function set(key, value) {
        $set.call(this, key, value);
        return this;
      });
    })();
    (() => {
      const $delete = Headers.prototype.delete;
      objDefProp(Headers.prototype,'delete',function _delete(key) {
        const has = this.has(key);
        $delete.call(this, key);
        return has;
      });
    })();

    (() => {
      // `Map.prototype.emplace` method
      // https://github.com/tc39/proposal-upsert
      objFillProp(Headers.prototype,'emplace', function emplace(key, handler) {
        if (this.has(key)) {
          const current = this.get(key);
          if (handler.update) {
            const value = handler.update(current, key, this);
            this.set(key, value);
            return value;
          }
          return current;
        }
        if (handler.insert) {
          const inserted = handler.insert(key, this);
          this.set(key, inserted);
          return inserted;
        }
      });
    })();

    (() => {
      // `Map.prototype.filter` method
      // https://github.com/tc39/proposal-collection-methods
     objFillProp(Headers.prototype,'filter', function filter(callbackfn, thisArg) {
        const fn = callbackfn.bind(thisArg);
        const fd = new FormData();
        for (const [key, value] of this) {
          if (fn(value, key, this)) fd.append(key, value);
        }
        return fd;
      });
    })();

    // `Map.prototype.some` method
    // https://github.com/tc39/proposal-collection-methods
    objFillProp(Headers.prototype,'some' , function some(callbackfn, thisArg) {
      const fn = callbackfn.bind(thisArg);
      for (const [key, value] of this) {
        if (fn(value, key, this)) return true;
      }
      return false;
    });

    (() => {
      // `Map.prototype.every` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(Headers.prototype,'every', function every(callbackfn, thisArg) {
        const fn = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
          if (!fn(value, key, this)) return false;
        }
        return true;
      });
    })();

    (() => {
      // `Map.prototype.includes` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(Headers.prototype,'includes', function includes() {
        return apply(Array.from(this.values()), "includes", arguments);
      });
    })();

    (() => {
      // `Map.prototype.find` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(Headers.prototype,'find', function find(callbackfn, thisArg) {
        const boundFunction = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
          if (boundFunction(value, key, this)) return value;
        }
      });
    })();
    (() => {
      objFillProp(Headers.prototype,'getAll', function getAll(key) {
        if (!this.has(key)) return [];
        if (/set-cookie/i.test(key)) return this.getSetCookie();
        return String(this.get(key)).split(", ");
      });
    })();
    new Headers().size ??
      Object.defineProperty(Headers.prototype, "size", {
        get() {
          return Array.from(this.entries()).length;
        },
        set() {},
        enumerable: false,
      });
    objFillProp(Headers.prototype,'mapValues', function mapValues(
      callbackFn,
      thisArg = this,
    ) {
      const retObj = new Headers();
      for (const [key, value] of this) {
        const newValue = Reflect.apply(callbackFn, thisArg, [value, key, this]);
        retObj.append(key, newValue);
      }
      return retObj;
    });
    objFillProp(Headers.prototype,'mapKeys', function mapKeys(callbackFn, thisArg = this) {
      const retObj = new Headers();
      for (const [key, value] of this) {
        const newKey = Reflect.apply(callbackFn, thisArg, [value, key, this]);
        retObj.append(newKey, value);
      }
      return retObj;
    });
    objFillProp(Headers.prototype,'merge', function merge() {
      const headers = new Headers(this);
      for (const iter of Array.from(arguments)) {
        for (const [key, value] of new Headers(iter)) {
          headers.append(key, value);
        }
      }
      return headers;
    });
    objFillProp(Headers,'from', function from(obj) {
      try {
        return new Headers(new URLSearchParams(obj));
      } catch {
        return new Headers(new URLSearchParams(Object.entries(obj)));
      }
    });
    objFillProp(Headers.prototype,'upsert', function upsert(key, updateFn, insertFn) {
      let value;
      if (this.has(key)) {
        value = this.get(key);
        if (isFunction(updateFn)) {
          value = updateFn(value);
          this.set(key, value);
        }
      } else if (isFunction(insertFn)) {
        value = insertFn();
        this.set(key, value);
      }
      return value;
    });
    objFillProp(Headers.prototype,'deleteAll', function deleteAll(keys) {
      let all = true;
      for (const key of keys) {
        all = all && this.delete(key);
      }
      return all;
    });
    objFillProp(Headers.prototype,'update', function update(key, callback, thunk) {
      this.set(key, callback(this.get(key) ?? thunk(key, this), key, this));
      return this;
    });
    objFillProp(Headers.prototype,'updateOrInsert', Headers.prototype.upsert);
  })();

  //URLSearchParams
  (() => {
    if (!globalThis.URLSearchParams) return;
    objFillProp(URLSearchParams.prototype,'clear',function clear() {
      const keys = [...this.keys()];
      for (const key of keys) {
        this.delete(key);
      }
    });
    (() => {
      const $set = URLSearchParams.prototype.set;
      objDefProp(URLSearchParams.prototype,'set',function set(key, value) {
        $set.call(this, key, value);
        return this;
      });
    })();
    (() => {
      const $delete = URLSearchParams.prototype.delete;
      objDefProp(URLSearchParams.prototype,'delete',function _delete(key) {
        const has = this.has(key);
        $delete.call(this, key);
        return has;
      });
    })();

    (() => {
      // `Map.prototype.emplace` method
      // https://github.com/tc39/proposal-upsert
      objFillProp(URLSearchParams.prototype,'emplace',function emplace(key, handler) {
        if (this.has(key)) {
          const current = this.get(key);
          if (handler.update) {
            const value = handler.update(current, key, this);
            this.set(key, value);
            return value;
          }
          return current;
        }
        if (handler.insert) {
          const inserted = handler.insert(key, this);
          this.set(key, inserted);
          return inserted;
        }
      });
    })();

    (() => {
      // `Map.prototype.filter` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(URLSearchParams.prototype,'filter',function filter(
        callbackfn,
        thisArg,
      ) {
        const fn = callbackfn.bind(thisArg);
        const fd = new FormData();
        for (const [key, value] of this) {
          if (fn(value, key, this)) fd.set(key, value);
        }
        return fd;
      });
    })();

    // `Map.prototype.some` method
    // https://github.com/tc39/proposal-collection-methods
    objFillProp(URLSearchParams.prototype,'some', function some(callbackfn, thisArg) {
      const fn = callbackfn.bind(thisArg);
      for (const [key, value] of this) {
        if (fn(value, key, this)) return true
      }
      return false;
    });

    (() => {
      // `Map.prototype.every` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(URLSearchParams.prototype,'every',function every(callbackfn, thisArg) {
        const fn = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
          if (!fn(value, key, this)) return false;
        }
        return true;
      });
    })();

    (() => {
      // `Map.prototype.includes` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(URLSearchParams.prototype,'includes',function includes() {
        return apply(Array.from(this.values()), "includes", arguments);
      });
    })();

    (() => {
      // `Map.prototype.find` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(URLSearchParams.prototype,'find',function find(callbackfn, thisArg) {
        const boundFunction = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
          if (boundFunction(value, key, this)) return value;
        }
      });
    })();
    new URLSearchParams().size ??
      Object.defineProperty(URLSearchParams.prototype, "size", {
        get() {
          return Array.from(this.entries()).length;
        },
        set() {},
        enumerable: false,
      });
    objFillProp(URLSearchParams.prototype,'mapValues', function mapValues(
      callbackFn,
      thisArg = this,
    ) {
      const retObj = new URLSearchParams();
      for (const [key, value] of this) {
        const newValue = Reflect.apply(callbackFn, thisArg, [value, key, this]);
        retObj.append(key, newValue);
      }
      return retObj;
    });
    objFillProp(URLSearchParams.prototype,'mapKeys', function mapKeys(
      callbackFn,
      thisArg = this,
    ) {
      const retObj = new URLSearchParams();
      for (const [key, value] of this) {
        const newKey = Reflect.apply(callbackFn, thisArg, [value, key, this]);
        retObj.append(newKey, value);
      }
      return retObj;
    });
    objFillProp(URLSearchParams.prototype,'merge',function merge() {
      const up = new URLSearchParams(this);
      for (const iter of Array.from(arguments)) {
        new URLSearchParams(iter).forEach((value, key) => {
          up.append(key, value);
        });
      }
      return up;
    });
    objFillProp(URLSearchParams,'from' , function from(obj) {
      try {
        return new URLSearchParams(obj);
      } catch {
        return new URLSearchParams(Object.entries(obj));
      }
    });
    objFillProp(URLSearchParams.prototype,'upsert' , function upsert(
      key,
      updateFn,
      insertFn,
    ) {
      let value;
      if (this.has(key)) {
        value = this.get(key);
        if (isFunction(updateFn)) {
          value = updateFn(value);
          this.set(key, value);
        }
      } else if (isFunction(insertFn)) {
        value = insertFn();
        this.set(key, value);
      }
      return value;
    });
    objFillProp(URLSearchParams.prototype,'deleteAll',function deleteAll(keys) {
      let all = true;
      for (const key of keys) {
        all = all && this.delete(key);
      }
      return all;
    });
    objFillProp(URLSearchParams.prototype,'update',function update(key, callback, thunk) {
      this.set(key, callback(this.get(key) ?? thunk(key, this), key, this));
      return this;
    });
    objFillProp(URLSearchParams.prototype,'updateOrInsert',
      URLSearchParams.prototype.upsert);
  })();

  //FormData
  (() => {
    if (!globalThis.FormData) return;
    (() => {
      objFillProp(FormData.prototype,'clear',function clear() {
        for (const [key, _] of this) {
          this.delete(key);
        }
      });
    })();
    (() => {
      const $set = FormData.prototype.set;
      objDefProp(FormData.prototype,'set',function set(key, value) {
        $set.call(this, key, value);
        return this;
      });
    })();
    (() => {
      const $delete = FormData.prototype.delete;
      objDefProp(FormData.prototype,'delete',function _delete(key) {
        const has = this.has(key);
        $delete.call(this, key);
        return has;
      });
    })();

    (() => {
      // `Map.prototype.emplace` method
      // https://github.com/tc39/proposal-upsert
      objFillProp(FormData.prototype,'emplace',function emplace(key, handler) {
        if (this.has(key)) {
          const current = this.get(key);
          if (handler.update) {
            const value = handler.update(current, key, this);
            this.set(key, value);
            return value;
          }
          return current;
        }
        if (handler.insert) {
          const inserted = handler.insert(key, this);
          this.set(key, inserted);
          return inserted;
        }
      });
    })();

    (() => {
      // `Map.prototype.filter` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(FormData.prototype,'filter', function filter(callbackfn, thisArg) {
        const fn = callbackfn.bind(thisArg);
        const fd = new FormData();
        for (const [key, value] of this) {
          if (fn(value, key, this)) fd.set(key, value);
        }
        return fd;
      });
    })();

    // `Map.prototype.some` method
    // https://github.com/tc39/proposal-collection-methods
    objFillProp(FormData.prototype,'some', function some(callbackfn, thisArg) {
      const fn = callbackfn.bind(thisArg);
      for (const [key, value] of this) {
        if (fn(value, key, this)) return true;
      }
      return false;
    });

    (() => {
      // `Map.prototype.every` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(FormData.prototype,'every',function every(callbackfn, thisArg) {
        const fn = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
          if (!fn(value, key, this)) return false;
        }
        return true;
      });
    })();

    (() => {
      // `Map.prototype.includes` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(FormData.prototype,'includes',function includes() {
        return apply(Array.from(this.values()), "includes", arguments);
      });
    })();

    (() => {
      // `Map.prototype.find` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(FormData.prototype,'find',function find(callbackfn, thisArg) {
        const boundFunction = callbackfn.bind(thisArg);
        for (const [key, value] of this) {
          if (boundFunction(value, key, this)) return value;
        }
      });
    })();

    (()=>{
    new FormData().size ??
      Object.defineProperty(FormData.prototype, "size", {
        get() {
          return Array.from(this.entries()).length;
        },
        set() {},
        enumerable: false,
      });
    })();

    objFillProp(FormData.prototype,'mapValues',function mapValues(
      callbackFn,
      thisArg = this,
    ) {
      const retObj = new FormData();
      for (const [key, value] of this) {
        const newValue = Reflect.apply(callbackFn, thisArg, [value, key, this]);
        retObj.append(key, newValue);
      }
      return retObj;
    });
    objFillProp(FormData.prototype,'mapKeys',function mapKeys(
      callbackFn,
      thisArg = this,
    ) {
      const retObj = new FormData();
      for (const [key, value] of this) {
        const newKey = Reflect.apply(callbackFn, thisArg, [value, key, this]);
        retObj.append(newKey, value);
      }
      return retObj;
    });
    objFillProp(FormData.prototype,'merge',function merge(...args) {
      const fd = FormData.from(this);
      for (const iter of args) {
        FormData.from(iter).forEach((value, key) => {
          fd.append(key, value);
        });
      }
      return fd;
    });
    objFillProp(FormData,'from', function from(obj, submitter) {
      let entries, fd;
      try {
        fd = new FormData(obj, submitter);
      } catch {
        try {
          fd = new FormData();
          entries = obj.entries();
          for (const [key, value] of entries) {
            fd.append(key, value);
          }
          return fd;
        } catch {
          entries = new URLSearchParams.from(obj);
        }
        fd = new FormData();
        for (const [key, value] of entries) {
          fd.append(key, value);
        }
      }
      return fd;
    });
    objFillProp(FormData.prototype,'upsert', function upsert(key, updateFn, insertFn) {
      let value;
      if (this.has(key)) {
        value = this.get(key);
        if (isFunction(updateFn)) {
          value = updateFn(value);
          this.set(key, value);
        }
      } else if (isFunction(insertFn)) {
        value = insertFn();
        this.set(key, value);
      }
      return value;
    });
    objFillProp(FormData.prototype,'deleteAll',function deleteAll(keys) {
      let all = true;
      for (const key of keys) {
        all &&= this.delete(key);
      }
      return all;
    });
    objFillProp(FormData.prototype,'update',function update(key, callback, thunk) {
      this.set(key, callback(this.get(key) ?? thunk(key, this), key, this));
      return this;
    });
    (() => {
      objFillProp(FormData.prototype,'updateOrInsert',FormData.prototype.upsert);
    })();
  })();
})();
