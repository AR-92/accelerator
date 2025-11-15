// Marketing Model Assistant JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Form handling
  initializeFormHandling();

  // Section progression handling
  initializeSectionProgression();

  // Completion dialog handling
  initializeCompletionDialogs();

  // Auto-fill functionality
  initializeAutoFill();
});

function initializeFormHandling() {
  // Handle form submissions
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleFormSubmission(this);
    });
  });

  // Handle save draft buttons
  document.querySelectorAll('button[type="button"]').forEach((button) => {
    if (button.textContent.includes('Save Draft')) {
      button.addEventListener('click', function () {
        saveDraft(this.closest('form'));
      });
    }
  });
}

function handleFormSubmission(form) {
  // Show loading state
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.innerHTML = `
    <div class="flex items-center gap-2">
      <div class="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
      Submitting...
    </div>
  `;

  // Simulate form submission (replace with actual API call)
  setTimeout(() => {
    // Show success state
    submitButton.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Submitted
      </div>
    `;

    // Disable form inputs
    form
      .querySelectorAll('input, select, textarea, button')
      .forEach((element) => {
        element.disabled = true;
      });

    // Add success styling
    form.closest('.bg-background').classList.add('opacity-75');

    // Check if section is complete
    checkSectionCompletion(form);

    // Re-enable after 2 seconds
    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }, 2000);
  }, 1500);
}

function saveDraft(form) {
  const button = form.querySelector('button[type="button"]');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'Saving...';

  // Simulate save (replace with actual save logic)
  setTimeout(() => {
    button.textContent = 'Draft Saved';
    setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
    }, 2000);
  }, 1000);
}

function initializeAutoFill() {
  // Handle auto-fill buttons
  document.querySelectorAll('button').forEach((button) => {
    if (button.textContent.includes('Auto-Fill with AI')) {
      button.addEventListener('click', function () {
        autoFillForm(this);
      });
    }
  });
}

function autoFillForm(button) {
  const form = button.closest('form');
  const originalText = button.textContent;
  button.disabled = true;
  button.innerHTML = `
    <div class="flex items-center gap-2">
      <div class="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
      AI Processing...
    </div>
  `;

  // Simulate AI processing (replace with actual AI call)
  setTimeout(() => {
    // Auto-fill form fields with sample data
    const formData = getSampleDataForForm(form);

    Object.keys(formData).forEach((fieldName) => {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = formData[fieldName];
        } else if (input.tagName === 'SELECT') {
          input.value = formData[fieldName];
        } else {
          input.value = formData[fieldName];
        }
      }
    });

    button.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Auto-Filled
      </div>
    `;

    setTimeout(() => {
      button.disabled = false;
      button.innerHTML = originalText;
    }, 2000);
  }, 2000);
}

function getSampleDataForForm(form) {
  // Sample data based on form type
  const formId = form.id || form.querySelector('input, select, textarea')?.name;

  const sampleData = {
    basic_demographic: 'professionals',
    age_range: '25-34',
    location: 'ksa',
    income_range: '12,000–20,000 SAR',
    gender: 'both',
    pain_points: 'Slow service, Lack of transparency, High prices',
    ideal_experience: 'Fast and seamless, Personalised, Transparent',
    brand_awareness: 'yes',
    lead_generation: 'yes',
    customer_acquisition: 'Acquire 1,000 users in 12 months',
    market_penetration: 'Expand to GCC region within 2 years',
    retention_loyalty: 'yes',
    digital_channels: ['seo', 'social-media', 'email-marketing'],
    offline_channels: ['events', 'conferences'],
    marketing_budget: '10–15% of annual revenue',
    website_traffic: '8,000 visits/month',
    traffic_sources: ['organic-search', 'social-media', 'paid-ads'],
    average_session_duration: '2-4 minutes',
    bounce_rate: '35%',
    conversion_rate: '4.2%',
    cac: '$95',
    clv: '$450',
    nps: '72',
    retention_rate: '68%',
    revenue_growth: '25% YoY',
  };

  return sampleData;
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
  const currentDialog = document.querySelector(
    '.bg-muted.rounded-2xl.p-4.my-6'
  );
  if (currentDialog) {
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
  const progressBar = document.querySelector('.bg-primary.h-2.rounded-full');
  if (progressBar) {
    const progress = (parseInt(currentSection) / 6) * 100; // 6 sections
    progressBar.style.width = `${progress}%`;
  }

  // Update section status indicators in the progress bar
  const progressSections = document.querySelectorAll(
    '.bg-secondary.rounded-full.h-4 .bg-blue-500, .bg-secondary.rounded-full.h-4 .bg-green-500, .bg-secondary.rounded-full.h-4 .bg-purple-500, .bg-secondary.rounded-full.h-4 .bg-orange-500, .bg-secondary.rounded-full.h-4 .bg-red-500, .bg-secondary.rounded-full.h-4 .bg-teal-500'
  );
  progressSections.forEach((section, index) => {
    if (index < currentSection - 1) {
      section.classList.remove('bg-muted');
      section.classList.add('bg-green-500');
    }
  });
}

function initializeCompletionDialogs() {
  // Auto-show completion dialogs when sections are complete
  // This would be triggered by actual completion logic
}

function checkSectionCompletion(form) {
  // Check if all forms in a section are submitted
  const section = form.closest('[id^="section-"]');
  if (!section) return;

  const totalForms = section.querySelectorAll('form').length;
  const submittedForms = section.querySelectorAll('form .opacity-75').length;

  if (submittedForms === totalForms && totalForms > 0) {
    showSectionCompleteDialog(section.id.replace('section-', ''));
  }
}

function showSectionCompleteDialog(sectionNumber) {
  const dialog = document.querySelector('.bg-muted.rounded-2xl.p-4.my-6');
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
