## 2048 Game Implementation

Welcome to the 2048 game project! This is a web-based implementation of the popular 2048 puzzle game, built using HTML, CSS, and vanilla JavaScript.

## 🎮 Game Overview

2048 is a sliding tile puzzle game where the goal is to combine tiles with the same numbers to create a tile with the number 2048. The game is played on a 4x4 grid, and tiles can be moved using arrow keys or swipe gestures on mobile devices.

## 📁 Project Structure

```
2048/
├── index.html      # Main HTML file with game structure
├── styles.css      # CSS styling and animations
└── game.js         # Game logic and mechanics
```

### File Descriptions

1. **index.html**
   - Contains the basic HTML structure
   - Sets up the game board and score displays
   - Links to CSS and JavaScript files

2. **styles.css**
   - Defines the game's visual appearance
   - Handles responsive design for different screen sizes
   - Contains animations for tile movements and merges

3. **game.js**
   - Implements the core game logic
   - Handles user input (keyboard and touch)
   - Manages the game state and score tracking

## 🚀 Getting Started

### Running Locally
1. Clone or download the project files
2. To test on your computer:
   - Simply open `index.html` in a web browser

### Testing on Mobile Devices
1. Open Terminal and navigate to the project directory:
   ```bash
   cd path/to/2048
   ```
2. Start a Python HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
3. Find your computer's IP address:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
4. On your mobile device:
   - Connect to the same WiFi network as your computer
   - Open a browser and go to: `http://YOUR_IP_ADDRESS:8000`
   - Example: `http://192.168.1.100:8000`

## 🎯 Game Features

- Smooth animations for tile movements and merges
- Responsive design that works on both desktop and mobile
- Touch support with swipe gestures
- High score tracking with local storage
- Game state persistence
- Win/lose condition detection

## 🔧 Code Structure

### Game Class (game.js)
The main `Game2048` class handles:
- Board initialization and rendering
- Move mechanics (up, down, left, right)
- Score tracking
- Touch input handling
- Animation states

### Key Methods
- `newGame()`: Resets the game state
- `addRandomTile()`: Adds a new 2 or 4 tile
- `moveLeft()`, `moveRight()`, `moveUp()`, `moveDown()`: Handle tile movements
- `checkGameStatus()`: Checks for win/lose conditions
- `updateHighScores()`: Manages high score tracking

## 📱 Mobile Support
The game supports touch gestures:
- Swipe up: Move tiles up
- Swipe down: Move tiles down
- Swipe left: Move tiles left
- Swipe right: Move tiles right

## 🎨 Animations
The game includes several smooth animations:
- Tile appearance animations
- Merge animations with scale effects
- Sliding transitions
- Responsive feedback for user actions

## 🔍 Common Issues & Solutions

1. **Mobile Testing Issues**
   - Make sure you're connected to the same WiFi network
   - Check if the Python server is running
   - Verify you're using the correct IP address

2. **Animation Performance**
   - Animations use CSS transforms for better performance
   - If animations feel slow, try clearing browser cache

## 🛠️ Making Changes

When modifying the code:
1. Test changes in both desktop and mobile environments
2. Check that animations work smoothly
3. Verify high score functionality
4. Test edge cases (rapid moves, invalid moves, etc.)

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest new features
- Improve animations
- Enhance mobile support
- Add new game features

Happy coding! 🎮✨
