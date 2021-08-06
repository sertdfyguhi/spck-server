const input = document.getElementById('search-bar-2')

input.addEventListener('keydown', e => {
  if (e.key == 'Enter') {
    window.location = `/search?q=${encodeURIComponent(input.value)}`
  }
})

document.getElementById('search-btn').onclick = () => {
  window.location = `/search?q=${encodeURIComponent(input.value)}`
}