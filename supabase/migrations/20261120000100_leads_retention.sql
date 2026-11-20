create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'fsu-apagar-contatos-antigos',
  '30 6 * * *',
  $$ delete from private.leads where created_at < now() - interval '12 months' $$
);
