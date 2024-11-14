const palindromeChecker = {
    isPalindrome: function (str) {
      const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const reversedStr = cleanedStr.split('').reverse().join('');
      return cleanedStr === reversedStr;
    },
  };
  document.getElementById('checkPalindrome').addEventListener('click', function () {
    const inputString = document.getElementById('inputString').value;
    const result = palindromeChecker.isPalindrome(inputString);
    document.getElementById('result').textContent = result ? `"${inputString}" is a palindrome!` : `"${inputString}" is not a palindrome.`;
  });
  

