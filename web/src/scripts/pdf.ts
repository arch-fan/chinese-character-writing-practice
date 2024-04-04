import { PDFDocument } from "pdf-lib";

const MANGO_URL =
  "https://cors-proxy.juanserracines.workers.dev/https://www.mangoworksheets.com/cn/generated";
const MAX_CHARS = 200;

export const sizedTextChunks = (
  hanziChars: string,
  size = MAX_CHARS
): string[] => {
  const chars = hanziChars.replace(/\s/g, "").split("");
  const result: string[] = [];

  for (let i = 0; i < chars.length; i += size) {
    result.push(chars.slice(i, i + size).join(""));
  }

  return result;
};

interface MangoOptions {
  text: string;
  miaohong?: "option0" | "option1" | "option2" | "option3" | "optionall";
  ispinyin?: "yes" | "no";
  size?: "1" | "2";
}

export const getPdf = async ({
  text,
  ispinyin = "yes",
  size = "2",
  miaohong = "option3",
}: MangoOptions) => {
  const res = await fetch(MANGO_URL, {
    method: "POST",
    body: new URLSearchParams({
      text,
      ispinyin,
      size,
      miaohong,
    }),
  });

  return await res.arrayBuffer();
};

export const joinPdfs = async (pdfs: ArrayBuffer[]) => {
  const mergedPdf = await PDFDocument.create();
  for (const pdfBytes of pdfs) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices()
    );

    for (const page of copiedPages) {
      mergedPdf.addPage(page);
    }
  }
  const mergedPdfBytes = await mergedPdf.save();
  return mergedPdfBytes;
};

export const textToPdfUrl = async (text: string): Promise<string> => {
  const chunks = sizedTextChunks(text);

  const pdfs = await Promise.all(
    chunks.map(async (chunk) => {
      const pdfBytes = await getPdf({ text: chunk });
      return pdfBytes;
    })
  );

  const mergedPdfBytes = pdfs.length > 1 ? await joinPdfs(pdfs) : pdfs[0];

  const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

  return URL.createObjectURL(blob);
};
