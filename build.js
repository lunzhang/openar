const fs = require('fs');
const path = require('path');

// remove current copy of file
try {
  fs.unlinkSync(path.resolve(__dirname, 'docs/openar.js'));
}
catch (err){
  console.log(err);
}

// copy dist copy into docs
try {
  fs.createReadStream(path.resolve(__dirname, 'dist/openar.js'))
  .pipe(fs.createWriteStream(path.resolve(__dirname, 'docs/libs/openar.js')));
}
catch (err){
  console.log(err);
}
