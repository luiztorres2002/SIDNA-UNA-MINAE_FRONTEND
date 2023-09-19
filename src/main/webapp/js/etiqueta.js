class Etiqueta {

    dom;

    modal;
    modalEditar;

    state;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A'};
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.modalEditar = new bootstrap.Modal(this.dom.querySelector('#modalEditar'));
        this.dom.querySelector("#etiquetas #agregar").addEventListener('click', this.createNew);
        this.dom.querySelector("#etiquetas #buscar").addEventListener('click', this.search);
        this.dom.querySelector("#etiquetas #modalEditar #formEdit #cancel").addEventListener('click', this.cancelarEdit);
        this.dom.querySelector("#etiquetas #modalEditar #formEdit #save").addEventListener('click', this.saveEdit);
        this.dom.querySelector("#etiquetas #modalEditar #close").addEventListener('click', this.cancelarEdit);
        this.dom.querySelector("#etiquetas #form #tablaEtiquetas #editar").addEventListener('click', this.editarEtiqueta);
    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
            ${this.renderModalEditar()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'etiquetas';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        return `
   <div class="d-flex justify-content-center">
            <form id="form" style="width: 85%; margin-top: 20px;"">
           <div class="input-group mb-3 mt-10" style="display: flex; align-items: center; justify-content: center;">
    <div class="btn-group me-2">
        <button type="button" class="btn btn-custom-outline-success" id="agregar" style="height: 40px; width: 120px; line-height: 5px;"><span class="font-weight-bold">+</span> Agregar</button>
    </div>
    <input class="form-control me-2 fontAwesome" id="name" type="text" style="width: 200px; margin-left: 700px; height: 38px; border-radius: 5px; border: 1px solid #006ba6;" placeholder="&#xf002; Buscar Etiqueta...">
    <div class="btn-group me-2">
         <button type="button" class="btn btn-custom-outline-success" id="buscar" style="height: 40px; line-height: 5px; width: 70px; margin-left: 50px;">
            <i class="fas fa-search"></i>
         </button>
    </div>
</div>
 <table class="table table-fixed" id="tablaEtiquetas">
  <thead>
        <tr>
        
            <th class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none">Nombre de Etiqueta</th>
            <th class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></th>
            <th class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none" >Noticias Asociadas</th>
        </tr>
    </thead>
    <tbody>
        <tr class="disabled-row" >
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none"><li class="list-inline-item">
                                                <button id="editar" class="btn  btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"><i class="fa fa-edit fa-lg"></i></button>
                                                </li>Incendios</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">5</span> 
                    <div class="form-check form-switch toggle-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%23ff1100\\'/></svg>');">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </div>
            </td>
            
        </tr>
        
        <tr id="fila">
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none"><li class="list-inline-item">
                                                <button class="btn  btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"><i class="fa fa-edit fa-lg"></i></button>
                                                </li>Ambiente</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">6</span> 
                    <div class="form-check form-switch toggle-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%2384bd00\\'/></svg>');">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </div>
            </td>
            
        </tr>
        <tr class="disabled-row" id="fila">
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none"><li class="list-inline-item">
                                                <button class="btn  btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"><i class="fa fa-edit fa-lg"></i></button>
                                                </li>Denuncia</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">10</span> 
                    <div class="form-check form-switch toggle-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%23ff1100\\'/></svg>');">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </div>
            </td>
            
        </tr>
        <tr id="fila">
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none"><li class="list-inline-item">
                                                <button class="btn  btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"><i class="fa fa-edit fa-lg"></i></button>
                                                </li>Energia</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">20</span> 
                    <div class="form-check form-switch toggle-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%23fed141\\'/></svg>');">
                        <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                    </div>
                </div>
            </td>
            
        </tr>
        <tr id="fila">
            <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none"> <li class="list-inline-item">
                                                <button class="btn  btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"><i class="fa fa-edit fa-lg"></i></button>
                                                </li>Sostenibilidad</td>
            <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
            <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
                <div class="toggle-container">
                    <span class="number">1</span> 
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
        
        const toggleSwitch = this.dom.getElementById('flexSwitchCheckDefault');
        const fila = this.dom..getElementById('fila');

        
        function actualizarEstadoFila() {
            if (toggleSwitch.checked) {
                fila.classList.remove('disabled-row');
            } else {
                fila.classList.add('disabled-row'); 
            }
        }

      
        toggleSwitch.addEventListener('change', actualizarEstadoFila);

       
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
        <button id="close" type="button" class="close d-flex align-items-center justify-content-center" data-dismiss="modal" aria-label="Close">
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

    renderModalEditar = () => {
        return `
<div id="modalEditar" class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button id="close" type="button" class="close d-flex align-items-center justify-content-center" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true" class="ion-ios-close"></span>
        </button>
      </div>
      <div class="modal-body p-4 py-5 p-md-5">
        <h3 class="text-left mb-3">Editar Etiqueta <button class="btn  btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"><i class="fa fa-edit fa-lg"></i></button> </h3>
        <ul class="ftco-footer-social p-0 text-center">
         
        </ul>
        <form action="#" class="signup-form" id="formEdit">
         <div class="form-group mb-2">
            <input id="input" type="text" class="form-control" style="border-right-color: white; border-left-color: white; border-top-color: white; border-bottom-color: black">
        </div>

          <div class="form-group mb-2 align-content-lg-end">
            <button id="cancel" type="submit" style="background-color: white" class="rounded">Cancelar</button>
            <button id="save" type="submit" style="background-color: #307c" class="rounded text-light">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
`;
    }

    load = () => {
        const form = this.dom.querySelector("#etiquetas #modal #form");
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
        var formulario = this.dom.querySelector("#etiquetas #modal #form");
        formulario.reset();
    }

    resetFormEditar = () => {
        var form = this.dom.querySelector("#etiquetas #modalEditar #formEdit");
        form.reset();
    }

    showModal = async () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modal.show();
    }

    showEditar = async () => {
        this.resetFormEditar();
        this.modalEditar.show();
    }

    cancelarEdit = () => {
        this.modalEditar.hide();
    }

    saveEdit = () => {
        alert("TO DO");
    }

    editarEtiqueta = () => {
        this.showEditar();
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
