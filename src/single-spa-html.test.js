import singleSpaHtml from "./single-spa-html";

describe("single-spa-html", () => {
  const domElementGetter = () => document.getElementById("test-div");
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
        template: 123
      });
    }).toThrow();
  });
});
