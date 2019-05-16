fork = require('promisify-child-process').fork;
delay = require('util').promisify(setTimeout);
fs = require('fs');
puppeteer = require('puppeteer-extra');
pluginStealth = require('puppeteer-extra-plugin-stealth');
data = require('./utils/data')
puppeteer.use(pluginStealth());
repl = require('repl');
chrono = require('chrono-node');
date = (...args) => chrono.parse(...args)[0]?.start?.date();
scheduleJob = require('node-schedule').scheduleJob;
cron = require('human-to-cron');

// Development options
CHROME_OPTIONS = {
  headless: false,
  userDataDir: './user_data',
  args: [
    "--remote-debugging-port=9222",
  ],
};

// set up puppeteer browser
(async () => {
  browser = await puppeteer.launch(CHROME_OPTIONS);
  browser.disconnect();
})();

scheduleJob(cron('once each 30 minutes'), async () => {
  // furaffinity scrape and notify the channel
  await fork('./plugins/furaffinity-scrape-submissions');
  await fork('./plugins/furaffinity-notify-discord-submissions', ["578494647182295041"]);
  await fork('./plugins/furaffinity-scrape-notes');
  await fork('./plugins/furaffinity-scrape-note-messages');
  await fork('./plugins/furaffinity-notify-discord-notes', ["578494098478989316"]);
});

scheduleJob(date('may 17 2019 8pm'), async () => {
  await fork('./plugins/ehentai-publish-gallery', ["1415162"]);
});

scheduleJob(date('may 18 2019 8am'), async () => {
  await fork('./plugins/arcanis-discord-bot', ["448281750565814293", "happy birthday <@403762807461511171>!! uwu"]);
});

scheduleJob(date('september 31 8am'), async () => {
  await fork('./plugins/arcanis-discord-bot', ["hahaluckyme#7952", "wake up pls"]);
});

repl.start({
  prompt: '> ',
  useGlobal: true,
});
// await Promise.resolve(123);
