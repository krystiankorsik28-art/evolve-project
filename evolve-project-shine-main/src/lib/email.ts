// Email service — premium HTML templates + sending utility
// Ready for Resend / SendGrid / SMTP — add API key + provider

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

function wrapHtml(body: string): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0e1a;color:#e2e8f0}
  .container{max-width:560px;margin:0 auto;padding:32px 24px}
  .header{text-align:center;padding:32px 0 24px}
  .logo{width:48px;height:48px;background:linear-gradient(135deg,#06b6d4,#8b5cf6);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px}
  .logo svg{width:24px;height:24px;fill:white}
  .card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:32px}
  h1{font-size:22px;font-weight:700;margin-bottom:8px}
  p{font-size:14px;line-height:1.7;color:#94a3b8;margin-bottom:16px}
  .code{display:inline-block;padding:16px 32px;background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.3);border-radius:12px;font-family:'Courier New',monospace;font-size:28px;font-weight:700;letter-spacing:8px;color:#06b6d4;margin:16px 0}
  .btn{display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#06b6d4,#8b5cf6);border-radius:12px;color:#0a0e1a;font-size:14px;font-weight:600;text-decoration:none;margin:16px 0}
  .btn:hover{opacity:0.9}
  .footer{text-align:center;padding:24px 0;font-size:11px;color:#475569}
  .divider{height:1px;background:rgba(255,255,255,0.06);margin:24px 0}
  .badge{display:inline-block;padding:4px 12px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:20px;font-size:11px;color:#34d399;font-weight:600;margin-bottom:16px}
</style></head><body>
<div class="container">${body}
<div class="footer"><p style="font-size:11px;color:#475569;margin:0">EduNex · Platforma egzaminacyjna<br>© ${new Date().getFullYear()} Wszelkie prawa zastrzeżone</p></div>
</div></body></html>`;
}

export function otpEmailHtml(code: string): string {
  return wrapHtml(`
    <div class="header">
      <div class="logo"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
    </div>
    <div class="card">
      <div class="badge">KOD DOSTĘPU</div>
      <h1>Twój kod weryfikacyjny</h1>
      <p>Użyj poniższego kodu, aby dokończyć logowanie do panelu. Kod wygaśnie za 10 minut.</p>
      <div style="text-align:center"><span class="code">${code}</span></div>
      <p style="text-align:center;font-size:12px;color:#64748b">Jeśli nie próbowałeś się zalogować, zignoruj tę wiadomość.</p>
    </div>
  `);
}

export function passwordResetEmailHtml(resetUrl: string): string {
  return wrapHtml(`
    <div class="header">
      <div class="logo"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
    </div>
    <div class="card">
      <div class="badge">RESETOWANIE HASŁA</div>
      <h1>Resetowanie hasła</h1>
      <p>Otrzymaliśmy prośbę o reset hasła dla Twojego konta. Kliknij przycisk poniżej, aby ustawić nowe hasło.</p>
      <div style="text-align:center"><a href="${resetUrl}" class="btn">Ustaw nowe hasło</a></div>
      <p style="text-align:center;font-size:12px;color:#64748b">Link wygasa po 1 godzinie. Jeśli nie prosiłeś o reset, zignoruj tę wiadomość.</p>
    </div>
  `);
}

export function examResultEmailHtml(studentName: string, examTitle: string, score: number, maxScore: number, percent: number, passed: boolean, certUrl?: string): string {
  return wrapHtml(`
    <div class="header">
      <div class="logo"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
    </div>
    <div class="card">
      <div class="badge" style="${passed ? 'background:rgba(52,211,153,0.1);border-color:rgba(52,211,153,0.3);color:#34d399' : 'background:rgba(248,113,113,0.1);border-color:rgba(248,113,113,0.3);color:#f87171'}">${passed ? 'ZALICZONY' : 'NIEZALICZONY'}</div>
      <h1>Wynik egzaminu</h1>
      <p style="font-size:16px;color:#e2e8f0;font-weight:600">${studentName}</p>
      <p>Egzamin: <strong style="color:#e2e8f0">${examTitle}</strong></p>
      <div style="text-align:center;margin:24px 0">
        <div style="display:inline-block;width:120px;height:120px;border-radius:50%;background:conic-gradient(${passed ? '#34d399' : '#f87171'} ${percent}%, rgba(255,255,255,0.05) 0);display:flex;align-items:center;justify-content:center;position:relative">
          <div style="position:absolute;inset:8px;border-radius:50%;background:#0a0e1a;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <span style="font-size:28px;font-weight:700;color:#e2e8f0">${percent}%</span>
            <span style="font-size:11px;color:#94a3b8">${score}/${maxScore}</span>
          </div>
        </div>
      </div>
      ${certUrl ? `<div style="text-align:center"><a href="${certUrl}" class="btn">Pobierz certyfikat</a></div>` : ''}
    </div>
  `);
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[EMAIL] No RESEND_API_KEY — logging instead");
    console.log("[EMAIL]", { to: payload.to, subject: payload.subject });
    console.log("[EMAIL HTML]", payload.html.substring(0, 200) + "...");
    return { ok: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "EduNex <noreply@edunex.pl>",
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("[EMAIL] Resend error:", err);
      return { ok: false, error: err };
    }
    console.log("[EMAIL] Sent to", payload.to);
    return { ok: true };
  } catch (err) {
    console.error("[EMAIL] Fetch error:", err);
    return { ok: false, error: String(err) };
  }
}
