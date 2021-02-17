import { IPureShip } from "../database/models/ship";
import weapons, { IPureWeapon } from "../database/models/weapon";

export function calculateUpgradeCost(item: IPureWeapon | IPureShip) {
    const isWeapon = item instanceof weapons;
    const round = isWeapon ? 25 : 50;
    return Math.floor((item.cost * item.level ** (isWeapon ? 0.8 : 0.7)) / round) * round;
}

export function calculateMaxHealth(ship: IPureShip) {
    return Math.round(ship.health + (Math.sqrt(ship.level) * ship.health) / 4);
}

export function calculateDamage(weapon: IPureWeapon) {
    return Math.round(
        weapon.damage +
            (Math.sqrt(weapon.level) * weapon.damage) / 4 +
            Math.random() * weapon.deviation
    );
}
