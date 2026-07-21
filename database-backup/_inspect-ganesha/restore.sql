--
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "cmsGanesha_goldtheyif";
--
-- Name: cmsGanesha_goldtheyif; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "cmsGanesha_goldtheyif" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE "cmsGanesha_goldtheyif" OWNER TO postgres;

\unrestrict (null)
\connect "cmsGanesha_goldtheyif"
\restrict (null)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: myschema; Type: SCHEMA; Schema: -; Owner: cmsGanesha_goldtheyif
--

CREATE SCHEMA myschema;


ALTER SCHEMA myschema OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Role; Type: TYPE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TYPE myschema."Role" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'AUTHOR',
    'VIEWER'
);


ALTER TYPE myschema."Role" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Status; Type: TYPE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TYPE myschema."Status" AS ENUM (
    'DRAFT',
    'PUBLISH',
    'ARCHIVE'
);


ALTER TYPE myschema."Status" OWNER TO "cmsGanesha_goldtheyif";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Activity; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Activity" (
    id integer NOT NULL,
    title text NOT NULL,
    "desc" text NOT NULL,
    "longDesc" text NOT NULL,
    date text NOT NULL,
    "showTitle" boolean DEFAULT false NOT NULL,
    "instaUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status myschema."Status" DEFAULT 'DRAFT'::myschema."Status" NOT NULL,
    "authorId" integer NOT NULL,
    "isPromo" boolean DEFAULT false NOT NULL
);


ALTER TABLE myschema."Activity" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: ActivityMedia; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."ActivityMedia" (
    "activityId" integer NOT NULL,
    "mediaId" integer NOT NULL
);


ALTER TABLE myschema."ActivityMedia" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Activity_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Activity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Activity_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Activity_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Activity_id_seq" OWNED BY myschema."Activity".id;


--
-- Name: Admin; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Admin" (
    id integer NOT NULL,
    email text NOT NULL,
    name text,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE myschema."Admin" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Admin_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Admin_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Admin_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Admin_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Admin_id_seq" OWNED BY myschema."Admin".id;


--
-- Name: Article; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Article" (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status myschema."Status" DEFAULT 'DRAFT'::myschema."Status" NOT NULL,
    highlight boolean DEFAULT false NOT NULL,
    "categoryId" integer NOT NULL,
    "authorId" integer NOT NULL,
    "thumbnailId" integer
);


ALTER TABLE myschema."Article" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Article_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Article_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Article_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Article_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Article_id_seq" OWNED BY myschema."Article".id;


--
-- Name: CategoryArticle; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."CategoryArticle" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE myschema."CategoryArticle" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: CategoryArticle_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."CategoryArticle_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."CategoryArticle_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: CategoryArticle_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."CategoryArticle_id_seq" OWNED BY myschema."CategoryArticle".id;


--
-- Name: Counter; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Counter" (
    id integer NOT NULL,
    "refId" integer NOT NULL,
    type text NOT NULL,
    count integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE myschema."Counter" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Counter_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Counter_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Counter_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Counter_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Counter_id_seq" OWNED BY myschema."Counter".id;


--
-- Name: Feature; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Feature" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE myschema."Feature" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Feature_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Feature_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Feature_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Feature_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Feature_id_seq" OWNED BY myschema."Feature".id;


--
-- Name: Media; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Media" (
    id integer NOT NULL,
    url text NOT NULL,
    type text NOT NULL,
    title text,
    alt text,
    size integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "uploadedById" integer,
    "publicId" text
);


ALTER TABLE myschema."Media" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Media_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Media_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Media_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Media_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Media_id_seq" OWNED BY myschema."Media".id;


--
-- Name: Package; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Package" (
    id integer NOT NULL,
    "serviceId" integer NOT NULL,
    type text NOT NULL,
    highlight boolean DEFAULT false NOT NULL,
    price integer NOT NULL,
    discount integer NOT NULL,
    "priceOriginal" integer NOT NULL,
    link text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE myschema."Package" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: PackageFeature; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."PackageFeature" (
    "packageId" integer NOT NULL,
    "featureId" integer NOT NULL,
    status boolean DEFAULT true NOT NULL
);


ALTER TABLE myschema."PackageFeature" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: PackageProject; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."PackageProject" (
    "packageId" integer NOT NULL,
    "projectId" integer NOT NULL
);


ALTER TABLE myschema."PackageProject" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: PackageRequirement; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."PackageRequirement" (
    "packageId" integer NOT NULL,
    "requirementId" integer NOT NULL
);


ALTER TABLE myschema."PackageRequirement" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Package_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Package_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Package_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Package_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Package_id_seq" OWNED BY myschema."Package".id;


--
-- Name: Project; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Project" (
    id integer NOT NULL,
    name text NOT NULL,
    "companyName" text NOT NULL,
    link text NOT NULL,
    preview text NOT NULL,
    "previewPublicId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE myschema."Project" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Project_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Project_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Project_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Project_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Project_id_seq" OWNED BY myschema."Project".id;


--
-- Name: Promo; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Promo" (
    id integer NOT NULL,
    url text NOT NULL,
    alt text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    url_desktop text NOT NULL,
    url_mobile text NOT NULL
);


ALTER TABLE myschema."Promo" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Promo_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Promo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Promo_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Promo_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Promo_id_seq" OWNED BY myschema."Promo".id;


--
-- Name: Requirement; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Requirement" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE myschema."Requirement" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Requirement_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Requirement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Requirement_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Requirement_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Requirement_id_seq" OWNED BY myschema."Requirement".id;


--
-- Name: Service; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Service" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE myschema."Service" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Service_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Service_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Service_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Service_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Service_id_seq" OWNED BY myschema."Service".id;


--
-- Name: Testimonial; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Testimonial" (
    id integer NOT NULL,
    "clientPhoto" text,
    "companyLogo" text,
    "clientName" text NOT NULL,
    "companyName" text,
    "clientReview" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "serviceId" integer NOT NULL,
    "clientPhotoPublicId" text,
    "companyLogoPublicId" text
);


ALTER TABLE myschema."Testimonial" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Testimonial_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Testimonial_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Testimonial_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Testimonial_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Testimonial_id_seq" OWNED BY myschema."Testimonial".id;


--
-- Name: User; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text,
    password text NOT NULL,
    role myschema."Role" DEFAULT 'AUTHOR'::myschema."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE myschema."User" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."User_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."User_id_seq" OWNED BY myschema."User".id;


--
-- Name: Wallpaper; Type: TABLE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE TABLE myschema."Wallpaper" (
    id integer NOT NULL,
    url text,
    "publicId" text,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer
);


ALTER TABLE myschema."Wallpaper" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Wallpaper_id_seq; Type: SEQUENCE; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE SEQUENCE myschema."Wallpaper_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE myschema."Wallpaper_id_seq" OWNER TO "cmsGanesha_goldtheyif";

--
-- Name: Wallpaper_id_seq; Type: SEQUENCE OWNED BY; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER SEQUENCE myschema."Wallpaper_id_seq" OWNED BY myschema."Wallpaper".id;


--
-- Name: Activity id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Activity" ALTER COLUMN id SET DEFAULT nextval('myschema."Activity_id_seq"'::regclass);


--
-- Name: Admin id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Admin" ALTER COLUMN id SET DEFAULT nextval('myschema."Admin_id_seq"'::regclass);


--
-- Name: Article id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Article" ALTER COLUMN id SET DEFAULT nextval('myschema."Article_id_seq"'::regclass);


--
-- Name: CategoryArticle id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."CategoryArticle" ALTER COLUMN id SET DEFAULT nextval('myschema."CategoryArticle_id_seq"'::regclass);


--
-- Name: Counter id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Counter" ALTER COLUMN id SET DEFAULT nextval('myschema."Counter_id_seq"'::regclass);


--
-- Name: Feature id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Feature" ALTER COLUMN id SET DEFAULT nextval('myschema."Feature_id_seq"'::regclass);


--
-- Name: Media id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Media" ALTER COLUMN id SET DEFAULT nextval('myschema."Media_id_seq"'::regclass);


--
-- Name: Package id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Package" ALTER COLUMN id SET DEFAULT nextval('myschema."Package_id_seq"'::regclass);


--
-- Name: Project id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Project" ALTER COLUMN id SET DEFAULT nextval('myschema."Project_id_seq"'::regclass);


--
-- Name: Promo id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Promo" ALTER COLUMN id SET DEFAULT nextval('myschema."Promo_id_seq"'::regclass);


--
-- Name: Requirement id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Requirement" ALTER COLUMN id SET DEFAULT nextval('myschema."Requirement_id_seq"'::regclass);


--
-- Name: Service id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Service" ALTER COLUMN id SET DEFAULT nextval('myschema."Service_id_seq"'::regclass);


--
-- Name: Testimonial id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Testimonial" ALTER COLUMN id SET DEFAULT nextval('myschema."Testimonial_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."User" ALTER COLUMN id SET DEFAULT nextval('myschema."User_id_seq"'::regclass);


--
-- Name: Wallpaper id; Type: DEFAULT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Wallpaper" ALTER COLUMN id SET DEFAULT nextval('myschema."Wallpaper_id_seq"'::regclass);


--
-- Data for Name: Activity; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Activity" (id, title, "desc", "longDesc", date, "showTitle", "instaUrl", "createdAt", "updatedAt", status, "authorId", "isPromo") FROM stdin;
\.
COPY myschema."Activity" (id, title, "desc", "longDesc", date, "showTitle", "instaUrl", "createdAt", "updatedAt", status, "authorId", "isPromo") FROM '$$PATH$$/3594.dat';

--
-- Data for Name: ActivityMedia; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."ActivityMedia" ("activityId", "mediaId") FROM stdin;
\.
COPY myschema."ActivityMedia" ("activityId", "mediaId") FROM '$$PATH$$/3596.dat';

--
-- Data for Name: Admin; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Admin" (id, email, name, password, "createdAt") FROM stdin;
\.
COPY myschema."Admin" (id, email, name, password, "createdAt") FROM '$$PATH$$/3581.dat';

--
-- Data for Name: Article; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Article" (id, title, slug, excerpt, content, "createdAt", "updatedAt", status, highlight, "categoryId", "authorId", "thumbnailId") FROM stdin;
\.
COPY myschema."Article" (id, title, slug, excerpt, content, "createdAt", "updatedAt", status, highlight, "categoryId", "authorId", "thumbnailId") FROM '$$PATH$$/3600.dat';

--
-- Data for Name: CategoryArticle; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."CategoryArticle" (id, name, slug, "createdAt", "updatedAt") FROM stdin;
\.
COPY myschema."CategoryArticle" (id, name, slug, "createdAt", "updatedAt") FROM '$$PATH$$/3603.dat';

--
-- Data for Name: Counter; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Counter" (id, "refId", type, count, "createdAt", "updatedAt") FROM stdin;
\.
COPY myschema."Counter" (id, "refId", type, count, "createdAt", "updatedAt") FROM '$$PATH$$/3605.dat';

--
-- Data for Name: Feature; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Feature" (id, name, "createdAt", "updatedAt") FROM stdin;
\.
COPY myschema."Feature" (id, name, "createdAt", "updatedAt") FROM '$$PATH$$/3607.dat';

--
-- Data for Name: Media; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Media" (id, url, type, title, alt, size, "createdAt", "updatedAt", "uploadedById", "publicId") FROM stdin;
\.
COPY myschema."Media" (id, url, type, title, alt, size, "createdAt", "updatedAt", "uploadedById", "publicId") FROM '$$PATH$$/3609.dat';

--
-- Data for Name: Package; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Package" (id, "serviceId", type, highlight, price, discount, "priceOriginal", link, "createdAt", "updatedAt") FROM stdin;
\.
COPY myschema."Package" (id, "serviceId", type, highlight, price, discount, "priceOriginal", link, "createdAt", "updatedAt") FROM '$$PATH$$/3611.dat';

--
-- Data for Name: PackageFeature; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."PackageFeature" ("packageId", "featureId", status) FROM stdin;
\.
COPY myschema."PackageFeature" ("packageId", "featureId", status) FROM '$$PATH$$/3612.dat';

--
-- Data for Name: PackageProject; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."PackageProject" ("packageId", "projectId") FROM stdin;
\.
COPY myschema."PackageProject" ("packageId", "projectId") FROM '$$PATH$$/3613.dat';

--
-- Data for Name: PackageRequirement; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."PackageRequirement" ("packageId", "requirementId") FROM stdin;
\.
COPY myschema."PackageRequirement" ("packageId", "requirementId") FROM '$$PATH$$/3582.dat';

--
-- Data for Name: Project; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Project" (id, name, "companyName", link, preview, "previewPublicId", "createdAt", "updatedAt") FROM stdin;
\.
COPY myschema."Project" (id, name, "companyName", link, preview, "previewPublicId", "createdAt", "updatedAt") FROM '$$PATH$$/3584.dat';

--
-- Data for Name: Promo; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Promo" (id, url, alt, "createdAt", "updatedAt", url_desktop, url_mobile) FROM stdin;
\.
COPY myschema."Promo" (id, url, alt, "createdAt", "updatedAt", url_desktop, url_mobile) FROM '$$PATH$$/3586.dat';

--
-- Data for Name: Requirement; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Requirement" (id, name, "createdAt", "updatedAt") FROM stdin;
\.
COPY myschema."Requirement" (id, name, "createdAt", "updatedAt") FROM '$$PATH$$/3588.dat';

--
-- Data for Name: Service; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Service" (id, name, slug, description, "createdAt", "updatedAt") FROM stdin;
\.
COPY myschema."Service" (id, name, slug, description, "createdAt", "updatedAt") FROM '$$PATH$$/3590.dat';

--
-- Data for Name: Testimonial; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Testimonial" (id, "clientPhoto", "companyLogo", "clientName", "companyName", "clientReview", "createdAt", "updatedAt", "serviceId", "clientPhotoPublicId", "companyLogoPublicId") FROM stdin;
\.
COPY myschema."Testimonial" (id, "clientPhoto", "companyLogo", "clientName", "companyName", "clientReview", "createdAt", "updatedAt", "serviceId", "clientPhotoPublicId", "companyLogoPublicId") FROM '$$PATH$$/3592.dat';

--
-- Data for Name: User; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."User" (id, email, name, password, role, "createdAt", "updatedAt") FROM stdin;
\.
COPY myschema."User" (id, email, name, password, role, "createdAt", "updatedAt") FROM '$$PATH$$/3595.dat';

--
-- Data for Name: Wallpaper; Type: TABLE DATA; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

COPY myschema."Wallpaper" (id, url, "publicId", name, "createdAt", "updatedAt", "userId") FROM stdin;
\.
COPY myschema."Wallpaper" (id, url, "publicId", name, "createdAt", "updatedAt", "userId") FROM '$$PATH$$/3599.dat';

--
-- Name: Activity_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Activity_id_seq"', 51, true);


--
-- Name: Admin_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Admin_id_seq"', 1, false);


--
-- Name: Article_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Article_id_seq"', 36, true);


--
-- Name: CategoryArticle_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."CategoryArticle_id_seq"', 9, true);


--
-- Name: Counter_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Counter_id_seq"', 59, true);


--
-- Name: Feature_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Feature_id_seq"', 195, true);


--
-- Name: Media_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Media_id_seq"', 171, true);


--
-- Name: Package_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Package_id_seq"', 288, true);


--
-- Name: Project_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Project_id_seq"', 30, true);


--
-- Name: Promo_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Promo_id_seq"', 21, true);


--
-- Name: Requirement_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Requirement_id_seq"', 60, true);


--
-- Name: Service_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Service_id_seq"', 11, true);


--
-- Name: Testimonial_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Testimonial_id_seq"', 57, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."User_id_seq"', 6, true);


--
-- Name: Wallpaper_id_seq; Type: SEQUENCE SET; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

SELECT pg_catalog.setval('myschema."Wallpaper_id_seq"', 21, true);


--
-- Name: ActivityMedia ActivityMedia_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."ActivityMedia"
    ADD CONSTRAINT "ActivityMedia_pkey" PRIMARY KEY ("activityId", "mediaId");


--
-- Name: Activity Activity_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY (id);


--
-- Name: Admin Admin_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY (id);


--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: CategoryArticle CategoryArticle_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."CategoryArticle"
    ADD CONSTRAINT "CategoryArticle_pkey" PRIMARY KEY (id);


--
-- Name: Counter Counter_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Counter"
    ADD CONSTRAINT "Counter_pkey" PRIMARY KEY (id);


--
-- Name: Feature Feature_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Feature"
    ADD CONSTRAINT "Feature_pkey" PRIMARY KEY (id);


--
-- Name: Media Media_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Media"
    ADD CONSTRAINT "Media_pkey" PRIMARY KEY (id);


--
-- Name: PackageFeature PackageFeature_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."PackageFeature"
    ADD CONSTRAINT "PackageFeature_pkey" PRIMARY KEY ("packageId", "featureId");


--
-- Name: PackageProject PackageProject_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."PackageProject"
    ADD CONSTRAINT "PackageProject_pkey" PRIMARY KEY ("packageId", "projectId");


--
-- Name: PackageRequirement PackageRequirement_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."PackageRequirement"
    ADD CONSTRAINT "PackageRequirement_pkey" PRIMARY KEY ("packageId", "requirementId");


--
-- Name: Package Package_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Package"
    ADD CONSTRAINT "Package_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Promo Promo_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Promo"
    ADD CONSTRAINT "Promo_pkey" PRIMARY KEY (id);


--
-- Name: Requirement Requirement_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Requirement"
    ADD CONSTRAINT "Requirement_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: Testimonial Testimonial_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Testimonial"
    ADD CONSTRAINT "Testimonial_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wallpaper Wallpaper_pkey; Type: CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Wallpaper"
    ADD CONSTRAINT "Wallpaper_pkey" PRIMARY KEY (id);


--
-- Name: Admin_email_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "Admin_email_key" ON myschema."Admin" USING btree (email);


--
-- Name: Article_slug_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "Article_slug_key" ON myschema."Article" USING btree (slug);


--
-- Name: Article_thumbnailId_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "Article_thumbnailId_key" ON myschema."Article" USING btree ("thumbnailId");


--
-- Name: CategoryArticle_name_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "CategoryArticle_name_key" ON myschema."CategoryArticle" USING btree (name);


--
-- Name: CategoryArticle_slug_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "CategoryArticle_slug_key" ON myschema."CategoryArticle" USING btree (slug);


--
-- Name: Feature_name_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "Feature_name_key" ON myschema."Feature" USING btree (name);


--
-- Name: Requirement_name_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "Requirement_name_key" ON myschema."Requirement" USING btree (name);


--
-- Name: Service_slug_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "Service_slug_key" ON myschema."Service" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "User_email_key" ON myschema."User" USING btree (email);


--
-- Name: Wallpaper_userId_key; Type: INDEX; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

CREATE UNIQUE INDEX "Wallpaper_userId_key" ON myschema."Wallpaper" USING btree ("userId");


--
-- Name: ActivityMedia ActivityMedia_activityId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."ActivityMedia"
    ADD CONSTRAINT "ActivityMedia_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES myschema."Activity"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ActivityMedia ActivityMedia_mediaId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."ActivityMedia"
    ADD CONSTRAINT "ActivityMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES myschema."Media"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Activity Activity_authorId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Activity"
    ADD CONSTRAINT "Activity_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES myschema."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Article Article_authorId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Article"
    ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES myschema."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Article Article_categoryId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Article"
    ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES myschema."CategoryArticle"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Article Article_thumbnailId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Article"
    ADD CONSTRAINT "Article_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES myschema."Media"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Media Media_uploadedById_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Media"
    ADD CONSTRAINT "Media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES myschema."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PackageFeature PackageFeature_featureId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."PackageFeature"
    ADD CONSTRAINT "PackageFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES myschema."Feature"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PackageFeature PackageFeature_packageId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."PackageFeature"
    ADD CONSTRAINT "PackageFeature_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES myschema."Package"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PackageProject PackageProject_packageId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."PackageProject"
    ADD CONSTRAINT "PackageProject_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES myschema."Package"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PackageProject PackageProject_projectId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."PackageProject"
    ADD CONSTRAINT "PackageProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES myschema."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PackageRequirement PackageRequirement_packageId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."PackageRequirement"
    ADD CONSTRAINT "PackageRequirement_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES myschema."Package"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PackageRequirement PackageRequirement_requirementId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."PackageRequirement"
    ADD CONSTRAINT "PackageRequirement_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES myschema."Requirement"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Package Package_serviceId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Package"
    ADD CONSTRAINT "Package_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES myschema."Service"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Testimonial Testimonial_serviceId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Testimonial"
    ADD CONSTRAINT "Testimonial_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES myschema."Service"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Wallpaper Wallpaper_userId_fkey; Type: FK CONSTRAINT; Schema: myschema; Owner: cmsGanesha_goldtheyif
--

ALTER TABLE ONLY myschema."Wallpaper"
    ADD CONSTRAINT "Wallpaper_userId_fkey" FOREIGN KEY ("userId") REFERENCES myschema."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DATABASE "cmsGanesha_goldtheyif"; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE "cmsGanesha_goldtheyif" FROM PUBLIC;
GRANT ALL ON DATABASE "cmsGanesha_goldtheyif" TO "cmsGanesha_goldtheyif";


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

