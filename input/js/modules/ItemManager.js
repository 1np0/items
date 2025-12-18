/**
 * ItemManager - Manages item data operations
 */
export class ItemManager {
    constructor() {
        this.items = new Map();
        this.nextId = 1;
    }

    /**
     * Add a new item
     * @param {Object} itemData - The item data to add
     * @returns {Object} - The added item with generated ID
     */
    addItem(itemData) {
        const item = {
            id: itemData.id || this.nextId++,
            ...itemData,
            createdAt: itemData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.items.set(item.id, item);
        return item;
    }

    /**
     * Update an existing item
     * @param {number} id - The item ID to update
     * @param {Object} itemData - The updated item data
     * @returns {Object|null} - The updated item or null if not found
     */
    updateItem(id, itemData) {
        const existingItem = this.items.get(id);
        
        if (!existingItem) {
            return null;
        }

        const updatedItem = {
            ...existingItem,
            ...itemData,
            id: id, // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        };

        this.items.set(id, updatedItem);
        return updatedItem;
    }

    /**
     * Delete an item
     * @param {number} id - The item ID to delete
     * @returns {boolean} - True if item was deleted, false if not found
     */
    deleteItem(id) {
        return this.items.delete(id);
    }

    /**
     * Get an item by ID
     * @param {number} id - The item ID to find
     * @returns {Object|null} - The item or null if not found
     */
    getItemById(id) {
        return this.items.get(id) || null;
    }

    /**
     * Get all items as an array
     * @returns {Array} - Array of all items
     */
    getAllItems() {
        return Array.from(this.items.values());
    }

    /**
     * Search items by text query
     * @param {string} query - The search query
     * @returns {Array} - Array of matching items
     */
    searchItems(query) {
        if (!query || query.trim() === '') {
            return this.getAllItems();
        }

        const searchTerm = query.toLowerCase().trim();
        return this.getAllItems().filter(item => 
            item.kodeItem?.toLowerCase().includes(searchTerm) ||
            item.namaItem?.toLowerCase().includes(searchTerm) ||
            item.merek?.toLowerCase().includes(searchTerm) ||
            item.jenis?.toLowerCase().includes(searchTerm) ||
            item.barcode?.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Filter items by specific criteria
     * @param {string} field - The field to filter by
     * @param {string} value - The value to filter by
     * @returns {Array} - Array of filtered items
     */
    filterBy(field, value) {
        if (!value || value === '') {
            return this.getAllItems();
        }

        return this.getAllItems().filter(item => 
            item[field]?.toString().toLowerCase() === value.toLowerCase()
        );
    }

    /**
     * Get unique values for a specific field
     * @param {string} field - The field to get unique values from
     * @returns {Array} - Array of unique values
     */
    getUniqueValues(field) {
        const values = new Set();
        this.getAllItems().forEach(item => {
            if (item[field]) {
                values.add(item[field]);
            }
        });
        return Array.from(values).sort();
    }

    /**
     * Get items with low stock
     * @param {number} threshold - The stock threshold (default: 10)
     * @returns {Array} - Array of items with low stock
     */
    getLowStockItems(threshold = 10) {
        return this.getAllItems().filter(item => 
            item.stok <= threshold && item.stok > 0
        );
    }

    /**
     * Get out of stock items
     * @returns {Array} - Array of out of stock items
     */
    getOutOfStockItems() {
        return this.getAllItems().filter(item => 
            item.stok <= 0
        );
    }

    /**
     * Calculate total inventory value
     * @param {boolean} useCostPrice - Use cost price (true) or selling price (false)
     * @returns {number} - Total inventory value
     */
    getTotalInventoryValue(useCostPrice = true) {
        const priceField = useCostPrice ? 'hargaPokok' : 'hargaJual';
        return this.getAllItems().reduce((total, item) => {
            return total + ((item.stok || 0) * (item[priceField] || 0));
        }, 0);
    }

    /**
     * Get items by category
     * @returns {Object} - Object with categories as keys and arrays of items as values
     */
    getItemsByCategory() {
        const categories = {};
        this.getAllItems().forEach(item => {
            const category = item.jenis || 'Uncategorized';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(item);
        });
        return categories;
    }

    /**
     * Get item statistics
     * @returns {Object} - Object containing various statistics
     */
    getStatistics() {
        const items = this.getAllItems();
        const totalItems = items.length;
        const totalValue = this.getTotalInventoryValue(true);
        const lowStockItems = this.getLowStockItems().length;
        const outOfStockItems = this.getOutOfStockItems().length;
        const categories = this.getItemsByCategory();

        return {
            totalItems,
            totalValue,
            lowStockItems,
            outOfStockItems,
            categoryCount: Object.keys(categories).length,
            averageItemValue: totalItems > 0 ? totalValue / totalItems : 0
        };
    }

    /**
     * Import items from array
     * @param {Array} itemsArray - Array of item objects
     * @param {boolean} overwrite - Whether to overwrite existing items
     * @returns {Object} - Import results
     */
    importItems(itemsArray, overwrite = false) {
        const results = {
            imported: 0,
            updated: 0,
            errors: []
        };

        itemsArray.forEach((itemData, index) => {
            try {
                // Validate required fields
                if (!itemData.kodeItem && !itemData.id) {
                    results.errors.push(`Row ${index + 1}: Missing item code or ID`);
                    return;
                }

                // Check if item exists
                let existingItem = null;
                if (itemData.id) {
                    existingItem = this.getItemById(parseInt(itemData.id));
                } else {
                    // Search by code
                    existingItem = this.getAllItems().find(item => 
                        item.kodeItem === itemData.kodeItem
                    );
                }

                if (existingItem && !overwrite) {
                    results.errors.push(`Row ${index + 1}: Item with code "${itemData.kodeItem}" already exists`);
                    return;
                }

                // Normalize numeric fields
                ['stok', 'hargaPokok', 'hargaJual', 'stokMin'].forEach(field => {
                    if (itemData[field]) {
                        itemData[field] = parseFloat(itemData[field]) || 0;
                    }
                });

                if (existingItem && overwrite) {
                    this.updateItem(existingItem.id, itemData);
                    results.updated++;
                } else {
                    this.addItem(itemData);
                    results.imported++;
                }

            } catch (error) {
                results.errors.push(`Row ${index + 1}: ${error.message}`);
            }
        });

        return results;
    }

    /**
     * Clear all items
     */
    clearAllItems() {
        this.items.clear();
        this.nextId = 1;
    }

    /**
     * Export all items to JSON
     * @returns {string} - JSON string of all items
     */
    exportToJSON() {
        return JSON.stringify(this.getAllItems(), null, 2);
    }

    /**
     * Import items from JSON
     * @param {string} jsonString - JSON string of items
     * @returns {Object} - Import results
     */
    importFromJSON(jsonString) {
        try {
            const itemsArray = JSON.parse(jsonString);
            return this.importItems(itemsArray, true);
        } catch (error) {
            return {
                imported: 0,
                updated: 0,
                errors: [`Invalid JSON format: ${error.message}`]
            };
        }
    }
}