import axios from "axios";

export async function fetchShopifyOrders(shop, accessToken, limit = 50000) {
    try {
        if (!shop) return [];
        let cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');

        // ... existing domain cleaning code ...
        if (cleanShop.includes('.myshopify.com')) {
            const [subdomain, ...rest] = cleanShop.split('.myshopify.com');
            if (subdomain && subdomain.includes('.')) {
                const newSubdomain = subdomain.replace(/\./g, '-');
                cleanShop = `${newSubdomain}.myshopify.com${rest.join('')}`;
            }
        }

        if (!cleanShop.includes('.')) {
            console.error(`[Shopify] Invalid shop domain: ${cleanShop}`);
            return [];
        }

        let allOrders = [];
        let nextUrl = `https://${cleanShop}/admin/api/2024-01/orders.json?status=any&limit=${limit > 250 ? 250 : limit}`;

        // Stop fetching if we reached the user's limit
        while (nextUrl && allOrders.length < limit) {
            console.log(`[Shopify] Fetching: ${nextUrl}`);
            const response = await axios({
                url: nextUrl,
                method: 'GET',
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json',
                },
            });

            allOrders = allOrders.concat(response.data.orders);

            // Shopify Pagination via Link header
            const linkHeader = response.headers['link'];
            if (linkHeader) {
                const links = linkHeader.split(',');
                const nextLink = links.find(link => link.includes('rel="next"'));
                if (nextLink) {
                    const match = nextLink.match(/<(.*)>/);
                    nextUrl = match ? match[1] : null;
                } else {
                    nextUrl = null;
                }
            } else {
                nextUrl = null;
            }
        }

        console.log(`[Shopify] Successfully fetched ${allOrders.length} total orders from ${cleanShop}`);
        return allOrders;
    } catch (error) {
        console.error(`[Shopify] Fetch Error (${shop}):`, error.response?.data || error.message);
        return [];
    }
}
