import server from "./src/app.js";
import { sequelize } from "./src/db.js";

// Syncing all the models at once.
sequelize.sync({ force: false }).then(() => {
  server.listen(process.env.PORT || 3001, () => {
    console.log("%s listening at 3001"); // eslint-disable-line no-console
  });
});
