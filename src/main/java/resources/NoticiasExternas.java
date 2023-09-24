package resources;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import logic.NoticiaExterna;
import logic.Service;
import java.io.InputStream;
import java.io.*;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotAcceptableException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;



@Path("/NoticiasExternas")
public class NoticiasExternas {


    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void create(NoticiaExterna noticiaExterna){
        try {
            Service service = Service.instance();
            service.noticiaExternaAdd(noticiaExterna);
        } catch (Exception ex) {
            throw new NotAcceptableException();
        }
    }






}