const defaultOpts = {
  template: "",
  domElementGetter: null,
};

export default function singleSpaHtml(opts) {
  if (!opts) {
    throw Error(`single-spa-html must be called with an opts object`);
  }

  opts = { ...defaultOpts, ...opts };

  if (
    (typeof opts.template !== "string" || opts.template.trim().length === 0) &&
    typeof opts.template !== "function"
  ) {
    throw Error(
      `single-spa-html must be passed a 'template' opt that is a non empty string or function`
    );
  }

  if (opts.domElementGetter && typeof opts.domElementGetter !== "function") {
    throw Error(
      `single-spa-html was given 'opts.domElementGetter', but it isn't a function`
    );
  }

  return {
    bootstrap: bootstrap.bind(null, opts),
    mount: mount.bind(null, opts),
    unmount: unmount.bind(null, opts),
  };
}

function bootstrap(opts, props) {
  return Promise.resolve();
}

function mount(opts, props) {
  return Promise.resolve(
    typeof opts.template === "function" ? opts.template(props) : opts.template
  ).then((template) => {
    const domElementGetter = chooseDomElementGetter(opts, props);
    const domEl = domElementGetter(props);
    if (!domEl) {
      throw Error(
        `single-spa-html: domElementGetter did not return a valid dom element`
      );
    }
    domEl.innerHTML = template;
  });
}

function unmount(opts, props) {
  return Promise.resolve().then(() => {
    const domElementGetter = chooseDomElementGetter(opts, props);
    const domEl = domElementGetter(props);
    if (!domEl) {
      throw Error(
        `single-spa-html: domElementGetter did not return a valid dom element`
      );
    }
    domEl.innerHTML = "";
  });
}

function chooseDomElementGetter(opts, props) {
  if (props.domElement) {
    return () => props.domElement;
  } else if (props.domElementGetter) {
    return props.domElementGetter;
  } else if (opts.domElementGetter) {
    return opts.domElementGetter;
  } else {
    return defaultDomElementGetter(props);
  }
}

function defaultDomElementGetter(props) {
  const name = props.appName || props.name;

  if (!name) {
    throw Error(
      `single-spa-html was not given an application name as a prop, so it can't make a unique dom element container for the html application`
    );
  }
  const htmlId = `single-spa-application:${name}`;

  return function defaultDomEl() {
    let domElement = document.getElementById(htmlId);
    if (!domElement) {
      domElement = document.createElement("div");
      domElement.id = htmlId;
      document.body.appendChild(domElement);
    }

    return domElement;
  };
}
