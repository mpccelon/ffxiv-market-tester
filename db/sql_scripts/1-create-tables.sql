-- Create Item Table

CREATE TABLE IF NOT EXISTS base_item (
  item_id INT NOT NULL,
  name varchar(250) NOT NULL,
  is_craftable boolean NOT NULL,
  PRIMARY KEY (item_id)
);

---