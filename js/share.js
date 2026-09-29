
let sharingInProgress = false;

document.querySelectorAll('.share-button').forEach(button => {

    button.addEventListener('click', async function () {

        // Evitar que se abra dos veces
        if (sharingInProgress) {
            return;
        }

        sharingInProgress = true;

        const card = this.closest('.media-card');

        try {

            // ==========================================
            // OBTENER TÍTULO
            // ==========================================

            const titleElement = card.querySelector('.card-title');

            if (!titleElement) {
                throw new Error('No se encontró el título.');
            }

            const title = titleElement.textContent.trim();


            // ==========================================
            // DETECTAR VIDEO O IMAGEN
            // ==========================================

            const video = card.querySelector('video');

            let fileURL;
            let fileName;
            let mimeType;


            // ---------- VIDEO ----------

            if (video) {

                const source = video.querySelector('source');

                if (!source) {
                    throw new Error(
                        'No se encontró el archivo de video.'
                    );
                }

                fileURL = new URL(
                    source.getAttribute('src'),
                    window.location.href
                ).href;

                fileName = `${title}.mp4`;

                mimeType = 'video/mp4';

            }


            // ---------- IMAGEN ----------

            else {

                const image = card.querySelector(
                    '.media-image > img'
                );

                if (!image) {
                    throw new Error(
                        'No se encontró la imagen.'
                    );
                }

                fileURL = new URL(
                    image.getAttribute('src'),
                    window.location.href
                ).href;

                // Obtener extensión
                const extension =
                    fileURL
                        .split('.')
                        .pop()
                        .split('?')[0]
                        .toLowerCase();

                fileName = `${title}.${extension}`;

                mimeType =
                    extension === 'png'
                        ? 'image/png'
                        : 'image/jpeg';

            }


            console.log('Archivo:', fileName);
            console.log('URL:', fileURL);


            // ==========================================
            // COMPROBAR SI EXISTE WEB SHARE
            // ==========================================

            if (!navigator.share) {

                alert(
                    'Este navegador no soporta el menú nativo de compartir.'
                );

                return;
            }


            // ==========================================
            // OBTENER ARCHIVO
            // ==========================================

            const response = await fetch(fileURL);

            if (!response.ok) {
                throw new Error(
                    'No se pudo obtener el archivo.'
                );
            }

            const blob = await response.blob();


            console.log(
                'Tamaño:',
                (blob.size / 1024 / 1024).toFixed(2),
                'MB'
            );


            // ==========================================
            // CREAR FILE
            // ==========================================

            const file = new File(
                [blob],
                fileName,
                {
                    type: mimeType
                }
            );


            // ==========================================
            // COMPARTIR ARCHIVO
            // ==========================================

            if (
                navigator.canShare &&
                navigator.canShare({
                    files: [file]
                })
            ) {

                console.log(
                    'Intentando compartir archivo...'
                );

                await navigator.share({

                    title: title,

                    files: [file]

                });

                console.log(
                    'Archivo compartido correctamente.'
                );

            }

            // ==========================================
            // SI NO SE PUEDE COMPARTIR EL ARCHIVO
            // ==========================================

            else {

                console.log(
                    'El navegador no permite compartir archivos.'
                );

                await navigator.share({

                    title: title,

                    text: title,

                    url: fileURL

                });

            }


        } catch (error) {

            console.error(
                'Error al compartir:',
                error
            );


            // El usuario cerró el menú
            if (error.name === 'AbortError') {
                return;
            }


            // Mostrar error
            alert(
                'No se pudo compartir el archivo.'
            );


        } finally {

            // Permitir otro compartir
            setTimeout(() => {

                sharingInProgress = false;

            }, 1000);

        }

    });

});
