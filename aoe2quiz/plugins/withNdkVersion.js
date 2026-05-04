const { withProjectBuildGradle } = require('@expo/config-plugins');

const NDK_VERSION = '27.1.12297006';

const withNdkVersion = (config) => {
  return withProjectBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents;

    if (/ndkVersion\s*=\s*["'][^"']+["']/.test(contents)) {
      contents = contents.replace(
        /ndkVersion\s*=\s*["'][^"']+["']/,
        `ndkVersion = "${NDK_VERSION}"`
      );
    } else if (/ext\s*\{/.test(contents)) {
      contents = contents.replace(
        /ext\s*\{/,
        `ext {\n        ndkVersion = "${NDK_VERSION}"`
      );
    } else {
      throw new Error(
        '[withNdkVersion] could not find an `ext { ... }` block or existing ndkVersion in android/build.gradle'
      );
    }

    cfg.modResults.contents = contents;
    return cfg;
  });
};

module.exports = withNdkVersion;
