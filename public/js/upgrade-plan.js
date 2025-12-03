document.addEventListener('DOMContentLoaded', function () {
  loadSubscriptionPlans();
});

async function loadSubscriptionPlans() {
  try {
    const response = await fetch('/api/billing/plans', {
      credentials: 'include',
    });
    const data = await response.json();

    if (data.success) {
      const plansContainer = document.getElementById('subscription-plans');
      plansContainer.innerHTML = data.plans
        .map((plan, index) => {
          const isPopular = index === 1; // Mark second plan as popular
          const isEnterprise = !plan.price_monthly && !plan.price_yearly;

          return `
          <div class="rounded-md bg-card px-6 py-5 text-card-foreground border-2 ${isPopular ? 'border-primary relative' : 'border-input/80'}">
            ${
              isPopular
                ? `
              <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span class="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-md">Most Popular</span>
              </div>
            `
                : ''
            }
            <div class="text-center mb-4">
              <h3 class="text-lg font-semibold text-foreground">${plan.name}</h3>
              <p class="text-2xl font-bold text-foreground">
                ${isEnterprise ? 'Custom' : `$${plan.price_monthly}`}
                <span class="text-sm font-normal text-muted-foreground">
                  ${isEnterprise ? ' pricing' : '/month'}
                </span>
              </p>
              ${
                !isEnterprise
                  ? `
                <p class="text-sm text-muted-foreground">
                  or $${plan.price_yearly}/year (save $${(plan.price_monthly * 12 - plan.price_yearly).toFixed(0)})
                </p>
              `
                  : ''
              }
            </div>
            <ul class="space-y-2 mb-6">
              ${plan.features
                .map(
                  (feature) => `
                <li class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  ${feature}
                </li>
              `
                )
                .join('')}
              ${
                plan.credits_included
                  ? `
                <li class="flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  ${plan.credits_included} credits included
                </li>
              `
                  : ''
              }
            </ul>
            <div class="space-y-2">
              ${
                isEnterprise
                  ? `
                <button onclick="contactSales()" class="w-full px-4 py-2 border border-input/80 text-foreground rounded-md hover:bg-muted transition-colors">Contact Sales</button>
              `
                  : `
                <button onclick="upgradePlan('${plan.id}', 'monthly')" class="w-full px-4 py-2 ${isPopular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-input/80 text-foreground hover:bg-muted'} rounded-md transition-colors">
                  ${isPopular ? 'Upgrade to Pro' : `Upgrade to ${plan.name}`}
                </button>
                <button onclick="upgradePlan('${plan.id}', 'yearly')" class="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Or pay yearly (save $${(plan.price_monthly * 12 - plan.price_yearly).toFixed(0)})
                </button>
              `
              }
            </div>
          </div>
        `;
        })
        .join('');
    }
  } catch (error) {
    console.error('Error loading plans:', error);
    document.getElementById('subscription-plans').innerHTML = `
      <div class="col-span-full text-center py-8">
        <p class="text-muted-foreground">Failed to load subscription plans</p>
      </div>
    `;
  }
}

async function upgradePlan(planId, billingCycle) {
  try {
    const response = await fetch('/api/billing/upgrade', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        billingCycle,
      }),
    });

    const data = await response.json();

    if (data.success) {
      showToast(
        `Successfully upgraded to ${data.subscription.plan.name} plan!`,
        'success'
      );
      // Redirect to billing page after a delay
      setTimeout(() => {
        window.location.href = '/pages/billing';
      }, 2000);
    } else {
      showToast('Failed to upgrade plan: ' + data.error, 'error');
    }
  } catch (error) {
    console.error('Error upgrading plan:', error);
    showToast('Failed to upgrade plan', 'error');
  }
}

function contactSales() {
  showToast(
    'Sales contact feature not implemented yet. Please email sales@accelerator.com',
    'info'
  );
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
