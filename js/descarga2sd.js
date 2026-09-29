document.querySelectorAll('.download-button').forEach(button => {

    button.addEventListener('click', async function () {

        // Evitar doble click
        if (this.classList.contains('loading')) {
            return;
        }

        const button = this;

        startButtonLoading(button);

        try {

            const card = button.closest('.media-card');

            // ==========================================
            // TÍTULO
            // ==========================================

            const titleElement =
                card.querySelector('.card-title');

            if (!titleElement) {
                throw new Error(
                    'No se encontró el título.'
                );
            }

            let title =
                titleElement.textContent.trim();

            // Limpiar nombre
            title =
                title.replace(/[<>:"/\\|?*]/g, '');


            // ==========================================
            // DETECTAR VIDEO
            // ==========================================

            const video =
                card.querySelector('video');

            let fileURL;
            let extension;


            if (video) {

                const source =
                    video.querySelector('source');

                if (!source) {
                    throw new Error(
                        'No se encontró el video.'
                    );
                }

                fileURL =
                    new URL(
                        source.getAttribute('src'),
                        window.location.href
                    ).href;

                extension = 'mp4';

            }


            // ==========================================
            // DETECTAR IMAGEN
            // ==========================================

            else {

                const image =
                    card.querySelector(
                        '.media-image > img'
                    );

                if (!image) {
                    throw new Error(
                        'No se encontró la imagen.'
                    );
                }

                fileURL =
                    new URL(
                        image.getAttribute('src'),
                        window.location.href
                    ).href;

                extension =
                    fileURL
                        .split('.')
                        .pop()
                        .split('?')[0];

            }


            // ==========================================
            // DESCARGAR
            // ==========================================

            const response =
                await fetch(fileURL);

            if (!response.ok) {
                throw new Error(
                    'No se pudo obtener el archivo.'
                );
            }

            const blob =
                await response.blob();

            const downloadURL =
                URL.createObjectURL(blob);

            const link =
                document.createElement('a');

            link.href = downloadURL;

            link.download =
                `${title}.${extension}`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(downloadURL);


        } catch (error) {

            console.error(
                'Error al descargar:',
                error
            );

            alert(
                'No se pudo descargar el archivo.'
            );


        } finally {

            // Restaurar icono
            stopButtonLoading(button);

        }

    });

});