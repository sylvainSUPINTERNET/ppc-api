-- SELECT 'CREATE DATABASE ppc'
-- WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ppc')\gexec
--
-- CREATE DATABASE IF NOT EXISTS 'ppc';
--


---
CREATE DATABASE ppc
    WITH 
    OWNER = root
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
