# vuetify

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

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

1. USer param hiện đang chưa có ỉntersect
2. Css friend param user
