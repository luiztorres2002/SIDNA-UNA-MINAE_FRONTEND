package resources;

import data.Database;
import data.NoticiaMarcadaDao;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
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
            throw new NotAcceptableException();
        }
    }

    @POST
    @Path("/Externa")
    @Consumes(MediaType.APPLICATION_JSON)
    public void createExterna(NoticiaMarcada noticiaMarcada) {
        try {
            Service service = Service.instance();
            service.noticiaMarcadaAdd2(noticiaMarcada);
        } catch (Exception ex) {
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