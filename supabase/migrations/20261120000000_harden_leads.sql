create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

alter table public.leads set schema private;

create index if not exists leads_email_created_at_idx on private.leads (email, created_at desc);

create or replace function public.submit_lead(
  p_name text,
  p_email text,
  p_phone text,
  p_interest text,
  p_details text,
  p_source text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(p_email));
begin
  perform pg_advisory_xact_lock(hashtext('fsu_submit_lead'));

  if (
    select count(*) from private.leads
    where created_at > now() - interval '1 hour'
  ) >= 50 then
    raise exception 'limite geral de envios atingido' using errcode = 'PT429';
  end if;

  if (
    select count(*) from private.leads
    where email = v_email and created_at > now() - interval '24 hours'
  ) >= 3 then
    raise exception 'limite de envios por e-mail atingido' using errcode = 'PT429';
  end if;

  insert into private.leads (name, email, phone, interest, details, source)
  values (
    p_name,
    v_email,
    nullif(p_phone, ''),
    p_interest,
    nullif(p_details, ''),
    coalesce(nullif(p_source, ''), 'Contato Geral')
  );
end;
$$;

comment on function public.submit_lead is
  'Única porta de entrada dos contatos do site. Chamada pelo servidor do site com a chave publicável; limita 3 envios por e-mail em 24 h e 50 envios no total por hora.';

revoke all on function public.submit_lead(text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.submit_lead(text, text, text, text, text, text) to anon;
