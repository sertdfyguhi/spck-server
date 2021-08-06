fetch('/navbar')
  .then(res => res.text())
  .then(data => {
    document.getElementById('navbar').innerHTML = data
    const inp = document.getElementById('search-bar-1')
    inp.addEventListener('keydown', e => {
      if (e.key == 'Enter') {
        window.location = `/search?q=${encodeURIComponent(inp.value)}`
      }
    })
  })