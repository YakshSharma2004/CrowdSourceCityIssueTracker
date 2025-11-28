// signup-and-test.js
// Usage:
//   node signup-and-test.js <email> <password> <fullName>
// Example:
//   node signup-and-test.js admin@demo.local secret123 "Demo Admin"

const BASE_URL = process.env.API_URL || "http://localhost:8080";

// If you're on Node < 18, uncomment below after installing node-fetch:
//   npm install node-fetch
// import fetch from "node-fetch";
// global.fetch = fetch;

async function signup(email, password, fullName) {
  console.log(`\n=== Signing up user ${email} ===`);

  const body = {
    email,
    fullName,
    password,
    requestedRole: "CITIZEN",
    reason: null
  };

  const resp = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(body)
  });

  const text = await resp.text();
  console.log("Status:", resp.status, resp.statusText);
  console.log("Response body:\n", text);

  if (!resp.ok && resp.status !== 201) {
    console.log("\n⚠️ Signup did not succeed (maybe email already exists?).");
  } else {
    console.log("\n✅ Signup request succeeded (user should now be in app_user).");
  }
}

async function testLogin(email, password) {
  console.log(`\n=== Testing Basic auth for ${email} on GET /api/issues ===`);

  const token = Buffer.from(`${email}:${password}`).toString("base64");

  const resp = await fetch(`${BASE_URL}/api/issues/1?page=0&size=1`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${token}`,
      Accept: "application/json"
    }
  });

  const text = await resp.text();
  console.log("Status:", resp.status, resp.statusText);
  console.log("Response body:\n", text);

  if (resp.status === 401) {
    console.log("\n❌ Still Unauthorized: check that SecurityConfig uses BCrypt and user row exists.");
  } else if (resp.ok) {
    console.log("\n✅ Login and GET /api/issues succeeded with these credentials.");
  } else {
    console.log("\n⚠️ Request reached server but returned non-OK status.");
  }
}

(async () => {
  const [, , email, password, fullName] = process.argv;

  if (!email || !password || !fullName) {
    console.error("Usage: node signup-and-test.js <email> <password> <fullName>");
    process.exit(1);
  }

  try {
    // await signup(email, password, fullName);
    await testLogin(email, password);
  } catch (err) {
    console.error("\n💥 Error in script:", err);
  }
})();
