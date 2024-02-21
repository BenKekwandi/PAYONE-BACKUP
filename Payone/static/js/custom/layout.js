$(document).ready(function () {
    const csrfToken = $('meta[name=csrf-token]').attr('content');

    function submitLanguageForm(language) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'switch-language/';

        const languageInput = document.createElement('input');
        languageInput.type = 'hidden';
        languageInput.name = 'language';
        languageInput.value = language;

        form.appendChild(languageInput);

        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrfmiddlewaretoken';
        csrfInput.value = csrfToken;

        form.appendChild(csrfInput);

        document.body.appendChild(form);

        form.submit();
    }

    $('#enLan').on('click', function () {
        submitLanguageForm('en');
    });

    $('#trLan').on('click', function () {
        submitLanguageForm('tr');
    });
});
