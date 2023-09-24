class Busqueda {

    dom;

    modal;

    state;
    
    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A'};
        this.dom = this.render();
    }

    render = () => {
        const html = `
            ${this.renderBody()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'busqueda';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        return `
        <h1 class="text-center mt-5" style="color: black;">Noticias destacadas</h1>

        <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner">
              <div class="carousel-item active" style="background-image: url('https://wallpaperaccess.com/full/284466.jpg')">
                <div class="carousel-caption">
                  <h5 style="color: black;">Primer ejemplo noticia</h5>
                  <p style="color: black;">Contenido Noticia</p>
                </div>
              </div>
              <div class="carousel-item" style="background-image: url('https://getwallpapers.com/wallpaper/full/4/e/1/367999.jpg')">
                <div class="carousel-caption">
                  <h5 style="color: black;">Segundo ejemplo noticia</h5>
                  <p style="color: black;">Contenido Noticia</p>
                </div>
              </div>
              <div class="carousel-item" style="background-image: url('https://www.wallpapers13.com/wp-content/uploads/2015/12/Volcano-Eruption-Wallpaper-HD-9367.jpeg')">
                <div class="carousel-caption">
                  <h5 style="color: black;">Tercer ejemplo noticia</h5>
                  <p style="color: black;">Contenido Noticia</p>
                </div>
              </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
      </div>

        <div>
        <h3 class="text-center mt-5" style="color: black;">Ejemplos noticias</h3>
        <table class="table">
            <tr>
                <td>
                    <a href="https://semanariouniversidad.com/pais/naturaleza-playas-y-aventura-son-el-epicentro-de-atraccion-para-turistas-que-arriban-a-costa-rica/">
                        <img class="image-1" src="https://semanariouniversidad.com/wp-content/uploads/2023/07/TURISMO-NOTA-SECUNDARIA.jpeg" alt="Imagen 1">
                    </a>
                </td>
            </tr>
            <tr>
                <td>
                    <a href="https://www.larepublica.net/noticia/el-efecto-colibri-el-impresionante-documental-de-la-naturaleza-tica-ya-esta-en-youtube">
                        <img class="image-1" src="https://www.larepublica.net/storage/images/2023/04/17/20230417095400.colibri.jpg" alt="Imagen 2">
                    </a>
                </td>
            </tr>
            <tr>
                <td>
                     <a href="https://www.crhoy.com/ambiente/temporada-de-ballenas-avanza-para-ser-declarada-de-interes-publico/">
                        <img class="image-1" src="https://icdn2.crhoy.com/w/800/h/0/q/95/png/0/c/1/s/pull.crhoy.net/wp-content/uploads/2023/08/shutterstock_78852880-e1693341077519.jpg" alt="Imagen 3">
                    </a>
                </td>
            </tr>
        </table>
        </div>
            
        `;
    }

    load = async () => {
        const form = this.dom.querySelector("#biblioteca #modal form");
        const formData = new FormData(form);
        this.entity = {};
        for (let [key, value] of formData.entries()) {
            this.entity[key] = value;
        }

        // Imprime los datos en la consola
        console.log(this.entity);
    }

    add = async() => {
        await this.load();
        this.entity["fecha"] = "2023-12-12";
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
                console.log(this.entity);
                return;
            }
        } catch (e) {
            alert(e);
        }
    }


    emptyEntity = () => {
        var entity = '';
        return entity;
    }

}
