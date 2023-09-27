const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;
global.fetch = jest.fn();


const addNewLabel = (nombre) => {
    const url = `http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/addEtiqueta/${nombre}`;

    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) {
                console.error(`Error al añadir la etiqueta: ${response.status}`);
                throw new Error('Error al añadir etiqueta'); // Lanza una excepción en caso de respuesta no exitosa
            }
            console.log('Se añadió la etiqueta');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};


describe('addNewLabel', () => {
    it('debería manejar respuestas exitosas', async () => {
        // Configura el comportamiento simulado de 'fetch' para una respuesta exitosa
        fetch.mockResolvedValueOnce({ ok: true });
        await cambiarEstadoEtiqueta(3, true);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/cambiarEstado/3/true'), {
            method: 'INSERT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
    afterEach(() => {
        fetch.mockClear();
    });
});
