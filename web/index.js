
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import dotenv from "dotenv";

dotenv.config();

import shopify from "./shopify.js";
import PrivacyWebhookHandlers from "./privacy.js";
import timerRoutes from "./routes/timerRoutes.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.use("/api/timers", timerRoutes);

app.get("/api/products", async (_req, res) => {
  try {
    const products = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
      limit: 250,
      fields: 'id,title,handle,status,product_type,vendor',
    });
    res.status(200).json(products.data);
  } catch (error) {
    console.error(`Failed to fetch products: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/collections", async (_req, res) => {
  try {
    const [customCollections, smartCollections] = await Promise.all([
      shopify.api.rest.CustomCollection.all({
        session: res.locals.shopify.session,
        fields: 'id,title,handle',
      }),
      shopify.api.rest.SmartCollection.all({
        session: res.locals.shopify.session,
        fields: 'id,title,handle',
      })
    ]);

    const allCollections = [
      ...customCollections.data.map(collection => ({ ...collection, type: 'custom' })),
      ...smartCollections.data.map(collection => ({ ...collection, type: 'smart' }))
    ];

    res.status(200).json(allCollections);
  } catch (error) {
    console.error(`Failed to fetch collections: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/public/timers/active", async (req, res) => {
  try {
    const { shop } = req.query;
    
    const shopId = Array.isArray(shop) ? shop[0] : shop;
    
    if (!shopId) {
      return res.status(400).json({ 
        error: 'Shop parameter is required' 
      });
    }

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const activeTimers = await prisma.timer.findMany({
      where: {
        shopId: shopId,
        active: true,
        OR: [
          { endTime: null },
          { endTime: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json(activeTimers);
  } catch (error) {
    console.error(`Failed to fetch active timers: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/products/count", async (_req, res) => {
  try {
    const client = new shopify.api.clients.Graphql({
      session: res.locals.shopify.session,
    });

    const countData = await client.request(`
      query shopifyProductCount {
        productsCount {
          count
        }
      }
    `);

    res.status(200).send({ count: countData.data.productsCount.count });
  } catch (error) {
    console.error(`Failed to get product count: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/shop", async (_req, res) => {
  try {
    const shop = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });
    res.status(200).json(shop.data[0]);
  } catch (error) {
    console.error(`Failed to fetch shop info: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});
  
app.get("/api/health", (_req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Countdown Timer App' 
  });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});