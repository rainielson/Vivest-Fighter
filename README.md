# 🥊 VIVEST FIGHTERS: NEW CHALLENGERS
### *A Guerra da Meta Atuarial — Edição Arcade Street Fighter*

Jogo de luta arcade retrô 16/32-bit desenvolvido especialmente para a equipe de Investimentos da **Vivest (Fundo de Pensão)**, inspirado no clássico **Street Fighter** e no **STF Fighters**.

---

## 👥 Personagens & Estilos de Luta (Street Fighter Roster)

1. **Matheus** — *Street Brawler do Macro*
   - **Visual:** Camisa xadrez flanela azul rasgada nos ombros, ataduras de boxe nas mãos, barba e aura de eletricidade azul.
   - **Golpe Especial [D]:** *Copom Knuckle / Ata de Fogo* (Dispara páginas flamejantes da ata do Copom).
   - **Super Combo [X]:** *Shoryuken Macro: Selic a 20%* (Descarrega todo o estresse acumulado em um triplo gancho ascendente!).
   - **Modo Especial:** *DESESTRESSAR O MATHEUS!* (Barra de estresse de 100% a 0% batendo no Alan e no Focus).

2. **Max** — *Muay Thai de Markowitz*
   - **Visual:** Calção de Muay Thai azul e laranja com "MAX", mongkhon tradicional na cabeça, bandagens nos braços e abdômen trincado.
   - **Golpe Especial [D]:** *Tiger Python Knee* (Joelha voadora com equações matemáticas parabólicas).
   - **Super Combo [X]:** *Tiger Markowitz Genocide* (Sequência de joelhadas e gancho de pura otimização de carteira).

3. **Luiza** — *Chun-Li dos Ilíquidos*
   - **Visual:** Qipao chinês de seda preta com dragão dourado, calça vermelha, luvas de combate e rabo de cavalo alto.
   - **Golpe Especial [D]:** *Hyakuretsu Duration* (Chuva veloz de chutes calculando o spread a laser).
   - **Super Combo [X]:** *Kikouken Marcação a Mercado* (Esfera gigante de ki que zera o prêmio de risco).

4. **Rai** — *Mestre do Ansatsuken Carioca*
   - **Visual:** Kimono Gi bege/areia tradicional com peito aberto, faixa preta, óculos e barba carioca com sorriso maroto.
   - **Golpe Especial [D]:** *Hadouken de Biscoito Globo* (Esfera de ki dourada de Biscoito Globo e mate trincando).
   - **Super Combo [X]:** *Shinku Hadouken: Alocação 100% Offshore* (Raio monumental que varre a Faria Lima).

5. **Alan** — *Akuma dos Ativos Ilíquidos*
   - **Visual:** Gi de Karate preto sem mangas rasgado nos ombros, faixa de corda escura, olhar sombrio e aura roxa.
   - **Golpe Especial [D]:** *Gohadoken das Debêntures* (Bola de fogo roxa carregada de contratos imobiliários).
   - **Super Combo [X]:** *Shun Goku Satsu: A Lenda de Dubai* (Tela apaga e desfere 15 golpes contando sua história com o xeque).

6. **Gabriela** — *A Cammy do Research*
   - **Visual:** Top esportivo de combate preto e vermelho, bermuda de kickboxing, luvas de boxe azuis e cabelos longos soltos.
   - **Golpe Especial [D]:** *Spiral DCF Arrow* (Avanço giratório em parafuso horizontal).
   - **Super Combo [X]:** *Spin Drive Downgrade* (Mortal acrobático Cannon Spike que rebaixa o valuation do rival com muita simpatia).

7. **Maycon** — *Sniper do MMA*
   - **Visual:** Jaqueta bomber esportiva azul-marinho, luvas de MMA pretas e corte moderno fade.
   - **Golpe Especial [D]:** *Sand Blaster Small Cap* (Impacto sônico à queima-roupa com ticker de 800%).
   - **Super Combo [X]:** *Erasure Alpha Strike* (Sequência de cruzados no queixo que destrói o EBITDA).

8. **Stefano** — *O Prodígio das Sombras*
   - **Visual:** Jaqueta jeans azul com gola alta, camiseta branca, cabelo volumoso ondulado, óculos e faixas nas mãos.
   - **Golpe Especial [D]:** *Shadow Teleport Slice* (Desaparece em fumaça azul e corta pelas costas).
   - **Super Combo [X]:** *Final Macro Burst* (Tempestade dimensional de dados confidenciais).

---

## 🕹️ Controles do Arcade

| Comando | Teclado | Painel Arcade (Toque / Mouse) |
| :--- | :---: | :---: |
| **Mover / Pular / Agachar** | `←` `↑` `↓` `→` | D-Pad / Botões direcionais |
| **Soco (Jab / Combo)** | `A` | Botão Vermelho [A] |
| **Chute (Roundhouse / Voadora)** | `S` | Botão Amarelo [S] |
| **Golpe Especial (Projétil / Ki)** | `D` | Botão Verde [D] |
| **Defesa (Guard Shield)** | `Z` | Botão Azul [Z] |
| **SUPER COMBO (Nível Máximo)** | `X` | Botão Roxo / Dourado [X] |
| **Confirmar / Iniciar / Start** | `ENTER` ou `ESPAÇO` | Botão de seleção |

---

## 🖼️ Especificações de Sprites (Caso queira carregar novas imagens)

O jogo possui um motor flexível em `physics.js` que carrega diretamente imagens transparentes PNG de corpo inteiro:

- **Pasta:** `assets/sprites/`
- **Nomenclatura por personagem:**
  - `[personagem]_idle.png` *(Stance de luta parado)*
  - `[personagem]_punch.png` *(Pose de soco)*
  - `[personagem]_kick.png` *(Pose de chute)*
  - `[personagem]_crouch.png` *(Pose agachado)*
  - `[personagem]_hurt.png` *(Pose recebendo dano)*
  - `[personagem]_special.png` *(Pose lançando poder)*
- **Resolução Recomendada:**
  - **Altura:** 240px a 320px
  - **Largura:** 140px a 220px (proporcional ao corpo)
  - **Formato:** PNG com canal Alpha (transparência)
  - **Escala de Renderização em Tela:** O motor redimensiona automaticamente para 250px de altura sobre o chão da arena (`imageSmoothingEnabled = false` para manter a pixel art nítida).

---

## 🚀 Como Executar Localmente

Como o jogo foi construído em puro **HTML5 + CSS3 + Vanilla JavaScript** sem dependências pesadas de compilação:

1. **Via Python:**
   ```bash
   python -m http.server 8080
   ```
   Acesse no navegador: `http://localhost:8080/`

2. **Via Node / NPX:**
   ```bash
   npx serve .
   ```

3. **Subir na Web (para encaminhar o link para o Matheus):**
   - Basta subir a pasta diretamente para o **GitHub Pages**, **Vercel** (`npx vercel`), ou **Netlify** com 1 clique (basta arrastar a pasta do projeto).
