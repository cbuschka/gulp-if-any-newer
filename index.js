'use strict';

const PLUGIN_NAME = 'gulp-if-any-newer'

const gutil = require('gulp-util')
const through = require('through2')
const glob = require('glob')
const fs = require('fs')
const path = require('path')

function getMinModTime(dir, filter) {
	var minModTime = Number.MAX_SAFE_INTEGER
	var files = glob.sync(filter, {cwd: dir, absolute: true, nodir: true})
	for(let i=0; i<files.length; ++i) {
		let stats = fs.statSync(files[i])
		minModTime = Math.min(stats.mtime, minModTime)
	}
	return minModTime
}

const gulpIfAnyNewer = (dest, opts) => {
	if (!dest) {
		throw new gutil.PluginError(PLUGIN_NAME, '"dest" required')
	}

	opts = Object.assign({
		cwd: process.cwd(),
		filter: '**/*'
	}, opts)

	const destAbs = path.resolve(opts.cwd, dest)
	const destMinModTime = getMinModTime(destAbs, opts.filter)

	let buffer = []
	let open = destMinModTime === Number.MAX_SAFE_INTEGER
	return through.obj(function (chunk, enc, callback) {

		if( !open && chunk.path ) {
			let srcPath = chunk.path
			let stats = fs.statSync(srcPath)
			if( stats.mtime > destMinModTime ) {
				open = true
			}
		}

		if( !open ) {
			buffer.push(chunk)
		} else {
			if( buffer.length > 0 ) {
				for(let i=0; i<buffer.length; ++i) {
					const chunk = buffer[i]
					this.push(chunk)
				}
				buffer = []
			}
			this.push(chunk)
		}

		callback()
	});
};

module.exports = gulpIfAnyNewer;
