document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".js-form");
  if (!form) return;

  const successEl = document.getElementById("form-success");
  const submitBtn = form.querySelector('[type="submit"]');

  const fields = {
    name: {
      input: form.querySelector("#form-name"),
      error: document.getElementById("form-name-error"),
      validate(value) {
        if (!value.trim()) {
          return "お名前を入力してください";
        }
        return "";
      },
    },
    email: {
      input: form.querySelector("#form-email"),
      error: document.getElementById("form-email-error"),
      validate(value) {
        const trimmed = value.trim();
        if (!trimmed) {
          return "メールアドレスを入力してください";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          return "正しいメールアドレスを入力してください";
        }
        return "";
      },
    },
    tel: {
      input: form.querySelector("#form-tel"),
      error: document.getElementById("form-tel-error"),
      validate(value) {
        const trimmed = value.trim();
        if (!trimmed) return "";
        const digits = trimmed.replace(/\D/g, "");
        if (digits.length < 10 || digits.length > 11) {
          return "正しい電話番号を入力してください";
        }
        return "";
      },
    },
  };

  const getGroup = (input) => input?.closest(".c-form__group");

  const showError = (field, message) => {
    const { input, error } = field;
    if (!input || !error) return;

    const group = getGroup(input);
    group?.classList.add("is-error");
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id);
    error.textContent = message;
    error.removeAttribute("hidden");
  };

  const clearError = (field) => {
    const { input, error } = field;
    if (!input || !error) return;

    const group = getGroup(input);
    group?.classList.remove("is-error");
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
    error.textContent = "";
    error.setAttribute("hidden", "");
  };

  const validateField = (field) => {
    const message = field.validate(field.input.value);
    if (message) {
      showError(field, message);
      return false;
    }
    clearError(field);
    return true;
  };

  const validateForm = () => {
    let isValid = true;
    let firstInvalidInput = null;

    Object.values(fields).forEach((field) => {
      if (!field.input) return;
      const fieldValid = validateField(field);
      if (!fieldValid) {
        isValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = field.input;
        }
      }
    });

    if (firstInvalidInput) {
      firstInvalidInput.focus();
      firstInvalidInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return isValid;
  };

  const showSuccess = () => {
    if (successEl) {
      successEl.removeAttribute("hidden");
    }
    if (submitBtn) {
      submitBtn.disabled = true;
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    showSuccess();
  });

  ["name", "email", "tel"].forEach((key) => {
    const field = fields[key];
    if (!field.input) return;

    field.input.addEventListener("blur", () => {
      validateField(field);
    });

    field.input.addEventListener("input", () => {
      if (field.input.getAttribute("aria-invalid") === "true") {
        validateField(field);
      }
    });
  });
});
