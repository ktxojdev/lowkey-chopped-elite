// Unturned Web - Zombie AI & Spawn Manager
import * as THREE from './three.module.js';
import { ModelFactory } from './models.js';
import { sound } from './audio.js';

export class ZombieManager {
  constructor(scene, worldManager) {
    this.scene = scene;
    this.world = worldManager;
    this.zombies = [];
    this.deadZombies = [];
    this.spawnPoints = [
      // Stratford Town
      { x: -45, z: 15, type: 'normal' },
      { x: -50, z: 25, type: 'normal' },
      { x: -35, z: 18, type: 'crawler' },
      { x: -30, z: 28, type: 'normal' },
      { x: -42, z: 5, type: 'normal' },

      // O'Leary Military Base
      { x: 60, z: -50, type: 'mega' }, // Boss Mega Zombie!
      { x: 50, z: -45, type: 'military' },
      { x: 70, z: -45, type: 'military' },
      { x: 55, z: -60, type: 'military' },
      { x: 65, z: -60, type: 'military' },

      // Alberton Farm
      { x: 38, z: 45, type: 'normal' },
      { x: 44, z: 54, type: 'normal' },
      { x: 32, z: 48, type: 'crawler' },

      // Highway / Roamers
      { x: 0, z: 25, type: 'normal' },
      { x: 25, z: 35, type: 'normal' },
      { x: 58, z: 0, type: 'military' },
      { x: -15, z: -25, type: 'normal' }
    ];
  }

  spawnInitialZombies() {
    this.spawnPoints.forEach((sp) => {
      this.spawnZombie(sp.x, sp.z, sp.type);
    });
  }

  spawnZombie(x, z, type = 'normal') {
    const y = this.world.getHeightAt(x, z);
    const mesh = ModelFactory.createZombie(type);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);

    const isMega = type === 'mega';
    const isMilitary = type === 'military';
    const isCrawler = type === 'crawler';

    const zombie = {
      mesh,
      type,
      health: isMega ? 650 : (isMilitary ? 140 : (isCrawler ? 50 : 75)),
      maxHealth: isMega ? 650 : (isMilitary ? 140 : (isCrawler ? 50 : 75)),
      speed: isCrawler ? 4.8 : (isMega ? 2.8 : 3.4),
      damage: isMega ? 45 : (isMilitary ? 22 : 15),
      attackRange: isMega ? 2.8 : 1.8,
      state: 'idle', // idle, chase, attack, dying
      homePos: new THREE.Vector3(x, y, z),
      targetPos: new THREE.Vector3(x, y, z),
      wanderTimer: Math.random() * 4,
      attackCooldown: 0,
      animTime: Math.random() * 10,
      isDead: false
    };

    this.zombies.push(zombie);
    return zombie;
  }

  // Called when player fires a gun - alerts nearby zombies
  alertZombiesInRange(pos, noiseRadius = 35) {
    this.zombies.forEach((z) => {
      if (z.isDead) return;
      const dist = z.mesh.position.distanceTo(pos);
      if (dist < noiseRadius && z.state === 'idle') {
        z.state = 'chase';
        sound.playZombieAggro(dist);
      }
    });
  }

  update(delta, playerPos, onPlayerDamaged, onZombieKilled) {
    for (let i = this.zombies.length - 1; i >= 0; i--) {
      const z = this.zombies[i];
      if (z.isDead) continue;

      z.animTime += delta * 6;
      if (z.attackCooldown > 0) z.attackCooldown -= delta;

      const distToPlayer = z.mesh.position.distanceTo(playerPos);

      // Sensory detection (vision)
      const detectDist = z.type === 'mega' ? 32 : 18;
      if (distToPlayer < detectDist && z.state === 'idle') {
        z.state = 'chase';
        sound.playZombieAggro(distToPlayer);
      }

      // State handling
      if (z.state === 'chase') {
        if (distToPlayer > 48 && z.type !== 'mega') {
          // Lost player interest
          z.state = 'idle';
        } else if (distToPlayer <= z.attackRange) {
          // In range to attack!
          z.state = 'attack';
        } else {
          // Run towards player
          const dirX = playerPos.x - z.mesh.position.x;
          const dirZ = playerPos.z - z.mesh.position.z;
          const angle = Math.atan2(dirX, dirZ);
          z.mesh.rotation.y = angle;

          const moveDist = z.speed * delta;
          const nextX = z.mesh.position.x + Math.sin(angle) * moveDist;
          const nextZ = z.mesh.position.z + Math.cos(angle) * moveDist;

          // Check obstacle collision
          const col = this.world.checkCollision(nextX, nextZ, 0.4);
          if (!col.collided) {
            z.mesh.position.x = nextX;
            z.mesh.position.z = nextZ;
          } else {
            z.mesh.position.x += col.pushX;
            z.mesh.position.z += col.pushZ;
          }

          z.mesh.position.y = this.world.getHeightAt(z.mesh.position.x, z.mesh.position.z);

          // Animate running limbs
          const legSwing = Math.sin(z.animTime) * 0.6;
          if (z.mesh.rightLeg) z.mesh.rightLeg.rotation.x = legSwing;
          if (z.mesh.leftLeg) z.mesh.leftLeg.rotation.x = -legSwing;
          if (z.mesh.rightArm) z.mesh.rightArm.rotation.x = -Math.PI / 2.3 + Math.sin(z.animTime * 0.8) * 0.2;
          if (z.mesh.leftArm) z.mesh.leftArm.rotation.x = -Math.PI / 2.3 - Math.sin(z.animTime * 0.8) * 0.2;
        }
      } else if (z.state === 'attack') {
        // Face player
        const dirX = playerPos.x - z.mesh.position.x;
        const dirZ = playerPos.z - z.mesh.position.z;
        z.mesh.rotation.y = Math.atan2(dirX, dirZ);

        if (distToPlayer > z.attackRange + 0.5) {
          z.state = 'chase';
        } else if (z.attackCooldown <= 0) {
          // Perform attack
          z.attackCooldown = z.type === 'mega' ? 1.6 : 1.1;
          sound.playZombieAttack();

          // Lunge animation
          if (z.mesh.rightArm) z.mesh.rightArm.rotation.x = -Math.PI / 1.5;
          if (z.mesh.leftArm) z.mesh.leftArm.rotation.x = -Math.PI / 1.5;

          setTimeout(() => {
            if (z.mesh.rightArm) z.mesh.rightArm.rotation.x = -Math.PI / 2.3;
            if (z.mesh.leftArm) z.mesh.leftArm.rotation.x = -Math.PI / 2.3;
          }, 250);

          onPlayerDamaged(z.damage, z.type);
        }
      } else if (z.state === 'idle') {
        // Idle wander
        z.wanderTimer -= delta;
        if (z.wanderTimer <= 0) {
          z.wanderTimer = 3 + Math.random() * 4;
          const rx = z.homePos.x + (Math.random() - 0.5) * 14;
          const rz = z.homePos.z + (Math.random() - 0.5) * 14;
          z.targetPos.set(rx, this.world.getHeightAt(rx, rz), rz);

          // Occasionally groan
          if (Math.random() < 0.25) {
            sound.playZombieGroan(distToPlayer);
          }
        }

        const distToWander = z.mesh.position.distanceTo(z.targetPos);
        if (distToWander > 0.5) {
          const dirX = z.targetPos.x - z.mesh.position.x;
          const dirZ = z.targetPos.z - z.mesh.position.z;
          const angle = Math.atan2(dirX, dirZ);
          z.mesh.rotation.y = angle;

          const moveDist = 1.0 * delta;
          z.mesh.position.x += Math.sin(angle) * moveDist;
          z.mesh.position.z += Math.cos(angle) * moveDist;
          z.mesh.position.y = this.world.getHeightAt(z.mesh.position.x, z.mesh.position.z);

          const legSwing = Math.sin(z.animTime * 0.4) * 0.3;
          if (z.mesh.rightLeg) z.mesh.rightLeg.rotation.x = legSwing;
          if (z.mesh.leftLeg) z.mesh.leftLeg.rotation.x = -legSwing;
        }
      }
    }
  }

  damageZombie(zombie, damage, isHeadshot = false) {
    if (zombie.isDead) return;

    const actualDamage = isHeadshot ? damage * (zombie.mesh.head ? 2.5 : 1.0) : damage;
    zombie.health -= actualDamage;
    sound.playHitFlesh();

    // Alert to attacker
    zombie.state = 'chase';

    // Flash white on hit
    zombie.mesh.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const origHex = child.material.color.getHex();
        child.material.color.setHex(0xffffff);
        setTimeout(() => {
          try { child.material.color.setHex(origHex); } catch {}
        }, 80);
      }
    });

    if (zombie.health <= 0) {
      this.killZombie(zombie, isHeadshot);
    }
  }

  killZombie(zombie, isHeadshot = false) {
    zombie.isDead = true;
    sound.playZombieDeath();

    // Collapse animation (fall backward)
    const mesh = zombie.mesh;
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = this.world.getHeightAt(mesh.position.x, mesh.position.z) + 0.2;

    // Disappear after 8 seconds
    setTimeout(() => {
      this.scene.remove(mesh);
      const idx = this.zombies.indexOf(zombie);
      if (idx !== -1) this.zombies.splice(idx, 1);
    }, 8000);

    // Drop loot
    let lootItem = 'bandage';
    if (zombie.type === 'mega') {
      lootItem = 'timberwolf'; // Mega boss drops sniper!
    } else if (zombie.type === 'military') {
      lootItem = Math.random() < 0.5 ? 'military_ammo' : 'maplestrike';
    } else {
      const dropRoll = Math.random();
      if (dropRoll < 0.35) lootItem = 'civilian_ammo';
      else if (dropRoll < 0.6) lootItem = 'canned_beans';
      else if (dropRoll < 0.85) lootItem = 'bandage';
      else lootItem = 'colt';
    }

    // Respawn timer after 30 seconds
    setTimeout(() => {
      this.spawnZombie(zombie.homePos.x, zombie.homePos.z, zombie.type);
    }, 30000);

    return lootItem;
  }
}
