package tests.CerrarSeccion;
public class CerrarSeccion {
    private boolean sessionOpen;
    private String currentUser;

    public CerrarSeccion() {
        sessionOpen = false;
        currentUser = null;
    }

    public void openSession(String user) {
        if (!sessionOpen) {
            sessionOpen = true;
            currentUser = user;
            System.out.println("Sesión abierta para el usuario: " + user);
        } else {
            System.out.println("Error: Ya hay una sesión abierta para el usuario " + currentUser);
        }
    }

    public void closeSession() {
        if (sessionOpen) {
            sessionOpen = false;
            currentUser = null;
            System.out.println("Sesión cerrada");
        } else {
            System.out.println("Error: No hay ninguna sesión abierta para cerrar");
        }
    }

    public boolean isSessionOpen() {
        return sessionOpen;
    }
}