package tests;

import static org.mockito.Mockito.*;
import org.junit.jupiter.api.Test;
import static org.junit.Assert.*;


public class RedireccionadorTest {

    @Test
    public void testRedirigirGoogle() {
        Redireccionador redireccionadorMock = mock(Redireccionador.class);


        when(redireccionadorMock.redirigir("https://www.google.com/"))
                .thenReturn("Redirigido a Google");

        String resultado = redireccionadorMock.redirigir("https://www.google.com/");

        verify(redireccionadorMock).redirigir("https://www.google.com/");

        assertEquals("Redirigido a Google", resultado);
    }
}

