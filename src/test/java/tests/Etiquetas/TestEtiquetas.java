package tests.Etiquetas;

import data.Database;
import data.EtiquetaDao;
import logic.Etiqueta;
import org.junit.Test;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TestEtiquetas {
    private final Database db = new Database();
    private EtiquetaDao etiquetaDao = new EtiquetaDao(db);

    @Test
    public void updateEtiqueta()throws SQLException{
        Etiqueta etiqueta=new Etiqueta(3, "Bosques", "1", true);
        String sql="UPDATE Etiqueta SET Descripcion=? where PK_EtiquetaId=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, etiqueta.getDescripcion());
        stm.setInt(2, etiqueta.getEtiquetaId());
        int rows = stm.executeUpdate();
        assert rows>0;
        System.out.println("Test Actulizacion Etiqueta Realizado Exitosamente");
    }


    @Test
    public void actualizarEstadoEtiqueta() throws SQLException {
        boolean nuevoEstado = true;
        int etiquetaId = 3;
        String sql = "UPDATE ETIQUETA SET Estado = ? WHERE PK_EtiquetaId = ?";
        try (PreparedStatement statement = db.prepareStatement(sql)) {
            statement.setBoolean(1, nuevoEstado);
            statement.setInt(2, etiquetaId);
            statement.executeUpdate();
            int rowsAffected = statement.executeUpdate();
            assert rowsAffected > 0;
            System.out.println("El test ha sido llevado a cabo de manera exitosa.");
        } catch (SQLException e) {
            e.printStackTrace(); // Prints the exception stack trace to the console.
        }
    }


    @Test
    public void crearEtiquetaTest() throws SQLException {
        Etiqueta etiquetaa = new Etiqueta(1, "Prueba", "4-0258-0085", true);

        try {
            String sql = "INSERT INTO ETIQUETA (Descripcion, FK_Etiqueta_UsuarioCedula, Estado) VALUES (?, ?, ?)";
            PreparedStatement statement = db.prepareStatement(sql);
            statement.setString(1, etiquetaa.getDescripcion());
            statement.setString(2, etiquetaa.getUsuarioCedula());
            statement.setBoolean(3, etiquetaa.getEstado());
            int rowsAffected = statement.executeUpdate();
            assert rowsAffected > 0 : "La inserción no fue exitosa"; // Lanza una excepción si rowsAffected no es mayor que 0
            System.out.println("El test ha sido llevado a cabo de manera exitosa.");
        } catch (SQLException exception) {
            exception.printStackTrace();
            throw new AssertionError("El test no ha pasado la prueba.");
        }
    }

    @Test
    public void contarNoticiasAsociadas()throws Exception{
        Etiqueta etiqueta = etiquetaDao.getEtiquetaById(1);
        int asociadas = etiquetaDao.getNoticiasAsociadas(etiqueta.getEtiquetaId()).size();
        assert asociadas == 5; //Cada uno cambia el valor al correspondiente
        System.out.println("Test Contar Noticias Asociadas a Etiqueta Exitoso");
    }

}

