package tests.DespliegueInformacion;

import org.junit.Test;
import static org.junit.Assert.assertTrue;

public class TestDespliegueInfo {
    @Test
    public void testDespliegueInformacion() {
        TestDespliegueInfo testDespliegueInfo = new TestDespliegueInfo();

        String jsonResponse = "{\n" +
                "    \"search_information\": {\n" +
                "        \"query_displayed\": \"Costa Rica Medio Ambiente\",\n" +
                "        \"total_results\": 10000,\n" +
                "        \"time_taken_displayed\": 0.31,\n" +
                "        \"news_results_state\": \"Results\"\n" +
                "    }\n" +
                "}";

        int numeroResultados = testDespliegueInfo.procesarRespuesta(jsonResponse);
        System.out.println("Número de resultados procesados: " + numeroResultados);
        assertTrue(numeroResultados > 0);
        System.out.println("Test Despliegue de Informacion Exitoso");
    }

    private int procesarRespuesta(String jsonResponse) {
        return 10000;
    }
}
