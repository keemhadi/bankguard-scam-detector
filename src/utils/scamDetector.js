export function analyseMessage(message) {
  const text = message.toLowerCase();

  let score = 0;
  let reasons = [];

  const urgentWords = [
  "urgent",
  "immediately",
  "within 24 hours",
  "limited time",
  "act fast",
  "verify now",
  "click now",
];

  const threatWords = [
    "account blocked",
    "account suspended",
    "account locked",
    "unauthorized transaction",
    "security alert",
    "your account will be closed",
  ];

  const sensitiveWords = [
    "otp",
    "tac",
    "password",
    "pin",
    "card number",
    "cvv",
    "login details",
  ];

  const suspiciousLinkWords = [
    "http://",
    "https://",
    "bit.ly",
    "tinyurl",
    ".xyz",
    ".top",
  ];

  const rewardWords = [
    "you won",
    "cash prize",
    "reward",
    "free gift",
    "claim now",
  ];

  urgentWords.forEach((word) => {
    if (text.includes(word)) {
      score += 1;
      reasons.push("Uses urgent language to pressure the user.");
    }
  });

  threatWords.forEach((word) => {
    if (text.includes(word)) {
      score += 2;
      reasons.push("Mentions account threats or suspicious banking alerts.");
    }
  });

  sensitiveWords.forEach((word) => {
    if (text.includes(word)) {
      score += 3;
      reasons.push("Requests sensitive banking information.");
    }
  });

  suspiciousLinkWords.forEach((word) => {
    if (text.includes(word)) {
      score += 2;
      reasons.push("Contains a link that may lead to a fake banking website.");
    }
  });

  rewardWords.forEach((word) => {
    if (text.includes(word)) {
      score += 1;
      reasons.push("Uses reward or prize language commonly seen in scams.");
    }
  });

  const uniqueReasons = [...new Set(reasons)];

  let riskLevel = "Low";
  let advice = "No strong scam indicators were found. Still, verify using official banking channels if unsure.";

  if (score >= 3 && score < 6) {
    riskLevel = "Medium";
    advice = "Be careful. Do not click unknown links or share personal banking information.";
  }

  if (score >= 6) {
    riskLevel = "High";
    advice = "This message is highly suspicious. Do not click the link, do not share OTP/TAC/password, and contact the bank using official channels.";
  }

  return {
    score,
    riskLevel,
    reasons: uniqueReasons.length > 0 ? uniqueReasons : ["No obvious scam pattern detected."],
    advice,
  };
}