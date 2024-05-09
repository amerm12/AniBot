require('dotenv').config();
const Fuse = require('fuse.js');
const axios = require('axios');
const play = require('play-dl');
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, NoSubscriberBehavior, AudioPlayerStatus } = require('@discordjs/voice');

//Gateway intets for client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

//Audio player for playing songs
let audioPlayer = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
    }
});

//Writes in console when bot is ready and active
client.on('ready', () => {
    console.log(`${client.user.tag} is online.`);
});

//Checks for new messages in server
client.on('messageCreate', async (message) => {

    //Checks if message author is bot
    if (message.author.bot) return;

    //Check if the message starts with '/'
    if (message.content.startsWith('/')) {
        //Splits the message into two parts, command and argument
        const [command, ...originalArgs] = message.content.trim().split(/\s+/);
        let args = originalArgs.toString();

    //Checks which command user prompted 
    switch (command){
        case '/help':
            message.channel.send(
                "Hello! I'm AniBot, your friendly anime bot. Here are the commands you can use:\n" +
                "/anime [title]: Get MyAnimeList link for anime by its title.\n" +
                "/user [username]: Get MyAnimeList link for user by provided username.\n" +
                "/recommend [anime]: Get recommendations based on the provided anime.\n" +
                "/randomanime: Get MyAnimeList link for random anime.\n" +
                "/aboutanime [anime]: Get main information about provided anime.\n" +
                "/userfavorites [username]: Get the favorite anime titles of the provided user.\n" +
                "/userupdates [username]: Get the recent updates of the provided user.\n" +
                "/seasonalanime: Get information about current seasonal anime.\n" +
                "/upcominganime: Get information about upcoming seasonal anime.\n" +
                "/topanime: Get information about top anime.\n" +
                "/randomquote: Get a random anime quote.\n" +
                "/quote [character]: Get quote from provided anime character.\n " +
                "/play [anime] [opening number]: Play opening or ending or provided anime.\n" +
                "/stop: Stop playing current song.\n" +
                "Simply type the command followed by any necessary parameters."
            );
            break;

        case '/anime':
            if(args){
                let anime = await getAnime(args);
                if(anime.error){
                    message.channel.send(anime.error)
                }
                else{
                    message.channel.send(`MyAnimeList URL of requested anime: ${anime.url}`);
                } 
            }
            else{
                message.channel.send('Please provide anime title after command.');
            }
            break;

        case '/user':
            if(args){
                let user = await getUser(args);
                if(user.error){
                    message.channel.send(user.error);
                }
                else{
                    message.channel.send(`MyAnimeList Url of requsted user: ${user.data.data.url}`);
                }
            }
            else{
                message.channel.send('Please provide username after command.');
            }
            break;

        case '/recommend':
            if(args){
                let recommendedAnime = await getRecommendedAnime(args);
                if(recommendedAnime.error){
                    message.channel.send(recommendedAnime.error);
                }
                else{
                    message.channel.send(
                        `Recommended anime:\n` +
                        `1. ${recommendedAnime.data.data[0].entry.url}\n` +
                        `2. ${recommendedAnime.data.data[1].entry.url}\n` +
                        `3. ${recommendedAnime.data.data[2].entry.url}`
                    );
                }
            }
            else{
                message.channel.send('Please provide anime title after command.');
            }
            break;

        case '/randomanime':
            let randomAnime = await getRandomAnime();
            if(randomAnime.error){
                message.channel.send(randomAnime.error);
            }
            else{
                message.channel.send(`Random anime:  ${randomAnime.data.data.url}`);
            }   
            break;

        case '/aboutanime':
            let aboutAnime = await getAnime(args);

            if (aboutAnime.error) {
                message.channel.send(aboutAnime.error);
            } 
            else {
                let embed = {
                    color: 0x0099ff,
                    title: aboutAnime.title,
                    description: aboutAnime.synopsis.replace(/(^[ \t]*\n)/gm, ""), 
                    fields: [
                        {
                            name: 'Score',
                            value: `${aboutAnime.score}`,
                            inline: true
                        },
                        {
                            name: 'YouTube Trailer', 
                            value: aboutAnime.trailer.youtube_id ? `[YouTube Link](https://www.youtube.com/watch?v=${encodeURIComponent(aboutAnime.trailer.youtube_id)})` : 'Unavailable', // Field value with link
                            inline: true 
                        }
                    ]
                };
                message.channel.send({ embeds: [embed] });
            }
            break;

        case '/userfavorites':
            if (args) {
                let user = await getUser(args);
                if (user.error) {
                    message.channel.send(user.error);
                } else {
                    let userFavorites = await getUserFavorites(args);

                    if (userFavorites.error) {
                        message.channel.send(userFavorites.error);
                    } else {
                        let favoritesList = userFavorites.data.data.anime.map((anime, index) => `${index + 1}. ${anime.title}`).join('\n');

                        let embed = {
                            color: 0x0099ff,
                            title: `${args} Favorites`, 
                            description: favoritesList 
                        };

                        message.channel.send({ embeds: [embed] });
                    }
                }
            } else {
                message.channel.send('Please provide a username after the command.');
            }
            break;

        case '/userupdates':
            if (args) {
                let user = await getUser(args);
                if (user.error) {
                    message.channel.send(user.error);
                } else {
                    let userUpdates = await getUserUpdates(args);

                    if (userUpdates.error) {
                        message.channel.send(userUpdates.error);
                    } else {
                        let embed = {
                            color: 0x0099ff,
                            title: `${args}'s Updates`,
                            description: userUpdates.data.data.anime.map((anime, index) => `${index + 1}. ${anime.entry.title}`).join('\n')
                        };

                        message.channel.send({ embeds: [embed] });
                    }
                }
            } else {
                message.channel.send('Please provide a username after the command.');
            }
            break;


        case '/seasonalanime':
            let seasonalAnime = await getSeasonalAnime();
            if (seasonalAnime.error) {
                message.channel.send(seasonalAnime.error);
            } else {
                let currentSeasonList = seasonalAnime.data.data.slice(0, 5);
                let embed = {
                    color: 0x0099ff,
                    title: 'Top 5 Anime Titles of Current Season',
                    description: currentSeasonList.map((anime, index) => {
                        return `[${index + 1}. ${anime.title_english}](${anime.url})`;
                    }).join('\n')
                };
                message.channel.send({ embeds: [embed] });
            }
            break;

        case '/upcominganime':
            let upcomingAnime = await getUpcomingAnime();
            if (upcomingAnime.error) {
                message.channel.send(upcomingAnime.error);
            } else {
                let upcomingSeasonList = upcomingAnime.data.data.slice(0, 5);
                let embed = {
                    color: 0x0099ff,
                    title: 'Top 5 Anime Titles of Upcoming Season',
                    description: upcomingSeasonList.map((anime, index) => {
                        return `[${index + 1}. ${anime.title_english}](${anime.url})`;
                    }).join('\n')
                };
                message.channel.send({ embeds: [embed] });
            }
            break;

        case '/topanime':
            let topAnime = await getTopAnime();
            if (topAnime.error) {
                message.channel.send(topAnime.error);
            } else {
                let topAnimeList = topAnime.data.data.slice(0, 5);
                let embed = {
                    color: 0x0099ff,
                    title: 'Top 5 Rated Anime Titles',
                    description: topAnimeList.map((anime, index) => {
                        return `[${index + 1}. ${anime.title_english}](${anime.url})`;
                    }).join('\n')
                };
                message.channel.send({ embeds: [embed] });
            }
            break;

            case '/randomquote':
                let randomQuote = await getRandomQuote();
                if (randomQuote.error) {
                    message.channel.send(randomQuote.error);
                } else {
                    let embed = {
                        color: 0x0099ff,
                        title: 'Random Anime Quote',
                        description: `**${randomQuote.data.quote}**\n- ${randomQuote.data.character} (${randomQuote.data.anime})`
                    };
                    message.channel.send({ embeds: [embed] });
                } 
                break;

        case '/quote':
            if (args) {
                let animeQuote = await getAnimeQuote(args);
                if (animeQuote.error) {
                    message.channel.send(animeQuote.error);
                } else {
                    let embed = {
                        color: 0x0099ff,
                        title: 'Anime Quote',
                        description: `**${animeQuote.data.quote}**\n- ${animeQuote.data.character} (${animeQuote.data.anime})`
                    };
                    message.channel.send({ embeds: [embed] });
                }
            } else {
                message.channel.send('Please provide the anime title after the command.');
            }
            break;

        case '/play':
                let title = args.slice(0, args.lastIndexOf(','));
                let openingNumberString = parseInt(args.slice(args.lastIndexOf(',') + 1));
                let openingNumber = parseInt(openingNumberString - 1);
        
                if (isNaN(openingNumber) || openingNumber < 0) {
                    message.channel.send('Invalid opening song number. Opening number should be a positive integer.');
                } 
                else {
                    playSong(title, openingNumber, message);
                }
            break; 

        case '/stop':
            stopSong(message);
            break;

        default:
            message.channel.send(`Command not found. Write message '/help' to see available commands. 🙂`);
    }
    }
});

/**
 * Asynchronous function to retrieve anime data from the Jikan API based on a provided title.
 * @param {string} title - The title of the anime to search for.
 * @return {Object} - An Object that resolves to the most similar anime title found, or an object with 
 *                              an error message if no anime is found.
 */
async function getAnime(title) {
    try {
        let mergedTitle = title.split(' ').join('_');
        let response = await axios.get(`https://api.jikan.moe/v4/anime?q=${mergedTitle}`);
        let fullAnimeList = response.data.data;

        if (fullAnimeList.length === 0) {
            throw new Error('No anime found for provided title.');
        }

        let fuseOptions = {
            keys: ['title_english'],
            threshold: 0.6,
        };

        let fuse = new Fuse(fullAnimeList, fuseOptions);

        let searchResults = fuse.search(title);
        let mostSimilarTitle = searchResults[0]?.item;

        if (!mostSimilarTitle) {
            throw new Error('No anime found for provided title.');
        }
        return mostSimilarTitle;
    } 
    catch (error) {
        return { error: error.message};
    }
}

/**
 * Asynchronous function to retrieve recommended anime based on a provided anime title.
 * @param {string} title - The title of the anime to get recommendations for.
 * @return {Object} - An Object that resolves to the recommendations for the provided anime title, or an object with
 *                   an error message if no recommendations are found.
 */
async function getRecommendedAnime(title) {
    try {
        let anime = await getAnime(title);

        if (anime.error) {
            throw new Error('No anime found for provided title.');
        }

        let animeID = anime.mal_id;
        let allRecommendations = await axios.get(`https://api.jikan.moe/v4/anime/${encodeURIComponent(animeID)}/recommendations`);
        if(!allRecommendations){
            throw new Error('No anime recommendations for provided title.')
        }
        return allRecommendations;
    }

    catch (error) {
        return { error: error.message };
    }
}

/**
 * Asynchronous function to fetch a random anime from the Jikan API.
 * @return {Object} - An Object that resolves to a random anime object, or an object with 
 *                  an error message if the random anime is not available.
 */
async function getRandomAnime (){
    try{
        let randomAnime = await axios.get('https://api.jikan.moe/v4/random/anime');
        if(!randomAnime){
            throw new Error('Random anime not available.')
        }
        return randomAnime;
    }

    catch(error){
        return { error: error.message };
    }  
}

/**
 * Asynchronous function to fetch user details from the Jikan API based on a username.
 * @param {string} username - The username of the user to retrieve details for.
 * @return {Object} - An Object that resolves to the user details object if the user exists, or 
 *                  an object with an error message if the user does not exist or an error occurs during the process.
 */
async function getUser (username){
    try{
        let user = await axios.get(`https://api.jikan.moe/v4/users/${encodeURIComponent(username)}`);
        if(user.status === 200){
            return user;
        }
    }
    catch (error) {
        if (error.response && error.response.status === 404) {
            return { error : 'User with provided username does not exist.'};
        }
    }
}

/**
 * Asynchronous function to fetch a user's favorite anime titles from the Jikan API based on a username.
 * @param {string} username - The username of the user to retrieve favorite anime titles for.
 * @return {Object} - An Object that resolves to the user's favorite anime titles object if available, or an 
 *                  object with an error message if the user has no favorite anime titles or an error occurs during the process.
 */
async function getUserFavorites(username){
    try{
        let userFavorites = await axios.get(`https://api.jikan.moe/v4/users/${encodeURIComponent(username)}/favorites`);
        
        if(userFavorites.data.data.anime.length === 0){
            throw new Error('User does not have favorie anime titles.');
        }
        return userFavorites;
    }
    catch (error){
        return { error: error.message };
    }
}

/**
 * Asynchronous function to fetch recent updates of a user from the Jikan API based on a username.
 * @param {string} username - The username of the user to retrieve recent updates for.
 * @return {Object} - An Oject that resolves to the user's recent updates if available, or an object 
 *                  with an error message if the user has no recent updates or an error occurs during the process.
 */
async function getUserUpdates(username){
    try{
        let userUpdates = await axios.get(`https://api.jikan.moe/v4/users/${encodeURIComponent(username)}/userupdates`);
        if(userUpdates.data.data.length === 0){
            throw new Error('User does not have any recent updates.');
        }
        return userUpdates;
    }

    catch (error){
        return { error: error.message };
    }
}

/**
 * Asynchronous function to fetch information about seasonal anime from the Jikan API for the current season.
 * @return {Object} - An Object that resolves to information about seasonal anime for the current season, or 
 *                  an object with an error message if there is an issue fetching the information or no seasonal
 *                  anime is available.
 */
async function getSeasonalAnime(){
    try{
        let seasonalAnime = await axios.get(`https://api.jikan.moe/v4/seasons/now`);
        if(seasonalAnime.data.data.length === 0){
            throw new Error ("Error fetching current season information.")
        }
        return seasonalAnime;
    }

    catch (error){
        return { error: error.message };
    }
}

/**
 * Asynchronous function to fetch information about upcoming anime from the Jikan API for the upcoming season.
 * @return {Object} - An Object that resolves to information about upcoming anime for the upcoming season, or
 *                  an object with an error message if there is an issue fetching the information or no upcoming 
 *                  anime is available.
 */
async function getUpcomingAnime(){
    try{
        let upcomingAnime = await axios.get(`https://api.jikan.moe/v4/seasons/upcoming`);
        if(upcomingAnime.data.data.length === 0) {
            throw new Error ('Error fetching upcoming season information.')
        }
        return upcomingAnime;
    }
    catch (error){
        return { error: error.message };
    }
}

/**
 * Asynchronous function to fetch information about top anime from the Jikan API.
 * @return {Object} - An Object that resolves to information about top anime, or an object with an error message 
 *                  if there is an issue fetching the information or no top anime is available.
 */
async function getTopAnime(){
    try{
        let topAnime = await axios.get(`https://api.jikan.moe/v4/top/anime`);
        if(topAnime.data.data.length === 0) {
            throw new Error('Error fetching top anime information.')
        }
        return topAnime;
    }
    catch (error){
        return { error: error.message};
    }
}

/**
 * Asynchronous function to fetch a random quote from the AnimeChan API.
 * @return {Object} - An Object that resolves to a random quote object, or an object with an error message 
 *                  if there is an issue fetching the quote.
 */
async function getRandomQuote(){
    try{
        let randomQuote = await axios.get(`https://animechan.xyz/api/random`);
        if(randomQuote.data){
            return randomQuote;
        }
        else {
            throw new Error('Error fetching random quote.');
        }
    }
    catch (error){
        return { error: error.message };
    }
}

/**
 * Asynchronous function to fetch a random quote related to a specific anime title from the AnimeChan API.
 * @param {string} title - The title of the anime to fetch a quote for.
 * @return {Object} - An Object that resolves to a random quote object related to the anime title, or an object
 *                  with an error message if there is an issue fetching the quote or no related quotes are found.
 */
async function getAnimeQuote(title) {
    try {
        let animeQuote = await axios.get(`https://animechan.xyz/api/random/anime?title=${encodeURIComponent(title)}`);
        if (animeQuote.data.error === 'No related quotes found!') {
            return error;
        } else {
            return animeQuote;
        }
    } catch (error) {
        return { error: 'Error fetching quote. Please check the anime title.' };
    }
}

//Boolean value that is set when song starts playing
let isPlaying = false;

/**
 * Asynchronous function to play an anime opening song in a voice channel based on the provided title and opening number.
 * @param {string} title - The title of the anime to play the opening song for.
 * @param {number} openingNumber - The number of the opening song to play.
 * @param {Message} message - The message object representing the Discord message that triggered the command.
 */
async function playSong(title, openingNumber, message) {
    try {
        audioPlayer.on(AudioPlayerStatus.Idle, () => {
            message.channel.send('Song ended.');
            isPlaying = false;
        });

        let anime = await getAnime(title);
        if (anime.error) {
            throw new Error('No anime found for provided title.');
        }

        let animeByID = await axios.get(`https://api.jikan.moe/v4/anime/${anime.mal_id}/full`);
        let songName = animeByID.data.data.theme.openings[openingNumber];
        if(songName === undefined){
            throw new Error('Can not find requsted opening.');
        }

        const url = await getYouTubeUrl(songName);

        const voiceChannel = message.member?.voice.channel;
        if (voiceChannel) {
            if (isPlaying) {
                throw new Error('Song is already playing.');
            }
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator
                })
    
                let stream = await play.stream(url, { quality: 1 });
                let resource = createAudioResource(stream.stream, {
                    inputType: stream.type === 'opus' ? 'opus' : 'unknown'
                });
                audioPlayer.play(resource);
                connection.subscribe(audioPlayer);
    
                message.channel.send('Playing song...');
                isPlaying = true;          
        } 
        else {
            throw new Error('You must be in a voice channel to make the bot join.');
        }
    }
    catch (error) {
        message.channel.send(error.message)
        return;
    }
}

/**
 * Asynchronous function to fetch the YouTube URL of a video based on the provided title.
 * @param {string} title - The title of the video to fetch the YouTube URL for.
 * @param {Message} message - The message object representing the Discord message that triggered the command.
 * @return {string|null>} - A Promise that resolves to the YouTube URL of the video if found, or null if there 
 *                        is an error fetching the URL.
 */
async function getYouTubeUrl(title, message) {
    try {
        const apiKey = process.env.YOUTUBE_KEY;
        const sanitizedTitle = title
            .replace(/^\d+\s*:\s*/, '') 
            .replace(/\([^)]*\)/g, '') 
            .replace(/[^\w\s]/g, '') 
            .trim();
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(sanitizedTitle)}&part=snippet&type=video&maxResults=1&order=relevance`;

        const response = await axios.get(apiUrl);
        const videoId = response.data.items[0].id.videoId;
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

        return youtubeUrl;
    } 
    catch (error) {
        message.channel.send('Error fetching YouTube URL:', error);
        return null;
    }
}

/**
 * Function to stop the currently playing song in the voice channel.
 * @param {Message} message - The message object representing the Discord message that triggered the command.
 */
async function stopSong(message) {
    const voiceChannel = message.member?.voice.channel;
    if (voiceChannel) {
        try {
            const connection = getVoiceConnection(voiceChannel.guild.id);
            if (connection) {
                connection.destroy();
                message.channel.send('Stopped playing song.');
                isPlaying = false;
            } 
            else {
                message.channel.send('No song is currently playing.');
            }
        } 
        catch (error) {
            message.channel.send(`Error stopping song: ${error.message}`);
        }
    } 
    else {
        message.channel.send('You must be in a voice channel to stop the song.');
    }
}

//Authenticate and log in the Discord bot using the Discord token
client.login(process.env.DISCORD_TOKEN);