package logic;

import data.*;

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

    UsuarioDao usuarioDao;

    private Service() {
        database = new Database();

        rolDao = new RolDao(database);

        departamentoDao = new DepartamentoDao(database);

        usuarioDao = new UsuarioDao(database);

        noticiaExternaDao = new NoticiaExternaDao(database);

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


    public static void main(String[] args) {
        // Crear una instancia de Service
        Service service = Service.instance();

        // Puedes realizar otras operaciones aquí utilizando la instancia de Service si es necesario.

        // Imprimir un mensaje para indicar que se ha creado la instancia
        System.out.println("Instancia de Service creada exitosamente.");
    }

    //leer





}
