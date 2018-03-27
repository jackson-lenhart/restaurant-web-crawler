"use strict";

const cheerio = require("cheerio");
const fetch = require("node-fetch");

async function depthFirstSearch(Adj, url, f) {
  let memo = {};
  await visit(Adj, url, memo, f);
}

async function visit(Adj, url, memo, f, directory = "/") {
  let cd = Adj[directory];
  for (let k in cd) {
    if (!memo[k]) {
      let res = await fetch(url + directory);
      let content = await res.text();
      let domTree = cheerio.load(content);
      f(domTree);
      memo[k] = true;
      await visit(Adj, url, memo, f, k);
    }
  }
}

module.exports = {
  visit,
  depthFirstSearch
};
