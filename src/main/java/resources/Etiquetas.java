package resources;

import data.Database;
import data.EtiquetaDao;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import logic.Etiqueta;
import logic.NoticiasAsociadas;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;

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

    @GET
    @Path("/habilitadas/{usuarioCedula}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Etiqueta> getEtiquetasByCedulaAndEstado(@PathParam("usuarioCedula") String usuarioCedula) {
        try {
            Database db = new Database();
            EtiquetaDao etiquetaDao = new EtiquetaDao(db);

            List<Etiqueta> resultado = etiquetaDao.getEtiquetasHabilitadas(usuarioCedula);

            return resultado;
        } catch (SQLException e) {
            throw new InternalServerErrorException(e);
        }
    }

    @PUT
    @Path("/cambiarEstado/{etiquetaId}/{nuevoEstado}/{usuario}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response cambiarEstadoEtiqueta(
            @PathParam("etiquetaId") int etiquetaId,
            @PathParam("nuevoEstado") boolean nuevoEstado,
            @PathParam("usuario") String usuario){
        try {
            Database db = new Database();
            EtiquetaDao etiquetaDao = new EtiquetaDao(db);

            etiquetaDao.actualizarEstadoEtiqueta(etiquetaId, nuevoEstado,usuario);

            return Response.ok().build();
        } catch (SQLException e) {
            throw new InternalServerErrorException(e);
        }
    }



    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addEtiqueta(Etiqueta etiqueta) {
        try {
            Database database = new Database();
            EtiquetaDao etiquetaDao = new EtiquetaDao(database);

            String descripcion = etiqueta.getDescripcion();
            String cedula = etiqueta.getUsuarioCedula();

            List<Etiqueta> etiquetas = getAllEtiquetasByUsuario(cedula);
            for (Etiqueta value : etiquetas) {
                if (Objects.equals(value.getDescripcion().toLowerCase(), descripcion.toLowerCase())) {
                    return Response.status(Response.Status.NOT_FOUND).build();
                }
            }
            if (descripcion.isEmpty() || cedula.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
            etiquetaDao.addEtiqueta(etiqueta, etiqueta.getUsuarioCedula());
            return Response.ok().build();
        } catch (SQLException ex) {
            throw new InternalServerErrorException(ex);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PUT
    @Path("/editar/{etiquetaId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response editarEtiqueta(@PathParam("etiquetaId") int etiquetaID, @QueryParam("input") String descripcion, @QueryParam("cedula") String cedula) {
        try {
            Database database = new Database();
            EtiquetaDao etiquetaDao = new EtiquetaDao(database);
            Etiqueta etiqueta = etiquetaDao.getEtiquetaById(etiquetaID,cedula);

            List<Etiqueta> etiquetas = getAllEtiquetasByUsuario(cedula);
            for (Etiqueta value : etiquetas) {
                if (Objects.equals(value.getDescripcion().toLowerCase(), descripcion.toLowerCase())) {
                    return Response.status(Response.Status.CONFLICT).build();
                }
            }

            if (descripcion.isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }

            etiqueta.setDescripcion(descripcion);
            etiquetaDao.updateEtiqueta(etiqueta, cedula);
            return Response.ok().build();
        } catch (SQLException ex) {
            throw new InternalServerErrorException(ex);
        }
    }


}