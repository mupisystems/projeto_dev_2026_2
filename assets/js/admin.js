(function () {
    'use strict';

    function getCsrfToken() {
        return window.CSRF_TOKEN
            || document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            || '';
    }

    document.querySelectorAll('.btn-status').forEach(function (button) {
        button.addEventListener('click', async function () {
            const row = button.closest('tr');
            if (!row) return;

            const id = row.dataset.id;
            const status = button.dataset.status;
            const label = status === 'confirmado' ? 'confirmar' : 'cancelar';

            if (!confirm('Deseja ' + label + ' este agendamento?')) {
                return;
            }

            button.disabled = true;

            try {
                const formData = new FormData();
                formData.append('id', id);
                formData.append('status', status);
                formData.append('csrf_token', getCsrfToken());

                const response = await fetch((window.APP_BASE || '') + '/admin/api/status.php', {
                    method: 'POST',
                    body: formData,
                    credentials: 'same-origin',
                    headers: {
                        'X-CSRF-Token': getCsrfToken(),
                    },
                });

                const result = await response.json();

                if (result.success) {
                    window.location.reload();
                } else {
                    alert(result.message || 'Erro ao atualizar status.');
                    button.disabled = false;
                }
            } catch (err) {
                alert('Erro de conexão. Tente novamente.');
                button.disabled = false;
            }
        });
    });
})();
