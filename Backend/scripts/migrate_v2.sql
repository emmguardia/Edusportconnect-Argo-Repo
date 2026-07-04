-- Migration v2 : images multiples + organisateur
USE edusport_connect;

-- Ajouter organizer si absent
ALTER TABLE event
  ADD COLUMN IF NOT EXISTS organizer VARCHAR(255) NULL AFTER location;

-- Supprimer image_url (remplacé par event_images)
ALTER TABLE event
  DROP COLUMN IF EXISTS image_url;

-- Table des images d'événements
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
