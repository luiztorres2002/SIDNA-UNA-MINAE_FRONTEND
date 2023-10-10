const {JSDOM} = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;
global.fetch = jest.fn();

describe('Test para la función add', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    const add = async () => {
        const entity = {
            id: 1,
            titulo: 'Pruebatitulo',
            descripcion: 'pruebadescripcion',
            fecha: "hace dos dias",
            prioridad: "alta",
            fuente: "pruebafuente",
            enlace: "pruebaenlace",
            imagen: "dsad",
            fechaGuardado: "2023-11-11",
            usuarioCedula: "4-0258-0085",
        };
        const request = new Request('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/NoticiasMarcadas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entity)
        });

        try {
            const response = await fetch(request);
            if (!response.ok) {
                return 'error';
                console.log('La noticia fallo al ingresarse');
            } else {
                return 'success';
                console.log('La noticia ha sido ingresada con exito');
            }
        } catch (e) {
            return 'error';
        }
    }

    it('debería agregar una entidad exitosamente', async () => {
        fetch.mockResolvedValue({ ok: true });
        const result = await add();
        expect(result).toEqual('success');
        expect(fetch).toHaveBeenCalled();
    });
});
