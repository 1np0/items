/**
 * FormHandler - Handles form interactions and validation
 */
export class FormHandler {
    constructor() {
        this.successMessage = null;
        this.errorMessage = null;
    }

    /**
     * Toggle form visibility
     * @param {HTMLElement} form - The form element
     * @param {HTMLElement} toggleBtn - The toggle button
     */
    toggleForm(form, toggleBtn) {
        if (form.classList.contains('hidden')) {
            this.showForm(form, toggleBtn);
        } else {
            this.hideForm(form, toggleBtn);
        }
    }

    /**
     * Show form with animation
     * @param {HTMLElement} form - The form element
     * @param {HTMLElement} toggleBtn - The toggle button
     */
    showForm(form, toggleBtn) {
        form.classList.remove('hidden');
        form.classList.add('fade-in');
        toggleBtn.innerHTML = '<span class="icon">❌</span> Tutup Form';
        
        // Focus first input
        const firstInput = form.querySelector('input:not([type="hidden"])');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }

    /**
     * Hide form with animation
     * @param {HTMLElement} form - The form element
     * @param {HTMLElement} toggleBtn - The toggle button
     */
    hideForm(form, toggleBtn) {
        form.classList.add('hidden');
        form.classList.remove('fade-in');
        toggleBtn.innerHTML = '<span class="icon">📝</span> Tambah Item Baru';
    }

    /**
     * Validate form data
     * @param {Object} formData - The form data to validate
     * @returns {Object} - Validation result with isValid and errors
     */
    validateFormData(formData) {
        const errors = [];

        // Required field validation
        if (!formData.kodeItem || formData.kodeItem.trim() === '') {
            errors.push('Kode Item harus diisi');
        }

        if (!formData.namaItem || formData.namaItem.trim() === '') {
            errors.push('Nama Item harus diisi');
        }

        // Format validation
        if (formData.kodeItem && formData.kodeItem.length < 2) {
            errors.push('Kode Item minimal 2 karakter');
        }

        if (formData.namaItem && formData.namaItem.length < 3) {
            errors.push('Nama Item minimal 3 karakter');
        }

        // Numeric validation
        const numericFields = ['stok', 'hargaPokok', 'hargaJual', 'stokMin'];
        numericFields.forEach(field => {
            if (formData[field] !== '' && formData[field] !== null && formData[field] !== undefined) {
                const value = parseFloat(formData[field]);
                if (isNaN(value) || value < 0) {
                    errors.push(`${this.getFieldLabel(field)} harus berupa angka positif`);
                }
                if (value > 999999999) {
                    errors.push(`${this.getFieldLabel(field)} terlalu besar (maksimal 999,999,999)`);
                }
            }
        });

        // Business logic validation
        if (formData.stok !== '' && formData.stokMin !== '') {
            const stok = parseFloat(formData.stok);
            const stokMin = parseFloat(formData.stokMin);
            if (!isNaN(stok) && !isNaN(stokMin) && stokMin > stok) {
                errors.push('Stok Minimum tidak boleh lebih besar dari Stok');
            }
        }

        if (formData.hargaPokok !== '' && formData.hargaJual !== '') {
            const hargaPokok = parseFloat(formData.hargaPokok);
            const hargaJual = parseFloat(formData.hargaJual);
            if (!isNaN(hargaPokok) && !isNaN(hargaJual) && hargaJual < hargaPokok) {
                errors.push('Harga Jual tidak boleh lebih kecil dari Harga Pokok');
            }
        }

        // Character limits
        const charLimits = {
            kodeItem: 50,
            namaItem: 200,
            barcode: 50,
            rak: 50,
            jenis: 20,
            merek: 100,
            supplier: 20,
            keterangan: 500
        };

        Object.keys(charLimits).forEach(field => {
            if (formData[field] && formData[field].length > charLimits[field]) {
                errors.push(`${this.getFieldLabel(field)} maksimal ${charLimits[field]} karakter`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Get human-readable field label
     * @param {string} fieldName - The field name
     * @returns {string} - Human-readable label
     */
    getFieldLabel(fieldName) {
        const labels = {
            kodeItem: 'Kode Item',
            namaItem: 'Nama Item',
            barcode: 'Barcode',
            stok: 'Stok',
            satuan: 'Satuan',
            rak: 'Rak',
            jenis: 'Jenis',
            merek: 'Merek',
            hargaPokok: 'Harga Pokok',
            hargaJual: 'Harga Jual',
            tipe: 'Tipe',
            systemHpp: 'System HPP',
            stokMin: 'Stok Min',
            statusJual: 'Status Jual',
            keterangan: 'Keterangan',
            supplier: 'Supplier'
        };
        return labels[fieldName] || fieldName;
    }

    /**
     * Format form data for submission
     * @param {FormData} formData - Raw form data
     * @returns {Object} - Formatted form data
     */
    formatFormData(formData) {
        const formatted = {};
        
        for (let [key, value] of formData.entries()) {
            formatted[key] = value.trim();
        }

        // Parse numeric fields
        const numericFields = ['stok', 'hargaPokok', 'hargaJual', 'stokMin'];
        numericFields.forEach(field => {
            if (formatted[field] !== '') {
                formatted[field] = parseFloat(formatted[field]) || 0;
            } else {
                formatted[field] = 0;
            }
        });

        return formatted;
    }

    /**
     * Populate form with data
     * @param {HTMLFormElement} form - The form element
     * @param {Object} data - The data to populate
     */
    populateForm(form, data) {
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'select-one' || field.type === 'select-multiple') {
                    field.value = data[key] || '';
                } else if (field.type === 'checkbox') {
                    field.checked = Boolean(data[key]);
                } else {
                    field.value = data[key] || '';
                }
            }
        });
    }

    /**
     * Reset form to empty state
     * @param {HTMLFormElement} form - The form element
     */
    resetForm(form) {
        form.reset();
        this.clearFieldValidation(form);
        this.hideMessages();
    }

    /**
     * Clear validation styling from all fields
     * @param {HTMLFormElement} form - The form element
     */
    clearFieldValidation(form) {
        const fields = form.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });
    }

    /**
     * Show validation errors on form fields
     * @param {HTMLFormElement} form - The form element
     * @param {Array} errors - Array of error messages
     */
    showFieldValidation(form, errors) {
        // Clear previous validation
        this.clearFieldValidation(form);

        // Show field-specific errors if available
        errors.forEach(error => {
            // This could be enhanced to show field-specific errors
            console.warn('Validation error:', error);
        });

        // Focus first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.focus();
        }
    }

    /**
     * Show success message
     * @param {string} message - The success message
     * @param {HTMLElement} container - Container to show message in
     */
    showSuccess(message, container = null) {
        this.showMessage(message, 'success', container);
    }

    /**
     * Show error message
     * @param {string} message - The error message
     * @param {HTMLElement} container - Container to show message in
     */
    showError(message, container = null) {
        this.showMessage(message, 'error', container);
    }

    /**
     * Show message to user
     * @param {string} message - The message to show
     * @param {string} type - Message type (success, error, info)
     * @param {HTMLElement} container - Container element
     */
    showMessage(message, type = 'info', container = null) {
        const messageContainer = container || this.getMessageContainer();
        
        // Remove existing messages
        this.hideMessages();

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `alert alert-${type} fade-in`;
        messageEl.innerHTML = `
            <span class="icon">${this.getMessageIcon(type)}</span>
            <span>${message}</span>
            <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;

        // Add to container
        messageContainer.appendChild(messageEl);

        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                if (messageEl.parentElement) {
                    messageEl.remove();
                }
            }, 5000);
        }

        // Scroll to message
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Get or create message container
     * @returns {HTMLElement} - Message container
     */
    getMessageContainer() {
        let container = document.querySelector('.message-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'message-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Hide all messages
     */
    hideMessages() {
        const messages = document.querySelectorAll('.alert');
        messages.forEach(message => message.remove());
    }

    /**
     * Get icon for message type
     * @param {string} type - Message type
     * @returns {string} - Icon HTML
     */
    getMessageIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        return icons[type] || icons.info;
    }

    /**
     * Generate unique item code
     * @param {string} prefix - Prefix for the code
     * @param {Array} existingCodes - Array of existing codes
     * @returns {string} - Unique code
     */
    generateUniqueCode(prefix = 'ITEM', existingCodes = []) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        let code = `${prefix}${timestamp}${random}`;
        
        // Ensure uniqueness
        let counter = 1;
        while (existingCodes.includes(code)) {
            code = `${prefix}${timestamp}${random}${counter}`;
            counter++;
        }
        
        return code;
    }

    /**
     * Auto-fill form suggestions
     * @param {HTMLFormElement} form - The form element
     * @param {Object} lastUsedData - Last used form data
     */
    autoFillSuggestions(form, lastUsedData) {
        // Auto-fill based on last used values
        const autoFillFields = ['satuan', 'jenis', 'tipe', 'systemHpp', 'statusJual'];
        
        autoFillFields.forEach(field => {
            const formField = form.querySelector(`[name="${field}"]`);
            if (formField && lastUsedData[field] && !formField.value) {
                formField.value = lastUsedData[field];
            }
        });
    }

    /**
     * Set up real-time validation
     * @param {HTMLFormElement} form - The form element
     */
    setupRealtimeValidation(form) {
        const fields = form.querySelectorAll('.form-control');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
            
            field.addEventListener('input', () => {
                // Clear validation state on input
                field.classList.remove('is-invalid');
            });
        });
    }

    /**
     * Validate single field
     * @param {HTMLElement} field - The field to validate
     * @returns {boolean} - True if valid
     */
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let message = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Field ini wajib diisi';
        }

        // Specific field validations
        if (value && fieldName === 'kodeItem') {
            if (value.length < 2) {
                isValid = false;
                message = 'Minimal 2 karakter';
            }
        }

        if (value && fieldName === 'namaItem') {
            if (value.length < 3) {
                isValid = false;
                message = 'Minimal 3 karakter';
            }
        }

        // Numeric validation
        if (value && ['stok', 'hargaPokok', 'hargaJual', 'stokMin'].includes(fieldName)) {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                isValid = false;
                message = 'Harus berupa angka positif';
            }
        }

        // Update field styling
        field.classList.toggle('is-valid', isValid);
        field.classList.toggle('is-invalid', !isValid);

        // Show error message if needed
        this.updateFieldErrorMessage(field, message);

        return isValid;
    }

    /**
     * Update field error message
     * @param {HTMLElement} field - The field element
     * @param {string} message - Error message
     */
    updateFieldErrorMessage(field, message) {
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        if (message) {
            const errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            errorEl.style.cssText = `
                color: #dc3545;
                font-size: 0.8rem;
                margin-top: 4px;
            `;
            errorEl.textContent = message;
            field.parentNode.appendChild(errorEl);
        }
    }

    /**
     * Get form data as object
     * @param {HTMLFormElement} form - The form element
     * @returns {Object} - Form data object
     */
    getFormData(form) {
        const formData = new FormData(form);
        return this.formatFormData(formData);
    }
}