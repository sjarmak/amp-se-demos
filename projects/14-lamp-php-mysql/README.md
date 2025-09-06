# 14-lamp-php-mysql

LAMP Stack: Linux + Apache + MySQL + PHP. Classic web development stack.

- Dev: ./scripts/dev.sh (starts Apache with PHP)
- Test: ./scripts/test.sh (PHPUnit)
- CI: ./scripts/ci.sh

Demonstrates traditional LAMP patterns, MVC architecture, MySQL integration, and PHP best practices.

Env:
- MYSQL_URL (default: mysql://root:password@localhost:3306/lampstack)
