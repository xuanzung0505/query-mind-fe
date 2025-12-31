import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createMetadataTagger } from "@langchain/classic/document_transformers/openai_functions";
import { ChatOpenAI } from "@langchain/openai";

function isPrime(num: number) {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}

function sumOfPrimes(n: number) {
  let sum = 0;
  for (let i = 2; i <= n; i++) {
    if (isPrime(i)) sum += i;
  }
  return sum;
}

async function processDoc(download_url: string) {
  try {
    // 1. Fetch the data
    const response = await fetch(download_url);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // 2. Convert response to Blob for PDFLoader
    const blob = await response.blob();
    const loader = new PDFLoader(blob);
    const pages = await loader.load();

    // 3. remove blank pages
    const cleaned_pages = pages.filter(
      (page) => page.pageContent.split(" ").length > 20
    );
    console.log(cleaned_pages.length);

    // 4. split doc into chunks
    const text_splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 300,
    });
    const metadataTagger = createMetadataTagger(
      {
        properties: {
          title: { type: "string" },
          keywords: { type: "array", items: { type: "string" } },
          hasCode: { type: "boolean" },
        },
        type: "object",
        required: ["title", "keywords", "hasCode"],
      },
      {
        llm: new ChatOpenAI({ model: "gpt-4o-mini" }),
      }
    );
    const docsWithMetadata = await metadataTagger.transformDocuments(
      cleaned_pages
    );
    const split_docs = await text_splitter.splitDocuments(docsWithMetadata);
    console.log(
      `Successfully chunked the PDF into ${split_docs.length} documents.`
    );
    return split_docs;
  } catch (error) {
    console.log(error);
  }
  return [];
}

export default sumOfPrimes;
export { processDoc };
