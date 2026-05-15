grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.has_role(uuid, public.app_role) to anon;

insert into public.user_roles (user_id, role)
values ('093ba398-3bb4-4f08-82e2-d3c55696f7fa', 'admin'::public.app_role)
on conflict (user_id, role) do nothing;