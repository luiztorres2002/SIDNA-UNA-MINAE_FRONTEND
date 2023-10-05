package logic;

import data.*;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Service {

    private static Service uniqueInstance;

    public static Service instance(){
        if (uniqueInstance == null) {
            uniqueInstance = new Service();
        }
        return uniqueInstance;
    }

    Database database;
    RolDao rolDao;

    DepartamentoDao departamentoDao;

    NoticiaExternaDao noticiaExternaDao;

    NoticiaMarcadaDao noticiaMarcadaDao;

    UsuarioDao usuarioDao;


    private Service() {
        database = new Database();

        rolDao = new RolDao(database);

        departamentoDao = new DepartamentoDao(database);

        usuarioDao = new UsuarioDao(database);

        noticiaExternaDao = new NoticiaExternaDao(database);

        noticiaMarcadaDao = new NoticiaMarcadaDao(database);


    }


    //crear o ingresar una nueva noticia externa.
    public void noticiaExternaAdd(NoticiaExterna noticiaExterna) throws Exception{
        Departamento departamento = new Departamento(1,"PruebaDepartamento");
        Rol rol = new Rol(1,"Analista");
        Usuario usuario = new Usuario("4-0258-0085", "Luis","Torres","Villalobos","torresvillalobos20@gmail.com", "123123123",departamento,rol);
        noticiaExterna.setUsuario(usuario);
        noticiaExterna.setId(1);
        noticiaExternaDao.create(noticiaExterna);
    }


    public void noticiaMarcadaAdd(NoticiaMarcada noticiaMarcada) throws Exception {
        noticiaMarcada.setUsuarioCedula("4-0258-0085");
        noticiaMarcada.setId(1);
        noticiaMarcadaDao.create(noticiaMarcada);
    }







}
