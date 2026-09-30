/*
const loadingIcon = 'media/img/icons/rotate-right-solid-full.svg';


// ======================================================
// CAMBIAR ICONO A FLECHA GIRANDO
// ======================================================

function startButtonLoading(button) {

    const icon = button.querySelector('img');

    if (!icon) return;

    // Guardar icono original
    button.dataset.originalIcon = icon.src;

    // Cambiar icono
    icon.src = loadingIcon;

    // Activar animación
    icon.classList.add('button-loading-icon');

    // Bloquear botón
    button.classList.add('loading');

}


// ======================================================
// RESTAURAR ICONO ORIGINAL
// ======================================================

function stopButtonLoading(button) {

    const icon = button.querySelector('img');

    if (!icon) return;

    if (button.dataset.originalIcon) {

        icon.src = button.dataset.originalIcon;

    }

    icon.classList.remove('button-loading-icon');

    button.classList.remove('loading');

    delete button.dataset.originalIcon;

}


// ======================================================
// OBTENER INFORMACIÓN DE LA CARD
// ======================================================

function getCardMedia(card) {

    const titleElement =
        card.querySelector('.card-title');

    if (!titleElement) {

        throw new Error(
            'No se encontró el título de la tarjeta.'
        );

    }

    const title =
        titleElement.textContent.trim();


    // ==================================================
    // BUSCAR VIDEO
    // ==================================================

    const video =
        card.querySelector('video');

    if (video) {

        const source =
            video.querySelector('source');

        if (!source) {

            throw new Error(
                'No se encontró el archivo de video.'
            );

        }

        const src =
            source.getAttribute('src');

        const fileURL =
            new URL(
                src,
                window.location.href
            ).href;


        return {

            type: 'video',

            title: title,

            url: fileURL,

            fileName: `${title}.mp4`,

            mimeType: 'video/mp4'

        };

    }


    // ==================================================
    // BUSCAR IMAGEN
    // ==================================================

    const image =
        card.querySelector(
            '.media-image > img'
        );

    if (!image) {

        throw new Error(
            'No se encontró ninguna imagen.'
        );

    }

    const src =
        image.getAttribute('src');

    const fileURL =
        new URL(
            src,
            window.location.href
        ).href;


    // Obtener extensión
    let extension =
        fileURL
            .split('.')
            .pop()
            .split('?')[0]
            .toLowerCase();


    // Si no reconoce extensión
    if (
        !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)
    ) {

        extension = 'jpg';

    }


    let mimeType = 'image/jpeg';

    if (extension === 'png') {

        mimeType = 'image/png';

    }

    else if (extension === 'webp') {

        mimeType = 'image/webp';

    }

    else if (extension === 'gif') {

        mimeType = 'image/gif';

    }


    return {

        type: 'image',

        title: title,

        url: fileURL,

        fileName: `${title}.${extension}`,

        mimeType: mimeType

    };

}


// ======================================================
// COMPARTIR
// ======================================================

document
    .querySelectorAll('.share-button')
    .forEach(button => {


    button.addEventListener(
        'click',
        async function () {


        // ----------------------------------------------
        // EVITAR DOBLE CLICK
        // ----------------------------------------------

        if (
            button.classList.contains('loading')
        ) {

            return;

        }


        const card =
            button.closest('.media-card');


        if (!card) {

            return;

        }


        let media;


        try {

            media =
                getCardMedia(card);

        }

        catch (error) {

            console.error(error);

            alert(error.message);

            return;

        }


        // ----------------------------------------------
        // ACTIVAR ANIMACIÓN
        // ----------------------------------------------

        startButtonLoading(button);


        console.log(
            'Compartiendo:',
            media
        );


        try {


            // ==================================================
            // OPCIÓN 1
            // COMPARTIR ARCHIVO
            // ==================================================

          
            let file = null;


            try {

                const response =
                    await fetch(media.url);


                if (response.ok) {

                    const blob =
                        await response.blob();


                    file =
                        new File(
                            [blob],
                            media.fileName,
                            {
                                type: media.mimeType
                            }
                        );

                }

            }

            catch (fileError) {

                console.warn(
                    'No se pudo preparar el archivo:',
                    fileError
                );

            }


            // ==================================================
            // ¿EL NAVEGADOR SOPORTA SHARE?
            // ==================================================

            if (
                navigator.share &&
                navigator.canShare &&
                file &&
                navigator.canShare({
                    files: [file]
                })
            ) {


                console.log(
                    'Compartiendo archivo mediante Web Share API'
                );


                await navigator.share({

                    title: media.title,

                    files: [file]

                });


                return;

            }


            // ==================================================
            // OPCIÓN 2
            // COMPARTIR URL
            // ==================================================

            if (
                navigator.share &&
                navigator.canShare
            ) {


                const shareData = {

                    title: media.title,

                    text: media.title,

                    url: media.url

                };


                if (
                    navigator.canShare(shareData)
                ) {


                    console.log(
                        'Compartiendo URL mediante Web Share API'
                    );


                    await navigator.share(
                        shareData
                    );


                    return;

                }

            }


            // ==================================================
            // OPCIÓN 3
            // MENÚ PROPIO
            // ==================================================

            showShareMenu(media);


        }


        catch (error) {


            console.error(
                'Error al compartir:',
                error
            );


            // ----------------------------------------------
            // EL USUARIO CERRÓ EL MENÚ
            // ----------------------------------------------

            if (
                error.name === 'AbortError'
            ) {

                return;

            }


            // ----------------------------------------------
            // SI FALLA WEB SHARE
            // ----------------------------------------------

            console.warn(
                'Web Share falló. Mostrando menú alternativo.'
            );


            showShareMenu(media);


        }


        finally {


            // ----------------------------------------------
            // RESTAURAR ICONO
            // ----------------------------------------------

            stopButtonLoading(button);

        }


    });

});


// ======================================================
// MENÚ ALTERNATIVO
// ======================================================

function showShareMenu(media) {


    // Eliminar menú anterior
    const oldMenu =
        document.getElementById(
            'customShareMenu'
        );


    if (oldMenu) {

        oldMenu.remove();

    }


    // Crear fondo
    const overlay =
        document.createElement('div');

    overlay.id =
        'customShareMenu';


    overlay.innerHTML = `

        <div class="custom-share-overlay">

            <div class="custom-share-box">

                <div class="custom-share-header">

                    <h5>
                        Compartir
                    </h5>

                    <button
                        type="button"
                        class="custom-share-close"
                        id="closeShareMenu">

                        ×

                    </button>

                </div>


                <div class="custom-share-title">

                    ${escapeHTML(media.title)}

                </div>


                <div class="custom-share-options">


                    <!-- WHATSAPP -->

                    <button
                        type="button"
                        id="shareWhatsApp"
                        class="custom-share-option">

                        <span class="share-option-icon">
                            <img src="media/img/icons/whatsapp.svg" alt="">
                        </span>

                        <span>
                            WhatsApp
                        </span>

                    </button>


                    <!-- CORREO -->

                    <button
                        type="button"
                        id="shareEmail"
                        class="custom-share-option">

                        <span class="share-option-icon">
                           <img src="media/img/icons/envelope.svg" alt="">
                        </span>

                        <span>
                            Correo
                        </span>

                    </button>


                    <!-- COPIAR -->

                    <button
                        type="button"
                        id="copyShareURL"
                        class="custom-share-option">

                        <span class="share-option-icon">
                            <img src="media/img/icons/copy-regu.svg" alt="">
                        </span>

                        <span>
                            Copiar enlace
                        </span>

                    </button>


                </div>

            </div>

        </div>

    `;


    document.body.appendChild(overlay);


    // ==================================================
    // CERRAR
    // ==================================================

    document
        .getElementById('closeShareMenu')
        .addEventListener(
            'click',
            () => overlay.remove()
        );


    overlay
        .querySelector('.custom-share-overlay')
        .addEventListener(
            'click',
            event => {

                if (
                    event.target.classList.contains(
                        'custom-share-overlay'
                    )
                ) {

                    overlay.remove();

                }

            }
        );


    // ==================================================
    // WHATSAPP
    // ==================================================

    document
        .getElementById('shareWhatsApp')
        .addEventListener(
            'click',
            () => {

                const text =
                    encodeURIComponent(
                        `${media.title}\n${media.url}`
                    );


                window.open(
                    `https://wa.me/?text=${text}`,
                    '_blank'
                );

            }
        );


    // ==================================================
    // CORREO
    // ==================================================

    document
        .getElementById('shareEmail')
        .addEventListener(
            'click',
            () => {

                const subject =
                    encodeURIComponent(
                        media.title
                    );


                const body =
                    encodeURIComponent(
                        `${media.title}\n\n${media.url}`
                    );


                window.location.href =
                    `mailto:?subject=${subject}&body=${body}`;

            }
        );


    // ==================================================
    // COPIAR URL
    // ==================================================

    document
        .getElementById('copyShareURL')
        .addEventListener(
            'click',
            async () => {


                try {

                    await navigator.clipboard.writeText(
                        media.url
                    );


                    const button =
                        document.getElementById(
                            'copyShareURL'
                        );


                    button.querySelector(
                        'span:last-child'
                    ).textContent =
                        '¡Enlace copiado!';


                    setTimeout(
                        () => overlay.remove(),
                        1000
                    );


                }

                catch (error) {

                    console.error(error);

                    alert(
                        'No se pudo copiar el enlace.'
                    );

                }

            }
        );

}


// ======================================================
// SEGURIDAD PARA EL TÍTULO
// ======================================================

function escapeHTML(text) {

    const div =
        document.createElement('div');

    div.textContent = text;

    return div.innerHTML;

}*/



const loadingIcon = 'media/img/icons/rotate-right-solid-full.svg';


// ======================================================
// DETECTAR SI ES DISPOSITIVO MÓVIL
// ======================================================

function isMobileDevice() {

    return /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
    );

}


// ======================================================
// ACTIVAR ANIMACIÓN
// ======================================================

function startButtonLoading(button) {

    const icon = button.querySelector('img');

    if (!icon) return;

    button.dataset.originalIcon = icon.src;

    icon.src = loadingIcon;

    icon.classList.add('button-loading-icon');

    button.classList.add('loading');

}


// ======================================================
// DETENER ANIMACIÓN
// ======================================================

function stopButtonLoading(button) {

    const icon = button.querySelector('img');

    if (!icon) return;

    if (button.dataset.originalIcon) {

        icon.src = button.dataset.originalIcon;

    }

    icon.classList.remove(
        'button-loading-icon'
    );

    button.classList.remove('loading');

    delete button.dataset.originalIcon;

}


// ======================================================
// OBTENER IMAGEN O VIDEO DE LA CARD
// ======================================================

function getCardMedia(card) {

    const titleElement =
        card.querySelector('.card-title');

    if (!titleElement) {

        throw new Error(
            'No se encontró el título.'
        );

    }

    const title =
        titleElement.textContent.trim();


    // ==================================================
    // VIDEO
    // ==================================================

    const video =
        card.querySelector('video');

    if (video) {

        const source =
            video.querySelector('source');

        if (!source) {

            throw new Error(
                'No se encontró el video.'
            );

        }

        const fileURL =
            new URL(
                source.getAttribute('src'),
                window.location.href
            ).href;


        return {

            type: 'video',

            title: title,

            url: fileURL,

            fileName: `${title}.mp4`,

            mimeType: 'video/mp4'

        };

    }


    // ==================================================
    // IMAGEN
    // ==================================================

    const image =
        card.querySelector(
            '.media-image > img'
        );

    if (!image) {

        throw new Error(
            'No se encontró la imagen.'
        );

    }


    const fileURL =
        new URL(
            image.getAttribute('src'),
            window.location.href
        ).href;


    let extension =
        fileURL
            .split('.')
            .pop()
            .split('?')[0]
            .toLowerCase();


    if (
        ![
            'jpg',
            'jpeg',
            'png',
            'webp',
            'gif'
        ].includes(extension)
    ) {

        extension = 'jpg';

    }


    let mimeType =
        'image/jpeg';


    if (extension === 'png') {

        mimeType = 'image/png';

    }

    else if (extension === 'webp') {

        mimeType = 'image/webp';

    }

    else if (extension === 'gif') {

        mimeType = 'image/gif';

    }


    return {

        type: 'image',

        title: title,

        url: fileURL,

        fileName: `${title}.${extension}`,

        mimeType: mimeType

    };

}


// ======================================================
// BOTÓN COMPARTIR
// ======================================================

document
    .querySelectorAll('.share-button')
    .forEach(button => {


    button.addEventListener(
        'click',
        async function () {


        // Evitar doble clic
        if (
            button.classList.contains('loading')
        ) {

            return;

        }


        const card =
            button.closest('.media-card');


        if (!card) return;


        let media;


        try {

            media =
                getCardMedia(card);

        }

        catch (error) {

            alert(error.message);

            return;

        }


        // ==================================================
        // COMPORTAMIENTO MÓVIL
        // ==================================================

        if (isMobileDevice()) {

            await shareMobile(
                button,
                media
            );

        }


        // ==================================================
        // COMPORTAMIENTO WEB / PC
        // ==================================================

        else {

            showShareMenu(
                media
            );

        }


    });

});


// ======================================================
// COMPARTIR EN MÓVIL
// ======================================================

async function shareMobile(
    button,
    media
) {

    startButtonLoading(button);


    try {


        // ----------------------------------------------
        // SI NO EXISTE WEB SHARE
        // ----------------------------------------------

        if (!navigator.share) {

            alert(
                'Tu dispositivo no permite compartir desde el navegador.'
            );

            return;

        }


        // ----------------------------------------------
        // INTENTAR OBTENER ARCHIVO
        // ----------------------------------------------

        let file = null;


        try {

            const response =
                await fetch(media.url);


            if (response.ok) {

                const blob =
                    await response.blob();


                file =
                    new File(
                        [blob],
                        media.fileName,
                        {
                            type: media.mimeType
                        }
                    );

            }

        }

        catch (error) {

            console.warn(
                'No se pudo preparar el archivo:',
                error
            );

        }


        // ----------------------------------------------
        // COMPARTIR ARCHIVO
        // ----------------------------------------------

        if (
            file &&
            navigator.canShare &&
            navigator.canShare({
                files: [file]
            })
        ) {


            await navigator.share({

                title: media.title,

                files: [file]

            });


            return;

        }


        // ----------------------------------------------
        // COMPARTIR URL
        // ----------------------------------------------

        await navigator.share({

            title: media.title,

            text: media.title,

            url: media.url

        });


    }

    catch (error) {


        console.error(
            'Error al compartir:',
            error
        );


        // El usuario cerró el menú
        if (
            error.name === 'AbortError'
        ) {

            return;

        }


        alert(
            'No se pudo compartir el contenido.'
        );


    }

    finally {

        stopButtonLoading(button);

    }

}


// ======================================================
// MENÚ PARA PC / WEB
// ======================================================

function showShareMenu(media) {


    // Eliminar menú anterior
    const oldMenu =
        document.getElementById(
            'customShareMenu'
        );


    if (oldMenu) {

        oldMenu.remove();

    }


    // Crear menú
    const overlay =
        document.createElement('div');

    overlay.id =
        'customShareMenu';


    overlay.innerHTML = `

        <div class="custom-share-overlay">

            <div class="custom-share-box">


                <div class="custom-share-header">

                    <h5>
                        Compartir
                    </h5>

                    <button
                        type="button"
                        class="custom-share-close"
                        id="closeShareMenu">

                        ×

                    </button>

                </div>


                <div class="custom-share-title">

                    ${escapeHTML(media.title)}

                </div>


                <div class="custom-share-options">


                    <!-- WHATSAPP -->

                    <button
                        type="button"
                        id="shareWhatsApp"
                        class="custom-share-option">

                        <span class="share-option-icon">
                          <img src="media/img/icons/whatsapp.svg" alt="">
                        </span>

                        <span>
                            WhatsApp
                        </span>

                    </button>


                    <!-- CORREO -->

                    <button
                        type="button"
                        id="shareEmail"
                        class="custom-share-option">

                        <span class="share-option-icon">
                           <img src="media/img/icons/envelope.svg" alt="">
                        </span>

                        <span>
                            Correo
                        </span>

                    </button>


                    <!-- COPIAR URL -->

                    <button
                        type="button"
                        id="copyShareURL"
                        class="custom-share-option">

                        <span class="share-option-icon">
                            <img src="media/img/icons/copy-regu.svg" alt="">
                        </span>

                        <span>
                            Copiar enlace
                        </span>

                    </button>


                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    // ==================================================
    // CERRAR
    // ==================================================

    document
        .getElementById('closeShareMenu')
        .addEventListener(
            'click',
            () => overlay.remove()
        );


    // Cerrar haciendo clic fuera
    overlay
        .querySelector('.custom-share-overlay')
        .addEventListener(
            'click',
            function (event) {

                if (
                    event.target === this
                ) {

                    overlay.remove();

                }

            }
        );


    // ==================================================
    // WHATSAPP
    // ==================================================

    document
        .getElementById('shareWhatsApp')
        .addEventListener(
            'click',
            function () {

                const text =
                    encodeURIComponent(
                        `${media.title}\n${media.url}`
                    );


                window.open(
                    `https://wa.me/?text=${text}`,
                    '_blank'
                );

            }
        );


    // ==================================================
    // CORREO
    // ==================================================

    document
        .getElementById('shareEmail')
        .addEventListener(
            'click',
            function () {

                const subject =
                    encodeURIComponent(
                        media.title
                    );


                const body =
                    encodeURIComponent(
                        `${media.title}\n\n${media.url}`
                    );


                window.location.href =
                    `mailto:?subject=${subject}&body=${body}`;

            }
        );


    // ==================================================
    // COPIAR URL
    // ==================================================

    document
        .getElementById('copyShareURL')
        .addEventListener(
            'click',
            async function () {
                try {
                    await navigator.clipboard.writeText(
                        media.url
                    );
                    this.querySelector(
                        'span:last-child'
                    ).textContent =
                        '¡Enlace copiado!';


                    setTimeout(
                        () => overlay.remove(),
                        1000
                    );


                }

                catch (error) {

                    console.error(error);

                    alert(
                        'No se pudo copiar el enlace.'
                    );

                }

            }
        );

}


// ======================================================
// ESCAPAR HTML
// ======================================================

function escapeHTML(text) {

    const div =
        document.createElement('div');

    div.textContent = text;

    return div.innerHTML;

}

