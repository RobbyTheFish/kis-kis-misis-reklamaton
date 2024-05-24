const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

const app = express();
app.use(bodyParser.json());

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  return res.data.items;
}

async function createEvent(auth, eventDetails) {
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const eventResult = await calendar.events.insert({
      calendarId: 'primary',
      resource: eventDetails,
    });
    return eventResult.data;
  } catch (error) {
    console.error('Error creating event: ', error);
  }
}

async function updateEvent(auth, eventId, updatedDetails) {
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const eventResult = await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      resource: updatedDetails,
    });
    return eventResult.data;
  } catch (error) {
    console.error('Error updating event: ', error);
  }
}

app.get('/events', async (req, res) => {
  const auth = await authorize();
  const events = await listEvents(auth);
  res.json(events);
});

app.post('/events', async (req, res) => {
  const auth = await authorize();
  const eventDetails = req.body;
  const event = await createEvent(auth, eventDetails);
  res.json(event);
});

app.put('/events/:eventId', async (req, res) => {
  const auth = await authorize();
  const eventId = req.params.eventId;
  const updatedDetails = req.body;
  const event = await updateEvent(auth, eventId, updatedDetails);
  res.json(event);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
