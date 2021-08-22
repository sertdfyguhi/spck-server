const archiver = require('archiver')
const fs = require('fs')
const rimraf = require('rimraf')

function make_tar(data, name, ver) {
  const archive = archiver('tar')
  const output = fs.createWriteStream(`src/packages/${name}/${ver}.tar`)

  archive.pipe(output)
  for (const fn in data) {
    if (typeof fn == 'string') {
      archive.append(data[fn], { name: fn })
    } else {
      return { message: 'Invalid data.' }
    }
  }
  archive.finalize()
}

function delete_pkg(name, db, ver=null) {
  if (ver) {
    const path = `src/packages/${name}/${ver}.tar`
    if (fs.existsSync(path)) {
      fs.unlinkSync(path)

      let versions = db.get(`packages/${name}/versions`)
      const i = versions.indexOf(ver)

      versions.splice(i, 1)
      if (versions.length == 0) {
        fs.rmdirSync(`src/packages/${name}`)
        db.delete(`packages/${name}`)
      } else {
        db.set(`packages/${name}/versions`, versions)
      }
    } else {
      return [{ message: 'Version not found.' }, 404]
    }
  } else {
    db.delete(`packages/${name}`)
    rimraf(`src/packages/${name}`, (e) => {
      if (e) {
        console.error(e)
      }
    })
  }

  return [{ message: 'Package deleted successfully.' }, 200]
}

module.exports = {
  make_tar,
  delete_pkg
}