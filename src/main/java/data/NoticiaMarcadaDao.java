package data;

import jakarta.ws.rs.NotFoundException;
import logic.Etiqueta;
import logic.NoticiaMarcada;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

public class NoticiaMarcadaDao {

    Database db;
    UsuarioDao usuarioDao;
    EtiquetaDao etiquetaDao;

    public NoticiaMarcadaDao(Database db) {
        this.db = db;
        etiquetaDao = new EtiquetaDao(db);
    }

    public void create(NoticiaMarcada noticiaMarcada) throws Exception {
        String sql = "insert into NOTICIA_MARCADA(Titulo,Descripcion,Fecha,Prioridad,Fuente,Enlace,Imagen,Fechaguardado,FK_NoticiaMarcada_UsuarioCedula) values (?,?,?,?,?,?,?,SYSDATETIME(),?)";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, noticiaMarcada.getTitulo());
        stm.setString(2, noticiaMarcada.getDescripcion());
        java.util.Date fechaUtil = noticiaMarcada.getFechaGuardado();
        java.sql.Date fechaSql = new java.sql.Date(fechaUtil.getTime());
        stm.setString(3, noticiaMarcada.getFecha());
        stm.setString(4, noticiaMarcada.getPrioridad());
        stm.setString(5, noticiaMarcada.getFuente());
        stm.setString(6, noticiaMarcada.getEnlace());
        stm.setString(7, noticiaMarcada.getImagen());
        stm.setString(8, noticiaMarcada.getUsuarioCedula());
        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se creo");
        } else {
            List<Etiqueta> etiquetas = noticiaMarcada.getEtiquetas();

            for (Etiqueta etiqueta : etiquetas) {
                String descripcion = etiqueta.getDescripcion();
                this.registrarNoticiaEtiqueta(noticiaMarcada.getTitulo(), descripcion, noticiaMarcada.getUsuarioCedula());
            }
        }
    }

    public void createexterna(NoticiaMarcada noticiaMarcada) throws Exception {
        String sql = "insert into NOTICIA_MARCADA(Titulo,Descripcion,Fecha,Prioridad,Fuente,Enlace,Imagen,Fechaguardado,FK_NoticiaMarcada_UsuarioCedula) values (?,?,?,?,?,?,?,SYSDATETIME(),?)";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, noticiaMarcada.getTitulo());
        stm.setString(2, noticiaMarcada.getDescripcion());
        java.util.Date fechaUtil = noticiaMarcada.getFechaGuardado();
        java.sql.Date fechaSql = new java.sql.Date(fechaUtil.getTime());
        stm.setString(3, noticiaMarcada.getFecha());
        stm.setString(4, noticiaMarcada.getPrioridad());
        stm.setString(5, noticiaMarcada.getFuente());
        stm.setString(6, noticiaMarcada.getEnlace());
        stm.setString(7, noticiaMarcada.getImagen());
        stm.setString(8, noticiaMarcada.getUsuarioCedula());
        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se creo");
        } else {
            this.registrarNoticiaEtiqueta(noticiaMarcada.getTitulo(), "Noticia Externa", noticiaMarcada.getUsuarioCedula());
        }
    }


    public void deleteNoticiaMarcada(String noticiaMarcadaId, String Cedula) throws Exception {

        int id = Integer.parseInt(noticiaMarcadaId);

        String sql = "DELETE FROM NOTICIA_MARCADA\n" +
                "WHERE Fk_NoticiaMarcada_UsuarioCedula = ? \n" +
                "AND PK_NoticiaMarcada_Id = ?;\n";

        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, Cedula);
        stm.setInt(2, id);

        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se creo");
        }
    }

    public void deleteEtiquetasNoticia(String noticiaMarcadaId) throws Exception {
        int id = Integer.parseInt(noticiaMarcadaId); // Convertir a int

        String sql = "DELETE FROM NOTICIAMARCADA_ETIQUETA\n" +
                "WHERE FK_NOTICIAMARCADAETIQUETA_NOTICIAMARCADAID = ?;\n";



        PreparedStatement stm = db.prepareStatement(sql);
        stm.setInt(1, id); // Establecer el parámetro como un int

        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se creo");
        }
    }

    //public static void main(String[] args) {
    //  Database db = new Database();
    // NoticiaMarcadaDao dao = new NoticiaMarcadaDao(db);

    // try {

    //    dao.deleteNoticiaMarcada(1002,"4-0258-0085");
    //    System.out.println("La noticia marcada fue eliminada correctamente.");
    // } catch (Exception e) {
    //     System.err.println("Error al eliminar la noticia marcada: " + e.getMessage());
    //     e.printStackTrace();
    // }
    // }


    public List<NoticiaMarcada> getAllNoticiasMarcadas(String usuarioCedula) throws SQLException {
        String sql = "SELECT * FROM NOTICIA_MARCADA WHERE Fk_NoticiaMarcada_UsuarioCedula = ?";
        List<NoticiaMarcada> noticiasMarcadas = new ArrayList<>();

        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setString(1, usuarioCedula);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    NoticiaMarcada noticiaMarcada = mapResultSetToNoticiaMarcada(resultSet);
                    List<Etiqueta> etiquetas = etiquetaDao.getEtiquetasByNoticiaMarcadaId(noticiaMarcada.getId());
                    noticiaMarcada.setEtiquetas(etiquetas);

                    noticiasMarcadas.add(noticiaMarcada);
                }
                return noticiasMarcadas;
            }
        }
    }

    public List<NoticiaMarcada> getNoticiaXPrioridad(String prioridad, String usuarioCedula){
        String sql = "SELECT * \n" +
                "FROM NOTICIA_MARCADA \n" +
                "WHERE Prioridad = ? \n" +
                "AND Fk_NoticiaMarcada_UsuarioCedula = ?";

        List<NoticiaMarcada> noticiasMarcadas = new ArrayList<>();
        try(PreparedStatement statement = db.prepareStatement(sql)){

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    NoticiaMarcada noticiaMarcada = mapResultSetToNoticiaMarcada(resultSet);
                    List<Etiqueta> etiquetas = etiquetaDao.getEtiquetasByNoticiaMarcadaId(noticiaMarcada.getId());
                    noticiaMarcada.setEtiquetas(etiquetas);
                    noticiasMarcadas.add(noticiaMarcada);
                }
                return noticiasMarcadas;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private NoticiaMarcada mapResultSetToNoticiaMarcada(ResultSet resultSet) throws SQLException {
        int NoticiaMarcadaId = resultSet.getInt("PK_NoticiaMarcada_Id");
        String titulo = resultSet.getString("Titulo");
        String descripcion = resultSet.getString("Descripcion");
        String fecha = resultSet.getString("Fecha");
        String prioridad = resultSet.getString("Prioridad");
        String fuente = resultSet.getString("Fuente");
        String enlace = resultSet.getString("Enlace");
        String imagen = resultSet.getString("Imagen");
        Date fechaGuardado = resultSet.getDate("Fechaguardado");
        String usuarioCedula = resultSet.getString("Fk_NoticiaMarcada_UsuarioCedula");
        return new NoticiaMarcada(NoticiaMarcadaId, titulo, descripcion, fecha, prioridad, fuente, enlace, imagen, fechaGuardado, usuarioCedula);
        //coment
    }

    public void registrarNoticiaEtiqueta(String noticiatitle, String EtiquetaDescipcion, String Cedula) throws Exception {
        if (EtiquetaDescipcion == null || EtiquetaDescipcion.isEmpty()) {
            throw new IllegalArgumentException("La descripción de la etiqueta no puede ser nula o vacía.");
        }

        int noticiaId = 0;
        int etiquetaId = 0;
        String sql = "SELECT PK_NoticiaMarcada_Id FROM NOTICIA_MARCADA WHERE Titulo = ? AND FK_NoticiaMarcada_UsuarioCedula = ?";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setString(1, noticiatitle);
            statement.setString(2, Cedula);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    noticiaId = resultSet.getInt("PK_NoticiaMarcada_Id");
                } else {
                    throw new NotFoundException("No se encontró una noticia con el título proporcionado y la cédula especificada.");
                }
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener el valor de noticiaId: " + e.getMessage());

        }

        String sql2 = "SELECT PK_EtiquetaId FROM ETIQUETA WHERE Descripcion = ?";
        try (PreparedStatement statement2 = db.prepareStatement(sql2)) {
            statement2.setString(1, EtiquetaDescipcion);
            try (ResultSet resultSet2 = statement2.executeQuery()) {
                if (resultSet2.next()) {
                    etiquetaId = resultSet2.getInt("PK_EtiquetaId");
                    System.out.println(etiquetaId);
                } else {
                    throw new NotFoundException("No se encontró una noticia con el título proporcionado y la cédula especificada.");
                }
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener el valor de noticiaId: " + e.getMessage());

        }

        if (noticiaId != 0 && etiquetaId != 0) {
            String sql3 = "INSERT INTO NOTICIAMARCADA_ETIQUETA(FK_NOTICIAMARCADAETIQUETA_NOTICIAMARCADAID,FKETIQUETA) values(?,?)";
            PreparedStatement stm3 = db.prepareStatement(sql3);
            stm3.setInt(1, noticiaId);
            stm3.setInt(2, etiquetaId);
            int count = db.executeUpdate(stm3);
            if (count == 0) {
                throw new Exception("No se creo");
            }
        }
    }

    public NoticiaMarcada noticiaPorIDyUsuario(String usuarioCedula, int noticiaId) throws Exception {
        List<NoticiaMarcada> noticias = getAllNoticiasMarcadas(usuarioCedula);
        NoticiaMarcada noticiaCoincidiente = new NoticiaMarcada();
        for (int i = 0; i < noticias.size(); i++) {
            if (noticias.get(i).getId() == noticiaId) {
                noticiaCoincidiente = noticias.get(i);
            }
        }
        return noticiaCoincidiente;
    }

    public void actualizarPrioridad(NoticiaMarcada noticiaMarcada) throws SQLException {
        String sql = "update NOTICIA_MARCADA set Prioridad = ? where PK_NoticiaMarcada_Id=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, noticiaMarcada.getPrioridad());
        stm.setInt(2, noticiaMarcada.getId());
        db.executeUpdate(stm);
    }
}