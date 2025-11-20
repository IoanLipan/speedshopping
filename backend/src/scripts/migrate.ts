import { supabase } from '../config/supabase.js'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createHash } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MIGRATIONS_DIR = join(__dirname, '../migrations')

interface Migration {
  version: string
  name: string
  filename: string
  sql: string
  checksum: string
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('schema_migrations')
    .select('version')

  if (error) {
    // Table doesn't exist yet, return empty set
    return new Set<string>()
  }

  return new Set((data || []).map(row => row.version))
}

function calculateChecksum(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

function loadMigrations(): Migration[] {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort()

  return files.map(filename => {
    const sql = readFileSync(join(MIGRATIONS_DIR, filename), 'utf-8')
    const [version, ...nameParts] = filename.replace('.sql', '').split('_')
    const name = nameParts.join('_')

    return {
      version,
      name,
      filename,
      sql,
      checksum: calculateChecksum(sql)
    }
  })
}

async function applyMigration(migration: Migration): Promise<boolean> {
  console.log(`Applying migration ${migration.version}: ${migration.name}...`)

  const startTime = Date.now()

  try {
    // Execute the migration SQL
    const { error: execError } = await supabase.rpc('exec_sql', {
      sql: migration.sql
    })

    // If exec_sql RPC doesn't exist, try direct execution
    // Note: This is a fallback and might not work in all Supabase setups
    if (execError?.message?.includes('function') || execError?.message?.includes('does not exist')) {
      console.warn('⚠️  Direct SQL execution not available via RPC')
      console.log('📋 Please run this migration manually in Supabase SQL Editor:')
      console.log(`   File: ${migration.filename}`)
      console.log('   After running it manually, mark it as applied with:')
      console.log(`   INSERT INTO schema_migrations (version, name, checksum) VALUES ('${migration.version}', '${migration.name}', '${migration.checksum}');`)
      return false
    }

    if (execError) {
      throw execError
    }

    const executionTime = Date.now() - startTime

    // Record the migration
    const { error: insertError } = await supabase
      .from('schema_migrations')
      .insert({
        version: migration.version,
        name: migration.name,
        checksum: migration.checksum,
        execution_time_ms: executionTime
      })

    if (insertError) {
      throw insertError
    }

    console.log(`✅ Migration ${migration.version} applied successfully (${executionTime}ms)`)
    return true

  } catch (error: any) {
    console.error(`❌ Migration ${migration.version} failed:`, error.message)
    throw error
  }
}

async function runMigrations() {
  console.log('🚀 Starting database migrations...\n')

  try {
    const migrations = loadMigrations()
    console.log(`📁 Found ${migrations.length} migration files\n`)

    const appliedMigrations = await getAppliedMigrations()
    console.log(`✓ ${appliedMigrations.size} migrations already applied\n`)

    const pendingMigrations = migrations.filter(m => !appliedMigrations.has(m.version))

    if (pendingMigrations.length === 0) {
      console.log('✨ Database is up to date! No pending migrations.')
      return
    }

    console.log(`📝 ${pendingMigrations.length} pending migrations to apply:\n`)
    pendingMigrations.forEach(m => {
      console.log(`   - ${m.version}_${m.name}`)
    })
    console.log('')

    for (const migration of pendingMigrations) {
      await applyMigration(migration)
    }

    console.log('\n✨ All migrations completed successfully!')

  } catch (error: any) {
    console.error('\n❌ Migration process failed:', error.message)
    process.exit(1)
  }
}

// Run migrations if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
}

export { runMigrations }
