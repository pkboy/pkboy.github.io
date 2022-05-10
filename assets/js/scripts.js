function toggleClick(evt) {
  const clickedElementParent = evt.target.parentNode;
  console.log(clickedElementParent)
  if(clickedElementParent.classList.contains('toggle-closed')) {
    clickedElementParent.classList.remove('toggle-closed')
    clickedElementParent.classList.add('toggle-open')
  } else {
    clickedElementParent.classList.remove('toggle-open')
    clickedElementParent.classList.add('toggle-closed')
  }
}

function addToggleListeners() {
  document.querySelectorAll('.toggle')
      .forEach(toggle => {
        toggle.classList.add('toggle-closed')
        toggle.addEventListener('click', this.toggleClick)
      })
}

document.addEventListener('DOMContentLoaded', function() {
  addToggleListeners()
})