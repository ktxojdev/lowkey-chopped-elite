// Unturned Web - Items, Inventory & Crafting System
import { sound } from './audio.js';

export const ITEM_DEFS = {
  // Firearms
  maplestrike: {
    id: 'maplestrike',
    name: 'Maplestrike',
    type: 'gun',
    category: 'weapon',
    rarity: 'rare',
    desc: 'Military grade 5.56mm assault rifle. High rate of fire and low recoil.',
    icon: '🔫',
    color: '#38bdf8',
    damage: 38,
    headshotMultiplier: 2.5,
    fireRate: 0.12, // seconds between shots
    isAutomatic: true,
    magSize: 30,
    ammoType: 'military_ammo',
    range: 160,
    recoil: 0.035,
    spread: 0.02
  },
  timberwolf: {
    id: 'timberwolf',
    name: 'Timberwolf',
    type: 'gun',
    category: 'weapon',
    rarity: 'epic',
    desc: 'Heavy .50 caliber bolt-action sniper rifle with high magnification scope.',
    icon: '🎯',
    color: '#a855f7',
    damage: 130,
    headshotMultiplier: 3.0,
    fireRate: 1.25,
    isAutomatic: false,
    hasScope: true,
    magSize: 6,
    ammoType: 'military_ammo',
    range: 350,
    recoil: 0.09,
    spread: 0.005
  },
  colt: {
    id: 'colt',
    name: 'Colt',
    type: 'gun',
    category: 'weapon',
    rarity: 'common',
    desc: 'Standard civilian semi-automatic pistol chambered in .45 ACP.',
    icon: '🔫',
    color: '#94a3b8',
    damage: 32,
    headshotMultiplier: 2.2,
    fireRate: 0.35,
    isAutomatic: false,
    magSize: 7,
    ammoType: 'civilian_ammo',
    range: 70,
    recoil: 0.04,
    spread: 0.03
  },
  bluntforce: {
    id: 'bluntforce',
    name: 'Bluntforce',
    type: 'gun',
    category: 'weapon',
    rarity: 'uncommon',
    desc: 'Pump-action 12-gauge shotgun. Devastating at close range.',
    icon: '💥',
    color: '#4ade80',
    damage: 18, // x 8 pellets = 144
    pellets: 8,
    headshotMultiplier: 1.8,
    fireRate: 0.85,
    isAutomatic: false,
    magSize: 8,
    ammoType: 'shotgun_shells',
    range: 35,
    recoil: 0.08,
    spread: 0.075
  },

  // Melee
  fireaxe: {
    id: 'fireaxe',
    name: 'Fire Axe',
    type: 'melee',
    category: 'weapon',
    rarity: 'uncommon',
    desc: 'Heavy emergency axe. Slices zombies and chops down pine trees easily.',
    icon: '🪓',
    color: '#ef4444',
    damage: 55,
    treeChopDamage: 35,
    swingRate: 0.65,
    range: 2.8
  },
  baseballbat: {
    id: 'baseballbat',
    name: 'Baseball Bat',
    type: 'melee',
    category: 'weapon',
    rarity: 'common',
    desc: 'Solid wooden sports bat with high knockback.',
    icon: '🏏',
    color: '#e2e8f0',
    damage: 40,
    treeChopDamage: 12,
    swingRate: 0.55,
    range: 2.6
  },
  flashlight: {
    id: 'flashlight',
    name: 'Tactical Flashlight',
    type: 'utility',
    category: 'tool',
    rarity: 'common',
    desc: 'High-intensity LED flashlight. Press [F] to illuminate the dark.',
    icon: '🔦',
    color: '#facc15'
  },

  // Ammunition
  military_ammo: {
    id: 'military_ammo',
    name: 'Military Ammo Box',
    type: 'ammo',
    category: 'ammo',
    rarity: 'rare',
    desc: 'Case of high-velocity 5.56mm rounds for Maplestrike and Timberwolf.',
    icon: '📦',
    color: '#38bdf8',
    rounds: 30,
    maxStack: 90
  },
  civilian_ammo: {
    id: 'civilian_ammo',
    name: 'Civilian Ammo Box',
    type: 'ammo',
    category: 'ammo',
    rarity: 'common',
    desc: 'Box of .45 ACP handgun ammunition.',
    icon: '📦',
    color: '#94a3b8',
    rounds: 20,
    maxStack: 80
  },
  shotgun_shells: {
    id: 'shotgun_shells',
    name: '12-Gauge Shells',
    type: 'ammo',
    category: 'ammo',
    rarity: 'uncommon',
    desc: 'Buckshot shells for Bluntforce shotgun.',
    icon: '🔴',
    color: '#ef4444',
    rounds: 12,
    maxStack: 48
  },

  // Medical
  bandage: {
    id: 'bandage',
    name: 'Dressing Bandage',
    type: 'medical',
    category: 'medical',
    rarity: 'common',
    desc: 'Stops bleeding immediately and restores 25 Health.',
    icon: '🩹',
    color: '#f43f5e',
    healAmount: 25,
    curesBleed: true,
    maxStack: 5
  },
  medkit: {
    id: 'medkit',
    name: 'Military Medkit',
    type: 'medical',
    category: 'medical',
    rarity: 'rare',
    desc: 'Complete trauma kit. Restores 75 Health, stops bleeding, and restores 25 Immunity.',
    icon: '🧰',
    color: '#ef4444',
    healAmount: 75,
    immunityAmount: 25,
    curesBleed: true,
    maxStack: 3
  },
  vaccine: {
    id: 'vaccine',
    name: 'Vaccine Ampoule',
    type: 'medical',
    category: 'medical',
    rarity: 'epic',
    desc: 'Antiviral synthesis. Restores 60 Immunity and halts zombie infection.',
    icon: '💉',
    color: '#10b981',
    immunityAmount: 60,
    maxStack: 4
  },

  // Food & Water
  canned_beans: {
    id: 'canned_beans',
    name: 'Canned Beans',
    type: 'food',
    category: 'food',
    rarity: 'common',
    desc: 'Classic post-apocalyptic protein. Restores 45 Hunger and 10 Thirst.',
    icon: '🥫',
    color: '#f97316',
    hungerAmount: 45,
    thirstAmount: 10,
    maxStack: 8
  },
  bottled_water: {
    id: 'bottled_water',
    name: 'Bottled Spring Water',
    type: 'drink',
    category: 'food',
    rarity: 'common',
    desc: 'Clean purified water. Restores 50 Thirst.',
    icon: '💧',
    color: '#06b6d4',
    thirstAmount: 50,
    maxStack: 8
  },
  soda: {
    id: 'soda',
    name: 'Energy Soda',
    type: 'drink',
    category: 'food',
    rarity: 'uncommon',
    desc: 'Caffeinated beverage. Restores 35 Thirst and 25 Stamina.',
    icon: '🥤',
    color: '#ec4899',
    thirstAmount: 35,
    staminaAmount: 25,
    maxStack: 8
  },

  // Materials & Building
  pine_log: {
    id: 'pine_log',
    name: 'Pine Log',
    type: 'material',
    category: 'resource',
    rarity: 'common',
    desc: 'Sturdy pine wood chopped from trees. Used in crafting.',
    icon: '🪵',
    color: '#b45309',
    maxStack: 10
  },
  wood_plank: {
    id: 'wood_plank',
    name: 'Wood Plank',
    type: 'material',
    category: 'resource',
    rarity: 'common',
    desc: 'Processed wood lumber. Essential building material.',
    icon: '🪚',
    color: '#d97706',
    maxStack: 20
  },
  wood_barricade: {
    id: 'wood_barricade',
    name: 'Wooden Barricade',
    type: 'placeable',
    category: 'building',
    rarity: 'uncommon',
    desc: 'Sturdy defensive barrier. Place in the world to fortify doors and block zombies.',
    icon: '🚧',
    color: '#b45309',
    maxStack: 5
  },
  campfire: {
    id: 'campfire',
    name: 'Campfire',
    type: 'placeable',
    category: 'building',
    rarity: 'uncommon',
    desc: 'Provides warm light at night and slowly regenerates health when resting near it.',
    icon: '🔥',
    color: '#f97316',
    maxStack: 3
  }
};

export const CRAFTING_RECIPES = [
  {
    id: 'craft_planks',
    result: { id: 'wood_plank', count: 4 },
    inputs: [{ id: 'pine_log', count: 1 }],
    name: 'Wood Planks (x4)',
    desc: 'Convert 1 Pine Log into 4 Wood Planks'
  },
  {
    id: 'craft_barricade',
    result: { id: 'wood_barricade', count: 1 },
    inputs: [{ id: 'wood_plank', count: 3 }],
    name: 'Wooden Barricade',
    desc: 'Build a defensive barrier using 3 Wood Planks'
  },
  {
    id: 'craft_campfire',
    result: { id: 'campfire', count: 1 },
    inputs: [
      { id: 'wood_plank', count: 2 },
      { id: 'pine_log', count: 1 }
    ],
    name: 'Campfire',
    desc: 'Craft a campfire for light and healing using 2 Planks and 1 Log'
  },
  {
    id: 'craft_medkit',
    result: { id: 'medkit', count: 1 },
    inputs: [{ id: 'bandage', count: 2 }],
    name: 'Military Medkit',
    desc: 'Combine 2 Bandages into an advanced Medkit'
  }
];

export class InventoryManager {
  constructor() {
    this.hotbar = new Array(5).fill(null);
    this.backpack = new Array(15).fill(null);
    this.selectedHotbarIndex = 0;
    this.ammoPool = {
      military_ammo: 60,
      civilian_ammo: 28,
      shotgun_shells: 16
    };
    this.weaponMagazines = {
      colt: 7,
      maplestrike: 30,
      timberwolf: 6,
      bluntforce: 8
    };

    // Default starter gear (Unturned survivor starter pack)
    this.hotbar[0] = { id: 'colt', count: 1 };
    this.hotbar[1] = { id: 'fireaxe', count: 1 };
    this.hotbar[2] = { id: 'bandage', count: 2 };
    this.hotbar[3] = { id: 'canned_beans', count: 1 };
    this.hotbar[4] = { id: 'flashlight', count: 1 };

    // Extra starter loot in backpack
    this.backpack[0] = { id: 'civilian_ammo', count: 14 };
    this.backpack[1] = { id: 'bottled_water', count: 1 };
  }

  getActiveItem() {
    return this.hotbar[this.selectedHotbarIndex];
  }

  selectHotbarIndex(index) {
    if (index >= 0 && index < 5) {
      this.selectedHotbarIndex = index;
      sound.playItemPickup();
      return true;
    }
    return false;
  }

  addItem(itemId, count = 1) {
    const def = ITEM_DEFS[itemId];
    if (!def) return false;

    // First check hotbar for existing stackable item
    if (def.maxStack && def.maxStack > 1) {
      for (let i = 0; i < this.hotbar.length; i++) {
        if (this.hotbar[i] && this.hotbar[i].id === itemId) {
          this.hotbar[i].count += count;
          sound.playItemPickup();
          return true;
        }
      }
      for (let i = 0; i < this.backpack.length; i++) {
        if (this.backpack[i] && this.backpack[i].id === itemId) {
          this.backpack[i].count += count;
          sound.playItemPickup();
          return true;
        }
      }
    }

    // Try to find empty slot in hotbar first
    for (let i = 0; i < this.hotbar.length; i++) {
      if (!this.hotbar[i]) {
        this.hotbar[i] = { id: itemId, count };
        sound.playItemPickup();
        return true;
      }
    }

    // Then backpack
    for (let i = 0; i < this.backpack.length; i++) {
      if (!this.backpack[i]) {
        this.backpack[i] = { id: itemId, count };
        sound.playItemPickup();
        return true;
      }
    }

    return false; // Inventory full!
  }

  removeItem(location, index, count = 1) {
    const target = location === 'hotbar' ? this.hotbar : this.backpack;
    if (!target[index]) return false;

    target[index].count -= count;
    if (target[index].count <= 0) {
      target[index] = null;
    }
    return true;
  }

  getItemCount(itemId) {
    let total = 0;
    this.hotbar.forEach((slot) => {
      if (slot && slot.id === itemId) total += slot.count;
    });
    this.backpack.forEach((slot) => {
      if (slot && slot.id === itemId) total += slot.count;
    });
    return total;
  }

  canCraft(recipe) {
    return recipe.inputs.every((input) => this.getItemCount(input.id) >= input.count);
  }

  craft(recipeId) {
    const recipe = CRAFTING_RECIPES.find((r) => r.id === recipeId);
    if (!recipe || !this.canCraft(recipe)) return false;

    // Deduct inputs
    recipe.inputs.forEach((input) => {
      let needed = input.count;
      for (let i = 0; i < this.hotbar.length && needed > 0; i++) {
        if (this.hotbar[i] && this.hotbar[i].id === input.id) {
          const deduct = Math.min(needed, this.hotbar[i].count);
          this.hotbar[i].count -= deduct;
          needed -= deduct;
          if (this.hotbar[i].count <= 0) this.hotbar[i] = null;
        }
      }
      for (let i = 0; i < this.backpack.length && needed > 0; i++) {
        if (this.backpack[i] && this.backpack[i].id === input.id) {
          const deduct = Math.min(needed, this.backpack[i].count);
          this.backpack[i].count -= deduct;
          needed -= deduct;
          if (this.backpack[i].count <= 0) this.backpack[i] = null;
        }
      }
    });

    // Add result
    this.addItem(recipe.result.id, recipe.result.count);
    sound.playItemPickup();
    return true;
  }
}
