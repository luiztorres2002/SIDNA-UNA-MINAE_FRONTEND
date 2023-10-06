package resources;

import data.Database;
import data.EtiquetaDao;
import data.NoticiaMarcadaDao;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import logic.Etiqueta;
import logic.NoticiaExterna;
import logic.NoticiaMarcada;
import logic.Service;

import java.sql.SQLException;
import java.util.List;


@Path("/NoticiasMarcadas")
    public class NoticiasMarcadas {
        @POST
        @Consumes(MediaType.APPLICATION_JSON)
        public void create(NoticiaMarcada noticiaMarcada){
            try {
                Service service = Service.instance();
                service.noticiaMarcadaAdd(noticiaMarcada);
            } catch (Exception ex) {
                System.out.println("Hola");
                throw new NotAcceptableException();
            }
        }
    @GET
    @Path("/{usuarioCedula}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<NoticiaMarcada> getAllNoticiasMarcadas(@PathParam("usuarioCedula") String usuarioCedula) {
        try {
            Database db = new Database();
            NoticiaMarcadaDao noticiaMarcadaDao = new NoticiaMarcadaDao(db);
            return noticiaMarcadaDao.getAllNoticiasMarcadas(usuarioCedula);
        } catch (SQLException e) {
            throw new InternalServerErrorException(e);
        }
    }

    }

