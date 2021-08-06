const ss = require('string-similarity')

function search(q, db) {
  const packages = Object.keys(db.get('packages'))
  const best_match = ss.findBestMatch(
    q || '', 
    packages
  )

  return best_match.ratings.sort((a, b) => {
    return a.rating + b.rating
  }).filter(rating => rating.rating > 0.6)
    .map(rating => {
      let resp = db.get(`packages/${rating.target}`)
      return { name: resp.name, 
        desc: resp.desc,
        version: resp.versions[resp.versions.length - 1],
        author: resp.author } })
}

function stats(db) {
  return {
    packages: Object.keys(db.get('packages')).length,
    downloads: Object.values(db.get('packages'))
      .reduce((acc, curr) => acc + curr.downloads, 0),
    users: Object.keys(db.get('users')).length,
  }
}

module.exports = {
  search,
  stats
}