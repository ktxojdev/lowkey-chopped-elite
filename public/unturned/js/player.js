// Unturned Web - Player Controller, Combat & Survival Mechanics
import * as THREE from './three.module.js';
import { ModelFactory } from './models.js';
import { ITEM_DEFS } from './inventory.js';
import { sound } from './audio.js';

export class PlayerController {
  constructor(camera, scene, worldManager, inventoryManager, zombieManager, vehicleManager) {
    this.camera = camera;
    this.scene = scene;
    this.world = worldManager;
    this.inv = inventoryManager;
    this.zombies = zombieManager;
    this.vehicles = vehicleManager;

    // Player 3D mesh (for 3rd person and shadows)
    this.mesh = ModelFactory.createPlayer(false);
    this.scene.add(this.mesh);

    // First person weapon container attached to camera
    this.fpsWeaponPivot = new THREE.Group();
    this.fpsWeaponPivot.position.set(0.24, -0.22, -0.45);
    this.camera.add(this.fpsWeaponPivot);
    this.activeFpsWeaponMesh = null;

    // Tactical Flashlight attached to camera
    this.flashlight = new THREE.SpotLight(0xfffae0, 2.5, 35, Math.PI / 6, 0.4);
    this.flashlight.position.set(0, 0, 0);
    this.flashlight.target.position.set(0, 0, -10);
    this.flashlight.visible = false;
    this.camera.add(this.flashlight);
    this.camera.add(this.flashlight.target);

    // Placement Ghost for building barricades & campfires
    this.placementGhost = null;

    // Position & Physics
    this.position = new THREE.Vector3(-40, 1.8, 20); // Stratford Town starter spawn
    this.velocity = new THREE.Vector3();
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.isGrounded = true;
    this.isCrouching = false;
    this.isSprinting = false;
    this.isAiming = false;
    this.isFirstPerson = true;

    // Survival Vitals (0 - 100)
    this.health = 100;
    this.maxHealth = 100;
    this.hunger = 100;
    this.thirst = 100;
    this.stamina = 100;
    this.immunity = 100;
    this.isBleeding = false;
    this.bleedTimer = 0;
    this.isDead = false;

    // Stats
    this.kills = 0;
    this.headshots = 0;
    this.survivalSeconds = 0;

    // Combat timers
    this.lastFireTime = 0;
    this.recoilOffset = new THREE.Vector3();
    this.recoilRot = new THREE.Euler();
    this.isReloading = false;

    // Camera raycaster for shooting & interaction
    this.raycaster = new THREE.Raycaster();

    this.equipActiveWeapon();
  }

  equipActiveWeapon() {
    // Clear old weapon mesh
    if (this.activeFpsWeaponMesh) {
      this.fpsWeaponPivot.remove(this.activeFpsWeaponMesh);
      this.activeFpsWeaponMesh = null;
    }

    const item = this.inv.getActiveItem();
    if (!item) return;

    const def = ITEM_DEFS[item.id];
    if (!def) return;

    if (def.category === 'weapon' || def.category === 'tool') {
      const weaponMesh = ModelFactory.createWeapon(item.id);
      this.activeFpsWeaponMesh = weaponMesh;
      this.fpsWeaponPivot.add(weaponMesh);
    } else if (def.category === 'building') {
      // Create placement ghost
      if (this.placementGhost) this.scene.remove(this.placementGhost);
      this.placementGhost = item.id === 'campfire' ? ModelFactory.createCampfire() : ModelFactory.createBarricade();
      this.placementGhost.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: 0x4ade80,
            transparent: true,
            opacity: 0.5,
            wireframe: true
          });
        }
      });
      this.scene.add(this.placementGhost);
    }
  }

  toggleCameraMode() {
    this.isFirstPerson = !this.isFirstPerson;
    if (this.isFirstPerson) {
      this.mesh.head.visible = false;
      this.mesh.torso.visible = false;
      this.mesh.rightLeg.visible = false;
      this.mesh.leftLeg.visible = false;
      this.fpsWeaponPivot.visible = true;
    } else {
      this.mesh.head.visible = true;
      this.mesh.torso.visible = true;
      this.mesh.rightLeg.visible = true;
      this.mesh.leftLeg.visible = true;
      this.fpsWeaponPivot.visible = false;
    }
  }

  toggleFlashlight() {
    this.flashlight.visible = !this.flashlight.visible;
    sound.playEmptyClick();
  }

  shoot(onHitmarker) {
    if (this.isDead || this.isReloading || this.vehicles.isDriving()) return;

    const item = this.inv.getActiveItem();
    if (!item) {
      // Unarmed punch
      this.meleeAttack(20, onHitmarker);
      return;
    }

    const def = ITEM_DEFS[item.id];
    const now = performance.now() / 1000;

    if (def.type === 'gun') {
      if (now - this.lastFireTime < def.fireRate) return;

      const currentMag = this.inv.weaponMagazines[def.id] || 0;
      if (currentMag <= 0) {
        sound.playEmptyClick();
        this.reload();
        return;
      }

      // Fire weapon!
      this.lastFireTime = now;
      this.inv.weaponMagazines[def.id]--;
      sound.playShoot(def.id);

      // Alert nearby zombies to gunfire noise
      this.zombies.alertZombiesInRange(this.position, def.range * 0.4);

      // Recoil kick
      this.recoilOffset.z = 0.08;
      this.recoilOffset.y = 0.04;
      this.recoilRot.x = def.recoil;

      // Raycast bullet
      const pellets = def.pellets || 1;
      for (let p = 0; p < pellets; p++) {
        const spreadX = (Math.random() - 0.5) * (this.isAiming ? def.spread * 0.3 : def.spread);
        const spreadY = (Math.random() - 0.5) * (this.isAiming ? def.spread * 0.3 : def.spread);

        this.raycaster.setFromCamera(new THREE.Vector2(spreadX, spreadY), this.camera);
        const zombieMeshes = this.zombies.zombies.filter(z => !z.isDead).map(z => z.mesh);
        const hits = this.raycaster.intersectObjects(zombieMeshes, true);

        if (hits.length > 0) {
          const hit = hits[0];
          const isHead = hit.object.userData.isHead || (hit.point.y - hit.object.position.y > 1.3);

          // Find zombie instance
          const zInstance = this.zombies.zombies.find(z => {
            let curr = hit.object;
            while (curr) {
              if (curr === z.mesh) return true;
              curr = curr.parent;
            }
            return false;
          });

          if (zInstance) {
            onHitmarker(isHead);
            sound.playHitmarker(isHead);
            if (isHead) this.headshots++;

            const wasDead = zInstance.isDead;
            this.zombies.damageZombie(zInstance, def.damage, isHead);
            if (!wasDead && zInstance.isDead) {
              this.kills++;
            }
          }
        }
      }
    } else if (def.type === 'melee') {
      if (now - this.lastFireTime < def.swingRate) return;
      this.lastFireTime = now;
      this.meleeAttack(def.damage, onHitmarker, def.treeChopDamage);
    } else if (def.type === 'placeable') {
      // Place Barricade or Campfire in world
      this.placeObject(item.id);
    } else if (def.type === 'medical' || def.type === 'food' || def.type === 'drink') {
      this.consumeItem(item);
    }
  }

  meleeAttack(damage, onHitmarker, treeDamage = 20) {
    sound.playMeleeSwing();

    // Weapon swing animation
    this.recoilRot.x = 0.45;
    this.recoilRot.y = -0.3;

    // Check hit forward
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

    // Check trees first
    const treeMeshes = this.world.trees.filter(t => !t.isChopped);
    const treeHits = this.raycaster.intersectObjects(treeMeshes, true);
    if (treeHits.length > 0 && treeHits[0].distance < 3.0) {
      const hit = treeHits[0];
      let treeGroup = hit.object;
      while (treeGroup && !treeGroup.name.startsWith('tree_')) {
        treeGroup = treeGroup.parent;
      }
      if (treeGroup && !treeGroup.isChopped) {
        sound.playHitWood();
        treeGroup.treeHealth -= treeDamage;
        // Shake tree
        treeGroup.rotation.z = (Math.random() - 0.5) * 0.1;
        setTimeout(() => { treeGroup.rotation.z = 0; }, 100);

        if (treeGroup.treeHealth <= 0) {
          treeGroup.isChopped = true;
          sound.playTreeFall();
          treeGroup.rotation.x = Math.PI / 2.2;
          // Spawn 2 Pine Logs into player inventory or on ground
          this.inv.addItem('pine_log', 2);
        }
        return;
      }
    }

    // Check zombies
    const zombieMeshes = this.zombies.zombies.filter(z => !z.isDead).map(z => z.mesh);
    const hits = this.raycaster.intersectObjects(zombieMeshes, true);
    if (hits.length > 0 && hits[0].distance < 2.8) {
      const hit = hits[0];
      const isHead = hit.object.userData.isHead || (hit.point.y - hit.object.position.y > 1.3);

      const zInstance = this.zombies.zombies.find(z => {
        let curr = hit.object;
        while (curr) {
          if (curr === z.mesh) return true;
          curr = curr.parent;
        }
        return false;
      });

      if (zInstance) {
        onHitmarker(isHead);
        sound.playHitmarker(isHead);
        if (isHead) this.headshots++;

        const wasDead = zInstance.isDead;
        this.zombies.damageZombie(zInstance, damage, isHead);
        if (!wasDead && zInstance.isDead) this.kills++;
      }
    }
  }

  placeObject(itemId) {
    if (!this.placementGhost) return;

    // Check inventory
    if (this.inv.getItemCount(itemId) <= 0) return;

    const spawnPos = new THREE.Vector3();
    this.placementGhost.getWorldPosition(spawnPos);

    let placedMesh;
    if (itemId === 'campfire') {
      placedMesh = ModelFactory.createCampfire();
    } else {
      placedMesh = ModelFactory.createBarricade();
      const box = new THREE.Box3().setFromObject(placedMesh);
      this.world.colliders.push({ type: 'box', box, mesh: placedMesh });
    }

    placedMesh.position.copy(spawnPos);
    placedMesh.rotation.y = this.rotation.y;
    this.scene.add(placedMesh);

    // Consume item
    const active = this.inv.getActiveItem();
    this.inv.removeItem('hotbar', this.inv.selectedHotbarIndex, 1);
    sound.playHitWood();

    if (this.inv.getItemCount(itemId) <= 0) {
      if (this.placementGhost) {
        this.scene.remove(this.placementGhost);
        this.placementGhost = null;
      }
    }
  }

  consumeItem(item) {
    const def = ITEM_DEFS[item.id];
    if (!def) return;

    if (def.healAmount) {
      this.health = Math.min(this.maxHealth, this.health + def.healAmount);
      sound.playBandage();
    }
    if (def.curesBleed) {
      this.isBleeding = false;
    }
    if (def.immunityAmount) {
      this.immunity = Math.min(100, this.immunity + def.immunityAmount);
    }
    if (def.hungerAmount) {
      this.hunger = Math.min(100, this.hunger + def.hungerAmount);
      sound.playEat();
    }
    if (def.thirstAmount) {
      this.thirst = Math.min(100, this.thirst + def.thirstAmount);
      sound.playDrink();
    }
    if (def.staminaAmount) {
      this.stamina = Math.min(100, this.stamina + def.staminaAmount);
    }

    this.inv.removeItem('hotbar', this.inv.selectedHotbarIndex, 1);
  }

  reload() {
    if (this.isReloading) return;
    const item = this.inv.getActiveItem();
    if (!item) return;

    const def = ITEM_DEFS[item.id];
    if (def.type !== 'gun') return;

    const currentMag = this.inv.weaponMagazines[def.id] || 0;
    const needed = def.magSize - currentMag;
    if (needed <= 0) return;

    const availableReserve = this.inv.ammoPool[def.ammoType] || 0;
    if (availableReserve <= 0) {
      sound.playEmptyClick();
      return;
    }

    this.isReloading = true;
    sound.playReload();

    // Weapon dip animation
    this.recoilOffset.y = -0.2;
    this.recoilRot.z = 0.3;

    setTimeout(() => {
      const toLoad = Math.min(needed, this.inv.ammoPool[def.ammoType]);
      this.inv.weaponMagazines[def.id] += toLoad;
      this.inv.ammoPool[def.ammoType] -= toLoad;
      this.isReloading = false;
      this.recoilOffset.y = 0;
      this.recoilRot.z = 0;
    }, 1200);
  }

  takeDamage(amount, source = 'zombie') {
    if (this.isDead) return;

    this.health = Math.max(0, this.health - amount);
    sound.playHitFlesh();

    // Infection risk
    if (source === 'zombie' || source === 'military' || source === 'mega') {
      this.immunity = Math.max(0, this.immunity - (source === 'mega' ? 25 : 8));
      if (Math.random() < 0.35) this.isBleeding = true;
    }

    if (this.health <= 0) {
      this.isDead = true;
      sound.playZombieDeath();
    }
  }

  interact() {
    if (this.isDead) return;

    // Check if in vehicle -> exit
    if (this.vehicles.isDriving()) {
      const exitPos = this.vehicles.exitVehicle();
      if (exitPos) {
        this.position.copy(exitPos);
        this.mesh.visible = true;
      }
      return;
    }

    // Check closest vehicle to enter
    const closeCar = this.vehicles.getClosestVehicle(this.position);
    if (closeCar) {
      this.vehicles.enterVehicle(closeCar);
      this.mesh.visible = false;
      return;
    }

    // Check doors
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const doorHits = this.raycaster.intersectObjects(this.world.doors);
    if (doorHits.length > 0 && doorHits[0].distance < 3.5) {
      const door = doorHits[0].object;
      door.userData.isOpen = !door.userData.isOpen;
      door.rotation.y = door.userData.isOpen ? Math.PI / 2 : 0;
      sound.playHitWood();
      return;
    }

    // Check loot crates
    const crateHits = this.raycaster.intersectObjects(this.world.lootSpawns, true);
    if (crateHits.length > 0 && crateHits[0].distance < 3.2) {
      let crateGroup = crateHits[0].object;
      while (crateGroup && !crateGroup.userData.loot) {
        crateGroup = crateGroup.parent;
      }
      if (crateGroup && crateGroup.userData.loot && !crateGroup.userData.isLooted) {
        crateGroup.userData.isLooted = true;
        sound.playItemPickup();
        crateGroup.userData.loot.forEach(item => {
          this.inv.addItem(item, 1);
        });
        // Disappear crate
        this.scene.remove(crateGroup);
        return;
      }
    }
  }

  update(delta, inputKeys) {
    if (this.isDead) return;

    // Survival Vitals Tick
    this.survivalSeconds += delta;
    this.hunger = Math.max(0, this.hunger - delta * 0.08);
    this.thirst = Math.max(0, this.thirst - delta * 0.12);

    // Starvation / Dehydration / Bleed damage
    if (this.hunger <= 0 || this.thirst <= 0 || this.immunity <= 0) {
      this.takeDamage(delta * 2.0, 'vitals');
    }
    if (this.isBleeding) {
      this.bleedTimer += delta;
      if (this.bleedTimer >= 2.0) {
        this.bleedTimer = 0;
        this.takeDamage(4, 'bleed');
      }
    }

    // Vehicle Driving Mode
    if (this.vehicles.isDriving()) {
      this.vehicles.update(delta, inputKeys, this.zombies);
      const v = this.vehicles.activeVehicle;
      this.position.copy(v.position);

      // Third-person chase camera behind vehicle
      const camOffset = new THREE.Vector3(0, 3.2, -6.5);
      camOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), v.rotation.y);
      this.camera.position.copy(v.position).add(camOffset);
      this.camera.lookAt(v.position.x, v.position.y + 1.2, v.position.z);
      return;
    }

    // Player Walk / Sprint Movement
    const forward = (inputKeys['KeyW'] || inputKeys['ArrowUp'] ? 1 : 0) - (inputKeys['KeyS'] || inputKeys['ArrowDown'] ? 1 : 0);
    const side = (inputKeys['KeyD'] || inputKeys['ArrowRight'] ? 1 : 0) - (inputKeys['KeyA'] || inputKeys['ArrowLeft'] ? 1 : 0);
    const sprintReq = inputKeys['ShiftLeft'] || inputKeys['ShiftRight'];
    const jumpReq = inputKeys['Space'];
    const crouchReq = inputKeys['KeyC'] || inputKeys['ControlLeft'];

    this.isCrouching = crouchReq;
    const canSprint = sprintReq && forward > 0 && this.stamina > 5 && !this.isCrouching && !this.isAiming;
    this.isSprinting = canSprint;

    if (this.isSprinting) {
      this.stamina = Math.max(0, this.stamina - delta * 20);
    } else {
      this.stamina = Math.min(100, this.stamina + delta * 15);
    }

    let speed = 4.8;
    if (this.isSprinting) speed = 8.2;
    if (this.isCrouching) speed = 2.4;
    if (this.isAiming) speed = 2.8;

    // Movement direction vector
    const moveVector = new THREE.Vector3(side, 0, -forward).normalize();
    moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);

    if (moveVector.lengthSq() > 0.01) {
      const nextX = this.position.x + moveVector.x * speed * delta;
      const nextZ = this.position.z + moveVector.z * speed * delta;

      // Obstacle collision
      const col = this.world.checkCollision(nextX, nextZ, 0.45);
      if (!col.collided) {
        this.position.x = nextX;
        this.position.z = nextZ;
      } else {
        this.position.x += col.pushX;
        this.position.z += col.pushZ;
      }

      // Footsteps
      if (this.isGrounded && Math.random() < delta * (this.isSprinting ? 4 : 2.5)) {
        sound.playFootstep('grass');
      }
    }

    // Terrain Height & Jumping / Gravity
    const groundY = this.world.getHeightAt(this.position.x, this.position.z) + (this.isCrouching ? 1.1 : 1.7);

    if (jumpReq && this.isGrounded && this.stamina >= 15) {
      this.velocity.y = 6.2;
      this.stamina -= 15;
      this.isGrounded = false;
      sound.playJump();
    }

    // Apply gravity
    this.velocity.y -= 18 * delta;
    this.position.y += this.velocity.y * delta;

    if (this.position.y <= groundY) {
      this.position.y = groundY;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    // Update 3D player mesh
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.rotation.y;

    // Camera Placement (FPS or TPS)
    if (this.isFirstPerson) {
      this.camera.position.set(this.position.x, this.position.y, this.position.z);
      this.camera.rotation.copy(this.rotation);

      // Weapon Spring & Recoil damping
      this.recoilOffset.lerp(new THREE.Vector3(), delta * 12);
      this.recoilRot.x = THREE.MathUtils.lerp(this.recoilRot.x, 0, delta * 12);
      this.recoilRot.y = THREE.MathUtils.lerp(this.recoilRot.y, 0, delta * 12);
      this.recoilRot.z = THREE.MathUtils.lerp(this.recoilRot.z, 0, delta * 12);

      // ADS Aim Down Sights Position
      const targetAimPos = this.isAiming ? new THREE.Vector3(0, -0.16, -0.32) : new THREE.Vector3(0.24, -0.22, -0.45);
      this.fpsWeaponPivot.position.lerp(targetAimPos.clone().add(this.recoilOffset), delta * 14);
      this.fpsWeaponPivot.rotation.set(this.recoilRot.x, this.recoilRot.y, this.recoilRot.z);

      // FOV Zoom on ADS
      const targetFov = this.isAiming ? (this.inv.getActiveItem()?.id === 'timberwolf' ? 24 : 52) : 75;
      this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, delta * 14);
      this.camera.updateProjectionMatrix();
    } else {
      // Third Person Camera
      const tpsOffset = new THREE.Vector3(0.6, 1.8, 3.4);
      tpsOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
      this.camera.position.copy(this.position).add(tpsOffset);
      this.camera.lookAt(this.position.x, this.position.y + 0.8, this.position.z);
    }

    // Placement Ghost position update
    if (this.placementGhost) {
      const placePos = new THREE.Vector3(0, 0, -3.2);
      placePos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
      placePos.add(this.position);
      placePos.y = this.world.getHeightAt(placePos.x, placePos.z) + 0.1;
      this.placementGhost.position.copy(placePos);
      this.placementGhost.rotation.y = this.rotation.y;
    }
  }
}
