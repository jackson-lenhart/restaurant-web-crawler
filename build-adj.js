"use strict";

const cheerio = require("cheerio");
const fetch = require("node-fetch");

async function buildAdj(Adj, root, directory = "/") {
  if (Adj[directory]) {
    return;
  }
  let res = await fetch(root + directory);
  let content = await res.text();
  let domTree = cheerio.load(content);
  let vertices = {};
  let re = /^\//;
  let as = domTree("a");
  for (let i = 0; i < as.length; i++) {
    let href = as[i].attribs.href;
    if (re.test(href) && !vertices[href]) {
      vertices[href] = true;
    }
  }
  Adj[directory] = vertices;
  for (let k in vertices) {
    await buildAdj(Adj, root, k);
  }
}

module.exports = buildAdj;
