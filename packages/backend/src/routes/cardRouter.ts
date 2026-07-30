import { Router } from 'express';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { db } from '../db/db';

export const cardRouter = Router();

export interface CardThemeConfig {
  id: string;
  name: string;
  bgColor: string;
  borderColor: string;
  innerBorderColor: string;
  kickerColor: string;
  namesColor: string;
  messageColor: string;
  qrDark: string;
  qrLight: string;
}

export const fontFontStyles: Record<string, CardThemeConfig> = {
  midnight_velvet: {
    id: 'midnight_velvet',
    name: 'Terciopelo Nocturno & Oro',
    bgColor: '#1a050f',
    borderColor: '#d4af37',
    innerBorderColor: '#7a5b13',
    kickerColor: '#e2b857',
    namesColor: '#ffffff',
    messageColor: '#f4cedd',
    qrDark: '#27000f',
    qrLight: '#ffffff',
  },
  rose_onyx: {
    id: 'rose_onyx',
    name: 'Oro Rosa & Ónix',
    bgColor: '#0d0f12',
    borderColor: '#e86b8b',
    innerBorderColor: '#7c3144',
    kickerColor: '#f4a298',
    namesColor: '#ffffff',
    messageColor: '#f8d3d9',
    qrDark: '#1e1b26',
    qrLight: '#ffffff',
  },
  minimal_linen: {
    id: 'minimal_linen',
    name: 'Lino Minimalista & Blanco Puro',
    bgColor: '#faf8f5',
    borderColor: '#a88647',
    innerBorderColor: '#d4c4a8',
    kickerColor: '#8c6c2e',
    namesColor: '#1a1a1a',
    messageColor: '#4a4a4a',
    qrDark: '#1a1a1a',
    qrLight: '#ffffff',
  },
  emerald_passion: {
    id: 'emerald_passion',
    name: 'Esmeralda Real & Champaña',
    bgColor: '#051f15',
    borderColor: '#d4af37',
    innerBorderColor: '#5c4811',
    kickerColor: '#f3e5ab',
    namesColor: '#ffffff',
    messageColor: '#d1e8df',
    qrDark: '#051f15',
    qrLight: '#ffffff',
  },
  celestial_night: {
    id: 'celestial_night',
    name: 'Noche Celestial & Plateado',
    bgColor: '#060b1e',
    borderColor: '#d1d5db',
    innerBorderColor: '#4b5563',
    kickerColor: '#e5e7eb',
    namesColor: '#ffffff',
    messageColor: '#dbeafe',
    qrDark: '#060b1e',
    qrLight: '#ffffff',
  },
};

/**
 * @openapi
 * /api/projects/{id}/card:
 *   get:
 *     summary: Generar tarjeta imprimible (PDF de 9x9cm) de alta resolución con 5 temas elegantes
 *     tags: [Tarjeta Imprimible]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: styleId
 *         schema:
 *           type: string
 *       - in: query
 *         name: kicker
 *         schema:
 *           type: string
 *       - in: query
 *         name: message
 *         schema:
 *           type: string
 *       - in: query
 *         name: targetUrl
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documento PDF de alta resolución devuelto para impresión
 */
cardRouter.get('/:id/card', async (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  // Resolve target URL to encode in QR (defaults to production Vercel app URL)
  const explicitTargetUrl = req.query.targetUrl as string;
  const explicitBaseUrl = req.query.baseUrl as string;

  let publicUrl = '';
  if (explicitTargetUrl) {
    publicUrl = explicitTargetUrl;
  } else if (explicitBaseUrl) {
    publicUrl = `${explicitBaseUrl.replace(/\/$/, '')}/r/${project.slug}`;
  } else {
    const frontendBase =
      process.env.FRONTEND_URL ||
      req.headers.origin ||
      (req.headers.referer ? new URL(req.headers.referer).origin : null) ||
      'https://sorpresas-app-web.vercel.app';
    publicUrl = `${frontendBase.replace(/\/$/, '')}/r/${project.slug}`;
  }

  // Resolve custom texts and theme style
  const savedSettings = (project as any).settings_json?.card_settings || {};
  const styleId = (req.query.styleId as string) || savedSettings.styleId || 'midnight_velvet';
  const theme = fontFontStyles[styleId] || fontFontStyles.midnight_velvet;

  const kickerText = ((req.query.kicker as string) || savedSettings.kicker || 'HECHO ESPECIALMENTE PARA').toUpperCase();
  const messageText = (req.query.message as string) || savedSettings.message || 'Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.';
  
  const sender = project.sender_name || project.person_one_name || 'Remitente';
  const recipient = project.recipient_name || project.person_two_name || 'Destinatario';
  const namesText = (req.query.names as string) || savedSettings.names || `${sender} & ${recipient}`;

  try {
    // 9cm in points = (9 / 2.54) * 72 = 255.118 pt
    const sizePt = 255.118;
    const doc = new PDFDocument({
      size: [sizePt, sizePt],
      margin: 0,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="tarjeta_${project.slug}.pdf"`);

    doc.pipe(res);

    // 1. Background Fill
    doc.rect(0, 0, sizePt, sizePt).fill(theme.bgColor);

    // 2. Double Line Luxury Borders
    const m1 = 10;
    doc.lineWidth(1.2).rect(m1, m1, sizePt - m1 * 2, sizePt - m1 * 2).stroke(theme.borderColor);

    const m2 = 14;
    doc.lineWidth(0.5).rect(m2, m2, sizePt - m2 * 2, sizePt - m2 * 2).stroke(theme.innerBorderColor);

    // Corner Ornaments (Small Diamonds)
    const drawDiamond = (cx: number, cy: number, r: number) => {
      doc
        .polygon([cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy])
        .fill(theme.borderColor);
    };
    drawDiamond(m1, m1, 3);
    drawDiamond(sizePt - m1, m1, 3);
    drawDiamond(m1, sizePt - m1, 3);
    drawDiamond(sizePt - m1, sizePt - m1, 3);

    // 3. Header Kicker
    doc
      .fillColor(theme.kickerColor)
      .fontSize(6.5)
      .text(kickerText, 22, 24, { characterSpacing: 1.2, width: 130 });

    // 4. Main Title Names
    doc
      .fillColor(theme.namesColor)
      .fontSize(15)
      .text(namesText, 22, 36, { width: 135, lineGap: 2 });

    // 5. Dedication Message
    doc
      .fillColor(theme.messageColor)
      .fontSize(7.5)
      .text(messageText, 22, 115, {
        width: 125,
        lineGap: 2.5,
      });

    // 6. High Resolution QR Image Buffer (89 pt x 89 pt = 3.15 cm x 3.15 cm)
    const qrBuffer = await QRCode.toBuffer(publicUrl, {
      type: 'png',
      width: 500,
      color: { dark: theme.qrDark, light: theme.qrLight },
      margin: 1,
    });

    const qrSizePt = 88; // 3.1 cm
    const qrX = sizePt - qrSizePt - 20;
    const qrY = (sizePt - qrSizePt) / 2 + 5;

    // Draw card container frame behind QR
    doc.roundedRect(qrX - 4, qrY - 4, qrSizePt + 8, qrSizePt + 8, 4).fill(theme.qrLight);
    doc.lineWidth(0.8).roundedRect(qrX - 4, qrY - 4, qrSizePt + 8, qrSizePt + 8, 4).stroke(theme.borderColor);

    doc.image(qrBuffer, qrX, qrY, { width: qrSizePt, height: qrSizePt });

    doc.end();
  } catch (err: any) {
    console.error('Error generating printable card PDF:', err);
    return res.status(500).json({ error: 'Error al generar la tarjeta imprimible: ' + err.message });
  }
});
