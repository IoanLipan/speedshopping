# Database Migrations

This folder contains all database migration files for the SpeedShopping application.

## Migration Naming Convention

Migrations are named with the following pattern:
```
{version}_{description}.sql
```

Example: `001_initial_schema.sql`

## Migration Order

Migrations are executed in numerical order:

1. `000_migration_tracker.sql` - Sets up the migration tracking system
2. `001_initial_schema.sql` - Creates all initial tables
3. `002_add_pricing_fields.sql` - Adds pricing and product URL fields
4. `003_add_acquired_quantity.sql` - Adds acquired quantity tracking for shopping items

## Running Migrations

### Option 1: Using Supabase SQL Editor (Recommended for now)

1. Go to your Supabase project SQL Editor
2. Copy and paste the contents of each migration file in order
3. Execute them one by one

### Option 2: Using the Migration Runner (Future)

```bash
npm run migrate
```

This will automatically run all pending migrations.

## Creating New Migrations

1. Create a new SQL file with the next version number
2. Use the naming pattern: `{version}_{description}.sql`
3. Include rollback instructions in comments if needed
4. Test the migration on a development database first

## Migration File Structure

Each migration should include:
- A comment describing what the migration does
- Proper `IF NOT EXISTS` or `IF EXISTS` checks
- Validation constraints where appropriate
- Success message using `RAISE NOTICE`

Example:
```sql
-- Description of what this migration does

ALTER TABLE table_name
  ADD COLUMN IF NOT EXISTS new_column TYPE DEFAULT value;

DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
END $$;
```

## Important Notes

- Never modify an existing migration that has been applied to production
- Always use `IF NOT EXISTS` or `IF EXISTS` to make migrations idempotent
- Test migrations thoroughly on development before applying to production
- Keep migrations focused - one migration should do one thing
