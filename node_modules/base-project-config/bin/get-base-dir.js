const baseDir = __dirname.replace(/\\/g, '/');
module.exports = baseDir.substring(0, baseDir.lastIndexOf('/node_modules/'));
