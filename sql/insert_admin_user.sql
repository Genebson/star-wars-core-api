/*
Run to insert an ADMIN user with the credentials
 - email 'admin@example.com'
 - password 'password'
Required to perform ADMIN operations
NOTE: Works only using the JWT_SECRET specified in the .env.dist file 
*/
INSERT INTO "user" (email, role, password, created_at) VALUES ('admin@example.com', 'ADMIN', '$2b$10$pDUcAEeRnYsBoLDxeimZhu6dvPVxWd9RLol2wRJI5nDKcmVAyrMkm', now())