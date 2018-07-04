const chalk = require('chalk');

console.error = m => console.log(chalk.red.bold(`\n## ${m}\n`))
console.warn = m => console.log(chalk.yellow.bold(`\n## ${m}\n`));
console.info = m => console.log(chalk.white.bgMagenta.bold(`\n# ${m}\n`));
console.debug = m => console.log(chalk.green.bold(`\n## ${m}\n`));