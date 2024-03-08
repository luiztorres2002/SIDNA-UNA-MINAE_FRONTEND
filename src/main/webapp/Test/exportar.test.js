
async function fetchNoticiasFromBackend(backend) {
    const response = await fetch(`${backend}/NoticiasMarcadas/4-0258-0085`);
    if (!response.ok) {
        throw new Error('Error al obtener noticias del backend');
    }
    const noticias = await response.json();
    return noticias;
}

async function agregarNoticiasAlExcel(workbook, noticias) {
    const worksheet = workbook.addWorksheet('Noticias Seleccionadas');
    const prioridadStyles = {
        Alta: {fill: {type: 'pattern', pattern: 'solid', fgColor: {argb: 'da9595'}}},
        Media: {fill: {type: 'pattern', pattern: 'solid', fgColor: {argb: 'ffe699'}}},
        Baja: {fill: {type: 'pattern', pattern: 'solid', fgColor: {argb: 'c2d699'}}}
    };

    worksheet.columns = [
        { header: 'Título', key: 'titulo', width: 40, style: {alignment: {vertical: 'middle', horizontal: 'center'}} },
        { header: 'Descripción', key: 'descripcion', width: 60, style: {alignment: {vertical: 'middle', horizontal: 'left'}} },
        { header: 'Fecha', key: 'fecha', width: 20, style: {alignment: {vertical: 'middle', horizontal: 'center'}} },
        { header: 'Fuente', key: 'fuente', width: 30, style: {alignment: {vertical: 'middle', horizontal: 'center'}} },
        { header: 'Prioridad', key: 'prioridad', width: 15, style: {alignment: {vertical: 'middle', horizontal: 'center'}} },
        { header: 'Enlace', key: 'enlace', width: 50, style: {alignment: {vertical: 'middle', horizontal: 'center'}} }
    ];

    noticias.forEach(noticia => {
        const tituloSinSaltos = noticia.titulo.replace(/(\r\n|\n|\r)/gm, ' ');
        const descripcionSinSaltos = noticia.descripcion.replace(/(\r\n|\n|\r)/gm, ' ');
        const row = worksheet.addRow({
            titulo: tituloSinSaltos,
            descripcion: descripcionSinSaltos,
            fecha: noticia.fecha,
            fuente: noticia.fuente,
            prioridad: noticia.prioridad,
            enlace: 'Ver enlace'
        });
        const prioridadCell = row.getCell('prioridad');
        if (prioridadCell.value && prioridadStyles[prioridadCell.value]) {
            prioridadCell.fill = prioridadStyles[prioridadCell.value].fill;
        }
    });
}

async function main() {
    const backend = "http://localhost:8080/MINAE/minae";
    const workbook = new ExcelJS.Workbook();
    const noticias = await fetchNoticiasFromBackend(backend);
    await agregarNoticiasAlExcel(workbook, noticias);

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(blob, 'noticias_seleccionadas.xlsx');
    console.log('El archivo de noticias se ha creado exitosamente.');
}

main().catch(error => {
    console.error('Error:', error);
});