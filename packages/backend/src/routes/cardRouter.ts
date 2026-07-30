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
    name: '👑 Real Borgoña & Pan de Oro',
    bgColor: '#1a030c',
    borderColor: '#e5c158',
    innerBorderColor: '#7a5b13',
    kickerColor: '#f3d375',
    namesColor: '#ffffff',
    messageColor: '#fce7f0',
    qrDark: '#27000f',
    qrLight: '#ffffff',
  },
  rose_onyx: {
    id: 'rose_onyx',
    name: '💎 Ónix Joya & Oro Rosa',
    bgColor: '#0c0d12',
    borderColor: '#f4a2b8',
    innerBorderColor: '#7c3144',
    kickerColor: '#f8c2d1',
    namesColor: '#ffffff',
    messageColor: '#fce8ef',
    qrDark: '#1e1b26',
    qrLight: '#ffffff',
  },
  minimal_linen: {
    id: 'minimal_linen',
    name: '📜 Lino Marfil & Oro Imperial',
    bgColor: '#f7f4ed',
    borderColor: '#b89242',
    innerBorderColor: '#d4c4a8',
    kickerColor: '#8c6c2e',
    namesColor: '#1c1917',
    messageColor: '#44403c',
    qrDark: '#1c1917',
    qrLight: '#ffffff',
  },
  emerald_passion: {
    id: 'emerald_passion',
    name: '🌿 Esmeralda Real & Champaña',
    bgColor: '#031c13',
    borderColor: '#f5e6be',
    innerBorderColor: '#5c4811',
    kickerColor: '#f5e6be',
    namesColor: '#ffffff',
    messageColor: '#d1f2e6',
    qrDark: '#031c13',
    qrLight: '#ffffff',
  },
  celestial_night: {
    id: 'celestial_night',
    name: '🌌 Noche Celestial & Plata Líquida',
    bgColor: '#040817',
    borderColor: '#e2e8f0',
    innerBorderColor: '#4b5563',
    kickerColor: '#cbd5e1',
    namesColor: '#ffffff',
    messageColor: '#e2e8f0',
    qrDark: '#040817',
    qrLight: '#ffffff',
  },
};

cardRouter.get('/:id/card', async (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  // Target URL to encode in QR
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

  // Resolve saved settings & query parameters
  const savedSettings = (project as any).settings_json?.card_settings || {};
  const styleId = (req.query.styleId as string) || savedSettings.styleId || 'midnight_velvet';
  const theme = fontFontStyles[styleId] || fontFontStyles.midnight_velvet;

  const kickerText = ((req.query.kicker as string) || savedSettings.kicker || 'HECHO ESPECIALMENTE PARA').toUpperCase();
  const messageText = (req.query.message as string) || savedSettings.message || 'Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.';

  const sender = project.sender_name || project.person_one_name || 'Remitente';
  const recipient = project.recipient_name || project.person_two_name || 'Destinatario';
  const namesText = (req.query.names as string) || savedSettings.names || `${sender} & ${recipient}`;

  // Layout Options
  const qrPosition = (req.query.qrPosition as string) || savedSettings.qrPosition || 'bottom_right';
  const titleSizeOption = (req.query.titleSize as string) || savedSettings.titleSize || 'medium';
  const qrSizeOption = (req.query.qrSize as string) || savedSettings.qrSize || 'medium';
  const borderStyle = (req.query.borderStyle as string) || savedSettings.borderStyle || 'double_gold';

  // Custom Drag-and-Drop Canvas Data (if provided)
  let customCanvas: any = null;
  if (req.query.canvasData) {
    try {
      customCanvas = JSON.parse(req.query.canvasData as string);
    } catch (e) {}
  } else if (savedSettings.custom_canvas) {
    customCanvas = savedSettings.custom_canvas;
  }

  // Calculate Pt Sizes
  let nameFontSize = 15;
  if (titleSizeOption === 'small') nameFontSize = 13;
  if (titleSizeOption === 'large') nameFontSize = 19;

  let kickerFontSize = 6.5;
  let messageFontSize = 7.5;

  let qrSizePt = 88; // 3.1cm
  if (qrSizeOption === 'small') qrSizePt = 70; // 2.5cm
  if (qrSizeOption === 'large') qrSizePt = 112; // 4.0cm

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

    // 2. Borders & Filigranas
    if (borderStyle !== 'no_border') {
      const m1 = 10;
      doc.lineWidth(1.2).rect(m1, m1, sizePt - m1 * 2, sizePt - m1 * 2).stroke(theme.borderColor);

      if (borderStyle === 'double_gold' || borderStyle === 'ornate_filigree') {
        const m2 = 14;
        doc.lineWidth(0.5).rect(m2, m2, sizePt - m2 * 2, sizePt - m2 * 2).stroke(theme.innerBorderColor);
      }

      // Corner Ornaments
      const drawDiamond = (cx: number, cy: number, r: number) => {
        doc.polygon([cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]).fill(theme.borderColor);
      };
      drawDiamond(m1, m1, 3);
      drawDiamond(sizePt - m1, m1, 3);
      drawDiamond(m1, sizePt - m1, 3);
      drawDiamond(sizePt - m1, sizePt - m1, 3);
    }

    // 3. Generate QR Image Buffer
    const qrBuffer = await QRCode.toBuffer(publicUrl, {
      type: 'png',
      width: 500,
      color: { dark: theme.qrDark, light: theme.qrLight },
      margin: 1,
    });

    // 4. Calculate Coordinates (X, Y)
    let qrX = sizePt - qrSizePt - 20;
    let qrY = (sizePt - qrSizePt) / 2 + 5;

    let kickerX = 22, kickerY = 24, kickerWidth = 130;
    let namesX = 22, namesY = 36, namesWidth = 135;
    let messageX = 22, messageY = 115, messageWidth = 125;
    let textAlign: 'left' | 'center' | 'right' = 'left';

    // If Free-Form Drag & Drop coordinates are present
    if (customCanvas && customCanvas.enabled) {
      if (customCanvas.qr) {
        qrX = (customCanvas.qr.x / 100) * sizePt;
        qrY = (customCanvas.qr.y / 100) * sizePt;
        if (customCanvas.qr.sizeCm) {
          qrSizePt = (customCanvas.qr.sizeCm / 9.0) * sizePt;
        }
      }
      if (customCanvas.kicker) {
        kickerX = (customCanvas.kicker.x / 100) * sizePt;
        kickerY = (customCanvas.kicker.y / 100) * sizePt;
        if (customCanvas.kicker.fontSize) kickerFontSize = customCanvas.kicker.fontSize;
      }
      if (customCanvas.names) {
        namesX = (customCanvas.names.x / 100) * sizePt;
        namesY = (customCanvas.names.y / 100) * sizePt;
        if (customCanvas.names.fontSize) nameFontSize = customCanvas.names.fontSize;
        if (customCanvas.names.width) namesWidth = (customCanvas.names.width / 100) * sizePt;
      }
      if (customCanvas.message) {
        messageX = (customCanvas.message.x / 100) * sizePt;
        messageY = (customCanvas.message.y / 100) * sizePt;
        if (customCanvas.message.fontSize) messageFontSize = customCanvas.message.fontSize;
        if (customCanvas.message.width) messageWidth = (customCanvas.message.width / 100) * sizePt;
      }
    } else {
      // Standard Presets
      if (qrPosition === 'center_large') {
        textAlign = 'center';
        kickerX = 20; kickerY = 22; kickerWidth = sizePt - 40;
        namesX = 20; namesY = 33; namesWidth = sizePt - 40;
        qrX = (sizePt - qrSizePt) / 2;
        qrY = 75;
        messageX = 20; messageY = 75 + qrSizePt + 10; messageWidth = sizePt - 40;
      } else if (qrPosition === 'bottom_center') {
        textAlign = 'center';
        kickerX = 20; kickerY = 24; kickerWidth = sizePt - 40;
        namesX = 20; namesY = 36; namesWidth = sizePt - 40;
        messageX = 20; messageY = 78; messageWidth = sizePt - 40;
        qrX = (sizePt - qrSizePt) / 2;
        qrY = sizePt - qrSizePt - 16;
      } else if (qrPosition === 'top_right') {
        qrX = sizePt - qrSizePt - 18;
        qrY = 20;
        kickerX = 22; kickerY = 24; kickerWidth = sizePt - qrSizePt - 46;
        namesX = 22; namesY = 36; namesWidth = sizePt - qrSizePt - 46;
        messageX = 22; messageY = 135; messageWidth = sizePt - 44;
      } else if (qrPosition === 'left_split') {
        qrX = 18;
        qrY = (sizePt - qrSizePt) / 2;
        kickerX = 18 + qrSizePt + 14; kickerY = 28; kickerWidth = sizePt - qrSizePt - 44;
        namesX = 18 + qrSizePt + 14; namesY = 40; namesWidth = sizePt - qrSizePt - 44;
        messageX = 18 + qrSizePt + 14; messageY = 120; messageWidth = sizePt - qrSizePt - 44;
      }
    }

    // Render Kicker
    doc
      .fillColor(theme.kickerColor)
      .fontSize(kickerFontSize)
      .text(kickerText, kickerX, kickerY, { characterSpacing: 1.2, width: kickerWidth, align: textAlign });

    // Render Names
    doc
      .fillColor(theme.namesColor)
      .fontSize(nameFontSize)
      .text(namesText, namesX, namesY, { width: namesWidth, lineGap: 2, align: textAlign });

    // Render Message
    doc
      .fillColor(theme.messageColor)
      .fontSize(messageFontSize)
      .text(messageText, messageX, messageY, {
        width: messageWidth,
        lineGap: 2.5,
        align: textAlign,
      });

    // Render QR Container & Image
    doc.roundedRect(qrX - 4, qrY - 4, qrSizePt + 8, qrSizePt + 8, 4).fill(theme.qrLight);
    doc.lineWidth(0.8).roundedRect(qrX - 4, qrY - 4, qrSizePt + 8, qrSizePt + 8, 4).stroke(theme.borderColor);
    doc.image(qrBuffer, qrX, qrY, { width: qrSizePt, height: qrSizePt });

    doc.end();
  } catch (err: any) {
    console.error('Error generating printable card PDF:', err);
    return res.status(500).json({ error: 'Error al generar la tarjeta imprimible: ' + err.message });
  }
});
