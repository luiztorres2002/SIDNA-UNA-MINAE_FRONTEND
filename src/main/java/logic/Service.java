package logic;

import data.*;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Service {

    private static Service uniqueInstance;

    public static Service instance() {
        if (uniqueInstance == null) {
            uniqueInstance = new Service();
        }
        return uniqueInstance;
    }

    Database database;
    RolDao rolDao;
    EtiquetaDao etiquetaDao;

    DepartamentoDao departamentoDao;

    NoticiaMarcadaDao noticiaMarcadaDao;

    UsuarioDao usuarioDao;

    private Service() {
        database = new Database();

        rolDao = new RolDao(database);

        departamentoDao = new DepartamentoDao(database);

        usuarioDao = new UsuarioDao(database);

        etiquetaDao = new EtiquetaDao(database);

        noticiaMarcadaDao = new NoticiaMarcadaDao(database);

    }

    public void noticiaMarcadaAdd(NoticiaMarcada noticiaMarcada) throws Exception {
        noticiaMarcada.setUsuarioCedula("4-0258-0085");
        noticiaMarcada.setId(1);
        noticiaMarcadaDao.create(noticiaMarcada);
    }

    public void noticiaMarcadaAdd2(NoticiaMarcada noticiaMarcada) throws Exception {
        noticiaMarcada.setUsuarioCedula("4-0258-0085");
        noticiaMarcada.setId(1);
        noticiaMarcadaDao.createexterna(noticiaMarcada);
    }

}
