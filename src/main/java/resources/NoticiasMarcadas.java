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

    @POST
    @Path("/ExternaDelete/{id}/{cedula}")
    @Consumes(MediaType.APPLICATION_JSON)
    public void eliminarExterna(@PathParam("id") String id, @PathParam("cedula") String cedula) {
        try {
            Database db = new Database();
            NoticiaMarcadaDao noticiaMarcadaDao = new NoticiaMarcadaDao(db);
            noticiaMarcadaDao.deleteNoticiaMarcada(id, cedula);
        } catch (SQLException e) {
            throw new InternalServerErrorException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @POST
    @Path("/EtiquetasExternaDelete/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public void eliminarExternaEtiquetas(@PathParam("id") String id) {
        try {
            Database db = new Database();
            NoticiaMarcadaDao noticiaMarcadaDao = new NoticiaMarcadaDao(db);
            noticiaMarcadaDao.deleteEtiquetasNoticia(id);
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
            NoticiaMarcada noticiaCoincidiente = noticiaMarcadaDao.noticiaPorIDyUsuario(usuarioCedula, noticiaId);

            noticiaCoincidiente.setPrioridad(nuevaPrioridad);
            noticiaMarcadaDao.actualizarPrioridad(noticiaCoincidiente);
            return Response.ok().build();
        } catch (Exception ex) {
            throw new InternalServerErrorException(ex);
        }
    }
}