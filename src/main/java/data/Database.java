package data;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.swing.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Base64;

public class Database {

    Connection cnx;

    private static final String CLAVE_SECRETA = "1SafDOD+iJ7V2wMciWCJGQ==";
    public Database(){
        cnx = this.getConnection();
    }

    public Connection getConnection() {
        try {
            String driver = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
            String server = "localhost";
            String port = "1433"; // Puerto de SQL Server
            String user = "usersql";
            String password = "root1";
            String database = "SIDNA_DATABASE";
            //String database = "SIDNA_MINAEDBPRUEBA";

            String URL_conexion = "jdbc:sqlserver://" + server + ":" + port + ";databaseName=" + database + ";user=" + user + ";password=" + password + ";encrypt=true;trustServerCertificate=true;";
            //String URL_conexion = "jdbc:sqlserver://sidnaminae.database.windows.net:1433;database=SIDNA_MINAEDB;user=usersql@sidnaminae;password={K3!3KgeM87c7jD7};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;";
            Class.forName(driver);
            return DriverManager.getConnection(URL_conexion);
        } catch (Exception e) {
            System.err.println("Error al conectar a la base de datos: " + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    public PreparedStatement prepareStatement(String statement) throws SQLException {
        return cnx.prepareStatement(statement);
    }

    public int executeUpdate(PreparedStatement statement) {
        try {
            statement.executeUpdate();
            return statement.getUpdateCount();
        } catch (SQLException ex) {
            return 0;
        }
    }

    public ResultSet executeQuery(PreparedStatement statement){
        try {
            return statement.executeQuery();
        } catch (SQLException ex) {
        }
        return null;
    }


    public static void main(String[] args) {

        Database db = new Database();


        if (db.getConnection() != null) {
            System.out.println("Conexión exitosa!");
        } else {
            System.err.println("No se pudo establecer la conexión.");
        }
    }

    public  String descifrarCedula(String cedulaCifrada) {
        try {

            cedulaCifrada = cedulaCifrada.replace('-', '/');

            byte[] cedulaCifradaBytes = Base64.getDecoder().decode(cedulaCifrada);
            byte[] claveBytes = CLAVE_SECRETA.getBytes("UTF-8");

            SecretKeySpec claveSecreta = new SecretKeySpec(claveBytes, "AES");

            Cipher cifrador = Cipher.getInstance("AES");
            cifrador.init(Cipher.DECRYPT_MODE, claveSecreta);

            byte[] cedulaDescifradaBytes = cifrador.doFinal(cedulaCifradaBytes);

            String cedulaDescifrada = new String(cedulaDescifradaBytes, "UTF-8");
            return cedulaDescifrada;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public String cifrarCedula(String cedula) {
        try {
            byte[] claveBytes = CLAVE_SECRETA.getBytes("UTF-8");
            SecretKeySpec claveSecreta = new SecretKeySpec(claveBytes, "AES");

            Cipher cifrador = Cipher.getInstance("AES");
            cifrador.init(Cipher.ENCRYPT_MODE, claveSecreta);

            byte[] cedulaCifradaBytes = cifrador.doFinal(cedula.getBytes("UTF-8"));

            String cedulaCifrada = Base64.getEncoder().encodeToString(cedulaCifradaBytes);

            cedulaCifrada = cedulaCifrada.replace('/', '-');

            return cedulaCifrada;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


}