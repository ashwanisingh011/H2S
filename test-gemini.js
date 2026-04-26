import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI('AIzaSyD3ZWuG1sZ_cujSOeLjaL_zP2CJ5Pcf2kQ');

async function testModel(modelName) {
  const model = genAI.getGenerativeModel({ model: modelName });
  try {
    const result = await model.generateContent("Hello");
    console.log(`SUCCESS [${modelName}]:`, result.response.text());
  } catch (e) {
    console.error(`ERROR [${modelName}]:`, e.status, e.statusText, e.errorDetails ? e.errorDetails[1] : "");
  }
}

async function run() {
  await testModel('gemini-1.5-pro');
  await testModel('gemini-2.5-flash');
  await testModel('gemma-2-9b-it');
}
run();
