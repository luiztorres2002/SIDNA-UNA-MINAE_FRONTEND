package tests.ModuloUsuarios;

import data.Database;
import data.UsuarioDao;
import logic.Departamento;
import logic.Rol;
import logic.Usuario;
import org.junit.Test;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TestUpdateUsuario {

    private final Database db = new Database();
    private UsuarioDao usuarioDao = new UsuarioDao(db);

    @Test
    public void testUpdateUsuario() throws SQLException {
        Departamento departamento = new Departamento(1, "Departamento de TI");
        Rol rol = new Rol(1, "Analista");
        Usuario usuario = new Usuario("4-111-111", "Andres", "Fernandez", "Fernandez", "Andres@gmail.com", "aba23", departamento, rol);
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

        int rows = stm.executeUpdate();
        assert rows > 0;
        System.out.println("Test Update Usuario Realizado Correctamente");
    }

    @Test
    public void testEliminarUsuario() throws Exception {

        String cedula = "4-111-111";
        if (usuarioDao.eliminarNoticiasMarcadasEtiquetaPorUsuarioNV(cedula) && usuarioDao.borrarNoticiasUsuarioNV(cedula) && usuarioDao.borrarEtiquetasUsuarioNV(cedula)) {
            String sql = "DELETE FROM Usuario\n" +
                    "WHERE PK_UsuarioCedula = ? \n";
            PreparedStatement stm = db.prepareStatement(sql);
            stm.setString(1, cedula);
            int rows = db.executeUpdate(stm);
            assert rows > 0;
            System.out.println("Test Eliminacr Usuario Realizada Exitosamente");
        }
        else{
            throw new Exception("No se elimino");
        }
    }

    @Test
    public void testCrearUsuario() throws Exception {
        Departamento departamento = new Departamento(1, "Departamento de TI");
        Rol rol = new Rol(1, "Analista");
        Usuario usuario = new Usuario("4-777-777", "Allan", "Almeda", "Fernandez", "almeda@gmail.com", "root", departamento, rol);
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
            int rows = db.executeUpdate(stm);
            assert rows > 0;
            System.out.println("Test Crear Usuario Realizado de manera exitosa");
    }


}
