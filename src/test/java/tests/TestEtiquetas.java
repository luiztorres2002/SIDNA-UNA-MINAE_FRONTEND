package tests;

import data.Database;
import data.EtiquetaDao;
import logic.Etiqueta;
import org.junit.Test;

import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TestEtiquetas {
    private final Database db = new Database();
    private EtiquetaDao etiquetaDao = new EtiquetaDao(db);

    @Test
    public void updateEtiqueta()throws SQLException{
        Etiqueta etiqueta=new Etiqueta(3, "Bosques", "1", true);
        String sql="UPDATE Etiqueta SET Descripcion=? where PK_EtiquetaId=?";
        PreparedStatement stm = db.prepareStatement(sql);
        stm.setString(1, etiqueta.getDescripcion());
        stm.setInt(2, etiqueta.getEtiquetaId());
        int rows = stm.executeUpdate();
        assert rows>0;
        System.out.println("Test Actulizacion Etiqueta Realizado Exitosamente");
    }
}
