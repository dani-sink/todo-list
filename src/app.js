import { AppController } from "./controller.js";
import { ScreenController } from "./DOM.js";
import "./styles.css";

// Run tests
// import "./manual-tests/manual-tests.js";
// import "./manual-tests/manual-tests-two.js"
// import "./manual-tests/manual-tests-three.js";

(() => {
  const appController = AppController();
  const screenController = ScreenController(appController);

  const projects = appController.getProjects();
  const currentProject = appController.getCurrentProject();

  // Initial render
  screenController.render(projects, currentProject);
})();
