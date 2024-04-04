class Admin {
    dom;

    modal;

    state;



    constructor() {
        this.state = {'entities': new Array(), 'mode': 'A', usuarios: []};
        this.dom = this.render();

        setTimeout(() => {
            this.cargarUsuarios();
        }, 100);

    }

    render = () => {
        const html = `
            ${this.renderBody()}
  
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
        <button class="btn btn-custom-outline-success2 agregarUsuarioBtn" style="width: 190px; color: #4CAF50; border-color: #4CAF50; margin-bottom: 50px;">
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
        </div>
    `;
        return body;
    }

    async cargarUsuarios() {
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
                <button class="btn btn-custom-outline-success2 editarUsuarioBtn" style="width: 90px; color: #ef8929; border-color: #ef8929;">
                    <i class="fas fa-edit"></i> <span class="texto-agregar">Editar</span>
                </button>
                <button class="btn btn-custom-outline-success eliminarUsuarioBtn" style="width: 110px; color: #D32F2F; border-color: #D32F2F;">
                    <i class="fas fa-trash-alt"></i> <span class="texto-agregar">Eliminar</span>
                </button>
                <button class="btn btn-custom-outline-success restablecerUsuarioBtn" style="width: 200px; color: #2196F3; border-color: #2196F3;">
                    <i class="fas fa-undo"></i> <span class="texto-agregar">Restablecer password</span>
                </button>
            </td>
        `;
            tbody.appendChild(row);
        });
    }
}