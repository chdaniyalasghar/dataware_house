document.addEventListener('DOMContentLoaded', () => {
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course-btn');
    const calcBtn = document.getElementById('calc-btn');
    const resetBtn = document.getElementById('reset-btn');
    const cgpaDisplay = document.getElementById('cgpa-value');
    const totalCreditsDisplay = document.getElementById('total-credits-display');

    // Initial check to ensure at least one row exists if list is empty
    if (courseList.querySelectorAll('.input-row').length === 0) {
        addCourseRow();
    }

    // Add Course Button Event
    addCourseBtn.addEventListener('click', () => {
        addCourseRow();
    });

    // Reset Button Event
    resetBtn.addEventListener('click', () => {
        // Clear all inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.value = '');
        
        // Reset display
        updateDisplay(0, 0);
        
        // Reset to initial 3 rows (optional, or just clear)
        // For "Scientific" feel, let's just clear values but keep rows, or maybe reset to 3 rows
        while (courseList.querySelectorAll('.input-row').length > 3) {
            courseList.lastElementChild.remove();
        }
        
        // Add animation feedback
        animateDisplay();
    });

    // Calculate Button Event
    calcBtn.addEventListener('click', () => {
        calculateCGPA();
    });

    // Delegate delete button events
    courseList.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete') || e.target.parentElement.classList.contains('btn-delete')) {
            const row = e.target.closest('.input-row');
            // Ensure at least one row remains
            if (courseList.querySelectorAll('.input-row').length > 1) {
                row.remove();
            } else {
                // Determine if we should clear it instead of removing
                const inputs = row.querySelectorAll('input');
                inputs.forEach(input => input.value = '');
            }
        }
    });

    // Function to add a new course row
    function addCourseRow() {
        const rowCount = courseList.querySelectorAll('.input-row').length + 1;
        const newRow = document.createElement('div');
        newRow.classList.add('course-row', 'input-row');
        newRow.innerHTML = `
            <input type="text" placeholder="Subject ${rowCount}" class="input-subject">
            <input type="number" placeholder="Grade" class="input-grade" step="0.1" min="0" max="10">
            <input type="number" placeholder="Credit" class="input-credit" step="0.5" min="0">
            <button class="btn-delete" aria-label="Remove Course">×</button>
        `;
        
        // Animation for entry
        newRow.style.opacity = '0';
        newRow.style.transform = 'translateY(-10px)';
        courseList.appendChild(newRow);
        
        // Trigger reflow for animation
        void newRow.offsetWidth;
        
        newRow.style.transition = 'all 0.3s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateY(0)';
        
        // Scroll to bottom
        courseList.scrollTop = courseList.scrollHeight;
    }

    // Calculation Logic
    function calculateCGPA() {
        const rows = document.querySelectorAll('.input-row');
        let totalPoints = 0;
        let totalCredits = 0;
        let validRows = 0;

        rows.forEach(row => {
            const gradeInput = row.querySelector('.input-grade');
            const creditInput = row.querySelector('.input-credit');
            
            const grade = parseFloat(gradeInput.value);
            const credit = parseFloat(creditInput.value);

            // Validate inputs
            if (!isNaN(grade) && !isNaN(credit) && credit > 0) {
                totalPoints += grade * credit;
                totalCredits += credit;
                validRows++;
            }
        });

        if (totalCredits > 0) {
            const cgpa = totalPoints / totalCredits;
            updateDisplay(cgpa, totalCredits);
        } else {
            updateDisplay(0, 0);
        }
    }

    function updateDisplay(cgpa, credits) {
        // Animate the number counting up if it's a new calc
        const currentVal = parseFloat(cgpaDisplay.innerText);
        const targetVal = cgpa;
        
        // Simple counter animation
        animateValue(cgpaDisplay, currentVal, targetVal, 500);
        
        totalCreditsDisplay.textContent = `Total Credits: ${credits}`;
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Format to 2 decimal places
            const current = (progress * (end - start) + start).toFixed(2);
            obj.innerHTML = current;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toFixed(2);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    function animateDisplay() {
        cgpaDisplay.style.opacity = '0.5';
        setTimeout(() => {
            cgpaDisplay.style.opacity = '1';
        }, 100);
    }
});
