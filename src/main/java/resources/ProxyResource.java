package resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

@Path("/proxy")
public class ProxyResource {

    @GET
    public Response proxyRequest(@QueryParam("url") String url) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpGet httpGet = new HttpGet(url);

            CloseableHttpResponse response = httpClient.execute(httpGet);

            String responseBody = EntityUtils.toString(response.getEntity());

            return Response.ok(responseBody).build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500).entity("Internal Server Error").build();
        }
    }
}