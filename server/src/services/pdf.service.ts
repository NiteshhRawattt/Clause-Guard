import fs from 'fs';
import pdfParse from 'pdf-parse';

const MAX_EXTRACTED_CHARS = 50000; // ~12k tokens — well within Gemini context

/**
 * Extract plain text from a PDF buffer.
 * Returns the text string, or throws a descriptive error.
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  let result: { text: string };
  try {
    result = await pdfParse(buffer);
  } catch (err) {
    throw new Error(
      'Could not read the PDF file. The file may be corrupted or password-protected.'
    );
  }

  const text = result.text?.trim();

  if (!text || text.length < 50) {
    throw new Error(
      'No readable text was found in this PDF. ' +
      'Scanned/image-only PDFs are not supported — please paste the text instead.'
    );
  }

  // Truncate gracefully if the PDF is very long
  return text.slice(0, MAX_EXTRACTED_CHARS);
}

/**
 * Extract text from a file path (used when multer saves to disk).
 */
export async function extractTextFromPdfPath(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  return extractTextFromPdf(buffer);
}
