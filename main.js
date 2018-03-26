"use strict";

const fetch = require("node-fetch");
const cheerio = require("cheerio");

let url = "http://pizzapeddleranddeli.com";

async function buildAdj(Adj, root, directory = "/") {
  if (Adj[directory]) {
    return;
  }
  let res = await fetch(root + directory);
  let content = await res.text();
  let domTree = cheerio.load(content);
  let localHrefs = {};
  let re = /^\//;
  let as = domTree("a");
  for (let i = 0; i < as.length; i++) {
    let href = as[i].attribs.href;
    if (re.test(href) && !localHrefs.hasOwnProperty(href)) {
      localHrefs[href] = true;
    }
  }
  Adj[directory] = localHrefs;
  for (let k in localHrefs) {
    await buildAdj(Adj, root, k);
  }
}

async function visit(Adj, directory, memo) {
  let cd = Adj[directory];
  for (let k in cd) {
    if (!memo[k]) {
      let res = await fetch(url + directory);
      let content = await res.text();
      let domTree = cheerio.load(content);
      let title = domTree("title");
      console.log("Title:", title.text());
      memo[k] = true;
      await visit(Adj, k, memo);
    }
  }
}

async function depthFirstSearch(Adj) {
  let memo = {};
  await visit(Adj, "/", memo);
}

async function start() {
  let Adj = {};
  await buildAdj(Adj, url);
  console.log("ADJ:", Adj);

  await depthFirstSearch(Adj);
}

start();
