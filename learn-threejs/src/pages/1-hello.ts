import * as three from 'three'

export default {
  init() {
    const renderer = new three.WebGLRenderer({
      canvas: document.getElementById('mainCanvas') as HTMLCanvasElement
    })
  }
}