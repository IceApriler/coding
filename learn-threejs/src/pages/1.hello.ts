import * as three from 'three'
import $ from 'jquery'

export default {
  init() {
    // 渲染器
    const renderer = new three.WebGLRenderer()
    renderer.setSize(400, 300)
    $('.container')[0].append(renderer.domElement)

    // 设置清除背景的背景色
    renderer.setClearColor(0x999999, 1.0)

    // 场景，相当于一个大容器。three.js中添加的物体都是添加到场景中的。
    const scene = new three.Scene()

    // 带有透视投影的照相机。
    const camera = new three.PerspectiveCamera(45, 4 / 3, 1, 1000)
    camera.position.set(0, 0, 5)
    scene.add(camera)

    // 立方体
    const cube = new three.Mesh(
      new three.BoxGeometry(1, 2, 3),
      new three.MeshBasicMaterial({
        color: 0xff0000
      })
    )
    scene.add(cube)
    
    // 渲染函数
    renderer.render(scene, camera) 
  }
}
