var assert = require('assert');
var path = require('path');
var Record = require('record');
var tsc = require('typescript-compiler');

var TerraformError = require("../../error").TerraformError;

exports.compile = function(filePath, fileContents, callback){
  try{
	  var errors = null;
	  var script = tsc.compileString(fileContents.toString());
  }catch(e){
	  var errors = e;
	  errors.source = "CoffeeScript";
	  errors.dest = "JavaScript";
	  errors.filename = filePath;
	  errors.stack = fileContents.toString();
	  // errors.lineno = parseInt(errors.location.first_line ? errors.location.first_line + 1 : -1);
	  errors.lineno = 0;
	  var script = null;
	  var error = new TerraformError(errors);
  }finally{
  }
};
