// Unturned Web - Prince Edward Island (PEI) Open World Generator
import * as THREE from './three.module.js';
import { ModelFactory } from './models.js';
import { textures } from './textures.js';

export class WorldManager {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.trees = [];
    this.lootSpawns = [];
    this.groundLoot = [];
    this.doors = [];
    this.vehicles = [];
    this.buildings = [];
    this.mapSize = 320;
    this.waterMesh = null;
    this.terrainMesh = null;
  }

  generateWorld() {
    this.createTerrain();
    this.createWater();
    this.createRoads();
    this.createStratfordTown();
    this.createMilitaryBase();
    this.createAlbertonFarm();
    this.createCampground();
    this.createLighthouse();
    this.populateForests();
    this.spawnLootCrates();
  }

  // --- PROCEDURAL TERRAIN ---
  createTerrain() {
    const size = this.mapSize;
    const segments = 90;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Distance from center (island falloff)
      const dist = Math.sqrt(x * x + z * z);
      const maxR = size * 0.44;

      // Low poly rolling hills
      let y = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 3.5;
      y += Math.sin(x * 0.09 + 1.2) * Math.cos(z * 0.09) * 1.8;

      // Flatten areas for Town, Military Base, Farm
      // Stratford Town center around (-40, 20)
      const distTown = Math.hypot(x - (-40), z - 20);
      if (distTown < 45) {
        y = y * (distTown / 45) * 0.2 + 0.5;
      }

      // Military Base center around (60, -50)
      const distMil = Math.hypot(x - 60, z - (-50));
      if (distMil < 40) {
        y = y * (distMil / 40) * 0.15 + 1.0;
      }

      // Farm center around (40, 50)
      const distFarm = Math.hypot(x - 40, z - 50);
      if (distFarm < 40) {
        y = y * (distFarm / 40) * 0.2 + 0.8;
      }

      // Island edge falloff into ocean
      if (dist > maxR * 0.65) {
        const falloff = (dist - maxR * 0.65) / (maxR * 0.35);
        y -= Math.pow(falloff, 2) * 14;
      }

      // Ensure dry land elevation
      pos.setY(i, Math.max(-8, y + 1.2));
    }

    geo.computeVertexNormals();

    const mat = new THREE.MeshLambertMaterial({
      color: 0x4d7c37, // Unturned vibrant grass green
      flatShading: true
    });

    this.terrainMesh = new THREE.Mesh(geo, mat);
    this.terrainMesh.receiveShadow = true;
    this.scene.add(this.terrainMesh);
  }

  // --- SURROUNDING OCEAN WATER ---
  createWater() {
    const waterGeo = new THREE.PlaneGeometry(this.mapSize * 1.8, this.mapSize * 1.8);
    waterGeo.rotateX(-Math.PI / 2);

    const waterMat = new THREE.MeshLambertMaterial({
      color: 0x0284c7, // Unturned blue water
      transparent: true,
      opacity: 0.75,
      flatShading: true
    });

    this.waterMesh = new THREE.Mesh(waterGeo, waterMat);
    this.waterMesh.position.y = 0.0;
    this.scene.add(this.waterMesh);
  }

  // Helper to sample height at (x, z)
  getHeightAt(x, z) {
    if (!this.terrainMesh) return 0;
    const dist = Math.sqrt(x * x + z * z);
    const maxR = this.mapSize * 0.44;

    let y = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 3.5;
    y += Math.sin(x * 0.09 + 1.2) * Math.cos(z * 0.09) * 1.8;

    const distTown = Math.hypot(x - (-40), z - 20);
    if (distTown < 45) y = y * (distTown / 45) * 0.2 + 0.5;

    const distMil = Math.hypot(x - 60, z - (-50));
    if (distMil < 40) y = y * (distMil / 40) * 0.15 + 1.0;

    const distFarm = Math.hypot(x - 40, z - 50);
    if (distFarm < 40) y = y * (distFarm / 40) * 0.2 + 0.8;

    if (dist > maxR * 0.65) {
      const falloff = (dist - maxR * 0.65) / (maxR * 0.35);
      y -= Math.pow(falloff, 2) * 14;
    }
    return Math.max(-8, y + 1.2);
  }

  // --- ROADS ---
  createRoads() {
    const roadMat = new THREE.MeshLambertMaterial({
      map: textures.getRoadTexture()
    });

    // Main Highway Segment: Stratford -> Farm -> Military Base
    const roadPoints = [
      new THREE.Vector3(-60, 0, 20),
      new THREE.Vector3(-40, 0, 20),
      new THREE.Vector3(-10, 0, 30),
      new THREE.Vector3(20, 0, 45),
      new THREE.Vector3(40, 0, 50),
      new THREE.Vector3(55, 0, 20),
      new THREE.Vector3(60, 0, -20),
      new THREE.Vector3(60, 0, -50)
    ];

    for (let i = 0; i < roadPoints.length - 1; i++) {
      const p1 = roadPoints[i];
      const p2 = roadPoints[i + 1];

      const len = p1.distanceTo(p2);
      const roadGeo = new THREE.PlaneGeometry(5, len);
      roadGeo.rotateX(-Math.PI / 2);

      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      const midX = (p1.x + p2.x) / 2;
      const midZ = (p1.z + p2.z) / 2;
      const midY = this.getHeightAt(midX, midZ) + 0.08;

      roadMesh.position.set(midX, midY, midZ);
      const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z);
      roadMesh.rotation.y = angle;
      roadMesh.receiveShadow = true;
      this.scene.add(roadMesh);
    }
  }

  // --- STRATFORD TOWN ---
  createStratfordTown() {
    const townCenter = { x: -40, z: 20 };

    // Houses around town square
    const houseConfigs = [
      { x: -55, z: 10, rot: 0, color: 0x3b82f6 }, // Blue House
      { x: -55, z: 30, rot: 0, color: 0xef4444 }, // Red House
      { x: -25, z: 10, rot: Math.PI, color: 0x10b981 }, // Green House
      { x: -25, z: 30, rot: Math.PI, color: 0xf59e0b }, // Yellow House
      { x: -40, z: -2, rot: Math.PI / 2, color: 0x8b5cf6 } // Purple House
    ];

    houseConfigs.forEach((cfg) => {
      const y = this.getHeightAt(cfg.x, cfg.z);
      const house = ModelFactory.createHouse(cfg.color, 0x1e293b);
      house.position.set(cfg.x, y, cfg.z);
      house.rotation.y = cfg.rot;
      this.scene.add(house);
      this.buildings.push(house);

      // Register door as interactive
      if (house.door) {
        house.door.userData.housePos = house.position;
        this.doors.push(house.door);
      }

      // Building bounding box collider
      const box = new THREE.Box3().setFromObject(house);
      this.colliders.push({ type: 'box', box, mesh: house });
    });

    // Parked Civilian Offroader in Stratford
    const carY = this.getHeightAt(-40, 20);
    const car = ModelFactory.createOffroader();
    car.position.set(-40, carY + 0.2, 20);
    car.rotation.y = Math.PI / 3;
    this.scene.add(car);
    this.vehicles.push(car);
  }

  // --- O'LEARY MILITARY BASE ---
  createMilitaryBase() {
    const baseCenter = { x: 60, z: -50 };

    // 4 Watchtowers at corners
    const towers = [
      { x: 42, z: -68 },
      { x: 78, z: -68 },
      { x: 42, z: -32 },
      { x: 78, z: -32 }
    ];

    towers.forEach((t) => {
      const y = this.getHeightAt(t.x, t.z);
      const tower = ModelFactory.createWatchtower();
      tower.position.set(t.x, y, t.z);
      this.scene.add(tower);
      this.buildings.push(tower);
      const box = new THREE.Box3().setFromObject(tower);
      this.colliders.push({ type: 'box', box, mesh: tower });
    });

    // Military Tents in center
    const tentMat = new THREE.MeshLambertMaterial({ color: 0x3f4f34 }); // Olive drab
    const tentPositions = [
      { x: 55, z: -50 },
      { x: 65, z: -50 }
    ];

    tentPositions.forEach((pos) => {
      const y = this.getHeightAt(pos.x, pos.z);
      const tentGeo = new THREE.CylinderGeometry(2.5, 3.2, 3.2, 4);
      tentGeo.rotateY(Math.PI / 4);
      const tent = new THREE.Mesh(tentGeo, tentMat);
      tent.position.set(pos.x, y + 1.6, pos.z);
      tent.castShadow = true;
      this.scene.add(tent);
      const box = new THREE.Box3().setFromObject(tent);
      this.colliders.push({ type: 'box', box, mesh: tent });
    });

    // Military Offroader parked at base
    const milCarY = this.getHeightAt(60, -36);
    const milCar = ModelFactory.createOffroader();
    milCar.position.set(60, milCarY + 0.2, -36);
    milCar.rotation.y = -Math.PI / 2;
    // Military green paint job
    milCar.traverse((child) => {
      if (child.isMesh && child.material.color.getHex() === 0x1e3a8a) {
        child.material = new THREE.MeshLambertMaterial({ color: 0x2e3d23 });
      }
    });
    this.scene.add(milCar);
    this.vehicles.push(milCar);
  }

  // --- ALBERTON FARM ---
  createAlbertonFarm() {
    const farmCenter = { x: 40, z: 50 };
    const y = this.getHeightAt(farmCenter.x, farmCenter.z);

    const barn = ModelFactory.createBarn();
    barn.position.set(farmCenter.x, y, farmCenter.z);
    this.scene.add(barn);
    this.buildings.push(barn);

    const box = new THREE.Box3().setFromObject(barn);
    this.colliders.push({ type: 'box', box, mesh: barn });

    // Hay Bales
    const hayMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
    for (let i = 0; i < 5; i++) {
      const bx = 32 + (i % 3) * 2.2;
      const bz = 40 + Math.floor(i / 3) * 2.2;
      const by = this.getHeightAt(bx, bz);
      const bale = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.2, 8), hayMat);
      bale.position.set(bx, by + 0.6, bz);
      bale.rotation.z = Math.PI / 2;
      bale.castShadow = true;
      this.scene.add(bale);
    }
  }

  // --- CAMPGROUND ---
  createCampground() {
    const campX = -10;
    const campZ = -30;
    const y = this.getHeightAt(campX, campZ);

    const campfire = ModelFactory.createCampfire();
    campfire.position.set(campX, y, campZ);
    this.scene.add(campfire);
  }

  // --- LIGHTHOUSE ---
  createLighthouse() {
    const lx = -105;
    const lz = -75;
    const y = this.getHeightAt(lx, lz);

    const group = new THREE.Group();
    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
    const redMat = new THREE.MeshLambertMaterial({ color: 0xb91c1c });

    // Tower sections (striped red & white)
    for (let i = 0; i < 5; i++) {
      const mat = i % 2 === 0 ? whiteMat : redMat;
      const rBot = 3.2 - i * 0.3;
      const rTop = 2.9 - i * 0.3;
      const sec = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, 3.5, 8), mat);
      sec.position.y = 1.75 + i * 3.5;
      sec.castShadow = true;
      group.add(sec);
    }

    // Lantern room at top
    const lamp = new THREE.PointLight(0xfef08a, 4.0, 90);
    lamp.position.y = 19;
    group.add(lamp);

    group.position.set(lx, y, lz);
    this.scene.add(group);
    this.buildings.push(group);
  }

  // --- PINE TREE FORESTS ---
  populateForests() {
    const count = 120;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 25 + Math.random() * (this.mapSize * 0.38);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Don't spawn trees on top of towns or roads
      const distTown = Math.hypot(x - (-40), z - 20);
      const distMil = Math.hypot(x - 60, z - (-50));
      const distFarm = Math.hypot(x - 40, z - 50);
      if (distTown < 32 || distMil < 30 || distFarm < 26) continue;

      const y = this.getHeightAt(x, z);
      if (y < 0.8) continue; // In water

      const tree = ModelFactory.createPineTree(7 + Math.random() * 3.5);
      tree.position.set(x, y, z);
      tree.rotation.y = Math.random() * Math.PI * 2;
      this.scene.add(tree);
      this.trees.push(tree);

      // Add tree trunk collider
      this.colliders.push({
        type: 'cylinder',
        pos: new THREE.Vector2(x, z),
        radius: 0.6,
        tree
      });
    }
  }

  // --- LOOT CRATES ---
  spawnLootCrates() {
    const crateLocations = [
      // Military Base High Tier Crates
      { x: 62, z: -52, type: 'military', loot: ['timberwolf', 'maplestrike', 'military_ammo'] },
      { x: 57, z: -48, type: 'military', loot: ['maplestrike', 'medkit', 'vaccine'] },
      { x: 74, z: -64, type: 'military', loot: ['military_ammo', 'bluntforce', 'shotgun_shells'] },

      // Stratford Town Crates
      { x: -52, z: 12, type: 'civilian', loot: ['colt', 'civilian_ammo', 'bandage'] },
      { x: -52, z: 32, type: 'civilian', loot: ['canned_beans', 'bottled_water', 'bandage'] },
      { x: -28, z: 12, type: 'civilian', loot: ['fireaxe', 'soda', 'canned_beans'] },
      { x: -28, z: 32, type: 'civilian', loot: ['baseballbat', 'civilian_ammo'] },

      // Alberton Farm Crates
      { x: 42, z: 52, type: 'farm', loot: ['bluntforce', 'shotgun_shells', 'canned_beans'] },
      { x: 34, z: 42, type: 'farm', loot: ['fireaxe', 'bottled_water'] },

      // Campground
      { x: -12, z: -28, type: 'civilian', loot: ['bandage', 'canned_beans', 'bottled_water'] }
    ];

    crateLocations.forEach((loc) => {
      const y = this.getHeightAt(loc.x, loc.z);
      const crate = ModelFactory.createLootCrate(loc.type);
      crate.position.set(loc.x, y, loc.z);
      crate.userData.loot = loc.loot;
      this.scene.add(crate);
      this.lootSpawns.push(crate);

      const box = new THREE.Box3().setFromObject(crate);
      this.colliders.push({ type: 'box', box, mesh: crate });
    });
  }

  // Check collision for a sphere at (x, z) with radius r
  checkCollision(x, z, radius = 0.5) {
    for (const c of this.colliders) {
      if (c.type === 'cylinder') {
        const dx = x - c.pos.x;
        const dz = z - c.pos.y;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < radius + c.radius) {
          const pushAngle = Math.atan2(dz, dx);
          const overlap = radius + c.radius - dist;
          return {
            collided: true,
            pushX: Math.cos(pushAngle) * overlap,
            pushZ: Math.sin(pushAngle) * overlap
          };
        }
      } else if (c.type === 'box') {
        if (
          x + radius > c.box.min.x &&
          x - radius < c.box.max.x &&
          z + radius > c.box.min.z &&
          z - radius < c.box.max.z
        ) {
          // Push out along minimum overlap axis
          const left = x + radius - c.box.min.x;
          const right = c.box.max.x - (x - radius);
          const top = z + radius - c.box.min.z;
          const bottom = c.box.max.z - (z - radius);
          const minOverlap = Math.min(left, right, top, bottom);

          let pushX = 0, pushZ = 0;
          if (minOverlap === left) pushX = -left;
          else if (minOverlap === right) pushX = right;
          else if (minOverlap === top) pushZ = -top;
          else pushZ = bottom;

          return { collided: true, pushX, pushZ };
        }
      }
    }
    return { collided: false, pushX: 0, pushZ: 0 };
  }
}
