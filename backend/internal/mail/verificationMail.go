package mail

import (
    "fmt"
    "os"
    "strings"

    "github.com/resend/resend-go/v2"
)

func SendCode(to string, otp string) error {
    client := resend.NewClient(os.Getenv("RESEND_API_KEY"))

    appName := os.Getenv("MAIL_FROM_NAME")
    if appName == "" {
        appName = "My App"
    }

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

    // Use Resend default sender → NO DOMAIN VERIFICATION NEEDED
    from := fmt.Sprintf("%s <onboarding@resend.dev>", appName)

    params := &resend.SendEmailRequest{
        From:    from,
        To:      []string{to},
        Subject: "Verification OTP",
        Html:    htmlBody,
    }

    _, err := client.Emails.Send(params)
    if err != nil {
        return fmt.Errorf("failed to send email: %v", err)
    }

    return nil
}
