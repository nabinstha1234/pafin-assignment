CREATE TABLE public.users(
	created_by varchar(36) NOT NULL DEFAULT __current_user(),
	created_at timestamp without time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
	modified_by varchar(36) NULL,
	modified_at timestamp without time zone NULL,
	deleted boolean NOT NULL DEFAULT false,
	deleted_by varchar(36) NULL,
	deleted_at timestamp without time zone NULL,
	id varchar(36) NOT NULL DEFAULT nextval('users_id_seq'::regclass),
	email character varying NOT NULL,
	name character varying NOT NULL,
	password character varying NOT NULL,
	CONSTRAINT pk_users PRIMARY KEY (id),
	CONSTRAINT ak_user_email UNIQUE (email) 
	)