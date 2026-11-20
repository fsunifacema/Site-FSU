create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text check (phone is null or char_length(phone) <= 30),
  interest text not null check (interest in ('Escopo Definido', 'Time Dedicado', 'Diagnóstico e Arquitetura', 'Outro')),
  details text check (details is null or char_length(details) <= 2000),
  source text not null default 'Contato Geral' check (source in ('Contato Geral', 'Novo Projeto', 'Agendamento 30min'))
);

comment on table public.leads is 'Contatos enviados pelo formulário do site da FSU. Gravados só pelo servidor com a chave secreta.';

create index leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

revoke all on table public.leads from anon, authenticated;
