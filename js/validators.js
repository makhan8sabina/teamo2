const Validators = {
  email: function (value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  },

  phone: function (value) {
    return /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/.test(value);
  },

  passwordProblem: function (value) {
    if (value.length === 0) return "Please enter a password.";
    if (value.length < 8) return "Password must be at least 8 characters long.";
    if (!/[a-z]/.test(value)) return "Add at least one lowercase letter.";
    if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter.";
    if (!/\d/.test(value)) return "Add at least one digit.";
    return "";
  }
};