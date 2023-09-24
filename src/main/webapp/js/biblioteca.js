class Biblioteca {

    dom;

    modal;

    state;

    modalerror;

    modalexito;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A'};
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.modalerror = new bootstrap.Modal(this.dom.querySelector('#modalError'));
        this.dom.querySelector("#biblioteca #agregar").addEventListener('click', this.createNew);
        this.dom.querySelector("#biblioteca #buscar").addEventListener('click', this.search);
        this.dom.querySelector("#biblioteca #modal #apply").addEventListener('click', this.add);
        this.dom.querySelector("#biblioteca #modalError #dismissButton").addEventListener('click', this.hideModalError);


    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
            ${this.renderModalError()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'biblioteca';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        return `
            <h1 class="text-center mt-5" style="color: black;">Biblioteca de usuario</h1>
        <div class="linea-azul"></div>
        <div class="linea-amarilla"></div>
        <div class="linea-verde"></div>

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
                <form id = "form">
                    <div class="form-group">
                        <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
                            <i class="fas fa-newspaper mr-2"></i> Título:
                        </legend>
                        <input type ="text" class="form-control border border-dark" id="titulo" name= "titulo" style="width: 725px; font-size: 20px; margin-left: 10px;">
                    </div>
                    <div class="form-group">
                        <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
                            <i class="fas fa-file-alt mr-2"></i> Descripción: 
                        </legend>
                        <textarea type ="text" class="form-control border border-dark" style="width: 725px; font-size: 20px; margin-left: 10px;" id="descripcion" name= "descripcion" rows="3"></textarea>
                    </div>
                    <div class="form-row row date" data-provide="datepicker">
                        <div class="col-md-6">
                                <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 30px; font-family: Verdana">
                                    <i class="far fa-calendar-alt mr-2"></i> Fecha
                                </legend>
                                    <div style="display: block;">
                                        <div class="col-sm-6">
                                            <input type="text" id="fecha" name="fecha" class="form-control border border-dark" style="width: 360px; font-size: 24px;">
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
                                                <select class="" id="prioridad" name="prioridad" style="font-size: 20px; width: 320px"> 
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
                        <input type = "text" class="form-control border border-dark" id="fuente" name ="fuente" style="width: 725px; font-size: 20px; margin-left: 10px;">
                    </div>
                    <div class="form-group">
                        <legend class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 20px; font-family: Verdana">
                            <i class="fas fa-link mr-2"></i> Enlace
                        </legend>
                        <input type="text" class="form-control border border-dark" id="enlace" name="enlace" style="width: 725px; font-size: 20px; margin-left: 10px;">
                    </div>
                    
                    <div class="container" style="padding-top: 20px">
                        <div class="row justify-content-center mt-5">
                            <div class="col-md-4">
                                <button id = "apply" type="button" class="btn btn-primary btn-lg">Ingresar Noticia</button>
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

    renderModalError = () => {
        return `
        <div id="modalError" class="modal fade">
            <div class="modal-dialog modal-confirm modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center">
                        <h4 style="font-size: 24px;">¡Ups! Error.</h4>
                                <p style="font-size: 18px;">No se pudo registrar la noticia externa.</p>
                        <button id="dismissButton" style="background-color: #FF8888; color: white; font-weight: bold;" class="btn btn-success">Salir</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    renderModalSuccess = () => {
        return `
        <div id="myModal" class="modal fade">
          <div class="modal-dialog modal-confirm">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">&#xE876;</i>
                    </div>
                    <h4 class="modal-title w-100">Awesome!</h4>\t
                </div>
                <div class="modal-body">
                    <p class="text-center">Your booking has been confirmed. Check your email for detials.</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" data-dismiss="modal">OK</button>
                </div>
            </div>
            </div>
        </div>   
        `;
    }








    showModal = async () => {
        this.modal.show();
    }

    showModalError = async () => {
        this.modalerror.show();
    }

    hideModalError = async () => {
        this.modalerror.hide();
        this.modal.hide();
    }


    showModalExito = async () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modal.show();
    }

    load = async () => {
        const form = this.dom.querySelector("#biblioteca #modal form");
        const formData = new FormData(form);
        this.entity = {};
        for (let [key, value] of formData.entries()) {
            this.entity[key] = value;
        }

        // Imprime los datos en la consola
        console.log(this.entity);
    }


    createNew = () => {
        this.state.mode = 'A'; //agregar
        this.showModal();

    }

    add = async() => {
        await this.load();
        this.entity["fecha"] = "2023-12-12";
        const usuarioVacio = {
            cedula: " ",
            nombre: " ",
            primerApellido:  " ",
            segundoApellido:" ",

            email:" ",

            contrasena: " ",

            departamento:null,

            rol: null,

        };
        this.entity["id"] = "1";
        this.entity["usuario"] = usuarioVacio;
        const request = new Request('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/NoticiasExternas', {
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
    }


    emptyEntity = () => {
        var entity = '';
        return entity;
    }

}
