// Unturned Web - Main Game Engine, Day/Night Cycle & UI Orchestrator
import * as THREE from './three.module.js';
import { WorldManager } from './world.js';
import { ZombieManager } from './zombies.js';
import { VehicleManager } from './vehicles.js';
import { InventoryManager, ITEM_DEFS, CRAFTING_RECIPES } from './inventory.js';
import { PlayerController } from './player.js';
import { sound } from './audio.js';

export class UnturnedGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = {};
    this.gameState = 'menu'; // menu, playing, inventory, paused, dead
    this.timeOfDay = 0.25; // 0.0 to 1.0 (0.25 = morning, 0.5 = noon, 0.75 = sunset, 0.0/1.0 = midnight)
    this.dayDuration = 180; // 3 minutes per full 24-hr day/night cycle
    this.mouseSensitivity = 0.0022;

    this.initRenderer();
    this.initScene();
    this.initSystems();
    this.initListeners();

    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Day sky blue
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.006);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      600
    );
    this.scene.add(this.camera);

    // Sun & Moon Directional Light
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 250;
    this.sunLight.shadow.camera.left = -60;
    this.sunLight.shadow.camera.right = 60;
    this.sunLight.shadow.camera.top = 60;
    this.sunLight.shadow.camera.bottom = -60;
    this.scene.add(this.sunLight);

    // Ambient Sky Light
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0x3d5a2b, 0.6);
    this.scene.add(this.hemiLight);
  }

  initSystems() {
    this.world = new WorldManager(this.scene);
    this.world.generateWorld();

    this.inv = new InventoryManager();
    this.zombies = new ZombieManager(this.scene, this.world);
    this.vehicles = new VehicleManager(this.scene, this.world);

    this.player = new PlayerController(
      this.camera,
      this.scene,
      this.world,
      this.inv,
      this.zombies,
      this.vehicles
    );

    this.zombies.spawnInitialZombies();
  }

  initListeners() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (e.code === 'KeyF' || e.code === 'KeyE') {
        if (this.gameState === 'playing') this.player.interact();
      }

      if (e.code === 'KeyR') {
        if (this.gameState === 'playing') this.player.reload();
      }

      if (e.code === 'KeyV') {
        if (this.gameState === 'playing') this.player.toggleCameraMode();
      }

      if (e.code === 'KeyH') {
        if (this.gameState === 'playing' && this.vehicles.isDriving()) {
          this.vehicles.honk();
        }
      }

      if (e.code === 'KeyL') {
        if (this.gameState === 'playing') {
          if (this.vehicles.isDriving()) this.vehicles.toggleHeadlights();
          else this.player.toggleFlashlight();
        }
      }

      // Hotbar selection 1-5
      if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5'].includes(e.code)) {
        const slot = parseInt(e.code.replace('Digit', '')) - 1;
        this.inv.selectHotbarIndex(slot);
        this.player.equipActiveWeapon();
        this.updateHUD();
      }

      // Toggle Inventory (Tab or G)
      if (e.code === 'Tab' || e.code === 'KeyG') {
        e.preventDefault();
        if (this.gameState === 'playing') {
          this.openInventory();
        } else if (this.gameState === 'inventory') {
          this.closeInventory();
        }
      }

      // Pause menu
      if (e.code === 'Escape') {
        if (this.gameState === 'inventory') {
          this.closeInventory();
        } else if (this.gameState === 'playing') {
          this.pauseGame();
        } else if (this.gameState === 'paused') {
          this.resumeGame();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Pointer Lock & Mouse Look
    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === this.canvas && this.gameState === 'playing') {
        this.player.rotation.y -= e.movementX * this.mouseSensitivity;
        this.player.rotation.x = Math.max(
          -1.45,
          Math.min(1.45, this.player.rotation.x - e.movementY * this.mouseSensitivity)
        );
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (this.gameState !== 'playing') return;

      if (e.button === 0) {
        // Left click: Fire weapon
        this.player.shoot((isHeadshot) => {
          this.triggerHitmarker(isHeadshot);
        });
      } else if (e.button === 2) {
        // Right click: Aim Down Sights (ADS)
        this.player.isAiming = true;
      }
    });

    this.canvas.addEventListener('mouseup', (e) => {
      if (e.button === 2) {
        this.player.isAiming = false;
      }
    });

    // Prevent right click menu
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse scroll for hotbar
    window.addEventListener('wheel', (e) => {
      if (this.gameState === 'playing') {
        let newIdx = this.inv.selectedHotbarIndex + (e.deltaY > 0 ? 1 : -1);
        if (newIdx < 0) newIdx = 4;
        if (newIdx > 4) newIdx = 0;
        this.inv.selectHotbarIndex(newIdx);
        this.player.equipActiveWeapon();
        this.updateHUD();
      }
    });
  }

  startGame() {
    this.gameState = 'playing';
    sound.init();
    sound.startMusic();
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('inventory-modal').classList.add('hidden');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('death-screen').classList.add('hidden');
    this.canvas.requestPointerLock();
  }

  pauseGame() {
    this.gameState = 'paused';
    document.exitPointerLock();
    document.getElementById('pause-menu').classList.remove('hidden');
  }

  resumeGame() {
    this.gameState = 'playing';
    document.getElementById('pause-menu').classList.add('hidden');
    this.canvas.requestPointerLock();
  }

  openInventory() {
    this.gameState = 'inventory';
    document.exitPointerLock();
    document.getElementById('inventory-modal').classList.remove('hidden');
    this.renderInventoryModal();
  }

  closeInventory() {
    this.gameState = 'playing';
    document.getElementById('inventory-modal').classList.add('hidden');
    this.canvas.requestPointerLock();
    this.player.equipActiveWeapon();
    this.updateHUD();
  }

  respawn() {
    this.player.health = 100;
    this.player.hunger = 100;
    this.player.thirst = 100;
    this.player.stamina = 100;
    this.player.immunity = 100;
    this.player.isBleeding = false;
    this.player.isDead = false;
    this.player.position.set(-40, 2, 20); // Stratford Town
    this.player.velocity.set(0, 0, 0);

    document.getElementById('death-screen').classList.add('hidden');
    this.startGame();
  }

  triggerHitmarker(isHeadshot = false) {
    const el = document.getElementById('hitmarker');
    if (!el) return;
    el.className = `hitmarker-active ${isHeadshot ? 'headshot' : 'body'}`;
    clearTimeout(this.hitmarkerTimeout);
    this.hitmarkerTimeout = setTimeout(() => {
      el.className = 'hitmarker-hidden';
    }, 120);
  }

  updateDayNightCycle(delta) {
    this.timeOfDay = (this.timeOfDay + delta / this.dayDuration) % 1.0;

    // Sun angle
    const sunAngle = this.timeOfDay * Math.PI * 2;
    const sunDist = 120;
    const sunX = Math.cos(sunAngle) * sunDist;
    const sunY = Math.sin(sunAngle) * sunDist;

    this.sunLight.position.set(
      this.player.position.x + sunX,
      this.player.position.y + sunY,
      this.player.position.z + 40
    );
    this.sunLight.target.position.copy(this.player.position);

    // Day/Night colors & fog
    if (sunY > 0) {
      // Daytime
      const intensity = Math.min(1.8, Math.max(0.2, (sunY / sunDist) * 1.9));
      this.sunLight.intensity = intensity;
      this.sunLight.color.setHex(0xfffaed);

      // Sky color transition
      const skyR = THREE.MathUtils.lerp(0.15, 0.53, sunY / sunDist);
      const skyG = THREE.MathUtils.lerp(0.25, 0.81, sunY / sunDist);
      const skyB = THREE.MathUtils.lerp(0.45, 0.92, sunY / sunDist);
      const skyCol = new THREE.Color(skyR, skyG, skyB);
      this.scene.background = skyCol;
      this.scene.fog.color = skyCol;
    } else {
      // Nighttime
      this.sunLight.intensity = 0.25;
      this.sunLight.color.setHex(0x93c5fd); // Cool blue moon light

      const nightCol = new THREE.Color(0x060914);
      this.scene.background = nightCol;
      this.scene.fog.color = nightCol;
    }
  }

  updateHUD() {
    if (this.gameState !== 'playing' && this.gameState !== 'inventory') return;

    // Bars
    document.getElementById('hp-bar').style.width = `${Math.max(0, this.player.health)}%`;
    document.getElementById('hp-text').innerText = `${Math.round(this.player.health)}%`;

    document.getElementById('hunger-bar').style.width = `${Math.max(0, this.player.hunger)}%`;
    document.getElementById('hunger-text').innerText = `${Math.round(this.player.hunger)}%`;

    document.getElementById('thirst-bar').style.width = `${Math.max(0, this.player.thirst)}%`;
    document.getElementById('thirst-text').innerText = `${Math.round(this.player.thirst)}%`;

    document.getElementById('stamina-bar').style.width = `${Math.max(0, this.player.stamina)}%`;
    document.getElementById('stamina-text').innerText = `${Math.round(this.player.stamina)}%`;

    document.getElementById('immunity-bar').style.width = `${Math.max(0, this.player.immunity)}%`;
    document.getElementById('immunity-text').innerText = `${Math.round(this.player.immunity)}%`;

    // Bleeding indicator
    const bleedVignette = document.getElementById('bleed-vignette');
    if (this.player.isBleeding) {
      bleedVignette.classList.remove('hidden');
    } else {
      bleedVignette.classList.add('hidden');
    }

    // Weapon & Ammo
    const activeItem = this.inv.getActiveItem();
    if (activeItem) {
      const def = ITEM_DEFS[activeItem.id];
      document.getElementById('weapon-name').innerText = def.name;
      if (def.type === 'gun') {
        const mag = this.inv.weaponMagazines[def.id] || 0;
        const res = this.inv.ammoPool[def.ammoType] || 0;
        document.getElementById('ammo-counter').innerText = `${mag} / ${res}`;
      } else if (def.type === 'melee') {
        document.getElementById('ammo-counter').innerText = 'MELEE';
      } else {
        document.getElementById('ammo-counter').innerText = `x${activeItem.count}`;
      }
    } else {
      document.getElementById('weapon-name').innerText = 'Fists';
      document.getElementById('ammo-counter').innerText = 'UNARMED';
    }

    // Hotbar slots update
    for (let i = 0; i < 5; i++) {
      const slotEl = document.getElementById(`hotbar-${i}`);
      const item = this.inv.hotbar[i];
      if (slotEl) {
        slotEl.className = `hotbar-slot ${i === this.inv.selectedHotbarIndex ? 'active' : ''}`;
        if (item) {
          const def = ITEM_DEFS[item.id];
          slotEl.innerHTML = `
            <div class="slot-num">${i + 1}</div>
            <div class="slot-icon">${def.icon}</div>
            ${item.count > 1 ? `<div class="slot-count">${item.count}</div>` : ''}
          `;
        } else {
          slotEl.innerHTML = `<div class="slot-num">${i + 1}</div>`;
        }
      }
    }

    // Compass & Location indicator
    const p = this.player.position;
    let locName = 'Wilderness';
    if (Math.hypot(p.x - (-40), p.z - 20) < 40) locName = 'Stratford Town';
    else if (Math.hypot(p.x - 60, p.z - (-50)) < 40) locName = "O'Leary Military Base";
    else if (Math.hypot(p.x - 40, p.z - 50) < 35) locName = 'Alberton Farm';
    else if (Math.hypot(p.x - (-10), p.z - (-30)) < 25) locName = 'Campgrounds';
    else if (Math.hypot(p.x - (-105), p.z - (-75)) < 30) locName = 'Lighthouse Point';
    document.getElementById('location-display').innerText = locName;

    // Interaction hint
    const hintEl = document.getElementById('interaction-hint');
    if (this.vehicles.isDriving()) {
      hintEl.innerText = '[F] Exit Vehicle  |  [H] Horn  |  [L] Headlights';
      hintEl.classList.remove('hidden');
    } else {
      const closeCar = this.vehicles.getClosestVehicle(this.player.position);
      if (closeCar) {
        hintEl.innerText = '[F] Drive Offroader';
        hintEl.classList.remove('hidden');
      } else {
        hintEl.classList.add('hidden');
      }
    }
  }

  renderInventoryModal() {
    const gridEl = document.getElementById('inv-grid');
    gridEl.innerHTML = '';

    // Render 15 backpack slots
    this.inv.backpack.forEach((item, idx) => {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      if (item) {
        const def = ITEM_DEFS[item.id];
        slot.innerHTML = `
          <div class="slot-icon">${def.icon}</div>
          <div class="slot-title">${def.name}</div>
          ${item.count > 1 ? `<div class="slot-count">x${item.count}</div>` : ''}
        `;
        slot.onclick = () => {
          // Use / consume or move to hotbar
          if (def.type === 'food' || def.type === 'drink' || def.type === 'medical') {
            this.player.consumeItem(item);
            if (item.count <= 0) this.inv.backpack[idx] = null;
            this.renderInventoryModal();
            this.updateHUD();
          }
        };
      }
      gridEl.appendChild(slot);
    });

    // Render Crafting Recipes
    const craftList = document.getElementById('crafting-list');
    craftList.innerHTML = '';
    CRAFTING_RECIPES.forEach((rec) => {
      const canCraft = this.inv.canCraft(rec);
      const row = document.createElement('div');
      row.className = `craft-row ${canCraft ? 'craftable' : 'disabled'}`;
      row.innerHTML = `
        <div class="craft-info">
          <div class="craft-name">${rec.name}</div>
          <div class="craft-desc">${rec.desc}</div>
        </div>
        <button class="craft-btn" ${canCraft ? '' : 'disabled'}>Craft</button>
      `;
      row.querySelector('button').onclick = () => {
        if (this.inv.craft(rec.id)) {
          this.renderInventoryModal();
          this.updateHUD();
        }
      };
      craftList.appendChild(row);
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    const now = performance.now();
    const delta = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    if (this.gameState === 'menu') {
      // Rotating panoramic menu view
      const angle = now * 0.0003;
      this.camera.position.set(
        -40 + Math.cos(angle) * 35,
        18,
        20 + Math.sin(angle) * 35
      );
      this.camera.lookAt(-40, 4, 20);
      this.updateDayNightCycle(delta);
    } else if (this.gameState === 'playing') {
      this.updateDayNightCycle(delta);
      this.player.update(delta, this.keys);

      this.zombies.update(
        delta,
        this.player.position,
        (dmg, type) => this.player.takeDamage(dmg, type),
        (z) => {}
      );

      this.updateHUD();

      // Check player death
      if (this.player.isDead) {
        this.gameState = 'dead';
        document.exitPointerLock();
        document.getElementById('hud').classList.add('hidden');
        document.getElementById('death-screen').classList.remove('hidden');
        document.getElementById('death-kills').innerText = this.player.kills;
        document.getElementById('death-headshots').innerText = this.player.headshots;
        document.getElementById('death-time').innerText = `${Math.floor(this.player.survivalSeconds)}s`;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
