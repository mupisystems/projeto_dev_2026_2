import backendConfig from './backend/eslint.config.mjs';
import frontendConfig from './frontend/eslint.config.mjs';

/**
 * Configuração raiz do ESLint.
 *
 * Delega as regras específicas para cada workspace, mantendo a raiz livre
 * de lógica de lint para não duplicar configuração.
 */
export default [...backendConfig, ...frontendConfig];
