package resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

@Path("/proxy")
public class ProxyResource {

    @GET
    public Response proxyRequest(@QueryParam("url") String url) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet httpGet = new HttpGet(url);
            httpGet.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36");
            httpGet.setHeader(HttpHeaders.ACCEPT, "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
            httpGet.setHeader(HttpHeaders.ACCEPT_LANGUAGE, "en-US,en;q=0.5");
            CloseableHttpResponse response = httpClient.execute(httpGet);
            String responseBody = EntityUtils.toString(response.getEntity());
            return Response.ok(responseBody).build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(500).entity("Internal Server Error").build();
        }
    }

    @GET
    @Path("/img")
    public Response imgRequest(@QueryParam("url") String url) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet httpGet = new HttpGet(url);
            httpGet.setHeader(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36");
            httpGet.setHeader(HttpHeaders.ACCEPT, "image/jpeg,image/png,image/gif,image/webp");
            CloseableHttpResponse response = httpClient.execute(httpGet);
            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == 200) {
                byte[] imageBytes = EntityUtils.toByteArray(response.getEntity());
                String contentType = response.getEntity().getContentType() != null ? response.getEntity().getContentType().getValue() : "image/jpeg"; // Establecer un tipo de contenido predeterminado si es nulo
                return Response.ok(imageBytes, contentType).build();
            } else {
                return Response.status(statusCode).entity("La solicitud no pudo completarse exitosamente").build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(500).entity("Error interno del servidor al realizar la solicitud").build();
        }
    }

}