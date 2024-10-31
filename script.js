const container = document.getElementById('bg-container');

// Initialize Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 300;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1); // Black background
container.appendChild(renderer.domElement);

// Particles
const particlesCount = 10000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);
const sizes = new Float32Array(particlesCount);

for (let i = 0; i < particlesCount; i++) {
    // Random positions for the stars
    positions[i * 3] = (Math.random() - 0.5) * 1000; // X
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1000; // Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1000; // Z

    // Set random sizes
    sizes[i] = Math.random() * 2 + 1; // Size between 1 and 3
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// PointsMaterial with color and size
const material = new THREE.PointsMaterial({
    color: 0xffffff, // White stars
    size: 1,
    sizeAttenuation: true // Make size perspective-dependent
});

// Create Points Mesh with Material
const stars = new THREE.Points(geometry, material);
scene.add(stars);

// Animation
function animate() {
    requestAnimationFrame(animate);

    const positions = stars.geometry.attributes.position.array;
    
    for (let i = 0; i < particlesCount; i++) {
        // Move stars towards the camera
        positions[i * 3 + 2] -= 2; // Move stars closer to the camera

        // Reset stars that have moved past the camera
        if (positions[i * 3 + 2] < -300) {
            positions[i * 3 + 2] = Math.random() * 1000; // Reset to random depth
            positions[i * 3] = (Math.random() - 0.5) * 1000; // Random X position
            positions[i * 3 + 1] = (Math.random() - 0.5) * 1000; // Random Y position
        }
    }

    stars.geometry.attributes.position.needsUpdate = true; // Notify Three.js to update the position buffer

    renderer.render(scene, camera);
}

animate();

// Resize Event
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
