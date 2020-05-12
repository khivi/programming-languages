const gulp = require('gulp');
const ts = require('gulp-typescript');
const plumber = require('gulp-plumber');
const del = require('del');
const eslint = require('gulp-eslint');
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
  gulp.watch(tsFiles, { ignoreInitial: false },  gulp.series('compile'));
});

gulp.task('clean', (done) => { 
  del(['build'], done);
});

gulp.task('test', (done) => {
  gulp.src('build/test/*.js')
    .pipe(ava());
  done();
});

gulp.task('lint', () => {
  const config = {
    "root": true,
    "ignorePath": ".gitignore",
    "useEslintrc": false,
    "extensions": [".ts"],
    "warnFileIgnored": true,
    "extends": [
     'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    "plugins": [
      "@typescript-eslint"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "project": "./tsconfig.json"
    },
    "rules": {
      "require-jsdoc": "off",
      "spaced-comment": "off"
    }
  };
  return gulp.src(tsFiles)
    .pipe(eslint(config))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', gulp.series('clean', 'compile', 'watch'));
