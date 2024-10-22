const { run } = require('runjs');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'es6/JyfLargefileCrafter.js');

console.log(chalk`{blue.underline begin ejs}`);
run(`npx babel JyfLargefileCrafter.js  --out-dir ejs`)
console.log(chalk`{blue.underline finish ejs}`);

console.log(chalk`{blue.underline begin es6}`);
run(`npx babel JyfLargefileCrafter.js  --out-dir es6`)
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('read file error:', err);
    return;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // $& 表示整个被匹配的字符串
  }

  const A = `(void 0, function () {
  'use strict';`;
  const B = `  return JyfLargefileCrafter;
});`;

  const escapedA = escapeRegExp(A);
  const escapedB = escapeRegExp(B);

  const regex = new RegExp(`${escapedA}(.*?)${escapedB}`, 's');  // 's' 标志表示让 . 匹配换行符
  const match = data.match(regex);

  if (!match) {
    console.log(chalk`{red.underline write file error: can't find match}`);
    return;
  }

  const modifiedData = match[1] + `export default JyfLargefileCrafter;`;

  // 异步写入修改后的内容到文件
  fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.log(chalk`{red.underline write file error: ${err}}`);
      return;
    }
    console.log(chalk`{blue.underline finish es6}`);
    console.log(chalk`{blue.underline finish 100%}`);
  });
});

