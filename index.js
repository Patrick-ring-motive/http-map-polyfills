(async () => {
  async function importScript(url) {
    return eval?.call(globalThis, await (await fetch(url)).text());
  }
  await importScript(
    `https://cdn.jsdelivr.net/npm/core-js-bundle/minified.min.js?${new Date().getTime()}`,
  );
  await import("./http-map-polyfills.js");

  console.log("Map", Object.getOwnPropertyNames(Map.prototype));

  console.log(
    "Headers",
    Object.getOwnPropertyNames(Map.prototype).filter(
      (x) => !Object.getOwnPropertyNames(Headers.prototype).includes(x),
    ),
  );
  console.log(
    "FormData",
    Object.getOwnPropertyNames(Map.prototype).filter(
      (x) => !Object.getOwnPropertyNames(FormData.prototype).includes(x),
    ),
  );
  console.log(
    "URLSearchParams",
    Object.getOwnPropertyNames(Map.prototype).filter(
      (x) => !Object.getOwnPropertyNames(URLSearchParams.prototype).includes(x),
    ),
  );

  console.log(new Map().keys());

  console.log(new Map().entries());
})();
