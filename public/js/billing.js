document.addEventListener('DOMContentLoaded', function () {
  loadCurrentSubscription();
  loadBillingHistory();
});

async function loadCurrentSubscription() {
  try {
    const response = await fetch('/api/billing/subscription', {
      credentials: 'include',
    });
    const data = await response.json();

    const planContainer = document.getElementById('current-plan');

    if (data.success && data.subscription) {
      const sub = data.subscription;
      const plan = sub.plan;
      const nextBilling = new Date(sub.current_period_end).toLocaleDateString();

      planContainer.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-foreground">Current Plan</h3>
          <span class="px-3 py-1 bg-primary/20 text-primary text-sm rounded-md">${plan.name} Plan</span>
        </div>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <p class="text-sm text-muted-foreground">Monthly Cost</p>
            <p class="text-2xl font-semibold text-foreground">$${plan.price_monthly || 'Custom'}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Next Billing Date</p>
            <p class="text-lg font-medium text-foreground">${nextBilling}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Status</p>
            <p class="text-lg font-medium text-foreground capitalize">${sub.status}</p>
          </div>
        </div>
        <div class="mt-4 flex gap-3">
          <a href="/pages/core/upgrade-plan" class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Upgrade Plan</a>
          <button onclick="cancelSubscription()" class="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors">Cancel Subscription</button>
        </div>
      `;
    } else {
      planContainer.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-semibold text-foreground">Current Plan</h3>
          <span class="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md">Free Plan</span>
        </div>
        <div class="text-center py-8">
          <p class="text-muted-foreground mb-4">You're currently on the free plan</p>
          <a href="/pages/core/upgrade-plan" class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">Upgrade Now</a>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading subscription:', error);
    document.getElementById('current-plan').innerHTML = `
      <div class="text-center py-8">
        <p class="text-muted-foreground">Unable to load subscription details</p>
      </div>
    `;
  }
}

async function loadBillingHistory() {
  try {
    const response = await fetch('/api/billing/history', {
      credentials: 'include',
    });
    const data = await response.json();

    const historyContainer = document.getElementById('billing-history');

    if (data.success && data.history.length > 0) {
      const historyHtml = data.history
        .map((item) => {
          const date = new Date(item.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          });
          return `
          <div class="flex items-center justify-between py-3 border-b border-input/80 last:border-b-0">
            <div>
              <p class="font-medium text-foreground">${date}</p>
              <p class="text-sm text-muted-foreground">${item.status === 'paid' ? 'Subscription payment' : 'Billing item'}</p>
            </div>
            <div class="text-right">
              <p class="font-medium text-foreground">$${item.amount}</p>
              <button onclick="downloadInvoice('${item.invoice_number}')" class="text-primary hover:underline text-sm">Download Invoice</button>
            </div>
          </div>
        `;
        })
        .join('');

      historyContainer.innerHTML = `
        <h3 class="text-xl font-semibold text-foreground mb-4">Billing History</h3>
        <div class="space-y-3">
          ${historyHtml}
        </div>
      `;
    } else {
      historyContainer.innerHTML = `
        <h3 class="text-xl font-semibold text-foreground mb-4">Billing History</h3>
        <div class="text-center py-8">
          <p class="text-muted-foreground">No billing history found</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading billing history:', error);
    document.getElementById('billing-history').innerHTML = `
      <h3 class="text-xl font-semibold text-foreground mb-4">Billing History</h3>
      <div class="text-center py-8">
        <p class="text-muted-foreground">Unable to load billing history</p>
      </div>
    `;
  }
}

async function cancelSubscription() {
  if (
    !confirm(
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.'
    )
  ) {
    return;
  }

  try {
    const response = await fetch('/api/billing/cancel', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancelAtPeriodEnd: true }),
    });

    const data = await response.json();

    if (data.success) {
      showToast('Subscription cancelled successfully', 'success');
      loadCurrentSubscription(); // Refresh the subscription status
    } else {
      showToast('Failed to cancel subscription: ' + data.error, 'error');
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    showToast('Failed to cancel subscription', 'error');
  }
}

function downloadInvoice(invoiceNumber) {
  // For now, just show a toast. In a real app, this would download the invoice
  showToast(`Invoice ${invoiceNumber} download not implemented yet`, 'info');
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
