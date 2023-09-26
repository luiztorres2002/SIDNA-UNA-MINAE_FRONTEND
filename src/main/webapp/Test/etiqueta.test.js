const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;
global.fetch = jest.fn();


const cambiarEstadoEtiqueta = (etiquetaId, nuevoEstado) => {
    const url = `http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/cambiarEstado/${etiquetaId}/${nuevoEstado}`;
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            if (!response.ok) {
                console.error(`Error al cambiar el estado de la etiqueta: ${response.status}`);
                throw new Error('Error al cambiar el estado de la etiqueta'); // Lanza una excepción en caso de respuesta no exitosa
            }
            console.log('Estado de la etiqueta cambiado exitosamente');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};
describe('cambiarEstadoEtiqueta', () => {
    it('debería manejar respuestas exitosas', async () => {
        // Configura el comportamiento simulado de 'fetch' para una respuesta exitosa
        fetch.mockResolvedValueOnce({ ok: true });
        await cambiarEstadoEtiqueta(3, true);
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/cambiarEstado/3/true'), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    });
    afterEach(() => {
        fetch.mockClear();
    });
});
