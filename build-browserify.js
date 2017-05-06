const fs = require('fs');
const exec = require('child_process').exec;

const targetDir = process.argv[2];

if(targetDir){
  fs.readdir(targetDir, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    const cmd = `$(npm bin)/browserify ./${targetDir}/index.js -t babelify -o ./${targetDir}/bundle.js`;
    console.log(cmd);
    exec(cmd, (err, stdout, stderr) => {
      if (err || stderr) {
        console.error(err || stderr);
        process.exit(1);
      }
      console.log(stdout || 'done!');
    });
  });
}

