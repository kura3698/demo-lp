export const RECAPTCHA_SITE_KEY = "YOUR_SITE_KEY";

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
