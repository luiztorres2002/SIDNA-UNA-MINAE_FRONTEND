class Biblioteca {

    dom;

    modal;

    state;

    deleteEntity;

    modalerror;

    modalCampo;

    modalexito;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A', noticias: []};
        this.dom = this.render();
        this.entidad = {};
        this.deleteEntity = " ";
        const self = this;
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.modalerror = new bootstrap.Modal(this.dom.querySelector('#modalError'));
        this.modalexito = new bootstrap.Modal(this.dom.querySelector('#sucessmodal'));
        this.modalCampo = new bootstrap.Modal(this.dom.querySelector('#modalcampo'));
        this.modalBorrar = new bootstrap.Modal(this.dom.querySelector('#modalborrar'));
        this.modalErrorBorrar = new bootstrap.Modal(this.dom.querySelector('#modalErrorBorrar'))
        this.modalSuccessBorrar = new bootstrap.Modal(this.dom.querySelector('#sucessBorrar'))
        this.dom.querySelector("#biblioteca #agregar").addEventListener('click', this.createNew);
        this.dom.querySelector("#biblioteca #modal #apply").addEventListener('click', this.add);
        this.dom.querySelector("#biblioteca #modal #cancelModal").addEventListener('click', this.hidemodal);
        this.dom.querySelector("#biblioteca #modalError #dismissButton").addEventListener('click', this.hideModalError);
        this.dom.querySelector("#biblioteca #sucessmodal #sucessbuton").addEventListener('click', this.hideModalExito);
        this.dom.querySelector("#biblioteca #modalcampo #dismisscampo").addEventListener('click', this.hideModalCampo);
        this.dom.querySelector("#biblioteca #modalborrar #cancelarb").addEventListener('click', this.hideModalBorrar);
        this.dom.querySelector("#biblioteca #modalborrar #confirmarb").addEventListener('click', this.deleteNoticia);
        this.dom.querySelector("#biblioteca #sucessBorrar #sucessbuton").addEventListener('click', this.hideModalBorrarSuccess)
        this.dom.querySelector("#biblioteca #modalborrar #cancelModal").addEventListener('click', this.hideModalBorrar)
        this.cargarBiblioteca();
        const enlaceInput = this.dom.querySelector("#biblioteca #modal #enlace");
        enlaceInput.addEventListener('input', () => {
            const url = enlaceInput.value;
            this.solicitarDatos(url);
        });

    }

    async  procesarRespuesta(response) {
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const ogTitle = doc.querySelector('meta[property="og:title"]');
            const title = ogTitle ? ogTitle.getAttribute('content') : '';

            const ogDescription = doc.querySelector('meta[property="og:description"]');
            const description = ogDescription ? ogDescription.getAttribute('content') : '';

            const ogSiteName = doc.querySelector('meta[property="og:site_name"]');
            const fuente = ogSiteName ? ogSiteName.getAttribute('content') : '';

            const titulo = document.getElementById('titulo');
            const descrip = document.getElementById('descripcion');
            const fuent = document.getElementById('fuente');
            const dia = document.getElementById('dia');
            const mes = document.getElementById('mes');
            const anio = document.getElementById('anio');
            const prioridad = document.getElementById('prioridad');

            document.getElementById('titulo').value = title;
            document.getElementById('descripcion').value = description;
            document.getElementById('fuente').value = fuente;
            titulo.removeAttribute('disabled');
            descrip.removeAttribute('disabled');
            fuent.removeAttribute('disabled');
            dia.removeAttribute('disabled');
            mes.removeAttribute('disabled');
            anio.removeAttribute('disabled');
            prioridad.removeAttribute('disabled');
        } else {
            console.error('Error al obtener los datos');
        }
    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
            ${this.renderModalError()}
            ${this.renderModalSuccess()}
            ${this.renderModalCampo()}
            ${this.renderModalBorrar()}
            ${this.renderModalErrorBorrar()}
            ${this.renderModalSuccessBorrar()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'biblioteca';
        rootContent.innerHTML = html;
        return rootContent;
    }
  async solicitarDatos(url) {
        const proxyUrl1 = `${backend}/proxy?url=`;
        const proxyUrl2 = 'https://corsproxy.io/?';

        try {
            const response1 = await fetch(proxyUrl2 + url);
            if (!response1.ok) {

                const response2 = await fetch(proxyUrl1 + url);
                this.procesarRespuesta(response2);
            } else {
                this.procesarRespuesta(response1);
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }

    renderBody = () => {
        return `
         <div class="linea-azul"></div>
        <div class="linea-amarilla"></div>
        <div class="linea-verde"></div>
                   <div class="container justify-content-center" style="text-align: center; font-family: Verdana; font-size: 32px;"> 
                           Biblioteca Personal
                        </div>
                    <div class="d-flex justify-content-center">
                            <form id="form" style="width: 85%;"">
                           <div class="input-group  mt-10" style="display: flex; align-items: center; justify-content: center;">
                    <div class="btn-group me-2">
                <button type="button" class="btn btn-custom-outline-success" id="agregar" style="height: 40px; width: 190px; line-height: 5px;"><span class="font-weight-bold">+</span> <span class="texto-agregar">Agregar Noticia</span></button>
                    </div>
                   <select id="tiempoSeleccionado2" style="border: none; width: 110px; margin-left: 115px";>
                    <option value="" selected disabled>Prioridad</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
                <select id="tiempoSeleccionado2" style="border: none; width: 90px; margin-left: 20px";>
                    <option value="" selected disabled>Fecha</option>
                    <option value="ultimaHora">Última Hora</option>
                    <option value="ultimoDia">Último Día</option>
                    <option value="ultimaSemana">Última Semana</option>
                    <option value="ultimoMes">Último Mes</option>
                    <option value="ultimoAno">Último Año</option>
                </select>
                   <input class="form-control me-2 fontAwesome" id="buscadorEtiqueta" autocomplete="off" type="text" style="width: 100px; margin-left: 200px; height: 38px; border-radius: 5px; border: 1px solid #1c2858;" placeholder="&#xf002; Buscar..."> 
                    <div class="btn-group me-2">
                         <button type="button" class="btn btn-custom-outline-success" id="buscar" style="height: 40px; line-height: 5px; width: 70px; margin-left: 50px;">
                            <i class="fas fa-search"></i>
                         </button>
                    </div>
                </div>
                <select id="tiempoSeleccionadoMobile" style="border: none; width: 110px; margin-left: 115px; display: none">
                    <option value="" selected disabled>Prioridad</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                </select>
                <select id="tiempoSeleccionadoMobile" style="border: none; width: 90px; margin-left: 20px; display: none">
                    <option value="" selected disabled>Fecha</option>
                    <option value="ultimaHora">Última Hora</option>
                    <option value="ultimoDia">Último Día</option>
                    <option value="ultimaSemana">Última Semana</option>
                    <option value="ultimoMes">Último Mes</option>
                    <option value="ultimoAno">Último Año</option>
                </select>
                
                <div id="pillsMobile-container" class="pill-container"></div>
                <div class="search-results-container">
                    <div id="noticiasBiblioteca"></div> 
                    <div class="d-flex justify-content-center">
                   
                    </div>
                </div>
                </div>
            </form>
        
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
                <h4 class="mt-4 text-center"> Ingreso de noticia de medio externo</h4>
                <form id="form">
                <div class="container">
                    <div class="form-group">
                        <legend id="titulolegend" class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 22px; font-family: Verdana">
                            <i class="fas fa-newspaper mr-2"></i> Título:
                        </legend>
                        <input type="text" class="form-control col-md-12  mborder border-dark" autocomplete="off" id="titulo" name="titulo" style="font-size: 20px;" disabled>
                    </div>
                    </div>
                    <div class="container">
                    <div class="form-group">
                        <legend id="descripcionlegend" class="col-form-label col-sm-4 pt-0 align-items-center d-flex" style="font-size: 25px; padding-left: 10px; font-family: Verdana">
                            <i class="fas fa-file-alt mr-2"></i> Descripción:
                        </legend>
                        <textarea type="text" class="form-control col-md-12 border-dark" style="font-size: 20px ;" id="descripcion" name="descripcion" rows="3" disabled></textarea>
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
            <input type="text" class="form-control border border-dark" autocomplete="off" id="dia" name="dia" style="font-size: 20px; padding: 10px;" placeholder="Día" disabled>
          </div>
          <div class="col">
            <select class="form-select border border-dark dropup" id="mes" name="mes" style="font-size: 20px; padding: 10px;" disabled>
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
            <input type="text" class="form-control border border-dark" autocomplete="off" id="anio" name="anio" style="font-size: 20px; padding: 10px;" placeholder="Año" disabled>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6">
      <div class="form-group">
        <legend id="prioridadlegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="fas fa-exclamation-triangle mr-2"></i> Prioridad
        </legend>
        <select class="form-select border border-dark mt-2" id="prioridad" name="prioridad" style="font-size: 20px; padding: 10px;" disabled>
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
        <input type="text" class="form-control border border-dark"  autocomplete="off" id="fuente" name="fuente" style="font-size: 20px;" disabled>
      </div>
    </div>
    <div class="col-md-6">
      <div class="form-group">
        <legend id="enlacelegend" class="col-form-label pt-0 align-items-center d-flex" style="font-size: 22px; padding-left: 10px; font-family: Verdana">
          <i class="fas fa-link mr-2"></i> Enlace
        </legend>
        <input type="text" class="form-control border border-dark" autocomplete="off" id="enlace" name="enlace" style="font-size: 20px;">
      </div>
    </div>
  </div>
</div>
                    <div class="container bg-light">
                            <div class="col-md-12 mt-4 text-center">
                                 <button type="button" style="font-size: 23px; margin-top: 40px; margin-bottom: 20px; background-color: #1c2858;" id="apply" class="btn btn-primary mt-3">Ingresar Noticia</button>
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
            <button class="btn btn-success btn-block" id="dismissButton" data-dismiss="modal">Salir del form</button>
                </div>
            </div>
            </div>
        </div>  
        `;
    }

    renderModalErrorBorrar = () => {
        return `
<div id="modalErrorBorrar" class="modal fade">
          <div class="modal-dialog modal-error">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">warning</i>
                    </div>
                    <h4 class="modal-title w-100">¡Ooops!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">La eliminación de la noticia no se ha realizado con éxito.</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="dismissButton" data-dismiss="modal">Regresar al form</button>
                </div>
            </div>
            </div>
        </div>  

    
        `;
    }

    renderModalSuccessBorrar = () => {
        return `
    <div id="sucessBorrar" class="modal fade">
      <div class="modal-dialog modal-confirm">
        <div class="modal-content">
            <div class="modal-header">
                <div class="icon-box">
                    <i class="material-icons">&#xE876;</i>
                </div>
                <h4 class="modal-title w-100">¡Confirmado!</h4>
            </div>
            <div class="modal-body">
                <p style="font-size: 25px;" class="text-center">La noticia ha sido eliminada de tu biblioteca con éxito.</p>
            </div>
            <div class="modal-footer mt-3 text-center"> <!-- Ajusta el margen superior y alinea el botón al centro -->
                <button class="btn btn-success btn-block" id="sucessbuton" data-dismiss="modal">OK</button>
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

    renderModalBorrar = () => {
        return `
        <div id="modalborrar" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" id="cancelModal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
                            <span aria-hidden="true" class="ion-ios-close"></span>
                        </button>
                    </div>
                    <div class="modal-body p-4 py-5 p-md-5">
                        <div class="text-center">
                            <img src="images/Minae.png" class="w-50 mx-auto d-block mb-4" alt="...">

                        </div>
                        <h4 class="text-center mb-2 mt-2">¿Estás seguro de que deseas eliminar esta noticia de tu biblioteca? </h4>
                       
                       
                        <ul class="ftco-footer-social p-0 text-center">
                        </ul>
                         
                        <form action="#" id="formmarcar" class="signup-form">
                            <div class="btn-group mt-4 d-flex justify-content-center">
                                <button type="submit" id="confirmarb" class="btn btn-outline-primary rounded submit ml-4 mr-3">Confirmar</button>
                                <button type="button" id="cancelarb" class="btn btn-outline-secondary rounded submit">Cancelar</button>
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
        const regexEnlace = /^(https?:\/\/).+/i;

        const tituloLegend = document.getElementById('titulolegend');
        const descripcionLegend = document.getElementById('descripcionlegend');
        const fechaLegend = document.getElementById('fechalegend');
        const prioridadLegend = document.getElementById('prioridadlegend');
        const fuenteLegend = document.getElementById('fuentelegend');
        const enlaceLegend = document.getElementById('enlacelegend');

        tituloLegend.style.color = 'black';
        tituloLegend.style.textDecoration = 'none';
        descripcionLegend.style.color = 'black';
        descripcionLegend.style.textDecoration = 'none';
        fechaLegend.style.color = 'black';
        fechaLegend.style.textDecoration = 'none';
        prioridadLegend.style.color = 'black';
        prioridadLegend.style.textDecoration = 'none';
        fuenteLegend.style.color = 'black';
        fuenteLegend.style.textDecoration = 'none';
        enlaceLegend.style.color = 'black';
        enlaceLegend.style.textDecoration = 'none';

        if (titulo.trim() === '') {
            tituloLegend.style.color = 'red';
            tituloLegend.style.textDecoration = 'underline';
            tituloLegend.title = 'Debes ingresar un título';
        }

        if (descripcion.trim() === '') {
            descripcionLegend.style.color = 'red';
            descripcionLegend.style.textDecoration = 'underline';
            descripcionLegend.title = 'Debes ingresar una descripción de la noticia';
        }

        if (mes.trim() === '' || mes.trim() === 'Mes') {
            fechaLegend.style.color = 'red';
            fechaLegend.style.textDecoration = 'underline';
            fechaLegend.title = 'Elige un mes válido';
        }

        if (dia.trim() === '' || parseInt(dia) < 1 || parseInt(dia) > 31) {
            fechaLegend.style.color = 'red';
            fechaLegend.style.textDecoration = 'underline';
            fechaLegend.title = 'Ingresa un valor dentro del rango de los días (1-31)';
        }

        if (prioridad.trim() === '') {
            prioridadLegend.style.color = 'red';
            prioridadLegend.style.textDecoration = 'underline';
            prioridadLegend.title = 'Ingresa una prioridad válida';
        }

        if (fuente.trim() === '') {
            fuenteLegend.style.color = 'red';
            fuenteLegend.style.textDecoration = 'underline';
            fuenteLegend.title = 'Ingresa una fuente válida';
        }

        if (!regexEnlace.test(enlace)) {
            enlaceLegend.style.color = 'red';
            enlaceLegend.style.textDecoration = 'underline';
            enlaceLegend.title = 'Ingresa un enlace válido (debe comenzar con http:// o https://)';
        }

        if (!regexAnio.test(anio)) {
            fechaLegend.style.color = 'red';
            fechaLegend.style.textDecoration = 'underline';
            fechaLegend.title = 'Ingresa un año válido';
        }

        // Verificar si alguno de los campos está vacío
        if (
            titulo.trim() === '' ||
            descripcion.trim() === '' ||
            anio.trim() === '' ||
            mes.trim() === '' ||
            dia.trim() === '' ||
            prioridad.trim() === '' ||
            fuente.trim() === '' ||
            enlace.trim() === '' || !regexEnlace.test(enlace) || !regexAnio.test(anio) || parseInt(dia) < 1 || parseInt(dia) > 31

        ) {
            this.showModalCampo();
            return false;
        }

        return true;
    }
    renderizarNoticias = () => {
        const bordeColores = ['#1c2858', '#cdab68'];

        const noticiasCoincidentes = document.getElementById('noticiasBiblioteca');
        noticiasCoincidentes.innerHTML = '';

        for (const [index, noticia] of this.state.noticias.entries()) {
            const {id, titulo, descripcion, prioridad, fuente, enlace, imagen, fechaGuardado, fecha} = noticia;
            const idNoticia = noticia.id;
            const etiquetas = noticia.etiquetas;
            const fechaDate = new Date(fechaGuardado);
            const fechaFormateada = fechaDate.toLocaleDateString();
            const colorBorde = bordeColores[index % bordeColores.length];
            const elementoNoticiaCoincidente = document.createElement('div');
            elementoNoticiaCoincidente.classList.add('noticiaBiblioteca');

            elementoNoticiaCoincidente.innerHTML = `
        <div class="card bg-dark-subtle mt-4" style="border: 2px solid ${colorBorde};" data-link="${enlace}">
            <img src="${imagen}" class="card-img-top card-img-custom" alt="Imagen Previo" onerror="this.onerror=null; this.src='${imagen}'; this.classList.add('card-img-top', 'card-img-custom');">
            <div class="card-body">
                <div class="text-section-Biblioteca">
                    <h5 class="card-title fw-bold">${id} ${titulo}</h5>
                     <p class="card-text descripcion">${descripcion}</p>
                    <div class="pill-container"></div> 
                </div>
                <div class="cta-section">
                    <p class="card-text" >${fechaFormateada}</p>
                    <div class="semaforoModal2">
                        <input type="radio" name="prioridad-${index}" class="AltaModal2" value="Alta" ${prioridad === 'Alta' ? 'checked' : ''}>
                        <input type="radio" name="prioridad-${index}" class="MediaModal2" value="Media" ${prioridad === 'Media' ? 'checked' : ''}>
                        <input type="radio" name="prioridad-${index}" class="BajaModal2" value="Baja" ${prioridad === 'Baja' ? 'checked' : ''}>
                    </div>
                    <div class="c-btn-group">
                        <button class="borrar-container">
                             <i class="fas fa-trash-can" id="borrarBtn" style="font-size: 1.3em; margin-top: 9px; border: none; color: red;"></i>
                        </button>
                        <a href="${enlace}" id="enlaceBtn2" class="btn" target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" title="${fuente}" style="margin-bottom: 6px;">
                            <i class="fas fa-share" style="font-size: 1.5em; color: ${colorBorde};"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

            noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);
            const botoneseliminar = noticiasCoincidentes.querySelectorAll("button.borrar-container");

            botoneseliminar.forEach((button, colorIndex) => {
                button.addEventListener('click', () => {
                    const idd = this.state.noticias[colorIndex].id;
                    this.showModalBorrar(idd);
                });
            });

            const pillsContainer1 = elementoNoticiaCoincidente.querySelector(".pill-container");
            etiquetas.forEach((etiqueta) => {
                const pill = document.createElement("div");
                pill.className = "pillBiblioteca";
                pill.innerHTML = `
            <span class="pill-text">${etiqueta.descripcion}</span>
`;
                pill.style.backgroundColor = colorBorde;
                pillsContainer1.appendChild(pill);
            });
        }
    };

    cargarBiblioteca = async () => {
        try {
            const response = await fetch(`${backend}/NoticiasMarcadas/4-0258-0085`);
            const data = await response.json();
            this.state.noticias = data.reverse();
            this.renderizarNoticias();
        } catch (error) {
            console.log('Error al cargar la lista de noticias:', error);
        }
    }

    showModal = async () => {
        this.resetForm();
        const titulo = document.getElementById('titulo');
        const descrip = document.getElementById('descripcion');
        const fuent =  document.getElementById('fuente');
        const dia =document.getElementById('dia');
        const mes =document.getElementById('mes');
        const anio =document.getElementById('anio');
        const prioridad =document.getElementById('prioridad');
        titulo.setAttribute('disabled', 'disabled');
        descrip.setAttribute('disabled', 'disabled');
        fuent.setAttribute('disabled', 'disabled');
        dia.setAttribute('disabled', 'disabled');
        mes.setAttribute('disabled', 'disabled');
        anio.setAttribute('disabled', 'disabled');
        prioridad.setAttribute('disabled', 'disabled');
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

    showModalBorrar  = (idd) => {
        event.preventDefault();
        this.deleteEntity = " ";
        this.deleteEntity = idd;
        this.modalBorrar.show();
    }

    showModalErrorBorrar = async () => {
        this.modalErrorBorrar.show();
    }

    showModalSuccessBorrar = async () => {
        this.modalSuccessBorrar.show();
    }

    hideModalBorrarSuccess = async () => {
        this.modalSuccessBorrar.hide();
        this.cargarBiblioteca();
    }

    hideModalError = async () => {
        this.modalerror.hide();
        this.modal.show();
    }

    hideModalBorrar = async () => {
        this.modalBorrar.hide();

    }

    hideModalExito = async () => {
        this.modalexito.hide();
        this.resetForm();
        this.reset();
    }

    hideModalCampo = async () => {
        this.modalCampo.hide();

    }

    hidemodal = () => {

        this.modal.hide();
        this.modal.resetForm();
        this.reset();
    }


    showModalExito = () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modal.hide();
        this.modalexito.show();
    }

    obtenerNumeroDeMes = async (nombreMes) => {
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

    add = async () => {
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

        if (diaa == '1') {
            diaa = '01';
        }
        if (diaa == '2') {
            diaa = '02';
        }
        if (diaa == '3') {
            diaa = '03';
        }
        if (diaa == '4') {
            diaa = '04';
        }
        if (diaa == '5') {
            diaa = '05';
        }
        if (diaa == '6') {
            diaa = '06';
        }
        if (diaa == '7') {
            diaa = '07';
        }
        if (diaa == '8') {
            diaa = '08';
        }
        if (diaa == '9') {
            diaa = '09';
        }

        this.entity["fecha"] = anio + "-" + mes + "-" + diaa;

        delete this.entity['dia'];
        delete this.entity['mes'];
        delete this.entity['anio'];
        let imageUrl = "";
        const enlace = document.getElementById('enlace').value;
        if (this.verificarCamposLlenados()) {
            try {
                const proxyUrl1 = `${backend}/proxy?url=`;
                const proxyUrl2 = 'https://corsproxy.io/?';

                const newsResponse1 = await fetch(proxyUrl1 + enlace);
                const newsHtml1 = await newsResponse1.text();
                const newsDocument1 = new DOMParser().parseFromString(newsHtml1, 'text/html');
                const ogImage1 = newsDocument1.querySelector('meta[property="og:image"]');

                if (ogImage1) {
                    imageUrl = ogImage1.getAttribute('content');
                } else {
                    const newsResponse2 = await fetch(proxyUrl2 + enlace);
                    const newsHtml2 = await newsResponse2.text();
                    const newsDocument2 = new DOMParser().parseFromString(newsHtml2, 'text/html');
                    const ogImage2 = newsDocument2.querySelector('meta[property="og:image"]');

                    if (ogImage2) {

                        imageUrl = ogImage2.getAttribute('content');
                    } else {
                        console.error('No se pudo encontrar una imagen en ninguno de los proxies.');
                    }
                }

                this.entity['imagen'] = imageUrl;

            } catch (error) {
                console.error('Error al obtener datos de noticia', error);
            }

            let descripciones = ["Noticia Externa"];
            this.entidad['id'] = '1';
            this.entidad['titulo'] = this.entity.titulo;
            this.entidad['descripcion'] = this.entity.descripcion;
            this.entidad['fecha'] = this.entity.fecha;
            this.entidad['prioridad'] = this.entity.prioridad;
            this.entidad['fuente'] = this.entity.fuente;
            this.entidad['enlace'] = document.getElementById('enlace').value;
            this.entidad['fechaGuardado'] = '2023-10-09';
            this.entidad['usuarioCedula'] = '1';
            this.entidad['imagen'] = imageUrl;
            const etiquetasDescripcion = [];
            descripciones.forEach(descripcion => {
                etiquetasDescripcion.push({descripcion});
            });
            this.entidad['etiquetas'] = etiquetasDescripcion;
            const request2 = new Request(`${backend}/NoticiasMarcadas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.entidad)
            });
            console.log(this.entidad);
            try {
                const response = await fetch(request2);
                if (!response.ok) {
                    this.showModalError()
                    return;
                } else {
                    this.cargarBiblioteca();
                    this.showModalExito();
                    return;
                }
            } catch (e) {
                alert(e);
            }
        } else {
        }

    }


    emptyEntity = () => {
        var entity = '';
        return entity;
    }

    reset = () => {
        this.state.entity = this.emptyEntity();
    }



    deleteNoticia = async() => {
        event.preventDefault();
        const entityId = this.deleteEntity;
        const request = new Request(`${backend}/NoticiasMarcadas/EtiquetasExternaDelete/${entityId}`, { // Cambiar a enviar el parámetro como parte de la ruta
            method: 'POST', // Cambiar el método a POST
            headers: {
                'Content-Type': 'application/json'
            }
        });

        try {
            const response = await fetch(request);

            if (response.ok) {

                const cedula = "4-0258-0085";
                const request2 = new Request(`${backend}/NoticiasMarcadas/ExternaDelete/${entityId}/${cedula}`, { // Cambiar a enviar el parámetro como parte de la ruta
                    method: 'POST', // Cambiar el método a POST
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                try{

                    const response2 = await fetch(request2);
                        if (response2.ok) {
                            this.hideModalBorrar();
                            this.showModalSuccessBorrar();
                        }
                        else{
                            this.hideModalBorrar();
                            this.showModalErrorBorrar();
                        }
                }catch (error){
                    console.error("Error al eliminar la entidad:", error);
                }
            } else {
                this.showModalErrorBorrar();
            }
        } catch (error) {
            console.error("Error al eliminar la entidad:", error);
        }
    }

}
