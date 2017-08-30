'use strict';

const PLUGIN_NAME = 'gulp-if-any-changed';

const gutil = require('gulp-util');
const through = require('through2');
const glob = require('glob');

const gulpIfAnyChanged = (dest, opts) => {
	if (!dest) {
		throw new gutil.PluginError(PLUGIN_NAME, '"dest" required');
	}
	glob(dest, {}, function (er, files) {
		for(let i=0; i<files.length; ++i) {
			gutil.log("files[i]="+files[i]);
		}
	});

	let buffer = [];
	let open = false;
	return through.obj(function (object, enc, callback) {

		if( /^.*c$/.test(object.path) ) { open = true; }

		if( !open ) {
			gutil.log("closed, %o seen", object);
			buffer.push(object);
		} else {
			if( buffer.length > 0 ) {
				gutil.log("open, flushing buffer");
				for(let i=0; i<buffer.length; ++i) {
					const object = buffer[i];
					gutil.log("open, %o seen", object);
					this.push(object)
				}
				buffer = []
			}
			gutil.log("open, %o seen", object);
			this.push(object)
		}
    		callback()
	});
};

module.exports = gulpIfAnyChanged;
