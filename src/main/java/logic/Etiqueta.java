package logic;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Etiqueta {
    private int etiquetaId;
    private String descripcion;
    private String usuarioCedula;

    private int noticiasAsociadas;
    private Boolean estado;

    @JsonCreator
    public Etiqueta(@JsonProperty("etiquetaId") int etiquetaId,
                    @JsonProperty("descripcion") String descripcion,
                    @JsonProperty("usuarioCedula") String usuarioCedula,
                    @JsonProperty("estado") Boolean estado) {
        this.etiquetaId = etiquetaId;
        this.descripcion = descripcion;
        this.usuarioCedula = usuarioCedula;
        this.estado = estado;
    }

    public Etiqueta() {
    }

    public Etiqueta(int etiquetaId, String descripcion, String usuarioCedula, boolean estado) {
        this.etiquetaId = etiquetaId;
        this.descripcion = descripcion;
        this.usuarioCedula = usuarioCedula;
        this.estado = estado;
    }

    public int getNoticiasAsociadas() {
        return noticiasAsociadas;
    }

    public void setNoticiasAsociadas(int noticiasAsociadas) {
        this.noticiasAsociadas = noticiasAsociadas;
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