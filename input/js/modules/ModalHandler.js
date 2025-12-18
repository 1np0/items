/**
 * ModalHandler - Handles modal dialogs for editing and confirmations
 */
export class ModalHandler {
    constructor() {
        this.modal = document.getElementById('editModal');
        this.modalContent = this.modal?.querySelector('.modal-content');
        this.modalBody = this.modal?.querySelector('.modal-body');
        this.currentCallback = null;
        
        this.bindEvents();
    }

    /**
     * Bind modal events
     */
    bindEvents() {
        if (!this.modal) return;

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            }
        });

        // Prevent modal close when clicking inside modal content
        this.modalContent?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    /**
     * Open edit modal with item data
     * @param {Object} item - Item data to edit
     * @param {Function} callback - Callback function when saving
     */
    openEditModal(item, callback) {
        if (!this.modal || !this.modalBody) {
            console.error('Modal elements not found');
            return;
        }

        this.currentCallback = callback;
        this.renderEditForm(item);
        this.showModal();
    }

    /**
     * Render edit form in modal
     * @param {Object} item - Item data
     */
    renderEditForm(item) {
        const formHTML = `
            <form id="editForm" class="item-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="edit_kodeItem">Kode Item *</label>
                        <input type="text" id="edit_kodeItem" name="kodeItem" required 
                               value="${this.escapeHTML(item.kodeItem || '')}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="edit_barcode">Barcode</label>
                        <input type="text" id="edit_barcode" name="barcode" 
                               value="${this.escapeHTML(item.barcode || '')}" class="form-control">
                    </div>

                    <div class="form-group full-width">
                        <label for="edit_namaItem">Nama Item *</label>
                        <input type="text" id="edit_namaItem" name="namaItem" required 
                               value="${this.escapeHTML(item.namaItem || '')}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="edit_stok">Stok</label>
                        <input type="number" id="edit_stok" name="stok" step="0.01" 
                               value="${item.stok || ''}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="edit_satuan">Satuan</label>
                        <select id="edit_satuan" name="satuan" class="form-control">
                            <option value="">Pilih Satuan</option>
                            <option value="PCS" ${item.satuan === 'PCS' ? 'selected' : ''}>PCS (Pieces)</option>
                            <option value="KG" ${item.satuan === 'KG' ? 'selected' : ''}>KG (Kilogram)</option>
                            <option value="LTR" ${item.satuan === 'LTR' ? 'selected' : ''}>LTR (Liter)</option>
                            <option value="BOX" ${item.satuan === 'BOX' ? 'selected' : ''}>BOX (Kotak)</option>
                            <option value="BKS" ${item.satuan === 'BKS' ? 'selected' : ''}>BKS (Bungkus)</option>
                            <option value="BTL" ${item.satuan === 'BTL' ? 'selected' : ''}>BTL (Botol)</option>
                            <option value="MTR" ${item.satuan === 'MTR' ? 'selected' : ''}>MTR (Meter)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="edit_rak">Rak</label>
                        <input type="text" id="edit_rak" name="rak" 
                               value="${this.escapeHTML(item.rak || '')}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="edit_jenis">Jenis</label>
                        <input type="text" id="edit_jenis" name="jenis" 
                               value="${this.escapeHTML(item.jenis || '')}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="edit_merek">Merek</label>
                        <input type="text" id="edit_merek" name="merek" 
                               value="${this.escapeHTML(item.merek || '')}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="edit_hargaPokok">Harga Pokok</label>
                        <input type="number" id="edit_hargaPokok" name="hargaPokok" step="0.01" 
                               value="${item.hargaPokok || ''}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="edit_hargaJual">Harga Jual</label>
                        <input type="number" id="edit_hargaJual" name="hargaJual" step="0.01" 
                               value="${item.hargaJual || ''}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="edit_tipe">Tipe</label>
                        <select id="edit_tipe" name="tipe" class="form-control">
                            <option value="INV" ${item.tipe === 'INV' ? 'selected' : ''}>INV (Inventory)</option>
                            <option value="NON-INV" ${item.tipe === 'NON-INV' ? 'selected' : ''}>NON-INV (Non-Inventory)</option>
                            <option value="SERVICE" ${item.tipe === 'SERVICE' ? 'selected' : ''}>SERVICE (Jasa)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="edit_systemHpp">System HPP</label>
                        <select id="edit_systemHpp" name="systemHpp" class="form-control">
                            <option value="FIFO" ${item.systemHpp === 'FIFO' ? 'selected' : ''}>FIFO (First In First Out)</option>
                            <option value="LIFO" ${item.systemHpp === 'LIFO' ? 'selected' : ''}>LIFO (Last In First Out)</option>
                            <option value="AVG" ${item.systemHpp === 'AVG' ? 'selected' : ''}>AVG (Average)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="edit_stokMin">Stok Min</label>
                        <input type="number" id="edit_stokMin" name="stokMin" step="0.01" 
                               value="${item.stokMin || ''}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label for="edit_statusJual">Status Jual</label>
                        <select id="edit_statusJual" name="statusJual" class="form-control">
                            <option value="Masih Dijual" ${item.statusJual === 'Masih Dijual' ? 'selected' : ''}>Masih Dijual</option>
                            <option value="Tidak Dijual" ${item.statusJual === 'Tidak Dijual' ? 'selected' : ''}>Tidak Dijual</option>
                            <option value="Discontinue" ${item.statusJual === 'Discontinue' ? 'selected' : ''}>Discontinue</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="edit_supplier">Supplier</label>
                        <input type="text" id="edit_supplier" name="supplier" 
                               value="${this.escapeHTML(item.supplier || '')}" class="form-control">
                    </div>

                    <div class="form-group full-width">
                        <label for="edit_keterangan">Keterangan</label>
                        <textarea id="edit_keterangan" name="keterangan" 
                                  class="form-control">${this.escapeHTML(item.keterangan || '')}</textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <span class="icon">💾</span> Simpan Perubahan
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="modalHandler.closeModal()">
                        <span class="icon">❌</span> Batal
                    </button>
                </div>
            </form>
        `;

        this.modalBody.innerHTML = formHTML;

        // Bind form submit event
        const form = this.modalBody.querySelector('#editForm');
        form.addEventListener('submit', (e) => this.handleEditSubmit(e, item.id));

        // Make modal handler globally available for the cancel button
        window.modalHandler = this;
    }

    /**
     * Handle edit form submission
     * @param {Event} e - Form submit event
     * @param {number} itemId - Item ID being edited
     */
    handleEditSubmit(e, itemId) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const updatedItem = { id: itemId };

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            updatedItem[key] = value;
        }

        // Parse numeric fields
        ['stok', 'hargaPokok', 'hargaJual', 'stokMin'].forEach(field => {
            if (updatedItem[field]) {
                updatedItem[field] = parseFloat(updatedItem[field]) || 0;
            }
        });

        // Add timestamp
        updatedItem.updatedAt = new Date().toISOString();

        // Validate required fields
        if (!updatedItem.kodeItem?.trim() || !updatedItem.namaItem?.trim()) {
            this.showMessage('Kode Item dan Nama Item harus diisi', 'error');
            return;
        }

        // Call callback with updated item
        if (this.currentCallback) {
            this.currentCallback(updatedItem);
        }

        this.closeModal();
    }

    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @param {Object} options - Confirmation options
     * @returns {Promise<boolean>} - User choice
     */
    async showConfirmation(message, options = {}) {
        const {
            title = 'Konfirmasi',
            confirmText = 'Ya',
            cancelText = 'Tidak',
            confirmClass = 'btn-danger'
        } = options;

        return new Promise((resolve) => {
            const modal = this.createConfirmationModal(message, title, confirmText, cancelText, confirmClass);
            document.body.appendChild(modal);

            // Handle confirm
            const confirmBtn = modal.querySelector('.confirm-btn');
            confirmBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(true);
            });

            // Handle cancel
            const cancelBtn = modal.querySelector('.cancel-btn');
            const closeBtn = modal.querySelector('.close-btn');
            
            const cancel = () => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
                resolve(false);
            };

            cancelBtn.addEventListener('click', cancel);
            closeBtn.addEventListener('click', cancel);

            // Handle backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    cancel();
                }
            });

            // Focus confirm button
            setTimeout(() => confirmBtn.focus(), 100);
        });
    }

    /**
     * Create confirmation modal HTML
     * @param {string} message - Message to show
     * @param {string} title - Modal title
     * @param {string} confirmText - Confirm button text
     * @param {string} cancelText - Cancel button text
     * @param {string} confirmClass - Confirm button class
     * @returns {HTMLElement} - Modal element
     */
    createConfirmationModal(message, title, confirmText, cancelText, confirmClass) {
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <div class="confirmation-header">
                    <h3>${this.escapeHTML(title)}</h3>
                    <button type="button" class="close-btn">×</button>
                </div>
                <div class="confirmation-body">
                    <div class="confirmation-icon">❓</div>
                    <p>${this.escapeHTML(message)}</p>
                </div>
                <div class="confirmation-actions">
                    <button type="button" class="btn ${confirmClass} confirm-btn">${this.escapeHTML(confirmText)}</button>
                    <button type="button" class="btn btn-secondary cancel-btn">${this.escapeHTML(cancelText)}</button>
                </div>
            </div>
        `;

        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = modal.querySelector('.confirmation-content');
        content.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 0;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        return modal;
    }

    /**
     * Show alert dialog
     * @param {string} message - Alert message
     * @param {Object} options - Alert options
     */
    showAlert(message, options = {}) {
        const {
            title = 'Informasi',
            type = 'info', // info, success, warning, error
            duration = 3000
        } = options;

        const alertModal = this.createAlertModal(message, title, type);
        document.body.appendChild(alertModal);

        // Auto close after duration
        if (duration > 0) {
            setTimeout(() => {
                if (document.body.contains(alertModal)) {
                    document.body.removeChild(alertModal);
                }
            }, duration);
        }
    }

    /**
     * Create alert modal HTML
     * @param {string} message - Alert message
     * @param {string} title - Modal title
     * @param {string} type - Alert type
     * @returns {HTMLElement} - Modal element
     */
    createAlertModal(message, title, type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        const modal = document.createElement('div');
        modal.className = 'alert-modal';
        modal.innerHTML = `
            <div class="alert-content">
                <div class="alert-header">
                    <h3>${this.escapeHTML(title)}</h3>
                    <button type="button" class="close-btn">×</button>
                </div>
                <div class="alert-body">
                    <div class="alert-icon">${icons[type] || icons.info}</div>
                    <p>${this.escapeHTML(message)}</p>
                </div>
            </div>
        `;

        // Add styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = modal.querySelector('.alert-content');
        content.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 0;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        // Handle close
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        });

        return modal;
    }

    /**
     * Show modal with animation
     */
    showModal() {
        if (!this.modal) return;
        
        this.modal.classList.remove('hidden');
        this.modal.style.opacity = '0';
        
        // Animate in
        requestAnimationFrame(() => {
            this.modal.style.transition = 'opacity 0.3s ease';
            this.modal.style.opacity = '1';
        });

        // Focus first input
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input, select, textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
    }

    /**
     * Close modal
     */
    closeModal() {
        if (!this.modal) return;
        
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.classList.add('hidden');
            this.modal.style.transition = '';
            this.currentCallback = null;
        }, 300);
    }

    /**
     * Show loading state in modal
     * @param {string} message - Loading message
     */
    showLoading(message = 'Memproses...') {
        if (!this.modalBody) return;
        
        this.modalBody.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>${this.escapeHTML(message)}</p>
            </div>
        `;

        // Add loading styles
        const style = document.createElement('style');
        style.textContent = `
            .loading-state {
                text-align: center;
                padding: 40px 20px;
            }
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        if (!document.querySelector('#loading-styles')) {
            style.id = 'loading-styles';
            document.head.appendChild(style);
        }
    }

    /**
     * Get modal state
     * @returns {Object} - Modal state
     */
    getModalState() {
        return {
            isOpen: !this.modal?.classList.contains('hidden'),
            hasCallback: this.currentCallback !== null
        };
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHTML(text) {
        if (text === null || text === undefined) {
            return '';
        }
        return text.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Show message in modal
     * @param {string} message - Message to show
     * @param {string} type - Message type
     */
    showMessage(message, type = 'info') {
        // This could be enhanced to show messages within the modal
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}