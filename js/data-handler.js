/* ============================================
   Data Handler - Interoperability Awareness
   Simulates data from different hospitals in various formats
   and displays them in a unified view
   ============================================ */

/**
 * Simulated hospital records in different formats
 * In reality, these would be parsed from JSON, XML, CSV
 * but we only show the unified representation
 */

// Hospital records with format metadata (simulated)
const hospitalRecords = [
    {
        id: 'record-1',
        hospital: 'City General Hospital',
        format: 'JSON',
        date: '2024-02-10',
        type: 'Blood Test',
        title: 'Complete Blood Count',
        doctor: 'Dr. Sarah Johnson',
        results: {
            hemoglobin: '14.2 g/dL',
            wbc: '6.5',
            platelets: '250,000'
        },
        status: 'Normal'
    },
    {
        id: 'record-2',
        hospital: 'Regional Medical Center',
        format: 'XML',
        date: '2024-01-28',
        type: 'X-Ray',
        title: 'Chest X-Ray Examination',
        doctor: 'Dr. Michael Chen',
        findings: 'No abnormalities detected. Lungs clear.',
        status: 'Normal'
    },
    {
        id: 'record-3',
        hospital: 'Community Health Clinic',
        format: 'CSV',
        date: '2024-01-15',
        type: 'Consultation',
        title: 'Annual Physical Examination',
        doctor: 'Dr. Emily Rodriguez',
        notes: 'Patient in good health. Blood pressure normal.',
        status: 'Completed'
    },
    {
        id: 'record-4',
        hospital: 'University Medical Center',
        format: 'JSON',
        date: '2024-01-05',
        type: 'Blood Test',
        title: 'Lipid Panel',
        doctor: 'Dr. James Wilson',
        results: {
            totalCholesterol: '180 mg/dL',
            ldl: '110 mg/dL',
            hdl: '55 mg/dL'
        },
        status: 'Normal'
    },
    {
        id: 'record-5',
        hospital: 'Specialty Care Hospital',
        format: 'XML',
        date: '2023-12-20',
        type: 'Medication',
        title: 'Prescription: Antibiotics',
        doctor: 'Dr. Lisa Anderson',
        medication: 'Amoxicillin 500mg',
        dosage: 'Twice daily for 7 days',
        status: 'Active'
    },
    {
        id: 'record-6',
        hospital: 'Riverside Hospital',
        format: 'CSV',
        date: '2023-12-10',
        type: 'Diagnosis',
        title: 'Upper Respiratory Infection',
        doctor: 'Dr. Robert Brown',
        diagnosis: 'Mild upper respiratory infection',
        status: 'Resolved'
    }
];

/**
 * Format badge colors mapping
 */
const formatColors = {
    'JSON': { bg: '#f3e5f5', color: '#7b1fa2', border: '#7b1fa2' },
    'XML': { bg: '#e3f2fd', color: '#1976d2', border: '#1976d2' },
    'CSV': { bg: '#fff3e0', color: '#f57c00', border: '#f57c00' }
};

/**
 * Initialize interoperability display
 */
function initializeInteroperability() {
    displaySourceHospitals();
    displayUnifiedRecords();
}

/**
 * Display source hospitals with format indicators
 */
function displaySourceHospitals() {
    const sourcesGrid = document.getElementById('sources-grid');
    if (!sourcesGrid) return;

    sourcesGrid.innerHTML = '';

    // Get unique hospitals
    const uniqueHospitals = [...new Set(hospitalRecords.map(r => r.hospital))];
    
    uniqueHospitals.forEach(hospital => {
        const hospitalRecords = getRecordsByHospital(hospital);
        const formats = [...new Set(hospitalRecords.map(r => r.format))];
        
        const sourceCard = createSourceCard(hospital, formats, hospitalRecords.length);
        sourcesGrid.appendChild(sourceCard);
    });
}

/**
 * Get records by hospital
 */
function getRecordsByHospital(hospitalName) {
    return hospitalRecords.filter(r => r.hospital === hospitalName);
}

/**
 * Create source hospital card
 */
function createSourceCard(hospital, formats, recordCount) {
    const card = document.createElement('div');
    card.className = 'source-card';

    const formatBadges = formats.map(format => {
        const formatStyle = formatColors[format];
        return `
            <span class="source-format-badge" 
                  style="background-color: ${formatStyle.bg}; color: ${formatStyle.color}; border-color: ${formatStyle.border};">
                ${format}
            </span>
        `;
    }).join('');

    card.innerHTML = `
        <div class="source-header">
            <div class="source-icon">🏥</div>
            <div class="source-info">
                <h4 class="source-name">${hospital}</h4>
                <p class="source-records-count">${recordCount} record${recordCount !== 1 ? 's' : ''}</p>
            </div>
        </div>
        <div class="source-formats">
            ${formatBadges}
        </div>
        <div class="source-note">
            <span class="note-icon">✓</span>
            <span>Automatically converted to unified format</span>
        </div>
    `;

    return card;
}

/**
 * Display unified records
 */
function displayUnifiedRecords() {
    const unifiedGrid = document.getElementById('unified-records-grid');
    if (!unifiedGrid) return;

    unifiedGrid.innerHTML = '';

    // Sort records by date (newest first)
    const sortedRecords = [...hospitalRecords].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    sortedRecords.forEach(record => {
        const unifiedCard = createUnifiedRecordCard(record);
        unifiedGrid.appendChild(unifiedCard);
    });
}

/**
 * Create unified record card
 */
function createUnifiedRecordCard(record) {
    const card = document.createElement('div');
    card.className = 'unified-record-card';

    const formatStyle = formatColors[record.format];
    const dateFormatted = formatRecordDate(record.date);

    // Build record content based on type
    let recordContent = '';

    if (record.type === 'Blood Test' && record.results) {
        recordContent = `
            <div class="record-results">
                ${Object.entries(record.results).map(([key, value]) => `
                    <div class="result-row">
                        <span class="result-label">${formatResultLabel(key)}:</span>
                        <span class="result-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (record.type === 'Medication' && record.medication) {
        recordContent = `
            <div class="record-medication">
                <div class="medication-info">
                    <strong>${record.medication}</strong>
                    <span class="medication-dosage">${record.dosage}</span>
                </div>
            </div>
        `;
    } else if (record.type === 'X-Ray' && record.findings) {
        recordContent = `
            <div class="record-findings">
                <p>${record.findings}</p>
            </div>
        `;
    } else if (record.type === 'Diagnosis' && record.diagnosis) {
        recordContent = `
            <div class="record-diagnosis">
                <p><strong>Diagnosis:</strong> ${record.diagnosis}</p>
            </div>
        `;
    } else if (record.notes) {
        recordContent = `
            <div class="record-notes">
                <p>${record.notes}</p>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="unified-card-header">
            <div class="unified-card-main">
                <div class="record-type-badge record-type-${record.type.toLowerCase().replace(' ', '-')}">
                    ${record.type}
                </div>
                <h4 class="record-title">${record.title}</h4>
            </div>
            <div class="unified-card-meta">
                <span class="format-source-badge" 
                      style="background-color: ${formatStyle.bg}; color: ${formatStyle.color}; border-color: ${formatStyle.border};"
                      title="Original format: ${record.format}">
                    ${record.format}
                </span>
            </div>
        </div>
        <div class="unified-card-body">
            <div class="record-meta-info">
                <div class="meta-item">
                    <span class="meta-label">Hospital:</span>
                    <span class="meta-value">${record.hospital}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Date:</span>
                    <span class="meta-value">${dateFormatted}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Doctor:</span>
                    <span class="meta-value">${record.doctor}</span>
                </div>
            </div>
            ${recordContent}
            <div class="record-status">
                <span class="status-badge status-${record.status.toLowerCase()}">${record.status}</span>
            </div>
        </div>
    `;

    return card;
}

/**
 * Format record date
 */
function formatRecordDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format result label
 */
function formatResultLabel(key) {
    const labels = {
        hemoglobin: 'Hemoglobin',
        wbc: 'White Blood Cells',
        platelets: 'Platelets',
        totalCholesterol: 'Total Cholesterol',
        ldl: 'LDL',
        hdl: 'HDL'
    };
    return labels[key] || key;
}

/**
 * Initialize on DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeInteroperability();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeInteroperability,
        hospitalRecords
    };
}
