import {
    GoogleGenerativeAI,
    type FunctionCall,
    type GenerateContentResult,
  } from "@google/generative-ai";
import env from "../../config/env.js";

export default class GeminiService {
  private Gemini: GoogleGenerativeAI;
  constructor(){
    this.Gemini = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  }
  public async Testing (prompt: string) {
    const model = this.Gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response.text()
    console.log(response);
    return response
  } 

}