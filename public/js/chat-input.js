// Chat input functionality
document.addEventListener('DOMContentLoaded', function() {
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');

  // Enable/disable send button based on input
  messageInput.addEventListener('input', function() {
    sendButton.disabled = !this.value.trim();
  });

  // Handle form submission
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (messageInput.value.trim()) {
      // Here you would typically send the message to your backend
      // For now, we'll just log it and clear the input
      console.log('Sending message:', messageInput.value);

      // Clear the input after sending
      messageInput.value = '';
      sendButton.disabled = true;

      // In a real app, you would call your API here
      // sendMessageToBackend(messageInput.value);
    }
  });

  // Handle Enter key (submit) and Shift+Enter (new line)
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendButton.disabled) {
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Attachment button functionality
  const attachmentBtn = document.querySelector('[aria-label="Attach file"]');
  attachmentBtn.addEventListener('click', function(e) {
    e.preventDefault();

    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*,application/pdf,text/plain,.doc,.docx';

    fileInput.onchange = function(event) {
      const files = event.target.files;
      if (files.length > 0) {
        // Process selected files
        Array.from(files).forEach(file => {
          console.log('Selected file:', file.name, file.size, file.type);
          // In a real app: upload files to server or process them
        });

        // Show a temporary message about the attachments
        // (in a real app, you'd show previews of the attached files)
        const attachmentPreview = document.createElement('div');
        attachmentPreview.className = 'text-xs text-muted-foreground mt-1';
        attachmentPreview.textContent = `Attached: ${files.length} file(s)`;
        attachmentPreview.id = 'attachment-preview';

        const formContainer = chatForm.parentElement;
        const existingPreview = formContainer.querySelector('#attachment-preview');
        if (existingPreview) {
          existingPreview.remove();
        }
        formContainer.insertBefore(attachmentPreview, chatForm.nextSibling);

        // Remove preview after sending
        chatForm.addEventListener('submit', function() {
          setTimeout(() => {
            const preview = document.querySelector('#attachment-preview');
            if (preview) preview.remove();
          }, 100);
        });
      }
    };

    fileInput.click();
  });
});

// Function to send message to backend (example)
function sendMessageToBackend(message) {
  // Example API call
  /*
  fetch('/api/chat/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Message sent:', data);
    // Handle response
  })
  .catch(error => {
    console.error('Error sending message:', error);
  });
  */
}