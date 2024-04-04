const apiKeys = [
    '2b1a27f35ed5df433b2ea68367b91471c08d2a4c9e560dbaea946220ff6c2e02',
    'f7bed0b72cb036e58cf01c0ca21769520437a7384f825789dca5322d14e19367',
    'f6136e266d9e40ee213e1b95a60b46b06a9e650465baf4f3fc0fe5d2bba1e3b3',
    '60f7edca87ed3fbaa81fa2e4e1676aba4ed4f3f23a5a4d527aa694edd4b1dc1d',
    '61123b1e9ba1ef16edf7f09f39fa5be91ca9a0609d9be31b9e7e5a2b36db6bd2',
    '51c4b495ff9b138324e629bacd6555f0700996f3ea0c5824244731938998b453',
    '10e6d46bc874a27148fb9c8d920114c3f6647dafe0186583cd1ce44f50dee601',
    'db984f9b5828130bac3fdf655e2bd6d90765b8a6995ddb330111d638d5ee4fb9'
];
let apiKeyActual = 0;
let busqueda = "";
let etiquetas = [];
sugerencias = [];
let globalAbortController = new AbortController();
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
        busqueda = " ";
        etiquetas = [];
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
        const fechaSeleccionar = this.dom.querySelector("#tiempoSeleccionado");
        fechaSeleccionar.addEventListener('change',() =>{
            this.corresponderPalabraClaveEnNoticias();
        });
        searchInput.addEventListener("input", (event) => this.inputCambio(event));
        setTimeout(() => {
            const ultimaHora = localStorage.getItem('ultimaHora');
            if (ultimaHora && (Date.now() - parseInt(ultimaHora)) < 3600000) {
                this.mostrarNoticiasAlmacenadas()
                    .catch((error) => {
                        console.error('Error mostrando noticias almacenadas:', error);
                    });
            } else {
                globalAbortController.abort();
                globalAbortController = new AbortController();
                this.obtenerNoticias(1)
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
        <div class="container justify-content-center" id="tituloBusqueda" style="text-align: center; font-family: Verdana; font-size: 28px;"> 
                Últimas Noticias Ambientales
        </div>
        <div class="d-flex justify-content-center">
                <form id="form" style="width: 85%;margin-bottom: -15px">
               <div class="input-group mt-10" style="display: flex; align-items: center; justify-content: center;">
        <div class="btn-group me-2">
    <div class="select-container" style="width: 200px;margin-right: 50px;" bis_skin_checked="1"> 
        <select id="tiempoSeleccionado" style="border: none; width: 149px; margin-right: 0px; margin-left: 100px;">
            <option value="" selected="" disabled="">Fecha</option>
            <option value="ultimaHora">Última Hora</option>
            <option value="ultimoDia">Último Día</option>
            <option value="ultimaSemana">Última Semana</option>
            <option value="ultimoMes">Último Mes</option>
            <option value="ultimoAno">Último Año</option>
        </select>
    </div>
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
    <nav aria-label="Page navigation" id="paginationNav" style="display: none;">
      <ul class="pagination justify-content-center">
        <li class="page-item disabled">
          <a class="page-link" href="#" tabindex="-1" id="pagePrevious"><i class="fas fa-chevron-left"></i></a>
        </li>
        <li class="page-item active"><a class="page-link" href="#" id="page1">1</a></li>
        <li class="page-item"><a class="page-link" href="#" id="page2">2</a></li>
        <li class="page-item"><a class="page-link" href="#" id="page3">3</a></li>
        <li class="page-item">
          <a class="page-link" href="#" id="pageNext"><i class="fas fa-chevron-right"></i></a>
        </li>
      </ul>
    </nav>
   `;

        $(document).ready(function () {
            $('select#tiempoSeleccionado').change(function () {
                var text = $(this).find('option:selected').text();
                var $aux = $('<select/>').append($('<option/>').text(text));
                $(this).after($aux);
                $(this).width($aux.width());
                $(this).css('margin-right', $aux.css('margin-right'));
                $aux.remove();
            }).change();
        });

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
                    this.actualizarTexto();
                }
            });
            var navegacionPaginacion = document.getElementById('paginationNav');
            var paginaActual = 1;
            const cambiarPagina = (numeroPagina) => {
                this.obtenerNoticias(numeroPagina);
            };

            document.getElementById('pageNext').addEventListener('click', function(event) {
                event.preventDefault();
                var paginaActiva = navegacionPaginacion.querySelector('.active');
                var paginaSiguiente = paginaActiva.nextElementSibling.querySelector('.page-link').textContent;

                if (parseInt(paginaSiguiente) <= 3) {
                    cambiarPagina(parseInt(paginaSiguiente));
                    navegacionPaginacion.querySelector('.active').classList.remove('active');
                    paginaActiva.nextElementSibling.classList.add('active');
                    paginaActual = parseInt(paginaSiguiente);
                }

                actualizarPaginacion();

                if (parseInt(paginaSiguiente) >= 3) {
                    document.getElementById('pageNext').setAttribute('disabled', 'disabled');
                }
            });

            document.getElementById('pagePrevious').addEventListener('click', function(event) {
                event.preventDefault();
                var paginaActiva = navegacionPaginacion.querySelector('.active');
                var paginaAnterior = paginaActiva.previousElementSibling.querySelector('.page-link').textContent;

                if (parseInt(paginaAnterior) >= 1) {
                    cambiarPagina(parseInt(paginaAnterior));
                    navegacionPaginacion.querySelector('.active').classList.remove('active');
                    paginaActiva.previousElementSibling.classList.add('active');
                    paginaActual = parseInt(paginaAnterior);
                }

                actualizarPaginacion();

                if (parseInt(paginaAnterior) < 3) {
                    document.getElementById('pageNext').removeAttribute('disabled');
                }
            });

            for (var i = 1; i <= 3; i++) {
                var enlacePagina = document.getElementById('page' + i);
                enlacePagina.addEventListener('click', function(event) {
                    event.preventDefault();
                    var numeroPagina = parseInt(this.textContent);
                    cambiarPagina(numeroPagina);
                    navegacionPaginacion.querySelector('.active').classList.remove('active');
                    this.parentNode.classList.add('active');
                    paginaActual = numeroPagina;
                    actualizarPaginacion();
                });
            }
            function actualizarPaginacion() {
                if (paginaActual === 1) {
                    document.getElementById('pagePrevious').parentNode.classList.add('disabled');
                } else {
                    document.getElementById('pagePrevious').parentNode.classList.remove('disabled');
                }

                if (paginaActual === 3) {
                    document.getElementById('pageNext').parentNode.classList.add('disabled');
                } else {
                    document.getElementById('pageNext').parentNode.classList.remove('disabled');
                }
            }
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
                    <p id="mensajeError" style="font-size: 25px;" class="text-center">La noticia que intentas ingresar ya se encuentra en tu biblioteca</p>
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

    }
    async obtenerNoticias(pagina) {
        const noticiasCoincidentes = document.getElementById('noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'block';
        var paginationNav = document.getElementById('paginationNav');
        paginationNav.style.display = 'none';
        const bordeColores = ['#1c2858', '#cdab68'];
        const botonColores = ['#cdab68', '#1c2858'];
        const apiKey = await this.obtenerSiguienteApiKey();
        if (this.abortController) {
            this.abortController.abort();
        }
        let noticiasCoincidentesCargadas = 0;
        this.abortController = new AbortController();
        const { signal } = this.abortController;
        const { signal: globalAbortSignal } = globalAbortController;
        const apiUrl = this.construirApiUrl('costa rica medio ambiente y energia', 'qdr:m', apiKey,pagina);
        const TIMEOUT_MS = 9000;
        const fetchConTimeout = async (url) => {
            return Promise.race([
                fetch(url),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Tiempo de espera excedido')), TIMEOUT_MS)
                )
            ]);
        };
        const corsProxyUrl = 'https://corsproxy.io/?';
        let response = await fetch(corsProxyUrl + apiUrl);
        if (response.status === 429) {
            const newApiKey = await this.obtenerSiguienteApiKey();
            const newApiUrl = this.construirApiUrl('costa rica medio ambiente y energia', 'qdr:m', newApiKey, pagina);
            response = await fetch(corsProxyUrl + newApiUrl);
        }
        const searchData = await response.json();
        const newsResults = searchData.news_results;
        if (pagina === 1) {
            const externalJsonUrl = 'https://ssc2308.github.io/newsJSON/news.json';
            const externalResponse = await fetch(externalJsonUrl);
            const externalData = await externalResponse.json();
            externalData.news_results.forEach(noticia => {
                const fechaCreacion = new Date(noticia.date);
                const fechaActual = new Date();
                const diferenciaMilisegundos = fechaActual - fechaCreacion;
                const diferenciaMinutos = Math.floor(diferenciaMilisegundos / (1000 * 60));
                const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
                const diferenciaDias = Math.floor(diferenciaHoras / 24);
                if (diferenciaDias > 0) {
                    noticia.date = `hace ${diferenciaDias} día${diferenciaDias !== 1 ? 's' : ''}`;
                } else if (diferenciaHoras > 0) {
                    noticia.date = `hace ${diferenciaHoras} hora${diferenciaHoras !== 1 ? 's' : ''}`;
                } else {
                    noticia.date = `hace ${diferenciaMinutos} minuto${diferenciaMinutos !== 1 ? 's' : ''}`;
                }
            });
            if (externalData.news_results && externalData.news_results.length > 0) {
                for (const result of externalData.news_results) {
                    const existe = newsResults.some(existingResult => existingResult.link === result.link);
                    if (!existe) {
                        newsResults.push(result);
                    }
                }
            }

        }

        if (newsResults.length === 0) {
            noticiasCoincidentes.innerHTML = '<p>No se encontraron noticias.</p>';
        } else {
            const news = this.ordenarNoticiasPorTiempo(newsResults);
            const imageUrls = [];
            for (const [index, result] of news.slice(0, 25).entries()) {
                if (signal.aborted) {
                    break;
                }
                if (result.source.includes('News ES Euro') ||
                    result.link.includes('www.nacion.com/viva/musica') ||
                    result.link.includes('www.cuerpomente.com/') ||
                    result.link.includes('www.crhoy.com/entretenimiento/') ||
                    result.link.includes('https://dialogo-americas.com/es/')){
                    continue;
                }
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
                    noticiasCoincidentesCargadas++;
                    if (noticiasCoincidentesCargadas === 3) {
                        paginationNav.style.display = 'block';
                    }
                } catch (error) {
                    console.error(`Error al obtener datos de noticia (${result.link}):`, error);
                }

                const colorBorde = bordeColores[index % bordeColores.length];
                const colorBoton = botonColores[index % botonColores.length];
                const tipo = "1";
                spinner.style.display = 'none';
                const elementoNoticiaCoincidente = this.crearElementoNoticiaCoincidente(result, imageUrl, colorBorde, colorBoton,tipo,result.thumbnail);
                news[index].backup = result.thumbnail;
                news[index].thumbnail = imageUrl;
                if (signal.aborted) {
                    break;
                }
                noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);
            }
            if (pagina === 1 && !signal.aborted && !globalAbortSignal.aborted) {
                const noticias = news.filter(result => !result.source.includes('News ES Euro') &&
                    !result.link.includes('www.nacion.com/viva/musica') &&
                    !result.link.includes('www.cuerpomente.com/') &&
                    !result.link.includes('www.crhoy.com/entretenimiento/'));
                localStorage.setItem('noticias', JSON.stringify(noticias.slice(0, 25)));
                localStorage.setItem('ultimaHora', Date.now());
            }
        }
    }

    convertirFechaANumerico(fecha) {
        const ahora = new Date();

        const regex = /hace (\d+) (minuto|hora|día|semana|mes)/;
        const match = fecha.match(regex);

        if (!match) {
            return Infinity;
        }

        const valor = parseInt(match[1]);
        const unidad = match[2];

        let factor;
        switch (unidad) {
            case 'minuto':
                factor = 60;
                break;
            case 'hora':
                factor = 60 * 60;
                break;
            case 'día':
                factor = 24 * 60 * 60;
                break;
            case 'semana':
                factor = 7 * 24 * 60 * 60;
                break;
            case 'mes':
                factor = 30 * 24 * 60 * 60;
                break;
            default:
                factor = 1;
        }

        return valor * factor;
    }

    ordenarNoticiasPorTiempo(noticias) {
        noticias.sort((a, b) => {
            const tiempoA = this.convertirFechaANumerico(a.date);
            const tiempoB = this.convertirFechaANumerico(b.date);
            return tiempoA - tiempoB;
        });
        return noticias;
    }
    async mostrarNoticiasAlmacenadas() {
        const bordeColores = ['#1c2858', '#cdab68'];
        const botonColores = ['#cdab68', '#1c2858'];
        const noticiasJSON = localStorage.getItem('noticias');
        const noticiasCoincidentes = document.querySelector('#noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';
        const lastUpdatedTime = localStorage.getItem('ultimaHora');
        if (lastUpdatedTime && (Date.now() - parseInt(lastUpdatedTime)) < 3600000) {
            const noticias = JSON.parse(noticiasJSON);
            if (noticias) {
                for (const [index, result] of noticias.entries()) {
                    let imageUrl = result.thumbnail;
                    const colorBorde = bordeColores[index % bordeColores.length];
                    const colorBoton = botonColores[index % botonColores.length];
                    const tipo = "1";
                    const elementoNoticiaCoincidente = this.crearElementoNoticiaCoincidente(result, imageUrl, colorBorde, colorBoton,tipo);
                    noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);
                }
            }
        }
        var paginationNav = document.getElementById('paginationNav');
        paginationNav.style.display = 'block';
        globalAbortController.abort();
        globalAbortController = new AbortController();
    }
    async corresponderPalabraClaveEnNoticias() {
        console.log(busqueda);
        if (!busqueda || busqueda.trim() === '') {
            this.dom.querySelector("#mensajeError").textContent = "Por favor, selecciona una etiqueta antes de buscar";
            this.showModalError();
            return;
        }
        var paginationNav = document.getElementById('paginationNav');
        paginationNav.style.display = 'none';
        this.limpiarNoticiasCoincidentes();
        if (this.abortController) {
            this.abortController.abort();
        }
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'block';
        this.abortController = new AbortController();
        const { signal } = this.abortController;
        const tiempoSeleccionado = this.obtenerTiempoSeleccionado();
        const apiKey = await this.obtenerSiguienteApiKey();
        try {
            const tiempoQuery = this.obtenerTiempoQuery(tiempoSeleccionado);
            const apiUrl = this.construirApiUrl(busqueda, tiempoQuery, apiKey,1);
            const searchData = await this.obtenerDatosApi(apiUrl);

            if (!searchData.news_results) {
                this.mostrarMensajeNoNoticias();
            } else {
                this.mostrarNoticiasCoincidentes(searchData.news_results);
            }
        } catch (error) {
            this.manejarErrorApi(error);
        }
    }
    limpiarNoticiasCoincidentes() {
        const noticiasCoincidentes = document.querySelector('#noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';
    }
    obtenerTiempoSeleccionado() {
        return document.querySelector('#tiempoSeleccionado').value;
    }
    async obtenerSiguienteApiKey(maxIntentos = 3) {
        const apiKey = apiKeys[apiKeyActual];
        apiKeyActual = (apiKeyActual + 1) % apiKeys.length;
        console.log('API Key usada:', apiKey);
        return apiKey;
    }
    obtenerTiempoQuery(tiempoSeleccionado) {
        const tiempoQueries = {
            'ultimaHora': 'qdr:h',
            'ultimoDia': 'qdr:d',
            'ultimaSemana': 'qdr:w',
            'ultimoMes': 'qdr:m',
            'ultimoAno': 'qdr:y'
        };
        return tiempoQueries[tiempoSeleccionado] || '';
    }

    construirApiUrl(keyword, tiempoQuery, apiKey, numeroPag) {
        const encodedKeyword = encodeURI(keyword);
        const resultsPerPage = 25;
        let inicio;

        if (numeroPag > 1) {
            inicio = (numeroPag - 1) * resultsPerPage + 1;
        } else {
            inicio = 0;
        }
        const apiUrl = `https://serpapi.com/search?api_key=${apiKey}&q=${encodedKeyword}&location=Costa%20Rica&google_domain=google.co.cr&gl=cr&lr=lang_es&hl=es&tbm=nws&tbs=sbd:1${tiempoQuery ? `,${tiempoQuery}` : ''}&num=${resultsPerPage}&start=${inicio}`;
        return encodeURI(apiUrl);
    }
    async  obtenerDatosApi(apiUrl) {
        const corsProxyUrl = 'https://corsproxy.io/?';
        const response = await fetch(corsProxyUrl + apiUrl);
        return await response.json();
    }

    mostrarMensajeNoNoticias() {
        const noticiasCoincidentes = document.querySelector('#noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '<p style="margin-top: 25%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 24px;">No se encontraron noticias.</p>';
        this.ocultarSpinner();
    }

    async mostrarNoticiasCoincidentes(newsResults) {
        if (this.abortController) {
            this.abortController.abort();
        }
        var paginationNav = document.getElementById('paginationNav');
        paginationNav.style.display = 'none';
        let noticiasCoincidentesCargadas = 0;
        const noticiasCoincidentes = document.querySelector('#noticiasCoincidentes');
        const spinner = document.querySelector('.spinner-border');
        this.abortController = new AbortController();
        const { signal } = this.abortController;
        const { signal: globalAbortSignal } = globalAbortController;
        spinner.style.display = 'none';
        const bordeColores = ['#1c2858', '#cdab68'];
        const botonColores = ['#cdab68', '#1c2858'];
        for (const [index, result] of newsResults.entries()) {
            const imageUrl = await this.obtenerImageUrl(result);
            const colorBorde = bordeColores[index % bordeColores.length];
            const colorBoton = botonColores[index % botonColores.length];
            const tipo = "2";
            const elementoNoticiaCoincidente2 = this.crearElementoNoticiaCoincidente(result, imageUrl, colorBorde, colorBoton,tipo);
            if (signal.aborted) {
                break;
            }
            if (globalAbortSignal.aborted) {
                break;
            }
            noticiasCoincidentes.appendChild(elementoNoticiaCoincidente2);
            noticiasCoincidentesCargadas++;
            if (noticiasCoincidentesCargadas === 3) {
                paginationNav.style.display = 'block';
            }
        }
    }

    async obtenerImageUrl(result) {
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
        } catch (error) {
            console.error(`Error al obtener datos de noticia (${result.link}):`, error);
        }
        return imageUrl;
    }

    crearElementoNoticiaCoincidente(result, imageUrl, colorBorde, colorBoton, tipo, backup) {
        const elementoNoticiaCoincidente2 = document.createElement('div');
        if (backup !== undefined) {
            result.backup = backup;
        }
        elementoNoticiaCoincidente2.classList.add('noticia-coincidente');
        elementoNoticiaCoincidente2.innerHTML = `
        <div class="card bg-dark-subtle mt-4" style="border: 2px solid ${colorBorde};" data-link="${result.link}">
            <img src="${imageUrl}" class="card-img-top card-img-custom" alt="" 
     data-alternative="${result.backup},images/default.png" 
     onerror="loadAlternative(this, this.getAttribute('data-alternative').split(/,/)); this.classList.add('card-img-top', 'card-img-custom');">
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
        this.agregarEventListeners(elementoNoticiaCoincidente2, result, imageUrl, tipo);

        return elementoNoticiaCoincidente2;
    }

    convertirFechaEstandar(fechaRelativa) {
        const ahora = new Date();
        const fecha = new Date();

        const partes = fechaRelativa.split(' ');
        const cantidad = parseInt(partes[1]);
        const unidad = partes[2];

        if (unidad.includes('minuto')) {
            fecha.setMinutes(ahora.getMinutes() - cantidad);
        } else if (unidad.includes('hora')) {
            fecha.setHours(ahora.getHours() - cantidad);
        } else if (unidad.includes('día')) {
            fecha.setDate(ahora.getDate() - cantidad);
        } else if (unidad.includes('semana')) {
            fecha.setDate(ahora.getDate() - (cantidad * 7));
        }

        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();

        return `${dia}/${mes}/${año}`;
    }

    agregarEventListeners(elementoNoticiaCoincidente2, result, imageUrl, tipo) {
        const semaforoButtons2 = elementoNoticiaCoincidente2.querySelectorAll('input[type="radio"]');
        const newsSource = `${result.link}`;
        const titulo = `${result.title}`;
        const descripcion = `${result.snippet}`;
        const fuente = `${result.source}`;
        const fecha = `${result.date}`;
        const imagen = `${imageUrl}`;
        const fechaFormateada = this.convertirFechaEstandar(fecha);
        let descripciones;


        if (tipo === '1') {
            descripciones = ["Costa Rica", "Medio Ambiente"];
        } else if (tipo === '2') {
            descripciones = etiquetas;
        } else {

            descripciones = [];
        }


        semaforoButtons2.forEach((button, colorIndex) => {
            const selectedColor = button.value;
            const infoText = `${selectedColor}`;
            button.addEventListener('click', () => {
                this.modalmarcarshow(titulo, descripcion, newsSource, fuente, infoText, fechaFormateada, imagen, descripciones);
            });
        });

        const enlaceBtn = elementoNoticiaCoincidente2.querySelector('#enlaceBtn');
        const imagenHoverContainer = elementoNoticiaCoincidente2.querySelector('.imagen-hover-container');
        const imagenHover = elementoNoticiaCoincidente2.querySelector('.imagen-hover');
        const spinner = imagenHoverContainer.querySelector('.spinner-border');


        var requestOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer gbgjLHFc6SNCIEz5tX5uMcPE3lQID4AaXetx6eoN'
            }
        };

        let hoverTimer;
        enlaceBtn.addEventListener('mouseenter', async () => {
            hoverTimer = setTimeout(async () => {
                imagenHoverContainer.style.display = 'block';
                if (!imagenHover.src) {
                    spinner.style.display = 'block';
                }

                try {
                    const screenshotResponse = await fetch("https://screendot.io/api/standard?url=" + result.link, requestOptions);
                    if (!screenshotResponse.ok) {
                        throw new Error('La solicitud no fue exitosa. Código de estado: ' + screenshotResponse.status);
                    }
                    const imagenBlob = await screenshotResponse.blob();
                    const imagenUrl = URL.createObjectURL(imagenBlob);
                    imagenHover.src = imagenUrl;
                    imagenHover.style.display = 'block';
                    spinner.style.display = 'none';
                } catch (error) {
                    console.error(error);
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
    }

    ocultarSpinner() {
        const spinner = document.querySelector('.spinner-border');
        spinner.style.display = 'none';
    }

    manejarErrorApi(error) {
        console.error('Error al obtener datos de la API:', error);
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
                this.dom.querySelector("#mensajeError").textContent = "La noticia que intentas ingresar ya se encuentra en tu biblioteca";
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
        //const usuario = localStorage.getItem('usuario');
        this.entidad['usuarioCedula'] = '4-0258-0085';
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
