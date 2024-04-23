package data;

import jakarta.ws.rs.NotFoundException;
import logic.Etiqueta;
import logic.NoticiaMarcada;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
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
        int noticiaId = obtenerIdNoticiaExistente(noticiaMarcada);
        String cedula = db.descifrarCedula(noticiaMarcada.getUsuarioCedula());

        if (noticiaId == -1) {
            String sql = "INSERT INTO NOTICIA (Titulo, Descripcion, Fecha, Fuente, Enlace, Imagen) VALUES (?, ?, ?, ?, ?, ?); SELECT SCOPE_IDENTITY()";
            PreparedStatement stm = db.prepareStatement(sql);
            stm.setString(1, noticiaMarcada.getTitulo());
            stm.setString(2, noticiaMarcada.getDescripcion());
            stm.setString(3, noticiaMarcada.getFecha());
            stm.setString(4, noticiaMarcada.getFuente());
            stm.setString(5, noticiaMarcada.getEnlace());
            stm.setString(6, noticiaMarcada.getImagen());

            ResultSet rs = stm.executeQuery();
            if (rs.next()) {
                noticiaId = rs.getInt(1);
            } else {
                throw new Exception("No se pudo obtener el ID de la noticia creada");
            }
        } else {
            String sqlCheckUsuarioNoticia = "SELECT COUNT(*) AS NumNoticias FROM Usuario_Noticia WHERE Fk_UsuarioNoticia_NoticiaId = ? AND Fk_UsuarioNoticia_UsuarioId = ?";
            try (PreparedStatement stmCheckUsuarioNoticia = db.prepareStatement(sqlCheckUsuarioNoticia)) {
                stmCheckUsuarioNoticia.setInt(1, noticiaId);
                stmCheckUsuarioNoticia.setString(2, cedula);
                try (ResultSet rs = stmCheckUsuarioNoticia.executeQuery()) {
                    rs.next();
                    int numNoticias = rs.getInt("NumNoticias");
                    if (numNoticias > 0) {
                        System.out.println("noticia existente: " );
                        throw new Exception("La noticia ya está asociada al usuario");
                    }
                }
            }
        }

        asociarNoticiaConUsuarioYEtiquetas(cedula, noticiaId, noticiaMarcada.getEtiquetas(), noticiaMarcada.getPrioridad());
    }

    private int obtenerIdNoticiaExistente(NoticiaMarcada noticiaMarcada) throws SQLException {
        String sql = "SELECT PK_Noticia_Id FROM NOTICIA WHERE Titulo = ?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, noticiaMarcada.getTitulo());
        ResultSet rs = stm.executeQuery();
        if (rs.next()) {
            int id = rs.getInt("PK_Noticia_Id");
            System.out.println("ID de la noticia existente: " + id);
            return id;
        } else {
            return -1;
        }
    }

    private void asociarNoticiaConUsuarioYEtiquetas(String usuarioCedula, int noticiaId, List<Etiqueta> etiquetas, String prioridad) throws SQLException {
        String insertUsuarioNoticiaSQL = "INSERT INTO Usuario_Noticia (Fk_UsuarioNoticia_UsuarioId, Fk_UsuarioNoticia_NoticiaId, FechaGuardado, Prioridad) VALUES (?, ?, SYSDATETIME(), ?)";
        PreparedStatement stmUsuarioNoticia = db.prepareStatement(insertUsuarioNoticiaSQL);
        stmUsuarioNoticia.setString(1, usuarioCedula);
        stmUsuarioNoticia.setInt(2, noticiaId);
        stmUsuarioNoticia.setString(3, prioridad);
        stmUsuarioNoticia.executeUpdate();

        for (Etiqueta etiqueta : etiquetas) {
            int etiquetaId = obtenerIdEtiqueta(etiqueta.getDescripcion());
            String insertNoticiaEtiquetaSQL = "INSERT INTO NOTICIA_ETIQUETA (FK_NOTICIAETIQUETA_NOTICIAID, FK_NOTICIAETIQUETA_ETIQUETAID, FK_UsuarioCedula) VALUES (?, ?, ?)";
            PreparedStatement stmNoticiaEtiqueta = db.prepareStatement(insertNoticiaEtiquetaSQL);
            stmNoticiaEtiqueta.setInt(1, noticiaId);
            stmNoticiaEtiqueta.setInt(2, etiquetaId);
            stmNoticiaEtiqueta.setString(3, usuarioCedula);
            try {
                stmNoticiaEtiqueta.executeUpdate();
            } catch (SQLException e) {

                System.err.println("Error al ejecutar la consulta SQL: " + e.getMessage());
                e.printStackTrace();

            }
        }
    }

    private int obtenerIdEtiqueta(String descripcion) throws SQLException {
        String sql = "SELECT PK_EtiquetaId FROM ETIQUETA WHERE Descripcion = ?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, descripcion);
        ResultSet rs = stm.executeQuery();
        if (rs.next()) {
            return rs.getInt("PK_EtiquetaId");
        } else {
            throw new SQLException("No se encontró la etiqueta con la descripción proporcionada");
        }
    }

    public void deleteNoticia(String noticiaId, String usuarioId) throws SQLException {
        String cedulaDes = db.descifrarCedula(usuarioId);
        int id = Integer.parseInt(noticiaId);

        String sqlDeleteUsuarioNoticia = "DELETE FROM Usuario_Noticia " +
                "WHERE Fk_UsuarioNoticia_NoticiaId = ? AND Fk_UsuarioNoticia_UsuarioId = ?";
        try (PreparedStatement stmDeleteUsuarioNoticia = db.prepareStatement(sqlDeleteUsuarioNoticia)) {
            stmDeleteUsuarioNoticia.setInt(1, id);
            stmDeleteUsuarioNoticia.setString(2, cedulaDes);
            stmDeleteUsuarioNoticia.executeUpdate();
        }

        String sqlDeleteNoticiaEtiqueta = "DELETE FROM Noticia_Etiqueta " +
                "WHERE Fk_NoticiaEtiqueta_NoticiaId = ? AND FK_UsuarioCedula = ?";
        try (PreparedStatement stmDeleteNoticiaEtiqueta = db.prepareStatement(sqlDeleteNoticiaEtiqueta)) {
            stmDeleteNoticiaEtiqueta.setInt(1, id);
            stmDeleteNoticiaEtiqueta.setString(2, cedulaDes);
            stmDeleteNoticiaEtiqueta.executeUpdate();
        }

        borrarNoticiasHuerfanas();
    }

    public void borrarNoticiasHuerfanas() throws SQLException {
        String sql = "DELETE FROM Noticia WHERE NOT EXISTS (" +
                "SELECT 1 FROM Usuario_Noticia WHERE Fk_UsuarioNoticia_NoticiaId = Noticia.PK_Noticia_Id) " +
                "AND NOT EXISTS (" +
                "SELECT 1 FROM Noticia_Etiqueta WHERE Fk_NoticiaEtiqueta_NoticiaId = Noticia.PK_Noticia_Id)";

        try (PreparedStatement statement = db.prepareStatement(sql)) {
            int affectedRows = statement.executeUpdate();
        }
    }


    public static void main(String[] args) {
        Database db = new Database();
        NoticiaMarcadaDao dao = new NoticiaMarcadaDao(db);
        try {
            dao.getAllNoticiasMarcadas("BEkVW3uNlIl5ouB2d59KCQ==");
        }   catch (Exception e) {
            System.err.println("Error " + e.getMessage());
            e.printStackTrace();
        }
    }


    public List<NoticiaMarcada> getAllNoticiasMarcadas(String usuarioCedula) throws SQLException {
        String cedulaDes = db.descifrarCedula(usuarioCedula);
        String sql = "SELECT NM.*, UN.FechaGuardado, UN.Prioridad FROM NOTICIA NM " +
                "INNER JOIN Usuario_Noticia UN ON NM.PK_Noticia_Id = UN.Fk_UsuarioNoticia_NoticiaId " +
                "WHERE UN.Fk_UsuarioNoticia_UsuarioId = ?";
        List<NoticiaMarcada> noticiasMarcadas = new ArrayList<>();

        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setString(1, cedulaDes);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    NoticiaMarcada noticia = mapResultSetToNoticiaMarcada(resultSet, cedulaDes);
                    List<Etiqueta> etiquetas = etiquetaDao.getEtiquetasByNoticiaMarcadaId(noticia.getId(),cedulaDes);
                    noticia.setEtiquetas(etiquetas);

                    noticiasMarcadas.add(noticia);
                }
            }
        }
        return noticiasMarcadas;
    }


    private NoticiaMarcada mapResultSetToNoticiaMarcada(ResultSet resultSet, String usuarioCedula) throws SQLException {
        int noticiaId = resultSet.getInt("PK_Noticia_Id");
        String titulo = resultSet.getString("Titulo");
        String descripcion = resultSet.getString("Descripcion");
        String fecha = resultSet.getString("Fecha");
        String fuente = resultSet.getString("Fuente");
        String enlace = resultSet.getString("Enlace");
        String imagen = resultSet.getString("Imagen");
        Date fechaGuardado = resultSet.getDate("FechaGuardado");
        String prioridad = resultSet.getString("Prioridad");
        return new NoticiaMarcada(noticiaId, titulo, descripcion, fecha, prioridad, fuente, enlace, imagen, fechaGuardado, usuarioCedula);
    }

    public void actualizarPrioridad(String usuarioCedula, int noticiaId, String nuevaPrioridad) {
        String cedulaDes = db.descifrarCedula(usuarioCedula);
        String sql = "UPDATE Usuario_Noticia SET Prioridad = ? WHERE Fk_UsuarioNoticia_UsuarioId = ? AND Fk_UsuarioNoticia_NoticiaId = ?";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setString(1, nuevaPrioridad);
            statement.setString(2, cedulaDes);
            statement.setInt(3, noticiaId);
            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Error al actualizar la prioridad en Usuario_Noticia", e);
        }
    }
}