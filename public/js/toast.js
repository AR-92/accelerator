class Toast {
  constructor(options = {}) {
    this.type = options.type || "default";
    this.title = options.title || "";
    this.message = options.message || "";
    this.icon = options.icon || this.getDefaultIcon();
    this.duration = options.duration || 5000;
    this.position = options.position || "top-right";
    this.element = null;
    this.timeout = null;
  }

  getDefaultIcon() {
    switch (this.type) {
      case "success":
        return "check-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "alert-triangle";
      case "info":
        return "info";
      default:
        return "";
    }
  }

  create() {
    const toast = document.createElement("div");
    toast.className = `toast toast-${this.type} absolute z-50 p-4 rounded-lg border shadow-lg w-full`;
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease-out";
    toast.style.position = "absolute";
    toast.style.right = "0";
    toast.style.maxWidth = "400px";

    // Theme-friendly classes
    toast.classList.add(
      "bg-base-100/95",
      "text-neutral-DEFAULT",
      "border-neutral-border/50",
      "shadow-lg",
      "backdrop-blur-sm",
    );

    let content = `<div class="flex items-start gap-3">`;

    // Icon with proper colors
    if (this.icon) {
      const iconColor = this.getIconColor();
      content += `<div class="flex-shrink-0 mt-0.5">`;
      content += `<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`;

      // Add specific icon paths
      switch (this.icon) {
        case "check-circle":
          content += `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>`;
          break;
        case "alert-circle":
          content += `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>`;
          break;
        case "alert-triangle":
          content += `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`;
          break;
        case "info":
          content += `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`;
          break;
        default:
          content += `<circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>`;
      }

      content += `</svg>`;
      content += `</div>`;
    }

    content += `<div class="flex-1 space-y-1">`;

    if (this.title) {
      content += `<div class="font-semibold text-sm leading-none tracking-tight">${this.title}</div>`;
    }

    if (this.message) {
      content += `<div class="text-sm opacity-90 leading-relaxed">${this.message}</div>`;
    }

    content += `</div>`;

    // Close button with shadcn/ui styling
    content += `<button class="toast-close flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity rounded-sm p-1 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" aria-label="Close">`;
    content += `<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`;
    content += `<path d="M18 6L6 18"/><path d="M6 6l12 12"/>`;
    content += `</svg>`;
    content += `</button>`;

    content += `</div>`;

    toast.innerHTML = content;

    // Add close functionality
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => this.hide());

    // Add type-specific classes
    switch (this.type) {
      case "success":
        toast.classList.add("bg-success/10", "border-success");
        break;
      case "error":
        toast.classList.add("bg-error/10", "border-error");
        break;
      case "warning":
        toast.classList.add("bg-warning/10", "border-warning");
        break;
      case "info":
        toast.classList.add("bg-info/10", "border-info");
        break;
      default:
        toast.classList.add("bg-base-100/95", "border-neutral-border/50");
    }

    this.element = toast;
    return toast;
  }

  getIconColor() {
    switch (this.type) {
      case "success":
        return "#16a34a"; // green-600
      case "error":
        return "#dc2626"; // red-600
      case "warning":
        return "#d97706"; // yellow-600
      case "info":
        return "#2563eb"; // blue-600
      default:
        return "#6b7280"; // gray-500
    }
  }

  show() {
    if (!this.element) {
      this.create();
    }

    // Animate in
    setTimeout(() => {
      this.element.style.opacity = "1";
      this.element.style.transform = "translateX(0)";
    }, 10);

    // Auto hide after 4 seconds
    this.timeout = setTimeout(() => {
      this.hide();
    }, 4000);

    return this;
  }

  hide() {
    if (!this.element) return;

    this.element.style.opacity = "0";
    this.element.style.transform = "translateX(100%)";

    setTimeout(() => {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }, 300);

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    return this;
  }
}

// Toast container for managing multiple toasts
class ToastContainer {
  constructor() {
    this.toasts = [];
    this.container = null;
  }

  createContainer() {
    if (this.container) return this.container;

    // Try to use existing container first
    this.container = document.getElementById("toast-container");
    if (!this.container) {
      // Create new container if it doesn't exist
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      this.container.style.position = "fixed";
      this.container.style.top = "5rem";
      this.container.style.right = "27rem";
      this.container.style.zIndex = "9999";
      this.container.style.width = "400px";
      this.container.style.height = "auto";
      this.container.style.pointerEvents = "none";
      this.container.id = "toast-container";
      document.body.appendChild(this.container);
    } else {
      // Ensure existing container has proper styling
      this.container.style.position = "fixed";
      this.container.style.top = "5rem";
      this.container.style.right = "27rem";
      this.container.style.zIndex = "9999";
      this.container.style.width = "400px";
      this.container.style.height = "auto";
      this.container.style.pointerEvents = "none";
    }
    return this.container;
  }

  show(options) {
    const toast = new Toast(options);
    this.toasts.push(toast);

    if (!this.container) {
      this.createContainer();
    }

    const toastElement = toast.create();
    toastElement.classList.add("pointer-events-auto");

    // Position the toast vertically based on existing toasts
    const existingToasts = this.container.children.length;
    toastElement.style.top = `${existingToasts * 80}px`; // 80px per toast (adjust as needed)

    this.container.appendChild(toastElement);

    // Show the toast (this handles animation and auto-hide)
    toast.show();

    return toast;
  }

  hide(toast) {
    if (!toast.element) return;

    // Animate out
    toast.element.style.opacity = "0";
    toast.element.style.transform = "translateX(100%)";

    setTimeout(() => {
      if (toast.element && toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element);
      }
      this.toasts = this.toasts.filter((t) => t !== toast);

      // Reposition remaining toasts
      const remainingToasts = this.container.children;
      for (let i = 0; i < remainingToasts.length; i++) {
        remainingToasts[i].style.top = `${i * 80}px`;
      }
    }, 300);

    if (toast.timeout) {
      clearTimeout(toast.timeout);
      toast.timeout = null;
    }
  }

  clear() {
    this.toasts.forEach((toast) => this.hide(toast));
  }
}

// Global toast instance
const toastContainer = new ToastContainer();

// Convenience functions with shadcn/ui styling
window.showToast = (message, type = "info") => {
  // Support both old format (message, type) and new format (options)
  if (typeof message === "object") {
    return toastContainer.show(message);
  }

  // Convert old format to new format
  const title =
    type === "success"
      ? "Success"
      : type === "error"
        ? "Error"
        : type === "warning"
          ? "Warning"
          : type === "info"
            ? "Info"
            : "Notification";

  return toastContainer.show({
    type,
    title,
    message,
    duration: type === "error" ? 6000 : 4000, // Errors show longer
  });
};

window.showSuccessToast = (title, message) =>
  toastContainer.show({
    type: "success",
    title: title || "Success",
    message,
    duration: 4000,
  });

window.showErrorToast = (title, message) =>
  toastContainer.show({
    type: "error",
    title: title || "Error",
    message,
    duration: 6000, // Keep errors visible longer
  });

window.showWarningToast = (title, message) =>
  toastContainer.show({
    type: "warning",
    title: title || "Warning",
    message,
    duration: 4000,
  });

window.showInfoToast = (title, message) =>
  toastContainer.show({
    type: "info",
    title: title || "Info",
    message,
    duration: 4000,
  });
