import {strict as assert} from "assert";
import { env } from "process";

const $ = Symbol("TrieWordCount");

class Trie {
  constructor() {
    this.root = new Map();
  }

  insert(word) {
    let node = this.root;

    for (const c of word) {
      if (!node.has(c)) {
        node.set(c, new Map());
      }
      node = node.get(c);
    }

    if (node.has($)) {
      node.set($, node.get($) + 1);
    } else {
      node.set($, 1);
    }
  }

  most() {
    let most = null;
    let mostCount = 0;
    let node = this.root;

    const walk = (node, word) => {
      if (node.has($) && node.get($) > mostCount) {
        mostCount = node.get($);
        most = word;
      }
      node.forEach((child, c) => {
        if (c === $) return;
        walk(child, word + c);
      });
    };

    walk(this.root, "");
    return [most, mostCount];
  }
}

function randomWord(length) {
  let word = "";
  for (let i = 0; i < length; i++) {
    word += String.fromCharCode(Math.random() * 26 + "a".charCodeAt(0));
  }
  return word;
}

function testTrie() {
  console.log('test trie');

  const trie = new Trie();
  for (let i = 0; i < 1024; i++) {
    trie.insert(randomWord(4));
  }

  const [most, count] = trie.most();

  console.log({ most, count });
  console.log('ok');
}

if (env.MODE == 'debug') {
  testTrie();
}
