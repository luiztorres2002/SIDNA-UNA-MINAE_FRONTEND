package logic;

import java.util.Date;

public class NoticiaExterna {

    private int id;
    private String titulo;

    private String descripcion;

    private Date fecha;

    private String prioridad;

    private String fuente;

    private String enlace;

    private Usuario usuario;

    public NoticiaExterna() {
    }

    public NoticiaExterna(int id, String titulo, String descripcion, Date fecha, String prioridad, String fuente, String enlace, Usuario usuario) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.prioridad = prioridad;
        this.fuente = fuente;
        this.enlace = enlace;
        this.usuario = usuario;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getFuente() {
        return fuente;
    }

    public void setFuente(String fuente) {
        this.fuente = fuente;
    }

    public String getEnlace() {
        return enlace;
    }

    public void setEnlace(String enlace) {
        this.enlace = enlace;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public String toString() {
        return "NoticiaExterna{" +
                "id=" + id +
                ", titulo='" + titulo + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", fecha=" + fecha +
                ", prioridad='" + prioridad + '\'' +
                ", fuente='" + fuente + '\'' +
                ", enlace='" + enlace + '\'' +
                ", usuario=" + usuario +
                '}';
    }
}
