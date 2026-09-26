const apiKey = process.env.GEMINI_API_KEY;
const model = "gemini-2.0-flash";
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

fetch(endpoint, {
  method: "POST",
  headers: {
    "content-type": "application/json",
    "x-goog-api-key": apiKey,
  },
  body: JSON.stringify({
    contents: [{ role: "user", parts: [{ text: "a cat" }] }],
    generationConfig: { responseModalities: ["IMAGE"] },
  })
}).then(r => {
  console.log(r.status);
  return r.text();
}).then(console.log).catch(console.error);
