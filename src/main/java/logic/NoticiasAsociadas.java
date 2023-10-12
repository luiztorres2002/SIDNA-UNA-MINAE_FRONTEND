package logic;

public class NoticiasAsociadas {
    int noticiaId;
    int etiquetaId;

    public NoticiasAsociadas(int noticiaId, int etiquetaId) {
        this.noticiaId = noticiaId;
        this.etiquetaId = etiquetaId;
    }

    public int getNoticiaId() {
        return noticiaId;
    }

    public void setNoticiaId(int noticiaId) {
        this.noticiaId = noticiaId;
    }

    public int getEtiquetaId() {
        return etiquetaId;
    }

    public void setEtiquetaId(int etiquetaId) {
        this.etiquetaId = etiquetaId;
    }
}
