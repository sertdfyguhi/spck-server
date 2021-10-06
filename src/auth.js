const { SignJWT } = require('jose/jwt/sign')
const { jwtVerify } = require('jose/jwt/verify')
const { createSecretKey } = require('crypto')
const { encrypt, decrypt } = require('aes256')
const bcrypt = require('bcrypt')

function create_token(user, key) {
  const jwt = new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .sign(createSecretKey(key))

  return jwt
}

async function get_user(token, key) {
  try {
    const res = await jwtVerify(token, createSecretKey(key))
    return (res.payload || {}).user
  } catch(e) {
    return null
  }
}

async function check(sent_pass, pass) {
  return await bcrypt.compare(sent_pass, decrypt(process.env.KEY, pass))
}

async function hash(pass) {
  return encrypt(process.env.KEY, await bcrypt.hash(pass, 13))
}

module.exports = {
  get_user,
  create_token,
  check,
  hash
}