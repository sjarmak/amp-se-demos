<?php

namespace App\Models;

use PDO;

class User
{
    private PDO $db;
    
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }
    
    public function findAll(): array
    {
        $stmt = $this->db->prepare('SELECT id, name, email, created_at FROM users ORDER BY id');
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
    
    public function create(string $name, string $email): int
    {
        // Basic validation (intentional: room for improvement in demo flows)
        if (empty($name) || empty($email)) {
            throw new \InvalidArgumentException('Name and email are required');
        }
        
        $stmt = $this->db->prepare('INSERT INTO users (name, email, created_at) VALUES (?, ?, NOW())');
        $stmt->execute([$name, $email]);
        return (int) $this->db->lastInsertId();
    }
    
    public function update(int $id, string $name, string $email): bool
    {
        $stmt = $this->db->prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
        return $stmt->execute([$name, $email, $id]);
    }
    
    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM users WHERE id = ?');
        return $stmt->execute([$id]);
    }
}
