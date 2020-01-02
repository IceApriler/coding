import $ from 'jquery'
import hello from './pages/1-hello'
function init(): void {
  const hash = window.location.hash
  let page = null
  switch(hash) {
    default:
      page = hello
  }
  page.init()
}
$(init)