#! /usr/bin/env node
const fs = require('fs');
const translate = require('translation-google');
// const translate = require('translate-google');

let writeTranslations = (localePath, data) => {
  fs.writeFile(localePath, JSON.stringify(data), err => {
    if (err) throw err;
  });
};

let generateTranslation = () => {
  let locales = fs.readdirSync('./src/locales');

  locales.map(locale => {
    if (locale !== '_build' && locale !== 'en') {
      let localePath = './src/locales/' + locale + '/' + 'messages.json';
      let data = JSON.parse(fs.readFileSync(localePath));
      let translatedData = data;
      let keys = Object.keys(data);

      keys.forEach((text, index) => {
        translate(text, { from: 'en', to: locale })
          .then(res => {
            translatedData[text] = res.text;

            // if (res.text.length === 0) {
            // }
            if (index === keys.length - 1) {
              writeTranslations(localePath, translatedData);
            }
          })
          .catch(_err => {});
      });
    }
  });
};

generateTranslation();
