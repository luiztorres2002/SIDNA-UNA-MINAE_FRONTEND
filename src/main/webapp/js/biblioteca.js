class Biblioteca {

    dom;

    modal;

    state;

    modalerror;

    modalCampo;

    modalexito;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A'};
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.modalerror = new bootstrap.Modal(this.dom.querySelector('#modalError'));
        this.modalexito = new bootstrap.Modal(this.dom.querySelector('#sucessmodal'));
        this.modalCampo = new bootstrap.Modal(this.dom.querySelector('#modalcampo'));
        this.dom.querySelector("#biblioteca #agregar").addEventListener('click', this.createNew);
        this.dom.querySelector("#biblioteca #buscar").addEventListener('click', this.search);
        this.dom.querySelector("#biblioteca #modal #apply").addEventListener('click', this.add);
        this.dom.querySelector("#biblioteca #modalError #dismissButton").addEventListener('click', this.hideModalError);
        this.dom.querySelector("#biblioteca #sucessmodal #sucessbuton").addEventListener('click', this.hideModalExito);
        this.dom.querySelector("#biblioteca #modalcampo #dismisscampo").addEventListener('click', this.hideModalCampo);

    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
            ${this.renderModalError()}
            ${this.renderModalSuccess()}
            ${this.renderModalCampo()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'biblioteca';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        return `
            <h1 class="text-center mt-5" style="color: black;">Biblioteca de usuario</h1>


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
                        <legend id = "titulolegend" class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
                            <i class="fas fa-newspaper mr-2"></i> Título:
                        </legend>
                        <input type ="text" class="form-control border border-dark" id="titulo" name= "titulo" style="width: 725px; font-size: 20px; margin-left: 10px;">
                    </div>
                    <div class="form-group">
                        <legend id = "descripcionlegend" class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
                            <i class="fas fa-file-alt mr-2"></i> Descripción: 
                        </legend>
                        <textarea type ="text" class="form-control border border-dark" style="width: 725px; font-size: 20px; margin-left: 10px;" id="descripcion" name= "descripcion" rows="3"></textarea>
                    </div>
                    <div class="form-row row date" data-provide="datepicker">
                        <div class="col-md-6">
                                <legend id = "fechalegend"  class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 30px; font-family: Verdana">
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
                            <legend id = "prioridadlegend" class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 30px; font-family: Verdana">
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
                        <legend id = "fuentelegend"  class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 20px; font-family: Verdana">
                            <i class="fas fa-info-circle mr-2"></i> Fuente
                        </legend>
                        <input type = "text" class="form-control border border-dark" id="fuente" name ="fuente" style="width: 725px; font-size: 20px; margin-left: 10px;">
                    </div>
                    <div class="form-group">
                        <legend id = "enlacelegend"  class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 20px; font-family: Verdana">
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
            <div class="modal-dialog modal-confirm">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="icon-box">
                            <i class="material-icons">&#xE5CD;</i>
                        </div>
                    </div>
                    <div class="modal-body text-center">
                         <h4>Ooops!</h4>\t
                            <p>Something went wrong. File was not uploaded.</p>
                                <button id = "dismissButton" class="btn btn-success" data-dismiss="modal">Try Again</button>
                    </div>
                </div>
            </div>
        </div>     
        `;
    }

    renderModalCampo = () => {
        return `
    <div id="modalcampo" class="modal fade">
    <div class="modal-dialog modal-confirm2">
        <div class="modal-content">
            <div class="modal-body text-center">
                <p style="font-size: 20px;">Por favor, complete todos los campos para publicar la noticia.</p>
                <button id="dismisscampo" style="font-size: 20px;" class="btn2 btn-success" data-dismiss="modal">Regresar</button>
            </div>
        </div>
    </div>
</div>

    `;
    }


    renderModalSuccess = () => {
        return `
        <div id="sucessmodal" class="modal fade">
          <div class="modal-dialog modal-confirm">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">&#xE876;</i>
                    </div>
                    <h4 class="modal-title w-100">¡Confirmado!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">Tu noticia externa ha sido ingresada con éxito.</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="sucessbuton" data-dismiss="modal">OK</button>
                </div>
            </div>
            </div>
        </div>   
        `;
    }

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
            this.showModalCampo();
            return false;
        }
        return true;
    }




    showModal = async () => {
        this.resetForm();
        this.modal.show();
    }

    showModalError = async () => {
        this.modalerror.show();
    }

    showModalCampo = async () => {
        this.modalCampo.show();
    }

    showModalFaltaCampo = async () => {
        this.modalerror.show();
    }

    hideModalError = async () => {
        this.modalerror.hide();
        this.modal.hide();
        this.resetForm();
    }

    hideModalExito = async () => {
        this.modalexito.hide();
        this.resetForm();
        this.reset();
    }

    hideModalCampo = async () => {
        this.modalCampo.hide();

    }


    showModalExito = () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modal.hide()
        this.modalexito.show();
    }

    load = async () => {
        const form = this.dom.querySelector("#biblioteca #modal #form");
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

    resetForm = () => {
        var formulario = this.dom.querySelector("#biblioteca #modal #form");
        formulario.reset();
        const tituloLegend = document.getElementById('titulolegend');
        const descripcionLegend = document.getElementById('descripcionlegend');
        const fechaLegend = document.getElementById('fechalegend');
        const prioridadLegend = document.getElementById('prioridadlegend');
        const fuenteLegend = document.getElementById('fuentelegend');
        const enlaceLegend = document.getElementById('enlacelegend');

        tituloLegend.style.color = 'black';
        descripcionLegend.style.color = 'black';
        fechaLegend.style.color = 'black';
        prioridadLegend.style.color = 'black';
        fuenteLegend.style.color = 'black';
        enlaceLegend.style.color = 'black';

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
        if(this.verificarCamposLlenados()){
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
                    this.showModalError()
                    return;
                }
                else{
                    //this.addImage();
                    this.showModalExito();
                    return;
                }
            } catch (e) {
                alert(e);
            }
        }
        else{
        }
    }


    addImage = async() => {
        const backend = 'http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae';
        var data = new FormData();
        data.append("imagen", document.querySelector("#biblioteca #modal #form #imagen").files[0]);
        let request = new Request(backend + '/NoticiasExternas/' + this.entity.titulo + '/imagen', {method: 'POST', body: data});
        const response = await fetch(request);
        if (!response.ok) {
            alert("Error al guardar imagen");
            return;
        }
    }


    emptyEntity = () => {
        var entity = '';
        return entity;
    }

    reset = () => {
        this.state.entity = this.emptyEntity();
    }

}

