/**
 * FilterHandler - Handles filtering and search functionality
 */
export class FilterHandler {
    constructor() {
        this.searchQuery = '';
        this.filters = {
            jenis: '',
            satuan: '',
            statusJual: '',
            tipe: '',
            systemHpp: ''
        };
    }

    /**
     * Set search query
     * @param {string} query - Search query
     */
    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase().trim();
    }

    /**
     * Set filter value
     * @param {string} filterType - Type of filter
     * @param {string} value - Filter value
     */
    setFilter(filterType, value) {
        this.filters[filterType] = value;
    }

    /**
     * Apply all filters to items
     * @param {Array} items - Array of items to filter
     * @returns {Array} - Filtered items
     */
    applyFilters(items) {
        let filtered = [...items];

        // Apply search filter
        if (this.searchQuery) {
            filtered = this.applySearchFilter(filtered, this.searchQuery);
        }

        // Apply other filters
        Object.keys(this.filters).forEach(filterType => {
            const value = this.filters[filterType];
            if (value && value !== '') {
                filtered = this.applySingleFilter(filtered, filterType, value);
            }
        });

        return filtered;
    }

    /**
     * Apply search filter
     * @param {Array} items - Items to filter
     * @param {string} query - Search query
     * @returns {Array} - Filtered items
     */
    applySearchFilter(items, query) {
        return items.filter(item => {
            const searchableFields = [
                'kodeItem',
                'namaItem',
                'merek',
                'jenis',
                'barcode',
                'supplier',
                'keterangan'
            ];

            return searchableFields.some(field => {
                const value = item[field];
                return value && value.toLowerCase().includes(query);
            });
        });
    }

    /**
     * Apply single filter
     * @param {Array} items - Items to filter
     * @param {string} filterType - Type of filter
     * @param {string} value - Filter value
     * @returns {Array} - Filtered items
     */
    applySingleFilter(items, filterType, value) {
        return items.filter(item => {
            const itemValue = item[filterType];
            
            // Handle empty values
            if (!value || value === '') {
                return true;
            }

            // Exact match for most fields
            if (['jenis', 'satuan', 'statusJual', 'tipe', 'systemHpp'].includes(filterType)) {
                return itemValue && itemValue.toLowerCase() === value.toLowerCase();
            }

            // Partial match for text fields
            return itemValue && itemValue.toLowerCase().includes(value.toLowerCase());
        });
    }

    /**
     * Update filter dropdown options
     * @param {HTMLSelectElement} selectElement - The select element
     * @param {Set} values - Set of unique values
     */
    updateFilterOptions(selectElement, values) {
        if (!selectElement) return;

        const currentValue = selectElement.value;
        
        // Clear existing options (except first one)
        while (selectElement.children.length > 1) {
            selectElement.removeChild(selectElement.lastChild);
        }

        // Add new options
        Array.from(values).sort().forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            selectElement.appendChild(option);
        });

        // Restore previous selection if still valid
        if (currentValue && values.has(currentValue)) {
            selectElement.value = currentValue;
        }
    }

    /**
     * Get filter summary
     * @returns {Object} - Filter summary
     */
    getFilterSummary() {
        const activeFilters = [];
        
        if (this.searchQuery) {
            activeFilters.push(`Cari: "${this.searchQuery}"`);
        }

        Object.keys(this.filters).forEach(filterType => {
            const value = this.filters[filterType];
            if (value && value !== '') {
                activeFilters.push(`${this.getFilterLabel(filterType)}: ${value}`);
            }
        });

        return {
            searchQuery: this.searchQuery,
            filters: { ...this.filters },
            activeFilters: activeFilters,
            hasActiveFilters: activeFilters.length > 0
        };
    }

    /**
     * Get human-readable filter label
     * @param {string} filterType - Filter type
     * @returns {string} - Human-readable label
     */
    getFilterLabel(filterType) {
        const labels = {
            jenis: 'Jenis',
            satuan: 'Satuan',
            statusJual: 'Status Jual',
            tipe: 'Tipe',
            systemHpp: 'System HPP'
        };
        return labels[filterType] || filterType;
    }

    /**
     * Clear all filters
     */
    clearAllFilters() {
        this.searchQuery = '';
        Object.keys(this.filters).forEach(key => {
            this.filters[key] = '';
        });
    }

    /**
     * Clear specific filter
     * @param {string} filterType - Type of filter to clear
     */
    clearFilter(filterType) {
        if (filterType === 'search') {
            this.searchQuery = '';
        } else if (this.filters.hasOwnProperty(filterType)) {
            this.filters[filterType] = '';
        }
    }

    /**
     * Get available filter values for a specific field
     * @param {Array} items - All items
     * @param {string} field - Field to get values for
     * @returns {Set} - Set of unique values
     */
    getAvailableFilterValues(items, field) {
        const values = new Set();
        
        items.forEach(item => {
            if (item[field]) {
                values.add(item[field]);
            }
        });

        return values;
    }

    /**
     * Get filter statistics
     * @param {Array} allItems - All items
     * @param {Array} filteredItems - Filtered items
     * @returns {Object} - Filter statistics
     */
    getFilterStatistics(allItems, filteredItems) {
        const totalItems = allItems.length;
        const filteredCount = filteredItems.length;
        const showingAll = filteredCount === totalItems;

        return {
            totalItems,
            filteredCount,
            showingAll,
            filterPercentage: totalItems > 0 ? Math.round((filteredCount / totalItems) * 100) : 0,
            hiddenCount: totalItems - filteredCount
        };
    }

    /**
     * Export current filter state
     * @returns {Object} - Current filter state
     */
    exportFilterState() {
        return {
            searchQuery: this.searchQuery,
            filters: { ...this.filters },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Import filter state
     * @param {Object} filterState - Filter state to import
     * @returns {boolean} - True if imported successfully
     */
    importFilterState(filterState) {
        try {
            if (filterState.searchQuery !== undefined) {
                this.searchQuery = filterState.searchQuery;
            }

            if (filterState.filters) {
                Object.keys(this.filters).forEach(key => {
                    if (filterState.filters[key] !== undefined) {
                        this.filters[key] = filterState.filters[key];
                    }
                });
            }

            return true;
        } catch (error) {
            console.error('Failed to import filter state:', error);
            return false;
        }
    }

    /**
     * Get filter persistence key
     * @returns {string} - Local storage key
     */
    getPersistenceKey() {
        return 'inventory_filter_state';
    }

    /**
     * Save filter state to localStorage
     */
    saveToStorage() {
        try {
            const state = this.exportFilterState();
            localStorage.setItem(this.getPersistenceKey(), JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save filter state:', error);
        }
    }

    /**
     * Load filter state from localStorage
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem(this.getPersistenceKey());
            if (saved) {
                const state = JSON.parse(saved);
                return this.importFilterState(state);
            }
        } catch (error) {
            console.warn('Failed to load filter state:', error);
        }
        return false;
    }

    /**
     * Apply advanced filters
     * @param {Array} items - Items to filter
     * @param {Object} advancedFilters - Advanced filter criteria
     * @returns {Array} - Filtered items
     */
    applyAdvancedFilters(items, advancedFilters) {
        let filtered = [...items];

        // Price range filter
        if (advancedFilters.minPrice !== undefined || advancedFilters.maxPrice !== undefined) {
            filtered = filtered.filter(item => {
                const price = item.hargaJual || 0;
                const minPrice = advancedFilters.minPrice || 0;
                const maxPrice = advancedFilters.maxPrice || Infinity;
                return price >= minPrice && price <= maxPrice;
            });
        }

        // Stock range filter
        if (advancedFilters.minStock !== undefined || advancedFilters.maxStock !== undefined) {
            filtered = filtered.filter(item => {
                const stock = item.stok || 0;
                const minStock = advancedFilters.minStock || 0;
                const maxStock = advancedFilters.maxStock || Infinity;
                return stock >= minStock && stock <= maxStock;
            });
        }

        // Date range filter
        if (advancedFilters.dateFrom || advancedFilters.dateTo) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.createdAt || item.updatedAt);
                const fromDate = advancedFilters.dateFrom ? new Date(advancedFilters.dateFrom) : new Date(0);
                const toDate = advancedFilters.dateTo ? new Date(advancedFilters.dateTo) : new Date();
                return itemDate >= fromDate && itemDate <= toDate;
            });
        }

        // Low stock filter
        if (advancedFilters.lowStock) {
            const threshold = advancedFilters.lowStockThreshold || 10;
            filtered = filtered.filter(item => (item.stok || 0) <= threshold);
        }

        // Out of stock filter
        if (advancedFilters.outOfStock) {
            filtered = filtered.filter(item => (item.stok || 0) <= 0);
        }

        return filtered;
    }

    /**
     * Create advanced filter UI
     * @returns {HTMLElement} - Advanced filter container
     */
    createAdvancedFilterUI() {
        const container = document.createElement('div');
        container.className = 'advanced-filters';
        container.innerHTML = `
            <div class="advanced-filter-group">
                <label>Range Harga:</label>
                <div class="range-inputs">
                    <input type="number" id="minPrice" placeholder="Min" class="form-control">
                    <span>-</span>
                    <input type="number" id="maxPrice" placeholder="Max" class="form-control">
                </div>
            </div>
            <div class="advanced-filter-group">
                <label>Range Stok:</label>
                <div class="range-inputs">
                    <input type="number" id="minStock" placeholder="Min" class="form-control">
                    <span>-</span>
                    <input type="number" id="maxStock" placeholder="Max" class="form-control">
                </div>
            </div>
            <div class="advanced-filter-group">
                <label>Tanggal:</label>
                <div class="date-inputs">
                    <input type="date" id="dateFrom" class="form-control">
                    <span>-</span>
                    <input type="date" id="dateTo" class="form-control">
                </div>
            </div>
            <div class="advanced-filter-group">
                <label>
                    <input type="checkbox" id="lowStock"> Stok Rendah
                </label>
                <label>
                    <input type="checkbox" id="outOfStock"> Stok Habis
                </label>
            </div>
        `;

        return container;
    }

    /**
     * Get filter suggestions based on current data
     * @param {Array} items - Items to analyze
     * @returns {Object} - Filter suggestions
     */
    getFilterSuggestions(items) {
        const suggestions = {
            popularJenis: this.getTopValues(items, 'jenis', 5),
            popularMerek: this.getTopValues(items, 'merek', 5),
            popularSatuan: this.getTopValues(items, 'satuan', 3),
            priceRanges: this.getPriceRanges(items),
            stockLevels: this.getStockLevels(items)
        };

        return suggestions;
    }

    /**
     * Get top values for a field
     * @param {Array} items - Items to analyze
     * @param {string} field - Field to analyze
     * @param {number} limit - Number of top values to return
     * @returns {Array} - Top values with counts
     */
    getTopValues(items, field, limit = 5) {
        const counts = {};
        
        items.forEach(item => {
            const value = item[field];
            if (value) {
                counts[value] = (counts[value] || 0) + 1;
            }
        });

        return Object.entries(counts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([value, count]) => ({ value, count }));
    }

    /**
     * Get price ranges
     * @param {Array} items - Items to analyze
     * @returns {Object} - Price range information
     */
    getPriceRanges(items) {
        const prices = items.map(item => item.hargaJual).filter(p => p > 0).sort((a, b) => a - b);
        
        if (prices.length === 0) {
            return { min: 0, max: 0, avg: 0 };
        }

        return {
            min: prices[0],
            max: prices[prices.length - 1],
            avg: prices.reduce((a, b) => a + b, 0) / prices.length
        };
    }

    /**
     * Get stock level distribution
     * @param {Array} items - Items to analyze
     * @returns {Object} - Stock level information
     */
    getStockLevels(items) {
        const stockCounts = {
            outOfStock: 0,
            lowStock: 0, // <= 10
            normalStock: 0, // > 10
            highStock: 0 // > 100
        };

        items.forEach(item => {
            const stock = item.stok || 0;
            if (stock <= 0) {
                stockCounts.outOfStock++;
            } else if (stock <= 10) {
                stockCounts.lowStock++;
            } else if (stock <= 100) {
                stockCounts.normalStock++;
            } else {
                stockCounts.highStock++;
            }
        });

        return stockCounts;
    }
}