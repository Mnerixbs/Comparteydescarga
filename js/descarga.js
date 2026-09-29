
document.querySelectorAll('.download-button').forEach(button => {

    button.addEventListener('click', async function () {

        // Card donde se presionó el botón
        const card = this.closest('.media-card');

        // Título de la card
        const titleElement = card.querySelector('.card-title');

        if (!titleElement) {
            alert('No se encontró el título de la tarjeta.');
            return;
        }

        let title = titleElement.textContent.trim();

        // Limpiar caracteres no válidos para nombres de archivos
        title = title.replace(/[<>:"/\\|?*]/g, '');

        let fileURL;
        let extension;

        // ==========================================
        // ¿ES VIDEO?
        // ==========================================

        const video = card.querySelector('video');

        if (video) {

            const source = video.querySelector('source');

            if (!source) {
                alert('No se encontró el archivo de video.');
                return;
            }

            fileURL = source.src;

            extension = fileURL
                .split('.')
                .pop()
                .split('?')[0];

        } 

        // ==========================================
        // ¿ES IMAGEN?
        // ==========================================

        else {

            const image = card.querySelector('.media-image > img');

            if (!image) {
                alert('No se encontró la imagen.');
                return;
            }

            fileURL = image.src;

            extension = fileURL
                .split('.')
                .pop()
                .split('?')[0];

        }


        // ==========================================
        // DESCARGAR
        // ==========================================

        try {

            const response = await fetch(fileURL);

            if (!response.ok) {
                throw new Error('No se pudo obtener el archivo.');
            }

            const blob = await response.blob();

            const downloadURL = URL.createObjectURL(blob);

            const link = document.createElement('a');

            link.href = downloadURL;

            link.download = `${title}.${extension}`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            // Liberar memoria
            URL.revokeObjectURL(downloadURL);

        } catch (error) {

            console.error(error);

            alert('No se pudo descargar el archivo.');

        }

    });

});

