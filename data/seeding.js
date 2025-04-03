db.users.insertMany([
    { 
      firstname: 'John', 
      lastname: 'Doe', 
      address: '123 Rue de Paris', 
      zipcode: '75000', 
      city: 'Paris', 
      phone: '01-23-45-67-89', 
      email: 'john.doe@example.com', 
      password: 'Password123!',
      admin: false 
    },
    { 
      firstname: 'Jane', 
      lastname: 'Smith', 
      address: '456 Avenue de Lyon', 
      zipcode: '69000', 
      city: 'Lyon', 
      phone: '02-34-56-78-90', 
      email: 'jane.smith@example.com', 
      password: 'SecurePass1!', 
      admin: true 
    },
    { 
      firstname: 'Alice', 
      lastname: 'Johnson', 
      address: '789 Boulevard de Marseille', 
      zipcode: '13000', 
      city: 'Marseille', 
      phone: '03-45-67-89-01', 
      email: 'alice.johnson@example.com', 
      password: 'AlicePass1!',
      admin: false 
    },
    { 
      firstname: 'Bob', 
      lastname: 'Brown', 
      address: '101 Rue de Bordeaux', 
      zipcode: '33000', 
      city: 'Bordeaux', 
      phone: '04-56-78-90-12', 
      email: 'bob.brown@example.com',
      password: 'BobPass1!', 
      admin: false 
    }
  ]);
  
  db.stages.insertMany([
    { address: '789 Boulevard de Marseille', zipcode: '13000', city: 'Marseille' },
    { address: '101 Rue de Bordeaux', zipcode: '33000', city: 'Bordeaux' },
    { address: '202 Avenue de Nice', zipcode: '06000', city: 'Nice' },
    { address: '303 Rue de Toulouse', zipcode: '31000', city: 'Toulouse' }
  ]);
  
  db.trips.insertMany([
    { driver_id: 1, departure_id: 1, destination_id: 2, date_time: ISODate('2025-06-06T10:00:00Z'), seats_available: 4, luggage_accepted: true },
    { driver_id: 2, departure_id: 2, destination_id: 1, date_time: ISODate('2025-06-07T14:00:00Z'), seats_available: 2, luggage_accepted: false },
    { driver_id: 3, departure_id: 3, destination_id: 4, date_time: ISODate('2025-05-08T09:00:00Z'), seats_available: 3, luggage_accepted: true },
    { driver_id: 4, departure_id: 4, destination_id: 3, date_time: ISODate('2025-05-09T15:00:00Z'), seats_available: 5, luggage_accepted: false }
  ]);
  
  db.passengers.insertMany([
    { user_id: 2, trip_id: 1 },
    { user_id: 1, trip_id: 2 },
    { user_id: 3, trip_id: 3 },
    { user_id: 4, trip_id: 4 }
  ]);
  
  db.reviews.insertMany([
    { content: 'Great journey!', rating: 5, user_id: 1, trip_id: 1 },
    { content: 'Could be better.', rating: 3, user_id: 2, trip_id: 2 },
    { content: 'Very comfortable ride.', rating: 4, user_id: 3, trip_id: 3 },
    { content: 'Excellent service!', rating: 5, user_id: 4, trip_id: 4 }
  ]);
  