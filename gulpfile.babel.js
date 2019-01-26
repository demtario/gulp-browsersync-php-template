"use strict";

// Plugins
import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean-css';
import browserSync from 'browser-sync';
import del from 'del';
import php from 'gulp-connect-php'
import wait from 'gulp-wait'
import sourcemaps from 'gulp-sourcemaps'
import newer from 'gulp-newer'
import image from 'gulp-image';

browserSync.create('devServer')

// Path config
const config = {
  paths: {
    src: {
      static: [
        './src/**/*.html',
        './src/**/*.php'
      ],
      img: './src/img/**/*.*',
      sass: ['src/sass/app.scss'],
      js: [
        'src/js/**/*.js'
      ]
    },
    dist: {
      main: './dist',
      css: './dist/css',
      js: './dist/js',
      img: './dist/img'
    }
  }
};

// DevServer
const devServer = (done) => {
  php.server({
    base: config.paths.dist.main,
    port: 8010,
    keepalive: true
  });

  php.server({
    base: config.paths.dist.main,
    keepalive: true
  }, () => {
    browserSync
      .get('devServer')  
      .init({
        proxy: '127.0.0.1:8000',
        baseDir: "./dist",
        open:true,
        notify:false
      });
  });

  done()
}

// BrowserSync Reload
const browserSyncReload = (done) => {
  if(browserSync.has('devServer'))
    browserSync.reload()

  done()
}

// CSS Compile and Lint
const css = () => {
  return gulp
    .src(config.paths.src.sass)
    .pipe(wait())
    .pipe(sourcemaps.init())
    .pipe(sass())
      .on('error', sass.logError)
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(clean())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.dist.css))
    // .pipe(browserSync.stream());
}

// Javascript
const scripts = (done) => {
  gulp
    .src(config.paths.src.js)
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.paths.dist.js));
  done()
}

// Optimize Images
function images() {
  return gulp
    .src(config.paths.src.img)
    .pipe(newer(config.paths.dist.img))
    .pipe(image())
    .pipe(gulp.dest(config.paths.dist.img));
}

// Static file managment
const staticFiles = (done) => {
  gulp.src(config.paths.src.static)
    .pipe(newer(config.paths.dist.main))
    .pipe(gulp.dest(config.paths.dist.main));

  // gulp.src(config.paths.src.img)
  //   .pipe(gulp.dest(config.paths.dist.img));

  done()
}

const cleanDir = () => {
  return del([config.paths.dist.main]);
}

const watchFiles = () => {
  gulp.watch('src/sass/**/*.scss', gulp.series(css, browserSyncReload));
  gulp.watch('src/js/**/*.js', gulp.series(scripts, browserSyncReload));
  gulp.watch('src/**/*.html', gulp.series(staticFiles, browserSyncReload));
  gulp.watch('src/**/*.php', gulp.series(staticFiles, browserSyncReload));
  gulp.watch('src/img/**/*', gulp.series(images))
}

const build = gulp.series(cleanDir, gulp.parallel(css, scripts, staticFiles, images))
const serve = gulp.series(build, gulp.parallel(watchFiles, devServer))
const watch = gulp.parallel(build, watchFiles)


exports.default = build
exports.build = build
exports.watch = watch
exports.serve = serve
exports.css = css
exports.js = scripts
exports.clean = cleanDir