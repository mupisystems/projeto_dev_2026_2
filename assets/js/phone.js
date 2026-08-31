(function () {
    'use strict';

    const countries = window.PHONE_COUNTRIES || {};

    function digitsOnly(value) {
        return (value || '').replace(/\D/g, '');
    }

    function pickMask(countryCode, digitLength) {
        const config = countries[countryCode];
        if (!config || !config.masks || !config.masks.length) {
            return '#'.repeat(digitLength || 15);
        }

        if (config.masks.length === 1) {
            return config.masks[0];
        }

        return digitLength <= config.min
            ? config.masks[config.masks.length - 1]
            : config.masks[0];
    }

    function applyMask(digits, mask) {
        let result = '';
        let index = 0;
        const maxDigits = (mask.match(/#/g) || []).length;

        if (digits.length > maxDigits) {
            digits = digits.slice(0, maxDigits);
        }

        for (let i = 0; i < mask.length; i++) {
            if (mask[i] === '#') {
                if (index >= digits.length) break;
                result += digits[index];
                index++;
            } else if (index < digits.length) {
                result += mask[i];
            }
        }

        return result;
    }

    function formatPhone(countryCode, rawValue) {
        const config = countries[countryCode];
        if (!config) return rawValue;

        const digits = digitsOnly(rawValue);
        const mask = pickMask(countryCode, digits.length);
        return applyMask(digits, mask);
    }

    function getPlaceholder(countryCode) {
        const config = countries[countryCode];
        if (!config || !config.masks || !config.masks[0]) {
            return '';
        }
        return config.masks[0].replace(/#/g, '9');
    }

    function validatePhone(countryCode, rawValue) {
        const config = countries[countryCode];
        if (!config) return 'Selecione um país válido.';

        const digits = digitsOnly(rawValue);
        if (!digits) return 'Informe seu número de contato.';

        if (digits.length < config.min || digits.length > config.max) {
            return 'Número inválido para ' + config.nome + '.';
        }

        if (countryCode === 'BR' && digits.length === 11 && digits[2] !== '9') {
            return 'Celular brasileiro deve começar com 9 após o DDD.';
        }

        return null;
    }

    function initPhoneField(countrySelect, phoneInput) {
        function refresh() {
            const country = countrySelect.value;
            phoneInput.placeholder = getPlaceholder(country);
            phoneInput.value = formatPhone(country, phoneInput.value);
        }

        countrySelect.addEventListener('change', refresh);

        phoneInput.addEventListener('input', function () {
            const country = countrySelect.value;
            const digits = digitsOnly(phoneInput.value);
            const config = countries[country];
            const max = config ? config.max : 15;
            phoneInput.value = formatPhone(country, digits.slice(0, max));
        });

        phoneInput.addEventListener('keydown', function (event) {
            if (event.key === 'Backspace' && phoneInput.selectionStart === phoneInput.selectionEnd) {
                const pos = phoneInput.selectionStart;
                if (pos > 0 && /\D/.test(phoneInput.value[pos - 1])) {
                    event.preventDefault();
                    phoneInput.setSelectionRange(pos - 1, pos - 1);
                }
            }
        });

        refresh();
    }

    window.PhoneField = {
        formatPhone: formatPhone,
        validatePhone: validatePhone,
        digitsOnly: digitsOnly,
        initPhoneField: initPhoneField,
    };

    document.addEventListener('DOMContentLoaded', bootPhoneField);
    if (document.readyState !== 'loading') {
        bootPhoneField();
    }

    function bootPhoneField() {
        const countrySelect = document.getElementById('pais_codigo');
        const phoneInput = document.getElementById('telefone');
        if (countrySelect && phoneInput && !countrySelect.dataset.phoneInit) {
            countrySelect.dataset.phoneInit = '1';
            initPhoneField(countrySelect, phoneInput);
        }
    }
})();
