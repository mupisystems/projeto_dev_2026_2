-- Dados iniciais: opções de serviço e usuário admin
-- A senha padrão é "admin123" (hash gerado com password_hash)
-- IMPORTANTE: salve este arquivo em UTF-8 e importe com charset utf8mb4

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE barbearia_estilo;
INSERT INTO opcoes (titulo, descricao, duracao_minutos, preco, ativa) VALUES
('Corte Clássico', 'Corte tradicional com acabamento na navalha e finalização com pomada.', 30, 45.00, 1),
('Barba Completa', 'Modelagem da barba, toalha quente, hidratação e acabamento premium.', 25, 35.00, 1),
('Combo Corte + Barba', 'Experiência completa: corte personalizado e barba impecável.', 50, 70.00, 1),
('Pezinho & Contorno', 'Acabamento de contorno e pezinho para manter o visual sempre alinhado.', 15, 20.00, 0);

-- Senha: admin123
INSERT INTO usuarios (nome, email, senha_hash) VALUES
('Administrador', 'admin@barbearia.local', '$2y$10$4N0pOTo7/UJ4VezOWyG/4OYYx/EieZFjOi.HyohAxWIEuRwlA7Dm.');
