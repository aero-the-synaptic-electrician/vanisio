const path = require('path');

console.log('Running path:', path.resolve(__dirname, '../src'));


module.exports = {
    // Source files
    source: path.resolve(__dirname, '../src'),

    // Production files
    output: path.resolve(__dirname, '../dist')
};