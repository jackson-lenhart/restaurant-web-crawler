'use strict';

const urls = require('./urls');
const { depthFirstSearch, visit } = require('./depth-first-search');

(async function() {
  for (let url of urls) {
    try {
      await depthFirstSearch(url, doesLinkToEzcater);
    } catch (err) {
      console.error(err);
    }
  }
})();

function doesLinkToEzcater(domTree, url) {
  const as = domTree('a');
  for (let i = 0; i < as.length; i++) {
    const href = as[i].attribs.href;
    if (href && href.includes('ezcater.com')) {
      console.log(`Found link: ${href} at ${url}`);
    }
  }
}
