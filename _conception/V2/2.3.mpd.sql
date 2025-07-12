BEGIN;

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT, 
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    address VARCHAR(255),
    zipcode VARCHAR(10),
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE stages (
    stage_id INT PRIMARY KEY AUTO_INCREMENT, 
    address VARCHAR(255) NOT NULL,
    zipcode VARCHAR(10),
    city VARCHAR(100) NOT NULL
);

CREATE TABLE trips (
    trip_id INT PRIMARY KEY AUTO_INCREMENT, 
    driver_id INT NOT NULL,
    departure_id INT NOT NULL,
    destination_id INT NOT NULL,
    date_time DATETIME NOT NULL, 
    seats_available INT NOT NULL,
    luggage_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    price_per_seat DECIMAL(5,2), 
    trip_status ENUM('programmé', 'en cours', 'complet', 'annulé') NOT NULL DEFAULT 'programmé', 
    FOREIGN KEY (driver_id) REFERENCES users(user_id),
    FOREIGN KEY (departure_id) REFERENCES stages(stage_id),
    FOREIGN KEY (destination_id) REFERENCES stages(stage_id)
);

CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    trip_id INT NOT NULL,
    seats_booked INT NOT NULL DEFAULT 1, 
    booking_status ENUM('confirmé', 'en attente', 'annulé') NOT NULL DEFAULT 'en attente', 
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id)
);

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT, 
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), 
    comment TEXT, 
    user_id INT NOT NULL, 
    trip_id INT NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id)
);

COMMIT;