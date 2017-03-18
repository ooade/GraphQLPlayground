module.exports = {
  webpack: config => {
    // Change Default Entry file
    // eslint-disable-next-line
    config.entry.main = [
      './server',
    ];

    return config;
  },
};
