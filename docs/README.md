# Huff documentation

This directory contains the documentation for Huff and the build scripts for the [VuePress](https://vuepress.vuejs.org/) static site generator.

## Run locally

To run the Huff docs site locally by cloning this repo, installing this site's dependencies, and running `npm run dev`.

1. Run the following commands:

```shell
git clone https://github.com/huff-language/huffc
cd huffc/docs
npm install
npm run dev
```

1. Open [localhost:8080](http://localhost:8080) in your browser.

### OpenSSL error

If you get an OpenSSL error from NPM when running `npm run dev`, you may need to export a `NODE_OPTIONS` variable for this session. More information on this error is available in the [webpack/webpack Github repo](https://github.com/webpack/webpack/issues/14532).

1. If you see something like this:

    ```plaintext
    opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
      library: 'digital envelope routines',
      reason: 'unsupported',
      code: 'ERR_OSSL_EVP_UNSUPPORTED'
    ```

1. Run:

    ```shell
    export NODE_OPTIONS=--openssl-legacy-provider
    ```

    This variable will only stay available for _this_ terminal window. You will have to recreate it for new terminal windows.
