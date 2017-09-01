'use strict'

const PLUGIN_NAME = 'gulp-if-any-newer'

const gutil = require('gulp-util')
const through = require('through2')
const glob = require('glob')
const fs = require('fs')
const path = require('path')

function getMinModTime (dir, filter) {
  var minModTime = Number.MAX_SAFE_INTEGER
  var files = glob.sync(filter, {cwd: dir, absolute: true, nodir: true})
  for (let i = 0; i < files.length; ++i) {
    let stats = fs.statSync(files[i])
    minModTime = Math.min(stats.mtime, minModTime)
  }
  return minModTime
}

const gulpIfAnyNewer = (dest, opts) =
>
{
  if (!dest) {
    throw new gutil.PluginError(PLUGIN_NAME, '"dest" required')
  }

  opts = Object.assign({
    cwd: process.cwd(),
    filter: '**/*',
    debug: false
  }, opts)

  const destAbs = path.resolve(opts.cwd, dest)
  const destMinModTime = getMinModTime(destAbs, opts.filter)

  let buffer = []
  let open = destMinModTime === Number.MAX_SAFE_INTEGER
  return through.obj(function (chunk, enc, callback) {

    if (!open) {
      let srcPath = chunk.path
      let stats = fs.statSync(srcPath)
      if (stats.mtime > destMinModTime) {
        open = true
        if (opts.debug) {
          gutil.log(srcPath, 'newer than any in ', dest + '/' + opts.filter, ', opened buffer')
        }
      }
    }

    if (!open) {
      if (opts.debug) {
        gutil.log('Buffered', chunk.path)
      }
      buffer.push(chunk)
    } else {
      if (buffer.length > 0) {
        if (opts.debug) {
          gutil.log('Flushing buffer...')
        }
        for (let i = 0; i < buffer.length; ++i) {
          if (opts.debug) {
            gutil.log('Forwarded', buffer[i].path)
          }
          this.push(buffer[i])
        }
        buffer = []
        if (opts.debug) {
          gutil.log('Buffer flushed')
        }
      }
      if (opts.debug) {
        gutil.log('Forwarded', chunk.path)
      }
      this.push(chunk)
    }

    callback()
  })
}

module.exports = gulpIfAnyNewer
