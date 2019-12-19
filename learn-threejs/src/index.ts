import * as three from 'three'

function init(): void {
  console.log('init')
  const renderer = new three.WebGLRenderer({
    canvas: document.getElementById('mainCanvas') as HTMLCanvasElement
  })
}
