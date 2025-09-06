<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use App\Models\User;
use App\Database\Connection;

class UserTest extends TestCase
{
    private $db;
    private User $userModel;
    
    protected function setUp(): void
    {
        // Use in-memory SQLite for tests
        $this->db = new \PDO('sqlite::memory:');
        $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        
        // Create test table
        $this->db->exec('CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )');
        
        $this->userModel = new User($this->db);
    }
    
    public function testCreateUser(): void
    {
        $id = $this->userModel->create('John Doe', 'john@example.com');
        
        $this->assertGreaterThan(0, $id);
        
        $user = $this->userModel->findById($id);
        $this->assertNotNull($user);
        $this->assertEquals('John Doe', $user['name']);
        $this->assertEquals('john@example.com', $user['email']);
    }
    
    public function testFindAllUsers(): void
    {
        $this->userModel->create('Alice', 'alice@example.com');
        $this->userModel->create('Bob', 'bob@example.com');
        
        $users = $this->userModel->findAll();
        
        $this->assertCount(2, $users);
        $this->assertEquals('Alice', $users[0]['name']);
        $this->assertEquals('Bob', $users[1]['name']);
    }
    
    public function testCreateUserWithEmptyName(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->userModel->create('', 'test@example.com');
    }
}
