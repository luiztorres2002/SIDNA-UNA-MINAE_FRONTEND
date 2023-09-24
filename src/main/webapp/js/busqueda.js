const apiKeys = [
    '60f7edca87ed3fbaa81fa2e4e1676aba4ed4f3f23a5a4d527aa694edd4b1dc1d',
    '61123b1e9ba1ef16edf7f09f39fa5be91ca9a0609d9be31b9e7e5a2b36db6bd2',
    'c87cc9459be1e416eb33b0cf4c6900dc37a60142cfcd0fd5028110440e38cb2e',
    '2b1a27f35ed5df433b2ea68367b91471c08d2a4c9e560dbaea946220ff6c2e02',
    'f7bed0b72cb036e58cf01c0ca21769520437a7384f825789dca5322d14e19367'

];

let currentApiKeyIndex = 0;

class Busqueda {

    dom;

    modal;

    state;


    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A'};
        this.dom = this.render();
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.dom.querySelector("#busqueda #buscar").addEventListener('click', this.corresponderPalabraClaveEnNoticias);
        setTimeout(() => {
            this.mostrarDestacadas();
        }, 100);

    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'busqueda';
        rootContent.innerHTML = html;
        return rootContent;
    }

    renderBody = () => {
        return `
            <div class="linea-azul"></div>
        <div class="linea-amarilla"></div>
        <div class="linea-verde"></div>
       
        <div id="loading-spinner" style="display: none;">
        
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

<select id="tiempoSeleccionado" style="border: none; width: 90px; margin-left: 100px";>
    <option value="" selected disabled>Fecha</option>
    <option value="ultimaHora">Última Hora</option>
    <option value="ultimoDia">Último Día</option>
    <option value="ultimaSemana">Última Semana</option>
    <option value="ultimoMes">Último Mes</option>
    <option value="ultimoAno">Último Año</option>
</select>
    </div>
    <input class="form-control me-2 fontAwesome" id="buscador" autocomplete="off" type="text" style="width: 200px; margin-left: 100px; height: 38px; border-radius: 5px; border: 1px solid #006ba6;" placeholder="&#xf002; Buscar...">
    <div class="btn-group me-2">
         <button type="button" class="btn btn-custom-outline-success2" id="buscar" style="height: 40px; line-height: 5px; width: 70px; margin-left: 50px;">
            <i class="fas fa-search"></i>
         </button>
    </div>
</div>
<div class="search-results-container">
    
    <div id="noticiasCoincidentes"></div> 
    <div class="d-flex justify-content-center">
   
    </div>
</div>

                </div>
            </form>
        </div>
        
        `;
    }


    async mostrarDestacadas(){
        let contadorNoticias = 0;
        const borderColors = ['#84bd00', '#006ba6', '#fed141'];
        const buttonColors = ['#006ba6',  '#84bd00'];


        const noticiasCoincidentes = document.querySelector('#noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';

        const apiKey = apiKeys[currentApiKeyIndex];
        currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
        const corsProxyUrl = 'https://corsproxy.io/?';
        for (const apiKey of apiKeys) {
        const apiUrl = `https://serpapi.com/search?api_key=${apiKey}&q=costa%20rica%20ambiente&location=Costa%20Rica&google_domain=google.co.cr&gl=cr&lr=lang_es&hl=es&tbm=nws&&tbs=qdr:m&num=35`;

        const response = await fetch(corsProxyUrl + apiUrl);
        const searchData = await response.json();

        const newsResults = searchData.news_results;

        if (newsResults.length === 0) {
            noticiasCoincidentes.innerHTML = '<p>No se encontraron noticias.</p>';
        } else {
            for (const [index, result] of newsResults.entries()) {
                contadorNoticias++;
                console.log(`Enlace Identificado de Noticia ${contadorNoticias}:`, result.link);

                let imageUrl = result.thumbnail;

                try {
                    const corsProxyUrl = 'https://corsproxy.io/?';
                    const newsResponse = await fetch(corsProxyUrl + result.link);
                    const newsHtml = await newsResponse.text();
                    const newsDocument = new DOMParser().parseFromString(newsHtml, 'text/html');
                    const ogImage = newsDocument.querySelector('meta[property="og:image"]');
                    imageUrl = ogImage ? ogImage.getAttribute('content') : result.thumbnail;
                } catch (error) {
                    console.error(`Error al obtener datos de noticia (${result.link}):`, error);
                }

                const borderColor = borderColors[index % borderColors.length];
                const buttonColor = buttonColors[index % buttonColors.length];
                const elementoNoticiaCoincidente = document.createElement('div');
                elementoNoticiaCoincidente.classList.add('noticia-coincidente');

                elementoNoticiaCoincidente.innerHTML = `
                    <div class="card bg-dark-subtle mt-4" style="border: 2px solid ${borderColor};">
                        <img src="${imageUrl}" class="card-img-top card-img-custom" alt="Imagen Previo">
                        <div class="card-body">
                            <div class="text-section">
                                <h5 class="card-title fw-bold">${result.title}</h5>
                                <p class="card-text">${result.snippet}</p>
                            </div>
                            <div class="cta-section">
                                <p class="card-text">${result.date}</p>
                                <a href="${result.link}" class="btn" target="_blank"><i class="fas fa-share" style="font-size: 1.5em;width :50px; color: ${buttonColor}"></i></a>
                            </div>
                        </div>
                    </div>
                `;
                noticiasCoincidentes.appendChild(elementoNoticiaCoincidente); // Append to the container
            }
        }
    }
}
/*
    async function corresponderPalabraClaveEnNoticias() {
        const urlPrincipal = document.getElementById('mainUrlInput').value;
        const palabraClave = document.getElementById('keywordInput').value.toLowerCase();
        const palabraClaveNormalized = palabraClave
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const noticiasCoincidentes = document.getElementById('noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';

        try {
            const respuesta = await fetch(urlPrincipal);
            const html = await respuesta.text();
            const analizador = new DOMParser();
            const documento = analizador.parseFromString(html, 'text/html');

            const enlacesNoticias = Array.from(documento.querySelectorAll('a.nota-link')).filter(a => {
                const href = a.getAttribute('href');
                return href && href.startsWith('/');
            });

            if (enlacesNoticias.length === 0) {
                noticiasCoincidentes.innerHTML = '<p>No se encontraron  noticias.</p>';
            } else {
                for (const enlace of enlacesNoticias) {
                    const urlNoticia = new URL(enlace.getAttribute('href'), urlPrincipal).href;
                    if (urlsProcesadas.has(urlNoticia)) {
                        continue;
                    }
                    contadorNoticias++;
                    console.log(`Enlace Identificado de Noticia ${contadorNoticias}:`, urlNoticia);

                    try {
                        const respuestaNoticia = await fetch(urlNoticia);
                        const htmlNoticia = await respuestaNoticia.text();
                        const documentoNoticia = analizador.parseFromString(htmlNoticia, 'text/html');
                        const contenidoTextoNoticia = documentoNoticia.body.textContent.toLowerCase();

                        const articleElement = documentoNoticia.querySelector('article');


                        const relatedDiv = articleElement.querySelector('div.related');
                        if (relatedDiv) {
                            relatedDiv.remove();
                        }
                        const articleText = articleElement.textContent.toLowerCase();

                        if (articleText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(palabraClaveNormalized)) {
                            const elementoNoticiaCoincidente = document.createElement('div');
                            elementoNoticiaCoincidente.classList.add('noticia-coincidente');



                            const ogDescripcion = documentoNoticia.querySelector('meta[property="og:description"]');
                            const ogImagen = documentoNoticia.querySelector('meta[property="og:image"]');
                            const ogTitulo = documentoNoticia.querySelector('meta[property="og:title"]');
                            const ogFecha = documentoNoticia.querySelector('meta[property="article:published_time"]');


                            if (ogDescripcion && ogImagen && ogTitulo)  {
                                const descripcion = ogDescripcion.getAttribute('content');
                                const urlImagen = ogImagen.getAttribute('content');
                                const titulo = ogTitulo.getAttribute('content');
                                let timePublished = '';

                                if (ogFecha) {
                                    const dateString = ogFecha.getAttribute('content');
                                    const date = new Date(dateString);
                                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                                    timePublished = date.toLocaleDateString('es-ES', options);
                                }

                                const elementoNoticiaCoincidente = document.createElement('div');
                                elementoNoticiaCoincidente.classList.add('card', 'bg-dark-subtle', 'mt-4');

                                elementoNoticiaCoincidente.innerHTML = `
        <img src="${urlImagen}" class="card-img-top" alt="Imagen Previo">
        <div class="card-body">
            <div class="text-section">
                <h5 class="card-title fw-bold">${titulo}</h5>
                <p class="card-text">${descripcion}</p>
            </div>
            <div class="cta-section">
                <p class="card-text">${timePublished}</p>
                <a href="${urlNoticia}" class="btn btn-dark" target="_blank">Ver Noticia</a>
            </div>
        </div>
    `;

                                document.getElementById('noticiasCoincidentes').appendChild(elementoNoticiaCoincidente);
                            } else {

                                const elementoNoticiaCoincidente = document.createElement('div');
                                elementoNoticiaCoincidente.classList.add('card', 'bg-light-subtle', 'mt-4');

                                elementoNoticiaCoincidente.innerHTML = `
        <div class="card-body">
            <div class="text-section">
                <h5 class="card-title fw-bold">Palabra clave encontrada</h5>
                <p class="card-text">Palabra clave encontrada en <a href="${urlNoticia}" target="_blank">${enlace.textContent}</a></p>
            </div>
        </div>
    `;

                                document.getElementById('noticiasCoincidentes').appendChild(elementoNoticiaCoincidente);
                            }
                            arrayNoticiasCoincidentes.push({ Url: urlNoticia, Titulo_es: enlace.textContent });
                            noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);


                            urlsProcesadas.add(urlNoticia);
                        }
                    } catch (error) {
                        console.error(`Error al obtener datos de noticia (${urlNoticia}):`, error);
                    }
                }
            }

            console.log(`Total de Noticias Identificadas: ${contadorNoticias}`);
        } catch (error) {
            console.error('Error al obtener datos de la URL principal:', error);
        }
    }

    async function cargarMasNoticias() {
        const palabraClave = document.getElementById('keywordInput').value.toLowerCase();
        const palabraClaveNormalized = palabraClave
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
        try {
            const apiUrl = 'https://www.teletica.com/api/news/getMore';
            const desde = contadorNoticias;
            const hasta = desde + 6;

            const respuesta = await fetch(`${apiUrl}?from=${desde}&to=${hasta}&slug=noticias`);

            if (respuesta.ok) {
                try {
                    const datos = await respuesta.json();

                    if (datos.length > 0) {
                        for (const articulo of datos) {
                            contadorNoticias++;
                            const categoria = articulo.Nodes_en[0].toLowerCase().replace(/\s+/g, '');
                            const urlArticulo = `https://www.teletica.com/${categoria}/${articulo.Url}_${articulo.Id}`;

                            if (urlsProcesadas.has(urlArticulo)) {
                                continue;
                            }

                            console.log(`Enlace Identificado al Artículo de Noticia ${contadorNoticias}:`, urlArticulo);

                            try {
                                const respuestaArticulo = await fetch(urlArticulo);

                                if (!respuestaArticulo.ok) {
                                    throw new Error(`Error al obtener noticia. Estado: ${respuestaArticulo.status}`);
                                }

                                const htmlArticulo = await respuestaArticulo.text();
                                const documentoArticulo = new DOMParser().parseFromString(htmlArticulo, 'text/html');
                                const contenidoTextoArticulo = documentoArticulo.body.textContent.toLowerCase();


                                const articleElement = documentoArticulo.querySelector('article');


                                const relatedDiv = articleElement.querySelector('div.related');
                                if (relatedDiv) {
                                    relatedDiv.remove();
                                }
                                const articleText = articleElement.textContent.toLowerCase();


                                if (articleText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(palabraClaveNormalized)) {
                                    const elementoNoticiaCoincidente = document.createElement('div');
                                    elementoNoticiaCoincidente.classList.add('noticia-coincidente');



                                    const ogDescripcion = documentoArticulo.querySelector('meta[property="og:description"]');
                                    const ogImagen = documentoArticulo.querySelector('meta[property="og:image"]');
                                    const ogTitulo = documentoArticulo.querySelector('meta[property="og:title"]');
                                    const ogFecha = documentoArticulo.querySelector('meta[property="article:published_time"]');


                                    if (ogDescripcion && ogImagen) {
                                        const descripcion = ogDescripcion.getAttribute('content');
                                        const urlImagen = ogImagen.getAttribute('content');
                                        const titulo = ogTitulo.getAttribute('content');
                                        let timePublished = '';

                                        if (ogFecha) {
                                            const dateString = ogFecha.getAttribute('content');
                                            const date = new Date(dateString);
                                            const options = { year: 'numeric', month: 'long', day: 'numeric' };
                                            timePublished = date.toLocaleDateString('es-ES', options);
                                        }

                                        const elementoNoticiaCoincidente = document.createElement('div');
                                        elementoNoticiaCoincidente.classList.add('card', 'bg-dark-subtle', 'mt-4');

                                        elementoNoticiaCoincidente.innerHTML = `
        <img src="${urlImagen}" class="card-img-top" alt="Imagen Previo">
        <div class="card-body">
            <div class="text-section">
                <h5 class="card-title fw-bold">${titulo}</h5>
                <p class="card-text">${descripcion}</p>
            </div>
            <div class="cta-section">
                <p class="card-text">${timePublished}</p>
                <a href="${urlArticulo}" class="btn btn-dark" target="_blank">Ver Noticia</a>
            </div>
        </div>
    `;

                                        document.getElementById('noticiasCoincidentes').appendChild(elementoNoticiaCoincidente);
                                    } else {

                                        const elementoNoticiaCoincidente = document.createElement('div');
                                        elementoNoticiaCoincidente.classList.add('card', 'bg-light-subtle', 'mt-4');

                                        elementoNoticiaCoincidente.innerHTML = `
        <div class="card-body">
            <div class="text-section">
                <h5 class="card-title fw-bold">Palabra clave encontrada</h5>
                <p class="card-text">Palabra clave encontrada en <a href="${urlArticulo}" target="_blank"></a></p>
            </div>
        </div>
    `;

                                        document.getElementById('noticiasCoincidentes').appendChild(elementoNoticiaCoincidente);
                                    }
                                    arrayNoticiasCoincidentes.push({ Url: urlArticulo, Titulo_es: ogTitulo.getAttribute('content') });
                                    noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);


                                    urlsProcesadas.add(urlArticulo);
                                }
                            } catch (error) {
                                console.error(`Error al obtener datos de noticia (${urlArticulo}):`, error.message);
                            }
                        }
                    } else {
                        console.log('No hay más noticias disponibles.');
                    }
                } catch (jsonError) {
                    console.error('Error al analizar JSON:', jsonError);
                }
            } else {
                throw new Error(`Error al obtener más noticias. Estado: ${respuesta.status}`);
            }
        } catch (error) {
            console.error('Error al obtener más noticias:', error.message);
        }
    }


*/

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
        const form = this.dom.querySelector("#busqueda #modal #form");
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
        var formulario = this.dom.querySelector("#busqueda #modal #form");
        formulario.reset();
    }

    showModal = async () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modal.show();
    }

    reset = () => {
        this.state.entity = this.emptyEntity();
    }

    listSearch = (placa) => {
        var usuario = globalstate.user.cedula;
        const request = new Request(`${"http://localhost:8080/Proyecto2-Backend/api"}/categorias/search?name=${placa}`,
            {method: 'GET', headers: {}});

        (async () => {

            const response = await fetch(request);
            if (!response.ok) {
                errorMessage(response.status);
                return;

            }

            var coberturas = await response.json();
            var col = coberturas;
            var listing = this.dom.querySelector("#lista #tablaCategorias");
            listing.innerHTML = "";
            col.forEach(p => this.row(listing, p));
            await col.forEach(p => this.addListener(p));


        })();
    }

    search = async () => {
        var xxx = document.getElementById("name").value;
        this.listSearch(xxx);
    }

    createNew = () => {
        this.reset();
        this.state.mode = 'A'; //agregar
        this.showModal();

    }

    emptyEntity = () => {
        var entity = '';
        return entity;
    }

}



