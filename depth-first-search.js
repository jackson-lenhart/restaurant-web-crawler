'use strict';

const { loadContent, harvestHrefs } = require('./web-utils');

async function depthFirstSearch(root, f) {
  console.log(`\n\nCrawling ${root}.......`);
  const visited = {};
  try {
    await visit(root, visited, f, { [root]: true });
  } catch (err) {
    console.error(err);
  }
}

async function visit(root, visited, f, vs) {
  for (const url in vs) {
    if (!visited[url]) {
      try {
        const domTree = await loadContent(url);
        f(domTree, url, root);
        visited[url] = true;
        const as = domTree('a');
        const verticesToVisit = harvestHrefs(as, root);
        await visit(root, visited, f, verticesToVisit);
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
