# //TODO (wip, name subject to change)

[Todo before release of 1.0:](./TODO.md#todo)

//TODO is another boring TODO website / app that someone made because they think everyone else's solution is inferior.

### What makes it different from other TODO websites?

//TODO is designed with privacy, simplicity and speed in mind. It is designed to run on your own infrastructure and doesn't collect any unnecessary data.

#### //TODO aims to provide 100% functionality without any Javascript enabled whatsoever.

Only the TODOs and the list they belong to are stored on the server.
Each server can host several TODO lists, each TODO list is password protected.
Thanks to the use of JWTs, the server doesn't store any user information at all.

Todo lists are stored in Redis, an in-memory Database, which is super fast but still allows scaling to many users at once.

### Who is this for?

#### People who:
 - Want to share a TODO list with your friends / colleagues
   - and trust them enough to give them the power to delete every TODO from your list
 - Have their own infrastructure (a raspberry pi should be enough)
 - Need a TODO list, and not the swiss army knife version of a TODO list 