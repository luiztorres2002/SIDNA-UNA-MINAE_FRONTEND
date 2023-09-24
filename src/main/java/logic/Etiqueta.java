package logic;

public class Etiqueta {
    private int etiquetaId;
    private String descripcion;
    private String usuarioCedula;

    private Boolean estado;


    public Etiqueta(int etiquetaId, String descripcion, String usuarioCedula, boolean estado) {
        this.etiquetaId = etiquetaId;
        this.descripcion = descripcion;
        this.usuarioCedula = usuarioCedula;
        this.estado = estado;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public int getEtiquetaId() {
        return etiquetaId;
    }

    public void setEtiquetaId(int etiquetaId) {
        this.etiquetaId = etiquetaId;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getUsuarioCedula() {
        return usuarioCedula;
    }

    public void setUsuarioCedula(String usuarioCedula) {
        this.usuarioCedula = usuarioCedula;
    }


}