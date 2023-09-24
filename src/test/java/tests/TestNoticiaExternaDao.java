package tests;
import data.Database;
import data.NoticiaExternaDao;
import logic.*;
import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;

import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertNotNull;


public class TestNoticiaExternaDao {


    private  Departamento departamento = new Departamento(1,"PruebaDepartamento");
   private Rol rol = new Rol(1,"Analista");
   private Usuario usuario = new Usuario("4-0258-0085", "Luis","Torres","Villalobos","torresvillalobos20@gmail.com", "123123123",departamento,rol);
    private NoticiaExternaDao noticiaExternaDao = new NoticiaExternaDao(new Database());

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testCreate() throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date fecha = dateFormat.parse("2022-09-23");
        NoticiaExterna noticiaExterna = new NoticiaExterna();
        noticiaExterna.setTitulo("PruebaTitulo");
        noticiaExterna.setDescripcion("PruebaDescripcion");
        noticiaExterna.setFecha(fecha);
        noticiaExterna.setPrioridad("Alta");
        noticiaExterna.setFuente("PruebaFuente");
        noticiaExterna.setEnlace("PruebaEnlace");
        noticiaExterna.setUsuario(usuario);
        try {
            noticiaExternaDao.create(noticiaExterna);
            assert true : "El método create se ejecutó correctamente";
        } catch (Exception e) {
            assert false : "Se produjo una excepción durante la ejecución del método create: " + e.getMessage();
        }
    }
}