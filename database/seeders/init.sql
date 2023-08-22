/* ============================================================================================== */
/* DOMAIN: DOUBLE                                                                                 */
/* ============================================================================================== */
CREATE DOMAIN public.DOUBLE AS DOUBLE PRECISION;
ALTER DOMAIN public.DOUBLE OWNER TO postgres;

/* ============================================================================================== */
/* FUNCTION: __current_user()                                                                     */
/* ============================================================================================== */
DROP FUNCTION IF EXISTS public.__current_user();

CREATE OR REPLACE FUNCTION public.__current_user()
RETURNS INTEGER AS
    $BODY$
DECLARE
	UserID INTEGER = -1;
BEGIN
	SELECT id
	INTO STRICT
	UserID FROM public.users WHERE email = current_setting
	('email');
RETURN UserID;

EXCEPTION
WHEN UNDEFINED_OBJECT THEN
RETURN (SELECT id
FROM public.users
WHERE email = 'admin@email.com');

WHEN NO_DATA_FOUND THEN
RETURN (SELECT id
FROM public.users
WHERE email = 'admin@email.com');

WHEN TOO_MANY_ROWS THEN
RETURN (SELECT id
FROM public.users
WHERE email = 'admin@email.com');
END;
    $BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

ALTER FUNCTION public.__current_user() OWNER TO postgres;

/* ============================================================================================== */
/* TRIGGER FUNCTION: set_modified_by_user_at_date()                                               */
/* ============================================================================================== */
DROP FUNCTION IF EXISTS public.set_modified_by_user_at_date();

CREATE OR REPLACE FUNCTION public.set_modified_by_user_at_date()
  RETURNS TRIGGER AS
    $BODY$
    BEGIN
			NEW.modified_at = NOW() AT TIME ZONE 'UTC';
			NEW.modified_by = __current_user();
    RETURN NEW;
    END;
    $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

ALTER FUNCTION public.set_modified_by_user_at_date() OWNER TO postgres;

/* ============================================================================================== */
/* TRIGGER FUNCTION: set_deleted_by_user_at_date()                                                */
/* ============================================================================================== */
DROP FUNCTION IF EXISTS public.set_deleted_by_user_at_date();

CREATE OR REPLACE FUNCTION public.set_deleted_by_user_at_date()
  RETURNS TRIGGER AS
    $BODY$
    BEGIN
        IF (NEW.deleted <> OLD.deleted AND NEW.deleted) THEN
          NEW.deleted_at = NOW() AT TIME ZONE 'UTC';
    NEW.deleted_by = __current_user();
    END
    IF;
			RETURN NEW;
    END;
    $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

ALTER FUNCTION public.set_deleted_by_user_at_date() OWNER TO postgres;

--------------------------------------------------------------------------------------------------
-- 									Create Crypto Extension										--
--------------------------------------------------------------------------------------------------

CREATE EXTENSION pgcrypto;

/* ============================================================================================== */
/* TRIGGER FUNCTION: enforce_secure_pwd_storage()                                                 */
/* ============================================================================================== */
DROP FUNCTION IF EXISTS public.enforce_secure_pwd_storage();

CREATE OR REPLACE FUNCTION public.enforce_secure_pwd_storage()
  RETURNS TRIGGER AS
    $BODY$
    BEGIN
        IF NEW.password IS NULL OR TRIM(NEW.password)=''
          THEN
        SELECT crypt(gen_random_uuid()
        ::TEXT, gen_salt
        ('bf')) INTO NEW.passwrod;
    -- Generate unique, random, and secure (hashed/non-decipherable), but invalid (not known) passwords.
    ELSE
    SELECT crypt(NEW.password, gen_salt('bf'))
    INTO NEW.password;
    -- Make provided cleartext passwords secure (hashed/non-decipherable).
    END
    IF;
			RETURN NEW;
    END
    $BODY$
    LANGUAGE plpgsql VOLATILE
    COST 100;

ALTER FUNCTION public.enforce_secure_pwd_storage() OWNER TO postgres;

/* ============================================================================================== */
/* INHERITED TABLE: __creation_log                                                                */
/* ============================================================================================== */
DROP TABLE IF EXISTS public.__creation_log;

CREATE TABLE public.__creation_log(
	created_by Varchar(36) NOT NULL DEFAULT __current_user(),
	created_at TIMESTAMP NOT NULL DEFAULT TIMEZONE('UTC' ::TEXT, NOW())
)
WITH (OIDS=FALSE);

COMMENT ON TABLE public.__creation_log IS 'This TABLE is for inheritance use only. It is NOT intended to contain its own data.';

ALTER TABLE public.__creation_log OWNER TO postgres;

/* ============================================================================================== */
/* INHERITED TABLE: __modification_log                                                            */
/* ============================================================================================== */
DROP TABLE IF EXISTS public.__modification_log;

CREATE TABLE public.__modification_log(
	modified_by Varchar(36),
	modified_at TIMESTAMP
) WITH (OIDS=FALSE);

COMMENT ON TABLE public.__modification_log IS 'This TABLE is for inheritance use only. It is NOT intended to contain its own data.';

ALTER TABLE public.__modification_log OWNER TO postgres;

/* ============================================================================================== */
/* INHERITED TABLE: __deletion_log                                                                */
/* ============================================================================================== */
DROP TABLE IF EXISTS public.__deletion_log;

CREATE TABLE public.__deletion_log(
	deleted BOOLEAN NOT NULL DEFAULT FALSE,
	deleted_by Varchar(36),
	deleted_at TIMESTAMP
) WITH (OIDS=FALSE);

COMMENT ON TABLE public.__deletion_log IS 'This TABLE is for inheritance use only. It is NOT intended to contain its own data.';

ALTER TABLE public.__deletion_log OWNER TO postgres;


/*==============================================================*/
/* TABLE: users                                                 */
/*==============================================================*/

CREATE TABLE public.users(
  id VARCHAR(36) NOT NULL,
  email VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
	CONSTRAINT pk_users PRIMARY KEY (id),
	CONSTRAINT ak_user_email UNIQUE (email)
)
INHERITS (public.__creation_log, public.__modification_log, public.__deletion_log)
WITH (OIDS=FALSE);


ALTER TABLE public.users OWNER TO postgres;

DROP TRIGGER IF EXISTS users_enforce_secure_pwd_storage on users;

CREATE TRIGGER users_enforce_secure_pwd_storage
	BEFORE INSERT OR UPDATE OF password ON users
	FOR EACH ROW
	EXECUTE PROCEDURE enforce_secure_pwd_storage();

/*==============================================================*/
/* TABLE: token                                                 */
/*==============================================================*/

CREATE TABLE public.token(
  id SERIAL NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  token_value VARCHAR NOT NULL,
  expiration_date TIMESTAMPTZ,
  CONSTRAINT pk_token PRIMARY KEY (id),
  CONSTRAINT fk_token_user_id FOREIGN KEY (user_id) REFERENCES public.users(id)
);

insert into public.users (created_by, id, name, email, password) 
  values ('01H8C00WPEY9TDHB23P15R4ASC', '01H8C00WPEY9TDHB23P15R4ASC', 'admin', 'admin@email.com', 'admin');
