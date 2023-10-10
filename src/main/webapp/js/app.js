
class App {
    dom;
    modal; // login modal

    modal2;//actualizar modal

    state;  // state variables: if any

    Etiqueta;
    Biblioteca;
    Busqueda;

    constructor() {
        this.state = {};
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#app>#modal'));
        this.modal2 = new bootstrap.Modal(this.dom.querySelector('#app>#modal2'));
        this.dom.querySelector('#app>#modal #apply').addEventListener('click', e => this.login());
        this.dom.querySelector('#app>#modal #registrar').addEventListener('click', e => this.registrar());
        this.dom.querySelector('#app>#modal2 #formModal2 #change').addEventListener('click', e => this.ClienteUpdate());
        this.renderBodyFiller();
        this.renderMenuItems();
        this.busquedaShow();

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
        <header id="menu">
            <a id="logonav" href="#" ><img src="images/Minae.png"  width="300" height="110" style="margin-right: 200px;"></a>
        <ul class="navbar" id='menuItems'>
            
        </ul>
         </header>
         `;
    }

    renderBody = () => {
        return `
        <div id="body">  
    <div class="mt-20" style="color: white; display: inline-block; padding-left: 180px" >
    
               
     </div>
</div>
       
    `;
    }

    renderFooter = () => {
        return `
         <footer class="footer-dark">
           <div class="container">
                <div class="row">
                    <div class="col-sm-6 col-md-3 item">
                            <a id="logonav" href="#" ><img src="images/Minae.png"  width="300" height="110" style="margin-right: 200px;"></a>
                    </div>
                    <div class="col-sm-6 col-md-3 item">
                        <h3>Contáctenos</h3>
                        <ul>
                            <li>+506 2106-8500</li>
                            <li><a href="#">comunicacion@minae.go.cr</a></li>
                            <li>Horario:
                                Lunes - Viernes:  
                                7:00am - 3:00pm</li>
                        </ul>
                    </div>
                    <div class="col-md-6 item text">
                        <h3>SIDNA</h3>
                        <p>Sistema Recopilatorio de Denuncias y Noticias Ambientales</p>
                    </div>
                     <div class="col item social">
                        <p class="text-center">Copyright @2023 | Designed With by <a href="#">MINAE</a></p>
                        <ul class="social_footer_ul">
                        <li><a href="https://www.facebook.com/minaecr"  target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i></a></li>
                        <li><a href="https://twitter.com/CRMinae"  target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a></li>
                        <li><a href="https://www.youtube.com/@ministeriodeambienteyenerg1176"  target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i></a></li>
                        <li><a href="https://www.instagram.com/minaecr/"  target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a></li>
                        </ul>
                    </div>
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
                       <img class="img-circle" id="img_logo" src="" style="max-width: 50px; max-height: 50px" alt="logo">
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
                       <img class="img-circle" id="img_logo" src="" style="max-width: 50px; max-height: 50px" alt="logo">
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
               <div class="linea-azul"></div>
               <div class="linea-amarilla"></div>
               <div class="linea-verde"></div>
            </div>
        </div>
    `;
        this.dom.querySelector('#app>#body').replaceChildren();
        this.dom.querySelector('#app>#body').innerHTML = html;
    }

    renderMenuItems = () => {
        var html = '';

        html += `
            <li><a href="#" id="Busqueda" class="activeBq">BUSQUEDA</a></li>
            <li><a href="#" id="Etiquetas">ETIQUETAS</a></li>
            <li><a href="#" id="Biblioteca">BIBLIOTECA</a></li>
    `;



        this.dom.querySelector('#app>#menu #menuItems').replaceChildren();
        this.dom.querySelector('#app>#menu #menuItems').innerHTML = html;

        // Add event listeners here

        this.dom.querySelector("#app>#menu #menuItems #Biblioteca")?.addEventListener('click', e => this.bibliotecaShow());
        this.dom.querySelector("#app>#menu #menuItems #Etiquetas")?.addEventListener('click', e => this.etiquetaShow());
        this.dom.querySelector("#app>#menu #menuItems #Busqueda")?.addEventListener('click', e => this.busquedaShow());


    }



    bibliotecaShow = () => {
        this.Biblioteca = new Biblioteca();
        const menuItems = this.dom.querySelectorAll("#app>#menu #menuItems a");

        menuItems.forEach((menuItem) => {
            if (menuItem.id === "Biblioteca") {
                menuItem.classList.add("active");
            } else {
                menuItem.classList.remove("active");
            }
        });

        this.dom.querySelector('#app>#body').replaceChildren(this.Biblioteca.dom);
    }

    busquedaShow = () => {
        this.Busqueda = new Busqueda();
        const menuItems = this.dom.querySelectorAll("#app>#menu #menuItems a");

        menuItems.forEach((menuItem) => {
            if (menuItem.id === "Busqueda") {
                menuItem.classList.add("active");
            } else {
                menuItem.classList.remove("active");
            }
        });

        this.dom.querySelector('#app>#body').replaceChildren(this.Busqueda.dom);

    }

    etiquetaShow = () => {
        this.Etiqueta = new Etiqueta();
        const menuItems = this.dom.querySelectorAll("#app>#menu #menuItems a");


        menuItems.forEach((menuItem) => {
            if (menuItem.id === "Etiquetas") {
                menuItem.classList.add("active");
            } else {
                menuItem.classList.remove("active");
            }
        });

        this.dom.querySelector('#app>#body').replaceChildren(this.Etiqueta.dom);

    }



}