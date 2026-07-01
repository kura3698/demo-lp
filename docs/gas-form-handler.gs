/**
 * お問い合わせフォーム — Google Apps Script
 *
 * セットアップ:
 * 1. script.google.com で新規プロジェクトを作成
 * 2. このファイルの内容を Code.gs に貼り付け
 * 3. プロジェクト設定 → スクリプトプロパティ に以下を追加:
 *    RECAPTCHA_SECRET_KEY = （reCAPTCHA のシークレットキー）
 * 4. デプロイ → 新しいデプロイ → ウェブアプリ
 *    - 実行ユーザー: 自分
 *    - アクセス: 全員
 * 5. 発行された /exec URL を src/assets/js/parts/_form-config.js に設定
 * 6. コード更新後は「デプロイを管理」→ 新バージョンで再デプロイすること
 */

var ADMIN_EMAIL = "kura.ai.3698@gmail.com";
var RECAPTCHA_SCORE_THRESHOLD = 0.5;

var INQUIRY_LABELS = {
  reserve: "予約したい",
  question: "質問したい",
  other: "その他",
};

var ACTIVITY_LABELS = {
  balloon: "気球",
  horse: "乗馬",
  river: "川下り",
  ruins: "遺跡観光",
  nomad: "遊牧民体験・家訪問",
};

function doPost(e) {
  try {
    var data = parseRequestData(e);
    var secretKey = PropertiesService.getScriptProperties().getProperty(
      "RECAPTCHA_SECRET_KEY"
    );

    if (!secretKey) {
      return htmlPostMessageResponse({
        success: false,
        error: "Server configuration error",
      });
    }

    var recaptchaResult = verifyRecaptcha(secretKey, data.recaptchaToken);

    if (!recaptchaResult.success) {
      return htmlPostMessageResponse({
        success: false,
        error: "reCAPTCHA verification failed",
      });
    }

    if (recaptchaResult.score < RECAPTCHA_SCORE_THRESHOLD) {
      return htmlPostMessageResponse({
        success: false,
        error: "reCAPTCHA score too low",
      });
    }

    if (!data.name || !data.email) {
      return htmlPostMessageResponse({
        success: false,
        error: "Missing required fields",
      });
    }

    MailApp.sendEmail(
      ADMIN_EMAIL,
      "【お問い合わせ】" + data.name + " 様より",
      buildAdminBody(data)
    );

    MailApp.sendEmail(
      data.email,
      "【お問い合わせ】受付完了のお知らせ",
      buildAutoReplyBody(data)
    );

    return htmlPostMessageResponse({ success: true });
  } catch (error) {
    return htmlPostMessageResponse({ success: false, error: String(error) });
  }
}

function parseRequestData(e) {
  if (e.parameter && e.parameter.payload) {
    return JSON.parse(e.parameter.payload);
  }

  if (e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }

  throw new Error("Invalid request data");
}

function verifyRecaptcha(secretKey, token) {
  var url = "https://www.google.com/recaptcha/api/siteverify";
  var response = UrlFetchApp.fetch(url, {
    method: "post",
    payload: {
      secret: secretKey,
      response: token,
    },
    muteHttpExceptions: true,
  });
  return JSON.parse(response.getContentText());
}

function buildAdminBody(data) {
  var inquiryLabel =
    INQUIRY_LABELS[data.inquiryType] || data.inquiryType || "未選択";
  var activities = (data.activities || [])
    .map(function (value) {
      return ACTIVITY_LABELS[value] || value;
    })
    .join("、");
  if (!activities) activities = "未選択";

  var lines = [
    "お問い合わせフォームから送信がありました。",
    "",
    "■ お名前",
    data.name,
    "",
    "■ メールアドレス",
    data.email,
    "",
    "■ 電話番号",
    data.tel || "未入力",
    "",
    "■ お問い合わせ内容",
    inquiryLabel,
    "",
    "■ モンゴルでやってみたいこと",
    activities,
    "",
    "■ メッセージ本文",
    data.message || "未入力",
    "",
    "■ 送信日時",
    Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss"),
  ];

  return lines.join("\n");
}

function buildAutoReplyBody(data) {
  var lines = [
    data.name + " 様",
    "",
    "この度はお問い合わせいただき、誠にありがとうございます。",
    "以下の内容でお問い合わせを受け付けました。",
    "担当者より2営業日以内にご連絡いたします。",
    "",
    "お急ぎの場合は、お電話でもお問い合わせください。",
    "",
    "――――――――――――",
    "モンゴル遊牧民体験ツアー",
  ];

  return lines.join("\n");
}

function htmlPostMessageResponse(payload) {
  return HtmlService.createHtmlOutput(
    "<script>parent.postMessage(" +
      JSON.stringify(payload) +
      ', "*");</script>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
