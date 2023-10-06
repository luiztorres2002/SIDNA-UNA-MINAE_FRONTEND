package data;

import logic.Departamento;
import logic.NoticiaExterna;
import logic.Rol;
import logic.Usuario;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

public class NoticiaExternaDao {
    Database db;
    UsuarioDao usuarioDao;
    public NoticiaExternaDao(Database db) {
        this.db = db;
        usuarioDao = new UsuarioDao(db);
    }
    public void create(NoticiaExterna NoticiaExterna) throws Exception{
        String sql = "insert into NOTICIA_EXTERNA(Titulo,Descripcion,Fecha,Prioridad,Fuente,Enlace,FK_NoticiaExterna_UsuarioCedula) values (?,?,?,?,?,?,?)";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1,NoticiaExterna.getTitulo());
        stm.setString(2,NoticiaExterna.getDescripcion());
        java.util.Date fechaUtil = NoticiaExterna.getFecha();
        java.sql.Date fechaSql = new java.sql.Date(fechaUtil.getTime());
        stm.setDate(3, fechaSql);
        stm.setString(4,NoticiaExterna.getPrioridad());
        stm.setString(5,NoticiaExterna.getFuente());
        stm.setString(6,NoticiaExterna.getEnlace());
        stm.setString(7,NoticiaExterna.getUsuario().getCedula());
        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se creo");
        }
    }



}
