package tests.CerrarSeccion;

public class CerrarSeccion {
    private boolean sessionOpen;

    public CerrarSeccion() {
        this.sessionOpen = true;
    }

    public boolean isSessionOpen() {
        return sessionOpen;
    }

    public void cerrarSesion() {
        this.sessionOpen = false;
    }
}