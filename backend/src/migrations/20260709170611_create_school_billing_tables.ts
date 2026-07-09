import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // ၁။ Users Table (Admin နှင့် ကျောင်းသားများ Login အကောင့်)
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('role').notNullable().defaultTo('student'); // 'admin' သို့မဟုတ် 'student'
    table.timestamps(true, true);
  });

  // ၂။ Courses Table (သင်တန်းများနှင့် ဈေးနှုန်းများ)
  await knex.schema.createTable('courses', (table) => {
    table.increments('id').primary();
    table.string('course_name').notNullable();
    table.text('description');
    table.decimal('fee_amount', 10, 2).notNullable();
    table.integer('duration_months').notNullable();
    table.timestamps(true, true);
  });

  // ၃။ Students Table (ကျောင်းသားအချက်အလက်)
  await knex.schema.createTable('students', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('full_name').notNullable();
    table.string('phone').notNullable();
    table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('SET NULL');
    table.date('enrollment_date').notNullable();
    table.string('status').notNullable().defaultTo('Active'); // 'Active', 'Completed', 'Dropped'
    table.timestamps(true, true);
  });

  // ၄။ Invoices Table (ကျောင်းလခ တောင်းခံလွှာများ)
  await knex.schema.createTable('invoices', (table) => {
    table.increments('id').primary();
    table.integer('student_id').unsigned().notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.decimal('amount_due', 10, 2).notNullable();
    table.decimal('amount_paid', 10, 2).notNullable().defaultTo(0);
    table.date('due_date').notNullable();
    table.string('status').notNullable().defaultTo('Unpaid'); // 'Unpaid', 'Partially_Paid', 'Paid'
    table.timestamps(true, true);
  });

  // ၅။ Payments Table (ငွေပေးချေမှု မှတ်တမ်းများ)
  await knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.integer('invoice_id').unsigned().notNullable().references('id').inTable('invoices').onDelete('CASCADE');
    table.decimal('amount', 10, 2).notNullable();
    table.string('payment_method').notNullable(); // 'Cash', 'KPay', 'WaveMoney', etc.
    table.timestamp('payment_date').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // ဖျက်တဲ့အခါမှာတော့ Child Tables တွေကို အရင်ဖျက်ပြီးမှ Parent တွေကို ဖျက်ရပါမယ်
  await knex.schema.dropTableIfExists('payments');
  await knex.schema.dropTableIfExists('invoices');
  await knex.schema.dropTableIfExists('students');
  await knex.schema.dropTableIfExists('courses');
  await knex.schema.dropTableIfExists('users');
}