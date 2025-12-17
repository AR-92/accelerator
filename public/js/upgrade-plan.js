// Upgrade Plan JavaScript
function upgradePlan(packageId, billingType) {
  // Create form and submit
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/upgrade-package";

  const packageInput = document.createElement("input");
  packageInput.type = "hidden";
  packageInput.name = "package_type";
  packageInput.value = packageId;

  const billingInput = document.createElement("input");
  billingInput.type = "hidden";
  billingInput.name = "billing_type";
  billingInput.value = billingType;

  form.appendChild(packageInput);
  form.appendChild(billingInput);
  document.body.appendChild(form);
  form.submit();
}

function contactSales() {
  // Show contact sales modal or redirect
  if (typeof showToast === "function") {
    showToast("Contacting sales team...", "info");
  }
  // For now, just show a message
  alert("Please contact sales@accelerator.com for enterprise pricing");
}

function cancelSubscription() {
  if (
    confirm(
      "Are you sure you want to cancel your subscription? You will lose access to premium features.",
    )
  ) {
    // Create form and submit
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/cancel-subscription";

    document.body.appendChild(form);
    form.submit();
  }
}
