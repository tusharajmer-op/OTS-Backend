import { google } from 'googleapis';

/**
 * Retrieves an OAuth2 client for Google authentication.
 * @returns {google.auth.OAuth2} The OAuth2 client.
 */
const getOauth2Client = () => {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    console.log(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'postmessage'
    );
    return oauth2Client;
};
export default getOauth2Client;

