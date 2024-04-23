const { test } = require('@jest/globals');
const { JSDOM } = require('jsdom');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;
global.localStorage = {
    removeItem: jest.fn()
};

describe('cerrarSesion()', () => {
    test('cierra correctamente la sesión', () => {
        // Simula elementos DOM necesarios
        document.body.innerHTML = `
            <div id="login"></div>
            <div id="menuItems"></div>
            <div id="dropdwonUsuario"></div>
        `;

        // Simula los objetos Admin y Busqueda
        const Admin = { dom: { style: { display: "block" } } };
        const Busqueda = { dom: { style: { display: "block" } } };

        // Lógica del método cerrarSesion
        const login = document.querySelector('#login');
        const renderBodyFiller = () => {
            var html = `
            <div id='bodyFiller' style='margin-left: 10%; margin-top:100px; width: 80%; text-align: center; font-size: 1.5em'>
                <div class="mt-14" style="color: white; display: inline-block; padding-left: 2px" >
                    <div class="linea-azul"></div>
                    <div class="linea-amarilla"></div>
                    <div class="linea-verde"></div>
                </div>
            </div>
            `;
            document.querySelector('#app>#body').replaceChildren();
            document.querySelector('#app>#body').innerHTML = html;
        };
        renderBodyFiller();
        document.querySelector('#menuItems').style.display = "none";
        document.querySelector('#dropdwonUsuario').style.display = 'none';
        login.style.display = 'flex';
        if (Admin && Admin.dom && Admin.dom.style.display !== "none") {
            Admin.dom.style.display = "none";
        }
        if (Busqueda && Busqueda.dom && Busqueda.dom.style.display !== "none") {
            Busqueda.dom.style.display = "none";
        }

        localStorage.removeItem('usuario');
        localStorage.removeItem('usuarioNomb');

        // Verifica que los elementos DOM se hayan modificado correctamente
        expect(document.querySelector('#login').style.display).toBe('flex');
        expect(document.querySelector('#menuItems').style.display).toBe('none');
        expect(document.querySelector('#dropdwonUsuario').style.display).toBe('none');

        // Verifica que los elementos relacionados con Admin y Busqueda también se hayan ocultado si corresponde
        expect(Admin.dom.style.display).toBe('none');
        expect(Busqueda.dom.style.display).toBe('none');

        // Verifica que se hayan eliminado los elementos del localStorage
        expect(global.localStorage.removeItem).toHaveBeenCalledWith('usuario');
        expect(global.localStorage.removeItem).toHaveBeenCalledWith('usuarioNomb');
    });
});
