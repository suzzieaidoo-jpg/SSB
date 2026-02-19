import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function renderPdf(html: string) {
  const browser = await puppeteer.launch({ args: chromium.args, defaultViewport: chromium.defaultViewport, executablePath: await chromium.executablePath(), headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const data = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return Buffer.from(data);
}

export function reportHtml(data: any) {
  return `<!doctype html><html><body style="font-family:Arial;padding:24px"><h1>Founder Readiness Dossier</h1><p>${new Date().toISOString().slice(0,10)} • ${data.attemptId}</p><h3>Dream</h3><p>${data.dreamOneLiner.slice(0,180)}</p><h3>Readiness ${data.readinessLevel} (${Math.round(data.totalScore)})</h3><p>Band: ${data.outcomeBand} Pattern: ${data.patternLabel}</p><p>Stewardship ${Math.round(data.stewardshipScore)} | Learning ${Math.round(data.learningScore)} | Integrity ${Math.round(data.integrityScore)}</p><h3>Strengths</h3><ul>${(data.strengths||[]).map((s:string)=>`<li>${s}</li>`).join('')}</ul><h3>Risks</h3><ul>${(data.risks||[]).map((s:string)=>`<li>${s}</li>`).join('')}</ul><h3>Next 14 Days</h3><ul>${(data.next14DaysBullets||[]).map((s:string)=>`<li>${s}</li>`).join('')}</ul><small>Learning simulation — not investment advice.</small></body></html>`;
}
