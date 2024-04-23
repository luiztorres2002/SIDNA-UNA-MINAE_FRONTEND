package tests.CerrarSeccion;
import static org.junit.Assert.*;
import org.junit.*;

public class CerrarSeccionTest {
    private CerrarSeccion sessionManager;

    @Before
    public void setUp() {
        // Inicializar el SessionManager antes de cada prueba
        sessionManager = new CerrarSeccion();
    }

    @Test
    public void testCloseSession() {
        // Simular abrir una sesión
        sessionManager.openSession("usuario123");

        // Verificar que la sesión está abierta
        assertTrue(sessionManager.isSessionOpen());

        // Cerrar la sesión
        sessionManager.closeSession();

        // Verificar que la sesión está cerrada después de cerrarla
        assertFalse(sessionManager.isSessionOpen());
    }

    @Test
    public void testCloseSessionWhenNoSessionOpen() {
        // No se abre ninguna sesión

        // Verificar que no hay sesión abierta inicialmente
        assertFalse(sessionManager.isSessionOpen());

        // Intentar cerrar una sesión cuando no hay ninguna abierta
        sessionManager.closeSession();

        // Verificar que sigue sin haber sesión abierta después de intentar cerrarla
        assertFalse(sessionManager.isSessionOpen());
    }
}
