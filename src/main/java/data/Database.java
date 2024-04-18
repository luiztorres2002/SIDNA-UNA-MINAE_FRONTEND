package data;

import javax.swing.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Database {

    Connection cnx;

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
            String database = "SIDNA_MINAEDB";
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

    public int executeUpdateWithKeys(String statement) {
        try {
            Statement stm = cnx.createStatement();
            stm.executeUpdate(statement,Statement.RETURN_GENERATED_KEYS);
            ResultSet keys = stm.getGeneratedKeys();
            keys.next();
            return keys.getInt(1);
        } catch (SQLException ex) {
            return -1;
        }
    }

    public static void main(String[] args) {
        // Crear una instancia de la clase Database
        Database db = new Database();

        // Probar la conexión
        if (db.getConnection() != null) {
            System.out.println("Conexión exitosa!");
        } else {
            System.err.println("No se pudo establecer la conexión.");
        }
    }

}