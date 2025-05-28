-- Update admin permissions for specific user
UPDATE admin_users
SET can_add_admins = true
WHERE id = '28bdc692-3da3-42b9-9598-03041fed1bd9';

-- Notify PostgREST to reload the schema
NOTIFY pgrst, 'reload schema'; 