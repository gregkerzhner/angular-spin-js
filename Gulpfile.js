var gulp = require('gulp'),
  connect = require('gulp-connect'),
  concat = require('gulp-concat'),
  vendor = require('gulp-concat-vendor'),
  gulpIgnore = require('gulp-ignore'),
  html2js = require('gulp-html2js'),
  sass = require('gulp-sass'),
  ngConstant = require('gulp-ng-constant')
  runSequence = require('run-sequence'),
  template = require('gulp-template'),
  awspublish = require('gulp-awspublish'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  shell = require('gulp-shell'),
  uglify = require('gulp-uglify'),
  ngAnnotate = require('gulp-ng-annotate'),
  cloudfront = require("gulp-cloudfront"),
  gzip = require('gulp-gzip'),
  run = require('gulp-run'),
  minifyCSS = require('gulp-minify-css'),
  protractor = require("gulp-protractor").protractor,
  karma = require('karma').server;


var vendorJs =  [
  
  'app/vendor/angular/angular.js',
  'app/vendor/angular-animate/angular-animate.js',
  'app/vendor/angular-cookies/angular-cookies.js',
  'app/vendor/angular-sanitize/angular-sanitize.js',
  
  'app/vendor/underscore/underscore.js',
  'app/vendor/spin.js/spin.js'
  
  ];

var vendorStyles = [
    
  ];

var otherAssets = [
    './app/fonts/**/*.*',
    './app/images/**/*.*'   
  ]


var rand = parseInt(Math.random()*10000000000000000).toString();

var config = function(src) {
  return gulp.src(src)
    .pipe(ngConstant())
    .pipe(rename(function (path) {
      path.basename = 'config'
    }))
    .pipe(gulp.dest('app/scripts'));

}

gulp.task('config-development', function () {
  return config('app/scripts/config/config-development.json')
});

gulp.task('config-staging', function () {
  return config('app/scripts/config/config-staging.json')
});


gulp.task('config-production', function () {
  return config('app/scripts/config/config-production.json')
});

gulp.task('webserver', function() {
  connect.server({
    root: 'development',
    port: 9000
  });
});


gulp.task('webserver-build', function() {
  connect.server({
    root: 'build',
    port: 9000
  });
});

gulp.task('build-js', function(){
  return gulp.src([ 'development/vendor-scripts.js', 'development/templates.js', 'development/app-scripts.js' ])
    .pipe(concat('scripts.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename = rand+path.basename;
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('build-unconcat-js', function(){
  return gulp.src(['development/templates.js', 'development/app-scripts.js' ])
    .pipe(concat('angular-spinner.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('build-unconcat-styles', function(){
  return gulp.src(['development/styles/app-styles.css'])
    .pipe(concat('angular-spinner.css'))
    .pipe(gulp.dest('build'))
});



var styles = function(outName, outPath){
  return gulp.src(['development/styles/vendor-styles.css', 'development/styles/app-styles.css'])
    .pipe(concat(outName))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(rename(function (path) {
      path.basename = rand+path.basename;
    }))
    .pipe(gulp.dest(outPath))
}

var index = function(env, dest){
  return gulp.src('app/_index.html')
    .pipe(template({env: env, rand: rand}))
    .pipe(rename(function (path) {
      path.basename = path.basename.slice(1);
    }))
    .pipe(gulp.dest(dest));
}

var otherFiles = function(env){
  return gulp.src(otherAssets, { base: './app/' })
    .pipe(gulp.dest(env));
}

var cleanTask = function(src){
return gulp.src([src], {read:false})
  .pipe(clean());
}

gulp.task('build-styles', function() {
  return styles('styles.css', 'build/styles')
});

gulp.task('index-development', function () {
  return index("development", "development");
});

gulp.task('staging-index', function() {
  return index("staging", 'build');
});

gulp.task('production-index', function() {
  return index("production", "build");
});

gulp.task('build-other-files', function() {
  return otherFiles('build');
});

gulp.task('staging', function() {
  runSequence('clean', 'config-staging','appScripts', 'vendorScripts', 'vendorStyles', 'appStyles','templates','build-js', 'build-styles', 'staging-index','build-other-files',  function() {
  
  });
});

gulp.task('production', function() {
  runSequence('clean', 'config-production','appScripts', 'vendorScripts', 'vendorStyles', 'appStyles','templates','build-js', 'build-styles', 'production-index','build-other-files', function() {  
  });
});


gulp.task('build', function() {
  runSequence('clean', 'config-production','appScripts', 'vendorScripts', 'vendorStyles', 'appStyles','templates','build-unconcat-js', 'build-unconcat-styles', 'build-other-files', function() {  
  });
});


gulp.task('appScripts', function() {
  return gulp.src(['!app/scripts/**/*.test.js','app/scripts/**/*.js'])
    .pipe(concat('app-scripts.js'))
    .pipe(gulp.dest('development'))
});

gulp.task('vendorScripts', function() {
  return gulp.src(vendorJs)
  .pipe(concat('vendor-scripts.js'))
  .pipe(gulp.dest('development'));
});

gulp.task('vendorStyles', function(){
  return gulp.src(vendorStyles)
  .pipe(concat('vendor-styles.css'))
  .pipe(gulp.dest('development/styles'));
})

gulp.task('templates', function(){
  return gulp.src('app/scripts/**/*.tpl.html')
    .pipe(html2js({
      outputModuleName: 'angular-spinner.templates',
      useStrict: true,
      rename: function (moduleName) {
        //getting rid of prepended relative path
        return moduleName.substring(12)
      }
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('development'))
})

gulp.task('appStyles', function () {  
  return gulp.src('app/styles/**/*.scss')
    .pipe(sass({}))
    .pipe(concat('app-styles.css'))
    .pipe(gulp.dest('development/styles'))
});

gulp.task('move-development', function(){
  return gulp.src(otherAssets, { base: './app/' })
    .pipe(gulp.dest('development'));
});

gulp.task('clean-development', function(){
  return cleanTask('development/*');
});

gulp.task('clean-build', function(){
  return cleanTask('build/*')
});


gulp.task('clean', function(){
  return runSequence('clean-development','clean-build');
})

gulp.task('karma', function(done){

  gulp.src(['!app/scripts/**/*.test.js','app/scripts/**/*.js'])
    .pipe(concat('app-scripts.js'))
    .pipe(gulp.dest('development'))


  return karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
})

gulp.task('unit-test', function (done) {
  return runSequence('appScripts','karma');
});

gulp.task('protractor', function(){
  gulp.src(["./src/tests/*.js"])
    .pipe(protractor({
        configFile: "./protractor.conf.js",
        args: ['--baseUrl', 'http://127.0.0.1:9000']
    })) 
    .on('error', function(e) { console.log(e) })
});

gulp.task('e2e-test', function(){
  return runSequence('concat','protractor');
});

gulp.task('watch', function(){
  gulp.watch(['e2e/**/*.test.js'], ['e2e-test']);
  gulp.watch(['app/scripts/**/*.test.js'], ['karma']);
  gulp.watch(['app/scripts/**/*.js', '!app/scripts/**/*.test.js'], ['appScripts']);
  gulp.watch('app/scripts/**/*.tpl.html', ['templates']);
  gulp.watch('app/styles/**/*.scss', ['appStyles']);
  gulp.watch('app/_index.html', ['index-development']);
})



gulp.task('concat', function(){
  return runSequence('appScripts', 'vendorScripts', 'vendorStyles', 'appStyles','templates', function() {
    
  });
})


gulp.task('default', function(){
  runSequence('config-development','clean-development', 'webserver', 'index-development', 'concat', 'move-development', 'watch', function() {
  });
});
