// backend/services/aiService.js
// Rule-based AI service (easily swappable with LLM later)

export async function triageAndAnswer({ subject = "", description = "" }) {
  const text = `${subject}\n${description}`.toLowerCase();

  // --- Category detection ---
  let category = "general";
  if (/\bpassword|login|signin|signup|reset\b/.test(text)) category = "account";
  else if (/\bbill|payment|invoice|refund|charge\b/.test(text)) category = "billing";
  else if (/\berror|bug|crash|issue|not working|slow|timeout|app\b/.test(text)) category = "technical";

  // --- Defaults ---
  let suggestedReply = null;
  let confidence = 0.5;
  let autoResolved = false;

  // --- Account / Login / Signup issues ---
  if (category === "account") {
    if (/\bpassword|reset|forgot password\b/.test(text)) {
      suggestedReply =
        "It looks like a password issue. Please reset it from the login page by clicking 'Forgot Password'. If you didn’t receive an email, check spam and try again after 5 minutes.";
      confidence = 0.9;
      autoResolved = true;
    } else if (/\blogin|signin failed|not able to login\b/.test(text)) {
      suggestedReply =
        "It looks like a login issue. Try resetting your password, clearing cookies, or using another browser. If it still doesn’t work, contact support with your email ID.";
      confidence = 0.85;
      autoResolved = true;
    } else if (/\bsignup|register|create account\b/.test(text)) {
      suggestedReply =
        "Having trouble signing up? Please ensure your email is valid and not already in use. Try again with a different browser or device. If the issue persists, contact support.";
      confidence = 0.85;
      autoResolved = true;
    }
  }

  // --- Billing / Refund issues ---
  else if (category === "billing") {
    if (/\brefund|charged|double|payment failed\b/.test(text)) {
      suggestedReply =
        "I see you’re facing a billing concern. Refunds or duplicate charges usually reverse within 5–7 business days. Please confirm your order ID and payment details.";
      confidence = 0.85;
      autoResolved = true;
    } else if (/\binvoice|bill not received\b/.test(text)) {
      suggestedReply =
        "If you didn’t receive your invoice, please check your spam folder. You can also download invoices from the billing section of your account.";
      confidence = 0.8;
      autoResolved = true;
    }
  }

  // --- Technical / App issues ---
  else if (category === "technical") {
    if (/\bcrash|app (crash|stopped)|site down|not loading|freeze\b/.test(text)) {
      suggestedReply =
        "It looks like the app/website is crashing. Please try reinstalling the app or clearing browser cache. If it continues, provide device/OS details so we can investigate.";
      confidence = 0.85;
      autoResolved = true;
    } else if (/\berror|bug|timeout|slow\b/.test(text)) {
      suggestedReply =
        "Thanks for reporting the issue. Try clearing cache/cookies and restarting. If it persists, please share your browser, OS, and a screenshot so we can help.";
      confidence = 0.75;
    }
  }

  // --- Fallback ---
  if (!suggestedReply) {
    suggestedReply =
      "Thanks for reaching out. We’ve received your request and will get back to you shortly.";
    confidence = 0.5;
  }

  return { category, suggestedReply, confidence, autoResolved };
}
