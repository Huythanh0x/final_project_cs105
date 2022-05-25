import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import {TransformControls} from "./assets/lib/TransformControls.js";
// import {GLTFLoader} from "./assets/lib/GLTFLoader.js"



function animate() {
    requestAnimationFrame(animate)
    torus.rotation.x += 0.03
    torus.rotation.y += 0.005
    torus.rotation.z += 0.01
    moon.rotation.x += 0.02
    moon.rotation.y += 0.01
    // cube.rotation.x += 0.02
    // cube.rotation.y += 0.05
    // cube.rotation.z += 0.01
    controls.update()
    renderer.render(scene, camera)
}


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#background"),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.setZ(30)



//! add light
const pointLight = new THREE.PointLight(0xFFFFFF)
pointLight.position.set(55, 55, 55)
const ambientLight = new THREE.AmbientLight(0xFFFFFF)
scene.add(pointLight, ambientLight)

// ! add light and gravitator
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)
const controls = new OrbitControls(camera, renderer.domElement)

// ! texture
const spaceTexture = new THREE.TextureLoader().load('texture/space.jpg')
const leafTexture = new THREE.TextureLoader().load('texture/leaf.png')
const normalTexture = new THREE.TextureLoader().load('texture/normal.jpg')
const waterTexture = new THREE.TextureLoader().load('texture/water.jpg')
// scene.background = spaceTexture

// addMoon
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
        map: leafTexture,
        normalMap: normalTexture,
    })
);
scene.add(moon)

// addCube
// const boxGeometry = new THREE.BoxGeometry( 10, 10, 10 );
// const boxMaterial = new THREE.MeshBasicMaterial( {map:waterTexture} );
// const cube = new THREE.Mesh( boxGeometry, boxMaterial );
// scene.add( cube );    

// addTorus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({
    // color: 0x1c4bf6,
    // map: waterTexture
})
const torus = new THREE.Mesh(geometry, material)

torus.material.map = waterTexture
scene.add(torus)

animate()