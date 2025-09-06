<?php

namespace App\Database;

use PDO;
use PDOException;

class Connection
{
    private static ?PDO $instance = null;
    
    public static function getInstance(): PDO
    {
        if (self::$instance === null) {
            $dsn = $_ENV['MYSQL_URL'] ?? 'mysql:host=localhost;dbname=lampstack;charset=utf8mb4';
            $username = $_ENV['MYSQL_USER'] ?? 'root';
            $password = $_ENV['MYSQL_PASSWORD'] ?? 'password';
            
            try {
                self::$instance = new PDO($dsn, $username, $password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);
            } catch (PDOException $e) {
                throw new \Exception('Database connection failed: ' . $e->getMessage());
            }
        }
        
        return self::$instance;
    }
}
