package resources;

import data.Database;
import data.UsuarioDao;
import logic.Usuario;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;


@Path("/usuarios")
public class Usuarios {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Usuario> getAllUsuarios() {
        try {
            Database db = new Database();
            UsuarioDao usuarioDao = new UsuarioDao(db);
            return usuarioDao.getAllUsuarios();
        } catch (Exception e) {
            throw new InternalServerErrorException(e);
        }
    }
}