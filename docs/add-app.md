# Adding support for new maps apps

We're always looking to extend the number of apps this library can
interact with. Therefore we love pull requests implementing new app
URL schemes.

This document describes the steps required to add support for a new
maps/directions app to the library.


## General guidelines

* Only submit one new app integration per pull request.


## Step by step

### 1. Add constants
Start by updating [`src/constants.ts`](../src/constants.ts).

Start by determining a key that you will use to identify the new app.
This should be a lowercase alphanumeric string that might contain dashes,
like `google-maps`.

Then add the URL scheme to the `prefixes` variable and the app's English
title to the `title` variable.

The URL scheme you add to the `prefixes` variable will be used to
determine if the app exists on the client's device.


### 2. Add icon
Add a 150x150 pixels icon with that same name to the `src/images`
directory, and then add the appropriate reference to that icon to the
`icons` object in the `src/constants.ts` file.

### 3. Add logic
In [`src/index.ts`](../src/index.ts) you will find the logic to actually open the app. Add the
logic for your new app there, and make sure to test it on Android and
iOS. Some apps use different URL formats for each platform.

### 4. Update README
Add the new app to the list at the top of `README.md`. Also make sure
to add any iOS-specific new URL schemes to the
`LSApplicationQueriesSchemes` information just below it.


Thanks!
