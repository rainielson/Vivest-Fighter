// AI Controller for CPU Fighters in Vivest Fighters

class AIController {
    constructor(difficulty = 'analista') {
        this.difficulty = difficulty; // 'estagiario', 'analista', 'diretor'
        this.decisionTimer = 0;
        this.nextActionDelay = 0.2;
        this.isAntiStressMode = false;
    }

    setDifficulty(diff) {
        this.difficulty = diff;
    }

    setAntiStressMode(enabled) {
        this.isAntiStressMode = enabled;
    }

    update(dt, aiFighter, playerFighter) {
        if (aiFighter.state === 'ko' || aiFighter.state === 'hurt' || aiFighter.isAttacking) {
            return;
        }

        // In Anti-Stress Mode, the dummy opponent is passive and lets player vent!
        if (this.isAntiStressMode) {
            this.updateAntiStressDummy(dt, aiFighter, playerFighter);
            return;
        }

        this.decisionTimer += dt;
        if (this.decisionTimer < this.nextActionDelay) return;
        this.decisionTimer = 0;

        // Difficulty Settings
        let reactionSpeed = 0.25;
        let blockChance = 0.35;
        let aggression = 0.6;

        if (this.difficulty === 'estagiario') {
            reactionSpeed = 0.45;
            blockChance = 0.15;
            aggression = 0.35;
        } else if (this.difficulty === 'diretor') {
            reactionSpeed = 0.12;
            blockChance = 0.65;
            aggression = 0.85;
        }
        this.nextActionDelay = reactionSpeed + Math.random() * 0.1;

        const dist = Math.abs(aiFighter.x - playerFighter.x);
        const dirToPlayer = playerFighter.x > aiFighter.x ? 1 : -1;

        // 1. Reactive Defense: If player is attacking nearby, try to block
        if (playerFighter.isAttacking && dist < 110 && Math.random() < blockChance) {
            aiFighter.block(true);
            setTimeout(() => aiFighter.block(false), 300);
            return;
        }

        // 2. Super Move Trigger: If 100% meter, unleash with high probability
        if (aiFighter.superMeter >= 100 && (dist < 180 || Math.random() < 0.7)) {
            aiFighter.superMove(playerFighter);
            return;
        }

        // 3. Distance Management & Actions
        if (dist > 280) {
            // Far distance: move closer or launch special projectile
            if (Math.random() < 0.45) {
                aiFighter.special();
            } else {
                aiFighter.move(dirToPlayer);
            }
        } else if (dist > 120) {
            // Mid distance: advance, jump, or fireball
            const roll = Math.random();
            if (roll < 0.4) {
                aiFighter.move(dirToPlayer);
            } else if (roll < 0.65) {
                aiFighter.special();
            } else if (roll < 0.8) {
                aiFighter.jump();
                aiFighter.move(dirToPlayer);
            } else {
                aiFighter.stopMove();
            }
        } else {
            // Close combat range: Punch, Kick, Crouch, or Evade
            const roll = Math.random();
            if (roll < 0.35) {
                aiFighter.punch();
            } else if (roll < 0.70) {
                aiFighter.kick();
            } else if (roll < 0.85) {
                aiFighter.crouch();
                setTimeout(() => aiFighter.kick(), 150);
            } else {
                // Tactical backstep
                aiFighter.move(-dirToPlayer);
                setTimeout(() => aiFighter.stopMove(), 200);
            }
        }
    }

    updateAntiStressDummy(dt, aiFighter, playerFighter) {
        // Dummy slowly bobs and occasionally complains or takes hits with pride
        const dist = Math.abs(aiFighter.x - playerFighter.x);
        if (dist > 150) {
            const dir = playerFighter.x > aiFighter.x ? 1 : -1;
            aiFighter.move(dir * 0.4);
        } else {
            aiFighter.stopMove();
        }
    }
}

window.AIController = AIController;
