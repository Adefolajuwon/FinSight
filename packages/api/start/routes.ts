/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ScraperController = () => import('#controllers/scraper.controller')
const AgentController = () => import('#controllers/agent.controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/page', [ScraperController, 'pageData'])
router.post('/test', [AgentController, 'TestGemini'])