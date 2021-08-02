const { readFileSync, writeFileSync } = require('fs')
const { encrypt, decrypt } = require('aes256')

class Database {
  constructor(path, enc = false, key = null, defaults = {}) {
    let json = readFileSync(path).toString()
    try {
      if (enc) json = decrypt(key, json)
    } catch {}

    this._path = path
    this._enc = enc
    this._key = key

    try {
      this._json = JSON.parse(json)
    } catch(e) {
      this._json = defaults
    }
  }

  _write() {
    let data = JSON.stringify(this._json)

    if (this._enc) data = encrypt(this._key, data)
    writeFileSync(this._path, data)
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
    this._write()
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
    this._write()
  }

  clear() {
    this._json = {}
    this._write()
  }

  log() {
    console.log(this._json)
  }
}

module.exports = Database