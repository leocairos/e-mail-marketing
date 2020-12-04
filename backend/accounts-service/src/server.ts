import app from "./app";

const port = parseInt(`${process.env.PORT}`);

app.listen(port, () => {
  console.log(`[Accounts] Micro Service running on port ${port}...`)
});
