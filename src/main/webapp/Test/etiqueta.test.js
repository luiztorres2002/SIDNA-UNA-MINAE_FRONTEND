const {JSDOM} = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;
global.fetch = jest.fn();

////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
/////////////////TEST EDITAR CAMBIAR ESTADO ETIQUETA FRONT END////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

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
        fetch.mockResolvedValueOnce({ok: true});
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

////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
////////////////////////TEST EDITAR ETIQUETA FRONT END////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

const editarEtiqueta = (etiquetaId, descripcion) => {
    const urlEdit = `http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/editar/${etiquetaId}?input=${descripcion}`;
    fetch(urlEdit, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (!response.ok) {
            console.error(`Error al editar la etiqueta: ${response.status}`);
            throw new Error('Error al editar la etiqueta');
        }
        console.log('Etiqueta actualizada correctamente');
    }).catch((error) => {
        console.error('Error:', error);
    });
};

describe('editarEtiqueta', () => {
    it('debería manejar respuestas exitosas', async () => {
        fetch.mockResolvedValueOnce({ok: true});
        await editarEtiqueta(1, "Inundacion")
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/editar/1?input=Inundacion'), {
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

////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////TEST AGREGAR ETIQUETA////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
const addNewLabel = () => {
    const descripcion = 'ppiiooo';
    const url = 'http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: descripcion
    };

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                console.log('Error');
                throw new Error('Error en la solicitud');
            } else {
                console.log('Etiqueta agregada con éxito');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
};

describe('addNewLabel', () => {
    it('debería manejar respuestas exitosas', async () => {
        fetch.mockResolvedValueOnce({ ok: true });
        await addNewLabel();
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: 'ppiiooo',
        });
    });

    it('debería manejar respuestas de error', async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await addNewLabel();
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: 'ppiiooo',
        });
        console.log('Etiqueta agregada con éxito');
    });

    afterEach(() => {
        fetch.mockClear();
    });
});

describe('Test para la función Renderizar Etiquetas y Contar las Noticias Asociadas', () => {
    async function renderizaEtiquetas() {
        try {
            const response = await fetch('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/4-0258-0085');
            if(!response.ok){
                return 'error';
                console.log('No se han cargado las etiquetas de manera correcta')
            }
            else{
                return 'success';
                console.log('Las etiquetas se han cargado correctamente');
            }
        } catch (error) {
            return 'error';
        }
    };

    it('Debería obtener las etiquetas de manera exitosa', async () => {
        fetch.mockResolvedValue({ ok: true });
        const result = await renderizaEtiquetas();
        expect(result).toEqual('success');
        expect(fetch).toHaveBeenCalled();
    });
});