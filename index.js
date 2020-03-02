const fs = require('fs-extra')
const IS_WINDOWS = /^win/.test(process.platform)

const IPFS = require('ipfs')

function IPFSPlugin (webrun) {
  const { CACHE } = webrun.options
  const { IPFSCACHE = new URL('ipfscache/', CACHE) } = webrun.options

  let ipfs = null

  webrun.addProtocol('ipfs:', async function getIPFSFile (url) {
    const path = url.pathname

    const hash = url.hostname

    const finalURL = `/ipfs/${hash}${path}`

    return getContent(finalURL)
  })

  webrun.addProtocol('ipns:', async function getIPNSFile (url) {
    const ipfs = await loadIPFS()

    const path = url.pathname

    const hostname = url.hostname

    const hash = await ipfs.name.resolve(`ipns/${hostname}`)

    const finalURL = `${hash}${path}`

    return getContent(finalURL)
  })

  webrun.addGlobal('ipfs', getIPFS)

  async function getContent (url) {
    const ipfs = await loadIPFS()

    const result = await ipfs.get(url)

    const { content } = result[0]

    const textContent = content.toString('utf8')

    return textContent
  }

  // TODO: Figure out how to deal with global not being defined in time
  function getIPFS () {
    return ipfs
  }

  async function loadIPFS () {
    if (ipfs) return ipfs

    const repo = urlToPath(IPFSCACHE)

    await fs.ensureDir(repo)

    ipfs = await IPFS.create({
      repo
    })

    return ipfs
  }
}

module.exports = IPFSPlugin

function urlToPath (url) {
  let location = url.pathname
  if (IS_WINDOWS) location = location.slice(1)
  return location
}
