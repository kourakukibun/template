const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const through = require('through2');
const path = require('path');

$.browserSync = require('browser-sync');
$.fs = require('fs');
$.imageminJpg = require('imagemin-jpeg-recompress');
$.imageminPng = require('imagemin-pngquant');

//gulp v4 pipe で callback 返すための関数
const runPipeCallBack = cb => {
  cb();
  return through.obj((file, enc, throughCb) => {
    return throughCb(null, file);
  });
};

// 共通改行オプション
const lineOptions = {
  verbose: true,
  eolc: 'LF',
  encoding: 'utf8'
};

// jsonデータ取得
const getDataJson = function (file) {
  return JSON.parse($.fs.readFileSync(file, 'utf8'));
};


//#--------------------------
//# libs task
//#--------------------------

// ライブラリCSSを結合
gulp.task('libs:css', cb => {
  gulp.src([
    'src/libs/css/**/*.css'
  ])
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    }))
    .pipe($.concat('libs.css'))
    .pipe($.cleanCss())
    .pipe($.lineEndingCorrector(lineOptions))
    .pipe(gulp.dest('dist/assets/css/libs/'))
    .pipe(runPipeCallBack(cb));
});

// ライブラリJSを結合
gulp.task('libs:js', cb => {
  gulp.src([
    'src/libs/js/**/*.js'
  ])
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    }))
    .pipe($.concat('libs.js'))
    .pipe($.uglify({
      output: {
        comments: /^!/
      }
    }))
    .pipe($.lineEndingCorrector(lineOptions))
    .pipe(gulp.dest('dist/assets/js/libs/'))
    .pipe(runPipeCallBack(cb));
});

gulp.task('libs', gulp.parallel(['libs:js', 'libs:css']));


//#--------------------------
//# html compile task
//#--------------------------

var relativePath, project;

gulp.task('html', cb => {
  const getDataProject = getDataJson('./project.json');
  var htmlOptions = {
    indent_size: 0
  };
  gulp.src([
    'src/pug/**/*.pug',
    '!src/pug/**/_*.pug'
  ])
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    }))
    .pipe($.data(function(file) {
      relativePath = path.relative(file.base, file.path.replace(/.pug$/, '.html'));
        return project;
    }))
    .pipe($.pug({
      pretty: true,
      basedir: path.resolve(__dirname, 'src/pug/'),
      data: {
        relativePath: relativePath,
        project: getDataProject
      },
    }))
    .pipe($.lineEndingCorrector(lineOptions))
    .pipe($.htmlBeautify(htmlOptions))
    .pipe(gulp.dest('dist/'))
    .pipe($.htmlhint('htmlhintrc.json'))
    .pipe($.htmlhint.failReporter())
    .pipe(runPipeCallBack(cb));
});


//#--------------------------
//# css compile task
//#--------------------------

const sassOptions = {
  style: 'expanded',
  includePaths: 'src/scss'
};

gulp.task('css', cb => {
  gulp.src([
      'src/scss/**/*.scss'
    ])
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    }))
    .pipe($.sass(sassOptions))
    .pipe($.autoprefixer({
      grid: true
    }))
    .pipe($.csscomb('./csscomb.json'))
    .pipe($.groupCssMediaQueries())
    .pipe($.cssbeautify({
      indent: "\t",
      openbrace: 'end-of-line',
      autosemicolon: true
    }))
    .pipe($.replace(/(;\n)\n/g, '$1'))
    .pipe($.replace(/(\*\/\n)(\/\*)/g, '$1\n$2'))
    .pipe($.lineEndingCorrector(lineOptions))
    .pipe(gulp.dest('dist/assets/css/'))
    .pipe(runPipeCallBack(cb));
});


//#--------------------------
//# js task
//#--------------------------

gulp.task('js', cb => {
  gulp.src([
    'src/js/modules/*.js',
    'src/js/app.js'
  ])
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    }))
    .pipe($.concat('app.bundle.js'))
    .pipe($.lineEndingCorrector(lineOptions))
    .pipe(gulp.dest('dist/assets/js/'))
    .pipe(runPipeCallBack(cb));
});


//#--------------------------
//# imagemin task
//#--------------------------

gulp.task('imagemin', cb => {
  gulp.src('src/img/**/*.+(jpg|jpeg|png)')
    .pipe($.imagemin([
      $.imageminPng(),
      $.imageminJpg()
    ]))
    .pipe(gulp.dest('dist/assets/images/'))
    .pipe(runPipeCallBack(cb));
});


//#--------------------------
//# server task
//#--------------------------

gulp.task('serve', cb => {
  $.browserSync.init({
    server: {
      baseDir: 'dist/'
    },
    startPath: 'index.html',
    open: 'external'
  }, cb());
});

gulp.task('srcWatch', cb => {
  gulp.watch(
    [
      'project.json',
      'src/pug/**/*.pug'
    ],
    gulp.series(['html', 'reload'])
  );
  gulp.watch(
    [
      'src/js/**/*.js'
    ],
    gulp.series(['js', 'reload'])
  );
  gulp.watch(
    [
      'src/scss/**/*.scss'
    ],
    gulp.series(['css', 'reload'])
  );
  gulp.watch(
    [
      'src/libs/css/**/*.css',
      'src/libs/js/**/*.js'
    ],
    gulp.series(['libs', 'reload'])
  );
  gulp.watch(
    [
      'src/img/**/*.+(jpg|jpeg|png)'
    ],
    gulp.series(['imagemin', 'reload'])
  );
  cb();
});

gulp.task('reload', cb => {
  if ($.browserSync.active) {
    $.browserSync.reload();
  }
  cb();
});

//# buildタスク
const buildTasks = [
  'libs',
  'html',
  'css',
  'js',
  'imagemin'
];

gulp.task('build', gulp.parallel(buildTasks));

gulp.task('default',
  gulp.series(
    gulp.parallel(buildTasks),
    gulp.series(['serve', 'srcWatch'])
  )
);
