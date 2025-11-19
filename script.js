document.addEventListener('DOMContentLoaded', () => {
    
    // --- Skill Tag System Logic ---
    const skillInput = document.getElementById('skillInput');
    const tagContainer = document.getElementById('tagContainer');
    let skills = []; // Store skills here

    function renderTags() {
        // Clear current tags (except input)
        document.querySelectorAll('.tag').forEach(tag => tag.remove());
        
        // Re-render
        skills.forEach((skill, index) => {
            const tag = document.createElement('div');
            tag.classList.add('tag');
            tag.innerHTML = `
                <span>${skill}</span>
                <i class="fa-solid fa-xmark" onclick="removeTag(${index})"></i>
            `;
            tagContainer.insertBefore(tag, skillInput);
        });
    }

    // Global function for inline onclick
    window.removeTag = function(index) {
        skills.splice(index, 1);
        renderTags();
    };

    skillInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = skillInput.value.trim().replace(/,/g, ''); // Clean input
            
            if (val && !skills.includes(val)) {
                skills.push(val);
                skillInput.value = '';
                renderTags();
                // Remove error if exists
                document.getElementById('err-skills').style.display = 'none';
                tagContainer.classList.remove('input-error');
            } else if (skills.includes(val)) {
                skillInput.value = ''; // Clear duplicate
            }
        }
        
        // Backspace to remove last tag
        if (e.key === 'Backspace' && skillInput.value === '' && skills.length > 0) {
            skills.pop();
            renderTags();
        }
    });

    // Focus container triggers input focus
    tagContainer.addEventListener('click', () => {
        skillInput.focus();
    });


    // --- File Upload Logic ---
    const fileInput = document.getElementById('resumeUpload');
    const fileInfo = document.getElementById('fileInfo');
    
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            fileInfo.textContent = this.files[0].name;
            fileInfo.style.color = 'var(--slate-900)';
            fileInfo.style.fontWeight = '500';
            document.getElementById('err-file').style.display = 'none';
            document.querySelector('.upload-zone').classList.remove('input-error');
        } else {
            fileInfo.textContent = "No file selected";
        }
    });


    // --- Form Validation & Submission ---
    const form = document.getElementById('appForm');
    const formView = document.getElementById('formView');
    const successView = document.getElementById('successView');
    const submitBtn = document.getElementById('submitBtn');

    function showError(id, show) {
        const el = document.getElementById(id);
        if(el) el.style.display = show ? 'block' : 'none';
        
        // Highlight input parent
        const inputId = id.replace('err-', '');
        if(inputId === 'skills') {
            const zone = document.getElementById('tagContainer');
            show ? zone.classList.add('input-error') : zone.classList.remove('input-error');
        } else if (inputId === 'file') {
             const zone = document.querySelector('.upload-zone');
             show ? zone.classList.add('input-error') : zone.classList.remove('input-error');
        } else {
            const input = document.getElementById(inputId);
            if(input) show ? input.classList.add('input-error') : input.classList.remove('input-error');
        }
    }

    function validate() {
        let valid = true;

        // Standard Fields
        const name = document.getElementById('fullName').value.trim();
        if (name.length < 2) { showError('err-fullName', true); valid = false; } else { showError('err-fullName', false); }

        const email = document.getElementById('email').value.trim();
        const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRx.test(email)) { showError('err-email', true); valid = false; } else { showError('err-email', false); }

        const phone = document.getElementById('phone').value.trim();
        if (phone.length < 10) { showError('err-phone', true); valid = false; } else { showError('err-phone', false); }

        const exp = document.getElementById('experience').value;
        if (!exp) { showError('err-experience', true); valid = false; } else { showError('err-experience', false); }

        const domain = document.getElementById('domain').value;
        if (!domain) { showError('err-domain', true); valid = false; } else { showError('err-domain', false); }

        // Custom Fields
        if (skills.length === 0) { showError('err-skills', true); valid = false; } else { showError('err-skills', false); }
        
        if (!fileInput.files[0]) { showError('err-file', true); valid = false; } else { showError('err-file', false); }

        return valid;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validate()) return;

        // UI Loading
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';

        // Simulate API Call
        setTimeout(() => {
            // Populate Success View
            document.getElementById('prevName').textContent = document.getElementById('fullName').value;
            document.getElementById('prevContact').textContent = document.getElementById('email').value + " | " + document.getElementById('phone').value;
            document.getElementById('prevExp').textContent = document.getElementById('experience').value;
            document.getElementById('prevSkills').textContent = skills.join(', ');
            document.getElementById('prevDomain').textContent = document.getElementById('domain').value;
            document.getElementById('prevFile').textContent = fileInput.files[0].name;

            // Switch Views
            formView.classList.add('hidden');
            successView.classList.remove('hidden');
            window.scrollTo(0,0);

            // Restore Button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }, 1200);
    });

    // Reset Logic
    document.getElementById('resetBtn').addEventListener('click', () => {
        form.reset();
        skills = [];
        renderTags();
        fileInfo.textContent = "No file selected (PDF/DOCX, Max 5MB)";
        fileInfo.style.color = 'var(--slate-500)';
        fileInfo.style.fontWeight = 'normal';
        
        // Clear errors
        document.querySelectorAll('.error-text').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

        successView.classList.add('hidden');
        formView.classList.remove('hidden');
        window.scrollTo(0,0);
    });

});