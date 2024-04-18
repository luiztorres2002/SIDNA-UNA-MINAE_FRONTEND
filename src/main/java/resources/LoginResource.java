package resources;


import data.UsuarioDao;
import jakarta.ws.rs.Path;
import data.Database;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import logic.Usuario;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Path("/login")
public class LoginResource {

    private UsuarioDao usuarioDao;
    private static final String CLAVE_SECRETA = "1SafDOD+iJ7V2wMciWCJGQ==";

    public LoginResource() {
        Database db = new Database();
        usuarioDao = new UsuarioDao(db);
    }

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@FormParam("usuario") String usuario, @FormParam("contrasena") String contrasena) {
        String password = cifrarCedula(contrasena);
        System.out.println("Contraseña cifrada: " + password);
        try {
            Usuario usuarioAutenticado = usuarioDao.login(usuario, password);
            if (usuarioAutenticado != null) {
                String cedulaCifrada = cifrarCedula(usuarioAutenticado.getCedula());
                if (cedulaCifrada != null) {
                    usuarioAutenticado.setCedula(cedulaCifrada);
                    if (usuarioAutenticado.getContrasena().equals("STjWyF9ZXspiMnYdY/ijDA==")) {
                        usuarioAutenticado.setContrasena("debeCambiar");
                    } else {
                        usuarioAutenticado.setContrasena("");
                    }
                    return Response.ok().entity(usuarioAutenticado).build();
                } else {
                    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error al cifrar la cédula").build();
                }
            } else {
                return Response.status(Response.Status.UNAUTHORIZED).entity("Credenciales inválidas").build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error al autenticar el usuario: " + e.getMessage()).build();
        }
    }

    private String cifrarCedula(String cedula) {
        try {
            byte[] claveBytes = CLAVE_SECRETA.getBytes("UTF-8");
            SecretKeySpec claveSecreta = new SecretKeySpec(claveBytes, "AES");

            Cipher cifrador = Cipher.getInstance("AES");
            cifrador.init(Cipher.ENCRYPT_MODE, claveSecreta);

            byte[] cedulaCifradaBytes = cifrador.doFinal(cedula.getBytes("UTF-8"));

            return Base64.getEncoder().encodeToString(cedulaCifradaBytes);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
