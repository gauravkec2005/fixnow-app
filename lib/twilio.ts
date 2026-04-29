import twilio from "twilio";

// ❗ Validate environment variables early (prevents runtime crashes)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !phoneNumber) {
  throw new Error(
    "Missing Twilio environment variables. Check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env.local"
  );
}

// Twilio client
export const twilioClient = twilio(accountSid, authToken);

// Export sender number for reuse in APIs
export const TWILIO_FROM_NUMBER = phoneNumber;