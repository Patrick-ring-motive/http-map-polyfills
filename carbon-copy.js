(()=>{
  const instanceOf = function instanceOf(x, y) {
    try {
      return x instanceof y;
    } catch {
      return false;
    }
  };

  const constructOf = (x, y) => 
    instanceOf(x, y) 
    || (x?.constructor?.name
    && (x.constructor.name === y?.name));
  
  const TypedArray = Uint8Array?.__proto__;
  const isFunction = (x) => typeof x === "function" || constructOf(x,Function);
  const isString = (x) => typeof x === "string" || constructOf(x,String);
  const isArray = (x) =>
    Array.isArray(x) || constructOf(x,Array);


  function carbonCopy(x){
    if(constructOf(x,Request)
      || constructOf(x,Response)){
       return x.clone();
      }
  }

  
})();