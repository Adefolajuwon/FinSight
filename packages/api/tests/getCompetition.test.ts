const Analyst = await import('#services/analyst.service')
import dotenv from 'dotenv'

async function testCompetitorsMethod() {
  // Load environment variables if using any sensitive credentials
  dotenv.config()

  try {
    // Create Analyst instance
    const analyst = new Analyst.default('AOS') // Use `.default`

    // const analyst = new Analyst();

    // Initialize database
    await analyst.initializeDB()

    // Directly test the _getCompetitors method
    const competitors = await analyst._getCompetitors()

    console.log('Competitors retrieved successfully:', competitors)

    // Optional: Add assertions or additional logging
    if (competitors.length === 0) {
      console.warn('No competitors found')
    }
  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1) // Exit with error code
  } finally {
    // Close database connection if needed
    // You might want to add a method to close DB in your Analyst class
  }
}

// Run the test
testCompetitorsMethod()
