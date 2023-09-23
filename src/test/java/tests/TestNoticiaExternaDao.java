package tests;
import data.Database;
import data.NoticiaExternaDao;
import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.junit.MockitoJUnitRunner;
import logic.NoticiaExterna;
import logic.Service;

import java.text.SimpleDateFormat;
import java.util.Date;


public class TestNoticiaExternaDao {

    @Mock
    private NoticiaExternaDao noticiaExternaDao;

    private Database database;

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
        Mockito.doNothing().when(noticiaExternaDao).create(noticiaExterna);
        noticiaExternaDao.create(noticiaExterna);
        Mockito.verify(noticiaExternaDao, Mockito.times(1)).create(noticiaExterna);
    }
}