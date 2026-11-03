export class CommandError extends Error {
  constructor(public code: string, public status: number, public messageKey: string, public retryable = false, public fieldErrors: { field: string; code: string }[] = []) {
    super(code);
  }
}
export const unavailable = () => new CommandError("TEMPORARILY_UNAVAILABLE", 503, "Please try again shortly.", true);
export const hidden = () => new CommandError("NOT_FOUND_OR_NOT_PERMITTED", 404, "We couldn’t find that item.");
export function errorResponse(error: unknown, requestId: string): Response {
  const e = error instanceof CommandError ? error : unavailable();
  return Response.json({ code: e.code, message_key: e.messageKey, field_errors: e.fieldErrors, request_id: requestId, retryable: e.retryable }, { status: e.status, headers: { "Cache-Control": "no-store", "X-Request-ID": requestId } });
}
