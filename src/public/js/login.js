const user = document.getElementById('user')
const pass = document.getElementById('pass')
const error = document.querySelector('p')

function set_cookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";secure;path=/";
}

function register() {
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: user.value,
      pass: pass.value
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message && !data.token) {
        error.innerText = data.message
      } else {
        set_cookie('token', data.token, 31)
        window.location = '/'
      }
    })
}

document.querySelector('button').onclick = register

user.addEventListener('keydown', e => {
  if (e.key == 'Enter') {
    user.blur()
    pass.focus()
  }
})

pass.addEventListener('keydown', e => {
  if (e.key == 'Enter') {
    register()
  }
})