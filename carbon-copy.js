(()=>{
  const instanceOf = function instanceOf(x, y) {
    try {
      return x instanceof y;
    } catch {
      return false;
    }
  };

  const getType = x=>x?.__proto__?.toString?.()?.slice?.(8, -1);
  
  const constructOf = (x, y) => 
    instanceOf(x, y) 
    || (x?.constructor?.name
    && (x.constructor.name === y?.name));
  
  const TypedArray = Uint8Array?.__proto__;
  const isFunction = (x) => typeof x === "function" || constructOf(x,Function);
  const isString = (x) => typeof x === "string" || constructOf(x,String);
  const isNumber= (x) => typeof x === "number" || constructOf(x,Number);
  const isSymbol = (x) => typeof x === "symbol" || constructOf(x,Symbol);
  const isBoolean = (x) => typeof x === "boolean" || constructOf(x,Boolean);
  const isBigInt = (x) => typeof x === "bigint" || constructOf(x,BigInt);
  const isArray = (x) =>
    Array.isArray(x) || constructOf(x,Array);

  const objDoProp = function (obj, prop, def, enm, mut) {
    return Object.defineProperty(obj, prop, {
      value: def,
      writable: mut,
      writeable: mut,
      enumerable: enm,
      configurable: mut,
    });
  };
  const objDefProp = (obj, prop, def) => objDoProp(obj, prop, def, false, true);

  function identity(x,y){
    try{
      objDefProp(y,'valueOf',()=>x);
    }catch{}
    try{
      objDefProp(y,'toString',()=>x);
    }catch{}
    try{
      objDefProp(y,'toLocaleString',()=>x);
    }catch{}
    try{
      objDefProp(y,Symbol.toPrimitive,()=>x);
    }catch{}
    objDefProp(y,Symbol.toStringTag,x);
    y
  }

  function carbonCopy(x){
    if(constructOf(x,Request)
      || constructOf(x,Response)){
       return identity(x.clone(),x);;
      }
    if(isArray(x)){
      return identity([...x],x);
    }
    if(constructOf(x,Map)){
      return identity(new Map(x),x);
    }
    if(constructOf(x,Set)){
      return identity(new Set(x),x);
    }
    if(isString(x)||isNumber(x)||isBoolean(x)||isSymbol(x)||isBigInt(x)){
      return Object(x.valueOf());
    }
  }

  let x = new Map();
  x.set(1,3);
  let y = new Map(x);
  identity(x,y);
  console.log(x==new Object(x));
  
})();