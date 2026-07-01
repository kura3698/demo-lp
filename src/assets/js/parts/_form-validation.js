import { FORM_SUBMIT_URL } from "./_form-config.js";
import { getRecaptchaToken } from "./_recaptcha.js";

const INQUIRY_LABELS = {
  reserve: "予約したい",
  question: "質問したい",
  other: "その他",
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".js-form");
  if (!form) return;

  const recaptchaErrorEl = document.getElementById("form-recaptcha-error");
  const recaptchaTokenEl = document.getElementById("form-recaptcha-token");
  const submitBtn = form.querySelector('[type="submit"]');
  const submitBtnText = submitBtn?.querySelector(".c-button__text");
  const successModal = document.getElementById("form-success-modal");
  const defaultSubmitLabel = submitBtnText?.textContent ?? "送信する";

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

  const showRecaptchaError = (message) => {
    if (!recaptchaErrorEl) return;
    recaptchaErrorEl.textContent = message;
    recaptchaErrorEl.removeAttribute("hidden");
  };

  const clearRecaptchaError = () => {
    if (!recaptchaErrorEl) return;
    recaptchaErrorEl.textContent = "";
    recaptchaErrorEl.setAttribute("hidden", "");
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

  const setSubmitting = (isSubmitting) => {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    if (submitBtnText) {
      submitBtnText.textContent = isSubmitting ? "送信中…" : defaultSubmitLabel;
    }
  };

  const backgroundFix = (bool) => {
    const scrollingElement = () => {
      if ("scrollingElement" in document) return document.scrollingElement;
      return document.documentElement;
    };

    const scrollY = bool
      ? scrollingElement().scrollTop
      : parseInt(document.body.style.top || "0", 10);

    const fixedStyles = {
      height: "100vh",
      position: "fixed",
      top: `${scrollY * -1}px`,
      left: "0",
      width: "100vw",
    };

    Object.keys(fixedStyles).forEach((key) => {
      document.body.style[key] = bool ? fixedStyles[key] : "";
    });

    if (!bool) {
      window.scrollTo(0, scrollY * -1);
    }
  };

  const openSuccessModal = () => {
    if (!successModal || successModal.tagName !== "DIALOG") return;

    backgroundFix(true);
    successModal.showModal();

    const closeBtn = successModal.querySelector("[data-modal-close]");
    closeBtn?.focus({ preventScroll: true });
  };

  const collectFormData = () => {
    const formData = new FormData(form);
    const inquiryType = formData.get("inquiry_type")?.toString() ?? "";
    const activities = formData
      .getAll("activities[]")
      .map((value) => value.toString());

    return {
      name: formData.get("name")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      tel: formData.get("tel")?.toString().trim() ?? "",
      inquiryType,
      inquiryLabel: INQUIRY_LABELS[inquiryType] ?? inquiryType,
      activities,
      message: formData.get("message")?.toString().trim() ?? "",
    };
  };

  const submitToGas = async (payload) => {
    await fetch(FORM_SUBMIT_URL, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams({ payload: JSON.stringify(payload) }),
    });
  };

  if (successModal) {
    successModal.querySelectorAll("[data-modal-close]").forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        successModal.close();
      });
    });

    successModal.addEventListener("click", (event) => {
      if (event.target === successModal) {
        successModal.close();
      }
    });

    successModal.addEventListener("close", () => {
      backgroundFix(false);
      submitBtn?.focus({ preventScroll: true });
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    clearRecaptchaError();
    setSubmitting(true);

    try {
      const recaptchaToken = await getRecaptchaToken("contact");
      if (recaptchaTokenEl) {
        recaptchaTokenEl.value = recaptchaToken;
      }

      const payload = {
        ...collectFormData(),
        recaptchaToken,
      };

      await submitToGas(payload);

      form.reset();
      openSuccessModal();
    } catch {
      showRecaptchaError(
        "送信に失敗しました。時間をおいて再度お試しください。",
      );
    } finally {
      setSubmitting(false);
    }
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
