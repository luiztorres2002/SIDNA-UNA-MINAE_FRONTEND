package tests.CerrarSeccion;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class CerrarSeccionTest {
    private CerrarSeccion sessionManager;

    @BeforeEach
    public void setUp() {
        sessionManager = new CerrarSeccion();
    }

    @Test
    public void testCerrarSesion() {
        assertTrue(sessionManager.isSessionOpen());


        sessionManager.cerrarSesion();


        assertFalse(sessionManager.isSessionOpen());
    }
}