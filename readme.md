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
    .pipe(ifAnyNewer(DEST, { filter: '**/*' }))
    // anyConsumer will only get the files feeded in
    // if any source file is newer than any file in dest
    .pipe(anyConsumer())
    .pipe(gulp.dest(DEST));
);
```

## License

Copyriht (c) 2017 by [Cornelius Buschka](https://github.com/cbuschka)

[MIT License](license)
