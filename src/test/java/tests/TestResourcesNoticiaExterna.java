package tests;

import logic.NoticiaExterna;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import resources.NoticiasExternas;

import java.text.SimpleDateFormat;
import java.util.Date;

public class TestResourcesNoticiaExterna {


    @Mock
    private NoticiasExternas noticiasExternas;

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
        Mockito.doNothing().when(noticiasExternas).create(noticiaExterna);
        noticiasExternas.create(noticiaExterna);
        Mockito.verify(noticiasExternas, Mockito.times(1)).create(noticiaExterna);
    }

}
