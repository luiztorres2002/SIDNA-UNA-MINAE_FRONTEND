<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body>

<input type="text" id="keywordInput" placeholder="Palabra clave">
<select id="tiempoSeleccionado" style="border: none; width: 70px">
    <option value="" selected disabled>Fecha</option>
    <option value="ultimaHora">Última Hora</option>
    <option value="ultimoDia">Último Día</option>
    <option value="ultimaSemana">Última Semana</option>
    <option value="ultimoMes">Último Mes</option>
    <option value="ultimoAno">Último Año</option>
</select>
<button onclick="corresponderPalabraClaveEnNoticias()">Buscar Noticias</button>
<div id="noticiasCoincidentes"></div>

<script>
    let contadorNoticias = 0;
    const borderColors = ['#84bd00', '#006ba6', '#fed141'];
    const buttonColors = ['#006ba6',  '#84bd00'];

    async function corresponderPalabraClaveEnNoticias() {
        const apiKey = '61123b1e9ba1ef16edf7f09f39fa5be91ca9a0609d9be31b9e7e5a2b36db6bd2';
        const keyword = document.getElementById('keywordInput').value.toLowerCase();
        const noticiasCoincidentes = document.getElementById('noticiasCoincidentes');
        noticiasCoincidentes.innerHTML = '';

        const tiempoSeleccionado = document.getElementById('tiempoSeleccionado').value;

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

            const apiUrl = `https://serpapi.com/search?api_key=${apiKey}&q=${keyword}&location=Costa%20Rica&google_domain=google.co.cr&gl=cr&lr=lang_es&hl=es${tiempoQuery ? `&tbs=${tiempoQuery}` : ''}&tbm=nws&num=35`;

            const response = await fetch('https://cors-anywhere.herokuapp.com/' + apiUrl);
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
                    noticiasCoincidentes.appendChild(elementoNoticiaCoincidente);
                }
            }

            console.log(`Total de Noticias Identificadas: ${contadorNoticias}`);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    }

</script>
</body>
</html>
