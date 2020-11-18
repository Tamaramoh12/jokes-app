DROP TABLE IF EXISTS jokesTable;

CREATE TABLE jokes(
    id SERIAL NOT NULL PRIMARY KEY,
    type VARCHAR(255),
    setup VARCHAR(255),
    punchline VARCHAR(255)
);