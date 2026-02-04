/* ============================================
   Timeline.js - Medical History Timeline
   Chronological display of medical records
   ============================================ */

/**
 * Dummy medical records data
 * Sorted chronologically (newest first)
 */
const medicalRecords = [
    {
        id: 'record-1',
        date: '2024-02-15',
        type: 'Consultation',
        title: 'Annual Physical Examination',
        doctor: 'Dr. Sarah Johnson',
        description: 'Routine annual checkup. Patient is in good health. Blood pressure normal, heart rate regular.',
        category: 'consultation',
        icon: '🩺'
    },
    {
        id: 'record-2',
        date: '2024-02-10',
        type: 'Blood Test',
        title: 'Complete Blood Count (CBC)',
        doctor: 'Dr. Michael Chen',
        description: 'Blood test results: Hemoglobin 14.2 g/dL (normal), White blood cells 6.5 (normal), Platelets 250,000 (normal).',
        category: 'test',
        icon: '🩸',
        results: {
            hemoglobin: '14.2 g/dL',
            wbc: '6.5',
            platelets: '250,000'
        }
    },
    {
        id: 'record-3',
        date: '2024-01-28',
        type: 'X-Ray',
        title: 'Chest X-Ray',
        doctor: 'Dr. Emily Rodriguez',
        description: 'Chest X-ray examination. No abnormalities detected. Lungs clear, heart size normal.',
        category: 'imaging',
        icon: '📷'
    },
    {
        id: 'record-4',
        date: '2024-01-20',
        type: 'Medication',
        title: 'Prescription: Antibiotics',
        doctor: 'Dr. Sarah Johnson',
        description: 'Prescribed Amoxicillin 500mg, twice daily for 7 days for bacterial infection treatment.',
        category: 'medication',
        icon: '💊',
        medication: 'Amoxicillin 500mg',
        dosage: 'Twice daily for 7 days'
    },
    {
        id: 'record-5',
        date: '2024-01-15',
        type: 'Diagnosis',
        title: 'Upper Respiratory Infection',
        doctor: 'Dr. Sarah Johnson',
        description: 'Diagnosed with mild upper respiratory infection. Symptoms include cough and congestion.',
        category: 'diagnosis',
        icon: '🫁'
    },
    {
        id: 'record-6',
        date: '2024-01-05',
        type: 'Blood Test',
        title: 'Lipid Panel',
        doctor: 'Dr. Michael Chen',
        description: 'Cholesterol levels: Total 180 mg/dL (normal), LDL 110 mg/dL (normal), HDL 55 mg/dL (good).',
        category: 'test',
        icon: '🩸',
        results: {
            totalCholesterol: '180 mg/dL',
            ldl: '110 mg/dL',
            hdl: '55 mg/dL'
        }
    },
    {
        id: 'record-7',
        date: '2023-12-20',
        type: 'Consultation',
        title: 'Follow-up Visit',
        doctor: 'Dr. Sarah Johnson',
        description: 'Follow-up appointment to review medication effectiveness. Patient reports improvement.',
        category: 'consultation',
        icon: '🩺'
    },
    {
        id: 'record-8',
        date: '2023-12-10',
        type: 'X-Ray',
        title: 'Knee X-Ray',
        doctor: 'Dr. Emily Rodriguez',
        description: 'X-ray of right knee. No fractures detected. Minor inflammation noted.',
        category: 'imaging',
        icon: '📷'
    },
    {
        id: 'record-9',
        date: '2023-11-25',
        type: 'Blood Test',
        title: 'Blood Glucose Test',
        doctor: 'Dr. Michael Chen',
        description: 'Fasting blood glucose: 95 mg/dL (normal range). No signs of diabetes.',
        category: 'test',
        icon: '🩸',
        results: {
            glucose: '95 mg/dL'
        }
    },
    {
        id: 'record-10',
        date: '2023-11-15',
        type: 'Consultation',
        title: 'Cardiology Consultation',
        doctor: 'Dr. James Wilson',
        description: 'Cardiology consultation for routine heart health check. EKG performed, results normal.',
        category: 'consultation',
        icon: '🩺'
    }
];

/**
 * Current filter state
 */
let currentFilter = 'all';

/**
 * Initialize timeline
 */
function initializeTimeline() {
    const timelineWrapper = document.getElementById('timeline-wrapper');
    if (!timelineWrapper) return;

    // Initialize filter buttons
    initializeFilters();

    // Render timeline
    renderTimeline();
}

/**
 * Initialize filter buttons
 */
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update filter and re-render
            currentFilter = filter;
            renderTimeline();
        });
    });

    // Set 'All' as active by default
    const allButton = document.querySelector('[data-filter="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }
}

/**
 * Render timeline based on current filter
 */
function renderTimeline() {
    const timelineWrapper = document.getElementById('timeline-wrapper');
    if (!timelineWrapper) return;

    // Clear existing content
    timelineWrapper.innerHTML = '';

    // Filter records
    const filteredRecords = getFilteredRecords();

    if (filteredRecords.length === 0) {
        timelineWrapper.innerHTML = `
            <div class="timeline-empty">
                <p>No records found for the selected filter.</p>
            </div>
        `;
        return;
    }

    // Group records by year and month
    const groupedRecords = groupRecordsByDate(filteredRecords);

    // Render timeline
    Object.keys(groupedRecords).sort().reverse().forEach(yearMonth => {
        const records = groupedRecords[yearMonth];
        const timelineGroup = createTimelineGroup(yearMonth, records);
        timelineWrapper.appendChild(timelineGroup);
    });
}

/**
 * Get filtered records based on current filter
 */
function getFilteredRecords() {
    if (currentFilter === 'all') {
        return medicalRecords;
    }

    const categoryMap = {
        'diagnosis': 'diagnosis',
        'medication': 'medication',
        'test': 'test',
        'consultation': 'consultation',
        'imaging': 'imaging'
    };

    const category = categoryMap[currentFilter];
    return medicalRecords.filter(record => record.category === category);
}

/**
 * Group records by year and month
 */
function groupRecordsByDate(records) {
    const grouped = {};

    records.forEach(record => {
        const date = new Date(record.date);
        const year = date.getFullYear();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const key = `${year}-${month}`;

        if (!grouped[key]) {
            grouped[key] = {
                year,
                month,
                records: []
            };
        }

        grouped[key].records.push(record);
    });

    // Sort records within each group by date (newest first)
    Object.keys(grouped).forEach(key => {
        grouped[key].records.sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return grouped;
}

/**
 * Create timeline group (year/month header)
 */
function createTimelineGroup(yearMonth, groupData) {
    const group = document.createElement('div');
    group.className = 'timeline-group';

    const header = document.createElement('div');
    header.className = 'timeline-group-header';
    header.innerHTML = `
        <span class="timeline-group-year">${groupData.year}</span>
        <span class="timeline-group-month">${groupData.month}</span>
    `;

    group.appendChild(header);

    // Create timeline items for each record
    groupData.records.forEach(record => {
        const timelineItem = createTimelineItem(record);
        group.appendChild(timelineItem);
    });

    return group;
}

/**
 * Create individual timeline item
 */
function createTimelineItem(record) {
    const item = document.createElement('div');
    item.className = `timeline-item timeline-item-${record.category}`;
    item.setAttribute('data-record-id', record.id);

    const date = new Date(record.date);
    const formattedDate = formatTimelineDate(date);

    // Build record content based on type
    let recordContent = '';

    if (record.type === 'Blood Test' && record.results) {
        recordContent = `
            <div class="timeline-results">
                ${Object.entries(record.results).map(([key, value]) => `
                    <div class="result-item">
                        <span class="result-label">${formatResultLabel(key)}:</span>
                        <span class="result-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    } else if (record.type === 'Medication' && record.medication) {
        recordContent = `
            <div class="timeline-medication">
                <div class="medication-name"><strong>${record.medication}</strong></div>
                <div class="medication-dosage">${record.dosage}</div>
            </div>
        `;
    }

    item.innerHTML = `
        <div class="timeline-marker">
            <div class="timeline-icon">${record.icon}</div>
        </div>
        <div class="timeline-content">
            <div class="timeline-card">
                <div class="timeline-header">
                    <div class="timeline-type-badge timeline-type-${record.category}">
                        ${record.type}
                    </div>
                    <div class="timeline-date">${formattedDate}</div>
                </div>
                <div class="timeline-body">
                    <h3 class="timeline-title">${record.title}</h3>
                    <p class="timeline-doctor">By ${record.doctor}</p>
                    <p class="timeline-description">${record.description}</p>
                    ${recordContent}
                </div>
            </div>
        </div>
    `;

    return item;
}

/**
 * Format date for timeline display
 */
function formatTimelineDate(date) {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    
    return `${dayOfWeek}, ${month} ${day}, ${year}`;
}

/**
 * Format result label for display
 */
function formatResultLabel(key) {
    const labels = {
        hemoglobin: 'Hemoglobin',
        wbc: 'White Blood Cells',
        platelets: 'Platelets',
        totalCholesterol: 'Total Cholesterol',
        ldl: 'LDL',
        hdl: 'HDL',
        glucose: 'Blood Glucose'
    };
    return labels[key] || key;
}

/**
 * Initialize on DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeTimeline();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTimeline,
        medicalRecords
    };
}
