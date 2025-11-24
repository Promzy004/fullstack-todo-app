package mail

import (
    "bytes"
    "crypto/tls"
    "encoding/json"
    "fmt"
    "net/http"
    "os"
    "strconv"
    "strings"

    "gopkg.in/gomail.v2"
)

// SendCode sends a verification OTP email
func SendCode(to string, otp string) error {
    if os.Getenv("RAILWAY_ENVIRONMENT") != "" {
        return sendViaBrevoAPI(to, otp)
    }
    return sendViaSMTP(to, otp)
}

// ---------------- Gmail SMTP (local) ----------------
func sendViaSMTP(to, otp string) error {
    m := gomail.NewMessage()

    fromEmail := os.Getenv("MAIL_FROM_ADDRESS")
    appName := os.Getenv("MAIL_FROM_NAME")
    username := os.Getenv("MAIL_USERNAME")
    password := os.Getenv("MAIL_PASSWORD")
    host := os.Getenv("MAIL_HOST")
    portStr := os.Getenv("MAIL_PORT")
    port, _ := strconv.Atoi(portStr)

    htmlTemplate := `
    <body style="font-family:Arial,sans-serif;background:#f4f4f7;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <h1 style="color:#4a90e2;font-size:24px;margin-bottom:20px;">Verify Your Email</h1>
            <p style="font-size:16px;line-height:1.5;margin-bottom:20px;">
                Hello! Use the verification code below to complete your verification for My To-Do App.
            </p>
            <div style="font-size:24px;font-weight:bold;padding:15px 0;text-align:center;background:#f4f4f7;border-radius:6px;letter-spacing:4px;">
                {{OTP_CODE}}
            </div>
            <p style="font-size:14px;color:#888;margin-top:30px;">
                If you did not request this, please ignore this email.
            </p>
        </div>
    </body>
    `
    htmlBody := strings.ReplaceAll(htmlTemplate, "{{OTP_CODE}}", otp)

    m.SetHeader("From", m.FormatAddress(fromEmail, appName))
    m.SetHeader("To", to)
    m.SetHeader("Subject", "Verification OTP")
    m.SetBody("text/html", htmlBody)

    dialer := gomail.NewDialer(host, port, username, password)
    dialer.TLSConfig = &tls.Config{InsecureSkipVerify: false}

    if err := dialer.DialAndSend(m); err != nil {
        return fmt.Errorf("failed to send email via SMTP: %v", err)
    }
    return nil
}

// ---------------- Brevo API ----------------
func sendViaBrevoAPI(to, otp string) error {
    apiKey := os.Getenv("BREVO_API_KEY")
    if apiKey == "" {
        return fmt.Errorf("BREVO_API_KEY not set")
    }

    senderName := os.Getenv("BREVO_FROM_NAME")
    senderEmail := os.Getenv("BREVO_FROM_ADDRESS")

    htmlContent := fmt.Sprintf(`
        <body style="font-family:Arial,sans-serif;background:#f4f4f7;padding:20px;">
			<div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
				<h1 style="color:#4a90e2;font-size:24px;margin-bottom:20px;">Verify Your Email</h1>
				<p style="font-size:16px;line-height:1.5;margin-bottom:20px;">
					Hello! Use the verification code below to complete your verification for My To-Do App.
				</p>
				<div style="font-size:24px;font-weight:bold;padding:15px 0;text-align:center;background:#f4f4f7;border-radius:6px;letter-spacing:4px;">
					%s
				</div>
				<p style="font-size:14px;color:#888;margin-top:30px;">
					If you did not request this, please ignore this email.
				</p>
			</div>
		</body>`, otp)

    payload := map[string]interface{}{
        "sender": map[string]string{
            "name":  senderName,
            "email": senderEmail,
        },
        "to": []map[string]string{
            {"email": to},
        },
        "subject":     "Verification OTP",
        "htmlContent": htmlContent,
    }

    body, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(body))
    req.Header.Set("api-key", apiKey)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return fmt.Errorf("failed to send email via Brevo API: %v", err)
    }
    defer resp.Body.Close()

    if resp.StatusCode >= 400 {
        return fmt.Errorf("brevo API returned status: %s", resp.Status)
    }

    return nil
}