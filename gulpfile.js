// Пути
let projectFolder = "dist";
let sourceFolder = "src";
let path = {
	build: {
		html: projectFolder + "/",
		css: projectFolder + "/css/",
		js: projectFolder + "/js/",
		img: {
			defImg: projectFolder + "/img/",
			svg: projectFolder + "/img/svg",
		},
		fonts: projectFolder + "/fonts/",
	},
	src: {
		html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
		css: sourceFolder + "/scss/style.scss",
		js: sourceFolder + "/js/script.js",
		img: {
			defImg: sourceFolder + "/img/**/*.{png,jpg,gif,ico,webp,svg}",
		},
		fonts: sourceFolder + "/fonts/*.ttf",
	},
	watch: {
		html: sourceFolder + "/**/*.html",
		css: sourceFolder + "/scss/**/*.scss",
		js: sourceFolder + "/js/**/*.js",
		img: {
			defImg: sourceFolder + "/img/**/*.{png,jpg,gif,ico,webp}",
			svg: sourceFolder + "/img/**/*.svg"
		},
	},
	clean: "./" + projectFolder + "/"
};

// Функции из gulp
const {
	src,
	dest,
	parallel,
	series,
} = require('gulp');

// Модули-функции
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const del = require('del');
const imageMin = require('gulp-image');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const uglify = require('gulp-uglify-es').default;


// *Функции-обработчики

// Обновление браузера
const browserRefresh = () => {
	browserSync.init({
		server: {
			baseDir: "./" + projectFolder + "/"
		},
		port: 3000,
		notify: false,
	});
};

// Обаботка html
const html = () => {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browserSync.stream());
};

// Обработка стилей
const styles = () => {
	return src(path.src.css)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', notify.onError()))
		.pipe(rename({
			extname: ".min.css"
		}))
		.pipe(autoprefixer({
			cascade: true,
		}))
		.pipe(cleanCss())
		.pipe(sourcemaps.write("."))
		.pipe(dest(path.build.css))
		.pipe(browserSync.stream());
};

// Сжатие и переименование js
const js = () => {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(uglify())
		.pipe(rename({
			extname: ".min.js"
		}))
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
};

// Сжатие и переброс картинок
const images = () => {
	return src(path.src.img.defImg)
		.pipe(imageMin({
			concurrent: 50,
		}))
		.pipe(dest(path.build.img.defImg))
		.pipe(browserSync.stream());
};

// Конвертирование шрифтов в woff&woff2 и перенос
const fonts = () => {
	src(path.src.fonts)
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
		.pipe(browserSync.stream());
};

// Слежка за изменениями в файлах
const watchFiles = () => {
	gulp.watch(path.watch.css, styles);
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.img.defImg, images);
	gulp.watch(path.watch.js, js);
};

// Удаление папки dist
const clean = () => {
	return del(path.clean);
};

// Порядок запуска (series - запускает по порядку, parallel - парралельно)
let build = series(clean, parallel(html, styles, js, images, fonts));
let watch = parallel(build, watchFiles, browserRefresh);

// Создание тасков (exports.имяТАСКА = функция которая отвечает за этот таск)
exports.default = watch;