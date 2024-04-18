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

        /*
        //Versión con nueva BD (SIDNA_BATABASE)
            String sql = "UPDATE ETIQUETA SET Estado = ? WHERE PK_EtiquetaId = ?";
            try (PreparedStatement statement = db.prepareStatement(sql)) {
                statement.setBoolean(1, nuevoEstado);
                statement.setInt(2, etiquetaId);
                statement.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();

            }*/

        //Versión con BD vieja
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

    public void addEtiqueta(Etiqueta etiqueta) throws Exception {


         //Nueva Base de datos
        /*
        String cedula = "4-0258-0085";
        String sql1 = "SELECT * FROM ETIQUETA WHERE Descripcion = ?";
        PreparedStatement stm = db.prepareStatement(sql1);
        stm.setString(1, etiqueta.getDescripcion());

        ResultSet rs = stm.executeQuery();

        if (!rs.next()) {
            String sql2 = "INSERT INTO ETIQUETA (Descripcion) VALUES (?)";
            PreparedStatement stm2 = db.prepareStatement(sql2);
            stm2.setString(1, etiqueta.getDescripcion());
            int count2 = db.executeUpdate(stm2);
            if (count2 == 0) {
                throw new Exception("No se creó");
            } else {
                String sql3 = "SELECT PK_EtiquetaId FROM ETIQUETA WHERE Descripcion = ?";
                PreparedStatement stm3 = db.prepareStatement(sql3);
                stm3.setString(1, etiqueta.getDescripcion());
                ResultSet rs2 = stm3.executeQuery();
                int etiquetaId = -1;
                if (rs2.next()) {
                    etiquetaId = rs2.getInt("PK_EtiquetaId");
                }
                String sql4 = "INSERT INTO Usuario_Etiqueta (Fk_UsuarioEtiqueta_UsuarioId, Fk_UsuarioEtiqueta_EtiquetaId, Estado) VALUES (?, ?, ?)";
                PreparedStatement stm4 = db.prepareStatement(sql4);
                stm4.setString(1, cedula);
                stm4.setInt(2, etiquetaId);
                stm4.setBoolean(3, etiqueta.getEstado());
                int count3 = db.executeUpdate(stm4);
                if (count3 == 0) {
                    throw new Exception("No se creó");
                } else {
                    System.out.println("La etiqueta se creó correctamente con el ID: " + etiquetaId);
                }
            }
        } else {
            // SI LA ETIQUETA YA EXISTE EN LA BASE DE DATOS
            int etiquetaId = rs.getInt("PK_EtiquetaId");
            String sql4 = "INSERT INTO Usuario_Etiqueta (Fk_UsuarioEtiqueta_UsuarioId, Fk_UsuarioEtiqueta_EtiquetaId, Estado) VALUES (?, ?, ?)";
            PreparedStatement stm4 = db.prepareStatement(sql4);
            stm4.setString(1, cedula);
            stm4.setInt(2, etiquetaId);
            stm4.setBoolean(3, etiqueta.getEstado());
            int count4 = stm4.executeUpdate();
            if (count4 == 0) {
                throw new Exception("No se creó la relación Usuario-Etiqueta");
            } else {
                System.out.println("La etiqueta se creó correctamente con el ID: " + etiquetaId);
            }
        }


*/
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


    public void updateEtiqueta(Etiqueta etiqueta /*, String cedula */) throws SQLException {
        /*
        Base de Datos Nueva

        String sql = "update ETIQUETA set Descripcion=? from Usuario_Etiqueta where Fk_UsuarioEtiqueta_UsuarioId=? and Fk_UsuarioEtiqueta_EtiquetaId=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, etiqueta.getDescripcion());
        stm.setInt(2, etiqueta.getEtiquetaId());
        stm.setString(3, cedula);
        db.executeUpdate(stm);

         */

        String sql = "update Etiqueta set Descripcion=? where PK_EtiquetaId=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, etiqueta.getDescripcion());
        stm.setInt(2, etiqueta.getEtiquetaId());
        db.executeUpdate(stm);
    }

    public List<NoticiasAsociadas> getNoticiasAsociadas(int etiquetaId /*, String cedula */) throws SQLException {
        /*
        Base de Datos Nueva

        List<NoticiasAsociadas> noticiasAsociadas = new ArrayList<>();
        String sql = "select * from Usuario_Etiqueta where Fk_UsuarioEtiqueta_EtiquetaId=? and Fk_UsuarioEtiqueta_UsuarioId=?";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setInt(1, etiquetaId);
            statement.setString(2, cedula);
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    NoticiasAsociadas noticia = fromAsociadas(resultSet);
                    noticiasAsociadas.add(noticia);
                }
            }
        }
        return noticiasAsociadas;
         */

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
        /*
        Base Datos Nueva

        int noticiaId = resultSet.getInt("FK_NOTICIAETIQUETA_NOTICIAID");
        int etiquetaId = resultSet.getInt("FK_NOTICIAETIQUETA_ETIQUETAID");
        return new NoticiasAsociadas(noticiaId, etiquetaId);

         */

        int noticiaId = resultSet.getInt("FK_NOTICIAMARCADAETIQUETA_NOTICIAMARCADAID");
        int etiquetaId = resultSet.getInt("FKETIQUETA");
        return new NoticiasAsociadas(noticiaId, etiquetaId);
    }

    public static void main(String[] args) throws Exception {
        try{
            Database db = new Database();
            // Crea una instancia de RolDao
            EtiquetaDao etiquetaDao = new EtiquetaDao(db);
            Etiqueta etiqueta = new Etiqueta(1, "Arbol de fuego", "4-0258-1111", true);
            etiquetaDao.addEtiqueta(etiqueta);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}