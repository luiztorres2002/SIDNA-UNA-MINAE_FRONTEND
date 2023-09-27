package tests;
import data.Database;
import data.NoticiaExternaDao;
import logic.*;
import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertNotNull;


public class TestNoticiaExternaDao {


    private  Departamento departamento = new Departamento(1,"PruebaDepartamento");
    private Rol rol = new Rol(1,"Analista");
    private Usuario usuario = new Usuario("4-0258-0085", "Luis","Torres","Villalobos","torresvillalobos20@gmail.com", "123123123",departamento,rol);
    private NoticiaExternaDao noticiaExternaDao = new NoticiaExternaDao(new Database());

    private Database database = new Database();

    private NoticiaExterna noticiaExterna = new NoticiaExterna(1,"PruebaTitulo", "PruebaDescripcion",null,"Alta","FuentePrueba","Enlace Prueba", null);

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }



    @Test
    public void create() throws ParseException {
        try {

            noticiaExterna.setUsuario(usuario);
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date fecha = dateFormat.parse("2022-09-23");
            noticiaExterna.setFecha(fecha);
            String sql = "INSERT INTO NOTICIA_EXTERNA(Titulo, Descripcion, Fecha, Prioridad, Fuente, Enlace, FK_NoticiaExterna_UsuarioCedula) VALUES (?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement stm = database.prepareStatement(sql);
            stm.setString(1, noticiaExterna.getTitulo());
            stm.setString(2, noticiaExterna.getDescripcion());
            stm.setDate(3, new java.sql.Date(noticiaExterna.getFecha().getTime()));
            stm.setString(4, noticiaExterna.getPrioridad());
            stm.setString(5, noticiaExterna.getFuente());
            stm.setString(6, noticiaExterna.getEnlace());
            stm.setString(7, noticiaExterna.getUsuario().getCedula());

            int rowsAffected = stm.executeUpdate();
            assert rowsAffected > 0;
            System.out.println("El test ha sido llevado a cabo de manera exitosa.");
        } catch (ParseException e) {
            System.err.println("Error al parsear la fecha: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("Se produjo una excepción durante la ejecución de la transacción SQL: " + e.getMessage());
        }
    }


}