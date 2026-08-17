export function validateLogin({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }
  return errors;
}

export function validateMfa({ code }) {
  const errors = {};

  if (!code.trim()) {
    errors.code = "Verification code is required";
  } else if (!/^\d{6}$/.test(code)) {
    errors.code = "Enter a 6-digit verification code";
  }
  return errors;
}

export function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}
