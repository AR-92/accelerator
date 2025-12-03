// Wait for main content to be visible before loading data
function waitForMainContent() {
  return new Promise((resolve) => {
    const checkVisibility = () => {
      const mainContent = document.getElementById('main-content');
      if (mainContent && !mainContent.classList.contains('hidden')) {
        console.log('Main content is visible');
        resolve();
      } else {
        console.log('Main content still hidden, waiting...');
        setTimeout(checkVisibility, 100);
      }
    };
    checkVisibility();
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  console.log('Buy credits page DOM loaded');
  await waitForMainContent();
  loadCreditPackages();
  loadCreditBalance();
});

async function loadCreditPackages() {
  try {
    console.log('Loading credit packages...');
    const response = await fetch('/api/credits/packages', {
      credentials: 'include',
    });
    const data = await response.json();
    console.log('Packages response:', data);

    const packagesContainer = document.getElementById('credit-packages');
    if (data.success && packagesContainer) {
      packagesContainer.innerHTML = data.packages
        .map(
          (pkg, index) => `
        <div class="rounded-md bg-card px-6 py-5 text-card-foreground border-2 ${index === 1 ? 'border-primary relative' : 'border-input/80'}">
          ${
            index === 1
              ? `
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span class="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-md">Most Popular</span>
            </div>
          `
              : ''
          }
          <div class="text-center mb-4">
            <h3 class="text-lg font-semibold text-foreground">${pkg.name}</h3>
            <p class="text-2xl font-bold text-foreground">${pkg.credits} credits<span class="text-sm font-normal text-muted-foreground">/${pkg.price_riyals} SAR</span></p>
          </div>
          <ul class="space-y-2 mb-6">
            <li class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              ${pkg.credits} credits
            </li>
            <li class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Instant activation
            </li>
            <li class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              No expiration
            </li>
          </ul>
          <button class="w-full px-4 py-2 ${index === 1 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-input/80 text-foreground hover:bg-muted'} rounded-md transition-colors" onclick="buyPackage('${pkg.id}')">Buy Now</button>
        </div>
      `
        )
        .join('');
    }
  } catch (error) {
    console.error('Error loading packages:', error);
    document.getElementById('credit-packages').innerHTML =
      '<p class="text-center text-muted-foreground">Failed to load packages</p>';
  }
}

async function loadCreditBalance() {
  try {
    const response = await fetch('/api/credits/balance', {
      credentials: 'include',
    });
    const data = await response.json();

    const balanceContainer = document.getElementById('current-balance');

    if (data.success) {
      balanceContainer.innerHTML = `
        <h3 class="text-lg font-medium text-foreground mb-4">Current Balance</h3>
        <p class="text-2xl font-bold text-foreground">${data.balance} credits</p>
        ${data.data ? `<p class="text-sm text-muted-foreground">Total earned: ${data.data.total_earned}, Total spent: ${data.data.total_spent}</p>` : ''}
      `;
    } else {
      balanceContainer.innerHTML = `
        <h3 class="text-lg font-medium text-foreground mb-4">Current Balance</h3>
        <p class="text-muted-foreground">Unable to load balance</p>
      `;
    }
  } catch (error) {
    console.error('Error loading balance:', error);
    const balanceContainer = document.getElementById('current-balance');
    balanceContainer.innerHTML = `
      <h3 class="text-lg font-medium text-foreground mb-4">Current Balance</h3>
      <p class="text-muted-foreground">Please log in to view your credit balance</p>
      <a href="/auth/login" class="text-primary hover:underline">Login</a>
    `;
  }
}

async function buyPackage(packageId) {
  try {
    // Check if user is authenticated
    const sessionResponse = await fetch('/auth/session');
    const sessionData = await sessionResponse.json();

    if (!sessionData.authenticated) {
      alert('Please log in to purchase credits');
      window.location.href = '/auth/login';
      return;
    }

    const response = await fetch('/api/credits/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        packageId,
        paymentMethod: 'dummy', // Since it's dummy payment
      }),
    });

    const data = await response.json();

    if (data.success) {
      showToast('Credits purchased successfully!', 'success');
      loadCreditBalance(); // Refresh balance
      if (typeof window.loadNavCreditBalance === 'function') {
        window.loadNavCreditBalance();
      }
      if (typeof window.loadCurrentPlan === 'function') {
        window.loadCurrentPlan();
      }
    } else {
      showToast('Purchase failed: ' + data.error, 'error');
    }
  } catch (error) {
    console.error('Error buying credits:', error);
    showToast('Purchase failed', 'error');
  }
}

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
