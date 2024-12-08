import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // First, create categories
  const categories = [
    {
      id: "your-category-id-1", // Replace with actual UUID
      name: "Electronics",
    },
    {
      id: "your-category-id-2", // Replace with actual UUID
      name: "Clothing",
    },
    // Add more categories as needed
  ];

  // Create categories
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // Then create products
  const products = [
    {
      id: "your-product-id-1", // Replace with actual UUID
      name: "Sample Product 1",
      description: "Description for product 1",
      price: 99.99,
      imageurl: "https://example.com/image1.jpg",
      categoryid: "your-category-id-1", // Match with category ID above
    },
    // Add more products as needed
  ];

  // Create products
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 