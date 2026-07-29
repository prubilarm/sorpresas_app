import { Router } from 'express';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { db } from '../db/db';

export const cardRouter = Router();

/**
 * @openapi
 * /api/projects/{id}/card:
 *   get:
 *     summary: Generar tarjeta imprimible (PDF de 9x9cm) con código QR
 *     tags: [Tarjeta Imprimible]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documento PDF de alta resolución devuelto para impresión
 */
cardRouter.get('/:id/card', async (req, res) => {
  const project = db.getState.projects.find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

  const host = req.get('host') || 'localhost:3000';
  const publicUrl = `http://${host}/r/${project.slug}`;

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

    // Background gradient/fill
    doc.rect(0, 0, sizePt, sizePt).fill('#27000f');

    // Title / Names
    doc.fillColor('#ff9cc4').fontSize(7).text('HECHO ESPECIALMENTE PARA', 18, 22, { characterSpacing: 1.2 });

    doc
      .fillColor('#ffffff')
      .fontSize(16)
      .text(`${project.person_one_name} & ${project.person_two_name}`, 18, 34, { width: 140, lineGap: 2 });

    doc
      .fillColor('#f6d4e2')
      .fontSize(8)
      .text('Escanea este código con la cámara de tu teléfono y descubre un recuerdo preparado con mucho amor.', 18, 120, {
        width: 130,
        lineGap: 3,
      });

    // QR Image Buffer (89 pt x 89 pt = 3.15 cm x 3.15 cm)
    const qrBuffer = await QRCode.toBuffer(publicUrl, {
      type: 'png',
      width: 400,
      color: { dark: '#27000f', light: '#ffffff' },
      margin: 1,
    });

    const qrSizePt = 89.29; // 3.15cm
    const qrX = sizePt - qrSizePt - 16;
    const qrY = (sizePt - qrSizePt) / 2;

    // Draw white card background for QR
    doc.roundedRect(qrX - 4, qrY - 4, qrSizePt + 8, qrSizePt + 8, 4).fill('#ffffff');

    doc.image(qrBuffer, qrX, qrY, { width: qrSizePt, height: qrSizePt });

    doc.end();
  } catch (err: any) {
    console.error('Error generating printable card PDF:', err);
    return res.status(500).json({ error: 'Error al generar la tarjeta imprimible: ' + err.message });
  }
});
