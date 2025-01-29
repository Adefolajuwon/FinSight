import GeminiService from '#services/gemini.service'
import { HttpContext } from '@adonisjs/core/http'

export default class Agent {
  private GeminiService: GeminiService
  constructor() {
    this.GeminiService = new GeminiService()
  }
  public async TestGemini({ request, response }: HttpContext) {
    try {
      const { prompt } = request.body()
      const response = await this.GeminiService.Testing(prompt)
      console.log(response)
      return response
    } catch (error) {
      console.log(error)
    }
  }
}
