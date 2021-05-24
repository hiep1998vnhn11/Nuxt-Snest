# vuetify

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at https://localhost:8080
# if your want to run in https to demo login oauth with facebook or gmail
#or if you do not need this, you comment server property in nuxt.config.js
#one more step:
#if you're using chrome, please copy paste this to your chrome, enabled "Allow invalid certificates for resources loaded from localhost."
#$ chrome://flags/#allow-insecure-localhost

$ yarn dev


# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Setup for https connection with oauth in localhost

### Step 1: generate file

```bash
# This comment will generate 2 file: localhost.crt and localhost.key
$ openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

### Step 2: uncomment nuxt.config.js

After generate 2 following file, uncomment the https property in nuxt.config.js file

### Step 3: trust this https connection

If you use google chrome, open the setting and search for SSL, open, and KeyChain access will open. Draw and drop the localhost.crt to this, double click to new field and select the trust, in line 1 change to always trust and close window.

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

```javascript
const rooms = [
  {
    roomId: 1,
    roomName: 'Room 1',
    avatar: 'assets/imgs/people.png',
    unreadCount: 4,
    index: 3,
    lastMessage: {
      content: 'Last message received',
      senderId: 1234,
      username: 'John Doe',
      timestamp: '10:20',
      saved: true,
      distributed: false,
      seen: false,
      new: true
    },
    users: [
      {
        _id: 1234,
        username: 'John Doe',
        avatar: 'assets/imgs/doe.png',
        status: {
          state: 'online',
          lastChanged: 'today, 14:30'
        }
      },
      {
        _id: 4321,
        username: 'John Snow',
        avatar: 'assets/imgs/snow.png',
        status: {
          state: 'offline',
          lastChanged: '14 July, 20:00'
        }
      }
    ],
    typingUsers: [4321]
  }
]

const messages = [
  {
    \_id: 7890,
    content: 'message 1',
    senderId: 1234,
    username: 'John Doe',
    date: '13 November',
    timestamp: '10:20',
    system: false,
    saved: true,
    distributed: true,
    seen: true,
    disableActions: false,
    disableReactions: false,
    file: {
      name: 'My File',
      size: 67351,
      type: 'png',
      audio: true,
      duration: 14.4,
      url: 'https://firebasestorage.googleapis.com/...'
    },
    reactions: {
      wink: [
        1234, // USER_ID
        4321
      ],
      laughing: [1234]
    }
  }
]
```

### Doing

1. Typing user in message

### Done

1. USer param hiện đang chưa có ỉntersect
2. Css friend param user
