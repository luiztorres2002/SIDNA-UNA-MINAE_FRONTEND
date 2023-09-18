

class Biblioteca {

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
            <h1 class="text-center mt-5" style="color: white;">Biblioteca de usuario</h1>


        <div class="d-flex justify-content-center">
            <form id="form">
                <div class="input-group mb-3 mt-10">
                    <span class="input-group-text ms-20">Nombre</span>
                    <input class="form-control me-2 ms-20" id="name" type="text" style="width: 600px">
                    <div class="btn-toolbar">
                        <div class="btn-group me-2"><button type="button" class="btn btn-primary" id="buscar">Buscar</button></div>
                        <div class="btn-group me-2"><button type="button" class="btn btn-primary" id="agregar">Agregar</button></div>
                    </div>
                </div>
            </form>
        </div>

        
        
            
        `;
    }

    renderModal = () => {
        return `
<div id="modal" class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered modal-lg custom-modal-width" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close d-flex align-items-center justify-content-center" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true" class="ion-ios-close"></span>
        </button>
      </div>
      <div class="modal-body p-4 py-3 p-md-3">
        
        <img src="images/Minae.png" class="w-50 mx-auto d-block" alt="...">
        <ul class="ftco-footer-social p-0 text-center"></ul>
        
        <div style="padding-bottom: 25px;">
        
        </div>
        <form>
        
        
        
<div class="form-group">
    <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
    <i class="fas fa-newspaper mr-2"></i> Título:
</legend>
<input class="form-control border border-dark" id="titulo" style="width: 725px; font-size: 20px; margin-left: 10px;">

  </div>

 <div class="form-group">
    <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
    <i class="fas fa-file-alt mr-2"></i> Descripción: 
</legend>
<textarea class="form-control border border-dark" style="width: 725px; font-size: 20px; margin-left: 10px;" id="exampleTextarea" rows="3"></textarea>

  </div>
  
<div class="form-row row date" data-provide="datepicker">
    <div class="col-md-6">
      <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 30px; font-family: Verdana">
    <i class="far fa-calendar-alt mr-2"></i> Fecha
</legend>
 <div style="display: block;">
   <div class="col-sm-6">
    <input type="text" class="form-control border border-dark" style="width: 360px; font-size: 24px;">
</div>
<div class="col-3">
    <div class="input-group-addon" style="font-size: 24px;">
        <span class="glyphicon glyphicon-th"></span>
    </div>
</div>

</div>
    </div>
    <div class="form-group col-md-6">
      <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 30px; font-family: Verdana">
    <i class="fas fa-exclamation-triangle mr-2"></i> Prioridad
</legend>
      <div style="display: block;">
                <div class="col-sm-1">
                    <select class="" id="sel1" name="sellist1" style="font-size: 20px; width: 320px"> 
            <option>Alta</option>
            <option>Media</option>
            <option selected>Baja</option>
        </select>
                </div>
                
</div>
    </div>
  </div>
  
  <div class="form-group">
   <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 20px; font-family: Verdana">
    <i class="fas fa-info-circle mr-2"></i> Fuente
</legend>
<input class="form-control border border-dark" id="titulo" style="width: 725px; font-size: 20px; margin-left: 10px;">

  </div>
  
  <div class="form-group">
     <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 20px; font-family: Verdana">
    <i class="fas fa-link mr-2"></i> Enlace
</legend>
<input class="form-control border border-dark" id="titulo" style="width: 725px; font-size: 20px; margin-left: 10px;">

  </div>
  
<div class="form-group row" style="padding-top: 20px">
    <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 30px; font-family: Verdana">
    <i class="fas fa-image mr-2"></i> Imagen:
</legend>

    <div style="display: inline-block">
    <div class="col-sm-1">
        <input type="file" name="imagen">
    </div>
    </div>
</div>
          <div class="container" style="padding-top: 20px">
            <div class="row justify-content-center mt-5">
              <div class="col-md-4">
                <button type="button" class="btn btn-primary btn-lg">Ingresar Noticia</button>
              </div>
            </div>
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
