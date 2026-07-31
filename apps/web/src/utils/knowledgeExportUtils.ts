import { knowledgeBase } from '../data/knowledge';

export function downloadString(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateMarkdown(): string {
  let md = `# Base de Conocimiento Oficial de Sorpresas App\n`;
  md += `Última actualización: ${knowledgeBase.lastUpdated}\n\n`;

  md += `## 1. Resumen del Producto\n`;
  md += `- **Resumen:** ${knowledgeBase.product.summary}\n`;
  md += `- **Problema resuelto:** ${knowledgeBase.product.problemSolved}\n`;
  md += `- **Qué recibe el cliente:** ${knowledgeBase.product.whatCustomerReceives}\n`;
  md += `- **Cómo funciona:** ${knowledgeBase.product.howItWorks}\n`;
  md += `- **Diferenciador:** ${knowledgeBase.product.differentiator}\n`;
  md += `- **Objetivo Emocional:** ${knowledgeBase.product.emotionalGoal}\n`;
  md += `- **Propuesta de Valor:** ${knowledgeBase.product.valueProposition}\n`;
  md += `- **Qué NO es:** ${knowledgeBase.product.whatItIsNot}\n\n`;

  md += `## 2. Casos de Uso (Biblioteca Maestra)\n`;
  knowledgeBase.useCases.forEach((uc, index) => {
    md += `### Caso ${index + 1}: ${uc.title} (${uc.category})\n`;
    md += `**Contexto:** ${uc.context}\n\n`;
    md += `**Problema:** ${uc.problem}\n\n`;
    md += `**Solución:** ${uc.solution}\n\n`;
    md += `**Resultado Emocional:** ${uc.emotionalResult}\n\n`;
    md += `**Ejemplo de Carta:**\n> ${uc.exampleLetter}\n\n`;
    md += `**Guion TikTok/Reel:**\n- Hook: ${uc.socialMedia.hook}\n- Script: ${uc.socialMedia.reelScript}\n\n`;
    md += `---\n\n`;
  });

  md += `## 3. Planes Comerciales\n`;
  knowledgeBase.commercialPlans.forEach(plan => {
    md += `### ${plan.name} ($${plan.referencePriceCLP} CLP)\n`;
    md += `- Incluye: ${plan.includes.join(', ')}\n`;
  });
  md += `\n`;

  md += `## 4. Preguntas Frecuentes\n`;
  knowledgeBase.faq.forEach(f => {
    md += `**Q: ${f.question}**\n${f.answer}\n\n`;
  });

  md += `## 5. Directrices IA (NotebookLM)\n`;
  knowledgeBase.aiGuidelines.forEach(g => {
    md += `- ${g}\n`;
  });

  return md;
}

export function generateHTML(): string {
  const md = generateMarkdown();
  const htmlBody = md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\*\*Q: (.*$)\*\*/gim, '<strong>Q: $1</strong>')
    .replace(/^\*\*([^*]+)\*\*(.*)/gim, '<strong>$1</strong>$2')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/\n\n/gim, '<br/><br/>');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Documentación Oficial Sorpresas App</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { color: #e83482; }
    h2 { border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; margin-top: 2rem; }
    li { margin-bottom: 0.5rem; }
    blockquote { border-left: 4px solid #fbcfe8; padding-left: 1rem; color: #64748b; font-style: italic; }
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>
  `.trim();
}

export function exportKnowledge(format: 'json' | 'md' | 'txt' | 'html') {
  const date = new Date().toISOString().split('T')[0];
  const basename = `sorpresas-app-docs-${date}`;

  switch (format) {
    case 'json':
      downloadString(JSON.stringify(knowledgeBase, null, 2), `${basename}.json`, 'application/json');
      break;
    case 'md':
      downloadString(generateMarkdown(), `${basename}.md`, 'text/markdown');
      break;
    case 'txt':
      downloadString(generateMarkdown(), `${basename}.txt`, 'text/plain');
      break;
    case 'html':
      downloadString(generateHTML(), `${basename}.html`, 'text/html');
      break;
  }
}
