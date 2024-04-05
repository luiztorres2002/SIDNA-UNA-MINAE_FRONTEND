class Admin {
    dom;

    modal;

    state;

    deleteEntity;

    constructor() {
        this.state = {'entities': new Array(), 'mode': 'A', usuarios: []};
        this.dom = this.render();
        this.modalBorrarUsuario = new bootstrap.Modal(this.dom.querySelector('#modalborrarusuario'));
        this.modalExitoGenerico = new bootstrap.Modal(this.dom.querySelector('#modalExitoGenerico'));
        this.modalErrorGenerico = new bootstrap.Modal(this.dom.querySelector('#modalErrorGenerico'));

        //querys selectors
        this.dom.querySelector("#admin #modalborrarusuario #confirmarb").addEventListener('click', this.deleteUser.bind(this));


        setTimeout(() => {
            this.cargarUsuarios();
        }, 100);

    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModalBorrarUsuario()}
            ${this.renderModalErrorGenerico()}
            ${this.renderModalExitoGenerico()}
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
        <button class="btn btn-custom-outline-success2 agregarUsuarioBtn" style="width: 190px; background-color: #4CAF50 ; color: #ffffff; border-color: #4CAF50; margin-bottom: 50px;">
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
                console.log('Editando usuario cédula:', cedula);
            });

            const eliminarBtn = row.querySelector('.eliminarUsuarioBtn');
            eliminarBtn.addEventListener('click', () => {
                this.showModalBorrar(cedula);
            });

            const restablecerBtn = row.querySelector('.restablecerUsuarioBtn');
            restablecerBtn.addEventListener('click', () => {
                console.log('Restableciendo usuario cédula:', cedula);
            });

            tbody.appendChild(row);
        });
    }



    //Luis
    renderModalBorrarUsuario = () => {
        return `
        <div id="modalborrarusuario" class="modal fade" tabindex="-1">
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
                        <h4 class="text-center mb-2 mt-2">¿Estás seguro de que deseas eliminar este usuario del sistema? </h4>
                       
                       
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

    showModalBorrar = (cedula) => {
        event.preventDefault();
        this.deleteEntity = " ";
        this.deleteEntity = cedula;
        console.log(cedula);
        this.modalBorrarUsuario.show();
    }

    showModalErrorGenerico = (mensaje) => {
        var mensajeElement = document.getElementById("mensaje");
        mensajeElement.textContent = mensaje;
        this.modalErrorGenerico.show();
    }

    showModalExitoGenerico = (mensaje) => {
        var mensajeElement = document.getElementById("mensajeGenerico");
        mensajeElement.textContent = mensaje;
        this.modalExitoGenerico.show();
    }

    //Modal Generico Error
    renderModalErrorGenerico = () => {
        return `
        <div id="modalErrorGenerico" class="modal fade">
            <div class="modal-dialog modal-error">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="icon-box">
                            <i class="material-icons">warning</i>
                        </div>
                        <h4 class="modal-title w-100">¡Ooops!</h4>\t
                    </div>
                    <div class="modal-body">
                        <p id="mensaje" style="font-size: 25px;" class="text-center"></p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-success btn-block" id="dismissButton" data-dismiss="modal">Regresar</button>
                    </div>
                </div>
            </div>
        </div>`;
    }

    //modalGenericoExito
    renderModalExitoGenerico= () => {
        return `
        <div id="modalExitoGenerico" class="modal fade">
          <div class="modal-dialog modal-confirm">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">&#xE876;</i>
                    </div>
                    <h4 class="modal-title w-100">¡Confirmado!</h4>\t
                </div>
                <div class="modal-body">
                    <p id="mensajeGenerico" style="font-size: 25px;" class="text-center"></p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="sucessbuton" data-dismiss="modal">OK</button>
                </div>
            </div>
            </div>
        </div>   
        `;
    }




    //BACKEND
    deleteUser = async () => {
        event.preventDefault();
        const entityId = this.deleteEntity;
        const request = new Request(`${backend}/usuarios/delete/${entityId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        try {
            const response = await fetch(request);
            if (response.ok) {
                this.modalBorrarUsuario.hide();
                this.cargarUsuarios();
                this.showModalExitoGenerico("Se ha eliminado al usuario exitosamente.");

            } else {

                this.showModalErrorGenerico("No se pudo eliminar el usuario");
            }
        } catch (error) {
            console.error("Error al eliminar la entidad:", error);
        }
    }

}