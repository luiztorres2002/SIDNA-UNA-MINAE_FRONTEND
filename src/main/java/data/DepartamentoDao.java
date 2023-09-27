package data;

import logic.Departamento;
import logic.Rol;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DepartamentoDao {

    Database db;

    public DepartamentoDao(Database db){
        this.db = db;
    }

    public Departamento read(int id) throws Exception {
        String sql = "SELECT * FROM Departamento WHERE PK_DepartamentoId = ?";
        PreparedStatement stm = null;
        ResultSet rs = null;
        try {
            stm = db.prepareStatement(sql);
            stm.setInt(1, id);
            rs = stm.executeQuery();
            if (rs.next()) {
                return from(rs);
            } else {
                throw new Exception("Departamento no existe");
            }
        } catch (SQLException e) {
            throw new Exception("Error al leer el departamento: " + e.getMessage());
        } finally {
            try {
                if (rs != null) rs.close();
                if (stm != null) stm.close();
            } catch (SQLException e) {
            }
        }
    }

    public Departamento from(ResultSet rs) throws SQLException {
        Departamento departamento = new Departamento();
        departamento.setId(rs.getInt("PK_DepartamentoId"));
        departamento.setNombre(rs.getString("Nombre"));
        return departamento;
    }

    public void createDepartamento(Departamento departamento) throws Exception {
        String sql = "insert into " +
                "Departamento" +
                " (PK_DepartamentoId,Nombre)  "
                + "values (?,?);";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setInt(1, departamento.getId());
        stm.setString(2, departamento.getNombre().trim());
        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se pudo agregar el departamento");
        }
    }


    public static void main(String[] args) throws Exception {

        try{
            Database db = new Database();

            // Crea una instancia de RolDao
            DepartamentoDao departamentoDao = new DepartamentoDao(db);
            Departamento departamento = departamentoDao.read(1);

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
