// Street Fighter: New Challengers — Character Roster & Moves for Vivest Fighters
const FIGHTERS_DATA = [
    {
        id: 'luiza',
        name: 'Luiza',
        sfTitle: 'CHUN-LI DOS ILÍQUIDOS',
        role: 'Estagiária de Ativos Ilíquidos',
        tagline: 'Tímida, Ultrarrápida & Mestre do Cálculo',
        badge: 'KUNG FU QUANT',
        origin: 'Faria Lima / Brasil',
        cardPhoto: 'assets/sf_roster/luiza_card.png',
        facePhoto: 'assets/sf_faces/luiza_face.png',
        photo: 'assets/sf_faces/luiza_face.png',
        themeColor: '#dc2626',
        accentColor: '#fbbf24',
        stats: {
            attack: 86,
            speed: 98,
            defense: 76,
            stress: 15
        },
        bio: 'Treinada no templo lendário dos ativos ilíquidos. Trajada com seu Qipao tradicional negro e dourado, ela calcula duration e spread em 0.1 segundo e desfere 50 chutes por segundo sem errar uma vírgula.',
        sfOutfit: {
            style: 'chunli',
            dressColor: '#18181b',
            trimColor: '#ffd700',
            pantsColor: '#991b1b',
            skinTone: '#fde68a',
            hairStyle: 'ponytail',
            hairColor: '#1c1917',
            glovesColor: '#18181b',
            aura: '#dc2626'
        },
        specialMove: {
            name: 'Hyakuretsu Duration (Chutes Relâmpago)',
            sfName: 'HYAKURETSUKYAKU',
            shout: 'SPINNING BIRD KICK!',
            damage: 18,
            speed: 13,
            cost: 20,
            desc: 'Sequência de chutes ultrarrápidos no ar que calculam a taxa interna de retorno na cara do rival.',
            projectile: {
                type: 'kikouken',
                text: 'DURATION',
                color: '#38bdf8',
                size: 26
            }
        },
        superMove: {
            name: 'KIKOUKEN MARCAÇÃO A MERCADO',
            sfName: 'KIKOUKEN SUPER',
            quote: 'Sua tese não fecha o spread. Já refutei, já venci!',
            desc: 'Concentra o ki de todas as debêntures e dispara uma esfera colossal de energia azul que pulveriza o adversário!',
            color: '#0284c7'
        },
        victoryQuotes: {
            default: 'Tempo de cálculo: 0.1s. Tempo para o K.O.: 1.2s. Você foi marcado a mercado!',
            alan: 'Calculou o spread errado de novo, Alan. E sua história de Dubai nunca existiu!',
            matheus: 'Matheus, relaxa os ombros! Seu IPCA já foi liquidado com sucesso!',
            max: 'Gostei do Muay Thai, Max! Mas meus chutes quânticos são mais velozes!'
        }
    },
    {
        id: 'matheus',
        name: 'Matheus',
        sfTitle: 'STREET BRAWLER DO MACRO',
        role: 'Economista Macro do Brasil',
        tagline: 'O Homem das Mídias & do Stress Absoluto',
        badge: 'BURNOUT FURY',
        origin: 'Brasília / Brasil',
        cardPhoto: 'assets/sf_roster/matheus_card.png',
        facePhoto: 'assets/sf_faces/matheus_face.png',
        photo: 'assets/sf_faces/matheus_face.png',
        themeColor: '#0284c7',
        accentColor: '#38bdf8',
        stats: {
            attack: 94,
            speed: 86,
            defense: 74,
            stress: 100 // Maximum stress power!
        },
        bio: 'O guerreiro das ruas macroeconômicas. Camisa de flanela azul rasgada nas batalhas do Copom, punhos enfaixados prontos para a briga. Quando a Selic sobe, sua fúria é incontrolável!',
        sfOutfit: {
            style: 'brawler',
            flannelColor: '#1d4ed8',
            shirtColor: '#f8fafc',
            pantsColor: '#1e293b',
            skinTone: '#fed7aa',
            hairStyle: 'messy_beard',
            hairColor: '#292524',
            wrapsColor: '#f1f5f9',
            aura: '#00d2ff'
        },
        specialMove: {
            name: 'Copom Knuckle / Ata de Fogo',
            sfName: 'BURNOUT KNUCKLE',
            shout: 'FOCUS BUSTER!',
            damage: 20,
            speed: 10,
            cost: 20,
            desc: 'Avança com um soco potente envolvido em relâmpagos azuis e folhas incandescentes da ata do Copom!',
            projectile: {
                type: 'copom_doc',
                text: 'COPOM',
                color: '#38bdf8',
                size: 28
            }
        },
        superMove: {
            name: 'SHORYUKEN MACRO: SELIC A 20%',
            sfName: 'SHORYUKEN BURNOUT',
            quote: 'EU NÃO AGUENTO MAIS O FOCUS! CORTE ESSA TAXA AGORA!',
            desc: 'Matheus solta um rugido épico, seus punhos incendeiam em eletricidade azul e ele desfere um Shoryuken triplo ascendente que toca o teto da Faria Lima!',
            color: '#0284c7'
        },
        victoryQuotes: {
            default: 'Nem o Boletim Focus projetou esse Shoryuken! O Rivotril fez efeito e agora vou dormir!',
            alan: 'Conta outra lorota agora, Alan! Essa sua tese não sobreviveu nem ao primeiro round!',
            max: 'Menos código Python e mais café na mesa, estagiário!',
            boss: 'A META ATUARIAL FOI ATINGIDA! MEU DEUS, EU ESTOU CURADO DO STRESS!'
        }
    },
    {
        id: 'max',
        name: 'Max',
        sfTitle: 'MUAY THAI DE MARKOWITZ',
        role: 'Estagiário de Asset Allocation',
        tagline: 'O Guerreiro Tailandês dos Códigos',
        badge: 'MUAY THAI QUANT',
        origin: 'Faria Lima / Bangcoc',
        cardPhoto: 'assets/sf_roster/max_card.png',
        facePhoto: 'assets/sf_faces/max_face.png',
        photo: 'assets/sf_faces/max_face.png',
        themeColor: '#eab308',
        accentColor: '#1e3a8a',
        stats: {
            attack: 88,
            speed: 90,
            defense: 78,
            stress: 40
        },
        bio: 'Abdômen trincado, mongkhon na cabeça e calção azul bordado com "MAX". O estagiário que uniu a ferocidade de Sagat com a precisão matemática da fronteira eficiente.',
        sfOutfit: {
            style: 'muay_thai',
            shortsColor: '#1e40af',
            shortsTrim: '#eab308',
            headbandColor: '#b45309',
            skinTone: '#d97706',
            hairStyle: 'crew_cut',
            hairColor: '#18181b',
            wrapsColor: '#f8fafc',
            aura: '#f59e0b'
        },
        specialMove: {
            name: 'Tiger Python Knee',
            sfName: 'TIGER KNEE',
            shout: 'TIGER KNEE!',
            damage: 18,
            speed: 12,
            cost: 20,
            desc: 'Joelha voadora de tigre tailandês iluminada com fórmulas matemáticas parabólicas!',
            projectile: {
                type: 'formula',
                text: '∫TIGER',
                color: '#f59e0b',
                size: 26
            }
        },
        superMove: {
            name: 'TIGER MARKOWITZ UPPERCUT',
            sfName: 'TIGER GENOCIDE',
            quote: 'Simulei 1.000.000 de caminhos e em todos você leva Tiger Uppercut!',
            desc: 'Duas joelhadas de tigre brutais seguidas de um salto mortal com gancho flamejante de pura otimização de carteira!',
            color: '#b45309'
        },
        victoryQuotes: {
            default: 'Complexidade de tempo O(1) pra te derrubar com a canela! Roda de novo o script!',
            rai: 'A sua alocação carioca falhou contra a guarda tailandesa, analista!',
            matheus: 'Automatizei a previsão do PIB no meu calção de Muay Thai pra você descansar, Matheus!',
            luiza: 'Seus chutes foram rápidos, Luiza! Mas o joelho de tigre tem mais Sharpe!'
        }
    },
    {
        id: 'maycon',
        name: 'Maycon',
        sfTitle: 'SNIPER DO MMA',
        role: 'Estagiário de Research de RV',
        tagline: 'Moderno, Tímido & Cirúrgico',
        badge: 'STREET STRIKER',
        origin: 'São Paulo / Brasil',
        cardPhoto: 'assets/sf_roster/maycon_card.png',
        facePhoto: 'assets/sf_faces/maycon_face.png',
        photo: 'assets/sf_faces/maycon_face.png',
        themeColor: '#38bdf8',
        accentColor: '#0369a1',
        stats: {
            attack: 85,
            speed: 89,
            defense: 76,
            stress: 30
        },
        bio: 'Estilo moderno de MMA (estilo Luke/Jin). Jaqueta esportiva de combate, luvas de artes marciais mistas pretas e olhar cirúrgico. Ele estuda o balanço da concorrência e ataca onde dói.',
        sfOutfit: {
            style: 'mma_jacket',
            jacketColor: '#0f172a',
            jacketAccent: '#38bdf8',
            shirtColor: '#18181b',
            pantsColor: '#1e293b',
            skinTone: '#fed7aa',
            hairStyle: 'clean_fade',
            hairColor: '#27272a',
            glovesColor: '#18181b',
            aura: '#38bdf8'
        },
        specialMove: {
            name: 'Sand Blaster Small Cap',
            sfName: 'SAND BLASTER',
            shout: 'SAND BLASTER!',
            damage: 18,
            speed: 12,
            cost: 20,
            desc: 'Dispara uma onda de choque explosiva de ar à queima-roupa com o ticker de uma Small Cap subindo 800%!',
            projectile: {
                type: 'ticker',
                text: 'ALPHA^',
                color: '#38bdf8',
                size: 24
            }
        },
        superMove: {
            name: 'ERASURE ALPHA STRIKE',
            sfName: 'VULCAN BLITZ',
            quote: 'Achei uma distorção grave no seu EBITDA...',
            desc: 'Maycon entra em velocidade sônica e desfere um combo violento de 12 golpes no queixo desregulando os múltiplos do adversário!',
            color: '#0284c7'
        },
        victoryQuotes: {
            default: 'Eu fico quieto, mas o direto entra no suporte certinho. Menos um ativo tóxico.',
            gabriela: 'Gabi, desculpa o cruzado! Foi só uma correção justa de valuation!',
            alan: 'Analisei os números do seu condomínio em Dubai: cap rate zerado, Alan!',
            max: 'Menos flexão de Muay Thai e mais análise de demonstrativo financeiro, Max!'
        }
    },
    {
        id: 'rai',
        name: 'Rai',
        sfTitle: 'MESTRE DO ANSATSUKEN CARIOCA',
        role: 'Analista de Asset Allocation',
        tagline: 'O Guerreiro de Gi em Terras Paulistas',
        badge: 'HADOUKEN CARIOCA',
        origin: 'Rio de Janeiro / Posto 9',
        cardPhoto: 'assets/sf_roster/rai_card.png',
        facePhoto: 'assets/sf_faces/rai_face.png',
        photo: 'assets/sf_faces/rai_face.png',
        themeColor: '#d97706',
        accentColor: '#fbbf24',
        stats: {
            attack: 88,
            speed: 86,
            defense: 80,
            stress: 15
        },
        bio: 'O guerreiro errante de kimono bege tradicional com peito aberto e faixa preta. Une a sabedoria marcial milenar de Ryu com a ginga do calçadão de Copacabana e óculos de sol.',
        sfOutfit: {
            style: 'karate_gi',
            giColor: '#d6c7a1', // Sand/beige gi from poster
            beltColor: '#18181b', // Black belt
            pantsColor: '#d6c7a1',
            skinTone: '#f59e0b',
            hairStyle: 'beard_glasses',
            hairColor: '#18181b',
            wrapsColor: '#f8fafc',
            aura: '#f59e0b'
        },
        specialMove: {
            name: 'Hadouken de Biscoito Globo',
            sfName: 'HADOUKEN',
            shout: 'HADOUKEN!',
            damage: 17,
            speed: 10,
            cost: 20,
            desc: 'Concentra o ki do mate com limão entre as mãos e dispara uma esfera de energia Hadouken dourada!',
            projectile: {
                type: 'globo',
                text: 'HADOU',
                color: '#f59e0b',
                size: 28
            }
        },
        superMove: {
            name: 'SHINKU HADOUKEN: ALOCAÇÃO 100% OFFSHORE',
            sfName: 'SHINKU HADOUKEN',
            quote: 'Mermão, aloca esse Hadouken na tua carteira e pega a ponte aérea!',
            desc: 'Rai canaliza a força colossal das ondas de Ipanema e dispara um feixe Hadouken monumental que atravessa a tela inteira!',
            color: '#d97706'
        },
        victoryQuotes: {
            default: 'O asfalto paulista é duro, mas o Hadouken carioca não perdoa! Agora partiu praia!',
            max: 'Depois você roda uma regressão pra entender de onde veio esse Tatsumaki, estagiário!',
            matheus: 'Relaxa, Matheus! Toma uma água de coco e esquece a ata do Copom!',
            alan: 'História bonita, Alan, mas meu Ansatsuken é raiz! Não compro sua debênture!'
        }
    },
    {
        id: 'stefano',
        name: 'Stefano',
        sfTitle: 'O PRODÍGIO DAS SOMBRAS',
        role: 'Estagiário de Economia Macro',
        tagline: 'O Guerreiro Misterioso do Jeans',
        badge: 'SHADOW PRODIGY',
        origin: 'Deep Web / Brasil',
        cardPhoto: 'assets/sf_roster/stefano_card.png',
        facePhoto: 'assets/sf_faces/stefano_face.png',
        photo: 'assets/sf_faces/stefano_face.png',
        themeColor: '#3b82f6',
        accentColor: '#1d4ed8',
        stats: {
            attack: 87,
            speed: 95,
            defense: 72,
            stress: 10
        },
        bio: 'Jaqueta jeans com gola levantada, cabelos ondulados e óculos redondos. O lutador misterioso que ataca com a fluidez das sombras e desaparece antes da reunião matinal.',
        sfOutfit: {
            style: 'denim_jacket',
            jacketColor: '#2563eb',
            shirtColor: '#f8fafc',
            pantsColor: '#1e293b',
            skinTone: '#fed7aa',
            hairStyle: 'wavy_hair_glasses',
            hairColor: '#451a03',
            wrapsColor: '#f1f5f9',
            aura: '#3b82f6'
        },
        specialMove: {
            name: 'Shadow Teleport Slice',
            sfName: 'SHADOW OROCHI',
            shout: 'SHADOW SLICE!',
            damage: 19,
            speed: 13,
            cost: 20,
            desc: 'Desaparece instantaneamente em partículas de luz azul e golpeia o adversário pelas costas!',
            projectile: {
                type: 'shadow_orb',
                text: 'SECRET',
                color: '#60a5fa',
                size: 24
            }
        },
        superMove: {
            name: 'FINAL MACRO BURST',
            sfName: 'FINAL OROCHI DRIVE',
            quote: 'Você não me viu entrar... e não verá o K.O.',
            desc: 'Invoca uma fenda dimensional de projeções macroeconômicas secretas que envolve o rival em uma tempestade de cortes fulminantes!',
            color: '#1d4ed8'
        },
        victoryQuotes: {
            default: 'Relatório entregue. Quem me procurar na arena... não vai achar.',
            matheus: 'Matheus, eu deixei a projeção do PIB na sua mesa às 04h. Pode descansar.',
            alan: 'Sua história tinha 4 furos factuais. Eu vi nos dados secretos.',
            luiza: 'Você quase acompanhou minha velocidade... mas faltou um nanossegundo.'
        }
    },
    {
        id: 'alan',
        name: 'Alan',
        sfTitle: 'AKUMA DOS ATIVOS ILÍQUIDOS',
        role: 'Analista de Ativos Ilíquidos',
        tagline: 'O Mala Sombrio das Histórias de Dubai',
        badge: 'DARK SATSUI',
        origin: 'Dubai / Faria Lima',
        cardPhoto: 'assets/sf_roster/alan_card.png',
        facePhoto: 'assets/sf_faces/alan_face.png',
        photo: 'assets/sf_faces/alan_face.png',
        themeColor: '#7c3aed',
        accentColor: '#c084fc',
        stats: {
            attack: 95,
            speed: 78,
            defense: 84,
            stress: 15
        },
        bio: 'O Akuma da Faria Lima. Kimono preto sem mangas rasgado nos ombros, ataduras escuras, olhar implacável e o temido "Satsui no Hado" das debêntures podres e lendas de Dubai.',
        sfOutfit: {
            style: 'dark_akuma',
            giColor: '#18181b', // Black gi from poster
            beltColor: '#09090b',
            pantsColor: '#18181b',
            skinTone: '#fde047',
            hairStyle: 'akuma_beard',
            hairColor: '#09090b',
            wrapsColor: '#27272a',
            aura: '#7c3aed'
        },
        specialMove: {
            name: 'Gohadoken das Debêntures',
            sfName: 'GOHADOKEN',
            shout: 'MESSATSU!',
            damage: 20,
            speed: 9,
            cost: 20,
            desc: 'Arremessa uma esfera flamejante de energia roxa maligna saturada de contratos imobiliários ilíquidos!',
            projectile: {
                type: 'contract',
                text: 'MESSATSU',
                color: '#a855f7',
                size: 28
            }
        },
        superMove: {
            name: 'SHUN GOKU SATSU: A LENDA DE DUBAI',
            sfName: 'SHUN GOKU SATSU',
            quote: 'Porque quando eu fechei aquele fundo com o príncipe de Dubai...',
            desc: 'A tela apaga com som de trovão, kanjis vermelhos piscam no escuro e Alan desfere 15 golpes devastadores contando a maior história de pescador da história!',
            color: '#581c87'
        },
        victoryQuotes: {
            default: 'Mais uma vitória lendária pra colocar na minha biografia em Dubai! O Satsui no Hado é meu!',
            luiza: 'Peguei leve porque você é estagiária, mas o mercado de crédito pertence a mim!',
            matheus: 'Matheus, estresse pra quê? Deixa eu te contar de quando eu alavanquei o PIB mundial...',
            rai: 'Karate tradicional carioca não aguenta a pressão de um CRI estruturado por mim!'
        }
    },
    {
        id: 'gabriela',
        name: 'Gabi',
        sfTitle: 'A CAMMY DO RESEARCH',
        role: 'Analista de Research de RV',
        tagline: 'Simpática, Radiante & Letal no DCF',
        badge: 'SPIRAL VALUATION',
        origin: 'São Paulo / Brasil',
        cardPhoto: 'assets/sf_roster/gabriela_card.png',
        facePhoto: 'assets/sf_faces/gabriela_face.png',
        photo: 'assets/sf_faces/gabriela_face.png',
        themeColor: '#ec4899',
        accentColor: '#fb7185',
        stats: {
            attack: 85,
            speed: 87,
            defense: 80,
            stress: 25
        },
        bio: 'A Cammy brasileira da equipe. Top esportivo de ginástica e kickboxing preto e vermelho, luvas de boxe azuis, cabelos longos e sorriso radiante. Gentil com os colegas, impiedosa no valuation.',
        sfOutfit: {
            style: 'cammy_mma',
            topColor: '#18181b',
            topTrim: '#ef4444',
            pantsColor: '#18181b',
            skinTone: '#fde68a',
            hairStyle: 'long_brown',
            hairColor: '#451a03',
            glovesColor: '#2563eb', // Blue gloves from poster
            wrapsColor: '#f8fafc',
            aura: '#ec4899'
        },
        specialMove: {
            name: 'Spiral DCF Arrow',
            sfName: 'SPIRAL ARROW',
            shout: 'SPIRAL ARROW!',
            damage: 17,
            speed: 11,
            cost: 20,
            desc: 'Gira o corpo horizontalmente como uma broca disparando contra o oponente em linha reta!',
            projectile: {
                type: 'heart_mic',
                text: 'BUY!',
                color: '#ec4899',
                size: 26
            }
        },
        superMove: {
            name: 'SPIN DRIVE DOWNGRADE',
            sfName: 'SPIN DRIVE SMASH',
            quote: 'Adoro você, viu? Mas sua recomendação hoje é REBAIXADO!',
            desc: 'Combina um Spiral Arrow rasteiro com um mortal acrobático Cannon Spike rosa choque que manda o rival pras cucuias com muita educação!',
            color: '#be185d'
        },
        victoryQuotes: {
            default: 'Foi um prazer enorme lutar com você! Vamos tomar um café depois pra você se recuperar desses 10 hits?',
            maycon: 'Mandou super bem no timing, Maycon! Mas a analista sênior ainda tem mais múltiplos!',
            alan: 'Alan, querido, essa sua história de Dubai não passa no teste de estresse. Rebaixado com carinho!',
            matheus: 'Respira fundo, Matheus! Vem comer um pão de queijo com a gente e esquece a Selic!'
        }
    }
];

// Final Boss: O Fantasma da Meta Atuarial (ou O M.Bison do Fundo de Pensão)
const BOSS_FIGHTER = {
    id: 'boss_meta',
    name: 'O Fantasma da Meta Atuarial',
    sfTitle: 'M.BISON DA PREVIDÊNCIA',
    role: 'Chefe Supremo do Fundo de Pensão',
    tagline: 'IPCA + 6.50% AO ANO OU DEMISSÃO!',
    badge: 'CHEFE FINAL',
    origin: 'Comitê Central / Brasil',
    photo: 'assets/images/title_logo.jpg',
    themeColor: '#dc2626',
    accentColor: '#fbbf24',
    stats: {
        attack: 98,
        speed: 86,
        defense: 94,
        stress: 1000
    },
    bio: 'A entidade mística de capa vermelha e poder psicótico ("Psycho Power"). Assombra as noites de sono de todos os gestores de fundo de pensão com exigências surreais de rentabilidade!',
    sfOutfit: {
        style: 'dark_akuma',
        giColor: '#7f1d1d',
        pantsColor: '#450a0a',
        skinTone: '#e2e8f0',
        aura: '#ef4444'
    },
    specialMove: {
        name: 'Psycho Meta Crusher',
        sfName: 'PSYCHO CRUSHER',
        shout: 'PSYCHO CRUSHER!',
        damage: 22,
        speed: 12,
        cost: 25,
        desc: 'Atravessa a tela girando em chamas roxas e vermelhas de déficit atuarial!',
        projectile: {
            type: 'meta_blast',
            text: 'IPCA+6%',
            color: '#dc2626',
            size: 32
        }
    },
    superMove: {
        name: 'KNEE PRESS NIGHTMARE DO COMITÊ',
        sfName: 'KNEE PRESS NIGHTMARE',
        quote: 'OU VOCÊS BATEM A META OU O BÔNUS SERÁ CANCELADO!',
        desc: 'Duas voadoras duplas no ar seguidas de um mergulho que abre uma cratera no chão do plenário!',
        color: '#b91c1c'
    },
    victoryQuotes: {
        default: 'A meta atuarial não foi atingida! Todos de volta pro Excel imediatamente!',
        matheus: 'Matheus, economista que erra o IPCA vira analista júnior na concorrência!'
    }
};

window.FIGHTERS_DATA = FIGHTERS_DATA;
window.BOSS_FIGHTER = BOSS_FIGHTER;
