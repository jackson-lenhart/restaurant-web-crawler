"use strict";

function depthFirstSearch(Adj) {
  let memo = {};
  visit(Adj, memo, "a");
}

function visit(Adj, memo, v) {
  for (let x in Adj[v]) {
    if (!memo.hasOwnProperty(x)) {
      console.log(x);
      memo[x] = true;
      visit(Adj, memo, x);
    }
  }
}

let Adj = {
  a: {
    d: true,
    c: true
  },
  b: {
    a: true
  },
  c: {
    d: true,
    a: true
  },
  d: {
    b: true,
    a: true,
    c: true
  }
};

depthFirstSearch(Adj);
