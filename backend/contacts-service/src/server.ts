import app from "./app";
import database from 'ms-commons/data/db';

(async () => {

  try {
    const port = parseInt(`${process.env.PORT}`);

    await database.sync();
    console.log(`[${process.env.DB_NAME}] Database running...`);

    await app.listen(port);
    console.log(`[Contacts] Service running on port ${port}...`);

  } catch (error) {
    console.log(`${error}`);
  }

})();