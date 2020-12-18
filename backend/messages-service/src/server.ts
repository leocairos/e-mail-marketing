import app from "./app";
import database from 'ms-commons/data/db';

(async () => {

  try {
    const port = parseInt(`${process.env.PORT}`);

    await database.sync();
    console.log(`[${process.env.DB_NAME}] Database running...`);

    await app.listen(port);
    console.log(`[${process.env.MS_NAME}] Running on port ${port}...`);

  } catch (error) {
    console.log(`${error}`);
  }

})();