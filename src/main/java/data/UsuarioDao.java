package data;

import logic.Departamento;
import logic.Rol;
import logic.Usuario;

import javax.swing.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UsuarioDao {

    Database db;
    DepartamentoDao departamentoDao;

    RolDao rolDao;

    public UsuarioDao(Database db){
        this.db = db;
        departamentoDao = new DepartamentoDao(db);
        rolDao = new RolDao(db);
    }

    public void create(Usuario usuario) throws Exception{
        String sql = "insert into Usuario(PK_UsuarioCedula,Nombre,PrimerApellido,SegundoApellido,Email,Contrasena,Fk_Usuario_RoLId,FK_Usuario_DepartamentoId) values(?,?,?,?,?,?,?,?);";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1,usuario.getCedula());
        stm.setString(2,usuario.getNombre());
        stm.setString(3,usuario.getPrimerApellido());
        stm.setString(4,usuario.getSegundoApellido());
        stm.setString(5,usuario.getEmail());
        stm.setString(6,usuario.getContrasena());
        stm.setInt(7,usuario.getRol().getId());
        stm.setInt(8,usuario.getDepartamento().getId());
        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se creo");
        }
    }

    public Usuario read(String cedula) throws Exception {
        String sql = "SELECT\n" +
                "  Rol.PK_RolId,\n" +
                "  Rol.Descripcion,\n" +
                "  Departamento.PK_DepartamentoId,\n" +
                "  Departamento.Nombre,\n" +
                "  Usuario.Pk_UsuarioCedula,\n" +
                "  Usuario.Nombre as UsuarioName,\n" +
                "  Usuario.PrimerApellido,\n" +
                "  Usuario.SegundoApellido,\n" +
                "  Usuario.Email,\n" +
                "  Usuario.Contrasena\n" +
                "FROM\n" +
                "  Rol,\n" +
                "  Departamento,\n" +
                "  Usuario\n" +
                "WHERE\n" +
                "  Rol.PK_RolId = Usuario.Fk_Usuario_RolId\n" +
                "  AND Departamento.PK_DepartamentoId = Usuario.Fk_Usuario_DepartamentoId\n" +
                "  AND Usuario.PK_UsuarioCedula = ?\n" +
                "GROUP BY\n" +
                "  Rol.PK_RolId,\n" +
                "  Rol.Descripcion,\n" +
                "  Departamento.PK_DepartamentoId,\n" +
                "  Departamento.Nombre,\n" +
                "  Usuario.Pk_UsuarioCedula,\n" +
                "  Usuario.Nombre,\n" +
                "  Usuario.PrimerApellido,\n" +
                "  Usuario.SegundoApellido,\n" +
                "  Usuario.Email,\n" +
                "  Usuario.Contrasena;\n";

        PreparedStatement stm = null;
        ResultSet rs = null;
        try {
            stm = db.prepareStatement(sql);
            stm.setString(1, cedula);
            rs = stm.executeQuery();
            Usuario usuario;
            if (rs.next()) {
                usuario = from(rs);
                usuario.setDepartamento(departamentoDao.from(rs));
                usuario.setRol(rolDao.from(rs));
                return usuario;
            } else {
                throw new Exception("Rol no existe");
            }
        } catch (SQLException e) {
            throw new Exception("Error al leer el usuario: " + e.getMessage());
        } finally {
            try {
                if (rs != null) rs.close();
                if (stm != null) stm.close();
            } catch (SQLException e) {
            }
        }
    }

    public Usuario from(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setCedula(rs.getString("Pk_UsuarioCedula")); // Debe coincidir con el alias "Cedula" en la consulta SQL
        usuario.setNombre(rs.getString("UsuarioName"));
        usuario.setPrimerApellido(rs.getString("PrimerApellido"));
        usuario.setSegundoApellido(rs.getString("SegundoApellido"));
        usuario.setEmail(rs.getString("Email"));
        usuario.setContrasena(rs.getString("Contrasena"));
        return usuario;
    }

    public static void main(String[] args) throws Exception {

        try{
            Database db = new Database();

            // Crea una instancia de RolDao
            UsuarioDao usuariDao = new UsuarioDao(db);
            EtiquetaDao etiquetaDao = new EtiquetaDao(db);
            Departamento departamento = new Departamento(1,"PruebaDepartamento");
            Rol rol = new Rol(1,"Analista");
            Usuario usuario1 = usuariDao.read("4-0258-0085");
            System.out.println(etiquetaDao.getAllEtiquetasByUsuario("1"));

            System.out.println(usuario1.toString());

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}