const DarkHeaders = class DarkHeaders extends Headers{};
Object.setPrototypeOf(DarkHeaders.prototype,new Proxy(Headers.prototype,{
  get(target,key,receiver){
    const $this = receiver ?? target;
    try{
      return Reflect.get(...arguments) ?? Headers.prototype.get.call($this,String(key));
    }catch(e){
      console.warn(e,...arguments);
    }
  },
  set(target,key,value,receiver){
    const $this = receiver ?? target;
    try{
      Headers.prototype.set.call($this,String(key),value);
    }catch(e){
      console.warn(e,...arguments);
    }
    return true;
  }
}));
