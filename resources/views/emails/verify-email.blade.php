<!DOCTYPE html>
<html>

<head>
    <title>Verify Your Email</title>
</head>

<body>
    <h2>Hello, {{ $user->name }}</h2>
    <p>Thank you for registering. Click the button below to verify your email:</p>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" bgcolor="#28a745" style="border-radius: 4px;">
                <a href="{{ $verificationUrl }}" target="_blank"
                    style="font-size: 16px; color: #ffffff; text-decoration: none; padding: 12px 24px; display: inline-block;">
                    Verify Email
                </a>
            </td>
        </tr>
    </table>


    <p>If you did not create an account, no further action is required.</p>
</body>

</html>