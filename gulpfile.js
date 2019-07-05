/** ====================================================================================================================
 Gulpfile
 ===================================================================================================================== */

const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', '*'],
        replaceString: 'gulp-',
        camelize: true,
        lazy: true
    }),
    babelify = require('babelify');
    plugins.uglify = require('gulp-uglify-es').default;

const BUILD_FOLDER = './build',
    DIST_FOLDER = './docs';

let _ENV = 'dev';

// TASK: Clean
gulp.task('clean', function () {
    plugins.del.sync(['./dist/**/*']);
});

// TASK: Docs
gulp.task('docs', function () {

    const target = _ENV === 'dev' ? BUILD_FOLDER : DIST_FOLDER;
    let templatePaths = ['./src/pages/', './src/components/'];
    let buster = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);

    // clean
    plugins.del.sync([target + '/pages/**/*']);

    let index = gulp.src(['./src/pages/index.html'])
        .pipe(plugins.plumber())
        .pipe(plugins.nunjucksRender({ path: templatePaths }))
        .pipe(plugins.htmlReplace({
            'css': '/css/style.css?cache=' + buster,
            'js': '/js/app.js?cache=' + buster
        }))
        .pipe(gulp.dest(target));

    let pages = gulp.src(['./src/pages/**/*.html', '!./src/pages/index.html'])
        .pipe(plugins.plumber())
        .pipe(plugins.nunjucksRender({ path: templatePaths }))
        .pipe(gulp.dest(target + '/pages'));

    let components = gulp.src(['./src/components/**/*.html'])
        .pipe(plugins.plumber())
        .pipe(plugins.nunjucksRender({ path: templatePaths }))
        .pipe(plugins.flatten())
        .pipe(gulp.dest(target + '/pages/components'));

    return plugins.mergeStream(index, pages, components);
});

// TASK: Css
gulp.task('css', function () {

    let target = _ENV === 'dev' ? BUILD_FOLDER : DIST_FOLDER;

    // clean
    plugins.del.sync([target + '/css']);

    let css = gulp.src([
        './src/scss/style.scss'
    ])
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init({loadMaps: true}))
        .pipe(plugins.sass({errLogToConsole: true, outputStyle: 'expanded'}).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer({
            browsers: ['last 4 versions', 'Firefox >= 45', 'iOS >=7', 'IE >=9']
        }))
        .pipe(plugins.concat('style.css'))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(target + '/css'))
        .pipe(plugins.browserSync.reload({ stream: true }));

    if (_ENV === 'prod') {
        return css
            .pipe(plugins.cssnano())
            .pipe(plugins.sourcemaps.write('./'))
            .pipe(gulp.dest(target + '/css'));
    }

    return css;
});

// TASK: Js
gulp.task('js', function () {

    let target = _ENV === 'dev' ? BUILD_FOLDER : DIST_FOLDER;

    // clean
    plugins.del.sync([target + '/js/app.*']);

    let js = plugins.browserify({
        entries: ['src/js/app.js'],
        debug: true
    })
        .transform('babelify', { presets: ['env'] })
        .bundle()
        .on('error', function (err) {
            console.log(err.stack);
            this.emit('end');
        })
        .pipe(plugins.plumber())
        .pipe(plugins.vinylSourceStream('app.js'))
        .pipe(plugins.vinylBuffer())
        .pipe(plugins.sourcemaps.init({loadMaps: true}))
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.flatten())
        .pipe(gulp.dest(target + '/js'));

    if (_ENV === 'prod') {
        return js
            .pipe(plugins.uglify())
            .pipe(plugins.sourcemaps.write('./'))
            .pipe(gulp.dest(target + '/js'));
    }

    return js;
});

// TASK: Images
gulp.task('images', function () {

    let target = _ENV === 'dev' ? BUILD_FOLDER : DIST_FOLDER;

    // clean
    plugins.del.sync([target + '/img']);

    let images = gulp.src(['./src/img/**/*'])
        .pipe(gulp.dest(target + '/img'));

    let componentsA = gulp.src(['./src/components/**/img/*'])
        .pipe(plugins.flatten({ includeParents: 1 } ))
        .pipe(gulp.dest(target + '/img'));

    let componentsB = gulp.src(['./src/components/**/img/**/*', '!./src/components/**/img/*'])
        .pipe(plugins.flatten({ includeParents: [1, 1]} ))
        .pipe(gulp.dest(target + '/img'));

    return plugins.mergeStream(images, componentsA, componentsB);
});

// TASK: Media
gulp.task('media', function () {

    let target = _ENV === 'dev' ? BUILD_FOLDER : DIST_FOLDER;

    // clean
    if (_ENV !== 'dev') {
        plugins.del.sync([target + '/media/*.json']);
    }

    let media = gulp.src([`${DIST_FOLDER}/media/**/*`])
        .pipe(gulp.dest(BUILD_FOLDER + '/media'));

    let components = gulp.src(['./src/components/**/media/*'])
        .pipe(plugins.flatten({ includeParents: 1} ))
        .pipe(gulp.dest(target + '/media'));

    return plugins.mergeStream(media, components);
});

// TASK: Fonts
gulp.task('fonts', function () {

    let target = _ENV === 'dev' ? BUILD_FOLDER : DIST_FOLDER;

    // clean
    plugins.del.sync([target + '/fonts']);

    let fonts = gulp.src(['./src/fonts/**/*.{eot,svg,ttf,woff,woff2}'])
        .pipe(gulp.dest(target + '/fonts'));

    let icomoon = gulp.src(['./src/vendor/icomoon/fonts/*.{eot,svg,ttf,woff,woff2}'])
        .pipe(gulp.dest(target + '/fonts/icomoon'));

    return plugins.mergeStream(fonts, icomoon);
});

//
// BUILD
gulp.task('build', ['docs', 'css', 'js', 'images', 'fonts', 'media']);

// BUILD: SERVER
gulp.task('server', function () {
    let target = _ENV === 'dev' ? BUILD_FOLDER : DIST_FOLDER;
    plugins.browserSync({
        server: {
            baseDir: target
        }
    });
});

//
// DEFAULT
gulp.task('default', ['build'], function() {

    gulp.start('server');

    // docs
    gulp.watch(['./src/pages/**/*.html', './src/components/**/*.html'], ['docs']);

    // css
    gulp.watch(['./src/scss/**/*.scss', './src/components/**/*.scss'], ['css']);

    // js
    gulp.watch(['./src/js/**/*.js', './src/components/**/*.js'], ['js']);

    // images
    gulp.watch(['./src/img/**/*', './src/components/**/img/*'], ['images']);

    // media
    gulp.watch(['./src/media/**/*', './src/components/**/media/*'], ['media']);

    // fonts
    gulp.watch(['./src/fonts/**/*', './vendor/icomoon/**/*.{eot,svg,ttf,woff,woff2}'], ['fonts']);
});

//
// DEPLOY:
gulp.task('target:prod', function () { _ENV = 'prod'; });
gulp.task('prod',
    plugins.sequence('target:prod', ['build'])
);
gulp.task('prod:preview',
    plugins.sequence('target:prod', ['default'])
);
