package data;

import logic.Departamento;
import logic.NoticiaExterna;
import logic.Rol;
import logic.Usuario;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class NoticiaExternaDao {

    Database db;

    UsuarioDao usuarioDao;
    public NoticiaExternaDao(Database db) {
        this.db = db;
        usuarioDao = new UsuarioDao(db);
    }

    public void create(NoticiaExterna NoticiaExterna) throws Exception{
        String sql = "insert into NOTICIA_EXTERNA(PK_NoticiaExternaId,Titulo,Descripcion,Fecha,Prioridad,Fuente,Enlace,FK_NoticiaExterna_UsuarioCedula) values (?,?,?,?,?,?,?,?)";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setInt(1,NoticiaExterna.getId());
        stm.setString(2,NoticiaExterna.getTitulo());
        stm.setString(3,NoticiaExterna.getDescripcion());
        stm.setDate(4, (Date) NoticiaExterna.getFecha());
        stm.setString(5,NoticiaExterna.getPrioridad());
        stm.setString(6,NoticiaExterna.getFuente());
        stm.setString(7,NoticiaExterna.getEnlace());
        stm.setString(8,NoticiaExterna.getUsuario().getCedula());
        int count = db.executeUpdate(stm);
        if (count == 0) {
            throw new Exception("No se creo");
        }
    }

    //public static void main(String[] args) throws Exception {

      //  try{
      //      Database db = new Database();

            // Crea una instancia de RolDao
         //   Departamento departamento = new Departamento(1,"PruebaDepartamento");
         //////   Rol rol = new Rol(1,"Analista");
          //  Usuario usuario = new Usuario("4-0258-0085", "Luis","Torres","Villalobos","torresvillalobos20@gmail.com", "123123123",departamento,rol);
          //  NoticiaExternaDao noticiaExternaDao = new NoticiaExternaDao(db);


      //  } catch (SQLException e) {
      //      e.printStackTrace();
    //    } catch (Exception e) {
    ///        e.printStackTrace();
    //    }
  //  }


}
