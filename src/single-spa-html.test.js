import singleSpaHtml from "./single-spa-html";

describe("single-spa-html", () => {
  const domElementGetter = props =>
    document.getElementById((props && props.id) || "test-div");
  let props;

  beforeEach(() => {
    const div = document.createElement("div");
    div.id = "test-div";
    document.body.appendChild(div);

    props = { name: "test" };
  });

  afterEach(() => {
    document.getElementById("test-div").remove();
  });

  it("adds html to a provided dom element", () => {
    const lifecycles = singleSpaHtml({
      template: "<some-web-component></some-web-component>",
      domElementGetter
    });

    const domEl = domElementGetter();
    expect(domEl.innerHTML.trim()).toBe("");
    return lifecycles
      .bootstrap(props)
      .then(() => lifecycles.mount(props))
      .then(() => {
        expect(domEl.innerHTML.trim()).toBe(
          "<some-web-component></some-web-component>"
        );
        return lifecycles.unmount(props);
      })
      .then(() => {
        expect(domEl.innerHTML.trim()).toBe("");
        return lifecycles.mount(props);
      })
      .then(() => {
        expect(domEl.innerHTML.trim()).toBe(
          "<some-web-component></some-web-component>"
        );
      });
  });

  it("provides props to dom getter", () => {
    const div = document.createElement("div");
    div.id = "props-div";
    document.body.appendChild(div);

    const localProps = {
      ...props,
      id: div.id
    };

    const lifecycles = singleSpaHtml({
      template: "<some-web-component></some-web-component>",
      domElementGetter
    });

    const domEl = domElementGetter(localProps);
    expect(domEl.innerHTML.trim()).toBe("");
    return lifecycles
      .bootstrap(props)
      .then(() => lifecycles.mount(localProps))
      .then(() => {
        expect(domEl.innerHTML.trim()).toBe(
          "<some-web-component></some-web-component>"
        );
        return lifecycles.unmount(localProps);
      })
      .then(() => {
        expect(domEl.innerHTML.trim()).toBe("");
        return lifecycles.mount(localProps);
      })
      .then(() => {
        expect(domEl.innerHTML.trim()).toBe(
          "<some-web-component></some-web-component>"
        );

        document.getElementById(div.id).remove();
      });
  });

  it(`throws if you don't provide a template`, () => {
    expect(() => {
      singleSpaHtml({});
    }).toThrow();
  });

  it(`throws if you provide a non-string template`, () => {
    expect(() => {
      singleSpaHtml({
        template: 123
      });
    }).toThrow();
  });

  it(`throws if you provide a domElementGetter that is not a function`, () => {
    expect(() => {
      singleSpaHtml({
        template: "123",
        domElementGetter: "foo"
      });
    }).toThrow();
  });

  it(`renders function template with custom props`, () => {
    const lifecycles = singleSpaHtml({
      template: props =>
        `<some-web-component name=${props.name}></some-web-component>`,
      domElementGetter
    });

    const domEl = domElementGetter();

    return lifecycles
      .bootstrap(props)
      .then(() => lifecycles.mount(props))
      .then(() => {
        expect(domEl.innerHTML.trim()).toBe(
          `<some-web-component name="test"></some-web-component>`
        );
      });
  });
});
