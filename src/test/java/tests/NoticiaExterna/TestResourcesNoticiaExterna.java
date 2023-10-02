package tests.NoticiaExterna;

import logic.Departamento;
import logic.NoticiaExterna;
import logic.Rol;
import logic.Usuario;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import resources.NoticiasExternas;

import java.text.SimpleDateFormat;
import java.util.Date;

public class TestResourcesNoticiaExterna {


    private Departamento departamento = new Departamento(1,"PruebaDepartamento");
    private Rol rol = new Rol(1,"Analista");
    //private Usuario usuario = new Usuario("4-0258-0085", "Luis","Torres","Villalobos","torresvillalobos20@gmail.com", "123123123",departamento,rol);

    private NoticiasExternas noticiasExternas = new NoticiasExternas();

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

        try {
            noticiasExternas.create(noticiaExterna);
            assert true : "El método create se ejecutó correctamente";
        } catch (Exception e) {
        assert false : "Se produjo una excepción durante la ejecución del método create: " + e.getMessage();
        }


    }

}
