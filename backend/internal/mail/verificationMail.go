package mail

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"gopkg.in/gomail.v2"
)


func SendCode(to string, otp string) error {

	fmt.Println(to)

	m := gomail.NewMessage()
	from_email := os.Getenv("MAIL_FROM_ADDRESS")
	app_name := os.Getenv("MAIL_FROM_NAME")
	password := os.Getenv("MAIL_PASSWORD")
	port := os.Getenv("MAIL_PORT")
	host := os.Getenv("MAIL_HOST")
	mail_port, _ := strconv.Atoi(port)

	if from_email == "" || password == "" || port == "" || host == "" || app_name == "" {
		fmt.Printf("MAIL_FROM_ADDRESS, MAIL_PORT, MAIL_HOST, MAIL_FROM_NAME or MAIL_PASSWORD not set in environment")
	}

	htmlTemplate := `
		<body style="font-family:Arial,sans-serif;background:#f4f4f7;padding:20px;">
			<div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
				<h1 style="color:#4a90e2;font-size:24px;margin-bottom:20px;">Verify Your Email</h1>
				<p style="font-size:16px;line-height:1.5;margin-bottom:20px;">
					Hello! Use the verification code below to complete your registration for My To-Do App.
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

	//format address so as to display both in mail 
	m.SetHeader("From", m.FormatAddress(from_email, app_name))
	m.SetHeader("To", to)
	m.SetHeader("Subject", "Verification OTP")
	m.SetBody("text/html", htmlBody)

	// Add attachments (uncomment to use)
    // m.Attach("./document.pdf")
    // m.Attach("./http_status_codes_guide.pdf")

    d := gomail.NewDialer(host, mail_port, from_email, password)
    // Send the email
    if err := d.DialAndSend(m); err != nil {
        return fmt.Errorf("failed to send email: %v", err)
    }
    return nil

}