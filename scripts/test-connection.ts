import 'dotenv/config'
import sql from '../src/lib/postgres'

async function main() {
    try {
        const result = await sql`select version()`
        console.log('✅ Connection Sucessful!', result)
    } catch (error) {
        console.error('❌ Connection Failed:', error)
    } finally {
        await sql.end()
    }
}

main()
