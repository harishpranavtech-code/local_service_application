export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  servicesCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_SERVICES_COLLECTION_ID!,
  bookingsCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_BOOKINGS_COLLECTION_ID!,
  reviewsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!,
  storageBucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
};
