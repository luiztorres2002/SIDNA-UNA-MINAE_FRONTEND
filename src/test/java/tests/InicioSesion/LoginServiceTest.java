package tests.InicioSesion;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class LoginServiceTest {
    LoginService loginService = new LoginService();

    @Test
    public void testLoginCorrecto() {
        assertTrue(loginService.login("1-1111-1111", "Minae1"));
        System.out.println("Test 1 Exitoso, Usuario y Contraseña Validos");
    }

    @Test
    public void testLoginUsuarioIncorrecto() {
        assertFalse(loginService.login("3-3333-3333", "Minae2"));
        System.out.println("Test 2 Exitoso, No Inicia Sesion Por Usuario Incorrecto");
    }

    @Test
    public void testLoginContrasenaIncorrecta() {
        assertFalse(loginService.login("2-2222-2222", "Password"));
        System.out.println("Test 3 Exitoso, No Inicia Sesion Por Contraseña Incorrecta");
    }

    @Test
    public void testLoginUsuarioContrasenaVacios() {
        assertFalse(loginService.login(null, null));
        System.out.println("Test 4 Exitoso, No Inicia Sesion Por Campos Vacios");
    }
}
