class App {
    dom;
    modal; // login modal

    modal2;//actualizar modal

    state;  // state variables: if any


    Biblioteca;

    constructor() {
        this.state = {};
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#app>#modal'));
        this.modal2 = new bootstrap.Modal(this.dom.querySelector('#app>#modal2'));
        this.dom.querySelector('#app>#modal #apply').addEventListener('click', e => this.login());
        this.dom.querySelector('#app>#modal #registrar').addEventListener('click', e => this.registrar());
        this.dom.querySelector('#app>#modal2 #formModal2 #change').addEventListener('click', e => this.ClienteUpdate());
        this.renderBodyFiller();  //rellena el body con la informacion importante.
        this.renderMenuItems();
    }

    render = () => {
        const html = `
            ${this.renderMenu()}
            ${this.renderBody()} 
            ${this.renderFooter()}
            ${this.renderModal()}
             ${this.renderModal2()}
        `;
        var rootContent = document.createElement('div');
        rootContent.id = 'app';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderMenu = () => {
        return `
         <nav id="menu" class="navbar navbar-expand-lg p-0 navbar-dark bg-dark">
           <div class="container-fluid">
             <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuCollapse">
               <span class="navbar-toggler-icon"></span>
             </button>
             <div id="menuCollapse" class="collapse navbar-collapse" >
               <ul class="navbar-nav me-auto mb-2 mb-lg-0" id='menuItems'>
               </ul>
             </div>
           </div>
         </nav>
         `;
    }

    renderBody = () => {
        return `
        <div id="body">  
    <div class="mt-20" style="color: white; display: inline-block; padding-left: 180px" >
    
               FSFDDFDd
     </div>
</div>
       
    `;
    }

    renderFooter = () => {
        return `
        <footer id="footer" class="bg-dark text-white mt-4 w-100 fixed-bottom">
            <div class="container-fluid py-2">

                SISTEMA RECOPILTORIO DE NOTICIAS Y DENUNCIAS AMBIENTALES
            </div>
        </footer> 
    `;
    }

    renderModal = () => {
        return `
         <div id="modal" class="modal fade" tabindex="-1">
           <div class="modal-dialog">
               <div class="modal-content">
                   <div class="modal-header" >
                       <img class="img-circle" id="img_logo" src="../images/Poliza.png" style="max-width: 50px; max-height: 50px" alt="logo">
                       <span id = "titleee"style='margin-left:4em;font-weight: bold;'>Login</span> 
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                   </div>
        
                   <form id="form" >
                       
                       <div class="modal-body">
                      
                       <ul class = "nav nav-tabs" id ="tabs" role ="tablist">
                           
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="tab1-tab" data-bs-toggle="tab" data-bs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">Login</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="tab2-tab" data-bs-toggle="tab" data-bs-target="#tab2" type="button" role="tab" aria-controls="tab2" aria-selected="false">Registro</button>
                            </li>
                           
                       </ul>
                          
                       </div>
                       
                       <div class="modal-body">
           <div class="tab-content mt-2">
                        <div class="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">
                        
                             <div class="modal-body">
                       <div class="input-group mb-3">
                           <span class="input-group-text">Identificación</span>
                           <input type="text" class="form-control" id="identificacion" name="identificacion">
                       </div>  
                       <div class="input-group mb-3">
                           <span class="input-group-text">Contraseña</span>
                           <input type="password" class="form-control" id="clave" name="clave">
                       </div>      
                   </div>
                  
                       <button id="apply" type="button" class="btn btn-primary" >Login</button>
                   

                        </div>
                        
                    <div class="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
                       
                       
                    <span class="input-group-text" for="id">ID:</span>
                    <input class="form-control" type="text" id="id" name="id" required>
                    <br/>
                    <span class="input-group-text" for="clave">Clave:</span>
                    <input class="form-control" type="password" id="claveR" name="claveR" required>
                    <br/>
                    <span class="input-group-text" for="nombre">Nombre:</span>
                    <input class="form-control" type="text" id="nombre" name="nombre" required>
                    <br/>
                    <span class="input-group-text" for="telefono">Teléfono:</span>
                    <input class="form-control" type="text" id="telefono" name="telefono" required>
                    <br/>
                    <span class="input-group-text" for="correo">Correo:</span>
                    <input class="form-control" type="email" id="correo" name="correo" required>
                    <br/>
                    <span class="input-group-text" for="tarjeta">Número de Tarjeta:</span>
                    <input class="form-control" type="text" id="tarjeta" name="tarjeta" required>
                    <br/>

                    <button id="registrar"  type="button" class="btn btn-primary">Registrarse</button>
                    </div>
                    
                    </div>
                          
                   </div>
                       
                       
                       
                        </form>
               </div>
      </div>
                  </div>
        
    `;
    }

    renderModal2 = () => {
        return `
        <div id="modal2" class="modal fade" tabindex="-1">
           <div class="modal-dialog">
               <div class="modal-content">
                   <div class="modal-header" >
                       <img class="img-circle" id="img_logo" src="../images/Poliza.png" style="max-width: 50px; max-height: 50px" alt="logo">
                       <span id = "titleee"style='margin-left:4em;font-weight: bold;'>Actualizacion de usuario</span> 
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                   </div>
        
                   <form id="formModal2" >
                       
                       <div class="modal-body">
                      
                       <ul class = "nav nav-tabs" id ="tabs" role ="tablist">
                           
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="tab1-tab" data-bs-toggle="tab" data-bs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">Actualizar Informacion</button>
                            </li>
                            
                           
                       </ul>
                          
                       </div>
                       
                       <div class="modal-body">
           <div class="tab-content mt-2">
                       
                        
                             <div class="modal-body">
                       <div class="input-group mb-3">
                           <span class="input-group-text">Identificación</span>
                           <input type="text" class="form-control" id="identificacionR" name="identificacionR">
                       </div>  
                       <div class="input-group mb-3">
                           <span class="input-group-text">Nombre</span>
                           <input type="text" class="form-control" id="nombreR" name="nombreR">
                       </div>
                        <div class="input-group mb-3">
                           <span class="input-group-text">Telefono</span>
                           <input type="text" class="form-control" id="telefonoR" name="telefonoR">
                       </div>
                       <div class="input-group mb-3">
                              <span class="input-group-text">Correo Electronico</span>
                           <input type="text" class="form-control" id="correoR" name="correoR">
                       </div>  
                       <div class="input-group mb-3">
                              <span class="input-group-text">Numero de Tarjeta</span>
                           <input type="text" class="form-control" id="numTarjetaR" name="numTarjetaR">
                       </div>  
                   </div>
                  
                       <button id="change" type="button" class="btn btn-primary" >Actualizar</button>
       
                    </div>
                          
                   </div>
                       
                       
                       
                        </form>
               </div>
      </div>
                  </div>
        
    `;
    }

    renderBodyFiller = () => {
        var html = `
        <div id='bodyFiller' style='margin-left: 10%; margin-top:100px; width: 80%; text-align: center; font-size: 1.5em'>
          
          <div class="mt-14" style="color: white; display: inline-block; padding-left: 2px" >
               <img src="images/Minae.png" class="d-block w-70 mx-auto" alt="...">
            </div>
        </div>
    `;
        this.dom.querySelector('#app>#body').replaceChildren();
        this.dom.querySelector('#app>#body').innerHTML = html;
    }

    renderMenuItems = () => {
        var html = '';

        html += `
        <li class="nav-item">
            <a class="nav-link" id="Busqueda" href="#" data-bs-toggle="modal"> <span><i class="fas fa-search"></i></span> Busqueda Parametrizada </a>
        </li>
         <li class="nav-item">
            <a class="nav-link" id="Etiqueta" href="#" data-bs-toggle="modal"> <span><i class="fas fa-tag"></i></span> Etiquetas</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="Biblioteca" href="#" data-bs-toggle="modal"> <span><i class="fa fa-book"></i></span> Biblioteca Personal </a>
        </li>
       
    `;



        this.dom.querySelector('#app>#menu #menuItems').replaceChildren();
        this.dom.querySelector('#app>#menu #menuItems').innerHTML = html;

        // Add event listeners here

        this.dom.querySelector("#app>#menu #menuItems #Biblioteca")?.addEventListener('click', e => this.bibliotecaShow());


    }



    bibliotecaShow = () => {
        this.Biblioteca = new Biblioteca();
        this.dom.querySelector('#app>#body').replaceChildren(this.Biblioteca.dom);
    }

}
