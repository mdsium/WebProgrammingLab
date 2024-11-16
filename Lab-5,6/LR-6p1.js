function getNameValues() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    document.getElementById('output').textContent = `First Name: ${firstName} , Last Name: ${lastName} Full Name: ${firstName} ${lastName}`;
  }
  document.getElementById('submitButton').addEventListener('click', getNameValues);
  