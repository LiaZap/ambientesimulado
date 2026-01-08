import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendWelcomeEmailProps {
    email: string;
    name: string;
    password?: string;
    planName: string;
}

export async function sendWelcomeEmail({ email, name, password, planName }: SendWelcomeEmailProps) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acesso <nao-responda@ambientesimulado.online>',
            to: [email],
            subject: `Bem-vindo(a) ao PRF Ambiente Simulado! 🚀`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <div style="background-color: #0f172a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
             <h1 style="color: #fbbf24; margin: 0;">Bem-vindo(a)!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <p style="color: #334155; font-size: 16px;">Olá, <strong>${name}</strong>!</p>
            
            <p style="color: #334155; font-size: 16px;">Seu pagamento do plano <strong>${planName}</strong> foi aprovado com sucesso.</p>
            
            <p style="color: #334155; font-size: 16px;">Aqui estão seus dados de acesso:</p>
            
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #475569;"><strong>Email:</strong> ${email}</p>
              ${password ? `<p style="margin: 5px 0; color: #475569;"><strong>Senha Temporária:</strong> ${password}</p>` : ''}
            </div>

            <p style="color: #334155; font-size: 14px; color: #64748b;">Recomendamos alterar sua senha após o primeiro acesso.</p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://ambientesimulado.online/login" style="background-color: #fbbf24; color: #0f172a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Acessar Plataforma</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
            <p>© 2026 PRF Ambiente Simulado. Todos os direitos reservados.</p>
          </div>
        </div>
      `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Exception sending email:', error);
        return { success: false, error };
    }
}
