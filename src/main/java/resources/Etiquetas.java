package resources;

import data.Database;
import data.EtiquetaDao;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
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
}
