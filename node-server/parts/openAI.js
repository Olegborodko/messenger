const { OpenAI } = require("openai");

const openai = new OpenAI();

async function transformText(originalText) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `${process.env.OPEN_API_REQUEST}: ${originalText}` },
      ],
      //max_tokens: 150,
    });
    const transformedText = response.choices[0].message.content;
    return transformedText;
  } catch (error) {
    console.error('Error request:', error);
    return null;
  }
}

module.exports = { transformText };
