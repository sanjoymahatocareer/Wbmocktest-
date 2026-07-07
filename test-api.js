const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://localhost:3000/api/create-payment-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId: "basic",
      userId: "test-user"
    })
  });
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
}

test();
