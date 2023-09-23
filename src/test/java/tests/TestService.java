package tests;

import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import logic.NoticiaExterna;
import logic.Service;

import java.text.SimpleDateFormat;
import java.util.Date;

@RunWith(MockitoJUnitRunner.class)
public class TestService {

    @Mock
    private Service service;

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
        noticiaExterna.setEnlace("PruenaEnlace");
        Mockito.doNothing().when(service).noticiaExternaAdd(noticiaExterna);
        service.noticiaExternaAdd(noticiaExterna);
        Mockito.verify(service, Mockito.times(1)).noticiaExternaAdd(noticiaExterna);
    }
}