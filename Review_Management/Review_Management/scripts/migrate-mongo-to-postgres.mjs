import 'dotenv/config';
import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/megareview";
const prisma = new PrismaClient();

async function migrate() {
    console.log("=========================================");
    console.log("MongoDB → PostgreSQL Migration Script");
    console.log("=========================================");

    let mongoConnected = false;
    try {
        console.log(`Connecting to MongoDB at: ${mongoUri}...`);
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
        mongoConnected = true;
        console.log("Connected to MongoDB.");
    } catch (err) {
        console.log("Could not connect to MongoDB:", err.message);
        console.log("Skipping MongoDB read step (starting fresh PostgreSQL database).");
    }

    if (!mongoConnected) {
        console.log("Migration finished (no existing MongoDB connection to copy from).");
        await prisma.$disconnect();
        return;
    }

    const summary = {
        brands: 0,
        users: 0,
        customers: 0,
        reviews: 0,
        reviewLinks: 0,
        contactRequests: 0,
        errors: []
    };

    try {
        const mongoDb = mongoose.connection.db;

        // Map Mongo 24-char ObjectIds to valid UUIDs or clean strings
        const idMap = new Map();
        const getOrMapId = (mongoId) => {
            if (!mongoId) return null;
            const strId = mongoId.toString();
            if (!idMap.has(strId)) {
                // Generate a consistent pseudo-UUID or use standard v4
                idMap.set(strId, crypto.randomUUID());
            }
            return idMap.get(strId);
        };

        // 1. Migrate Brands
        const brandsColl = mongoDb.collection('brands');
        const brands = await brandsColl.find({}).toArray();
        console.log(`Found ${brands.length} Brands in MongoDB...`);

        for (const brandDoc of brands) {
            try {
                const postgresId = getOrMapId(brandDoc._id);
                await prisma.brand.upsert({
                    where: { id: postgresId },
                    update: {},
                    create: {
                        id: postgresId,
                        name: brandDoc.name || "Untitled Brand",
                        slug: brandDoc.slug || brandDoc.name?.toLowerCase().replace(/\s+/g, '-'),
                        logoUrl: brandDoc.logoUrl || null,
                        primaryColor: brandDoc.primaryColor || "#facc15",
                        googlePlaceId: brandDoc.googlePlaceId || "N/A",
                        websiteType: brandDoc.websiteType || "other",
                        shopifyStoreUrl: brandDoc.shopifyStoreUrl || null,
                        shopifyAccessToken: brandDoc.shopifyAccessToken || null,
                        whatsappPhoneNumber: brandDoc.whatsappPhoneNumber || null,
                        whatsappPhoneNumberId: brandDoc.whatsappPhoneNumberId || null,
                        whatsappSenderId: brandDoc.whatsappSenderId || null,
                        whatsappApiKey: brandDoc.whatsappApiKey || null,
                        whatsappHasButton: Boolean(brandDoc.whatsappHasButton),
                        whatsappTemplateName: brandDoc.whatsappTemplateName || null,
                        whatsappTemplateLanguage: brandDoc.whatsappTemplateLanguage || "en_US",
                        reviewMessageTemplate: brandDoc.reviewMessageTemplate || null,
                        resendApiKey: brandDoc.resendApiKey || null,
                        brandEmail: brandDoc.brandEmail || null,
                        smtpHost: brandDoc.smtpHost || null,
                        smtpPort: brandDoc.smtpPort || "587",
                        smtpUser: brandDoc.smtpUser || null,
                        smtpPass: brandDoc.smtpPass || null,
                        useSMTP: Boolean(brandDoc.useSMTP),
                        isActive: brandDoc.isActive !== false,
                        shareCategories: brandDoc.shareCategories || null,
                        localizedWhatsappDrafts: brandDoc.localizedWhatsappDrafts || null,
                        createdAt: brandDoc.createdAt ? new Date(brandDoc.createdAt) : new Date(),
                        updatedAt: brandDoc.updatedAt ? new Date(brandDoc.updatedAt) : new Date()
                    }
                });
                summary.brands++;
            } catch (err) {
                summary.errors.push(`Brand ${brandDoc._id}: ${err.message}`);
            }
        }

        // 2. Migrate Users
        const usersColl = mongoDb.collection('users');
        const users = await usersColl.find({}).toArray();
        console.log(`Found ${users.length} Users in MongoDB...`);

        for (const userDoc of users) {
            try {
                const postgresId = getOrMapId(userDoc._id);
                const mappedBrandId = userDoc.brandId ? getOrMapId(userDoc.brandId) : null;
                await prisma.user.upsert({
                    where: { email: userDoc.email },
                    update: {},
                    create: {
                        id: postgresId,
                        name: userDoc.name || "User",
                        email: userDoc.email,
                        password: userDoc.password,
                        role: userDoc.role || "brand_admin",
                        brandId: mappedBrandId,
                        createdAt: userDoc.createdAt ? new Date(userDoc.createdAt) : new Date(),
                        updatedAt: userDoc.updatedAt ? new Date(userDoc.updatedAt) : new Date()
                    }
                });
                summary.users++;
            } catch (err) {
                summary.errors.push(`User ${userDoc._id}: ${err.message}`);
            }
        }

        // 3. Migrate Customers
        const customersColl = mongoDb.collection('customers');
        const customers = await customersColl.find({}).toArray();
        console.log(`Found ${customers.length} Customers in MongoDB...`);

        for (const customerDoc of customers) {
            try {
                const postgresId = getOrMapId(customerDoc._id);
                const mappedBrandId = customerDoc.brandId ? getOrMapId(customerDoc.brandId) : null;
                if (!mappedBrandId) continue;

                await prisma.customer.create({
                    data: {
                        id: postgresId,
                        brandId: mappedBrandId,
                        name: customerDoc.name || null,
                        email: customerDoc.email || null,
                        phone: customerDoc.phone || null,
                        orderId: customerDoc.orderId || "ORD-000",
                        createdAt: customerDoc.createdAt ? new Date(customerDoc.createdAt) : new Date(),
                        updatedAt: customerDoc.updatedAt ? new Date(customerDoc.updatedAt) : new Date()
                    }
                });
                summary.customers++;
            } catch (err) {
                summary.errors.push(`Customer ${customerDoc._id}: ${err.message}`);
            }
        }

        // 4. Migrate Reviews
        const reviewsColl = mongoDb.collection('reviews');
        const reviews = await reviewsColl.find({}).toArray();
        console.log(`Found ${reviews.length} Reviews in MongoDB...`);

        for (const reviewDoc of reviews) {
            try {
                const postgresId = getOrMapId(reviewDoc._id);
                const mappedBrandId = reviewDoc.brandId ? getOrMapId(reviewDoc.brandId) : null;
                const mappedCustomerId = reviewDoc.customerId ? getOrMapId(reviewDoc.customerId) : null;
                if (!mappedBrandId) continue;

                await prisma.review.create({
                    data: {
                        id: postgresId,
                        brandId: mappedBrandId,
                        customerId: mappedCustomerId,
                        orderId: reviewDoc.orderId || null,
                        rating: Number(reviewDoc.rating || 5),
                        feedback: reviewDoc.feedback || null,
                        isPublic: Boolean(reviewDoc.isPublic),
                        createdAt: reviewDoc.createdAt ? new Date(reviewDoc.createdAt) : new Date(),
                        updatedAt: reviewDoc.updatedAt ? new Date(reviewDoc.updatedAt) : new Date()
                    }
                });
                summary.reviews++;
            } catch (err) {
                summary.errors.push(`Review ${reviewDoc._id}: ${err.message}`);
            }
        }

        // 5. Migrate ReviewLinks
        const linksColl = mongoDb.collection('reviewlinks');
        const links = await linksColl.find({}).toArray();
        console.log(`Found ${links.length} ReviewLinks in MongoDB...`);

        for (const linkDoc of links) {
            try {
                const postgresId = getOrMapId(linkDoc._id);
                const mappedBrandId = linkDoc.brandId ? getOrMapId(linkDoc.brandId) : null;
                const mappedCustomerId = linkDoc.customerId ? getOrMapId(linkDoc.customerId) : null;
                if (!mappedBrandId || !mappedCustomerId || !linkDoc.token) continue;

                await prisma.reviewLink.create({
                    data: {
                        id: postgresId,
                        brandId: mappedBrandId,
                        customerId: mappedCustomerId,
                        orderId: linkDoc.orderId || null,
                        token: linkDoc.token,
                        isUsed: Boolean(linkDoc.isUsed),
                        whatsappSent: Boolean(linkDoc.whatsappSent),
                        emailSent: Boolean(linkDoc.emailSent),
                        expiresAt: linkDoc.expiresAt ? new Date(linkDoc.expiresAt) : new Date(Date.now() + 30 * 86400000),
                        createdAt: linkDoc.createdAt ? new Date(linkDoc.createdAt) : new Date(),
                        updatedAt: linkDoc.updatedAt ? new Date(linkDoc.updatedAt) : new Date()
                    }
                });
                summary.reviewLinks++;
            } catch (err) {
                summary.errors.push(`ReviewLink ${linkDoc._id}: ${err.message}`);
            }
        }

        // 6. Migrate ContactRequests
        const contactsColl = mongoDb.collection('contactrequests');
        const contacts = await contactsColl.find({}).toArray();
        console.log(`Found ${contacts.length} ContactRequests in MongoDB...`);

        for (const contactDoc of contacts) {
            try {
                const postgresId = getOrMapId(contactDoc._id);
                await prisma.contactRequest.create({
                    data: {
                        id: postgresId,
                        name: contactDoc.name || "N/A",
                        email: contactDoc.email || "N/A",
                        phone: contactDoc.phone || "N/A",
                        message: contactDoc.message || null,
                        plan: contactDoc.plan || "Free",
                        status: contactDoc.status || "new",
                        createdAt: contactDoc.createdAt ? new Date(contactDoc.createdAt) : new Date()
                    }
                });
                summary.contactRequests++;
            } catch (err) {
                summary.errors.push(`ContactRequest ${contactDoc._id}: ${err.message}`);
            }
        }

    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await mongoose.disconnect();
        await prisma.$disconnect();
    }

    console.log("=========================================");
    console.log("Migration Summary:");
    console.log(`Brands Migrated: ${summary.brands}`);
    console.log(`Users Migrated: ${summary.users}`);
    console.log(`Customers Migrated: ${summary.customers}`);
    console.log(`Reviews Migrated: ${summary.reviews}`);
    console.log(`ReviewLinks Migrated: ${summary.reviewLinks}`);
    console.log(`ContactRequests Migrated: ${summary.contactRequests}`);
    if (summary.errors.length > 0) {
        console.log(`Errors encountered (${summary.errors.length}):`);
        summary.errors.forEach(e => console.log(" -", e));
    }
    console.log("=========================================");
}

migrate();
