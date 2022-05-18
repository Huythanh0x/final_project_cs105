import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#background"),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.setZ(30)

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)

// const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true })

const material = new THREE.MeshStandardMaterial({ color: 0xFF6347})

//! add light
const pointLight = new THREE.PointLight(0xFFFFFF)
pointLight.position.set(55,55,55)
const ambientLight = new THREE.AmbientLight(0x00FF55)
scene.add(pointLight,ambientLight)

// ! add light and gravitator
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper,gridHelper)

const torus = new THREE.Mesh(geometry, material)
scene.add(torus)

const controls = new OrbitControls(camera,renderer.domElement)

function animate(){
    requestAnimationFrame(animate)
    torus.rotation.x += 0.03
    torus.rotation.y += 0.005
    torus.rotation.z += 0.01
    controls.update()
    renderer.render(scene,camera)
}

animate()