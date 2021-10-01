const express = require('express')
const rate_limit = require('express-rate-limit')
const cookie_parser = require('cookie-parser')
const Database = require('./db.js')
const helpers = require('./helpers.js')
const packages = require('./routes/packages.js')
const users = require('./routes/users.js')

const app = express()
const db = new Database('src/db.txt', true, process.env.KEY, { packages: {}, users: {} })
const PORT = 5000
const rate_limiter = new rate_limit({
  windowMs: 60000 * 60 * 24,
  max: 10,
  message: { message: 'You have been rate limited. Maximum 10 requests per day.' }
})

app.use(['/api/publish', '/api/register'], rate_limiter)
app.use(express.static('src/public'))
app.use(express.json())
app.use(cookie_parser())

app.set('view engine', 'ejs')
app.set('views', 'src/views')

db.log()

function handler(func) {
  return function(req, res) {
    func(req, res, db)
  }
}

app.get('/', (req, res) => {
  res.render('index', { stats: helpers.stats(db) })
})

app.get('/navbar', (req, res) => {
  res.render('navbar', { login: 'token' in (req.cookies || {}) })
})

app.get('/packages/:package', (req, res) => {
  const package = req.params.package
  const data = db.get(`packages/${package}`)

  res.render('package', {
    pkg: data || package,
    desc: JSON.stringify((data || {}).long_desc || '').slice(1, -1),
    homepage: JSON.stringify((data || {}).homepage || '').slice(1, -1)
  })
})

app.get('/search', (req, res) => {
  const q = typeof req.query.q == 'string' ? req.query.q : req.query.q[0]
  res.render('search', {
    packages: helpers.search(q, db),
    query: q
  })
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html')
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html')
})

app.get('/logout', (req, res) => {
  if (req.cookies.token) {
    res.cookie('token', '', { expires: new Date() })
  }
  res.redirect('/')
})

app.get('/api/stats', (req, res) => {
  res.status(200).send(helpers.stats(db))
})

app.get('/api/search', handler(packages.search))

app.post('/api/publish', handler(packages.publish))

app.get('/api/package/:pkg', handler(packages.get))

app.delete('/api/package/:pkg', handler(packages.delete_))

app.get('/api/package/:pkg/download', handler(packages.download))

app.post('/api/register', handler(users.register))

app.post('/api/login', handler(users.login))

app.get('/api/users/:user', handler(users.get))

app.delete('/api/users/:user', handler(users.delete_))

app.put('/api/users/:user', handler(users.update))

app.listen(PORT, console.log(`Listening on port ${PORT}`))
