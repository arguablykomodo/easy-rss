/* eslint-env node */
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const gulpif = require("gulp-if");
const uglify = require("gulp-uglify");
const browserify = require("browserify");
const gutil = require("gulp-util");
const tap = require("gulp-tap");
const buffer = require("gulp-buffer");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const htmlmin = require("gulp-htmlmin");

const release = process.argv[3] === "--release";

gulp.task("js", () => {
  return gulp.src("src/**/*.js", { read: false })
    .pipe(tap(function (file) {
      gutil.log("bundling " + file.path);
      file.contents = browserify(file.path, { debug: !release })
        .transform("babelify", { presets: ["env"] })
        .bundle();
    }))
    .pipe(buffer())
    .pipe(gulpif(release, uglify()))
    .pipe(gulp.dest("build"));
});

gulp.task("css", () => {
  return gulp.src("src/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ browsers: [">1%"] }))
    .pipe(gulpif(release, cssnano()))
    .pipe(gulp.dest("build"));
});

gulp.task("html", () => {
  return gulp.src("src/**/*.html")
    .pipe(gulpif(release, htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest("build"));
});

gulp.task("assets", () => {
  return gulp.src("src/assets/**/*")
    .pipe(gulp.dest("build/assets"));
});

gulp.task("manifest", () => {
  return gulp.src("src/manifest.json")
    .pipe(gulp.dest("build"));
});

gulp.task("build", ["html", "css", "js", "assets", "manifest"]);
gulp.task("watch", ["build"], () => {
  gulp.watch("src/**/*.html", ["html"]);
  gulp.watch("src/**/*.scss", ["css"]);
  gulp.watch("src/**/*.js", ["js"]);
  gulp.watch("src/manifest.json", ["manifest"]);
  gulp.watch("src/assets/**/*", ["assets"]);
});