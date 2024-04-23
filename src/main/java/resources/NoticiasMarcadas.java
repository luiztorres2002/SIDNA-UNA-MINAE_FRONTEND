package resources;

import data.Database;
import data.NoticiaMarcadaDao;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import logic.NoticiaMarcada;
import logic.Service;

import java.sql.SQLException;
import java.util.List;

@Path("/NoticiasMarcadas")
public class NoticiasMarcadas {
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void create(NoticiaMarcada noticiaMarcada) {
        try {
            Service service = Service.instance();
            service.noticiaMarcadaAdd(noticiaMarcada);
        } catch (Exception ex) {
            throw new NotAcceptableException();
        }
    }

    @POST
    @Path("/ExternaDelete/{id}/{cedula}")
    @Consumes(MediaType.APPLICATION_JSON)
    public void eliminarExterna(@PathParam("id") String id, @PathParam("cedula") String cedula) {
        try {
            Database db = new Database();
            NoticiaMarcadaDao noticiaMarcadaDao = new NoticiaMarcadaDao(db);
            noticiaMarcadaDao.deleteNoticia(id, cedula);
        } catch (SQLException e) {
            throw new InternalServerErrorException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
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

    @PUT
    @Path("/{usuarioCedula}/{noticiaId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response actualizarPrioridad(@PathParam("usuarioCedula") String usuarioCedula, @PathParam("noticiaId") int noticiaId, @QueryParam("input") String nuevaPrioridad) {
        try {
            Database database = new Database();
            NoticiaMarcadaDao noticiaMarcadaDao = new NoticiaMarcadaDao(database);

            noticiaMarcadaDao.actualizarPrioridad(usuarioCedula, noticiaId, nuevaPrioridad);

            return Response.ok().build();
        } catch (Exception ex) {
            throw new InternalServerErrorException(ex);
        }
    }
}