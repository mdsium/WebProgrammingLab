function countDropdownItems() {
    const dropdown = document.getElementById('dropdown');
    const itemCount = dropdown.options.length;
    let message = `The dropdown contains ${itemCount} items:\n`;
    for (let i = 0; i < itemCount; i++) {
      message += `- ${dropdown.options[i].text}\n`;
    }
    alert(message);
  }
  document.getElementById('countButton').addEventListener('click', countDropdownItems);