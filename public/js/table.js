function toggleActionMenu(button) {
  const entity = button.getAttribute('data-entity');
  const id = button.getAttribute('data-id');

  if (!entity || !id) {
    console.error('Button missing data-entity or data-id attributes');
    return;
  }

  const menu = document.getElementById(`actionMenu-${entity}-${id}`);

  if (!menu) {
    console.error(`Dropdown not found: actionMenu-${entity}-${id}`);
    return;
  }

  const allMenus = document.querySelectorAll('[id^="actionMenu-"]');

  // Close all other menus
  allMenus.forEach(m => {
    if (m !== menu) {
      m.style.display = 'none';
    }
  });

  // Toggle current menu
  if (menu.style.display === 'none' || menu.style.display === '') {
    // Position the menu next to the button first
    const rect = button.getBoundingClientRect();

    // Set position and make visible temporarily to get dimensions
    menu.style.position = 'fixed';
    menu.style.zIndex = '9999';
    menu.style.display = 'block';
    menu.style.visibility = 'hidden';
    menu.style.top = '0px';
    menu.style.left = '0px';

    // Get dimensions after it's in the DOM
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    // Calculate position: prefer below and to the right of button
    let top = rect.bottom + window.scrollY + 5;
    let left = rect.right + window.scrollX - menuWidth;

    // If it would go off-screen to the left, position to the right of button
    if (left < 0) {
      left = rect.right + window.scrollX;
    }

    // If it would go off-screen to the bottom, position above button
    if (top + menuHeight > window.scrollY + window.innerHeight) {
      top = rect.top + window.scrollY - menuHeight - 5;
    }

    // If it would still go off-screen to the top, position below
    if (top < 0) {
      top = rect.bottom + window.scrollY + 5;
    }

    // Apply final position
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.visibility = 'visible';


  } else {
    menu.style.display = 'none';
  }
}

