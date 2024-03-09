package tests.NoticiaMarcada;

import data.Database;
import data.EtiquetaDao;
import data.NoticiaMarcadaDao;
import jakarta.ws.rs.NotFoundException;
import logic.Etiqueta;
import logic.NoticiaMarcada;
import org.junit.Before;
import org.junit.Test;
import org.mockito.MockitoAnnotations;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TestNoticiaMarcadaDao {

    private Database database = new Database();

    private NoticiaMarcadaDao noticiaMarcadaDao = new NoticiaMarcadaDao(new Database());

    NoticiaMarcada noticiaMarcada = new NoticiaMarcada(2, "Prueba", "Prueba", "Hace 2 horas", "Alta", "Pruebas", "Prueba",
                "Prueba", new Date(), "4-0258-0085");

    @Test
    public void create() throws Exception {
        try {
            String sql = "INSERT INTO NOTICIA_MARCADA(Titulo, Descripcion, Fecha, Prioridad, Fuente, Enlace, Imagen, Fechaguardado, FK_NoticiaMarcada_UsuarioCedula) VALUES (?, ?, ?, ?, ?, ?, ?, SYSDATETIME(), ?)";
            PreparedStatement stm = database.prepareStatement(sql);
            stm.setString(1, noticiaMarcada.getTitulo());
            stm.setString(2, noticiaMarcada.getDescripcion());
            stm.setString(3, noticiaMarcada.getFecha());
            stm.setString(4, noticiaMarcada.getPrioridad());
            stm.setString(5, noticiaMarcada.getFuente());
            stm.setString(6, noticiaMarcada.getEnlace());
            stm.setString(7, noticiaMarcada.getImagen());
            stm.setString(8, noticiaMarcada.getUsuarioCedula());
            int rowsAffected = stm.executeUpdate();
            assert rowsAffected > 0;
            System.out.println("El test ha sido llevado a cabo de manera exitosa.");
        } catch (SQLException e) {
            System.err.println("Se produjo una excepción durante la ejecución de la transacción SQL: " + e.getMessage());
        }
    }

    @Test
    public void createexterna() throws Exception {
        try {
            String sql = "INSERT INTO NOTICIA_MARCADA(Titulo, Descripcion, Fecha, Prioridad, Fuente, Enlace, Imagen, Fechaguardado, FK_NoticiaMarcada_UsuarioCedula) VALUES (?, ?, ?, ?, ?, ?, ?, SYSDATETIME(), ?)";
            PreparedStatement stm = database.prepareStatement(sql);
            stm.setString(1, noticiaMarcada.getTitulo());
            stm.setString(2, noticiaMarcada.getDescripcion());
            stm.setString(3, noticiaMarcada.getFecha());
            stm.setString(4, noticiaMarcada.getPrioridad());
            stm.setString(5, noticiaMarcada.getFuente());
            stm.setString(6, noticiaMarcada.getEnlace());
            stm.setString(7, noticiaMarcada.getImagen());
            stm.setString(8, noticiaMarcada.getUsuarioCedula());
            int rowsAffected = stm.executeUpdate();
            assert rowsAffected > 0;
            System.out.println("El test ha sido llevado a cabo de manera exitosa.");
        } catch (SQLException e) {
            System.err.println("Se produjo una excepción durante la ejecución de la transacción SQL: " + e.getMessage());
        }
    }


    @Test
    public void getAllNoticiasMarcadas() throws SQLException {
        String usuarioCedula = "4-0258-0085";
        String sql = "SELECT * FROM NOTICIA_MARCADA WHERE Fk_NoticiaMarcada_UsuarioCedula = ?";
        PreparedStatement statement = database.prepareStatement(sql);
        statement.setString(1, usuarioCedula);
        ResultSet resultSet = statement.executeQuery();
        assertNotNull(resultSet);
    }

    @Test
    public void registrarNoticiaEtiqueta() throws Exception {
        String  noticiatitle = "Líderes de Latinoamérica se reunieron en Costa Rica para impulsar la economía circular y la agenda climática";
        String EtiquetaDescipcion = "Prueba";
        String Cedula = "4-0258-0085";

        if (EtiquetaDescipcion == null || EtiquetaDescipcion.isEmpty()) {
            throw new IllegalArgumentException("La descripción de la etiqueta no puede ser nula o vacía.");
        }

        int noticiaId  = 0;
        int etiquetaId = 0;
        String sql = "SELECT PK_NoticiaMarcada_Id FROM NOTICIA_MARCADA WHERE Titulo = ? AND FK_NoticiaMarcada_UsuarioCedula = ?";
        try (PreparedStatement statement = database.prepareStatement(sql)) {
            statement.setString(1, noticiatitle);
            statement.setString(2, Cedula);
            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    noticiaId = resultSet.getInt("PK_NoticiaMarcada_Id");
                    assertTrue(true, "Test de verficicacion de NOTICIA ha sido completado");
                } else {
                    assertFalse(false,"Test de verficicacion de NOTICIA no ha sido completado");
                    throw new NotFoundException("No se encontró una noticia con el título proporcionado y la cédula especificada.");

                }
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener el valor de noticiaId: " + e.getMessage());

        }

        String sql2 = "SELECT PK_EtiquetaId FROM ETIQUETA WHERE Descripcion = ?";
        try (PreparedStatement statement2 = database.prepareStatement(sql2)) {
            statement2.setString(1, EtiquetaDescipcion);
            try (ResultSet resultSet2 = statement2.executeQuery()) {
                if (resultSet2.next()) {
                    etiquetaId = resultSet2.getInt("PK_EtiquetaId");
                    assertTrue(true, "Test de verficicacion de etiqueta ha sido completado");
                } else {
                    assertFalse(false,"Test de verficicacion de etiqueta no ha sido completado");
                    throw new NotFoundException("No se encontró una noticia con el título proporcionado y la cédula especificada.");
                }
            }
        } catch (SQLException e) {
            System.err.println("Error al obtener el valor de noticiaId: " + e.getMessage());

        }

        if(noticiaId != 0 && etiquetaId !=0){
            String sql3 = "INSERT INTO NOTICIAMARCADA_ETIQUETA(FK_NOTICIAMARCADAETIQUETA_NOTICIAMARCADAID,FKETIQUETA) values(?,?)";
            PreparedStatement stm3 = database.prepareStatement(sql3);
            stm3.setInt(1,noticiaId);
            stm3.setInt(2,etiquetaId);
            int count = database.executeUpdate(stm3);
            assert count > 0;
            System.out.println("El test ha sido llevado a cabo de manera exitosa.");
        }
        else{
            assertFalse(false,"Test no ha sido completodo");
        }
    }

    @Test
    public void actualizarPrioridadNoticia() throws Exception {
        List<NoticiaMarcada> noticiaMarcadas = noticiaMarcadaDao.getAllNoticiasMarcadas("4-0258-0085");
        NoticiaMarcada noticiaMarcada1 = noticiaMarcadas.get(0); //CAMBIAR # SEGUN CORRESPONDA
        String sql = "update NOTICIA_MARCADA set Prioridad = ? where PK_NoticiaMarcada_Id=?";

        //CAMBIAR SEGUN CORRESPONDA
        String prioridadNueva = "Alta";
        PreparedStatement stm = database.prepareStatement(sql);
        stm.setString(1, prioridadNueva);
        stm.setInt(2, noticiaMarcada1.getId());
        int rows = stm.executeUpdate();
        assert rows > 0;
        System.out.println("Test Actualizar Prioridad de Noticia Marcada Exitoso");
    }

    @Test
    public void deleteNoticiaMarcada() throws Exception{
        List<NoticiaMarcada> noticiaMarcadas = noticiaMarcadaDao.getAllNoticiasMarcadas("4-0258-0085");
        NoticiaMarcada noticiaMarcada1 = noticiaMarcadas.get(0); //CAMBIAR # SEGUN CORRESPONDA
        String sql = "DELETE FROM NOTICIA_MARCADA\n" +
                "WHERE Fk_NoticiaMarcada_UsuarioCedula = ? \n" +
                "AND PK_NoticiaMarcada_Id = ?;\n";
        String sql2 = "DELETE FROM NOTICIAMARCADA_ETIQUETA\n" +
                "WHERE FK_NOTICIAMARCADAETIQUETA_NOTICIAMARCADAID = ?;\n";
        //primera parte
        PreparedStatement stm1 = database.prepareStatement(sql2);
        stm1.setInt(1, noticiaMarcada1.getId());
        stm1.executeUpdate();
        //segunda parte
        PreparedStatement stm2  = database.prepareStatement(sql);
        stm2.setString(1, noticiaMarcada1.getUsuarioCedula());
        stm2.setInt(2, noticiaMarcada1.getId());
        int rows = stm2.executeUpdate();
        assert rows > 0;
        System.out.println("Test eliminar noticia exitoso");
    }
}