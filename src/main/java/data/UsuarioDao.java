package data;

import logic.Departamento;
import logic.NoticiaMarcada;
import logic.Rol;
import logic.Usuario;

import javax.swing.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDao {

    Database db;
    DepartamentoDao departamentoDao;

    RolDao rolDao;

    public UsuarioDao(Database db) {
        this.db = db;
        departamentoDao = new DepartamentoDao(db);
        rolDao = new RolDao(db);
    }

    public List<Usuario> getAllUsuarios() throws Exception {
        List<Usuario> usuarios = new ArrayList<>();
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

        try (PreparedStatement stm = db.prepareStatement(sql);
             ResultSet rs = stm.executeQuery()) {

            while (rs.next()) {
                Usuario usuario = from(rs);
                usuario.setDepartamento(departamentoDao.from(rs));
                usuario.setRol(rolDao.from(rs));
                usuarios.add(usuario);
            }
        } catch (SQLException e) {
            throw new Exception("Error al leer los usuarios: " + e.getMessage());
        }

        return usuarios;
    }

    public void create(Usuario usuario) throws Exception {
        String sql = "insert into Usuario(PK_UsuarioCedula,Nombre,PrimerApellido,SegundoApellido,Email,Contrasena,Fk_Usuario_RoLId,FK_Usuario_DepartamentoId) values(?,?,?,?,?,?,?,?);";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, usuario.getCedula());
        stm.setString(2, usuario.getNombre());
        stm.setString(3, usuario.getPrimerApellido());
        stm.setString(4, usuario.getSegundoApellido());
        stm.setString(5, usuario.getEmail());
        stm.setString(6, usuario.getContrasena());
        stm.setInt(7, usuario.getRol().getId());
        stm.setInt(8, usuario.getDepartamento().getId());
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

    public Usuario login(String usuario, String contrasena) throws Exception {
        String sql = "SELECT * FROM Usuario WHERE PK_UsuarioCedula = ? AND Contrasena = ?";
        try (PreparedStatement stm = db.prepareStatement(sql)) {
            stm.setString(1, usuario);
            stm.setString(2, contrasena);
            try (ResultSet rs = stm.executeQuery()) {
                if (rs.next()) {
                    String cedula = rs.getString("PK_UsuarioCedula");
                    return read(cedula);
                } else {
                    return null;
                }
            }
        } catch (SQLException e) {
            throw new Exception("Error al autenticar usuario: " + e.getMessage());
        }
    }

    public Usuario from(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setCedula(rs.getString("Pk_UsuarioCedula"));
        usuario.setNombre(rs.getString("UsuarioName"));
        usuario.setPrimerApellido(rs.getString("PrimerApellido"));
        usuario.setSegundoApellido(rs.getString("SegundoApellido"));
        usuario.setEmail(rs.getString("Email"));
        usuario.setContrasena(rs.getString("Contrasena"));
        return usuario;
    }


    public void createUsuario(Usuario usuario) throws Exception {
        String sql = "INSERT INTO USUARIO(PK_UsuarioCedula, Nombre, PrimerApellido, SegundoApellido, Email, Contrasena, FK_Usuario_RolId, FK_Usuario_DepartamentoId) values (?,?,?,?,?,?,?,?)";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, usuario.getCedula());
        stm.setString(2, usuario.getNombre());
        stm.setString(3, usuario.getPrimerApellido());
        stm.setString(4, usuario.getSegundoApellido());
        stm.setString(5, usuario.getEmail());
        stm.setString(6, "Minae");
        stm.setInt(7, usuario.getRol().getId());
        stm.setInt(8, usuario.getDepartamento().getId());
        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se creo");
        } else {
            createEtiquetasPrestablecidasUsuario(usuario.getCedula());
        }
    }

    public boolean createEtiquetasPrestablecidasUsuario(String cedula) {
        String sql = "INSERT INTO ETIQUETA (Descripcion, FK_Etiqueta_UsuarioCedula, ESTADO) VALUES (?,?,?)";
        try {
            PreparedStatement statement = db.prepareStatement(sql);
            statement.setString(1, "Costa Rica");
            statement.setString(2, cedula);
            statement.setBoolean(3, true);
            statement.addBatch();
            statement.setString(1, "Medio Ambiente");
            statement.setString(2, cedula);
            statement.setBoolean(3, true);
            statement.addBatch();
            statement.setString(1, "Noticia Externa");
            statement.setString(2, cedula);
            statement.setBoolean(3, true);
            statement.addBatch();
            statement.executeBatch();
            statement.close();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public void createEtiquetasPrestablecidasUsuarioNB(String cedula) {
        int idEtiqueta1 = 0;
        int idEtiqueta2 = 0;
        int idEtiqueta3 = 0;

        String sqlQuery1 = "SELECT PK_ETIQUETAID\n" +
                "FROM ETIQUETA\n" +
                "WHERE Descripcion = 'Costa Rica';";

        String sqlQuery2 = "SELECT PK_ETIQUETAID\n" +
                "FROM ETIQUETA\n" +
                "WHERE Descripcion = 'Noticia Externa';";

        String sqlQuery3 = "SELECT PK_ETIQUETAID\n" +
                "FROM ETIQUETA\n" +
                "WHERE Descripcion = 'Medio Ambiente';";

        try {
            PreparedStatement statement = db.prepareStatement(sqlQuery1);
            ResultSet rs = statement.executeQuery();

            if(rs.next()){
                idEtiqueta1 = rs.getInt("PK_ETIQUETAID");
            }

            String sqlQuery4 = "INSERT INTO Usuario_Etiqueta(Fk_UsuarioEtiqueta_UsuarioId, Fk_UsuarioEtiqueta_EtiquetaId, Estado)\n" +
                    "VALUES (?,?,?);";
            PreparedStatement statement2 = db.prepareStatement(sqlQuery4);
            statement2.setString(1, cedula);
            statement2.setInt(2, idEtiqueta1);
            statement2.setBoolean(3, true);
            statement2.executeUpdate();

            PreparedStatement statement3 = db.prepareStatement(sqlQuery2);
            ResultSet rs2 = statement3.executeQuery();

            if(rs2.next()){
                idEtiqueta2 = rs2.getInt("PK_ETIQUETAID");
            }

            String sqlQuery5 = "INSERT INTO Usuario_Etiqueta (Fk_UsuarioEtiqueta_UsuarioId, Fk_UsuarioEtiqueta_EtiquetaId, Estado)\n" +
                    "VALUES (?,?,?);";
            PreparedStatement statement4 = db.prepareStatement(sqlQuery5);
            statement4.setString(1, cedula);
            statement4.setInt(2, idEtiqueta2);
            statement4.setBoolean(3, true);
            statement4.executeUpdate();

            PreparedStatement statement5 = db.prepareStatement(sqlQuery3);
            ResultSet rs3 = statement5.executeQuery();

            if(rs3.next()){
                idEtiqueta3 = rs3.getInt("PK_ETIQUETAID");
            }

            String sqlQuery6 = "INSERT INTO Usuario_Etiqueta (Fk_UsuarioEtiqueta_UsuarioId, Fk_UsuarioEtiqueta_EtiquetaId, Estado)\n" +
                    "VALUES (?,?,?);";
            PreparedStatement statement6 = db.prepareStatement(sqlQuery6);
            statement6.setString(1, cedula);
            statement6.setInt(2, idEtiqueta3);
            statement6.setBoolean(3, true);
            statement6.executeUpdate();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public void updateUsuario(Usuario usuario) throws Exception {
        String sql = "UPDATE USUARIO\n" +
                "SET Nombre = ?, PrimerApellido = ?, SegundoApellido = ?, Email = ?, FK_Usuario_RolId = ?, FK_Usuario_DepartamentoId = ?\n" +
                "WHERE PK_UsuarioCedula = ?;";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, usuario.getNombre());
        stm.setString(2, usuario.getPrimerApellido());
        stm.setString(3, usuario.getSegundoApellido());
        stm.setString(4, usuario.getEmail());
        stm.setInt(5, usuario.getRol().getId());
        stm.setInt(6, usuario.getDepartamento().getId());
        stm.setString(7, usuario.getCedula());

        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se modifico");
        } else {
            System.out.println("Usuario creado correctamente");
        }
    }
    public void modificiarContrasenaUsuario(String cedula) throws Exception {

        String nuevaContrasena = "Minae";
        String sql = "UPDATE USUARIO\n" +
                "SET Contrasena = ?\n" +
                "WHERE PK_UsuarioCedula = ?;";

        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, nuevaContrasena);
        stm.setString(2, cedula);

        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se cambio");
        }
    }


    public void deleteUsuario(String Cedula) throws Exception {

        if(eliminarNoticiasMarcadasEtiquetaPorUsuario(Cedula) && borrarNoticiasUsuario(Cedula) && borrarEtiquetasUsuario(Cedula)){
            String cedulaUser = Cedula;
            String sql = "DELETE FROM Usuario\n" +
                    "WHERE PK_UsuarioCedula = ? \n";
            PreparedStatement stm = db.prepareStatement(sql);
            stm.setString(1, cedulaUser);
            int count = db.executeUpdate(stm);
            if (count == 0) {
                throw new Exception("No se elimino");
            } else {

            }
        }
        else{
            throw new Exception("No se elimino");
        }

    }

    public void deleteUsuarioNB(String cedula) throws Exception {

        if (eliminarNoticiasMarcadasEtiquetaPorUsuarioNV(cedula) && borrarNoticiasUsuarioNV(cedula) && borrarEtiquetasUsuarioNV(cedula)) {
            String sql = "DELETE FROM Usuario\n" +
                    "WHERE PK_UsuarioCedula = ? \n";
            PreparedStatement stm = db.prepareStatement(sql);
            stm.setString(1, cedula);
            int count = db.executeUpdate(stm);
            if (count == 0) {
                throw new Exception("No se elimino");
            } else {

            }
        }
        else{
            throw new Exception("No se elimino");
        }
    }





    //NUEVA BASE DE DATOS LISTO
    public boolean borrarNoticiasUsuarioNV(String cedula){
        String sqlQuery = "DELETE FROM Usuario_Noticia WHERE FK_UsuarioNoticia_UsuarioId = ?;";
        try (PreparedStatement statement = db.prepareStatement(sqlQuery)) {
            statement.setString(1, cedula);
            int filasEliminadas = statement.executeUpdate();
            return filasEliminadas >= 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean borrarEtiquetasUsuarioNV(String cedula){
        String sqlQuery = "DELETE FROM Usuario_Etiqueta WHERE Fk_UsuarioEtiqueta_UsuarioId = ?;";
        try (PreparedStatement statement = db.prepareStatement(sqlQuery)) {
            statement.setString(1, cedula);
            int filasEliminadas = statement.executeUpdate();
            return filasEliminadas >= 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    public boolean eliminarNoticiasMarcadasEtiquetaPorUsuarioNV(String cedula){

        String sqlQuery = "DELETE FROM NOTICIA_ETIQUETA WHERE FK_UsuarioCedula = ?;";
        try (PreparedStatement statement = db.prepareStatement(sqlQuery)) {
            statement.setString(1, cedula);
            int filasEliminadas = statement.executeUpdate();
            return filasEliminadas >= 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }



    // Vieja base de datos /////
    public boolean eliminarNoticiasMarcadasEtiquetaPorUsuario(String cedula) {
        String sqlQuery = "DELETE FROM NOTICIAMARCADA_ETIQUETA\n" +
                "WHERE FK_NOTICIAMARCADAETIQUETA_NOTICIAMARCADAID IN (\n" +
                "    SELECT PK_NoticiaMarcada_Id\n" +
                "    FROM NOTICIA_MARCADA\n" +
                "    WHERE Fk_NoticiaMarcada_UsuarioCedula = ?\n" +
                ");";
        try (PreparedStatement stm = db.prepareStatement(sqlQuery)) {
            stm.setString(1, cedula);
            int filasEliminadas = stm.executeUpdate();
            return filasEliminadas >= 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public boolean borrarNoticiasUsuario(String cedula){
        String sqlQuery = "DELETE FROM NOTICIA_MARCADA where Fk_NoticiaMarcada_UsuarioCedula = ?";
        try (PreparedStatement stm = db.prepareStatement(sqlQuery)) {
            stm.setString(1, cedula);
            int filasEliminadas = stm.executeUpdate();
            return filasEliminadas >= 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public boolean borrarEtiquetasUsuario(String cedula){
        String sqlQuery = "DELETE FROM ETIQUETA where FK_Etiqueta_UsuarioCedula = ?";
        try (PreparedStatement stm = db.prepareStatement(sqlQuery)) {
            stm.setString(1, cedula);
            int filasEliminadas = stm.executeUpdate();
            return filasEliminadas >= 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    public static void main(String[] args) throws Exception {
        Database db = new Database();
        // Crea una instancia de RolDao
        UsuarioDao usuariDao = new UsuarioDao(db);
        usuariDao.createEtiquetasPrestablecidasUsuarioNB("4-111-111");
    }
}
