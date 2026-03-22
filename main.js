import * as THREE from 'https://unpkg.com/three@0.154.0/build/three.module.js';

// 1. Configuración de Escena, Cámara y Renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Luz ambiental muy suave para no matar el contraste de los focos cercanos
const ambientLight = new THREE.AmbientLight(0x404040, 1); 
scene.add(ambientLight);

// ==========================================
// CONFIGURACIÓN DE FIGURAS
// ==========================================

// FIGURA 1: Icosaedro Rojo (Izquierda) - LENTO
const icosahedronGeo1 = new THREE.IcosahedronGeometry(1.2); 
const icosahedronMat1 = new THREE.MeshStandardMaterial({ color: 0xff3333 }); 
const icosahedron1 = new THREE.Mesh(icosahedronGeo1, icosahedronMat1);
icosahedron1.position.x = -4; 
scene.add(icosahedron1);

// FIGURA 2: Dodecaedro Verde (Centro) - MEDIO
const dodecahedronGeo = new THREE.DodecahedronGeometry(1.2);
const dodecahedronMat = new THREE.MeshStandardMaterial({ color: 0x33ff33 }); 
const dodecahedron = new THREE.Mesh(dodecahedronGeo, dodecahedronMat);
dodecahedron.position.x = 0; 
scene.add(dodecahedron);

// FIGURA 3: Icosaedro Azul (Derecha) - RÁPIDO
const icosahedronGeo2 = new THREE.IcosahedronGeometry(1.2);
const icosahedronMat2 = new THREE.MeshStandardMaterial({ color: 0x3333ff }); 
const icosahedron2 = new THREE.Mesh(icosahedronGeo2, icosahedronMat2);
icosahedron2.position.x = 4; 
scene.add(icosahedron2);

// ==========================================
// CONFIGURACIÓN DE LUCES Y ETIQUETAS
// ==========================================

const workingVector = new THREE.Vector3();

function createLightWithLabel(color, intensity, distance, position, labelText) {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.copy(position);
    scene.add(light);

    const label = document.createElement('div');
    label.className = 'light-label'; 
    label.textContent = labelText;
    document.body.appendChild(label);

    return { light, label };
}

// DEFINICIÓN DE FOCOS MÁS CERCANOS
// La figura 1 está en x:-4. El foco está a centímetros de ella en (-4.5, 1.5, 1.5)
const light1Info = createLightWithLabel(0xffffff, 2, 20, new THREE.Vector3(-4.5, 1.5, 1.5), "Luz Rozando Sup. Izq.");

// La figura 2 está en x:0. El foco está muy cerca por debajo en (0, -1.5, 1.5)
const light2Info = createLightWithLabel(0xffffff, 2, 20, new THREE.Vector3(0, -1.5, 1.5), "Luz Rozando Inf.");

// La figura 3 está en x:4. El foco está a centímetros de ella en (4.5, 1.5, 1.5)
const light3Info = createLightWithLabel(0xffffff, 2, 20, new THREE.Vector3(4.5, 1.5, 1.5), "Luz Rozando Sup. Der.");

const lightsToUpdate = [light1Info, light2Info, light3Info];

// ==========================================
// CÁMARA Y ANIMACIÓN
// ==========================================
camera.position.z = 7;

function updateScreenLabels() {
    lightsToUpdate.forEach(item => {
        workingVector.copy(item.light.position);
        workingVector.project(camera);

        const x = (workingVector.x * 0.5 + 0.5) * window.innerWidth;
        const y = (workingVector.y * -0.5 + 0.5) * window.innerHeight;

        item.label.style.left = `${x}px`;
        item.label.style.top = `${y}px`;
    });
}

function animate() {
    // Rotación
    icosahedron1.rotation.x += 0.005;
    icosahedron1.rotation.y += 0.005;

    dodecahedron.rotation.x += 0.02;
    dodecahedron.rotation.y += 0.02;

    icosahedron2.rotation.x += 0.05;
    icosahedron2.rotation.y += 0.05;

    // Actualizar etiquetas
    updateScreenLabels();

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}