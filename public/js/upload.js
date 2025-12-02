// File upload functionality
class FileUploadManager {
  constructor() {
    this.uploadQueue = [];
    this.currentUploads = new Map();
    this.init();
  }

  init() {
    // Initialize file input handlers
    document.addEventListener('change', (e) => {
      if (e.target.type === 'file') {
        this.handleFileSelection(e.target);
      }
    });

    // Initialize upload area click handlers
    document.addEventListener('click', (e) => {
      if (e.target.closest('.upload-area')) {
        const uploadArea = e.target.closest('.upload-area');
        const fileInput = uploadArea.previousElementSibling;
        if (fileInput && fileInput.type === 'file') {
          fileInput.click();
        }
      }
    });
  }

  handleFileSelection(input) {
    const files = Array.from(input.files);
    if (files.length === 0) return;

    const isMultiple = input.hasAttribute('multiple');
    const uploadArea = input.nextElementSibling;

    if (!uploadArea || !uploadArea.classList.contains('upload-area')) {
      console.error('Upload area not found');
      return;
    }

    // Validate files
    const validation = this.validateFiles(files, isMultiple);
    if (!validation.valid) {
      this.showErrorState(uploadArea, validation.error);
      return;
    }

    if (isMultiple) {
      this.uploadMultipleFiles(files, uploadArea);
    } else {
      this.uploadSingleFile(files[0], uploadArea);
    }
  }

  validateFiles(files, isMultiple) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!isMultiple && files.length > 1) {
      return { valid: false, error: 'Only one file allowed for this upload' };
    }

    if (isMultiple && files.length > 10) {
      return { valid: false, error: 'Maximum 10 files allowed' };
    }

    for (const file of files) {
      if (file.size > maxSize) {
        return {
          valid: false,
          error: `File "${file.name}" is too large. Maximum size is 10MB`,
        };
      }

      if (!allowedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `File "${file.name}" has invalid type. Allowed: images, PDF, DOC, DOCX`,
        };
      }

      // Check for dangerous filenames
      if (
        file.name.includes('..') ||
        file.name.includes('/') ||
        file.name.includes('\\')
      ) {
        return { valid: false, error: `Invalid filename: ${file.name}` };
      }
    }

    return { valid: true };
  }

  async uploadSingleFile(file, uploadArea) {
    const formData = new FormData();
    formData.append('file', file);

    this.showUploadingState(uploadArea, file.name);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': this.getCsrfToken(),
        },
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccessState(uploadArea, result.file);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      this.showErrorState(uploadArea, error.message);
    }
  }

  async uploadMultipleFiles(files, uploadArea) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    this.showUploadingState(uploadArea, `${files.length} files`);

    try {
      const response = await fetch('/api/upload-multiple', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': this.getCsrfToken(),
        },
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccessState(uploadArea, result.files);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      this.showErrorState(uploadArea, error.message);
    }
  }

  showUploadingState(uploadArea, fileName) {
    const content = uploadArea.querySelector('.text-center');
    if (content) {
      content.innerHTML = `
        <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
        <p class="text-sm font-medium text-foreground">Uploading ${fileName}...</p>
        <div class="w-full bg-secondary rounded-full h-2 mt-2">
          <div class="bg-primary h-2 rounded-full transition-all duration-300 animate-pulse" style="width: 50%"></div>
        </div>
      `;
    }
  }

  showSuccessState(uploadArea, fileData) {
    const content = uploadArea.querySelector('.text-center');
    if (content) {
      if (Array.isArray(fileData)) {
        // Multiple files
        content.innerHTML = `
          <svg class="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p class="text-sm font-medium text-foreground">${fileData.length} files uploaded successfully</p>
          <p class="text-xs text-muted-foreground mt-1">Files are ready for use</p>
        `;
      } else {
        // Single file
        content.innerHTML = `
          <svg class="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p class="text-sm font-medium text-foreground">${fileData.originalname}</p>
          <p class="text-xs text-muted-foreground">File uploaded successfully</p>
        `;
      }

      // Change border color to indicate success
      uploadArea.classList.remove('border-input', 'hover:border-primary/50');
      uploadArea.classList.add('border-success');
    }
  }

  showErrorState(uploadArea, errorMessage) {
    const content = uploadArea.querySelector('.text-center');
    if (content) {
      content.innerHTML = `
        <svg class="w-8 h-8 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <p class="text-sm font-medium text-destructive">Upload failed</p>
        <p class="text-xs text-muted-foreground">${errorMessage}</p>
        <button class="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90" onclick="location.reload()">
          Try again
        </button>
      `;

      // Change border color to indicate error
      uploadArea.classList.remove('border-input', 'hover:border-primary/50');
      uploadArea.classList.add('border-destructive');
    }
  }

  getCsrfToken() {
    // Try to get CSRF token from meta tag or hidden input
    const token =
      document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content') ||
      document.querySelector('input[name="_csrf"]')?.value ||
      document.querySelector('input[name="csrf_token"]')?.value;
    return token || '';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FileUploadManager();
});

// Export for potential use in other scripts
window.FileUploadManager = FileUploadManager;
