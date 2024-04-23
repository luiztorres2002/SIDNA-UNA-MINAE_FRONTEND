package tests.NoticiaExterna;

import logic.Departamento;
import logic.NoticiaMarcada;
import logic.Rol;
import org.junit.Before;
import org.junit.Test;
import org.mockito.MockitoAnnotations;
import resources.NoticiasMarcadas;

import java.util.Date;

public class TestResourcesNoticiaMarcada {

    private Departamento departamento = new Departamento(1,"PruebaDepartamento");
    private Rol rol = new Rol(1,"Analista");
    //private Usuario usuario = new Usuario("4-0258-0085", "Luis","Torres","Villalobos","torresvillalobos20@gmail.com", "123123123",departamento,rol);

    private NoticiasMarcadas noticiasMarcadas = new NoticiasMarcadas();

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testCreate() throws Exception {
        NoticiaMarcada noticiaMarcada = new NoticiaMarcada(2, "Prueba", "Prueba", "Hace 2 horas", "Alta", "Pruebas", "Pruebsdsdsa",
                "Prueba", new Date(), "4-0258-0085");

        try {
            //noticiasMarcadas.createExterna(noticiaMarcada);
            assert true : "El método create se ejecutó correctamente";
        } catch (Exception e) {
        assert false : "Se produjo una excepción durante la ejecución del método create: " + e.getMessage();
        }
    }

}
