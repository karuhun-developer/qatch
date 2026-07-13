import { createHmac } from 'node:crypto'

export interface WebhookPayload {
  event: string
  data: object
}

export default class WebhookService {
  /**
   * Dispatch a POST webhook to the target URL.
   * If hmacKey is provided, attaches an HMAC-SHA256 signature
   * of the request body as the `x-signature-key` header.
   */
  dispatch(url: string, hmacKey: string | null, payload: WebhookPayload): void {
    const body = JSON.stringify(payload)
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }

    if (hmacKey) {
      const signature = createHmac('sha256', hmacKey).update(body).digest('hex')
      headers['x-signature-key'] = signature
    }

    fetch(url, { method: 'POST', headers, body }).catch((err) =>
      console.error('[WebhookService] Failed to dispatch webhook:', err)
    )
  }

  /**
   * Dispatch a `transaction.paid` event webhook.
   */
  dispatchTransactionPaid(url: string, hmacKey: string | null, transactionData: object): void {
    this.dispatch(url, hmacKey, { event: 'transaction.paid', data: transactionData })
  }
}
