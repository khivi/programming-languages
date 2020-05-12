const gulp = require('gulp');
const ts = require('gulp-typescript');
const plumber = require('gulp-plumber');
const del = require('del');
const xo = require('gulp-xo');
const ava = require('gulp-ava');

const tsFiles = ['src/**/*.ts', 'test/**/*.ts'];
const tsProject = ts.createProject('tsconfig.json');


gulp.task('compile', () => {
  return gulp.src(tsFiles, {base: './'})
    .pipe(plumber())
    .pipe(tsProject())
    .pipe(gulp.dest('build'));
});

gulp.task('watch', () => {
  gulp.watch(tsFiles, { ignoreInitial: false },  gulp.series('compile', 'test'));
});

gulp.task('clean', (done: any) => { 
  del(['build']);
  done();
});

gulp.task('test', (done: any) => {
  gulp.src('build/test/*.js')
    .pipe(ava());
  done();
});

gulp.task('lint', () => {
  const config = {
    "ignores": ".gitignore",
    "space": true,
    "rules": {
        "unicorn/filename-case": "off"
    },
    "parserOptions": {
        project: "./tsconfig.json"
    }
  };
  const lintFiles = tsFiles.concat(['gulpfile.ts'])
  return gulp.src(lintFiles)
    .pipe(xo(config))
    .pipe(xo.format())
    .pipe(xo.failAfterError());
});

gulp.task('default', gulp.series('clean', 'compile', 'test'));
