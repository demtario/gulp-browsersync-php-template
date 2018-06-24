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

const reload = browserSync.reload;
const config = {
    paths: {
        src: {
            html: './src/**/*.html',
            php: './src/**/*.php',
            img: './src/img/**.*',
            sass: ['src/sass/app.scss'],
            js: [
                'src/js/libs/vue.js',
                'src/js/app.js',
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

gulp.task('sass', () => {
    return gulp.src(config.paths.src.sass)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(clean())
        .pipe(gulp.dest(config.paths.dist.css))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    gulp.src(config.paths.src.js)
        .pipe(babel({ presets: ['env'] }))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.paths.dist.js));

    reload();
});

gulp.task('static', () => {
    gulp.src(config.paths.src.html)
        .pipe(gulp.dest(config.paths.dist.main));

    gulp.src(config.paths.src.php)
        .pipe(gulp.dest(config.paths.dist.main));

    gulp.src(config.paths.src.img)
        .pipe(gulp.dest(config.paths.dist.img));

    reload();
});

gulp.task('clean', () => {
    return del([config.paths.dist.main]);
});

gulp.task('build', ['clean'], function () {
   gulp.start('sass', 'js', 'static');
});

gulp.task('php', () => {
    php.server({ base: 'app', port: 8010, keepalive: true});
});

gulp.task('server', ['php'], () => {

    php.server({
        base: config.paths.dist.main
    }, () =>{
        browserSync({
          proxy: '127.0.0.1:8000'
        });
    });
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/**/*.html', ['static']);
    gulp.watch('src/**/*.php', ['static']);
    gulp.start('server');
});

gulp.task('default', ['clean', 'build']);