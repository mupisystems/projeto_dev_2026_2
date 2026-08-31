(function () {
    'use strict';

    const form = document.getElementById('form-agendamento');
    const alertBox = document.getElementById('form-alert');
    const submitBtn = document.getElementById('btn-submit');
    const dataInput = document.getElementById('data');

    if (!form) return;

    const hoje = new Date();
    const minDate = hoje.toISOString().split('T')[0];
    const maxDateObj = new Date(hoje);
    maxDateObj.setDate(maxDateObj.getDate() + 60);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    if (dataInput) {
        dataInput.min = minDate;
        dataInput.max = maxDate;
    }

    function showAlert(message, type) {
        alertBox.textContent = message;
        alertBox.className = 'alert ' + type;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideAlert() {
        alertBox.className = 'alert hidden';
        alertBox.textContent = '';
    }

    function clearErrors() {
        form.querySelectorAll('.field-error').forEach(function (el) {
            el.textContent = '';
        });
        form.querySelectorAll('.invalid').forEach(function (el) {
            el.classList.remove('invalid');
        });
    }

    function showErrors(errors) {
        Object.keys(errors).forEach(function (field) {
            const errorEl = form.querySelector('[data-error="' + field + '"]');
            const inputEl = form.querySelector('[name="' + field + '"]')
                || (field === 'telefone' ? form.querySelector('#telefone') : null);
            if (errorEl) errorEl.textContent = errors[field];
            if (inputEl) inputEl.classList.add('invalid');
        });
    }

    function validarFrontend() {
        const errors = {};
        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const paisCodigo = form.pais_codigo.value;
        const telefone = form.telefone.value;
        const opcaoId = form.opcao_id.value;
        const data = form.data.value;
        const horario = form.horario.value;

        if (nome.length < 3) errors.nome = 'Informe seu nome completo (mín. 3 caracteres).';
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Informe um e-mail válido.';
        }
        if (window.PhoneField) {
            const phoneError = window.PhoneField.validatePhone(paisCodigo, telefone);
            if (phoneError) errors.telefone = phoneError;
        } else if (!telefone.trim()) {
            errors.telefone = 'Informe seu número de contato.';
        }
        if (!opcaoId) errors.opcao_id = 'Selecione um serviço.';
        if (!data) {
            errors.data = 'Informe a data desejada.';
        } else if (data < minDate) {
            errors.data = 'A data não pode ser no passado.';
        } else if (data > maxDate) {
            errors.data = 'Agendamentos com até 60 dias de antecedência.';
        }
        if (!horario) {
            errors.horario = 'Informe o horário desejado.';
        } else {
            const [h, m] = horario.split(':').map(Number);
            if (h < 9 || h > 19 || (h === 19 && m > 0)) {
                errors.horario = 'Horário de funcionamento: 09:00 às 19:00.';
            }
        }

        return errors;
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        hideAlert();
        clearErrors();

        const frontendErrors = validarFrontend();
        if (Object.keys(frontendErrors).length > 0) {
            showErrors(frontendErrors);
            showAlert('Corrija os campos destacados antes de enviar.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const formData = new FormData(form);
            const csrfInput = form.querySelector('input[name="csrf_token"]');
            if (csrfInput) {
                formData.set('csrf_token', csrfInput.value);
            }
            if (window.PhoneField) {
                formData.set('telefone', window.PhoneField.digitsOnly(form.telefone.value));
            }
            const response = await fetch((window.APP_BASE || '') + '/api/registros.php', {
                method: 'POST',
                body: formData,
                credentials: 'same-origin',
                headers: {
                    'X-CSRF-Token': csrfInput ? csrfInput.value : '',
                },
            });

            const result = await response.json();

            if (result.success) {
                form.reset();
                const countrySelect = document.getElementById('pais_codigo');
                if (countrySelect) {
                    countrySelect.dispatchEvent(new Event('change'));
                }
                showAlert(result.message, 'success');
            } else {
                if (result.errors) showErrors(result.errors);
                showAlert(result.message || 'Erro ao enviar. Tente novamente.', 'error');
            }
        } catch (err) {
            showAlert('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar agendamento';
        }
    });
})();
