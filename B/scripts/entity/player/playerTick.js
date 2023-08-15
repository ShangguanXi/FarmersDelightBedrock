import { world, system } from "@minecraft/server";

function rope(player) {
    const rope = player.dimension.getBlock(player.location).typeId === 'farmersdelight:rope_block';
    const RX = player.getRotation().x;
    const RY = player.getRotation().y;
    if (rope) {
        // player.addEffect('levitation', 2, { amplifier: 10, showParticles: false });
        // player.applyImpulse({ x: location.x, y: location.y += 1, z: location.z });
        if (RY <= -20) {
            player.addEffect('levitation', 1, { amplifier: 10, showParticles: false });
        }
        if (RY >= 20) {
            player.addEffect('slow_falling', 1, { amplifier: 10, showParticles: false });
        }

    }
}

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        rope(player);
    }
})
