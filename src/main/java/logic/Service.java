package logic;

import data.*;

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





    }



}
