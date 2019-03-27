# Getting Started

#### Setup
* Requires postgresql >=9.2 to be installed and running
* `yarn setup` installs dependencies, configures database, runs the tests, and finally runs the app

#### To run locally

_Development:_

* run `yarn start` in the project root to start the backend on port 5000
  * TODO hot reloading
* run `yarn start` in the `client` directory to start the front end on port 3000
  * Ajax requests will be forwarded to the server
* access the application at localhost:3000

_Production Mode:_

* run `yarn client:build` to prepare the static assets for the server
* run `yarn start` in the root directory to start the server
* access the application at localhost:5000

#### Helpful commands
* `yarn test` to run the tests
* `heroku logs` to check the logs

#### Deploy process
* To deploy to staging from a specified branch:
* `git push staging auth0:master`

* To deploy to production from a specified branch:
* `git push production <BRANCH>:master`

* To rollback the most recent release
* `heroku rollback -r <ENVIRONMENT>`

#### Database
* `yarn run db:init`: create a user and a database, then create the empty tables
* `yarn run db:clean`: delete the user and database
* The commands use `db/config.js` for the connection info, which you can override by setting DATABASE_URL to a valid postgres connection string
* The postgres client must be installed on the development machine regardless where the DB is running.
# Some history:
This started as a prototype that I made relatively quickly and thought no one would have interest in, which means there's a lot of anti-patterns.
I used Google forms and spreadsheets to collect definitions online before I even had the site built (to gauge interest).
So right now unfortunately users submit entries and requested terms through a google form which feeds into a google spreadsheet.
I download the entries as JSON and run a script to enter them in the db.
Ideally there will soon be forms hosted on queer undefined itself that post directly to the db.

#### About Auth0:
* There are two pages (potentialdefs & reporteddefs) that should only be accessible to an Admin user, these are secured using Auth0

## About the data:

### Entries:
* Entries go into the entry table with "potential" status
* I can view this in an admin page that uses auth0 to force a user to login before viewing the page
* I can click “accept” or “reject” and that will change the status in the entry table
* Only accepted entries show up on the site
* If a user clicks report on an entry, it will change the status to reported (which currently means it will be hidden from the site immediately)
* I have an admin page where I can review reported defs and click “dismiss” to change the status back to accepted or “reject” to change the status to rejected
* Entries have a "definition" field and an "explanation" field - these are responses to two different questions in the Definition form, where the user is asked to "define the term" and then "explain what it means in your experience." The second question is intended to prompt more personal/informal narratives rather than objective definitions


### Synonyms:
* I currently come up with them by hand (not ideal)
* Don't currently have a UI to insert them in the db

### Requested terms:
* Currently they go into a spreadsheet and I edit the google form to display the requested terms that haven’t been defined yet
* Ideally they would be submitted into the db and there would be a native (non google) form on QU where people could define terms, and that would query the db to display the requested terms that have not been “fulfilled” aka defined

### Actions
* Should probably be called Statuses. potential, accepted, reported, rejected.

## App.js
`client/App.js` needs to be refactored. Here's a breakdown to make the current mass of code a little more understandable.
Here's what's in the render() method:

	*	DocumentTitle and Helmet = SEO metadata
	*	ThemeProvider works with MaterialUI library to make things pretty
	*	Header
		*   Autocomplete search bar
	*	Welcome message (gets rendered conditionally)
	*	ResultList (gets rendered if there are defs)
	*	No defs message (gets rendered conditionally)
	*	Loading message (rendered when defs are loading)
	*	Footer buttons
		*	logout button gets rendered conditionally

