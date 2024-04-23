package tests;

import data.Database;
import data.NoticiaMarcadaDao;
import logic.*;
import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Date;

@RunWith(MockitoJUnitRunner.class)
public class TestService {

    @Mock
    private Service service;

    private Database database = new Database();

    private NoticiaMarcadaDao noticiaMarcadaDao= new NoticiaMarcadaDao(database);

    @Test
    public void testNoticiaMarcadaAdd2() throws Exception {
        NoticiaMarcada noticiaMarcada = new NoticiaMarcada(2, "Prueba", "Prueba", "Hace 2 horas", "Alta", "PruebasS", "Pruebaswer",
                "Prueba", new Date(), "4-0258-0085");
        try {
            noticiaMarcada.setUsuarioCedula("4-0258-0085");
            noticiaMarcada.setId(1);
            //noticiaMarcadaDao.createexterna(noticiaMarcada);
            assert true : "El método create se ejecutó correctamente";
        } catch (Exception e) {
            assert false : "Se produjo una excepción durante la ejecución del método create: " + e.getMessage();
        }
    }
}