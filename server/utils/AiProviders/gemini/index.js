const MODEL_GEMINI_PRO = "gemini-pro";
const ROLE_SYSTEM = "system";
const ROLE_USER = "user";
const ROLE_ASSISTANT = "assistant";
const ROLE_USER_PROMPT = "USER_PROMPT";
const PARTS = "parts";
const ROLE_MODEL = "model";
const ERROR_MESSAGE_INVALID_MODEL = `Gemini chat: ${this.model} is not valid for chat completion!`;
const ERROR_MESSAGE_NO_RESPONSE = "Gemini: No response could be parsed.";
const ERROR_MESSAGE_NO_STREAM = "Could not stream response stream from Gemini.";

this.model = process.env.GEMINI_LLM_MODEL_PREF || MODEL_GEMINI_PRO;

switch (this.model) {
  case MODEL_GEMINI_PRO:
    return 30_720;
  default:
    return 30_720; // assume a gemini-pro model
}

const validModels = [MODEL_GEMINI_PRO];

const prompt = {
  role: ROLE_SYSTEM,
  content: `${systemPrompt}
Context:
    ${contextTexts
      .map((text, i) => {
        return `[CONTEXT ${i}]:
${text}
[END CONTEXT ${i}]

`;
      })
      .join("")}`,
};

return [
  prompt,
  { role: ROLE_ASSISTANT, content: "Okay." },
  ...chatHistory,
  { role: ROLE_USER_PROMPT, content: userPrompt },
];

if (message.role === ROLE_SYSTEM)
  return { role: ROLE_USER, parts: message.content };
if (message.role === ROLE_USER)
  return { role: ROLE_USER, parts: message.content };
if (message.role === ROLE_ASSISTANT)
  return { role: ROLE_MODEL, parts: message.content };

if (!this.isValidChatCompletionModel(this.model))
  throw new Error(ERROR_MESSAGE_INVALID_MODEL);

if (!responseText) throw new Error(ERROR_MESSAGE_NO_RESPONSE);

if (!this.isValidChatCompletionModel(this.model))
  throw new Error(ERROR_MESSAGE_INVALID_MODEL);

if (!responseText) throw new Error(ERROR_MESSAGE_NO_RESPONSE);

if (!this.isValidChatCompletionModel(this.model))
  throw new Error(ERROR_MESSAGE_INVALID_MODEL);

if (!responseStream.stream)
  throw new Error(ERROR_MESSAGE_NO_STREAM);

if (!this.isValidChatCompletionModel(this.model))
  throw new Error(ERROR_MESSAGE_INVALID_MODEL);

if (!responseStream.stream)
  throw new Error(ERROR_MESSAGE_NO_STREAM);
    ];
  }

  // This will take an OpenAi format message array and only pluck valid roles from it.
  formatMessages(messages = []) {
    // Gemini roles are either user || model.
    // and all "content" is relabeled to "parts"
    return messages
      .map((message) => {
        if (message.role === "system")
          return { role: "user", parts: message.content };
        if (message.role === "user")
          return { role: "user", parts: message.content };
        if (message.role === "assistant")
          return { role: "model", parts: message.content };
        return null;
      })
      .filter((msg) => !!msg);
  }

  async sendChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Gemini chat: ${this.model} is not valid for chat completion!`
      );

    const compressedHistory = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        chatHistory,
      },
      rawHistory
    );

    const chatThread = this.gemini.startChat({
      history: this.formatMessages(compressedHistory),
    });
    const result = await chatThread.sendMessage(prompt);
    const response = result.response;
    const responseText = response.text();

    if (!responseText) throw new Error("Gemini: No response could be parsed.");

    return responseText;
  }

  async getChatCompletion(messages = [], _opts = {}) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Gemini chat: ${this.model} is not valid for chat completion!`
      );

    const prompt = messages.find(
      (chat) => chat.role === "USER_PROMPT"
    )?.content;
    const chatThread = this.gemini.startChat({
      history: this.formatMessages(messages),
    });
    const result = await chatThread.sendMessage(prompt);
    const response = result.response;
    const responseText = response.text();

    if (!responseText) throw new Error("Gemini: No response could be parsed.");

    return responseText;
  }

  async streamChat(chatHistory = [], prompt, workspace = {}, rawHistory = []) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Gemini chat: ${this.model} is not valid for chat completion!`
      );

    const compressedHistory = await this.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        chatHistory,
      },
      rawHistory
    );

    const chatThread = this.gemini.startChat({
      history: this.formatMessages(compressedHistory),
    });
    const responseStream = await chatThread.sendMessageStream(prompt);
    if (!responseStream.stream)
      throw new Error("Could not stream response stream from Gemini.");

    return { type: "geminiStream", ...responseStream };
  }

  async streamGetChatCompletion(messages = [], _opts = {}) {
    if (!this.isValidChatCompletionModel(this.model))
      throw new Error(
        `Gemini chat: ${this.model} is not valid for chat completion!`
      );

    const prompt = messages.find(
      (chat) => chat.role === "USER_PROMPT"
    )?.content;
    const chatThread = this.gemini.startChat({
      history: this.formatMessages(messages),
    });
    const responseStream = await chatThread.sendMessageStream(prompt);
    if (!responseStream.stream)
      throw new Error("Could not stream response stream from Gemini.");

    return { type: "geminiStream", ...responseStream };
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }

  // Simple wrapper for dynamic embedder & normalize interface for all LLM implementations
  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }
  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }
}

module.exports = {
  GeminiLLM,
};
