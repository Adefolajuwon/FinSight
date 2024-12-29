/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const DataControllerController = () => import('#controllers/scraper.controller')
const AgentController = () => import('#controllers/agent.controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/test', [DataControllerController, 'StockData'])