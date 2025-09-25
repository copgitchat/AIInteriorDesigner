import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface Scene3DProps {
  selectedRoom: string;
  onObjectClick?: (object: any) => void;
}

const Scene3D: React.FC<Scene3DProps> = ({ selectedRoom, onObjectClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const animationIdRef = useRef<number>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create room based on selectedRoom
    createRoom(scene, selectedRoom);

    // Mouse controls
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    const handleMouseDown = (event: MouseEvent) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      camera.position.x = camera.position.x * Math.cos(deltaX * 0.01) - camera.position.z * Math.sin(deltaX * 0.01);
      camera.position.z = camera.position.x * Math.sin(deltaX * 0.01) + camera.position.z * Math.cos(deltaX * 0.01);
      camera.position.y += deltaY * 0.01;

      camera.lookAt(0, 0, 0);

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleWheel = (event: WheelEvent) => {
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      camera.position.multiplyScalar(scale);
      camera.lookAt(0, 0, 0);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedRoom]);

  const createRoom = (scene: THREE.Scene, roomType: string) => {
    // Clear existing objects
    while (scene.children.length > 2) { // Keep lights
      scene.remove(scene.children[2]);
    }

    // Room dimensions
    const roomWidth = 8;
    const roomHeight = 3;
    const roomDepth = 6;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: roomType === 'living-room' ? 0xd4af37 : 
             roomType === 'bedroom' ? 0xf5deb3 : 
             roomType === 'kitchen' ? 0xe6e6fa : 0xf0f8ff 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    scene.add(backWall);

    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Add furniture based on room type
    switch (roomType) {
      case 'living-room':
        addLivingRoomFurniture(scene);
        break;
      case 'bedroom':
        addBedroomFurniture(scene);
        break;
      case 'kitchen':
        addKitchenFurniture(scene);
        break;
      case 'bathroom':
        addBathroomFurniture(scene);
        break;
    }
  };

  const addLivingRoomFurniture = (scene: THREE.Scene) => {
    // Sofa
    const sofaGeometry = new THREE.BoxGeometry(3, 0.8, 1.2);
    const sofaMaterial = new THREE.MeshLambertMaterial({ color: 0x4a5568 });
    const sofa = new THREE.Mesh(sofaGeometry, sofaMaterial);
    sofa.position.set(0, 0.4, -2);
    sofa.castShadow = true;
    scene.add(sofa);

    // Coffee table
    const tableGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.8);
    const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(0, 0.5, -0.5);
    table.castShadow = true;
    scene.add(table);

    // TV Stand
    const tvStandGeometry = new THREE.BoxGeometry(2, 0.6, 0.4);
    const tvStandMaterial = new THREE.MeshLambertMaterial({ color: 0x2d3748 });
    const tvStand = new THREE.Mesh(tvStandGeometry, tvStandMaterial);
    tvStand.position.set(0, 0.3, -2.8);
    tvStand.castShadow = true;
    scene.add(tvStand);

    // TV
    const tvGeometry = new THREE.BoxGeometry(1.8, 1, 0.1);
    const tvMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    const tv = new THREE.Mesh(tvGeometry, tvMaterial);
    tv.position.set(0, 1.1, -2.9);
    scene.add(tv);
  };

  const addBedroomFurniture = (scene: THREE.Scene) => {
    // Bed
    const bedGeometry = new THREE.BoxGeometry(2, 0.6, 3);
    const bedMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const bed = new THREE.Mesh(bedGeometry, bedMaterial);
    bed.position.set(0, 0.3, -1);
    bed.castShadow = true;
    scene.add(bed);

    // Headboard
    const headboardGeometry = new THREE.BoxGeometry(2.2, 1.2, 0.2);
    const headboardMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const headboard = new THREE.Mesh(headboardGeometry, headboardMaterial);
    headboard.position.set(0, 0.9, -2.6);
    scene.add(headboard);

    // Nightstands
    const nightstandGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.4);
    const nightstandMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    
    const leftNightstand = new THREE.Mesh(nightstandGeometry, nightstandMaterial);
    leftNightstand.position.set(-1.4, 0.3, -1.8);
    leftNightstand.castShadow = true;
    scene.add(leftNightstand);

    const rightNightstand = new THREE.Mesh(nightstandGeometry, nightstandMaterial);
    rightNightstand.position.set(1.4, 0.3, -1.8);
    rightNightstand.castShadow = true;
    scene.add(rightNightstand);

    // Wardrobe
    const wardrobeGeometry = new THREE.BoxGeometry(1.5, 2, 0.6);
    const wardrobeMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
    const wardrobe = new THREE.Mesh(wardrobeGeometry, wardrobeMaterial);
    wardrobe.position.set(-3, 1, 1);
    wardrobe.castShadow = true;
    scene.add(wardrobe);
  };

  const addKitchenFurniture = (scene: THREE.Scene) => {
    // Kitchen Island
    const islandGeometry = new THREE.BoxGeometry(2, 0.9, 1);
    const islandMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.set(0, 0.45, 0);
    island.castShadow = true;
    scene.add(island);

    // Cabinets along the wall
    const cabinetGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const cabinetMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    
    for (let i = -3; i <= 3; i += 1.2) {
      const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
      cabinet.position.set(i, 0.4, -2.7);
      cabinet.castShadow = true;
      scene.add(cabinet);
    }

    // Refrigerator
    const fridgeGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
    const fridgeMaterial = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 });
    const fridge = new THREE.Mesh(fridgeGeometry, fridgeMaterial);
    fridge.position.set(3, 1, -2.4);
    fridge.castShadow = true;
    scene.add(fridge);
  };

  const addBathroomFurniture = (scene: THREE.Scene) => {
    // Bathtub
    const tubGeometry = new THREE.BoxGeometry(1.8, 0.6, 0.8);
    const tubMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const tub = new THREE.Mesh(tubGeometry, tubMaterial);
    tub.position.set(-2, 0.3, -2);
    tub.castShadow = true;
    scene.add(tub);

    // Sink
    const sinkGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.5);
    const sinkMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const sink = new THREE.Mesh(sinkGeometry, sinkMaterial);
    sink.position.set(2, 0.4, -2.5);
    sink.castShadow = true;
    scene.add(sink);

    // Toilet
    const toiletGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.8);
    const toiletMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const toilet = new THREE.Mesh(toiletGeometry, toiletMaterial);
    toilet.position.set(2, 0.4, 1);
    toilet.castShadow = true;
    scene.add(toilet);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600">Loading 3D Model...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm">
        <p>Click and drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
};

export default Scene3D;