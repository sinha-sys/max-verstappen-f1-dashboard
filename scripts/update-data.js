#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Quick data update script for Max Verstappen F1 Dashboard
 * Usage: node scripts/update-data.js [race-result]
 * 
 * Example: node scripts/update-data.js --race="Hungarian GP" --position=1 --pole=true --fastest=false --points=25
 */

function updateData(raceResult) {
  try {
    // Read current data
    const careerPath = path.join(__dirname, '../data/max.json');
    const seasonsPath = path.join(__dirname, '../data/seasons.json');
    
    const careerData = JSON.parse(fs.readFileSync(careerPath, 'utf8'));
    const seasonsData = JSON.parse(fs.readFileSync(seasonsPath, 'utf8'));
    
    // Find 2025 season
    const currentSeason = seasonsData.find(s => s.season === 2025);
    if (!currentSeason) {
      throw new Error('2025 season not found in seasons data');
    }
    
    // Update season stats
    currentSeason.starts += 1;
    currentSeason.points += raceResult.points;
    
    if (raceResult.position <= 3) {
      currentSeason.podiums += 1;
      if (raceResult.position === 1) {
        currentSeason.wins += 1;
      }
    }
    
    if (raceResult.pole) {
      currentSeason.poles += 1;
    }
    
    if (raceResult.fastest) {
      currentSeason.fastestLaps += 1;
    }
    
    // Update career totals
    const career = careerData.career;
    career.asOfDate = new Date().toISOString().split('T')[0];
    career.starts += 1;
    career.points += raceResult.points;
    
    if (raceResult.position <= 3) {
      career.podiums += 1;
      if (raceResult.position === 1) {
        career.wins += 1;
      }
    }
    
    if (raceResult.pole) {
      career.poles += 1;
    }
    
    if (raceResult.fastest) {
      career.fastestLaps += 1;
    }
    
    if (raceResult.dnf) {
      career.dnfs += 1;
    }
    
    // Recalculate rates
    career.rates.winRate = Number((career.wins / career.starts).toFixed(4));
    career.rates.podiumRate = Number((career.podiums / career.starts).toFixed(4));
    career.rates.poleRate = Number((career.poles / career.starts).toFixed(4));
    career.rates.dnfRate = Number((career.dnfs / career.starts).toFixed(4));
    career.rates.avgPointsPerStart = Number((career.points / career.starts).toFixed(2));
    
    // Save updated data
    fs.writeFileSync(careerPath, JSON.stringify(careerData, null, 2));
    fs.writeFileSync(seasonsPath, JSON.stringify(seasonsData, null, 2));
    
    console.log('✅ Data updated successfully!');
    console.log(`📊 Race: ${raceResult.race}`);
    console.log(`🏁 Position: ${raceResult.position}${raceResult.dnf ? ' (DNF)' : ''}`);
    console.log(`🎯 Points: ${raceResult.points}`);
    console.log(`📈 Career Wins: ${career.wins} (${(career.rates.winRate * 100).toFixed(1)}%)`);
    console.log(`🏆 Career Podiums: ${career.podiums} (${(career.rates.podiumRate * 100).toFixed(1)}%)`);
    console.log('');
    console.log('🚀 Next steps for Cloudflare Pages:');
    console.log('   1. Run: npm run build:cloudflare');
    console.log('   2. Upload the out/ folder to Cloudflare Pages');
    console.log('   3. Your site will update automatically!');
    
  } catch (error) {
    console.error('❌ Error updating data:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    race: 'Unknown GP',
    position: null,
    points: 0,
    pole: false,
    fastest: false,
    dnf: false
  };
  
  args.forEach(arg => {
    if (arg.startsWith('--race=')) {
      result.race = arg.split('=')[1].replace(/"/g, '');
    } else if (arg.startsWith('--position=')) {
      result.position = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--points=')) {
      result.points = parseInt(arg.split('=')[1]);
    } else if (arg === '--pole=true') {
      result.pole = true;
    } else if (arg === '--fastest=true') {
      result.fastest = true;
    } else if (arg === '--dnf=true') {
      result.dnf = true;
    }
  });
  
  return result;
}

// Show usage if no arguments
if (process.argv.length < 3) {
  console.log(`
🏎️  Max Verstappen F1 Dashboard - Data Updater

Usage:
  node scripts/update-data.js --race="Race Name" --position=N --points=N [options]

Examples:
  # Max wins with pole position
  node scripts/update-data.js --race="Hungarian GP" --position=1 --points=25 --pole=true

  # Max gets 2nd place with fastest lap
  node scripts/update-data.js --race="Belgian GP" --position=2 --points=18 --fastest=true

  # Max DNFs
  node scripts/update-data.js --race="Italian GP" --position=20 --points=0 --dnf=true

Options:
  --race="Name"     Race name
  --position=N      Finishing position (1-20)
  --points=N        Points scored
  --pole=true       Got pole position
  --fastest=true    Got fastest lap
  --dnf=true        Did not finish
`);
  process.exit(0);
}

// Run the updater
const raceResult = parseArgs();
updateData(raceResult);
