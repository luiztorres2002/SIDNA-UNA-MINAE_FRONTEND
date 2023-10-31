package data;

import logic.Rol;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class RolDao {

    Database db;

    public RolDao(Database db){
        this.db = db;
    }

    public Rol read(int id) throws Exception {
        String sql = "SELECT * FROM ROL WHERE PK_RolId = ?";

        PreparedStatement stm = null;
        ResultSet rs = null;
        try {
            stm = db.prepareStatement(sql);
            stm.setInt(1, id);
            rs = stm.executeQuery();
            if (rs.next()) {
                return from(rs);
            } else {
                throw new Exception("Rol no existe");
            }
        } catch (SQLException e) {
            throw new Exception("Error al leer el rol: " + e.getMessage());
        } finally {
            try {
                if (rs != null) rs.close();
                if (stm != null) stm.close();
            } catch (SQLException e) {
            }
        }
    }

    public Rol from(ResultSet rs) throws SQLException {
        Rol rol = new Rol();
        rol.setId(rs.getInt("PK_RolId"));
        rol.setDescripcion(rs.getString("Descripcion"));
        return rol;
    }

    public void createRol(Rol r) throws Exception {
        String sql = "insert into " +
                "Rol" +
                " (PK_RolId,Descripcion)  "
                + "values (?,?);";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setInt(1, r.getId());
        stm.setString(2, r.getDescripcion().trim());
        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se creo");
        }
    }

    public static void main(String[] args) throws Exception {

        try{
            Database db = new Database();

            // Crea una instancia de RolDao
            RolDao rolDao = new RolDao(db);
            Rol rol = rolDao.read(1);

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
