// Combat Engine, 16/32-Bit Pixel Art Fighter Physics & FX for Vivest Fighters

class HitEffect {
    constructor(x, y, text, color = '#ffeb3b') {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.life = 1.0;
        this.vy = -1.8;
        this.scale = 1.6;
    }

    update(dt) {
        this.life -= dt * 1.5;
        this.y += this.vy;
        this.scale = Math.max(1.0, this.scale - dt * 2);
        return this.life > 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.font = `900 ${Math.round(24 * this.scale)}px "Impact", "Arial Black", sans-serif`;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.textAlign = 'center';
        ctx.strokeText(this.text, this.x, this.y);
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color = '#ffeb3b', speed = 6) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * speed + 2;
        this.vx = Math.cos(angle) * spd;
        this.vy = Math.sin(angle) * spd;
        this.color = color;
        this.size = Math.random() * 7 + 3;
        this.life = 1.0;
        this.decay = Math.random() * 2 + 1.5;
    }

    update(dt) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 4 * dt;
        this.life -= dt * this.decay;
        return this.life > 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Projectile {
    constructor(owner, config, x, y, dir) {
        this.owner = owner;
        this.config = config;
        this.x = x;
        this.y = y;
        this.dir = dir; // 1 or -1
        this.speed = config.speed * 42;
        this.damage = config.damage;
        this.active = true;
        this.radius = 26;
        this.rotation = 0;
    }

    update(dt, width) {
        this.x += this.dir * this.speed * dt * 10;
        this.rotation += this.dir * dt * 12;
        if (this.x < -100 || this.x > width + 100) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const p = this.config.projectile;
        ctx.shadowColor = p.color || '#ffeb3b';
        ctx.shadowBlur = 18;

        if (p.type === 'copom_doc') {
            // Matheus: Burning electric Blue Hadouken document
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 4;
            ctx.fillRect(-22, -15, 44, 30);
            ctx.strokeRect(-22, -15, 44, 30);
            ctx.font = '900 12px monospace';
            ctx.fillStyle = '#0284c7';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.text, 0, 0);
        } else if (p.type === 'globo') {
            // Rai: Golden Hadouken energy orb with Biscoito Globo ring
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(0, 0, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = '900 10px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('HADOU', 0, 0);
        } else if (p.type === 'formula') {
            // Max: Muay Thai Tiger Ki blast
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = '900 12px monospace';
            ctx.fillStyle = '#78350f';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('TIGER', 0, 0);
        } else if (p.type === 'kikouken') {
            // Luiza: Chun-Li Kikouken cyan Ki ball
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.arc(0, 0, 21, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.font = '900 10px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('KIKOU', 0, 0);
        } else if (p.type === 'contract') {
            // Alan: Akuma Purple Gohadoken
            ctx.fillStyle = '#7c3aed';
            ctx.beginPath();
            ctx.arc(0, 0, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#c084fc';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.font = '900 10px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('MESSATSU', 0, 0);
        } else if (p.type === 'heart_mic') {
            // Gabriela: Spiral Arrow energy vortex
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = '900 11px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('ARROW', 0, 0);
        } else {
            ctx.fillStyle = p.color || '#38bdf8';
            ctx.beginPath();
            ctx.arc(0, 0, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = 'bold 11px monospace';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.text, 0, 0);
        }

        ctx.restore();
    }
}

class Fighter {
    constructor(data, isP1 = true, groundY = 530) {
        this.data = data;
        this.isP1 = isP1;
        this.groundY = groundY;

        // Position & Movement
        this.x = isP1 ? 220 : 740;
        this.y = groundY;
        this.vx = 0;
        this.vy = 0;
        this.facing = isP1 ? 1 : -1;

        // Attributes
        this.speed = (data.stats.speed / 100) * 340;
        this.jumpPower = -660;
        this.gravity = 1450;

        // Combat Stats
        this.maxHp = 100;
        this.hp = 100;
        this.prevHp = 100;
        this.superMeter = 0;
        this.stressLevel = data.stats.stress || 50;

        // States: 'idle', 'walk', 'crouch', 'jump', 'punch', 'kick', 'special', 'super', 'block', 'hurt', 'ko', 'win'
        this.state = 'idle';
        this.stateTimer = 0;
        this.isGrounded = true;
        this.isBlocking = false;
        this.isAttacking = false;
        this.attackHasHit = false;
        this.hitStunTimer = 0;
        this.invincibleTimer = 0;
        this.comboHits = 0;

        // Super Cinematics
        this.isExecutingSuper = false;
        this.superProgress = 0;

        // Projectiles and Visual FX
        this.projectiles = [];
        this.particles = [];
        this.hitEffects = [];

        // Dimensions: Target height on screen is 250px (matches Street Fighter III / Capcom CPS3 proportion)
        this.renderHeight = 250;
        this.width = 110;
        this.height = this.renderHeight;

        // Load 16/32-Bit Pixel Art Sprites for all combat states!
        this.loadSprites();
    }

    loadSprites() {
        const id = this.data.id === 'boss_meta' ? 'alan' : this.data.id;
        const basePath = `assets/sprites/${id}`;

        this.sprites = {
            idle: new Image(),
            punch: new Image(),
            kick: new Image(),
            crouch: new Image(),
            hurt: new Image(),
            special: new Image()
        };

        this.spriteLoaded = {
            idle: false,
            punch: false,
            kick: false,
            crouch: false,
            hurt: false,
            special: false
        };

        this.sprites.idle.onload = () => { this.spriteLoaded.idle = true; };
        this.sprites.punch.onload = () => { this.spriteLoaded.punch = true; };
        this.sprites.kick.onload = () => { this.spriteLoaded.kick = true; };
        this.sprites.crouch.onload = () => { this.spriteLoaded.crouch = true; };
        this.sprites.hurt.onload = () => { this.spriteLoaded.hurt = true; };
        this.sprites.special.onload = () => { this.spriteLoaded.special = true; };

        this.sprites.idle.src = `${basePath}_idle.png`;
        this.sprites.punch.src = `${basePath}_punch.png`;
        this.sprites.kick.src = `${basePath}_kick.png`;
        this.sprites.crouch.src = `${basePath}_crouch.png`;
        this.sprites.hurt.src = `${basePath}_hurt.png`;
        this.sprites.special.src = `${basePath}_special.png`;

        // Face portrait for HUD and Super cut-ins
        this.photoImg = new Image();
        this.photoImg.src = this.data.facePhoto || this.data.photo;
        this.photoLoaded = false;
        this.photoImg.onload = () => { this.photoLoaded = true; };
    }

    setGroundY(groundY) {
        this.groundY = groundY;
        if (this.isGrounded) this.y = groundY;
    }

    update(dt, opponent, stageWidth) {
        this.stateTimer += dt;
        if (this.hitStunTimer > 0) this.hitStunTimer -= dt;
        if (this.invincibleTimer > 0) this.invincibleTimer -= dt;

        if (this.prevHp > this.hp) {
            this.prevHp = Math.max(this.hp, this.prevHp - dt * 25);
        }

        if (!this.isAttacking && this.state !== 'hurt' && this.state !== 'ko' && this.state !== 'win') {
            this.facing = this.x < opponent.x ? 1 : -1;
        }

        // Gravity & Jump Physics
        if (!this.isGrounded) {
            this.vy += this.gravity * dt;
            this.y += this.vy * dt;
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.vy = 0;
                this.isGrounded = true;
                if (this.state === 'jump') {
                    this.setState('idle');
                }
            }
        }

        // Movement Friction
        this.x += this.vx * dt;
        if (this.isGrounded && !this.isAttacking) {
            this.vx *= 0.75;
        }

        const padding = 55;
        this.x = Math.max(padding, Math.min(stageWidth - padding, this.x));

        this.updateStateLogic(dt, opponent);

        // Projectile collisions
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update(dt, stageWidth);
            if (p.active && this.checkProjectileHit(p, opponent)) {
                p.active = false;
                opponent.takeDamage(p.damage, this, true, p.config.projectile.text || 'HADOUKEN!');
                this.addSuper(15);
            }
            if (!p.active) {
                this.projectiles.splice(i, 1);
            }
        }

        this.particles = this.particles.filter(p => p.update(dt));
        this.hitEffects = this.hitEffects.filter(e => e.update(dt));
    }

    updateStateLogic(dt, opponent) {
        if (this.state === 'punch') {
            if (this.stateTimer >= 0.08 && !this.attackHasHit) {
                this.checkMeleeHit(opponent, 10, 'SOCO!');
            }
            if (this.stateTimer >= 0.25) {
                this.setState('idle');
            }
        } else if (this.state === 'kick') {
            if (this.stateTimer >= 0.10 && !this.attackHasHit) {
                this.checkMeleeHit(opponent, 14, 'CHUTE!');
            }
            if (this.stateTimer >= 0.32) {
                this.setState('idle');
            }
        } else if (this.state === 'special') {
            if (this.stateTimer >= 0.15 && !this.attackHasHit) {
                this.launchProjectile();
                this.attackHasHit = true;
            }
            if (this.stateTimer >= 0.40) {
                this.setState('idle');
            }
        } else if (this.state === 'super') {
            this.superProgress += dt;
            if (this.stateTimer >= 0.35 && !this.attackHasHit) {
                this.executeSuperHit(opponent);
                this.attackHasHit = true;
            }
            if (this.stateTimer >= 1.2) {
                this.setState('idle');
                this.isExecutingSuper = false;
            }
        } else if (this.state === 'hurt') {
            if (this.hitStunTimer <= 0) {
                this.setState('idle');
            }
        }
    }

    setState(newState) {
        if (this.state === 'ko') return;
        this.state = newState;
        this.stateTimer = 0;
        this.isAttacking = ['punch', 'kick', 'special', 'super'].includes(newState);
        this.attackHasHit = false;
    }

    move(dir) {
        if (this.isAttacking || this.state === 'hurt' || this.state === 'ko' || this.isBlocking) return;
        this.vx = dir * this.speed;
        if (this.isGrounded && this.state !== 'crouch') {
            this.setState('walk');
        }
    }

    stopMove() {
        if (this.state === 'walk') {
            this.setState('idle');
            this.vx = 0;
        }
    }

    jump() {
        if (!this.isGrounded || this.isAttacking || this.state === 'hurt' || this.state === 'ko') return;
        this.vy = this.jumpPower;
        this.isGrounded = false;
        this.setState('jump');
        window.soundEngine.playWhoosh();
    }

    crouch() {
        if (!this.isGrounded || this.isAttacking || this.state === 'hurt' || this.state === 'ko') return;
        this.setState('crouch');
    }

    standUp() {
        if (this.state === 'crouch') {
            this.setState('idle');
        }
    }

    block(isBlocking) {
        if (this.isAttacking || this.state === 'hurt' || this.state === 'ko') return;
        this.isBlocking = isBlocking;
        if (isBlocking && this.isGrounded) {
            this.setState('block');
            this.vx = 0;
        } else if (!isBlocking && this.state === 'block') {
            this.setState('idle');
        }
    }

    punch() {
        if (this.isAttacking || this.state === 'hurt' || this.state === 'ko') return;
        this.setState('punch');
        window.soundEngine.playWhoosh();
    }

    kick() {
        if (this.isAttacking || this.state === 'hurt' || this.state === 'ko') return;
        this.setState('kick');
        window.soundEngine.playWhoosh();
    }

    special() {
        if (this.isAttacking || this.state === 'hurt' || this.state === 'ko') return;
        this.setState('special');
        window.soundEngine.playProjectile();
        if (this.data.specialMove.shout) {
            window.soundEngine.announce(this.data.specialMove.shout, 1.2, 1.3);
        }
    }

    superMove(opponent) {
        if (this.isAttacking || this.state === 'hurt' || this.state === 'ko') return;
        if (this.superMeter < 100) return;

        this.superMeter = 0;
        this.isExecutingSuper = true;
        this.superProgress = 0;
        this.setState('super');

        window.soundEngine.playSuperFreeze();
        const sfTitle = this.data.superMove.sfName || this.data.superMove.name;
        window.soundEngine.announce(`SUPER COMBO! ${sfTitle}!`, 1.1, 1.2);
    }

    launchProjectile() {
        const spawnX = this.x + this.facing * 50;
        const spawnY = this.y - 110;
        const proj = new Projectile(this, this.data.specialMove, spawnX, spawnY, this.facing);
        this.projectiles.push(proj);
    }

    executeSuperHit(opponent) {
        window.soundEngine.playExplosion();
        opponent.takeDamage(this.data.superMove.damage, this, false, 'SUPER COMBO FINISH!');
        this.spawnImpactParticles(opponent.x, opponent.y - 100, 35, this.data.superMove.color);

        if (this.data.id === 'matheus') {
            this.stressLevel = Math.max(0, this.stressLevel - 40);
        }
    }

    checkMeleeHit(opponent, damage, hitText) {
        const attackReach = 110;
        const dx = (opponent.x - this.x) * this.facing;
        const dy = Math.abs(opponent.y - this.y);

        if (dx > 0 && dx < attackReach && dy < 90) {
            this.attackHasHit = true;
            opponent.takeDamage(damage, this, false, hitText);
            this.addSuper(12);
        }
    }

    checkProjectileHit(proj, opponent) {
        const dx = Math.abs(proj.x - opponent.x);
        const dy = Math.abs(proj.y - (opponent.y - 90));
        return dx < 55 && dy < 80;
    }

    takeDamage(rawDamage, attacker, isProjectile = false, hitText = 'HIT!') {
        if (this.state === 'ko' || this.invincibleTimer > 0) return;

        let damage = rawDamage;
        let blocked = this.isBlocking || this.state === 'block';

        if (blocked) {
            damage = Math.round(damage * 0.2);
            window.soundEngine.playBlock();
            this.spawnImpactParticles(this.x, this.y - 90, 8, '#38bdf8');
            this.addHitText('GUARD!', '#38bdf8');
        } else {
            if (rawDamage > 15) {
                window.soundEngine.playPunch(true);
            } else {
                window.soundEngine.playPunch(false);
            }
            this.spawnImpactParticles(this.x, this.y - 90, 18, attacker.data.themeColor || '#ffeb3b');
            this.addHitText(hitText, attacker.data.accentColor || '#ffeb3b');

            this.vx = attacker.facing * (rawDamage > 20 ? 330 : 210);
            this.hitStunTimer = 0.28;
            this.setState('hurt');

            attacker.comboHits++;
            if (attacker.comboHits > 1) {
                attacker.addHitText(`${attacker.comboHits} HITS!`, '#f59e0b');
            }
        }

        this.hp = Math.max(0, this.hp - damage);
        this.addSuper(damage * 0.75);

        if (this.hp <= 0) {
            this.hp = 0;
            this.setState('ko');
            this.vy = -380;
            this.isGrounded = false;
            window.soundEngine.playKO();
        }
    }

    addSuper(amount) {
        this.superMeter = Math.min(100, this.superMeter + amount);
    }

    addHitText(text, color) {
        const tx = this.x + (Math.random() * 40 - 20);
        const ty = this.y - 150 + (Math.random() * 20 - 10);
        this.hitEffects.push(new HitEffect(tx, ty, text, color));
    }

    spawnImpactParticles(x, y, count = 12, color = '#ffeb3b') {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color, 10));
        }
    }

    // DRAWING 100% REAL PIXEL ART SPRITES
    draw(ctx, time) {
        this.projectiles.forEach(p => p.draw(ctx));
        this.particles.forEach(p => p.draw(ctx));
        this.hitEffects.forEach(e => e.draw(ctx));

        // Classic Street Fighter Shadow under the feet
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        const shadowWidth = Math.max(40, 110 - (this.groundY - this.y) * 0.25);
        ctx.ellipse(this.x, this.groundY, shadowWidth / 2, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Facing Transform
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.facing, 1);

        // Breathing & Walk cycle calculations
        let bodyBob = Math.sin(time * 6) * 3;
        if (this.state === 'walk') {
            bodyBob = Math.abs(Math.sin(time * 12)) * 6;
        } else if (this.state === 'crouch') {
            bodyBob = 0;
        }

        // Select the active 16/32-bit pixel art sprite image
        let activeSprite = this.sprites.idle;
        if (this.state === 'punch' && this.spriteLoaded.punch) {
            activeSprite = this.sprites.punch;
        } else if (this.state === 'kick' && this.spriteLoaded.kick) {
            activeSprite = this.sprites.kick;
        } else if (this.state === 'crouch' && this.spriteLoaded.crouch) {
            activeSprite = this.sprites.crouch;
        } else if ((this.state === 'hurt' || this.state === 'ko') && this.spriteLoaded.hurt) {
            activeSprite = this.sprites.hurt;
        } else if (this.state === 'special' && this.spriteLoaded.special) {
            activeSprite = this.sprites.special;
        }

        // Draw the authentic Capcom pixel art character sprite!
        if (activeSprite && activeSprite.complete && activeSprite.naturalWidth > 0) {
            const aspect = activeSprite.naturalWidth / activeSprite.naturalHeight;
            const drawH = this.renderHeight;
            const drawW = drawH * aspect;

            // Feet aligned with the floor
            const drawX = -drawW / 2;
            const drawY = -drawH + bodyBob;

            // Super Ki Aura Glow
            if (this.superMeter >= 100 || this.isExecutingSuper) {
                ctx.save();
                ctx.shadowColor = this.data.themeColor;
                ctx.shadowBlur = 25;
                ctx.drawImage(activeSprite, drawX, drawY, drawW, drawH);
                ctx.restore();
            }

            // Draw crisp pixel art sprite
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(activeSprite, drawX, drawY, drawW, drawH);

            // Punch motion wind effect
            if (this.state === 'punch') {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(drawW * 0.1, drawY + drawH * 0.35);
                ctx.lineTo(drawW * 0.45, drawY + drawH * 0.35);
                ctx.stroke();
            }

            // Kick motion wind arc
            if (this.state === 'kick') {
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.75)';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(drawW * 0.2, drawY + drawH * 0.55, 35, -0.6, 0.6);
                ctx.stroke();
            }

            // Block shield
            if (this.state === 'block') {
                ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(drawW * 0.2, drawY + drawH * 0.45, 45, -Math.PI / 2, Math.PI / 2);
                ctx.fill();
                ctx.stroke();
            }

            // Dizzy stars on hurt / KO
            if (this.state === 'hurt' || this.state === 'ko') {
                ctx.save();
                ctx.translate(0, drawY - 15);
                for (let i = 0; i < 3; i++) {
                    const angle = time * 8 + (i * Math.PI * 2 / 3);
                    const starX = Math.cos(angle) * 30;
                    const starY = Math.sin(angle) * 10;
                    ctx.fillStyle = '#ffd700';
                    ctx.font = '16px sans-serif';
                    ctx.fillText('★', starX, starY);
                }
                ctx.restore();
            }
        }

        ctx.restore();

        // Super Cut-In Banner
        if (this.isExecutingSuper && this.superProgress < 1.0) {
            this.drawSuperCutIn(ctx, time);
        }
    }

    drawSuperCutIn(ctx, time) {
        const bannerHeight = 120;
        const bannerY = 250;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fillRect(0, bannerY, ctx.canvas.width, bannerHeight);
        ctx.strokeStyle = this.data.themeColor;
        ctx.lineWidth = 5;
        ctx.strokeRect(0, bannerY, ctx.canvas.width, bannerHeight);

        // Portrait Cut-in on the side
        const pSize = 110;
        const px = this.isP1 ? 60 : ctx.canvas.width - 170;
        const py = bannerY + 5;

        ctx.beginPath();
        ctx.arc(px + pSize / 2, py + pSize / 2, pSize / 2, 0, Math.PI * 2);
        ctx.clip();
        if (this.photoLoaded) {
            ctx.drawImage(this.photoImg, px, py, pSize, pSize);
        }
        ctx.restore();

        // Text Banner
        ctx.save();
        ctx.font = '900 28px "Impact", "Arial Black", sans-serif';
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = this.isP1 ? 'left' : 'right';
        const textX = this.isP1 ? 190 : ctx.canvas.width - 190;
        ctx.fillText(`SUPER COMBO: ${this.data.superMove.sfName || this.data.superMove.name}`, textX, bannerY + 45);

        ctx.font = 'italic 16px "Arial", sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(`"${this.data.superMove.quote}"`, textX, bannerY + 80);
        ctx.restore();
    }
}

window.Fighter = Fighter;
