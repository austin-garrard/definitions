/* Fix requestAnimationFrame warning!
 * console.error node_modules/fbjs/lib/warning.js:33
 * Warning: React depends on requestAnimationFrame. Make sure that you load a polyfill in older browsers. http://fb.me/react-polyfills */

const rafPolyfill = global.requestAnimationFrame = (cb) => {
  setTimeout(cb, 0);
}

export default rafPolyfill;