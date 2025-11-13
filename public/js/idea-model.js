// Idea Model Assistant JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // File upload handling
  initializeFileUploads();

  // Section progression handling
  initializeSectionProgression();

  // Completion dialog handling
  initializeCompletionDialogs();
});

function initializeFileUploads() {
  // Handle all file upload buttons
  document.querySelectorAll('.upload-button').forEach((button) => {
    button.addEventListener('click', function () {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = this.dataset.accept || '*/*';
      input.multiple = this.dataset.multiple === 'true';

      input.addEventListener('change', (e) => {
        handleFileSelection(e.target.files, this);
      });

      input.click();
    });
  });

  // Handle drag and drop for upload areas
  document.querySelectorAll('.upload-area').forEach((area) => {
    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.classList.add('drag-over');
    });

    area.addEventListener('dragleave', (e) => {
      e.preventDefault();
      area.classList.remove('drag-over');
    });

    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      handleFileSelection(files, area);
    });
  });
}

function handleFileSelection(files, trigger) {
  if (files.length === 0) return;

  // Find the upload container
  const uploadContainer =
    trigger.closest('.upload-container') ||
    trigger.parentElement.closest('.upload-container');

  if (!uploadContainer) return;

  // Show loading state
  const uploadArea = uploadContainer.querySelector('.upload-area');
  const originalContent = uploadArea.innerHTML;

  uploadArea.innerHTML = `
        <div class="text-center">
            <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
            <p class="text-sm font-medium text-foreground">Uploading...</p>
        </div>
    `;

  // Simulate upload (replace with actual upload logic)
  setTimeout(() => {
    // Show success state
    uploadArea.innerHTML = `
            <div class="text-center">
                <svg class="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="text-sm font-medium text-foreground mb-1">Upload Complete</p>
                <p class="text-xs text-muted-foreground">${files.length} file(s) uploaded</p>
            </div>
        `;

    // Add uploaded files list
    const filesList = document.createElement('div');
    filesList.className = 'mt-4 space-y-2';
    Array.from(files).forEach((file) => {
      const fileItem = document.createElement('div');
      fileItem.className =
        'flex items-center justify-between p-2 bg-muted rounded-md';
      fileItem.innerHTML = `
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm text-foreground">${file.name}</span>
                </div>
                <span class="text-xs text-muted-foreground">${formatFileSize(file.size)}</span>
            `;
      filesList.appendChild(fileItem);
    });

    uploadArea.appendChild(filesList);

    // Trigger section completion check
    checkSectionCompletion(uploadContainer);
  }, 2000);
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function initializeSectionProgression() {
  // Handle "Proceed to Section X" buttons
  document.querySelectorAll('[data-action="proceed"]').forEach((button) => {
    button.addEventListener('click', function () {
      const targetSection = this.dataset.target;
      proceedToSection(targetSection);
    });
  });

  // Handle "Review Section X" buttons
  document.querySelectorAll('[data-action="review"]').forEach((button) => {
    button.addEventListener('click', function () {
      const targetSection = this.dataset.target;
      reviewSection(targetSection);
    });
  });
}

function proceedToSection(sectionId) {
  // Hide current section completion dialog
  const currentDialog = document.querySelector('.section-complete.active');
  if (currentDialog) {
    currentDialog.classList.remove('active');
    currentDialog.style.display = 'none';
  }

  // Show next section
  const nextSection = document.getElementById(`section-${sectionId}`);
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' });

    // Update progress indicator
    updateProgressIndicator(sectionId);
  }
}

function reviewSection(sectionId) {
  const section = document.getElementById(`section-${sectionId}`);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function updateProgressIndicator(currentSection) {
  // Update the main progress bar
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) {
    const progress = (parseInt(currentSection) / 5) * 100; // Assuming 5 sections
    progressBar.style.width = `${progress}%`;
  }

  // Update section status indicators
  document.querySelectorAll('.section-status').forEach((status, index) => {
    const sectionNumber = index + 1;
    const circle = status.querySelector('div');
    const label = status.querySelector('span');

    if (sectionNumber < currentSection) {
      // Completed
      status.className =
        'section-status flex flex-col items-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800';
      circle.className =
        'w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold mb-1';
      circle.innerHTML = '✓';
      label.className =
        'text-xs text-center text-green-700 dark:text-green-300';
    } else if (sectionNumber === currentSection) {
      // Active
      status.className =
        'section-status flex flex-col items-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800';
      circle.className =
        'w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold mb-1';
      circle.textContent = sectionNumber;
      label.className = 'text-xs text-center text-blue-700 dark:text-blue-300';
    } else {
      // Pending
      status.className =
        'section-status flex flex-col items-center p-2 rounded-lg bg-muted border border-border';
      circle.className =
        'w-6 h-6 rounded-full bg-muted-foreground/20 flex items-center justify-center text-muted-foreground text-xs font-bold mb-1';
      circle.textContent = sectionNumber;
      label.className = 'text-xs text-center text-muted-foreground';
    }
  });
}

function initializeCompletionDialogs() {
  // Auto-show completion dialogs when sections are complete
  // This would be triggered by actual completion logic
}

function checkSectionCompletion(container) {
  // Check if all required uploads in a section are complete
  const section = container.closest('.section');
  if (!section) return;

  const requiredUploads = section.querySelectorAll(
    '.upload-container[required]'
  );
  const completedUploads = section.querySelectorAll(
    '.upload-container.uploaded'
  );

  if (
    requiredUploads.length === completedUploads.length &&
    requiredUploads.length > 0
  ) {
    showSectionCompleteDialog(section.id.replace('section-', ''));
  }
}

function showSectionCompleteDialog(sectionNumber) {
  const dialog = document.querySelector(`.section-${sectionNumber}-complete`);
  if (dialog) {
    dialog.classList.add('active');
    dialog.style.display = 'block';
    dialog.scrollIntoView({ behavior: 'smooth' });
  }
}

// Utility functions
function showToast(message, type = 'success') {
  // Use existing toast system if available
  if (window.showToast) {
    window.showToast(message, type);
  } else {
    console.log(`${type}: ${message}`);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
