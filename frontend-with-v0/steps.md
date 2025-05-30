1. Set up node in your environment (use nvm) https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script
2. Run shadcn command

```
npx shadcn@latest init
npx shadcn@latest add "https://v0.dev/chat/b/b_kFM3tBBfY5r?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..AF3sau0TjGTedHbM.mIzx7JJiTjH_t7NMTPWqQ4gzfrfia07ofTWxDPgaQwIx0gH89R4cpDTp8TU.MV6sxSTLS1Kx7YJFw2z3RQ"
```

3. There were some errors with ThemeProvider missing, so I let v0.dev fix it and then reran the above command to update the project and overwritten existing files.

4. More errors, all resolved through v0.dev

5. Some changes on the UI and adjustment to the api response through cursor.

6. To create an optimized static build for CDN hosting:
   - Update `next.config.js` to enable static exports:
     ```js
     /** @type {import('next').NextConfig} */
     const nextConfig = {
       output: 'export',
       images: {
         unoptimized: true
       }
     }
     module.exports = nextConfig
     ```
   - Run the build command:
     ```bash
     npm run build
     ```
   - The static build will be generated in the `out` directory
   - Deploy the contents of the `out` directory to your CDN

7. Create another private S3 bucket and upload out directory

8. Create CloudFront distribution,
  - select "origin access control settings"
  - select "do not enable security protections"

9. After creating CloudFront distribution, copy the policy and update the bucket policy with it so CloudFront can access your bucket.

10. You can now access the app at https://dc6tlmszh0od9.cloudfront.net/index.html we need an extra step to let it work with https://dc6tlmszh0od9.cloudfront.net only

On the CloudFront distribution page general tab, click edit and set the default root object as index.html

11. To create a script to deploy frontend:

```
Write a bash script that will build the frontend for production with "npm run build" and then it will upload the contents of build directory to the aws lambda bucket named "aws-training-app-hosting" in us-east-1 region. The script should also create a cloudfront distribution invalidation for "arn:aws:cloudfront::195275674349:distribution/E2JL3KGOIZRTOJ" on "/*" all resources.
```
