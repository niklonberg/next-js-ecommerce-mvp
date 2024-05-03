## Mock ecommerce NextJS app
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

A mock e-commerce site, built with NextJS, Tailwind, Resend, some Shadcn-UI components, Stripe payment & Prisma PostgreSQL database. Both site & database is hosted on vercel.
Has an admin subroute accessible at /admin - the admin and password login should be quite easy to guess! Hint hint ;)

# Page  
This site is hosted via vercel, and can be found here: https://next-js-ecommerce-mvp-nu.vercel.app/  

# Features  

The admin subroute has a dashboard, showing statistics for products, orders & customers. Its possible to edit/delete these, and create new products.  
Products are required to have a file (the product) and an image before a product can be created. 

Unfortunately this does not work remotely, as it uses the filesystem and writes to /products & /public/products folders, which doesnt really work for websites, but it worked remotely as I was working. Lesson learned! In the future i would either store those two things in the database aswell, or use something like Google cloud storage and have them serve it via their cdns.

The main site has a homepage, products page & my orders page.
Homepage has "Most popular" & "Newest products" sections, which filters based on purchase count and date added respectively.  

Clicking purchase takes the user to dynamically routed /products/[productId]/purchase, where Stripe checkout is possible, which handles all the form validation.  

On purchase success user is taken to /stripe/purchase-success/, where the user can download the product. This worked locally, but clicking download unfortunately yields a server error that I have been unable to fix.
The user would also get an order confirmation email sent via Resend.

My orders lets user input their email, and if they have any orders they will receive an email with those orders via Resend. 

May at some point return to this project and see if I can get more things working, but it was fun and I felt I got yet more practice with deploying, working databases and making an app with NextJS and understand its file/route system.
