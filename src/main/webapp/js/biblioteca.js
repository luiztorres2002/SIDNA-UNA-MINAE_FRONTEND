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
        this.dom.querySelector("#biblioteca #modal #apply").addEventListener('click', this.add);
        this.dom.querySelector("#biblioteca #modal #cancelModal").addEventListener('click', this.hidemodal);
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
         
        <div class="container">
    <h1 class="mt-5 text-center">Biblioteca de usuario</h1>

    <form id="form">
        <div class="input-group mt-3">
            <input class="form-control fontAwesome rounded" id="buscadorB" autocomplete="off" type="text" placeholder="&#xf002; Buscar Noticia">
        </div>
        <div class="container">
        <div class="btn-group mt-3" style="margin-left: 0px;">
            <button type="button" class="btn btn-custom-outline-success" id="agregar" style="height: 40px; color:white; background-color: #84bd00; width: 190px; line-height: 5px; margin-top: 4px;">
                <span class="font-weight-bold">+</span> <span class="texto-agregar">Agregar Noticia</span>
            </button>
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
                <button type="button" id = "cancelModal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
  <span aria-hidden="true" class="ion-ios-close"></span>
</button>

            </div>
            <div class="modal-body p-4 py-3 p-md-3">

                <img src="images/Minae.png" class="w-50 mx-auto d-block" alt="...">
                <ul class="ftco-footer-social p-0 text-center"></ul>
                <h4 class="mt-4 text-center"> Ingreso de noticia Externa</h4>
                <form id="form">
                <div class="container">
                    <div class="form-group">
                        <legend id="titulolegend" class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; font-family: Verdana">
                            <i class="fas fa-newspaper mr-2"></i> Título:
                        </legend>
                        <input type="text" class="form-control col-md-12  mborder border-dark" id="titulo" name="titulo" style="font-size: 20px;">
                    </div>
                    </div>
                    <div class="container">
                    <div class="form-group">
                        <legend id="descripcionlegend" class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 25px; padding-left: 10px; font-family: Verdana">
                            <i class="fas fa-file-alt mr-2"></i> Descripción:
                        </legend>
                        <textarea type="text" class="form-control col-md-12 border-dark" style="font-size: 20px ;" id="descripcion" name="descripcion" rows="3"></textarea>
                    </div>
                   
                    </div>
<div class="container">
  <div class="row">
   <div class="col-md-6">
      <div class="form-group">
        <legend id="fechalegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="far fa-calendar-alt mr-2"></i> Fecha de redacción
        </legend>
        <div class="row">
          <div class="col">
            <input type="text" class="form-control border border-dark" id="dia" name="dia" style="font-size: 20px; padding: 10px;" placeholder="Día">
          </div>
          <div class="col">
            <select class="form-select border border-dark dropup" id="mes" name="mes" style="font-size: 20px; padding: 10px;">
              <option value="" disabled selected hidden>Mes</option>
              <option>Enero</option>
              <option>Febrero</option>
              <option>Marzo</option>
              <option>Abril</option>
              <option>Mayo</option>
              <option>Junio</option>
              <option>Julio</option>
              <option>Agosto</option>
              <option>Septiembre</option>
              <option>Octubre</option>
              <option>Noviembre</option>
              <option>Diciembre</option>
            </select>
          </div>
          <div class="col">
            <input type="text" class="form-control border border-dark" id="anio" name="anio" style="font-size: 20px; padding: 10px;" placeholder="Año">
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6">
      <div class="form-group">
        <legend id="prioridadlegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="fas fa-exclamation-triangle mr-2"></i> Prioridad
        </legend>
        <select class="form-select border border-dark mt-2" id="prioridad" name="prioridad" style="font-size: 20px; padding: 10px;">
          <option>Alta</option>
          <option>Media</option>
          <option selected>Baja</option>
        </select>
      </div>
    </div>
  </div>
</div>




                    <div class="container">
  <div class="row">
    <div class="col-md-6">
      <div class="form-group">
        <legend id="fuentelegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="fas fa-info-circle mr-2"></i> Fuente
        </legend>
        <input type="text" class="form-control border border-dark" id="fuente" name="fuente" style="font-size: 20px;">
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group">
        <legend id="enlacelegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="fas fa-link mr-2"></i> Enlace
        </legend>
        <input type="text" class="form-control border border-dark" id="enlace" name="enlace" style="font-size: 20px;">
      </div>
    </div>
  </div>
</div>



                    <div class="container bg-light">
                            <div class="col-md-12 mt-4 text-center">
                                 <button type="button" style="font-size: 23px; margin-top: 40px; margin-bottom: 20px; background-color: #006ba6;" id="apply" class="btn btn-primary mt-3">Ingresar Noticia</button>
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
          <div class="modal-dialog modal-error">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">warning</i>
                    </div>
                    <h4 class="modal-title w-100">¡Ooops!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">Verifica si la noticia está duplicada o los datos son incorrectos.</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="dismissButton" data-dismiss="modal">Regresar al form</button>
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
        const prioridad = document.getElementById('prioridad').value;
        const fuente = document.getElementById('fuente').value;
        const enlace = document.getElementById('enlace').value;
        const dia = document.getElementById('dia').value;
        const mes = document.getElementById('mes').value;
        const anio = document.getElementById('anio').value;
        const regexAnio = /^\d{4}$/;

        const tituloLegend = document.getElementById('titulolegend');
        const descripcionLegend = document.getElementById('descripcionlegend');
        const fechaLegend = document.getElementById('fechalegend');
        const prioridadLegend = document.getElementById('prioridadlegend');
        const fuenteLegend = document.getElementById('fuentelegend');
        const enlaceLegend = document.getElementById('enlacelegend');

        if (titulo.trim() === '') {
            tituloLegend.style.color = 'red';
            tituloLegend.style.textDecoration = 'underline';
            tituloLegend.title = 'Debes de ingresar un titulo';
        }
        else{
            tituloLegend.style.color = 'black';
            tituloLegend.style.textDecoration = 'none';
        }

        if (descripcion.trim() === '') {
            descripcionLegend.style.color = 'red';
            descripcionLegend.style.textDecoration = 'underline';
            descripcionLegend.title = 'Debes de ingresar una descripcion de la noticia';
        }
        else{
            descripcionLegend.style.color = 'black';
            descripcionLegend.style.textDecoration = 'none';
        }

        if(mes.trim() === '' || mes.trim() === 'Mes'){
            fechaLegend.style.color = 'red';
            fechaLegend.style.textDecoration = 'underline';
            fechaLegend.title = 'Eliga un mes valido';
        } else{
            fechaLegend.style.color = 'black';
            fechaLegend.style.textDecoration = 'none';
        }

        if(dia.trim() === '' || dia.trim() === 'dia'){
            fechaLegend.style.color = 'red';
            fechaLegend.style.color = 'red';
            fechaLegend.title = 'Ingrese un valor dentro del rango de los dias (1-31)';
        }else{
            fechaLegend.style.textDecoration = 'none';
            fechaLegend.style.color = 'black';
        }

        if (prioridad.trim() === '') {
            prioridadLegend.style.color = 'red';
            prioridadLegend.style.textDecoration = 'underline';
            prioridadLegend.title = 'Ingrese una prioridad validad';
        }
        else{
            prioridadLegend.style.color = 'black';
            prioridadLegend.style.textDecoration = 'none';
        }

        if (fuente.trim() === '') {
            fuenteLegend.style.color = 'red';
            fuenteLegend.style.textDecoration = 'underline';
            fuenteLegend.title = 'Ingrese una fuente valida';
        }
        else{
            fuenteLegend.style.color = 'black';
            fuenteLegend.style.textDecoration = 'none';
        }

        if (enlace.trim() === '') {
            enlaceLegend.style.color = 'red';
            enlaceLegend.style.textDecoration = 'underline';
            enlaceLegend.title = 'Ingrese un enlace que sea valido (www.ejemplo.com)'
        }
        else{
            enlaceLegend.style.color = 'black';
            enlaceLegend.style.textDecoration = 'none';
        }
        if (!regexAnio.test(anio)) {
            // Si el año no coincide con el formato válido (4 dígitos), muestra un mensaje de error
            // y aplica un estilo de subrayado y color rojo al campo de año.
            fechaLegend.style.color = 'red';
            fechaLegend.style.textDecoration = 'underline';
            fechaLegend.title= 'Ingrese un año valido';
        } else {
            // Si el año es válido, restaura el estilo original.
            fechaLegend.style.color = 'black';
            fechaLegend.style.textDecoration = 'none';
        }

        // Verificar si alguno de los campos está vacío
        if (
            titulo.trim() === '' ||
            descripcion.trim() === '' || anio.trim() === '',
            mes.trim() === '' || dia.trim() == '' || !regexAnio.test(anio) ||
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
        this.modal.hide();
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
        this.modal.show();
    }

    hideModalExito = async () => {
        this.modalexito.hide();
        this.resetForm();
        this.reset();
    }

    hideModalCampo = async () => {
        this.modalCampo.hide();

    }

    hidemodal = () =>{

        this.modal.hide();
        this.modal.resetForm();
        this.reset();
    }


    showModalExito = () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modal.hide();
        this.modalexito.show();
    }

    obtenerNumeroDeMes = async(nombreMes) => {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        // Busca el índice del nombre del mes en el array de meses
        const indice = meses.indexOf(nombreMes);

        // Si se encuentra el nombre del mes, devuelve su número (1 al 12)
        // Si no se encuentra, devuelve -1 como valor predeterminado para indicar que no se encontró
        if (indice !== -1) {
            return indice + 1; // Agregamos 1 porque los meses comienzan desde 1 en lugar de 0
        } else {
            return -1;
        }
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
        const dia = this.entity['dia'];
        const anio = this.entity['anio'];
        const m = this.entity['mes'];
        let mes = null;

        if (m === 'Enero') {
            mes = '01';
        } else if (m === 'Febrero') {
            mes = '02';
        } else if (m === 'Marzo') {
            mes = '03';
        } else if (m === 'Abril') {
            mes = '04';
        } else if (m === 'Mayo') {
            mes = '05';
        } else if (m === 'Junio') {
            mes = '06';
        } else if (m === 'Julio') {
            mes = '07';
        } else if (m === 'Agosto') {
            mes = '08';
        } else if (m === 'Septiembre') {
            mes = '09';
        } else if (m === 'Octubre') {
            mes = '10';
        } else if (m === 'Noviembre') {
            mes = '11';
        } else if (m === 'Diciembre') {
            mes = '12';
        }

        let diaa = this.entity['dia'];

        if(diaa == '1'){
            diaa = '01';
        }
        if(diaa == '2'){
            diaa = '02';
        }
        if(diaa == '3'){
            diaa = '03';
        }
        if(diaa == '4'){
            diaa = '04';
        }
        if(diaa == '5'){
            diaa = '05';
        }
        if(diaa == '6'){
            diaa = '06';
        }
        if(diaa == '7'){
            diaa = '07';
        }
        if(diaa == '8'){
            diaa = '08';
        }
        if(diaa == '9'){
            diaa = '09';
        }


        this.entity["fecha"] = anio+"-"+mes+"-"+diaa;

        delete this.entity['dia'];
        delete this.entity['mes'];
        delete this.entity['anio'];

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




    emptyEntity = () => {
        var entity = '';
        return entity;
    }

    reset = () => {
        this.state.entity = this.emptyEntity();
    }

}

