class VistaPrevia {
    constructor(enlaceBtn, imagenHoverContainer, imagenHover, spinner, requestOptions) {
        this.enlaceBtn = enlaceBtn;
        this.imagenHoverContainer = imagenHoverContainer;
        this.imagenHover = imagenHover;
        this.spinner = spinner;
        this.requestOptions = requestOptions;
    }

    async cargarImagenPreview(url) {
        this.imagenHoverContainer.style.display = 'block';
        if (!this.imagenHover.src) {
            this.spinner.style.display = 'block';
        }

        try {
            const screenshotResponse = await fetch("https://api.apilayer.com/screenshot?url=" + url, this.requestOptions);
            const screenshotData = await screenshotResponse.json();
            const imagenPreview = screenshotData.screenshot_url;

            this.imagenHover.src = imagenPreview;
            this.imagenHover.style.display = 'block';
            this.spinner.style.display = 'none';
        } catch (error) {
            this.imagenHoverContainer.style.display = 'none';
        }
    }

    agregarEventListener() {
        this.enlaceBtn.addEventListener('mouseenter', async () => {
            await this.cargarImagenPreview(result.link);
        });
    }
}

