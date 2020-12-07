import app from "./app";
import database from './db';

(async () => {

  try {
    const port = parseInt(`${process.env.PORT}`);

    await database.sync();
    console.log(`[${process.env.DB_NAME}] Database running...`);

    await app.listen(port);
    console.log(`[Accounts] Service running on port ${port}...`);

  } catch (error) {
    console.log(`${error}`);
  }

})();