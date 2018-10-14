'use strict';

const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function loadContent(url) {
  try {
    const res = await fetch(url);
    const content = await res.text();
    return cheerio.load(content);
  } catch (err) {
    console.error(err);
  }
}

function harvestHrefs(as, root) {
  const fileExtensionsToIgnore = ['.jpg', '.png', '.bmp', '.pdf', '.svg'];
  const hrefs = {};
  for (let i = 0; i < as.length; i++) {
    let href = as[i].attribs.href;
    if (!href) {
      continue;
    }

    if (isAbsolute(href)) {
      if (href.includes(root)) {
        href = href.replace(root, '');
        if (!href) {
          href = '/';
        }
      } else {
        continue;
      }

    // otherwise, its relative
    } else {
      if (href.indexOf('/') !== 0) {
        href = '/' + href;
      }
    }

    // remove trailing slash
    if (href !== '/' && href[href.length - 1] === '/') {
      href = href.slice(0, -1);
    }

    if (
      isFragment(href)
      || href.includes('tel:')
      || href.includes('mailto:')
      || href.includes('sms:')
    ) {
      continue;
    }

    if (fileExtensionsToIgnore.includes(href.slice(-4))) {
      continue;
    }

    if (!hrefs[href]) {
      hrefs[href] = true;
    }
  }

  return hrefs;
}

function isAbsolute(url) {
  return url.indexOf('http://') === 0
    || url.indexOf('https://') === 0
    || url.indexOf('//') === 0;
}

function isFragment(relativeUrl) {
  const indexOfHash = relativeUrl.indexOf('#');
  return indexOfHash === 0 || indexOfHash === 1;
}

module.exports = {
  loadContent,
  harvestHrefs
};
