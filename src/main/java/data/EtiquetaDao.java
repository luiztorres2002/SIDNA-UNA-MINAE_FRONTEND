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
        String sql = "SELECT * FROM ETIQUETA WHERE FK_Etiqueta_UsuarioCedula = ?";
        List<Etiqueta> etiquetas = new ArrayList<>();
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setString(1, usuarioCedula);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    Etiqueta etiqueta = mapResultSetToEtiqueta(resultSet);
                    int etiquetaId = etiqueta.getEtiquetaId();
                    List<NoticiasAsociadas> noticiasAsociadas = getNoticiasAsociadas(etiquetaId);
                    etiqueta.setNoticiasAsociadas(noticiasAsociadas.size());
                    etiquetas.add(etiqueta);
                }
                return etiquetas;
            }
        }
    }


    public void actualizarEstadoEtiqueta(int etiquetaId, boolean nuevoEstado) throws SQLException {
        String sql = "UPDATE ETIQUETA SET Estado = ? WHERE PK_EtiquetaId = ?";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setBoolean(1, nuevoEstado);
            statement.setInt(2, etiquetaId);
            statement.executeUpdate();
        } catch (SQLException e) {

            e.printStackTrace();

        }
    }

    public Etiqueta getEtiquetaById(int etiquetaId) throws SQLException {
        String sql = "SELECT * FROM ETIQUETA WHERE PK_EtiquetaId = ?";

        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setInt(1, etiquetaId);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    return mapResultSetToEtiqueta(resultSet);
                }
            }
        }

        return null;
    }

    public List<Etiqueta> getEtiquetasByNoticiaMarcadaId(int noticiaMarcadaId) throws SQLException {
        List<Etiqueta> etiquetas = new ArrayList<>();
        String sql = "SELECT E.* FROM ETIQUETA E " +
                "INNER JOIN NOTICIAMARCADA_ETIQUETA NE ON E.PK_EtiquetaId = NE.FKETIQUETA " +
                "WHERE NE.FK_NOTICIAMARCADAETIQUETA_NOTICIAMARCADAID = ?";

        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setInt(1, noticiaMarcadaId);

            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    Etiqueta etiqueta = mapResultSetToEtiqueta(resultSet);
                    etiquetas.add(etiqueta);
                }
            }
        }

        return etiquetas;
    }

    public List<Etiqueta> getEtiquetasHabilitadas(String cedula) throws SQLException {
        String sql = "SELECT * FROM ETIQUETA WHERE FK_Etiqueta_UsuarioCedula = ? AND Estado = ?";
        List<Etiqueta> etiquetas = new ArrayList<>();
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setString(1, cedula);
            statement.setBoolean(2, true);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    etiquetas.add(mapResultSetToEtiqueta(resultSet));
                }
                return etiquetas;
            }
        }
    }


    private Etiqueta mapResultSetToEtiqueta(ResultSet resultSet) throws SQLException {
        int etiquetaId = resultSet.getInt("PK_EtiquetaId");
        String descripcion = resultSet.getString("Descripcion");
        String usuarioCedula = resultSet.getString("FK_Etiqueta_UsuarioCedula");
        boolean estado = resultSet.getBoolean("Estado");
        return new Etiqueta(etiquetaId, descripcion, usuarioCedula, estado);
    }

        public void addEtiqueta(Etiqueta etiqueta) throws SQLException {
            String sql = "INSERT INTO ETIQUETA (Descripcion,FK_Etiqueta_UsuarioCedula,Estado) VALUES (?,?,?)";
            try (PreparedStatement statement = db.prepareStatement(sql)) {
                statement.setString(1, etiqueta.getDescripcion());
                statement.setString(2, etiqueta.getUsuarioCedula());
                statement.setBoolean(3, etiqueta.getEstado());
                statement.executeUpdate();
            } catch (SQLException e) {

                e.printStackTrace();
            }
        }


    public void updateEtiqueta(Etiqueta etiqueta) throws SQLException {
        String sql = "update Etiqueta set Descripcion=? where PK_EtiquetaId=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, etiqueta.getDescripcion());
        stm.setInt(2, etiqueta.getEtiquetaId());
        db.executeUpdate(stm);
    }

    public List<NoticiasAsociadas> getNoticiasAsociadas(int etiquetaId) throws SQLException {
        List<NoticiasAsociadas> noticiasAsociadas = new ArrayList<>();
        String sql = "select * from NOTICIAMARCADA_ETIQUETA where FKETIQUETA=?";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setInt(1, etiquetaId);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    NoticiasAsociadas noticia = fromAsociadas(resultSet);
                    noticiasAsociadas.add(noticia);
                }
            }
        }
        return noticiasAsociadas;
    }

    private NoticiasAsociadas fromAsociadas(ResultSet resultSet) throws SQLException {
        int noticiaId = resultSet.getInt("FK_NOTICIAMARCADAETIQUETA_NOTICIAMARCADAID");
        int etiquetaId = resultSet.getInt("FKETIQUETA");
        return new NoticiasAsociadas(noticiaId, etiquetaId);
    }
}


