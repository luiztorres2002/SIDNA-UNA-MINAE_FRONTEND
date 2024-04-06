class Admin {
    dom;

    modal;

    state;



    constructor() {
        this.state = {'entities': new Array(), 'mode': 'A', usuarios: []};
        this.dom = this.render();
        this.modalEditarUsuario = new bootstrap.Modal(this.dom.querySelector('#modalEditarUsuario'));
        this.modalAgregarUsuario = new bootstrap.Modal(this.dom.querySelector('#modalAgregarUsuario'));
        this.modalConfirmar = new bootstrap.Modal(this.dom.querySelector('#modalConfirmacion'));
        this.modalConfirmarPass = new bootstrap.Modal(this.dom.querySelector('#modalConfirmacionPass'));
        const agregarBtn = this.dom.querySelector("#agregarUsuarioBtn");
        agregarBtn.addEventListener('click', () => {
            this.modalAgregarUsuario.show();
        });
        setTimeout(() => {
            this.cargarUsuarios();
        }, 100);

    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModalEditar()}
            ${this.renderModalAgregar()}
            ${this.renderModalConfirmacion()}
            ${this.renderModalConfirmacionPass()}
  
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'admin';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        const body = `
        <div class="linea-azul"></div>
        <div class="linea-amarilla"></div>
        <div class="linea-verde"></div>
        <div class="container" style="margin-top: 40px;">
        <button class="btn btn-custom-outline-success2 agregarUsuarioBtn" id="agregarUsuarioBtn" style="width: 190px; background-color: #4CAF50 ; color: #ffffff; border-color: #4CAF50; margin-bottom: 50px;">
               <i class="fa-solid fa-plus"></i> <span class="texto-agregar">Agregar Usuario</span>
                </button>
            <table id="usuariosTable" class="table">
                <thead>
                    <tr>
                        <th  style="text-align: center; vertical-align: middle;">Cédula</th>
                        <th  style="text-align: center; vertical-align: middle;">Nombre Completo</th>
                        <th  style="text-align: center; vertical-align: middle;">Email</th>
                        <th  style="text-align: center; vertical-align: middle;">Rol</th>
                        <th  style="text-align: center; vertical-align: middle;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                  
                </tbody>
            </table>
            <div class="spinner-border" role="status" style="color: #cdab68;margin-left: 50%;margin-top: 10%;display: none;">
                  <span class="visually-hidden">Loading...</span>
         </div>
        </div>
    `;
        return body;
    }

    async cargarUsuarios() {
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'block';
        try {
            const response = await fetch(`${backend}/usuarios`);
            const data = await response.json();
            this.state.usuarios = data;
            this.renderTable();
        } catch (error) {
            console.log('Error al cargar la lista de usuarios:', error);
        }
    }

    async renderTable() {
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'none';
        const table = document.getElementById('usuariosTable');
        const tbody = table.querySelector('tbody');

        this.state.usuarios.forEach((usuario) => {
                const { cedula, nombre, primerApellido, segundoApellido, email, rol } = usuario;
                const row = document.createElement('tr');
                row.innerHTML = `
            <td style="text-align: center; vertical-align: middle;">${cedula}</td>
            <td style="text-align: center; vertical-align: middle;">${nombre} ${primerApellido} ${segundoApellido}</td>
            <td style="text-align: center; vertical-align: middle;">${email}</td>
            <td style="text-align: center; vertical-align: middle;">${rol.descripcion}</td>
            <td style="text-align: center; vertical-align: middle;">
                <button class="btn btn-custom-outline-success2 editarUsuarioBtn" id="editarUsuarioBtn" style="width: 90px; color: #ef8929; border-color: #ef8929;">
                    <i class="fas fa-edit"></i> <span class="texto-agregar">Editar</span>
                </button>
                <button class="btn btn-custom-outline-success eliminarUsuarioBtn" id="eliminarUsuarioBtn"  style="width: 110px; color: #D32F2F; border-color: #D32F2F;">
                    <i class="fas fa-trash-alt"></i> <span class="texto-agregar">Eliminar</span>
                </button>
                <button class="btn btn-custom-outline-success restablecerUsuarioBtn" id="restablecerUsuarioBtn" style="width: 200px; color: #2196F3; border-color: #2196F3;">
                    <i class="fas fa-undo"></i> <span class="texto-agregar">Restablecer password</span>
                </button>
            </td>
        `;

                const editarBtn = row.querySelector('.editarUsuarioBtn');
                editarBtn.addEventListener('click', () => {
                    this.modalEditarUsuario.show();
                    const nombreInput = document.querySelector('#nombre');
                    const primerApellidoInput = document.querySelector('#primerApellido');
                    const segundoApellidoInput = document.querySelector('#segundoApellido');
                    const emailInput = document.querySelector('#correo');
                    const rolSelect = document.querySelector('#rol');
                    const cedulaInput = this.dom.querySelector('#cedula');
                    cedulaInput.value = cedula;
                    nombreInput.value = nombre;
                    primerApellidoInput.value = primerApellido;
                    segundoApellidoInput.value = segundoApellido;
                    emailInput.value = email;
                    const rolDescripcion = rol.descripcion;
                    console.log(rolDescripcion);
                    for (let i = 0; i < rolSelect.options.length; i++) {
                        if (rolSelect.options[i].value === rolDescripcion) {
                            rolSelect.options[i].selected = true;
                            break;
                        }
                    }
                });
                const eliminarBtn = row.querySelector('.eliminarUsuarioBtn');
                eliminarBtn.addEventListener('click', () => {
                    document.getElementById('modalConfirmarMensaje').innerHTML = `¿Estás seguro de que deseas eliminar a este usuario?<br>${nombre} ${primerApellido} ${segundoApellido}`;
                    this.modalConfirmar.show();
                });

                const restablecerBtn = row.querySelector('.restablecerUsuarioBtn');
                restablecerBtn.addEventListener('click', () => {
                    document.getElementById('modalConfirmarMensajePass').innerHTML = `<span style="font-size: smaller;">¿Estás seguro de que deseas restablecer el password a este usuario?</span><br>${nombre} ${primerApellido} ${segundoApellido}`;
                    this.modalConfirmarPass.show();
                });

                tbody.appendChild(row);

        });
    }

    renderModalEditar() {
                return `
            <div class="modal fade" id="modalEditarUsuario" tabindex="-1" aria-labelledby="modalEditarUsuarioLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title justify-content-center" id="modalEditarUsuarioLabel">Editar Usuario</h5>
                    </div>
                    <div class="modal-body">
                        <form id="formEditarUsuario" autocomplete="em33">
                    <div class="mb-3">
                        <label class="form-label">Cédula</label>
                        <input type="text" class="form-control" id="cedula" disabled>
                    </div>
                    <div class="row mb-3">
                        <div class="col">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" autocomplete="em33">
                        </div>
                        <div class="col">
                            <label class="form-label">Primer Apellido</label>
                            <input type="text" class="form-control" id="primerApellido" autocomplete="em33">
                        </div>
                        <div class="col">
                            <label class="form-label">Segundo Apellido</label>
                            <input type="text" class="form-control" id="segundoApellido" autocomplete="em33">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input class="form-control" id="correo" autocomplete="em33">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Rol</label>
                        <select class="form-select" id="rol">
                            <option value="Analista">Analista</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>
                </>
            </div>
            <div class="modal-footer justify-content-center">
                <button type="button" class="btn btn-custom-outline-success5" id="guardarCambiosBtn" style="width: 190px; ">Guardar</button>
                <button type="button" class="btn btn-custom-outline-success6" data-bs-dismiss="modal" style="width: 190px;">Cancelar</button>
                    </div>
                </div>
            </div>
            </div>`;
    }

    renderModalAgregar() {
        return `
        <div class="modal fade" id="modalAgregarUsuario" tabindex="-1" aria-labelledby="modalAgregarUsuarioLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title justify-content-center" id="modalAgregarUsuarioLabel">Agregar Usuario</h5>
                    </div>
                    <div class="modal-body">
                        <form id="formAgregarUsuario" autocomplete="e21">
                            <div class="mb-3">
                                <label class="form-label">Cédula</label>
                                <input type="text" class="form-control" id="cedula" autocomplete="e21">
                            </div>
                            <div class="row mb-3">
                                <div class="col">
                                    <label class="form-label">Nombre</label>
                                    <input type="text" class="form-control" id="nombre" autocomplete="e21">
                                </div>
                                <div class="col">
                                    <label class="form-label">Primer Apellido</label>
                                    <input type="text" class="form-control" id="primerApellido" autocomplete="e21">
                                </div>
                                <div class="col">
                                    <label class="form-label">Segundo Apellido</label>
                                    <input type="text" class="form-control" id="segundoApellido" autocomplete="e21">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input class="form-control" id="correo" autocomplete="e212">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Rol</label>
                                <select class="form-select" id="rol">
                                    <option value="Analista">Analista</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-custom-outline-success5" id="guardarUsuarioBtn" style="width: 190px; ">Guardar</button>
                        <button type="button" class="btn btn-custom-outline-success6" data-bs-dismiss="modal" style="width: 190px; ">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>`;
    }


    renderModalConfirmacion = () => {
        return `
    <div id="modalConfirmacion" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" id="cancelModal" data-bs-dismiss="modal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
                        <span aria-hidden="true" class="ion-ios-close"></span>
                    </button>
                </div>
                <div class="modal-body p-2 py-3 p-md-5">
                    <div class="text-center">
                        <img src="images/Minae.png" class="w-50 mx-auto d-block mb-4" alt="...">
                    </div>
                    <h4 id="modalConfirmarMensaje" class="text-center mb-2 mt-2"> </h4>
                    <ul class="ftco-footer-social p-0 text-center">
                    </ul>
                     
                    <div class="modal-footer justify-content-center">
                    <button type="button" class="btn btn-custom-outline-success5" id="confirmarPassBtn" style="width: 110px; ">Aceptar</button>
                    <button type="button" class="btn btn-custom-outline-success6" data-bs-dismiss="modal" style="width: 110px; ">Cancelar</button>
                </div>
                </div>
            </div>
        </div>
    </div>
`;
    }

    renderModalConfirmacionPass = () => {
        return `
        <div id="modalConfirmacionPass" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" id="cancelModal" data-bs-dismiss="modal" class="close d-flex align-items-center justify-content-center" aria-label="Close" style="font-size: 36px; width: 50px; height: 50px; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5); border: 2px solid #ccc; border-radius: 50%;">
                            <span aria-hidden="true" class="ion-ios-close"></span>
                        </button>
                    </div>
                    <div class="modal-body p-4 py-5 p-md-5">
                        <div class="text-center">
                            <img src="images/Minae.png" class="w-50 mx-auto d-block mb-4" alt="...">
                        </div>
                        <h4 id="modalConfirmarMensajePass" class="text-center mb-2 mt-2"> </h4>
                        <ul class="ftco-footer-social p-0 text-center">
                        </ul>
                         
                        <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-custom-outline-success5" id="confirmarBtn" style="width: 110px; ">Aceptar</button>
                        <button type="button" class="btn btn-custom-outline-success6" data-bs-dismiss="modal" style="width: 110px;">Cancelar</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}