package resources;

import data.Database;
import data.EtiquetaDao;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import logic.Etiqueta;

import java.sql.SQLException;
import java.util.List;

@Path("/etiquetas")
public class Etiquetas {

    @GET
    @Path("/{usuarioCedula}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Etiqueta> getAllEtiquetasByUsuario(@PathParam("usuarioCedula") String usuarioCedula) {
        try {
            Database db = new Database();
            EtiquetaDao etiquetaDao = new EtiquetaDao(db);
            return etiquetaDao.getAllEtiquetasByUsuario(usuarioCedula);
        } catch (SQLException e) {
            throw new InternalServerErrorException(e);
        }
    }

    @PUT
    @Path("/cambiarEstado/{etiquetaId}/{nuevoEstado}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response cambiarEstadoEtiqueta(
            @PathParam("etiquetaId") int etiquetaId,
            @PathParam("nuevoEstado") boolean nuevoEstado) {
        try {
            Database db = new Database();
            EtiquetaDao etiquetaDao = new EtiquetaDao(db);

            Etiqueta etiqueta = etiquetaDao.getEtiquetaById(etiquetaId);
            if (etiqueta == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }

            etiquetaDao.actualizarEstadoEtiqueta(etiquetaId, nuevoEstado);

            return Response.ok().build();
        } catch (SQLException e) {
            throw new InternalServerErrorException(e);
        }
    }

    @PUT
    @Path("/editar/{etiquetaId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response editarEtiqueta(@PathParam("etiquetaId") int etiquetaID) {
        try {
            Database database = new Database();
            EtiquetaDao etiquetaDao = new EtiquetaDao(database);
            Etiqueta etiqueta = etiquetaDao.getEtiquetaById(etiquetaID);
            if (etiqueta == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            etiquetaDao.updateEtiqueta(etiqueta);
            return Response.ok().build();
        } catch (SQLException ex) {
            throw new InternalServerErrorException(ex);
        }
    }
}
