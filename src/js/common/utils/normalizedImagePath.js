export function isCordova () {
  const { cordova } = window;
  return cordova !== undefined;
}

// Webapp image paths are "absolute" relative to the running webapp cwd,
// for Cordova, we need them to include the http path to the server.
// Note: You can point VOTER_FRONT_END_APP_IMAGE_PATH_FOR_CORDOVA to your local webapp if you need
// images that are not yet on the production servers
export default function normalizedImagePath (path) {
  if (isCordova()) {
    // In cordova the root for all relative file paths is the www directory which contains a symlink
    // to the image files in the WebApp source.
    // So for ios it would be /Users/sp/WebstormProjects/WeVoteCordova/platforms/ios/www
    // For example normalizedImagePath needs to transform '../../img/global/svg-icons/avatar-generic.svg' to
    // './img/global/svg-icons/avatar-generic.svg'
    // console.log(`normalizedImagePath incoming: ${path}`);
    const adjustedPath = path.replace(/.*?(\/img\/.*?)/gi, '.$1'); // HACK
    // console.log(`normalizedImagePath return: ${adjustedPath}`);
    return adjustedPath;
  } else {
    return path;
  }
}
