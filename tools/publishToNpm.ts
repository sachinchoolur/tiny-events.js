const fs = require('fs-extra');
const colors = require('colors/safe');
const { exec } = require('shelljs');

try {
    const pkg = fs.readJsonSync('./package.json');
    const tarballName = `${pkg.name}-${pkg.version}.tgz`;
    fs.copySync('dist', 'npm');
    fs.copySync('README.md', 'npm/README.md');
    fs.copySync('LICENSE', 'npm/LICENSE');
    fs.copySync('package.json', 'npm/package.json');
    process.chdir('npm');
    exec('npm pack');
    exec(`npm publish ${tarballName} --access public`);
    process.chdir('../');
    console.log(colors.green('Successfully published to npm!', tarballName));
} catch (err) {
    console.log(colors.red(err));
}
// copy directory, even if it has subdirectories or files
