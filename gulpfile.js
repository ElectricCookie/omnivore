


const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const del = require('del');
const glob = require('glob');
const path = require('path');
const isparta = require('isparta');

const Instrumenter = isparta.Instrumenter;
const manifest = require('./package.json');
const mainFile = manifest.main;

// Load all of our Gulp plugins
const $ = loadPlugins();

require('babel-register');


// Lint a set of files
function lint(files) {
  return gulp.src(files)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
}



gulp.task("build-library",() => {
  gulp.src(manifest.buildSystem.framework)
    .pipe($.babel())
    .pipe(
      gulp.dest(
        path.dirname(mainFile)
      )
    );
});

gulp.task("build-cli",() => {
  gulp.src(manifest.buildSystem.cli)
    .pipe($.babel())
    .pipe(
      gulp.dest(
        path.dirname(mainFile)
      )
    );
});

gulp.task("build",["build-cli","build-library"])

gulp.task("test",() => {
  gulp.src(['test/**/*.js'], {read: false})
    .pipe($.mocha({
      reporter: 'nyan',
      ignoreLeaks: false
    }));
});

gulp.task("lint-src",() => {
  return lint("src/**/*.js");
});

gulp.task("lint-test",() => {
  return lint("test/**/*.js");
});

gulp.task("coverage",(done) => {
  gulp.src(['src/**/*.js'])
  .pipe($.istanbul({
    instrumenter: Instrumenter,
    includeUntested: true
  }))
  .pipe($.istanbul.hookRequire())
  .pipe($.istanbul.writeReports());
});


gulp.task("watch",["build","test"],() => {
  gulp.watch(["src/**/*.*"],["build","test"]);
});