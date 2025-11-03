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

    // Create texture loader
    const textureLoader = new THREE.TextureLoader();

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    
    // Create procedural floor texture
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const floorCtx = floorCanvas.getContext('2d')!;
    
    // Different floor patterns for different rooms
    if (roomType === 'living-room') {
      // Hardwood pattern
      floorCtx.fillStyle = '#8B4513';
      floorCtx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 512; i += 64) {
        floorCtx.fillStyle = i % 128 === 0 ? '#A0522D' : '#8B4513';
        floorCtx.fillRect(0, i, 512, 32);
      }
    } else if (roomType === 'kitchen' || roomType === 'bathroom') {
      // Tile pattern
      floorCtx.fillStyle = '#F5F5F5';
      floorCtx.fillRect(0, 0, 512, 512);
      floorCtx.strokeStyle = '#CCCCCC';
      floorCtx.lineWidth = 2;
      for (let x = 0; x < 512; x += 64) {
        for (let y = 0; y < 512; y += 64) {
          floorCtx.strokeRect(x, y, 64, 64);
        }
      }
    } else {
      // Carpet pattern for bedroom
      floorCtx.fillStyle = '#DEB887';
      floorCtx.fillRect(0, 0, 512, 512);
      // Add subtle texture
      for (let i = 0; i < 1000; i++) {
        floorCtx.fillStyle = `rgba(${139 + Math.random() * 40}, ${69 + Math.random() * 40}, ${19 + Math.random() * 40}, 0.3)`;
        floorCtx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
      }
    }
    
    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(2, 2);
    
    const floorMaterial = new THREE.MeshPhongMaterial({ 
      map: floorTexture,
      shininess: roomType === 'kitchen' || roomType === 'bathroom' ? 80 : 10
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create wall texture
    const wallCanvas = document.createElement('canvas');
    wallCanvas.width = 512;
    wallCanvas.height = 512;
    const wallCtx = wallCanvas.getContext('2d')!;
    
    // Paint texture with subtle variations
    wallCtx.fillStyle = '#F8F8FF';
    wallCtx.fillRect(0, 0, 512, 512);
    
    // Add subtle texture and imperfections
    for (let i = 0; i < 500; i++) {
      wallCtx.fillStyle = `rgba(240, 240, 250, ${0.1 + Math.random() * 0.2})`;
      wallCtx.fillRect(Math.random() * 512, Math.random() * 512, 3, 3);
    }
    
    const wallTexture = new THREE.CanvasTexture(wallCanvas);
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(1, 1);
    
    const wallMaterial = new THREE.MeshPhongMaterial({ 
      map: wallTexture,
      shininess: 5
    });
    
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Add ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const ceilingMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xFFFFF0,
      shininess: 10
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomHeight;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Add baseboards
    const baseboardGeometry = new THREE.BoxGeometry(roomWidth, 0.1, 0.05);
    const baseboardMaterial = new THREE.MeshPhongMaterial({ color: 0xF5F5DC });
    
    const backBaseboard = new THREE.Mesh(baseboardGeometry, baseboardMaterial);
    backBaseboard.position.set(0, 0.05, -roomDepth / 2 + 0.025);
    scene.add(backBaseboard);
    
    const leftBaseboardGeometry = new THREE.BoxGeometry(0.05, 0.1, roomDepth);
    const leftBaseboard = new THREE.Mesh(leftBaseboardGeometry, baseboardMaterial);
    leftBaseboard.position.set(-roomWidth / 2 + 0.025, 0.05, 0);
    scene.add(leftBaseboard);
    
    const rightBaseboard = new THREE.Mesh(leftBaseboardGeometry, baseboardMaterial);
    rightBaseboard.position.set(roomWidth / 2 - 0.025, 0.05, 0);
    scene.add(rightBaseboard);

    // Add room-specific environmental elements
    addEnvironmentalElements(scene, roomType);
  };

  const addEnvironmentalElements = (scene: THREE.Scene, roomType: string) => {
    switch (roomType) {
      case 'living-room':
        addLivingRoomElements(scene);
        break;
      case 'bedroom':
        addBedroomElements(scene);
        break;
      case 'kitchen':
        addKitchenElements(scene);
        break;
      case 'bathroom':
        addBathroomElements(scene);
        break;
    }
  };

  const addLivingRoomElements = (scene: THREE.Scene) => {
    // Window
    const windowGeometry = new THREE.PlaneGeometry(2, 1.5);
    const windowMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.3,
      shininess: 100
    });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(2, 1.5, -2.99);
    scene.add(window);
    
    // Window frame
    const frameGeometry = new THREE.BoxGeometry(2.1, 1.6, 0.05);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(2, 1.5, -2.98);
    scene.add(frame);
    
    // Curtains
    const curtainGeometry = new THREE.PlaneGeometry(1.2, 2);
    const curtainMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
    const leftCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
    leftCurtain.position.set(1.2, 1.5, -2.97);
    scene.add(leftCurtain);
    
    const rightCurtain = new THREE.Mesh(curtainGeometry, curtainMaterial);
    rightCurtain.position.set(2.8, 1.5, -2.97);
    scene.add(rightCurtain);
    
    // Wall art
    const artGeometry = new THREE.PlaneGeometry(0.8, 0.6);
    const artMaterial = new THREE.MeshPhongMaterial({ color: 0x4169E1 });
    const art = new THREE.Mesh(artGeometry, artMaterial);
    art.position.set(-2, 1.8, -2.99);
    scene.add(art);
    
    // Picture frame
    const frameArtGeometry = new THREE.BoxGeometry(0.85, 0.65, 0.03);
    const frameArt = new THREE.Mesh(frameArtGeometry, frameMaterial);
    frameArt.position.set(-2, 1.8, -2.98);
    scene.add(frameArt);
  };

  const addBedroomElements = (scene: THREE.Scene) => {
    // Window
    const windowGeometry = new THREE.PlaneGeometry(1.5, 1.2);
    const windowMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.3,
      shininess: 100
    });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(-3.99, 1.5, -1);
    window.rotation.y = Math.PI / 2;
    scene.add(window);
    
    // Blinds
    for (let i = 0; i < 8; i++) {
      const blindGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.02);
      const blindMaterial = new THREE.MeshPhongMaterial({ color: 0xF5F5DC });
      const blind = new THREE.Mesh(blindGeometry, blindMaterial);
      blind.position.set(-3.98, 1.9 - i * 0.15, -1);
      blind.rotation.y = Math.PI / 2;
      scene.add(blind);
    }
    
    // Mirror
    const mirrorGeometry = new THREE.PlaneGeometry(0.6, 1.2);
    const mirrorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xC0C0C0,
      shininess: 100,
      transparent: true,
      opacity: 0.8
    });
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.position.set(3.99, 1.5, 1);
    mirror.rotation.y = -Math.PI / 2;
    scene.add(mirror);
  };

  const addKitchenElements = (scene: THREE.Scene) => {
    // Upper cabinets
    const upperCabinetGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.3);
    const cabinetMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    
    for (let i = -3; i <= 3; i += 1.2) {
      const upperCabinet = new THREE.Mesh(upperCabinetGeometry, cabinetMaterial);
      upperCabinet.position.set(i, 2.2, -2.85);
      upperCabinet.castShadow = true;
      scene.add(upperCabinet);
    }
    
    // Backsplash
    const backsplashGeometry = new THREE.PlaneGeometry(8, 0.6);
    const backsplashMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xF0F8FF,
      shininess: 50
    });
    const backsplash = new THREE.Mesh(backsplashGeometry, backsplashMaterial);
    backsplash.position.set(0, 1.5, -2.99);
    scene.add(backsplash);
    
    // Kitchen window
    const windowGeometry = new THREE.PlaneGeometry(1.5, 1);
    const windowMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.3
    });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.set(0, 1.8, -2.99);
    scene.add(window);
  };

  const addBathroomElements = (scene: THREE.Scene) => {
    // Tiles on walls
    const tileGeometry = new THREE.PlaneGeometry(8, 1.5);
    const tileMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xF0F8FF,
      shininess: 80
    });
    const wallTiles = new THREE.Mesh(tileGeometry, tileMaterial);
    wallTiles.position.set(0, 0.75, -2.99);
    scene.add(wallTiles);
    
    // Mirror above sink
    const mirrorGeometry = new THREE.PlaneGeometry(1, 0.8);
    const mirrorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xC0C0C0,
      shininess: 100,
      transparent: true,
      opacity: 0.8
    });
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.position.set(2, 1.8, -2.99);
    scene.add(mirror);
    
    // Towel rack
    const rackGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
    const rackMaterial = new THREE.MeshPhongMaterial({ color: 0xC0C0C0 });
    const towelRack = new THREE.Mesh(rackGeometry, rackMaterial);
    towelRack.rotation.z = Math.PI / 2;
    towelRack.position.set(-2, 1.2, -2.9);
    scene.add(towelRack);
    
    // Towel
    const towelGeometry = new THREE.PlaneGeometry(0.4, 0.6);
    const towelMaterial = new THREE.MeshLambertMaterial({ color: 0x00CED1 });
    const towel = new THREE.Mesh(towelGeometry, towelMaterial);
    towel.position.set(-2, 1.2, -2.85);
    scene.add(towel);
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

    // Add plants
    const plantPotGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.3);
    const potMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const plantPot = new THREE.Mesh(plantPotGeometry, potMaterial);
    plantPot.position.set(-3, 0.15, 2);
    scene.add(plantPot);
    
    // Plant leaves
    const leafGeometry = new THREE.SphereGeometry(0.3);
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const plant = new THREE.Mesh(leafGeometry, leafMaterial);
    plant.position.set(-3, 0.6, 2);
    scene.add(plant);
    
    // Side table
    const sideTableGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5);
    const sideTableMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const sideTable = new THREE.Mesh(sideTableGeometry, sideTableMaterial);
    sideTable.position.set(2.5, 0.25, -1);
    scene.add(sideTable);
    
    // Table lamp
    const lampBaseGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.3);
    const lampBase = new THREE.Mesh(lampBaseGeometry, new THREE.MeshPhongMaterial({ color: 0x2F4F4F }));
    lampBase.position.set(2.5, 0.65, -1);
    scene.add(lampBase);
    
    const lampShadeGeometry = new THREE.ConeGeometry(0.2, 0.3);
    const lampShade = new THREE.Mesh(lampShadeGeometry, new THREE.MeshLambertMaterial({ color: 0xFFFACD }));
    lampShade.position.set(2.5, 0.95, -1);
    scene.add(lampShade);
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

    // Add dresser
    const dresserGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.5);
    const dresserMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const dresser = new THREE.Mesh(dresserGeometry, dresserMaterial);
    dresser.position.set(3, 0.4, 0);
    dresser.castShadow = true;
    scene.add(dresser);
    
    // Bedside lamps
    const lampBaseGeometry = new THREE.CylinderGeometry(0.06, 0.1, 0.25);
    const lampBaseMaterial = new THREE.MeshPhongMaterial({ color: 0x2F4F4F });
    
    const leftLamp = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial);
    leftLamp.position.set(-1.4, 0.725, -1.8);
    scene.add(leftLamp);
    
    const rightLamp = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial);
    rightLamp.position.set(1.4, 0.725, -1.8);
    scene.add(rightLamp);
    
    // Lamp shades
    const shadeGeometry = new THREE.ConeGeometry(0.15, 0.2);
    const shadeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFACD });
    
    const leftShade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    leftShade.position.set(-1.4, 0.85, -1.8);
    scene.add(leftShade);
    
    const rightShade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    rightShade.position.set(1.4, 0.85, -1.8);
    scene.add(rightShade);
    
    // Throw pillows on bed
    const pillowGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.4);
    const pillowMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
    
    const pillow1 = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow1.position.set(-0.3, 0.65, -2);
    scene.add(pillow1);
    
    const pillow2 = new THREE.Mesh(pillowGeometry, pillowMaterial);
    pillow2.position.set(0.3, 0.65, -2);
    scene.add(pillow2);
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

    // Add bar stools
    const stoolSeatGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05);
    const stoolLegGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
    const stoolMaterial = new THREE.MeshPhongMaterial({ color: 0x2F4F4F });
    
    for (let i = -0.5; i <= 0.5; i += 1) {
      const stoolSeat = new THREE.Mesh(stoolSeatGeometry, stoolMaterial);
      stoolSeat.position.set(i, 0.625, 0.7);
      scene.add(stoolSeat);
      
      const stoolLeg = new THREE.Mesh(stoolLegGeometry, stoolMaterial);
      stoolLeg.position.set(i, 0.3, 0.7);
      scene.add(stoolLeg);
    }
    
    // Kitchen utensils holder
    const utensilHolderGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2);
    const utensilHolder = new THREE.Mesh(utensilHolderGeometry, new THREE.MeshPhongMaterial({ color: 0xC0C0C0 }));
    utensilHolder.position.set(-1, 0.9, 0);
    scene.add(utensilHolder);
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

    // Add shower curtain
    const curtainGeometry = new THREE.PlaneGeometry(1.8, 2);
    const curtainMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.7
    });
    const shower = new THREE.Mesh(curtainGeometry, curtainMaterial);
    shower.position.set(-2, 1, -1.5);
    scene.add(shower);
    
    // Bathroom mat
    const matGeometry = new THREE.PlaneGeometry(0.8, 0.5);
    const matMaterial = new THREE.MeshLambertMaterial({ color: 0x00CED1 });
    const mat = new THREE.Mesh(matGeometry, matMaterial);
    mat.rotation.x = -Math.PI / 2;
    mat.position.set(2, 0.01, -2);
    scene.add(mat);
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