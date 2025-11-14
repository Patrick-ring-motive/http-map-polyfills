
(() => {
  const Q = fn =>{
    try{
      return fn?.();
    }catch{}
  };
  try{
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
  const objFillProp = (obj, prop, value) => {
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
  const isFunction = (x) => typeof x === "function" || instanceOf(x,Function) || x?.constructor?.name == 'Function';
  const isString = (x) => typeof x === "string" || instanceOf(x, String) || x?.constructor?.name == 'String';
  const isArray = (x) =>
    Array.isArray(x) || instanceOf(x,Array) || x?.constructor?.name == 'Array';
  const applyMethod = ($this, fn, args) => $this[fn].apply($this, args);
  const enact = (fn, args) => fn.apply(undefined, args);
  const arr = (x) => Array.from(x);
  const anew = (fn, args) => Reflect.construct(fn, args);
  
  
  for(const $Map of [Q(()=>Headers) ?? {}, Q(()=>FormData) ?? {}, Q(()=>URLSearchParams) ?? {}]){
  //headers
  (() => {
    if (!globalThis.Headers) return;

    (() => {
      objFillProp(Headers.prototype, "clear", function clear() {
        for (const [key, _] of this) {
          this.delete(key);
        }
      });
    })();

    (() => {
      const $delete = Headers.prototype.delete;
      objDefProp(Headers.prototype, "delete", function _delete(key) {
        const has = this.has(key);
        $delete.call(this, key);
        return has;
      });
      objDefProp(Headers.prototype.delete, "name", "delete");
    })();

    (() => {
      // `Map.prototype.emplace` method
      // https://github.com/tc39/proposal-upsert
      objFillProp(Headers.prototype, "emplace", function emplace(key, handler) {
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
      objFillProp(
        Headers.prototype,
        "filter",
        function filter(callbackfn, thisArg) {
          const fn = callbackfn.bind(thisArg);
          const fd = new Headers();
          for (const [key, value] of this) {
            if (fn(value, key, this)) fd.append(key, value);
          }
          return fd;
        },
      );
    })();

    (() => {
      // `Map.prototype.some` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        Headers.prototype,
        "some",
        function some(callbackfn, thisArg) {
          const fn = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (fn(value, key, this)) return true;
          }
          return false;
        },
      );
    })();

    (() => {
      // `Map.prototype.every` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        Headers.prototype,
        "every",
        function every(callbackfn, thisArg) {
          const fn = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (!fn(value, key, this)) return false;
          }
          return true;
        },
      );
    })();

    (() => {
      // `Map.prototype.includes` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(Headers.prototype, "includes", function includes() {
        return applyMethod(Array.from(this.values()), "includes", arguments);
      });
    })();

    (() => {
      // `Map.prototype.find` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        Headers.prototype,
        "find",
        function find(callbackfn, thisArg) {
          const boundFunction = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (boundFunction(value, key, this)) return value;
          }
        },
      );
    })();

    (() => {
      objFillProp(
        Headers.prototype,
        "findKey",
        function findKey(callbackfn, thisArg) {
          // `Map.prototype.findKey` method
          // https://github.com/tc39/proposal-collection-methods
          const boundFunction = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (boundFunction(value, key, this)) return key;
          }
        },
      );
    })();

    (() => {
      objFillProp(Headers.prototype, "getAll", function getAll(key) {
        if (!this.has(key)) return [];
        if (/set-cookie/i.test(key)) return this.getSetCookie();
        return String(this.get(key)).split(", ");
      });
    })();

    (() => {
      new Headers().size ??
        Object.defineProperty(Headers.prototype, "size", {
          get() {
            return Array.from(this.entries()).length;
          },
          set() {},
          enumerable: false,
        });
    })();

    (() => {
      objFillProp(
        Headers.prototype,
        "mapValues",
        function mapValues(callbackFn, thisArg = this) {
          const retObj = new Headers();
          for (const [key, value] of this) {
            const newValue = Reflect.apply(callbackFn, thisArg, [
              value,
              key,
              this,
            ]);
            retObj.append(key, newValue);
          }
          return retObj;
        },
      );
    })();

    (() => {
      objFillProp(
        Headers.prototype,
        "mapKeys",
        function mapKeys(callbackFn, thisArg = this) {
          const retObj = new Headers();
          for (const [key, value] of this) {
            const newKey = Reflect.apply(callbackFn, thisArg, [
              value,
              key,
              this,
            ]);
            retObj.append(newKey, value);
          }
          return retObj;
        },
      );
    })();

    (() => {
      objFillProp(Headers.prototype, "merge", function merge(...args) {
        const headers = new Headers(this);
        for (const item of args) {
          const itemHeaders = new Headers(item);
          for (const [key, value] of itemHeaders) {
            headers.append(key, value);
          }
        }
        return headers;
      });
    })();

    (() => {
      objFillProp(Headers, "from", function from(obj) {
        try {
          return new Headers(new URLSearchParams(obj));
        } catch {
          return new Headers(new URLSearchParams(Object.entries(obj)));
        }
      });
    })();

    (() => {
      objFillProp(
        Headers.prototype,
        "upsert",
        function upsert(key, updateFn, insertFn) {
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
        },
      );
    })();

    (() => {
      objFillProp(Headers.prototype, "deleteAll", function deleteAll(keys) {
        let all = true;
        for (const key of keys) {
          all = all && this.delete(key);
        }
        return all;
      });
    })();

    (() => {
      objFillProp(
        Headers.prototype,
        "update",
        function update(key, callback, thunk) {
          this.set(key, callback(this.get(key) ?? thunk(key, this), key, this));
          return this;
        },
      );
    })();

    (() => {
      objFillProp(
        Headers.prototype,
        "updateOrInsert",
        function updateOrInsert() {
          return applyMethod(this, "upsert", arguments);
        },
      );
    })();

    (() => {
      objFillProp(Headers.prototype, "keyOf", function keyOf(searchElement) {
        for (const [key, value] of this) {
          if (value === searchElement) {
            return key;
          }
        }
      });
    })();

    (() => {
      objFillProp(
        Headers.prototype,
        "getOrInsert",
        function getOrInsert(key, value) {
          if (this.has(key)) {
            return this.get(key);
          }
          this.set(key, value);
          return value;
        },
      );
    })();

    (() => {
      objFillProp(
        Headers.prototype,
        "getOrInsertComputed",
        function getOrInsertComputed(key, fn) {
          if (this.has(key)) {
            return this.get(key);
          }
          const value = fn(key);
          this.set(key, value);
          return value;
        },
      );
    })();

    (() => {
      objFillProp(
        Headers.prototype,
        "reduce",
        function reduce(callbackfn, accumulator) {
          for (const [key, value] of this) {
            accumulator = callbackfn(accumulator, value, key, this);
          }
          return accumulator;
        },
      );
    })();
  })();
  }
  //URLSearchParams
  (() => {
    if (!globalThis.URLSearchParams) return;

    (() => {
      objFillProp(URLSearchParams.prototype, "clear", function clear() {
        const keys = [...this.keys()];
        for (const key of keys) {
          this.delete(key);
        }
      });
    })();

    (() => {
      const $set = URLSearchParams.prototype.set;
      objDefProp(URLSearchParams.prototype, "set", function set(key, value) {
        $set.call(this, key, value);
        return this;
      });
    })();

    (() => {
      const $delete = URLSearchParams.prototype.delete;
      objDefProp(URLSearchParams.prototype, "delete", function _delete(key) {
        const has = this.has(key);
        $delete.call(this, key);
        return has;
      });
      objDefProp(URLSearchParams.prototype.delete, "name", "delete");
    })();

    (() => {
      // `Map.prototype.emplace` method
      // https://github.com/tc39/proposal-upsert
      objFillProp(
        URLSearchParams.prototype,
        "emplace",
        function emplace(key, handler) {
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
        },
      );
    })();

    (() => {
      // `Map.prototype.filter` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        URLSearchParams.prototype,
        "filter",
        function filter(callbackfn, thisArg) {
          const fn = callbackfn.bind(thisArg);
          const fd = new URLSearchParams();
          for (const [key, value] of this) {
            if (fn(value, key, this)) fd.set(key, value);
          }
          return fd;
        },
      );
    })();

    (() => {
      // `Map.prototype.some` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        URLSearchParams.prototype,
        "some",
        function some(callbackfn, thisArg) {
          const fn = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (fn(value, key, this)) return true;
          }
          return false;
        },
      );
    })();

    (() => {
      // `Map.prototype.every` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        URLSearchParams.prototype,
        "every",
        function every(callbackfn, thisArg) {
          const fn = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (!fn(value, key, this)) return false;
          }
          return true;
        },
      );
    })();

    (() => {
      // `Map.prototype.includes` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(URLSearchParams.prototype, "includes", function includes() {
        return applyMethod(Array.from(this.values()), "includes", arguments);
      });
    })();

    (() => {
      // `Map.prototype.find` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        URLSearchParams.prototype,
        "find",
        function find(callbackfn, thisArg) {
          const boundFunction = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (boundFunction(value, key, this)) return value;
          }
        },
      );
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "findKey",
        function findKey(callbackfn, thisArg) {
          // `Map.prototype.findKey` method
          // https://github.com/tc39/proposal-collection-methods
          const boundFunction = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (boundFunction(value, key, this)) return key;
          }
        },
      );
    })();

    (() => {
      new URLSearchParams().size ??
        Object.defineProperty(URLSearchParams.prototype, "size", {
          get() {
            return Array.from(this.entries()).length;
          },
          set() {},
          enumerable: false,
        });
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "mapValues",
        function mapValues(callbackFn, thisArg = this) {
          const retObj = new URLSearchParams();
          for (const [key, value] of this) {
            const newValue = Reflect.apply(callbackFn, thisArg, [
              value,
              key,
              this,
            ]);
            retObj.append(key, newValue);
          }
          return retObj;
        },
      );
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "mapKeys",
        function mapKeys(callbackFn, thisArg = this) {
          const retObj = new URLSearchParams();
          for (const [key, value] of this) {
            const newKey = Reflect.apply(callbackFn, thisArg, [
              value,
              key,
              this,
            ]);
            retObj.append(newKey, value);
          }
          return retObj;
        },
      );
    })();

    (() => {
      objFillProp(URLSearchParams.prototype, "merge", function merge() {
        const up = new URLSearchParams(this);
        for (const iter of Array.from(arguments)) {
          new URLSearchParams(iter).forEach((value, key) => {
            up.append(key, value);
          });
        }
        return up;
      });
    })();

    (() => {
      objFillProp(URLSearchParams, "from", function from(obj) {
        try {
          return new URLSearchParams(obj);
        } catch {
          return new URLSearchParams(Object.entries(obj));
        }
      });
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "upsert",
        function upsert(key, updateFn, insertFn) {
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
        },
      );
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "deleteAll",
        function deleteAll(keys) {
          let all = true;
          for (const key of keys) {
            all = all && this.delete(key);
          }
          return all;
        },
      );
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "update",
        function update(key, callback, thunk) {
          this.set(key, callback(this.get(key) ?? thunk(key, this), key, this));
          return this;
        },
      );
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "updateOrInsert",
        function updateOrInsert() {
          return applyMethod(this, "upsert", arguments);
        },
      );
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "keyOf",
        function keyOf(searchElement) {
          for (const [key, value] of this) {
            if (value === searchElement) {
              return key;
            }
          }
        },
      );
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "getOrInsert",
        function getOrInsert(key, value) {
          if (this.has(key)) {
            return this.get(key);
          }
          this.set(key, value);
          return value;
        },
      );
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "getOrInsertComputed",
        function getOrInsertComputed(key, fn) {
          if (this.has(key)) {
            return this.get(key);
          }
          const value = fn(key);
          this.set(key, value);
          return value;
        },
      );
    })();

    (() => {
      objFillProp(
        URLSearchParams.prototype,
        "reduce",
        function reduce(callbackfn, accumulator) {
          for (const [key, value] of this) {
            accumulator = callbackfn(accumulator, value, key, this);
          }
          return accumulator;
        },
      );
    })();
  })();

  //FormData
  (() => {
    if (!globalThis.FormData) return;

    (() => {
      objFillProp(FormData.prototype, "clear", function clear() {
        for (const [key, _] of this) {
          this.delete(key);
        }
      });
    })();

    (() => {
      const $set = FormData.prototype.set;
      objDefProp(FormData.prototype, "set", function set(key, value) {
        $set.call(this, key, value);
        return this;
      });
    })();

    (() => {
      const $delete = FormData.prototype.delete;
      objDefProp(FormData.prototype, "delete", function _delete(key) {
        const has = this.has(key);
        $delete.call(this, key);
        return has;
      });
      objDefProp(FormData.prototype.delete, "name", "delete");
    })();

    (() => {
      // `Map.prototype.emplace` method
      // https://github.com/tc39/proposal-upsert
      objFillProp(
        FormData.prototype,
        "emplace",
        function emplace(key, handler) {
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
        },
      );
    })();

    (() => {
      // `Map.prototype.filter` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        FormData.prototype,
        "filter",
        function filter(callbackfn, thisArg) {
          const fn = callbackfn.bind(thisArg);
          const fd = new FormData();
          for (const [key, value] of this) {
            if (fn(value, key, this)) fd.set(key, value);
          }
          return fd;
        },
      );
    })();

    (() => {
      // `Map.prototype.some` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        FormData.prototype,
        "some",
        function some(callbackfn, thisArg) {
          const fn = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (fn(value, key, this)) return true;
          }
          return false;
        },
      );
    })();

    (() => {
      // `Map.prototype.every` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        FormData.prototype,
        "every",
        function every(callbackfn, thisArg) {
          const fn = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (!fn(value, key, this)) return false;
          }
          return true;
        },
      );
    })();

    (() => {
      // `Map.prototype.includes` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(FormData.prototype, "includes", function includes() {
        return applyMethod(Array.from(this.values()), "includes", arguments);
      });
    })();

    (() => {
      // `Map.prototype.find` method
      // https://github.com/tc39/proposal-collection-methods
      objFillProp(
        FormData.prototype,
        "find",
        function find(callbackfn, thisArg) {
          const boundFunction = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (boundFunction(value, key, this)) return value;
          }
        },
      );
    })();

    (() => {
      objFillProp(
        FormData.prototype,
        "findKey",
        function findKey(callbackfn, thisArg) {
          // `Map.prototype.findKey` method
          // https://github.com/tc39/proposal-collection-methods
          const boundFunction = callbackfn.bind(thisArg);
          for (const [key, value] of this) {
            if (boundFunction(value, key, this)) return key;
          }
        },
      );
    })();

    (() => {
      new FormData().size ??
        Object.defineProperty(FormData.prototype, "size", {
          get() {
            return Array.from(this.entries()).length;
          },
          set() {},
          enumerable: false,
        });
    })();

    (() => {
      objFillProp(
        FormData.prototype,
        "mapValues",
        function mapValues(callbackFn, thisArg = this) {
          const retObj = new FormData();
          for (const [key, value] of this) {
            const newValue = Reflect.apply(callbackFn, thisArg, [
              value,
              key,
              this,
            ]);
            retObj.append(key, newValue);
          }
          return retObj;
        },
      );
    })();

    (() => {
      objFillProp(
        FormData.prototype,
        "mapKeys",
        function mapKeys(callbackFn, thisArg = this) {
          const retObj = new FormData();
          for (const [key, value] of this) {
            const newKey = Reflect.apply(callbackFn, thisArg, [
              value,
              key,
              this,
            ]);
            retObj.append(newKey, value);
          }
          return retObj;
        },
      );
    })();

    (() => {
      objFillProp(FormData.prototype, "merge", function merge(...args) {
        const fd = FormData.from(this);
        for (const iter of args) {
          FormData.from(iter).forEach((value, key) => {
            fd.append(key, value);
          });
        }
        return fd;
      });
    })();

    (() => {
      objFillProp(FormData, "from", function from(obj, submitter) {
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
    })();

    (() => {
      objFillProp(
        FormData.prototype,
        "upsert",
        function upsert(key, updateFn, insertFn) {
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
        },
      );
    })();

    (() => {
      objFillProp(FormData.prototype, "deleteAll", function deleteAll(keys) {
        let all = true;
        for (const key of keys) {
          all &&= this.delete(key);
        }
        return all;
      });
    })();

    (() => {
      objFillProp(
        FormData.prototype,
        "update",
        function update(key, callback, thunk) {
          this.set(key, callback(this.get(key) ?? thunk(key, this), key, this));
          return this;
        },
      );
    })();

    (() => {
      objFillProp(
        FormData.prototype,
        "updateOrInsert",
        function updateOrInsert() {
          return applyMethod(this, "upsert", arguments);
        },
      );
    })();

    (() => {
      objFillProp(FormData.prototype, "keyOf", function keyOf(searchElement) {
        for (const [key, value] of this) {
          if (value === searchElement) {
            return key;
          }
        }
      });
    })();

    (() => {
      objFillProp(
        FormData.prototype,
        "getOrInsert",
        function getOrInsert(key, value) {
          if (this.has(key)) {
            return this.get(key);
          }
          this.set(key, value);
          return value;
        },
      );
    })();

    (() => {
      objFillProp(
        FormData.prototype,
        "getOrInsertComputed",
        function getOrInsertComputed(key, fn) {
          if (this.has(key)) {
            return this.get(key);
          }
          const value = fn(key);
          this.set(key, value);
          return value;
        },
      );
    })();

    (() => {
      objFillProp(
        FormData.prototype,
        "reduce",
        function reduce(callbackfn, accumulator) {
          for (const [key, value] of this) {
            accumulator = callbackfn(accumulator, value, key, this);
          }
          return accumulator;
        },
      );
    })();
  })();
  }catch(e){
    console.warn(e);
  }
})();
