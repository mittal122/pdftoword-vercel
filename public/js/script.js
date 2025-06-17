document.addEventListener('DOMContentLoaded', function() {
    const uploadSection = document.getElementById('uploadSection');
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const convertBtn = document.getElementById('convertBtn');
    const progress = document.getElementById('progress');
    const downloadSection = document.getElementById('downloadSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMessage = document.getElementById('errorMessage');

    let selectedFile = null;

    // Click to upload
    uploadSection.addEventListener('click', () => {
        fileInput.click();
    });

    // File selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            selectedFile = file;
            fileName.textContent = `Selected: ${file.name}`;
            fileName.style.display = 'block';
            convertBtn.disabled = false;
            convertBtn.classList.add('glow');
            hideError();
        } else {
            showError('Please select a valid PDF file.');
            resetUpload();
        }
    });

    // Drag and drop
    uploadSection.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadSection.classList.add('dragover');
    });

    uploadSection.addEventListener('dragleave', () => {
        uploadSection.classList.remove('dragover');
    });

    uploadSection.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadSection.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            selectedFile = file;
            fileInput.files = e.dataTransfer.files;
            fileName.textContent = `Selected: ${file.name}`;
            fileName.style.display = 'block';
            convertBtn.disabled = false;
            convertBtn.classList.add('glow');
            hideError();
        } else {
            showError('Please drop a valid PDF file.');
        }
    });

    // Convert button
    convertBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);

        // Show progress
        convertBtn.style.display = 'none';
        progress.style.display = 'block';
        hideError();

        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                downloadBtn.href = url;
                downloadBtn.download = selectedFile.name.replace('.pdf', '.docx');
                
                progress.style.display = 'none';
                downloadSection.style.display = 'block';
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Conversion failed');
            }
        } catch (error) {
            progress.style.display = 'none';
            convertBtn.style.display = 'block';
            showError(`Error: ${error.message}`);
        }
    });

    // Reset after download
    downloadBtn.addEventListener('click', () => {
        setTimeout(() => {
            resetAll();
        }, 1000);
    });

    function resetUpload() {
        selectedFile = null;
        fileName.style.display = 'none';
        convertBtn.disabled = true;
        convertBtn.classList.remove('glow');
        fileInput.value = '';
    }

    function resetAll() {
        resetUpload();
        downloadSection.style.display = 'none';
        convertBtn.style.display = 'block';
        progress.style.display = 'none';
        hideError();
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }
});
