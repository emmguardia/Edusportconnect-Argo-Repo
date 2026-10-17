-- ÉduSport Connect — Migration
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
  organizer   VARCHAR(255),
  date_start  DATETIME     NOT NULL,
  date_end    DATETIME,
  location    VARCHAR(255),
  published   TINYINT(1)   NOT NULL DEFAULT 0,
  author_id   CHAR(36)     NOT NULL,
  created_at  DATETIME(3)  NOT NULL DEFAULT NOW(3),
  updated_at  DATETIME(3)  NOT NULL DEFAULT NOW(3),
  PRIMARY KEY (id),
  UNIQUE KEY uq_event_slug (slug),
  KEY idx_event_published_date (published, date_start),
  CONSTRAINT fk_event_author FOREIGN KEY (author_id) REFERENCES admin (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_images (
  id         INT          NOT NULL AUTO_INCREMENT,
  event_id   CHAR(36)     NOT NULL,
  url        VARCHAR(500) NOT NULL,
  position   TINYINT      NOT NULL DEFAULT 0,
  created_at DATETIME(3)  NOT NULL DEFAULT NOW(3),
  PRIMARY KEY (id),
  KEY idx_event_images_event (event_id),
  CONSTRAINT fk_event_images_event FOREIGN KEY (event_id) REFERENCES event (id) ON DELETE CASCADE
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

-- v3 — Images stockées dans la base (Galera, répliquée sur 3 nœuds) au lieu
-- d'un volume local-path qui clouait le backend sur un seul nœud du cluster.
-- file_key : identifiant public non devinable (l'URL ne révèle pas l'id).
ALTER TABLE event_images
  ADD COLUMN IF NOT EXISTS file_key CHAR(36)    NULL AFTER url,
  ADD COLUMN IF NOT EXISTS mime     VARCHAR(32) NULL AFTER file_key,
  ADD COLUMN IF NOT EXISTS data     MEDIUMBLOB  NULL AFTER mime;
ALTER TABLE event_images ADD UNIQUE INDEX IF NOT EXISTS uq_event_images_file_key (file_key);
