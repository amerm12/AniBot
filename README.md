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

1. Clone the repository:
   - Clone the AniBot repository to your local machine using Git.
   ```
   git clone https://github.com/amerm12/AniBot.git
   ```
2. Create a Discord Bot:
   - Create a new Discord bot application on the [Discord Developer Portal](https://discord.com/developers/applications).
   - Obtain your bot's token from the Discord Developer Portal. This token is required       for the bot to connect to Discord servers.

3. Add the Bot to Your Discord Server:
   - Navigate to the Discord Developer Portal and select your bot application.
   - Generate an OAuth2 URL with the "bot" scope and the necessary permissions.
   - Use the generated URL to invite your bot to your Discord server.

4. Set Up Environmental Variables:
   - Create a `.env` file in the root directory of the cloned repository.
   - Add your Discord bot token and any other necessary credentials to the `.env` file       in the following format:
     ```plaintext
     DISCORD_TOKEN=your_discord_bot_token
     YOUTUBE_KEY=your_youtube_api_key
     ```
   - Replace `your_discord_bot_token` with the token you obtained for your Discord bot.
   - Replace `your_youtube_api_key` with YouTube API key You can obtain from the [Google Developers Console](https://console.developers.google.com/).

5. Install Dependencies:
   - Open a terminal or command prompt in the repository's root directory.
   - Install the required Node.js dependencies using npm.
     ```
     npm install
     ```
     
6. Start the Bot:
   - Run the bot using Node.js.
     ```
     node index.js
     ```
7. Interact with the Bot:
   - Once the bot is added to your Discord server and running locally, you can use the       provided commands within Discord channels to interact with the bot and access its       features.


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

