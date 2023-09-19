package resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import logic.NoticiaExterna;
import logic.Service;

@Path("/NoticiasExternas")
public class NoticiasExternas {


    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void create(NoticiaExterna noticiaExterna){
        try {
            Service service = Service.instance();
            service.noticiaExternaAdd(noticiaExterna);
        } catch (Exception ex) {
            throw new NotAcceptableException();
        }
    }

}