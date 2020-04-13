exports.up = knex =>
  knex.raw(`
    ALTER TABLE scores ADD COLUMN IF NOT EXISTS meta JSONB;
    ALTER TABLE games ADD COLUMN IF NOT EXISTS strict_validation BOOLEAN DEFAULT TRUE;
  `)

exports.down = knex =>
  knex.raw(`
    ALTER TABLE scores DROP COLUMN IF EXISTS meta;
    ALTER TABLE games DROP COLUMN IF EXISTS strict_validation;
  `)