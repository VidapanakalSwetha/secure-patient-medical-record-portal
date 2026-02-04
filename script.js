/* ============================================
   Script.js - Consent Toggles & Emergency Access Timer
   Secure Patient Medical Record Portal
   ============================================ */

// ============================================
// Consent Toggle Management
// ============================================

/**
 * Simulated consent data structure
 * In a real application, this would come from a backend
 */
const consentData = [
    {
        id: 'consent-1',
        title: 'Share with Primary Care Physician',
        description: 'Allow your primary care doctor to access your medical records',
        enabled: true,
        lastModified: '2024-01-15'
    },
    {
        id: 'consent-2',
        title: 'Share with Specialists',
        description: 'Allow specialist doctors to view your records when referred',
        enabled: false,
        lastModified: '2024-01-10'
    },
    {
        id: 'consent-3',
        title: 'Share with Emergency Services',
        description: 'Allow emergency medical services to access critical information',
        enabled: true,
        lastModified: '2024-01-20'
    },
    {
        id: 'consent-4',
        title: 'Share with Family Members',
        description: 'Allow designated family members to view your records',
        enabled: false,
        lastModified: '2024-01-05'
    },
    {
        id: 'consent-5',
        title: 'Share for Research Purposes',
        description: 'Allow anonymized data to be used for medical research',
        enabled: false,
        lastModified: '2024-01-01'
    }
];

/**
 * Access log entries
 */
const accessLog = [
    {
        id: 'log-1',
        entity: 'Dr. Sarah Johnson',
        accessType: 'Primary Care Physician',
        timestamp: '2024-02-01 14:30:00',
        action: 'Viewed medical records'
    },
    {
        id: 'log-2',
        entity: 'Emergency Services',
        accessType: 'Emergency Access',
        timestamp: '2024-01-28 09:15:00',
        action: 'Accessed critical information'
    },
    {
        id: 'log-3',
        entity: 'Dr. Michael Chen',
        accessType: 'Specialist',
        timestamp: '2024-01-25 11:20:00',
        action: 'Viewed diagnostic reports'
    }
];

/**
 * Hospital access data
 * Simulated hospital list with access permissions
 */
const hospitalData = [
    {
        id: 'hospital-1',
        name: 'City General Hospital',
        location: 'Downtown Medical District',
        type: 'General Hospital',
        hasAccess: true,
        lastAccess: '2024-01-20',
        icon: '🏥'
    },
    {
        id: 'hospital-2',
        name: 'Regional Medical Center',
        location: 'Northside',
        type: 'Teaching Hospital',
        hasAccess: false,
        lastAccess: null,
        icon: '🏥'
    },
    {
        id: 'hospital-3',
        name: 'Community Health Clinic',
        location: 'Eastside',
        type: 'Community Clinic',
        hasAccess: true,
        lastAccess: '2024-02-05',
        icon: '🏥'
    },
    {
        id: 'hospital-4',
        name: 'Specialty Care Hospital',
        location: 'Medical Park',
        type: 'Specialty Hospital',
        hasAccess: false,
        lastAccess: null,
        icon: '🏥'
    },
    {
        id: 'hospital-5',
        name: 'University Medical Center',
        location: 'Campus Area',
        type: 'Academic Medical Center',
        hasAccess: true,
        lastAccess: '2024-01-15',
        icon: '🏥'
    },
    {
        id: 'hospital-6',
        name: 'Riverside Hospital',
        location: 'Riverside District',
        type: 'General Hospital',
        hasAccess: false,
        lastAccess: null,
        icon: '🏥'
    }
];

/**
 * Initialize consent toggles
 */
function initializeConsentToggles() {
    const consentList = document.getElementById('consent-list');
    if (!consentList) return;

    // Clear existing content
    consentList.innerHTML = '';

    // Create toggle for each consent item
    consentData.forEach(consent => {
        const consentItem = createConsentToggle(consent);
        consentList.appendChild(consentItem);
    });

    // Initialize access log
    initializeAccessLog();

    // Initialize hospital access
    initializeHospitalAccess();
}

/**
 * Create a consent toggle element
 */
function createConsentToggle(consent) {
    const item = document.createElement('div');
    item.className = 'consent-item';
    item.setAttribute('data-consent-id', consent.id);

    const toggleId = `toggle-${consent.id}`;

    item.innerHTML = `
        <div class="consent-header">
            <div class="consent-info">
                <h4 class="consent-title">${consent.title}</h4>
                <p class="consent-description">${consent.description}</p>
            </div>
            <label class="toggle-switch" for="${toggleId}">
                <input 
                    type="checkbox" 
                    id="${toggleId}" 
                    class="consent-toggle"
                    ${consent.enabled ? 'checked' : ''}
                    aria-label="Toggle ${consent.title}"
                >
                <span class="toggle-slider"></span>
            </label>
        </div>
        <div class="consent-meta">
            <span class="consent-status ${consent.enabled ? 'status-active' : 'status-inactive'}">
                ${consent.enabled ? 'Active' : 'Inactive'}
            </span>
            <span class="consent-date">Last modified: ${formatDate(consent.lastModified)}</span>
        </div>
    `;

    // Add event listener to toggle
    const toggle = item.querySelector(`#${toggleId}`);
    toggle.addEventListener('change', (e) => {
        handleConsentToggle(consent.id, e.target.checked);
    });

    return item;
}

/**
 * Handle consent toggle change
 */
function handleConsentToggle(consentId, isEnabled) {
    // Update the consent data
    const consent = consentData.find(c => c.id === consentId);
    if (consent) {
        consent.enabled = isEnabled;
        consent.lastModified = new Date().toISOString().split('T')[0];
        
        // Update the UI
        updateConsentItem(consentId, consent);
        
        // Show confirmation message
        showConsentConfirmation(consent.title, isEnabled);
        
        // Log the change
        console.log(`Consent ${consentId} ${isEnabled ? 'enabled' : 'disabled'}`);
    }
}

/**
 * Update consent item in UI
 */
function updateConsentItem(consentId, consent) {
    const item = document.querySelector(`[data-consent-id="${consentId}"]`);
    if (!item) return;

    const statusSpan = item.querySelector('.consent-status');
    const dateSpan = item.querySelector('.consent-date');

    statusSpan.textContent = consent.enabled ? 'Active' : 'Inactive';
    statusSpan.className = `consent-status ${consent.enabled ? 'status-active' : 'status-inactive'}`;
    dateSpan.textContent = `Last modified: ${formatDate(consent.lastModified)}`;
}

/**
 * Show consent confirmation message
 */
function showConsentConfirmation(title, enabled) {
    // Create or get notification element
    let notification = document.getElementById('consent-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'consent-notification';
        notification.className = 'consent-notification';
        document.body.appendChild(notification);
    }

    notification.textContent = `${title} has been ${enabled ? 'enabled' : 'disabled'}`;
    notification.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Initialize access log display
 */
function initializeAccessLog() {
    const accessLogContainer = document.getElementById('access-log');
    if (!accessLogContainer) return;

    accessLogContainer.innerHTML = '';

    accessLog.forEach(log => {
        const logEntry = createAccessLogEntry(log);
        accessLogContainer.appendChild(logEntry);
    });
}

/**
 * Create access log entry
 */
function createAccessLogEntry(log) {
    const entry = document.createElement('div');
    entry.className = 'access-log-entry';
    entry.setAttribute('data-log-id', log.id);

    entry.innerHTML = `
        <div class="log-main">
            <div class="log-entity">
                <strong>${log.entity}</strong>
                <span class="log-type">${log.accessType}</span>
            </div>
            <div class="log-action">${log.action}</div>
        </div>
        <div class="log-timestamp">${formatDateTime(log.timestamp)}</div>
    `;

    return entry;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format date and time for display
 */
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ============================================
// Hospital Access Management
// ============================================

/**
 * Initialize hospital access list
 */
function initializeHospitalAccess() {
    const hospitalList = document.getElementById('hospital-list');
    if (!hospitalList) return;

    // Clear existing content
    hospitalList.innerHTML = '';

    // Create hospital item for each hospital
    hospitalData.forEach(hospital => {
        const hospitalItem = createHospitalItem(hospital);
        hospitalList.appendChild(hospitalItem);
    });
}

/**
 * Create hospital access item
 */
function createHospitalItem(hospital) {
    const item = document.createElement('div');
    item.className = `hospital-item ${hospital.hasAccess ? 'has-access' : 'no-access'}`;
    item.setAttribute('data-hospital-id', hospital.id);

    const toggleId = `hospital-toggle-${hospital.id}`;

    // Determine access status text
    const accessStatus = hospital.hasAccess ? 'Granted' : 'Revoked';
    const accessStatusClass = hospital.hasAccess ? 'status-granted' : 'status-revoked';
    const lastAccessText = hospital.lastAccess 
        ? `Last access: ${formatDate(hospital.lastAccess)}`
        : 'No previous access';

    item.innerHTML = `
        <div class="hospital-header">
            <div class="hospital-icon">${hospital.icon}</div>
            <div class="hospital-info">
                <h4 class="hospital-name">${hospital.name}</h4>
                <p class="hospital-location">${hospital.location}</p>
                <span class="hospital-type">${hospital.type}</span>
            </div>
            <div class="hospital-access-control">
                <label class="toggle-switch hospital-toggle" for="${toggleId}">
                    <input 
                        type="checkbox" 
                        id="${toggleId}" 
                        class="hospital-access-toggle"
                        ${hospital.hasAccess ? 'checked' : ''}
                        aria-label="Toggle access for ${hospital.name}"
                    >
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        <div class="hospital-status">
            <div class="hospital-status-info">
                <span class="access-status-badge ${accessStatusClass}">
                    <span class="status-indicator"></span>
                    Access ${accessStatus}
                </span>
                <span class="hospital-last-access">${lastAccessText}</span>
            </div>
        </div>
        ${hospital.hasAccess ? `
            <div class="hospital-permission-details">
                <p class="permission-text">
                    <strong>Permissions:</strong> This hospital can view your medical records, 
                    test results, and treatment history.
                </p>
            </div>
        ` : ''}
    `;

    // Add event listener to toggle
    const toggle = item.querySelector(`#${toggleId}`);
    toggle.addEventListener('change', (e) => {
        handleHospitalAccessToggle(hospital.id, e.target.checked);
    });

    return item;
}

/**
 * Handle hospital access toggle change
 */
function handleHospitalAccessToggle(hospitalId, hasAccess) {
    // Update the hospital data
    const hospital = hospitalData.find(h => h.id === hospitalId);
    if (hospital) {
        const previousAccess = hospital.hasAccess;
        hospital.hasAccess = hasAccess;
        
        if (hasAccess) {
            hospital.lastAccess = new Date().toISOString().split('T')[0];
        }

        // Update the UI
        updateHospitalItem(hospitalId, hospital);

        // Show confirmation message
        showHospitalAccessConfirmation(hospital.name, hasAccess);

        // Add to access log if access was granted
        if (hasAccess && !previousAccess) {
            addToAccessLog(hospital.name, 'Hospital Access', 'Access granted to medical records');
        }

        // Log the change
        console.log(`Hospital ${hospitalId} access ${hasAccess ? 'granted' : 'revoked'}`);
    }
}

/**
 * Update hospital item in UI
 */
function updateHospitalItem(hospitalId, hospital) {
    const item = document.querySelector(`[data-hospital-id="${hospitalId}"]`);
    if (!item) return;

    // Update item class
    item.className = `hospital-item ${hospital.hasAccess ? 'has-access' : 'no-access'}`;

    // Update status badge
    const statusBadge = item.querySelector('.access-status-badge');
    const statusText = item.querySelector('.access-status-badge');
    const lastAccessSpan = item.querySelector('.hospital-last-access');

    if (statusBadge) {
        statusBadge.className = `access-status-badge ${hospital.hasAccess ? 'status-granted' : 'status-revoked'}`;
        statusBadge.innerHTML = `
            <span class="status-indicator"></span>
            Access ${hospital.hasAccess ? 'Granted' : 'Revoked'}
        `;
    }

    if (lastAccessSpan) {
        lastAccessSpan.textContent = hospital.lastAccess 
            ? `Last access: ${formatDate(hospital.lastAccess)}`
            : 'No previous access';
    }

    // Update or remove permission details
    let permissionDetails = item.querySelector('.hospital-permission-details');
    if (hospital.hasAccess) {
        if (!permissionDetails) {
            permissionDetails = document.createElement('div');
            permissionDetails.className = 'hospital-permission-details';
            permissionDetails.innerHTML = `
                <p class="permission-text">
                    <strong>Permissions:</strong> This hospital can view your medical records, 
                    test results, and treatment history.
                </p>
            `;
            item.appendChild(permissionDetails);
        }
    } else {
        if (permissionDetails) {
            permissionDetails.remove();
        }
    }
}

/**
 * Show hospital access confirmation message
 */
function showHospitalAccessConfirmation(hospitalName, hasAccess) {
    // Create or get notification element
    let notification = document.getElementById('hospital-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'hospital-notification';
        notification.className = 'hospital-notification';
        document.body.appendChild(notification);
    }

    const action = hasAccess ? 'granted' : 'revoked';
    const icon = hasAccess ? '✓' : '✗';
    const message = `${icon} Access ${action} for ${hospitalName}`;

    notification.textContent = message;
    notification.className = `hospital-notification ${hasAccess ? 'notification-granted' : 'notification-revoked'} show`;

    // Hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

/**
 * Add entry to access log
 */
function addToAccessLog(entity, accessType, action) {
    const newLog = {
        id: `log-${Date.now()}`,
        entity: entity,
        accessType: accessType,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        action: action
    };

    accessLog.unshift(newLog); // Add to beginning

    // Re-render access log
    initializeAccessLog();
}

// ============================================
// Emergency Access Timer
// ============================================

let emergencyTimer = null;
let emergencyEndTime = null;
const EMERGENCY_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Initialize emergency access feature
 */
function initializeEmergencyAccess() {
    const emergencyBtn = document.getElementById('emergency-access-btn');
    const closeBtn = document.getElementById('close-emergency-btn');
    const confirmation = document.getElementById('emergency-confirmation');

    if (!emergencyBtn) return;

    // Handle emergency access activation
    emergencyBtn.addEventListener('click', () => {
        activateEmergencyAccess();
    });

    // Handle emergency access deactivation
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            deactivateEmergencyAccess();
        });
    }

    // Check if emergency access is already active on page load
    checkEmergencyStatus();
}

/**
 * Activate emergency access
 */
function activateEmergencyAccess() {
    const confirmation = document.getElementById('emergency-confirmation');
    const status = document.getElementById('emergency-status');
    const emergencyBtn = document.getElementById('emergency-access-btn');

    if (!confirmation) return;

    // Set end time
    emergencyEndTime = Date.now() + EMERGENCY_DURATION;

    // Show confirmation dialog
    confirmation.setAttribute('aria-hidden', 'false');
    confirmation.classList.add('active');

    // Trigger biometric animation
    triggerBiometricAnimation();

    // Disable the button
    if (emergencyBtn) {
        emergencyBtn.disabled = true;
        emergencyBtn.textContent = 'Emergency Access Active';
    }

    // Update status
    if (status) {
        status.innerHTML = '<span class="status-active">Emergency access is currently active</span>';
        status.classList.add('active');
    }

    // Start countdown timer
    startEmergencyCountdown();

    // Auto-deactivate after duration
    emergencyTimer = setTimeout(() => {
        deactivateEmergencyAccess();
    }, EMERGENCY_DURATION);

    // Log activation
    console.log('Emergency access activated');
}

/**
 * Deactivate emergency access
 */
function deactivateEmergencyAccess() {
    const confirmation = document.getElementById('emergency-confirmation');
    const status = document.getElementById('emergency-status');
    const emergencyBtn = document.getElementById('emergency-access-btn');
    const countdownTimer = document.getElementById('countdown-timer');

    // Clear timer
    if (emergencyTimer) {
        clearTimeout(emergencyTimer);
        emergencyTimer = null;
    }

    // Hide confirmation dialog
    if (confirmation) {
        confirmation.setAttribute('aria-hidden', 'true');
        confirmation.classList.remove('active');
    }

    // Reset button
    if (emergencyBtn) {
        emergencyBtn.disabled = false;
        emergencyBtn.textContent = 'Activate Emergency Access';
    }

    // Update status
    if (status) {
        status.innerHTML = '<span class="status-inactive">Emergency access is not active</span>';
        status.classList.remove('active');
    }

    // Clear countdown
    if (countdownTimer) {
        countdownTimer.textContent = '';
    }

    // Reset biometric animation
    const biometricConfirmation = document.getElementById('biometric-confirmation');
    if (biometricConfirmation) {
        biometricConfirmation.classList.remove('animate');
    }

    emergencyEndTime = null;

    // Log deactivation
    console.log('Emergency access deactivated');
}

/**
 * Trigger biometric-style animation
 */
function triggerBiometricAnimation() {
    const biometricConfirmation = document.getElementById('biometric-confirmation');
    if (!biometricConfirmation) return;

    // Reset animation
    biometricConfirmation.classList.remove('animate');
    
    // Trigger animation after a brief delay
    setTimeout(() => {
        biometricConfirmation.classList.add('animate');
    }, 100);
}

/**
 * Start emergency countdown timer
 */
function startEmergencyCountdown() {
    const countdownTimer = document.getElementById('countdown-timer');
    if (!countdownTimer) return;

    // Update countdown every second
    const countdownInterval = setInterval(() => {
        if (!emergencyEndTime) {
            clearInterval(countdownInterval);
            return;
        }

        const now = Date.now();
        const remaining = emergencyEndTime - now;

        if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownTimer.textContent = 'Expired';
            return;
        }

        // Format remaining time
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);

        countdownTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        countdownTimer.setAttribute('aria-label', `Time remaining: ${minutes} minutes and ${seconds} seconds`);

        // Add visual warning when less than 1 minute remains
        if (remaining < 60000) {
            countdownTimer.classList.add('warning');
        } else {
            countdownTimer.classList.remove('warning');
        }
    }, 1000);
}

/**
 * Check emergency access status on page load
 */
function checkEmergencyStatus() {
    const status = document.getElementById('emergency-status');
    if (status && !emergencyEndTime) {
        status.innerHTML = '<span class="status-inactive">Emergency access is not active</span>';
    }
}

// ============================================
// Initialize on DOM Load
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize consent toggles
    initializeConsentToggles();

    // Initialize emergency access
    initializeEmergencyAccess();
});

// Export functions for use in other scripts (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeConsentToggles,
        initializeEmergencyAccess,
        activateEmergencyAccess,
        deactivateEmergencyAccess
    };
}

