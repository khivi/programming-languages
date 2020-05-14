const gulp = require('gulp');
const ts = require('gulp-typescript');
const plumber = require('gulp-plumber');
import del from 'del';
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
  gulp.watch(tsFiles, {ignoreInitial: false}, gulp.series('compile', 'test'));
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

const lintFiles = tsFiles.concat(['gulpfile.ts']);
const lintConfig: any = {
  ignores: '.gitignore',
  space: true,
  rules: {
    'unicorn/filename-case': 'off',
    '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    'ava/no-ignored-test-files': 'off'
  },
  parserOptions: {
    project: './tsconfig.json'
  }
};

gulp.task('lint', () => {
  return gulp.src(lintFiles, {base: './'})
    .pipe(xo(lintConfig))
    .pipe(xo.format())
    .pipe(xo.failAfterError());
});

gulp.task('lint-fix', () => {
  lintConfig.fix = true;
  return gulp.src(lintFiles, {base: './'})
    .pipe(xo(lintConfig))
    .pipe(xo.format())
    .pipe(gulp.dest('.'));
});

gulp.task('default', gulp.series('clean', 'lint', 'compile', 'test'));
