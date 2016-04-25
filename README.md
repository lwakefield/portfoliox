# portfoliox

> A Vue.js + Firebase project

This is a neat little portfolio platform to show off some pictures.
It is super simple, using Vue.js as the framework and Firebase as the backend.

Images are cached in LocalStorage, so once visited for the first time,
subsequent visits should be FAST

![screenshot](https://i.imgur.com/CBQsRo4.png)


## Before anything else...

To get setup you need a Firebase app.
If you try running against my Firebase app, it will work, but you wont be able 
to login.
I recommend search replacing all instances of
`https://portfoliox.firebaseio.com/` to your app name, until I can be bothered
to set up env config.

The Firebase rules are as follows:

```
{
    "rules": {
        "users": {
            ".write": "!data.exists()",
            ".read": true
        },
        "images": {
            ".write": "root.child('users').child(auth.uid).exists()",
            ".read": true
        },
        "image_index": {
            ".write": "root.child('users').child(auth.uid).exists()",
            ".read": true
        }
    }
}
```

## Deploy

To deploy to Firebase, change to your Firebase app, you can then run
`npm run deploy` to build your app and deploy to firebase.

```
  //firebase.json
  "firebase": "portfoliox",
```

## Local Dev

To run locally `npm run dev`

## Limitations

The biggest issue at the moment, is that th caching in LocalStorage is limited
to 4MB, or whatever your browser allows. Regardless of your browser, it isn't
enough.
