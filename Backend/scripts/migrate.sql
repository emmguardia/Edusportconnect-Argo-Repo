-- ÉduSport Connect — Migration initiale
-- Base : edusport_connect (sur l'instance MariaDB existante)

CREATE DATABASE IF NOT EXISTS edusport_connect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE edusport_connect;

CREATE TABLE IF NOT EXISTS admin (
  id         CHAR(36)     NOT NULL,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at DATETIME(3)  NOT NULL DEFAULT NOW(3),
  updated_at DATETIME(3)  NOT NULL DEFAULT NOW(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event (
  id          CHAR(36)     NOT NULL,
  title       VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL,
  description TEXT,
  date_start  DATETIME     NOT NULL,
  date_end    DATETIME,
  location    VARCHAR(255),
  image_url   VARCHAR(500),
  published   TINYINT(1)   NOT NULL DEFAULT 0,
  author_id   CHAR(36)     NOT NULL,
  created_at  DATETIME(3)  NOT NULL DEFAULT NOW(3),
  updated_at  DATETIME(3)  NOT NULL DEFAULT NOW(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_event_slug (slug),
  KEY idx_event_published_date (published, date_start),
  CONSTRAINT fk_event_author FOREIGN KEY (author_id) REFERENCES admin (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_message (
  id         CHAR(36)     NOT NULL,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  subject    VARCHAR(255),
  message    TEXT         NOT NULL,
  created_at DATETIME(3)  NOT NULL DEFAULT NOW(3),
  PRIMARY KEY (id),
  KEY idx_message_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
