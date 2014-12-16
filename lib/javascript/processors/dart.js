var assert = require('assert');
var path = require('path');
var Record = require('record');
var adapter =  require('gulp-adapter');
var DartTransformer = adapter(require('dart2js-gulp'));

var TerraformError = require("../../error").TerraformError;

exports.compile = function(filePath, fileContents, callback){
  try{
	  var errors = null;
	  // var script = cs.compile(fileContents.toString(), { bare: true });

	  var DART2JS = path.normalize("/usr/bin/dart2js");
	  var TEMP = '/tmp/dart2js-dump';

	  (new DartTransformer).run(
		  [new Record({
			  path: filePath,
			  contents: fileContents.toString()
		  })], // inputs
		  {
			  $1: '{ "check": false, "minify": false }',
			  $2: DART2JS,
			  $3: TEMP
		  }, // options
		  console // logger
	  ).then(function(inputs){
		  var script = inputs[0].contents;
		  callback(error, script);
	  });
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
}
