/* ============================================
   Main.js - Application Initialization
   Handles navigation and app setup
   ============================================ */

/**
 * Initialize the application
 */
function initializeApp() {
    // Set up navigation
    initializeNavigation();
    
    // Set patient info (dummy data)
    setPatientInfo();
}

/**
 * Initialize navigation between sections
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetSection = link.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(nl => nl.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section, hide others
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
                
                // Scroll to top of main content
                document.querySelector('.main-content').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Set patient information (dummy data)
 */
function setPatientInfo() {
    const patientName = document.getElementById('patient-name');
    const patientId = document.getElementById('patient-id');
    
    if (patientName) {
        patientName.textContent = 'John Doe';
    }
    
    if (patientId) {
        patientId.textContent = 'ID: P-2024-001234';
    }
}

/**
 * Initialize on DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});
