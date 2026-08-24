create table public.parking_lots (
  id bigint generated always as identity primary key,
  source text not null check (source in ('daejeon_realtime', 'sharenuri')),
  source_key text not null,
  name text not null,
  latitude double precision,
  longitude double precision,
  address text,
  phone text,
  total_spaces integer check (total_spaces is null or total_spaces >= 0),
  available_spaces integer check (available_spaces is null or available_spaces >= 0),
  fee_type text,
  base_minutes integer,
  base_fee integer,
  additional_minutes integer,
  additional_fee integer,
  surcharge_base_minutes integer,
  surcharge_minutes integer,
  surcharge_fee integer,
  weekday_open text,
  weekday_close text,
  saturday_open text,
  saturday_close text,
  holiday_open text,
  holiday_close text,
  operating_days text,
  reservation_url text,
  image_url text,
  synced_at timestamptz not null default now(),
  raw_data jsonb not null default '{}'::jsonb,
  constraint parking_lots_source_key_unique unique (source, source_key)
);

create index parking_lots_location_idx on public.parking_lots (latitude, longitude);
create index parking_lots_available_idx on public.parking_lots (available_spaces desc nulls last);
create index parking_lots_name_idx on public.parking_lots (name);

alter table public.parking_lots enable row level security;

revoke all on table public.parking_lots from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.parking_lots to anon, authenticated;

create policy "Public parking lots are readable"
on public.parking_lots
for select
to anon, authenticated
using (true);
