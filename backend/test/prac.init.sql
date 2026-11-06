CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.films
(
    id          uuid DEFAULT uuid_generate_v4() NOT NULL
        CONSTRAINT "PK_697487ada088902377482c970d1"
            PRIMARY KEY,
    rating      double precision                 NOT NULL,
    director    varchar                          NOT NULL,
    tags        text                             NOT NULL,
    image       varchar                          NOT NULL,
    cover       varchar                          NOT NULL,
    title       varchar                          NOT NULL,
    about       varchar                          NOT NULL,
    description varchar                          NOT NULL
);

CREATE TABLE public.schedules
(
    id       uuid DEFAULT uuid_generate_v4() NOT NULL
        CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd"
            PRIMARY KEY,
    daytime  varchar                          NOT NULL,
    hall     integer                          NOT NULL,
    rows     integer                          NOT NULL,
    seats    integer                          NOT NULL,
    price    double precision                 NOT NULL,
    taken    text                             NOT NULL,
    "filmId" uuid
        CONSTRAINT "FK_1c2f5e637713a429f4854024a76"
            REFERENCES public.films
);
