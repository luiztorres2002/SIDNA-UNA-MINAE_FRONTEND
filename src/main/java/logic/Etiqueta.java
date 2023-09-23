package logic;

public class Etiqueta {
    private int etiquetaId;
    private String descripcion;
    private String usuarioCedula;


    public Etiqueta(int etiquetaId, String descripcion, String usuarioCedula) {
        this.etiquetaId = etiquetaId;
        this.descripcion = descripcion;
        this.usuarioCedula = usuarioCedula;
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