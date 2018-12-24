const { execSync } = require('child_process');

console.log('Generating new version...');
const newVersion = execSync('npm version patch --message "Version %s [skip ci]"');
console.log(`Generated version ${newVersion}`);
console.log(execSync('git push').toString());