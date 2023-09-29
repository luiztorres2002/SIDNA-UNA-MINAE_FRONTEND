package tests;

import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import static org.junit.Assert.*;


public class RedireccionadorTest {

    @Test
    public void testRedirigirGoogle() {
        // Creamos una instancia simulada del Redireccionador
        Redireccionador redireccionadorMock = mock(Redireccionador.class);

        // Definir el comportamiento simulado
        when(redireccionadorMock.redirigir("https://www.google.com/"))
                .thenReturn("Redirigido a Google");

        // Probar la lógica de redirección simulada
        String resultado = redireccionadorMock.redirigir("https://www.google.com/");

        // Verificar que se llamó al método con el argumento esperado
        verify(redireccionadorMock).redirigir("https://www.google.com/");

        // Verificar el resultado
        assertEquals("Redirigido a Google", resultado);
    }
}

