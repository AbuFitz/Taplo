import { CommandError } from "./errors";
export async function readJson(request: Request, limit: number): Promise<unknown> {
 if (!request.headers.get("content-type")?.startsWith("application/json")) throw new CommandError("INVALID_INPUT",400,"Check the details and try again.");
 const reader=request.body?.getReader(); if (!reader) throw new CommandError("INVALID_INPUT",400,"Add your details to continue.");
 const chunks:Uint8Array[]=[]; let size=0;
 while(true) { const chunk=await reader.read(); if(chunk.done) break; size+=chunk.value.byteLength; if(size>limit) {await reader.cancel();throw new CommandError("INVALID_INPUT",413,"Shorten your details and try again.");} chunks.push(chunk.value); }
 try {return JSON.parse(Buffer.concat(chunks).toString("utf8"));} catch {throw new CommandError("INVALID_INPUT",400,"Check the details and try again.");}
}
