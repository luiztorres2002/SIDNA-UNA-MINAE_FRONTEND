package data;

import logic.Etiqueta;
import logic.NoticiasAsociadas;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EtiquetaDao {
    Database db;

    UsuarioDao usuarioDao;

    public EtiquetaDao(Database db) {
        this.db = db;

    }
    public List<Etiqueta> getAllEtiquetasByUsuario(String usuarioCedula) throws SQLException {
        String cedulaDes = db.descifrarCedula(usuarioCedula);
        String sql = "SELECT e.PK_EtiquetaId, e.Descripcion, ue.Estado " +
                "FROM ETIQUETA e " +
                "JOIN Usuario_Etiqueta ue ON e.PK_EtiquetaId = ue.Fk_UsuarioEtiqueta_EtiquetaId " +
                "WHERE ue.Fk_UsuarioEtiqueta_UsuarioId = ?";
        List<Etiqueta> etiquetas = new ArrayList<>();
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setString(1, cedulaDes);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    Etiqueta etiqueta = mapResultSetToEtiqueta(resultSet);
                    int numNoticiasAsociadas = getNumNoticiasAsociadas(etiqueta.getEtiquetaId(), cedulaDes);
                    etiqueta.setNoticiasAsociadas(numNoticiasAsociadas);
                    etiqueta.setUsuarioCedula(cedulaDes);
                    etiquetas.add(etiqueta);
                }
            }
        }
        return etiquetas;
    }

    public void actualizarEstadoEtiqueta(int etiquetaId, boolean nuevoEstado, String usuarioCedula) throws SQLException {
        String cedulaDes = db.descifrarCedula(usuarioCedula);
        String sql = "UPDATE Usuario_Etiqueta SET Estado = ? WHERE Fk_UsuarioEtiqueta_EtiquetaId = ? AND Fk_UsuarioEtiqueta_UsuarioId = ?";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setBoolean(1, nuevoEstado);
            statement.setInt(2, etiquetaId);
            statement.setString(3, cedulaDes);
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Etiqueta getEtiquetaById(int etiquetaId, String usuarioCedula) throws SQLException {
        String cedulaDes = db.descifrarCedula(usuarioCedula);
        String sql = "SELECT e.PK_EtiquetaId, e.Descripcion, ue.Estado " +
                "FROM ETIQUETA e " +
                "JOIN Usuario_Etiqueta ue ON e.PK_EtiquetaId = ue.Fk_UsuarioEtiqueta_EtiquetaId " +
                "WHERE e.PK_EtiquetaId = ? AND ue.Fk_UsuarioEtiqueta_UsuarioId = ?";

        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setInt(1, etiquetaId);
            statement.setString(2, cedulaDes);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return mapResultSetToEtiqueta(resultSet);
                }
            }
        }

        return null;
    }

    public List<Etiqueta> getEtiquetasByNoticiaMarcadaId(int noticiaId, String usuarioCedula) throws SQLException {
        List<Etiqueta> etiquetas = new ArrayList<>();
        String sql = "SELECT DISTINCT ET.PK_EtiquetaId, ET.Descripcion, UE.Estado " +
                "FROM NOTICIA_ETIQUETA NE " +
                "JOIN ETIQUETA ET ON NE.FK_NOTICIAETIQUETA_ETIQUETAID = ET.PK_EtiquetaId " +
                "JOIN Usuario_Etiqueta UE ON NE.FK_NOTICIAETIQUETA_ETIQUETAID = UE.Fk_UsuarioEtiqueta_EtiquetaId " +
                "WHERE NE.FK_NOTICIAETIQUETA_NOTICIAID = ?"+
                "AND NE.FK_UsuarioCedula = ?";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setInt(1, noticiaId);
            statement.setString(2, usuarioCedula);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    int etiquetaId = resultSet.getInt("PK_EtiquetaId");
                    String descripcion = resultSet.getString("Descripcion");
                    boolean estado = resultSet.getBoolean("Estado");

                    Etiqueta etiqueta = new Etiqueta(etiquetaId, descripcion, estado);
                    etiquetas.add(etiqueta);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error al ejecutar la consulta SQL: " + e.getMessage());
            throw e;
        }
        return etiquetas;
    }

    public List<Etiqueta> getEtiquetasHabilitadas(String cedula) throws SQLException {
        String cedulaDes = db.descifrarCedula(cedula);
        String sql = "SELECT e.PK_EtiquetaId, e.Descripcion " +
                "FROM ETIQUETA e " +
                "JOIN Usuario_Etiqueta ue ON e.PK_EtiquetaId = ue.Fk_UsuarioEtiqueta_EtiquetaId " +
                "WHERE ue.Fk_UsuarioEtiqueta_UsuarioId = ? AND ue.Estado = 1";
        List<Etiqueta> etiquetas = new ArrayList<>();
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setString(1, cedulaDes);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    int etiquetaId = resultSet.getInt("PK_EtiquetaId");
                    String descripcion = resultSet.getString("Descripcion");

                    Etiqueta etiqueta = new Etiqueta(etiquetaId, descripcion, true);

                    etiqueta.setUsuarioCedula(cedulaDes);
                    etiquetas.add(etiqueta);
                }
            }
        }
        return etiquetas;
    }

    private Etiqueta mapResultSetToEtiqueta(ResultSet resultSet) throws SQLException {
        int etiquetaId = resultSet.getInt("PK_EtiquetaId");
        String descripcion = resultSet.getString("Descripcion");
        boolean estado = resultSet.getBoolean("Estado");
        return new Etiqueta(etiquetaId, descripcion, estado);
    }

    public void addEtiqueta(Etiqueta etiqueta, String cedula) throws SQLException {
        String cedulaDes = db.descifrarCedula(cedula);
        String sql1 = "SELECT PK_EtiquetaId FROM ETIQUETA WHERE Descripcion = ?";
        try (PreparedStatement stm1 = db.prepareStatement(sql1)) {
            stm1.setString(1, etiqueta.getDescripcion());
            try (ResultSet rs = stm1.executeQuery()) {
                if (rs.next()) {

                    int etiquetaId = rs.getInt("PK_EtiquetaId");

                    insertUsuarioEtiqueta(cedulaDes, etiquetaId, etiqueta.getEstado());
                    System.out.println("La etiqueta se asoció correctamente con el ID: " + etiquetaId);
                } else {

                    int etiquetaId = insertEtiqueta(etiqueta);
                    insertUsuarioEtiqueta(cedulaDes, etiquetaId, etiqueta.getEstado());
                    System.out.println("La etiqueta se creó correctamente con el ID: " + etiquetaId);
                }
            }
        }
    }

    private int insertEtiqueta(Etiqueta etiqueta) throws SQLException {
        String sql = "INSERT INTO ETIQUETA (Descripcion) VALUES (?)";
        int etiquetaId = -1;
        try (PreparedStatement stm = db.prepareStatement(sql)) {
            stm.setString(1, etiqueta.getDescripcion());
            int affectedRows = stm.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("No se pudo insertar la etiqueta");
            }
        }

        String selectIdSql = "SELECT TOP 1 PK_EtiquetaId FROM ETIQUETA ORDER BY PK_EtiquetaId DESC";
        try (PreparedStatement selectStm = db.prepareStatement(selectIdSql);
             ResultSet rs = selectStm.executeQuery()) {
            if (rs.next()) {
                etiquetaId = rs.getInt("PK_EtiquetaId");
            } else {
                throw new SQLException("No se pudo obtener el ID de la etiqueta insertada");
            }
        }
        return etiquetaId;
    }


    private void insertUsuarioEtiqueta(String cedula, int etiquetaId, boolean estado) throws SQLException {
        String sql = "INSERT INTO Usuario_Etiqueta (Fk_UsuarioEtiqueta_UsuarioId, Fk_UsuarioEtiqueta_EtiquetaId, Estado) VALUES (?, ?, ?)";
        try (PreparedStatement stm = db.prepareStatement(sql)) {
            stm.setString(1, cedula);
            stm.setInt(2, etiquetaId);
            stm.setBoolean(3, estado);
            int affectedRows = stm.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("No se pudo insertar la relación Usuario-Etiqueta");
            }
        }
    }

    public void limpiarEtiquetasHuerfanas() throws SQLException {
        String sql = "DELETE FROM ETIQUETA WHERE PK_EtiquetaId NOT IN (SELECT Fk_UsuarioEtiqueta_EtiquetaId FROM Usuario_Etiqueta)";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.executeUpdate();
        }
    }


    public void updateEtiqueta(Etiqueta etiqueta, String cedula) throws SQLException {
        String cedulaDes = db.descifrarCedula(cedula);

        boolean noticiasAsociadas = false;
        String sqlCheckNoticiasAsociadas = "SELECT COUNT(*) AS NumNoticias FROM NOTICIA_ETIQUETA NE " +
                "JOIN Usuario_Noticia UN ON NE.FK_NOTICIAETIQUETA_NOTICIAID = UN.Fk_UsuarioNoticia_NoticiaId " +
                "WHERE NE.FK_NOTICIAETIQUETA_ETIQUETAID = ? AND UN.Fk_UsuarioNoticia_UsuarioId = ?";
        try (PreparedStatement stmCheckNoticiasAsociadas = db.prepareStatement(sqlCheckNoticiasAsociadas)) {
            stmCheckNoticiasAsociadas.setInt(1, etiqueta.getEtiquetaId());
            stmCheckNoticiasAsociadas.setString(2, cedulaDes);
            try (ResultSet rs = stmCheckNoticiasAsociadas.executeQuery()) {
                if (rs.next()) {
                    int numNoticias = rs.getInt("NumNoticias");
                    if (numNoticias > 0) {
                        noticiasAsociadas = true;
                    }
                }
            }
        }

        if (noticiasAsociadas) {
            throw new SQLException("No se puede actualizar la etiqueta porque hay noticias asociadas.");
        } else {
            int etiquetaId = -1;

            String sqlSelectEtiquetaId = "SELECT PK_EtiquetaId FROM ETIQUETA WHERE Descripcion = ?";
            try (PreparedStatement stmSelectEtiquetaId = db.prepareStatement(sqlSelectEtiquetaId)) {
                stmSelectEtiquetaId.setString(1, etiqueta.getDescripcion());
                try (ResultSet rs = stmSelectEtiquetaId.executeQuery()) {
                    if (rs.next()) {
                        etiquetaId = rs.getInt("PK_EtiquetaId");
                    }
                }
            }
            if (etiquetaId != -1) {
                String sqlCheckUsuarioAsociado = "SELECT COUNT(*) AS NumUsuarios FROM Usuario_Etiqueta WHERE Fk_UsuarioEtiqueta_EtiquetaId = ?";
                try (PreparedStatement stmCheckUsuarioAsociado = db.prepareStatement(sqlCheckUsuarioAsociado)) {
                    stmCheckUsuarioAsociado.setInt(1, etiquetaId);
                    try (ResultSet rs = stmCheckUsuarioAsociado.executeQuery()) {
                        rs.next();
                        int numUsuarios = rs.getInt("NumUsuarios");
                        if (numUsuarios > 1) {
                            etiquetaId = insertEtiqueta(etiqueta);
                        }
                    }
                }
            } else {
                etiquetaId = insertEtiqueta(etiqueta);
            }

            if (etiquetaId != -1) {
                String sqlUpdateUsuarioEtiqueta = "UPDATE Usuario_Etiqueta SET Fk_UsuarioEtiqueta_EtiquetaId = ? WHERE Fk_UsuarioEtiqueta_UsuarioId = ? AND Fk_UsuarioEtiqueta_EtiquetaId = ?";
                try (PreparedStatement stmUpdateUsuarioEtiqueta = db.prepareStatement(sqlUpdateUsuarioEtiqueta)) {
                    stmUpdateUsuarioEtiqueta.setInt(1, etiquetaId);
                    stmUpdateUsuarioEtiqueta.setString(2, cedulaDes);
                    stmUpdateUsuarioEtiqueta.setInt(3, etiqueta.getEtiquetaId());
                    stmUpdateUsuarioEtiqueta.executeUpdate();
                }

                String sqlDeleteOldUsuarioEtiqueta = "DELETE FROM Usuario_Etiqueta WHERE Fk_UsuarioEtiqueta_UsuarioId = ? AND Fk_UsuarioEtiqueta_EtiquetaId = ?";
                try (PreparedStatement stmDeleteOldUsuarioEtiqueta = db.prepareStatement(sqlDeleteOldUsuarioEtiqueta)) {
                    stmDeleteOldUsuarioEtiqueta.setString(1, cedulaDes);
                    stmDeleteOldUsuarioEtiqueta.setInt(2, etiqueta.getEtiquetaId());
                    stmDeleteOldUsuarioEtiqueta.executeUpdate();
                }
                limpiarEtiquetasHuerfanas();
            }
        }
    }

    public int getNumNoticiasAsociadas(int etiquetaId, String usuarioCedula) throws SQLException {
        int numNoticias = 0;
        String sql = "SELECT COUNT(*) AS NumNoticias FROM Usuario_Noticia " +
                "WHERE Fk_UsuarioNoticia_NoticiaId IN " +
                "(SELECT FK_NOTICIAETIQUETA_NOTICIAID FROM NOTICIA_ETIQUETA " +
                "WHERE FK_NOTICIAETIQUETA_ETIQUETAID = ?) " +
                "AND Fk_UsuarioNoticia_UsuarioId = ?";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setInt(1, etiquetaId);
            statement.setString(2, usuarioCedula);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    numNoticias = resultSet.getInt("NumNoticias");
                }
            }
        }
        return numNoticias;
    }

    public static void main(String[] args) {
        try {
            Database db = new Database();
            EtiquetaDao etiquetaDao = new EtiquetaDao(db);

            int etiquetaId = 4;
            boolean nuevoEstado = true;
            String usuarioCedula = "BEkVW3uNlIl5ouB2d59KCQ==";

            etiquetaDao.actualizarEstadoEtiqueta(etiquetaId, nuevoEstado, usuarioCedula);
            System.out.println("Estado de la etiqueta actualizado correctamente.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
