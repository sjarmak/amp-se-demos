<?php
require_once '../vendor/autoload.php';

use App\Controllers\UserController;
use App\Database\Connection;

session_start();

// Simple routing
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Connection::getInstance();
    
    switch ($uri) {
        case '/':
            echo "<h1>LAMP Stack Demo</h1>";
            echo "<p>Welcome to the PHP/MySQL demo application.</p>";
            echo "<a href='/users'>View Users</a>";
            break;
            
        case '/users':
            $controller = new UserController($db);
            if ($method === 'GET') {
                $controller->index();
            } elseif ($method === 'POST') {
                $controller->create();
            }
            break;
            
        case '/health':
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'ok',
                'timestamp' => date('c'),
                'php_version' => PHP_VERSION
            ]);
            break;
            
        default:
            http_response_code(404);
            echo "404 Not Found";
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo "Error: " . htmlspecialchars($e->getMessage());
}
