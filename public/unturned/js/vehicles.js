// Unturned Web - Drivable Vehicle System
import * as THREE from './three.module.js';
import { sound } from './audio.js';

export class VehicleManager {
  constructor(scene, worldManager) {
    this.scene = scene;
    this.world = worldManager;
    this.activeVehicle = null;
    this.speed = 0;
    this.maxSpeed = 22;
    this.reverseMaxSpeed = -7;
    this.acceleration = 12;
    this.braking = 18;
    this.turnSpeed = 1.6;
    this.friction = 4.0;
    this.headlightsOn = false;
  }

  isDriving() {
    return this.activeVehicle !== null;
  }

  getClosestVehicle(playerPos, maxDist = 3.8) {
    let closest = null;
    let minDist = maxDist;
    for (const v of this.world.vehicles) {
      const dist = v.position.distanceTo(playerPos);
      if (dist < minDist) {
        minDist = dist;
        closest = v;
      }
    }
    return closest;
  }

  enterVehicle(vehicle) {
    this.activeVehicle = vehicle;
    this.speed = 0;
    sound.startVehicleEngine();
  }

  exitVehicle() {
    if (!this.activeVehicle) return null;
    const exitPos = new THREE.Vector3();
    // Exit to left side of vehicle
    exitPos.set(-2.0, 0, 0);
    exitPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.activeVehicle.rotation.y);
    exitPos.add(this.activeVehicle.position);
    exitPos.y = this.world.getHeightAt(exitPos.x, exitPos.z) + 0.1;

    sound.stopVehicleEngine();
    const v = this.activeVehicle;
    this.activeVehicle = null;
    this.speed = 0;
    return exitPos;
  }

  toggleHeadlights() {
    if (!this.activeVehicle || !this.activeVehicle.headlights) return;
    this.headlightsOn = !this.headlightsOn;
    this.activeVehicle.headlights.forEach((light) => {
      light.visible = this.headlightsOn;
    });
  }

  honk() {
    if (!this.activeVehicle) return;
    sound.playCarHorn();
  }

  update(delta, inputKeys, zombieManager) {
    if (!this.activeVehicle) return;

    const v = this.activeVehicle;

    // Acceleration & Braking
    const forward = inputKeys['KeyW'] || inputKeys['ArrowUp'];
    const backward = inputKeys['KeyS'] || inputKeys['ArrowDown'];
    const left = inputKeys['KeyA'] || inputKeys['ArrowLeft'];
    const right = inputKeys['KeyD'] || inputKeys['ArrowRight'];
    const handbrake = inputKeys['Space'];

    if (forward) {
      this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration * delta);
    } else if (backward) {
      this.speed = Math.max(this.reverseMaxSpeed, this.speed - this.acceleration * delta);
    } else {
      // Natural friction
      if (this.speed > 0) {
        this.speed = Math.max(0, this.speed - this.friction * delta);
      } else if (this.speed < 0) {
        this.speed = Math.min(0, this.speed + this.friction * delta);
      }
    }

    if (handbrake) {
      if (this.speed > 0) this.speed = Math.max(0, this.speed - this.braking * delta);
      else if (this.speed < 0) this.speed = Math.min(0, this.speed + this.braking * delta);
    }

    // Steering (effective only when moving)
    if (Math.abs(this.speed) > 0.3) {
      const steerDir = this.speed >= 0 ? 1 : -1;
      if (left) v.rotation.y += this.turnSpeed * steerDir * delta;
      if (right) v.rotation.y -= this.turnSpeed * steerDir * delta;
    }

    // Movement calculation
    const moveDist = this.speed * delta;
    const nextX = v.position.x + Math.sin(v.rotation.y) * moveDist;
    const nextZ = v.position.z + Math.cos(v.rotation.y) * moveDist;

    // Check collision with buildings and trees
    const col = this.world.checkCollision(nextX, nextZ, 1.4);
    if (!col.collided) {
      v.position.x = nextX;
      v.position.z = nextZ;
    } else {
      // Crash stopped vehicle
      v.position.x += col.pushX;
      v.position.z += col.pushZ;
      this.speed = -this.speed * 0.3;
    }

    // Height on terrain
    v.position.y = this.world.getHeightAt(v.position.x, v.position.z) + 0.1;

    // Spin wheels
    if (v.wheels) {
      const wheelSpin = (this.speed / 0.55) * delta;
      v.wheels.forEach((w, idx) => {
        w.children[0].rotation.x += wheelSpin;
        // Turn front wheels
        if (idx < 2) {
          const steerAngle = left ? 0.35 : (right ? -0.35 : 0);
          w.rotation.y = steerAngle;
        }
      });
    }

    // Sound engine pitch
    sound.updateVehicleEngine(this.speed / this.maxSpeed);

    // Zombie Roadkill collision!
    if (Math.abs(this.speed) > 3.0 && zombieManager) {
      zombieManager.zombies.forEach((z) => {
        if (z.isDead) return;
        const dist = v.position.distanceTo(z.mesh.position);
        if (dist < 2.4) {
          // Splatter!
          sound.playZombieSplatter();
          zombieManager.damageZombie(z, 200, false);
          // Small speed hit on impact
          this.speed *= 0.85;
        }
      });
    }
  }
}
