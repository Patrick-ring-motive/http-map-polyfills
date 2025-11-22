const DarkHeaders = class DarkHeaders extends Headers{};
Object.setPrototypeOf(DarkHeaders.prototype,new Proxy(Headers.prototype,{
  get(target,key,receiver){
    const $this = receiver ?? target;
    return Reflect.get(...arguments) ?? Headers.prototype.get.call($this,key);
  },
  set(target,key,value,receiver){
    const $this = receiver ?? target;
    return Headers.prototype.set.call($this,key,value);
  }
});
