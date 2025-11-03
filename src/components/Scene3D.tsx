import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadedModelsRef = useRef<Map<string, THREE.Group>>(new Map());

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

    // Load 3D models
    loadFurnitureModels(scene, selectedRoom);

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

  const loadFurnitureModels = async (scene: THREE.Scene, roomType: string) => {
    const loader = new GLTFLoader();
    const loadingManager = new THREE.LoadingManager();
    
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      setLoadingProgress(progress);
    };

    loadingManager.onLoad = () => {
      setIsLoading(false);
      setLoadingProgress(100);
    };

    // Free 3D model URLs from various sources
    const modelUrls = {
      'living-room': [
        'https://threejs.org/examples/models/gltf/LittlestTokyo.glb',
        // Fallback to procedural if models fail to load
      ],
      'bedroom': [
        // Add bedroom-specific models here
      ],
      'kitchen': [
        // Add kitchen-specific models here
      ],
      'bathroom': [
        // Add bathroom-specific models here
      ]
    };

    try {
      // Try to load realistic models first
      const urls = modelUrls[roomType as keyof typeof modelUrls] || [];
      
      if (urls.length > 0) {
        for (const url of urls) {
          try {
            const gltf = await new Promise<any>((resolve, reject) => {
              loader.load(url, resolve, undefined, reject);
            });
            
            const model = gltf.scene;
            model.scale.setScalar(0.01); // Scale down if needed
            model.position.set(0, 0, 0);
            scene.add(model);
            
            loadedModelsRef.current.set(url, model);
            break; // Use first successful model
          } catch (error) {
            console.warn(`Failed to load model from ${url}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load realistic models, using procedural furniture:', error);
    }
    
    // Always add procedural furniture as fallback or supplement
    addProceduralFurniture(scene, roomType);
    setIsLoading(false);
  };

  const addProceduralFurniture = (scene: THREE.Scene, roomType: string) => {
    // Enhanced procedural furniture with better materials and details
    switch (roomType) {
      case 'living-room':
        addEnhancedLivingRoomFurniture(scene);
        break;
      case 'bedroom':
        addEnhancedBedroomFurniture(scene);
        break;
      case 'kitchen':
        addEnhancedKitchenFurniture(scene);
        break;
      case 'bathroom':
        addEnhancedBathroomFurniture(scene);
        break;
    }
  };

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
    // Furniture will be added by loadFurnitureModels
  };

  const addEnhancedLivingRoomFurniture = (scene: THREE.Scene) => {
    // Sofa
    const sofaGroup = new THREE.Group();
    
    // Sofa base
    const sofaBaseGeometry = new THREE.BoxGeometry(3, 0.6, 1.2);
    const sofaMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4a5568,
      shininess: 30
    });
    const sofaBase = new THREE.Mesh(sofaBaseGeometry, sofaMaterial);
    sofaBase.position.y = 0.3;
    sofaGroup.add(sofaBase);
    
    // Sofa back
    const sofaBackGeometry = new THREE.BoxGeometry(3, 0.8, 0.2);
    const sofaBack = new THREE.Mesh(sofaBackGeometry, sofaMaterial);
    sofaBack.position.set(0, 0.7, -0.5);
    sofaGroup.add(sofaBack);
    
    // Sofa arms
    const armGeometry = new THREE.BoxGeometry(0.2, 0.6, 1.2);
    const leftArm = new THREE.Mesh(armGeometry, sofaMaterial);
    leftArm.position.set(-1.4, 0.6, 0);
    sofaGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, sofaMaterial);
    rightArm.position.set(1.4, 0.6, 0);
    sofaGroup.add(rightArm);
    
    sofaGroup.position.set(0, 0, -2);
    sofaGroup.castShadow = true;
    scene.add(sofaGroup);

    // Enhanced coffee table with glass top
    const tableGroup = new THREE.Group();
    
    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    
    const positions = [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]];
    positions.forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(x, 0.2, z);
      tableGroup.add(leg);
    });
    
    // Glass top
    const glassGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.8);
    const glassMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      shininess: 100
    });
    const glassTop = new THREE.Mesh(glassGeometry, glassMaterial);
    glassTop.position.y = 0.425;
    tableGroup.add(glassTop);
    
    tableGroup.position.set(0, 0, -0.5);
    tableGroup.castShadow = true;
    scene.add(tableGroup);

    // Modern TV stand with details
    const tvStandGroup = new THREE.Group();
    
    const tvStandGeometry = new THREE.BoxGeometry(2, 0.6, 0.4);
    const tvStandMaterial = new THREE.MeshPhongMaterial({ color: 0x2d3748 });
    const tvStand = new THREE.Mesh(tvStandGeometry, tvStandMaterial);
    tvStand.position.y = 0.3;
    tvStandGroup.add(tvStand);
    
    // TV stand legs
    const standLegGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    [-0.8, 0.8].forEach(x => {
      const leg = new THREE.Mesh(standLegGeometry, tvStandMaterial);
      leg.position.set(x, 0.15, 0);
      tvStandGroup.add(leg);
    });
    
    tvStandGroup.position.set(0, 0, -2.8);
    tvStandGroup.castShadow = true;
    scene.add(tvStandGroup);

    // Enhanced TV with bezel
    const tvGeometry = new THREE.BoxGeometry(1.8, 1, 0.1);
    const tvMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const tv = new THREE.Mesh(tvGeometry, tvMaterial);
    tv.position.set(0, 1.1, -2.9);
    scene.add(tv);
    
    // TV screen
    const screenGeometry = new THREE.BoxGeometry(1.6, 0.9, 0.05);
    const screenMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a1a1a,
      emissive: 0x111111
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1.1, -2.85);
    scene.add(screen);
  };

  const addEnhancedBedroomFurniture = (scene: THREE.Scene) => {
    // Bed
    const bedGroup = new THREE.Group();
    
    // Mattress
    const mattressGeometry = new THREE.BoxGeometry(2, 0.3, 3);
    const mattressMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.y = 0.45;
    bedGroup.add(mattress);
    
    // Bed frame
    const frameGeometry = new THREE.BoxGeometry(2.1, 0.3, 3.1);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 0.15;
    bedGroup.add(frame);
    
    bedGroup.position.set(0, 0, -1);
    bedGroup.castShadow = true;
    scene.add(bedGroup);

    // Enhanced headboard with padding
    const headboardGroup = new THREE.Group();
    
    const headboardGeometry = new THREE.BoxGeometry(2.2, 1.2, 0.2);
    const headboardMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const headboard = new THREE.Mesh(headboardGeometry, headboardMaterial);
    headboard.position.y = 0.6;
    headboardGroup.add(headboard);
    
    // Headboard padding
    const paddingGeometry = new THREE.BoxGeometry(1.8, 0.8, 0.1);
    const paddingMaterial = new THREE.MeshPhongMaterial({ color: 0x4a5568 });
    const padding = new THREE.Mesh(paddingGeometry, paddingMaterial);
    padding.position.set(0, 0.6, 0.05);
    headboardGroup.add(padding);
    
    headboardGroup.position.set(0, 0.3, -2.6);
    scene.add(headboardGroup);

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

  const addEnhancedKitchenFurniture = (scene: THREE.Scene) => {
    // Kitchen Island
    const islandGroup = new THREE.Group();
    
    // Island base
    const islandGeometry = new THREE.BoxGeometry(2, 0.8, 1);
    const islandMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.y = 0.4;
    islandGroup.add(island);
    
    // Countertop
    const countertopGeometry = new THREE.BoxGeometry(2.1, 0.1, 1.1);
    const countertopMaterial = new THREE.MeshPhongMaterial({ color: 0x2d3748 });
    const countertop = new THREE.Mesh(countertopGeometry, countertopMaterial);
    countertop.position.y = 0.85;
    islandGroup.add(countertop);
    
    islandGroup.position.set(0, 0, 0);
    islandGroup.castShadow = true;
    scene.add(islandGroup);

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

  const addEnhancedBathroomFurniture = (scene: THREE.Scene) => {
    // Bathtub
    const tubGroup = new THREE.Group();
    
    // Tub base
    const tubGeometry = new THREE.BoxGeometry(1.8, 0.5, 0.8);
    const tubMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 80
    });
    const tub = new THREE.Mesh(tubGeometry, tubMaterial);
    tub.position.y = 0.25;
    tubGroup.add(tub);
    
    // Tub rim
    const rimGeometry = new THREE.BoxGeometry(1.9, 0.1, 0.9);
    const rim = new THREE.Mesh(rimGeometry, tubMaterial);
    rim.position.y = 0.55;
    tubGroup.add(rim);
    
    tubGroup.position.set(-2, 0, -2);
    tubGroup.castShadow = true;
    scene.add(tubGroup);

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
            <p className="text-gray-600">Loading 3D Models...</p>
            <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{Math.round(loadingProgress)}%</p>
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