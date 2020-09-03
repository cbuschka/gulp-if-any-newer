# gulp-if-any-newer

#### Pass through all source files if any source file is newer than any dest file.

## Usage

```js
const gulp = require('gulp');
const ifAnyNewer = require('gulp-if-any-newer');
const anyConsumer = require('gulp-any-consumer');

const SRC = 'src/*.js';
const DEST = 'dist';

gulp.task('default', () =>
  gulp.src(SRC)
    .pipe(ifAnyNewer(DEST, { filter: '**/*', debug: true }))
    // anyConsumer will only get the files feeded in
    // if any source file is newer than any file in dest
    .pipe(anyConsumer())
    .pipe(gulp.dest(DEST));
);
```

## Related Gulp Plugins
* [gulp-newer](https://github.com/tschaub/gulp-newer)
* [gulp-changed](https://github.com/sindresorhus/gulp-changed)
* [gulp-changed-in-place](https://github.com/alexgorbatchev/gulp-changed-in-place)

## Contributing
Thanks to all contributors! This is open source, Pull Requests are welcome!

## License

Copyright (c) 2017-2020 by [Cornelius Buschka](https://github.com/cbuschka)

[MIT License](license)
