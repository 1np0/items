import { ItemManager } from './modules/ItemManager.js';
import { TableRenderer } from './modules/TableRenderer.js';
import { FormHandler } from './modules/FormHandler.js';
import { FilterHandler } from './modules/FilterHandler.js';
import { ExportHandler } from './modules/ExportHandler.js';
import { ModalHandler } from './modules/ModalHandler.js';

class InventoryApp {
    constructor() {
        this.itemManager = new ItemManager();
        this.tableRenderer = new TableRenderer();
        this.formHandler = new FormHandler();
        this.filterHandler = new FilterHandler();
        this.exportHandler = new ExportHandler();
        this.modalHandler = new ModalHandler();

        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.filteredItems = [];
        this.selectedItems = new Set();

        this.init();
    }

    init() {
        this.loadInitialData();
        this.bindEvents();
        this.updateTable();

        // Initialize table scrolling features
        this.initTableScrolling();
    }

    initTableScrolling() {
        // Add scroll hints for mobile
        this.tableRenderer.addScrollHint();

        // Center table on mobile for better UX
        this.tableRenderer.centerTableOnMobile();

        // Update scroll hints when table is updated
        this.updateTable();
    }

    loadInitialData() {
        // Sample data untuk demonstration
        const sampleItems = [
            {
                id: 1,
                kodeItem: 'AS01',
                barcode: '',
                namaItem: 'GIZEH ROLLBOX',
                stok: 19.00,
                satuan: 'PCS',
                rak: '',
                jenis: 'ASR',
                merek: 'MASPEL',
                hargaPokok: 27000.00,
                hargaJual: 35000.00,
                tipe: 'INV',
                systemHpp: 'FIFO',
                stokMin: 5.00,
                statusJual: 'Masih Dijual',
                keterangan: '',
                supplier: 'SP005'
            },
            {
                id: 2,
                kodeItem: 'AS161',
                barcode: '',
                namaItem: 'FILTER REGULAR',
                stok: 25.00,
                satuan: 'PCS',
                rak: '',
                jenis: 'ALT',
                merek: 'PAPERKA',
                hargaPokok: 15000.00,
                hargaJual: 22000.00,
                tipe: 'INV',
                systemHpp: 'FIFO',
                stokMin: 10.00,
                statusJual: 'Masih Dijual',
                keterangan: '',
                supplier: 'SP003'
            },
            {
                id: 3,
                kodeItem: 'PR001',
                barcode: '1234567890123',
                namaItem: 'TAS SEKOLAH ANAK',
                stok: 45.00,
                satuan: 'PCS',
                rak: 'R-001',
                jenis: 'BAG',
                merek: 'ELVIRA',
                hargaPokok: 85000.00,
                hargaJual: 120000.00,
                tipe: 'INV',
                systemHpp: 'FIFO',
                stokMin: 15.00,
                statusJual: 'Masih Dijual',
                keterangan: 'Tas sekolah berkualitas',
                supplier: 'SP002'
            }
        ];

        sampleItems.forEach(item => {
            this.itemManager.addItem(item);
        });

        this.filteredItems = this.itemManager.getAllItems();
    }

    bindEvents() {
        // Form events
        const form = document.getElementById('itemForm');
        const toggleFormBtn = document.getElementById('toggleForm');

        toggleFormBtn.addEventListener('click', () => {
            this.formHandler.toggleForm(form, toggleFormBtn);
        });

        form.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Table events
        const selectAllCheckbox = document.getElementById('selectAll');
        selectAllCheckbox.addEventListener('change', (e) => {
            this.handleSelectAll(e);
        });

        // Pagination events
        document.getElementById('prevPage').addEventListener('click', () => {
            this.previousPage();
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.nextPage();
        });

        // Filter events
        const searchInput = document.getElementById('searchKeyword');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.getElementById('filterJenis').addEventListener('change', (e) => {
            this.handleFilter('jenis', e.target.value);
        });

        document.getElementById('filterSatuan').addEventListener('click', (e) => {
            this.handleFilter('satuan', e.target.value);
        });

        // Export events
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportHandler.exportToExcel(this.filteredItems);
        });

        document.getElementById('deleteSelected').addEventListener('click', () => {
            this.handleDeleteSelected();
        });

        // Mobile floating action button events
        document.getElementById('mobileExport').addEventListener('click', () => {
            this.exportHandler.exportToExcel(this.filteredItems);
        });

        document.getElementById('mobileDelete').addEventListener('click', () => {
            this.handleDeleteSelected();
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.modalHandler.closeModal();
        });

        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.modalHandler.closeModal();
            }
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const itemData = {};

        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            itemData[key] = value;
        }

        // Parse numeric fields
        ['stok', 'hargaPokok', 'hargaJual', 'stokMin'].forEach(field => {
            if (itemData[field]) {
                itemData[field] = parseFloat(itemData[field]) || 0;
            }
        });

        // Add ID and timestamps
        itemData.id = Date.now();
        itemData.createdAt = new Date().toISOString();
        itemData.updatedAt = new Date().toISOString();

        // Add item to manager
        this.itemManager.addItem(itemData);

        // Update filtered items and table
        this.applyCurrentFilters();
        this.updateTable();

        // Reset form
        e.target.reset();
        this.formHandler.showSuccess('Data berhasil disimpan!');

        // Close form
        setTimeout(() => {
            document.getElementById('toggleForm').click();
        }, 1500);
    }

    handleSelectAll(e) {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            const itemId = parseInt(checkbox.dataset.itemId);

            if (isChecked) {
                this.selectedItems.add(itemId);
            } else {
                this.selectedItems.delete(itemId);
            }
        });

        this.updateSelectionCount();
    }

    handleItemSelection(e) {
        const itemId = parseInt(e.target.dataset.itemId);

        if (e.target.checked) {
            this.selectedItems.add(itemId);
        } else {
            this.selectedItems.delete(itemId);
        }

        // Update select all checkbox
        const selectAllCheckbox = document.getElementById('selectAll');
        const totalItems = this.getCurrentPageItems().length;
        const selectedInPage = document.querySelectorAll('tbody input[type="checkbox"]:checked').length;

        selectAllCheckbox.checked = selectedInPage === totalItems;
        selectAllCheckbox.indeterminate = selectedInPage > 0 && selectedInPage < totalItems;

        this.updateSelectionCount();
    }

    updateSelectionCount() {
        const selectedCount = this.selectedItems.size;
        const deleteBtn = document.getElementById('deleteSelected');

        deleteBtn.disabled = selectedCount === 0;
        deleteBtn.textContent = selectedCount > 0
            ? `🗑️ Hapus Terpilih (${selectedCount})`
            : '🗑️ Hapus Terpilih';
    }

    handleDeleteSelected() {
        if (this.selectedItems.size === 0) {
            alert('Pilih item yang akan dihapus terlebih dahulu.');
            return;
        }

        if (confirm(`Apakah Anda yakin ingin menghapus ${this.selectedItems.size} item yang dipilih?`)) {
            // Remove selected items
            this.selectedItems.forEach(itemId => {
                this.itemManager.deleteItem(itemId);
            });

            // Clear selection
            this.selectedItems.clear();

            // Update filtered items and table
            this.applyCurrentFilters();
            this.updateTable();

            this.formHandler.showSuccess(`${this.selectedItems.size} item berhasil dihapus!`);
        }
    }

    handleSearch(query) {
        this.filterHandler.setSearchQuery(query);
        this.applyCurrentFilters();
        this.updateTable();
    }

    handleFilter(filterType, value) {
        this.filterHandler.setFilter(filterType, value);
        this.applyCurrentFilters();
        this.updateTable();
    }

    applyCurrentFilters() {
        this.filteredItems = this.filterHandler.applyFilters(this.itemManager.getAllItems());
        this.currentPage = 1; // Reset to first page
        this.updateFilterOptions();
    }

    updateFilterOptions() {
        const allItems = this.itemManager.getAllItems();

        // Update jenis filter
        const jenisSelect = document.getElementById('filterJenis');
        const jenisSet = new Set(allItems.map(item => item.jenis).filter(Boolean));
        this.filterHandler.updateFilterOptions(jenisSelect, jenisSet);

        // Update satuan filter
        const satuanSelect = document.getElementById('filterSatuan');
        const satuanSet = new Set(allItems.map(item => item.satuan).filter(Boolean));
        this.filterHandler.updateFilterOptions(satuanSelect, satuanSet);
    }

    getCurrentPageItems() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredItems.slice(startIndex, endIndex);
    }

    updateTable() {
        const currentPageItems = this.getCurrentPageItems();

        this.tableRenderer.renderTable(
            currentPageItems,
            this.selectedItems,
            (itemId, action) => this.handleTableAction(itemId, action),
            (itemId) => this.handleItemSelection.bind(this)
        );

        this.updatePaginationInfo();

        // Re-initialize scrolling features after table update
        setTimeout(() => {
            this.tableRenderer.addScrollHint();
            this.tableRenderer.centerTableOnMobile();
        }, 100);
    }

    updatePaginationInfo() {
        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        const currentPageItems = this.getCurrentPageItems();
        const totalItems = this.filteredItems.length;

        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = totalPages;
        document.getElementById('totalItems').textContent = totalItems;

        // Update pagination buttons
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateTable();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.updateTable();
        }
    }

    handleTableAction(itemId, action) {
        const item = this.itemManager.getItemById(itemId);

        if (!item) {
            alert('Item tidak ditemukan.');
            return;
        }

        switch (action) {
            case 'edit':
                this.openEditModal(item);
                break;
            case 'delete':
                this.handleDeleteSingle(itemId);
                break;
        }
    }

    handleDeleteSingle(itemId) {
        const item = this.itemManager.getItemById(itemId);

        if (confirm(`Apakah Anda yakin ingin menghapus item "${item.namaItem}"?`)) {
            this.itemManager.deleteItem(itemId);
            this.selectedItems.delete(itemId);
            this.applyCurrentFilters();
            this.updateTable();

            this.formHandler.showSuccess('Item berhasil dihapus!');
        }
    }

    openEditModal(item) {
        this.modalHandler.openEditModal(item, (updatedItem) => {
            this.itemManager.updateItem(updatedItem.id, updatedItem);
            this.applyCurrentFilters();
            this.updateTable();
            this.formHandler.showSuccess('Data berhasil diperbarui!');
        });
    }

    // Method untuk debugging
    getAllItems() {
        return this.itemManager.getAllItems();
    }

    addSampleItem() {
        const sampleItem = {
            id: Date.now(),
            kodeItem: `ITEM${Date.now()}`,
            barcode: '',
            namaItem: 'Sample Item',
            stok: 10.00,
            satuan: 'PCS',
            rak: '',
            jenis: 'SAMPLE',
            merek: 'Sample Brand',
            hargaPokok: 10000.00,
            hargaJual: 15000.00,
            tipe: 'INV',
            systemHpp: 'FIFO',
            stokMin: 5.00,
            statusJual: 'Masih Dijual',
            keterangan: '',
            supplier: 'SP001',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.itemManager.addItem(sampleItem);
        this.applyCurrentFilters();
        this.updateTable();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new InventoryApp();

    // Make app available globally for debugging
    window.inventoryApp = app;
});

// Add some utility functions for demonstration
window.addSampleItem = () => {
    if (window.inventoryApp) {
        window.inventoryApp.addSampleItem();
    }
};

window.getAllItems = () => {
    if (window.inventoryApp) {
        console.log(window.inventoryApp.getAllItems());
    }
};