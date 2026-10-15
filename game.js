// Main Game Loop, State Machine, HUD & Controller for Vivest Fighters

class GameManager {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        // Virtual internal resolution
        this.width = 960;
        this.height = 640;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Subsystems
        this.stageManager = new window.StageManager();
        this.ai = new window.AIController('analista');

        // Game State: 'TITLE', 'MODE_SELECT', 'CHAR_SELECT', 'VS_SCREEN', 'FIGHT', 'VICTORY', 'TOUR_CLEAR'
        this.state = 'TITLE';
        this.gameMode = 'TOUR'; // 'TOUR', 'VERSUS', 'ANTI_STRESS', 'PVP'
        this.difficulty = 'analista';

        // Roster
        this.roster = window.FIGHTERS_DATA;
        this.boss = window.BOSS_FIGHTER;

        // Selection Pointers
        this.p1SelectedIndex = 0;
        this.p2SelectedIndex = 1;
        this.p1Char = this.roster[0];
        this.p2Char = this.roster[1];

        // Tour Progress
        this.tourOpponents = [];
        this.tourCurrentIndex = 0;

        // Fight State
        this.fighter1 = null;
        this.fighter2 = null;
        this.roundTimer = 99;
        this.timerAccumulator = 0;
        this.round = 1;
        this.p1RoundsWon = 0;
        this.p2RoundsWon = 0;
        this.fightState = 'COUNTDOWN'; // 'COUNTDOWN', 'ACTIVE', 'KO_SLOWMO', 'ROUND_OVER'
        this.announcementText = '';
        this.announcementTimer = 0;
        this.roundWinner = null;
        this.matchWinner = null;

        // Anti-Stress Mode Tracker
        this.matheusStressScore = 100;

        // Timing
        this.lastTime = performance.now();
        this.gameTime = 0;

        // Input Tracking
        this.keys = {};
        this.initInputListeners();

        // Title Screen Logo Preload
        this.titleLogo = new Image();
        this.titleLogo.src = 'assets/images/title_logo.jpg';
        this.titleLogoLoaded = false;
        this.titleLogo.onload = () => { this.titleLogoLoaded = true; };

        // Street Fighter Logo Preload
        this.sfLogo = new Image();
        this.sfLogo.src = 'assets/images/sf_logo.png';
        this.sfLogoLoaded = false;
        this.sfLogo.onload = () => { this.sfLogoLoaded = true; };

        // Preload Street Fighter Roster Cards
        this.rosterCards = {};
        this.roster.forEach(f => {
            const cardImg = new Image();
            cardImg.src = f.cardPhoto || f.photo;
            this.rosterCards[f.id] = cardImg;
        });

        // Mouse click support for selecting characters and menu options
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

        // Start Loop
        requestAnimationFrame((t) => this.loop(t));
    }

    initInputListeners() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = true;
            this.handleKeyDown(e.key, e);
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            this.keys[key] = false;
            this.handleKeyUp(e.key, e);
        });

        // Touch & Virtual Control Bindings
        this.bindTouchControls();
    }

    bindTouchControls() {
        const btnMap = {
            'btn-punch': { down: () => this.handleAction('punch'), up: () => {} },
            'btn-kick': { down: () => this.handleAction('kick'), up: () => {} },
            'btn-special': { down: () => this.handleAction('special'), up: () => {} },
            'btn-block': { down: () => this.handleAction('block_down'), up: () => this.handleAction('block_up') },
            'btn-super': { down: () => this.handleAction('super'), up: () => {} },
            'pad-up': { down: () => this.handleAction('jump'), up: () => {} },
            'pad-down': { down: () => this.handleAction('crouch_down'), up: () => this.handleAction('crouch_up') },
            'pad-left': { down: () => this.handleAction('left_down'), up: () => this.handleAction('left_up') },
            'pad-right': { down: () => this.handleAction('right_down'), up: () => this.handleAction('right_up') }
        };

        Object.keys(btnMap).forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const triggerDown = (e) => {
                    e.preventDefault();
                    window.soundEngine.init();
                    btnMap[id].down();
                };
                const triggerUp = (e) => {
                    e.preventDefault();
                    btnMap[id].up();
                };
                el.addEventListener('mousedown', triggerDown);
                el.addEventListener('mouseup', triggerUp);
                el.addEventListener('touchstart', triggerDown, { passive: false });
                el.addEventListener('touchend', triggerUp, { passive: false });
            }
        });
    }

    handleAction(action) {
        if (this.state === 'TITLE') {
            this.startGame();
            return;
        }

        if (this.state === 'CHAR_SELECT') {
            if (action === 'punch' || action === 'super') this.confirmCharSelect();
            return;
        }

        if (this.state === 'VICTORY') {
            this.nextFromVictory();
            return;
        }

        if (this.state === 'FIGHT' && this.fighter1 && this.fightState === 'ACTIVE') {
            switch (action) {
                case 'punch': this.fighter1.punch(); break;
                case 'kick': this.fighter1.kick(); break;
                case 'special': this.fighter1.special(); break;
                case 'super': this.fighter1.superMove(this.fighter2); break;
                case 'block_down': this.fighter1.block(true); break;
                case 'block_up': this.fighter1.block(false); break;
                case 'jump': this.fighter1.jump(); break;
                case 'crouch_down': this.fighter1.crouch(); break;
                case 'crouch_up': this.fighter1.standUp(); break;
                case 'left_down': this.fighter1.move(-1); break;
                case 'left_up': this.fighter1.stopMove(); break;
                case 'right_down': this.fighter1.move(1); break;
                case 'right_up': this.fighter1.stopMove(); break;
            }
        }
    }

    handleKeyDown(key, e) {
        window.soundEngine.init();
        const k = key.toLowerCase();

        if (this.state === 'TITLE') {
            if (['enter', ' ', 'a', 's', 'd', 'z', 'x'].includes(k)) {
                this.startGame();
            }
            return;
        }

        if (this.state === 'MODE_SELECT') {
            if (k === 'arrowup' || k === 'w') this.changeMenuOption(-1);
            if (k === 'arrowdown' || k === 's') this.changeMenuOption(1);
            if (k === 'enter' || k === ' ' || k === 'a') this.confirmModeSelect();
            return;
        }

        if (this.state === 'CHAR_SELECT') {
            if (k === 'arrowleft' || k === 'a') this.moveCharSelect(-1);
            if (k === 'arrowright' || k === 'd') this.moveCharSelect(1);
            if (k === 'arrowup' || k === 'w') this.moveCharSelect(-4);
            if (k === 'arrowdown' || k === 's') this.moveCharSelect(4);
            if (k === 'enter' || k === ' ') this.confirmCharSelect();
            if (k === 'escape') this.state = 'MODE_SELECT';
            return;
        }

        if (this.state === 'VICTORY') {
            if (['enter', ' ', 'a', 's', 'd', 'x'].includes(k)) {
                this.nextFromVictory();
            }
            return;
        }

        if (this.state === 'TOUR_CLEAR') {
            if (['enter', ' ', 'a'].includes(k)) {
                this.state = 'TITLE';
            }
            return;
        }

        // Active Fight Controls
        if (this.state === 'FIGHT' && this.fighter1 && this.fightState === 'ACTIVE') {
            // Player 1 Keys: A = Punch, S = Kick, D = Special, Z = Block, X = Super
            // Move: ArrowLeft, ArrowRight, ArrowUp (jump), ArrowDown (crouch)
            if (k === 'arrowleft') this.fighter1.move(-1);
            if (k === 'arrowright') this.fighter1.move(1);
            if (k === 'arrowup') this.fighter1.jump();
            if (k === 'arrowdown') this.fighter1.crouch();
            if (k === 'a') this.fighter1.punch();
            if (k === 's') this.fighter1.kick();
            if (k === 'd') this.fighter1.special();
            if (k === 'z') this.fighter1.block(true);
            if (k === 'x') this.fighter1.superMove(this.fighter2);

            // Player 2 Controls (when in PVP mode)
            if (this.gameMode === 'PVP' && this.fighter2) {
                if (k === 'j') this.fighter2.punch();
                if (k === 'k') this.fighter2.kick();
                if (k === 'l') this.fighter2.special();
                if (k === 'm') this.fighter2.block(true);
                if (k === 'o') this.fighter2.superMove(this.fighter1);
                if (k === '4') this.fighter2.move(-1);
                if (k === '6') this.fighter2.move(1);
                if (k === '8') this.fighter2.jump();
                if (k === '5' || k === '2') this.fighter2.crouch();
            }
        }
    }

    handleKeyUp(key, e) {
        const k = key.toLowerCase();
        if (this.state === 'FIGHT' && this.fighter1) {
            if (k === 'arrowleft' || k === 'arrowright') this.fighter1.stopMove();
            if (k === 'arrowdown') this.fighter1.standUp();
            if (k === 'z') this.fighter1.block(false);

            if (this.gameMode === 'PVP' && this.fighter2) {
                if (k === '4' || k === '6') this.fighter2.stopMove();
                if (k === '5' || k === '2') this.fighter2.standUp();
                if (k === 'm') this.fighter2.block(false);
            }
        }
    }

    startGame() {
        window.soundEngine.playCoin();
        window.soundEngine.announce('Vivest Fighters! Escolha seu modo!');
        this.state = 'MODE_SELECT';
        this.menuSelection = 0;
        this.menuOptions = [
            { id: 'TOUR', name: 'CAMPANHA ARCADE', desc: 'Enfrente toda a equipe até a Meta Atuarial final!' },
            { id: 'ANTI_STRESS', name: 'DESESTRESSAR O MATHEUS! ★', desc: 'Modo especial: Matheus desabafa socando o Focus e o Alan!' },
            { id: 'VERSUS', name: 'MODO VERSUS (P1 vs CPU)', desc: 'Luta rápida individual contra o computador.' },
            { id: 'PVP', name: '2 JOGADORES (P1 vs P2 Local)', desc: 'Duelo mano a mano no mesmo teclado.' }
        ];
    }

    changeMenuOption(delta) {
        window.soundEngine.playSelect();
        this.menuSelection = (this.menuSelection + delta + this.menuOptions.length) % this.menuOptions.length;
    }

    confirmModeSelect() {
        window.soundEngine.playConfirm();
        const selected = this.menuOptions[this.menuSelection].id;
        this.gameMode = selected;

        if (this.gameMode === 'ANTI_STRESS') {
            // Instantly pick Matheus for Player 1, and Alan as dummy
            this.p1Char = this.roster.find(f => f.id === 'matheus');
            this.p2Char = this.roster.find(f => f.id === 'alan');
            this.startAntiStressMatch();
        } else {
            this.state = 'CHAR_SELECT';
            window.soundEngine.announce('Escolha seu lutador!');
        }
    }

    moveCharSelect(delta) {
        window.soundEngine.playSelect();
        this.p1SelectedIndex = (this.p1SelectedIndex + delta + this.roster.length) % this.roster.length;
        this.p1Char = this.roster[this.p1SelectedIndex];
    }

    confirmCharSelect() {
        window.soundEngine.playConfirm();
        window.soundEngine.announce(`${this.p1Char.name}! ${this.p1Char.tagline}`);

        if (this.gameMode === 'TOUR') {
            // Setup Campaign queue: all other 7 characters + Boss
            this.tourOpponents = this.roster.filter(f => f.id !== this.p1Char.id);
            // Shuffle
            this.tourOpponents.sort(() => Math.random() - 0.5);
            // Append Boss as final encounter
            this.tourOpponents.push(this.boss);
            this.tourCurrentIndex = 0;
            this.p2Char = this.tourOpponents[0];
            this.startMatchTransition();
        } else if (this.gameMode === 'VERSUS') {
            // Pick random opponent or second selection
            const rivals = this.roster.filter(f => f.id !== this.p1Char.id);
            this.p2Char = rivals[Math.floor(Math.random() * rivals.length)];
            this.startMatchTransition();
        } else if (this.gameMode === 'PVP') {
            // Pick next char for P2
            this.p2SelectedIndex = (this.p1SelectedIndex + 1) % this.roster.length;
            this.p2Char = this.roster[this.p2SelectedIndex];
            this.startMatchTransition();
        }
    }

    startMatchTransition() {
        this.state = 'VS_SCREEN';
        this.vsTimer = 0;
        // Select appropriate stage
        if (this.p2Char.id === 'boss_meta') {
            this.stageManager.setStage('crisis_copom');
        } else if (this.p1Char.id === 'matheus' || this.p2Char.id === 'matheus') {
            this.stageManager.setStage('crisis_copom');
        } else if (this.p1Char.id === 'rai' || this.p2Char.id === 'rai') {
            this.stageManager.setStage('rooftop');
        } else {
            this.stageManager.setStage(Math.floor(Math.random() * 3));
        }

        window.soundEngine.announce(`${this.p1Char.name} versus ${this.p2Char.name}!`);

        setTimeout(() => {
            this.initFightMatch();
        }, 2600);
    }

    startAntiStressMatch() {
        this.matheusStressScore = 100;
        this.stageManager.setStage('crisis_copom');
        this.state = 'FIGHT';
        this.round = 1;
        this.p1RoundsWon = 0;
        this.p2RoundsWon = 0;

        const ground = this.stageManager.getCurrentStage().groundY;
        this.fighter1 = new window.Fighter(this.p1Char, true, ground);
        this.fighter2 = new window.Fighter(this.p2Char, false, ground);

        // Matheus starts with extra juice and full super!
        this.fighter1.superMeter = 100;
        this.ai.setAntiStressMode(true);

        this.startRound();
        window.soundEngine.announce('Modo Anti-Stress! Matheus, descarregue todo o seu stress!');
    }

    initFightMatch() {
        this.state = 'FIGHT';
        this.round = 1;
        this.p1RoundsWon = 0;
        this.p2RoundsWon = 0;
        this.ai.setAntiStressMode(false);
        this.ai.setDifficulty(this.difficulty);

        const ground = this.stageManager.getCurrentStage().groundY;
        this.fighter1 = new window.Fighter(this.p1Char, true, ground);
        this.fighter2 = new window.Fighter(this.p2Char, false, ground);

        this.startRound();
    }

    startRound() {
        this.fightState = 'COUNTDOWN';
        this.roundTimer = 99;
        this.timerAccumulator = 0;

        const ground = this.stageManager.getCurrentStage().groundY;
        this.fighter1.x = 220;
        this.fighter1.y = ground;
        this.fighter1.hp = 100;
        this.fighter1.prevHp = 100;
        this.fighter1.setState('idle');

        this.fighter2.x = 740;
        this.fighter2.y = ground;
        this.fighter2.hp = 100;
        this.fighter2.prevHp = 100;
        this.fighter2.setState('idle');

        this.announcementText = `ROUND ${this.round}`;
        this.announcementTimer = 1.2;
        window.soundEngine.playConfirm();
        window.soundEngine.announce(`Round ${this.round}!`);

        setTimeout(() => {
            this.announcementText = 'LUTE!';
            this.announcementTimer = 0.9;
            this.fightState = 'ACTIVE';
            window.soundEngine.announce('Lute!');
            window.soundEngine.startMusic();
        }, 1200);
    }

    nextFromVictory() {
        if (this.gameMode === 'TOUR') {
            if (this.matchWinner === this.fighter1) {
                this.tourCurrentIndex++;
                if (this.tourCurrentIndex >= this.tourOpponents.length) {
                    // Beat the entire tournament!
                    this.state = 'TOUR_CLEAR';
                    window.soundEngine.announce('Parabéns! Você bateu a Meta Atuarial e salvou o fundo de pensão!');
                } else {
                    // Next battle in tour
                    this.p2Char = this.tourOpponents[this.tourCurrentIndex];
                    this.startMatchTransition();
                }
            } else {
                // Player lost in campaign: Retry
                this.startMatchTransition();
            }
        } else if (this.gameMode === 'ANTI_STRESS') {
            this.state = 'MODE_SELECT';
        } else {
            this.state = 'CHAR_SELECT';
        }
    }

    loop(currentTime) {
        const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;
        this.gameTime += dt;

        this.update(dt);
        this.draw();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        if (this.state === 'FIGHT') {
            this.updateFight(dt);
        }
    }

    updateFight(dt) {
        if (this.announcementTimer > 0) {
            this.announcementTimer -= dt;
            if (this.announcementTimer <= 0) this.announcementText = '';
        }

        if (this.fightState === 'ACTIVE') {
            // Round Timer countdown
            this.timerAccumulator += dt;
            if (this.timerAccumulator >= 1.0) {
                this.roundTimer = Math.max(0, this.roundTimer - 1);
                this.timerAccumulator = 0;
                if (this.roundTimer === 0) {
                    this.endRoundByTimeout();
                }
            }

            // AI Decision Making (Player 2)
            if (this.gameMode !== 'PVP') {
                this.ai.update(dt, this.fighter2, this.fighter1);
            }

            // In Anti-Stress Mode: update Matheus's stress score based on damage dealt to opponent!
            if (this.gameMode === 'ANTI_STRESS') {
                this.matheusStressScore = Math.max(0, Math.round(this.fighter2.hp));
            }

            // Check Round Over (K.O.)
            if (this.fighter1.hp <= 0 || this.fighter2.hp <= 0) {
                this.fightState = 'KO_SLOWMO';
                this.roundWinner = this.fighter1.hp > 0 ? this.fighter1 : this.fighter2;
                this.announcementText = 'K.O.!';
                this.announcementTimer = 2.0;
                window.soundEngine.announce('K.O.!');

                setTimeout(() => {
                    this.endRound();
                }, 2000);
            }
        }

        // Update Fighters
        const ground = this.stageManager.getCurrentStage().groundY;
        this.fighter1.setGroundY(ground);
        this.fighter2.setGroundY(ground);

        this.fighter1.update(dt, this.fighter2, this.width);
        this.fighter2.update(dt, this.fighter1, this.width);
    }

    endRoundByTimeout() {
        this.fightState = 'ROUND_OVER';
        this.roundWinner = this.fighter1.hp >= this.fighter2.hp ? this.fighter1 : this.fighter2;
        this.announcementText = 'TEMPO ESGOTADO!';
        this.announcementTimer = 2.0;
        window.soundEngine.announce('Tempo esgotado!');
        setTimeout(() => this.endRound(), 2000);
    }

    endRound() {
        if (this.roundWinner === this.fighter1) {
            this.p1RoundsWon++;
        } else {
            this.p2RoundsWon++;
        }

        // Check Match Winner (Best of 3, or in Anti-Stress mode 1 round is enough)
        const targetRounds = this.gameMode === 'ANTI_STRESS' ? 1 : 2;
        if (this.p1RoundsWon >= targetRounds || this.p2RoundsWon >= targetRounds) {
            this.matchWinner = this.p1RoundsWon >= targetRounds ? this.fighter1 : this.fighter2;
            this.state = 'VICTORY';
            window.soundEngine.announce(`Vitória de ${this.matchWinner.data.name}!`);
        } else {
            this.round++;
            this.startRound();
        }
    }

    // DRAW ROUTINES
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        switch (this.state) {
            case 'TITLE': this.drawTitleScreen(); break;
            case 'MODE_SELECT': this.drawModeSelect(); break;
            case 'CHAR_SELECT': this.drawCharSelect(); break;
            case 'VS_SCREEN': this.drawVSScreen(); break;
            case 'FIGHT': this.drawFight(); break;
            case 'VICTORY': this.drawVictory(); break;
            case 'TOUR_CLEAR': this.drawTourClear(); break;
        }
    }

    drawTitleScreen() {
        // Draw Title Graphic Background
        if (this.titleLogoLoaded) {
            this.ctx.drawImage(this.titleLogo, 0, 0, this.width, this.height);
        } else {
            // Dark gradient
            const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
            grad.addColorStop(0, '#090d16');
            grad.addColorStop(1, '#020617');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, this.width, this.height);

            // Large Title Text
            this.ctx.font = '900 64px "Impact", "Arial Black", sans-serif';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 8;
            this.ctx.textAlign = 'center';
            this.ctx.strokeText('VIVEST FIGHTERS', this.width / 2, 220);
            this.ctx.fillText('VIVEST FIGHTERS', this.width / 2, 220);

            this.ctx.font = '700 24px "Arial", sans-serif';
            this.ctx.fillStyle = '#38bdf8';
            this.ctx.fillText('A GUERRA DA META ATUARIAL', this.width / 2, 280);
        }

        // Blinking Press Start
        const blink = Math.sin(this.gameTime * 5) > 0;
        if (blink) {
            this.ctx.save();
            this.ctx.font = '900 28px "Impact", "Arial Black", sans-serif';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.strokeStyle = '#0284c7';
            this.ctx.lineWidth = 5;
            this.ctx.textAlign = 'center';
            this.ctx.strokeText('PRESS START / ENTER PARA JOGAR', this.width / 2, 570);
            this.ctx.fillText('PRESS START / ENTER PARA JOGAR', this.width / 2, 570);
            this.ctx.restore();
        }

        // Bottom Ticker Banner
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        this.ctx.fillRect(0, this.height - 30, this.width, 30);
        this.ctx.font = 'bold 12px monospace';
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VIVEST FIGHTERS 2026 ◆ O CLUBE DA LUTA DA FARIA LIMA ◆ DEDICADO AO MATHEUS DESESTRESSAR!', this.width / 2, this.height - 10);
        this.ctx.restore();
    }

    drawModeSelect() {
        // Background
        this.stageManager.draw(this.ctx, this.width, this.height, this.gameTime);

        // Semi-transparent dark overlay
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        this.ctx.fillRect(80, 50, this.width - 160, this.height - 100);
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(80, 50, this.width - 160, this.height - 100);

        // Header
        this.ctx.font = '900 36px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SELECIONE O MODO DE JOGO', this.width / 2, 115);

        // Options List
        this.menuOptions.forEach((opt, idx) => {
            const isSelected = idx === this.menuSelection;
            const y = 190 + idx * 80;

            if (isSelected) {
                this.ctx.fillStyle = opt.id === 'ANTI_STRESS' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.25)';
                this.ctx.fillRect(120, y - 35, this.width - 240, 70);
                this.ctx.strokeStyle = opt.id === 'ANTI_STRESS' ? '#ef4444' : '#38bdf8';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(120, y - 35, this.width - 240, 70);
            }

            this.ctx.font = `900 24px "Impact", sans-serif`;
            this.ctx.fillStyle = isSelected ? (opt.id === 'ANTI_STRESS' ? '#ff4d4d' : '#ffd700') : '#94a3b8';
            this.ctx.textAlign = 'left';
            this.ctx.fillText((isSelected ? '▶ ' : '   ') + opt.name, 140, y);

            this.ctx.font = '14px sans-serif';
            this.ctx.fillStyle = isSelected ? '#ffffff' : '#64748b';
            this.ctx.fillText(opt.desc, 175, y + 22);
        });

        // Instructions Footer
        this.ctx.font = 'bold 13px monospace';
        this.ctx.fillStyle = '#cbd5e1';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('USE AS SETAS [↑ / ↓] PARA NAVEGAR  ◆  [ENTER / A] PARA CONFIRMAR', this.width / 2, 565);
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;

        window.soundEngine.init();

        if (this.state === 'TITLE') {
            this.startGame();
            return;
        }

        if (this.state === 'MODE_SELECT') {
            // Check which option was clicked
            this.menuOptions.forEach((opt, idx) => {
                const y = 190 + idx * 80;
                if (clickX >= 120 && clickX <= this.width - 120 && clickY >= y - 35 && clickY <= y + 35) {
                    this.menuSelection = idx;
                    this.confirmModeSelect();
                }
            });
            return;
        }

        if (this.state === 'CHAR_SELECT') {
            // Check if one of the 8 character cards was clicked
            const gridStartX = 45;
            const gridStartY = 140;
            const cardW = 112;
            const cardH = 190;
            const gapX = 14;
            const gapY = 16;

            for (let i = 0; i < 8; i++) {
                const col = i % 4;
                const row = Math.floor(i / 4);
                const x = gridStartX + col * (cardW + gapX);
                const y = gridStartY + row * (cardH + gapY);

                if (clickX >= x && clickX <= x + cardW && clickY >= y && clickY <= y + cardH) {
                    if (this.p1SelectedIndex === i) {
                        this.confirmCharSelect();
                    } else {
                        window.soundEngine.playSelect();
                        this.p1SelectedIndex = i;
                        this.p1Char = this.roster[i];
                    }
                    return;
                }
            }

            // Clicked confirm button
            if (clickY > 560) {
                this.confirmCharSelect();
            }
            return;
        }

        if (this.state === 'VICTORY') {
            this.nextFromVictory();
            return;
        }

        if (this.state === 'TOUR_CLEAR') {
            this.state = 'TITLE';
        }
    }

    drawCharSelect() {
        this.stageManager.draw(this.ctx, this.width, this.height, this.gameTime);

        // Dark modal frame
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        this.ctx.fillRect(25, 20, this.width - 50, this.height - 40);
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(25, 20, this.width - 50, this.height - 40);

        // Header: Street Fighter Logo & Title
        if (this.sfLogoLoaded) {
            this.ctx.drawImage(this.sfLogo, 45, 30, 340, 85);
        } else {
            this.ctx.font = '900 32px "Impact", sans-serif';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('STREET FIGHTER: NEW CHALLENGERS', 45, 75);
        }

        this.ctx.font = '900 18px "Impact", sans-serif';
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('SELECT YOUR FIGHTER', 410, 75);

        // 8 Character Cards in 2 Rows of 4 (Matching the User's Street Fighter Poster!)
        const gridStartX = 45;
        const gridStartY = 135;
        const cardW = 112;
        const cardH = 192;
        const gapX = 14;
        const gapY = 16;

        this.roster.forEach((f, idx) => {
            const col = idx % 4;
            const row = Math.floor(idx / 4);
            const x = gridStartX + col * (cardW + gapX);
            const y = gridStartY + row * (cardH + gapY);
            const isSelected = idx === this.p1SelectedIndex;

            this.ctx.save();
            // Background Card
            this.ctx.fillStyle = isSelected ? 'rgba(56, 189, 248, 0.35)' : 'rgba(30, 41, 59, 0.8)';
            this.ctx.fillRect(x, y, cardW, cardH);

            // Card Image from the Street Fighter Poster
            const cardImg = this.rosterCards[f.id];
            if (cardImg && cardImg.complete && cardImg.naturalWidth > 0) {
                this.ctx.drawImage(cardImg, x + 2, y + 2, cardW - 4, cardH - 32);
            } else {
                // Fallback
                this.ctx.fillStyle = f.themeColor;
                this.ctx.fillRect(x + 4, y + 4, cardW - 8, cardH - 36);
            }

            // Nameplate at the bottom of the card
            this.ctx.fillStyle = isSelected ? '#ffd700' : '#1e293b';
            this.ctx.fillRect(x, y + cardH - 28, cardW, 28);
            this.ctx.font = '900 13px "Impact", sans-serif';
            this.ctx.fillStyle = isSelected ? '#0f172a' : '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(f.name.toUpperCase(), x + cardW / 2, y + cardH - 9);

            // Glowing Animated Selection Border
            if (isSelected) {
                const glow = (Math.sin(this.gameTime * 10) + 1) / 2;
                this.ctx.strokeStyle = '#ffd700';
                this.ctx.lineWidth = 4 + glow * 2;
                this.ctx.shadowColor = '#ffd700';
                this.ctx.shadowBlur = 15;
                this.ctx.strokeRect(x, y, cardW, cardH);

                // Corner Arcade Brackets
                this.ctx.fillStyle = '#ef4444';
                this.ctx.fillRect(x - 3, y - 3, 10, 4);
                this.ctx.fillRect(x - 3, y - 3, 4, 10);
                this.ctx.fillRect(x + cardW - 7, y - 3, 10, 4);
                this.ctx.fillRect(x + cardW - 1, y - 3, 4, 10);
            } else {
                this.ctx.strokeStyle = f.themeColor;
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, cardW, cardH);
            }

            this.ctx.restore();
        });

        // Right Panel: Selected Character Dossier
        const panelX = 575;
        const panelY = 95;
        const panelW = 340;
        const sel = this.p1Char;

        this.ctx.save();
        this.ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        this.ctx.fillRect(panelX, panelY, panelW, 460);
        this.ctx.strokeStyle = sel.themeColor;
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(panelX, panelY, panelW, 460);

        // Header Name & Title
        this.ctx.font = '900 32px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(sel.name.toUpperCase(), panelX + 20, panelY + 42);

        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.fillStyle = sel.themeColor;
        this.ctx.fillText(sel.sfTitle || sel.role, panelX + 20, panelY + 65);

        this.ctx.font = 'bold 11px monospace';
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.fillText(`ORIGEM: ${sel.origin || 'São Paulo / Brasil'}`, panelX + 20, panelY + 84);

        // Stats Bars
        const statsList = [
            { label: 'ATAQUE', val: sel.stats.attack, col: '#ef4444' },
            { label: 'VELOCIDADE', val: sel.stats.speed, col: '#38bdf8' },
            { label: 'DEFESA', val: sel.stats.defense, col: '#10b981' },
            { label: 'STRESS', val: sel.stats.stress, col: '#f59e0b' }
        ];

        statsList.forEach((st, i) => {
            const sy = panelY + 115 + i * 26;
            this.ctx.font = 'bold 10px monospace';
            this.ctx.fillStyle = '#e2e8f0';
            this.ctx.fillText(st.label, panelX + 20, sy);

            this.ctx.fillStyle = '#1e293b';
            this.ctx.fillRect(panelX + 115, sy - 10, 195, 12);
            this.ctx.fillStyle = st.col;
            this.ctx.fillRect(panelX + 115, sy - 10, (st.val / 100) * 195, 12);
        });

        // Special Moves Info
        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillText(`PODER [D]: ${sel.specialMove.sfName || sel.specialMove.name}`, panelX + 20, panelY + 245);
        this.ctx.font = '11px sans-serif';
        this.ctx.fillStyle = '#cbd5e1';
        this.wrapText(sel.specialMove.desc, panelX + 20, panelY + 265, 300, 16);

        this.ctx.font = 'bold 12px sans-serif';
        this.ctx.fillStyle = '#f43f5e';
        this.ctx.fillText(`SUPER [X]: ${sel.superMove.sfName || sel.superMove.name}`, panelX + 20, panelY + 325);
        this.ctx.font = '11px sans-serif';
        this.ctx.fillStyle = '#cbd5e1';
        this.wrapText(sel.superMove.desc, panelX + 20, panelY + 345, 300, 16);

        // Bio
        this.ctx.font = 'italic 11px sans-serif';
        this.ctx.fillStyle = '#94a3b8';
        this.wrapText(`"${sel.bio}"`, panelX + 20, panelY + 405, 300, 15);

        this.ctx.restore();

        // Footer Instructions
        this.ctx.font = '900 15px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CLIQUE NO PERSONAGEM OU USE AS SETAS + [ENTER] PARA ESCOLHER', this.width / 2, 585);
    }

    drawVSScreen() {
        // Dramatic Versus Transition
        this.ctx.fillStyle = '#090d16';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Angled Red & Blue Energy Split
        this.ctx.fillStyle = '#1e3a8a';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.width * 0.58, 0);
        this.ctx.lineTo(this.width * 0.42, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.fill();

        this.ctx.fillStyle = '#831843';
        this.ctx.beginPath();
        this.ctx.moveTo(this.width * 0.58, 0);
        this.ctx.lineTo(this.width, 0);
        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(this.width * 0.42, this.height);
        this.ctx.fill();

        // Player 1 Card Left (Full Street Fighter Card!)
        const p1 = this.p1Char;
        const card1 = this.rosterCards[p1.id];
        const cardW = 200;
        const cardH = 340;

        this.ctx.save();
        this.ctx.shadowColor = p1.themeColor;
        this.ctx.shadowBlur = 25;
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(120, 110, cardW, cardH);
        if (card1 && card1.complete) {
            this.ctx.drawImage(card1, 120, 110, cardW, cardH);
        }
        this.ctx.restore();

        this.ctx.font = '900 36px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 6;
        this.ctx.textAlign = 'center';
        this.ctx.strokeText(p1.name.toUpperCase(), 220, 490);
        this.ctx.fillText(p1.name.toUpperCase(), 220, 490);

        this.ctx.font = 'bold 14px monospace';
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillText(p1.sfTitle || p1.role, 220, 520);

        // Center VS Banner
        this.ctx.save();
        this.ctx.font = '900 84px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 12;
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = '#ff0033';
        this.ctx.shadowBlur = 30;
        this.ctx.strokeText('VS', this.width / 2, 290);
        this.ctx.fillText('VS', this.width / 2, 290);
        this.ctx.restore();

        // Player 2 Card Right (Full Street Fighter Card!)
        const p2 = this.p2Char;
        const card2 = this.rosterCards[p2.id];

        this.ctx.save();
        this.ctx.shadowColor = p2.themeColor;
        this.ctx.shadowBlur = 25;
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(this.width - 120 - cardW, 110, cardW, cardH);
        if (card2 && card2.complete) {
            this.ctx.drawImage(card2, this.width - 120 - cardW, 110, cardW, cardH);
        }
        this.ctx.restore();

        this.ctx.font = '900 36px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 6;
        this.ctx.textAlign = 'center';
        this.ctx.strokeText(p2.name.toUpperCase(), this.width - 220, 490);
        this.ctx.fillText(p2.name.toUpperCase(), this.width - 220, 490);

        this.ctx.font = 'bold 14px monospace';
        this.ctx.fillStyle = '#f43f5e';
        this.ctx.fillText(p2.sfTitle || p2.role, this.width - 220, 520);

        // Arena Subtitle
        const stg = this.stageManager.getCurrentStage();
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`ARENA: ${stg.name.toUpperCase()} ◆ ${stg.subtitle}`, this.width / 2, 580);
    }

    drawFight() {
        // Draw Stage Arena
        this.stageManager.draw(this.ctx, this.width, this.height, this.gameTime);

        // Draw Fighters
        this.fighter1.draw(this.ctx, this.gameTime);
        this.fighter2.draw(this.ctx, this.gameTime);

        // Draw HUD (Health Bars, Names, Super Meter, Timer)
        this.drawHUD();

        // Draw Announcements ("ROUND 1", "LUTE!", "K.O.!")
        if (this.announcementText) {
            this.ctx.save();
            this.ctx.font = '900 72px "Impact", "Arial Black", sans-serif';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 8;
            this.ctx.textAlign = 'center';
            this.ctx.strokeText(this.announcementText, this.width / 2, 300);
            this.ctx.fillText(this.announcementText, this.width / 2, 300);
            this.ctx.restore();
        }
    }

    drawHUD() {
        const barW = 345;
        const barH = 24;
        const topY = 54;

        // Top Metal HUD Backing Plate for 100% contrast on any stage
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(10, 15, 29, 0.92)';
        this.ctx.fillRect(12, 22, this.width - 24, 78);
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(12, 22, this.width - 24, 78);

        // Player 1 Health Bar (Left to Right)
        // Beveled Metal Background
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(45, topY, barW, barH);
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(45, topY, barW, barH);

        // Red Lag Drain Bar P1
        const p1PrevW = (this.fighter1.prevHp / 100) * (barW - 4);
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(47, topY + 2, p1PrevW, barH - 4);

        // Street Fighter Yellow/Gold HP Bar P1
        const p1W = (this.fighter1.hp / 100) * (barW - 4);
        const p1Grad = this.ctx.createLinearGradient(47, topY, 47, topY + barH);
        if (this.fighter1.hp > 25) {
            p1Grad.addColorStop(0, '#fef08a');
            p1Grad.addColorStop(0.5, '#eab308');
            p1Grad.addColorStop(1, '#ca8a04');
        } else {
            p1Grad.addColorStop(0, '#fca5a5');
            p1Grad.addColorStop(0.5, '#ef4444');
            p1Grad.addColorStop(1, '#b91c1c');
        }
        this.ctx.fillStyle = p1Grad;
        this.ctx.fillRect(47, topY + 2, p1W, barH - 4);

        // P1 Name with Street Fighter Shadow
        this.ctx.font = '900 20px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 4;
        this.ctx.textAlign = 'left';
        this.ctx.strokeText(this.fighter1.data.name.toUpperCase(), 45, topY - 8);
        this.ctx.fillText(this.fighter1.data.name.toUpperCase(), 45, topY - 8);

        // P1 Mini Portrait Icon on Health Bar Edge
        const p1Icon = this.fighter1.photoImg;
        if (this.fighter1.photoLoaded) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(30, topY + barH / 2, 16, 0, Math.PI * 2);
            this.ctx.clip();
            this.ctx.drawImage(p1Icon, 14, topY + barH / 2 - 16, 32, 32);
            this.ctx.restore();
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(30, topY + barH / 2, 16, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // P1 Super Meter Gauge (Street Fighter Alpha Style)
        const meterY = topY + barH + 8;
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(45, meterY, barW, 12);
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(45, meterY, barW, 12);

        const p1SuperW = (this.fighter1.superMeter / 100) * (barW - 2);
        const superGrad = this.ctx.createLinearGradient(46, meterY, 46 + barW, meterY);
        superGrad.addColorStop(0, '#0284c7');
        superGrad.addColorStop(0.7, '#38bdf8');
        superGrad.addColorStop(1, '#ffd700');
        this.ctx.fillStyle = this.fighter1.superMeter >= 100 ? '#ffd700' : superGrad;
        this.ctx.fillRect(46, meterY + 1, p1SuperW, 10);

        if (this.fighter1.superMeter >= 100) {
            this.ctx.font = '900 11px "Impact", monospace';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fillText('★ SUPER COMBO LEVEL MAX! [X] ★', 45, meterY + 24);
        }

        // P1 Win Medals
        for (let i = 0; i < 2; i++) {
            this.ctx.font = '14px sans-serif';
            this.ctx.fillStyle = i < this.p1RoundsWon ? '#ffd700' : '#475569';
            this.ctx.fillText('★', 360 + i * 18, topY - 8);
        }

        // Center Street Fighter 99 Timer
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(this.width / 2 - 38, topY - 14, 76, 56);
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(this.width / 2 - 38, topY - 14, 76, 56);

        this.ctx.font = '900 36px "Impact", monospace';
        this.ctx.fillStyle = this.roundTimer < 15 ? '#ef4444' : '#ffd700';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 4;
        this.ctx.textAlign = 'center';
        this.ctx.strokeText(String(this.roundTimer).padStart(2, '0'), this.width / 2, topY + 28);
        this.ctx.fillText(String(this.roundTimer).padStart(2, '0'), this.width / 2, topY + 28);

        // Player 2 Health Bar (Right to Left)
        const p2StartX = this.width - 45 - barW;
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(p2StartX, topY, barW, barH);
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(p2StartX, topY, barW, barH);

        // Red Lag Drain Bar P2
        const p2PrevW = (this.fighter2.prevHp / 100) * (barW - 4);
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(p2StartX + (barW - 4 - p2PrevW) + 2, topY + 2, p2PrevW, barH - 4);

        // Street Fighter Yellow/Gold HP Bar P2
        const p2W = (this.fighter2.hp / 100) * (barW - 4);
        this.ctx.fillStyle = this.fighter2.hp > 25 ? p1Grad : '#ef4444';
        this.ctx.fillRect(p2StartX + (barW - 4 - p2W) + 2, topY + 2, p2W, barH - 4);

        // P2 Name with Street Fighter Shadow
        this.ctx.font = '900 20px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 4;
        this.ctx.textAlign = 'right';
        this.ctx.strokeText(this.fighter2.data.name.toUpperCase(), this.width - 45, topY - 8);
        this.ctx.fillText(this.fighter2.data.name.toUpperCase(), this.width - 45, topY - 8);

        // P2 Mini Portrait Icon on Health Bar Edge
        const p2Icon = this.fighter2.photoImg;
        if (this.fighter2.photoLoaded) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.width - 30, topY + barH / 2, 16, 0, Math.PI * 2);
            this.ctx.clip();
            this.ctx.drawImage(p2Icon, this.width - 46, topY + barH / 2 - 16, 32, 32);
            this.ctx.restore();
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(this.width - 30, topY + barH / 2, 16, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // P2 Super Meter Gauge
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(p2StartX, meterY, barW, 12);
        this.ctx.strokeStyle = '#f43f5e';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(p2StartX, meterY, barW, 12);

        const p2SuperW = (this.fighter2.superMeter / 100) * (barW - 2);
        this.ctx.fillStyle = this.fighter2.superMeter >= 100 ? '#ffd700' : '#f43f5e';
        this.ctx.fillRect(p2StartX + (barW - 2 - p2SuperW) + 1, meterY + 1, p2SuperW, 10);

        // P2 Win Medals
        for (let i = 0; i < 2; i++) {
            this.ctx.font = '14px sans-serif';
            this.ctx.fillStyle = i < this.p2RoundsWon ? '#ffd700' : '#475569';
            this.ctx.fillText('★', this.width - 360 - i * 18, topY - 8);
        }

        // Special Anti-Stress Meter Overlay
        if (this.gameMode === 'ANTI_STRESS') {
            const stressY = 105;
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            this.ctx.fillRect(this.width / 2 - 200, stressY, 400, 34);
            this.ctx.strokeStyle = '#ef4444';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.width / 2 - 200, stressY, 400, 34);

            this.ctx.font = '900 14px "Impact", sans-serif';
            this.ctx.fillStyle = '#ffd700';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`★ ESTRESSE DO MATHEUS: ${this.matheusStressScore}% (BATA NO FOCUS!) ★`, this.width / 2, stressY + 22);
        }

        this.ctx.restore();
    }

    drawVictory() {
        this.stageManager.draw(this.ctx, this.width, this.height, this.gameTime);

        // Dark modal
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        this.ctx.fillRect(100, 60, this.width - 200, this.height - 120);
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(100, 60, this.width - 200, this.height - 120);

        const winner = this.matchWinner;
        const loser = winner === this.fighter1 ? this.fighter2 : this.fighter1;

        // Header
        this.ctx.font = '900 48px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${winner.data.name.toUpperCase()} VENCEU!`, this.width / 2, 130);

        // Winner Portrait
        const cx = this.width / 2 - 160;
        const cy = 270;
        const r = 90;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.clip();
        const img = new Image();
        img.src = winner.data.photo;
        this.ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
        this.ctx.restore();

        this.ctx.strokeStyle = winner.data.themeColor;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        // Speech Bubble with Victory Quote
        const bubbleX = this.width / 2 - 40;
        const bubbleY = 180;
        const bubbleW = 340;
        const bubbleH = 180;

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(bubbleX, bubbleY, bubbleW, bubbleH);
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(bubbleX, bubbleY, bubbleW, bubbleH);

        // Pick specific quote for who beat whom
        let quote = winner.data.victoryQuotes[loser.data.id] || winner.data.victoryQuotes.default;
        if (winner.data.id === 'matheus' && this.gameMode === 'ANTI_STRESS') {
            quote = 'O RIVOTRIL FEZ EFEITO! DESESTRESSEI 100%! AGORA VOU DORMIR!';
        }

        this.ctx.font = 'bold 15px sans-serif';
        this.ctx.fillStyle = '#0f172a';
        this.ctx.textAlign = 'left';
        this.wrapText(`"${quote}"`, bubbleX + 20, bubbleY + 45, bubbleW - 40, 22);

        // Continue prompt
        this.ctx.font = '900 18px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PRESSIONE [ENTER / A] PARA CONTINUAR', this.width / 2, 530);
    }

    drawTourClear() {
        this.stageManager.draw(this.ctx, this.width, this.height, this.gameTime);

        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        this.ctx.fillRect(60, 40, this.width - 120, this.height - 80);
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(60, 40, this.width - 120, this.height - 80);

        this.ctx.font = '900 48px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('META ATUARIAL BATIDA COM SUCESSO!', this.width / 2, 130);

        this.ctx.font = '700 20px "Arial", sans-serif';
        this.ctx.fillStyle = '#38bdf8';
        this.ctx.fillText('A VIVEST REGISTRA SUPERÁVIT HISTÓRICO!', this.width / 2, 175);

        const epilogue = [
            'O Fantasma da Meta Atuarial foi derrotado pelo comitê dos estagiários e analistas!',
            '◆ Matheus teve suas férias de 30 dias aprovadas e foi surfar no Rio de Janeiro com o Rai.',
            '◆ Max automatizou 100% da previdência brasileira em 14 linhas de Python.',
            '◆ Gabriela distribuiu dividendos extraordinários e sorrisos para todos os participantes.',
            '◆ Maycon achou outra Small Cap e comprou uma fazenda.',
            '◆ Alan jurou que tudo isso fez parte da estratégia imobiliária dele.',
            '◆ Luiza calculou a duration do churrasco da equipe: infinito!',
            '◆ Stefano? Ninguém sabe... ele sumiu antes da foto oficial.'
        ];

        this.ctx.font = '14px sans-serif';
        this.ctx.fillStyle = '#e2e8f0';
        this.ctx.textAlign = 'left';
        epilogue.forEach((line, i) => {
            this.ctx.fillText(line, 100, 230 + i * 32);
        });

        this.ctx.font = '900 18px "Impact", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PRESSIONE [ENTER] PARA VOLTAR AO MENU PRINCIPAL', this.width / 2, 550);
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                this.ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, y);
    }
}

// Global Launch
window.addEventListener('load', () => {
    window.game = new GameManager();

    // Hook Sound Toggle Button in cabinet
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const isMuted = window.soundEngine.toggleMute();
            soundToggle.classList.toggle('muted', isMuted);
            soundToggle.title = isMuted ? 'Ligar Som' : 'Desligar Som';
        });
    }

    // Hook Scanlines Toggle
    const crtToggle = document.getElementById('crt-toggle');
    const screenEl = document.querySelector('.screen');
    if (crtToggle && screenEl) {
        crtToggle.addEventListener('click', () => {
            screenEl.classList.toggle('crt-active');
        });
    }
});
