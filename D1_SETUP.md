# Cloudflare D1 Database Setup Guide

This guide will help you complete the integration of your Cloudflare D1 database (`maxdb`) with your Max Verstappen F1 dashboard.

## Prerequisites

- Cloudflare account with D1 database created (`maxdb`)
- Wrangler CLI installed (`npm install -g wrangler`)

## Step 1: Get Your Database ID

1. In your terminal, run:
   ```bash
   wrangler d1 list
   ```

2. Find your `maxdb` database in the list and copy the Database ID

3. Update `wrangler.toml`:
   - Replace `YOUR_DATABASE_ID_HERE` with your actual database ID

## Step 2: Create Database Schema

Run the following commands to create the database tables:

```bash
# Create main F1 data tables
wrangler d1 execute maxdb --file=schema.sql

# Create predictions tables (new feature)
wrangler d1 execute maxdb --file=schema-predictions.sql
```

## Step 3: Migrate Your Data

Populate the database with your existing F1 data:

```bash
wrangler d1 execute maxdb --file=migrate-data.sql
```

## Step 4: Verify Data Migration

Test that your data was imported correctly:

```bash
# Check career stats
wrangler d1 execute maxdb --command="SELECT * FROM career_stats;"

# Check season results
wrangler d1 execute maxdb --command="SELECT * FROM season_results ORDER BY season;"

# Check records
wrangler d1 execute maxdb --command="SELECT * FROM records;"

# Check predictions (new feature)
wrangler d1 execute maxdb --command="SELECT * FROM predictions;"

# Check predictions with vote summary
wrangler d1 execute maxdb --command="SELECT * FROM prediction_vote_summary;"
```

## Step 5: Configure Environment Variables

For local development, you can test D1 integration using:

```bash
wrangler pages dev out --d1 DB=maxdb
```

## Step 6: Deploy to Cloudflare Pages

1. Build your project:
   ```bash
   npm run build
   ```

2. Deploy to Cloudflare Pages (if using CLI):
   ```bash
   wrangler pages deploy out
   ```

3. Or push to your Git repository if using Git integration

## Step 7: Configure Pages Environment

In your Cloudflare dashboard:

1. Go to Workers & Pages → Your site → Settings → Functions
2. Add D1 database binding:
   - Variable name: `DB`
   - D1 database: `maxdb`

## Development vs Production

The code has been set up with fallbacks:

- **Development**: Uses JSON files (current behavior)
- **Production**: Uses D1 database when available
- **Fallback**: If D1 fails, falls back to JSON files

## Database Schema Overview

### Tables Created:

1. **career_stats**: Overall career statistics and rates
2. **season_results**: Year-by-year performance data  
3. **records**: F1 records and achievements
4. **predictions**: F1 predictions for community voting
5. **prediction_votes**: Individual user votes on predictions
6. **prediction_vote_summary**: View with aggregated vote counts and percentages

### Key Features:

- Automatic timestamps
- Indexes for performance
- Data validation
- Seamless fallback to JSON files

## Testing

After setup, your site will:

1. Work immediately (using JSON fallback in development)
2. Automatically use D1 when deployed to Cloudflare
3. Provide the same API responses with improved performance

## Troubleshooting

### Common Issues:

1. **Database ID not found**: Make sure to replace the placeholder in `wrangler.toml`
2. **Permission errors**: Ensure you're authenticated with `wrangler login`
3. **Migration fails**: Check that the database exists with `wrangler d1 list`

### Testing Locally:

```bash
# Test D1 connection
wrangler d1 execute maxdb --command="SELECT COUNT(*) FROM career_stats;"

# Local development with D1
wrangler pages dev out --d1 DB=maxdb
```

## Next Steps

1. Follow the steps above to complete the setup
2. Test the deployment
3. Consider adding data update endpoints for dynamic content management
4. Set up automated backups if needed

Your F1 dashboard will now be powered by Cloudflare D1, providing better performance and scalability!
