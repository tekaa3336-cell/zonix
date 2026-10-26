# ZONIX micro-storefront

Static site (HTML/CSS/JS). No build step. Products load from `products.json`.

## Deploy
1. Push this folder to a GitHub repo.
2. In Vercel: Add New > Project > import the repo > Deploy (no settings needed).
3. Every push to GitHub redeploys automatically (about 20 seconds).

## Add a product daily
1. Open `products.json` on GitHub and click the pencil icon.
2. Copy the block from `product-template.json`, paste it at the top of the list (newest first), and add a comma after its closing brace.
3. Fill in `title`, `price`, `image`, `link`. Commit. Done.

Fields: `badge`, `buttonText` and `price` are optional. Set `"active": false` to hide a product without deleting it.

## Images
1. Go to imgbb.com and upload a photo (portrait 4:5, e.g. 800x1000, works best).
2. Copy the Direct link (it ends in .jpg or .png).
3. Paste it into `"image"`.

## Edit banner, bio, discount code
Edit `site.json`. Set `"enabled": false` to hide the banner.

## Run locally
`npx serve` in this folder, then open the URL shown. (Opening index.html directly won't work: browsers block loading JSON from file://.)
