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

    // remove fragments and ignore if we end up with empty string
    href = defragmentify(href);
    if (href === '') {
      continue;
    }

    // because 'www.' is for squares
    href = href.replace('www.', '');

    if (isRelative(href)) {
      if (href.indexOf('/') !== 0) {
        href = root + '/' + href;
      } else {
        href = root + href;
      }
    }

    // remove trailing slash if there is one
    if (href[href.length - 1] === '/') {
      href = href.slice(0, -1);
    }

    // hrefs we aint tryna mess with
    if (
      href.includes('tel:')
      || href.includes('mailto:')
      || href.includes('sms:')
      || /javascript: ?void/.test(href)
      || fileExtensionsToIgnore.includes(href.slice(-4))
      || href.indexOf(root) !== 0
    ) {
      continue;
    }

    if (!hrefs[href]) {
      hrefs[href] = true;
    }
  }

  return hrefs;
}

function isRelative(url) {
  return url.indexOf('http://') !== 0
    && url.indexOf('https://') !== 0
    && url.indexOf('//') !== 0;
}

function defragmentify(url) {
  const hashIndex = url.indexOf('#');
  if (hashIndex > -1) {
    return url.slice(0, hashIndex);
  } else {
    return url;
  }
}

module.exports = {
  loadContent,
  harvestHrefs
};
