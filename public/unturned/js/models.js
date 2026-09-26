// Unturned Web - 3D Models & Mesh Factory
// Authentic Unturned blocky low-poly geometry
import * as THREE from './three.module.js';
import { textures } from './textures.js';

export class ModelFactory {
  // --- PLAYER MODEL ---
  static createPlayer(isFirstPerson = false) {
    const group = new THREE.Group();
    group.name = 'player';

    // Materials
    const skinMat = new THREE.MeshLambertMaterial({ color: 0xffcca3 });
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x4a2f1b });
    const shirtMat = new THREE.MeshLambertMaterial({ color: 0x2e5a36 }); // Survivor green
    const pantsMat = new THREE.MeshLambertMaterial({ color: 0x223042 }); // Navy cargo pants
    const shoeMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a }); // Combat boots
    const packMat = new THREE.MeshLambertMaterial({ color: 0x3d3527 }); // Alice backpack

    // Head (0.4 x 0.4 x 0.4)
    const headFaceMat = new THREE.MeshLambertMaterial({ map: textures.getPlayerFace() });
    const headMats = [
      skinMat, // right
      skinMat, // left
      hairMat, // top
      skinMat, // bottom
      headFaceMat, // front (+z)
      hairMat  // back
    ];
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), headMats);
    head.position.set(0, 1.6, 0);
    head.castShadow = true;
    group.add(head);
    group.head = head;

    // Survivor Baseball Cap
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.12, 0.44),
      new THREE.MeshLambertMaterial({ color: 0x7c2d12 })
    );
    cap.position.set(0, 0.18, 0);
    const brim = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.04, 0.22),
      new THREE.MeshLambertMaterial({ color: 0x7c2d12 })
    );
    brim.position.set(0, -0.04, 0.28);
    cap.add(brim);
    head.add(cap);

    // Torso (0.5 x 0.6 x 0.28)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.28), shirtMat);
    torso.position.set(0, 1.1, 0);
    torso.castShadow = true;
    group.add(torso);
    group.torso = torso;

    // Backpack
    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.46, 0.18), packMat);
    pack.position.set(0, 0.02, -0.22);
    pack.castShadow = true;
    torso.add(pack);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.18, 0.58, 0.18);

    // Right Arm (Weapon Hand)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.36, 1.35, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
    rightArmMesh.position.set(0, -0.25, 0);
    rightArmMesh.castShadow = true;
    rightArmGroup.add(rightArmMesh);
    group.add(rightArmGroup);
    group.rightArm = rightArmGroup;

    // Weapon Attachment Socket on Right Hand
    const weaponSocket = new THREE.Group();
    weaponSocket.position.set(0, -0.5, 0.15);
    rightArmGroup.add(weaponSocket);
    group.weaponSocket = weaponSocket;

    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.36, 1.35, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
    leftArmMesh.position.set(0, -0.25, 0);
    leftArmMesh.castShadow = true;
    leftArmGroup.add(leftArmMesh);
    group.add(leftArmGroup);
    group.leftArm = leftArmGroup;

    // Legs
    const legGeo = new THREE.BoxGeometry(0.22, 0.75, 0.22);

    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.14, 0.75, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.set(0, -0.32, 0);
    rightLegMesh.castShadow = true;
    rightLegGroup.add(rightLegMesh);
    group.add(rightLegGroup);
    group.rightLeg = rightLegGroup;

    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.14, 0.75, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.set(0, -0.32, 0);
    leftLegMesh.castShadow = true;
    leftLegGroup.add(leftLegMesh);
    group.add(leftLegGroup);
    group.leftLeg = leftLegGroup;

    if (isFirstPerson) {
      // In first person, hide head & torso to prevent clipping into camera
      head.visible = false;
      torso.visible = false;
      rightLegGroup.visible = false;
      leftLegGroup.visible = false;
    }

    return group;
  }

  // --- ZOMBIE MODEL ---
  static createZombie(type = 'normal') {
    const group = new THREE.Group();
    group.name = 'zombie_' + type;
    group.zombieType = type;

    const scale = type === 'mega' ? 2.3 : 1.0;
    const skinColor = type === 'military' ? 0x475e3c : (type === 'mega' ? 0x382f42 : 0x5c7a4b);
    const shirtColor = type === 'military' ? 0x344229 : (type === 'mega' ? 0x1f1624 : 0x8b3a2b);
    const pantsColor = type === 'military' ? 0x2b3823 : (type === 'mega' ? 0x15101a : 0x1e272e);

    const skinMat = new THREE.MeshLambertMaterial({ color: skinColor });
    const shirtMat = new THREE.MeshLambertMaterial({ color: shirtColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: pantsColor });

    // Head
    const headFaceMat = new THREE.MeshLambertMaterial({ map: textures.getZombieFace(type) });
    const headMats = [skinMat, skinMat, skinMat, skinMat, headFaceMat, skinMat];
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), headMats);
    head.position.set(0, 1.6, 0);
    head.castShadow = true;
    head.userData.isHead = true;
    group.add(head);
    group.head = head;

    // Glowing Eyes Light (especially scary at night)
    const eyeLight = new THREE.PointLight(type === 'mega' ? 0xff0000 : 0xff3333, 1.2, 4);
    eyeLight.position.set(0, 1.6, 0.25);
    group.add(eyeLight);

    if (type === 'military') {
      // Army Helmet
      const helmet = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, 0.16, 0.44),
        new THREE.MeshLambertMaterial({ color: 0x2d3a24 })
      );
      helmet.position.set(0, 0.16, 0);
      head.add(helmet);
    }

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.28), shirtMat);
    torso.position.set(0, 1.1, 0);
    torso.castShadow = true;
    group.add(torso);
    group.torso = torso;

    // Arms (raised forward in classic Unturned zombie lunge)
    const armGeo = new THREE.BoxGeometry(0.18, 0.58, 0.18);

    const rightArm = new THREE.Group();
    rightArm.position.set(0.36, 1.35, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, skinMat);
    rightArmMesh.position.set(0, -0.25, 0);
    rightArmMesh.castShadow = true;
    rightArm.add(rightArmMesh);
    rightArm.rotation.x = -Math.PI / 2.3; // Reaching forward
    group.add(rightArm);
    group.rightArm = rightArm;

    const leftArm = new THREE.Group();
    leftArm.position.set(-0.36, 1.35, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, skinMat);
    leftArmMesh.position.set(0, -0.25, 0);
    leftArmMesh.castShadow = true;
    leftArm.add(leftArmMesh);
    leftArm.rotation.x = -Math.PI / 2.3; // Reaching forward
    group.add(leftArm);
    group.leftArm = leftArm;

    // Legs
    const legGeo = new THREE.BoxGeometry(0.22, 0.75, 0.22);

    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.14, 0.75, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.set(0, -0.32, 0);
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);
    group.add(rightLeg);
    group.rightLeg = rightLeg;

    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.14, 0.75, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.set(0, -0.32, 0);
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);
    group.add(leftLeg);
    group.leftLeg = leftLeg;

    if (scale !== 1.0) {
      group.scale.set(scale, scale, scale);
    }

    return group;
  }

  // --- WEAPONS ---
  static createWeapon(type) {
    const group = new THREE.Group();
    group.name = 'weapon_' + type;
    group.weaponType = type;

    const darkMetal = new THREE.MeshLambertMaterial({ color: 0x222225 });
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x6e431f });
    const tanMat = new THREE.MeshLambertMaterial({ color: 0x8a7b64 }); // Desert/military tan
    const redMat = new THREE.MeshLambertMaterial({ color: 0x991b1b }); // Axe red

    switch (type) {
      case 'maplestrike': {
        // Unturned iconic Canadian Assault Rifle
        const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.55), tanMat);
        group.add(receiver);

        const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.35), darkMetal);
        barrel.position.set(0, 0.02, 0.42);
        group.add(barrel);

        const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.08), darkMetal);
        muzzle.position.set(0, 0.02, 0.62);
        group.add(muzzle);

        const mag = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.22, 0.12), darkMetal);
        mag.position.set(0, -0.14, 0.1);
        mag.rotation.x = 0.2;
        group.add(mag);

        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.28), tanMat);
        stock.position.set(0, -0.02, -0.38);
        group.add(stock);

        const sight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.14), darkMetal);
        sight.position.set(0, 0.09, 0.05);
        group.add(sight);

        // Muzzle socket for flash
        const muzzleSocket = new THREE.Group();
        muzzleSocket.position.set(0, 0.02, 0.68);
        group.add(muzzleSocket);
        group.muzzleSocket = muzzleSocket;
        break;
      }

      case 'timberwolf': {
        // Unturned iconic .50 Cal Sniper Rifle
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.75), darkMetal);
        group.add(body);

        const longBarrel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.65), darkMetal);
        longBarrel.position.set(0, 0.03, 0.65);
        group.add(longBarrel);

        const heavyMuzzle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.14), darkMetal);
        heavyMuzzle.position.set(0, 0.03, 1.02);
        group.add(heavyMuzzle);

        // Scope
        const scope = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.32), darkMetal);
        scope.position.set(0, 0.12, 0.05);
        group.add(scope);

        const lens = new THREE.Mesh(
          new THREE.BoxGeometry(0.055, 0.055, 0.02),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        lens.position.set(0, 0.12, 0.22);
        group.add(lens);

        const stock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.35), darkMetal);
        stock.position.set(0, -0.04, -0.5);
        group.add(stock);

        const muzzleSocket = new THREE.Group();
        muzzleSocket.position.set(0, 0.03, 1.1);
        group.add(muzzleSocket);
        group.muzzleSocket = muzzleSocket;
        break;
      }

      case 'colt': {
        // Starter Pistol
        const slide = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.26), darkMetal);
        group.add(slide);

        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.16, 0.09), woodMat);
        grip.position.set(0, -0.1, -0.06);
        grip.rotation.x = -0.25;
        group.add(grip);

        const muzzleSocket = new THREE.Group();
        muzzleSocket.position.set(0, 0.02, 0.14);
        group.add(muzzleSocket);
        group.muzzleSocket = muzzleSocket;
        break;
      }

      case 'bluntforce': {
        // Pump-Action Shotgun
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.5), darkMetal);
        group.add(frame);

        const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.45), darkMetal);
        barrel.position.set(0, 0.03, 0.45);
        group.add(barrel);

        const woodPump = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.2), woodMat);
        woodPump.position.set(0, -0.01, 0.35);
        group.add(woodPump);

        const woodStock = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.14, 0.32), woodMat);
        woodStock.position.set(0, -0.05, -0.38);
        group.add(woodStock);

        const muzzleSocket = new THREE.Group();
        muzzleSocket.position.set(0, 0.03, 0.7);
        group.add(muzzleSocket);
        group.muzzleSocket = muzzleSocket;
        break;
      }

      case 'fireaxe': {
        // Fire Axe
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.8), woodMat);
        group.add(handle);

        const head = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.28, 0.18), redMat);
        head.position.set(0, 0.1, 0.36);
        group.add(head);

        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 0.26, 0.08),
          new THREE.MeshLambertMaterial({ color: 0xcccccc })
        );
        blade.position.set(0, 0.1, 0.48);
        group.add(blade);
        break;
      }

      case 'baseballbat': {
        const bat = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.8), woodMat);
        group.add(bat);
        const grip = new THREE.Mesh(
          new THREE.BoxGeometry(0.075, 0.075, 0.25),
          new THREE.MeshLambertMaterial({ color: 0x111111 })
        );
        grip.position.set(0, 0, -0.28);
        group.add(grip);
        break;
      }

      case 'flashlight': {
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.28), darkMetal);
        group.add(body);
        const rim = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.09, 0.06),
          new THREE.MeshLambertMaterial({ color: 0xd97706 })
        );
        rim.position.set(0, 0, 0.14);
        group.add(rim);
        break;
      }

      default:
        break;
    }

    return group;
  }

  // --- VEHICLE: UNTURNED OFFROADER JEEP ---
  static createOffroader() {
    const group = new THREE.Group();
    group.name = 'offroader';

    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1e3a8a }); // Unturned Royal Blue
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x18181b });
    const glassMat = new THREE.MeshLambertMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.6
    });
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x09090b });
    const rimMat = new THREE.MeshLambertMaterial({ color: 0xd4d4d8 });

    // Chassis / lower body
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 4.4), bodyMat);
    lowerBody.position.set(0, 0.8, 0);
    lowerBody.castShadow = true;
    group.add(lowerBody);

    // Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.4, 1.5), bodyMat);
    hood.position.set(0, 1.25, 1.3);
    hood.castShadow = true;
    group.add(hood);

    // Cabin
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.85, 2.2), bodyMat);
    cabin.position.set(0, 1.5, -0.6);
    cabin.castShadow = true;
    group.add(cabin);

    // Windshield
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.65, 0.1), glassMat);
    windshield.position.set(0, 1.6, 0.52);
    windshield.rotation.x = -0.25;
    group.add(windshield);

    // Front Bumper & Winch
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.35, 0.4), darkMat);
    bumper.position.set(0, 0.65, 2.3);
    group.add(bumper);

    // Headlights
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const leftHeadlightMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.1), lightMat);
    leftHeadlightMesh.position.set(-0.75, 1.2, 2.06);
    group.add(leftHeadlightMesh);

    const rightHeadlightMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.1), lightMat);
    rightHeadlightMesh.position.set(0.75, 1.2, 2.06);
    group.add(rightHeadlightMesh);

    // Headlight Spotlights
    const leftSpot = new THREE.SpotLight(0xfffae0, 2.5, 45, Math.PI / 6, 0.3);
    leftSpot.position.set(-0.75, 1.2, 2.1);
    leftSpot.target.position.set(-0.75, 0.5, 25);
    group.add(leftSpot);
    group.add(leftSpot.target);

    const rightSpot = new THREE.SpotLight(0xfffae0, 2.5, 45, Math.PI / 6, 0.3);
    rightSpot.position.set(0.75, 1.2, 2.1);
    rightSpot.target.position.set(0.75, 0.5, 25);
    group.add(rightSpot);
    group.add(rightSpot.target);

    group.headlights = [leftSpot, rightSpot];

    // Chunky Wheels (4)
    group.wheels = [];
    const wheelPositions = [
      { x: -1.2, y: 0.55, z: 1.3 },  // Front Left
      { x: 1.2, y: 0.55, z: 1.3 },   // Front Right
      { x: -1.2, y: 0.55, z: -1.3 }, // Rear Left
      { x: 1.2, y: 0.55, z: -1.3 }   // Rear Right
    ];

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.45, 12), wheelMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.46, 8), rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      group.add(wheelGroup);
      group.wheels.push(wheelGroup);
    });

    return group;
  }

  // --- ENVIRONMENT: PINE TREE ---
  static createPineTree(height = 8) {
    const group = new THREE.Group();
    group.name = 'tree_pine';
    group.treeHealth = 100;
    group.maxHealth = 100;
    group.isChopped = false;

    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a3d28 });
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x245436 }); // Unturned pine green

    // Trunk
    const trunkHeight = height * 0.4;
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.45, trunkHeight, 6),
      trunkMat
    );
    trunk.position.y = trunkHeight / 2;
    trunk.castShadow = true;
    group.add(trunk);
    group.trunk = trunk;

    // Foliage cones (3 stacked layers)
    const layers = 3;
    for (let i = 0; i < layers; i++) {
      const radius = 2.2 - i * 0.5;
      const coneHeight = (height * 0.65) / layers + 0.5;
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(radius, coneHeight, 6),
        leafMat
      );
      cone.position.y = trunkHeight + i * 1.5;
      cone.castShadow = true;
      group.add(cone);
    }

    return group;
  }

  // --- ENVIRONMENT: RESIDENTIAL HOUSE ---
  static createHouse(wallColor = 0xd97736, roofColor = 0x334155) {
    const group = new THREE.Group();
    group.name = 'house';

    const wallMat = new THREE.MeshLambertMaterial({ color: wallColor });
    const roofMat = new THREE.MeshLambertMaterial({ color: roofColor });
    const floorMat = new THREE.MeshLambertMaterial({ color: 0x785332 });
    const glassMat = new THREE.MeshLambertMaterial({ color: 0xa5f3fc, transparent: true, opacity: 0.5 });
    const doorMat = new THREE.MeshLambertMaterial({ color: 0x451a03 });

    // Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, 8), floorMat);
    floor.position.set(0, 0.15, 0);
    floor.receiveShadow = true;
    group.add(floor);

    // Walls
    const wallH = 3.6;
    // Back wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, wallH, 0.3), wallMat);
    backWall.position.set(0, wallH / 2, -3.85);
    backWall.castShadow = true;
    group.add(backWall);

    // Left wall with window
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 8), wallMat);
    leftWall.position.set(-3.85, wallH / 2, 0);
    leftWall.castShadow = true;
    group.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, wallH, 8), wallMat);
    rightWall.position.set(3.85, wallH / 2, 0);
    rightWall.castShadow = true;
    group.add(rightWall);

    // Front Wall with Doorway
    const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(3.0, wallH, 0.3), wallMat);
    frontWallL.position.set(-2.5, wallH / 2, 3.85);
    group.add(frontWallL);

    const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(3.0, wallH, 0.3), wallMat);
    frontWallR.position.set(2.5, wallH / 2, 3.85);
    group.add(frontWallR);

    const frontWallTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 0.3), wallMat);
    frontWallTop.position.set(0, wallH - 0.6, 3.85);
    group.add(frontWallTop);

    // Interactive Door
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.4, 0.15), doorMat);
    door.position.set(0, 1.2, 3.85);
    door.userData.isOpen = false;
    door.name = 'door';
    group.add(door);
    group.door = door;

    // Pitched Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(6.2, 2.2, 4), roofMat);
    roof.position.set(0, wallH + 1.1, 0);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    return group;
  }

  // --- ENVIRONMENT: MILITARY WATCHTOWER ---
  static createWatchtower() {
    const group = new THREE.Group();
    group.name = 'watchtower';

    const steelMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x475569 });

    // 4 legs
    const legGeo = new THREE.BoxGeometry(0.3, 8, 0.3);
    const legPositions = [
      [-2, 4, -2],
      [2, 4, -2],
      [-2, 4, 2],
      [2, 4, 2]
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, steelMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      group.add(leg);
    });

    // Cross braces
    const platform = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.3, 5.2), woodMat);
    platform.position.set(0, 8, 0);
    platform.receiveShadow = true;
    group.add(platform);

    // Railings
    const railMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const railL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.0, 5.2), railMat);
    railL.position.set(-2.5, 8.5, 0);
    group.add(railL);
    const railR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.0, 5.2), railMat);
    railR.position.set(2.5, 8.5, 0);
    group.add(railR);

    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.25, 5.6), steelMat);
    roof.position.set(0, 10.5, 0);
    group.add(roof);

    return group;
  }

  // --- ENVIRONMENT: BARN & SILO ---
  static createBarn() {
    const group = new THREE.Group();
    group.name = 'barn';

    const barnRed = new THREE.MeshLambertMaterial({ color: 0x991b1b });
    const whiteTrim = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
    const siloMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });

    // Main Barn Body
    const barn = new THREE.Mesh(new THREE.BoxGeometry(12, 6, 16), barnRed);
    barn.position.set(0, 3, 0);
    barn.castShadow = true;
    group.add(barn);

    // White X trim on sides
    const trim1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 5.5, 0.3), whiteTrim);
    trim1.position.set(6.05, 3, 0);
    group.add(trim1);

    // Silo
    const silo = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 12, 12), siloMat);
    silo.position.set(9, 6, 0);
    silo.castShadow = true;
    group.add(silo);

    const siloDome = new THREE.Mesh(new THREE.SphereGeometry(2.5, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), siloMat);
    siloDome.position.set(9, 12, 0);
    group.add(siloDome);

    return group;
  }

  // --- PROPS & LOOT CRATES ---
  static createLootCrate(type = 'military') {
    const group = new THREE.Group();
    group.name = 'loot_crate';
    group.crateType = type;
    group.isLooted = false;

    const crateMat = new THREE.MeshLambertMaterial({ map: textures.getCrateTexture() });
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), crateMat);
    box.position.set(0, 0.45, 0);
    box.castShadow = true;
    group.add(box);

    return group;
  }

  // --- BASE BUILDING: BARRICADE ---
  static createBarricade() {
    const group = new THREE.Group();
    group.name = 'barricade';
    group.health = 150;

    const woodMat = new THREE.MeshLambertMaterial({ map: textures.getWoodTexture() });

    // 3 horizontal planks
    for (let i = 0; i < 3; i++) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 0.08), woodMat);
      plank.position.set(0, 0.25 + i * 0.35, 0);
      plank.castShadow = true;
      group.add(plank);
    }

    // 2 cross braces
    const postL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 0.15), woodMat);
    postL.position.set(-0.8, 0.6, 0);
    group.add(postL);

    const postR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 0.15), woodMat);
    postR.position.set(0.8, 0.6, 0);
    group.add(postR);

    return group;
  }

  // --- BASE BUILDING: CAMPFIRE ---
  static createCampfire() {
    const group = new THREE.Group();
    group.name = 'campfire';

    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
    const woodMat = new THREE.MeshLambertMaterial({ color: 0x451a03 });

    // Stone ring
    const stoneGeo = new THREE.BoxGeometry(0.25, 0.2, 0.25);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const stone = new THREE.Mesh(stoneGeo, stoneMat);
      stone.position.set(Math.cos(a) * 0.6, 0.1, Math.sin(a) * 0.6);
      group.add(stone);
    }

    // Logs in center
    const log1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.7), woodMat);
    log1.rotation.y = 0.5;
    group.add(log1);
    const log2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.7), woodMat);
    log2.rotation.y = -0.5;
    group.add(log2);

    // Warm Fire Light
    const fireLight = new THREE.PointLight(0xf97316, 2.5, 12);
    fireLight.position.set(0, 0.5, 0);
    group.add(fireLight);
    group.fireLight = fireLight;

    return group;
  }
}
