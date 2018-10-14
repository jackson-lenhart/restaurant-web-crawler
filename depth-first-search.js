'use strict';

const { loadContent, harvestHrefs } = require('./web-utils');

async function depthFirstSearch(root, f) {
  console.log(`\n\nCrawling ${root}.......`);
  const memo = {};
  try {
    await visit(root, memo, f, { '/': true });
  } catch (err) {
    console.error(err);
  }
}

async function visit(root, memo, f, vs) {
  for (let k in vs) {
    if (!memo[k]) {
      try {
        const url = root + k;
        const domTree = await loadContent(url);
        f(domTree, url);
        memo[k] = true;
        const as = domTree('a');
        const verticesToVisit = harvestHrefs(as, root);
        await visit(root, memo, f, verticesToVisit);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports = {
  visit,
  depthFirstSearch
};
