const user1Id = ObjectId();
const user2Id = ObjectId();
const user3Id = ObjectId();
const user4Id = ObjectId();

const stage1Id = ObjectId();
const stage2Id = ObjectId();
const stage3Id = ObjectId();
const stage4Id = ObjectId();

const trip1Id = ObjectId();
const trip2Id = ObjectId();
const trip3Id = ObjectId();
const trip4Id = ObjectId();

db.users.insertMany([
  { _id: user1Id, firstname: 'John', lastname: 'Doe', address: '123 Rue de Paris', zipcode: '75000', city: 'Paris', phone: '01-23-45-67-89', email: 'john.doe@example.com', password: 'Password123!', admin: false },
  { _id: user2Id, firstname: 'Jane', lastname: 'Smith', address: '456 Avenue de Lyon', zipcode: '69000', city: 'Lyon', phone: '02-34-56-78-90', email: 'jane.smith@example.com', password: 'SecurePass1!', admin: true },
  { _id: user3Id, firstname: 'Alice', lastname: 'Johnson', address: '789 Boulevard de Marseille', zipcode: '13000', city: 'Marseille', phone: '03-45-67-89-01', email: 'alice.johnson@example.com', password: 'AlicePass1!', admin: false },
  { _id: user4Id, firstname: 'Bob', lastname: 'Brown', address: '101 Rue de Bordeaux', zipcode: '33000', city: 'Bordeaux', phone: '04-56-78-90-12', email: 'bob.brown@example.com', password: 'BobPass1!', admin: false }
]);

db.stages.insertMany([
  { _id: stage1Id, address: '789 Boulevard de Marseille', zipcode: '13000', city: 'Marseille' },
  { _id: stage2Id, address: '101 Rue de Bordeaux', zipcode: '33000', city: 'Bordeaux' },
  { _id: stage3Id, address: '202 Avenue de Nice', zipcode: '06000', city: 'Nice' },
  { _id: stage4Id, address: '303 Rue de Toulouse', zipcode: '31000', city: 'Toulouse' }
]);

db.trips.insertMany([
  { _id: trip1Id, driver_id: user1Id, departure_id: stage1Id, destination_id: stage2Id, date_time: ISODate('2025-06-06T10:00:00Z'), seats_available: 4, luggage_accepted: true },
  { _id: trip2Id, driver_id: user2Id, departure_id: stage2Id, destination_id: stage1Id, date_time: ISODate('2025-06-07T14:00:00Z'), seats_available: 2, luggage_accepted: false },
  { _id: trip3Id, driver_id: user3Id, departure_id: stage3Id, destination_id: stage4Id, date_time: ISODate('2025-05-08T09:00:00Z'), seats_available: 3, luggage_accepted: true },
  { _id: trip4Id, driver_id: user4Id, departure_id: stage4Id, destination_id: stage3Id, date_time: ISODate('2025-05-09T15:00:00Z'), seats_available: 5, luggage_accepted: false }
]);

db.passengers.insertMany([
  { user_id: user2Id, trip_id: trip1Id },
  { user_id: user1Id, trip_id: trip2Id },
  { user_id: user3Id, trip_id: trip3Id },
  { user_id: user4Id, trip_id: trip4Id }
]);

db.reviews.insertMany([
  { content: 'Great journey!', rating: 5, user_id: user1Id, trip_id: trip1Id },
  { content: 'Could be better.', rating: 3, user_id: user2Id, trip_id: trip2Id },
  { content: 'Very comfortable ride.', rating: 4, user_id: user3Id, trip_id: trip3Id },
  { content: 'Excellent service!', rating: 5, user_id: user4Id, trip_id: trip4Id }
]);