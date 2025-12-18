/**
 * ExportHandler - Handles data export functionality
 */
export class ExportHandler {
    constructor() {
        this.exportFormats = ['csv', 'json', 'xlsx'];
    }

    /**
     * Export data to Excel format
     * @param {Array} items - Items to export
     * @param {string} filename - Export filename
     */
    exportToExcel(items, filename = 'items_export') {
        try {
            // For demonstration, we'll create a CSV that can be opened in Excel
            // In a real implementation, you'd use a library like SheetJS
            const csvContent = this.generateCSV(items);
            this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
            
            this.showSuccessMessage(`Data berhasil diexport ke ${filename}.csv`);
        } catch (error) {
            console.error('Export to Excel failed:', error);
            this.showErrorMessage('Gagal export data ke Excel');
        }
    }

    /**
     * Export data to JSON format
     * @param {Array} items - Items to export
     * @param {string} filename - Export filename
     */
    exportToJSON(items, filename = 'items_export') {
        try {
            const jsonContent = JSON.stringify(items, null, 2);
            this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
            
            this.showSuccessMessage(`Data berhasil diexport ke ${filename}.json`);
        } catch (error) {
            console.error('Export to JSON failed:', error);
            this.showErrorMessage('Gagal export data ke JSON');
        }
    }

    /**
     * Export data to CSV format
     * @param {Array} items - Items to export
     * @param {string} filename - Export filename
     */
    exportToCSV(items, filename = 'items_export') {
        try {
            const csvContent = this.generateCSV(items);
            this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
            
            this.showSuccessMessage(`Data berhasil diexport ke ${filename}.csv`);
        } catch (error) {
            console.error('Export to CSV failed:', error);
            this.showErrorMessage('Gagal export data ke CSV');
        }
    }

    /**
     * Generate CSV content from items
     * @param {Array} items - Items to convert
     * @returns {string} - CSV content
     */
    generateCSV(items) {
        const headers = [
            'Kode Item',
            'Barcode',
            'Nama Item',
            'Stok',
            'Satuan',
            'Rak',
            'Jenis',
            'Merek',
            'Harga Pokok',
            'Harga Jual',
            'Tipe',
            'System HPP',
            'Stok Min',
            'Status Jual',
            'Keterangan',
            'Supplier',
            'Tanggal Dibuat',
            'Tanggal Diperbarui'
        ];

        const csvRows = [headers.join(',')];

        items.forEach(item => {
            const row = [
                this.escapeCSV(item.kodeItem),
                this.escapeCSV(item.barcode),
                this.escapeCSV(item.namaItem),
                this.formatNumber(item.stok),
                this.escapeCSV(item.satuan),
                this.escapeCSV(item.rak),
                this.escapeCSV(item.jenis),
                this.escapeCSV(item.merek),
                this.formatCurrency(item.hargaPokok),
                this.formatCurrency(item.hargaJual),
                this.escapeCSV(item.tipe),
                this.escapeCSV(item.systemHpp),
                this.formatNumber(item.stokMin),
                this.escapeCSV(item.statusJual),
                this.escapeCSV(item.keterangan),
                this.escapeCSV(item.supplier),
                this.formatDate(item.createdAt),
                this.formatDate(item.updatedAt)
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    /**
     * Generate detailed report
     * @param {Array} items - Items to include in report
     * @param {string} reportType - Type of report (summary, detailed, inventory)
     * @returns {string} - Report content
     */
    generateReport(items, reportType = 'summary') {
        switch (reportType) {
            case 'summary':
                return this.generateSummaryReport(items);
            case 'detailed':
                return this.generateDetailedReport(items);
            case 'inventory':
                return this.generateInventoryReport(items);
            default:
                return this.generateSummaryReport(items);
        }
    }

    /**
     * Generate summary report
     * @param {Array} items - Items to analyze
     * @returns {string} - Summary report content
     */
    generateSummaryReport(items) {
        const stats = this.calculateStatistics(items);
        const date = new Date().toLocaleDateString('id-ID');
        
        return `
LAPORAN RINGKASAN ITEMS
Tanggal: ${date}
========================

STATISTIK UMUM:
- Total Items: ${stats.totalItems}
- Total Nilai Inventory: ${this.formatCurrency(stats.totalValue)}
- Rata-rata Nilai per Item: ${this.formatCurrency(stats.averageValue)}

KATEGORI:
${Object.entries(stats.categoryStats).map(([category, count]) => 
    `- ${category}: ${count} items`
).join('\n')}

STATUS STOK:
- Stok Habis: ${stats.outOfStock} items
- Stok Rendah: ${stats.lowStock} items
- Stok Normal: ${stats.normalStock} items

TOP 5 JENIS TERATAS:
${stats.topJenis.map(item => 
    `- ${item.jenis}: ${item.count} items`
).join('\n')}

TOP 5 MEREK TERATAS:
${stats.topMerek.map(item => 
    `- ${item.merek}: ${item.count} items`
).join('\n')}
        `;
    }

    /**
     * Generate detailed report
     * @param {Array} items - Items to analyze
     * @returns {string} - Detailed report content
     */
    generateDetailedReport(items) {
        const date = new Date().toLocaleDateString('id-ID');
        let report = `
LAPORAN DETAIL ITEMS
Tanggal: ${date}
========================

`;

        items.forEach(item => {
            report += `
ITEM: ${item.kodeItem} - ${item.namaItem}
----------------------------------------
Barcode: ${item.barcode || 'N/A'}
Stok: ${this.formatNumber(item.stok)} ${item.satuan}
Rak: ${item.rak || 'N/A'}
Jenis: ${item.jenis || 'N/A'}
Merek: ${item.merek || 'N/A'}
Harga Pokok: ${this.formatCurrency(item.hargaPokok)}
Harga Jual: ${this.formatCurrency(item.hargaJual)}
Tipe: ${item.tipe || 'N/A'}
System HPP: ${item.systemHpp || 'N/A'}
Stok Min: ${this.formatNumber(item.stokMin)}
Status: ${item.statusJual || 'N/A'}
Supplier: ${item.supplier || 'N/A'}
Keterangan: ${item.keterangan || 'N/A'}
Tanggal Dibuat: ${this.formatDate(item.createdAt)}
Tanggal Diperbarui: ${this.formatDate(item.updatedAt)}

`;
        });

        return report;
    }

    /**
     * Generate inventory report
     * @param {Array} items - Items to analyze
     * @returns {string} - Inventory report content
     */
    generateInventoryReport(items) {
        const date = new Date().toLocaleDateString('id-ID');
        const stats = this.calculateStatistics(items);
        
        return `
LAPORAN INVENTORY
Tanggal: ${date}
========================

NILAI INVENTORY:
- Total Nilai Inventory: ${this.formatCurrency(stats.totalValue)}
- Total Modal (Harga Pokok): ${this.formatCurrency(stats.totalCostValue)}
- Estimasi Pendapatan (Harga Jual): ${this.formatCurrency(stats.totalSellingValue)}

ANALISIS STOK:
- Items dengan Stok Habis: ${stats.outOfStock} (${this.formatPercentage(stats.outOfStock / stats.totalItems)})
- Items dengan Stok Rendah: ${stats.lowStock} (${this.formatPercentage(stats.lowStock / stats.totalItems)})
- Items dengan Stok Normal: ${stats.normalStock} (${this.formatPercentage(stats.normalStock / stats.totalItems)})

NILAI PER KATEGORI:
${Object.entries(stats.categoryValue).map(([category, value]) => 
    `- ${category}: ${this.formatCurrency(value)}`
).join('\n')}

REKOMENDASI:
${this.generateRecommendations(stats)}
        `;
    }

    /**
     * Calculate comprehensive statistics
     * @param {Array} items - Items to analyze
     * @returns {Object} - Statistics object
     */
    calculateStatistics(items) {
        const totalItems = items.length;
        
        const stats = {
            totalItems,
            totalValue: 0,
            totalCostValue: 0,
            totalSellingValue: 0,
            averageValue: 0,
            outOfStock: 0,
            lowStock: 0,
            normalStock: 0,
            highStock: 0,
            categoryStats: {},
            categoryValue: {},
            topJenis: [],
            topMerek: []
        };

        // Calculate totals and categories
        items.forEach(item => {
            const costValue = (item.stok || 0) * (item.hargaPokok || 0);
            const sellingValue = (item.stok || 0) * (item.hargaJual || 0);
            
            stats.totalCostValue += costValue;
            stats.totalSellingValue += sellingValue;
            stats.totalValue += costValue;

            // Category stats
            const category = item.jenis || 'Uncategorized';
            stats.categoryStats[category] = (stats.categoryStats[category] || 0) + 1;
            stats.categoryValue[category] = (stats.categoryValue[category] || 0) + costValue;

            // Stock levels
            const stock = item.stok || 0;
            if (stock <= 0) {
                stats.outOfStock++;
            } else if (stock <= 10) {
                stats.lowStock++;
            } else if (stock <= 100) {
                stats.normalStock++;
            } else {
                stats.highStock++;
            }
        });

        stats.averageValue = totalItems > 0 ? stats.totalValue / totalItems : 0;

        // Top categories
        stats.topJenis = Object.entries(stats.categoryStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([jenis, count]) => ({ jenis, count }));

        // Top brands
        const brandCounts = {};
        items.forEach(item => {
            if (item.merek) {
                brandCounts[item.merek] = (brandCounts[item.merek] || 0) + 1;
            }
        });
        
        stats.topMerek = Object.entries(brandCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([merek, count]) => ({ merek, count }));

        return stats;
    }

    /**
     * Generate recommendations based on statistics
     * @param {Object} stats - Statistics object
     * @returns {string} - Recommendations text
     */
    generateRecommendations(stats) {
        const recommendations = [];

        if (stats.outOfStock > 0) {
            recommendations.push(`- Beli ulang ${stats.outOfStock} items yang stoknya habis`);
        }

        if (stats.lowStock > 0) {
            recommendations.push(`- Pertimbangkan untuk restock ${stats.lowStock} items dengan stok rendah`);
        }

        if (stats.highStock > 0) {
            recommendations.push(`- Evaluasi ${stats.highStock} items dengan stok terlalu tinggi`);
        }

        const totalWorth = stats.totalValue;
        if (totalWorth > 100000000) { // 100 million
            recommendations.push(`- Total nilai inventory mencapai ${this.formatCurrency(totalWorth)}, pertimbangkan asuransi`);
        }

        if (recommendations.length === 0) {
            recommendations.push('- Inventory dalam kondisi baik');
        }

        return recommendations.join('\n');
    }

    /**
     * Download file to user's device
     * @param {string} content - File content
     * @param {string} filename - Filename
     * @param {string} mimeType - MIME type
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    /**
     * Export to multiple formats
     * @param {Array} items - Items to export
     * @param {Array} formats - Array of formats to export
     * @param {string} baseFilename - Base filename
     */
    exportMultipleFormats(items, formats = ['csv', 'json'], baseFilename = 'items_export') {
        formats.forEach(format => {
            switch (format.toLowerCase()) {
                case 'csv':
                    this.exportToCSV(items, baseFilename);
                    break;
                case 'json':
                    this.exportToJSON(items, baseFilename);
                    break;
                case 'xlsx':
                case 'excel':
                    this.exportToExcel(items, baseFilename);
                    break;
                default:
                    console.warn(`Unsupported format: ${format}`);
            }
        });
    }

    /**
     * Print data
     * @param {Array} items - Items to print
     * @param {string} title - Print title
     */
    printData(items, title = 'Daftar Items') {
        const printWindow = window.open('', '_blank');
        const printContent = this.generatePrintHTML(items, title);
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Wait for content to load then print
        printWindow.onload = () => {
            printWindow.print();
        };
    }

    /**
     * Generate HTML for printing
     * @param {Array} items - Items to print
     * @param {string} title - Print title
     * @returns {string} - HTML content
     */
    generatePrintHTML(items, title) {
        const currentDate = new Date().toLocaleDateString('id-ID');
        
        let tableRows = '';
        items.forEach(item => {
            tableRows += `
                <tr>
                    <td>${this.escapeHTML(item.kodeItem)}</td>
                    <td>${this.escapeHTML(item.namaItem)}</td>
                    <td class="text-right">${this.formatNumber(item.stok)}</td>
                    <td class="text-center">${this.escapeHTML(item.satuan || '')}</td>
                    <td class="text-center">${this.escapeHTML(item.jenis || '')}</td>
                    <td class="text-right">${this.formatCurrency(item.hargaJual)}</td>
                    <td class="text-center">${this.escapeHTML(item.statusJual || '')}</td>
                </tr>
            `;
        });

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        color: #333;
                    }
                    h1 { 
                        text-align: center; 
                        color: #333; 
                        margin-bottom: 10px;
                    }
                    .date { 
                        text-align: center; 
                        color: #666; 
                        margin-bottom: 30px;
                        font-size: 14px;
                    }
                    .summary {
                        margin-bottom: 30px;
                        padding: 15px;
                        background: #f5f5f5;
                        border-radius: 5px;
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 20px;
                        font-size: 12px;
                    }
                    th, td { 
                        border: 1px solid #ddd; 
                        padding: 8px; 
                        text-align: left; 
                    }
                    th { 
                        background-color: #f8f9fa; 
                        font-weight: bold; 
                    }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .footer { 
                        margin-top: 30px; 
                        text-align: center; 
                        color: #666; 
                        font-size: 12px;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <div class="date">Dicetak pada: ${currentDate}</div>
                
                <div class="summary">
                    <strong>Ringkasan:</strong> Total ${items.length} items
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Kode Item</th>
                            <th>Nama Item</th>
                            <th>Stok</th>
                            <th>Satuan</th>
                            <th>Jenis</th>
                            <th>Harga Jual</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>

                <div class="footer">
                    Generated by Inventory Management System
                </div>
            </body>
            </html>
        `;
    }

    // Utility methods
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

    escapeHTML(value) {
        if (value === null || value === undefined) {
            return '';
        }
        return value.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    formatNumber(value) {
        if (value === null || value === undefined || isNaN(value)) {
            return '';
        }
        return new Intl.NumberFormat('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

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

    formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('id-ID');
    }

    formatPercentage(value) {
        if (value === null || value === undefined || isNaN(value)) {
            return '0%';
        }
        return new Intl.NumberFormat('id-ID', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value);
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // This could be enhanced to use a proper notification system
        if (type === 'success') {
            console.log('✅', message);
        } else {
            console.error('❌', message);
        }
    }
}