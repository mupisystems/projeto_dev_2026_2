-- Adiciona campos de telefone em bancos já existentes
-- Uso: php scripts/migrar_telefone.php

SET NAMES utf8mb4;

USE barbearia_estilo;

ALTER TABLE registros
    ADD COLUMN IF NOT EXISTS pais_codigo CHAR(2) NOT NULL DEFAULT 'BR' AFTER email,
    ADD COLUMN IF NOT EXISTS telefone VARCHAR(20) NOT NULL DEFAULT '' AFTER pais_codigo;

-- MySQL < 8.0 não suporta IF NOT EXISTS em ADD COLUMN; o script PHP trata isso.
