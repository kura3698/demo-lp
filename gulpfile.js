//* ===============================================
//# 静的サイト対応Gulp
//ver.2.2
//date:20250525
//=============================================== *//
import fs from "fs";
import path from "path";
import gulp from "gulp";
import browserSync from "browser-sync";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssSorter from "css-declaration-sorter";
import cleanCSS from "gulp-clean-css";
import uglify from "gulp-uglify";
import mergeRules from "postcss-merge-rules";
import watch from "gulp-watch";

const sass = gulpSass(dartSass);
const browserSyncInstance = browserSync.create();

//* ===============================================
//#Sassフォルダ構成に合わせて変更
//=============================================== *//
const scssDirs = ["layout", "components", "pages", "common", "utility"];
const baseDir = "./src/assets/sass/";

//* ===============================================
//# 共通のエラーハンドラ
//=============================================== *//
function errorHandler(err) {
  console.error(err.message);
  process.exit(1);
}

//* ===============================================
//# Sassのパーシャルファイル自動生成
//=============================================== *//
function generateIndexScss(done) {
  scssDirs.forEach((dir) => {
    const fullPath = path.join(baseDir, dir);
    if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
      const files = fs
        .readdirSync(fullPath)
        .filter((file) => file.endsWith(".scss") && file !== "index.scss");
      const importStatements = files
        .map((file) => `@use "${file.replace(".scss", "")}";`)
        .join("\n");
      fs.writeFileSync(
        path.join(fullPath, "index.scss"),
        `/* Auto-generated index.scss for ${dir} */\n${importStatements}`,
      );
    }
  });
  done();
}

//* ===============================================
//# Sass→CSS変換
//=============================================== *//
function compileSass() {
  return gulp
    .src(path.join(baseDir, "style.scss"), { base: baseDir })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "Sass Error",
          message: "Error: <%= error.message %>",
        }),
      }),
    )
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssSorter(), mergeRules()]))
    .pipe(cleanCSS())
    .pipe(gulp.dest("./css/"))
    .pipe(browserSyncInstance.stream())
    .pipe(
      notify({
        message: "Sassをコンパイルして圧縮しました！",
      }),
    );
}

//* ===============================================
//# JSコピー＋圧縮（ES Modules: parts フォルダ構造を維持）
//=============================================== *//
function formatJS() {
  return gulp
    .src("./src/assets/js/**/*.js", { base: "./src/assets/js" })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "JS Error",
          message: "Error: <%= error.message %>",
        }),
      }),
    )
    .pipe(uglify())
    .pipe(gulp.dest("./js/"))
    .pipe(browserSyncInstance.stream())
    .pipe(
      notify({
        message: "スクリプトをコンパイルして圧縮しました！",
      }),
    );
}

// //* ===============================================
// //# 画像コピー（Figma側で圧縮済み → 変換・圧縮なし）
// // src/assets/img → img/
// //=============================================== *//
// function copyImage() {
//   return gulp
//     .src("./src/assets/img/**/*", {
//       base: "./src/assets/img",
//       encoding: false,
//     })
//     .pipe(
//       plumber({
//         errorHandler: notify.onError({
//           title: "Image Error",
//           message: "Error: <%= error.message %>",
//         }),
//       })
//     )
//     .pipe(gulp.dest("./img/"))
//     .pipe(browserSyncInstance.stream())
//     .pipe(
//       notify({
//         message: "画像を img/ にコピーしました！",
//       })
//     );
// }

//* ===============================================
//# 各フォルダの監視
//=============================================== *//
function watchFiles() {
  watch(
    [baseDir + "**/*.scss", "!" + baseDir + "**/index.scss"],
    gulp.series(generateIndexScss, compileSass),
  );
  watch("./src/assets/js/**/*.js", gulp.series(formatJS));
  // watch("./src/assets/img/**/*", gulp.series(copyImage));
  watch("./**/*.html").on("change", browserSyncInstance.reload);
}

//* ===============================================
//# ブラウザ監視
//=============================================== *//
function browserInit(done) {
  browserSyncInstance.init({
    server: {
      baseDir: "./",
    },
    notify: false,
  });
  done();
}

export const generateIndexScssTask = generateIndexScss;
export const compileSassTask = compileSass;
export const watchTask = watchFiles;
export const browserInitTask = browserInit;
export const formatJSTask = formatJS;
export const copyImageTask = copyImage;

export const dev = gulp.series(
  generateIndexScss,
  gulp.parallel(browserInit, watchFiles),
);
export const build = gulp.series(
  generateIndexScss,
  gulp.parallel(formatJS, compileSass, copyImage),
);
