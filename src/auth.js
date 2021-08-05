const { SignJWT } = require('jose/jwt/sign')
const { jwtVerify } = require('jose/jwt/verify')
const { createSecretKey } = require('crypto')
const bcrypt = require('bcrypt')

function create_token(user, key) {
  const jwt = new SignJWT({ user: user })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(createSecretKey(key))

  return jwt
}

function get_user(token, key) {
  return jwtVerify(token, createSecretKey(key))
}

function check(sent_pass, pass) {
  return bcrypt.compare(sent_pass, pass)
}

function hash(pass) {
  return bcrypt.hash(pass, 13)
    .then(enc => {
      return enc
    })
}

module.exports = {
  get_user,
  create_token,
  check,
  hash
}