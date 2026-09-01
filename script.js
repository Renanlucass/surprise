/* ======================================================
   ELEMENTOS
====================================================== */

const loader = document.querySelector("#loader");
const startButton = document.querySelector("#startButton");
const discovery = document.querySelector("#discovery");

const cards = document.querySelectorAll(".discovery-card");

const modal = document.querySelector("#modal");
const modalClose = document.querySelector("#modalClose");
const modalPages = document.querySelectorAll(".modal-page");
const doneButtons = document.querySelectorAll(".modal-done");

const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");

const finalUnlock = document.querySelector("#finalUnlock");
const finalButton = document.querySelector("#finalButton");
const finalScreen = document.querySelector("#finalScreen");

const musicButton = document.querySelector("#musicButton");
const music = document.querySelector("#birthdayMusic");

const particles = document.querySelector("#particles");


/* ======================================================
   CONFIGURAÇÃO DAS MÚSICAS
====================================================== */

const MUSIC_MAIN =
    "assets/musica/mirrors.mp3";

const MUSIC_FINAL =
    "assets/musica/mirrors.mp3";


let currentMusic = null;
let musicStarted = false;
let musicChanging = false;


/* ======================================================
   ESTADO DA EXPERIÊNCIA
====================================================== */

const discovered = new Set();

const totalDiscoveries = 4;


/* ======================================================
   TELAS
====================================================== */

const screens = [

    document.querySelector("#inicio"),

    document.querySelector("#discovery"),

    document.querySelector("#finalScreen")

];


let currentScreen = 0;


/* ======================================================
   NAVEGAÇÃO CONTROLADA
====================================================== */

function showScreen(index) {

    if (
        index < 0 ||
        index >= screens.length
    ) {
        return;
    }


    screens.forEach(
        (screen, i) => {

            screen.classList.remove(
                "active",
                "previous"
            );


            if (i === index) {

                screen.classList.add(
                    "active"
                );

            }


            if (i < index) {

                screen.classList.add(
                    "previous"
                );

            }

        }
    );


    currentScreen = index;


    /*
       Quando entramos novamente na tela
       de descobertas, começamos do topo.
    */

    if (
        screens[index] === discovery
    ) {

        discovery.scrollTop = 0;

    }

}


/* ======================================================
   INICIAR NA PRIMEIRA TELA
====================================================== */

showScreen(0);


/* ======================================================
   BLOQUEAR SCROLL ENTRE AS TELAS
====================================================== */

/*
   O scroll não poderá levar para outra seção.

   A única tela que possui scroll próprio é
   a tela de descobertas.
*/

window.addEventListener(
    "wheel",
    event => {

        /*
           Se não estamos na tela de descobertas,
           bloqueamos o scroll.
        */

        if (
            currentScreen !== 1 &&
            !modal.classList.contains("open")
        ) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


/*
   Bloqueia também gestos de toque que
   poderiam tentar trocar de seção.
*/

window.addEventListener(
    "touchmove",
    event => {

        if (
            currentScreen !== 1 &&
            !modal.classList.contains("open")
        ) {

            event.preventDefault();

        }

    },
    {
        passive: false
    }
);


/* ======================================================
   LOADER
====================================================== */

window.addEventListener(
    "load",
    () => {

        setTimeout(
            () => {

                loader.classList.add(
                    "hidden"
                );

            },
            1200
        );

    }
);


/* ======================================================
   PARTÍCULAS
====================================================== */

function createParticles() {

    const amount =
        window.innerWidth < 600
            ? 18
            : 35;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.classList.add(
            "particle"
        );


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.animationDuration =
            `${8 + Math.random() * 12}s`;


        particle.style.animationDelay =
            `${Math.random() * 8}s`;


        const size =
            1 + Math.random() * 3;


        particle.style.width =
            `${size}px`;


        particle.style.height =
            `${size}px`;


        particles.appendChild(
            particle
        );

    }

}


createParticles();


/* ======================================================
   INICIAR EXPERIÊNCIA
====================================================== */

startButton.addEventListener(
    "click",
    () => {

        /*
           Agora não usamos mais
           scrollIntoView().

           A tela simplesmente muda
           para a próxima etapa.
        */

        showScreen(1);


        /*
           Como o clique foi feito pela pessoa,
           o navegador permite iniciar o áudio.
        */

        startMainMusic();

    }
);


/* ======================================================
   MÚSICA PRINCIPAL
====================================================== */

async function startMainMusic() {

    /*
       Impede iniciar a mesma música várias vezes.
    */

    if (
        musicStarted
    ) {

        return;

    }


    musicStarted =
        true;


    currentMusic =
        "main";


    music.src =
        MUSIC_MAIN;


    music.loop =
        true;


    music.volume =
        0;


    try {

        await music.play();


        musicButton.classList.add(
            "playing"
        );


        /*
           A música começa baixinha
           e aumenta suavemente.
        */

        fadeVolume(
            0,
            0.65,
            1800
        );

    }

    catch (error) {

        console.log(
            "O navegador bloqueou a reprodução da música."
        );

    }

}


/* ======================================================
   FADE DE VOLUME
====================================================== */

function fadeVolume(
    from,
    to,
    duration
) {

    const start =
        performance.now();


    music.volume =
        from;


    function animateVolume(now) {

        const elapsed =
            now - start;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
           Curva suave para o volume.
        */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        music.volume =
            from +
            (to - from) * eased;


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                animateVolume
            );

        }

    }


    requestAnimationFrame(
        animateVolume
    );

}


/* ======================================================
   TROCAR PARA MÚSICA FINAL
====================================================== */

async function startFinalMusic() {

    /*
       Evita duas trocas simultâneas.
    */

    if (
        musicChanging
    ) {

        return;

    }


    musicChanging =
        true;


    /*
       Abaixa suavemente a música
       que está tocando.
    */

    fadeVolume(
        music.volume,
        0,
        1400
    );


    await new Promise(
        resolve => {

            setTimeout(
                resolve,
                1500
            );

        }
    );


    /*
       Para a música anterior.
    */

    music.pause();

    music.currentTime =
        0;


    /*
       Carrega a música final.
    */

    music.src =
        MUSIC_FINAL;


    music.loop =
        true;


    music.volume =
        0;


    currentMusic =
        "final";


    try {

        await music.play();


        musicButton.classList.add(
            "playing"
        );


        /*
           A música final entra
           gradualmente.
        */

        fadeVolume(
            0,
            0.72,
            2200
        );

    }

    catch (error) {

        console.log(
            "A música final não pôde ser reproduzida."
        );

    }


    musicChanging =
        false;

}


/* ======================================================
   CONTROLE MANUAL DA MÚSICA
====================================================== */

musicButton.addEventListener(
    "click",
    async () => {

        /*
           Se estiver pausada, toca.
        */

        if (
            music.paused
        ) {

            try {

                await music.play();


                musicButton.classList.add(
                    "playing"
                );

            }

            catch (error) {

                console.log(
                    "Não foi possível reproduzir a música."
                );

            }

        }

        /*
           Se estiver tocando, pausa.
        */

        else {

            music.pause();


            musicButton.classList.remove(
                "playing"
            );

        }

    }
);


/* ======================================================
   ABRIR CARDS
====================================================== */

cards.forEach(
    card => {

        card.addEventListener(
            "click",
            () => {

                const cardName =
                    card.dataset.card;


                openModal(
                    cardName
                );

            }
        );

    }
);


/* ======================================================
   ABRIR MODAL
====================================================== */

function openModal(name) {

    /*
       Esconde todas as páginas do modal.
    */

    modalPages.forEach(
        page => {

            page.classList.remove(
                "active"
            );


            /*
               Mostra somente a página
               correspondente ao card.
            */

            if (
                page.dataset.modal === name
            ) {

                page.classList.add(
                    "active"
                );

            }

        }
    );


    modal.classList.add(
        "open"
    );


    document.body.classList.add(
        "locked"
    );

}


/* ======================================================
   FECHAR MODAL
====================================================== */

function closeModal() {

    modal.classList.remove(
        "open"
    );


    document.body.classList.remove(
        "locked"
    );

}


modalClose.addEventListener(
    "click",
    closeModal
);


/* ======================================================
   CLICAR FORA DO MODAL
====================================================== */

modal.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal-background"
            )
        ) {

            closeModal();

        }

    }
);


/* ======================================================
   TECLA ESC
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


/* ======================================================
   CONCLUIR DESCOBERTA
====================================================== */

doneButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const name =
                    button.dataset.complete;


                completeDiscovery(
                    name
                );


                closeModal();

            }
        );

    }
);


/* ======================================================
   REGISTRAR DESCOBERTA
====================================================== */

function completeDiscovery(name) {

    /*
       Se já foi descoberta,
       não fazemos novamente.
    */

    if (
        discovered.has(name)
    ) {

        return;

    }


    discovered.add(
        name
    );


    /*
       Marca visualmente o card.
    */

    const card =
        document.querySelector(
            `[data-card="${name}"]`
        );


    if (card) {

        card.classList.add(
            "completed"
        );

        card.classList.add(
            "discovered"
        );

    }


    /*
       Atualiza a barra.
    */

    updateProgress();


    /*
       Cria o efeito visual.
    */

    createDiscoveryEffect();

}


/* ======================================================
   ATUALIZAR PROGRESSO
====================================================== */

function updateProgress() {

    const amount =
        discovered.size;


    /*
       Texto:

       0 / 4
       1 / 4
       2 / 4
       etc.
    */

    progressText.textContent =
        `${amount} / ${totalDiscoveries}`;


    /*
       Calcula porcentagem.
    */

    const percentage =
        (
            amount /
            totalDiscoveries
        ) * 100;


    progressBar.style.width =
        `${percentage}%`;


    /*
       Quando chegar a 4/4,
       libera a última surpresa.
    */

    if (
        amount === totalDiscoveries
    ) {

        unlockFinal();

    }

}


/* ======================================================
   LIBERAR ÚLTIMA SURPRESA
====================================================== */

function unlockFinal() {

    finalUnlock.classList.add(
        "unlocked"
    );

}


/* ======================================================
   EFEITO AO DESCOBRIR
====================================================== */

function createDiscoveryEffect() {

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const spark =
            document.createElement(
                "span"
            );


        spark.style.position =
            "fixed";


        spark.style.left =
            "50%";


        spark.style.top =
            "50%";


        spark.style.width =
            "4px";


        spark.style.height =
            "4px";


        spark.style.background =
            "#b49a78";


        spark.style.borderRadius =
            "50%";


        spark.style.pointerEvents =
            "none";


        spark.style.zIndex =
            "2000";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            60 +
            Math.random() *
            140;


        spark.animate(

            [

                {
                    transform:
                        "translate(-50%, -50%) scale(1)",

                    opacity: 1
                },

                {

                    transform:
                        `translate(
                            calc(-50% + ${Math.cos(angle) * distance}px),
                            calc(-50% + ${Math.sin(angle) * distance}px)
                        )
                        scale(0)`,

                    opacity: 0

                }

            ],

            {

                duration:
                    700 +
                    Math.random() * 400,

                easing:
                    "cubic-bezier(.2,.7,.2,1)"

            }

        );


        document.body.appendChild(
            spark
        );


        setTimeout(
            () => spark.remove(),
            1200
        );

    }

}


/* ======================================================
   ABRIR ÚLTIMA SURPRESA
====================================================== */

finalButton.addEventListener(
    "click",
    async () => {

        /*
           Segurança:
           só permite abrir se as quatro
           descobertas tiverem sido feitas.
        */

        if (
            discovered.size !== totalDiscoveries
        ) {

            return;

        }


        /*
           Troca a música.
        */

        await startFinalMusic();


        /*
           Agora sim muda para a tela final.
        */

        showScreen(2);


        /*
           Cria o efeito especial.
        */

        createFinalEffect();

    }
);


/* ======================================================
   EFEITO FINAL
====================================================== */

function createFinalEffect() {

    for (
        let i = 0;
        i < 40;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.style.position =
            "fixed";


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${100 + Math.random() * 20}%`;


        particle.style.width =
            "3px";


        particle.style.height =
            "3px";


        particle.style.borderRadius =
            "50%";


        particle.style.background =
            "#b49a78";


        particle.style.zIndex =
            "3000";


        particle.style.pointerEvents =
            "none";


        document.body.appendChild(
            particle
        );


        particle.animate(

            [

                {

                    transform:
                        "translateY(0) scale(1)",

                    opacity: 0

                },

                {

                    transform:
                        `translateY(-${window.innerHeight * 1.2}px) scale(1.5)`,

                    opacity: 1

                },

                {

                    transform:
                        `translateY(-${window.innerHeight * 1.4}px) scale(0)`,

                    opacity: 0

                }

            ],

            {

                duration:
                    2500 +
                    Math.random() * 2000,

                easing:
                    "ease-out"

            }

        );


        setTimeout(
            () => particle.remove(),
            5000
        );

    }

}