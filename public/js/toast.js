class Toast {
  constructor(options = {}) {
    this.type = options.type || "default";
    this.title = options.title || "";
    this.message = options.message || "";
    this.icon = options.icon || "";
    this.duration = options.duration || 5000;
    this.position = options.position || "top-right";
    this.element = null;
    this.timeout = null;
  }

  create() {
    const toast = document.createElement("div");
    toast.className = `toast toast-${this.type} fixed z-50 p-4 rounded-lg border shadow-lg max-w-sm w-full bg-card text-card-foreground border-border`;

    // Position classes
    const positionClasses = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 transform -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    };
    toast.classList.add(...positionClasses[this.position].split(" "));

    let content = "";

    if (this.icon) {
      content += `<div class="flex items-start gap-3">`;
      content += `<svg class="lucide lucide-${this.icon} w-5 h-5 text-current mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>`;
      content += `<div class="flex-1">`;
    } else {
      content += `<div>`;
    }

    if (this.title) {
      content += `<div class="font-medium text-sm">${this.title}</div>`;
    }

    if (this.message) {
      content += `<div class="text-sm text-muted-foreground mt-1">${this.message}</div>`;
    }

    content += `</div>`;

    if (this.icon) {
      content += `</div>`;
    }

    // Close button
    content += `<button class="toast-close absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
      <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6L6 18"></path>
        <path d="M6 6l12 12"></path>
      </svg>
    </button>`;

    toast.innerHTML = content;

    // Add close functionality
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => this.hide());

    // Add type-specific styling
    if (this.type === "success") {
      toast.classList.add("border-green-200", "bg-green-50", "text-green-800");
    } else if (this.type === "error") {
      toast.classList.add("border-red-200", "bg-red-50", "text-red-800");
    } else if (this.type === "warning") {
      toast.classList.add(
        "border-yellow-200",
        "bg-yellow-50",
        "text-yellow-800",
      );
    } else if (this.type === "info") {
      toast.classList.add("border-blue-200", "bg-blue-50", "text-blue-800");
    }

    this.element = toast;
    return toast;
  }

  show() {
    if (!this.element) {
      this.create();
    }

    document.body.appendChild(this.element);

    // Animate in
    setTimeout(() => {
      this.element.classList.add("opacity-100", "translate-y-0");
    }, 10);

    // Auto hide
    if (this.duration > 0) {
      this.timeout = setTimeout(() => {
        this.hide();
      }, this.duration);
    }

    return this;
  }

  hide() {
    if (!this.element) return;

    this.element.classList.remove("opacity-100", "translate-y-0");
    this.element.classList.add("opacity-0", "translate-y-2");

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

    this.container = document.createElement("div");
    this.container.className =
      "toast-container fixed top-4 right-4 z-50 space-y-2";
    this.container.id = "toast-container";
    document.body.appendChild(this.container);
    return this.container;
  }

  show(options) {
    const toast = new Toast(options);
    this.toasts.push(toast);

    if (!this.container) {
      this.createContainer();
    }

    const toastElement = toast.create();
    this.container.appendChild(toastElement);

    // Animate in
    setTimeout(() => {
      toastElement.classList.add("opacity-100", "translate-x-0");
    }, 10);

    // Auto hide
    if (toast.duration > 0) {
      toast.timeout = setTimeout(() => {
        this.hide(toast);
      }, toast.duration);
    }

    return toast;
  }

  hide(toast) {
    if (!toast.element) return;

    toast.element.classList.remove("opacity-100", "translate-x-0");
    toast.element.classList.add("opacity-0", "translate-x-full");

    setTimeout(() => {
      if (toast.element && toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element);
      }
      this.toasts = this.toasts.filter((t) => t !== toast);
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

// Convenience functions
window.showToast = (options) => toastContainer.show(options);
window.showSuccessToast = (title, message) =>
  toastContainer.show({
    type: "success",
    title,
    message,
    icon: "check-circle",
  });
window.showErrorToast = (title, message) =>
  toastContainer.show({ type: "error", title, message, icon: "alert-circle" });
window.showWarningToast = (title, message) =>
  toastContainer.show({
    type: "warning",
    title,
    message,
    icon: "alert-triangle",
  });
window.showInfoToast = (title, message) =>
  toastContainer.show({ type: "info", title, message, icon: "info" });
