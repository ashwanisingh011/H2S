import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyAcKeJtBUdNfwg1BYb_WjkuWJFMA960lKY');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
async function run() {
  try {
    const result = await model.generateContent("Hello");
    console.log("SUCCESS:", result.response.text());
  } catch (e) {
    console.error("ERROR:", e);
  }
}
run();
