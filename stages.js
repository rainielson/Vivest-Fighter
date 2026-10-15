// Stages Configuration & Dynamic Arena Effects for Vivest Fighters
const STAGES_DATA = [
    {
        id: 'boardroom',
        name: 'Plenário da Vivest',
        subtitle: 'Comitê de Investimentos & Alocação',
        imageSrc: 'assets/stages/boardroom.jpg',
        groundY: 530,
        musicTempo: 130,
        tickers: ['VIVEST: META BATIDA +2.4%', 'NTN-B 2035: IPCA + 6.12%', 'CDI: 10.50%', 'DÉFICIT ATUARIAL: 0.00%'],
        drawEffects: (ctx, width, height, time) => {
            // Subtle neon reflection on polished wooden floor
            ctx.save();
            ctx.globalAlpha = 0.08 + Math.sin(time * 2) * 0.04;
            ctx.fillStyle = '#00d2ff';
            ctx.fillRect(0, 520, width, 120);
            ctx.restore();
        }
    },
    {
        id: 'rooftop',
        name: 'Rooftop Faria Lima Sunset',
        subtitle: 'O Coração Financeiro de São Paulo',
        imageSrc: 'assets/stages/rooftop.jpg',
        groundY: 520,
        musicTempo: 134,
        tickers: ['IBOVESPA: 134.500 PTS', 'PETR4: R$ 38.20 (+1.8%)', 'VALE3: R$ 68.40', 'DÓLAR: R$ 5.35 (-0.4%)'],
        drawEffects: (ctx, width, height, time) => {
            // Sunset heat haze & neon billboard glint
            ctx.save();
            const glow = 0.15 + Math.sin(time * 3) * 0.08;
            ctx.globalAlpha = glow;
            ctx.fillStyle = '#ff7b00';
            ctx.fillRect(width * 0.7, 0, width * 0.3, 200);
            ctx.restore();
        }
    },
    {
        id: 'trading_floor',
        name: 'Mesa de Operações & Bloomberg',
        subtitle: 'Sala dos Analistas & Café dos Estagiários',
        imageSrc: 'assets/stages/trading_floor.jpg',
        groundY: 525,
        musicTempo: 132,
        tickers: ['BLOOMBERG TERMINAL ONLINE', 'IPCA ACUMULADO: 4.15%', 'SELIC META: 10.75%', 'BOLETIM FOCUS: REVISÃO'],
        drawEffects: (ctx, width, height, time) => {
            // Blinking computer screens and coffee machine steam
            ctx.save();
            ctx.globalAlpha = 0.05 + Math.sin(time * 4) * 0.03;
            ctx.fillStyle = '#10b981';
            ctx.fillRect(0, 100, width, 300);
            // Coffee steam
            const steamY = (time * 40) % 60;
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(60 + Math.sin(time * 3) * 6, 320 - steamY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    },
    {
        id: 'crisis_copom',
        name: 'Sala de Crise do Copom',
        subtitle: 'Alerta da Selic & Tensão Total do Matheus',
        imageSrc: 'assets/stages/crisis_copom.jpg',
        groundY: 520,
        musicTempo: 140,
        tickers: ['! ALERTA: SELIC DISPAROU !', 'INFLAÇÃO EM ALTA', 'MATHEUS EM BURNOUT MÁXIMO', 'CIRCUIT BREAKER PREVENTIVO'],
        drawEffects: (ctx, width, height, time) => {
            // Red rotating emergency siren flashes
            ctx.save();
            const siren = (Math.sin(time * 6) + 1) / 2;
            ctx.globalAlpha = siren * 0.25;
            ctx.fillStyle = '#ff0033';
            ctx.fillRect(0, 0, width, height);

            // Lightning flash randomly
            if (Math.random() < 0.02) {
                ctx.globalAlpha = 0.35;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
            }
            ctx.restore();
        }
    }
];

class StageManager {
    constructor() {
        this.stages = STAGES_DATA;
        this.currentStageIndex = 0;
        this.loadedImages = {};
        this.preloadImages();
    }

    preloadImages() {
        this.stages.forEach(stage => {
            const img = new Image();
            img.src = stage.imageSrc;
            this.loadedImages[stage.id] = img;
        });
    }

    getCurrentStage() {
        return this.stages[this.currentStageIndex];
    }

    setStage(indexOrId) {
        if (typeof indexOrId === 'number') {
            this.currentStageIndex = Math.max(0, Math.min(this.stages.length - 1, indexOrId));
        } else {
            const idx = this.stages.findIndex(s => s.id === indexOrId);
            if (idx !== -1) this.currentStageIndex = idx;
        }
    }

    draw(ctx, width, height, time) {
        const stage = this.getCurrentStage();
        const img = this.loadedImages[stage.id];

        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, 0, 0, width, height);
        } else {
            // High quality fallback gradient
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            grad.addColorStop(0, '#0f172a');
            grad.addColorStop(0.6, '#1e293b');
            grad.addColorStop(1, '#020617');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
            
            // Grid floor
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, stage.groundY);
            ctx.lineTo(width, stage.groundY);
            ctx.stroke();
        }

        // Draw dynamic stage atmospheric effects
        if (stage.drawEffects) {
            stage.drawEffects(ctx, width, height, time);
        }

        // Animated Faria Lima Stock Ticker Banner at the top
        this.drawTicker(ctx, width, stage, time);
    }

    drawTicker(ctx, width, stage, time) {
        const barHeight = 24;
        ctx.save();
        ctx.fillStyle = 'rgba(10, 15, 30, 0.85)';
        ctx.fillRect(0, 0, width, barHeight);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, barHeight);
        ctx.lineTo(width, barHeight);
        ctx.stroke();

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        const fullText = stage.tickers.join('   ◆   ') + '   ◆   ' + stage.tickers.join('   ◆   ');
        const scrollSpeed = 45;
        const textWidth = ctx.measureText(fullText).width / 2;
        const offset = (time * scrollSpeed) % textWidth;

        ctx.fillText(fullText, -offset, barHeight / 2);
        ctx.restore();
    }
}

window.StageManager = StageManager;
