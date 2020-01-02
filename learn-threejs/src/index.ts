import $ from 'jquery'
import router from './router'
function init(): void {
  const hashName = window.location.hash.replace('#', '')
  const routers = Object.keys(router)
  routers.forEach(name => {
    let className = ''
    if (hashName === name) {
      className = 'current'
      router[name].init()
    }
    $('.nav').append(`<a class="${className}" href="#${name}">${name}</a>`)
  })
  window.addEventListener('hashchange', () => {
    location.reload()
  })
}
$(init)