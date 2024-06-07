const LOG_PREFIX = `Wix-Style-React: [WARNING] `;
let deprecationTestkitLog = (msg: string) => console.warn(`${LOG_PREFIX}${msg}`); // eslint-disable-line

export default deprecationTestkitLog;
