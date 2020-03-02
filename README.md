# webrun-plugin-ipfs
A plugin for webrun that enables loading content from `ipfs://` URLs

### How to use

```bash
# Install webrun
npm i -g webrun

# Install IPFS plugin
npm i -g webrun-plugin-ipfs

# Load a script off of IPFS
webrun ipfs://examplehash/whatever.js

# Load a script by resolving an IPNS link
webrun ipns://examplehash/whatever.js
```

By default, the IPFS plugin will only initialize if you load a script off of it.
To have it load before any scripts run, set the `WEBRUN_PLUGIN_IPFS_AUTOLOAD` environment variable or command line argument to `true`.
