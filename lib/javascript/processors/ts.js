var assert = require('assert');
var path = require('path');
var Record = require('record');
var tsc = require('typescript-compiler');
var fs = require('fs');
var mkdirp = require('mkdirp');

var TerraformError = require("../../error").TerraformError;

exports.compile = function(filePath, fileContents, callback){
	// var script = 'EMPTY';
	try{
		var errors = null;
		console.log(filePath);
		var inputPath = filePath.substring(0, filePath.lastIndexOf('/'));
		var fileName = filePath.split('\\').pop().split('/').pop().split('.')[0];
		var outputPath = ("/tmp/tsc-dump"+inputPath).replace(/ /g, '');
		var outputFile = outputPath + '/' + fileName + '.js';
		// console.log(outputFile);
		mkdirp.sync(outputPath);
		tsc.compile([filePath],'-m commonjs -t ES5 --out ' + outputFile);
		var script = fs.readFileSync(outputFile, 'utf8');
		// console.log(script);
	} catch(e){
		var errors = e;
		errors.source = "CoffeeScript";
		errors.dest = "JavaScript";
		errors.filename = filePath;
		errors.stack = fileContents.toString();
		// errors.lineno = parseInt(errors.location.first_line ? errors.location.first_line + 1 : -1);
		errors.lineno = 0;
		script = null;
		var error = new TerraformError(errors);
	}finally{
		// console.log('Fin!');
		callback(error, script)
	}
};
