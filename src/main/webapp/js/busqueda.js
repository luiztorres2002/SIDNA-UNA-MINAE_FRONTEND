const apiKeys = [
    'c87cc9459be1e416eb33b0cf4c6900dc37a60142cfcd0fd5028110440e38cb2e',
    '2b1a27f35ed5df433b2ea68367b91471c08d2a4c9e560dbaea946220ff6c2e02',
    'f7bed0b72cb036e58cf01c0ca21769520437a7384f825789dca5322d14e19367',
    'f6136e266d9e40ee213e1b95a60b46b06a9e650465baf4f3fc0fe5d2bba1e3b3',
    '60f7edca87ed3fbaa81fa2e4e1676aba4ed4f3f23a5a4d527aa694edd4b1dc1d',
    '61123b1e9ba1ef16edf7f09f39fa5be91ca9a0609d9be31b9e7e5a2b36db6bd2',
    '51c4b495ff9b138324e629bacd6555f0700996f3ea0c5824244731938998b453',
    '10e6d46bc874a27148fb9c8d920114c3f6647dafe0186583cd1ce44f50dee601',
    'db984f9b5828130bac3fdf655e2bd6d90765b8a6995ddb330111d638d5ee4fb9'
];
let currentApiKeyIndex = 0;
let busqueda = "";
let etiquetas = [];
sugerencias = [];

class Busqueda {
    dom;
    modal;
    state;
    modalmarcar;
    entidad;
    modalerror;
    modalexito;

    constructor() {
        this.state = {'entities': new Array(), 'entity': this.emptyEntity(), 'mode': 'A'};
        this.dom = this.render();
        const self = this;
        this.abortController = null;
        this.entidad = {};
        this.modal = new bootstrap.Modal(this.dom.querySelector('#modal'));
        this.modalmarcar = new bootstrap.Modal(this.dom.querySelector('#marcar'));
        this.modalerror = new bootstrap.Modal(this.dom.querySelector('#modalError'));
        this.modalexito = new bootstrap.Modal(this.dom.querySelector('#sucessmodal'));
        this.dom.querySelector("#busqueda #buscar").addEventListener('click', () => {
            this.corresponderPalabraClaveEnNoticias();
        });
        this.dom.querySelector("#busqueda #marcar #formmarcar #marcarb").addEventListener('click', this.add);
        this.dom.querySelector("#busqueda #marcar #formmarcar #marcarcancelarb").addEventListener('click', this.modalmarcarclose);
        this.dom.querySelector("#busqueda #marcar #cancelModal").addEventListener('click', this.hidemodal);
        this.dom.querySelector("#busqueda  #modalError #dismissButton").addEventListener('click', this.hideModalError);
        this.dom.querySelector("#busqueda  #sucessmodal #sucessbuton").addEventListener('click', this.hideModalExito);
        const searchInput = this.dom.querySelector("#search-input");
        searchInput.addEventListener("input", (event) => this.inputCambio(event));
        setTimeout(() => {
            const lastUpdatedTime = localStorage.getItem('lastUpdatedTime');
            if (lastUpdatedTime && (Date.now() - parseInt(lastUpdatedTime)) < 3600000) {
                this.mostrarNoticiasAlmacenadas()
                    .catch((error) => {
                        console.error('Error mostrando noticias almacenadas:', error);
                    });
            } else {
                this.obtenerNoticias()
                    .catch((error) => {
                        console.error('Error obteniendo noticias:', error);
                    });
            }
            this.getSugerencias();
        }, 100);
        const semaforoContainer = this.dom.querySelector('.semaforoModal');
        const radioButtons = semaforoContainer.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radioButton => {
            radioButton.addEventListener('change', function () {
                if (this.checked) {
                    self.entidad['prioridad'] = this.value;
                }
            });
        });
    }

    render = () => {
        const html = `
            ${this.renderBody()}
            ${this.renderModal()}
            ${this.renderModalMarcar()}
            ${this.renderModalError()}
            ${this.renderModalSuccess()}
        `;
        const rootContent = document.createElement('div');
        rootContent.id = 'busqueda';
        rootContent.innerHTML = html;
        return rootContent;
    }
    renderBody = () => {
        const body = `
            <div class="linea-azul"></div>
            <div class="linea-amarilla"></div>
            <div class="linea-verde"></div>
            </div>
            <div class="container justify-content-center" id="tituloBusqueda" style="text-align: center; font-family: Verdana; font-size: 32px;"> 
                    Últimas Noticias Ambientales
            </div>
           <div class="d-flex justify-content-center">
                    <form id="form" style="width: 85%;"">
                   <div class="input-group mt-10" style="display: flex; align-items: center; justify-content: center;">
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
        <div id="caja-sugerencia" class="caja-sugerencia" style="display: none"></div>
        <div id="pillsMobile-container" class="pill-container"></div>
        <div class="spinner-border" role="status" style="color: #cdab68;margin-left: 50%;margin-top: 30%;display: none;">
          <span class="visually-hidden">Loading...</span>
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
        setTimeout(() => {
            const pillsContainer1 = document.getElementById("pills-container");
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
            pillsContainer1.addEventListener("click", (event) => {
                if (event.target.classList.contains("close-icon")) {
                    const pillElement = event.target.parentElement;
                    pillElement.remove();
                    const pillText = pillElement.querySelector(".pill-text").textContent.trim();
                    const pillElements2 = pillsContainer2.querySelectorAll(".pill");
                    pillElements2.forEach((pillElement2) => {
                        const pillText2 = pillElement2.querySelector(".pill-text").textContent.trim();
                        if (pillText === pillText2) {
                            pillElement2.remove();
                        }
                    });
                    etiquetas = etiquetas.filter(pill => {
                        return pill !== pillText;
                    });
                    console.log(etiquetas);
                    this.actualizarTexto();
                }
            });
            pillsContainer2.addEventListener("click", (event) => {
                if (event.target.classList.contains("close-icon")) {
                    const pillElement = event.target.parentElement;
                    pillElement.remove();
                    const pillText = pillElement.querySelector(".pill-text").textContent.trim();
                    const pillElements1 = pillsContainer1.querySelectorAll(".pill");
                    pillElements1.forEach((pillElement1) => {
                        const pillText1 = pillElement1.querySelector(".pill-text").textContent.trim();
                        if (pillText === pillText1) {
                            pillElement1.remove();
                        }
                    });
                    etiquetas = etiquetas.filter(pill => {
                        return pill !== pillText;
                    });
                    console.log(etiquetas);
                    this.actualizarTexto();
                }
            });
        }, 0);
        return body;
    }
    renderModalError = () => {
        return `
        <div id="modalError" class="modal fade">
          <div class="modal-dialog modal-error">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">warning</i>
                    </div>
                    <h4 class="modal-title w-100">¡Ooops!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">La noticia que intentas ingresar ya se encuentra en tu biblioteca</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="dismissButton" data-dismiss="modal">Entendido</button>
                </div>
            </div>
            </div>
        </div> 
        `;
    }
    renderModalSuccess = () => {
        return `
    <div id="sucessmodal" class="modal fade">
      <div class="modal-dialog modal-confirm">
        <div class="modal-content">
            <div class="modal-header">
                <div class="icon-box">
                    <i class="material-icons">&#xE876;</i>
                </div>
                <h4 class="modal-title w-100">¡Confirmado!</h4>
            </div>
            <div class="modal-body">
                <p style="font-size: 25px;" class="text-center">La noticia ha sido ingresada a tu biblioteca con éxito.</p>
            </div>
            <div class="modal-footer mt-3 text-center"> <!-- Ajusta el margen superior y alinea el botón al centro -->
                <button class="btn btn-success btn-block" id="sucessbuton" data-dismiss="modal">OK</button>
            </div>
        </div>
      </div>
    </div>
    `;
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
        busqueda = fullText;
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
        etiquetas.push(text);
        console.log(etiquetas);
    }

    async obtenerNoticias() {
        const bordeColores = ['#1c2858', '#cdab68'];
        const botonColores = ['#cdab68', '#1c2858'];
        const apiKey = apiKeys[currentApiKeyIndex];
        currentApiKeyIndex = (currentApiKeyIndex + 1) % apiKeys.length;
        console.log('API Key usada:', apiKey);
        const corsProxyUrl = 'https://corsproxy.io/?';
        const apiUrl = `https://serpapi.com/search?api_key=${apiKey}&q=costa%20rica%20medio%20ambiente&location=Costa%20Rica&google_domain=google.co.cr&gl=cr&lr=lang_es&hl=es&tbm=nws&&tbs=sbd:1,qdr:m&num=35`;
        const TIMEOUT_MS = 9000;
        const fetchConTimeout = async (url) => {
            return Promise.race([
                fetch(url),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Tiempo de espera excedido')), TIMEOUT_MS)
                )
            ]);
        };
        const response = await fetch(corsProxyUrl + apiUrl);
        const searchData = await response.json();
        const newsResults = searchData.news_results;
        if (newsResults.length === 0) {
            noticiasCoincidentes.innerHTML = '<p>No se encontraron noticias.</p>';
        } else {
            const imageUrls = [];
            for (const [index, result] of newsResults.entries()) {
                let imageUrl = '';
                const proxyUrl1 = `${backend}/proxy?url=`;
                const proxyUrl2 = 'https://corsproxy.io/?';
                try {
                    const encodedLink = encodeURIComponent(result.link);
                    let success = false;
                    const response1 = await fetchConTimeout(proxyUrl1 + encodedLink);
                    if (response1.ok) {
                        const newsHtml = await response1.text();
                        const newsDocument = new DOMParser().parseFromString(newsHtml, 'text/html');
                        const ogImage = newsDocument.querySelector('meta[property="og:image"]');
                        if (ogImage) {
                            imageUrl = ogImage.getAttribute('content');
                            success = true;
                        }
                    }
                    if (!success) {
                        const response2 = await fetchConTimeout(proxyUrl2 + encodedLink);
                        if (response2.ok) {
                            const newsHtml2 = await response2.text();
                            const newsDocument2 = new DOMParser().parseFromString(newsHtml2, 'text/html');
                            const ogImage2 = newsDocument2.querySelector('meta[property="og:image"]');
                            if (ogImage2) {
                                imageUrl = ogImage2.getAttribute('content');
                            }
                        }
                    }
                    if (!imageUrl) {
                        imageUrl = result.thumbnail;
                    }
                    imageUrls.push(imageUrl);
                } catch (error) {
                    console.error(`Error al obtener datos de noticia (${result.link}):`, error);
                }
                const colorBorde = bordeColores[index % bordeColores.length];
                const colorBoton = botonColores[index % botonColores.length];
                const elementoNoticiaCoincidente = document.createElement('div');
                elementoNoticiaCoincidente.classList.add('noticia-coincidente');
                elementoNoticiaCoincidente.innerHTML = `
            <div class="card bg-dark-subtle mt-4" style="border: 2px solid ${colorBorde};" data-link="${result.link}">
                <img src="${imageUrl}" class="card-img-top card-img-custom" alt="Imagen Previo" onerror="this.onerror=null; this.src='${result.thumbnail}'; this.classList.add('card-img-top', 'card-img-custom');">
                <div class="card-body">
                    <div class="text-section">
                        <h5 class="card-title fw-bold">${result.title}</h5>
                        <p class="card-text">${result.snippet}</p>
                    </div>
                    <div class="cta-section">
                        <p class="card-text">${result.date}</p>
                        <div class="traffic-light">
                          <input type="radio" name="rag1" class="Alta" value="Alta" data-bs-toggle="tooltip" data-bs-placement="top" title="Prioridad Alta">
                          <input type="radio" name="rag1" class="Media" value="Media" data-bs-toggle="tooltip" data-bs-placement="top" title="Prioridad Media">
                          <input type="radio" name="rag1" class="Baja" value="Baja" data-bs-toggle="tooltip" data-bs-placement="top" title="Prioridad Baja">
                        </div>
            <div class="image-overlay">
                <a class="vista_previa" href="${result.link}" id="enlaceBtn" class="btn" target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" title="${result.source}">
                    <i class="fas fa-share" style="font-size: 1.5em; width: 50px; color: ${colorBoton};"></i>
                </a>
                <div class="imagen-hover-container">
                    <div class="spinner-border" role="status" style="color: #cdab68; margin-left: 20px; margin-bottom: 40px"></div>
                    <img src="" alt=""  class="imagen-hover">
                </div>
            </div>
            </div>
            </div>
            </div>
        `;
                const semaforoButtons = elementoNoticiaCoincidente.querySelectorAll('input[type="radio"]');
                const newsSource = `${result.link}`;
                const titulo = `${result.title}`;
                const descripcion = `${result.snippet}`;
                const fuente = `${result.source}`;
                const fecha = `${result.date}`;
                let descripciones = ["Costa Rica", "Medio Ambiente"];
                semaforoButtons.forEach((button, colorIndex) => {
                    const selectedColor = button.value;
                    const infoText = `${selectedColor}`;
                    button.addEventListener('click', this.modalmarcarshow.bind(this, titulo, descripcion, newsSource, fuente, infoText, fecha, imageUrl, descripciones));
                });
                const enlaceBtn = elementoNoticiaCoincidente.querySelector('#enlaceBtn');
                const imagenHoverContainer = elementoNoticiaCoincidente.querySelector('.imagen-hover-container');
                const imagenHover = elementoNoticiaCoincidente.querySelector('.imagen-hover');
                const spinner = imagenHoverContainer.querySelector('.spinner-border');
                var myHeaders = new Headers();
                myHeaders.append("apikey", "mjTW5uT9m5BiB1V47ByXTNd6kdDG5gBv");
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow',
                    headers: myHeaders
                };
                let hoverTimer;
                enlaceBtn.addEventListener('mouseenter', async function () {
                    hoverTimer = setTimeout(async () => {
                        imagenHoverContainer.style.display = 'block';
                        if (!imagenHover.src) {
                            spinner.style.display = 'block';
                        }
                        try {
                            const screenshotResponse = await fetch("https://api.apilayer.com/screenshot?url=" + result.link, requestOptions);
                            const screenshotData = await screenshotResponse.json();
                            const imagenPreview = screenshotData.screenshot_url;
                            imagenHover.src = imagenPreview;
                            imagenHover.style.display = 'block';
                            spinner.style.display = 'none';
                        } catch (error) {
                            imagenHoverContainer.style.display = 'none';
                        }
                    }, 1000);
                });
                enlaceBtn.addEventListener('click', function (e) {
                    clearTimeout(hoverTimer);
                });
                imagenHoverContainer.addEventListener('mouseleave', () => {
                    clearTimeout(hoverTimer);
                    imagenHoverContainer.style.display = 'none';
                });
                newsResults[index].backup = result.thumbnail;
                newsResults[index].thumbnail = imageUrl;
                noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);
            }
            localStorage.setItem('storedNews', JSON.stringify(newsResults));
            localStorage.setItem('lastUpdatedTime', Date.now());
        }
    }

    async mostrarNoticiasAlmacenadas() {
        const bordeColores = ['#1c2858', '#cdab68'];
        const botonColores = ['#cdab68', '#1c2858'];
        const storedNewsJSON = localStorage.getItem('storedNews');
        const noticiasCoincidentes = document.querySelector('#noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';
        const lastUpdatedTime = localStorage.getItem('lastUpdatedTime');
        if (lastUpdatedTime && (Date.now() - parseInt(lastUpdatedTime)) < 3600000) {
            const storedNews = JSON.parse(storedNewsJSON);
            if (storedNews) {
                for (const [index, result] of storedNews.entries()) {
                    let imageUrl = result.thumbnail;
                    const colorBorde = bordeColores[index % bordeColores.length];
                    const colorBoton = botonColores[index % botonColores.length];
                    const elementoNoticiaCoincidente = document.createElement('div');
                    elementoNoticiaCoincidente.classList.add('noticia-coincidente');
                    elementoNoticiaCoincidente.innerHTML = `
                    <div class="card bg-dark-subtle mt-4" style="border: 2px solid ${colorBorde}" data-link="${result.link}">
                    <img src="${imageUrl}" class="card-img-top card-img-custom" alt="Imagen Previo" onerror="this.onerror=null; this.src='${result.backup}'; this.classList.add('card-img-top', 'card-img-custom');">
                    <div class="card-body">
                        <div class="text-section">
                            <h5 class="card-title fw-bold">${result.title}</h5>
                            <p class="card-text">${result.snippet}</p>
                        </div>
                        <div class="cta-section">
                            <p class="card-text">${result.date}</p>
                            <div class="traffic-light">
                              <input type="radio" name="rag1" class="Alta" value="Alta" data-bs-toggle="tooltip" data-bs-placement="top" title="Prioridad Alta">
                              <input type="radio" name="rag1" class="Media" value="Media" data-bs-toggle="tooltip" data-bs-placement="top" title="Prioridad Media">
                              <input type="radio" name="rag1" class="Baja" value="Baja" data-bs-toggle="tooltip" data-bs-placement="top" title="Prioridad Baja">
                            </div>
                            <div class="image-overlay">
                                <a class="vista_previa" href="${result.link}" id="enlaceBtn" class="btn" target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" title="${result.source}">
                                    <i class="fas fa-share" style="font-size: 1.5em; width: 50px; color: ${colorBoton};"></i>
                                </a>
                                <div class="imagen-hover-container">
                                    <div class="spinner-border" role="status" style="color: #cdab68; margin-left: 20px; margin-bottom: 40px"></div>
                                    <img src="" alt=""  class="imagen-hover">
                                </div>
                            </div>
                            </div>
                            </div>
                            </div>
                `;
                    const semaforoButtons = elementoNoticiaCoincidente.querySelectorAll('input[type="radio"]');
                    const newsSource = `${result.link}`;
                    const titulo = `${result.title}`;
                    const descripcion = `${result.snippet}`;
                    const fuente = `${result.source}`;
                    const fecha = `${result.date}`;
                    let descripciones = ["Costa Rica", "Medio Ambiente"];
                    semaforoButtons.forEach((button, colorIndex) => {
                        const selectedColor = button.value;
                        const infoText = `${selectedColor}`;
                        button.addEventListener('click', this.modalmarcarshow.bind(this, titulo, descripcion, newsSource, fuente, infoText, fecha, imageUrl, descripciones));
                    });
                    const enlaceBtn = elementoNoticiaCoincidente.querySelector('#enlaceBtn');
                    const imagenHoverContainer = elementoNoticiaCoincidente.querySelector('.imagen-hover-container');
                    const imagenHover = elementoNoticiaCoincidente.querySelector('.imagen-hover');
                    const spinner = imagenHoverContainer.querySelector('.spinner-border');
                    var myHeaders = new Headers();
                    myHeaders.append("apikey", "mjTW5uT9m5BiB1V47ByXTNd6kdDG5gBv");
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow',
                        headers: myHeaders
                    };
                    let hoverTimer;
                    enlaceBtn.addEventListener('mouseenter', async function () {
                        hoverTimer = setTimeout(async () => {
                            imagenHoverContainer.style.display = 'block';
                            if (!imagenHover.src) {
                                spinner.style.display = 'block';
                            }
                            try {
                                const screenshotResponse = await fetch("https://api.apilayer.com/screenshot?url=" + result.link, requestOptions);
                                const screenshotData = await screenshotResponse.json();
                                const imagenPreview = screenshotData.screenshot_url;
                                imagenHover.src = imagenPreview;
                                imagenHover.style.display = 'block';
                                spinner.style.display = 'none';
                            } catch (error) {
                                imagenHoverContainer.style.display = 'none';
                            }
                        }, 1000);
                    });
                    enlaceBtn.addEventListener('click', function (e) {
                        clearTimeout(hoverTimer);
                    });
                    imagenHoverContainer.addEventListener('mouseleave', () => {
                        clearTimeout(hoverTimer);
                        imagenHoverContainer.style.display = 'none';
                    });
                    noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);
                }
            }
        }
    }

    async corresponderPalabraClaveEnNoticias() {
        const noticiasCoincidentes = document.querySelector('#noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';

        if (this.abortController) {
            this.abortController.abort();
        }

        this.abortController = new AbortController();
        const { signal } = this.abortController;
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'block';
        let contadorNoticias = 0;
        const bordeColores = ['#1c2858', '#cdab68'];
        const botonColores = ['#cdab68', '#1c2858'];
        const keyword = encodeURI(busqueda);
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
            const apiUrl = encodeURI(`https://serpapi.com/search?api_key=${apiKey}&q=${keyword}&location=Costa%20Rica&google_domain=google.co.cr&gl=cr&lr=lang_es&hl=es&tbm=nws&tbs=sbd:1${tiempoQuery ? `,${tiempoQuery}` : ''}&num=35`);
            const corsProxyUrl = 'https://corsproxy.io/?';
            const response = await fetch(corsProxyUrl + apiUrl);
            const searchData = await response.json();
            const newsResults = searchData.news_results;
            const tiempoSeleccionadoSelect = document.querySelector('#tiempoSeleccionado');
            tiempoSeleccionadoSelect.value = '';
            if (newsResults === undefined) {
                noticiasCoincidentes.innerHTML = '<p style="margin-top: 25%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 24px;">No se encontraron noticias.</p>';
                const spinner = document.querySelector('.spinner-border');
                spinner.style.display = 'none';
            } else {
                const spinner = document.querySelector('.spinner-border');
                spinner.style.display = 'none';
                const imageUrls = [];
                for (const [index, result] of newsResults.entries()) {
                    if (signal.aborted) {
                        console.log('Operación cancelada.');
                        break;
                    }
                    contadorNoticias++;
                    let imageUrl = '';
                    try {
                        const proxyUrl1 = `${backend}/proxy?url=`;
                        const proxyUrl2 = 'https://corsproxy.io/?';
                        try {
                            const newsResponse = await fetch(proxyUrl2 + result.link);
                            const newsHtml = await newsResponse.text();
                            const newsDocument = new DOMParser().parseFromString(newsHtml, 'text/html');
                            const ogImage = newsDocument.querySelector('meta[property="og:image"]');
                            imageUrl = ogImage ? ogImage.getAttribute('content') : result.thumbnail;
                        } catch (error1) {
                            console.error(`Error al obtener datos de noticia con el primer proxy (${result.link}):`, error1);
                            try {
                                const newsResponse2 = await fetch(proxyUrl1 + result.link);
                                const newsHtml2 = await newsResponse2.text();
                                const newsDocument2 = new DOMParser().parseFromString(newsHtml2, 'text/html');
                                const ogImage2 = newsDocument2.querySelector('meta[property="og:image"]');
                                imageUrl = ogImage2 ? ogImage2.getAttribute('content') : result.thumbnail;
                            } catch (error2) {
                                console.error(`Error al obtener datos de noticia con el segundo proxy (${result.link}):`, error2);
                            }
                        }
                        imageUrls.push(imageUrl);
                    } catch (error) {
                        console.error(`Error al obtener datos de noticia (${result.link}):`, error);
                    }
                    const colorBorde = bordeColores[index % bordeColores.length];
                    const colorBoton = botonColores[index % botonColores.length];
                    const elementoNoticiaCoincidente2 = document.createElement('div');
                    elementoNoticiaCoincidente2.classList.add('noticia-coincidente');
                    elementoNoticiaCoincidente2.innerHTML = `
            <div class="card bg-dark-subtle mt-4" style="border: 2px solid ${colorBorde};" data-link="${result.link}">
                <img src="${imageUrl}" class="card-img-top card-img-custom" alt="Imagen Previo" onerror="this.onerror=null; this.src='${result.thumbnail}'; this.classList.add('card-img-top', 'card-img-custom');">
                <div class="card-body">
                    <div class="text-section">
                        <h5 class="card-title fw-bold">${result.title}</h5>
                        <p class="card-text">${result.snippet}</p>
                    </div>
                    <div class="cta-section">
                        <p class="card-text">${result.date}</p>
                        <div class="traffic-light">
                          <input type="radio" name="rag1" class="Alta" value="Alta" data-bs-toggle="tooltip" data-bs-placement="top" title="Prioridad Alta">
                          <input type="radio" name="rag1" class="Media" value="Media" data-bs-toggle="tooltip" data-bs-placement="top" title="Prioridad Media">
                          <input type="radio" name="rag1" class="Baja" value="Baja" data-bs-toggle="tooltip" data-bs-placement="top" title="Prioridad Baja">
                        </div>
            <div class="image-overlay">
                <a class="vista_previa" href="${result.link}" id="enlaceBtn" class="btn" target="_blank" data-bs-toggle="tooltip" data-bs-placement="top" title="${result.source}">
                    <i class="fas fa-share" style="font-size: 1.5em; width: 50px; color: ${colorBoton};"></i>
                </a>
                <div class="imagen-hover-container">
                    <div class="spinner-border" role="status" style="color: #cdab68; margin-left: 20px; margin-bottom: 40px"></div>
                    <img src="" alt=""  class="imagen-hover">
                </div>
            </div>
            </div>
            </div>
            </div>
        `;
                    const semaforoButtons2 = elementoNoticiaCoincidente2.querySelectorAll('input[type="radio"]');
                    const newsSource = `${result.link}`;
                    const titulo = `${result.title}`;
                    const descripcion = `${result.snippet}`;
                    const fuente = `${result.source}`;
                    const fecha = `${result.date}`;
                    const imagen = `${imageUrl}`;
                    const descripciones = etiquetas;
                    semaforoButtons2.forEach((button, colorIndex) => {
                        const selectedColor = button.value;
                        const infoText = `${selectedColor}`;
                        button.addEventListener('click', () => {
                            this.modalmarcarshow(titulo, descripcion, newsSource, fuente, infoText, fecha, imagen, descripciones);
                        });
                    });
                    const enlaceBtn = elementoNoticiaCoincidente2.querySelector('#enlaceBtn');
                    const imagenHoverContainer = elementoNoticiaCoincidente2.querySelector('.imagen-hover-container');
                    const imagenHover = elementoNoticiaCoincidente2.querySelector('.imagen-hover');
                    const spinner = imagenHoverContainer.querySelector('.spinner-border');
                    var myHeaders = new Headers();
                    myHeaders.append("apikey", "mjTW5uT9m5BiB1V47ByXTNd6kdDG5gBv");
                    var requestOptions = {
                        method: 'GET',
                        redirect: 'follow',
                        headers: myHeaders
                    };
                    let hoverTimer;
                    enlaceBtn.addEventListener('mouseenter', async function () {
                        hoverTimer = setTimeout(async () => {
                            imagenHoverContainer.style.display = 'block';
                            if (!imagenHover.src) {
                                spinner.style.display = 'block';
                            }
                            try {
                                const screenshotResponse = await fetch("https://api.apilayer.com/screenshot?url=" + result.link, requestOptions);
                                const screenshotData = await screenshotResponse.json();
                                const imagenPreview = screenshotData.screenshot_url;
                                imagenHover.src = imagenPreview;
                                imagenHover.style.display = 'block';
                                spinner.style.display = 'none';
                            } catch (error) {
                                imagenHoverContainer.style.display = 'none';
                            }
                        }, 1000);
                    });
                    enlaceBtn.addEventListener('click', function (e) {
                        clearTimeout(hoverTimer);
                    });
                    imagenHoverContainer.addEventListener('mouseleave', () => {
                        clearTimeout(hoverTimer);
                        imagenHoverContainer.style.display = 'none';
                    });
                    if (signal.aborted) {
                        console.log('Operación cancelada.');
                        break;
                    }
                    noticiasCoincidentes.appendChild(elementoNoticiaCoincidente2);
                }
            }
            console.log(`Total de Noticias Identificadas: ${contadorNoticias}`);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    }

    renderModalMarcar = () => {
        return `
        <div id="marcar" class="modal fade" tabindex="-1">
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
                        <h4 class="text-center mb-2 mt-2">¿Desea guardar esta noticia en su biblioteca?</h4>
                       
                        <ul class="ftco-footer-social p-0 text-center">
                        </ul>
                         <div class="d-flex align-items-center justify-content-center">
                    <p class="mr-3" style="margin-top: 14px;">Prioridad seleccionada:</p>
                    <div class="semaforoModal">
                        <input type="radio" id="radioAlta" name="rag1" class="AltaModal" value="Alta">
                        <input type="radio" id="radioMedia" name="rag1" class="MediaModal" value="Media">
                        <input type="radio" id="radioBaja" name="rag1" class="BajaModal" value="Baja">
                    </div>
                </div>
                        <form action="#" id="formmarcar" class="signup-form">
                            <div class="btn-group mt-4 d-flex justify-content-center">
                                <button type="submit" id="marcarb" class="btn btn-outline-primary rounded submit ml-4 mr-3">Agregar</button>
                                <button type="button" id="marcarcancelarb" class="btn btn-outline-secondary rounded submit">Cancelar</button>
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
    add = async () => {
        event.preventDefault();
        const request = new Request(`${backend}/NoticiasMarcadas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.entidad)
        });
        try {
            const response = await fetch(request);
            if (!response.ok) {
                this.showModalError()
                return;
            } else {
                this.showModalExito();
                const noticia = document.querySelector(`[data-link="${this.entidad.enlace}"]`);
                if (noticia) {
                    noticia.remove();
                }
                return;
            }
        } catch (e) {
            alert(e);
        }
    }

    inputCambio(event) {
        const buscador = event.target;
        const palabra = buscador.textContent.trim().toLowerCase();
        if (palabra === "") {
            this.ocultarCajaSugerencias();
            return;
        }
        const sugerenciasFiltradas = sugerencias.filter((sugerencia) => {
            const descripcionSugerencia = sugerencia.descripcion.toLowerCase();
            return descripcionSugerencia.startsWith(palabra);
        });
        this.actualizarCajaSugerencias(sugerenciasFiltradas);
    }

    getSugerencias() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `${backend}/etiquetas/habilitadas/4-0258-0085`, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                sugerencias = data;
            } else {
                console.error("Error al cargar etiquetas.");
            }
        };
        xhr.send();
    }

    actualizarCajaSugerencias(etiquetas) {
        const cajaSugerencias = this.dom.querySelector("#caja-sugerencia");
        cajaSugerencias.innerHTML = "";
        etiquetas.forEach((etiqueta) => {
            const sugerencia = document.createElement("div");
            sugerencia.className = "sugerencia";
            sugerencia.textContent = etiqueta.descripcion;
            sugerencia.addEventListener("click", () => this.clickSugerencia(etiqueta.descripcion));
            cajaSugerencias.appendChild(sugerencia);
        });
        cajaSugerencias.style.display = etiquetas.length > 0 ? "block" : "none";
    }

    clickSugerencia(sugerenciaSeleccionada) {
        const buscador = this.dom.querySelector("#search-input");
        buscador.textContent = "";
        this.crearBurbuja(sugerenciaSeleccionada);
        this.actualizarTexto();
        this.ocultarCajaSugerencias();
    }

    ocultarCajaSugerencias() {
        const cajaSugerencias = this.dom.querySelector("#caja-sugerencia");
        cajaSugerencias.style.display = "none";
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
        this.modal.show();
    }
    reset = () => {
        this.entidad = {};
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
    emptyEntity = () => {
        var entity = '';
        return entity;
    }
    modalmarcarshow = (titulo, descripcion, enlace, fuente, infotext, fecha, imagen, descripciones) => {
        this.entidad['id'] = '1';
        this.entidad['titulo'] = titulo;
        this.entidad['descripcion'] = descripcion;
        this.entidad['fecha'] = fecha;
        this.entidad['prioridad'] = infotext;
        this.entidad['fuente'] = fuente;
        this.entidad['enlace'] = enlace;
        this.entidad['fechaGuardado'] = '2023-11-11';
        this.entidad['usuarioCedula'] = '1';
        this.entidad['imagen'] = imagen;
        const etiquetasDescripcion = [];
        descripciones.forEach(descripcion => {
            etiquetasDescripcion.push({descripcion});
        });
        this.entidad['etiquetas'] = etiquetasDescripcion;
        let radioToSelect;
        switch (infotext) {
            case "Alta":
                radioToSelect = document.getElementById('radioAlta');
                break;
            case "Media":
                radioToSelect = document.getElementById('radioMedia');
                break;
            case "Baja":
                radioToSelect = document.getElementById('radioBaja');
                break;
            default:
                break;
        }
        if (radioToSelect) {
            radioToSelect.checked = true;
        }
        this.modalmarcar.show();
    }
    modalmarcarclose = () => {
        this.reset();
        this.modalmarcar.hide();
    }
    reset = () => {
        this.state.entity = this.emptyEntity();
    }
    renderModalSuccess = () => {
        return `
        <div id="sucessmodal" class="modal fade">
          <div class="modal-dialog modal-confirm">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="icon-box">
                        <i class="material-icons">&#xE876;</i>
                    </div>
                    <h4 class="modal-title w-100">¡Confirmado!</h4>\t
                </div>
                <div class="modal-body">
                    <p style="font-size: 25px;" class="text-center">La noticia ha sido ingresada con éxito en tu biblioteca</p>
                </div>
                <div class="modal-footer">
            <button class="btn btn-success btn-block" id="sucessbuton" data-dismiss="modal">OK</button>
                </div>
            </div>
            </div>
        </div>   
        `;
    }
    showModalError = async () => {
        this.modalmarcar.hide();
        this.modalerror.show();
    }
    hideModalError = async () => {
        this.modalerror.hide();
    }
    hidemodal = async () => {
        this.modalmarcar.hide();
        this.reset();
    }
    hideModalExito = async () => {
        this.modalexito.hide();
        this.resetForm();
        this.reset();
    }
    showModalExito = () => {
        // Cargar los datos de la entidad en el formulario del modal
        this.modalmarcar.hide();
        this.modalexito.show();
    }
}