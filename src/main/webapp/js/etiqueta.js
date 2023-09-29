class Etiqueta {

    dom;

    modal;
    modalCampo;
    modalexito;
    modalerror;
    modalCampoEditar;
    modalexitoEditar;
    modalerrorEditar;

    state;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A', etiquetas: []};
        this.cargarEtiquetas();
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.modalerror = new bootstrap.Modal(this.dom.querySelector('#modalError'));
        this.dom.querySelector("#categorias #agregar").addEventListener('click', this.createNew);
        this.dom.querySelector("#categorias #buscar").addEventListener('click', this.search);
        this.modalEditar = new bootstrap.Modal(this.dom.querySelector('#modalEditar'));
        this.modalexitoEditar = new bootstrap.Modal(this.dom.querySelector("#sucessmodalEditar"));
        this.modalCampoEditar = new bootstrap.Modal(this.dom.querySelector("#modalcampoEditar"));
        this.modalerrorEditar = new bootstrap.Modal(this.dom.querySelector("#modalErrorEditar"));
        this.dom.querySelector("#categorias #modalEditar #formEdit #cancel").addEventListener('click', this.cancelarEdit);
        this.dom.querySelector("#categorias #modal #cancelModal").addEventListener('click', this.hidemodal);
        this.dom.querySelector("#etiquetaAgregar").addEventListener('click', () => {
            const descripcion = this.dom.querySelector("#txtNombre").value;
            this.agregarEtiqueta2( descripcion);
        });
        this.dom.querySelector("#categorias #modalEditar #formEdit #save").addEventListener('click', () => {
            const etiquetaId = this.dom.querySelector("#categorias #modalEditar #formEdit #etiquetaId").value;
            const descripcion = this.dom.querySelector("#categorias #modalEditar #formEdit #input").value;
            this.saveEdit(etiquetaId, descripcion);
        });
        this.dom.querySelector("#categorias #modalEditar #close").addEventListener('click', this.cancelarEdit);
        this.dom.querySelector("#categorias #modalErrorEditar #dismissButtonEditar").addEventListener('click', this.hideModalErrorEditar);
        this.dom.querySelector("#categorias #sucessmodalEditar #sucessbutonEdit").addEventListener('click', this.hideModalExitoEditar);
        this.dom.querySelector("#categorias #modalcampoEditar #dismisscampoEditar").addEventListener('click', this.hideModalCampoEditar);

        // this.dom.querySelector("#categorias #modalError #dismissButton").addEventListener('click', this.hideModalError);
        // this.dom.querySelector("#categorias #sucessmodal #sucessbuton").addEventListener('click', this.hideModalExito);
        // this.dom.querySelector("#categorias #modalcampo #dismisscampo").addEventListener('click', this.hideModalCampo);

        const searchInput = this.dom.querySelector("#buscadorEtiqueta");

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.search();
            }
        });


    }

    renderModalConfirmar = () => {
        return `
<div id="confirmationModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
            </div>
            <div class="modal-body">
                <div class="d-flex justify-content- align-items-center mb-3">
                    <h3 class="text-left mb-0">Confirmar</h3>
                    <button class="btn btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"><i class="fa fa-edit fa-lg"></i></button>
                </div>
                <ul class="ftco-footer-social p-0 text-center">
                </ul>
                <p id="etiqueta-description" style="font-size: 1.5em;"></p>
            </div>
            <div class="modal-footer justify-content-lg-start" style="border-top: none;">
                <button id="confirm-si" type="submit" style="background-color: #84bd00" class="rounded text-dark">Aceptar</button>
                <button id="confirm-no" type="submit" style="background-color: white" class="rounded" data-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>
        
    `;

    }
    hidemodal = () =>{

        this.modal.hide();
        this.modal.resetForm();
        this.reset();
    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
            ${this.renderModalEditar()}
            ${this.renderModalSuccess()}
            ${this.renderModalError()}
            ${this.renderModalCampo()}
            ${this.renderModalSuccessEditar()}
            ${this.renderModalConfirmar()}
            ${this.renderModalErrorEditar()}
            ${this.renderModalCampoEditar()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'categorias';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        return `
        <div class="linea-azul"></div>
        <div class="linea-amarilla"></div>
        <div class="linea-verde"></div>
    </div>
   <div class="d-flex justify-content-center">
            <form id="form" style="width: 85%; margin-top: 20px;"">
           <div class="input-group mb-3 mt-10" style="display: flex; align-items: center; justify-content: center;">
    <div class="btn-group me-2">
        <button type="button" class="btn btn-custom-outline-success" id="agregar" style="height: 40px; width: 120px; line-height: 5px;"><span class="font-weight-bold">+</span> <span class="texto-agregar">Agregar</span></button>
    </div>
    <input class="form-control me-2 fontAwesome" id="buscadorEtiqueta" autocomplete="off" type="text" style="width: 200px; margin-left: 700px; height: 38px; border-radius: 5px; border: 1px solid #006ba6;" placeholder="&#xf002; Buscar Etiqueta...">
    <div class="btn-group me-2">
         <button type="button" class="btn btn-custom-outline-success2" id="buscar" style="height: 40px; line-height: 5px; width: 70px; margin-left: 50px;">
            <i class="fas fa-search"></i>
         </button>
    </div>
</div>
<div class="centered-container">
  <div class="d-flex justify-content-center align-items-center">
    <div class="spinner-border" role="status" style="color: #84bd00">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</div>
 <table class="table table-fixed" id="tablaEtiquetas" style="display: none;">
  <thead>
        <tr>
        
            <th class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none">Nombre de Etiqueta</th>
            <th class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></th>
            <th class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none" >Noticias Asociadas</th>
        </tr>
    </thead>
    <tbody id="etiquetasTableBody">
      
</table>
                </div>
            </form>
        </div>

        `;
    }
    load = () => {
        const form = this.dom.querySelector("#categorias #modal #formadd");
        const formData = new FormData(form);
        this.entity = {};
        for (let [key, value] of formData.entries()) {
            this.entity[key] = value;
        }
    }

    agregarEtiqueta = async (etiquetaId, nombre) => {
        this.load();
        const request = new Request(`http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/${etiquetaId}?txtNombre=${nombre}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.entity)
        });
        try {
            const response = await fetch(request);
            if (!response.ok) {
                console.log(this.entity);
                return;
            }
            this.cargarEtiquetas();
            this.renderizarPaginaConEtiquetas();
            this.reset();
            this.resetFormAdd();
            this.modal.hide();
        } catch (e) {
            alert(e);
        }
        event.preventDefault();
    }

    renderizarPaginaConEtiquetas= () => {
        let tableRows = '';

        this.state.etiquetas.forEach((etiqueta, index) => {
            const { descripcion, etiquetaId, estado } = etiqueta;
            const isChecked = estado ? 'checked' : '';
            const row = `
    <tr data-row="${index + 1}">
        <td class="empty" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
            <li class="list-inline-item">
                <button class="editar-etiqueta btn  btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit">
                    <i class="fa fa-edit fa-lg"></i>
                </button>
            </li>
            ${descripcion}
        </td>
        <td class="large" style="border-right:none; border-left:none; border-bottom:none; border-top:none"></td>
        <td class="empty2" style="border-right:none; border-left:none; border-bottom:none; border-top:none">
            <div class="toggle-container">
                <span class="number">10</span>
                <div class="form-check form-switch toggle-switch">
                    <input class="form-check-input unchecked" type="checkbox" role="switch" data-row="${index + 1}"data-etiqueta-descripcion="${descripcion}" data-etiqueta-id="${etiquetaId}" data-etiqueta-estado="${estado}" ${isChecked} style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%2384bd00\\'/></svg>') ">
                    <label class="form-check-label" for="flexSwitchCheckDefault"></label>
                </div>
            </div>
        </td>
    </tr>
    `;
            tableRows += row;
        });

        const tableBody = document.querySelector('#tablaEtiquetas tbody');
        tableBody.innerHTML = tableRows;

        const toggleSwitches2 = this.dom.querySelectorAll(".form-check-input");
        const colors = ["green-bg"];
        toggleSwitches2.forEach((toggleSwitch, index) => {
            const rowNumber = toggleSwitch.getAttribute("data-row");
            const fila = this.dom.querySelector(`[data-row="${rowNumber}"]`);

            toggleSwitch.classList.add(colors);
            fila.classList.toggle("disabled-row", !toggleSwitch.checked);
        });
        const toggleSwitches = this.dom.querySelectorAll(".form-check-input");


        const editarBotones = document.querySelectorAll('.editar-etiqueta');
        editarBotones.forEach((boton, index) => {
            const etiquetaId = this.state.etiquetas[index].etiquetaId;
            const descripcion = this.state.etiquetas[index].descripcion;
            boton.addEventListener('click', () => {
                this.editarEtiqueta(etiquetaId, descripcion);
            });
        });
        toggleSwitches.forEach((toggleSwitch) => {toggleSwitch.addEventListener("change", this.actualizarEstadoFila);});

    }
    renderModalEditar = () => {
        return `
<div id="modalEditar" class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button id="close" type="button" class="close d-flex align-items-center justify-content-center" data-dismiss="modal" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
          <span aria-hidden="true" class="ion-ios-close"></span>
        </button>
      </div>
      <div class="modal-body p-4 py-5 p-md-5">
        <h3 class="text-left mb-3">Editar Etiqueta <button class="btn  btn-sm rounded-0" type="button" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"><i class="fa fa-edit fa-lg"></i></button> </h3>
        <ul class="ftco-footer-social p-0 text-center">
         
        </ul>
        <form action="#" class="signup-form" id="formEdit">
         
          <input type="hidden" id="etiquetaId" name="etiquetaId" value="">
          
          <div class="form-group mb-2">
            <input id="input" type="text" class="form-control" style="border-right-color: white; border-left-color: white; border-top-color: white; border-bottom-color: black">
          </div>

          <div class="form-group mb-2 align-content-lg-end">
            <button id="save" type="submit" style="background-color: #84bd00" class="rounded text-dark">Guardar</button>
            <button id="cancel" type="submit" style="background-color: white" class="rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
`;
    }
    resetFormEditar = () => {
        var form = this.dom.querySelector("#categorias #modalEditar #formEdit");
        form.reset();
    }

    showEditar = (etiquetaId, descripcion) => {
        this.resetFormEditar();
        const inputField = this.dom.querySelector("#categorias #modalEditar #formEdit #etiquetaId");
        const nombreField = this.dom.querySelector("#categorias #modalEditar #formEdit #input");
        inputField.value = etiquetaId;
        nombreField.value = descripcion;

        this.modalEditar.show();
    }

    cancelarEdit = () => {
        event.preventDefault();
        this.modalEditar.hide();
    }

    editarEtiqueta = (etiquetaId, descripcion) => {

        this.showEditar(etiquetaId, descripcion);
        console.log(etiquetaId);
    }


    actualizarEstadoFila = (event) => {
        const toggleSwitch = event.target;
        const numFila = toggleSwitch.getAttribute("data-row");
        const etiquetaNom = toggleSwitch.getAttribute("data-etiqueta-id");
        const etiquetaDescripcion = toggleSwitch.getAttribute("data-etiqueta-descripcion");
        const fila = this.dom.querySelector(`[data-row="${numFila}"]`);
        const colors = ["green-bg"];
        const colorIndex = (numFila - 1) % colors.length;

        const etiquetaId = event.target.getAttribute('data-etiqueta-id');
        const nuevoEstado = event.target.checked;
        const actionMessage = nuevoEstado ? `habilitar` : `deshabilitar`;
        const etiquetaDescriptionElement = document.getElementById('etiqueta-description');
        etiquetaDescriptionElement.textContent = `Esta seguro que desea ${actionMessage} esta etiqueta: ${etiquetaDescripcion}?`;
        let clickFueraModal = false;

        const modalPromise = new Promise((resolve, reject) => {
            $('#confirmationModal').modal('show');

            document.getElementById('confirm-si').addEventListener('click', () => {
                $('#confirmationModal').modal('hide');
                resolve(true);
            });

            document.getElementById('confirm-no').addEventListener('click', () => {
                $('#confirmationModal').modal('hide');
                resolve(false);
            });

            $('#confirmationModal').on('click', (e) => {
                if (e.target === document.getElementById('confirmationModal')) {
                    // Modal closed by clicking outside
                    clickFueraModal = true;
                    $('#confirmationModal').modal('hide');
                    resolve(false);
                }
            });
        });

        modalPromise.then((confirm) => {
            if (confirm && !clickFueraModal) {
                if (nuevoEstado) {
                    fila.classList.remove("disabled-row");
                    fila.classList.remove("highlight");
                    toggleSwitch.classList.remove(...colors);
                    toggleSwitch.classList.add(colors[colorIndex]);
                    console.log(`Se activó la etiqueta: ${etiquetaNom}`);
                    toggleSwitch.classList.remove("unchecked");
                } else {
                    fila.classList.add("disabled-row");
                    fila.classList.remove("highlight");
                    console.log(`Se desactivó la etiqueta: ${etiquetaNom}`);
                    toggleSwitch.classList.add("unchecked");
                }

                this.cambiarEstadoEtiqueta(etiquetaId, nuevoEstado);
            } else {
                toggleSwitch.checked = !nuevoEstado;
            }
        });
    }

    renderModal = () => {
        return `
<div id="modal" class="modal fade" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" id = "cancelModal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
        <span aria-hidden="true" class="ion-ios-close"></span>
        </button>
      </div>
      <div class="modal-body p-4 py-5 p-md-5">
        <h3 class="text-center mb-3">Agregar nueva etiqueta</h3>
        <ul class="ftco-footer-social p-0 text-center">
        </ul>
        <form action="#" id="formadd" class="signup-form">
        <input type="hidden" id="etiquetaId" name="etiquetaId" value="">
         <div class="form-group mb-2">
            <input type="text" id="txtNombre" class="form-control" placeholder="Ingrese texto aquí">
        </div>
          <div class="form-group mb-2">
            <button type="submit" id="etiquetaAgregar" class="form-control btn btn-primary rounded submit px-3">Aceptar</button>
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
    resetFormAdd = () => {
        var formulario = this.dom.querySelector("#categorias #modal #formadd");
        formulario.reset();
    }
    showModal = async () => {

        this.modal.show();
    }
    reset = () => {
        this.state.entity = this.emptyEntity();
    }
    cargarEtiquetas = async () => {
        try {
            const response = await fetch('http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/1');
            const data = await response.json();
            this.state.etiquetas = data;
            this.renderizarPaginaConEtiquetas();
            const loadingSpinner = document.querySelector('.spinner-border');
            loadingSpinner.style.display = 'none';
            const table = document.getElementById('tablaEtiquetas');
            table.style.display = 'table';
        } catch (error) {
            console.log('Error al cargar la lista de etiquetas:', error);
        }
    }

    cambiarEstadoEtiqueta = (etiquetaId, nuevoEstado) => {
        const url = `http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/cambiarEstado/${etiquetaId}/${nuevoEstado}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {

                    console.error(`Error al cambiar el estado de la etiqueta: ${response.status}`);
                    throw new Error('Error al cambiar el estado de la etiqueta');
                }

                console.log('Estado de la etiqueta cambiado exitosamente');
            })
            .catch((error) => {

                console.error('Error:', error);
            });
    };

    agregarEtiqueta2 = (descripcion) => {
        event.preventDefault();
        const url = 'http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/';


        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: descripcion
        };

        fetch(url, options)
            .then(response => {
                if (response.status === 201) {
                    console.log('Etiqueta agregada con éxito');
                    this.cargarEtiquetas();
                    this.renderizarPaginaConEtiquetas();
                } else {
                    console.error('Error al agregar la etiqueta');
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
            });
    };

    saveEdit = (etiquetaId, descripcion) => {
        const url = `http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/etiquetas/editar/${etiquetaId}?input=${descripcion}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (!response.ok) {
                console.error(`Error al editar la etiqueta: ${response.status}`);
                this.showModalErrorEditar();
                throw new Error('Error al editar la etiqueta');
            }
            console.log('Etiqueta actualizada correctamente');
            this.cargarEtiquetas();
            this.renderizarPaginaConEtiquetas();
            this.showModalExitoEditar();
        }).catch((error) => {
            console.error('Error:', error);
        });
        event.preventDefault();
    }

    search = async () => {
        const searchInput = this.dom.querySelector("#buscadorEtiqueta");
        const modal = this.dom.querySelector("#modalError");
        const searchTerm = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        let encontrados = false;

        if (searchTerm.trim() === "") {
            const etiquetaDescriptionElement = document.getElementById('mensaje');
            const modalFooter = modal.querySelector('.modal-footer');
            if (modalFooter) {
                modalFooter.style.display = 'none';
            }
            etiquetaDescriptionElement.textContent = `Por favor, ingrese un término de búsqueda válido.`;
            this.showModalError();
            setTimeout(() => {
                this.hideModalError2();
            }, 2000);
            return;
        }

        rows.forEach((row) => {
            const cellText = row.textContent.toLowerCase();
            if (cellText.includes(searchTerm)) {
                row.classList.remove("disabled-row");
                row.classList.add('highlight');
                encontrados = true;

            } else {
                row.classList.remove('highlight');
            }
        });

        if (!encontrados) {
            const etiquetaDescriptionElement = document.getElementById('mensaje');
            const modalFooter = modal.querySelector('.modal-footer');
            if (modalFooter) {
                modalFooter.style.display = 'none';
            }
            etiquetaDescriptionElement.textContent = `No se encontraron resultados.`;
            this.showModalError();
            setTimeout(() => {
                this.hideModalError2();
            }, 2000);
        }

        searchInput.value = "";
    }


    createNew = () => {
        this.reset();
        this.state.mode = 'A';
        this.showModal();

    }

    emptyEntity = () => {
        var entity = '';
        return entity;
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
                    <p style="font-size: 25px;" class="text-center" id="mensaje">Verifica si la noticia está duplicada o los datos son incorrectos.</p>
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

    hideModalError = async () => {
        this.modalerror.hide();
        this.modal.show();
    }
    hideModalError2 = async () => {
        this.modalerror.hide();
    }
    hideModalExito = async () => {
        this.modalexito.hide();
        this.resetForm();
        this.reset();
    }
    hideModalCampo = async () => {
        this.modalCampo.hide();

    }

    showModalCampo = async () => {
        this.modalCampo.show();
    }

    showModalError = async () => {
        this.modalerror.show();
    }

    showModalExito = () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modal.hide();
        this.modalexito.show();
    }

    renderModalSuccessEditar = () => {
        return `
        <div id="sucessmodalEditar" class="modal fade">
          <div class="modal-dialog modal-confirm">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">&#xE876;</i>
                    </div>
                    <h4 class="modal-title w-100">¡Confirmado!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">Etiqueta actualizada con éxito.</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="sucessbutonEdit" data-dismiss="modal">OK</button>
                </div>
            </div>
            </div>
        </div>   
        `;
    }

    renderModalErrorEditar = () => {
        return `
<div id="modalErrorEditar" class="modal fade">
          <div class="modal-dialog modal-error">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">warning</i>
                    </div>
                    <h4 class="modal-title w-100">¡Ooops!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">Verifica si la etiqueta está duplicada o los datos son incorrectos.</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="dismissButtonEditar" data-dismiss="modal">Regresar a lista de Etiquetas</button>
                </div>
            </div>
            </div>
        </div>  

    
        `;
    }

    renderModalCampoEditar = () => {
        return `
    <div id="modalcampoEditar" class="modal fade">
    <div class="modal-dialog modal-confirm2">
        <div class="modal-content">
            <div class="modal-body text-center">
                <p style="font-size: 20px;">Por favor, complete todos los campos para editar la etiqueta.</p>
                <button id="dismisscampoEditar" style="font-size: 20px;" class="btn2 btn-success" data-dismiss="modal">Regresar</button>
            </div>
        </div>
    </div>
</div>

    `;
    }

    hideModalErrorEditar = async () => {
        this.modalerrorEditar.hide();
        const etiquetaId = this.dom.querySelector("#categorias #modalEditar #formEdit #etiquetaId").value;
        const descripcion = this.dom.querySelector("#categorias #modalEditar #formEdit #input").value;
        this.editarEtiqueta(etiquetaId, descripcion);
    }
    hideModalExitoEditar = async () => {
        this.modalexitoEditar.hide();
    }
    hideModalCampoEditar = async () => {
        this.modalCampoEditar.hide();
    }

    showModalCampoEditar = async () => {
        this.modalCampoEditar.show();
    }

    showModalErrorEditar = async () => {
        this.modalEditar.hide();
        this.modalerrorEditar.show();
    }

    showModalExitoEditar = () => {
        this.modalEditar.hide();
        this.modalexitoEditar.show();
    }

}