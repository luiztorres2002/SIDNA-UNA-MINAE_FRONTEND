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
        <header id="menu">
             <div class="info" style="text-align: center">
                <h1 style="font-size: medium">SIDNA</h1>
                <h4 style="font-size: medium">Sistema Recopilatorio De Noticias Ambientales</h4>
               </div>
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
    <footer class="footer">
        <div class="container bottom_border">
        <div class="row">
        
        <div class=" col-sm-4 col-md  col-12 col">
         <a id="logonav1" href="#" ><img src="images/Minae.png"  width="300" height="110" style="margin-top: 200px;"></a>
        </div>
        
        <div class=" col-sm-4 col-md col-sm-4  col-12 col" style="margin-top: auto">
        <h5 class="headin5_amrc col_white_amrc pt2">Contáctenos</h5>
        <p><i class="phone"></i>  +506 2106-8500  </p>
        <p><i class="gmail"></i> comunicacion@minae.go.cr  </p>
        <p><i class="Schedule"></i> Horario: Lunes - Viernes 7:00am - 3:00pm </p>
        </div>
        
        </div>
        </div>
        
        
        <div class="container">
        <ul class="foote_bottom_ul_amrc">
        <li><a href="http://webenlance.com">Home</a></li>
        <li><a href="http://webenlance.com">About</a></li>
        <li><a href="http://webenlance.com">Services</a></li>
        <li><a href="http://webenlance.com">Contact</a></li>
        </ul>
        
        <p class="text-center">Copyright @2023 | Diseñado y creado por <a href="#">Grupo #12</a></p>
        
        <ul class="social_footer_ul">
        <li><a href="http://webenlance.com"><i class="fab fa-facebook-f"></i></a></li>
        <li><a href="http://webenlance.com"><i class="fab fa-twitter"></i></a></li>
        <li><a href="http://webenlance.com"><i class="fab fa-youtube"></i></a></li>
        <li><a href="http://webenlance.com"><i class="fab fa-instagram"></i></a></li>
        </ul>
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
               
            </div>
        </div>
    `;
        this.dom.querySelector('#app>#body').replaceChildren();
        this.dom.querySelector('#app>#body').innerHTML = html;
    }

    renderMenuItems = () => {
        var html = '';

        html += `
            <li><a href="#" id="Busqueda">BUSQUEDA</a></li>
            <li><a href="#" id="Etiquetas">ETIQUETAS</a></li>
            <li><a href="#" id="Biblioteca">BIBLIOTECA</a></li>
            
       
    `;



        this.dom.querySelector('#app>#menu #menuItems').replaceChildren();
        this.dom.querySelector('#app>#menu #menuItems').innerHTML = html;

        // Add event listeners here
        this.dom.querySelector("#app>#menu #menuItems #Busqueda")?.addEventListener('click', e => this.busquedaShow());
        this.dom.querySelector("#app>#menu #menuItems #Biblioteca")?.addEventListener('click', e => this.bibliotecaShow());
        this.dom.querySelector("#app>#menu #menuItems #Etiquetas")?.addEventListener('click', e => this.etiquetaShow());


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