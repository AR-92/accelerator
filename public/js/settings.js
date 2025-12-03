// Settings page JavaScript

// Load credit balance in settings
async function loadSettingsCreditBalance() {
  try {
    const response = await fetch('/api/credits/balance');
    const data = await response.json();

    if (data.success) {
      const balanceElement = document.getElementById('settings-credit-balance');
      if (balanceElement) {
        balanceElement.textContent = `${data.balance || 0} credits`;
      }
    }
  } catch (error) {
    console.error('Error loading settings balance:', error);
    const balanceElement = document.getElementById('settings-credit-balance');
    if (balanceElement) {
      balanceElement.textContent = 'Unable to load';
    }
  }
}

// Show transaction history
async function showTransactionHistory() {
  try {
    const response = await fetch('/api/credits/transactions');
    const data = await response.json();

    if (data.success) {
      const modal = document.getElementById('transaction-modal');
      const list = document.getElementById('transaction-list');

      if (data.transactions.length === 0) {
        list.innerHTML =
          '<p class="text-center text-muted-foreground">No transactions found</p>';
      } else {
        list.innerHTML = data.transactions
          .map(
            (tx) => `
          <div class="flex items-center justify-between py-3 border-b last:border-b-0">
            <div>
              <p class="font-medium capitalize">${tx.transaction_type}</p>
              <p class="text-sm text-muted-foreground">${tx.description}</p>
              <p class="text-xs text-muted-foreground">${new Date(tx.created_at).toLocaleDateString()}</p>
            </div>
            <div class="text-right">
              <p class="font-medium ${tx.credits > 0 ? 'text-green-600' : 'text-red-600'}">
                ${tx.credits > 0 ? '+' : ''}${tx.credits}
              </p>
              <p class="text-sm text-muted-foreground">${tx.balance_after} balance</p>
            </div>
          </div>
        `
          )
          .join('');
      }

      modal.classList.remove('hidden');
    }
  } catch (error) {
    console.error('Error loading transactions:', error);
    showToast('Failed to load transaction history', 'error');
  }
}

function closeTransactionModal() {
  document.getElementById('transaction-modal').classList.add('hidden');
}

// Theme toggle functionality for settings page
document.addEventListener('DOMContentLoaded', function () {
  loadSettingsCreditBalance();

  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('change', function () {
      toggleTheme();
    });

    // Set initial state
    const isDark = document.documentElement.classList.contains('dark');
    themeToggle.checked = isDark;
  }
});

// Toast notification function
function showToast(message, type = 'info') {
  // Create toast container if it doesn't exist
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(toastContainer);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `p-4 rounded-md shadow-lg max-w-sm ${
    type === 'success'
      ? 'bg-green-500 text-white'
      : type === 'error'
        ? 'bg-red-500 text-white'
        : type === 'warning'
          ? 'bg-yellow-500 text-black'
          : 'bg-blue-500 text-white'
  } transform translate-x-full transition-transform duration-300`;

  toast.innerHTML = `
    <div class="flex items-center justify-between">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-current opacity-70 hover:opacity-100">&times;</button>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add('translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

// Make functions globally available
window.showTransactionHistory = showTransactionHistory;
window.closeTransactionModal = closeTransactionModal;
