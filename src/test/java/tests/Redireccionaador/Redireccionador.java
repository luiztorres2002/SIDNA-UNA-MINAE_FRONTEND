package tests.Redireccionaador;
public class Redireccionador {
    public String redirigir(String url) {
        // Lógica de redirección
        if (url.startsWith("https://www.google.com/")) {
            return "Redirigido a Google";
        } else if (url.startsWith("https://semanariouniversidad.com/pais/naturaleza-playas-y-aventura-son-el-epicentro-de-atraccion-para-turistas-que-arriban-a-costa-rica/")) {
            return "Redirigido a Example";
        } else {
            return "URL no válida";
        }
    }
}

