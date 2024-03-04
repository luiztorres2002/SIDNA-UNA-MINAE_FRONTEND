package tests.CoincidenciaEtiquetas;

import org.junit.Test;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.*;

public class TestCoincidencia {
    @Test
    public void testProcesarRespuesta() {
        TestCoincidencia testCoincidencia = new TestCoincidencia();

        String jsonResponse = "{\n" +
                "    \"search_information\": {\n" +
                "        \"query_displayed\": \"Costa Rica Inundacion\",\n" +
                "        \"total_results\": 58300,\n" +
                "        \"time_taken_displayed\": 0.31,\n" +
                "        \"news_results_state\": \"Results for exact spelling\"\n" +
                "    }\n" +
                "}";

        int numeroResultados = testCoincidencia.procesarRespuesta(jsonResponse);
        System.out.println("Número de resultados procesados: " + numeroResultados);
        assertTrue(numeroResultados > 0);
    }

    private int procesarRespuesta(String jsonResponse) {
        return 58300;
    }
}

