// app.js CJS 浏览器本身不支持，需要在Node中执行
const {add, multiply} = require('./math');

console.log(add(1, 2));       // 3
console.log(multiply(3, 4));  // 12