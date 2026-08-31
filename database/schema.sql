-- Barbearia Estilo Clássico - Schema
-- Execute este arquivo no phpMyAdmin ou via linha de comando MySQL
-- IMPORTANTE: salve este arquivo em UTF-8 e importe com charset utf8mb4

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS barbearia_estilo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE barbearia_estilo;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    deve_trocar_senha TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS opcoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    duracao_minutos SMALLINT UNSIGNED NOT NULL DEFAULT 30,
    preco DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    ativa TINYINT(1) NOT NULL DEFAULT 1,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS registros (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    pais_codigo CHAR(2) NOT NULL DEFAULT 'BR',
    telefone VARCHAR(20) NOT NULL,
    opcao_id INT UNSIGNED NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    status ENUM('pendente', 'confirmado', 'cancelado') NOT NULL DEFAULT 'pendente',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_registros_opcao FOREIGN KEY (opcao_id) REFERENCES opcoes(id),
    INDEX idx_registros_data (data),
    INDEX idx_registros_status (status),
    INDEX idx_registros_email (email),
    INDEX idx_registros_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS historico_status (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    registro_id INT UNSIGNED NOT NULL,
    status_anterior ENUM('pendente', 'confirmado', 'cancelado') NOT NULL,
    status_novo ENUM('pendente', 'confirmado', 'cancelado') NOT NULL,
    alterado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_historico_registro FOREIGN KEY (registro_id) REFERENCES registros(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
