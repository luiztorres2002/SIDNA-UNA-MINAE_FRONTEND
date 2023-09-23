class Etiqueta {

    dom;

    modal;

    state;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A', etiquetas: []};
        this.cargarEtiquetas();
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.dom.querySelector("#categorias #agregar").addEventListener('click', this.createNew);
        this.dom.querySelector("#categorias #buscar").addEventListener('click', this.search);
        this.modalEditar = new bootstrap.Modal(this.dom.querySelector('#modalEditar'));
        this.dom.querySelector("#categorias #modalEditar #formEdit #cancel").addEventListener('click', this.cancelarEdit);
        this.dom.querySelector("#categorias #modalEditar #formEdit #save").addEventListener('click', () => {
            const etiquetaId = this.dom.querySelector("#categorias #modalEditar #formEdit #etiquetaId").value;
            this.saveEdit(etiquetaId);
        });
        this.dom.querySelector("#categorias #modalEditar #close").addEventListener('click', this.cancelarEdit);


        const searchInput = this.dom.querySelector("#buscador");

        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.search();
            }
        });


    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
            ${this.renderModalEditar()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'categorias';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        return `
<div class="blue-line"></div>
<div id="loading-spinner" style="display: none;">
        <!-- Add your loading spinner HTML here -->
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
<div id="noResultsMessage" class="popup-message">
  <i class="fas fa-exclamation-triangle"></i> No se encontraron resultados.
</div>
<div id="digiteMessage" class="popup-message">
  <i class="fas fa-exclamation-triangle"></i> Por favor, ingrese un término de búsqueda válido.
</div>
   <div class="d-flex justify-content-center">
            <form id="form" style="width: 85%; margin-top: 20px;"">
           <div class="input-group mb-3 mt-10" style="display: flex; align-items: center; justify-content: center;">
    <div class="btn-group me-2">
        <button type="button" class="btn btn-custom-outline-success" id="agregar" style="height: 40px; width: 120px; line-height: 5px;"><span class="font-weight-bold">+</span> <span class="texto-agregar">Agregar</span></button>
    </div>
    <input class="form-control me-2 fontAwesome" id="buscador" autocomplete="off" type="text" style="width: 200px; margin-left: 700px; height: 38px; border-radius: 5px; border: 1px solid #006ba6;" placeholder="&#xf002; Buscar Etiqueta...">
    <div class="btn-group me-2">
         <button type="button" class="btn btn-custom-outline-success2" id="buscar" style="height: 40px; line-height: 5px; width: 70px; margin-left: 50px;">
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
    <tbody id="etiquetasTableBody">
      
</table>
                </div>
            </form>
        </div>

        `;
    }


    renderizarPaginaConEtiquetas = () => {
        let tableRows = '';

        this.state.etiquetas.forEach((etiqueta, index) => {
            const {descripcion, etiquetaId, estado} = etiqueta;
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
                    <input class="form-check-input unchecked" type="checkbox" role="switch" data-row="${index + 1}" data-etiqueta-id="${etiquetaId}" data-etiqueta-estado="${estado}" ${isChecked} style="background-color: #ffffff; border-color: #000000; background-image: url('data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'-4 -4 8 8\\'><circle r=\\'3\\' fill=\\'%2384bd00\\'/></svg>') ">
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


        const editarBotones = document.querySelectorAll('.editar-etiqueta');
        editarBotones.forEach((boton, index) => {
            const etiquetaId = this.state.etiquetas[index].etiquetaId;
            const descripcion = this.state.etiquetas[index].descripcion;
            boton.addEventListener('click', () => {
                this.editarEtiqueta(etiquetaId, descripcion);
            });
        });

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
         
          <input type="hidden" id="etiquetaId" name="etiquetaId" value="">
          
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
        const fila = this.dom.querySelector(`[data-row="${numFila}"]`);
        const colors = ["green-bg"];
        const colorIndex = (numFila - 1) % colors.length;

        if (toggleSwitch.checked) {
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
        const etiquetaId = event.target.getAttribute('data-etiqueta-id');
        const nuevoEstado = event.target.checked;
        this.cambiarEstadoEtiqueta(etiquetaId, nuevoEstado);
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
                throw new Error('Error al editar la etiqueta');
            }
            console.log('Etiqueta actualizada correctamente');
        }).catch((error) => {
            console.error('Error:', error);
        });
        event.preventDefault();
        this.renderizarPaginaConEtiquetas();
    }

    search = async () => {
        const searchInput = this.dom.querySelector("#buscador");
        const noResultsMessage = this.dom.querySelector("#noResultsMessage");
        const searchTerm = searchInput.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        let encontrados = false;

        if (searchTerm.trim() === "") {
            digiteMessage.classList.add('show');
            setTimeout(() => {
                digiteMessage.classList.remove('show');
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
            noResultsMessage.classList.add('show');
            setTimeout(() => {
                noResultsMessage.classList.remove('show');
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

}
