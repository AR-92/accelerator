// Authentication related JavaScript functions
function handleLoginResponse(event) {
  const xhr = event.detail.xhr;
  const response = JSON.parse(xhr.responseText);

  if (response.success) {
    // Show success toast
    if (window.Toast) {
      window.Toast.success(response.message || 'Login successful!');
    }

    // Redirect after a short delay
    setTimeout(() => {
      if (response.redirect) {
        window.location.href = response.redirect;
      } else {
        window.location.reload();
      }
    }, 1000);
  } else {
    // Show error toast
    if (window.Toast) {
      window.Toast.error(response.error || 'Login failed');
    }
  }

  // Prevent the default swap
  return false;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Any auth-related initialization can go here
});
