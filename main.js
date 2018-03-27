"use strict";

const fetch = require("node-fetch");
const cheerio = require("cheerio");
const MongoClient = require("mongodb").MongoClient;
const mongoUrl = require("./mongo-url");
const urls = require("./urls");

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

async function visit(Adj, url, memo, directory = "/") {
  let cd = Adj[directory];
  for (let k in cd) {
    if (!memo[k]) {
      let res = await fetch(url + directory);
      let content = await res.text();
      let domTree = cheerio.load(content);
      let title = domTree("title");
      console.log("Title:", title.text());
      memo[k] = true;
      await visit(Adj, url, memo, k);
    }
  }
}

async function depthFirstSearch(Adj, url) {
  let memo = {};
  await visit(Adj, url, memo);
}

async function main() {
  let client = await MongoClient.connect(mongoUrl);
  let db = client.db("firstCluster");
  let AdjTable = db.collection("adjacencyLists");

  for (let x of urls) {
    let entry = await AdjTable.findOne({ url: x });
    let Adj = {};
    if (!entry) {
      await buildAdj(Adj, x);
      AdjTable.insertOne({
        url: x,
        Adj
      });
    } else {
      Adj = entry.Adj;
    }
    await depthFirstSearch(Adj, x);
  }
  client.close();
}

main();
