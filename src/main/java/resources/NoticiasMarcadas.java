package resources;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.NotAcceptableException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import logic.NoticiaExterna;
import logic.NoticiaMarcada;
import logic.Service;



    @Path("/NoticiasMarcadas")
    public class NoticiasMarcadas {
        @POST
        @Consumes(MediaType.APPLICATION_JSON)
        public void create(NoticiaMarcada noticiaMarcada){
            try {
                Service service = Service.instance();
                service.noticiaMarcadaAdd(noticiaMarcada);
            } catch (Exception ex) {
                throw new NotAcceptableException();
            }
        }






    }

