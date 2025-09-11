# Deployment to GitHub Pages

This project is set up to deploy to GitHub Pages using the `gh-pages` package.

## Steps to Deploy

1. Make sure your `homepage` field in `package.json` is set to your GitHub Pages URL (already set).
2. Build the project:
   ```sh
   npm run build
   ```
3. Deploy to GitHub Pages:
   ```sh
   npm run deploy
   ```

## Notes
- The `predeploy` script will automatically build the project before deploying.
- Your site will be available at: http://arekebyu.github.io/course_planner
