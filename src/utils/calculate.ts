import { IPureShip } from "../database/models/ship";
import weapons, { IPureWeapon } from "../database/models/weapon";

export function calculateUpgradeCost(weapon: IPureWeapon | IPureShip) {
    const isWeapon = weapon instanceof weapons;
    const round = isWeapon ? 25 : 50;
    return Math.floor((weapon.cost * weapon.level ** (isWeapon ? 0.8 : 0.7)) / round) * round;
}

export function calculateDamage(weapon: IPureWeapon) {
    return Math.round(
        weapon.damage * Math.sqrt(weapon.level) + Math.random() * weapon.deviation
    );
}
