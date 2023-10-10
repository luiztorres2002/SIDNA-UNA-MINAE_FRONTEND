// Configuración de JSDOM para simular un entorno de navegador
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;

// Describe un conjunto de pruebas para la función 'load'
describe('Test para la función load', () => {
    // Función auxiliar para crear un objeto FormData simulado
    const createMockFormData = () => {
        const formData = new Map();
        return {
            append: (key, value) => {
                formData.set(key, value);
            },
            entries: () => formData.entries(),
        };
    };

    // Prueba para verificar si 'load' popula 'this.entity' con datos del formulario
    it('should populate this.entity with form data', async () => {
        // Función 'load' simulada que utiliza un objeto FormData simulado
        const load = (mockThis) => {
            const mockForm = createMockFormData();
            mockForm.append('Titulo', 'Titulo de la noticia');
            mockForm.append('Descripcion', 'Descripcion de la noticia');
            mockForm.append('Fecha', '23-09-2023');
            mockForm.append('Prioridad', 'Alta');
            mockForm.append('Fuente', 'Fuente.com');
            mockForm.append('Enlace', 'www.fuente.com')
            mockThis.entity = {};

            // Llena 'mockThis.entity' con los datos del objeto FormData simulado
            for (let [key, value] of mockForm.entries()) {
                mockThis.entity[key] = value;
            }
        };

        // Objeto simulado 'mockThis' que contiene 'entity' vacío
        const mockThis = {
            entity: {},
        };

        // Llama a la función 'load' pasando el objeto 'mockThis'
        await load(mockThis);

        // Comprueba si 'mockThis.entity' se llenó correctamente con los datos esperados
        expect(mockThis.entity).toEqual({
            Titulo: 'Titulo de la noticia',
            Descripcion: 'Descripcion de la noticia',
            Fecha: '23-09-2023',
            Prioridad: 'Alta',
            Fuente: 'Fuente.com',
            Enlace: 'www.fuente.com'
        });
    });
});

// Configuración de un mock para la función 'fetch' simulando peticiones HTTP
global.fetch = jest.fn();

// Describe un conjunto de pruebas para la función 'add'
describe('Test para la función add', () => {
    beforeEach(() => {
        fetch.mockClear();
    });
    async function add() {
        const entity = {
            fuente: 'fuenteprueba',
            enlace: 'enlaceprueba',
            descripcion: 'Prueba Descripcion',
            titulo: 'Prueba Titulo',
            priordad: 'alta',
            fecha: '2023-12-12',
            id: '1',
            usuario: {
                cedula: ' ',
                nombre: ' ',
                primerApellido: ' ',
                segundoApellido: ' ',
                email: ' ',
                contrasena: ' ',
                departamento: null,
                rol: null,
            },
        };
        const request = new Request('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/NoticiasExternas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entity),
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


//


//NOTA, DE AQUI EN ADELANTE SON PRUEBAS DE EXTRA.
verificarCamposLlenados = () => {
    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const fecha = document.getElementById('fecha').value;
    const prioridad = document.getElementById('prioridad').value;
    const fuente = document.getElementById('fuente').value;
    const enlace = document.getElementById('enlace').value;
    const tituloLegend = document.getElementById('titulolegend');
    const descripcionLegend = document.getElementById('descripcionlegend');
    const fechaLegend = document.getElementById('fechalegend');
    const prioridadLegend = document.getElementById('prioridadlegend');
    const fuenteLegend = document.getElementById('fuentelegend');
    const enlaceLegend = document.getElementById('enlacelegend');
    if (titulo.trim() === '') {
        tituloLegend.style.color = 'red';
        tituloLegend.style.textDecoration = 'underline';
    }
    else{
        tituloLegend.style.color = 'black';
        tituloLegend.style.textDecoration = 'none';
    }

    if (descripcion.trim() === '') {
        descripcionLegend.style.color = 'red';
        descripcionLegend.style.textDecoration = 'underline';
    }
    else{
        descripcionLegend.style.color = 'black';
        descripcionLegend.style.textDecoration = 'none';
    }

    if (fecha.trim() === '') {
        fechaLegend.style.color = 'red';
        fechaLegend.style.textDecoration = 'underline';
    }
    else{
        fechaLegend.style.color = 'black';
        fechaLegend.style.textDecoration = 'none';
    }

    if (prioridad.trim() === '') {
        prioridadLegend.style.color = 'red';
        prioridadLegend.style.textDecoration = 'underline';
    }
    else{
        prioridadLegend.style.color = 'black';
        prioridadLegend.style.textDecoration = 'none';
    }

    if (fuente.trim() === '') {
        fuenteLegend.style.color = 'red';
        fuenteLegend.style.textDecoration = 'underline';
    }
    else{
        fuenteLegend.style.color = 'black';
        fuenteLegend.style.textDecoration = 'none';
    }

    if (enlace.trim() === '') {
        enlaceLegend.style.color = 'red';
        enlaceLegend.style.textDecoration = 'underline';
    }
    else{
        enlaceLegend.style.color = 'black';
        enlaceLegend.style.textDecoration = 'none';
    }

    // Verificar si alguno de los campos está vacío
    if (
        titulo.trim() === '' ||
        descripcion.trim() === '' ||
        fecha.trim() === '' ||
        prioridad.trim() === '' ||
        fuente.trim() === '' ||
        enlace.trim() === ''
    ) {
        return false;
    }
    return true;
}


//TEST PARA VERIFICAR QUE TODOS LOS CAMPOS HAN SIDO LLENADOS
describe('verificarCamposLlenados', () => {
    it('debería devolver falso y aplicar estilo rojo y subrayado a los campos vacíos', () => {
        document.body.innerHTML = `
            <input id="titulo" value="">
            <input id="descripcion" value="">
            <input id="fecha" value="">
            <input id="prioridad" value="">
            <input id="fuente" value="">
            <input id="enlace" value="">
            <legend id="titulolegend" style="color: black; text-decoration: none;"></legend>
            <legend id="descripcionlegend" style="color: black; text-decoration: none;"></legend>
            <legend id="fechalegend" style="color: black; text-decoration: none;"></legend>
            <legend id="prioridadlegend" style="color: black; text-decoration: none;"></legend>
            <legend id="fuentelegend" style="color: black; text-decoration: none;"></legend>
            <legend id="enlacelegend" style="color: black; text-decoration: none;"></legend>
        `;

        // Ejecuta la función que deseas probar
        const resultado = verificarCamposLlenados();

        // Realiza las comprobaciones y muestra mensajes de depuración
        expect(resultado).toBe(false);
        console.log('Resultado:', resultado);

        document.body.innerHTML = ''; // Limpia el entorno de prueba
    });

    it('debería devolver verdadero si todos los campos están llenos', () => {
        document.body.innerHTML = `
            <input id="titulo" value="Título lleno">
            <input id="descripcion" value="Descripción lleno">
            <input id="fecha" value="2023-09-22">
            <input id="prioridad" value="Alta">
            <input id="fuente" value="Fuente lleno">
            <input id="enlace" value="Enlace lleno">
            <legend id="titulolegend" style="color: black; text-decoration: none;"></legend>
            <legend id="descripcionlegend" style="color: black; text-decoration: none;"></legend>
            <legend id="fechalegend" style="color: black; text-decoration: none;"></legend>
            <legend id="prioridadlegend" style="color: black; text-decoration: none;"></legend>
            <legend id="fuentelegend" style="color: black; text-decoration: none;"></legend>
            <legend id="enlacelegend" style="color: black; text-decoration: none;"></legend>
        `;

        // Ejecuta la función que deseas probar
        const resultado = verificarCamposLlenados();

        // Realiza las comprobaciones y muestra mensajes de depuración
        expect(resultado).toBe(true);
        console.log('Resultado:', resultado);

        document.body.innerHTML = ''; // Limpia el entorno de prueba
    });
});



describe('Test para la función cargar', () => {
    async function cargarBiblioteca() {
        try {
            const response = await fetch('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/NoticiasMarcadas/4-0258-0085');
            if(!response.ok){
                return 'error';
                console.log('No se han cargado las noticias de manera correcta')
            }
            else{
                return 'success';
                console.log('La noticia ha sido ingresada con exito');
            }
        } catch (error) {
            return 'error';
        }
    };

    it('debería obtener las noticias de manera exitosa', async () => {
        fetch.mockResolvedValue({ ok: true });
        const result = await cargarBiblioteca();
        expect(result).toEqual('success');
        expect(fetch).toHaveBeenCalled();
    });
});

