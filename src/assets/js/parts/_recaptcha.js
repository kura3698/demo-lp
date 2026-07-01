export const RECAPTCHA_SITE_KEY = "6LfK2i4tAAAAAAPUzODsanEvT4ON5B3c8Xzkr7lp";

export function getRecaptchaToken(action = "contact") {
  return new Promise((resolve, reject) => {
    if (typeof grecaptcha === "undefined") {
      reject(new Error("reCAPTCHA not loaded"));
      return;
    }
    grecaptcha.ready(() => {
      grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}
