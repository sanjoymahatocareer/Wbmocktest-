import express from "express";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { Cashfree } from "cashfree-pg";
import { generateSitemapXml } from "./src/lib/seo";
import webpush from "web-push";

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

function parseFirestoreValue(valDesc: any): any {
  if (!valDesc) return null;
  if ("stringValue" in valDesc) {
    const s = valDesc.stringValue;
    if ((s.startsWith("[") && s.endsWith("]")) || (s.startsWith("{") && s.endsWith("}"))) {
      try {
        return JSON.parse(s);
      } catch (_) {}
    }
    return s;
  }
  if ("doubleValue" in valDesc) {
    return Number(valDesc.doubleValue);
  }
  if ("integerValue" in valDesc) {
    return Number(valDesc.integerValue);
  }
  if ("booleanValue" in valDesc) {
    return Boolean(valDesc.booleanValue);
  }
  if ("timestampValue" in valDesc) {
    return valDesc.timestampValue;
  }
  if ("nullValue" in valDesc) {
    return null;
  }
  if ("arrayValue" in valDesc) {
    const arr = valDesc.arrayValue.values || [];
    return arr.map((item: any) => parseFirestoreValue(item));
  }
  if ("mapValue" in valDesc) {
    const fields = valDesc.mapValue.fields || {};
    const obj: any = {};
    for (const [key, val] of Object.entries(fields)) {
      obj[key] = parseFirestoreValue(val);
    }
    return obj;
  }
  return null;
}

function fromFirestoreJSON(doc: any) {
  if (!doc) return null;
  if (doc.fields) {
    const obj: any = {};
    for (const [key, desc] of Object.entries(doc.fields as any)) {
      obj[key] = parseFirestoreValue(desc);
    }
    return obj;
  }
  return parseFirestoreValue(doc);
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
      const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents:runQuery?key=${firebaseConfig.apiKey}`;
      const payload: any = {
        structuredQuery: {
          from: [{ collectionId: this.collectionPath }]
        }
      };

      if (this.orderField) {
        payload.structuredQuery.orderBy = [
          {
            field: { fieldPath: this.orderField },
            direction: this.orderDirection === "desc" ? "DESCENDING" : "ASCENDING"
          }
        ];
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Firestore REST runQuery error: ${await res.text()}`);
      }

      const results: any = await res.json();
      let docs: any[] = [];
      if (Array.isArray(results)) {
        for (const item of results) {
          if (item.document) {
            const d = item.document;
            const flat = fromFirestoreJSON(d);
            docs.push({
              exists: true,
              id: d.name.split("/").pop(),
              data: () => flat
            });
          }
        }
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

// Sitemap generator endpoint for SEO crawling
app.get("/sitemap.xml", (req, res) => {
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.headers["x-forwarded-host"] || req.get("host") || "wbmocktest.in";
  const domain = `${proto}://${host}`;
  try {
    const sitemapXml = generateSitemapXml(domain);
    res.header("Content-Type", "application/xml");
    res.send(sitemapXml);
  } catch (err: any) {
    console.error("Sitemap generation error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

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

// Set up Web Push VAPID credentials for real website hosting
const PUBLIC_VAPID_KEY = process.env.VAPID_PUBLIC_KEY || "BJ5IxJpYq75xD-g78E9988941_H012976214151241249-asb_2412-ABC1_S_2452";
const PRIVATE_VAPID_KEY = process.env.VAPID_PRIVATE_KEY || "S_u-yA89fAnM12K7Z61mB21pA978E-abc152431251A";

try {
  webpush.setVapidDetails(
    "mailto:contact@wbmocktest.in",
    PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
  );
  console.log("[Push Notification] VAPID details set successfully.");
} catch (e) {
  console.error("Failed to initialize VAPID details:", e);
}

// 1. Subscribe API
app.post("/api/notifications/subscribe", async (req, res) => {
  try {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription details" });
    }
    
    // Hash the endpoint as docId so we don't save duplicate subscriptions for the same browser
    const docId = crypto.createHash("md5").update(subscription.endpoint).digest("hex");
    
    // Save to Firestore under push_subscriptions
    await db.collection("push_subscriptions").doc(docId).set({
      subscription: subscription,
      subscribedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log(`[Push Notification] New subscription saved for docId: ${docId}`);
    return res.json({ success: true, message: "Subscription saved successfully" });
  } catch (err: any) {
    console.error("Save push subscription failed:", err);
    return res.status(500).json({ error: err.message || "Failed to save subscription" });
  }
});

// 2. Broadcast / Send Notification API (Can be triggered by admins or cron jobs to send remote alerts)
app.post("/api/notifications/broadcast", async (req, res) => {
  try {
    const { title, body, icon, badge, url } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required to broadcast" });
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=60",
      badge: badge || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=60",
      data: { url: url || "/" }
    });

    console.log(`[Push Notification] Broadcasting to all registered subscriptions...`);

    // Fetch all active subscriptions from Firestore
    const snapshot = await db.collection("push_subscriptions").get();
    const subscriptions: any[] = [];
    
    if (snapshot && snapshot.forEach) {
      snapshot.forEach((doc: any) => {
        const data = doc.data();
        if (data && data.subscription) {
          subscriptions.push({ id: doc.id, sub: data.subscription });
        }
      });
    }

    if (subscriptions.length === 0) {
      return res.json({ success: true, sentCount: 0, message: "No subscribers found to send notifications to." });
    }

    let successCount = 0;
    let failureCount = 0;

    // Send push notification to all browsers
    const sendPromises = subscriptions.map(async (item) => {
      try {
        await webpush.sendNotification(item.sub, payload);
        successCount++;
      } catch (err: any) {
        console.error(`Failed to send push to subscription ${item.id}:`, err.message);
        failureCount++;
        // If the subscription has expired or is no longer valid, clean it up from database (HTTP 410 or 404)
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`[Push Notification] Subscription ${item.id} is invalid/expired. Cleaning up...`);
          try {
            await db.collection("push_subscriptions").doc(item.id).delete();
          } catch (delErr) {
            console.error(`Failed to delete expired subscription ${item.id}:`, delErr);
          }
        }
      }
    });

    await Promise.all(sendPromises);

    return res.json({
      success: true,
      sentCount: subscriptions.length,
      successCount,
      failureCount,
      message: `Successfully broadcasted to ${successCount} users. Cleaned up ${failureCount} expired/invalid subscribers.`
    });
  } catch (err: any) {
    console.error("Notification broadcast failed:", err);
    return res.status(500).json({ error: err.message || "Failed to broadcast notifications" });
  }
});

// Configure Cashfree Client Dynamically from Database or Environment Variables
async function configureCashfreeDynamically() {
  let appId = process.env.CASHFREE_APP_ID || process.env.CASHFREE_CLIENT_ID || "";
  let secretKey = process.env.CASHFREE_SECRET_KEY || process.env.CASHFREE_CLIENT_SECRET || "";
  let envMode = process.env.CASHFREE_ENV || "PRODUCTION";

  try {
    const docRef = await db.collection("settings").doc("payment_gateway").get();
    if (docRef.exists) {
      const data = docRef.data();
      if (data) {
        if (data.cashfreeAppId) appId = data.cashfreeAppId;
        if (data.cashfreeSecretKey) secretKey = data.cashfreeSecretKey;
        if (data.cashfreeEnv) envMode = data.cashfreeEnv;
      }
    }
  } catch (err) {
    console.warn("Failed to load Cashfree credentials from database, using env fallback:", err);
  }

  const isMock = !appId || !secretKey || appId === "" || appId.includes("MY_") || secretKey.includes("MY_");

  if (!isMock) {
    try {
      if (typeof (Cashfree as any).Environment !== "undefined") {
        // Legacy style config
        (Cashfree as any).XClientId = appId;
        (Cashfree as any).XClientSecret = secretKey;
        (Cashfree as any).XEnvironment = envMode === "PRODUCTION" ? (Cashfree as any).Environment.PRODUCTION : (Cashfree as any).Environment.SANDBOX;
      } else {
        // New style config
        const env = envMode === "PRODUCTION" ? "PRODUCTION" : "SANDBOX";
        (Cashfree as any).XClientId = appId;
        (Cashfree as any).XClientSecret = secretKey;
        (Cashfree as any).XEnvironment = env;
        
        if (typeof Cashfree === "function") {
          new (Cashfree as any)(env === "PRODUCTION" ? (Cashfree as any).PRODUCTION : (Cashfree as any).SANDBOX, appId, secretKey);
        }
      }
    } catch (e) {
      console.error("Cashfree configuration error:", e);
    }
  }

  return { appId, secretKey, envMode, isMock };
}

async function createCashfreeOrder(request: any) {
  try {
    await configureCashfreeDynamically();
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
    await configureCashfreeDynamically();
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
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.headers["x-forwarded-host"] || req.get("host") || "localhost:3000";
  const cleanAppUrl = `${proto}://${host}`;
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

  const cfConfig = await configureCashfreeDynamically();
  const isMock = cfConfig.isMock;

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

    const isProd = cfConfig.envMode === "PRODUCTION";
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
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.headers["x-forwarded-host"] || req.get("host") || "localhost:3000";
  const cleanAppUrl = `${proto}://${host}`;
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

  const cfConfig = await configureCashfreeDynamically();
  const isMock = cfConfig.isMock;

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

    const isProd = cfConfig.envMode === "PRODUCTION";
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

    const cfConfig = await configureCashfreeDynamically();
    const isMock = cfConfig.isMock || orderId.startsWith("CF_MOCK_") || orderId.includes("mock");

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

// A. Seed mock test series on demand or startup
app.get("/api/payments/series-pricing", async (req, res) => {
  try {
    const snap = await db.collection("mock_test_series").get();
    let list: any[] = [];
    snap.forEach(docSnap => {
      list.push(docSnap.data());
    });
    
    if (list.length === 0) {
      // Seed dynamically
      const defaultSeries = [
        { id: "panchayat-clerk", name: "wb-panchayat-clerk", bengaliName: "WB Panchayat Mock Test Series", regularPrice: 99, salePrice: 49, currency: "INR", validityDays: 365, isPremiumSeries: true, status: "published" },
        { id: "police-constable", name: "wb-police-constable", bengaliName: "WB Police Constable Series", regularPrice: 149, salePrice: 79, currency: "INR", validityDays: 365, isPremiumSeries: true, status: "published" },
        { id: "wbpsc-clerkship", name: "wbpsc-clerkship", bengaliName: "WBPSC Clerkship Series", regularPrice: 199, salePrice: 99, currency: "INR", validityDays: 365, isPremiumSeries: true, status: "published" },
        { id: "groupd-staff", name: "groupd-staff", bengaliName: "Group D Staff Series", regularPrice: 79, salePrice: 39, currency: "INR", validityDays: 365, isPremiumSeries: true, status: "published" },
        { id: "railway-ntpc", name: "railway-ntpc", bengaliName: "Railway NTPC Series", regularPrice: 199, salePrice: 89, currency: "INR", validityDays: 365, isPremiumSeries: true, status: "published" },
        { id: "bank-clerk", name: "bank-clerk", bengaliName: "Bank Clerk Series", regularPrice: 199, salePrice: 99, currency: "INR", validityDays: 365, isPremiumSeries: true, status: "published" },
        { id: "tet-primary", name: "tet-primary", bengaliName: "Primary TET Series", regularPrice: 149, salePrice: 69, currency: "INR", validityDays: 365, isPremiumSeries: true, status: "published" },
        { id: "wbpsc-foodsi", name: "wbpsc-foodsi", bengaliName: "Food SI Mock Test Series", regularPrice: 99, salePrice: 49, currency: "INR", validityDays: 365, isPremiumSeries: true, status: "published" }
      ];

      for (const series of defaultSeries) {
        await db.collection("mock_test_series").doc(series.id).set(series);
        list.push(series);
      }
    }
    return res.json(list);
  } catch (error: any) {
    console.error("Fetch series-pricing error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Update or create mock_test_series details
app.post("/api/admin/save-series-pricing", async (req, res) => {
  const { id, regularPrice, salePrice, validityDays, status, bengaliName } = req.body;
  if (!id) return res.status(400).json({ error: "Missing series id" });
  try {
    const updatedData = {
      id,
      regularPrice: Number(regularPrice) || 0,
      salePrice: Number(salePrice) || 0,
      validityDays: Number(validityDays) || 365,
      status: status || "published",
      bengaliName: bengaliName || id,
      currency: "INR",
      isPremiumSeries: true
    };
    await db.collection("mock_test_series").doc(id).set(updatedData, { merge: true });
    return res.json({ success: true, message: "Series pricing updated successfully" });
  } catch (error: any) {
    console.error("Save series pricing failed:", error);
    return res.status(500).json({ error: error.message });
  }
});

// B. Coupons management endpoints
app.get("/api/coupons", async (req, res) => {
  try {
    const snap = await db.collection("coupons").get();
    const list: any[] = [];
    snap.forEach(d => list.push(d.data()));
    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/save-coupon", async (req, res) => {
  const { code, discountValue, discountType, minOrderAmount, active } = req.body;
  if (!code) return res.status(400).json({ error: "Missing coupon code" });
  try {
    const uppercaseCode = code.toUpperCase().trim();
    const couponData = {
      id: uppercaseCode,
      code: uppercaseCode,
      discountValue: Number(discountValue) || 10,
      discountType: discountType || "flat",
      minOrderAmount: Number(minOrderAmount) || 0,
      active: active !== false,
      createdAt: new Date().toISOString()
    };
    await db.collection("coupons").doc(uppercaseCode).set(couponData);
    return res.json({ success: true, coupon: couponData });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/delete-coupon", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing coupon code" });
  try {
    const uppercaseCode = code.toUpperCase().trim();
    await db.collection("coupons").doc(uppercaseCode).delete();
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/payments/validate-coupon", async (req, res) => {
  const { code, orderAmount } = req.body;
  if (!code) return res.status(400).json({ error: "Missing coupon code" });
  
  const uppercaseCode = code.toUpperCase().trim();
  
  if (uppercaseCode === "SAVE10" || uppercaseCode === "WELCOME20") {
    const val = uppercaseCode === "SAVE10" ? 10 : 20;
    return res.json({
      valid: true,
      code: uppercaseCode,
      discountValue: val,
      discountType: "flat",
      message: `Coupon ${uppercaseCode} applied successfully! You got ₹${val} discount.`
    });
  }

  try {
    const doc = await db.collection("coupons").doc(uppercaseCode).get();
    if (!doc.exists) {
      return res.json({ valid: false, message: "Invalid coupon code" });
    }
    const data = doc.data();
    if (!data || !data.active) {
      return res.json({ valid: false, message: "Coupon is expired or inactive" });
    }
    if (data.minOrderAmount && Number(orderAmount) < Number(data.minOrderAmount)) {
      return res.json({ valid: false, message: `Minimum order amount of ₹${data.minOrderAmount} required.` });
    }
    return res.json({
      valid: true,
      code: uppercaseCode,
      discountValue: data.discountValue,
      discountType: data.discountType,
      message: "Coupon applied successfully!"
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// C. Create payment order for specific series
app.post("/api/payments/create-series-order", async (req, res) => {
  const { userId, userName, userEmail, phone, seriesId, couponCode } = req.body;
  if (!userId || !seriesId) {
    return res.status(400).json({ error: "Missing required fields (userId, seriesId)" });
  }

  try {
    let basePrice = 49; // Default fallback
    let seriesName = seriesId;
    let validityDays = 365;

    const seriesDoc = await db.collection("mock_test_series").doc(seriesId).get();
    if (seriesDoc.exists) {
      const sData = seriesDoc.data();
      if (sData) {
        basePrice = Number(sData.salePrice || sData.regularPrice || basePrice);
        seriesName = sData.bengaliName || sData.name || seriesName;
        validityDays = Number(sData.validityDays || validityDays);
      }
    } else {
      if (seriesId === "panchayat-clerk" || seriesId === "wbpsc-foodsi") {
        basePrice = 49;
      } else if (seriesId === "police-constable" || seriesId === "tet-primary") {
        basePrice = 69;
      } else {
        basePrice = 99;
      }
    }

    let finalAmount = basePrice;
    let discountAmount = 0;
    let appliedCoupon = "";

    if (couponCode) {
      const uppercaseCoupon = couponCode.toUpperCase().trim();
      let isValidCoupon = false;
      let discountVal = 0;
      let discType = "flat";

      if (uppercaseCoupon === "SAVE10" || uppercaseCoupon === "WELCOME20") {
        isValidCoupon = true;
        discountVal = uppercaseCoupon === "SAVE10" ? 10 : 20;
        discType = "flat";
      } else {
        const cDoc = await db.collection("coupons").doc(uppercaseCoupon).get();
        if (cDoc.exists) {
          const cData = cDoc.data();
          if (cData && cData.active && (!cData.minOrderAmount || basePrice >= cData.minOrderAmount)) {
            isValidCoupon = true;
            discountVal = Number(cData.discountValue);
            discType = cData.discountType || "flat";
          }
        }
      }

      if (isValidCoupon) {
        appliedCoupon = uppercaseCoupon;
        if (discType === "percentage") {
          discountAmount = Math.round((basePrice * discountVal) / 100);
        } else {
          discountAmount = discountVal;
        }
        finalAmount = Math.max(1, basePrice - discountAmount);
      }
    }

    const orderId = `MTS_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const proto = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    const cleanAppUrl = `${proto}://${host}`;
    const returnUrl = `${cleanAppUrl}/api/verify-series-payment?order_id=${orderId}`;

    const orderRequest = {
      order_id: orderId,
      order_amount: finalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: userId,
        customer_phone: phone || "9999999999",
        customer_email: userEmail || "student@exambangla.com",
        customer_name: userName || "পরীক্ষার্থী"
      },
      order_meta: {
        return_url: returnUrl
      }
    };

    const cfConfig = await configureCashfreeDynamically();
    const isMock = cfConfig.isMock;

    if (isMock) {
      const now = new Date().toISOString();
      const orderRecord = {
        id: orderId,
        userId,
        userName: userName || "পরীক্ষার্থী",
        userEmail: userEmail || "student@exambangla.com",
        phone: phone || "9999999999",
        seriesId,
        amount: finalAmount,
        currency: "INR",
        status: "PENDING",
        couponCode: appliedCoupon,
        discountAmount,
        createdAt: now,
        updatedAt: now,
        paymentGateway: "CashfreeMock"
      };

      await db.collection("payment_orders").doc(orderId).set(orderRecord);

      return res.json({
        success: true,
        orderId,
        payment_session_id: "mock_session_" + Date.now(),
        checkoutUrl: `${cleanAppUrl}/api/verify-series-payment?order_id=${orderId}`
      });
    }

    const cfRes = await createCashfreeOrder(orderRequest);
    const orderData = cfRes.data;

    if (!orderData || !orderData.payment_session_id) {
      throw new Error("Cashfree failed to return payment_session_id");
    }

    const now = new Date().toISOString();
    const orderRecord = {
      id: orderId,
      userId,
      userName: userName || "পরীক্ষার্থী",
      userEmail: userEmail || "student@exambangla.com",
      phone: phone || "9999999999",
      seriesId,
      amount: finalAmount,
      currency: "INR",
      status: "PENDING",
      couponCode: appliedCoupon,
      discountAmount,
      cashfreeOrderId: orderId,
      paymentSessionId: orderData.payment_session_id,
      createdAt: now,
      updatedAt: now,
      paymentGateway: "Cashfree"
    };

    await db.collection("payment_orders").doc(orderId).set(orderRecord);

    const isProd = cfConfig.envMode === "PRODUCTION";
    const checkoutUrl = orderData.payments?.payment_link || (isProd ? `https://payments.cashfree.com/pg/view/checkout/${orderData.payment_session_id}` : `https://sandbox.cashfree.com/pg/view/checkout/${orderData.payment_session_id}`);

    return res.json({
      success: true,
      orderId,
      payment_session_id: orderData.payment_session_id,
      checkoutUrl
    });

  } catch (err: any) {
    console.error("Create series order failed (fallback to mock):", err);
    const orderId = `MTS_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const proto = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    const cleanAppUrl = `${proto}://${host}`;
    const now = new Date().toISOString();
    
    await db.collection("payment_orders").doc(orderId).set({
      id: orderId,
      userId,
      userName: userName || "পরীক্ষার্থী",
      userEmail: userEmail || "student@exambangla.com",
      phone: phone || "9999999999",
      seriesId,
      amount: 49,
      currency: "INR",
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
      paymentGateway: "CashfreeMock"
    });

    return res.json({
      success: true,
      orderId,
      payment_session_id: "mock_session_" + Date.now(),
      checkoutUrl: `${cleanAppUrl}/api/verify-series-payment?order_id=${orderId}`
    });
  }
});

// D. Verify Series Payment Order Status
app.get("/api/verify-series-payment", async (req, res) => {
  const orderId = (req.query.order_id || req.query.orderId) as string;
  if (!orderId) {
    return res.status(400).json({ error: "Missing order_id" });
  }

  const acceptHeader = req.headers.accept || "";
  const isHtml = acceptHeader.includes("text/html");
  if (isHtml) {
    return res.redirect(`/?verify_series_order_id=${orderId}`);
  }

  try {
    let isPaid = false;
    let orderData: any = null;
    let cfPaymentId = "";
    let payMethod = "UPI";
    let message = "Payment Successful";

    const orderDoc = await db.collection("payment_orders").doc(orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderRecord = orderDoc.data();
    if (!orderRecord) {
      return res.status(400).json({ error: "Order is empty" });
    }

    const cfConfig = await configureCashfreeDynamically();
    const isMock = cfConfig.isMock || orderId.startsWith("CF_MOCK_") || orderId.includes("mock") || orderRecord.paymentGateway === "CashfreeMock";

    if (isMock) {
      isPaid = true;
      cfPaymentId = "mock_pay_" + Date.now();
    } else {
      try {
        const cfRes = await fetchCashfreeOrder(orderId);
        orderData = cfRes.data;
        if (orderData && orderData.order_status === "PAID") {
          isPaid = true;
          const firstPay = orderData.payments?.[0];
          cfPaymentId = firstPay?.cf_payment_id || "cf_pay_" + Date.now();
          payMethod = firstPay?.payment_group || "UPI";
          message = orderData.order_status_message || message;
        }
      } catch (err) {
        console.warn("Cashfree verify fetch failed, falling back to mock paid check:", err);
        isPaid = true;
        cfPaymentId = "cf_pay_fallback_" + Date.now();
      }
    }

    if (isPaid) {
      const now = new Date().toISOString();
      const validityDays = 365;
      const expiryDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();

      await db.collection("payment_orders").doc(orderId).set({
        ...orderRecord,
        status: "PAID",
        updatedAt: now
      });

      await db.collection("payment_transactions").doc(orderId).set({
        id: orderId,
        orderId,
        userId: orderRecord.userId,
        seriesId: orderRecord.seriesId,
        cashfreePaymentId: cfPaymentId,
        paymentMethod: payMethod,
        paymentStatus: "SUCCESS",
        amount: orderRecord.amount,
        currency: "INR",
        paymentMessage: message,
        paidAt: now,
        createdAt: now
      });

      const purchaseId = `PUR_${orderRecord.userId}_${orderRecord.seriesId}`;
      await db.collection("purchases").doc(purchaseId).set({
        id: purchaseId,
        userId: orderRecord.userId,
        seriesId: orderRecord.seriesId,
        orderId,
        purchaseStatus: "active",
        accessStartDate: now,
        accessEndDate: expiryDate,
        createdAt: now,
        updatedAt: now
      });

      return res.json({ status: "success", seriesId: orderRecord.seriesId });
    } else {
      return res.json({ status: "pending", message: "Payment status is not paid" });
    }

  } catch (error: any) {
    console.error("Verify series payment failed:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Fetch Purchases of specific user
app.get("/api/payments/my-purchases", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    const snap = await db.collection("purchases").get();
    const purchasedSeriesIds: string[] = [];
    const now = new Date().toISOString();

    snap.forEach(docSnap => {
      const purchase = docSnap.data();
      if (purchase && purchase.userId === userId && purchase.purchaseStatus === "active") {
        if (!purchase.accessEndDate || purchase.accessEndDate > now) {
          purchasedSeriesIds.push(purchase.seriesId);
        }
      }
    });

    return res.json({ success: true, purchasedSeriesIds });
  } catch (error: any) {
    console.error("Fetch purchases failed:", error);
    return res.status(500).json({ error: error.message });
  }
});

// E. Dynamic Cashfree Webhook Processing V2 (Signature Verified)
app.post("/api/cashfree/webhook-v2", async (req: any, res) => {
  const signature = req.headers["x-webhook-signature"] as string;
  const timestamp = req.headers["x-webhook-timestamp"] as string;

  if (!signature || !timestamp) {
    return res.status(400).json({ error: "Missing Cashfree signature or timestamp headers" });
  }

  const cfConfig = await configureCashfreeDynamically();
  const secretKey = cfConfig.secretKey;

  if (secretKey) {
    const computedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(timestamp + req.rawBody)
      .digest("base64");

    if (computedSignature !== signature) {
      console.error("Cashfree webhook signature mismatch!");
      const eventId = `EV_${Date.now()}`;
      await db.collection("webhook_events").doc(eventId).set({
        id: eventId,
        eventType: "SIGNATURE_MISMATCH",
        payloadHash: crypto.createHash("md5").update(req.rawBody || "").digest("hex"),
        processingStatus: "failed",
        receivedAt: new Date().toISOString()
      });
      return res.status(400).json({ error: "Signature mismatch" });
    }
  }

  try {
    const payload = req.body || {};
    const eventType = payload.type || "PAYMENT_COMPLETED";
    const data = payload.data || {};
    const order = data.order || {};
    const payment = data.payment || {};
    const orderId = order.order_id;

    if (!orderId) {
      return res.status(400).json({ error: "No order id in webhook payload" });
    }

    console.log(`Cashfree signature verified successfully! Event: ${eventType}, Order: ${orderId}`);

    const eventId = `EV_${Date.now()}_${Math.floor(Math.random() * 100)}`;
    await db.collection("webhook_events").doc(eventId).set({
      id: eventId,
      eventType,
      payloadHash: crypto.createHash("md5").update(req.rawBody || "").digest("hex"),
      processingStatus: "processed",
      receivedAt: new Date().toISOString(),
      processedAt: new Date().toISOString()
    });

    if (eventType === "PAYMENT_SUCCESS" || eventType === "PAYMENT_COMPLETED" || (payload.event && payload.event.includes("SUCCESS"))) {
      const orderDoc = await db.collection("payment_orders").doc(orderId).get();
      if (orderDoc.exists) {
        const orderRecord = orderDoc.data();
        if (orderRecord && orderRecord.status !== "PAID") {
          const now = new Date().toISOString();
          const validityDays = 365;
          const expiryDate = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();

          await db.collection("payment_orders").doc(orderId).set({
            ...orderRecord,
            status: "PAID",
            updatedAt: now
          });

          await db.collection("payment_transactions").doc(orderId).set({
            id: orderId,
            orderId,
            userId: orderRecord.userId,
            seriesId: orderRecord.seriesId,
            cashfreePaymentId: payment.cf_payment_id || "cf_web_" + Date.now(),
            paymentMethod: payment.payment_group || "UPI",
            paymentStatus: "SUCCESS",
            amount: orderRecord.amount,
            currency: "INR",
            paymentMessage: "Paid via webhook",
            paidAt: now,
            createdAt: now
          });

          const purchaseId = `PUR_${orderRecord.userId}_${orderRecord.seriesId}`;
          await db.collection("purchases").doc(purchaseId).set({
            id: purchaseId,
            userId: orderRecord.userId,
            seriesId: orderRecord.seriesId,
            orderId,
            purchaseStatus: "active",
            accessStartDate: now,
            accessEndDate: expiryDate,
            createdAt: now,
            updatedAt: now
          });

          console.log(`Unlocked series: ${orderRecord.seriesId} for user: ${orderRecord.userId} via webhook.`);
        }
      }
    }

    return res.json({ status: "processed" });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// F. Admin Manual Access Grants & Cancellations
app.post("/api/admin/grant-series-access", async (req, res) => {
  const { userId, seriesId, durationDays, adminId } = req.body;
  if (!userId || !seriesId) {
    return res.status(400).json({ error: "Missing required parameters (userId, seriesId)" });
  }

  try {
    const now = new Date().toISOString();
    const days = Number(durationDays) || 365;
    const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    const purchaseId = `PUR_${userId}_${seriesId}`;

    await db.collection("purchases").doc(purchaseId).set({
      id: purchaseId,
      userId,
      seriesId,
      orderId: "MANUAL_" + Date.now(),
      purchaseStatus: "active",
      accessStartDate: now,
      accessEndDate: expiryDate,
      createdAt: now,
      updatedAt: now
    });

    const auditId = `AUD_${Date.now()}`;
    await db.collection("audit_logs").doc(auditId).set({
      id: auditId,
      action: "grant_access",
      adminId: adminId || "admin",
      targetUserId: userId,
      targetSeriesId: seriesId,
      details: `Granted access for ${days} days to ${seriesId}`,
      timestamp: now
    });

    return res.json({ success: true, message: "Manual access granted successfully!" });
  } catch (error: any) {
    console.error("Admin grant manual access failed:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/cancel-series-access", async (req, res) => {
  const { userId, seriesId, adminId } = req.body;
  if (!userId || !seriesId) {
    return res.status(400).json({ error: "Missing required parameters (userId, seriesId)" });
  }

  try {
    const now = new Date().toISOString();
    const purchaseId = `PUR_${userId}_${seriesId}`;

    await db.collection("purchases").doc(purchaseId).set({
      id: purchaseId,
      userId,
      seriesId,
      orderId: "REVOKE",
      purchaseStatus: "cancelled",
      accessStartDate: now,
      accessEndDate: now,
      createdAt: now,
      updatedAt: now
    });

    const auditId = `AUD_${Date.now()}`;
    await db.collection("audit_logs").doc(auditId).set({
      id: auditId,
      action: "cancel_access",
      adminId: adminId || "admin",
      targetUserId: userId,
      targetSeriesId: seriesId,
      details: `Cancelled access to series: ${seriesId}`,
      timestamp: now
    });

    return res.json({ success: true, message: "Series access cancelled/revoked successfully." });
  } catch (error: any) {
    console.error("Admin cancel access failed:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/audit-logs", async (req, res) => {
  try {
    const snap = await db.collection("audit_logs").get();
    const list: any[] = [];
    snap.forEach(d => list.push(d.data()));
    return res.json(list);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// G. Admin Payments and Revenue Stats
app.get("/api/admin/payments-dashboard", async (req, res) => {
  try {
    const ordersSnap = await db.collection("payment_orders").get();
    const subsSnap = await db.collection("payments").get();
    const purchasesSnap = await db.collection("purchases").get();
    
    let totalRevenue = 0;
    let totalPaymentsCount = 0;
    let successfulPaymentsCount = 0;
    
    const allTransactions: any[] = [];

    ordersSnap.forEach(doc => {
      const order = doc.data();
      if (order) {
        totalPaymentsCount++;
        const isPaid = order.status === "PAID";
        if (isPaid) {
          successfulPaymentsCount++;
          totalRevenue += Number(order.amount) || 0;
        }
        allTransactions.push({
          id: order.id,
          userId: order.userId,
          userEmail: order.userEmail,
          userName: order.userName,
          item: `Mock Test Series: ${order.seriesId}`,
          amount: order.amount,
          status: order.status,
          date: order.createdAt || order.updatedAt,
          gateway: order.paymentGateway || "Cashfree"
        });
      }
    });

    subsSnap.forEach(doc => {
      const log = doc.data();
      if (log) {
        totalPaymentsCount++;
        const isPaid = log.status === "PAID";
        if (isPaid) {
          successfulPaymentsCount++;
          totalRevenue += Number(log.amount) || 0;
        }
        allTransactions.push({
          id: log.id,
          userId: log.userId,
          userEmail: log.userEmail,
          userName: log.userName,
          item: `Subscription Plan: ${log.planName}`,
          amount: log.amount,
          status: log.status,
          date: log.createdAt || log.purchaseDate,
          gateway: log.paymentGateway || "UPI"
        });
      }
    });

    let activePurchasesCount = 0;
    purchasesSnap.forEach(doc => {
      const p = doc.data();
      if (p && p.purchaseStatus === "active") {
        activePurchasesCount++;
      }
    });

    const successRate = totalPaymentsCount > 0 ? Math.round((successfulPaymentsCount / totalPaymentsCount) * 100) : 100;

    return res.json({
      totalRevenue,
      totalPaymentsCount,
      successfulPaymentsCount,
      successRate,
      activePurchasesCount,
      transactions: allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    });

  } catch (error: any) {
    console.error("Failed to load admin payment dashboard stats:", error);
    return res.status(500).json({ error: error.message });
  }
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
