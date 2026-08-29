This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stripe billing

The Premium plan uses Stripe Checkout + Stripe Billing with a monthly recurring Price configured in the Stripe Dashboard.

Required environment variables:

```bash
STRIPE_SECRET_KEY=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PREMIUM_PRICE_ID=""
```

Local webhook test flow:

```bash
npm run dev
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret printed by `stripe listen` into `STRIPE_WEBHOOK_SECRET` in your local `.env`. In the Stripe Dashboard, create a Product for Cataloguei Premium and a monthly recurring Price in BRL for R$ 24,90, then copy that Price ID into `STRIPE_PREMIUM_PRICE_ID`.

To test a Premium subscription locally:

1. Sign in with a verified user.
2. Open `/admin/plans`.
3. Click `Assinar Premium`.
4. Pay in Stripe Checkout with a Stripe test card.
5. Keep `stripe listen` running so `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, and `invoice.payment_failed` reach `/api/webhooks/stripe`.
6. Return to `/admin/plans` and refresh after the webhook is processed.

For cancellation, payment method updates, invoices, and billing details, use `Gerenciar assinatura`, which opens the Stripe Customer Portal for the authenticated user's own Stripe Customer.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
