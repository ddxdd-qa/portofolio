# Sample Defect / Bug Report: Race Condition on Concurrent Fund Transfer Button

**Bug Tracking ID:** `BUG-SW-189`  
**Project:** StarWALLET Fintech Core  
**Reporter:** Dedy Blinda Rosandy (Senior QA Tester)  
**Date Reported:** 2026-08-30  
**Status:** In Progress / Verified in Staging  

---

## 1. Issue Overview

| Field | Value |
|---|---|
| **Summary** | [P1 / S1] Race Condition on Concurrent "Double-Tap" Transfer Button Leads to Duplicate Balance Deduction |
| **Component** | Wallet Mobile Client / API Gateway / Transfer Service |
| **Severity** | **S1 - Critical** (Financial discrepancy / Double spend vulnerability) |
| **Priority** | **P1 - High** (Must resolve before production release) |
| **Environment** | Staging API `v2.4.1` · Android App Build `#2026.08.30-rc2` (Samsung Galaxy S23, Android 14) & iOS 17.4 |
| **Browser / Client** | StarWALLET Mobile Native App & Chrome Mobile 128 |

---

## 2. Description

During exploratory and stress testing under simulated network latency (Throttled 3G / 250ms RTT), rapidly tapping the **"Confirm & Transfer"** button twice within approximately 180 milliseconds bypassed client-side event throttling.

Because the backend transfer endpoint `/api/v1/wallet/transfer` lacked an atomic distributed mutex lock and did not enforce an `Idempotency-Key` header, two separate concurrent database transactions were committed simultaneously, resulting in **double deduction of funds** from the sender's balance and two distinct transactions credited to the recipient.

---

## 3. Steps to Reproduce

1. Launch StarWALLET App and log into account with balance `IDR 500,000`.
2. Configure network proxy (Charles Proxy / mitmproxy) to simulate **Slow 3G** (latency: 350ms, packet drop: 0%).
3. Navigate to **Transfer** -> **Send to Contact** -> Select Recipient `USR-39211`.
4. Enter transfer amount: `IDR 100,000` and proceed to confirmation screen.
5. In the confirmation dialog, rapidly **double-tap** the **"Confirm & Pay"** button within ~200ms.
6. Observe UI feedback and check balance and transaction history.

---

## 4. Expected vs. Actual Result

* **Expected Result:**
  * The button should immediately enter a disabled/loading state upon the first tap (debounced).
  * Only one HTTP request should be sent.
  * Even if a second request reaches the server, the backend should reject it with `409 Conflict` or `422 Unprocessable Entity` due to duplicate `Idempotency-Key`.
  * Sender balance should be deducted by `IDR 100,000` (new balance: `IDR 400,000`).

* **Actual Result:**
  * Both clicks fired HTTP `POST` requests within 134ms of each other.
  * Both requests returned `200 OK`.
  * Sender balance was deducted by `IDR 200,000` (new balance: `IDR 300,000`).
  * Two separate transaction records (`TX-99014A` and `TX-99014B`) were written to the ledger.

---

## 5. Technical Evidence & Server Logs

### HTTP Request Log (Proxy Trace)

```http
Request #1 (Timestamp: 14:02:11.104)
POST /api/v1/wallet/transfer HTTP/1.1
Host: api.starworks.internal
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{
  "sender_wallet_id": "W-84920",
  "recipient_wallet_id": "W-39211",
  "amount": 100000,
  "currency": "IDR"
}

Response #1 (Timestamp: 14:02:11.380):
HTTP/1.1 200 OK
{
  "status": "SUCCESS",
  "tx_id": "TX-99014A",
  "new_balance": 400000
}
```

```http
Request #2 (Timestamp: 14:02:11.238)
POST /api/v1/wallet/transfer HTTP/1.1
Host: api.starworks.internal
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{
  "sender_wallet_id": "W-84920",
  "recipient_wallet_id": "W-39211",
  "amount": 100000,
  "currency": "IDR"
}

Response #2 (Timestamp: 14:02:11.512):
HTTP/1.1 200 OK
{
  "status": "SUCCESS",
  "tx_id": "TX-99014B",
  "new_balance": 300000
}
```

### Application Error / Trace Log

```text
2026-08-30 14:02:11.240 [WARN] [TransferService] Concurrent balance modification detected on wallet W-84920 without active Redis distributed lock.
2026-08-30 14:02:11.242 [INFO] [LedgerRepository] Committing transaction TX-99014B for user USR-84920.
```

---

## 6. Root Cause Analysis & Recommended Solution

1. **Client Side (Mobile UI):**
   * Apply UI throttle/debounce on transfer button click handler:
     ```typescript
     const handleTransfer = throttle(async () => {
       setIsSubmitting(true);
       await api.submitTransfer(payload);
     }, 1000, { trailing: false });
     ```
2. **Backend API Gateway (Idempotency):**
   * Mandate a unique client-generated UUID header `X-Idempotency-Key` on every financial write operation.
   * Store the idempotency key in Redis with a 60-second TTL.
   * If a duplicate key is received while processing, return `409 Conflict`.
3. **Database Layer (Concurrency Control):**
   * Wrap ledger balance updates in `SELECT ... FOR UPDATE` row-level locks or implement Redis Redlock mutex keyed by `wallet_id`.

---

## 7. Automated Test Plan to Prevent Regression

* Created Cypress test scenario: `cypress/e2e/transfers/concurrent-submit.cy.ts`
* Created Playwright load simulation test simulating 5 simultaneous transfer calls with identical payload to verify that only 1 succeeds and 4 are cleanly rejected with `409 Conflict`.
