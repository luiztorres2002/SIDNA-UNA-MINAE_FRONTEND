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

@RunWith(MockitoJUnitRunner.class)
public class TestService {

    @Mock
    private Service service;

    private Database database = new Database();

    private NoticiaExternaDao noticiaExternaDao = new NoticiaExternaDao(database);

    @Test
    public void testNoticiaExternaAdd() throws Exception {

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date fecha = dateFormat.parse("2022-09-23");
        NoticiaExterna noticiaExterna = new NoticiaExterna();
        noticiaExterna.setTitulo("PruebaTitulo");
        noticiaExterna.setDescripcion("PruebaDescripcion");
        noticiaExterna.setFecha(fecha);
        noticiaExterna.setPrioridad("Alta");
        noticiaExterna.setFuente("PruebaFuente");
        noticiaExterna.setEnlace("PruebaEnlace");


        Departamento departamento = new Departamento(1,"PruebaDepartamento");
        Rol rol = new Rol(1,"Analista");
        Usuario usuario = new Usuario("4-0258-0085", "Luis","Torres","Villalobos","torresvillalobos20@gmail.com", "123123123",departamento,rol);

        //noticiaExterna.setUsuario(usuario);
        //noticiaExterna.setId(1);


        try {
            noticiaExternaDao.create(noticiaExterna);
            assert true : "El método create se ejecutó correctamente";
        } catch (Exception e) {
            assert false : "Se produjo una excepción durante la ejecución del método create: " + e.getMessage();
        }
    }
}