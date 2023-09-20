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



    private Etiqueta mapResultSetToEtiqueta(ResultSet resultSet) throws SQLException {
        int etiquetaId = resultSet.getInt("PK_EtiquetaId");
        String descripcion = resultSet.getString("Descripcion");
        String usuarioCedula = resultSet.getString("FK_Etiqueta_UsuarioCedula");
        return new Etiqueta(etiquetaId, descripcion, usuarioCedula);
    }
}
