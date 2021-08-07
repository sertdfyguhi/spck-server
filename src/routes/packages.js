const fs = require('fs')
const sp = require('synchronized-promise')
const { make_tar, delete_pkg } = require('../pkg.js')
const helpers = require('../helpers.js')
const allow_chars_usr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
const forbidden_pkg_names = ['std', 'gamescene']

function get(req, res, db) {
  if (req.params.pkg in db.get('packages')) {
    let data = db.get(`packages/${req.params.pkg}`)
    delete data.token
    res.status(200).send(data)
  } else {
    res.status(404).send({ message: 'Package not found.' })
  }
}

function delete_(req, res, db) {
  const name = req.params.pkg.split('-')[0]
  const ver = req.params.pkg.split('-')[1]

  if (name in db.get('packages')) {
    const resp = delete_pkg(name, ver, db)
    res.status(resp[1]).send(resp[0])
  } else {
    res.status(404).send({ message: 'Package not found.' })
  }
}

function download(req, res, db) {
  const name = req.params.pkg.split('-')[0]
  
  if (name in db.get('packages')) {
    const versions = db.get(`packages/${name}/versions`)
    const ver = req.params.pkg.split('-')[1] || versions[versions.length - 1]

    if (!versions.includes(ver)) {
      res.status(404).send({ message: 'Version not found.' })
      return
    }

    db.set(
      `packages/${name}/downloads`,
      (db.get(`packages/${name}/downloads`) || 0) + 1)

    res.status(200).download(
      `${__dirname}/packages/${name}/${ver}.tar`, `${name}-${ver}.tar`
    )
  } else {
    res.status(404).send({ message: 'Package not found.' })
  }
}

function search(req, res, db) {
  const query = req.query.q
  if (query) {
    const matches = helpers.search(query, db)
    res.status(200).send(matches)
  } else {
    res.status(422).send({ message: 'Search query not provided.' })
  }
}

function publish(req, res, db) {
  if (req.body.token == (db.get(`packages/${req.body.name}/token`) || req.body.token)) {
    if (
        !(db.get(`packages/${req.body.name}/versions`) || []).includes(req.body.version)
      ) {
      const name = req.body.name,
        desc = req.body.desc,
        long_desc = req.body.long_desc || '',
        homepage = req.body.homepage || null,
        version = req.body.version,
        token = req.body.token,
        data = req.body.data
        
      let comb = {
          name, desc, long_desc, homepage, token,
          id: Object.keys(db.get('packages')).length + 1,
          versions: (db.get(`packages/${name}/versions`) || []).concat(version),
          downloads: (db.get(`packages/${name}/downloads`) || 0) };

      if (forbidden_pkg_names.includes(name)) {
        res.status(403).send({ message: 'Package name is forbidden to use.' })
      }

      try {
        const user = sp(auth.get_user)(token, process.env.KEY).payload.user
        if (user in db.get('users')) {
          comb['author'] = user
        } else {
          throw ''
        }
      } catch {
        res.status(404).send({ message: 'Token is invalid.' })
        return
      }

      if (!name.split('').every(c => allow_chars_usr.includes(c))) {
        res.status(403).send({ message: 'Package name must only include the alphabet and _.' })
        return }

      if (Object.values(comb).some(val => val === undefined)) {
        res.status(422).send({ message: 'Some required fields are not provided.' })
        return
      }

      if (!/\d.\d.\d/.test(version)) {
        res.status(422).send({ message: 'Package version is invalid.' })
        return
      }

      if (!fs.existsSync(`${__dirname}/packages/${name}`))
        fs.mkdirSync(`${__dirname}/packages/${name}`)

      if (
        comb.author != (db.get(`packages/${name}/author`) || comb.author)
      ) {
        res.status(409).send({ message: 'Author cannot be changed.' })
        return
      }

      db.set(`packages/${name}`, comb)

      const resp = make_tar(data, name, version)
      if (resp) {
        res.status(400).send(resp)
        return
      }

      res.status(200).send({ message: 'Published successfully!' })
    } else {
      res.status(409).send({ message: 'Package version already exists.' })
    }
  } else {
    res.status(403).send({ message: 'You cannot update this package.' })
  }
}

module.exports = {
  get,
  delete_,
  download,
  search,
  publish
}