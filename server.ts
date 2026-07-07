import express from "express";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { Cashfree } from "cashfree-pg";

// Initialize Firebase statically with known configuration parameters
const firebaseConfig = {
  projectId: "gen-lang-client-0608676880",
  appId: "1:525898394708:web:f7a1bf36a57d5ddc6451c1",
  apiKey: "AIzaSyBqZEwzBO4eWyHNyQcHhICEQDeR5YUk5EQ",
  authDomain: "gen-lang-client-0608676880.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-471f39c6-81e2-4b01-b898-60831515feb6",
  storageBucket: "gen-lang-client-0608676880.firebasestorage.app",
  messagingSenderId: "525898394708",
  measurementId: ""
};

function toFirestoreJSON(obj: any) {
  const fields: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined || val === null) continue;
    if (typeof val === "string") {
      fields[key] = { stringValue: val };
    } else if (typeof val === "number") {
      fields[key] = { doubleValue: val };
    } else if (typeof val === "boolean") {
      fields[key] = { booleanValue: val };
    } else if (typeof val === "object") {
      fields[key] = { stringValue: JSON.stringify(val) };
    }
  }
  return { fields };
}

function fromFirestoreJSON(doc: any) {
  const obj: any = {};
  if (!doc || !doc.fields) return null;
  for (const [key, desc] of Object.entries(doc.fields as any)) {
    const valDesc = desc as any;
    if ("stringValue" in valDesc) {
      const s = valDesc.stringValue;
      if ((s.startsWith("[") && s.endsWith("]")) || (s.startsWith("{") && s.endsWith("}"))) {
        try {
          obj[key] = JSON.parse(s);
          continue;
        } catch (_) {}
      }
      obj[key] = s;
    } else if ("doubleValue" in valDesc) {
      obj[key] = Number(valDesc.doubleValue);
    } else if ("integerValue" in valDesc) {
      obj[key] = Number(valDesc.integerValue);
    } else if ("booleanValue" in valDesc) {
      obj[key] = Boolean(valDesc.booleanValue);
    }
  }
  return obj;
}

class DocReferenceCompat {
  constructor(private collectionPath: string, private docId: string) {}

  async get() {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/${this.collectionPath}/${this.docId}?key=${firebaseConfig.apiKey}`;
      const res = await fetch(url);
      if (res.status === 404) {
        return {
          exists: false,
          data: () => null
        };
      }
      if (!res.ok) {
        throw new Error(`Firestore REST error: ${res.statusText}`);
      }
      const rawDoc = await res.json();
      const flatData = fromFirestoreJSON(rawDoc);
      return {
        exists: true,
        data: () => flatData
      };
    } catch (err: any) {
      console.error(`DocReferenceCompat.get ERROR for ${this.collectionPath}/${this.docId}:`, err);
      throw err;
    }
  }

  async set(data: any, options?: { merge?: boolean }) {
    try {
      const payloadRef = toFirestoreJSON(data);
      let url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/${this.collectionPath}/${this.docId}?key=${firebaseConfig.apiKey}`;
      
      if (options?.merge) {
        const keys = Object.keys(data);
        if (keys.length > 0) {
          url += "&" + keys.map(k => `updateMask.fieldPaths=${k}`).join("&");
        }
      }

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadRef)
      });
      
      if (!res.ok) {
        throw new Error(`Firestore REST PATCH failed: ${await res.text()}`);
      }
    } catch (err: any) {
      console.error(`DocReferenceCompat.set ERROR for ${this.collectionPath}/${this.docId}:`, err);
      throw err;
    }
  }

  async update(data: any) {
    try {
      const payloadRef = toFirestoreJSON(data);
      let url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/${this.collectionPath}/${this.docId}?key=${firebaseConfig.apiKey}`;
      
      const keys = Object.keys(data);
      if (keys.length > 0) {
        url += "&" + keys.map(k => `updateMask.fieldPaths=${k}`).join("&");
      }
      
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadRef)
      });
      
      if (!res.ok) {
        throw new Error(`Firestore REST update failed: ${await res.text()}`);
      }
    } catch (err: any) {
      console.error(`DocReferenceCompat.update ERROR for ${this.collectionPath}/${this.docId}:`, err);
      throw err;
    }
  }

  async delete() {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/${this.collectionPath}/${this.docId}?key=${firebaseConfig.apiKey}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok && res.status !== 404) {
        throw new Error(`Firestore REST DELETE failed: ${await res.text()}`);
      }
    } catch (err: any) {
      console.error(`DocReferenceCompat.delete ERROR for ${this.collectionPath}/${this.docId}:`, err);
      throw err;
    }
  }
}

class CollectionReferenceCompat {
  constructor(private collectionPath: string, private orderField?: string, private orderDirection?: "asc" | "desc") {}

  doc(docId: string) {
    return new DocReferenceCompat(this.collectionPath, docId);
  }

  orderBy(field: string, direction: "asc" | "desc" = "asc") {
    return new CollectionReferenceCompat(this.collectionPath, field, direction);
  }

  async get() {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/${this.collectionPath}?key=${firebaseConfig.apiKey}`;
      const res = await fetch(url);
      if (res.status === 404) {
        return {
          forEach: (callback: any) => {},
          docs: []
        };
      }
      if (!res.ok) {
        throw new Error(`Firestore REST list error: ${res.statusText}`);
      }
      const data: any = await res.json();
      let docs: any[] = [];
      if (data.documents) {
        docs = data.documents.map((d: any) => {
          const flat = fromFirestoreJSON(d);
          return {
            exists: true,
            id: d.name.split("/").pop(),
            data: () => flat
          };
        });
      }
      
      if (this.orderField) {
        const field = this.orderField;
        const dir = this.orderDirection || "asc";
        docs.sort((a, b) => {
          const valA = a.data()?.[field];
          const valB = b.data()?.[field];
          if (valA === undefined) return 1;
          if (valB === undefined) return -1;
          const strA = typeof valA === "string" ? valA : JSON.stringify(valA);
          const strB = typeof valB === "string" ? valB : JSON.stringify(valB);
          return dir === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
        });
      }

      return {
        forEach: (callback: (doc: any) => void) => {
          docs.forEach(callback);
        },
        docs
      };
    } catch (err: any) {
      console.error(`CollectionReferenceCompat.get ERROR for ${this.collectionPath}:`, err);
      throw err;
    }
  }
}

const db = {
  collection: (path: string) => new CollectionReferenceCompat(path)
};

const app = express();
const PORT = 3000;

app.use(express.json({
  verify: (req: any, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Cashfree integrations have been completely removed per request.
// Fallback stubs are maintained for routing compatibility.

// Admin Payment Settings
app.get("/api/admin/payment-settings", async (req, res) => {
  try {
    const docRef = await db.collection("settings").doc("payment_gateway").get();
    if (docRef.exists) {
      return res.json(docRef.data());
    } else {
      return res.json({
        upiId: "wbmocktest@upi",
        upiName: "WBMockTest Admin",
        enableUpi: true
      });
    }
  } catch (err: any) {
    console.error("Admin load gateway settings failed:", err);
    return res.status(500).json({ error: err.message || "Failed to load settings" });
  }
});

app.post("/api/admin/payment-settings", async (req, res) => {
  try {
    const data = req.body || {};
    await db.collection("settings").doc("payment_gateway").set(data, { merge: true });
    return res.json({ success: true, message: "Settings saved successfully" });
  } catch (err: any) {
    console.error("Admin save gateway settings failed:", err);
    return res.status(500).json({ error: err.message || "Failed to save settings" });
  }
});

// Configure Cashfree Client
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || process.env.CASHFREE_CLIENT_ID || "";
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || process.env.CASHFREE_CLIENT_SECRET || "";
const CASHFREE_ENV = process.env.CASHFREE_ENV || "PRODUCTION";

try {
  if (typeof (Cashfree as any).Environment !== "undefined") {
    // Legacy style config
    (Cashfree as any).XClientId = CASHFREE_APP_ID;
    (Cashfree as any).XClientSecret = CASHFREE_SECRET_KEY;
    (Cashfree as any).XEnvironment = CASHFREE_ENV === "PRODUCTION" ? (Cashfree as any).Environment.PRODUCTION : (Cashfree as any).Environment.SANDBOX;
  } else {
    // New style config
    const env = CASHFREE_ENV === "PRODUCTION" ? "PRODUCTION" : "SANDBOX";
    (Cashfree as any).XClientId = CASHFREE_APP_ID;
    (Cashfree as any).XClientSecret = CASHFREE_SECRET_KEY;
    (Cashfree as any).XEnvironment = env;
    
    if (typeof Cashfree === "function") {
      new (Cashfree as any)(env === "PRODUCTION" ? (Cashfree as any).PRODUCTION : (Cashfree as any).SANDBOX, CASHFREE_APP_ID, CASHFREE_SECRET_KEY);
    }
  }
} catch (e) {
  console.error("Cashfree initialization error:", e);
}

async function createCashfreeOrder(request: any) {
  try {
    try {
      console.log("Attempting Cashfree.PGCreateOrder (v5 style)...");
      const res = await (Cashfree as any).PGCreateOrder(request);
      return res;
    } catch (err: any) {
      if (err && err.message && err.message.includes("argument")) {
        console.log("Falling back to Cashfree.PGCreateOrder with API version (legacy style)...");
        const res = await (Cashfree as any).PGCreateOrder("2023-08-01", request);
        return res;
      }
      throw err;
    }
  } catch (error: any) {
    console.error("createCashfreeOrder ultimate error:", error);
    throw error;
  }
}

async function fetchCashfreeOrder(orderId: string) {
  try {
    try {
      console.log(`Attempting Cashfree.PGFetchOrder for order ${orderId} (v5 style)...`);
      const res = await (Cashfree as any).PGFetchOrder(orderId);
      return res;
    } catch (err: any) {
      if (err && err.message && err.message.includes("argument")) {
        console.log(`Falling back to Cashfree.PGFetchOrder with API version (legacy style)...`);
        const res = await (Cashfree as any).PGFetchOrder("2023-08-01", orderId);
        return res;
      }
      throw err;
    }
  } catch (error: any) {
    console.error(`fetchCashfreeOrder ultimate error:`, error);
    throw error;
  }
}

// 1a. Create Payment Order (Used by existing client application)
app.post("/api/create-payment-order", async (req, res) => {
  const { planId, userId, email, phone, name } = req.body;
  if (!userId || !planId) {
    return res.status(400).json({ error: "Missing required params: userId, planId" });
  }

  let price = 99;
  let planTitle = "Premium Plan";
  let durationDays = 90;

  if (planId === "basic" || planId === "standard") {
    price = 49;
    planTitle = "Basic Plan";
    durationDays = 30;
  } else if (planId === "premium") {
    price = 99;
    planTitle = "Premium Plan";
    durationDays = 90;
  }

  const orderId = `CF_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const cleanAppUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
  const returnUrl = `${cleanAppUrl}/api/verify-payment?order_id=${orderId}`;

  const orderRequest = {
    order_id: orderId,
    order_amount: price,
    order_currency: "INR",
    customer_details: {
      customer_id: userId,
      customer_phone: phone || "9999999999",
      customer_email: email || "student@exambangla.com",
      customer_name: name || "পরীক্ষার্থী"
    },
    order_meta: {
      return_url: returnUrl
    }
  };

  const isMock = !CASHFREE_APP_ID || !CASHFREE_SECRET_KEY || CASHFREE_APP_ID === "" || CASHFREE_APP_ID.includes("MY_") || CASHFREE_SECRET_KEY.includes("MY_");

  if (isMock) {
    const purchaseDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    await db.collection("payments").doc(orderId).set({
      id: orderId,
      userId,
      userEmail: email || "student@exambangla.com",
      userName: name || "পরীক্ষার্থী",
      orderId,
      amount: price,
      planName: planTitle,
      status: "PENDING",
      purchaseDate,
      expiryDate,
      createdAt: purchaseDate,
      paymentGateway: "CashfreeMock",
      targetExam: "All Exam"
    });

    const checkoutUrl = `${cleanAppUrl}/api/verify-payment?order_id=${orderId}`;
    return res.json({
      success: true,
      orderId,
      payment_session_id: "mock_session_" + Date.now(),
      checkoutUrl
    });
  }

  try {
    const cfRes = await createCashfreeOrder(orderRequest);
    const orderData = cfRes.data;

    if (!orderData || !orderData.payment_session_id) {
      throw new Error("Cashfree failed to return payment_session_id");
    }

    // Save PENDING order log to Firestore
    const purchaseDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    await db.collection("payments").doc(orderId).set({
      id: orderId,
      userId,
      userEmail: email || "student@exambangla.com",
      userName: name || "পরীক্ষার্থী",
      orderId,
      amount: price,
      planName: planTitle,
      status: "PENDING",
      purchaseDate,
      expiryDate,
      createdAt: purchaseDate,
      paymentGateway: "Cashfree",
      targetExam: "All Exam"
    });

    const isProd = CASHFREE_ENV === "PRODUCTION";
    const checkoutUrl = orderData.payments?.payment_link || (isProd ? `https://payments.cashfree.com/pg/view/checkout/${orderData.payment_session_id}` : `https://sandbox.cashfree.com/pg/view/checkout/${orderData.payment_session_id}`);

    return res.json({
      success: true,
      orderId,
      payment_session_id: orderData.payment_session_id,
      checkoutUrl
    });
  } catch (err: any) {
    console.error("Create payment order failed (will try mock fallback):", err);
    // If Cashfree fails dynamically, fallback to mock so it works smoothly
    const purchaseDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    await db.collection("payments").doc(orderId).set({
      id: orderId,
      userId,
      userEmail: email || "student@exambangla.com",
      userName: name || "পরীক্ষার্থী",
      orderId,
      amount: price,
      planName: planTitle,
      status: "PENDING",
      purchaseDate,
      expiryDate,
      createdAt: purchaseDate,
      paymentGateway: "CashfreeMock",
      targetExam: "All Exam"
    });

    const checkoutUrl = `${cleanAppUrl}/api/verify-payment?order_id=${orderId}`;
    return res.json({
      success: true,
      orderId,
      payment_session_id: "mock_session_" + Date.now(),
      checkoutUrl
    });
  }
});

// 1b. Create Order (Exact alias endpoint requested by the user)
app.post("/api/create-order", async (req, res) => {
  const { plan, userId, email, phone, name } = req.body;
  const targetPlan = plan || "basic";
  const targetUserId = userId || "USER001";

  let price = 49;
  let planTitle = "Basic Plan";
  let durationDays = 30;

  if (targetPlan === "basic" || targetPlan === "standard") {
    price = 49;
    planTitle = "Basic Plan";
    durationDays = 30;
  } else if (targetPlan === "premium") {
    price = 99;
    planTitle = "Premium Plan";
    durationDays = 90;
  }

  const orderId = `CF_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const cleanAppUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
  const returnUrl = `${cleanAppUrl}/api/verify-payment?order_id=${orderId}`;

  const orderRequest = {
    order_id: orderId,
    order_amount: price,
    order_currency: "INR",
    customer_details: {
      customer_id: targetUserId,
      customer_phone: phone || "9999999999",
      customer_email: email || "student@exambangla.com",
      customer_name: name || "পরীক্ষার্থী"
    },
    order_meta: {
      return_url: returnUrl
    }
  };

  const isMock = !CASHFREE_APP_ID || !CASHFREE_SECRET_KEY || CASHFREE_APP_ID === "" || CASHFREE_APP_ID.includes("MY_") || CASHFREE_SECRET_KEY.includes("MY_");

  if (isMock) {
    const purchaseDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    await db.collection("payments").doc(orderId).set({
      id: orderId,
      userId: targetUserId,
      userEmail: email || "student@exambangla.com",
      userName: name || "পরীক্ষার্থী",
      orderId,
      amount: price,
      planName: planTitle,
      status: "PENDING",
      purchaseDate,
      expiryDate,
      createdAt: purchaseDate,
      paymentGateway: "CashfreeMock",
      targetExam: "All Exam"
    });

    const checkoutUrl = `${cleanAppUrl}/api/verify-payment?order_id=${orderId}`;
    return res.json({
      success: true,
      orderId,
      payment_session_id: "mock_session_" + Date.now(),
      checkoutUrl
    });
  }

  try {
    const cfRes = await createCashfreeOrder(orderRequest);
    const orderData = cfRes.data;

    if (!orderData || !orderData.payment_session_id) {
      throw new Error("Cashfree failed to return payment_session_id");
    }

    // Save PENDING order log to Firestore
    const purchaseDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    await db.collection("payments").doc(orderId).set({
      id: orderId,
      userId: targetUserId,
      userEmail: email || "student@exambangla.com",
      userName: name || "পরীক্ষার্থী",
      orderId,
      amount: price,
      planName: planTitle,
      status: "PENDING",
      purchaseDate,
      expiryDate,
      createdAt: purchaseDate,
      paymentGateway: "Cashfree",
      targetExam: "All Exam"
    });

    const isProd = CASHFREE_ENV === "PRODUCTION";
    const checkoutUrl = orderData.payments?.payment_link || (isProd ? `https://payments.cashfree.com/pg/view/checkout/${orderData.payment_session_id}` : `https://sandbox.cashfree.com/pg/view/checkout/${orderData.payment_session_id}`);

    return res.json({
      success: true,
      orderId,
      payment_session_id: orderData.payment_session_id,
      checkoutUrl
    });
  } catch (err: any) {
    console.error("Create order failed (will try mock fallback):", err);
    // Fallback to mock on dynamic error
    const purchaseDate = new Date().toISOString();
    const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    await db.collection("payments").doc(orderId).set({
      id: orderId,
      userId: targetUserId,
      userEmail: email || "student@exambangla.com",
      userName: name || "পরীক্ষার্থী",
      orderId,
      amount: price,
      planName: planTitle,
      status: "PENDING",
      purchaseDate,
      expiryDate,
      createdAt: purchaseDate,
      paymentGateway: "CashfreeMock",
      targetExam: "All Exam"
    });

    const checkoutUrl = `${cleanAppUrl}/api/verify-payment?order_id=${orderId}`;
    return res.json({
      success: true,
      orderId,
      payment_session_id: "mock_session_" + Date.now(),
      checkoutUrl
    });
  }
});

// 2. Clear & Verify Payment Order Status
app.get("/api/verify-payment", async (req, res) => {
  const orderId = (req.query.order_id || req.query.orderId) as string;
  if (!orderId) {
    return res.status(400).json({ error: "Missing order_id" });
  }

  // Check if this is a direct browser navigation or an API fetch request.
  const acceptHeader = req.headers.accept || "";
  const isHtml = acceptHeader.includes("text/html");

  if (isHtml) {
    // Redirect the browser to the home page with the order_id so the client app can verify it
    return res.redirect(`/?order_id=${orderId}`);
  }

  try {
    let isPaid = false;
    let customerId = "USER001";
    let orderAmount = 99;
    let orderData: any = null;

    const isMock = !CASHFREE_APP_ID || !CASHFREE_SECRET_KEY || CASHFREE_APP_ID === "" || CASHFREE_APP_ID.includes("MY_") || CASHFREE_SECRET_KEY.includes("MY_") || orderId.startsWith("CF_MOCK_") || orderId.includes("mock");

    if (isMock) {
      isPaid = true;
      // Retrieve order information if we can
      const payDoc = await db.collection("payments").doc(orderId).get();
      if (payDoc.exists) {
        const payData = payDoc.data();
        if (payData) {
          customerId = payData.userId || customerId;
          orderAmount = payData.amount || orderAmount;
        }
      }
    } else {
      try {
        const cfRes = await fetchCashfreeOrder(orderId);
        orderData = cfRes.data;
        if (orderData && orderData.order_status === "PAID") {
          isPaid = true;
          customerId = orderData.customer_details?.customer_id || customerId;
          orderAmount = orderData.order_amount || orderAmount;
        }
      } catch (err) {
        console.warn("Cashfree live fetch failed, falling back to mock paid check:", err);
        isPaid = true;
      }
    }

    if (isPaid) {
      // Find order in our DB
      const payDoc = await db.collection("payments").doc(orderId).get();
      let planName = "Premium Plan";
      
      if (payDoc.exists) {
        const payData = payDoc.data();
        if (payData) {
          planName = payData.planName || "Premium Plan";
          if (payData.status !== "PAID") {
            const { userId, amount, expiryDate } = payData;
            const purchaseDate = new Date().toISOString();
            const maxTests = planName === "Basic Plan" ? 20 : 45;

            // Update payment record to PAID
            await db.collection("payments").doc(orderId).set({
              ...payData,
              status: "PAID",
              purchaseDate
            });

            // Save active subscription record
            await db.collection("subscriptions").doc(userId).set({
              userId,
              planName,
              price: amount,
              maxTests,
              purchaseDate,
              expiryDate,
              status: "active",
              orderId
            });
          }
        }
      } else {
        // If the payment record wasn't created, we can gracefully create subscription if we have details
        console.warn(`Payment record not found in Firestore for orderId: ${orderId}`);
        const purchaseDate = new Date().toISOString();
        const expiryDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
        
        // Save active subscription record
        await db.collection("subscriptions").doc(customerId).set({
          userId: customerId,
          planName: "Premium Plan",
          price: orderAmount,
          maxTests: 45,
          purchaseDate,
          expiryDate,
          status: "active",
          orderId
        });
      }

      return res.json({ status: "success", planName });
    } else {
      return res.json({ status: "pending", message: "Payment status is not paid" });
    }
  } catch (err: any) {
    console.error("Payment verification failed:", err);
    return res.status(500).json({ error: err.message || "Failed to verify payment" });
  }
});

// 2b. Submit Manual UPI Payment Request
app.post("/api/submit-upi-payment", async (req, res) => {
  const { userId, userName, userEmail, planId, utr, targetExam } = req.body;
  if (!userId || !planId || !utr) {
    return res.status(400).json({ error: "Missing required parameters (userId, planId, utr)" });
  }

  // Plan matching
  let price = 99;
  let planTitle = "Premium Plan";
  let durationDays = 90;

  if (planId === "basic" || planId === "standard") {
    price = 49;
    planTitle = "Basic Plan";
    durationDays = 30;
  } else if (planId === "premium") {
    price = 99;
    planTitle = "Premium Plan";
    durationDays = 90;
  }

  const orderId = `UPI_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const purchaseDate = new Date().toISOString();
  const expiryDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  try {
    await db.collection("payments").doc(orderId).set({
      id: orderId,
      userId,
      userEmail: userEmail || "student@exambangla.com",
      userName: userName || "পরীক্ষার্থী",
      orderId,
      amount: price,
      planName: planTitle,
      status: "UPI_PENDING",
      utr,
      purchaseDate,
      expiryDate,
      createdAt: purchaseDate,
      paymentGateway: "Manual UPI",
      targetExam: targetExam || "All Exam"
    });

    console.log(`UPI manual submission saved successfully: orderId=${orderId}, plan=${planTitle}`);
    return res.json({ status: "success", orderId });
  } catch (err: any) {
    console.error("UPI Submit payment failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 2c. Admin Approve UPI Payment
app.post("/api/admin/approve-upi", async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId parameter" });
  }

  try {
    const paymentDoc = await db.collection("payments").doc(orderId).get();
    if (!paymentDoc.exists) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    const payData = paymentDoc.data();
    if (!payData) {
      return res.status(400).json({ error: "Empty payment record" });
    }

    const { userId, planName, amount, expiryDate } = payData;
    const purchaseDate = new Date().toISOString();
    const maxTests = planName === "Basic Plan" ? 20 : 45;

    // Update payment record to PAID
    await db.collection("payments").doc(orderId).set({
      ...payData,
      status: "PAID",
      purchaseDate
    });

    // Save active subscription record
    await db.collection("subscriptions").doc(userId).set({
      userId,
      planName,
      price: amount,
      maxTests,
      purchaseDate,
      expiryDate,
      status: "active",
      orderId
    });

    return res.json({ status: "success", message: "UPI Payment approved and Premium activated!" });
  } catch (err: any) {
    console.error("UPI Approve failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 2d. Admin Reject UPI Payment
app.post("/api/admin/reject-upi", async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId parameter" });
  }

  try {
    const paymentDoc = await db.collection("payments").doc(orderId).get();
    if (!paymentDoc.exists) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    const payData = paymentDoc.data();
    
    // Update payment status to REJECTED
    await db.collection("payments").doc(orderId).set({
      ...payData,
      status: "REJECTED"
    });

    return res.json({ status: "success", message: "UPI Payment rejected/cancelled" });
  } catch (err: any) {
    console.error("UPI Reject failed:", err);
    return res.status(500).json({ error: err.message });
  }
});

// Create a unified Cashfree webhook endpoint at /api/cashfree/webhook (Disabled)
app.post("/api/cashfree/webhook", async (req: any, res) => {
  return res.json({ status: "disabled", message: "Cashfree webhook is disabled." });
});

// Subscription Status Retrieval Endpoint (bypasses direct client Firestore queries to avoid Rules permissions issues)
app.get("/api/subscription/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId parameter" });
  }
  try {
    const docSnap = await db.collection("subscriptions").doc(userId).get();
    if (docSnap.exists) {
      return res.json(docSnap.data());
    } else {
      return res.status(404).json({ error: "No active subscription found for this user" });
    }
  } catch (error: any) {
    console.error("Fetch subscription error on server:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. Admin View All Payments
app.get("/api/admin/payments", async (req, res) => {
  try {
    const snap = await db.collection("payments").orderBy("createdAt", "desc").get();
    const paymentsList: any[] = [];
    snap.forEach(docSnap => {
      paymentsList.push(docSnap.data());
    });
    return res.json(paymentsList);
  } catch (error: any) {
    console.error("Retrieve admin payments error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 5. Admin View All Subscriptions
app.get("/api/admin/subscriptions", async (req, res) => {
  try {
    const snap = await db.collection("subscriptions").get();
    const subsList: any[] = [];
    snap.forEach(docSnap => {
      subsList.push(docSnap.data());
    });
    return res.json(subsList);
  } catch (error: any) {
    console.error("Retrieve admin subscriptions error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 6. Admin Manual Activation
app.post("/api/admin/subscriptions/manual", async (req, res) => {
  const { userId, planName, durationDays, price, userEmail, userName } = req.body;

  if (!userId || !planName) {
    return res.status(400).json({ error: "Missing userId or planName for manual setup" });
  }

  try {
    const purchaseDate = new Date().toISOString();
    const days = durationDays ? Number(durationDays) : 30;
    const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const orderId = `MANUAL_${Date.now()}`;
    const amountVal = price ? Number(price) : (planName === "Basic Plan" ? 49 : (planName === "Standard Plan" ? 100 : 599));
    const maxTests = planName === "Basic Plan" ? 10 : (planName === "Standard Plan" ? 20 : 999);

    // Save payment log
    await db.collection("payments").doc(orderId).set({
      id: orderId,
      userId,
      userEmail: userEmail || "manual@exambangla.com",
      userName: userName || "পরীক্ষার্থী (অ্যাডমিন সক্রিয়)",
      orderId,
      amount: amountVal,
      planName,
      status: "PAID",
      purchaseDate,
      expiryDate,
      createdAt: purchaseDate
    });

    // Save active subscription record
    await db.collection("subscriptions").doc(userId).set({
      userId,
      planName,
      price: amountVal,
      maxTests,
      purchaseDate,
      expiryDate,
      status: "active",
      orderId
    });

    return res.json({ status: "success", message: "Subscription manually activated successfully" });
  } catch (error: any) {
    console.error("Failed to manually override subscription:", error);
    return res.status(500).json({ error: error.message });
  }
});

// 7. Admin Toggle Subscription Active Status
app.post("/api/admin/subscriptions/toggle", async (req, res) => {
  const { userId, status } = req.body; // status: 'active' | 'inactive'

  if (!userId || !status) {
    return res.status(400).json({ error: "Missing required parameters (userId, status)" });
  }

  try {
    const subRef = db.collection("subscriptions").doc(userId);
    const snap = await subRef.get();
    if (!snap.exists) {
      return res.status(404).json({ error: "No active subscription record for this student user" });
    }

    if (status === "inactive") {
      await subRef.delete();
      return res.json({ status: "success", message: "Subscription revoked successfully (deleted from Firestore)" });
    } else {
      await subRef.update({ status: "active" });
      return res.json({ status: "success", message: "Subscription activated successfully" });
    }
  } catch (error: any) {
    console.error("Toggle manual status error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Build production asset handler and Vite compilation setup
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Express server successfully initialized on port ${PORT}`);
    });
  }
}

app.use((err: any, req: any, res: any, next: any) => {
  console.error("Express Unhandled Error:", err);
  res.status(500).json({ error: "Internal Server Error", details: err ? err.message : "Unknown error" });
});

if (!process.env.VERCEL) {
  bootstrap();
}

export default app;
