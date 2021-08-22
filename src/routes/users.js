const auth = require('../auth.js')
const { delete_pkg } = require('../pkg.js')
const allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
const allow_chars_usr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'

function get(req, res, db) {
  const user = req.params.user

  let data = db.get(`users/${user}`)
  if (data) {
    delete data.pass
    res.status(200).send(data)
  } else {
    res.status(404).send({ message: 'User not found.' })
  }
}

function delete_(req, res, db) {
  const user = req.params.user
  const pass = req.body.pass

  if (!(user in db.get('users'))) {
    return res.status(404).send({ message: 'User not found.' })
  }

  if (!pass) {
    return res.status(422).send({ message: 'Password not provided.' })
  }

  auth.check(pass, db.get(`users/${user}/pass`))
    .then(corr => {
      if (corr) {
        (db.get(`users/${user}/packages`) || []).forEach(package => {
          delete_pkg(package, db)
        })
        db.delete(`users/${user}`)
        res.status(200).send({ message: 'User successfully deleted.' })
      } else {
        res.status(401).send({ message: 'Incorrect password.' })
      }
    })
}

function login(req, res, db) {
  const user = req.body.user
  const pass = req.body.pass

  if (user && pass) {
    if (user in db.get('users')) {
      auth.check(pass, db.get(`users/${user}/pass`))
        .then(correct => {
          if (correct) {
            auth.create_token(user, process.env.KEY)
              .then(jwt => {
                res.status(200).send({ message: 'Login successful.', token: jwt })
              })
          } else {
            res.status(401).send({ message: 'Incorrect username or password.' })
          }
        })
    } else {
      res.status(401).send({ message: 'Incorrect username or password.' })
    }
  } else {
    res.status(422).send({ message: 'User or password is not provided.' })
  }
}

function register(req, res, db) {
  const user = req.body.user
  const pass = req.body.pass

  if (user && pass) {
    if (user in db.get('users')) {
      return res.status(409).send({ message: 'User already exists.' })
    }

    if (user.length < 1 || user.length > 25) {
      return res.status(422).send({
        message: 'Username must be at least 1 characters and at most 25 characters.'
      })
    }
    if (!user.split('').every(c => allow_chars_usr.includes(c))) {
      return res.status(422).send({
        message: 'Username must only include the alphabet and _.'
      })
    }

    if (pass.length < 3 || pass.length > 30) {
      return res.status(422).send({
        message: 'Password must be at least 3 characters and at most 30 characters.'
      })
    }
    if (!pass.split('').every(c => allowed_chars.includes(c))) {
      return res.status(422).send({
        message: 'Password must only include the alphabet, digits and _.'
      })
    }

    let json = {
      id: Object.keys(db.get('users')).length + 1
    }
    
    auth.hash(pass)
      .then(hash => {
        json.pass = hash
        db.set(`users/${user}`, json)
      })
    
    auth.create_token(user, process.env.KEY)
      .then(jwt => {
        res.status(200).send({ message: 'User registered successfully!', token: jwt })
      })
  } else {
    res.status(422).send({
      message: 'Username or password is empty or not provided.'
    })
  }
}

function update(req, res, db) {
  const user = req.params.user
  const new_pass = req.body.new_pass
  const old_pass = req.body.old_pass

  if (!(user in db.get('users')))
    return res.status(404).send({ message: 'User not found.' })

  if (new_pass && old_pass) {
    auth.check(old_pass, db.get(`users/${user}/pass`))
      .then(async corr => {
        if (corr) {
          db.set(`users/${user}/pass`, await auth.hash(new_pass))
          res.status(200).send({ message: 'Successfully changed passwords.' })
        } else {
          res.status(401).send({ message: 'Incorrect password.' })
        }
      })
  } else {
    return res.status(422).send({ message: 'Required arguments not provided.' })
  }
}

module.exports = {
  get,
  delete_,
  login,
  register,
  update
}