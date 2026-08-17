-- Supports the ordered, per-brand dashboard queries.
CREATE INDEX "Customer_brandId_createdAt_idx" ON "public"."Customer"("brandId", "createdAt");
CREATE INDEX "Review_brandId_createdAt_idx" ON "public"."Review"("brandId", "createdAt");
CREATE INDEX "ReviewLink_brandId_orderId_idx" ON "public"."ReviewLink"("brandId", "orderId");
