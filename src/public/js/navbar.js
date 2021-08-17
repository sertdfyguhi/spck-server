function get_cookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null
}

const navbar_code = `<nav><ul><li style="float: left;"><a href="/"><h1>spck</h1></a></li>${get_cookie('token')===null?'<li><a href="/register">register</a></li><li><a href="/login">login</a></li>':'<li><a href="/logout">logout</a></li>'}<li><input type="text" class="search" id="search-bar-1" placeholder="Search packages"></li></ul</nav>`

document.getElementById('navbar').innerHTML = navbar_code

const inp = document.getElementById('search-bar-1')
inp.addEventListener('keydown', e => {
  if (e.key == 'Enter') {
    window.location = `/search?q=${encodeURIComponent(inp.value)}`
  }
})