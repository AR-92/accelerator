document.addEventListener('DOMContentLoaded', function () {
  console.log('Test buy credits page loaded');
  loadCreditPackages();
  loadCreditBalance();
});

async function loadCreditPackages() {
  try {
    console.log('Loading credit packages...');
    const response = await fetch('/api/credits/packages');
    const data = await response.json();
    console.log('Packages response:', data);

    if (data.success) {
      const packagesContainer = document.getElementById('credit-packages');
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
          <button class="w-full px-4 py-2 ${index === 1 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-input/80 text-foreground hover:bg-muted'} rounded-md transition-colors" onclick="alert('Purchase testing not available without authentication')">Buy Now</button>
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
  const balanceContainer = document.getElementById('current-balance');
  balanceContainer.innerHTML = `
    <h3 class="text-lg font-medium text-foreground mb-4">Current Balance</h3>
    <p class="text-muted-foreground">Please log in to view your credit balance</p>
    <a href="/auth/login" class="text-primary hover:underline">Login</a>
  `;
}
