// System Health Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Initialize the system health dashboard
  initializeSystemHealth();

  // Set up auto-refresh every 30 seconds
  setInterval(refreshMetrics, 30000);
});

function initializeSystemHealth() {
  // Add event listeners to buttons
  const refreshBtn = document.getElementById('refresh-metrics-btn');
  const exportBtn = document.getElementById('export-report-btn');
  const dbHealthBtn = document.getElementById('db-health-check-btn');
  const systemConfigBtn = document.getElementById('system-config-btn');
  const clearCacheBtn = document.getElementById('clear-cache-btn');
  const viewLogsBtn = document.getElementById('view-logs-btn');
  const runDiagnosticsBtn = document.getElementById('run-diagnostics-btn');

  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshMetrics);
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', exportReport);
  }

  if (dbHealthBtn) {
    dbHealthBtn.addEventListener('click', runDatabaseHealthCheck);
  }

  if (systemConfigBtn) {
    systemConfigBtn.addEventListener('click', openSystemConfig);
  }

  if (clearCacheBtn) {
    clearCacheBtn.addEventListener('click', clearCache);
  }

  if (viewLogsBtn) {
    viewLogsBtn.addEventListener('click', viewLogs);
  }

  if (runDiagnosticsBtn) {
    runDiagnosticsBtn.addEventListener('click', runDiagnostics);
  }

  // Initial data load
  refreshMetrics();
}

async function refreshMetrics() {
  try {
    // Show loading state
    showLoadingState();

    // Fetch fresh metrics from API
    const response = await fetch('/api/admin/system-health/metrics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }

    const data = await response.json();

    // Update the UI with new data
    updateMetricsDisplay(data.systemMetrics);

    // Update system logs
    updateSystemLogs(data.logs || []);

    // Hide loading state
    hideLoadingState();

    // Show success feedback
    showToast('Metrics refreshed successfully', 'success');
  } catch (error) {
    console.error('Error refreshing metrics:', error);
    hideLoadingState();
    showToast('Failed to refresh metrics', 'error');
  }
}

function updateMetricsDisplay(metrics) {
  // Update database status
  updateStatusCard(
    'db-status',
    metrics.dbConnected ? 'Connected' : 'Disconnected',
    metrics.dbConnected
  );
  updateStatusIcon('db-status', metrics.dbConnected);

  // Update memory usage
  document.getElementById('memory-usage').textContent =
    `${metrics.memoryUsagePercent}%`;
  document.getElementById('memory-percent').textContent =
    `${metrics.memoryUsagePercent}%`;
  updateProgressBar('memory-progress', metrics.memoryUsagePercent);

  // Update uptime
  document.getElementById('uptime').textContent = metrics.uptimeString;

  // Update CPU usage
  document.getElementById('cpu-usage').textContent = `${metrics.cpuUsage}%`;
  updateProgressBar('cpu-progress', metrics.cpuUsage);

  // Update disk usage
  document.getElementById('disk-usage').textContent = `${metrics.diskUsage}%`;
  updateProgressBar('disk-progress', metrics.diskUsage);

  // Update database metrics
  document.getElementById('total-tables').textContent = metrics.totalTables;
  document.getElementById('total-records').textContent = metrics.totalRecords;
  document.getElementById('queries-per-min').textContent =
    metrics.queriesPerMin;
  document.getElementById('active-connections').textContent =
    metrics.activeConnections;
  document.getElementById('response-time').textContent =
    `${metrics.responseTime}ms`;
}

function updateStatusCard(elementId, status, isConnected) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = status;
    element.className = isConnected
      ? 'text-2xl font-bold text-green-600 dark:text-green-400'
      : 'text-2xl font-bold text-red-600 dark:text-red-400';
  }
}

function updateStatusIcon(statusType, isConnected) {
  // This would update the icon next to the status text
  // Implementation depends on the icon library being used
}

function updateProgressBar(barId, percentage) {
  const bar = document.getElementById(barId);
  if (bar) {
    bar.style.width = `${percentage}%`;

    // Update color based on percentage
    if (percentage < 50) {
      bar.className = 'bg-green-600 h-2 rounded-full';
    } else if (percentage < 80) {
      bar.className = 'bg-yellow-600 h-2 rounded-full';
    } else {
      bar.className = 'bg-red-600 h-2 rounded-full';
    }
  }
}

function updateSystemLogs(logs) {
  const logsContainer = document.getElementById('system-logs');
  if (!logsContainer || !logs.length) return;

  logsContainer.innerHTML = logs
    .map(
      (log) => `
        <div class="flex items-start space-x-3">
            <div class="w-2 h-2 ${getLogColor(log.level)} rounded-full mt-2"></div>
            <div class="flex-1">
                <p class="text-sm text-card-foreground">${log.message}</p>
                <p class="text-xs text-muted-foreground">${formatTimestamp(log.timestamp)}</p>
            </div>
        </div>
    `
    )
    .join('');
}

function getLogColor(level) {
  switch (level) {
    case 'error':
      return 'bg-red-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'info':
      return 'bg-blue-500';
    default:
      return 'bg-green-500';
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return date.toLocaleDateString();
}

async function exportReport() {
  try {
    showToast('Generating report...', 'info');

    const response = await fetch('/api/admin/system-health/export', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to export report');
    }

    // Create download link
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-health-report-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast('Report exported successfully', 'success');
  } catch (error) {
    console.error('Error exporting report:', error);
    showToast('Failed to export report', 'error');
  }
}

async function runDatabaseHealthCheck() {
  try {
    showToast('Running database health check...', 'info');

    const response = await fetch('/api/admin/system-health/db-health-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to run database health check');
    }

    const data = await response.json();

    // Show results in modal
    showModal(
      'Database Health Check Results',
      formatHealthCheckResults(data.results)
    );
    showToast('Database health check completed', 'success');
  } catch (error) {
    console.error('Error running database health check:', error);
    showToast('Failed to run database health check', 'error');
  }
}

function openSystemConfig() {
  // Navigate to system config page
  window.location.href = '/admin/other-pages/system-config';
}

async function clearCache() {
  if (
    !confirm(
      'Are you sure you want to clear the system cache? This may temporarily slow down the application.'
    )
  ) {
    return;
  }

  try {
    showToast('Clearing cache...', 'info');

    const response = await fetch('/api/admin/system-health/clear-cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to clear cache');
    }

    const data = await response.json();

    showToast('Cache cleared successfully', 'success');
    // Refresh metrics after clearing cache
    setTimeout(() => refreshMetrics(), 1000);
  } catch (error) {
    console.error('Error clearing cache:', error);
    showToast('Failed to clear cache', 'error');
  }
}

function viewLogs() {
  // Navigate to logs page
  window.location.href = '/admin/other-pages/system-logs';
}

async function runDiagnostics() {
  try {
    showToast('Running system diagnostics...', 'info');

    const response = await fetch('/api/admin/system-health/run-diagnostics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to run diagnostics');
    }

    const data = await response.json();

    // Show results in modal
    showModal(
      'System Diagnostics Results',
      formatDiagnosticsResults(data.results)
    );
    showToast('System diagnostics completed', 'success');
  } catch (error) {
    console.error('Error running diagnostics:', error);
    showToast('Failed to run diagnostics', 'error');
  }
}

function formatHealthCheckResults(results) {
  let html = '<div class="space-y-4">';

  results.forEach((result) => {
    const statusClass =
      result.status === 'passed' ? 'text-green-600' : 'text-red-600';
    const statusIcon = result.status === 'passed' ? '✓' : '✗';

    html += `
      <div class="border border-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-medium">${result.check}</h4>
          <span class="font-medium ${statusClass}">${statusIcon} ${result.status}</span>
        </div>
        <p class="text-sm text-muted-foreground">${result.message}</p>
        ${result.details ? `<p class="text-xs text-muted-foreground mt-2">${result.details}</p>` : ''}
      </div>
    `;
  });

  html += '</div>';
  return html;
}

function formatDiagnosticsResults(results) {
  let html = '<div class="space-y-4">';

  results.forEach((result) => {
    const statusClass =
      result.status === 'passed'
        ? 'text-green-600'
        : result.status === 'warning'
          ? 'text-yellow-600'
          : 'text-red-600';
    const statusIcon =
      result.status === 'passed'
        ? '✓'
        : result.status === 'warning'
          ? '⚠'
          : '✗';

    html += `
      <div class="border border-border rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-medium">${result.test}</h4>
          <span class="font-medium ${statusClass}">${statusIcon} ${result.status}</span>
        </div>
        <p class="text-sm text-muted-foreground">${result.message}</p>
        ${result.duration ? `<p class="text-xs text-muted-foreground mt-2">Duration: ${result.duration}ms</p>` : ''}
      </div>
    `;
  });

  html += '</div>';
  return html;
}

function showModal(title, content) {
  // Create modal HTML
  const modalHtml = `
    <div id="system-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-border">
          <h3 class="text-lg font-semibold">${title}</h3>
          <button id="close-modal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          ${content}
        </div>
      </div>
    </div>
  `;

  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Add close functionality
  document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('system-modal').remove();
  });

  // Close on background click
  document.getElementById('system-modal').addEventListener('click', (e) => {
    if (e.target.id === 'system-modal') {
      document.getElementById('system-modal').remove();
    }
  });
}

function showLoadingState() {
  // Disable refresh button
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn) {
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Refresh
        `;
  }
}

function hideLoadingState() {
  // Remove loading indicators
  const cards = document.querySelectorAll('.bg-card');
  cards.forEach((card) => {
    card.classList.remove('opacity-50', 'pointer-events-none');
  });

  // Reset refresh button
  const refreshBtn = document.querySelector('button:has(.fa-refresh-cw)');
  if (refreshBtn) {
    refreshBtn.disabled = false;
    refreshBtn.innerHTML =
      '<i class="fas fa-refresh-cw mr-2"></i>Refresh Metrics';
  }
}

function showToast(message, type = 'info') {
  // Create toast notification
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-3 py-1.5 rounded text-sm font-medium z-50 border ${
    type === 'success'
      ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800'
      : type === 'error'
        ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
        : type === 'warning'
          ? 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800'
          : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800'
  }`;
  toast.textContent = message;

  document.body.appendChild(toast);

  // Remove after 2 seconds
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 2000);
}

// Chart initialization (if charts library is available)
function initializeCharts() {
  // This would initialize charts for historical data
  // Implementation depends on chart library (Chart.js, D3, etc.)
}

// WebSocket connection for real-time updates (optional)
function initializeWebSocket() {
  // Connect to WebSocket for real-time system monitoring
  // Implementation depends on backend WebSocket support
}
