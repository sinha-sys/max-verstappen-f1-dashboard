# Max Verstappen F1 Stats Dashboard

A modern, responsive web application showcasing Max Verstappen's Formula 1 career statistics. Built with Next.js 14, TypeScript, and Tailwind CSS for a beautiful, accessible user experience.

![Dashboard Preview](https://via.placeholder.com/1200x600/1e40af/ffffff?text=Max+Verstappen+F1+Dashboard)

## ✨ Features

- **📊 Comprehensive Statistics**: Career totals, season-by-season data, and performance rates
- **📈 Interactive Charts**: Win rate trends, cumulative wins, podiums vs poles analysis
- **🎯 Smart Filtering**: Year range slider to focus on specific time periods
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **🌓 Dark Mode Support**: System-aware theme switching with manual toggle
- **♿ Accessibility First**: ARIA labels, keyboard navigation, semantic HTML
- **⚡ Performance Optimized**: Server components, proper caching, and lazy loading
- **🧪 Well Tested**: Unit tests with Vitest and Testing Library

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17+ 
- **pnpm** (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd MaxVer2

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📊 Data Management

### Current Data Sources

The application currently reads from JSON files in the `/data` directory:

- **`/data/max.json`** - Career totals and calculated rates
- **`/data/seasons.json`** - Season-by-season statistics (2015-2025)
- **`/data/records.json`** - Notable records and achievements

### Updating Statistics

To update Max's statistics:

1. **Career Data**: Edit `/data/max.json`
   ```json
   {
     "career": {
       "driver": "Max Verstappen",
       "asOfDate": "2025-08-09",
       "starts": 223,
       "wins": 65,
       // ... other stats
       "rates": {
         "winRate": 0.2915,
         // ... calculated rates
       }
     }
   }
   ```

2. **Season Data**: Edit `/data/seasons.json`
   ```json
   [
     {
       "season": 2025,
       "starts": 14,
       "wins": 2,
       "podiums": 7,
       // ... other season stats
     }
   ]
   ```

3. **Records**: Edit `/data/records.json`
   ```json
   [
     {
       "category": "Single-season wins",
       "value": "19 (2023)",
       "note": "F1 record"
     }
   ]
   ```

### Connecting to a Real Backend

To replace JSON files with a live backend:

1. **Update API Routes** in `/app/api/*/route.ts`:
   ```typescript
   // Instead of reading from JSON files
   const data = await fetch('https://your-api.com/stats');
   return NextResponse.json(await data.json());
   ```

2. **Environment Variables**: Add your API configuration
   ```bash
   # .env.local
   NEXT_PUBLIC_API_BASE_URL=https://your-api.com
   API_SECRET_KEY=your-secret-key
   ```

3. **Update Fetchers** in `/lib/fetchers.ts` if needed for authentication or error handling

The UI components will continue to work without any changes.

## 🎨 Component Architecture

### Key Components

```
/app/(dashboard)/
├── page.tsx                    # Main dashboard page
└── _components/
    ├── Header.tsx              # Driver name, last updated, theme toggle
    ├── KPIGroup.tsx            # Career statistics cards
    ├── RateCards.tsx           # Success rate donuts + avg points
    ├── SeasonTable.tsx         # Sortable season-by-season table
    ├── Records.tsx             # Notable achievements grid
    ├── FilterControls.tsx      # Year range filtering
    └── Charts/
        ├── WinRateTrend.tsx    # Line chart of win percentage by season
        ├── CumulativeWins.tsx  # Line chart of total wins over time
        └── PodiumsPolesArea.tsx # Stacked area chart
```

### UI Components (`/components/ui/`)

Built with Radix UI primitives and styled with Tailwind CSS:
- `Card`, `Button`, `Badge`, `Table`
- `Slider`, `Tooltip`, `Separator`
- Custom theme toggle and provider

## 📱 Responsive Design

### Breakpoints

- **Mobile** (`< 768px`): Single column, horizontal scroll for KPIs
- **Tablet** (`768px - 1279px`): Two-column layout
- **Desktop** (`≥ 1280px`): Three-column layout with optimal spacing

### Mobile Optimizations

- Horizontal scrollable KPI cards
- Stacked chart layout
- Condensed table view
- Touch-friendly controls

## 🌓 Dark Mode

Implemented with `next-themes`:

- System preference detection
- Manual toggle in header
- Persistent user choice
- Smooth transitions
- Chart color adaptation

## ♿ Accessibility Features

- **Semantic HTML**: Proper heading hierarchy, lists, tables
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: Full functionality without mouse
- **Color Contrast**: WCAG 2.1 AA compliant
- **Focus Management**: Visible focus indicators
- **Alt Text**: Descriptive text for icons and charts

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test --coverage
```

### Test Structure

- **Unit Tests**: `/lib/format.test.ts` - Utility functions
- **Component Tests**: `/__tests__/KPIGroup.test.tsx` - React components
- **Setup**: `vitest.config.ts` and `vitest.setup.ts`

### Adding New Tests

```typescript
// Example component test
import { render, screen } from "@testing-library/react";
import { YourComponent } from "@/components/YourComponent";

describe("YourComponent", () => {
  it("renders correctly", () => {
    render(<YourComponent />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });
});
```

## 🛠 Development

### Adding New Charts

1. Create component in `/app/(dashboard)/_components/Charts/`
2. Use Recharts with responsive container
3. Follow existing patterns for tooltips and styling
4. Add to main dashboard page

Example:
```typescript
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export function YourChart({ data }: { data: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Chart Title</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            {/* Chart configuration */}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

### Adding New Metrics

1. Update types in `/lib/types.ts`
2. Add to data files in `/data/`
3. Update API routes if needed
4. Create/update UI components
5. Add to KPI cards or create new visualization

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Next.js configuration with additional rules
- **Prettier**: Consistent code formatting
- **Imports**: Use absolute imports with `@/*` paths
- **Components**: One component per file, descriptive names

## 📋 Todo / Future Enhancements

- [ ] **Sprint Statistics**: Add sprint race data and charts
- [ ] **Constructor Stats**: Team-specific achievements
- [ ] **Race-by-Race**: Detailed race results with position graphs
- [ ] **Comparison Mode**: Compare with other drivers
- [ ] **Export Features**: PDF reports, CSV downloads
- [ ] **Real-time Updates**: WebSocket integration for live race data
- [ ] **Advanced Filtering**: Constructor, track type, weather conditions
- [ ] **Performance Analytics**: Sector times, qualifying vs race pace

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow existing code patterns
- Update documentation
- Ensure accessibility compliance
- Test responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Check existing documentation
- Review the component examples

---

**Built with ❤️ for Formula 1 fans and Max Verstappen supporters worldwide!** 🏁
