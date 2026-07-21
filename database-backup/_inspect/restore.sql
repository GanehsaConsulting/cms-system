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

DROP DATABASE "cmsGospace_wonobject";
--
-- Name: cmsGospace_wonobject; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "cmsGospace_wonobject" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE "cmsGospace_wonobject" OWNER TO postgres;

\unrestrict (null)
\connect "cmsGospace_wonobject"
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
-- Name: cmsGospace_wonobject; Type: SCHEMA; Schema: -; Owner: cmsGospace_wonobject
--

CREATE SCHEMA "cmsGospace_wonobject";


ALTER SCHEMA "cmsGospace_wonobject" OWNER TO "cmsGospace_wonobject";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Article; Type: TABLE; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE TABLE "cmsGospace_wonobject"."Article" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    thumbnail text DEFAULT ''::text NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "metaTitle" text DEFAULT ''::text NOT NULL,
    "metaDescription" text DEFAULT ''::text NOT NULL,
    "focusKeyword" text DEFAULT ''::text NOT NULL,
    "readingTime" integer DEFAULT 1 NOT NULL,
    "categoryId" text NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "cmsGospace_wonobject"."Article" OWNER TO "cmsGospace_wonobject";

--
-- Name: Author; Type: TABLE; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE TABLE "cmsGospace_wonobject"."Author" (
    id text NOT NULL,
    name text NOT NULL,
    avatar text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "cmsGospace_wonobject"."Author" OWNER TO "cmsGospace_wonobject";

--
-- Name: Category; Type: TABLE; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE TABLE "cmsGospace_wonobject"."Category" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "cmsGospace_wonobject"."Category" OWNER TO "cmsGospace_wonobject";

--
-- Name: ClientLogo; Type: TABLE; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE TABLE "cmsGospace_wonobject"."ClientLogo" (
    id text NOT NULL,
    logo text NOT NULL,
    "companyName" text NOT NULL,
    "isPublished" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "cmsGospace_wonobject"."ClientLogo" OWNER TO "cmsGospace_wonobject";

--
-- Name: ClientPhoto; Type: TABLE; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE TABLE "cmsGospace_wonobject"."ClientPhoto" (
    id text NOT NULL,
    photo text NOT NULL,
    name text NOT NULL,
    company text NOT NULL,
    "isPublished" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "cmsGospace_wonobject"."ClientPhoto" OWNER TO "cmsGospace_wonobject";

--
-- Name: Price; Type: TABLE; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE TABLE "cmsGospace_wonobject"."Price" (
    id text NOT NULL,
    service jsonb NOT NULL,
    "packageName" jsonb NOT NULL,
    price integer NOT NULL,
    "strikethroughPrice" integer NOT NULL,
    "whatsappLink" jsonb NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    category text DEFAULT ''::text NOT NULL,
    description jsonb DEFAULT '{}'::jsonb NOT NULL,
    highlighted boolean DEFAULT false NOT NULL,
    "serviceSlug" text DEFAULT 'general'::text NOT NULL,
    slug text NOT NULL
);


ALTER TABLE "cmsGospace_wonobject"."Price" OWNER TO "cmsGospace_wonobject";

--
-- Name: PriceFeature; Type: TABLE; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE TABLE "cmsGospace_wonobject"."PriceFeature" (
    id text NOT NULL,
    "priceId" text NOT NULL,
    name jsonb NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "cmsGospace_wonobject"."PriceFeature" OWNER TO "cmsGospace_wonobject";

--
-- Name: SiteAsset; Type: TABLE; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE TABLE "cmsGospace_wonobject"."SiteAsset" (
    id text NOT NULL,
    "imageUrl" text DEFAULT ''::text NOT NULL,
    "publicId" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "cmsGospace_wonobject"."SiteAsset" OWNER TO "cmsGospace_wonobject";

--
-- Data for Name: Article; Type: TABLE DATA; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

COPY "cmsGospace_wonobject"."Article" (id, title, slug, thumbnail, content, status, "publishedAt", "isFeatured", "metaTitle", "metaDescription", "focusKeyword", "readingTime", "categoryId", "authorId", "createdAt", "updatedAt") FROM stdin;
\.
COPY "cmsGospace_wonobject"."Article" (id, title, slug, thumbnail, content, status, "publishedAt", "isFeatured", "metaTitle", "metaDescription", "focusKeyword", "readingTime", "categoryId", "authorId", "createdAt", "updatedAt") FROM '$$PATH$$/3471.dat';

--
-- Data for Name: Author; Type: TABLE DATA; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

COPY "cmsGospace_wonobject"."Author" (id, name, avatar, "createdAt", "updatedAt") FROM stdin;
\.
COPY "cmsGospace_wonobject"."Author" (id, name, avatar, "createdAt", "updatedAt") FROM '$$PATH$$/3470.dat';

--
-- Data for Name: Category; Type: TABLE DATA; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

COPY "cmsGospace_wonobject"."Category" (id, name, slug, "createdAt", "updatedAt") FROM stdin;
\.
COPY "cmsGospace_wonobject"."Category" (id, name, slug, "createdAt", "updatedAt") FROM '$$PATH$$/3469.dat';

--
-- Data for Name: ClientLogo; Type: TABLE DATA; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

COPY "cmsGospace_wonobject"."ClientLogo" (id, logo, "companyName", "isPublished", "createdAt", "updatedAt") FROM stdin;
\.
COPY "cmsGospace_wonobject"."ClientLogo" (id, logo, "companyName", "isPublished", "createdAt", "updatedAt") FROM '$$PATH$$/3473.dat';

--
-- Data for Name: ClientPhoto; Type: TABLE DATA; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

COPY "cmsGospace_wonobject"."ClientPhoto" (id, photo, name, company, "isPublished", "createdAt", "updatedAt") FROM stdin;
\.
COPY "cmsGospace_wonobject"."ClientPhoto" (id, photo, name, company, "isPublished", "createdAt", "updatedAt") FROM '$$PATH$$/3472.dat';

--
-- Data for Name: Price; Type: TABLE DATA; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

COPY "cmsGospace_wonobject"."Price" (id, service, "packageName", price, "strikethroughPrice", "whatsappLink", "isActive", "createdAt", "updatedAt", category, description, highlighted, "serviceSlug", slug) FROM stdin;
\.
COPY "cmsGospace_wonobject"."Price" (id, service, "packageName", price, "strikethroughPrice", "whatsappLink", "isActive", "createdAt", "updatedAt", category, description, highlighted, "serviceSlug", slug) FROM '$$PATH$$/3474.dat';

--
-- Data for Name: PriceFeature; Type: TABLE DATA; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

COPY "cmsGospace_wonobject"."PriceFeature" (id, "priceId", name, "sortOrder") FROM stdin;
\.
COPY "cmsGospace_wonobject"."PriceFeature" (id, "priceId", name, "sortOrder") FROM '$$PATH$$/3475.dat';

--
-- Data for Name: SiteAsset; Type: TABLE DATA; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

COPY "cmsGospace_wonobject"."SiteAsset" (id, "imageUrl", "publicId", "createdAt", "updatedAt") FROM stdin;
\.
COPY "cmsGospace_wonobject"."SiteAsset" (id, "imageUrl", "publicId", "createdAt", "updatedAt") FROM '$$PATH$$/3476.dat';

--
-- Name: Article Article_pkey; Type: CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."Article"
    ADD CONSTRAINT "Article_pkey" PRIMARY KEY (id);


--
-- Name: Author Author_pkey; Type: CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."Author"
    ADD CONSTRAINT "Author_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ClientLogo ClientLogo_pkey; Type: CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."ClientLogo"
    ADD CONSTRAINT "ClientLogo_pkey" PRIMARY KEY (id);


--
-- Name: ClientPhoto ClientPhoto_pkey; Type: CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."ClientPhoto"
    ADD CONSTRAINT "ClientPhoto_pkey" PRIMARY KEY (id);


--
-- Name: PriceFeature PriceFeature_pkey; Type: CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."PriceFeature"
    ADD CONSTRAINT "PriceFeature_pkey" PRIMARY KEY (id);


--
-- Name: Price Price_pkey; Type: CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."Price"
    ADD CONSTRAINT "Price_pkey" PRIMARY KEY (id);


--
-- Name: SiteAsset SiteAsset_pkey; Type: CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."SiteAsset"
    ADD CONSTRAINT "SiteAsset_pkey" PRIMARY KEY (id);


--
-- Name: Article_categoryId_idx; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE INDEX "Article_categoryId_idx" ON "cmsGospace_wonobject"."Article" USING btree ("categoryId");


--
-- Name: Article_publishedAt_idx; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE INDEX "Article_publishedAt_idx" ON "cmsGospace_wonobject"."Article" USING btree ("publishedAt");


--
-- Name: Article_slug_key; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE UNIQUE INDEX "Article_slug_key" ON "cmsGospace_wonobject"."Article" USING btree (slug);


--
-- Name: Article_status_idx; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE INDEX "Article_status_idx" ON "cmsGospace_wonobject"."Article" USING btree (status);


--
-- Name: Category_slug_key; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE UNIQUE INDEX "Category_slug_key" ON "cmsGospace_wonobject"."Category" USING btree (slug);


--
-- Name: ClientLogo_isPublished_idx; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE INDEX "ClientLogo_isPublished_idx" ON "cmsGospace_wonobject"."ClientLogo" USING btree ("isPublished");


--
-- Name: ClientPhoto_isPublished_idx; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE INDEX "ClientPhoto_isPublished_idx" ON "cmsGospace_wonobject"."ClientPhoto" USING btree ("isPublished");


--
-- Name: PriceFeature_priceId_idx; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE INDEX "PriceFeature_priceId_idx" ON "cmsGospace_wonobject"."PriceFeature" USING btree ("priceId");


--
-- Name: Price_isActive_idx; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE INDEX "Price_isActive_idx" ON "cmsGospace_wonobject"."Price" USING btree ("isActive");


--
-- Name: Price_serviceSlug_idx; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE INDEX "Price_serviceSlug_idx" ON "cmsGospace_wonobject"."Price" USING btree ("serviceSlug");


--
-- Name: Price_slug_key; Type: INDEX; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

CREATE UNIQUE INDEX "Price_slug_key" ON "cmsGospace_wonobject"."Price" USING btree (slug);


--
-- Name: Article Article_authorId_fkey; Type: FK CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."Article"
    ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "cmsGospace_wonobject"."Author"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Article Article_categoryId_fkey; Type: FK CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."Article"
    ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "cmsGospace_wonobject"."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PriceFeature PriceFeature_priceId_fkey; Type: FK CONSTRAINT; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER TABLE ONLY "cmsGospace_wonobject"."PriceFeature"
    ADD CONSTRAINT "PriceFeature_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "cmsGospace_wonobject"."Price"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DATABASE "cmsGospace_wonobject"; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE "cmsGospace_wonobject" FROM PUBLIC;
GRANT ALL ON DATABASE "cmsGospace_wonobject" TO "cmsGospace_wonobject";


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER DEFAULT PRIVILEGES FOR ROLE "cmsGospace_wonobject" IN SCHEMA "cmsGospace_wonobject" GRANT ALL ON SEQUENCES TO "cmsGospace_wonobject";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: cmsGospace_wonobject; Owner: cmsGospace_wonobject
--

ALTER DEFAULT PRIVILEGES FOR ROLE "cmsGospace_wonobject" IN SCHEMA "cmsGospace_wonobject" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "cmsGospace_wonobject";


--
-- PostgreSQL database dump complete
--

