const { exec } = require("child_process");

const wsUrlRegexp =
  /ws:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

/**
 * @typedef { import("puppeteer-core").Page } Page
 */

/**
 * Get it from:
 * 1) chrome://version
 * 2) Executable Path
 * */
const chromeHome =
  "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome";

const chromeParams =
  "--remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')\\";

const chromeLaunchCommand = `${chromeHome} ${chromeParams}`;

const runDebugChrome = () => {
  return new Promise((resolve) => {
    const run = exec(chromeLaunchCommand);

    const stream = run.stderr.on("data", (logs) => {
      const urlMatch = wsUrlRegexp.exec(logs);

      if (urlMatch) {
        resolve(urlMatch[0]);
        stream.destroy();
      }
    });
  });
};

module.exports = {
  runDebugChrome,
};
