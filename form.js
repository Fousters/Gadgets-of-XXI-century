document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Добавляем индикаторы обязательных полей
    function addRequiredIndicators() {
        requiredFields.forEach(field => {
            const label = field.closest('.form-group').querySelector('label');
            if (label && !label.querySelector('.required-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'required-indicator';
                indicator.textContent = ' *';
                indicator.style.color = '#dc3545';
                label.appendChild(indicator);
            }
        });
    }
    
    // Валидация телефона
    function formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = '+7 (' + value;
            if (value.length > 7) value = value.slice(0, 7) + ') ' + value.slice(7);
            if (value.length > 12) value = value.slice(0, 12) + '-' + value.slice(12);
            if (value.length > 15) value = value.slice(0, 15) + '-' + value.slice(15);
            if (value.length > 18) value = value.slice(0, 18);
        }
        
        input.value = value;
    }
        
    // Валидация формы
    function validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        // Удаляем предыдущие сообщения об ошибках
        if (errorElement) errorElement.remove();
        
        // Проверяем валидность
        if (!field.validity.valid) {
            let message = '';
            
            if (field.validity.valueMissing) {
                message = 'Это поле обязательно для заполнения';
            } else if (field.validity.typeMismatch) {
                message = 'Пожалуйста, введите корректное значение';
            } else if (field.validity.patternMismatch) {
                if (field.id === 'phone') {
                    message = 'Введите телефон в формате +7 (999) 999-99-99';
                } else if (field.id === 'fullname') {
                    message = 'Используйте только русские буквы и пробелы';
                }
            } else if (field.validity.tooShort) {
                message = `Минимальная длина: ${field.minLength} символов`;
            } else if (field.validity.tooLong) {
                message = `Максимальная длина: ${field.maxLength} символов`;
            }
            
            if (message) {
                const error = document.createElement('div');
                error.className = 'error-message';
                error.textContent = message;
                error.style.cssText = `
                    color: #dc3545;
                    font-size: 14px;
                    margin-top: 5px;
                    padding: 5px;
                    background: rgba(220, 53, 69, 0.1);
                    border-radius: 4px;
                    border-left: 3px solid #dc3545;
                `;
                formGroup.appendChild(error);
                
                field.style.borderColor = '#dc3545';
                field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.2)';
                return false;
            }
        }
        
        field.style.borderColor = '#28a745';
        field.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.2)';
        return true;
    }
    
    // Подсчет символов в текстовом поле
    function addCharacterCounter() {
        const textarea = document.getElementById('message');
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 14px;
            color: #888;
            margin-top: 5px;
        `;
        
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = 500 - textarea.value.length;
            counter.textContent = `${textarea.value.length}/500 символов`;
            counter.style.color = remaining < 50 ? '#ffc107' : '#888';
            
            if (remaining < 0) {
                counter.style.color = '#dc3545';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    }
    
    // Имитация отправки формы
    function simulateFormSubmit(e) {
        e.preventDefault();
        
        // Проверяем все обязательные поля
        let isValid = true;
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Прокрутка к первой ошибке
            const firstError = form.querySelector('.error-message');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Сохраняем оригинальный текст кнопки
        const originalText = submitButton.innerHTML;
        
        // Показываем анимацию загрузки
        submitButton.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 8px;">
                <span class="spinner" style="
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: #fff;
                    animation: spin 1s linear infinite;
                "></span>
                Отправка...
            </span>
        `;
        
        submitButton.disabled = true;
        
        // Имитация задержки отправки
        setTimeout(() => {
            // Показываем уведомление об успехе
            showSuccessMessage();
            
            // Восстанавливаем кнопку
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Очищаем форму (опционально)
            // form.reset();
            
        }, 2000);
    }
    
    // Показать сообщение об успешной отправке
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #28a745, #1e7e34);
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 20px 0;
                animation: fadeIn 0.5s ease;
            ">
                <h3 style="margin-bottom: 10px;">✅ Форма успешно отправлена!</h3>
                <p>Ваши данные были получены. Мы свяжемся с вами в ближайшее время.</p>
                <button class="close-message" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Закрыть</button>
            </div>
        `;
        
        form.parentNode.insertBefore(successMessage, form.nextSibling);
        
        // Анимация появления
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Кнопка закрытия
        successMessage.querySelector('.close-message').addEventListener('click', function() {
            successMessage.remove();
        });
    }
    
    // Сохранение данных при перезагрузке страницы
    function saveFormData() {
        const formData = {};
        form.querySelectorAll('input, select, textarea').forEach(field => {
            if (field.type !== 'password') {
                formData[field.name] = field.value;
            }
        });
        localStorage.setItem('formData', JSON.stringify(formData));
    }
    
    function loadFormData() {
        const savedData = localStorage.getItem('formData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            Object.keys(formData).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'password') {
                    field.value = formData[key];
                }
            });
        }
    }
    
    // Инициализация
    function init() {
        // Добавляем индикаторы
        addRequiredIndicators();
        
        // Добавляем счетчик символов
        addCharacterCounter();
        
        // Форматирование телефона
        phoneInput.addEventListener('input', () => formatPhoneNumber(phoneInput));
        
        // Валидация при вводе
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) {
                    validateField(field);
                }
                saveFormData();
            });
        });
        
        // Обработчик отправки формы
        form.addEventListener('submit', simulateFormSubmit);
        
        // Загрузка сохраненных данных
        loadFormData();
        
        // Автосохранение при закрытии страницы
        window.addEventListener('beforeunload', saveFormData);
    }
    
    // Запускаем инициализацию
    init();
});