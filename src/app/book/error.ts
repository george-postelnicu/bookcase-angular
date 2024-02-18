export interface ErrorResponse {
  traceId?: string;
  title: string;
  detail?: string;
  additionalInformation?: string[];
  status?: string;
}
