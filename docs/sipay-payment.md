Here is the Sipay API documentation in a structured markdown format:

## Sipay API Documentation (1.0.0)

This document provides a conceptual overview of the Sipay Payment Integration and is created to help merchants and developers better understand the working mechanism of the payment system.

### **Access URLs**

| Environment | URL Format |
| :--- | :--- |
| **Test Server** | `https://provisioning.sipay.com.tr/ccpayment` |
| **Live Server** | `https://app.sipay.com.tr/ccpayment` |

---

### **Test Merchant Information**

* **Merchant KEY:** `$2y$10$HmRgYosneqcwHj.UH7upGuyCZqpQ1ITgSMj9Vvxn.t6f.Vdf2SQFO`
* **APP KEY:** `6d4a7e9374a76c15260fcc75e315b0b9`
* **APP SECRET:** `b46a67571aa1e7ef5641dc3fa6f1712a`
* **Merchant ID:** `18309`

---

### **Test with Real Card Information**

* **Merchant KEY:** `$2y$10$0X.RKmBNjKHg7vfJ8N46j.Zq.AU6vBVASro7AGGkaffB4mrdaV4mO`
* **APP KEY:** `077faac7dba364b3f058193de9fea2e6`
* **APP SECRET:** `bb18138fbd6fe9a2512e8933e6f37a01`
* **Merchant ID:** `78640`

---

### **Test Credit Card Information**

* **Card Number (Visa):** `4508034508034509`
* **Card Number (Mastercard):** `5406675406675403`
* **Card Number (Troy):** `6501700139082826`
* **Expiration Date:** `12/26`
* **CVV:** `000`
* **3D Secure Password:** `a`
* **Troy 3D Secure Password:** `123456`

---

## **Auth Token and Installments**

### **Get Token**

`POST /api/token`

This API creates a token to be used in other APIs to authenticate the merchant. It also returns the payment integration option set for the merchant.

**Request Body:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `app_id` | string | Yes | Unique key assigned to the merchant. |
| `app_secret` | string | Yes | Unique and secret key given to the merchant. |

**Responses:**

* **200:** Successful
* **400:** Invalid Response

### **Get Installment Information**

`POST /api/getpos`

This API is responsible for providing the installment list based on the given card number on the payment page.

**Headers:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | string | Yes | Must be `Bearer`. |
| `Accept` | string | Yes | Must be `application/json`. |

**Request Body:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `credit_card` | string | Yes | First 6 digits of the card number. |
| `amount` | double | Yes | Total product amount. |
| `currency_code` | string | Yes | ISO code of the currency (e.g., USD, TRY, EUR). |
| `merchant_key` | string | Yes | Unique key of the merchant provided by Sipay. |

**Responses:**

* **200:** Successful
* **400:** Invalid Response

---

## **Payment, Control, and Refund**

### **3D Payment**

`POST /api/paySmart3D`

This API is used to send order and credit card details to the Sipay payment integration system for 3D secure payments.

**Request Body (application/x-www-form-urlencoded):**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `cc_holder_name` | string | Yes | Cardholder's name. |
| `cc_no` | string | Yes | Credit card number. |
| `expiry_month` | string | Yes | Card expiration month. |
| `expiry_year` | string | Yes | Card expiration year (four digits). |
| `cvv` | string | Yes | 3 or 4-digit security code. |
| `currency_code` | string | Yes | Currency code (USD, TRY, EUR). |
| `installments_number` | integer | Yes | Number of installments. |
| `invoice_id` | string | Yes | Unique order number for the payment. |
| `total` | double | Yes | Amount to be paid. |
| `merchant_key` | string | Yes | Merchant's unique key. |
| `items` | string | Yes | JSON encoded array of items in the cart. |
| `cancel_url` | string | Yes | Redirect URL for failed payments. |
| `return_url` | string | Yes | Redirect URL for successful payments. |
| `hash_key` | string | Yes | Hash key to secure the payment. |

**Responses:**

* **200:** Successful
* **400:** Invalid Response

### **Non-Secure Payment**

`POST /api/paySmart2D`

This API is used to send order and credit card details for non-secure payments.

**Headers:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | string | Yes | Must be `Bearer`. |
| `Accept` | string | Yes | Must be `application/json`. |

**Request Body:**

*Similar to 3D Payment, but without the 3D secure verification step.*

**Responses:**

* **200:** Successful
* **400:** Invalid Response

### **Check Transaction Status**

`POST /api/checkstatus`

Used to inquire about the status of a transaction.

**Headers:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | string | Yes | Must be `Bearer`. |
| `Accept` | string | Yes | Must be `application/json`. |

**Request Body:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `merchant_key` | string | Yes | Merchant's unique key. |
| `invoice_id` | string | Yes | Unique order number. |
| `hash_key` | string | Yes | Hash key. |

**Responses:**

* **200:** Successful
* **400:** Failed

### **Refund Transaction**

`POST /api/refund`

Used to refund a completed transaction.

**Headers:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | string | Yes | Must be `Bearer`. |
| `Accept` | string | Yes | Must be `application/json`. |

**Request Body:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `invoice_id` | string | Yes | Unique order ID. |
| `amount` | double | Yes | Amount to be refunded. |
| `app_id` | string | Yes | App ID provided by Sipay. |
| `app_secret` | string | Yes | App secret provided by Sipay. |
| `merchant_key` | string | Yes | Merchant's unique key. |
| `hash_key` | string | Yes | Hash key. |

**Responses:**

* **200:** Successful
* **400:** Failed

---

## **Card Saving and Payment**

### **Save Card**

`POST /api/saveCard`

This service is used to store card information in the Sipay system and return a token for future payments.

**Headers:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | string | Yes | Must be `Bearer`. |
| `Accept` | string | Yes | Must be `application/json`. |

**Request Body:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `merchant_key` | string | Yes | Merchant's unique key. |
| `card_holder_name`| string | Yes | Cardholder's name. |
| `card_number` | number | Yes | Card number. |
| `expiry_month` | string | Yes | Expiration month. |
| `expiry_year` | string | Yes | Expiration year. |
| `customer_number`| number | Yes | Unique ID for the customer. |
| `hash_key` | string | Yes | Hash key. |

**Responses:**

* **200:** Successful
* **400:** Failed

### **Get Saved Cards**

`GET /api/getCardTokens`

This service allows you to retrieve the saved cards for a customer.

**Headers:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `Authorization` | string | Yes | Must be `Bearer`. |
| `Accept` | string | Yes | Must be `application/json`. |

**Request Body:**

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `merchant_key` | string | Yes | Merchant's unique key. |
| `customer_number`| number | Yes | Unique ID for the customer. |

**Responses:**

* **200:** Successful
* **400:** Failed

---

## **Server and Application Status Codes**

A comprehensive list of server and application status codes is available in the original documentation to handle various responses and errors. These codes provide detailed information about the success or failure of an API request.
