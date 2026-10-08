# Deploying the frontend with GitHub Pages

The `Deploy frontend to GitHub Pages` workflow builds the Vite app and deploys it whenever a commit is pushed to `main`. You can also start it manually from the repository's **Actions** tab.

After a successful deployment, the site is available at:

<https://vikasyadav016.github.io/leexepert/>

The workflow enables GitHub Pages and publishes the `frontend/dist` build. If GitHub Pages is not enabled automatically, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.

## Backend configuration

GitHub Pages only hosts the static frontend; it does not run the Express backend or MongoDB. To use API-backed features on the deployed site:

1. Deploy the backend and database to a hosting provider.
2. Add a repository Actions variable named `VITE_API_BASE_URL` with the deployed backend's public URL under **Settings → Secrets and variables → Actions → Variables**.
3. Configure the backend to allow requests from `https://vikasyadav016.github.io` and verify its cookie/CORS settings for the deployed frontend.
4. Push to `main` or rerun the deployment workflow so the frontend is rebuilt with the variable.

`VITE_API_BASE_URL` is included in the public frontend bundle, so use it only for the backend URL; never put credentials or private keys in frontend variables.
