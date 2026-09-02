# Sample Test Case: Multi-Currency Fund Transfer with OTP Liveness

**Document Version:** 1.0  
**Author:** Dedy Blinda Rosandy (Senior Quality Assurance Tester)  
**Project:** StarWALLET Mobile & Web Platform  
**Test Suite:** Regression / Fintech Core / Transaction Security  

---

## 1. Test Case Information

| Field | Detail |
|---|---|
| **Test Case ID** | `TC-SW-042` |
| **Title** | Verify peer-to-peer fund transfer with OTP verification and biometric liveness challenge |
| **Module** | Transfer & Payment Gateway / Wallet Ledger |
| **Test Type** | Functional, Security, Integration, Regression |
| **Priority** | P0 (Blocker) |
| **Severity** | Critical |
| **Execution Type** | Automated (Cypress / Playwright) & Manual Verification |
| **Test Environment** | Staging / Pre-Production (Android 14, iOS 17.4, Chrome Desktop 128) |

---

## 2. Pre-Conditions

1. Sender user (`USR-84920`) is logged in with KYC Level 2 verified.
2. Sender has an available balance of at least `IDR 1,500,000` in the primary wallet.
3. Recipient user (`USR-39211`) has an active and KYC-approved StarWALLET account.
4. Internet connection is stable (>10 Mbps); REST API Gateway latency < 120ms.
5. 2FA / OTP service (Twilio/Firebase) is operational with active webhook listeners.

---

## 3. Test Steps & Expected Results

| Step | Action Description | Test Data | Expected Result | Pass/Fail |
|---|---|---|---|---|
| **1** | Open StarWALLET app, navigate to **Transfer** menu, and select **Send to Friend**. | N/A | Transfer dashboard loads; recent contacts list and search input are visible. | Pass |
| **2** | Enter recipient phone number or wallet tag in search input. | `+6281234567890` / `@budi_santoso` | Real-time debounce lookup validates recipient. Recipient full name and avatar appear with blue verified KYC badge. | Pass |
| **3** | Enter transfer amount within balance limit, select currency, and add optional note. | Amount: `IDR 250,000`<br>Note: `"Payment for catering"` | Amount formatting renders correctly with thousand separators (`Rp 250.000`). Calculated transaction fee (`Rp 0 - Promo`) displayed accurately. | Pass |
| **4** | Tap **Continue** to open the Transfer Confirmation bottom sheet. | N/A | Summary modal shows Sender, Recipient, Amount, Admin Fee, Total Deduction, and unique Reference ID (`REF-2026-X892`). | Pass |
| **5** | Tap **Confirm & Pay** to trigger security verification challenge. | N/A | System checks risk score; requests 6-digit OTP code sent via SMS/Push with a 60-second countdown timer. | Pass |
| **6** | Input correct 6-digit dynamic OTP code. | OTP: `729401` | System verifies token with backend auth server. Submit button shows loading spinner with disabled state to prevent duplicate clicks. | Pass |
| **7** | Verify transaction response screen and receipt generation. | N/A | Success screen displays with animated green checkmark; unique Transaction Hash and timestamp displayed; button to **Download PDF Receipt** and **Share** is active. | Pass |
| **8** | Verify sender and recipient ledger records in database and push notifications. | DB Table: `wallet_transactions`, `user_balances` | 1. Sender wallet debited `IDR 250,000` (new balance: `IDR 1,250,000`).<br>2. Recipient wallet credited `IDR 250,000`.<br>3. DB status is `COMPLETED` with immutable timestamp.<br>4. Push notification delivered to both devices in <2s. | Pass |

---

## 4. Negative / Boundary Test Cases

| TC ID | Scenario | Input Data | Expected Result |
|---|---|---|---|
| `TC-SW-042-N1` | Transfer amount exceeds available balance | Amount: `IDR 2,000,000` | Input validation error: `"Insufficient balance"`. Proceed button remains disabled. |
| `TC-SW-042-N2` | Transfer zero or negative amount | Amount: `IDR 0` / `-50,000` | Inline validation error: `"Minimum transfer amount is IDR 10,000"`. |
| `TC-SW-042-N3` | Incorrect OTP entered 3 times | OTP: `000000` | After 3 invalid attempts, account transaction privileges are temporarily locked for 15 minutes; alert sent to registered email. |
| `TC-SW-042-N4` | Network timeout during API processing | Throttle network to offline during Step 6 | App displays clean retry state; backend idempotency key ensures funds are not double-debited. |

---

## 5. Post-Conditions & Audit Trail

* Audit record logged in `audit_ledger_events` with IP, Device Fingerprint, User ID, and cryptographic checksum.
* Daily transaction reconciliation report reflects the exact ledger state without discrepancies.
