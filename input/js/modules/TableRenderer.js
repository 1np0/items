/**
 * TableRenderer - Handles table rendering and display
 */
export class TableRenderer {
    constructor() {
        this.tableBody = document.getElementById('tableBody');
    }

    /**
     * Render the items table
     * @param {Array} items - Array of items to render
     * @param {Set} selectedItems - Set of selected item IDs
     * @param {Function} onAction - Callback for action buttons
     * @param {Function} onSelectionChange - Callback for selection changes
     */
    renderTable(items, selectedItems, onAction, onSelectionChange) {
        if (!this.tableBody) {
            console.error('Table body element not found');
            return;
        }

        // Clear existing content
        this.tableBody.innerHTML = '';

        if (items.length === 0) {
            this.renderEmptyState();
            return;
        }

        // Render each item row
        items.forEach(item => {
            const row = this.createItemRow(item, selectedItems, onAction, onSelectionChange);
            this.tableBody.appendChild(row);
        });
    }

    /**
     * Create a single item row
     * @param {Object} item - The item data
     * @param {Set} selectedItems - Set of selected item IDs
     * @param {Function} onAction - Callback for action buttons
     * @param {Function} onSelectionChange - Callback for selection changes
     * @returns {HTMLElement} - The table row element
     */
    createItemRow(item, selectedItems, onAction, onSelectionChange) {
        const row = document.createElement('tr');
        row.className = 'fade-in';

        // Checkbox column
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.itemId = item.id;
        checkbox.checked = selectedItems.has(item.id);
        checkbox.addEventListener('change', (e) => onSelectionChange(e));
        checkboxCell.appendChild(checkbox);

        // Kode Item (highlighted column)
        const kodeItemCell = document.createElement('td');
        kodeItemCell.className = 'kode-item-col';
        kodeItemCell.textContent = item.kodeItem || '';

        // Barcode
        const barcodeCell = document.createElement('td');
        barcodeCell.textContent = item.barcode || '';

        // Nama Item
        const namaItemCell = document.createElement('td');
        namaItemCell.textContent = item.namaItem || '';

        // Stok
        const stokCell = document.createElement('td');
        stokCell.className = 'text-right stok';
        stokCell.textContent = this.formatNumber(item.stok);

        // Satuan
        const satuanCell = document.createElement('td');
        satuanCell.className = 'text-center';
        satuanCell.textContent = item.satuan || '';

        // Rak
        const rakCell = document.createElement('td');
        rakCell.textContent = item.rak || '';

        // Jenis
        const jenisCell = document.createElement('td');
        jenisCell.className = 'text-center';
        jenisCell.textContent = item.jenis || '';

        // Merek
        const merekCell = document.createElement('td');
        merekCell.textContent = item.merek || '';

        // Harga Pokok
        const hargaPokokCell = document.createElement('td');
        hargaPokokCell.className = 'text-right harga';
        hargaPokokCell.textContent = this.formatCurrency(item.hargaPokok);

        // Harga Jual
        const hargaJualCell = document.createElement('td');
        hargaJualCell.className = 'text-right harga';
        hargaJualCell.textContent = this.formatCurrency(item.hargaJual);

        // Tipe
        const tipeCell = document.createElement('td');
        tipeCell.className = 'text-center';
        tipeCell.textContent = item.tipe || '';

        // System HPP
        const systemHppCell = document.createElement('td');
        systemHppCell.className = 'text-center';
        systemHppCell.textContent = item.systemHpp || '';

        // Stok Min
        const stokMinCell = document.createElement('td');
        stokMinCell.className = 'text-right stok';
        stokMinCell.textContent = this.formatNumber(item.stokMin);

        // Status Jual
        const statusJualCell = document.createElement('td');
        statusJualCell.className = 'text-center';
        statusJualCell.innerHTML = this.getStatusBadge(item.statusJual);

        // Keterangan
        const keteranganCell = document.createElement('td');
        keteranganCell.textContent = item.keterangan || '';

        // Supplier
        const supplierCell = document.createElement('td');
        supplierCell.textContent = item.supplier || '';

        // Actions
        const actionCell = document.createElement('td');
        actionCell.className = 'text-center';
        actionCell.appendChild(this.createActionButtons(item, onAction));

        // Add all cells to row
        row.appendChild(checkboxCell);
        row.appendChild(kodeItemCell);
        row.appendChild(barcodeCell);
        row.appendChild(namaItemCell);
        row.appendChild(stokCell);
        row.appendChild(satuanCell);
        row.appendChild(rakCell);
        row.appendChild(jenisCell);
        row.appendChild(merekCell);
        row.appendChild(hargaPokokCell);
        row.appendChild(hargaJualCell);
        row.appendChild(tipeCell);
        row.appendChild(systemHppCell);
        row.appendChild(stokMinCell);
        row.appendChild(statusJualCell);
        row.appendChild(keteranganCell);
        row.appendChild(supplierCell);
        row.appendChild(actionCell);

        return row;
    }

    /**
     * Create action buttons for a row
     * @param {Object} item - The item data
     * @param {Function} onAction - Callback for action buttons
     * @returns {HTMLElement} - Container with action buttons
     */
    createActionButtons(item, onAction) {
        const container = document.createElement('div');
        container.className = 'action-buttons';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit';
        editBtn.title = 'Edit Item';
        editBtn.innerHTML = '✏️';
        editBtn.addEventListener('click', () => onAction(item.id, 'edit'));

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete';
        deleteBtn.title = 'Hapus Item';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.addEventListener('click', () => onAction(item.id, 'delete'));

        container.appendChild(editBtn);
        container.appendChild(deleteBtn);

        return container;
    }

    /**
     * Render empty state when no items
     */
    renderEmptyState() {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 18; // Total number of columns
        cell.className = 'text-center';
        cell.style.padding = '40px 20px';
        cell.style.color = '#6c757d';
        cell.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">📦</div>
            <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 5px;">Belum Ada Data Items</div>
            <div style="font-size: 0.9rem;">Klik "Tambah Item Baru" untuk mulai menambahkan data</div>
        `;
        row.appendChild(cell);
        this.tableBody.appendChild(row);
    }

    /**
     * Format number with Indonesian locale
     * @param {number} value - The number to format
     * @returns {string} - Formatted number
     */
    formatNumber(value) {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    /**
     * Format currency with Indonesian locale
     * @param {number} value - The amount to format
     * @returns {string} - Formatted currency
     */
    formatCurrency(value) {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    /**
     * Get status badge HTML
     * @param {string} status - The status value
     * @returns {string} - HTML for status badge
     */
    getStatusBadge(status) {
        const statusClasses = {
            'Masih Dijual': 'success',
            'Tidak Dijual': 'secondary',
            'Discontinue': 'danger'
        };

        const className = statusClasses[status] || 'secondary';
        return `<span class="badge badge-${className}">${status || ''}</span>`;
    }

    /**
     * Add loading state to table
     */
    showLoading() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="18" class="text-center" style="padding: 40px 20px;">
                    <div class="loading">
                        <div style="font-size: 2rem; margin-bottom: 10px;">⏳</div>
                        <div style="font-size: 1.1rem;">Memuat data...</div>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Highlight search results
     * @param {string} query - The search query
     */
    highlightSearchResults(query) {
        if (!query) return;

        const searchTerm = query.toLowerCase();
        const cells = this.tableBody.querySelectorAll('td');

        cells.forEach(cell => {
            const text = cell.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                cell.style.backgroundColor = '#fff3cd';
                cell.style.fontWeight = 'bold';
            } else {
                cell.style.backgroundColor = '';
                cell.style.fontWeight = '';
            }
        });
    }

    /**
     * Clear search highlighting
     */
    clearHighlight() {
        const cells = this.tableBody.querySelectorAll('td');
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
            cell.style.fontWeight = '';
        });
    }

    /**
     * Scroll to specific row
     * @param {number} itemId - The item ID to scroll to
     */
    scrollToItem(itemId) {
        const row = this.tableBody.querySelector(`input[data-item-id="${itemId}"]`)?.closest('tr');
        if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            row.style.backgroundColor = '#e3f2fd';
            setTimeout(() => {
                row.style.backgroundColor = '';
            }, 2000);
        }
    }

    /**
     * Add scroll hint for mobile users
     */
    addScrollHint() {
        const tableContainer = document.querySelector('.table-container');
        if (!tableContainer) return;

        // Add touch swipe hint
        let touchStartX = 0;
        let touchEndX = 0;

        tableContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        tableContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipeGesture(touchStartX, touchEndX, tableContainer);
        });

        // Add scroll position indicator
        this.addScrollIndicator(tableContainer);
    }

    /**
     * Handle swipe gesture for mobile
     * @param {number} startX - Touch start X position
     * @param {number} endX - Touch end X position
     * @param {HTMLElement} container - Table container
     */
    handleSwipeGesture(startX, endX, container) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - scroll right
                container.scrollBy({ left: 200, behavior: 'smooth' });
            } else {
                // Swipe right - scroll left
                container.scrollBy({ left: -200, behavior: 'smooth' });
            }
        }
    }

    /**
     * Add scroll position indicator
     * @param {HTMLElement} container - Table container
     */
    addScrollIndicator(container) {
        // Add scroll progress indicator
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            width: 0%;
            transition: width 0.3s ease;
            z-index: 10;
        `;

        container.style.position = 'relative';
        container.appendChild(indicator);

        // Update indicator on scroll
        container.addEventListener('scroll', () => {
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const scrollLeft = container.scrollLeft;
            const progress = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;
            indicator.style.width = `${progress}%`;
        });
    }

    /**
     * Center table on mobile for better viewing
     */
    centerTableOnMobile() {
        if (window.innerWidth <= 768) {
            const tableContainer = document.querySelector('.table-container');
            if (tableContainer) {
                // Scroll to show the middle columns (Name, Stock, Price) by default
                tableContainer.scrollLeft = 200;
            }
        }
    }

    /**
     * Export table to CSV format
     * @param {Array} items - Array of items to export
     * @returns {string} - CSV content
     */
    exportToCSV(items) {
        const headers = [
            'Kode Item', 'Barcode', 'Nama Item', 'Stok', 'Satuan', 'Rak',
            'Jenis', 'Merek', 'Harga Pokok', 'Harga Jual', 'Tipe',
            'System HPP', 'Stok Min', 'Status Jual', 'Keterangan', 'Supplier'
        ];

        const csvRows = [headers.join(',')];

        items.forEach(item => {
            const row = [
                this.escapeCSV(item.kodeItem),
                this.escapeCSV(item.barcode),
                this.escapeCSV(item.namaItem),
                item.stok || '',
                this.escapeCSV(item.satuan),
                this.escapeCSV(item.rak),
                this.escapeCSV(item.jenis),
                this.escapeCSV(item.merek),
                item.hargaPokok || '',
                item.hargaJual || '',
                this.escapeCSV(item.tipe),
                this.escapeCSV(item.systemHpp),
                item.stokMin || '',
                this.escapeCSV(item.statusJual),
                this.escapeCSV(item.keterangan),
                this.escapeCSV(item.supplier)
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    /**
     * Escape CSV value
     * @param {string} value - Value to escape
     * @returns {string} - Escaped value
     */
    escapeCSV(value) {
        if (value === null || value === undefined) {
            return '';
        }

        const stringValue = value.toString();
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    }

    /**
     * Print table
     * @param {Array} items - Array of items to print
     */
    printTable(items) {
        const printWindow = window.open('', '_blank');
        const tableHTML = this.generatePrintHTML(items);

        printWindow.document.write(tableHTML);
        printWindow.document.close();
        printWindow.print();
    }

    /**
     * Generate HTML for printing
     * @param {Array} items - Array of items to print
     * @returns {string} - HTML content for printing
     */
    generatePrintHTML(items) {
        const currentDate = new Date().toLocaleDateString('id-ID');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Daftar Items - ${currentDate}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { text-align: center; color: #333; }
                    .date { text-align: center; color: #666; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; font-weight: bold; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .footer { margin-top: 20px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                <h1>Daftar Items</h1>
                <div class="date">Dicetak pada: ${currentDate}</div>
                <div>Total Items: ${items.length}</div>
                ${this.generateTableHTML(items)}
                <div class="footer">
                    Generated by Inventory Management System
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Generate table HTML for printing
     * @param {Array} items - Array of items to render
     * @returns {string} - Table HTML
     */
    generateTableHTML(items) {
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Kode Item</th>
                        <th>Nama Item</th>
                        <th>Stok</th>
                        <th>Satuan</th>
                        <th>Jenis</th>
                        <th>Merek</th>
                        <th>Harga Pokok</th>
                        <th>Harga Jual</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        items.forEach(item => {
            html += `
                <tr>
                    <td>${item.kodeItem || ''}</td>
                    <td>${item.namaItem || ''}</td>
                    <td class="text-right">${this.formatNumber(item.stok)}</td>
                    <td class="text-center">${item.satuan || ''}</td>
                    <td class="text-center">${item.jenis || ''}</td>
                    <td>${item.merek || ''}</td>
                    <td class="text-right">${this.formatCurrency(item.hargaPokok)}</td>
                    <td class="text-right">${this.formatCurrency(item.hargaJual)}</td>
                    <td class="text-center">${item.statusJual || ''}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        return html;
    }
}