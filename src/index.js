import "./styles.css";
import {routes} from "./Helpers/routes";
import Component from "./Component";
import App from "./components/App";
import Nav from "./components/Nav";

export function navigate(payload) {
  window.history.pushState(payload.state, "", payload.path);
  getPage();
}

function getPage() {
  const path = window.location.pathname;
  const found = routes.filter((route) => {
    return (route.path === path || !route.exact && path.includes(route.path))
  });
  if (found && Array.isArray(found)){
      const componentsArray = found.map(comp => {
        return {create: new Component(comp?.component), mountPoint: comp.mountPoint};
      })
      render(componentsArray);
    }
}

async function render(components) {
  components.forEach(component => {
    let mount = 'content';
    if (component.mountPoint){
      mount = component.mountPoint;
    }
    const target = document.querySelector(`[data-UUID=${mount}]`);
    target.innerHTML = null;
    if (component.create.component){
      new component.create.component(mount, 200);
    }
  })
}

function init() {
  document.getElementById('mount').innerHTML = `
    <div id="header">
        <h1>Nested Functional Component Rendering!</h1>
        <div>
          An experiment to render functions as components in a nested fashion.
          Components are rendered asynchronously to allow for the returned html to rely on computed data!
          <strong>(No JSX needed)</strong>
        </div>
        <h3>Render:</h3>
    </div>
        <div data-UUID="static" ></div>
    <div data-UUID="content" id="app"></div>
    `;

  render([{mountPoint: 'static', create: new Component(Nav, false)}])

  function route() {
    function listen() {
      const mount = new Promise(async function (myResolve) {
        window.addEventListener("popstate", () => {
          getPage();
        });
        myResolve();
      });
      return mount;
    }

    listen().then(() => {
      getPage();
    });
  }


  route();
}

init();
