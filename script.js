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

const modalWarning = document.querySelector("#modalWarning");


/* ======================================================
   CONFIGURAÇÃO DA MÚSICA
====================================================== */

const MUSIC_MAIN =
    "assets/musica/mirrors.mp3";


let musicStarted = false;


/* ======================================================
   ESTADO
====================================================== */

const discovered = new Set();

const totalDiscoveries = 3;


/*
   Guarda qual descoberta está atualmente
   aberta no modal.

   Exemplo:
   "photos"
   "seventeen"
   "message"
*/

let currentDiscovery = null;


/* ======================================================
   ESTADO DAS TELAS
====================================================== */

let currentScreen = "inicio";


/* ======================================================
   LOADER
====================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        if (loader) {
            loader.classList.add("hidden");
        }

    }, 1200);

});


/* ======================================================
   PARTÍCULAS
====================================================== */

function createParticles() {

    if (!particles) {
        return;
    }


    const amount =
        window.innerWidth < 600
            ? 18
            : 35;


    for (let i = 0; i < amount; i++) {

        const particle =
            document.createElement("span");


        particle.classList.add("particle");


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


        particles.appendChild(particle);

    }

}


createParticles();


/* ======================================================
   INICIAR EXPERIÊNCIA
====================================================== */

if (startButton) {

    startButton.addEventListener("click", () => {

        switchScreen(
            "inicio",
            "discovery"
        );


        startMainMusic();

    });

}


/* ======================================================
   TROCA DE TELA
====================================================== */

function switchScreen(
    fromId,
    toId
) {

    const from =
        document.getElementById(fromId);


    const to =
        document.getElementById(toId);


    if (!from || !to) {
        return;
    }


    from.classList.remove("active");

    from.classList.add("previous");


    to.classList.remove("previous");

    to.classList.add("active");


    currentScreen = toId;

}


/* ======================================================
   MÚSICA PRINCIPAL
====================================================== */

async function startMainMusic() {

    if (!music || musicStarted) {
        return;
    }


    musicStarted = true;


    music.src =
        MUSIC_MAIN;


    music.loop = true;


    music.volume = 0;


    try {

        await music.play();


        if (musicButton) {

            musicButton.classList.add(
                "playing"
            );

        }


        fadeVolume(
            0,
            0.65,
            1800
        );


    } catch (error) {

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

    if (!music) {
        return;
    }


    const start =
        performance.now();


    music.volume = from;


    function animateVolume(now) {

        const elapsed =
            now - start;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        music.volume =
            from +
            (to - from) *
            eased;


        if (progress < 1) {

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
   CONTROLE MANUAL DA MÚSICA
====================================================== */

if (musicButton) {

    musicButton.addEventListener(
        "click",
        async () => {

            if (!music) {
                return;
            }


            if (music.paused) {

                try {

                    await music.play();


                    musicButton.classList.add(
                        "playing"
                    );

                } catch (error) {

                    console.log(
                        "Não foi possível reproduzir a música."
                    );

                }

            } else {

                music.pause();


                musicButton.classList.remove(
                    "playing"
                );

            }

        }
    );

}


/* ======================================================
   ABRIR CARDS
====================================================== */

cards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const cardName =
                card.dataset.card;


            openModal(cardName);

        }
    );

});


/* ======================================================
   ABRIR MODAL
====================================================== */

function openModal(name) {

    if (!modal) {
        return;
    }


    /*
       Guarda qual descoberta está aberta.
    */

    currentDiscovery = name;


    modalPages.forEach(page => {

        page.classList.remove(
            "active"
        );


        if (
            page.dataset.modal === name
        ) {

            page.classList.add(
                "active"
            );

        }

    });


    /*
       Esconde qualquer aviso antigo.
    */

    hideModalWarning();


    /*
       Atualiza visualmente o botão de fechar.
    */

    updateCloseButton();


    modal.classList.add("open");


    document.body.classList.add(
        "locked"
    );


    /*
       Se o modal possuir carrossel,
       atualiza a posição da foto.
    */

    if (name === "photos") {

        updateCarousel();

    }

}


/* ======================================================
   ATUALIZAR BOTÃO DE FECHAR
====================================================== */

function updateCloseButton() {

    if (!modalClose || !currentDiscovery) {
        return;
    }


    const alreadyDiscovered =
        discovered.has(
            currentDiscovery
        );


    modalClose.classList.toggle(
        "blocked",
        !alreadyDiscovered
    );


    modalClose.setAttribute(
        "aria-label",
        alreadyDiscovered
            ? "Fechar descoberta"
            : "Você precisa guardar esta descoberta antes de fechar"
    );

}


/* ======================================================
   AVISO DE TENTATIVA DE SAÍDA
====================================================== */

function showModalWarning() {

    if (!modalWarning) {
        return;
    }


    modalWarning.classList.remove(
        "show"
    );


    /*
       Pequeno delay para permitir
       a animação acontecer novamente
       caso ela tente fechar mais de uma vez.
    */

    requestAnimationFrame(() => {

        modalWarning.classList.add(
            "show"
        );

    });


    /*
       Remove automaticamente depois de alguns segundos.
    */

    clearTimeout(
        window.modalWarningTimeout
    );


    window.modalWarningTimeout =
        setTimeout(() => {

            hideModalWarning();

        }, 5000);

}


function hideModalWarning() {

    if (!modalWarning) {
        return;
    }


    modalWarning.classList.remove(
        "show"
    );

}


/* ======================================================
   FECHAR MODAL
====================================================== */

function closeModal() {

    if (!modal || !currentDiscovery) {
        return;
    }


    /*
       A descoberta ainda não foi guardada.

       Portanto, NÃO fecha o modal.
    */

    if (
        !discovered.has(
            currentDiscovery
        )
    ) {

        showModalWarning();

        updateCloseButton();

        return;

    }


    /*
       Só chega aqui depois que
       a descoberta foi guardada.
    */

    modal.classList.remove(
        "open"
    );


    document.body.classList.remove(
        "locked"
    );


    hideModalWarning();


    currentDiscovery = null;

}


/* ======================================================
   BOTÃO DE FECHAR
====================================================== */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        () => {

            closeModal();

        }
    );

}


/* ======================================================
   CLICAR FORA DO MODAL
====================================================== */

if (modal) {

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

}


/* ======================================================
   TECLA ESC
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal &&
            modal.classList.contains("open")
        ) {

            event.preventDefault();

            closeModal();

        }

    }
);


/* ======================================================
   CONCLUIR DESCOBERTA
====================================================== */

doneButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const name =
                button.dataset.complete;


            completeDiscovery(name);


            /*
               A descoberta foi registrada
               antes de tentar fechar.
            */

            closeModal();

        }
    );

});


/* ======================================================
   REGISTRAR DESCOBERTA
====================================================== */

function completeDiscovery(name) {

    if (
        discovered.has(name)
    ) {

        return;

    }


    discovered.add(name);


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
       Atualiza o botão de fechar.
    */

    if (
        currentDiscovery === name
    ) {

        updateCloseButton();

        hideModalWarning();

    }


    updateProgress();


    createDiscoveryEffect();

}


/* ======================================================
   PROGRESSO
====================================================== */

function updateProgress() {

    if (!progressText || !progressBar) {
        return;
    }


    const amount =
        discovered.size;


    progressText.textContent =
        `${amount} / ${totalDiscoveries}`;


    const percentage =
        (amount / totalDiscoveries) * 100;


    progressBar.style.width =
        `${percentage}%`;


    if (
        amount === totalDiscoveries
    ) {

        unlockFinal();

    }

}


/* ======================================================
   LIBERAR SURPRESA FINAL
====================================================== */

function unlockFinal() {

    if (!finalUnlock) {
        return;
    }


    finalUnlock.classList.add(
        "unlocked"
    );

}


/* ======================================================
   EFEITO DE DESCOBERTA
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
                        ) scale(0)`,

                    opacity: 0

                }

            ],

            {

                duration:
                    700 +
                    Math.random() *
                    400,

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

if (finalButton) {

    finalButton.addEventListener(
        "click",
        () => {

            /*
               Segurança extra:
               a surpresa final só pode ser aberta
               quando as 3 descobertas estiverem completas.
            */

            if (
                discovered.size !== totalDiscoveries
            ) {

                return;

            }


            switchScreen(
                "discovery",
                "finalScreen"
            );


            createFinalEffect();

        }
    );

}


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
                    Math.random() *
                    2000,

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


/* ======================================================
   CARROSSEL
====================================================== */

const carouselSlides =
    document.querySelectorAll(
        ".carousel-slide"
    );


const carouselPrev =
    document.querySelector(
        "#carouselPrev"
    );


const carouselNext =
    document.querySelector(
        "#carouselNext"
    );


const carouselDots =
    document.querySelector(
        "#carouselDots"
    );


const carouselCurrent =
    document.querySelector(
        "#carouselCurrent"
    );


const carouselTotal =
    document.querySelector(
        "#carouselTotal"
    );


let currentSlide = 0;


/* ======================================================
   TOTAL DE FOTOS
====================================================== */

if (carouselTotal) {

    carouselTotal.textContent =
        carouselSlides.length;

}


/* ======================================================
   CRIAR INDICADORES
====================================================== */

if (carouselDots) {

    carouselSlides.forEach(
        (_, index) => {

            const dot =
                document.createElement(
                    "button"
                );


            dot.classList.add(
                "carousel-dot"
            );


            dot.setAttribute(
                "aria-label",
                `Ir para foto ${index + 1}`
            );


            dot.addEventListener(
                "click",
                () => {

                    currentSlide =
                        index;


                    updateCarousel();

                }
            );


            carouselDots.appendChild(
                dot
            );

        }
    );

}


/* ======================================================
   ATUALIZAR CARROSSEL
====================================================== */

function updateCarousel() {

    if (!carouselSlides.length) {
        return;
    }


    carouselSlides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === currentSlide
            );

        }
    );


    const dots =
        document.querySelectorAll(
            ".carousel-dot"
        );


    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentSlide
            );

        }
    );


    if (carouselCurrent) {

        carouselCurrent.textContent =
            currentSlide + 1;

    }

}


/* ======================================================
   PRÓXIMA FOTO
====================================================== */

if (carouselNext) {

    carouselNext.addEventListener(
        "click",
        () => {

            currentSlide++;


            if (
                currentSlide >=
                carouselSlides.length
            ) {

                currentSlide = 0;

            }


            updateCarousel();

        }
    );

}


/* ======================================================
   FOTO ANTERIOR
====================================================== */

if (carouselPrev) {

    carouselPrev.addEventListener(
        "click",
        () => {

            currentSlide--;


            if (
                currentSlide < 0
            ) {

                currentSlide =
                    carouselSlides.length - 1;

            }


            updateCarousel();

        }
    );

}


/* ======================================================
   SWIPE NO CELULAR
====================================================== */

let touchStartX = 0;

let touchEndX = 0;


const carousel =
    document.querySelector(
        ".photo-carousel"
    );


if (carousel) {

    carousel.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    carousel.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0].screenX;


            handleSwipe();

        },
        {
            passive: true
        }
    );

}


/* ======================================================
   TRATAR SWIPE
====================================================== */

function handleSwipe() {

    const distance =
        touchEndX - touchStartX;


    if (
        Math.abs(distance) < 50
    ) {

        return;

    }


    if (distance < 0) {

        currentSlide++;


        if (
            currentSlide >=
            carouselSlides.length
        ) {

            currentSlide = 0;

        }

    } else {

        currentSlide--;


        if (
            currentSlide < 0
        ) {

            currentSlide =
                carouselSlides.length - 1;

        }

    }


    updateCarousel();

}


/* ======================================================
   INICIALIZAÇÃO
====================================================== */

updateCarousel();