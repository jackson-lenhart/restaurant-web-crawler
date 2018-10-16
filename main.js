'use strict';

const urls = require('./urls');
const { depthFirstSearch } = require('./depth-first-search');

(async function() {
  try {

    // intialize an empty array to store all the instances of ezcater
    const finds = [];
    for (const url of urls) {
      await depthFirstSearch(url, function(domTree, url, root) {
        const as = domTree('a');
        for (let i = 0; i < as.length; i++) {
          const href = as[i].attribs.href;
          if (href && href.includes('ezcater.com')) {
            console.log('Found link!');
            finds.push([href, url, root, new Date()]);
          }
        }
      });
    }
    console.log(finds);
  } catch (err) {
    console.error(err);
  }
})();
