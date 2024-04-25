package tests.InicioSesion;

import java.util.HashMap;
import java.util.Map;

public class LoginService {
    private Map<String, String> users;

    public LoginService() {
        users = new HashMap<>();
        //AGREGAR USUARIOS DE EJEMPLO SIMULANDO LA BD, EN ESTE CASO SOLO USERNAME Y PASSWORD
        users.put("1-1111-1111", "Minae1");
        users.put("2-2222-2222", "Minae2");
    }

    public boolean login(String username, String password) {
        //VERIFICAR SI LA CLAVE Y EL USUARIO SON CORRECTOS
        return users.containsKey(username) && users.get(username).equals(password);
    }
}
