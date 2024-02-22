## React PWA App

Progressive Web Apps (PWAs) are web application built and enhanced with modern APIs to deliver enhanced capabilities, reliability, and installability while reaching anyone, anywhere, on any device, all with a single codebase.

Once deployed, This PWA game can be installed on user's device and will work similar to native desktop or mobile application.

![Desktop version](public/desktop-app-screenshot.png)

## Instructions

### How to generate icon assets

1. To generate image icon assets, first replace `public/logo.svg` with your own logo image. You can also change `pwa-assets.config.ts` to use logo with different name or path.
2. Then run `pnpm run generate-pwa-assets` to generate the assets

## Known issues

1. Bun runtime might fail while running generate assets script as their is an [open issue](https://github.com/vite-pwa/assets-generator/issues/38) with [@vite-pwa/assets-generator](https://github.com/vite-pwa/assets-generator)

## Resources

Use [Asset Generator](https://www.pwabuilder.com/imageGenerator) to generate assets for your PWA app

Use [Favicon Generator](https://favicon.inbrowser.app/tools/favicon-generator) to generate Favicon

Follow [PWA Configuration Guide](https://vite-pwa-org.netlify.app/guide/) to tune your PWA app configuration.
