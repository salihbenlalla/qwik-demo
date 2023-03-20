DROP TABLE IF EXISTS Todos;
CREATE TABLE Todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT);
INSERT INTO Todos (text) VALUES ('take a shower'), ('take a breakfast');