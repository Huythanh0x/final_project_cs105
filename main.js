import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
let animationType = 0
let currentChange = "null"

function animate() {
    requestAnimationFrame(animate)
    if (animationType == 1) {
        mesh.rotation.x = Date.now() * 0.002
        mesh.rotation.y = Date.now() * 0.005
        mesh.rotation.z = Date.now() * 0.001
    } else if (animationType == 2) {
        mesh.rotation.x = Date.now() * 0.002
        mesh.position.y = (Math.sin(Date.now() * 0.002) + 1) * 10;
        mesh.rotation.z = Date.now() * 0.002
    } else if (animationType == 3) {
        mesh.rotation.x = Date.now() * 0.001
        mesh.position.x = (Math.cos(Date.now() * 0.002) + 0) * 10
    }
    controls.update()
    renderer.render(scene, camera)
}

function handleClickInListButton(type) {
    type = "img." + type
    let changeList = document.querySelectorAll(type)
    changeList.forEach(addChange => {
        addChange.addEventListener("click", e => {
            changeList.forEach(removeChange => {
                removeChange.classList.remove("active")
            })
            addChange.classList.add("active")
            currentChange = addChange.getAttribute("name")
            if (type.includes("geometry")) {
                updateMesh(addChange.getAttribute("name"))
            }
            if (type.includes("material")) {
                updateMaterial(addChange.getAttribute("name"))
            }
            if (type.includes("animation")) {
                updateAnimation(addChange.getAttribute("name"))
            }
            if (type.includes("change")) {
                updateTransformControles(addChange.getAttribute("name"))
            } if(type.includes("light_switch")){
                updateLight(addChange.getAttribute('name'))
            }
        })
    })
}

function updateAnimation(animationName) {
    switch (animationName) {
        case "0":
            animationType = 0
            break
        case "1":
            animationType = 1
            break
        case "2":
            animationType = 2
            break
        case "3":
            animationType = 3
            break
        default:
            animationName = 0
            break
    }
}

function updateTransformControles(controlType) {
    transformControls.detach(mesh)
    transformControls.detach(pointLight)
    switch (controlType) {
        case "translate":
            transformControls.attach(mesh)
            transformControls.setMode("translate")
            break
        case "rotate":
            transformControls.attach(mesh)
            transformControls.setMode("rotate")
            break
        case "expand":
            transformControls.attach(mesh)
            transformControls.setMode("scale")
            break
        case "light_translate":
            transformControls.attach(pointLight)
            transformControls.setMode("translate")
            break
        default:
            break
    }
    scene.add(transformControls)
}

function updateMaterial(materialName) {
    resetActiveButton("change")
    updateTransformControles(currentChange)
    if (!materialName.includes("point") && !materialName.includes("line") && !materialName.includes("solid")) {
        materialName = "texture/" + materialName + ".jpg"
        let texture = new THREE.TextureLoader().load(materialName)
        material = new THREE.MeshBasicMaterial({ map: texture })
        mesh = new THREE.Mesh(geometry, material)
    } else if (materialName.includes("point")) {
        material = new THREE.PointsMaterial({ size: 0.2 });
        mesh = new THREE.Points(geometry, material);
    } else if (materialName.includes("line")) {
        material = new THREE.LineBasicMaterial({});
        mesh = new THREE.Line(geometry, material);
    } else if (materialName.includes("solid")) {
        material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        mesh = new THREE.Mesh(geometry, material)
    }
    scene.remove(scene.getObjectByName("geometry"))
    mesh.name = "geometry"
    mesh.castShadow = true
    scene.add(mesh)
}

function updateMesh(geometryName) {
    resetAll()
    scene.remove(scene.getObjectByName("geometry"));
    switch (geometryName) {
        case "cube":
            geometry = new THREE.BoxGeometry(5, 5, 5);
            break;
        case "sphere":
            geometry = new THREE.SphereGeometry(3);
            break;
        case "cone":
            geometry = new THREE.ConeGeometry(3, 8, 32);
            break;
        case "cylinder":
            geometry = new THREE.CylinderGeometry(3, 3, 8, 32);
            break;
        case "torus":
            geometry = new THREE.TorusGeometry(4, 2, 16, 100);
            break;
        case "tetrahedron":
            geometry = new THREE.TetrahedronGeometry(4, 0);
            break;
        case "heart":
            geometry = new THREE.ExtrudeGeometry(getHeart(), { amount: 2, bevelEnable: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 });
            break;
    }
    mesh = new THREE.Mesh(geometry, material);
    mesh.name = "geometry"
    mesh.castShadow = true
    scene.add(mesh);
}

function updateLight(switchName){
    if(switchName == "on"){
        scene.add(floorMesh)
    }else{
        scene.remove(scene.getObjectByName("floorMesh"))
    }
}

function getHeart() {
    const x = -10,
        y = -10;
    var heartShape = new THREE.Shape();
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    return heartShape;
}

function resetAll() {
    updateAnimation("0")
    resetActiveButton("animation")
    updateMaterial("solid")
    resetActiveButton("material")
    resetActiveButton("change")
    updateTransformControles("null")
}

function resetActiveButton(buttonType) {
    buttonType = "img." + buttonType
    let materialList = document.querySelectorAll(buttonType)
    materialList.forEach(material => {
        material.classList.remove("active")
    })
    let defaultMaterial = materialList[0]
    defaultMaterial.classList.add("active")
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
}

// setUp scene,camera,renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#background"),
})
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer shadow map
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// setUp camera position
camera.position.setZ(30)
camera.position.setY(10)

// inital Mesh
let geometry = new THREE.BoxGeometry(5, 5, 5);
let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let mesh = new THREE.Mesh(geometry, material);
mesh.name = "geometry"
mesh.castShadow = true
scene.add(mesh);

// add light
const pointLight = new THREE.PointLight(0xffffff, 10, 50)
pointLight.position.set(5, 10, 10)
pointLight.castShadow = true
const ambientLight = new THREE.AmbientLight(0x993399)
scene.add(pointLight, ambientLight)

// add lightHelper and gridHelper
const controls = new OrbitControls(camera, renderer.domElement)
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)

// floor
let floorGeometry = new THREE.PlaneBufferGeometry(200, 200, 200, 200)
let floorMat = new THREE.MeshPhongMaterial({ color: 0x222222, side: THREE.DoubleSide })
let floorMesh = new THREE.Mesh(floorGeometry, floorMat)
floorMesh.rotation.x = -Math.PI / 2
floorMesh.position.y = 0
floorMesh.receiveShadow = true
mesh.receiveShadow = false
floorMesh.name = "floorMesh"

var transformControls = new TransformControls(camera, renderer.domElement);
transformControls.size = 0.5;
transformControls.addEventListener("dragging-changed", (event) => {
    controls.enabled = !event.value;
});

animate()
handleClickInListButton("material")
handleClickInListButton("light_switch")
handleClickInListButton("geometry")
handleClickInListButton("animation")
handleClickInListButton("change")
window.addEventListener('resize', onWindowResize, false)
