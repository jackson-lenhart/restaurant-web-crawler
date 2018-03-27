"use strict";

const MongoClient = require("mongodb").MongoClient;

const mongoUrl = require("./mongo-url");
const urls = require("./urls");
const buildAdj = require("./build-adj");
const {
  visit,
  depthFirstSearch
} = require("./depth-first-search");

(async function() {
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
    function logTitle(domTree) {
      let title = domTree("title").text();
      console.log("Title:", title);
    }
    await depthFirstSearch(Adj, x, logTitle);
  }
  client.close();
})();
