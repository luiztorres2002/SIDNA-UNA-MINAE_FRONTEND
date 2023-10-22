const {JSDOM} = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;
global.fetch = jest.fn();
// VistaPrevia.test.js
const VistaPrevia = require('./VistaPrevia');

describe('VistaPrevia', () => {
    let vistaPrevia;

    // Mock de elementos DOM y fetch para las pruebas
    const enlaceBtn = document.createElement('a');
    const imagenHoverContainer = document.createElement('div');
    const imagenHover = document.createElement('img');
    const spinner = document.createElement('div');

    // Mock de opciones de solicitud para fetch
    const requestOptions = { method: 'GET' };

    beforeEach(() => {
        vistaPrevia = new VistaPrevia(enlaceBtn, imagenHoverContainer, imagenHover, spinner, requestOptions);
    });

    test('cargarImagenPreview muestra imagen correctamente', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            json: () => ({ screenshot_url: 'imagen.png' }),
        });

        await vistaPrevia.cargarImagenPreview('https://semanariouniversidad.com/pais/naturaleza-playas-y-aventura-son-el-epicentro-de-atraccion-para-turistas-que-arriban-a-costa-rica/');

        expect(vistaPrevia.imagenHoverContainer.style.display).toBe('block');
        expect(vistaPrevia.spinner.style.display).toBe('none');
        expect(vistaPrevia.imagenHover.src).toBe('imagen.png');
        expect(vistaPrevia.imagenHover.style.display).toBe('block');
    });

    test('cargarImagenPreview maneja error', async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error('Error'));

        await vistaPrevia.cargarImagenPreview('https://semanariouniversidad.com/pais/naturaleza-playas-y-aventura-son-el-epicentro-de-atraccion-para-turistas-que-arriban-a-costa-rica/');

        expect(vistaPrevia.imagenHoverContainer.style.display).toBe('none');
    });
});
