## Links & such

* URL: `http://cloud.registerguard.com/eclipse/`
* Shortcut: `http://registerguard.com/eclipse`
* Bitly: `http://rgne.ws/eclipse-17`
* DT story: `web.eclipse-tease.sav` which can use any regular summary template.
* Tease photo (1200px wide):

![web eclipse-tease sav](https://user-images.githubusercontent.com/4853944/27612395-25b4c288-5b4b-11e7-8a0c-fdbf53390535.jpg)

## Getting started

This assumes you have [npm](https://docs.npmjs.com/getting-started/installing-node), [virtualenv](http://blog.apps.npr.org/2013/06/06/how-to-setup-a-developers-environment.html#chapter-2-install-python--virtualenv), [virtualenvwrapper](http://blog.apps.npr.org/2013/06/06/how-to-setup-a-developers-environment.html#chapter-2-install-python--virtualenv) and a [tarbell](http://tarbell.readthedocs.io/en/1.0.7/install.html) virtualenv installed.

```
git clone git@github.com:rgpages/eclipse-2017.git
cd eclipse-2017
npm install
workon tarbell
tarbell serve <IP>         # will run with grunt watch
tarbell publish <level>    # will run grunt, level = production on Rob's machine
```

# Project structure

Below I'll walk through each section and the related JS and Sass. I'll try to include any potential pitfalls and rational why things were done the way that they were.

## Technology

This project uses a blend of Grunt and Tarbell to generate HTML, CSS and JavaScript. The [original Tarbell blueprint](https://github.com/eads/tarbell-grunt-template) came from [Eads](https://twitter.com/eads/status/504417552068796416) and I took some liberties.

Here is a high-level look at what each technology does.

### Grunt

Check out the Gruntfile for all the gory details. In short, Grunt deals with the CSS, JS and media paths. More:

* Takes Sass in `_src/sass/**` and generates `css/main.css`
* Combines (and minifies) `_src/js/<filenames>` to `js/scripts.js` and `js/scripts.min.js`
  * Here, we are not using the minified version because the size difference is negligible and it would require further Grunt work that I don't have time for right now
  * Eventually, it would be good to build in similar functionality to what is in Bulldog with Grunt template conditionals for regular vs. minified
* Copy `_src/media/*` to `media/`
  * If you put files in `media/` they **will** be removed when the grunt runs, you **must** put the files in `_src/media` and let it copy over
* Watches for changes in `_blueprint/*.html`, `index.html`, `_src/sass/**/*` or `_src/js/*.js` and re-generates the files
  * The watch is automatically triggered with `tarbell serve`

### Tarbell

Tarbell (and Jinja2) take care of the rest of of the responsibilities. We collect meta info, resources and story information in [this Google Sheet](https://docs.google.com/spreadsheets/d/14H_FX_HPMMBmT_mEr1NtM8uLOTd_Ij_jFJJ44yCUzhw/edit#gid=0) and use Tarbell to get that data into the page. Here are some key points:

* OpenGraph info stored here
* Stories require headline, url, tease, pubdate and template (image url is optional).
  * Right now the only template is photo-side, but others could be made using the macro workflow explained [later](#macros)
  * Not sure if pubdate is currently being used
  * Story order matters
* Resources can be turned on or off, depending on length needed or new resources - only info (text) and url are needed

#### Jinja2

This project has a fairly complex template structure thanks to the blueprint model. I'll do my best to explain it from the top down.

Starting in the `_blueprint` directory, let's look at `_base.html`. This is the foundation to the whole page. It includes the head info (DFP currently commented out) and creates the blocks used in `index.html`. It also includes `_footer.html` and `_nav.html`. We'll come back to `_macros.html` in a bit. I think the `grunt watch` magic happens in `blueprint.py` but I haven't looked.

Inside `_base.html` we call three important pieces: CSS, JS and the content block.

##### CSS

In `/_scr/sass/` you'll see two files. `leaflet.scss` is all the required styles for Leaflet. `main.scss` imports that file and all of the partials in `_src/sass/partials`. These are broken up into separate topics. (Some of the files, specifically those that mimic Bulldog styles were hard to separate out.)

Main is then compiled into `css/main.css`.

##### JS

Similar to the CSS, there are multiple JS files in `_src/js` that are organized by topic. These compile to `js/scripts.js` and `js/scripts.min.js`.

##### Content block

Where all major page content goes. Has flex div structure. More on that below.

## Page specifics

Ok, let's walk through the page visually and I'll explain different parts. I've broken up the page into different sections that correspond (roughly) to my diagram below.

![img_0455](https://user-images.githubusercontent.com/4853944/27613191-1c1ccdc0-5b4f-11e7-8187-01b554ea5c10.JPG)

### Zeppelin

This is a standard [Zeppelin](https://github.com/registerguard/zeppelin) header. Nothing special. you can find it in `_blueprint/_nav.html`.

### `#header`

This section can be found in `index.html` in the header block.

#### Eclipse map

This is a Leaflet map using [Mapbox](https://www.mapbox.com/) tiles (free RG account with 50k/month views) and data from [NASA](https://eclipse2017.nasa.gov/sites/default/files/interactive_map/index.html) to lay the paths.

If you view source on the [NASA page](https://eclipse2017.nasa.gov/sites/default/files/interactive_map/index.html) you can see the lines are drawn using Google Maps API methods called `GPolyLine()` and `GLatLng()`. Leaflet has [similar](https://gis.stackexchange.com/a/29834) methods called `Polyline()` and `L.LatLng()`. So I copied the data from NASA and used RegEx to convert the Google methods to Leaflet. This can all be found in `_src/js/map.js`.

In this file you can also find fall-back map tiles from Carto and OpenStreetMap if we hit our limit for free Mapbox.

#### Masthead

I stole styles from [Vote](http://vote.registerguard.com) to get this to work. See `_src/sass/partials/_layout.scss` for these styles. For the social sharing button styles see `_src/sass/partials/_button.scss`.

### `#wrapper`

This div holds the main flex div. This content can be found in the content block in `index.html`.

**Note:** The flex divs (left, middle, right) are poorly named and we should call them something. else.

#### `.flex-left`

This contains the introduction text, which is hard coded.

#### `.flex-middle`

This contains stories from our [Google Sheet](https://docs.google.com/spreadsheets/d/14H_FX_HPMMBmT_mEr1NtM8uLOTd_Ij_jFJJ44yCUzhw/edit#gid=1291411480). We chose to use this method instead of a story feed because we want command and control over the order of stories.

##### macros

I structured the code so that we could use different story summary templates for different stories, but CD said photo side was fine for all of them. Given the short timeline here, I'm leaving it at that.

But, if you wanted to add different templates, here's how you would do that:

1. Templates can be controlled via the template column in our sheet.
1. In `index.html`, there is a loop with a conditional that tests for different template values for each row.
1. Inside each conditional you would pass story info into a macro
1. These macros live in `_blueprint/_macros.html`
1. The photo-side styles can be found in `_src/sass/partials/_summary-side.scss`

#### `.flex-right`

This section has two parts: A resource list pulled from our [Google Sheet](https://docs.google.com/spreadsheets/d/14H_FX_HPMMBmT_mEr1NtM8uLOTd_Ij_jFJJ44yCUzhw/edit#gid=1291411480) and a custom Brightcove playlist player.

The resource list is easy, just a basic unordered list looping over the sheet, while testing if it's marked "on" or "off".

The Brightcove player is code-heavy, but is pretty standard. The only thing you might have to change is the data-playlist-id if the playlist changes. There is no targeting set up for these videos, it just runs ROS news/local. If they sell a sponsor we may want to add `&cust_params=rgm_article_id%3Declipse-2017%26rgm_subcat%3Dsolar%2Ceclipse` to the end of the VAST tag.

### Footer

Basic footer, styles can be found in `_src/sass/partials/_bd.scss`.

## DFP

Right now all of the ad code is commented out (except for pre-roll). But, if you uncomment each place, you'll get a leaderboard top below the #masthead, a medium rectangle below the introcution and a leaderboard bottom above the footer.

Targeting is set up for the `solar_eclipse` subcategory and an article id of `eclipse-2017`.

As of right now, no sponsor has been sold.

## Lights

Originally, CD asked for a "high-key" reverse-looking page. With that in mind, I developed the page with two "themes": Lights on and lights off. The lights off theme is sometimes referred to as Eclipse mode.

The key to this whole operation is an ID on the body element. If body#on then the lights are on, if body#off then the lights are off. This leverages styles to swap colors.

The themes can be toggled using the far-right share button with a moon on it.

That button triggers a JavaScript function in `_src/js/lights.js` which does the following psedocode:

* set some variables
* if lights are on:
  * set body#off
  * add background image
  * swap moon icon on button for sun
* else (if lights off):
  * set body#on
  * remove background image
  * swap sun icon on button for moon

The styles related to most everything are in `_src/scss/partials/_lights.scss`.

I tried to do the background image using only CSS but there were significant issues and you can't transition it.

## TODO

* [ ] Write new copy block that can take over after the eclipse happens? Or should a social media feed go in here? Maybe grid of photos from Instagram?
* [ ] Add playlist ID to Tarbell sheet so it can be easily swapped out
* [ ] Fix flex names
* [ ] Add fade to background image
* [ ] ???
