const apiKeys = [
    'c87cc9459be1e416eb33b0cf4c6900dc37a60142cfcd0fd5028110440e38cb2e',
    '2b1a27f35ed5df433b2ea68367b91471c08d2a4c9e560dbaea946220ff6c2e02',
    'f7bed0b72cb036e58cf01c0ca21769520437a7384f825789dca5322d14e19367',
    'f6136e266d9e40ee213e1b95a60b46b06a9e650465baf4f3fc0fe5d2bba1e3b3',
    '60f7edca87ed3fbaa81fa2e4e1676aba4ed4f3f23a5a4d527aa694edd4b1dc1d',
    '61123b1e9ba1ef16edf7f09f39fa5be91ca9a0609d9be31b9e7e5a2b36db6bd2',
    '51c4b495ff9b138324e629bacd6555f0700996f3ea0c5824244731938998b453'
];

let currentApiKeyIndex = 0;
let busqueda ="";

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
        const body= `
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
            <form id="form" style="width: 85%;"">
           <div class="input-group mb-3 mt-10" style="display: flex; align-items: center; justify-content: center;">
    <div class="btn-group me-2">

<select id="tiempoSeleccionado" style="border: none; width: 90px; margin-right:90px; margin-left: 100px";>
    <option value="" selected disabled>Fecha</option>
    <option value="ultimaHora">Última Hora</option>
    <option value="ultimoDia">Último Día</option>
    <option value="ultimaSemana">Última Semana</option>
    <option value="ultimoMes">Último Mes</option>
    <option value="ultimoAno">Último Año</option>
</select>
    </div>
    <div class="search-container">
            <div id="search-input" class="editable-input fontAwesome" contenteditable="true" data-placeholder="&#xf002; Buscar..."></div>
            <div id="pills-container" class="pill-container"></div>
        </div>
        
    <div class="btn-group me-2">
         <button type="button" class="btn btn-custom-outline-success" id="buscar" style="height: 40px; line-height: 5px; width: 70px; margin-left: 50px;">
            <i class="fas fa-search"></i>
         </button>
    </div>
</div>
<div id="pillsMobile-container" class="pill-container"></div>
<div class="search-results-container">
    <div id="noticiasCoincidentes"></div> 
    <div class="d-flex justify-content-center">
   
    </div>
</div>

                </div>
            </form>
        </div>
        
       `;



        setTimeout(() => {
            const pillsContainer = document.getElementById("pills-container");
            const pillsContainer2 = document.getElementById("pillsMobile-container");
            const searchInput = document.getElementById("search-input");

            searchInput.addEventListener("keyup", (event) => {
                if (event.key === "Enter" || event.key === "," || event.key === "-") {
                    event.preventDefault();
                    const searchValue = searchInput.textContent.trim();
                    if (searchValue) {

                        const cleanedValue = searchValue.replace(/[,.-]/g, "").trim();
                        if (cleanedValue) {
                            this.crearBurbuja(cleanedValue);
                            searchInput.textContent = "";
                            this.actualizarTexto();
                        }
                    }
                }
            });

            pillsContainer.addEventListener("click", (event) => {
                if (event.target.classList.contains("close-icon")) {
                    event.target.parentElement.remove();
                    this.actualizarTexto();
                }
            });
            pillsContainer2.addEventListener("click", (event) => {
                if (event.target.classList.contains("close-icon")) {
                    event.target.parentElement.remove();
                    this.actualizarTexto();
                }
            });
        }, 0);

        return body;
    }

    actualizarTexto() {
        const searchInput = document.getElementById("search-input");
        const pillsContainer = document.getElementById("pills-container");
        const pills = Array.from(pillsContainer.querySelectorAll(".pill"));
        const pillTexts = pills.map((pill) => {
            const pillContent = Array.from(pill.childNodes)
                .filter((node) => !node.classList || !node.classList.contains("close-icon"))
                .map((node) => node.textContent)
                .join("");
            return pillContent;
        });
        const combinedText = pillTexts.join(" ");
        const searchValue = searchInput.textContent.trim();
        let fullText = searchValue + " " + combinedText;
        fullText = fullText.replace(/\s+/g, " ").trim();
        console.log("Combined Text:", fullText);
        busqueda=fullText;
    }

    crearBurbuja(text) {
        const pillsContainer1 = document.getElementById("pills-container");
        const pillsContainer2 = document.getElementById("pillsMobile-container");
        const searchInput = document.getElementById("search-input");
        const pill1 = document.createElement("div");
        pill1.className = "pill";
        pill1.innerHTML = `
        <span class="pill-text">${text}</span>
        <span class="close-icon">&times;</span>
    `;
        const pill2 = pill1.cloneNode(true);
        pillsContainer1.appendChild(pill1);
        pillsContainer2.appendChild(pill2);
    }


    async mostrarDestacadas() {
        let contadorNoticias = 0;
        const bordeColores = ['#84bd00', '#006ba6', '#fed141'];
        const botonColores = ['#006ba6',  '#84bd00'];

        const noticiasCoincidentes = document.querySelector('#noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';


        const apiKey = apiKeys[currentApiKeyIndex];
        currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;

        console.log('API Key usada:', apiKey);

        const corsProxyUrl = 'https://corsproxy.io/?';
        const apiUrl = `https://serpapi.com/search?api_key=${apiKey}&q=costa%20rica%20medio%20ambiente&location=Costa%20Rica&google_domain=google.co.cr&gl=cr&lr=lang_es&hl=es&tbm=nws&&tbs=sbd:1&num=35`;

        const response = await fetch(corsProxyUrl + apiUrl);
        const searchData = await response.json();

        const newsResults = searchData.news_results;

        if (newsResults.length === 0) {
            noticiasCoincidentes.innerHTML = '<p>No se encontraron noticias.</p>';
        } else {
            for (const [index, result] of newsResults.entries()) {
                contadorNoticias++;

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

                const colorBorde = bordeColores[index % bordeColores.length];
                const colorBoton = botonColores[index % botonColores.length];
                const elementoNoticiaCoincidente = document.createElement('div');
                elementoNoticiaCoincidente.classList.add('noticia-coincidente');

                elementoNoticiaCoincidente.innerHTML = `
                    <div class="card bg-dark-subtle mt-4" style="border: 2px solid ${colorBorde};">
                        <img src="${imageUrl}" class="card-img-top card-img-custom" alt="Imagen Previo" onerror="this.onerror=null; this.src='${result.thumbnail}'; this.classList.add('card-img-top', 'card-img-custom');">
                        <div class="card-body">
                            <div class="text-section">
                                <h5 class="card-title fw-bold">${result.title}</h5>
                                <p class="card-text">${result.snippet}</p>
                            </div>
                            <div class="cta-section">
                                <p class="card-text">${result.date}</p>
                                <div class="traffic-light">
                                  <input type="radio" name="rag1" class="Alta" value="Alta">
                                  <input type="radio" name="rag1" class="Media" value="Media">
                                  <input type="radio" name="rag1" class="Baja" value="Baja">
                                </div>
                                <a href="${result.link}" id="enlanceBtn" class="btn" target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" title="${result.source}">
                    <i class="fas fa-share" style="font-size: 1.5em; width: 50px; color: ${colorBoton};"></i></a>
                   
                            </div>
                        </div>
                    </div>
                `;
                const newsElements = document.querySelectorAll('.noticia-coincidente');
                newsElements.forEach((element, index) => {
                    const colorButtons = element.querySelectorAll('input[type="radio"]');
                    const newsSource = newsResults[index].link;

                    colorButtons.forEach((button, colorIndex) => {
                        button.addEventListener('click', () => {
                            const selectedColor = button.value;
                            const infoText = `News: ${newsSource} ${selectedColor}`;
                            console.log(infoText);
                        });
                    });
                });
                noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);
            }
        }
    }

    async  corresponderPalabraClaveEnNoticias() {
        let contadorNoticias = 0;
        const coloresBorde = ['#84bd00', '#006ba6', '#fed141'];
        const coloresBoton = ['#006ba6',  '#84bd00'];

        const keyword = busqueda.toLowerCase();
        const noticiasCoincidentes = document.querySelector('#noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';

        const tiempoSeleccionado = document.querySelector('#tiempoSeleccionado').value;
        const apiKey = apiKeys[currentApiKeyIndex];
        currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;

        console.log('API Key usada:', apiKey);

        try {
            let tiempoQuery = '';

            if (tiempoSeleccionado === 'ultimaHora') {
                tiempoQuery = 'qdr:h';
            } else if (tiempoSeleccionado === 'ultimoDia') {
                tiempoQuery = 'qdr:d';
            } else if (tiempoSeleccionado === 'ultimaSemana') {
                tiempoQuery = 'qdr:w';
            } else if (tiempoSeleccionado === 'ultimoMes') {
                tiempoQuery = 'qdr:m';
            } else if (tiempoSeleccionado === 'ultimoAno') {
                tiempoQuery = 'qdr:y';
            }

            const apiUrl = `https://serpapi.com/search?api_key=${apiKey}&q=${keyword}&location=Costa%20Rica&google_domain=google.co.cr&gl=cr&lr=lang_es&hl=es&tbm=nws&tbs=sbd:1${tiempoQuery ? `,${tiempoQuery}` : ''}&num=35`;
            const corsProxyUrl = 'https://corsproxy.io/?';
            const response = await fetch(corsProxyUrl + apiUrl);
            const searchData = await response.json();

            const newsResults = searchData.news_results;
            const tiempoSeleccionadoSelect = document.querySelector('#tiempoSeleccionado');
            tiempoSeleccionadoSelect.value = '';

            if (newsResults.length === 0) {
                noticiasCoincidentes.innerHTML = '<p>No se encontraron noticias.</p>';
            } else {
                for (const [index, result] of newsResults.entries()) {
                    contadorNoticias++;


                    let imageUrl = result.thumbnail;

                    try {
                        const corsProxyUrl = 'http://localhost:8080/UNA_MINAE_SIDNA_FRONTEND_war_exploded/minae/proxy?url=';
                        const newsResponse = await fetch(corsProxyUrl + result.link);
                        const newsHtml = await newsResponse.text();
                        const newsDocument = new DOMParser().parseFromString(newsHtml, 'text/html');
                        const ogImage = newsDocument.querySelector('meta[property="og:image"]');
                        imageUrl = ogImage ? ogImage.getAttribute('content') : result.thumbnail;
                    } catch (error) {
                        console.error(`Error al obtener datos de noticia (${result.link}):`, error);
                    }

                    const colorBorde = coloresBorde[index % coloresBorde.length];
                    const buttonColor = coloresBoton[index % coloresBoton.length];
                    const elementoNoticiaCoincidente = document.createElement('div');
                    elementoNoticiaCoincidente.classList.add('noticia-coincidente');

                    elementoNoticiaCoincidente.innerHTML = `
                    <div class="card bg-dark-subtle mt-4" style="border: 2px solid ${colorBorde};">
                        <img src="${imageUrl}" class="card-img-top card-img-custom" alt="Imagen Previo" onerror="this.onerror=null; this.src='${result.thumbnail}'; this.classList.add('card-img-top', 'card-img-custom');">
                        <div class="card-body">
                            <div class="text-section">
                                <h5 class="card-title fw-bold">${result.title}</h5>
                                <p class="card-text">${result.snippet}</p>
                            </div>
                            <div class="cta-section">
                                <p class="card-text">${result.date}</p>
                                <a href="${result.link}" class="btn" target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" title="${result.source}">
                    <i class="fas fa-share" style="font-size: 1.5em; width: 50px; color: ${buttonColor}"></i></a>
                            </div>
                        </div>
                    </div>
                `;
                    noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);
                }
            }
            busqueda = "";

            console.log(`Total de Noticias Identificadas: ${contadorNoticias}`);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
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



