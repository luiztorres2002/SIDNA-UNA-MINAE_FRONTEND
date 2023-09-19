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

    public static void main(String[] args) throws Exception {
      try{
      Database db = new Database();

         Departamento departamento = new Departamento(1,"PruebaDepartamento");
         Rol rol = new Rol(1,"Analista");
         SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
         Date fechaEspecificaDate = sdf.parse("2022-08-20");
         Usuario usuario = new Usuario("4-0258-0085", "Luis","Torres","Villalobos","torresvillalobos20@gmail.com", "123123123",departamento,rol);
         NoticiaExternaDao noticiaExternaDao = new NoticiaExternaDao(db);
         LocalDate fechaHoy = LocalDate.now();
         NoticiaExterna noticiaExterna = new NoticiaExterna(1,"Incendios sdfs", "Hay una increiblsdfsdfe cantidad de incendios en San Carlos",fechaEspecificaDate,"Alsdfsta","www.lanacsdfdsion.com","www.lanacisfsdfon.com",usuario);
         noticiaExternaDao.create(noticiaExterna);

      } catch (Exception e) {
         e.printStackTrace();
        }
   }
}
