class Etiqueta {

    dom;

    modal;

    state;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A'};
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.dom.querySelector("#categorias #agregar").addEventListener('click', this.createNew);
        this.dom.querySelector("#categorias #buscar").addEventListener('click', this.search);


    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'categorias';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        return `
   <div class="d-flex justify-content-center">
            <form id="form" style="width: 1500px; margin-top: 20px;"">
                <div class="input-group mb-3 mt-10">
                    <span class="input-group-text ms-20">Nombre</span>
                    <input class="form-control me-2 ms-20" id="name" type="text" style="width: 600px">
                    <div class="btn-toolbar">
                        <div class="btn-group me-2"><button type="button" class="btn btn-primary" id="buscar">Buscar</button></div>
                        <div class="btn-group me-2"><button type="button" class="btn btn-primary" id="agregar">Agregar</button></div>
                    </div>
 <table class="table table-fixed" >
  <thead>
        <tr>
        
            <th class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none">Nombre de Etiqueta</th>
            <th class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></th>
            <th class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none" >Noticias Asociadas</th>
        </tr>
    </thead>
    <tbody>
        <tr class="disabled-row" >
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none">Incendios</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">5</span> <!-- Número 5 con margen derecho -->
                    <div class="form-check form-switch toggle-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%23ff1100\\'/></svg>');">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </div>
            </td>
            
        </tr>
        
        <tr id="fila">
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none">Ambiente</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">6</span> <!-- Número 5 con margen derecho -->
                    <div class="form-check form-switch toggle-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%2384bd00\\'/></svg>');">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </div>
            </td>
            
        </tr>
        <tr class="disabled-row" id="fila">
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none">Denuncia</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">10</span> <!-- Número 5 con margen derecho -->
                    <div class="form-check form-switch toggle-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%23ff1100\\'/></svg>');">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </div>
            </td>
            
        </tr>
        <tr id="fila">
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none">Energia</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">20</span> <!-- Número 5 con margen derecho -->
                    <div class="form-check form-switch toggle-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%23fed141\\'/></svg>');">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </div>
            </td>
            
        </tr>
        <tr id="fila">
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none">Sostenibilidad</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">1</span> <!-- Número 5 con margen derecho -->
                    <div class="form-check form-switch toggle-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%23004976\\'/></svg>');">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </div>
            </td>
            
        </tr>
    </tbody>
</table>

<script>
        // Obtener el elemento del toggle switch
        const toggleSwitch = this.dom.getElementById('flexSwitchCheckDefault');
        const fila = this.dom..getElementById('fila');

        // Función para cambiar la clase de la fila en función del estado del toggle switch
        function actualizarEstadoFila() {
            if (toggleSwitch.checked) {
                fila.classList.remove('disabled-row'); // Si está marcado, eliminar la clase de fila deshabilitada
            } else {
                fila.classList.add('disabled-row'); // Si no está marcado, agregar la clase de fila deshabilitada
            }
        }

        // Escuchar cambios en el toggle switch
        toggleSwitch.addEventListener('change', actualizarEstadoFila);

        // Aplicar el estado de fila al cargar la página
        actualizarEstadoFila();
    </script>
                </div>
            </form>
        </div>

        
        
            
        `;
    }

    renderModal = () => {
        return `
<div id="modal" class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close d-flex align-items-center justify-content-center" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true" class="ion-ios-close"></span>
        </button>
      </div>
      <div class="modal-body p-4 py-5 p-md-5">
        <h3 class="text-center mb-3">Introduce una nueva noticia de fuente externa</h3>
        <ul class="ftco-footer-social p-0 text-center">
         
        </ul>
        <form action="#" class="signup-form">
         <div class="form-group mb-2">
            <label for="name" style="font-size: 15px;">Titulo de la noticia</label>
            <input type="text" class="form-control">
        </div>

          <div class="form-group mb-2">
            <label for="sinopsis" style="font-size: 15px;">Sinopsis</label>
            <input type="text" class="form-control">
          </div>
          <div class="form-group mb-2">
            <label for="password">Fuente</label>
            <input type="password" class="form-control">
          </div>
          <div class="form-group mb-2">
            <button type="submit" class="form-control btn btn-primary rounded submit px-3">Ingresar</button>
          </div>
          <div class="form-group d-md-flex">
            
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

        `;
    }

    load = () => {
        const form = this.dom.querySelector("#categorias #modal #form");
        const formData = new FormData(form);
        this.entity = {};

        for (let [key, value] of formData.entries()) {
            this.entity[key] = value;
        }
    }



    add = async () => {
        // Necesito validar antes de ingresar en la base de datos.
        this.load(); // Carga los datos del formulario al objeto entity.
        const codigo = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
        this.entity["codigo"] = codigo;
        const request = new Request('http://localhost:8080/Proyecto2-Backend/api/categorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.entity)
        });

        try {
            const response = await fetch(request);
            if (!response.ok) {
                console.log(this.entity);
                return;
            }
        } catch (e) {
            alert(e);
        }

        this.list();
        this.reset();
        this.resetForm();
        this.modal.hide();
    }

    row = (list, c) => {
        var tr = document.createElement("tr");
        tr.innerHTML = `
                <td>${c.codigo}</td>
                <td>${c.nombre}</td>
                <td>${c.descripcion}</td>`
        ;


        list.appendChild(tr);
    }

    resetForm = () => {
        var formulario = this.dom.querySelector("#categorias #modal #form");
        formulario.reset();
    }

    showModal = async () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modal.show();
    }

    reset = () => {
        this.state.entity = this.emptyEntity();
    }

    listSearch = (placa) => {
        var usuario = globalstate.user.cedula;
        const request = new Request(`${"http://localhost:8080/Proyecto2-Backend/api"}/categorias/search?name=${placa}`,
            {method: 'GET', headers: {}});

        (async () => {

            const response = await fetch(request);
            if (!response.ok) {
                errorMessage(response.status);
                return;

            }

            var coberturas = await response.json();
            var col = coberturas;
            var listing = this.dom.querySelector("#lista #tablaCategorias");
            listing.innerHTML = "";
            col.forEach(p => this.row(listing, p));
            await col.forEach(p => this.addListener(p));


        })();
    }

    search = async () => {
        var xxx = document.getElementById("name").value;
        this.listSearch(xxx);
    }

    createNew = () => {
        this.reset();
        this.state.mode = 'A'; //agregar
        this.showModal();

    }

    emptyEntity = () => {
        var entity = '';
        return entity;
    }

}
