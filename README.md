# AniBot

AniBot is a Discord bot written in Node.js that provides a range of functionalities related to anime. It integrates with APIs such as Jikan and AnimeChan to fetch anime-related information and deliver interactive features to Discord users.

## Features

- **MyAnimeList Integration:** Fetch MyAnimeList links for specific anime titles and user profiles.
- **Recommendations:** Get anime recommendations based on user input.
- **Random Anime:** Fetch MyAnimeList links for random anime.
- **Anime Quotes:** Retrieve random anime quotes.
- **Playing Anime Openings:** Play anime openings or endings within Discord voice channels.
- **Top Anime:** Get information about top-rated anime.
- **Seasonal and Upcoming Anime:** Fetch information about current seasonal anime and upcoming releases.
- **User Updates:** Get recent updates from specific users.
- **Play Music:** Plays anime openings based on provided title.

## Installation

To use AniBot, follow these steps:

1. Clone the repository to your local machine.
   ```
   git clone https://github.com/amerm12/AniBot.git
   ```

2. Install dependencies using npm.
   ```
   npm install
   ```

3. Set up environmental variables:
   - Create a `.env` file in the root directory.
   - Add your Discord bot token and other necessary credentials to the `.env` file:
     ```
     DISCORD_TOKEN=your_discord_bot_token
     YOUTUBE_KEY=your_youtube_api_key
     ```

4. Start the bot.
   ```
   node index.js
   ```

## Usage

Once AniBot is running and connected to your Discord server, use the following commands within Discord channels to interact with the bot:

- `/anime [title]`: Get MyAnimeList link for a specific anime.
- `/user [username]`: Get MyAnimeList link for a specific user.
- `/recommend [anime]`: Get anime recommendations.
- `/randomanime`: Get a link to a random anime.
- `/quote`: Get a random anime quote.
- `/play [anime] [opening number]`: Play an anime opening or ending in a voice channel.
- `/stop`: Stop playing the current song.
- `/aboutanime [anime]`: Get main information about a specific anime.
- `/userfavorites [username]`: Get favorite anime titles of a specific user.
- `/userupdates [username]`: Get recent updates of a specific user.
- `/seasonalanime`: Get information about current seasonal anime.
- `/upcominganime`: Get information about upcoming seasonal anime.
- `/topanime`: Get information about top anime.

For more detailed usage instructions and customization options, refer to the source code.

