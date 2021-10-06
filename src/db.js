const { readFileSync, writeFileSync } = require('fs')

class Database {
  constructor(path, defaults = {}) {
    this._path = path

    try {
      this._json = JSON.parse(
        readFileSync(path).toString()
      )
    } catch(e) {
      this._json = defaults
    }

    process.on('SIGINT', () => this._write(this._json))
  }

  _write() {
    writeFileSync(
      this._path,
      JSON.stringify(this._json)
    )
    process.exit(130)
  }

  set(key, value) {
    if (key.split('/').length > 1) {
      let split = key.split('/')
      let node = this._json
      split.pop()
      for (const k of split) {
        if (!node[k]) node[k] = {}
        node = node[k]
      }

      node[key.split('/')[split.length]] = value
    } else {
      this._json[key] = value
    }
  }

  get(key) {
    if (key.split('/').length > 1) {
      let node = this._json
      for (const k of key.split('/')) {
        if (!node) return
        node = node[k]
      }

      return node
    } else {
      return this._json[key]
    }
  }

  delete(key) {
    if (key.split('/').length > 1) {
      const split = key.split('/')
      let node = this._json
      for (const k of split.slice(0, split.length - 1)) {
        if (!node) return
        node = node[k]
      }
      
      if (!node[split[split.length - 1]]) return
      delete node[split[split.length - 1]]
    } else {
      delete this._json[key]
    }
  }

  clear() {
    this._json = {}
  }

  log() {
    console.log(this._json)
  }
}

module.exports = Database