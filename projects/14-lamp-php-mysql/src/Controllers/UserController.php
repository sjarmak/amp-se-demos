<?php

namespace App\Controllers;

use App\Models\User;
use PDO;

class UserController
{
    private User $userModel;
    
    public function __construct(PDO $db)
    {
        $this->userModel = new User($db);
    }
    
    public function index(): void
    {
        try {
            $users = $this->userModel->findAll();
            
            echo "<h1>Users</h1>";
            echo "<table border='1'>";
            echo "<tr><th>ID</th><th>Name</th><th>Email</th><th>Created</th></tr>";
            
            foreach ($users as $user) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($user['id']) . "</td>";
                echo "<td>" . htmlspecialchars($user['name']) . "</td>";
                echo "<td>" . htmlspecialchars($user['email']) . "</td>";
                echo "<td>" . htmlspecialchars($user['created_at']) . "</td>";
                echo "</tr>";
            }
            
            echo "</table>";
            echo "<br><a href='/'>Back to Home</a>";
            
        } catch (\Exception $e) {
            echo "Error loading users: " . htmlspecialchars($e->getMessage());
        }
    }
    
    public function create(): void
    {
        try {
            $name = $_POST['name'] ?? '';
            $email = $_POST['email'] ?? '';
            
            $id = $this->userModel->create($name, $email);
            echo "User created with ID: $id";
            echo "<br><a href='/users'>View Users</a>";
            
        } catch (\Exception $e) {
            echo "Error creating user: " . htmlspecialchars($e->getMessage());
        }
    }
}
