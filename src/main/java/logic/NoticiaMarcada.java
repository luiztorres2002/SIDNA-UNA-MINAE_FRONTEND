package logic;

import java.util.Date;
import java.util.List;
import java.util.Objects;

public class NoticiaMarcada {

    private int Id;
    private String Titulo;

    private String Descripcion;

    private String Fecha;

    private String Prioridad;

    private String Fuente;

    private String Enlace;

    private String Imagen;

    private Date FechaGuardado;

    private String UsuarioCedula;
    private List<Etiqueta> etiquetas;


    public NoticiaMarcada() {
    }

    public NoticiaMarcada(int id, String titulo, String descripcion, String fecha, String prioridad, String fuente, String enlace, String imagen, Date fechaGuardado, String usuarioCedula) {
        Id = id;
        Titulo = titulo;
        Descripcion = descripcion;
        Fecha = fecha;
        Prioridad = prioridad;
        Fuente = fuente;
        Enlace = enlace;
        Imagen = imagen;
        FechaGuardado = fechaGuardado;
        UsuarioCedula = usuarioCedula;
    }

    public List<Etiqueta> getEtiquetas() {
        return etiquetas;
    }

    public void setEtiquetas(List<Etiqueta> etiquetas) {
        this.etiquetas = etiquetas;
    }

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getTitulo() {
        return Titulo;
    }

    public void setTitulo(String titulo) {
        Titulo = titulo;
    }

    public String getDescripcion() {
        return Descripcion;
    }

    public void setDescripcion(String descripcion) {
        Descripcion = descripcion;
    }

    public String getFecha() {
        return Fecha;
    }

    public void setFecha(String fecha) {
        Fecha = fecha;
    }

    public String getPrioridad() {
        return Prioridad;
    }

    public void setPrioridad(String prioridad) {
        Prioridad = prioridad;
    }

    public String getFuente() {
        return Fuente;
    }

    public void setFuente(String fuente) {
        Fuente = fuente;
    }

    public String getEnlace() {
        return Enlace;
    }

    public void setEnlace(String enlace) {
        Enlace = enlace;
    }

    public String getImagen() {
        return Imagen;
    }

    public void setImagen(String imagen) {
        Imagen = imagen;
    }

    public Date getFechaGuardado() {
        return FechaGuardado;
    }

    public void setFechaGuardado(Date fechaGuardado) {
        FechaGuardado = fechaGuardado;
    }

    public String getUsuarioCedula() {
        return UsuarioCedula;
    }

    public void setUsuarioCedula(String usuarioCedula) {
        UsuarioCedula = usuarioCedula;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NoticiaMarcada that = (NoticiaMarcada) o;
        return Id == that.Id && Objects.equals(Titulo, that.Titulo) && Objects.equals(Descripcion, that.Descripcion) && Objects.equals(Fecha, that.Fecha) && Objects.equals(Prioridad, that.Prioridad) && Objects.equals(Fuente, that.Fuente) && Objects.equals(Enlace, that.Enlace) && Objects.equals(Imagen, that.Imagen) && Objects.equals(FechaGuardado, that.FechaGuardado) && Objects.equals(UsuarioCedula, that.UsuarioCedula);
    }

    @Override
    public int hashCode() {
        return Objects.hash(Id, Titulo, Descripcion, Fecha, Prioridad, Fuente, Enlace, Imagen, FechaGuardado, UsuarioCedula);
    }

    @Override
    public String toString() {
        return "NoticiaMarcada{" +
                "Id=" + Id +
                ", Titulo='" + Titulo + '\'' +
                ", Descripcion='" + Descripcion + '\'' +
                ", Fecha='" + Fecha + '\'' +
                ", Prioridad='" + Prioridad + '\'' +
                ", Fuente='" + Fuente + '\'' +
                ", Enlace='" + Enlace + '\'' +
                ", Imagen='" + Imagen + '\'' +
                ", FechaGuardado=" + FechaGuardado +
                ", UsuarioCedula='" + UsuarioCedula + '\'' +
                '}';
    }
}
