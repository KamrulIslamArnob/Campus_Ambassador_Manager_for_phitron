class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.originalWord = null;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.originalWord = word;
  }

  searchPrefix(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    return this._collectAllWords(node);
  }

  _collectAllWords(node) {
    let results = [];
    if (node.isEndOfWord && node.originalWord) results.push(node.originalWord);
    for (const char in node.children) {
      results = results.concat(this._collectAllWords(node.children[char]));
    }
    return results;
  }
}

module.exports = Trie; 
