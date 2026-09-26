// Unturned Web - Procedural Canvas Textures
// Faithfully recreates Unturned's iconic clean low-poly / voxel art style
import * as THREE from './three.module.js';

class TextureFactory {
  constructor() {
    this.cache = new Map();
  }

  // --- PLAYER FACE ---
  getPlayerFace() {
    if (this.cache.has('playerFace')) return this.cache.get('playerFace');
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Warm peach skin
    ctx.fillStyle = '#ffcca3';
    ctx.fillRect(0, 0, 128, 128);

    // Survivor brown hair bangs at top
    ctx.fillStyle = '#4a2f1b';
    ctx.fillRect(0, 0, 128, 32);
    ctx.fillRect(8, 32, 24, 12);
    ctx.fillRect(96, 32, 24, 12);

    // Iconic Unturned Eyes (clean square pupils)
    ctx.fillStyle = '#111111';
    ctx.fillRect(28, 54, 18, 22);
    ctx.fillRect(82, 54, 18, 22);

    // Specular eye shine
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(32, 56, 6, 6);
    ctx.fillRect(86, 56, 6, 6);

    // Eyebrows
    ctx.fillStyle = '#3a2313';
    ctx.fillRect(26, 46, 22, 5);
    ctx.fillRect(80, 46, 22, 5);

    // Neutral / determined mouth
    ctx.fillStyle = '#7a3e3e';
    ctx.fillRect(50, 96, 28, 6);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    this.cache.set('playerFace', texture);
    return texture;
  }

  // --- ZOMBIE FACE ---
  getZombieFace(type = 'normal') {
    const key = 'zombieFace_' + type;
    if (this.cache.has(key)) return this.cache.get(key);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    if (type === 'military') {
      // Dark sickly olive green
      ctx.fillStyle = '#475e3c';
    } else if (type === 'mega') {
      // Crimson / dark corrupted purple-green
      ctx.fillStyle = '#382f42';
    } else {
      // Classic Unturned green skin
      ctx.fillStyle = '#5c7a4b';
    }
    ctx.fillRect(0, 0, 128, 128);

    // Rotting decay patches
    ctx.fillStyle = 'rgba(30, 45, 20, 0.4)';
    ctx.fillRect(16, 20, 36, 24);
    ctx.fillRect(84, 76, 28, 32);

    // Sunken black eye sockets
    ctx.fillStyle = '#0a0d08';
    ctx.fillRect(24, 50, 24, 26);
    ctx.fillRect(80, 50, 24, 26);

    // Glowing Eyes
    if (type === 'mega') {
      ctx.fillStyle = '#ff1111'; // Pure demonic red
      ctx.fillRect(30, 56, 14, 14);
      ctx.fillRect(86, 56, 14, 14);
      ctx.fillStyle = '#ffff55';
      ctx.fillRect(34, 60, 6, 6);
      ctx.fillRect(90, 60, 6, 6);
    } else if (type === 'military') {
      ctx.fillStyle = '#ff7700'; // Amber warning
      ctx.fillRect(30, 56, 12, 12);
      ctx.fillRect(86, 56, 12, 12);
    } else {
      ctx.fillStyle = '#e53935'; // Unturned blood red eyes
      ctx.fillRect(30, 56, 12, 12);
      ctx.fillRect(86, 56, 12, 12);
    }

    // Snarling open mouth with crooked teeth
    ctx.fillStyle = '#1c0f0f';
    ctx.fillRect(40, 90, 48, 20);

    // Rotting teeth
    ctx.fillStyle = '#d9d2a7';
    ctx.fillRect(44, 90, 8, 8);
    ctx.fillRect(60, 90, 8, 8);
    ctx.fillRect(76, 90, 8, 8);
    ctx.fillRect(52, 102, 8, 8);
    ctx.fillRect(68, 102, 8, 8);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    this.cache.set(key, texture);
    return texture;
  }

  // --- ROAD TEXTURE ---
  getRoadTexture() {
    if (this.cache.has('road')) return this.cache.get('road');
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Asphalt
    ctx.fillStyle = '#2b2c30';
    ctx.fillRect(0, 0, 64, 256);

    // White shoulder lines
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(2, 0, 3, 256);
    ctx.fillRect(59, 0, 3, 256);

    // Yellow dashed center stripe
    ctx.fillStyle = '#f5c518';
    for (let y = 16; y < 256; y += 64) {
      ctx.fillRect(30, y, 4, 32);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    this.cache.set('road', texture);
    return texture;
  }

  // --- WOOD PLANK TEXTURE ---
  getWoodTexture() {
    if (this.cache.has('wood')) return this.cache.get('wood');
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(0, 0, 128, 128);

    // Plank seams
    ctx.fillStyle = '#5c3a1e';
    ctx.fillRect(0, 30, 128, 3);
    ctx.fillRect(0, 62, 128, 3);
    ctx.fillRect(0, 94, 128, 3);
    ctx.fillRect(64, 0, 3, 30);
    ctx.fillRect(40, 32, 3, 30);
    ctx.fillRect(90, 64, 3, 30);
    ctx.fillRect(25, 96, 3, 32);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    this.cache.set('wood', texture);
    return texture;
  }

  // --- CRATE LOGO TEXTURE ---
  getCrateTexture() {
    if (this.cache.has('crate')) return this.cache.get('crate');
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Dark military olive
    ctx.fillStyle = '#4a5d3f';
    ctx.fillRect(0, 0, 128, 128);

    // Metal border
    ctx.strokeStyle = '#283322';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, 118, 118);

    // Stenciled white star / supply icon
    ctx.fillStyle = '#c7d6bc';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    this.cache.set('crate', texture);
    return texture;
  }
}

export const textures = new TextureFactory();
