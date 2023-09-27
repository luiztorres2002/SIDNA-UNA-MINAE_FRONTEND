package data;

import logic.Etiqueta;

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
                    etiquetas.add(mapResultSetToEtiqueta(resultSet));
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

            e.printStackTrace(); // Prints the exception stack trace to the console.

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

    private Etiqueta mapResultSetToEtiqueta(ResultSet resultSet) throws SQLException {
        int etiquetaId = resultSet.getInt("PK_EtiquetaId");
        String descripcion = resultSet.getString("Descripcion");
        String usuarioCedula = resultSet.getString("FK_Etiqueta_UsuarioCedula");
        boolean estado = resultSet.getBoolean("Estado");
        return new Etiqueta(etiquetaId, descripcion, usuarioCedula, estado);
    }

        public void addEtiqueta(String etiqueta) throws SQLException {
            String sql = "INSERT INTO ETIQUETA (Descripcion,FK_Etiqueta_UsuarioCedula,Estado) VALUES (?,?,?)";
            try (PreparedStatement statement = db.prepareStatement(sql)) {
                statement.setString(1, etiqueta);
                statement.setString(1, "1");
                statement.setBoolean(1, true);
                statement.executeUpdate();
            } catch (SQLException e) {

                e.printStackTrace(); // Prints the exception stack trace to the console.

            }
        }


    public void updateEtiqueta(Etiqueta etiqueta) throws SQLException {
        String sql = "update Etiqueta set Descripcion=? where PK_EtiquetaId=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, etiqueta.getDescripcion());
        stm.setInt(2, etiqueta.getEtiquetaId());
        db.executeUpdate(stm);
    }
}


